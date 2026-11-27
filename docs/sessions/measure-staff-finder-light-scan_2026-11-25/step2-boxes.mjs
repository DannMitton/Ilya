// A page with homr's boxes outlined and numbered (2 and 5 in red).
// usage: node step2-boxes.mjs <workdir> <name> <out.png>
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire('/Users/dannmitton/Desktop/ilya-rewrite/apps/web/package.json');
const { chromium } = require('@playwright/test');
const [W, name, out] = process.argv.slice(2);
const boxes = JSON.parse(fs.readFileSync(`${W}/${name}.homr.json`)).staves;
const browser = await chromium.launch(); const page = await browser.newPage();
const b64 = await page.evaluate(async ({ s, boxes }) => {
	const b = await createImageBitmap(await (await fetch('data:image/png;base64,' + s)).blob());
	const k = 1400 / b.width; const c = new OffscreenCanvas(1400, Math.round(b.height * k)); const x = c.getContext('2d');
	x.drawImage(b, 0, 0, c.width, c.height); x.lineWidth = 3; x.font = 'bold 30px sans-serif';
	boxes.forEach((q, i) => { x.strokeStyle = x.fillStyle = i === 2 || i === 5 ? '#e00' : '#06c'; x.strokeRect((q.cx - q.w / 2) * c.width, (q.cy - q.h / 2) * c.height, q.w * c.width, q.h * c.height); x.fillText('box ' + i, (q.cx + q.w / 2) * c.width - 95, (q.cy - q.h / 2) * c.height + 30); });
	const u = new Uint8Array(await (await c.convertToBlob()).arrayBuffer()); let o = ''; for (let i = 0; i < u.length; i += 0x8000) o += String.fromCharCode(...u.subarray(i, i + 0x8000)); return btoa(o);
}, { s: fs.readFileSync(`${W}/${name}.png`).toString('base64'), boxes });
fs.writeFileSync(out, Buffer.from(b64, 'base64')); await browser.close();
const h = JSON.parse(fs.readFileSync(`${W}/${name}.dim.json`)).h, w = JSON.parse(fs.readFileSync(`${W}/${name}.dim.json`)).w;
boxes.forEach((q, i) => console.log(i, 'x', Math.round((q.cx - q.w / 2) * w), Math.round((q.cx + q.w / 2) * w), 'y', Math.round((q.cy - q.h / 2) * h), Math.round((q.cy + q.h / 2) * h)));
