// usage: node score-songs.ts <readsDir> <testPrivateDir> <outDir> <truthKind: scan|render>
// Same as tools/e16-harness/src/scan-baseline.ts, but skips songs whose read file is absent (the render corpus has no Tchaikovsky).
// Test-only songs 2 and 3: TOTALS ONLY.
import fs from 'node:fs';
import { scoreScan } from '/Users/dannmitton/Desktop/ilya-rewrite/tools/e16-harness/src/scan-scorer.ts';
const [readsDir, testDir, outDir] = process.argv.slice(2);
const TRUTH = '/Users/dannmitton/Desktop/ilya-rewrite/tools/e16-harness/output/truth/';
const SONGS = [
	{ n: 1, role: 'build', truth: 'mussorgsky_sunless-01_within-four-walls' },
	{ n: 2, role: 'test', truth: 'mussorgsky_sunless-02_you-did-not-recognize-me' },
	{ n: 3, role: 'test', truth: 'mussorgsky_sunless-03_finished-is-the-noisy-idle-day' },
	{ n: 4, role: 'build', truth: 'mussorgsky_sunless-04_be-bored' },
	{ n: 5, role: 'build', truth: 'mussorgsky_sunless-05_elegy' },
	{ n: 6, role: 'build', truth: 'mussorgsky_sunless-06_on-the-river' },
	{ n: 7, role: 'build', truth: 'tchaikovsky', truthPath: '/Users/dannmitton/Desktop/ilya-rewrite/docs/sessions/truth-draft-tchaikovsky-op38-3-voice_r2_2026-10-02.json' }
];
fs.mkdirSync(outDir, { recursive: true });
function totals(s: any) { return { shift: s.shift, bars: s.bars, notes: s.notes, rests: s.rests, abstentions: s.abstentions, headline: s.headline }; }
for (const song of SONGS) {
	const dir = song.role === 'test' ? testDir : readsDir;
	const f = `${dir}/song${song.n}.read.json`;
	if (!fs.existsSync(f)) continue;
	const tj = JSON.parse(fs.readFileSync(song.truthPath ?? `${TRUTH}${song.truth}.truth.json`, 'utf8'));
	const events = [...tj.verses[0].notes].sort((a: any, b: any) => a.onsetAbsolute - b.onsetAbsolute)
		.map((n: any) => ({ type: n.type, measureIndex: n.measureIndex, midi: n.midi, duration: n.duration }));
	const truth = { events, bars: tj.measureDurations };
	const read = JSON.parse(fs.readFileSync(f, 'utf8'));
	const score = scoreScan(truth as any, { events: read.ro.verses[0].notes, bars: read.ro.measures } as any);
	if (song.role === 'test') {
		const t = totals(score);
		fs.writeFileSync(`${outDir}/song${song.n}.totals.json`, JSON.stringify(t, null, 1));
		console.log(`song ${song.n} (test only): ${JSON.stringify(t)}`);
	} else {
		fs.writeFileSync(`${outDir}/song${song.n}.score.json`, JSON.stringify(score, null, 1));
		console.log(`song ${song.n}: ${JSON.stringify(totals(score))}`);
	}
}
