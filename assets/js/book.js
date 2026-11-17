(() => {
  const app=globalThis.Komorebi;
  const {main, heading, select, esc, picture, icon, empty} = app.ui;
  const g=app.gallery;
  const layouts={single:'單張大圖',double:'雙張照片',four:'四宮格',editorial:'圖文混排',bleed:'滿版照片'};
  const albumOptions=Object.fromEntries(app.albums.map(a=>[a.id,a.title]));
  const sizes={single:1,double:2,four:4,editorial:2,bleed:1};
  app.pages.photobook=()=>{
    const initial=g.albumById.get(g.query.get('id'))||app.albums[0];
    let album=initial, photos=[], selected=new Set(), index=0;
    main.innerHTML=`<div class="wrap">${heading('A BOOK TO KEEP','相簿書','挑選照片與版型，排出一本可以列印的小書。')}
      <div class="book-customizer"><div class="filters">
        ${select('album','相簿',albumOptions,'',initial.id)}
        <label class="field book-title"><span>書名</span><input name="book-title" type="text" maxlength="44" value="${esc(initial.title)}"></label>
        ${select('book-layout','版型',layouts,'','double')}
        <button class="button primary" type="button" data-print>列印／另存 PDF</button></div>
        <details class="advanced"><summary>選擇照片</summary><div id="book-options" class="book-options"></div></details>
      </div>
      <section class="book-preview" aria-label="相簿書頁面">
        <div id="screen-book"></div>
        <div class="book-nav"><button class="icon-button" type="button" data-book-step="-1" aria-label="上一頁">${icon('left')}</button><span role="status" id="book-page"></span><button class="icon-button" type="button" data-book-step="1" aria-label="下一頁">${icon('right')}</button></div>
      </section><div id="print-book" aria-hidden="true"></div></div>`;
    const title=main.querySelector('[name=book-title]');
    const layout=main.querySelector('[name=book-layout]');
    const options=main.querySelector('#book-options');
    const screen=main.querySelector('#screen-book');
    const print=main.querySelector('#print-book');
    const nav=main.querySelector('.book-nav');
    const img=(p,eager=false)=>picture(p.image,p.alt,{source:p,large:true,eager});
    function loadAlbum(){
      photos=g.resolve(album.photoIds);
      selected=new Set(photos.map(p=>p.id));
      options.innerHTML=photos.map(p=>`<label>${picture(p.image,p.alt,{source:p})}<span><input type="checkbox" value="${p.id}" checked> ${esc(p.title)}</span></label>`).join('')||empty('這本相簿還沒有照片。');
      index=0;
    }
    function draw(){
      const picked=photos.filter(p=>selected.has(p.id));
      const mode=layout.value;
      const name=esc(title.value.trim()||album.title);
      const groups=[];
      for(let i=0;i<picked.length;i+=sizes[mode])groups.push(picked.slice(i,i+sizes[mode]));
      const pages=[
        `<article class="book-sheet book-cover"><small>KOMOREBI FAMILY ALBUM</small><h2>${name}</h2>${picked[0]?img(picked[0],true):empty('請選擇要放入書中的照片。')}</article>`,
        `<article class="book-sheet book-contents"><h2>目錄</h2><ol>${groups.map(p=>`<li>${p.map(x=>esc(x.title)).join('・')}</li>`).join('')}</ol></article>`,
        ...groups.map(p=>`<article class="book-sheet book-spread ${mode}">${p.map(x=>`<figure>${img(x,true)}<figcaption>${esc(x.title)}${mode==='editorial'?'<p>'+esc(x.description)+'</p>':''}</figcaption></figure>`).join('')}</article>`),
        `<article class="book-sheet book-end"><img src="${app.ui.url('assets/images/mark.svg')}" alt="" width="56" height="56"><h2>下次再一起翻閱。</h2><p>${name}</p></article>`
      ];
      index=Math.min(index,pages.length-1);
      screen.innerHTML=pages[index];
      nav.querySelector('#book-page').textContent=`${index+1} / ${pages.length} 頁`;
      nav.querySelector('[data-book-step="-1"]').disabled=index===0;
      nav.querySelector('[data-book-step="1"]').disabled=index===pages.length-1;
      return pages;
    }
    main.querySelector('[name=album]').onchange=e=>{album=g.albumById.get(e.target.value);title.value=album.title;loadAlbum();draw();};
    title.oninput=draw;
    layout.onchange=()=>{index=0;draw();};
    options.onchange=e=>{
      if(!e.target.matches('[type=checkbox]'))return;
      if(e.target.checked) selected.add(e.target.value);
      else selected.delete(e.target.value);
      draw();
    };
    nav.onclick=e=>{
      const b=e.target.closest('[data-book-step]');
      if(!b)return;
      index+=Number(b.dataset.bookStep);
      draw();
      if(b.disabled)(nav.querySelector('button:not(:disabled)')||screen).focus();
    };
    const preparePrint=()=>{
      if(!print.childElementCount)print.innerHTML=draw().join('');
    };
    window.addEventListener('beforeprint',preparePrint);
    window.addEventListener('afterprint',()=>{print.replaceChildren();});
    main.querySelector('[data-print]').onclick=async()=>{
      preparePrint();
      await Promise.allSettled([...print.querySelectorAll('img')].map(el=>el.decode()));
      window.print();
    };
    loadAlbum();
    draw();
  };
})();
