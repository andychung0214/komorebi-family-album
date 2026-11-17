const test = require('node:test');
const assert = require('node:assert/strict');
const { existsSync } = require('node:fs');
const { join } = require('node:path');
for (const file of ['core','children-data','albums-data','photos-data','memories-data','milestones-data']) require('../assets/js/' + file + '.js');
const {core, children, albums, photos, memories, milestones, categories} = globalThis.Komorebi;
const exists = file => existsSync(join(__dirname, '..', file));
test('album order follows album sort order and each album photo sequence', () => {
  assert.deepEqual(core.sorted([...photos].reverse(),'album').slice(0,5).map(p=>p.id),albums[0].photoIds);
  assert.equal(core.sorted([...memories].reverse(),'album')[0].albumIds[0],albums[0].id);
});
test('demo meets size and tag requirements', () => {
  assert.equal(children.length, 2);
  for (const [records, count] of [[albums,10], [photos,48], [memories,12], [milestones,15]]) {
    assert.equal(records.length, count);
    assert.equal(new Set(records.map(r=>r.id)).size, count);
  }
  assert.ok(Object.keys(categories).length >= 6);
  assert.ok(new Set(photos.flatMap(p=>p.tags)).size >= 12);
});
test('all demo links, dates and asset paths resolve', () => {
  for (const item of [...albums,...photos,...memories,...milestones]) {
    const when = core.dateOf(item);
    assert.ok(core.validDate(when) && when <= core.demo, item.id);
    for (const id of item.childIds) assert.ok(children.some(c=>c.id===id && c.birthDate <= when), item.id);
    for (const id of item.photoIds || []) assert.ok(photos.some(p=>p.id===id), item.id);
    for (const id of item.categoryIds) assert.ok(categories[id], item.id);
    for (const id of item.albumIds || []) assert.ok(albums.some(a=>a.id===id), item.id);
    if (item.coverImage) assert.ok(exists('assets/images/' + item.coverImage + '-display.webp'), item.id);
  }
  for (const photo of photos) {
    assert.ok(exists(photo.thumbnail) && exists(photo.displayImage), photo.id);
    assert.ok(albums.find(a=>a.id===photo.albumIds[0]).photoIds.includes(photo.id));
    assert.ok(memories.some(m=>m.id===photo.memoryId));
  }
  for (const memory of memories) assert.ok(exists(memory.contentUrl), memory.id);
});
