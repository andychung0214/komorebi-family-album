const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs/promises');
const { existsSync } = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname,'..');
const chromium = process.env.ALBUM_BROWSER || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
].find(existsSync);
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css','.webp':'image/webp','.svg':'image/svg+xml'};
const wait = ms => new Promise(resolve => setTimeout(resolve,ms));
const prefix = '/komorebi-family-album/';
const errors = [];
let connection, browser, server, profile;

async function until(check, label) {
  for (let i=0; i<80; i++) {
    const result = await check();
    if (result) return result;
    await wait(65);
  }
  throw new Error('Timed out: ' + label);
}

async function setup() {
  if(!chromium)throw new Error('Set ALBUM_BROWSER to a Chromium browser executable.');
  profile=await fs.mkdtemp(path.join(os.tmpdir(),'komorebi-browser-'));
  server=http.createServer(async (req,res)=>{
    try {
      if(!req.url.startsWith(prefix)) throw new Error('Invalid site path');
      const url=new URL(req.url,'http://localhost/');
      const file=path.resolve(root,decodeURIComponent(url.pathname.slice(prefix.length)));
      if(!file.startsWith(root+path.sep)||!types[path.extname(file)]) throw new Error('Invalid asset');
      const data=await fs.readFile(file);
      res.writeHead(200, {'Content-Type':types[path.extname(file)]});
      res.end(data);
    } catch { res.writeHead(404); res.end(); }
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  browser=spawn(chromium,['--headless=new','--disable-gpu','--no-first-run','--disable-background-networking','--remote-debugging-port=0','--user-data-dir='+profile,'about:blank'],{stdio:'ignore',windowsHide:true});
  browser.on('error',error=>errors.push(error.message));
  const port=await until(async()=>{
    try{return (await fs.readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0];}catch{return false;}
  },'Chromium debugging port');
  const [tab]=await (await fetch('http://127.0.0.1:'+port+'/json/list')).json();
  connection=new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{connection.onopen=resolve;connection.onerror=reject;});
  let seq=0;
  const pending=new Map();
  connection.onmessage=event=>{
    const msg=JSON.parse(event.data);
    if(msg.id&&pending.has(msg.id)){
      const {resolve,reject}=pending.get(msg.id);
      pending.delete(msg.id);
      if(msg.error)reject(new Error(msg.error.message));
      else resolve(msg.result);
    }
    if(msg.method==='Runtime.exceptionThrown')errors.push(msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text);
  };
  const send=(method,params={})=>new Promise((resolve,reject)=>{
    pending.set(++seq,{resolve,reject});
    connection.send(JSON.stringify({id:seq,method,params}));
  });
  await send('Runtime.enable');
  await send('Page.enable');
  return send;
}

async function run() {
  const send=await setup();
  const base='http://127.0.0.1:'+server.address().port+prefix;
  const evaluate=async expression=>{
    const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if(result.exceptionDetails)throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  };
  const navigate=async (file, host=base)=>{
    const url=host+file;
    const result=await send('Page.navigate',{url});
    assert.equal(result.errorText,undefined);
    try {
      await until(()=>evaluate('location.href === new URL('+JSON.stringify(url)+').href && document.readyState === "complete" && !!document.querySelector("h1")').catch(()=>false),url);
    } catch(error) {
      console.error(await evaluate('({url:location.href,state:document.readyState,heading:document.querySelector("h1")?.textContent})'),errors);
      throw error;
    }
  };
  const click=selector=>evaluate('document.querySelector('+JSON.stringify(selector)+').click()');
  const set=(selector,value)=>evaluate(`{const el=document.querySelector(${JSON.stringify(selector)});el.value=${JSON.stringify(value)};el.dispatchEvent(new Event('change',{bubbles:true}));}`);
  const count=selector=>evaluate('document.querySelectorAll('+JSON.stringify(selector)+').length');
  async function key(name) {
    const codes={ArrowRight:39,Escape:27,Tab:9};
    await send('Input.dispatchKeyEvent',{type:'rawKeyDown',key:name,code:name,windowsVirtualKeyCode:codes[name]});
    await send('Input.dispatchKeyEvent',{type:'keyUp',key:name,code:name,windowsVirtualKeyCode:codes[name]});
  }
  const fileBase=pathToFileURL(root+path.sep).href;
  for(const file of ['index.html','albums.html','album.html?id=sunday','gallery.html','memories.html','memories/sunday.html','timeline.html','calendar.html','milestones.html','favorites.html','photobook.html','children.html','children.html?id=haru','children.html?id=yui','about.html','settings.html','404.html','album.html?id=invalid']) {
    await navigate(file,fileBase);
  }
  console.log('file://: 18 entries rendered');
  for(const width of [360,375,430,768,1024,1440,1920]) {
    await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
    for(const file of ['index.html','gallery.html','timeline.html','calendar.html','photobook.html']) {
      await navigate(file);
      assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'),true,file+' @ '+width);
    }
    console.log('Responsive: 5 pages at '+width+' px');
  }
  if(process.env.ALBUM_SCREENSHOT_DIR){
    await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
    await navigate('index.html');
    const {data}=await send('Page.captureScreenshot',{format:'png'});
    await fs.writeFile(path.join(process.env.ALBUM_SCREENSHOT_DIR,'komorebi-desktop.png'),Buffer.from(data,'base64'));
  }
  await send('Emulation.setDeviceMetricsOverride',{width:375,height:812,deviceScaleFactor:1,mobile:true});
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await navigate('index.html');
  assert.equal(await evaluate('document.querySelector(".hero-photo img").naturalWidth > 0'),true);
  assert.equal(await evaluate('document.querySelector("[data-carousel-pause]").textContent'),'啟用自動播放');
  if(process.env.ALBUM_SCREENSHOT_DIR) {
    const {data}=await send('Page.captureScreenshot',{format:'png'});
    await fs.writeFile(path.join(process.env.ALBUM_SCREENSHOT_DIR,'komorebi-mobile.png'),Buffer.from(data,'base64'));
  }
  await click('[data-menu]');
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".main-nav")).display'),'grid');
  await key('Escape');
  assert.equal(await evaluate('document.querySelector("[data-menu]").getAttribute("aria-expanded")'),'false');
  await click('[data-step="1"]');
  assert.equal(await evaluate("document.querySelector('[data-slide=\"1\"]').getAttribute('aria-current')"),'true');
  await navigate('gallery.html');
  assert.equal(await count('.photo-card'),12);
  await click('[data-load-more]');
  assert.equal(await count('.photo-card'),24);
  await set('[name=layout]','masonry');
  assert.equal(await count('.photo-wall.masonry'),1);
  await set('[name=layout]','featured');
  assert.equal(await count('.photo-wall.featured'),1);
  await set('[name=layout]','chronological');
  assert.ok(await count('.day-heading'));
  await set('[name=q]','野餐');
  assert.match(await evaluate('document.querySelector("#results-count").textContent'),/^\d+ 筆結果$/);
  assert.equal(await evaluate('[...document.querySelectorAll(".photo-card .subtle")].some(a=>a.textContent==="草地上的星期天")'),true);
  assert.ok(await count('.photo-card') < 12);
  await click('[data-open-photo]');
  assert.equal(await count('dialog[open]'),1);
  assert.equal(await evaluate('document.activeElement.hasAttribute("data-close")'),true);
  for(let i=0;i<12;i++) {
    await key('Tab');
    assert.equal(await evaluate('document.activeElement.closest("dialog") !== null'),true);
  }
  const position=()=>evaluate('document.querySelector("[data-position]").textContent');
  const first=await position();
  await evaluate('document.querySelector("[data-close]").focus()');
  await key('ArrowRight');
  assert.notEqual(await position(),first);
  const second=await position();
  const {x,y}=await evaluate('(() => {const r=document.querySelector("[data-large-image]").getBoundingClientRect();return {x:r.x+r.width*.75,y:r.y+r.height*.5};})()');
  await send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
  for(const [type,touchPoints] of [['touchStart',[{x,y}]],['touchMove',[{x:x-90,y}]],['touchEnd',[]]]) await send('Input.dispatchTouchEvent',{type,touchPoints});
  assert.notEqual(await position(),second);
  await set('[data-speed]','3000');
  await click('[data-play]');
  const before=await position();
  await until(async()=>await position()!==before,'slideshow advances');
  await click('[data-play]');
  const finalPosition=await position();
  await wait(3200);
  assert.equal(await position(),finalPosition);
  await click('.lightbox-caption [data-favorite]');
  await key('Escape');
  await until(async()=>await count('dialog[open]')===0,'Escape closes dialog');
  assert.equal(await evaluate('document.activeElement.hasAttribute("data-open-photo")'),true);
  await navigate('favorites.html');
  assert.equal(await count('.photo-card'),1);
  await set('[name^="photo:"]','yearly');
  await navigate('favorites.html');
  assert.equal(await evaluate('document.querySelector(\'[name^="photo:"]\').value'),'yearly');
  await navigate('settings.html');
  await set('main [data-theme-select]','night');
  await navigate('index.html');
  assert.equal(await evaluate('document.documentElement.dataset.theme'),'night');
  console.log('Mobile menu, carousel, photo layouts, paging, search, keyboard, touch, autoplay, favorites and theme verified');
  await navigate('calendar.html');
  await click('[data-day="2026-11-15"]');
  assert.ok(await count('#day-wall .photo-card'));
  await click('[data-month-step="-1"]');
  assert.equal(await evaluate('document.querySelector("#cal-caption").textContent'),'2026 年 10 月');
  await navigate('timeline.html?child=yui');
  assert.ok(await count('.time-card'));
  assert.equal(await evaluate('[...document.querySelectorAll(".time-card .meta")].every(e=>e.textContent.includes("小柚"))'),true);
  await set('[name=stage]','six-plus');
  assert.equal(await count('.time-card'),0);
  await navigate('memories/sunday.html');
  assert.equal(await count('.story-text p'),2);
  await set('[name=message]','<p>本機測試</p>');
  await click('.comment-form button');
  await navigate('memories/sunday.html');
  assert.equal(await evaluate('document.querySelector(".comment").textContent'),'<p>本機測試</p>');
  assert.equal(await count('.comment p'),0);
  await click('[data-reaction="☺"]');
  await navigate('memories/sunday.html');
  assert.equal(await evaluate('document.querySelector(\'[data-reaction="☺"]\').getAttribute("aria-pressed")'),'true');
  await navigate('photobook.html?id=six');
  await set('[name=book-layout]','four');
  await click('[data-book-step="1"]');
  assert.equal(await count('#screen-book .book-contents'),1);
  await click('[data-book-step="1"]');
  assert.equal(await count('#screen-book .book-spread.four img'),4);
  await evaluate('window.dispatchEvent(new Event("beforeprint"))');
  await evaluate('Promise.all([...document.querySelectorAll("#print-book img")].map(img=>img.decode()))');
  const pdf=await send('Page.printToPDF',{preferCSSPageSize:true,printBackground:true});
  const pdfContent=Buffer.from(pdf.data,'base64').toString('latin1');
  assert.equal(pdfContent.slice(0,4),'%PDF');
  assert.equal(pdfContent.match(/\/Type\s*\/Page\b/g)?.length,5);
  assert.equal(await count('#print-book .book-sheet'),0);
  console.log('Calendar, timeline, story, local comments, reactions and A4 PDF rendering verified');
  assert.deepEqual(errors,[]);
}

run().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{
  connection?.close();
  browser?.kill();
  server?.close();
  if(profile && path.dirname(profile)===path.resolve(os.tmpdir()) && path.basename(profile).startsWith('komorebi-browser-')){
    await fs.rm(profile,{recursive:true,force:true,maxRetries:4,retryDelay:200}).catch(()=>{});
  }
});
