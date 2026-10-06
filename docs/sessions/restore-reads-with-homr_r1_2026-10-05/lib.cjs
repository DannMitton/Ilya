const { createRequire } = require('module');
const req = createRequire('/Users/dannmitton/Desktop/ilya-rewrite/apps/web/package.json');
const { chromium } = req('@playwright/test');
const fs = require('fs'), os = require('os'), path = require('path');
exports.PDF = '/Users/dannmitton/Downloads/Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf';
exports.BASE = process.env.BASE || 'http://localhost:5199/';
exports.open = async (profile) => {
  const dir = profile || fs.mkdtempSync(path.join(os.tmpdir(), 'pw-chrome-'));
  const ctx = await chromium.launchPersistentContext(dir, { channel: 'chrome', headless: false, viewport: { width: 1440, height: 900 } });
  const page = ctx.pages()[0] || await ctx.newPage();
  const logs = [];
  page.on('console', m => logs.push(`[${m.type()}] ${m.text()}`));
  page.on('pageerror', e => logs.push(`[pageerror] ${e.message}`));
  return { ctx, page, logs, dir };
};
// what the vault holds for each song: name, source file, size, reading stamp if any
exports.vault = async (page) => { for (let i=0;i<20;i++){ try { return await vault1(page); } catch(e){ await page.waitForTimeout(1500);} } return vault1(page); };
const vault1 = (page) => page.evaluate(() => new Promise((res) => {
  const r = indexedDB.open('ilya-library');
  r.onerror = () => res({ error: String(r.error) });
  r.onsuccess = () => { const db = r.result; const names = [...db.objectStoreNames];
    const out = { stores: names, songs: [], sources: [] };
    const t = db.transaction(names, 'readonly');
    t.objectStore('songs').getAll().onsuccess = e => out.songs = e.target.result.map(s => ({ id: s.id, name: s.name, corrections: Object.keys(s.corrections || {}).length, source: s.source && { fileName: s.source.fileName, byteLength: s.source.byteLength, page: !!s.source.page } }));
    t.objectStore('sources').getAll().onsuccess = e => out.sources = e.target.result.map(s => ({ songId: s.songId, fileName: s.fileName, byteLength: s.byteLength, reading: s.reading ? { stamp: s.reading.stamp, len: s.reading.musicXml.length } : null }));
    t.oncomplete = () => res(out); };
}));
