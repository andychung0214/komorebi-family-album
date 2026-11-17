const test = require('node:test');
const assert = require('node:assert/strict');
require('../assets/js/core.js');
const { age, validDate, monthCells, matches } = globalThis.Komorebi.core;
test('validates dates and builds a leap-year calendar', () => {
  assert.equal(validDate('2024-02-29'), true);
  assert.equal(validDate('2025-02-29'), false);
  assert.equal(validDate('2026-2-01'), false);
  assert.equal(monthCells(2024, 2).filter(Boolean).length, 29);
  assert.equal(monthCells(2024, 2).indexOf('2024-02-01'), 4);
});
test('age handles clamped month ends, leap years, newborns and invalid dates', () => {
  assert.equal(age('2020-01-31', '2020-02-29'), '1 個月');
  assert.equal(age('2020-02-29', '2021-02-28'), '1 歲');
  assert.equal(age('2026-04-17', '2026-04-20'), '出生後 3 天');
  assert.equal(age('2026-04-17', '2026-04-16'), '出生前');
  assert.equal(age('2026-02-30', '2026-04-16'), '日期不明');
});
test('search combines text, dates, tags and siblings', () => {
  const item = { childIds: ['haru','yui'], date: '2026-11-03', tags: ['野餐'], title: '公園 午後', categoryIds: ['outdoors'] };
  assert.equal(matches(item, {q: '午後　野餐', child: 'both', month: '11', category: 'outdoors'}), true);
  assert.equal(matches(item, {to: '2026-11-02'}), false);
  assert.equal(matches(item, {child: 'yui', tag: '旅行'}), false);
});
test('distinguishes family outings from sibling entries and filters by age stage', () => {
  const app = globalThis.Komorebi;
  require('../assets/js/children-data.js');
  const item = {group:'family', childIds:['haru','yui'], date:'2026-11-03'};
  assert.equal(matches(item,{child:'both'}),false);
  assert.equal(matches(item,{child:'family'}),true);
  assert.equal(matches(item,{child:'yui', stage:'six-plus'}),false);
  assert.equal(matches(item,{child:'yui', stage:'four-six'}),true);
  assert.equal(matches(item,{child:'haru', stage:'six-plus'}),true);
  assert.equal(app.core.ageStage('2026-04-17','2026-04-16'),'');
});
