(() => {
  const app = globalThis.Komorebi;
  const ui = app.ui;
  const g = app.gallery;
  const {main, heading, sectionHead, icon, action, url, link, when, picture, esc, empty, names, albumCard, storyCard, childCard, heart, select, recent} = ui;
  const {demo, age, sorted, storage} = app.core;
  const pages = {};
  const grid = (items, render, cls='') => items.length ? `<div class="cards ${cls}">${items.map(render).join('')}</div>` : empty();
  const more = (href, text) => `<a class="more-link" href="${url(href)}">${text} ${icon('arrow')}</a>`;
  const cover = (item, type, date) => `<div class="detail-hero">
    <div>${heading(type==='album'?'PHOTO ALBUM':'FAMILY JOURNAL',esc(item.title))}<p class="meta">${when(date)} · ${names(item.childIds)}${type==='album'?` · ${item.photoIds.length} 張照片`:''}</p><p>${esc(item.description || item.subtitle)}</p><div class="tag-row">${item.tags.map(t=>`<a href="${url('gallery.html?tag='+encodeURIComponent(t))}">${esc(t)}</a>`).join('')}</div>${heart(type,item.id)}</div>
    <figure>${picture(item.coverImage,'回憶的公開攝影示意',{large:true,eager:true})}<figcaption>公開攝影示意</figcaption></figure></div>`;
  const wrong = () => {main.innerHTML=`<div class="wrap">${heading('404','這一頁不在相簿裡','可以回首頁，從另一段回憶開始。')}${action('index.html','返回首頁','primary')}</div>`;};
  const books = () => `<aside class="book-teaser"><div>${icon('book')}<h2>把日子翻成一本書</h2><p>選一本相簿，排好照片，留下自己的封面。</p></div>${action('photobook.html','預覽相簿書 '+icon('arrow'),'outline')}</aside>`;
  function recentCards() {
    const list=storage.get('recent',[]);
    const cards=Array.isArray(list) ? list.filter(key=>typeof key==='string').map(key=>{
      const [type,id]=key.split(':');
      const item=type==='album' ? g.albumById.get(id) : app.memories.find(m=>m.id===id);
      return item ? (type==='album' ? albumCard(item) : storyCard(item)) : '';
    }).filter(Boolean) : [];
    return cards.length ? `<section>${sectionHead('RECENTLY VIEWED','最近翻閱')}<div class="cards">${cards.slice(0,3).join('')}</div></section>` : '';
  }
  function carousel(items) {
    const node=main.querySelector('#featured-carousel');
    if (!items.length) {node.innerHTML=empty(); return;}
    let index=0,timer,x,paused=false,over=false,focused=false,active=true;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    node.innerHTML=`<div class="feature-slide"></div><div class="carousel-controls">
      <button type="button" class="icon-button" data-step="-1" aria-label="上一則">${icon('left')}</button>
      <div class="dots">${items.map((_,i)=>`<button type="button" data-slide="${i}" aria-label="第 ${i+1} 則"></button>`).join('')}</div>
      <button type="button" class="icon-button" data-step="1" aria-label="下一則">${icon('right')}</button>
      <button type="button" class="text-button" data-carousel-pause></button></div>`;
    const slide=node.querySelector('.feature-slide');
    const pause=node.querySelector('[data-carousel-pause]');
    function draw() {
      const s=items[index];
      const focused = document.activeElement;
      const linkIndex = [...slide.querySelectorAll('a')].indexOf(focused);
      slide.innerHTML=`<a href="${url(link.story(s))}" aria-label="閱讀：${esc(s.title)}">${picture(s.coverImage,'公開回憶示意',{large:true})}</a>
        <div><p class="meta">${when(s.date)} · ${names(s.childIds)} · ${app.categories[s.categoryIds[0]]}</p><h3>${esc(s.title)}</h3><p>${esc(s.summary)}</p>${more(link.story(s),'讀這段故事')}</div>`;
      node.querySelectorAll('[data-slide]').forEach(b=>b.setAttribute('aria-current',String(Number(b.dataset.slide)===index)));
      if (linkIndex >= 0) slide.querySelectorAll('a')[linkIndex]?.focus();
    }
    function step(amount) {index=(index+amount+items.length)%items.length; draw();}
    function sync() {
      clearInterval(timer);
      const shouldPlay=active && !paused && !over && !focused && !document.hidden;
      slide.setAttribute('aria-live',shouldPlay?'off':'polite');
      pause.textContent=active && !paused?'暫停自動播放':'啟用自動播放';
      if (shouldPlay) timer=setInterval(()=>step(1),6500);
    }
    node.onclick=e=>{
      const b=e.target.closest('button');
      if (!b) return;
      if (b.hasAttribute('data-carousel-pause')) { if (!active) { active=true; paused=false; } else paused=!paused; }
      if (b.dataset.step) step(Number(b.dataset.step));
      if (b.dataset.slide!==undefined) {index=Number(b.dataset.slide);draw();}
      sync();
    };
    node.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();step(e.key==='ArrowLeft'?-1:1);sync();}});
    node.addEventListener('mouseenter',()=>{over=true;sync();});
    node.addEventListener('mouseleave',()=>{over=false;sync();});
    node.addEventListener('focusin',()=>{focused=true;sync();});
    node.addEventListener('focusout',e=>{if(!node.contains(e.relatedTarget)){focused=false;sync();}});
    node.addEventListener('touchstart',e=>{x=e.changedTouches[0].clientX;},{passive:true});
    node.addEventListener('touchend',e=>{if(Math.abs(e.changedTouches[0].clientX-x)>50){step(e.changedTouches[0].clientX<x?1:-1);sync();}},{passive:true});
    document.addEventListener('visibilitychange',sync);
    reduced.addEventListener('change',()=>{active=!reduced.matches;sync();});
    active=!reduced.matches;
    draw(); sync();
  }
  pages.index = () => {
    const latest=sorted(app.photos).slice(0,4);
    const month=demo.slice(0,7);
    const older=sorted(app.photos.filter(p=>p.capturedAt.slice(0,4)<demo.slice(0,4)&&p.capturedAt.slice(5,7)===demo.slice(5,7)));
    main.innerHTML=`<div class="wrap home">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-copy"><span class="eyebrow"><span class="sprig" aria-hidden="true">✳</span> A FAMILY PHOTO JOURNAL</span>
        <h1 id="hero-title">把小小日子，<br> <em>留久一點。</em></h1>
        <p>小晴與小柚的成長相簿。<br>有散步、午睡，也有一起長大的每一天。</p>
        <div class="hero-actions">${action('albums.html','翻開相簿 '+icon('arrow'),'primary')}${action('timeline.html','成長時間軸','outline')}</div></div>
        <figure class="hero-photo">${picture('family','家人牽手走過草地的公開攝影示意',{large:true,eager:true})}
          <figcaption><span>散步去，趁陽光正好。</span><span>公開攝影示意</span></figcaption></figure>
        <div class="hero-stamp" aria-hidden="true"><span>こもれび</span><i></i><small>日々の記録</small></div>
      </section>
      <section class="intro-children">${sectionHead('MEET THE LITTLE ONES','我們家的兩個小人兒',more('children.html','雙寶小檔案'))}
      <div class="child-grid">${app.children.map(childCard).join('')}</div></section>
      <section class="album-shelf">${sectionHead('ON THE SHELF','精選相簿',more('albums.html','所有相簿'))}
      ${grid(app.albums.filter(a=>a.featured),albumCard,'four')}</section>
      <section>${sectionHead('FAMILY JOURNAL','精選回憶',more('memories.html','所有生活故事'))}<div id="featured-carousel" aria-label="精選回憶輪播"></div></section>
      <section>${sectionHead('CAMERA ROLL','最新照片',more('gallery.html','開啟照片牆'))}<div id="latest"></div></section>
      <section>${sectionHead('GROWING TOGETHER','成長精選',more('milestones.html','所有里程碑'))}
      <div class="compact-grid">${sorted(app.milestones.filter(x=>x.featured)).slice(0,3).map(x=>`<a href="${url('milestones.html#'+x.id)}"><span class="meta">${when(x.date)} · ${names(x.childIds)}</span><h3>${esc(x.title)}</h3><p>${esc(x.description)}</p></a>`).join('')}</div></section>
      <section class="recall-grid"><div>${sectionHead('THIS MONTH',Number(month.slice(5))+' 月的回憶')}
      <p>${app.photos.filter(p=>p.capturedAt.startsWith(month)).length} 張照片 · ${app.memories.filter(p=>p.date.startsWith(month)).length} 篇故事</p>${more('calendar.html','翻本月日曆')}</div>
      <div>${sectionHead('LOOKING BACK','過去的這個月')}
      ${older.length?`<p>${esc(older[0].title)} · ${when(older[0].capturedAt)}</p>${more(link.album(older[0].albumIds[0]),'再看一次')}`:empty('過去的這個月還沒有回憶。')}</div></section>
      ${recentCards()}${books()}</div>`;
    g.wall(main.querySelector('#latest'),latest,{toolbar:false});
    carousel(app.memories.filter(s=>s.featured));
  };
  pages.albums = () => {
    main.innerHTML=`<div class="wrap">${heading('THE ALBUM SHELF','所有相簿','從第一場午睡，到出門探險的星期天。')}
      <div class="wall-tools">${action('gallery.html','照片牆與搜尋 '+icon('arrow'),'outline')}${select('album-layout','相簿版面',{grid:'方格',list:'清單'},'','grid')}</div>
      ${g.filterForm({album:true})}<div id="album-results" aria-live="polite"></div></div>`;
    const layout=main.querySelector('[name=album-layout]');
    let current = [];
    const draw = () => {main.querySelector('#album-results').innerHTML=`<p class="meta result-count">${current.length} 本相簿</p>`+grid(current,albumCard,layout.value==='list'?'list':'');};
    layout.onchange=draw;
    g.bindFilters(main.querySelector('form'),f=>{current=sorted(app.albums.filter(a=>g.matchesSaved('album',a,f)),f.order);draw();});
  };
  pages.album = () => {
    const a=g.albumById.get(g.query.get('id'));
    if (!a) return wrong();
    recent('album',a.id);
    const related=app.memories.filter(m=>m.albumIds.includes(a.id));
    main.innerHTML=`<div class="wrap"><a class="breadcrumb" href="${url('albums.html')}">← 所有相簿</a>${cover(a,'album',a.startDate)}
      <section>${sectionHead('PHOTO GALLERY','相簿照片')}${g.filterForm({onlyPhotos:true})}<div id="album-wall"></div></section>
      <section>${sectionHead('JOURNAL','這本相簿的故事')}${grid(related,storyCard)}</section>
      ${action('photobook.html?id='+encodeURIComponent(a.id),'排成一本相簿書 '+icon('arrow'),'outline')}</div>`;
    g.bindFilters(main.querySelector('form'),f=>g.wall(main.querySelector('#album-wall'),sorted(g.resolve(a.photoIds).filter(p=>g.matchesSaved('photo',p,f)),f.order)));
  };
  pages.gallery = () => {
    main.innerHTML=`<div class="wrap">${heading('THE CAMERA ROLL','照片牆與搜尋','找一張照片、一篇故事，或某個值得記住的日子。')}
      ${g.filterForm()}<p id="results-count" class="meta result-count" role="status"></p><div id="search-results"></div></div>`;
    const results=main.querySelector('#search-results');
    g.bindFilters(main.querySelector('form'),f=>{
      const pick=(type,items)=>f.kind && f.kind!==type ? [] : sorted(items.filter(p=>g.matchesSaved(type,p,f)),f.order);
      const photos=pick('photo',app.photos),albums=pick('album',app.albums),stories=pick('story',app.memories),events=pick('milestone',app.milestones);
      const total=photos.length+albums.length+stories.length+events.length;
      main.querySelector('#results-count').textContent=`${total} 筆結果`;
      results.innerHTML=`${photos.length?'<section><h2>照片</h2><div id="search-wall"></div></section>':''}
        ${albums.length?`<section><h2>相簿</h2>${grid(albums,albumCard)}</section>`:''}
        ${stories.length?`<section><h2>生活故事</h2>${grid(stories,storyCard)}</section>`:''}
        ${events.length?`<section><h2>成長里程碑</h2><div class="compact-grid">${events.map(e=>`<a href="${url('milestones.html#'+e.id)}"><span class="meta">${when(e.date)} · ${names(e.childIds)}</span><h3>${esc(e.title)}</h3></a>`).join('')}</div></section>`:''}
        ${total?'':empty(f.from && f.to && f.from>f.to?'起始日期需早於結束日期。':undefined)}`;
      if(photos.length) g.wall(results.querySelector('#search-wall'),photos);
    });
  };
  pages.memories = () => {
    main.innerHTML=`<div class="wrap">${heading('FAMILY JOURNAL','生活故事','有些日子，適合寫在照片的旁邊。')}${g.filterForm({album:true})}<div id="journal-results"></div>${recentCards()}</div>`;
    g.bindFilters(main.querySelector('form'),f=>{main.querySelector('#journal-results').innerHTML=grid(sorted(app.memories.filter(s=>g.matchesSaved('story',s,f)),f.order),storyCard);});
  };
  pages.memory = () => {
    const text=main.querySelector('#story-text');
    const s=app.memories.find(item=>item.id===text?.dataset.id);
    if (!s) return wrong();
    recent('story',s.id);
    const commentKey='comments:'+s.id;
    const reactionKey='reaction:'+s.id;
    main.innerHTML=`<div class="wrap"><a class="breadcrumb" href="${url('memories.html')}">← 生活故事</a>${cover(s,'story',s.date)}
      <div id="story-body"></div><div class="wall-tools"><button type="button" class="button outline" data-share>分享故事</button></div>
      <section>${sectionHead('PHOTO NOTES','故事裡的照片')}<div id="story-wall"></div></section>
      <section>${sectionHead('RELATED ALBUMS','相關相簿')}${grid(s.albumIds.map(id=>g.albumById.get(id)).filter(Boolean),albumCard)}</section>
      <section class="local-notes"><h2>在這一頁留個記號</h2><p>本機示範留言，只會儲存在這個瀏覽器。</p>
        <div class="wall-tools reactions">${['♡','☺','👏'].map((emoji,i)=>`<button type="button" class="button outline" data-reaction="${emoji}" aria-pressed="false" aria-label="${['喜歡','微笑','拍手'][i]}">${emoji}</button>`).join('')}</div>
        <div id="comments" aria-live="polite"></div>
        <form class="comment-form"><label class="field"><span>本機留言</span><textarea name="message" maxlength="280" required rows="3"></textarea></label><button class="button primary">儲存留言</button></form></section></div>`;
    main.querySelector('#story-body').append(text);
    g.wall(main.querySelector('#story-wall'),g.resolve(s.photoIds),{toolbar:false});
    const response=()=>{const stored=storage.get(reactionKey,'');main.querySelectorAll('[data-reaction]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.reaction===stored)));};
    response();
    main.querySelector('.reactions').onclick=e=>{
      const value=e.target.closest('[data-reaction]')?.dataset.reaction;
      if(value) {storage.set(reactionKey,storage.get(reactionKey,'')===value?'':value);response();}
    };
    const comments=()=>{const data=storage.get(commentKey,[]);return Array.isArray(data)?data:[];};
    const draw=()=>{main.querySelector('#comments').innerHTML=comments().map(value=>`<p class="comment">${esc(value)}</p>`).join('');};
    draw();
    main.querySelector('form').onsubmit=e=>{
      e.preventDefault();
      const value=e.target.elements.message.value.trim();
      if(!value)return;
      const saved=storage.set(commentKey,[...comments(),value].slice(-20));
      draw();
      e.target.reset();
      ui.toast(saved?'已儲存本機留言':'留言僅保留於本次瀏覽');
    };
    main.querySelector('[data-share]').onclick=async()=>{
      if(location.protocol==='file:') { ui.toast('網站發布後即可分享故事連結'); return; }
      try {
        if(navigator.share) await navigator.share({title:s.title,url:location.href});
        else {await navigator.clipboard.writeText(location.href);ui.toast('已複製故事連結');}
      } catch(error) {if(error.name!=='AbortError') ui.toast('請從網址列複製故事連結');}
    };
  };
  pages.children=()=>{
    const id=g.query.get('id');
    const c=app.children.find(item=>item.id===id);
    if(id&&!c)return wrong();
    if(!c){
      main.innerHTML=`<div class="wrap">${heading('MEET THE LITTLE ONES','雙寶小檔案','這裡的兩個小人兒都是虛構角色。')}
        <div class="child-grid">${app.children.map(childCard).join('')}</div>
        <section>${sectionHead('SIDE BY SIDE','一起長大的時光',more('gallery.html?child=both','兄妹共同照片'))}
        ${grid(app.albums.filter(a=>app.core.matches(a,{child:'both'})),albumCard)}</section></div>`;
      return;
    }
    const belongs=item=>item.childIds.includes(c.id);
    main.innerHTML=`<div class="wrap"><a class="breadcrumb" href="${url('children.html')}">← 雙寶小檔案</a>
      <div class="detail-hero"><div><img class="avatar" src="${url('assets/images/'+c.avatar+'.svg')}" alt="" width="80" height="80">
      ${heading(esc(c.role)+' · '+age(c.birthDate),esc(c.nickname),esc(c.description))}
      <p>示範出生日期 ${when(c.birthDate)}</p><div class="tag-row">${c.interests.map(x=>`<span>${esc(x)}</span>`).join('')}</div>
      <div class="wall-tools">${action('timeline.html?child='+c.id,'成長時間軸','primary')}${action('gallery.html?child='+c.id,'瀏覽照片','outline')}</div></div>
      <figure>${picture(c.coverImage,'公開攝影示意',{large:true,eager:true})}<figcaption>公開攝影示意・非角色肖像</figcaption></figure></div>
      <section>${sectionHead('ALBUMS','相關相簿')}${grid(app.albums.filter(belongs),albumCard)}</section>
      <section>${sectionHead('JOURNAL','相關故事')}${grid(app.memories.filter(belongs),storyCard)}</section></div>`;
  };
  pages.favorites=()=>{
    main.innerHTML=`<div class="wrap">${heading('KEPT CLOSE','我的收藏','收藏儲存在這個瀏覽器。')}<div id="saved"></div>${recentCards()}</div>`;
    const pane=main.querySelector('#saved');
    function draw(){
      const state=ui.favorites();
      const p=app.photos.filter(x=>ui.isFavorite('photo',x.id)),a=app.albums.filter(x=>ui.isFavorite('album',x.id)),s=app.memories.filter(x=>ui.isFavorite('story',x.id));
      pane.innerHTML=`<p class="meta">${p.length+a.length+s.length} 筆收藏</p>
      ${p.length?'<section><h2>照片</h2><div id="saved-wall"></div></section>':''}
      ${a.length?`<section><h2>相簿</h2>${grid(a,albumCard)}</section>`:''}
      ${s.length?`<section><h2>故事</h2>${grid(s,storyCard)}</section>`:''}
      ${p.length?`<section><h2>標記精選照片</h2><div class="compact-grid">${p.map(x=>select('photo:'+x.id,esc(x.title),{monthly:'本月最愛',yearly:'年度精選',archive:'家庭珍藏'},'未分類',state['photo:'+x.id]?.highlight)).join('')}</div></section>`:''}
      ${p.length+a.length+s.length?'':empty('還沒有收藏。點選照片、相簿或故事旁的愛心即可儲存。')}`;
      if(p.length) g.wall(pane.querySelector('#saved-wall'),p);
    }
    pane.onchange=e=>{
      const key=e.target.name;
      if(!key?.startsWith('photo:')) return;
      const state={...ui.favorites()};
      if(state[key]) {state[key]={...state[key],highlight:e.target.value};storage.set('favorites',state);}
    };
    document.addEventListener('komorebi:favorite',()=>{const focused=pane.contains(document.activeElement);draw(); if(focused)(pane.querySelector('button, a, select')||main).focus();});
    draw();
  };
  pages.about=()=>{
    main.innerHTML=`<div class="wrap">${heading('ABOUT KOMOREBI','關於木漏日小日子','一本用來練習把家庭回憶好好收起來的日系相簿。')}
    <div class="reading"><h2>示範資料與攝影</h2><p>小晴與小柚、人物資料、故事與事件皆為虛構。相簿使用公開攝影示意，照片中的人物與故事角色無關。</p>
    <h2>公開網站與本機設定</h2><p>任何取得公開網站網址的人都能檢視網站素材。個人收藏、主題與互動儲存在目前瀏覽器。正式私人相簿需要獨立的登入與媒體權限。</p>
    <p>${more('docs/IMAGE-SOURCES.md','查看照片來源')}${more('docs/FUTURE-BACKEND.md','私人相簿架構')}</p></div></div>`;
  };
  pages.settings=()=>{
    main.innerHTML=`<div class="wrap">${heading('MAKE IT YOURS','個人化設定','選擇閱讀時喜歡的紙色與光線。')}
    <div class="reading"><label class="field"><span>閱讀主題</span><select data-theme-select>${Object.entries(ui.themes).map(([k,v])=>ui.option(k,v,document.documentElement.dataset.theme)).join('')}</select></label>
    <h2>示範相簿資訊</h2><p>展示基準日期 ${when(demo)}。偏好、收藏、最近翻閱及示範留言保留在瀏覽器。公開版本可由任何訪客閱覽。</p></div></div>`;
  };
  pages['404']=wrong;
  app.pages=pages;
})();
