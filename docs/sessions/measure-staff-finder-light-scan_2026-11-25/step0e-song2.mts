// Step 0e, first half: song2 page 1's lyric bands and the rows cutRows returns, at the shipped constants and under
// decisions 2 and 3 together (level 229, ceiling 0.65, strokes and meanInk at 140, extent at 229). staffIn and
// topLineBelow come from scratch.ts and scratch-below.ts; systemsOf, cutRows, bandInk, and prepareUnderlay are the
// tree's. The "before" is checked against the tree's own prepareUnderlay. Bundled by step0e-run.sh.
// usage: <bundle> <workdir>
import fs from 'node:fs';
import { prepareUnderlay, voiceNotes } from '../../../apps/web/src/lib/omr/underlay-prepare';
import { systemsOf } from '../../../apps/web/src/lib/omr/underlay-band';
import { cutRows, bandInk } from '../../../apps/web/src/lib/omr/underlay-rows';
import { P, staffIn } from './scratch';
import { topLineBelow } from './scratch-below';

const D = process.argv[2] + '/';
const name = 'song2-p1';
const { w, h } = JSON.parse(fs.readFileSync(D + name + '.dim.json', 'utf8'));
const data = new Uint8Array(fs.readFileSync(D + name + '.gray'));
const page = { width: w, height: h, data };
const homr = JSON.parse(fs.readFileSync(D + `step0e-${name}.homrfull.json`, 'utf8'));
const notes = voiceNotes(homr.musicXml).filter((n) => !n.rest && n.at !== null);
const bins = new Array(256).fill(0); for (const v of data) bins[v]++;
let paper = 0; for (let k = 1; k < 256; k++) if (bins[k] > bins[paper]) paper = k;
let c = 0, anchor = 255; for (let k = 0; k < 256; k++) { c += bins[k]; if (c >= data.length * 0.01) { anchor = k; break; } }
const level = Math.round(anchor + 0.85 * (paper - anchor));
console.log(`${name}: paper ${paper}, 1st percentile ${anchor}, level ${level}; voice notes with a place ${notes.length}`);

const out: any = { level };
for (const [label, ink, ceil, inkG] of [['before', 140, 0.45, null], ['after', level, 0.65, 140]] as const) {
	P.ink = ink; P.ceil = ceil; P.inkG = inkG;
	const placed: any[] = [], found: string[] = [];
	homr.staves.forEach((box: any, i: number) => { const staff = staffIn(page, box); if (staff) { placed.push({ box, staff }); found.push(`${i}`); } });
	const tlbs = new Map<number, number | null>();
	const systems = systemsOf(notes.map((n) => n.at!), placed, w, h, (a, b) => { const t = topLineBelow(page, a, b); tlbs.set(a.box.index, t); return t; });
	console.log(`\n== ${label}: ink ${ink}, ceiling ${ceil}; boxes found ${found.join(',')} of ${homr.staves.length}; systems ${systems.length}`);
	out[label] = [];
	systems.forEach((s, k) => {
		const a = placed[s.staff], sp = a.staff.space;
		const mid = a.staff.ls[Math.floor(a.staff.ls.length / 2)];
		const head = ` system ${k + 1} (box ${a.box.index}): voice staff x ${a.staff.x0}-${a.staff.x1}, lines ${mid.map((v: number) => v.toFixed(1)).join(' ')}, space ${sp.toFixed(2)}, notes ${s.notes.length}, topLineBelow ${tlbs.get(a.box.index)?.toFixed(1) ?? 'null'}`;
		if (!s.band) { console.log(head + ', no band'); out[label].push({ band: null, rows: [] }); return; }
		const { x0, x1, y0, y1 } = s.band;
		const d = new Uint8Array((x1 - x0) * (y1 - y0));
		for (let r = 0; r < y1 - y0; r++) d.set(data.subarray((y0 + r) * w + x0, (y0 + r) * w + x1), r * (x1 - x0));
		const band = { width: x1 - x0, height: y1 - y0, data: d };
		const rows = cutRows(band, sp), ink2 = bandInk(band, sp);
		console.log(head);
		console.log(`   band y ${y0}-${y1} (${((y1 - y0) / sp).toFixed(1)} sp), ink share ${(ink2.share * 100).toFixed(2)}%, rows ${rows.length}`);
		rows.forEach((r, i) => console.log(`   row ${i}: crop y ${y0 + r.y0}-${y0 + r.y1}, ink y ${y0 + r.core[0]}-${y0 + r.core[1]} (${((r.core[1] - r.core[0] + 1) / sp).toFixed(2)} sp)`));
		out[label].push({ box: a.box.index, band: { x0, x1, y0, y1 }, rows: rows.map((r) => ({ y0: y0 + r.y0, y1: y0 + r.y1, core: [y0 + r.core[0], y0 + r.core[1]] })) });
	});
	if (label === 'before') {
		const tree = prepareUnderlay(page, homr.musicXml, homr.staves);
		const mine = out.before.flatMap((s: any) => s.rows.map((r: any) => r.y0));
		const theirs = tree.layout.systems.flatMap((s) => s.rows.map((r) => r.offsetY));
		const bandsEq = JSON.stringify(tree.layout.systems.map((s) => s.band ?? null)) === JSON.stringify(out.before.map((s: any) => s.band));
		console.log(`   check against the tree's prepareUnderlay: bands equal ${bandsEq}, row tops equal ${JSON.stringify(mine) === JSON.stringify(theirs)} (${theirs.length} rows)`);
	}
}
fs.writeFileSync(D + 'step0e-song2.rows.json', JSON.stringify(out));
