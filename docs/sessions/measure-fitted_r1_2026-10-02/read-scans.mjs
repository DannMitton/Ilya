// usage: node read-scans.mjs <dpi> <outdir> <songs: comma list e.g. 1,4,5,6,2,3,7>
// Reads the scan songs on the app's own path with the PDF rasterized by the app's own pdf.js module at <dpi>.
// For dpi != 400 the page-pdf.ts module is served with its TARGET_DPI constant replaced (a route rewrite in the harness; product code unchanged).
// Test-only songs (2,3) go to <outdir>/test-private/ and only totals are printed by the scorer. Peak resident memory of the browser processes is sampled.
import { createRequire } from 'module';
import fs from 'fs';
import { execSync } from 'child_process';
const require = createRequire('/Users/dannmitton/Desktop/ilya-rewrite/apps/web/package.json');
const { chromium } = require('@playwright/test');
const [dpi, outdir, which] = process.argv.slice(2);
const want = which.split(',').map(Number);
const PDF = process.env.HOME + '/Downloads/IMSLP113877-PMLP232488-Mussorgsky_-_Without_Sun.pdf';
const PDF7 = process.env.HOME + '/Downloads/Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf';
const ALL = [
  { n: 1, pages: [1, 2], key: 2, role: 'build' },
  { n: 2, pages: [3, 4], key: 2, role: 'test' },
  { n: 3, pages: [5, 6, 7, 8], key: 0, role: 'test' },
  { n: 4, pages: [9, 10], key: 2, role: 'build' },
  { n: 5, pages: [11, 12, 13, 14, 15, 16, 17], key: 0, role: 'build' },
  { n: 6, pages: [18, 19, 20, 21, 22, 23], key: 7, role: 'build' },
  { n: 7, pages: [1, 2, 3], key: 2, role: 'build', pdf: 7 },
];
const SONGS = ALL.filter(s => want.includes(s.n));
fs.mkdirSync(outdir, { recursive: true }); fs.mkdirSync(outdir + '/test-private', { recursive: true });
const b64 = fs.readFileSync(PDF).toString('base64');
const b64t = fs.readFileSync(PDF7).toString('base64');
let peak = 0;
let rootPid = 0;
const sample = () => { try {
  if (!rootPid) return;
  const rows = execSync("ps -axo pid=,ppid=,rss=").toString().trim().split('\n').map(l => l.trim().split(/\s+/).map(Number));
  const kids = new Map(); for (const [pid, ppid, rss] of rows) { if (!kids.has(ppid)) kids.set(ppid, []); kids.get(ppid).push([pid, rss]); }
  const rss = new Map(rows.map(r => [r[0], r[2]]));
  let sum = rss.get(rootPid) || 0; const st = [rootPid];
  while (st.length) { const p = st.pop(); for (const [c, r] of (kids.get(p) || [])) { sum += r; st.push(c); } }
  peak = Math.max(peak, sum);
} catch {} };
const timer = setInterval(sample, 1500);
const browser = await chromium.launch();
rootPid = process.pid; // the Playwright browser is our child; its processes descend from this node process
const page = await browser.newPage();
page.setDefaultTimeout(7200000);
page.on('console', m => { const t = m.text(); if (t.startsWith('H:')) console.log(t); });
if (dpi !== '400') {
  await page.route(/\/src\/lib\/reader\/page-pdf\.ts/, async route => {
    const r = await route.fetch(); let body = await r.text();
    if (!/const TARGET_DPI = 400;/.test(body)) throw new Error('TARGET_DPI constant not found in the served module');
    body = body.replace('const TARGET_DPI = 400;', `const TARGET_DPI = ${dpi};`);
    await route.fulfill({ response: r, body });
  });
}
await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
const t0 = Date.now();
const res = await page.evaluate(async ({ b64, b64t, SONGS }) => {
  const mk = (x) => new File([Uint8Array.from(atob(x), c => c.charCodeAt(0))], 'x.pdf', { type: 'application/pdf' });
  const pp = await import('/src/lib/reader/page-pdf.ts');
  const pr = await import('/src/lib/reader/page-reader.ts');
  const r0 = performance.now();
  const pagesBy = { 0: SONGS.some(s => !s.pdf) ? await pp.rasterizePdf(mk(b64)) : null, 7: SONGS.some(s => s.pdf === 7) ? await pp.rasterizePdf(mk(b64t)) : null };
  const rasterSeconds = (performance.now() - r0) / 1000;
  const reader = new pr.WorkerPageReader();
  const out = [];
  for (const s of SONGS) {
    const cfg = { clef: ['G', 2], key: s.key, octaveChange: 0, pieceId: 'm' };
    const pages = pagesBy[s.pdf || 0];
    const song = pages.filter((_, i) => s.pages.includes(i + 1)).map(p => p.slice(0));
    const bytes = song.reduce((a, p) => a + p.byteLength, 0);
    const t0 = performance.now();
    let r; try { r = await reader.read(song, cfg); } catch (e) { r = { error: JSON.stringify(e) + String(e) }; }
    const wall = (performance.now() - t0) / 1000;
    console.log(`H:song ${s.n} wall ${wall.toFixed(1)} s ${r.error || ''}`);
    out.push({ n: s.n, role: s.role, pages: s.pages, cfg, wall, pngBytes: bytes, ro: r.ro, report: r.report, error: r.error });
  }
  return { out, rasterSeconds };
}, { b64, b64t, SONGS });
clearInterval(timer); sample();
fs.writeFileSync(`${outdir}/run.json`, JSON.stringify({ dpi, rasterSeconds: res.rasterSeconds, peakRssKB: peak, totalSeconds: (Date.now() - t0) / 1000 }));
for (const s of res.out) {
  const dir = s.role === 'test' ? outdir + '/test-private' : outdir;
  fs.writeFileSync(`${dir}/song${s.n}.read.json`, JSON.stringify(s));
  console.log(`song ${s.n} (${s.role}): wall ${s.wall.toFixed(1)} s; readSeconds ${s.report && s.report.readSeconds}; png ${(s.pngBytes / 1e6).toFixed(1)} MB; staffSpace ${s.report && s.report.staffSpace.map(x => x.toFixed(1)).join(',')}; notes ${s.report && s.report.notes}; failed ${s.report && JSON.stringify(s.report.failedPages)} ${s.error || ''}`);
}
console.log(`dpi ${dpi}: raster ${res.rasterSeconds.toFixed(1)} s; peak resident memory of this Playwright browser's own processes ${(peak / 1e6).toFixed(2)} GB`);
await browser.close();
