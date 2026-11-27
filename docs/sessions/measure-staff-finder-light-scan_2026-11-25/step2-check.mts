// Step 2, three checks on the built tree.
// 1. The tree's staff finder equals the pair step 0e measured (step0e-staves.json "after": staff, windows, bar lines),
//    box for box on its seven control pages.
// 2. The tree finds the same voice boxes as the sweep's grid at (0.85, 0.65) on every swept page.
// 3. Lyric rows, as step 0e read them, on every swept page that the shipped code finds a staff on: the systems
//    `systemsOf` makes and the rows `cutRows` cuts in each band, shipped and built. A system is printed when its
//    rows differ by more than 6 pixels or in number. Nightingale is left out: nothing is found there today, and what
//    its rows are is step 3.
// usage: node step2-check.mts <workdir> <base>
import fs from 'node:fs';
import { PAGES, TREE, loadPage } from './step-lib.mts';

const [W, base] = process.argv.slice(2);
const BASE = base + '/apps/web/src/lib/omr';
const now = { w: await import(TREE + '/metre-windows.ts'), band: await import(TREE + '/underlay-band.ts'), below: await import(TREE + '/underlay-below.ts') };
const old = { w: await import(BASE + '/metre-windows.ts'), band: await import(BASE + '/underlay-band.ts'), below: await import(BASE + '/underlay-below.ts') };
const { voiceNotes } = await import(TREE + '/underlay-prepare.ts');
const { cutRows } = await import(TREE + '/underlay-rows.ts');

const e = JSON.parse(fs.readFileSync(W + '/step0e-staves.json', 'utf8'));
let boxes = 0, differ = 0;
for (const name of Object.keys(e)) {
	const p = await loadPage(W, name);
	const ink = now.w.inkLevels(p.g);
	p.boxes.forEach((b, i) => {
		const st = now.w.staffIn(p.g, b, ink);
		const got = st ? { st, windows: now.w.windowsOf(p.g, st, i, ink).map(({ staff, ...rest }: any) => rest), bars: now.w.barLines(p.g, st, ink).map((q: any) => q.x1) } : { st: null, windows: [], bars: [] };
		boxes++;
		if (JSON.stringify(got) !== JSON.stringify(e[name].after[i])) { differ++; console.log(`  differs: ${name} box ${i}`); }
	});
}
console.log(`1. against step 0e's pair: ${boxes} boxes on ${Object.keys(e).length} pages, ${differ} differ`);

const sweep = JSON.parse(fs.readFileSync(W + '/step2-sweep.json', 'utf8'));
let off = 0;
for (const name of PAGES) {
	const p = await loadPage(W, name);
	const ink = now.w.inkLevels(p.g);
	const mine = p.voice.map((i) => (now.w.staffIn(p.g, p.boxes[i], ink) ? '1' : '0')).join('');
	const theirs = sweep.pages[name].grid[sweep.U.indexOf(0.85)][sweep.C.indexOf(0.65)];
	if (mine !== theirs) { off++; console.log(`  differs: ${name} tree ${mine} sweep ${theirs}`); }
}
console.log(`2. against the sweep at (0.85, 0.65): ${PAGES.length} pages, ${off} differ\n`);

console.log('3. lyric rows, shipped and built');
for (const name of PAGES.filter((n) => !n.startsWith('nightingale'))) {
	const p = await loadPage(W, name);
	const notes = voiceNotes(p.musicXml).filter((n: any) => !n.rest && n.at !== null).map((n: any) => n.at);
	const read = (m: typeof now, args: any[]) => {
		const placed = p.boxes.flatMap((box) => { const staff = m.w.staffIn(p.g, box, ...args); return staff ? [{ box, staff }] : []; });
		return m.band.systemsOf(notes, placed, p.g.width, p.g.height, (a: any, b: any) => m.below.topLineBelow(p.g, a, b, ...args)).map((s: any) => {
			const space = placed[s.staff].staff.space;
			let rows: [number, number][] = [];
			if (s.band) {
				const { x0, x1, y0, y1 } = s.band;
				const data = new Uint8Array((x1 - x0) * (y1 - y0));
				for (let y = 0; y < y1 - y0; y++) data.set(p.g.data.subarray((y0 + y) * p.g.width + x0, (y0 + y) * p.g.width + x1), y * (x1 - x0));
				rows = cutRows({ width: x1 - x0, height: y1 - y0, data }, space).map((r: any) => [y0 + r.y0, y0 + r.y1]);
			}
			return { box: p.boxes.indexOf(placed[s.staff].box), notes: s.notes.length, band: s.band ? [s.band.y0, s.band.y1] : null, rows };
		});
	};
	const a = read(old, []), b = read(now, [now.w.inkLevels(p.g)]);
	const show = (s: any) => (s ? `${s.notes} notes, band ${s.band ? s.band.join('-') : 'none'}, rows ${s.rows.map((r: number[]) => r.join('-')).join(' ') || 'none'}` : 'no system');
	const keys = [...new Set([...a, ...b].map((s: any) => s.box))].sort((x, y) => x - y);
	const diff = keys.filter((k) => {
		const x = a.find((s: any) => s.box === k), y = b.find((s: any) => s.box === k);
		return !x || !y || x.notes !== y.notes || x.rows.length !== y.rows.length || x.rows.some((r: number[], i: number) => Math.abs(r[0] - y.rows[i][0]) > 6 || Math.abs(r[1] - y.rows[i][1]) > 6);
	});
	console.log(`  ${name}: systems ${a.length} shipped, ${b.length} built; ${diff.length ? 'differ:' : 'all the same within 6 px'}`);
	for (const k of diff) console.log(`    box ${k}\n      shipped ${show(a.find((s: any) => s.box === k))}\n      built   ${show(b.find((s: any) => s.box === k))}`);
}
