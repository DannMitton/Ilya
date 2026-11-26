// sweep2.mts <prefix> <out.json>: grid in the rule's own units: level = anchor + u*(paper - anchor), anchor in {p01,p1,p5}; u 0.30..0.95 by 0.01; ceil 0.35..1.00 by 0.05.
import fs from 'node:fs';
import { P, staffIn } from './scratch.ts';
const [prefix, out] = process.argv.slice(2);
const { w, h } = JSON.parse(fs.readFileSync(prefix + '.dim.json', 'utf8'));
const data = new Uint8Array(fs.readFileSync(prefix + '.gray'));
const g = { width: w, height: h, data };
const boxes = JSON.parse(fs.readFileSync(prefix + '.homr.json', 'utf8')).staves ?? [];
const bins = new Array(256).fill(0); for (const v of data) bins[v]++;
let paper = 0; for (let k = 1; k < 256; k++) if (bins[k] > bins[paper]) paper = k;
const pct = (q) => { let c = 0; const n = data.length * q; for (let k = 0; k < 256; k++) { c += bins[k]; if (c >= n) return k; } return 255; };
const anchors = { p01: pct(0.001), p1: pct(0.01), p5: pct(0.05) };
const res = { stats: { w, h, boxes: boxes.length, paper, ...anchors }, grid: {} };
for (const [an, a] of Object.entries(anchors)) {
	res.grid[an] = [];
	for (let u100 = 30; u100 <= 95; u100++) {
		const level = Math.round(a + (u100 / 100) * (paper - a));
		const row = [];
		for (let c100 = 35; c100 <= 100; c100 += 5) {
			P.ink = level; P.ceil = c100 / 100;
			row.push(boxes.map((b) => (staffIn(g, b) ? 1 : 0)).join(''));
		}
		res.grid[an].push({ u: u100 / 100, level, row });
	}
}
fs.writeFileSync(out, JSON.stringify(res));
console.log(prefix.split('/').pop(), 'done');
