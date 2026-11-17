(() => {
  const app = globalThis.Komorebi;
  const ui = app.ui;
  const g = app.gallery;
  const {main, heading, sectionHead, empty, when, names, esc, icon, select, url, link, storyCard, action, picture} = ui;
  const {demo, dateOf, matches, sorted, age, iso, monthCells, pad} = app.core;
  const ages = item => app.children.filter(c=>item.childIds.includes(c.id)).map(c=>c.nickname+' '+age(c.birthDate,dateOf(item))).join(' · ');
  const content = [
    ...app.photos.map(item=>({item,type:'photo'})),
    ...app.memories.map(item=>({item,type:'story'})),
    ...app.milestones.map(item=>({item,type:'milestone'}))
  ].sort((a,b)=>dateOf(b.item).localeCompare(dateOf(a.item)));
  function cards(items) {
    return items.map(({item,type})=>{
      const related=type==='photo'?item:g.resolve(item.photoIds)[0];
      const image=related?picture(related.image,related.alt,{source:related}):'';
      const body=`<span class="meta">${when(dateOf(item))} · ${ages(item)}</span>
        <h3>${esc(item.title)}</h3><p>${esc(item.description || item.summary)}</p>`;
      return `<article class="time-card" id="${esc(type+'-'+item.id)}">
      ${related?`<button class="photo-open" type="button" data-growth-photo="${related.id}" aria-label="放大照片：${esc(related.title)}">${image}</button>`:''}
      <div>${type==='story'?'<span class="tag">故事</span>':type==='milestone'?'<span class="tag">里程碑</span>':''}${body}
      ${type==='story'?action(link.story(item),'讀故事','outline'):''}</div></article>`;
    }).join('');
  }
  function bindPhotos(el) {
    el.addEventListener('click',e=>{
      const b=e.target.closest('[data-growth-photo]');
      const photo=g.photoById.get(b?.dataset.growthPhoto);
      if(!photo)return;
      const source=g.resolve([...new Set([...el.querySelectorAll('[data-growth-photo]')].map(node=>node.dataset.growthPhoto))]);
      g.open(source,source.indexOf(photo),b);
    });
  }
  app.pages.timeline=()=>{
    main.innerHTML=`<div class="wrap">${heading('LITTLE BY LITTLE','成長時間軸','用日期、年齡與生活故事，往回翻閱一起長大的日子。')}
    ${g.filterForm({timeline:true})}<p class="meta" id="time-count" role="status"></p><div id="time-list"></div></div>`;
    const list=main.querySelector('#time-list');
    bindPhotos(list);
    g.bindFilters(main.querySelector('form'),f=>{
      const items=content.filter(({item,type})=>(!f.type||f.type===type)&&matches(item,f));
      const months = Map.groupBy ? Map.groupBy(items,({item})=>dateOf(item).slice(0,7)) : items.reduce((group, entry)=>{
        const month=dateOf(entry.item).slice(0,7);
        if(!group.has(month)) group.set(month,[]);
        group.get(month).push(entry);
        return group;
      },new Map());
      main.querySelector('#time-count').textContent=`${items.length} 筆紀錄`;
      list.innerHTML=items.length?[...months].map(([month,group])=>`<section class="month-group"><h2>${month.slice(0,4)} 年 ${Number(month.slice(5))} 月</h2><div class="time-list">${cards(group)}</div></section>`).join(''):empty();
    });
  };
  app.pages.milestones=()=>{
    main.innerHTML=`<div class="wrap">${heading('SMALL FIRSTS','成長里程碑','每個孩子用自己的步調，記下一次又一次的初體驗。')}
      <div class="wall-tools">${select('child','家庭成員',{haru:ui.childFilters.haru,yui:ui.childFilters.yui},'全部成員')}</div>
      <div id="milestone-list" class="time-list"></div></div>`;
    const list=main.querySelector('#milestone-list');
    const child=main.querySelector('select');
    const draw=()=>{list.innerHTML=cards(sorted(app.milestones.filter(m=>matches(m,{child:child.value}))).map(item=>({item,type:'milestone'})));};
    child.onchange=draw;
    bindPhotos(list);
    draw();
    document.getElementById('milestone-'+location.hash.slice(1))?.scrollIntoView();
  };
  app.pages.calendar=()=>{
    const [demoYear,demoMonth]=demo.split('-').map(Number);
    let y=demoYear,m=demoMonth, selected=demo;
    const years=Object.fromEntries(Array.from({length:32},(_,i)=>[String(2000+i),String(2000+i)+' 年']));
    main.innerHTML=`<div class="wrap">${heading('DAYS TO REMEMBER','照片日曆','點選一天，看看當時留下的照片和故事。')}
      <div class="calendar-layout"><section class="calendar-panel" aria-label="月份與日期">
      <div class="calendar-bar"><button class="icon-button" data-month-step="-1" type="button" aria-label="上個月">${icon('left')}</button>
        <h2 id="cal-caption" aria-live="polite"></h2><button class="icon-button" data-month-step="1" type="button" aria-label="下個月">${icon('right')}</button></div>
      <div class="calendar-filters">${select('year','年份',years,'',String(y))}${select('month','月份',g.months,'',pad(m))}
      ${select('child','家庭成員',ui.childFilters,'全部成員')}</div>
      <div class="weekdays" aria-hidden="true">${['日','一','二','三','四','五','六'].map(s=>'<span>'+s+'</span>').join('')}</div>
      <div class="calendar-grid"></div><button class="text-button" type="button" data-today>回到示範日期</button></section>
      <section class="day-view" aria-label="當日回憶"><div id="day-view"></div></section></div></div>`;
    const panel=main.querySelector('.calendar-panel');
    const year=panel.querySelector('[name=year]');
    const month=panel.querySelector('[name=month]');
    const child=panel.querySelector('[name=child]');
    const grid=panel.querySelector('.calendar-grid');
    function draw(focus=false){
      const filter={child:child.value,year:String(y),month:pad(m)};
      const photoMap=new Map();
      for(const p of app.photos.filter(p=>matches(p,filter))){
        if(!photoMap.has(p.capturedAt))photoMap.set(p.capturedAt,[]);
        photoMap.get(p.capturedAt).push(p);
      }
      const stories=app.memories.filter(s=>matches(s,filter));
      const found=photoMap.get(selected)||[];
      const currentStories=stories.filter(s=>s.date===selected);
      year.value=String(y);month.value=pad(m);
      panel.querySelector('#cal-caption').textContent=`${y} 年 ${m} 月`;
      panel.querySelector('[data-month-step="-1"]').disabled=y===2000&&m===1;
      panel.querySelector('[data-month-step="1"]').disabled=y===2031&&m===12;
      grid.innerHTML=monthCells(y,m).map(d=>{
        if(!d)return '<span class="blank"></span>';
        const p=photoMap.get(d)||[];
        const count=p.length;
        return `<button type="button" data-day="${d}" aria-pressed="${selected===d}" aria-label="${d}，${count} 張照片">${Number(d.slice(8))}
          ${count?`<span class="calendar-count">${count}</span>${picture(p[0].image,'',{source:p[0]})}`:''}</button>`;
      }).join('');
      const view=main.querySelector('#day-view');
      const items=found.map(p=>g.albumById.get(p.albumIds[0])).filter(Boolean);
      view.innerHTML=`${sectionHead('ON THIS DAY',when(selected))}
        ${!found.length&&!currentStories.length?empty('這一天還沒有留下回憶。'):''}<div id="day-wall"></div>
        ${currentStories.map(storyCard).join('')}
        ${[...new Set(items)].map(a=>action(link.album(a.id),esc(a.title),'outline')).join('')}`;
      if(found.length)g.wall(view.querySelector('#day-wall'),found,{toolbar:false});
      if(focus)grid.querySelector('[aria-pressed=true]')?.focus();
    }
    const changeMonth=(ny,nm)=>{y=ny;m=nm;selected=iso(y,m,1);draw();};
    panel.onclick=e=>{
      const b=e.target.closest('button');
      if(!b)return;
      if(b.dataset.day){selected=b.dataset.day;draw(true);}
      if(b.dataset.monthStep){
        const date=new Date(Date.UTC(y,m-1+Number(b.dataset.monthStep),1));
        changeMonth(date.getUTCFullYear(),date.getUTCMonth()+1);
      }
      if(b.hasAttribute('data-today')){y=demoYear;m=demoMonth;selected=demo;draw();}
    };
    year.onchange=()=>changeMonth(Number(year.value),m);
    month.onchange=()=>changeMonth(y,Number(month.value));
    child.onchange=()=>draw();
    grid.addEventListener('keydown',e=>{
      const offset={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7}[e.key];
      if(!offset||!e.target.dataset.day)return;
      e.preventDefault();
      const date=new Date(e.target.dataset.day+'T00:00:00Z');
      date.setUTCDate(date.getUTCDate()+offset);
      const next=grid.querySelector('[data-day="'+date.toISOString().slice(0,10)+'"]');
      next?.focus();
    });
    draw();
  };
})();
