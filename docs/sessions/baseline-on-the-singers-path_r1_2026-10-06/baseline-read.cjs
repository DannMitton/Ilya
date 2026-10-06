const { open } = require('./lib.cjs');
const fs = require('fs');
const K = __dirname + '/kit/kit/pages/';
const OUT = __dirname + '/checks/joined/'; fs.mkdirSync(OUT, { recursive: true });
const SONGS = { tch: ['tch-1', 'tch-2', 'tch-3'], sun1: ['sun-01', 'sun-02'], sun4: ['sun-03', 'sun-04'], sun5: ['sun-05', 'sun-06', 'sun-07', 'sun-08', 'sun-09', 'sun-10', 'sun-11'], sun6: ['sun-12', 'sun-13', 'sun-14', 'sun-15', 'sun-16', 'sun-17'] };
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://localhost:5199/');
  await page.waitForSelector('[role=tab]', { timeout: 120000 });
  await page.bringToFront();
  const meta = {};
  for (const [song, pages] of Object.entries(SONGS)) {
    const b64 = pages.map(p => fs.readFileSync(K + p + '.png').toString('base64'));
    const r = await page.evaluate(async (b64) => {
      const { readScanPages } = await import('/src/lib/omr/homr-reader.ts');
      const blobs = b64.map(s => new Blob([Uint8Array.from(atob(s), c => c.charCodeAt(0))], { type: 'image/png' }));
      const t0 = performance.now();
      const res = await readScanPages(blobs);
      return { ...res, wallMs: Math.round(performance.now() - t0) };
    }, b64);
    if (!r.ok) { console.log(song, 'FAILED', JSON.stringify(r).slice(0, 300)); meta[song] = r; continue; }
    fs.writeFileSync(OUT + song + '.musicxml', r.musicXml);
    meta[song] = { pagesRead: r.pagesRead, pages: r.pages, backend: r.backend, durationMs: r.durationMs, wallMs: r.wallMs, pathNote: r.pathNote };
    console.log(song, JSON.stringify(meta[song]));
  }
  fs.writeFileSync(__dirname + '/checks/read-meta.json', JSON.stringify(meta, null, 1));
  fs.writeFileSync(__dirname + '/checks/console.log', logs.join('\n'));
  await ctx.close();
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
