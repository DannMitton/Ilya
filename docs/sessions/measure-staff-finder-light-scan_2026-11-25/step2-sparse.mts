// Step 2: where a sparse light page breaks the level. Nightingale page 4 with all but its first k staves painted out
// (the rows `staffIn` searches for those boxes kept, everything else the page's paper tone), through the working
// tree's `inkLevels` and `staffIn`; then the same with the rows above the first staff left in (the printed heading).
// usage: node step2-sparse.mts <workdir>
import { TREE, loadPage } from './step-lib.mts';

const W = process.argv[2];
const m = await import(TREE + '/metre-windows.ts');
const { paperTone } = await import(TREE + '/underlay-frame.ts');
const { toneAt } = await import(TREE + '/underlay-looks.ts');
const p = await loadPage(W, 'nightingale-p4');
const { width: w, height: h } = p.g;
const paper = paperTone(p.g.data);
const order = p.boxes.map((_, i) => i).sort((a, b) => p.boxes[a].cy - p.boxes[b].cy);
for (const heading of [false, true]) {
	console.log(heading ? '\nwith everything above the first staff left in' : 'only the kept staves');
	for (let k = 1; k <= 16; k++) {
		const kept = order.slice(0, k).map((i) => p.boxes[i]);
		const top = heading ? 0 : Math.max(0, Math.floor(Math.min(...kept.map((b) => b.cy - 0.75 * b.h)) * h));
		const bottom = Math.min(h, Math.ceil(Math.max(...kept.map((b) => b.cy + 0.75 * b.h)) * h));
		const data = p.g.data.slice();
		data.fill(paper, 0, top * w);
		data.fill(paper, bottom * w);
		const g = { width: w, height: h, data };
		const ink = m.inkLevels(g);
		let under = 0;
		for (const v of data) if (v < 190) under++;
		const found = kept.filter((b) => m.staffIn(g, b, ink)).length;
		console.log(`  ${String(k).padStart(2)} staves: grey under 190 ${((100 * under) / data.length).toFixed(2)} per cent, 1st percentile ${toneAt(data, 0.01)}, level ${ink.rule}, found ${found} of ${k}`);
	}
}
