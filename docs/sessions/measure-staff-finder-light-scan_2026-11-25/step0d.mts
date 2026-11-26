// step0d.mts <U> <CEIL> <anchor p1|p5>: per voice staff on every page, x0 x1 bars topLineBelow at shipped constants vs the candidate pair (A: every reader at the level; B: strokes and meanInk stay at 140).
import fs from 'node:fs';
import { P, staffIn, barLines } from './scratch.ts';
import { topLineBelow } from './scratch-below.ts';
const [U, C, an] = [Number(process.argv[2]), Number(process.argv[3]), process.argv[4] ?? 'p1'];
const D = process.env.HOME + '/Downloads/_desk-staffin-2026-11-25/work/code-lane/';
const names = ['nightingale-p4','nightingale-p2','nightingale-p3','nightingale-p5','song1-p1','song2-p1','song3-p1','song4-p1','withoutsun-p4','withoutsun-p5','withoutsun-p6'];
function measure(g, boxes, voice, lv, ceil, inkG) {
	P.ink = lv; P.ceil = ceil; P.inkG = inkG;
	return voice.map((i) => {
		const st = staffIn(g, boxes[i]);
		if (!st) return null;
		const bars = barLines(g, st).map((b) => b.x1);
		const nxt = boxes.filter((b, k) => k !== i && b.cy > boxes[i].cy).sort((a, b) => a.cy - b.cy)[0] ?? null;
		const tlb = topLineBelow(g, { box: boxes[i], staff: st }, nxt ? { box: nxt, staff: st } : null);
		return { x0: st.x0, x1: st.x1, bars, tlb, space: st.space };
	});
}
for (const n of names) {
	const { w, h } = JSON.parse(fs.readFileSync(D + n + '.dim.json'));
	const data = new Uint8Array(fs.readFileSync(D + n + '.gray'));
	const g = { width: w, height: h, data };
	const boxes = JSON.parse(fs.readFileSync(D + n + '.homr.json')).staves;
	const voice = boxes.map((b, i) => (b.h * h < 300 ? i : -1)).filter((i) => i >= 0);
	const bins = new Array(256).fill(0); for (const v of data) bins[v]++;
	let paper = 0; for (let k = 1; k < 256; k++) if (bins[k] > bins[paper]) paper = k;
	let c = 0, a = 255; for (let k = 0; k < 256; k++) { c += bins[k]; if (c >= data.length * (an === 'p1' ? 0.01 : 0.05)) { a = k; break; } }
	const L = Math.round(a + U * (paper - a));
	const S = measure(g, boxes, voice, 140, 0.45, null);
	const A = measure(g, boxes, voice, L, C, null);
	const B = measure(g, boxes, voice, L, C, 140);
	console.log(`\n${n}  level ${L} (paper ${paper}, anchor ${a})`);
	voice.forEach((bi, k) => {
		const f = (r) => (r ? `x ${r.x0}-${r.x1} bars ${r.bars.length}[${r.bars.map(Math.round).join(',')}] tlb ${r.tlb == null ? '-' : r.tlb.toFixed(1)}` : 'NULL');
		const d = (r) => (S[k] && r ? `dx0 ${r.x0 - S[k].x0} dx1 ${r.x1 - S[k].x1} dbars ${r.bars.length - S[k].bars.length} dtlb ${r.tlb != null && S[k].tlb != null ? (r.tlb - S[k].tlb).toFixed(1) : '?'}` : '');
		console.log(` box ${bi}: S ${f(S[k])}\n        A ${f(A[k])} ${d(A[k])}\n        B ${f(B[k])} ${d(B[k])}`);
	});
}
