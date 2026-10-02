// usage: node read-songs.mjs <outdir> <build|test|all>
// Reads each song of the Sunless scan on the app's own path (rasterizePdf + WorkerPageReader),
// with the clef and key given. Writes events JSON for the BUILD songs into <outdir>.
// For the TEST-ONLY songs it writes only to <outdir>/test-private/ (never opened by the author) and prints totals.
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/dannmitton/Desktop/ilya-rewrite/apps/web/package.json');
const { chromium } = require('@playwright/test');
const [outdir, which] = process.argv.slice(2);
const PDF = process.env.HOME + '/Downloads/IMSLP113877-PMLP232488-Mussorgsky_-_Without_Sun.pdf';
const SONGS = [
  { n: 1, pages: [1, 2], key: 2, role: 'build' },
  { n: 2, pages: [3, 4], key: 2, role: 'test' },
  { n: 3, pages: [5, 6, 7, 8], key: 0, role: 'test' },
  { n: 4, pages: [9, 10], key: 2, role: 'build' },
  { n: 5, pages: [11, 12, 13, 14, 15, 16, 17], key: 0, role: 'build' },
  { n: 6, pages: [18, 19, 20, 21, 22, 23], key: 7, role: 'build' },
].filter(s => which === 'all' || s.role === which);
fs.mkdirSync(outdir, { recursive: true }); fs.mkdirSync(outdir + '/test-private', { recursive: true });
const b64 = fs.readFileSync(PDF).toString('base64');
const browser = await chromium.launch();
const page = await browser.newPage();
page.setDefaultTimeout(3000000);
await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
const res = await page.evaluate(async ({ b64, SONGS }) => {
  const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  const file = new File([bytes], 'x.pdf', { type: 'application/pdf' });
  const pp = await import('/src/lib/reader/page-pdf.ts');
  const pr = await import('/src/lib/reader/page-reader.ts');
  const pages = await pp.rasterizePdf(file);
  const reader = new pr.WorkerPageReader();
  const out = [];
  for (const s of SONGS) {
    const cfg = { clef: ['G', 2], key: s.key, octaveChange: 0, pieceId: 'm' };
    const song = pages.filter((_, i) => s.pages.includes(i + 1)).map(p => p.slice(0));
    const t0 = performance.now();
    let r; try { r = await reader.read(song, cfg); } catch (e) { r = { error: String(e) }; }
    const wall = (performance.now() - t0) / 1000;
    const per = [];
    for (const pn of s.pages) {
      const t1 = performance.now();
      try { await reader.read([pages[pn - 1].slice(0)], cfg); } catch (e) {}
      per.push({ page: pn, seconds: (performance.now() - t1) / 1000 });
    }
    out.push({ n: s.n, role: s.role, pages: s.pages, cfg, wall, per, ro: r.ro, report: r.report, error: r.error });
  }
  return out;
}, { b64, SONGS });
for (const s of res) {
  const dir = s.role === 'test' ? outdir + '/test-private' : outdir;
  fs.writeFileSync(`${dir}/song${s.n}.read.json`, JSON.stringify(s));
  console.log(`song ${s.n} (${s.role}): wall ${s.wall.toFixed(1)} s; readSeconds ${s.report && s.report.readSeconds}; per page ${s.per.map(p => p.page + ':' + p.seconds.toFixed(1)).join(' ')}; notes ${s.report && s.report.notes}; rests ${s.report && s.report.rests}; measures ${s.report && s.report.measures}; failed ${s.report && JSON.stringify(s.report.failedPages)} ${s.error || ''}`);
}
await browser.close();
