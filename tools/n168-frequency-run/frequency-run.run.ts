/**
 * N.168 step 2: the frequency run.
 *
 * Reads Dann's sixteen Finale files, read-only and in memory, through the
 * same path the app takes for `.musx` (denigma to MNX to `MnxScoreParser`),
 * resolves every sung vowel with Ilya's own resolver against the real
 * dictionary, computes one `NoteCondition` per sung note for two voices, and
 * writes the counts to `out/`. Nothing from the scores is written anywhere:
 * only counts and seconds leave this file.
 *
 * The chain per song mirrors `InsightsPane.svelte:106-123`: the reading
 * octave for the singer's range, the vowel resolver on verse 1 over the
 * reading score, and the analysis on the performance-order score.
 *
 * Brief: `docs/sessions/brief-code-n168-frequency-run_r1_2026-09-23.md`.
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

const VOICES = [
	{ key: 'mitton', name: 'Low male voice (Mitton)', profile: MITTON, semitones: 0 },
	{ key: 'godin', name: 'Treble voice (Godin), songs up an octave', profile: GODIN, semitones: 12 },
] as const;

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
}

interface Row extends NoteCondition {
	song: string;
	/** `isLongSustain` on this event alone, as `analyzeScore` calls it. */
	heldPerEvent: boolean;
	weight: number;
	songPhonation: number;
}

async function runSong(id: string, file: string): Promise<{ status: SongStatus; rows: Record<string, Row[]> }> {
	const status: SongStatus = { id, file, read: false };
	const rows: Record<string, Row[]> = { mitton: [], godin: [] };
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

	for (const voice of VOICES) {
		const score = voice.semitones ? transposeScore(analysisScore, voice.semitones) : analysisScore;
		const analyzed = analyzeScore(score, voice.profile, vowel, { generatedAt: '2026-09-23T00:00:00.000Z' });
		const result = noteConditions(score, voice.profile, analyzed.events, { vowelForEvent: vowel, barsFrom: readingScore });
		const weightOf = (n: NoteCondition) => (result.tempo === 'none' ? n.quavers : n.seconds!);
		const total = result.notes.reduce((s, n) => s + weightOf(n), 0);
		const byId = new Map(score.vocalLine.map((e) => [e.id, e]));
		rows[voice.key] = result.notes.map((n) => ({
			...n,
			song: id,
			heldPerEvent: isLongSustain(byId.get(n.eventId)!, score.tempoMarkings),
			weight: weightOf(n),
			songPhonation: total,
		}));
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

	// Positive control: the dictionary reached the engine the pipeline calls.
	const probe = processText('Мне голос твой');
	const sources = probe.flatMap((l) => l.words.map((w) => w.stressSource));
	if (!sources.includes('dictionary')) throw new Error(`dictionary not live: stress sources ${sources.join(', ')}`);

	const songs = corpus();
	if (songs.length !== 16) throw new Error(`expected 16 scores, found ${songs.length}: ${songs.map((s) => s.file).join(' | ')}`);

	const statuses: SongStatus[] = [];
	const all: Record<string, Row[]> = { mitton: [], godin: [] };
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
	md.push('Every song was read from its `.musx` through denigma, in memory, and is in performance order as written (no repeats or jumps to unfold). Tempo is the first stated tempo, as `secondsFor` uses it. The octave shift is the app\'s reading octave for the low voice (`resolveVocalReadingOctave`). The treble voice sings the low voice\'s line up an octave.', '');
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

	mkdirSync(OUT, { recursive: true });
	rmSync(path.join(OUT, 'song-status.json'), { force: true }); // an earlier draft wrote lyric text here
	writeFileSync(path.join(OUT, 'frequency-run.md'), md.join('\n') + '\n');
	writeFileSync(path.join(OUT, 'frequency-run.csv'), csv.join('\n') + '\n');
});
