// Crops the seven printed time signatures side by side, with a page-x ruler every 10 px, to read each digit's width by eye.
// usage: node step0c-sigs.mjs <workdir> <outpng>
import { createRequire } from 'node:module'; import fs from 'node:fs';
const require = createRequire('/Users/dannmitton/Desktop/ilya-rewrite/node_modules/.pnpm/@napi-rs+canvas@1.0.6/node_modules/x.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const [D, out] = process.argv.slice(2);
const img = await loadImage(fs.readFileSync(D + '/nightingale-p4.png'));
const st = JSON.parse(fs.readFileSync(D + '/step0c-p4.staves.json'));
const pick = [0, 4, 6, 8, 10, 12, 14];
const X = 780, W = 120, H = 110, S = 4, c = createCanvas(W * S * 4, (H * S + 30) * 2), x = c.getContext('2d');
x.fillStyle = 'white'; x.fillRect(0, 0, c.width, c.height); x.imageSmoothingEnabled = false;
pick.forEach((b, i) => {
	const l = st[b].st.ls[0], y = Math.round(l[2]) - 55, ox = (i % 4) * W * S, oy = Math.floor(i / 4) * (H * S + 30);
	x.drawImage(img, X, y, W, H, ox, oy + 30, W * S, H * S);
	x.fillStyle = 'black'; x.font = '14px sans-serif';
	for (let px = X; px < X + W; px += 10) { x.fillRect(ox + (px - X) * S, oy + 22, 1, 8); if (px % 20 === 0) x.fillText(String(px), ox + (px - X) * S - 10, oy + 20); }
	x.fillStyle = 'blue'; x.fillText(`box ${b}`, ox + 6, oy + 48);
});
fs.writeFileSync(out, c.toBuffer('image/png'));
