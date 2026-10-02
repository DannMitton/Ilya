// usage: node read-renders.mjs <outdir> '<cfgOverridesJson>'
// Reads each Sunless render song (the Verovio pages under tools/e16-harness/output/<song>/repaired/) on the app's own path
// (WorkerPageReader, no `vocal` list), with the clef and key given. Build songs 1,4,5,6 -> <outdir>; test-only songs 2,3 -> <outdir>/test-private/
// (never opened by the author; only totals are printed, by the scorer).
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/dannmitton/Desktop/ilya-rewrite/apps/web/package.json');
const { chromium } = require('@playwright/test');
const [outdir, overJson] = process.argv.slice(2);
const over = JSON.parse(overJson || '{}');
const OUT = '/Users/dannmitton/Desktop/ilya-rewrite/tools/e16-harness/output/';
const SONGS = [
  { n: 1, dir: 'mussorgsky---sunless-01---within-four-walls', pages: 2, key: 2, role: 'build' },
  { n: 2, dir: 'mussorgsky---sunless-02---you-did-not-recognize-me', pages: 2, key: 2, role: 'test' },
  { n: 3, dir: 'mussorgsky---sunless-03---finished-is-the-noisy-idle-day', pages: 5, key: 0, role: 'test' },
  { n: 4, dir: 'mussorgsky---sunless-04---be-bored', pages: 3, key: 2, role: 'build' },
  { n: 5, dir: 'mussorgsky---sunless-05---elegy', pages: 6, key: 0, role: 'build' },
  { n: 6, dir: 'mussorgsky---sunless-06---on-the-river', pages: 6, key: 7, role: 'build' },
];
fs.mkdirSync(outdir, { recursive: true }); fs.mkdirSync(outdir + '/test-private', { recursive: true });
const data = SONGS.map(s => ({ ...s, b64: Array.from({ length: s.pages }, (_, i) => fs.readFileSync(`${OUT}${s.dir}/repaired/page${i + 1}_300dpi.png`).toString('base64')) }));
const browser = await chromium.launch();
const page = await browser.newPage();
page.setDefaultTimeout(3000000);
await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
const res = await page.evaluate(async ({ data, over }) => {
  const pr = await import('/src/lib/reader/page-reader.ts');
  const reader = new pr.WorkerPageReader();
  const out = [];
  for (const s of data) {
    const cfg = { clef: ['G', 2], key: s.key, octaveChange: 0, pieceId: 'm', ...over };
    const pages = s.b64.map(b => Uint8Array.from(atob(b), c => c.charCodeAt(0)).buffer);
    const t0 = performance.now();
    let r; try { r = await reader.read(pages, cfg); } catch (e) { r = { error: String(e) }; }
    out.push({ n: s.n, role: s.role, pages: s.pages, cfg, wall: (performance.now() - t0) / 1000, ro: r.ro, report: r.report, error: r.error });
  }
  return out;
}, { data, over });
for (const s of res) {
  const dir = s.role === 'test' ? outdir + '/test-private' : outdir;
  fs.writeFileSync(`${dir}/song${s.n}.read.json`, JSON.stringify(s));
  console.log(`render song ${s.n} (${s.role}): wall ${s.wall.toFixed(1)} s; notes ${s.report && s.report.notes}; failed ${s.report && JSON.stringify(s.report.failedPages)} ${s.error || ''}`);
}
await browser.close();
