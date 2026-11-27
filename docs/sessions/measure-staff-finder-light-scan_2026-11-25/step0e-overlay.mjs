// Draws song2's first system with its lyric band (blue) and cut rows (red), before over after, and beside them each
// row's own crop, to be looked at. usage: node step0e-overlay.mjs <workdir> <out-overlay.png> <out-rows.png>
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire('/Users/dannmitton/Desktop/ilya-rewrite/node_modules/.pnpm/@napi-rs+canvas@1.0.6/node_modules/x.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const [D, outA, outB] = process.argv.slice(2);
const img = await loadImage(fs.readFileSync(D + '/song2-p1.png'));
const j = JSON.parse(fs.readFileSync(D + '/step0e-song2.rows.json', 'utf8'));
const Y0 = 1040, Y1 = 1760, S = 0.5, H = (Y1 - Y0) * S;
const a = createCanvas(img.width * S, H * 2 + 60), x = a.getContext('2d');
x.fillStyle = 'white'; x.fillRect(0, 0, a.width, a.height); x.imageSmoothingQuality = 'high';
['before', 'after'].forEach((k, i) => {
	const oy = i * (H + 30) + 30, s = j[k][0];
	x.drawImage(img, 0, Y0, img.width, Y1 - Y0, 0, oy, img.width * S, H);
	x.fillStyle = 'black'; x.font = '24px sans-serif'; x.fillText(`${k}: band y ${s.band.y0}-${s.band.y1}`, 10, oy - 8);
	x.strokeStyle = 'blue'; x.lineWidth = 2;
	for (const y of [s.band.y0, s.band.y1]) { x.beginPath(); x.moveTo(0, oy + (y - Y0) * S); x.lineTo(a.width, oy + (y - Y0) * S); x.stroke(); }
	s.rows.forEach((r, n) => { x.strokeStyle = 'red'; x.lineWidth = 1; x.strokeRect(60, oy + (r.core[0] - Y0) * S, a.width - 200, (r.core[1] - r.core[0]) * S); x.fillStyle = 'red'; x.fillText(`row ${n}`, a.width - 120, oy + (r.core[0] - Y0) * S + 18); });
});
fs.writeFileSync(outA, a.toBuffer('image/png'));
const list = ['before', 'after'].flatMap((k) => j[k][0].rows.map((r, n) => ({ k, n, r })));
const b = createCanvas(img.width * S, list.reduce((t, q) => t + (q.r.y1 - q.r.y0) * S + 34, 0)), z = b.getContext('2d');
z.fillStyle = '#ffd'; z.fillRect(0, 0, b.width, b.height);
let top = 0;
for (const q of list) {
	z.fillStyle = 'black'; z.font = '22px sans-serif'; z.fillText(`${q.k} row ${q.n}: y ${q.r.y0}-${q.r.y1}`, 10, top + 24);
	z.drawImage(img, 0, q.r.y0, img.width, q.r.y1 - q.r.y0, 0, top + 32, img.width * S, (q.r.y1 - q.r.y0) * S);
	top += (q.r.y1 - q.r.y0) * S + 34;
}
fs.writeFileSync(outB, b.toBuffer('image/png'));
