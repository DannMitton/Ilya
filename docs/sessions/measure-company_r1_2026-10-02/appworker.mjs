// usage: node appworker.mjs out.json file.pdf clefsign line key
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/dannmitton/Desktop/ilya-rewrite/apps/web/package.json');
const { chromium } = require('@playwright/test');
const [out, pdf, sign, line, key] = process.argv.slice(2);
const b64 = fs.readFileSync(pdf).toString('base64');
const browser = await chromium.launch();
const page = await browser.newPage();
page.setDefaultTimeout(1200000);
await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
const res = await page.evaluate(async ({ b64, sign, line, key }) => {
  const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  const file = new File([bytes], 'x.pdf', { type: 'application/pdf' });
  const pp = await import('/src/lib/reader/page-pdf.ts');
  const pr = await import('/src/lib/reader/page-reader.ts');
  const t0 = performance.now();
  const pages = await pp.rasterizePdf(file);
  const rastS = (performance.now() - t0) / 1000;
  const reader = new pr.WorkerPageReader();
  const cfg = { clef: [sign, +line], key: +key, octaveChange: 0, pieceId: 'm' };
  const runs = [];
  for (let k = 0; k < 2; k++) {
    const t1 = performance.now();
    let r;
    try { r = await reader.read(pages.map(p => p.slice(0)), cfg); } catch (e) { r = { error: e }; }
    const wall = (performance.now() - t1) / 1000;
    runs.push({ wall, report: r.report, error: r.error, ids: r.ro && r.ro.verses[0].notes.map(n => n.id), n: r.ro && r.ro.verses[0].notes.length });
  }
  return { rastS, loadS: pr.WorkerPageReader.loadSeconds, runs };
}, { b64, sign, line, key });
fs.writeFileSync(out, JSON.stringify(res, null, 1));
console.log(JSON.stringify({ ...res, runs: res.runs.map(r => ({ ...r, ids: r.ids && r.ids.length })) }, null, 1));
await browser.close();
