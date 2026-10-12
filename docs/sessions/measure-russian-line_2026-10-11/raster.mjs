// Row 80: Ilya's own rasterizePdf (page-pdf.ts, pdf.js, the dev server) on one PDF; writes each page's PNG and its size.
// Usage: node raster.mjs <pdf> <out prefix>
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path';
const require = createRequire(path.resolve(process.env.HOME, 'Desktop/ilya-rewrite/apps/web/package.json'));
const { chromium } = require('@playwright/test');
const [pdf, out] = process.argv.slice(2);
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await (await browser.newContext()).newPage();
await page.goto('http://localhost:5173/');
await page.waitForTimeout(3000);
const b64 = fs.readFileSync(pdf).toString('base64');
const pngs = await page.evaluate(async (b64) => {
	const { rasterizePdf } = await import('/src/lib/reader/page-pdf.ts');
	const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
	const file = new File([bytes], 'x.pdf', { type: 'application/pdf' });
	const pages = await rasterizePdf(file);
	return pages.map((p) => { const u = new Uint8Array(p); let s = ''; for (let i = 0; i < u.length; i += 8192) s += String.fromCharCode(...u.subarray(i, i + 8192)); return btoa(s); });
}, b64);
pngs.forEach((p, i) => fs.writeFileSync(`${out}-${i + 1}.png`, Buffer.from(p, 'base64')));
console.log(pngs.length, 'pages');
await browser.close();
