// A cut of a page with lines marked, for the looks in the steps 1 and 2 report.
// usage: node step2-crop.mjs <png> <out.png> x0 y0 x1 y1 [v:<x>:<colour> | h:<y>:<colour> ...]
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire('/Users/dannmitton/Desktop/ilya-rewrite/apps/web/package.json');
const { chromium } = require('@playwright/test');
const [png, out, x0, y0, x1, y1, ...marks] = process.argv.slice(2);
const browser = await chromium.launch(); const page = await browser.newPage();
const b64 = await page.evaluate(async ({ s, r, marks }) => {
	const b = await createImageBitmap(await (await fetch('data:image/png;base64,' + s)).blob());
	const [x0, y0, x1, y1] = r; const k = Math.min(1600 / (x1 - x0), 900 / (y1 - y0));
	const c = new OffscreenCanvas((x1 - x0) * k, (y1 - y0) * k); const x = c.getContext('2d');
	x.drawImage(b, x0, y0, x1 - x0, y1 - y0, 0, 0, c.width, c.height);
	x.lineWidth = 2; x.font = '18px sans-serif';
	for (const m of marks) { const [t, v, col] = m.split(':'); x.strokeStyle = x.fillStyle = col; x.setLineDash([8, 4]); x.beginPath();
		if (t === 'v') { const p = (v - x0) * k; x.moveTo(p, 0); x.lineTo(p, c.height); x.stroke(); x.fillText(v, p + 3, 20); }
		else { const p = (v - y0) * k; x.moveTo(0, p); x.lineTo(c.width, p); x.stroke(); x.fillText(v, 5, p - 3); } }
	const u = new Uint8Array(await (await c.convertToBlob()).arrayBuffer()); let o = ''; for (let i = 0; i < u.length; i += 0x8000) o += String.fromCharCode(...u.subarray(i, i + 0x8000)); return btoa(o);
}, { s: fs.readFileSync(png).toString('base64'), r: [+x0, +y0, +x1, +y1], marks });
fs.writeFileSync(out, Buffer.from(b64, 'base64')); await browser.close();
