// Crops the Russian row's start under chosen staves with the cut band's top edge drawn in red, to be looked at.
// usage: node step0c-bandtop.mjs <workdir> <outpng>
import { createRequire } from 'node:module'; import fs from 'node:fs';
const require = createRequire('/Users/dannmitton/Desktop/ilya-rewrite/node_modules/.pnpm/@napi-rs+canvas@1.0.6/node_modules/x.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const [D, out] = process.argv.slice(2);
const img = await loadImage(fs.readFileSync(D + '/nightingale-p4.png'));
const bands = JSON.parse(fs.readFileSync(D + '/step0c-p4.rows.json'));
const pick = [0, 4, 6, 8, 12, 14];
const W = 700, H = 90, S = 3, c = createCanvas(W * S, H * S * pick.length), x = c.getContext('2d');
x.imageSmoothingEnabled = false;
pick.forEach((st, i) => {
	const b = bands.find((q) => q.staff === st), top = b.y0 - 35;
	x.drawImage(img, 740, top, W, H, 0, i * H * S, W * S, H * S);
	x.strokeStyle = 'red'; x.lineWidth = 2; x.beginPath(); x.moveTo(0, i * H * S + 35 * S); x.lineTo(W * S, i * H * S + 35 * S); x.stroke();
	x.fillStyle = 'blue'; x.font = '30px sans-serif'; x.fillText(`staff ${st}`, 8, i * H * S + 30);
	x.strokeStyle = 'blue'; x.beginPath(); x.moveTo(0, (i + 1) * H * S); x.lineTo(W * S, (i + 1) * H * S); x.stroke();
});
fs.writeFileSync(out, c.toBuffer('image/png'));
