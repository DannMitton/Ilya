// usage: node read-songs.mjs <outdir>
// Reads the five build songs on the app's own path (rasterizePdf + WorkerPageReader), clef G2, key given.
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/home/claude/ilya/apps/web/package.json');
const { chromium } = require('@playwright/test');
const [outdir] = process.argv.slice(2);
const IN = '/tmp/claude-0/-home-claude/cde67b8f-675a-5d24-aafe-021536ff667e/scratchpad/part22/in/';
const SONGS = [
  { n: 1, pages: [1, 2], key: 2, pdf: 'sun' },
  { n: 4, pages: [3, 4], key: 2, pdf: 'sun' },
  { n: 5, pages: [5, 6, 7, 8, 9, 10, 11], key: 0, pdf: 'sun' },
  { n: 6, pages: [12, 13, 14, 15, 16, 17], key: 7, pdf: 'sun' },
  { n: 7, pages: [1, 2, 3], key: 2, pdf: 'tch' },
];
fs.mkdirSync(outdir, { recursive: true });
const b64 = { sun: fs.readFileSync(IN + 'sunless-build-pages.pdf').toString('base64'), tch: fs.readFileSync(IN + 'tchaikovsky-op38-3.pdf').toString('base64') };
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--proxy-server=' + process.env.HTTPS_PROXY, '--proxy-bypass-list=localhost;127.0.0.1'] });
const page = await browser.newPage();
page.setDefaultTimeout(3000000);
await page.addInitScript(() => {
  for (const C of [Map, WeakMap]) {
    if (!C.prototype.getOrInsert) C.prototype.getOrInsert = function (k, v) { if (!this.has(k)) this.set(k, v); return this.get(k); };
    if (!C.prototype.getOrInsertComputed) C.prototype.getOrInsertComputed = function (k, f) { if (!this.has(k)) this.set(k, f(k)); return this.get(k); };
  }
});
page.on('console', m => { if (m.type() === 'error') console.log('console error:', m.text().slice(0, 200)); });
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' }); await page.waitForTimeout(3000);
const res = await page.evaluate(async ({ b64, SONGS }) => {
  const mk = (x) => new File([Uint8Array.from(atob(x), c => c.charCodeAt(0))], 'x.pdf', { type: 'application/pdf' });
  const pp = await import('/src/lib/reader/page-pdf.ts');
  const pr = await import('/src/lib/reader/page-reader.ts');
  const pagesBy = { sun: await pp.rasterizePdf(mk(b64.sun)), tch: await pp.rasterizePdf(mk(b64.tch)) };
  const reader = new pr.WorkerPageReader();
  const out = [];
  for (const s of SONGS) {
    const cfg = { clef: ['G', 2], key: s.key, octaveChange: 0, pieceId: 'm' };
    const pages = pagesBy[s.pdf];
    const song = pages.filter((_, i) => s.pages.includes(i + 1)).map(p => p.slice(0));
    const t0 = performance.now();
    let r; try { r = await reader.read(song, cfg); } catch (e) { r = { error: String(e) }; }
    const wall = (performance.now() - t0) / 1000;
    out.push({ n: s.n, pages: s.pages, cfg, wall, pageDims: song.map(p => [p.width, p.height]), ro: r.ro, report: r.report, error: r.error });
  }
  return out;
}, { b64, SONGS });
for (const s of res) {
  fs.writeFileSync(`${outdir}/song${s.n}.raw.json`, JSON.stringify(s));
  console.log(`song ${s.n}: wall ${s.wall.toFixed(1)} s; dims ${JSON.stringify(s.pageDims)}; notes ${s.report && s.report.notes}; rests ${s.report && s.report.rests}; measures ${s.report && s.report.measures}; failed ${s.report && JSON.stringify(s.report.failedPages)} ${s.error || ''}`);
}
await browser.close();
