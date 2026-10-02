/**
 * scan-baseline: score the Sunless scan reads against the truth files.
 *
 * Usage: node tools/e16-harness/src/scan-baseline.ts <readsDir> <testPrivateDir> <outDir>
 * Songs 1, 4, 5, 6 are the build songs of the Sunless scan; song 7 is the Tchaikovsky (added row 23).
 *
 * For a BUILD song (1, 4, 5, 6) it writes the full score, differences and
 * bar metres included. For a TEST-ONLY song (2, 3) it writes and prints
 * TOTALS ONLY: the author of this script is told not to open those songs'
 * pages, crops, or note-by-note output, so nothing note-by-note leaves this
 * function for them.
 */
import fs from 'node:fs';
import { scoreScan } from './scan-scorer.ts';
import type { ReaderInput, ScanScore, TruthInput } from './scan-scorer.ts';

const [readsDir, testDir, outDir] = process.argv.slice(2);
const TRUTH = 'tools/e16-harness/output/truth/';
const SONGS = [
	{ n: 1, role: 'build', truth: 'mussorgsky_sunless-01_within-four-walls' },
	{ n: 2, role: 'test', truth: 'mussorgsky_sunless-02_you-did-not-recognize-me' },
	{ n: 3, role: 'test', truth: 'mussorgsky_sunless-03_finished-is-the-noisy-idle-day' },
	{ n: 4, role: 'build', truth: 'mussorgsky_sunless-04_be-bored' },
	{ n: 5, role: 'build', truth: 'mussorgsky_sunless-05_elegy' },
	{ n: 6, role: 'build', truth: 'mussorgsky_sunless-06_on-the-river' },
	// The Tchaikovsky song: truth is the desk's draft r2 (read by eye, not proofed by Dann), kept in docs/sessions.
	{ n: 7, role: 'build', truth: 'tchaikovsky', truthPath: 'docs/sessions/truth-draft-tchaikovsky-op38-3-voice_r2_2026-10-02.json' }
];
fs.mkdirSync(outDir, { recursive: true });

function totals(s: ScanScore) {
	return {
		shift: s.shift,
		bars: s.bars,
		notes: s.notes,
		rests: s.rests,
		abstentions: s.abstentions,
		headline: s.headline
	};
}

for (const song of SONGS) {
	const tj = JSON.parse(fs.readFileSync(song.truthPath ?? `${TRUTH}${song.truth}.truth.json`, 'utf8'));
	const events = [...tj.verses[0].notes]
		.sort((a: { onsetAbsolute: number }, b: { onsetAbsolute: number }) => a.onsetAbsolute - b.onsetAbsolute)
		.map((n: { type: 'note' | 'rest'; measureIndex: number; midi?: number; duration: { numerator: number; denominator: number } }) => ({
			type: n.type, measureIndex: n.measureIndex, midi: n.midi, duration: n.duration
		}));
	const truth: TruthInput = { events, bars: tj.measureDurations };
	const dir = song.role === 'test' ? testDir : readsDir;
	const read = JSON.parse(fs.readFileSync(`${dir}/song${song.n}.read.json`, 'utf8'));
	const reader: ReaderInput = {
		events: read.ro.verses[0].notes,
		bars: read.ro.measures
	};
	const score = scoreScan(truth, reader);
	if (song.role === 'test') {
		const t = totals(score);
		fs.writeFileSync(`${outDir}/song${song.n}.totals.json`, JSON.stringify(t, null, 1));
		console.log(`song ${song.n} (test only): ${JSON.stringify(t)}`);
	} else {
		fs.writeFileSync(`${outDir}/song${song.n}.score.json`, JSON.stringify(score, null, 1));
		console.log(`song ${song.n}: ${JSON.stringify(totals(score))}`);
	}
}
