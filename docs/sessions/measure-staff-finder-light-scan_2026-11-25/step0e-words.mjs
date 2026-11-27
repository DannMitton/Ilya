// Crops song2's first words with the lyric band's top edge drawn (red before, blue after), to be looked at.
// usage: node step0e-words.mjs <workdir> <outpng>
import { createRequire } from 'node:module'; import fs from 'node:fs';
const require = createRequire('/Users/dannmitton/Desktop/ilya-rewrite/node_modules/.pnpm/@napi-rs+canvas@1.0.6/node_modules/x.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const [D, out] = process.argv.slice(2);
const img = await loadImage(fs.readFileSync(D + '/song2-p1.png'));
const j = JSON.parse(fs.readFileSync(D + '/step0e-song2.rows.json', 'utf8'));
const X = 3420, Y = 1195, W = 480, H = 110, S = 4, c = createCanvas(W * S, H * S), x = c.getContext('2d');
x.imageSmoothingEnabled = false; x.drawImage(img, X, Y, W, H, 0, 0, W * S, H * S);
for (const [k, colour] of [['before', 'red'], ['after', 'blue']]) {
	const y = (j[k][0].band.y0 - Y) * S; x.strokeStyle = colour; x.lineWidth = 2; x.beginPath(); x.moveTo(0, y); x.lineTo(W * S, y); x.stroke();
}
fs.writeFileSync(out, c.toBuffer('image/png'));
