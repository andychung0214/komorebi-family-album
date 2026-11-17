(() => {
  'use strict';
  const app = globalThis.Komorebi ??= {};
  const demo = '2026-11-18';
  const pad = n => String(n).padStart(2, '0');
  const iso = (y, m, d) => `${String(y).padStart(4, '0')}-${pad(m)}-${pad(d)}`;
  const date = value => new Date(value + 'T00:00:00Z');
  function validDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d\d-\d\d$/.test(value)) return false;
    const day = date(value);
    return Number.isFinite(+day) && day.toISOString().slice(0, 10) === value;
  }
  function daysInMonth(year, month) {
    const last = new Date(0);
    last.setUTCFullYear(year, month, 0);
    return last.getUTCDate();
  }
  function monthCells(year, month) {
    const offset = date(iso(year, month, 1)).getUTCDay();
    const cells = Array(offset).fill(null);
    for (let d = 1; d <= daysInMonth(year, month); d++) cells.push(iso(year, month, d));
    while (cells.length % 7) cells.push(null);
    return cells;
  }
  function elapsedMonths(birth, at) {
    const [by, bm, bd] = birth.split('-').map(Number);
    const [y, m, d] = at.split('-').map(Number);
    let months = (y - by) * 12 + m - bm;
    if (d < Math.min(bd, daysInMonth(y, m))) months--;
    return months;
  }
  function age(birth, at = demo) {
    if (!validDate(birth) || !validDate(at)) return '日期不明';
    if (at < birth) return '出生前';
    const months = elapsedMonths(birth, at);
    if (!months) return `出生後 ${(date(at) - date(birth)) / 86400000} 天`;
    const years = Math.floor(months / 12);
    return [years && `${years} 歲`, months % 12 && `${months % 12} 個月`].filter(Boolean).join(' ');
  }
  const stages = {newborn:'未滿 1 個月','one-three':'1–3 個月','four-six':'4–6 個月','seven-eleven':'7–11 個月','one-two':'1–2 歲','three-five':'3–5 歲','six-plus':'6 歲以上'};
  function ageStage(birth,at) {
    if (!validDate(birth) || !validDate(at) || at < birth) return '';
    const thresholds = [1,4,7,12,36,72,Infinity];
    const months = elapsedMonths(birth,at);
    return Object.keys(stages)[thresholds.findIndex(limit=>months<limit)];
  }
  const dateOf = item => item.date || item.capturedAt || item.startDate || '';
  const normalize = value => String(value ?? '').normalize('NFKC').toLowerCase().trim();
  const searchIndex = new WeakMap();
  function matches(item, filter = {}) {
    const ids = item.childIds ?? [];
    const {q, child, category, tag, year, month, from, to, stage} = filter;
    const when = dateOf(item);
    if (child === 'both' && (item.group ? item.group !== 'both' : ids.length < 2)) return false;
    if (child === 'family' && item.group !== 'family') return false;
    if (child && !['both', 'family'].includes(child) && !ids.includes(child)) return false;
    if (category && !item.categoryIds?.includes(category)) return false;
    if (tag && !item.tags?.includes(tag)) return false;
    if (year && when.slice(0, 4) !== year) return false;
    if (month && when.slice(5, 7) !== month) return false;
    if ((from && when < from) || (to && when > to)) return false;
    if (stage && !(app.children || []).some(c=>ids.includes(c.id) && (!child || ['both','family',c.id].includes(child)) && ageStage(c.birthDate,when)===stage)) return false;
    if (!q) return true;
    if (!searchIndex.has(item)) {
      const names = (app.children || []).filter(child => ids.includes(child.id)).map(child => child.nickname);
      const categories = (item.categoryIds || []).map(id => app.categories?.[id]);
      searchIndex.set(item, normalize([item.title, item.subtitle, item.description, item.summary, item.location, ...(item.tags || []), ...names, ...categories].join(' ')));
    }
    return normalize(q).split(/\s+/).every(word => searchIndex.get(item).includes(word));
  }
  function sorted(items, order) {
    if (order === 'album') {
      const albums = new Map((app.albums || []).map(a=>[a.id,a]));
      const rank = item => {
        const parent = albums.get(item.albumIds?.[0]);
        const position = parent?.photoIds.indexOf(item.id) ?? -1;
        return [item.sortOrder ?? parent?.sortOrder ?? Number.MAX_SAFE_INTEGER, position];
      };
      return items.map(item=>({item, rank:rank(item)}))
        .sort((a,b)=>a.rank[0]-b.rank[0] || a.rank[1]-b.rank[1])
        .map(entry=>entry.item);
    }
    const compare = {
      oldest: (a,b) => dateOf(a).localeCompare(dateOf(b)),
      title: (a,b) => a.title.localeCompare(b.title, 'zh-Hant'),
      featured: (a,b) => Number(b.featured) - Number(a.featured) || dateOf(b).localeCompare(dateOf(a))
    };
    return [...items].sort(compare[order] ?? ((a,b) => dateOf(b).localeCompare(dateOf(a))));
  }
  const cached = {};
  const storage = {
    get(key, fallback) {
      if (Object.hasOwn(cached, key)) return cached[key];
      try { return JSON.parse(localStorage.getItem('komorebi:' + key)) ?? fallback; }
      catch { return fallback; }
    },
    set(key, value) {
      cached[key] = value;
      try { localStorage.setItem('komorebi:' + key, JSON.stringify(value)); return true; }
      catch { return false; }
    }
  };
  app.core = {demo, age, ageStage, stages, validDate, monthCells, matches, sorted, dateOf, iso, pad, storage};
})();
