/**
 * N.168 step 2: the frequency run.
 *
 * Reads Dann's sixteen Finale files, read-only and in memory, through the
 * same path the app takes for `.musx` (denigma to MNX to `MnxScoreParser`),
 * resolves every sung vowel with Ilya's own resolver against the real
 * dictionary, computes one `NoteCondition` per sung note for each voice, and
 * writes the counts to `out/`. No lyric text is written anywhere. The
 * per-note CSVs do carry each note's pitch, bar, beat, and seconds.
 *
 * The chain per song mirrors `InsightsPane.svelte:106-123`: the reading
 * octave for the singer's range, the vowel resolver on verse 1 over the
 * reading score, and the analysis on the performance-order score.
 *
 * Eight voices since 2026-09-24: Mitton, Godin, and six literature test
 * voices (bass, baritone, tenor, contralto, mezzo, soprano), each sung at the
 * shift that puts the most time in its range. Besides the tables, the run
 * writes one CSV per voice with a row per sung note (`out/notes-<voice>.csv`:
 * pitches and positions, no lyric text) and the candidate P1a counts
 * (`out/p1a-counts.csv`).
 *
 * Briefs: `docs/sessions/brief-code-n168-frequency-run_r1_2026-09-23.md`,
 * `brief-code-n168-six-voices_r1_2026-09-24.md`.
 * Run: see `vitest.config.ts` beside this file.
 */

import { test } from 'vitest';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
	MnxScoreParser,
	aggregatePhonation,
	analyzeScore,
	isLongSustain,
	noteConditions,
	pitchToMidi,
	pitchToHz,
	hzToPitch,
	resolveTempo,
	resolveVocalReadingOctave,
	scoreInPerformanceOrder,
	shiftVocalOctave,
	sungVerseNumbers,
	transposeScore,
	type NoteCondition,
	type ParsedScore,
	type Pitch,
	type VoiceProfileSnapshot,
} from '@ilya/score-parser';
import { setStressDictionary, setSingerSupplement } from '@ilya/phonology';
import { setGlossDictionary } from '@ilya/dictionary';
import { setBlurbData } from '@ilya/blurb';
import { installHomographEntries } from '$lib/loader';
import { processText } from '$lib/pipeline';
import { buildUnderlayResolvers } from '$lib/shane/vowel-resolver';
import { musxToMnxJson } from '../e16-harness/src/denigma-convert';
import { checkPlausibility, FLOOR_MARGIN_SEMITONES, CEILING_MARGIN_SEMITONES } from '$lib/shane/engine/plausibility';
import { expectedF1 } from '$lib/shane/engine/derivations';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../..');
const OUT = path.join(here, 'out');
const FINALE = path.join(os.homedir(), 'Documents', 'Finale Files');

// ── The voices ──────────────────────────────────────────────────────

const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });

/**
 * Low male voice, Mitton. fR1 and fR2 copied from `MITTON` in
 * `packages/score-parser/src/modification-engine.test.ts:21-24` (not imported:
 * it is a test file). Range A2 to E4 (brief, from the acoustic framework §2).
 * No tessitura was given.
 *
 * Passaggio: primo A♭3, secondo D♭4, in scientific pitch notation (middle C
 * is C4, Mitton 2020 §1.5). Mitton (2020), §3.2.2, Table 3.1, printed p. 30,
 * Miller's lyric bass values; §3.5, p. 35: "The range that defines the lyric
 * bass zona di passaggio (Ab3-Db4) is overlaid on the graphs in Chapter 6."
 * These are generic, a published value for the voice category. They were not
 * measured from Dann's voice.
 */
const MITTON: VoiceProfileSnapshot = {
	fR1: { i: 296, e: 381, ɪ: 393, ɨ: 404, u: 346, o: 489, ɛ: 577, ʌ: 616, ɑ: 617, a: 711 },
	fR2: { i: 1705, e: 1532, ɪ: 1600, ɨ: 1100, u: 804, o: 826, ɛ: 1311, ʌ: 1167, ɑ: 1013, a: 1113 },
	range: { lowest: P('A', 2), highest: P('E', 4) },
	passaggio: { primo: P('A', 3, -1), secondo: P('D', 4, -1) },
	label: 'Mitton, low male voice',
};

/** Hz of a pitch plus a number of cents (A4 = 440). */
const hz = (p: Pitch, cents = 0): number => {
	const semis: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
	const midi = (p.octave + 1) * 12 + semis[p.step] + p.alter;
	return 440 * 2 ** ((midi - 69 + cents / 100) / 12);
};

/**
 * Treble voice, Godin (Godin and Howell 2015 poster). fR1 by vowel group, at
 * the midpoint of each printed band, taken in pitch (50 cents above the lower
 * edge), which is how G4 sits between G♭4 and A♭4. [ɨ] is not in her table
 * and is not assessed. No fR2, no range, no passaggio.
 */
const GODIN: VoiceProfileSnapshot = {
	fR1: {
		i: hz(P('G', 4)),
		u: hz(P('G', 4)),
		ɪ: hz(P('A', 4), 50),
		o: hz(P('A', 4), 50),
		e: hz(P('A', 4), 50),
		ɛ: hz(P('E', 5), 50),
		ʌ: hz(P('E', 5), 50),
		ɑ: hz(P('E', 5), 50),
		a: hz(P('G', 5), 50),
	},
	label: 'Godin, treble voice',
};

// ── The six literature voices (brief-code-n168-six-voices_r1_2026-09-24) ──
//
// TEST FIXTURES ONLY. These keys route to published values; they are never a
// label shown to a singer (the no-voice-type ruling stands).

type Bucket = 'soprano' | 'tenor-mezzo' | 'baritone' | 'bass';
type BozemanVowel = 'i' | 'e' | 'ɛ' | 'ɑ' | 'o' | 'u';

/**
 * Bozeman's boxed fR1 bands, [floor, ceiling] in Hz, copied value for value
 * from `CORE_BANDS` in `apps/web/src/lib/shane/engine/plausibility.ts:50`,
 * which does not export them. Sources, as `BAND_SOURCES` (`:87`) gives them:
 * soprano, Bozeman, Kinesthetic Voice Pedagogy, 2nd ed. (2021), Fig. 8, p. 75;
 * tenor-mezzo, Fig. 10, pp. 77/126; bass, Fig. 9, p. 76; baritone, Bozeman,
 * "Levels of Acoustic Registration" (kenbozeman.com PDF). `bozemanControl`
 * checks every value against the live module, so a drift stops the run.
 */
const BOZEMAN: Record<Bucket, Record<BozemanVowel, [number, number]>> = {
	soprano: { i: [329.63, 440.0], e: [493.88, 659.26], ɛ: [523.25, 698.46], ɑ: [587.33, 783.99], o: [493.88, 659.26], u: [349.23, 493.88] },
	'tenor-mezzo': { i: [293.66, 392.0], e: [493.88, 659.26], ɛ: [523.25, 698.46], ɑ: [587.33, 783.99], o: [440.0, 659.26], u: [329.63, 440.0] },
	baritone: { i: [293.66, 392.0], e: [440.0, 587.33], ɛ: [493.88, 659.26], ɑ: [523.25, 698.46], o: [440.0, 587.33], u: [293.66, 392.0] },
	bass: { i: [293.66, 329.63], e: [392.0, 493.88], ɛ: [493.88, 587.33], ɑ: [523.25, 698.46], o: [392.0, 493.88], u: [293.66, 349.23] },
};

/** Positive control: each copied band reproduces the guard's own window. */
function bozemanControl(): void {
	const floorRatio = 2 ** (FLOOR_MARGIN_SEMITONES / 12);
	const ceilingRatio = 2 ** (CEILING_MARGIN_SEMITONES / 12);
	for (const [bucket, bands] of Object.entries(BOZEMAN)) {
		const declared = bucket === 'tenor-mezzo' ? 'tenor' : bucket;
		for (const [v, [lo, hi]] of Object.entries(bands)) {
			const r = checkPlausibility(Math.sqrt(lo * hi), v as BozemanVowel, declared);
			if (r.anchorSource !== 'bozeman' || Math.abs(r.windowLow! - lo / floorRatio) > 0.006 || Math.abs(r.windowHigh! - hi * ceilingRatio) > 0.006) {
				throw new Error(`BOZEMAN ${bucket} [${v}] no longer matches plausibility.ts: window ${r.windowLow} to ${r.windowHigh}`);
			}
		}
	}
}

/**
 * fR1 per vowel for one bucket: the geometric midpoint of each Bozeman band
 * (the band's centre in pitch), then [ɨ ɪ ʌ a] from those six by
 * `expectedF1` (`engine/derivations.ts:19`), the ratios the app uses. The
 * derivation ratios come from Mitton's measured voice; applying them to
 * Bozeman midpoints is this run's step, marked "derived" in the output.
 */
function bozemanFR1(bucket: Bucket): { fR1: Record<string, number>; source: Record<string, string> } {
	const fR1: Record<string, number> = {};
	const source: Record<string, string> = {};
	for (const [v, [lo, hi]] of Object.entries(BOZEMAN[bucket])) {
		fR1[v] = Math.sqrt(lo * hi);
		source[v] = `Bozeman ${bucket} midpoint`;
	}
	for (const v of ['ɨ', 'ɪ', 'ʌ', 'a'] as const) {
		const d = expectedF1(v, fR1);
		if (d !== null) {
			fR1[v] = d;
			source[v] = `derived from Bozeman ${bucket}`;
		}
	}
	return { fR1, source };
}

/** Semitones up from a pitch, respelled with flats (C, D♭, D, E♭ ...). JUDGEMENT spelling. */
const up = (p: Pitch, semis: number): Pitch => {
	const names: [Pitch['step'], number][] = [['C', 0], ['D', -1], ['D', 0], ['E', -1], ['E', 0], ['F', 0], ['G', -1], ['G', 0], ['A', -1], ['A', 0], ['B', -1], ['B', 0]];
	const m = pitchToMidi(p) + semis;
	const [step, alter] = names[m % 12];
	return P(step, Math.floor(m / 12) - 1, alter);
};

interface LiteratureVoice {
	key: string;
	name: string;
	bucket: Bucket;
	/** True where the bucket is not this voice's own chart. */
	standIn?: string;
	/** Richard Miller, The Structure of Singing (1986). */
	passaggio: { primo: Pitch; secondo: Pitch; cite: string };
	/** McKinney (1994), Figure 3, p. 111: the lowest notehead. */
	floor: Pitch;
	treble: boolean;
}

/**
 * Passaggi: Miller (1986). Male: "Approximate Register Events", printed
 * p. 117 (PDF p. 138), checked on the page 2026-09-24. Female: Figures 10.1 to
 * 10.3, printed pp. 134 to 135 (PDF pp. 155 to 156), checked on the page
 * 2026-09-24; each primo is where the "Lower (primo) passaggio" arrow meets
 * the top of the chest zone, each secondo where the "Upper (secondo)
 * passaggio" arrow meets the top of upper middle. Parenthesised alternates on
 * the page are not used.
 *
 * Range floor: McKinney (1994), Figure 3, p. 111, the lowest notehead per
 * voice (read by the desk; the Sonnet McKinney memo of 2026-09-23 reads the
 * same six). Ceiling: DESK DEFAULT, two octaves above the floor, McKinney's
 * "ideal two octaves" (computed, not printed). Tessitura: absent.
 */
const LITERATURE: LiteratureVoice[] = [
	{
		key: 'bass',
		name: 'Test voice: bass (literature)',
		bucket: 'bass',
		passaggio: { primo: P('A', 3), secondo: P('D', 4), cite: 'Miller 1986 p. 117, basso cantante' },
		floor: P('F', 2),
		treble: false,
	},
	{
		key: 'baritone',
		name: 'Test voice: baritone (literature)',
		bucket: 'baritone',
		// The book prints the primo as B4, a misprint: it would sit above its own
		// secondo E4. B3 is the desk's correction (claims_millers RMR-024).
		passaggio: { primo: P('B', 3), secondo: P('E', 4), cite: 'Miller 1986 p. 117, baritono lirico (primo printed B4, read B3)' },
		floor: P('A', 2, -1),
		treble: false,
	},
	{
		key: 'tenor',
		name: 'Test voice: tenor (literature)',
		bucket: 'tenor-mezzo',
		passaggio: { primo: P('D', 4), secondo: P('G', 4), cite: 'Miller 1986 p. 117, tenore lirico' },
		floor: P('C', 3),
		treble: false,
	},
	{
		key: 'contralto',
		name: 'Test voice: contralto (literature)',
		bucket: 'tenor-mezzo',
		standIn: 'Bozeman charts no contralto; the tenor-mezzo bands stand in',
		passaggio: { primo: P('G', 4), secondo: P('D', 5), cite: 'Miller 1986 p. 135, Figure 10.3' },
		floor: P('G', 3),
		treble: true,
	},
	{
		key: 'mezzo',
		name: 'Test voice: mezzo-soprano (literature)',
		bucket: 'tenor-mezzo',
		passaggio: { primo: P('E', 4), secondo: P('E', 5), cite: 'Miller 1986 p. 135, Figure 10.2' },
		floor: P('A', 3),
		treble: true,
	},
	{
		key: 'soprano',
		name: 'Test voice: soprano (literature)',
		bucket: 'soprano',
		passaggio: { primo: P('E', 4, -1), secondo: P('F', 5, 1), cite: 'Miller 1986 p. 134, Figure 10.1' },
		floor: P('C', 4),
		treble: true,
	},
];

interface Voice {
	key: string;
	name: string;
	profile: VoiceProfileSnapshot;
	/** A fixed shift in semitones, or 'search' for the shift that puts the most sung time in range. */
	semitones: number | 'search';
	treble: boolean;
	/** Where each vowel's fR1 came from, for the per-note CSV. */
	fR1Source: Record<string, string>;
	cite?: string;
}

const VOICES: Voice[] = [
	{
		key: 'mitton',
		name: 'Low male voice (Mitton)',
		profile: MITTON,
		semitones: 0,
		treble: false,
		fR1Source: Object.fromEntries(Object.keys(MITTON.fR1).map((v) => [v, 'Mitton measured'])),
	},
	{
		key: 'godin',
		name: 'Treble voice (Godin), songs up an octave',
		profile: GODIN,
		semitones: 12,
		treble: true,
		fR1Source: Object.fromEntries(Object.keys(GODIN.fR1).map((v) => [v, 'Godin band midpoint'])),
	},
	...LITERATURE.map((v): Voice => {
		const { fR1, source } = bozemanFR1(v.bucket);
		return {
			key: v.key,
			name: v.name,
			profile: {
				fR1,
				range: { lowest: v.floor, highest: up(v.floor, 24) },
				passaggio: { primo: v.passaggio.primo, secondo: v.passaggio.secondo },
				label: v.name,
			},
			semitones: 'search',
			treble: v.treble,
			fR1Source: v.standIn ? Object.fromEntries(Object.entries(source).map(([k, s]) => [k, `${s} (stand-in)`])) : source,
			cite: `fR1 ${v.standIn ?? `Bozeman ${v.bucket}`}; passaggio ${v.passaggio.cite}; range McKinney 1994 Figure 3 floor, ceiling two octaves above (DESK DEFAULT)`,
		};
	}),
];

/** DESK DEFAULT: the search runs an octave down to two octaves up. */
const SEARCH_FROM = -12;
const SEARCH_TO = 24;

// ── The scores ──────────────────────────────────────────────────────

function corpus(): { id: string; file: string }[] {
	const files = readdirSync(FINALE).filter((f) => f.endsWith('.musx'));
	const sunless = files.filter((f) => /^Mussorgsky - Sunless 0[1-6] - /.test(f)).sort();
	const kabalevsky = files.filter((f) => /^Kabalevsky - Shakespeare - T(0[1-9]|10) /.test(f)).sort();
	return [...sunless, ...kabalevsky].map((file) => ({
		id: file.startsWith('Mussorgsky')
			? `Sunless ${file.match(/Sunless (\d\d)/)![1]}`
			: `Kabalevsky T${file.match(/ - T(\d\d) /)![1]}`,
		file,
	}));
}

// ── The dictionary, as `loader.ts` injects it ───────────────────────

function loadDictionary(): number {
	const data = path.join(repo, 'apps/web/static/data');
	const manifest = JSON.parse(readFileSync(path.join(data, 'dictionary-manifest.json'), 'utf8'));
	const dictionary: Record<string, any> = {};
	for (const file of manifest.files as string[]) {
		for (const line of readFileSync(path.join(data, file), 'utf8').split(/\r?\n/)) {
			if (!line.trim()) continue;
			try {
				const [word, entry] = JSON.parse(line);
				// `mapSingleEntry` (loader.ts:332), which is private there.
				if (entry.e !== undefined || entry.f !== undefined) entry.g = { en: entry.e || '', fr: entry.f || '' };
				dictionary[word] = entry;
			} catch {
				// loader.ts skips malformed lines silently; so does this.
			}
		}
	}
	setStressDictionary(dictionary);
	setSingerSupplement(JSON.parse(readFileSync(path.join(data, 'singer-supplement.json'), 'utf8')));
	setGlossDictionary(dictionary);
	setBlurbData(JSON.parse(readFileSync(path.join(data, 'blurb-composer.json'), 'utf8')));
	installHomographEntries(dictionary, JSON.parse(readFileSync(path.join(data, 'homographs.json'), 'utf8')));
	return Object.keys(dictionary).length;
}

// ── One song ────────────────────────────────────────────────────────

interface SongStatus {
	id: string;
	file: string;
	read: boolean;
	failure?: string;
	parseWarnings?: string[];
	span?: string;
	unresolvedWords?: number;
	bars?: number;
	untrustedBars?: number;
	tempo?: 'stated' | 'inferred' | 'none';
	tempoDetail?: string;
	verses?: number[];
	octaveShift?: number;
	clef?: string;
	performanceOrder?: string;
	sungNotes?: number;
	notesWithVowel?: number;
	boundaries?: Record<string, number>;
	phrases?: number;
	sungSeconds?: number;
	heldBasis?: string;
	/** Per voice: the shift sung, and the share of sung time in range at that shift and in the file's key. */
	shifts?: Record<string, { shift: number; inRange?: number; inRangeAtZero?: number; total: number }>;
}

type Passaggio3 = 'below primo' | 'inside' | 'above secondo';

interface Row extends NoteCondition {
	song: string;
	/** `isLongSustain` on this event alone, as `analyzeScore` calls it. */
	heldPerEvent: boolean;
	weight: number;
	songPhonation: number;
	// ── For the per-note CSV (brief-code-n168-six-voices, step 4).
	shift: number;
	bar: string;
	beat: number;
	pitchName: string;
	fR1Source?: string;
	turningName?: string;
	/** Signed semitones from the vowel's turning pitch (fR1 / 2) to the note. Positive: the note is above it. */
	semisFromTurning?: number;
	passaggio3?: Passaggio3;
	toPrimo?: number;
	toSecondo?: number;
	highestOfPhrase: boolean;
	/** Absent when the voice has no passaggio. `fired` lists the clauses that held; empty when none did. */
	p1a?: { near: boolean; fired: string[] };
}

/** ASCII pitch name for the CSV: C4, Eb4, F#5. */
const asciiPitch = (p: Pitch) => `${p.step}${p.alter > 0 ? '#'.repeat(p.alter) : 'b'.repeat(-p.alter)}${p.octave}`;

/**
 * The shift in semitones that puts the most sung time inside the voice's
 * range. DESK DEFAULT tie-break: among the shifts that tie, the one whose
 * time-weighted mean pitch sits nearest the middle of the range, then the
 * smaller move, then downward. With the smaller move alone, every voice whose
 * range holds the file's key stays in it: the tenor sang the bass's keys at
 * the bottom of its range and almost never reached its secondo.
 * `suggestTranspositions` (`transposition.ts:347`) does not fit: it counts
 * notes rather than time, searches only ±6, and returns nothing when the file
 * key already fits.
 */
function searchShift(notes: NoteCondition[], weightOf: (n: NoteCondition) => number, range: { lowest: Pitch; highest: Pitch }) {
	const lo = pitchToMidi(range.lowest);
	const hi = pitchToMidi(range.highest);
	const inRange = (s: number) => notes.reduce((sum, n) => sum + (n.midi + s >= lo && n.midi + s <= hi ? weightOf(n) : 0), 0);
	const total = notes.reduce((sum, n) => sum + weightOf(n), 0);
	const mean = total > 0 ? notes.reduce((sum, n) => sum + n.midi * weightOf(n), 0) / total : 0;
	const offCentre = (s: number) => Math.abs(mean + s - (lo + hi) / 2);
	let best = 0;
	let bestTime = -1;
	for (let s = SEARCH_FROM; s <= SEARCH_TO; s++) {
		const t = inRange(s);
		const tie = Math.abs(t - bestTime) <= 1e-9;
		const nearer = offCentre(s) < offCentre(best) - 1e-9;
		const level = Math.abs(offCentre(s) - offCentre(best)) <= 1e-9;
		const better = t > bestTime + 1e-9 || (tie && (nearer || (level && (Math.abs(s) < Math.abs(best) || (Math.abs(s) === Math.abs(best) && s < best)))));
		if (better) {
			best = s;
			bestTime = t;
		}
	}
	return { shift: best, inRange: bestTime, inRangeAtZero: inRange(0) };
}

/** The P1a clauses, in the order the brief states them. */
const P1A_CLAUSES = ['held', 'highest of phrase', 'turning pitch 0 to 2 st below', 'crossing', 'fR2 rung'] as const;

async function runSong(id: string, file: string): Promise<{ status: SongStatus; rows: Record<string, Row[]> }> {
	const status: SongStatus = { id, file, read: false };
	const rows: Record<string, Row[]> = Object.fromEntries(VOICES.map((v) => [v.key, []]));
	let parsed: ParsedScore;
	try {
		const mnx = await musxToMnxJson(path.join(FINALE, file));
		const result = await new MnxScoreParser().parse({ format: 'mnx', data: JSON.parse(mnx), sourcePath: file });
		const fatal = result.errors.filter((e) => e.fatal);
		if (fatal.length > 0) {
			status.failure = `parse failed: ${fatal.map((e) => e.code).join(', ')}`;
			return { status, rows };
		}
		parsed = result.score;
		status.parseWarnings = result.warnings.map((w) => w.code);
	} catch (e) {
		status.failure = `conversion failed: ${(e as Error).message}`;
		return { status, rows };
	}
	status.read = true;

	// The chain, as `InsightsPane.svelte:106-123` runs it, for the low voice.
	// The first run (r1) had to depart here: the app read a denigma treble-8vb
	// line an octave low. `vocal-octave.ts` now reads it as stored (Dann,
	// 2026-09-23), so the run uses the app's own reading octave unchanged.
	const octaveShift = resolveVocalReadingOctave(parsed, MITTON.range);
	const clef = parsed.clefs?.[0]?.clef;
	status.clef = clef ? `${clef.sign}${clef.line}${clef.octaveChange ? ` ${clef.octaveChange > 0 ? '+' : ''}${clef.octaveChange} octave` : ''}` : 'none';
	const readingScore = octaveShift !== 0 ? shiftVocalOctave(parsed, octaveShift) : parsed;
	const performance = scoreInPerformanceOrder(readingScore);
	const analysisScore = performance.score;
	const vowel = buildUnderlayResolvers(readingScore, 1).vowel;

	const names = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
	const midis = readingScore.vocalLine.filter((e) => e.pitch).map((e) => pitchToMidi(e.pitch!));
	const name = (m: number) => `${names[m % 12]}${Math.floor(m / 12) - 1}`;
	status.span = `${name(Math.min(...midis))} to ${name(Math.max(...midis))}`;
	// How many words resolved no vowel. Counted, never written out: lyric text
	// is score content and stays out of the repository.
	const unresolved = new Set<string>();
	for (const e of readingScore.vocalLine) {
		if (e.type === 'note' && e.pitch && vowel(e) === undefined && e.syllable) unresolved.add(e.syllable.wordContext ?? e.syllable.text);
	}
	status.unresolvedWords = unresolved.size;
	status.bars = parsed.measures.length;
	status.untrustedBars = aggregatePhonation(readingScore).trust.untrustedBars;
	status.verses = sungVerseNumbers(parsed);
	status.octaveShift = octaveShift;
	status.performanceOrder = performance.reordered
		? 'reordered'
		: performance.flags.length > 0
			? `as written, flagged: ${performance.flags.map((f) => JSON.stringify(f)).join('; ')}`
			: 'as written';
	const t = resolveTempo(analysisScore);
	status.tempoDetail = t
		? `${t.provenance}, ${Math.round(t.bpm * 10) / 10} bpm${t.range ? ` (band ${t.range.map((b) => Math.round(b)).join(' to ')})` : ''}` +
			`${t.term ? `, "${t.term}"` : t.printedText ? `, "${t.printedText}"` : ''}, beat ${t.beatUnit}${t.beatUnitDots ? ' dotted' : ''}` +
			`${t.steadyMarkingCount > 1 ? `, ${t.steadyMarkingCount} steady markings (first used)` : ''}`
		: 'none';

	// The weight of each note depends on the notation, not the pitch, so the
	// file's key gives every voice its search weights.
	const base = noteConditions(analysisScore, MITTON, analyzeScore(analysisScore, MITTON, vowel, { generatedAt: '2026-09-23T00:00:00.000Z' }).events, {
		vowelForEvent: vowel,
		barsFrom: readingScore,
	});
	const baseWeight = (n: NoteCondition) => (base.tempo === 'none' ? n.quavers : n.seconds!);
	const baseTotal = base.notes.reduce((s, n) => s + baseWeight(n), 0);
	const measureOf = new Map(readingScore.measures.map((m, i) => [Number.isInteger(m.index) ? m.index : i, m]));
	status.shifts = {};

	for (const voice of VOICES) {
		let shift: number;
		if (voice.semitones === 'search') {
			const found = searchShift(base.notes, baseWeight, voice.profile.range!);
			shift = found.shift;
			status.shifts[voice.key] = { shift, inRange: found.inRange, inRangeAtZero: found.inRangeAtZero, total: baseTotal };
		} else {
			shift = voice.semitones;
			const r = voice.profile.range;
			const found = r ? searchShift(base.notes, baseWeight, r) : undefined;
			status.shifts[voice.key] = {
				shift,
				...(r ? { inRange: base.notes.reduce((sum, n) => sum + (n.midi + shift >= pitchToMidi(r.lowest) && n.midi + shift <= pitchToMidi(r.highest) ? baseWeight(n) : 0), 0), inRangeAtZero: found!.inRangeAtZero } : {}),
				total: baseTotal,
			};
		}
		const score = shift ? transposeScore(analysisScore, shift) : analysisScore;
		const analyzed = analyzeScore(score, voice.profile, vowel, { generatedAt: '2026-09-23T00:00:00.000Z' });
		const result = noteConditions(score, voice.profile, analyzed.events, { vowelForEvent: vowel, barsFrom: readingScore });
		const weightOf = (n: NoteCondition) => (result.tempo === 'none' ? n.quavers : n.seconds!);
		const total = result.notes.reduce((s, n) => s + weightOf(n), 0);
		const byId = new Map(score.vocalLine.map((e) => [e.id, e]));
		const phraseTop = new Map<number, number>();
		for (const n of result.notes) phraseTop.set(n.phrase.index, Math.max(phraseTop.get(n.phrase.index) ?? -Infinity, n.midi));
		const pass = voice.profile.passaggio;
		const primo = pass ? pitchToMidi(pass.primo) : undefined;
		const secondo = pass ? pitchToMidi(pass.secondo) : undefined;
		rows[voice.key] = result.notes.map((n) => {
			const ev = byId.get(n.eventId);
			if (!ev || !ev.pitch) throw new Error(`${id} ${voice.key}: no sung event ${n.eventId}`);
			const measure = measureOf.get(ev.measureIndex);
			const pos = ev.rhythmicPosition.fraction;
			const fR1 = n.vowel !== undefined ? voice.profile.fR1[n.vowel] : undefined;
			const turningHz = typeof fR1 === 'number' && fR1 > 0 ? fR1 / 2 : undefined;
			const semisFromTurning = turningHz !== undefined ? 12 * Math.log2(pitchToHz(ev.pitch) / turningHz) : undefined;
			const highestOfPhrase = n.midi === phraseTop.get(n.phrase.index);
			let p1a: Row['p1a'];
			if (primo !== undefined && secondo !== undefined) {
				const near = Math.abs(n.midi - secondo) <= 1 || (voice.treble && Math.abs(n.midi - primo) <= 1);
				const clauses: Record<(typeof P1A_CLAUSES)[number], boolean> = {
					held: n.held,
					'highest of phrase': highestOfPhrase,
					'turning pitch 0 to 2 st below': semisFromTurning !== undefined && semisFromTurning >= -1e-9 && semisFromTurning <= 2 + 1e-9,
					crossing: n.fR1Band === 'crossing',
					'fR2 rung': typeof n.fR2Rung === 'number',
				};
				p1a = { near, fired: P1A_CLAUSES.filter((c) => clauses[c]) };
			}
			return {
				...n,
				song: id,
				heldPerEvent: isLongSustain(ev, score.tempoMarkings),
				weight: weightOf(n),
				songPhonation: total,
				shift,
				bar: measure?.number || String(ev.measureIndex + 1),
				// DESK DEFAULT: beats counted in the time signature's lower number.
				beat: 1 + (pos.numerator / pos.denominator) * (measure?.timeSignature.beatType ?? 4),
				pitchName: asciiPitch(ev.pitch),
				fR1Source: n.vowel !== undefined ? voice.fR1Source[n.vowel] : undefined,
				turningName: turningHz !== undefined ? asciiPitch(analyzed.events[n.eventId]?.turningPitch ?? hzToPitch(turningHz)) : undefined,
				semisFromTurning,
				passaggio3: primo !== undefined && secondo !== undefined ? (n.midi < primo ? 'below primo' : n.midi > secondo ? 'above secondo' : 'inside') : undefined,
				toPrimo: primo !== undefined ? n.midi - primo : undefined,
				toSecondo: secondo !== undefined ? n.midi - secondo : undefined,
				highestOfPhrase,
				p1a,
			};
		});
		if (voice.key === 'mitton') {
			status.tempo = result.tempo;
			status.sungNotes = result.notes.length;
			status.notesWithVowel = result.notes.filter((n) => n.vowel !== undefined).length;
			status.boundaries = result.boundaryCounts;
			status.phrases = new Set(result.notes.map((n) => n.phrase.index)).size;
			status.sungSeconds = result.tempo === 'none' ? undefined : total;
			status.heldBasis = [...new Set(result.notes.map((n) => n.heldBasis))].join(', ');
		}
	}
	return { status, rows };
}

// ── Bands ───────────────────────────────────────────────────────────

/** Band labels for `bin`, in ascending order, so the tables read low to high. */
const binOrder = (edges: number[], unit: string): string[] => [
	`under ${edges[0]} ${unit}`,
	...edges.slice(1).map((e, i) => `${edges[i]} to ${e} ${unit}`),
	`${edges[edges.length - 1]} ${unit} or more`,
	'not assessed (no tempo)',
];

const bin = (x: number | undefined, edges: number[], unit: string): string => {
	if (x === undefined) return 'not assessed (no tempo)';
	for (let i = 0; i < edges.length; i++) {
		if (x < edges[i]) return i === 0 ? `under ${edges[0]} ${unit}` : `${edges[i - 1]} to ${edges[i]} ${unit}`;
	}
	return `${edges[edges.length - 1]} ${unit} or more`;
};

const rungLabel = (r: number | null | undefined) => (r === undefined ? 'not assessed' : r === null ? 'none' : `n = ${r}`);

/** Band edges in seconds. JUDGEMENT. */
const PHRASE_EDGES = [2, 4, 6, 8, 12];
const PIECE_EDGES = [30, 60, 90, 120, 180];

/** Each dimension: its name and the band a note falls in. Band order is the order of first definition below. */
const DIMENSIONS: { name: string; band: (n: Row) => string; order?: string[] }[] = [
	{
		name: 'fo against fR1',
		band: (n) => n.fR1Band ?? 'not assessed',
		order: ['open', 'close', 'crossing', 'above', 'not assessed'],
	},
	{ name: 'Harmonic rung at fR1 (n = 3 to 5)', band: (n) => rungLabel(n.fR1Rung), order: ['n = 3', 'n = 4', 'n = 5', 'none', 'not assessed'] },
	{
		name: 'Harmonic rung at fR2 (n = 1 to 8)',
		band: (n) => rungLabel(n.fR2Rung),
		order: ['n = 1', 'n = 2', 'n = 3', 'n = 4', 'n = 5', 'n = 6', 'n = 7', 'n = 8', 'none', 'not assessed'],
	},
	{
		name: 'Passaggio',
		band: (n) => (n.inPassaggio === undefined ? 'not assessed' : n.inPassaggio ? 'inside' : 'outside'),
		order: ['inside', 'outside', 'not assessed'],
	},
	{
		name: 'Passaggio, three ways (by pitch, so a note with no vowel is assessed too)',
		band: (n) => n.passaggio3 ?? 'not assessed',
		order: ['below primo', 'inside', 'above secondo', 'not assessed'],
	},
	{ name: 'Range', band: (n) => n.rangeStatus ?? 'not assessed', order: ['in-tessitura', 'in-range', 'out-of-range', 'not assessed'] },
	{
		name: 'Sustained ceiling exposure',
		band: (n) => (n.sustainedCeilingExposure === undefined ? 'not assessed' : n.sustainedCeilingExposure ? 'exposed' : 'not exposed'),
		order: ['exposed', 'not exposed', 'not assessed'],
	},
	{ name: 'Vowel', band: (n) => n.vowel ?? 'no vowel resolved', order: ['i', 'ɪ', 'ɨ', 'e', 'ɛ', 'a', 'ɑ', 'ʌ', 'o', 'u', 'no vowel resolved'] },
	{ name: 'Held or short (over the tie chain; the regions use this)', band: (n) => (n.held ? 'held' : 'short'), order: ['held', 'short'] },
	{
		name: 'Held or short, per event (the overlay engine\'s own reading, for comparison)',
		band: (n) => (n.heldPerEvent ? 'held' : 'short'),
		order: ['held', 'short'],
	},
	{
		name: 'Approach',
		band: (n) => n.approach?.band ?? 'first note',
		order: ['repeated', 'step', 'leap-up', 'leap-down', 'tie', 'first note'],
	},
	{
		name: 'Approach after a rest',
		band: (n) => (n.approach ? (n.approach.afterRest ? 'after a rest' : 'no rest before') : 'first note'),
		order: ['after a rest', 'no rest before', 'first note'],
	},
	{ name: 'Position in the phrase', band: (n) => n.phrase.position, order: ['first', 'middle', 'last', 'only'] },
	{ name: 'Length of the phrase', band: (n) => bin(n.phrase.seconds, PHRASE_EDGES, 's'), order: binOrder(PHRASE_EDGES, 's') },
	{
		name: 'Position in the piece, cumulative phonation',
		band: (n) => bin(n.onsetPhonationSeconds, PIECE_EDGES, 's'),
		order: binOrder(PIECE_EDGES, 's'),
	},
	{
		name: 'Position in the piece, share of the song',
		band: (n) => {
			const at = (n.onsetPhonationSeconds ?? n.onsetPhonationQuavers) / n.songPhonation;
			return at < 1 / 3 ? 'first third' : at < 2 / 3 ? 'middle third' : 'last third';
		},
		order: ['first third', 'middle third', 'last third'],
	},
];

// ── Tables ──────────────────────────────────────────────────────────

interface Tally {
	notes: number;
	weight: number;
	songs: Set<string>;
}

function tally(rows: Row[], key: (n: Row) => string): Map<string, Tally> {
	const out = new Map<string, Tally>();
	for (const n of rows) {
		const k = key(n);
		const t = out.get(k) ?? { notes: 0, weight: 0, songs: new Set() };
		t.notes += 1;
		t.weight += n.weight;
		t.songs.add(n.song);
		out.set(k, t);
	}
	return out;
}

const pct = (x: number, of: number) => (of > 0 ? `${((100 * x) / of).toFixed(1)}%` : 'n/a');
const secs = (x: number) => x.toFixed(1);
const csvCell = (s: string | number) => (typeof s === 'number' ? String(s) : /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);

test('N.168 frequency run', async () => {
	const entries = loadDictionary();
	bozemanControl();

	// Positive control: the dictionary reached the engine the pipeline calls.
	const probe = processText('Мне голос твой');
	const sources = probe.flatMap((l) => l.words.map((w) => w.stressSource));
	if (!sources.includes('dictionary')) throw new Error(`dictionary not live: stress sources ${sources.join(', ')}`);

	const songs = corpus();
	if (songs.length !== 16) throw new Error(`expected 16 scores, found ${songs.length}: ${songs.map((s) => s.file).join(' | ')}`);

	const statuses: SongStatus[] = [];
	const all: Record<string, Row[]> = Object.fromEntries(VOICES.map((v) => [v.key, []]));
	for (const s of songs) {
		const { status, rows } = await runSong(s.id, s.file);
		statuses.push(status);
		for (const v of VOICES) all[v.key].push(...rows[v.key]);
	}

	// Seconds and quavers cannot be summed. A song with no tempo is weighted in
	// quavers and kept out of the time shares; its notes are still counted.
	const noTempo = new Set(statuses.filter((s) => s.tempo === 'none').map((s) => s.id));

	const md: string[] = [];
	const csv: string[] = ['voice,table,dimension,band,notes,seconds,share_of_sung_time,songs'];
	md.push('# N.168 frequency run', '');
	md.push(`Generated by \`tools/n168-frequency-run/frequency-run.run.ts\`. Dictionary: ${entries} headwords, dictionary stress confirmed live by a positive control.`, '');
	md.push('Weights are seconds sung. Where a tempo was inferred from a word, each note takes the midpoint of `secondsFor`\'s range.');
	if (noTempo.size > 0) {
		md.push(`Songs with no tempo (${[...noTempo].join(', ')}) are weighted in quaver-equivalents, counted in the note columns, and left out of the seconds and share columns.`);
	}
	md.push('', '## Songs', '');
	md.push('Every song was read from its `.musx` through denigma, in memory, and is in performance order as written (no repeats or jumps to unfold). Tempo is the first stated tempo, as `secondsFor` uses it. The octave shift is the app\'s reading octave for the low voice (`resolveVocalReadingOctave`). Godin\'s treble voice sings the low voice\'s line up an octave. The six literature voices each sing the shift that puts the most sung time in their range (see "Transposition").', '');
	md.push('| Song | Read | Bars | Untrusted bars | Tempo | Clef | Octave shift | Sung span (low voice) | Sung notes | With a vowel | Words with no vowel resolved | Phrases | Boundaries: rest, silence, breath mark, caesura | Sung seconds | Parse warnings |');
	md.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
	for (const s of statuses) {
		md.push(
			s.read
				? `| ${s.id} | yes | ${s.bars} | ${s.untrustedBars} | ${s.tempoDetail} | ${s.clef} | ${s.octaveShift} | ${s.span} | ${s.sungNotes} | ${s.notesWithVowel} | ${s.unresolvedWords} | ${s.phrases} | ${[s.boundaries!.rest, s.boundaries!.silence, s.boundaries!['breath-mark'], s.boundaries!.caesura].join(', ')} | ${s.sungSeconds !== undefined ? secs(s.sungSeconds) : 'no tempo'} | ${s.parseWarnings!.length ? s.parseWarnings!.join(', ') : 'none'} |`
				: `| ${s.id} | NO: ${s.failure} | | | | | | | | | | | | | |`,
		);
	}

	const kinds = ['rest', 'silence', 'breath-mark', 'caesura', 'end'];
	const fired = kinds.map((k) => `${k} ${statuses.reduce((sum, st) => sum + (st.boundaries?.[k] ?? 0), 0)}`);
	md.push('', `Phrase boundaries across the sixteen songs: ${fired.join(', ')}. A silence is a stretch of the vocal line with no event at all, usually an empty bar; a mark on a note before a rest counts under both.`);

	// ── The voices and their shifts (six-voices brief).
	const vowelOrder = ['i', 'ɪ', 'ɨ', 'e', 'ɛ', 'a', 'ɑ', 'ʌ', 'o', 'u'];
	const pname = (p: Pitch) => `${p.step}${p.alter > 0 ? '♯' : p.alter < 0 ? '♭' : ''}${p.octave}`;
	md.push('', '## Voices', '');
	md.push('The six literature voices are test fixtures, never a label shown to a singer. fR1 in Hz; "d" marks a vowel derived by `expectedF1` from the Bozeman midpoints; a dash is not assessed. None of the six has fR2, so every fR2 dimension reads "not assessed" for them.', '');
	md.push(`| Voice | ${vowelOrder.map((v) => `[${v}]`).join(' | ')} | Range | Passaggio (primo, secondo) | Sources |`);
	md.push(`|---|${vowelOrder.map(() => '---').join('|')}|---|---|---|`);
	for (const v of VOICES) {
		const f = v.profile.fR1;
		const cells = vowelOrder.map((k) => (typeof f[k] === 'number' ? `${Math.round(f[k])}${v.fR1Source[k]?.startsWith('derived') ? ' d' : ''}` : '-'));
		const r = v.profile.range;
		const pa = v.profile.passaggio;
		md.push(`| ${v.name} | ${cells.join(' | ')} | ${r ? `${pname(r.lowest)} to ${pname(r.highest)}` : 'none'} | ${pa ? `${pname(pa.primo)}, ${pname(pa.secondo)}` : 'none'} | ${v.cite ?? (v.key === 'mitton' ? 'see the file header' : 'Godin and Howell 2015')} |`);
	}

	md.push('', '## Transposition', '');
	md.push(`Shift in semitones from the file\'s key (the low voice\'s reading), with the share of sung time inside the voice\'s range at that shift, then in the file\'s key. The search runs from ${SEARCH_FROM} to +${SEARCH_TO}; among shifts that tie, the one whose time-weighted mean pitch sits nearest the middle of the range wins (DESK DEFAULT), then the smaller move. Mitton stays in the file\'s key. Godin has no range, so her +12 is fixed.`, '');
	md.push(`| Song | ${VOICES.map((v) => v.key).join(' | ')} |`, `|---|${VOICES.map(() => '---').join('|')}|`);
	for (const st of statuses) {
		if (!st.read) continue;
		md.push(`| ${st.id} | ${VOICES.map((v) => {
			const x = st.shifts![v.key];
			const sign = x.shift > 0 ? '+' : '';
			return x.inRange === undefined ? `${sign}${x.shift}` : `${sign}${x.shift} (${pct(x.inRange, x.total)}; ${pct(x.inRangeAtZero!, x.total)})`;
		}).join(' | ')} |`);
	}

	for (const voice of VOICES) {
		const rows = all[voice.key];
		const timed = rows.filter((n) => !noTempo.has(n.song));
		const totalWeight = timed.reduce((s, n) => s + n.weight, 0);
		md.push('', `## ${voice.name}`, '');
		md.push(`${rows.length} sung notes across ${new Set(rows.map((n) => n.song)).size} songs; ${secs(totalWeight)} s of sung time with a tempo.`, '');

		md.push('### Per dimension', '');
		for (const dim of DIMENSIONS) {
			const all = tally(rows, dim.band);
			const withTime = tally(timed, dim.band);
			const keys = [...all.keys()].sort((a, b) => {
				const o = dim.order ?? [];
				const ia = o.indexOf(a);
				const ib = o.indexOf(b);
				if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
				return a.localeCompare(b, 'en', { numeric: true });
			});
			md.push(`**${dim.name}**`, '', '| Band | Share of sung time | Seconds | Notes | Songs |', '|---|---|---|---|---|');
			for (const k of keys) {
				const w = withTime.get(k)?.weight ?? 0;
				const t = all.get(k)!;
				md.push(`| ${k} | ${pct(w, totalWeight)} | ${secs(w)} | ${t.notes} | ${t.songs.size} |`);
				csv.push([voice.key, 'dimension', dim.name, k, t.notes, secs(w), pct(w, totalWeight), t.songs.size].map(csvCell).join(','));
			}
			md.push('');
		}

		// Regions: fR1 band × vowel × held or short × approach, plus the positional
		// dimensions this voice's profile can assess.
		const withRange = rows.some((n) => n.rangeStatus !== undefined);
		const withPassaggio = rows.some((n) => n.inPassaggio !== undefined);
		const parts = ['fR1 band', 'vowel', 'held or short', 'approach', ...(withRange ? ['range'] : []), ...(withPassaggio ? ['passaggio'] : [])];
		const regionKey = (n: Row) =>
			[
				n.fR1Band ?? 'not assessed',
				n.vowel ?? 'no vowel',
				n.held ? 'held' : 'short',
				n.approach?.band ?? 'first note',
				...(withRange ? [n.rangeStatus ?? 'not assessed'] : []),
				...(withPassaggio ? [n.inPassaggio === undefined ? 'not assessed' : n.inPassaggio ? 'inside' : 'outside'] : []),
			].join(' × ');
		const regions = tally(rows, regionKey);
		const regionTime = tally(timed, regionKey);
		const ranked = [...regions.entries()]
			.map(([k, t]) => ({ k, t, w: regionTime.get(k)?.weight ?? 0 }))
			.sort((a, b) => b.w - a.w || b.t.notes - a.t.notes || a.k.localeCompare(b.k));
		md.push(`### Regions: ${parts.join(' × ')}`, '');
		md.push(`${regions.size} distinct regions occur; the top 40 by seconds sung. Not assessed means the profile has no value for that note.`, '');
		md.push('| Rank | Region | Share of sung time | Seconds | Notes | Songs |', '|---|---|---|---|---|---|');
		ranked.slice(0, 40).forEach(({ k, t, w }, i) => {
			md.push(`| ${i + 1} | ${k} | ${pct(w, totalWeight)} | ${secs(w)} | ${t.notes} | ${t.songs.size} |`);
			csv.push([voice.key, 'region', parts.join(' x '), k.replaceAll(' × ', ' x '), t.notes, secs(w), pct(w, totalWeight), t.songs.size].map(csvCell).join(','));
		});
		const top40 = ranked.slice(0, 40).reduce((s, r) => s + r.w, 0);
		md.push('', `The top 40 regions hold ${pct(top40, totalWeight)} of sung time.`);
	}

	// ── P1a, a candidate rule measured for vetting, not a feature (six-voices brief, step 5).
	md.push('', '## Candidate P1a: counts per voice', '');
	md.push('A note counts when it lies within one semitone of the secondo (for a treble voice, also within one semitone of the primo) AND at least one clause holds: held (over the tie chain), highest of its phrase (ties at the top all count), its vowel\'s turning pitch 0 to 2 semitones below it, a crossing, or an fR2 rung. Treble here is Godin, contralto, mezzo, and soprano. A measurement for vetting, not a feature.', '');
	md.push(`| Voice | Notes near the passaggio edge | Notes that fire | Share of sung time | Seconds | Songs | ${P1A_CLAUSES.join(' | ')} |`);
	md.push(`|---|---|---|---|---|---|${P1A_CLAUSES.map(() => '---').join('|')}|`);
	const p1aCsv: string[] = [];
	for (const voice of VOICES) {
		const rows = all[voice.key];
		if (rows.every((n) => n.p1a === undefined)) {
			md.push(`| ${voice.name} | not assessed (no passaggio) | | | | | ${P1A_CLAUSES.map(() => '').join(' | ')} |`);
			continue;
		}
		const timed = rows.filter((n) => !noTempo.has(n.song));
		const totalWeight = timed.reduce((s, n) => s + n.weight, 0);
		const near = rows.filter((n) => n.p1a!.near);
		const fire = near.filter((n) => n.p1a!.fired.length > 0);
		const w = fire.filter((n) => !noTempo.has(n.song)).reduce((s, n) => s + n.weight, 0);
		const byClause = P1A_CLAUSES.map((c) => fire.filter((n) => n.p1a!.fired.includes(c)).length);
		md.push(`| ${voice.name} | ${near.length} | ${fire.length} | ${pct(w, totalWeight)} | ${secs(w)} | ${new Set(fire.map((n) => n.song)).size} | ${byClause.join(' | ')} |`);
		p1aCsv.push([voice.key, near.length, fire.length, secs(w), pct(w, totalWeight), ...byClause].map(csvCell).join(','));
	}
	md.push('', 'The clause columns count firing notes on which that clause holds; one note can hold several, so they do not sum to the firing count.');

	// ── Per-note CSVs (six-voices brief, step 4). No lyric text: positions and counts only.
	const rungCell = (r: number | null | undefined) => (r === undefined ? 'not assessed' : r === null ? 'none' : r);
	const header = 'song,shift,bar,beat,pitch,midi,vowel,fR1_source,seconds,fR1_band,turning_pitch,semitones_from_turning,passaggio,semitones_to_primo,semitones_to_secondo,fR1_rung,fR2_rung,held,approach,approach_semitones,after_rest,phrase_index,phrase_position,highest_of_phrase,p1a_near,p1a_fires,p1a_clauses';
	const perNote: Record<string, string> = {};
	for (const voice of VOICES) {
		const lines = [header];
		for (const n of all[voice.key]) {
			lines.push(
				[
					n.song,
					n.shift,
					n.bar,
					Number(n.beat.toFixed(3)),
					n.pitchName,
					n.midi,
					n.vowel ?? 'none resolved',
					n.fR1Source ?? 'not assessed',
					n.seconds !== undefined ? Number(n.seconds.toFixed(3)) : 'no tempo',
					n.fR1Band ?? 'not assessed',
					n.turningName ?? 'not assessed',
					n.semisFromTurning !== undefined ? Number(n.semisFromTurning.toFixed(2)) : 'not assessed',
					n.passaggio3 ?? 'not assessed',
					n.toPrimo ?? 'not assessed',
					n.toSecondo ?? 'not assessed',
					rungCell(n.fR1Rung),
					rungCell(n.fR2Rung),
					n.held ? 'held' : 'short',
					n.approach?.band ?? 'first note',
					n.approach?.semitones ?? '',
					n.approach ? (n.approach.afterRest ? 'yes' : 'no') : '',
					n.phrase.index,
					n.phrase.position,
					n.highestOfPhrase ? 'yes' : 'no',
					n.p1a ? (n.p1a.near ? 'yes' : 'no') : 'not assessed',
					n.p1a ? (n.p1a.near && n.p1a.fired.length > 0 ? 'yes' : 'no') : 'not assessed',
					n.p1a ? n.p1a.fired.join('; ') : '',
				]
					.map(csvCell)
					.join(','),
			);
		}
		perNote[voice.key] = lines.join('\n') + '\n';
	}

	mkdirSync(OUT, { recursive: true });
	rmSync(path.join(OUT, 'song-status.json'), { force: true }); // an earlier draft wrote lyric text here
	writeFileSync(path.join(OUT, 'frequency-run.md'), md.join('\n') + '\n');
	writeFileSync(path.join(OUT, 'frequency-run.csv'), csv.join('\n') + '\n');
	writeFileSync(path.join(OUT, 'p1a-counts.csv'), ['voice,near,fires,seconds,share_of_sung_time,' + P1A_CLAUSES.join(','), ...p1aCsv].join('\n') + '\n');
	for (const [key, text] of Object.entries(perNote)) writeFileSync(path.join(OUT, `notes-${key}.csv`), text);
});
