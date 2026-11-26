// crop.mjs <prefix> <x0> <y0> <x1> <y1> <out.png> [scale] [vlines csv]: grey crop to PNG with vertical marker lines
import { createRequire } from 'node:module'; import fs from 'node:fs';
const require = createRequire('/Users/dannmitton/Desktop/ilya-rewrite/node_modules/.pnpm/@napi-rs+canvas@1.0.6/node_modules/x.js');
const { createCanvas } = require('@napi-rs/canvas');
const [prefix, x0, y0, x1, y1, out, sc = '1', vl = ''] = process.argv.slice(2);
const { w, h } = JSON.parse(fs.readFileSync(prefix + '.dim.json')); const g = fs.readFileSync(prefix + '.gray');
const W = x1 - x0, H = y1 - y0, s = Number(sc); const c = createCanvas(W * s, H * s); const x = c.getContext('2d');
const id = x.createImageData(W * s, H * s);
for (let yy = 0; yy < H * s; yy++) for (let xx = 0; xx < W * s; xx++) { const v = g[(+y0 + Math.floor(yy / s)) * w + (+x0 + Math.floor(xx / s))]; const o = (yy * W * s + xx) * 4; id.data[o] = id.data[o + 1] = id.data[o + 2] = v; id.data[o + 3] = 255; }
x.putImageData(id, 0, 0);
vl.split(',').filter(Boolean).forEach((v, i) => { x.strokeStyle = ['red', 'blue', 'green'][i % 3]; x.beginPath(); x.moveTo((v - x0) * s, 0); x.lineTo((v - x0) * s, H * s); x.stroke(); });
fs.writeFileSync(out, c.toBuffer('image/png'));
