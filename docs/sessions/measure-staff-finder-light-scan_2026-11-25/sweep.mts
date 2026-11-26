// sweep.mts <prefix> <out.json> [inkLo inkHi inkStep]: absolute (ink level x ceiling) grid of the tree's staffIn (scratch copy), homr boxes.
import fs from 'node:fs';
import { P, staffIn } from './scratch.ts';
const [prefix, out, lo = '90', hi = '240', step = '5'] = process.argv.slice(2);
const { w, h } = JSON.parse(fs.readFileSync(prefix + '.dim.json', 'utf8'));
const data = new Uint8Array(fs.readFileSync(prefix + '.gray'));
const g = { width: w, height: h, data };
const boxes = JSON.parse(fs.readFileSync(prefix + '.homr.json', 'utf8')).staves ?? [];
const bins = new Array(256).fill(0); for (const v of data) bins[v]++;
let paper = 0; for (let k = 1; k < 256; k++) if (bins[k] > bins[paper]) paper = k;
const pct = (q) => { let c = 0; const n = data.length * q; for (let k = 0; k < 256; k++) { c += bins[k]; if (c >= n) return k; } return 255; };
const stats = { w, h, boxes: boxes.length, paper, p01: pct(0.001), p1: pct(0.01), p5: pct(0.05), p10: pct(0.1) };
const ceils = [0.35, 0.40, 0.45, 0.50, 0.55, 0.60, 0.65, 0.70, 0.80];
const grid = [];
for (let ink = Number(lo); ink <= Number(hi); ink += Number(step)) {
	for (const c of ceils) {
		P.ink = ink; P.ceil = c;
		const t0 = Date.now();
		const found = boxes.map((b) => (staffIn(g, b) ? 1 : 0));
		grid.push({ ink, ceil: c, found: found.reduce((a, b) => a + b, 0), flags: found.join('') });
	}
	process.stderr.write(`${prefix.split('/').pop()} ink ${ink}\r`);
}
fs.writeFileSync(out, JSON.stringify({ stats, grid }));
console.log(prefix.split('/').pop(), JSON.stringify(stats));
