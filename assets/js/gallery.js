(() => {
  const app = globalThis.Komorebi;
  const ui = app.ui;
  const {esc, icon, picture, heart, when, names, url, link, select, option, empty} = ui;
  const {matches, sorted, dateOf, pad} = app.core;
  const photoById = new Map(app.photos.map(p => [p.id,p]));
  const albumById = new Map(app.albums.map(a => [a.id,a]));
  const resolve = ids => ids.map(id => photoById.get(id)).filter(Boolean);
  const layouts = {grid:'方格',masonry:'瀑布流',featured:'精選版面',chronological:'依日期'};
  const years = [...new Set([...app.photos,...app.milestones].map(p=>dateOf(p).slice(0,4)))].sort().reverse();
  const months = Array.from({length:12}, (_,i)=>[pad(i+1), (i+1)+' 月']);
  const tags = [...new Set([...app.photos,...app.memories].flatMap(p=>p.tags))].sort((a,b)=>a.localeCompare(b,'zh-Hant'));
  const orders = {newest:'最新',oldest:'最舊',title:'標題',album:'相簿順序',featured:'精選優先'};
  const query = new URLSearchParams(location.search);
  function filterForm({onlyPhotos = false, album = false, timeline = false} = {}) {
    return `<form class="filters">
      <label class="field query"><span>搜尋</span><input name="q" type="search" placeholder="試試「野餐」或「小晴」" value="${esc(query.get('q'))}"></label>
      ${select('child','家庭成員',ui.childFilters,'全部成員',query.get('child'))}
      ${select('category','分類',app.categories,'全部分類',query.get('category'))}
      ${select('year','年份',years.map(y=>[y,y]),'所有年份',query.get('year'))}
      ${select('month','月份',months,'所有月份',query.get('month'))}
      ${select('stage','年齡階段',app.core.stages,'所有階段',query.get('stage'))}
      ${timeline ? select('type','顯示內容',{photo:'照片',milestone:'里程碑',story:'故事'},'所有內容') : select('order','排序',orders,'','newest')}
      ${!timeline ? `<details class="advanced"><summary>更多篩選</summary><div class="filter-more">
        ${select('tag','標籤',Object.fromEntries(tags.map(x=>[x,x])),'所有標籤',query.get('tag'))}
        <label class="field"><span>起始日期</span><input type="date" name="from"></label>
        <label class="field"><span>結束日期</span><input type="date" name="to"></label>
        <label class="check"><input type="checkbox" name="saved"> 已收藏</label></div></details>` : ''}
      ${!onlyPhotos && !album && !timeline ? select('kind','結果類型',{photo:'照片',album:'相簿',story:'故事',milestone:'里程碑'},'所有類型') : ''}
      <button type="reset" class="text-button">清除篩選</button></form>`;
  }
  function bindFilters(form, render) {
    let timer;
    const update = () => { clearTimeout(timer); render(Object.fromEntries(new FormData(form))); };
    form.addEventListener('submit', e=> {e.preventDefault(); update();});
    form.addEventListener('input', e=>{
      if (e.target.name === 'q') { clearTimeout(timer); timer=setTimeout(update,180); }
    });
    form.addEventListener('change', update);
    form.addEventListener('reset', () => setTimeout(() => {
      for (const el of form.elements) {
        if (['q','child','category','year','month','tag','stage'].includes(el.name)) el.value = '';
      }
      update();
    },0));
    document.addEventListener('komorebi:favorite', () => {
      if (!form.elements.saved?.checked) return;
      const active = document.activeElement;
      update();
      if (!active.isConnected) form.elements.saved.focus();
    });
    update();
  }
  function photoCard(photo) {
    const album = albumById.get(photo.albumIds[0]);
    return `<article class="photo-card">
      <div class="cover-media"><button class="photo-open" type="button" data-open-photo="${esc(photo.id)}" aria-label="放大：${esc(photo.title)}">${picture(photo.image, photo.alt, {source:photo})}</button>
      ${photo.favoriteEligible ? heart('photo',photo.id) : ''}</div>
      <div class="card-copy"><p class="meta">${when(photo.capturedAt)} · ${names(photo.childIds)}</p><h3>${esc(photo.title)}</h3>
      ${album ? `<a class="subtle" href="${url(link.album(album.id))}">${esc(album.title)}</a>` : ''}</div></article>`;
  }
  function wall(node, photos, {toolbar = true, limit = 12} = {}) {
    let count = limit;
    let layout = 'grid';
    if (!photos.length) { node.innerHTML=empty(); return; }
    node.innerHTML = `${toolbar ? `<div class="wall-tools">${select('layout','照片版面',layouts,'',layout)}<button type="button" class="button outline" data-slideshow>▷ 播放輪播</button></div>` : ''}
      <div class="photo-wall"></div><div class="more-row"><button type="button" class="button outline" data-load-more>載入更多照片</button></div>`;
    const cards = node.querySelector('.photo-wall');
    const more = node.querySelector('[data-load-more]');
    function draw() {
      let shown = photos;
      if (layout === 'chronological') shown=sorted(photos);
      cards.className = 'photo-wall ' + layout;
      let lastDate = '';
      cards.innerHTML = shown.slice(0,count).map(photo => {
        const showDate = layout === 'chronological' && lastDate !== photo.capturedAt;
        lastDate=photo.capturedAt;
        return (showDate?`<h3 class="day-heading">${when(lastDate)}</h3>`:'') + photoCard(photo);
      }).join('');
      more.hidden = count >= photos.length;
    }
    more.onclick = () => {
      const shown = count;
      count+=limit;
      draw();
      cards.querySelectorAll('[data-open-photo]')[shown]?.focus();
    };
    node.querySelector('select')?.addEventListener('change', e=> {layout=e.target.value; draw();});
    node.onclick = e => {
      const button = e.target.closest('[data-open-photo]');
      const visible = [...cards.querySelectorAll('[data-open-photo]')].map(el=>el.dataset.openPhoto);
      if (button) open(resolve(visible),visible.indexOf(button.dataset.openPhoto),button);
      if (e.target.closest('[data-slideshow]')) open(photos,0,e.target.closest('[data-slideshow]'),true);
    };
    draw();
  }
  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label','放大檢視照片');
  dialog.innerHTML = `<div class="lightbox-top"><span class="meta" data-position></span><button class="icon-button" type="button" data-close aria-label="關閉">${icon('close')}</button></div>
    <div class="lightbox-stage"><button class="icon-button" type="button" data-prev aria-label="上一張">${icon('left')}</button><div data-large-image></div><button class="icon-button" type="button" data-next aria-label="下一張">${icon('right')}</button></div>
    <div class="lightbox-caption" aria-live="polite"></div>
    <div class="wall-tools"><button class="button outline" data-play type="button">開始播放</button>
    <label class="field"><span>間隔</span><select data-speed><option value="3000">3 秒</option><option value="5000">5 秒</option><option value="8000">8 秒</option></select></label>
    <button class="button outline" data-fullscreen type="button">全螢幕</button></div>`;
  document.body.append(dialog);
  let group = [], position = 0, timer, playing = false, returnFocus, touch;
  const find = selector => dialog.querySelector(selector);
  const play = find('[data-play]');
  function render() {
    const p=group[position];
    find('[data-position]').textContent = `${position+1} / ${group.length} · 攝影示意`;
    find('[data-large-image]').innerHTML=picture(p.image,p.alt,{large:true,eager:true,source:p});
    const caption = find('.lightbox-caption');
    const heartFocused = caption.contains(document.activeElement);
    caption.innerHTML=`<div><h2>${esc(p.title)}</h2><p>${when(p.capturedAt)} · ${names(p.childIds)} · ${esc(p.description)}</p>
      ${p.originalImage ? `<a href="${esc(url(p.originalImage))}" target="_blank" rel="noopener">查看原圖</a>` : ''}</div>${p.favoriteEligible ? heart('photo',p.id) : ''}`;
    if (heartFocused) (caption.querySelector('button') || find('[data-close]')).focus();
  }
  function step(amount) { position=(position+amount+group.length)%group.length; render(); }
  function playback(active) {
    playing=active;
    clearInterval(timer);
    play.textContent=active ? '暫停播放' : '開始播放';
    if (active) timer=setInterval(()=>step(1),Number(find('[data-speed]').value));
  }
  function open(photos,index,trigger,auto=false) {
    if (!photos.length) return;
    group=photos;
    position=Math.max(0,index);
    returnFocus=trigger;
    render();
    find('[data-fullscreen]').hidden=!dialog.requestFullscreen;
    dialog.showModal();
    document.documentElement.classList.add('modal-open');
    find('[data-close]').focus();
    playback(auto && !matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  find('[data-close]').onclick=()=>dialog.close();
  find('[data-prev]').onclick=()=>step(-1);
  find('[data-next]').onclick=()=>step(1);
  play.onclick=()=>playback(!playing);
  find('[data-speed]').onchange=()=>playback(playing);
  find('[data-fullscreen]').onclick=async()=>{
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await dialog.requestFullscreen();
    } catch { ui.toast('此瀏覽器目前無法開啟全螢幕'); }
  };
  dialog.addEventListener('close',()=>{
    if (document.fullscreenElement===dialog) document.exitFullscreen().catch(()=>{});
    document.documentElement.classList.remove('modal-open');
    playback(false);
    if (returnFocus?.isConnected) returnFocus.focus();
    else ui.main.focus();
  });
  dialog.addEventListener('click',e=>{if(e.target===dialog) dialog.close();});
  dialog.addEventListener('keydown',e=>{
    if (e.key==='Tab') {
      const controls=[...dialog.querySelectorAll('button,select,a[href]')].filter(el=>!el.hidden&&!el.disabled);
      const target=e.shiftKey && e.target===controls[0] ? controls.at(-1) : !e.shiftKey && e.target===controls.at(-1) ? controls[0] : null;
      if(target){e.preventDefault();target.focus();}
    }
    if (e.target.matches('select')) return;
    if (e.key==='ArrowLeft' || e.key==='ArrowRight') { e.preventDefault(); step(e.key==='ArrowLeft'?-1:1); }
  });
  const stage=find('[data-large-image]');
  stage.addEventListener('pointerdown',e=>{touch=e.pointerType==='touch' ? {x:e.clientX,y:e.clientY} : null;});
  stage.addEventListener('pointercancel',()=>{touch=null;});
  stage.addEventListener('pointerup',e=>{
    if (touch && Math.abs(e.clientX-touch.x)>45 && Math.abs(e.clientY-touch.y)<45) step(e.clientX<touch.x?1:-1);
    touch=null;
  });
  function matchesSaved(type,item,filters) {
    return matches(item,filters) && (!filters.saved || ui.isFavorite(type,item.id));
  }
  app.gallery={resolve, photoById, albumById, filterForm, bindFilters, photoCard, wall, open, matchesSaved, months, years, query};
})();
