// Steps 1 and 2: every swept page through the shipped code and through the working tree. Prints, per page, the ink
// levels, the voice boxes found of those `voiceBoxes` names, every box of either kind that changes state, and for each
// voice staff x0, x1, the bar lines, and `topLineBelow` against the next found staff down the page, before and after.
// "Before" is the shipped code, taken out of git into a folder outside the repository:
//   git archive 7ae519b9 apps/web/src/lib | tar -x -C <base>
// usage: node step-staves.mts <workdir> <base>
import { CUTS, HELD, LAST, NAMED, PAGES, TREE, loadPage } from './step-lib.mts';

const [W, base] = process.argv.slice(2);
const BASE = base + '/apps/web/src/lib/omr';
const old = { w: await import(BASE + '/metre-windows.ts'), below: await import(BASE + '/underlay-below.ts'), band: await import(BASE + '/underlay-band.ts') };
const now = { w: await import(TREE + '/metre-windows.ts'), below: await import(TREE + '/underlay-below.ts'), band: await import(TREE + '/underlay-band.ts') };
const { paperTone } = await import(TREE + '/underlay-frame.ts');
const { toneAt } = await import(TREE + '/underlay-looks.ts');

const kind = (name: string) => (NAMED.includes(name) ? 'named' : HELD.includes(name) ? 'held out' : LAST.includes(name) ? 'held out, last page' : CUTS[name] ? 'held out, sparse cut' : '?');
const totals = { voice: 0, before: 0, after: 0, lost: 0 };
for (const name of PAGES) {
	const p = await loadPage(W, name);
	const ink = now.w.inkLevels(p.g);
	const read = (m: typeof old, args: any[]) => {
		const staves = p.boxes.map((b) => m.w.staffIn(p.g, b, ...args));
		const placed = p.boxes.flatMap((box, i) => (staves[i] ? [{ box, staff: staves[i], i }] : []));
		const order = placed.length ? m.band.downThePage(placed).map((k: number) => placed[k]) : [];
		const rows = p.voice.map((i) => {
			const st = staves[i];
			if (!st) return null;
			const at = order.findIndex((s: any) => s.i === i);
			const tlb = m.below.topLineBelow(p.g, order[at], order[at + 1] ?? null, ...args);
			return { x0: st.x0, x1: st.x1, bars: m.w.barLines(p.g, st, ...args).map((b: any) => b.x1), tlb };
		});
		return { staves, rows };
	};
	const a = read(old, []);
	const b = read(now, [ink]);
	const vb = p.voice.filter((i) => a.staves[i]).length;
	const va = p.voice.filter((i) => b.staves[i]).length;
	const changed = p.boxes.flatMap((_, i) => (!!a.staves[i] === !!b.staves[i] ? [] : [`box ${i} (${p.voice.includes(i) ? 'voice' : 'not voice'}) ${a.staves[i] ? 'LOST' : 'gained'}`]));
	totals.voice += p.voice.length; totals.before += vb; totals.after += va;
	totals.lost += p.voice.filter((i) => a.staves[i] && !b.staves[i]).length;
	console.log(`\n${name} [${kind(name)}]  paper ${paperTone(p.g.data)}, 1st percentile ${toneAt(p.g.data, 0.01)}, rule level ${ink.rule}`);
	console.log(`  homr boxes ${p.boxes.length}; voice boxes [${p.voice.join(',')}]; voice staves found before ${vb} of ${p.voice.length}, after ${va} of ${p.voice.length}; all boxes found before ${a.staves.filter(Boolean).length}, after ${b.staves.filter(Boolean).length}`);
	console.log(`  state changes: ${changed.join('; ') || 'none'}`);
	const f = (r: any) => (r ? `x ${r.x0}-${r.x1} bars ${r.bars.length} [${r.bars.map(Math.round).join(',')}] tlb ${r.tlb == null ? '-' : r.tlb.toFixed(1)}` : 'not found');
	p.voice.forEach((i, k) => {
		const x = a.rows[k], y = b.rows[k];
		const d = x && y ? `  | dx0 ${y.x0 - x.x0} dx1 ${y.x1 - x.x1} dbars ${y.bars.length - x.bars.length} dtlb ${x.tlb != null && y.tlb != null ? (y.tlb - x.tlb).toFixed(1) : x.tlb === y.tlb ? '0' : 'appears or goes'}` : '';
		console.log(`   box ${i}: before ${f(x)}\n           after  ${f(y)}${d}`);
	});
}
console.log(`\nALL PAGES: voice boxes ${totals.voice}; found before ${totals.before}, after ${totals.after}; voice boxes found before and not after ${totals.lost}`);
