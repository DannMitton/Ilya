// Step 3: the figures from one run of step3-e2e.mjs on Nightingale page 4: the underlay's systems, the voice notes
// assigned to each, the rows cut (first look and second looks) and what the reader read on each; every metre window by
// system; and what the stored reading states (time signatures by measure, syllables by system). The voice notes of the
// page are counted from homr's MusicXML saved by step 0c (step0c-p4.homrfull.json), read on the same bytes.
// usage: node step3-summarize.mts <workdir> <e2e .json>
import fs from 'node:fs';
import { TREE, loadPage } from './step-lib.mts';

const [W, file] = process.argv.slice(2);
const run = JSON.parse(fs.readFileSync(file, 'utf8'));
const { voiceNotes } = await import(TREE + '/underlay-prepare.ts');
const m = await import(TREE + '/metre-windows.ts');
const p = await loadPage(W, 'nightingale-p4');
const all = voiceNotes(p.musicXml);
const sung = all.filter((n: any) => !n.rest && n.at !== null);
console.log(`homr's page: ${all.length} notes and rests in the first part, ${all.filter((n: any) => !n.rest).length} notes, ${sung.length} notes with a place on the page`);

console.log('\n--- console lines from the reader');
for (const l of run.lines) if (/\[omr\]/.test(l)) console.log(l);

const layouts = run.answers.filter((a: any) => a.layout);
const looks = run.answers.filter((a: any) => a.looks);
const metres = run.answers.filter((a: any) => a.seen);
const texts = run.answers.filter((a: any) => a.data?.blocks).map((a: any) => a.data.blocks.flatMap((b: any) => (b.paragraphs ?? []).flatMap((q: any) => (q.lines ?? []).map((l: any) => (l.words ?? []).map((w: any) => w.text).join(' ')))).join(' / '));
console.log(`\n--- underlay answers: ${layouts.length} layout, ${looks.length} looks; metre answers: ${metres.length}; rows the reader answered: ${texts.length}`);
const layout = layouts[0].layout;
const rows = layout.systems.reduce((t: number, s: any) => t + s.rows.length, 0);
const lookRows = looks.flatMap((a: any) => a.looks).reduce((t: number, l: any) => t + l.layoutRows.length, 0);
console.log(`systems ${layout.systems.length}; staves unfound ${layout.unfound}; voice notes assigned ${layout.systems.reduce((t: number, s: any) => t + s.notes.length, 0)}; rows cut at the first look ${rows}; at second looks ${lookRows}`);
let at = 0;
layout.systems.forEach((s: any, i: number) => {
	const bars = [...new Set(s.notes.map((n: any) => n.bar))];
	console.log(`system ${i + 1}: ${s.notes.length} notes, bars ${bars[0]} to ${bars[bars.length - 1]}, band ${s.band ? `y ${s.band.y0}-${s.band.y1}` : 'none'}, ${s.rows.length} rows`);
	for (const r of s.rows) console.log(`    row y ${r.offsetY}: ${JSON.stringify(texts[r.id] ?? null)}`);
	at += s.rows.length;
});

console.log('\n--- metre windows by system (system by the nearest staff top line)');
const ink = m.inkLevels(p.g);
const staves = p.boxes.map((b) => m.staffIn(p.g, b, ink)!);
for (const a of metres) {
	const per: any[][] = staves.map(() => []);
	for (const s of a.seen) {
		let best = 0, d = Infinity;
		staves.forEach((st, i) => { const q = Math.abs(m.linesBeyond(st, s.x0)[0] - s.top); if (q < d) { d = q; best = i; } });
		per[best].push(s);
	}
	console.log(`windows ${a.seen.length}, unfound ${a.unfound}, small ${a.small}`);
	per.forEach((list, i) => console.log(`system ${i + 1}: ${list.map((s) => `${s.start ? 'start' : 'bar'}@${Math.round(s.x0)} ${s.lab ?? '-'}${s.lab ? '' : s.why ? ` (${s.why})` : ''}${s.courtesy ? ' courtesy' : ''}`).join('; ')}`));
}

console.log('\n--- the stored reading');
const songs = Object.values(run.stored).flat() as any[];
const find = (o: any): string | null => { if (typeof o === 'string') return o.includes('<score-partwise') ? o : null; if (o && typeof o === 'object') { if (o.musicXml && typeof o.musicXml === 'string') return o.musicXml; for (const v of Object.values(o)) { const f = find(v); if (f) return f; } } return null; };
const xml = find(songs);
if (!xml) console.log('no reading found in the library');
else {
	fs.writeFileSync(file.replace(/\.json$/, '.musicxml'), xml);
	const part = /<part\b[^>]*>([\s\S]*?)<\/part>/.exec(xml)![1];
	const measures = [...part.matchAll(/<measure\b([^>]*)>([\s\S]*?)<\/measure>/g)];
	console.log(`parts ${(xml.match(/<part id=/g) ?? []).length}; measures ${measures.length}; notes ${(part.match(/<note\b/g) ?? []).length}; lyric elements ${(part.match(/<lyric\b/g) ?? []).length}`);
	for (const [, attr, body] of measures) {
		const t = /<time\b[^>]*>[\s\S]*?<\/time>/.exec(body)?.[0];
		if (t) console.log(`  measure ${/number="([^"]*)"/.exec(attr)?.[1]}: ${t.replace(/\s+/g, '')}`);
	}
	for (const [i, s] of layout.systems.entries()) {
		const bars = new Set(s.notes.map((n: any) => String(n.bar)));
		const words: string[] = [];
		for (const [, attr, body] of measures) {
			if (!bars.has(/number="([^"]*)"/.exec(attr)?.[1] ?? '')) continue;
			for (const l of body.matchAll(/<lyric\b[\s\S]*?<\/lyric>/g)) {
				const text = [...l[0].matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((x) => x[1]).join('');
				const syl = /<syllabic>([^<]*)</.exec(l[0])?.[1];
				words.push(text + (syl === 'begin' || syl === 'middle' ? '-' : ' '));
			}
		}
		console.log(`  system ${i + 1} lyrics: ${words.join('').trim() || 'none'}`);
	}
}

// The app's layout against `prepareUnderlay` on step 0c's homr output (notes, bands, and row tops), and where each
// system's first row starts against its band's top edge.
const { prepareUnderlay } = await import(TREE + '/underlay-prepare.ts');
const strip = (l: any) => JSON.stringify(l.systems.map((s: any) => ({ n: s.notes.map((n: any) => [n.id, n.x]), band: s.band, rows: s.rows.map((r: any) => r.offsetY) })));
console.log(`\n--- the app's layout equals prepareUnderlay on step 0c's homr output: ${strip(layout) === strip(prepareUnderlay(p.g, p.musicXml, p.boxes).layout)}`);
console.log(`systems whose first row starts on the band's top edge: ${layout.systems.filter((s: any) => s.rows[0]?.offsetY === s.band.y0).length} of ${layout.systems.length}`);
