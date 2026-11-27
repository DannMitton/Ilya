// Step 3's addition: what the late left end on Without Sun page 23 box 2 costs. Three columns: the shipped code; the
// built tree (the pair); and the built tree with that staff's left end put back to the shipped value, which isolates the
// left end from everything else the pair changes. For each: the staff's ends, its bar lines, its metre windows, and the
// lyric band and rows of its system. Writes step3-ws23.json (the per-column staves and windows for the metre pass).
// usage: node step3-ws23.mts <workdir> <base>
import fs from 'node:fs';
import { TREE, loadPage } from './step-lib.mts';

const [W, base] = process.argv.slice(2);
const BASE = base + '/apps/web/src/lib/omr';
const mods = async (d: string) => ({ w: await import(d + '/metre-windows.ts'), band: await import(d + '/underlay-band.ts'), below: await import(d + '/underlay-below.ts') });
const old = await mods(BASE), now = await mods(TREE);
const { voiceNotes } = await import(TREE + '/underlay-prepare.ts');
const { cutRows } = await import(TREE + '/underlay-rows.ts');
const p = await loadPage(W, 'withoutsun-p23');
const notes = voiceNotes(p.musicXml).filter((n: any) => !n.rest && n.at !== null).map((n: any) => n.at);
const ink = now.w.inkLevels(p.g);
const BOX = 2;
const shippedX0 = old.w.staffIn(p.g, p.boxes[BOX]).x0;
const out: any = {};
for (const [label, m, args, force] of [['shipped', old, [], false], ['pair', now, [ink], false], ['pair, left end put back', now, [ink], true]] as const) {
	const staves = p.boxes.map((b, i) => {
		const st = m.w.staffIn(p.g, b, ...(args as any));
		if (st && force && i === BOX) st.x0 = shippedX0;
		return st;
	});
	const st = staves[BOX];
	const placed = p.boxes.flatMap((box, i) => (staves[i] ? [{ box, staff: staves[i] }] : []));
	const systems = m.band.systemsOf(notes, placed, p.g.width, p.g.height, (a: any, b: any) => m.below.topLineBelow(p.g, a, b, ...(args as any)));
	const s = systems.find((s: any) => placed[s.staff].staff === st);
	let rows: [number, number][] = [];
	if (s?.band) {
		const { x0, x1, y0, y1 } = s.band;
		const data = new Uint8Array((x1 - x0) * (y1 - y0));
		for (let y = 0; y < y1 - y0; y++) data.set(p.g.data.subarray((y0 + y) * p.g.width + x0, (y0 + y) * p.g.width + x1), y * (x1 - x0));
		rows = cutRows({ width: x1 - x0, height: y1 - y0, data }, st.space).map((r: any) => [y0 + r.y0, y0 + r.y1]);
	}
	const bars = m.w.barLines(p.g, st, ...(args as any));
	const windows = m.w.windowsOf(p.g, st, BOX, ...(args as any)).map(({ staff, ...rest }: any) => rest);
	console.log(`\n${label}: x ${st.x0}-${st.x1}, space ${st.space.toFixed(1)}`);
	console.log(`  bar lines ${bars.length}: ${bars.map((b: any) => `${b.x0}-${b.x1}`).join(', ')}`);
	console.log(`  metre windows ${windows.length}: ${windows.map((w: any) => `${w.kind} ${w.x0}-${w.x1}`).join('; ')}`);
	console.log(`  system: ${s ? `${s.notes.length} notes, band ${s.band ? `${s.band.y0}-${s.band.y1}` : 'none'}, rows ${rows.map((r) => r.join('-')).join(' ') || 'none'}` : 'none'}`);
	out[label] = { staves: staves.map((st, i) => (st ? { st, windows: m.w.windowsOf(p.g, st, i, ...(args as any)).map(({ staff, ...rest }: any) => rest) } : { st: null, windows: [] })) };
}
fs.writeFileSync(W + '/step3-ws23.json', JSON.stringify(out));
