// Song3 page 6 (amendment of 2026-11-26, measure only): every box's staff and windows, and every `topLineBelow` call
// `systemsOf` makes with the band it leads to, three ways: the shipped code; step 1 (the page level, ceiling 0.45);
// and the provisional pair (the page level, ceiling 0.65). The last two come from copies of the working tree's lib in
// <gen> with the ceiling written in (`fives`: `th > 0.45 * s`, or `LINE_CEILING` set to the number). Writes step2-song3.json to the work folder. Nothing in the tree changes.
// usage: node step2-song3.mts <workdir> <base> <gen45> <gen65>
// where <base> holds `git archive 7ae519b9 apps/web/src/lib`, and <gen45>, <gen65> are copies of the working tree's
// apps/web/src/lib with `fives`' ceiling at 0.45 and at 0.65.
import fs from 'node:fs';
import { TREE, loadPage } from './step-lib.mts';

const [W, base, gen45, gen65] = process.argv.slice(2);
const p = await loadPage(W, 'song3-p6');
const { voiceNotes } = await import(TREE + '/underlay-prepare.ts');
const notes = voiceNotes(p.musicXml).filter((n: any) => !n.rest && n.at !== null).map((n: any) => n.at);
const out: any = {};
for (const [label, dir, paged] of [['shipped', base + '/apps/web/src/lib/omr', false], ['step 1 (0.45)', gen45 + '/omr', true], ['pair (0.65)', gen65 + '/omr', true]] as const) {
	const m = await import(dir + '/metre-windows.ts');
	const band = await import(dir + '/underlay-band.ts');
	const below = await import(dir + '/underlay-below.ts');
	const args: any[] = paged ? [m.inkLevels(p.g)] : [];
	const staves = p.boxes.map((b, i) => {
		const st = m.staffIn(p.g, b, ...args);
		return st ? { st, windows: m.windowsOf(p.g, st, i, ...args).map(({ staff, ...rest }: any) => rest) } : { st: null, windows: [] };
	});
	const placed = p.boxes.flatMap((box, i) => (staves[i].st ? [{ box, staff: staves[i].st }] : []));
	const calls: any[] = [];
	const systems = band.systemsOf(notes, placed, p.g.width, p.g.height, (a: any, b: any) => {
		const v = below.topLineBelow(p.g, a, b, ...args);
		calls.push({ a: a.box.index, aBox: p.boxes.indexOf(a.box), bBox: b ? p.boxes.indexOf(b.box) : null, top: v });
		return v;
	});
	out[label] = { staves, calls, systems: systems.map((s: any) => ({ box: p.boxes.indexOf(placed[s.staff].box), notes: s.notes.length, band: s.band && [s.band.y0, s.band.y1] })) };
	console.log(`\n${label}`);
	staves.forEach((s, i) => console.log(`  box ${i}: ${s.st ? `found, x ${s.st.x0}-${s.st.x1}, space ${s.st.space.toFixed(1)}, top line y ${s.st.ls[0][0].toFixed(0)} at its left sample, ${s.windows.length} windows` : 'NOT FOUND'}`));
	console.log('  systems systemsOf makes (voice notes of the single part), each with the topLineBelow it asked for:');
	for (const s of out[label].systems) {
		const c = calls.find((c) => c.aBox === s.box);
		console.log(`    on box ${s.box}: ${s.notes} notes; topLineBelow(below ${c.bBox === null ? 'nothing' : 'box ' + c.bBox}) = ${c.top === null ? 'null' : c.top.toFixed(1)}; band ${s.band ? `y ${s.band[0]}-${s.band[1]}` : 'none'}`);
	}
}
console.log(`\nvoice boxes by the tree: [${p.voice.join(',')}]; notes of the first part with a place: ${notes.length}`);
fs.writeFileSync(W + '/step2-song3.json', JSON.stringify(out));
