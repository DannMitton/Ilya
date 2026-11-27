// Step 0e, second half, node: every box's staff and windows on the seven control pages, from scratch.ts, at the
// shipped constants (before) and under decisions 2 and 3 together (after). Writes step0e-staves.json.
// usage: node step0e-staves.mts <workdir>
import fs from 'node:fs';
import { P, staffIn, windowsOf, barLines } from './scratch.ts';
const D = process.argv[2] + '/';
const names = ['song1-p1', 'song2-p1', 'song3-p1', 'song4-p1', 'withoutsun-p4', 'withoutsun-p5', 'withoutsun-p6'];
const out: any = {};
for (const name of names) {
	const { w, h } = JSON.parse(fs.readFileSync(D + name + '.dim.json', 'utf8'));
	const data = new Uint8Array(fs.readFileSync(D + name + '.gray'));
	const g = { width: w, height: h, data };
	const boxes = JSON.parse(fs.readFileSync(D + name + '.homr.json', 'utf8')).staves;
	const bins = new Array(256).fill(0); for (const v of data) bins[v]++;
	let paper = 0; for (let k = 1; k < 256; k++) if (bins[k] > bins[paper]) paper = k;
	let c = 0, anchor = 255; for (let k = 0; k < 256; k++) { c += bins[k]; if (c >= data.length * 0.01) { anchor = k; break; } }
	const level = Math.round(anchor + 0.85 * (paper - anchor));
	out[name] = { level, paper, anchor };
	for (const [label, ink, ceil, inkG] of [['before', 140, 0.45, null], ['after', level, 0.65, 140]] as const) {
		P.ink = ink; P.ceil = ceil; P.inkG = inkG;
		out[name][label] = boxes.map((b: any, i: number) => {
			const st = staffIn(g, b);
			if (!st) return { st: null, windows: [], bars: [] };
			return { st, windows: windowsOf(g, st, i).map(({ staff, ...rest }) => rest), bars: barLines(g, st).map((q) => q.x1) };
		});
	}
	console.log(`${name}: level ${level} (paper ${paper}, anchor ${anchor}); boxes found before ${out[name].before.map((s: any, i: number) => (s.st ? i : '')).filter((v: any) => v !== '').join(',')} after ${out[name].after.map((s: any, i: number) => (s.st ? i : '')).filter((v: any) => v !== '').join(',')}`);
}
fs.writeFileSync(D + 'step0e-staves.json', JSON.stringify(out));
