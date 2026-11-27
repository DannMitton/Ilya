// Draws step 0c's lyric bands (blue) and cut rows (red boxes, numbered) on page 4, in four half-scale slices, to be looked at.
// usage: node step0c-overlay.mjs <workdir> <outdir>
import { createRequire } from 'node:module'; import fs from 'node:fs';
const require = createRequire('/Users/dannmitton/Desktop/ilya-rewrite/node_modules/.pnpm/@napi-rs+canvas@1.0.6/node_modules/x.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const [D, out] = process.argv.slice(2);
const img = await loadImage(fs.readFileSync(D + '/nightingale-p4.png'));
const bands = JSON.parse(fs.readFileSync(D + '/step0c-p4.rows.json'));
const cuts = [[880, 1960], [1920, 2940], [2900, 3920], [3880, 5160]];
cuts.forEach(([a, b], i) => {
	const c = createCanvas(2200, (b - a) / 2), x = c.getContext('2d');
	x.imageSmoothingQuality = 'high'; x.drawImage(img, 0, a, 4400, b - a, 0, 0, 2200, (b - a) / 2);
	for (const s of bands) {
		x.strokeStyle = 'blue'; x.lineWidth = 1;
		for (const y of [s.y0, s.y1]) { x.beginPath(); x.moveTo(0, (y - a) / 2); x.lineTo(2200, (y - a) / 2); x.stroke(); }
		s.rows.forEach((r, k) => { x.strokeStyle = 'red'; x.strokeRect(20 + (k % 2) * 6, (r.core[0] - a) / 2, 2100 - (k % 2) * 12, (r.core[1] - r.core[0]) / 2); x.fillStyle = 'red'; x.font = '16px sans-serif'; x.fillText(`s${s.staff} r${k}`, 2125, (r.core[0] - a) / 2 + 14); });
	}
	fs.writeFileSync(`${out}/rows${i}.png`, c.toBuffer('image/png'));
});
