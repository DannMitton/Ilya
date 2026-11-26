// stepbars.mts <U> <CEIL>: sweep the glyph-reader level (strokes, meanInk) in the same units; box 1 of nightingale-p4 has 8 true bars (desk count, crops 2026-11-25: 993,1338,1734,2045,2493,2812,3373,3593).
import fs from 'node:fs';
import { P, staffIn, barLines } from './scratch.ts';
const [U, C] = [Number(process.argv[2]), Number(process.argv[3])];
const D = process.env.HOME + '/Downloads/_desk-staffin-2026-11-25/work/code-lane/';
const names = ['nightingale-p4','nightingale-p2','nightingale-p3','nightingale-p5','song1-p1','song2-p1','song3-p1','song4-p1','withoutsun-p4','withoutsun-p5','withoutsun-p6'];
const truth = [993, 1338, 1734, 2045, 2493, 2812, 3373, 3593];
const load = (n) => { const { w, h } = JSON.parse(fs.readFileSync(D + n + '.dim.json')); const data = new Uint8Array(fs.readFileSync(D + n + '.gray')); const boxes = JSON.parse(fs.readFileSync(D + n + '.homr.json')).staves; const bins = new Array(256).fill(0); for (const v of data) bins[v]++; let paper = 0; for (let k = 1; k < 256; k++) if (bins[k] > bins[paper]) paper = k; let c = 0, a = 255; for (let k = 0; k < 256; k++) { c += bins[k]; if (c >= data.length * 0.01) { a = k; break; } } return { g: { width: w, height: h, data }, boxes, voice: boxes.map((b, i) => (b.h * h < 300 ? i : -1)).filter((i) => i >= 0), paper, a, n }; };
const pages = names.map(load);
const ship = new Map();
for (const p of pages) { P.ink = 140; P.ceil = 0.45; P.inkG = null; for (const i of p.voice) { const st = staffIn(p.g, p.boxes[i]); if (st) ship.set(p.n + i, barLines(p.g, st).map((b) => b.x1)); } }
for (let ug = 0.30; ug <= 0.851; ug += 0.05) {
	let same = 0, tot = 0; let n4b1 = '';
	for (const p of pages) {
		P.ink = Math.round(p.a + U * (p.paper - p.a)); P.ceil = C; P.inkG = Math.round(p.a + ug * (p.paper - p.a));
		for (const i of p.voice) {
			const st = staffIn(p.g, p.boxes[i]); if (!st) continue;
			const bars = barLines(p.g, st).map((b) => b.x1);
			if (p.n === 'nightingale-p4' && i === 1) { const hit = truth.filter((t) => bars.some((b) => Math.abs(b - t) < 8)).length; n4b1 = `${bars.length} bars, ${hit}/8 true, ${bars.length - hit} extra`; }
			const s = ship.get(p.n + i); if (s) { tot++; if (s.length === bars.length && s.every((x, k) => Math.abs(x - bars[k]) < 8)) same++; }
		}
	}
	console.log(`u_g ${ug.toFixed(2)}  controls bars equal to shipped: ${same}/${tot}   n4 box1: ${n4b1}`);
}
