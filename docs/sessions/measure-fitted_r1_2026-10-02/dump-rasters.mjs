// usage: node dump-rasters.mjs <outdir> <dpi>
// Writes the app's own 400 ppi rasters (rasterizePdf, pdf.js) of the Sunless PDF (sunless-pN.png) and the Tchaikovsky PDF (tch-pN.png) to <outdir>,
// so a Pyodide script can read the same bytes the Worker reads. Outside the repo (scratch).
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/dannmitton/Desktop/ilya-rewrite/apps/web/package.json');
const { chromium } = require('@playwright/test');
const [outdir, dpi] = process.argv.slice(2);
fs.mkdirSync(outdir, { recursive: true });
const PDFS = { sunless: process.env.HOME + '/Downloads/IMSLP113877-PMLP232488-Mussorgsky_-_Without_Sun.pdf', tch: process.env.HOME + '/Downloads/Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf' };
const b64 = Object.fromEntries(Object.entries(PDFS).map(([k, v]) => [k, fs.readFileSync(v).toString('base64')]));
const browser = await chromium.launch(); const page = await browser.newPage(); page.setDefaultTimeout(3000000);
if (dpi !== '400') await page.route(/\/src\/lib\/reader\/page-pdf\.ts/, async route => { const r = await route.fetch(); let body = await r.text(); body = body.replace('const TARGET_DPI = 400;', `const TARGET_DPI = ${dpi};`); await route.fulfill({ response: r, body }); });
await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
for (const k of Object.keys(PDFS)) {
  const pages = await page.evaluate(async ({ b64 }) => {
    const pp = await import('/src/lib/reader/page-pdf.ts');
    const f = new File([Uint8Array.from(atob(b64), c => c.charCodeAt(0))], 'x.pdf', { type: 'application/pdf' });
    const out = await pp.rasterizePdf(f);
    return out.map(ab => { const u = new Uint8Array(ab); let s = ''; for (let i = 0; i < u.length; i += 32768) s += String.fromCharCode.apply(null, u.subarray(i, i + 32768)); return btoa(s); });
  }, { b64: b64[k] });
  pages.forEach((b, i) => fs.writeFileSync(`${outdir}/${k}-p${i + 1}.png`, Buffer.from(b, 'base64')));
  console.log(k, pages.length, 'pages');
}
await browser.close();
