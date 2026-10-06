const { createRequire } = require('module');
const req = createRequire('/Users/dannmitton/Desktop/ilya-rewrite/apps/web/package.json');
const { chromium } = req('@playwright/test');
const fs = require('fs'), os = require('os'), path = require('path');
const P = __dirname + '/pages/', OUT = __dirname + '/out/';
const pages = ['t-05', 't-06', 't-07', 't-08'];
const mode = process.argv[2]; // gpu | wasm
(async () => {
  const ctx = await chromium.launchPersistentContext(fs.mkdtempSync(path.join(os.tmpdir(), 'pw-chrome-')), { channel: 'chrome', headless: false, args: mode === 'wasm' ? ['--disable-gpu'] : [], viewport: { width: 1440, height: 900 } });
  const page = ctx.pages()[0] || await ctx.newPage();
  await page.goto('http://localhost:5199/');
  await page.waitForSelector('[role=tab]', { timeout: 120000 });
  await page.bringToFront();
  const b64 = pages.map(p => fs.readFileSync(P + p + '.png').toString('base64'));
  const read = (idx) => page.evaluate(async ({ b64, idx }) => {
    const { readScanPages } = await import('/src/lib/omr/homr-reader.ts');
    const blobs = idx.map(i => new Blob([Uint8Array.from(atob(b64[i]), c => c.charCodeAt(0))], { type: 'image/png' }));
    const r = await readScanPages(blobs);
    return { ...r, vis: document.visibilityState };
  }, { b64, idx });
  const jobs = mode === 'wasm' ? [[0, 1, 2, 3], [0], [1], [2], [3]] : [[0], [1], [2], [3]];
  for (const idx of jobs) {
    const r = await read(idx);
    const tag = idx.length === 4 ? 'whole' : 'p' + (idx[0] + 1);
    console.log(mode, tag, r.ok, r.backend, r.durationMs, r.vis, r.pathNote || '');
    if (r.ok) fs.writeFileSync(`${OUT}s3d-${mode}-${tag}.musicxml`, r.musicXml);
  }
  await ctx.close();
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
