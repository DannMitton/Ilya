// togray.mjs <png> <outprefix>: raw uint8 red channel (what the workers read) + dim json.
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire('/Users/dannmitton/Desktop/ilya-rewrite/node_modules/.pnpm/@napi-rs+canvas@1.0.6/node_modules/x.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const img = await loadImage(fs.readFileSync(process.argv[2]));
const c = createCanvas(img.width, img.height); const x = c.getContext('2d'); x.drawImage(img, 0, 0);
const d = x.getImageData(0, 0, img.width, img.height).data;
const g = new Uint8Array(img.width * img.height); for (let i = 0; i < g.length; i++) g[i] = d[i * 4];
fs.writeFileSync(process.argv[3] + '.gray', g);
fs.writeFileSync(process.argv[3] + '.dim.json', JSON.stringify({ w: img.width, h: img.height }));
console.log(img.width, img.height);
