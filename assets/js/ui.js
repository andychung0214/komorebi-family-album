(() => {
  const app = globalThis.Komorebi;
  const {storage, age} = app.core;
  const root = document.body.dataset.root || '';
  const page = document.body.dataset.page;
  const main = document.querySelector('#main');
  const url = file => root + file;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const themes = {warm:'Warm Family', pastel:'Pastel Memories', night:'Night Story'};
  const childFilters = {haru:'哥哥・小晴', yui:'妹妹・小柚', both:'兄妹共同', family:'全家生活'};
  const icons = {
    heart:'M20.8 8.6c0 4.4-8.8 9.7-8.8 9.7S3.2 13 3.2 8.6a4.5 4.5 0 0 1 8.8-1.2 4.5 4.5 0 0 1 8.8 1.2Z',
    search:'M16 16l4 4M18 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z',
    sun:'M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2m0-14-2 2M7 17l-2 2m12-7a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z',
    menu:'M4 6h16M4 12h16M4 18h16',
    arrow:'M4 12h15m-6-6 6 6-6 6', left:'m14 5-7 7 7 7',right:'m10 5 7 7-7 7', close:'m6 6 12 12M6 18 18 6',
    book:'M12 6C9 3 5 3 3 4v14c3-1 6-1 9 2 3-3 6-3 9-2V4c-2-1-6-1-9 2Zm0 0v14',
    calendar:'M6 3v4m12-4v4M4 10h16M4 5h16v15H4Zm5 9h1m4 0h1m-6 3h1'
  };
  const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${icons[name]}"/></svg>`;
  const when = value => app.core.validDate(value) ? value.replaceAll('-', ' / ') : '日期不明';
  const names = ids => app.children.filter(c => ids?.includes(c.id)).map(c => c.nickname).join('、') || '全家';
  const asset = (key, version = 'thumb') => url(`assets/images/${key}-${version}.webp`);
  function picture(key, alt = '', {large = false, eager = false, cls = '', source} = {}) {
    const src = source ? url(large ? source.displayImage : source.thumbnail) : asset(key, large ? 'display' : 'thumb');
    return `<img class="${cls}" src="${esc(src)}" width="${source?.width || 480}" height="${source?.height || 320}" alt="${esc(alt)}" ${eager?'fetchpriority="high"':'loading="lazy"'} decoding="async" data-photo-image>`;
  }
  const action = (href, label, cls = '') => `<a class="button ${cls}" href="${url(href)}">${label}</a>`;
  const heading = (kicker, title, desc = '') => `<div class="page-head"><span class="eyebrow">${kicker}</span><h1>${title}</h1>${desc ? `<p>${desc}</p>` : ''}</div>`;
  const sectionHead = (kicker, title, more = '') => `<div class="section-head"><div><span class="eyebrow">${kicker}</span><h2>${title}</h2></div>${more}</div>`;
  const empty = (message = '這裡還沒有符合條件的回憶。') => `<p class="empty">${message}</p>`;
  const option = (value, label, selected) => `<option value="${esc(value)}"${value === selected ? ' selected' : ''}>${esc(label)}</option>`;
  const select = (name, label, options, initial = '', selected = '') => `<label class="field"><span>${label}</span><select name="${name}">${initial ? option('',initial,selected) : ''}${(Array.isArray(options) ? options : Object.entries(options)).map(([k,v])=>option(k,v,selected)).join('')}</select></label>`;
  const link = {
    album: id => 'album.html?id=' + encodeURIComponent(id),
    story: item => item.contentUrl,
    child: id => 'children.html?id=' + encodeURIComponent(id)
  };
  function toast(message) {
    const el = document.querySelector('#toast');
    el.textContent = message;
    el.classList.add('shown');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove('shown'), 2500);
  }
  const favoriteKey = (type,id) => type + ':' + id;
  const favorites = () => {
    const data = storage.get('favorites', {});
    return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
  };
  const isFavorite = (type,id) => Object.hasOwn(favorites(), favoriteKey(type,id));
  function heart(type,id) {
    const active = isFavorite(type,id);
    return `<button type="button" class="icon-button heart" data-favorite="${esc(favoriteKey(type,id))}" aria-pressed="${active}" aria-label="${active?'取消收藏':'收藏'}">${icon('heart')}</button>`;
  }
  function updateFavorites() {
    const data = favorites();
    document.querySelectorAll('[data-favorite]').forEach(b => {
      const active = Object.hasOwn(data,b.dataset.favorite);
      b.setAttribute('aria-pressed', active);
      b.setAttribute('aria-label', active ? '取消收藏' : '收藏');
    });
    document.querySelectorAll('[data-fav-count]').forEach(el => {
      const count = Object.keys(data).length;
      el.textContent = count;
      el.hidden = !count;
    });
  }
  function recent(type,id) {
    const data = storage.get('recent', []);
    const key = favoriteKey(type,id);
    storage.set('recent', [key, ...(Array.isArray(data) ? data.filter(item => item !== key) : [])].slice(0, 12));
  }
  function setTheme(key) {
    if (!Object.hasOwn(themes,key)) key = 'warm';
    document.documentElement.dataset.theme = key;
    storage.set('theme',key);
    document.querySelectorAll('[data-theme-select]').forEach(el => el.value = key);
  }
  function shell() {
    const nav = {index:'首頁',albums:'相簿',timeline:'成長時間軸',memories:'生活故事'};
    const brand = `<a class="brand" href="${url('index.html')}"><img src="${url('assets/images/mark.svg')}" alt="" width="40" height="40"><span><b>木漏日小日子</b><small>KOMOREBI FAMILY ALBUM</small></span></a>`;
    const here = key => page === key || (key === 'albums' && ['album','gallery'].includes(page)) || (key === 'memories' && page === 'memory');
    const navLink = (path, label, active) => `<a href="${url(path)}" ${active?'aria-current="page"':''}>${label}</a>`;
    document.querySelector('#header').innerHTML = `<div class="wrap topbar">${brand}
      <nav aria-label="主要導覽" class="main-nav" id="main-nav">${Object.entries(nav).map(([key,label])=>navLink(key+'.html',label,here(key))).join('')}
      <details class="more-nav"><summary>更多 <span aria-hidden="true">⌄</span></summary><div>
      ${Object.entries({children:'雙寶小檔案',calendar:'照片日曆',milestones:'里程碑',photobook:'相簿書',settings:'設定'}).map(([k,v])=>navLink(k+'.html',v,page===k)).join('')}</div></details></nav>
      <div class="tools"><a class="icon-button" aria-label="搜尋" href="${url('gallery.html')}">${icon('search')}</a>
      <a class="icon-button" aria-label="我的收藏" href="${url('favorites.html')}">${icon('heart')}<span data-fav-count hidden></span></a>
      <details class="theme-menu"><summary class="icon-button" aria-label="切換主題">${icon('sun')}</summary><label>閱讀主題<select data-theme-select>${Object.entries(themes).map(([k,v])=>option(k,v)).join('')}</select></label></details>
      <button type="button" class="icon-button mobile-only" data-menu aria-controls="main-nav" aria-expanded="false" aria-label="開啟導覽">${icon('menu')}</button></div></div>`;
    document.querySelector('#footer').innerHTML = `<div class="wrap footer-inner">${brand}<p>虛構家庭・公開攝影示意<br><small>照片中的人物與故事角色無關。</small></p><div><a href="${url('about.html')}">關於相簿</a><a href="${url('settings.html')}">個人化設定</a><a href="${url('docs/IMAGE-SOURCES.md')}">攝影來源</a></div></div>`;
    setTheme(storage.get('theme','warm'));
    updateFavorites();
    const menu = document.querySelector('[data-menu]');
    const toggleMenu = open => {
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? '關閉導覽' : '開啟導覽');
    };
    menu.addEventListener('click', () => toggleMenu(menu.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !document.querySelector('dialog[open]')) {
        const opened = document.querySelector('#header details[open]');
        if (opened) { opened.open = false; opened.querySelector('summary').focus(); }
        else if (menu.getAttribute('aria-expanded') === 'true') { toggleMenu(false); menu.focus(); }
      }
    });
  }
  function childCard(child) {
    const belongs = p => p.childIds.includes(child.id);
    return `<a class="child-card ${child.themeAccent}" href="${url(link.child(child.id))}">
      <img src="${url('assets/images/'+child.avatar+'.svg')}" width="78" height="78" alt="">
      <div><p class="child-label">${esc(child.role)} <span>·</span> ${age(child.birthDate)}</p><h3>${esc(child.nickname)}</h3><p>${esc(child.description)}</p><small>${app.albums.filter(belongs).length} 本相簿 · ${app.photos.filter(belongs).length} 張照片</small></div>
      <span class="child-arrow">${icon('arrow')}</span></a>`;
  }
  function albumCard(item) {
    return `<article class="cover-card"><div class="cover-media">
      <a href="${url(link.album(item.id))}" aria-label="開啟相簿：${esc(item.title)}">${picture(item.coverImage)}</a>${heart('album',item.id)}</div>
      <div class="card-copy"><p class="meta">${when(item.startDate)} <span>·</span> ${item.photoIds.length} 張</p>
      <h3><a href="${url(link.album(item.id))}">${esc(item.title)}</a></h3><p>${names(item.childIds)} · ${item.categoryIds.map(id=>app.categories[id]).join('、')}</p></div></article>`;
  }
  function storyCard(item) {
    return `<article class="cover-card"><div class="cover-media">
      <a href="${url(link.story(item))}" aria-label="閱讀故事：${esc(item.title)}">${picture(item.coverImage)}</a>${heart('story',item.id)}</div>
      <div class="card-copy"><p class="meta">${when(item.date)} · ${names(item.childIds)}</p>
      <h3><a href="${url(link.story(item))}">${esc(item.title)}</a></h3><p>${esc(item.summary)}</p></div></article>`;
  }
  document.addEventListener('change', e => { if (e.target.matches('[data-theme-select]')) setTheme(e.target.value); });
  document.addEventListener('click', e => {
    const button = e.target.closest('[data-favorite]');
    if (!button) return;
    const state = {...favorites()};
    const key = button.dataset.favorite;
    const remove = Object.hasOwn(state,key);
    if (remove) delete state[key];
    else state[key] = {savedAt: new Date().toISOString(), highlight:''};
    const saved = storage.set('favorites',state);
    updateFavorites();
    toast(saved ? (remove?'已取消收藏':'已加入收藏') : '已更新本次收藏，瀏覽器儲存不可用');
    document.dispatchEvent(new CustomEvent('komorebi:favorite',{detail:key}));
  });
  document.addEventListener('error', e => {
    if (!e.target.matches?.('img[data-photo-image]') || e.target.dataset.failed) return;
    e.target.dataset.failed = 'true';
    e.target.removeAttribute('srcset');
    e.target.src = url('assets/images/fallback.svg');
    e.target.alt = '照片無法載入，顯示替代插畫';
  }, true);
  app.ui = {root,page,main,url,esc,icon,when,names,picture,action,heading,sectionHead,empty,select,option,link,toast,heart,favorites,isFavorite,recent,themes,childFilters,shell,childCard,albumCard,storyCard};
})();
