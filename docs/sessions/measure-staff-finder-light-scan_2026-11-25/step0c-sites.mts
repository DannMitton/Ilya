// Step 0c, node half: staffSpace and the staff-line removal, profiles, inkProfile (through cutRows and
// bandInk), and detectStavesLight, on page 4. Tree functions at their shipped constants; the @gen copies
// (step0c-mkprobes.mjs) only to see inside them and, labelled "diagnostic", at another level.
// Run through step0c-run.sh.
import fs from 'node:fs';
import { staffSpace, lookOverNotes } from '../../../apps/web/src/lib/omr/tuplet-number';
import { loadTemplates } from '../../../apps/web/src/lib/omr/tuplet-digits';
import { joinPages } from '../../../apps/web/src/lib/omr/join-pages';
import { voiceNotes } from '../../../apps/web/src/lib/omr/underlay-prepare';
import { systemsOf } from '../../../apps/web/src/lib/omr/underlay-band';
import { cutRows, bandInk } from '../../../apps/web/src/lib/omr/underlay-rows';
import { detectStavesLight } from '../../../apps/web/src/lib/reader/staff-detect';
import * as TP from '@gen/tuplet';
import * as RP from '@gen/rows';
import * as MP from '@gen/reader';
import { P } from './scratch';
import { topLineBelow } from './scratch-below';

const D = process.argv[2] + '/';
const { w, h } = JSON.parse(fs.readFileSync(D + 'nightingale-p4.dim.json', 'utf8'));
const data = new Uint8Array(fs.readFileSync(D + 'nightingale-p4.gray'));
const page = { width: w, height: h, data };
const homr = JSON.parse(fs.readFileSync(D + 'step0c-p4.homrfull.json', 'utf8'));
const staves = JSON.parse(fs.readFileSync(D + 'step0c-p4.staves.json', 'utf8'));
const metre = JSON.parse(fs.readFileSync(D + 'step0c-p4.metre.json', 'utf8'));
const med = (a: number[]) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];

// ---------- 1. profiles (metre-reader.ts) on the seven printed 2/4 ----------
console.log('\n== profiles, verse-start windows: columns with seat ink > 0.02 (uncovered\'s own test), as page x');
for (const r of metre.reads.filter((r: any) => r.wi === 0 && r.plain)) {
	const b = metre.bands[r.box];
	const band = { width: b.width, height: b.height, data: new Uint8Array(Buffer.from(b.data, 'base64')) };
	const xm = r.plain.marks.map((m: any) => { const i = Math.floor(m[4]); const xs = r.plain.xs; return (xs[i] + (m[4] - i) * ((xs[i + 1] ?? xs[i]) - xs[i])) * 10; });
	const L = b.lines[Math.round((xm[0] + xm[1]) / 2 / 10)];
	const from = Math.min(...xm) - 26, to = Math.max(...xm) + 26;
	for (const lv of [128, 170]) {
		MP.T.v = lv;
		const { pu, pl, a } = MP.profiles(band, L, from, to);
		const runs = (p: Float64Array) => { const out: string[] = []; let s = -1; for (let i = 0; i <= p.length; i++) { if (i < p.length && p[i] > 0.02) { if (s < 0) s = i; } else if (s >= 0) { out.push(`${Math.round((a + s) / b.k)}-${Math.round((a + i) / b.k)} (peak ${Math.max(...p.subarray(s, i)).toFixed(2)})`); s = -1; } } return out.join(', ') || 'none'; };
		console.log(` box ${r.box} <${lv}${lv === 128 ? ' shipped' : ' diagnostic'}: mark x ${xm.map((v: number) => Math.round(v / b.k))}  upper ${runs(pu)} | lower ${runs(pl)}`);
	}
}

// ---------- 2. staffSpace and the staff-line removal (tuplet-number.ts) ----------
const templates = await loadTemplates();
const LOOK_MARGIN = 640; // homr-reader.ts
function region(notes: { x: number; y: number }[]) {
	const xs = notes.map((n) => n.x), ys = notes.map((n) => n.y);
	const x = Math.max(0, Math.floor(Math.min(...xs) - LOOK_MARGIN)), y = Math.max(0, Math.floor(Math.min(...ys) - LOOK_MARGIN));
	const width = Math.min(w - x, Math.ceil(Math.max(...xs) - Math.min(...xs) + 2 * LOOK_MARGIN)), height = Math.min(h - y, Math.ceil(Math.max(...ys) - Math.min(...ys) + 2 * LOOK_MARGIN));
	const d = new Uint8Array(width * height);
	for (let r = 0; r < height; r++) d.set(data.subarray((y + r) * w + x, (y + r) * w + x + width), r * width);
	return { part: { width, height, data: d }, local: notes.map((n) => ({ x: n.x - x, y: n.y - y })) };
}
const found = staves.filter((s: any) => s.st);
const spaceNear = (y: number) => { let best: any = null; for (const s of found) { const l = s.st.ls[Math.floor(s.st.ls.length / 2)]; const d = Math.abs(l[2] - y); if (!best || d < best.d) best = { d, box: s.box, space: s.st.space }; } return best; };
const bars = (homr.musicXml.match(/<measure[ >][\s\S]*?<\/measure>/g) as string[]).map((m) => [...m.matchAll(/imgpos:\s*([\d.]+),\s*([\d.]+)/g)].map((p) => ({ x: +p[1], y: +p[2] }))).filter((n) => n.length);
function tuplet(list: { x: number; y: number }[][], label: string) {
	console.log(`\n== staffSpace and staff-line removal, ${label}: ${list.length} note groups`);
	for (const lv of [140, 206]) {
		TP.P.ink = lv;
		const got: (number | null)[] = [], numbers: string[] = []; let right = 0, removedStaff = 0, linesN: number[] = [], cutShare: number[] = [], agree = 0, withSpace = 0;
		const forced: number[] = []; let forcedStaff = 0;
		for (const notes of list) {
			const { part, local } = region(notes);
			const y = local.reduce((s, n) => s + n.y, 0) / local.length;
			const truth = spaceNear(notes.reduce((s, n) => s + n.y, 0) / notes.length);
			const sp = TP.staffSpace(part, local.map((n) => n.x), y);
			if (lv === 140 && sp === staffSpace(part, local.map((n) => n.x), y)) agree++;
			got.push(sp);
			if (sp !== null) {
				withSpace++;
				if (Math.abs(sp - truth.space) <= 1.5) right++;
				const over = TP.lookOverNotes(part, local, templates);
				for (const n of over.numbers) numbers.push(`${n.n}${n.m ? ':' + n.m : ''}@${Math.round(n.x + Math.min(...notes.map((q) => q.x)) - Math.min(...local.map((q) => q.x)))},${Math.round(n.y + Math.min(...notes.map((q) => q.y)) - Math.min(...local.map((q) => q.y)))}`);
				if (TP.LAST.staff) removedStaff++;
				linesN.push((TP.LAST.lines as number[]).length); cutShare.push((TP.LAST.cut as number) / Math.max(1, TP.LAST.ink as number));
			}
			// the removal alone, handed the true space, so a wrong staffSpace does not decide it
			TP.markWords(part, local, Math.round(truth.space));
			forced.push((TP.LAST.lines as number[]).length); if (TP.LAST.staff) forcedStaff++;
		}
		const hist = new Map<string, number>(); for (const s of got) hist.set(String(s), (hist.get(String(s)) ?? 0) + 1);
		console.log(` level ${lv}${lv === 140 ? ' (shipped; probe equals tree on ' + agree + '/' + list.length + ')' : ' (diagnostic)'}: staffSpace values {${[...hist].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}: ${v}`).join(', ')}}; non-null ${withSpace}, within 1.5 px of the staff's space ${right}`);
		console.log(`   line removal at returned space: groups with a five-line staff ${removedStaff}/${withSpace}; long-row lines found median ${linesN.length ? med(linesN) : '-'}; share of ink pixels cut median ${cutShare.length ? med(cutShare).toFixed(2) : '-'}`);
		console.log(`   line removal handed the true space: groups with a five-line staff ${forcedStaff}/${list.length}; lines found median ${med(forced)}`);
		console.log(`   tuplet numbers read: ${numbers.length}${numbers.length ? ' -> ' + [...new Set(numbers)].join(' ') : ''}`);
	}
	TP.P.ink = 140;
}
console.log('\nstaff space of the staves found: ', found.map((s: any) => s.st.space.toFixed(1)).join(' '));
tuplet(bars, 'every bar with notes');

// which bars the join itself asks about, with and without the metre reader's statements
const { linesBeyond } = await import('../../../apps/web/src/lib/omr/metre-windows');
const byBox = new Map(found.map((s: any) => [s.box, s.st]));
const seen = metre.reads.map((r: any) => { const st: any = byBox.get(r.box); const L = linesBeyond(st, r.x0); return { x0: r.x0, top: L[0], bottom: L[4], space: st.space, lab: r.verdict.lab, why: r.verdict.why ?? null, courtesy: r.courtesy, start: r.kind === 'start' }; });
for (const [label, m] of [['today (no staff, so no metre seen)', undefined], ['with the metres seen at the candidate staves', { pages: [seen] }]] as const) {
	const asked: { x: number; y: number }[][] = [];
	joinPages([homr.musicXml], (_p, notes) => { asked.push([...notes]); return null; }, m as any);
	console.log(`\njoin asks the page about ${asked.length} bars, ${label}`);
	if (asked.length) tuplet(asked, 'bars the join asks about, ' + label);
}

// ---------- 2b. the same two functions on placed positions, with control pages ----------
// Four positions a staff on its middle line, so page 4 and the controls are asked the same way. Page 4's staves are
// the candidate pair's; the controls' are the shipped finder's own.
console.log('\n== placed positions (4 a staff, middle line): staffSpace and the removal, page 4 beside controls');
{
	const { staffIn, fives, lineRows } = await import('./scratch');
	for (const name of ['nightingale-p4', 'song1-p1', 'song2-p1', 'song3-p1', 'song4-p1', 'withoutsun-p4', 'withoutsun-p5', 'withoutsun-p6', 'nightingale-p2', 'nightingale-p3', 'nightingale-p5']) {
		const dim = JSON.parse(fs.readFileSync(D + name + '.dim.json', 'utf8'));
		const g = { width: dim.w, height: dim.h, data: new Uint8Array(fs.readFileSync(D + name + '.gray')) };
		const bx = JSON.parse(fs.readFileSync(D + name + '.homr.json', 'utf8')).staves;
		P.ink = name === 'nightingale-p4' ? 206 : 140; P.ceil = name === 'nightingale-p4' ? 0.65 : 0.45; P.inkG = 140;
		const sts = bx.filter((b: any) => b.h * dim.h < 300).map((b: any) => staffIn(g, b)).filter(Boolean) as any[];
		if (!sts.length) { console.log(` ${name}: the shipped finder returns no staff here, so no placed positions`); continue; }
		for (const lv of name === 'nightingale-p4' ? [140, 180, 190, 200, 206] : [140]) {
			TP.P.ink = lv;
			let right = 0, nul = 0, wrong = 0, staffHit = 0, th: number[] = [], thin: number[] = [];
			for (const st of sts) {
				const mid = st.ls[Math.floor(st.ls.length / 2)];
				const notes = [10, 14, 18, 22].map((k) => ({ x: Math.round(st.x0 + k * st.space), y: Math.round(mid[2]) }));
				const sp = staffSpace === undefined ? null : TP.staffSpace(g, notes.map((n) => n.x), mid[2]);
				if (sp === null) nul++; else if (Math.abs(sp - st.space) <= 1.5) right++; else wrong++;
				TP.markWords(g, notes, Math.round(st.space));
				if (TP.LAST.staff) staffHit++;
				thin.push(Math.max(2, Math.round(0.22 * Math.round(st.space))));
				// rule thickness at this level: the finder's own rows, on a strip at the first note
				P.ink = lv; P.ceil = 1;
				for (const f of fives(lineRows(g, notes[0].x, notes[0].x + 2 * Math.round(st.space), Math.round(mid[0] - st.space), Math.round(mid[4] + st.space), 0.5))) th.push(f.th);
				P.ink = name === 'nightingale-p4' ? 206 : 140; P.ceil = name === 'nightingale-p4' ? 0.65 : 0.45;
			}
			console.log(` ${name} at ${lv}: staves ${sts.length}, space ~${med(sts.map((s) => s.space)).toFixed(1)}; staffSpace right ${right}, wrong ${wrong}, null ${nul}; removal finds the five lines ${staffHit}/${sts.length}; rule thickness (fives' th) median ${th.length ? med(th) : '-'} px, removal cuts only <= ${med(thin)} px`);
		}
	}
	TP.P.ink = 140;
}

// ---------- 3. inkProfile (underlay-rows.ts) through cutRows and bandInk ----------
P.ink = 206; P.ceil = 0.65; P.inkG = 140;
const notes = voiceNotes(homr.musicXml).filter((n) => !n.rest && n.at !== null);
const placed = found.map((s: any) => ({ box: homr.staves[s.box], staff: s.st }));
const systems = systemsOf(notes.map((n) => n.at!), placed, w, h, (a, b) => topLineBelow(page, a, b));
console.log(`\n== inkProfile: voice notes ${notes.length}, assigned ${systems.reduce((t, s) => t + s.notes.length, 0)}, systems ${systems.length}, with a band ${systems.filter((s) => s.band).length}`);
const rowsOut: any[] = [];
for (const s of systems) {
	if (!s.band) { console.log(` staff ${s.staff}: no band`); continue; }
	const { x0, x1, y0, y1 } = s.band, sp = placed[s.staff].staff.space;
	const d = new Uint8Array((x1 - x0) * (y1 - y0));
	for (let r = 0; r < y1 - y0; r++) d.set(data.subarray((y0 + r) * w + x0, (y0 + r) * w + x1), r * (x1 - x0));
	const band = { width: x1 - x0, height: y1 - y0, data: d };
	const paper = RP.paperOf(band, sp), ink = bandInk(band, sp), rows = cutRows(band, sp), prof = RP.inkProfile(band, sp);
	const lineMin = 0.02 * band.width;
	rowsOut.push({ staff: s.staff, x0, x1, y0, y1, rows: rows.map((r) => ({ y0: y0 + r.y0, y1: y0 + r.y1, core: [y0 + r.core[0], y0 + r.core[1]] })) });
	console.log(` staff ${s.staff}: notes ${s.notes.length} band y ${y0}-${y1} paper ${paper} ink < ${paper - 60} share ${(ink.share * 100).toFixed(1)}% lines over 2% ${ink.lines} (peak ${Math.max(...prof)} px of ${lineMin} needed) rows ${rows.length}: ${rows.map((r) => `${y0 + r.core[0]}-${y0 + r.core[1]} (${((r.core[1] - r.core[0] + 1) / sp).toFixed(1)} sp)`).join(', ')}`);
}
fs.writeFileSync(D + 'step0c-p4.rows.json', JSON.stringify(rowsOut));

// ---------- 4. detectStavesLight: what darkThreshold it would take (its own option, no change to the file) ----------
const rgba = new Uint8ClampedArray(w * h * 4);
for (let i = 0; i < data.length; i++) { rgba[i * 4] = data[i]; rgba[i * 4 + 3] = 255; }
console.log('\n== detectStavesLight by darkThreshold (rowGate 0.4 unchanged)');
for (const t of [128, 140, 150, 160, 170, 175, 180, 185, 190, 195, 200, 206, 210, 215]) {
	let max = 0, over = 0;
	for (let y = 0; y < h; y++) { let c = 0; for (let x = 0; x < w; x++) if (data[y * w + x] < t) c++; const f = c / w; if (f > max) max = f; if (f > 0.4) over++; }
	console.log(` ${t}${t === 128 ? ' (shipped)' : ''}: staves ${detectStavesLight(rgba, w, h, { darkThreshold: t })}  rows over gate ${over}  max row fraction ${max.toFixed(3)}`);
}
