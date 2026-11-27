// Step 2: a look at some of what the shipped ceiling rejects. For each pick (page, box, which: 'on' the box's staff or
// 'off' it), the median-thickness group of that kind from step2-rejects.json, cut from the page with four spaces
// around it, the strip it came from marked by ticks at each of its five rows. One sheet.
// usage: node step2-crops.mjs <workdir> <out.png> <page:box:on|off> ...
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire('/Users/dannmitton/Desktop/ilya-rewrite/apps/web/package.json');
const { chromium } = require('@playwright/test');
const [W, out, ...picks] = process.argv.slice(2);
const rejects = JSON.parse(fs.readFileSync(W + '/step2-rejects.json', 'utf8'));
const items = picks.map((p) => {
	const [name, box, which] = p.split(':');
	const e = rejects[name].find((r) => r.box === Number(box));
	const on = (g) => e.mid !== null && Math.abs(g.c[2] - e.mid) < 2 * (e.space ?? g.s);
	const list = e.got.filter((g) => (which === 'on' ? on(g) : !on(g))).sort((a, b) => a.th / a.s - b.th / b.s);
	const g = list[list.length >> 1];
	return { name, label: `${name} box ${box} ${which} the staff: thickness ${(g.th / g.s).toFixed(2)}, group space ${g.s.toFixed(1)}, staff space ${e.space?.toFixed(1)}`, g };
});
let current;
const browser = await chromium.launch();
const ctx = await browser.newContext();
await ctx.route('**/__m/p.png**', (r) => r.fulfill({ body: fs.readFileSync(`${W}/${current}.png`), contentType: 'image/png' }));
await ctx.route('**/__m/', (r) => r.fulfill({ body: '<html></html>', contentType: 'text/html' }));
const page = await ctx.newPage();
await page.goto('http://localhost:5173/__m/');
await page.evaluate((n) => { window.c = document.createElement('canvas'); c.width = 1400; c.height = Math.ceil(n / 2) * 460; const x = c.getContext('2d'); x.fillStyle = '#9cf'; x.fillRect(0, 0, c.width, c.height); }, items.length);
for (let i = 0; i < items.length; i++) {
	current = items[i].name;
	await page.evaluate(async ({ it, i }) => {
		const b = await createImageBitmap(await (await fetch('/__m/p.png?' + it.name)).blob());
		const { g } = it;
		const s = g.s, w = 16 * s, h = 12 * s;
		const sx = (g.x0 + g.x1) / 2 - w / 2, sy = g.c[2] - h / 2;
		const k = Math.min(696 / w, 436 / h);
		const x = c.getContext('2d');
		const dx = (i % 2) * 700, dy = Math.floor(i / 2) * 460;
		x.imageSmoothingEnabled = false;
		x.drawImage(b, sx, sy, w, h, dx, dy + 20, w * k, h * k);
		x.strokeStyle = '#e00'; x.lineWidth = 2;
		for (const y of g.c) { const py = dy + 20 + (y - sy) * k; for (const xx of [g.x0, g.x1]) { const px = dx + (xx - sx) * k; x.beginPath(); x.moveTo(px - 8, py); x.lineTo(px + 8, py); x.stroke(); } }
		x.fillStyle = '#000'; x.font = '14px sans-serif'; x.fillText(it.label, dx + 4, dy + 15);
	}, { it: items[i], i });
}
const b64 = await page.evaluate(() => c.toDataURL('image/png').split(',')[1]);
fs.writeFileSync(out, Buffer.from(b64, 'base64'));
console.log(items.map((i) => i.label).join('\n'));
await browser.close();
