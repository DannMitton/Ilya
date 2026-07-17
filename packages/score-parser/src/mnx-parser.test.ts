/**
 * MnxScoreParser tests.
 *
 * Two layers:
 *
 * 1. Synthetic fixtures, inline in this file. Original material built to
 *    the MNX v17 shapes observed in denigma's real output (see the
 *    parser's ground-truth note), exercising pickup detection, dotted
 *    durations, melisma, tie chains, tuplets, spaces, verse ordering,
 *    markings, and the diagnostic paths. Nothing here derives from a
 *    copyrighted score, so the tests are CI-safe.
 *
 * 2. An integration test against denigma's actual MNX for the Kabalevsky
 *    Op. 52 No. 8 fixture (Dann's dissertation Appendix C song). The MNX
 *    derives from a copyrighted work, so it is NOT committed; the test
 *    runs only when the SHANE_T08_MNX environment variable names the
 *    file (generate it by running the repo's denigma WASM over
 *    `~/Downloads/samples/Kabalevsky_-_Shakespeare_-_T08_….musx`), and
 *    skips silently everywhere else, including CI.
 *
 * Sandbox note (handover v30 §13): the working sandbox cannot run
 * vitest; these tests also execute there via the node
 * --experimental-strip-types vitest shim. On Dann's machine,
 * `pnpm --filter @ilya/score-parser test` is the authoritative run.
 */

import { describe, expect, it } from 'vitest';
import { MnxScoreParser } from './mnx-parser';
import { markersFromMeasures, unfold } from './unfold';
import type { MnxScoreInput, ParseResult } from './types';

// This package carries no @types/node (tests are its only Node-touching
// code), so the two Node touch-points below are declared minimally rather
// than pulling a types dependency into the workspace for one test file.
declare const process: { env: Record<string, string | undefined> } | undefined;

const parser = new MnxScoreParser();

function mnxInput(data: unknown, sourcePath?: string): MnxScoreInput {
	return { format: 'mnx', data: data as object, ...(sourcePath ? { sourcePath } : {}) };
}

/** One note or rest event in the compact fixture-builder vocabulary. */
function ev(
	base: string,
	opts: {
		dots?: number;
		rest?: boolean;
		step?: string;
		octave?: number;
		alter?: number;
		noteId?: string;
		tieTo?: string;
		lyrics?: Record<string, { text: string; type: string }>;
		markings?: Record<string, unknown>;
	} = {},
): Record<string, unknown> {
	const duration: Record<string, unknown> = { base };
	if (opts.dots) duration.dots = opts.dots;
	if (opts.rest) return { duration, rest: {} };
	const note: Record<string, unknown> = {
		...(opts.noteId ? { id: opts.noteId } : {}),
		pitch: { step: opts.step ?? 'C', octave: opts.octave ?? 4, ...(opts.alter !== undefined ? { alter: opts.alter } : {}) },
		...(opts.tieTo ? { ties: [{ target: opts.tieTo, targetType: 'nextNote' }] } : {}),
	};
	return {
		duration,
		notes: [note],
		...(opts.lyrics ? { lyrics: { lines: opts.lyrics } } : {}),
		...(opts.markings ? { markings: opts.markings } : {}),
	};
}

/**
 * The main synthetic fixture: three measures of 3/4, one flat, quarter=60.
 * Measure 0 is a one-quarter anacrusis. Measure 1 carries the word
 * "погрузись" as start/middle/end syllables with a melisma note inside the
 * word and a tie into measure 2. Measure 2 resolves the tie and closes
 * with an eighth-note triplet (note, rest, note). Two lyric lines: v1
 * Cyrillic, v2 IPA — listed v2-first on events to prove that verse
 * ordering follows global.lyrics.lineOrder, not object-key order.
 */
function mainFixture(): Record<string, unknown> {
	return {
		mnx: { version: 17 },
		global: {
			lyrics: {
				lineMetadata: { v1: { label: 'Verse 1' }, v2: { label: 'Verse 2' } },
				lineOrder: ['v1', 'v2'],
			},
			measures: [
				{
					id: 'm1',
					key: { fifths: -1 },
					time: { count: 3, unit: 4 },
					tempos: [{ bpm: 60, value: { base: 'quarter' } }],
				},
				{ id: 'm2' },
				{ id: 'm3' },
			],
		},
		parts: [
			{
				id: 'P1',
				measures: [
					{
						sequences: [
							{
								content: [
									ev('quarter', {
										step: 'E',
										octave: 3,
										alter: -1,
										lyrics: {
											v2: { text: 'tɨ', type: 'whole' },
											v1: { text: 'Ты', type: 'whole' },
										},
									}),
								],
							},
						],
					},
					{
						sequences: [
							{
								content: [
									ev('eighth', {
										dots: 1,
										step: 'D',
										octave: 3,
										lyrics: {
											v2: { text: 'pʌ', type: 'start' },
											v1: { text: 'по', type: 'start' },
										},
									}),
									ev('16th', {
										step: 'E',
										octave: 3,
										lyrics: {
											v2: { text: 'ɡru', type: 'middle' },
											v1: { text: 'гру', type: 'middle' },
										},
									}),
									// Melisma: the word's vowel carries across this
									// note, so it has no lyric of its own.
									ev('eighth', { step: 'F', octave: 3 }),
									ev('eighth', {
										step: 'G',
										octave: 3,
										noteId: 'n-tie-start',
										tieTo: 'n-tie-stop',
										markings: { breath: { symbol: 'comma' } },
										lyrics: {
											v2: { text: 'zisʲ', type: 'end' },
											v1: { text: 'зись', type: 'end' },
										},
									}),
									ev('quarter', { rest: true }),
								],
							},
						],
					},
					{
						sequences: [
							{
								content: [
									ev('half', { step: 'G', octave: 3, noteId: 'n-tie-stop' }),
									{
										type: 'tuplet',
										inner: { duration: { base: 'eighth' }, multiple: 3 },
										outer: { duration: { base: 'eighth' }, multiple: 2 },
										content: [
											ev('eighth', { step: 'A', octave: 3 }),
											ev('eighth', { rest: true }),
											ev('eighth', { step: 'B', octave: 3, alter: -1 }),
										],
									},
								],
							},
						],
					},
				],
			},
			{
				id: 'P2',
				measures: [
					{ sequences: [{ content: [ev('quarter', { rest: true })] }] },
					{ sequences: [{ content: [] }] },
					{ sequences: [{ content: [] }] },
				],
			},
		],
	};
}

async function parseMain(sourcePath?: string): Promise<ParseResult> {
	return parser.parse(mnxInput(mainFixture(), sourcePath));
}

describe('MnxScoreParser: routing', () => {
	it('canParse accepts mnx and rejects musicxml', () => {
		expect(parser.canParse(mnxInput({}))).toBe(true);
		expect(parser.canParse({ format: 'musicxml', data: '<score/>' })).toBe(false);
	});
});

describe('MnxScoreParser: fatal validation', () => {
	it('rejects a non-object document', async () => {
		const r = await parser.parse(mnxInput(42 as unknown as object));
		expect(r.errors.some((e) => e.fatal && e.code === 'invalid-mnx-json')).toBe(true);
		expect(r.score.vocalLine).toHaveLength(0);
	});

	it('rejects a document without an mnx block', async () => {
		const r = await parser.parse(mnxInput({ global: { measures: [{}] }, parts: [] }));
		expect(r.errors.some((e) => e.fatal && e.code === 'invalid-mnx-json')).toBe(true);
	});

	it('rejects a missing or invalid version', async () => {
		const r = await parser.parse(mnxInput({ mnx: {}, global: { measures: [{}] }, parts: [{}] }));
		expect(r.errors.some((e) => e.fatal && e.code === 'incompatible-format-version')).toBe(true);
	});

	it('rejects empty measures and missing parts distinctly', async () => {
		const noMeasures = await parser.parse(mnxInput({ mnx: { version: 17 }, global: { measures: [] }, parts: [{}] }));
		expect(noMeasures.errors.some((e) => e.fatal && e.code === 'no-measures')).toBe(true);

		const noParts = await parser.parse(mnxInput({ mnx: { version: 17 }, global: { measures: [{}] }, parts: [] }));
		expect(noParts.errors.some((e) => e.fatal && e.code === 'no-vocal-part-identified')).toBe(true);
	});

	it('warns on a version newer than the tested one and parses on', async () => {
		const doc = mainFixture();
		(doc.mnx as { version: number }).version = 18;
		const r = await parser.parse(mnxInput(doc));
		expect(r.warnings.some((w) => w.code === 'mnx-experimental-feature')).toBe(true);
		expect(r.errors).toHaveLength(0);
	});
});

describe('MnxScoreParser: the main fixture', () => {
	it('parses without warnings or errors', async () => {
		const r = await parseMain();
		expect(r.errors).toHaveLength(0);
		expect(r.warnings).toHaveLength(0);
	});

	it('identifies the lyric-bearing part as the vocal part', async () => {
		const r = await parseMain();
		expect(r.score.vocalPart.partId).toBe('P1');
	});

	it('builds measures with snapshotted signatures and the anacrusis flagged', async () => {
		const { score } = await parseMain();
		expect(score.measures).toHaveLength(3);
		expect(score.measures[0].isPickup).toBe(true);
		expect(score.measures[1].isPickup).toBeUndefined();
		for (const m of score.measures) {
			expect(m.timeSignature).toEqual({ beats: 3, beatType: 4 });
			expect(m.keySignature).toEqual({ fifths: -1 });
			expect(m.expectedDuration).toEqual({ numerator: 3, denominator: 4 });
		}
		expect(score.measures.map((m) => m.number)).toEqual(['1', '2', '3']);
		expect(score.timeSignatures).toHaveLength(1);
		expect(score.keySignatures).toHaveLength(1);
	});

	it('maps the tempo marking', async () => {
		const { score } = await parseMain();
		expect(score.tempoMarkings).toEqual([
			{
				measureIndex: 0,
				rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
				bpm: 60,
				beatUnit: 'quarter',
				beatUnitDots: 0,
			},
		]);
	});

	it('accumulates exact rhythmic positions and deterministic event ids', async () => {
		const { score } = await parseMain();
		expect(score.vocalLine.map((e) => e.id)).toEqual([
			'm0-0-1',
			'm1-0-1',
			'm1-3-16',
			'm1-1-4',
			'm1-3-8',
			'm1-1-2',
			'm2-0-1',
			'm2-1-2',
			'm2-7-12',
			'm2-2-3',
		]);
	});

	it('computes dotted and tuplet-scaled duration fractions exactly', async () => {
		const { score } = await parseMain();
		const byId = new Map(score.vocalLine.map((e) => [e.id, e]));
		expect(byId.get('m1-0-1')!.duration).toMatchObject({
			base: 'eighth',
			dots: 1,
			fraction: { numerator: 3, denominator: 16 },
		});
		const tripletNote = byId.get('m2-1-2')!;
		expect(tripletNote.duration.fraction).toEqual({ numerator: 1, denominator: 12 });
		expect(tripletNote.duration.tuplet).toEqual({
			actualNotes: 3,
			normalNotes: 2,
			normalType: 'eighth',
		});
	});

	it('keeps rests as events without pitch or syllable', async () => {
		const { score } = await parseMain();
		const rest = score.vocalLine.find((e) => e.id === 'm1-1-2')!;
		expect(rest.type).toBe('rest');
		expect(rest.pitch).toBeUndefined();
		expect(rest.syllable).toBeUndefined();
	});

	it('preserves enharmonic pitch spelling', async () => {
		const { score } = await parseMain();
		expect(score.vocalLine[0].pitch).toEqual({ step: 'E', octave: 3, alter: -1 });
		const tripletLast = score.vocalLine.find((e) => e.id === 'm2-2-3')!;
		expect(tripletLast.pitch).toEqual({ step: 'B', octave: 3, alter: -1 });
	});

	it('carries verse-1 syllables regardless of object-key order, with labels and both verses', async () => {
		const { score } = await parseMain();
		const first = score.vocalLine[0].syllable!;
		expect(first.text).toBe('Ты');
		expect(first.type).toBe('whole');
		expect(first.verseNumber).toBe(1);
		expect(first.verseLabel).toBe('Verse 1');
		expect(first.id.length).toBeGreaterThan(0);
		expect(first.verses).toEqual(['Ты', 'tɨ']);
	});

	it('encodes the melisma by absence and assigns wordContext across it', async () => {
		const { score } = await parseMain();
		const byId = new Map(score.vocalLine.map((e) => [e.id, e]));
		expect(byId.get('m1-1-4')!.syllable).toBeUndefined(); // the melisma note
		for (const id of ['m1-0-1', 'm1-3-16', 'm1-3-8']) {
			expect(byId.get(id)!.syllable!.wordContext).toBe('погрузись');
		}
		expect(byId.get('m0-0-1')!.syllable!.wordContext).toBe('Ты');
	});

	it('resolves the tie chain to start and stop with partner ids', async () => {
		const { score } = await parseMain();
		const byId = new Map(score.vocalLine.map((e) => [e.id, e]));
		expect(byId.get('m1-3-8')!.tied).toEqual({ type: 'start', partnerEventId: 'm2-0-1' });
		expect(byId.get('m2-0-1')!.tied).toEqual({ type: 'stop', partnerEventId: 'm1-3-8' });
	});

	it('maps the breath marking to the breath-mark articulation', async () => {
		const { score } = await parseMain();
		const tieStart = score.vocalLine.find((e) => e.id === 'm1-3-8')!;
		expect(tieStart.articulations).toEqual(['breath-mark']);
	});

	it('detects Russian from Cyrillic verse-1 text', async () => {
		const { score } = await parseMain();
		expect(score.source.languageHint).toBe('rus');
	});

	it('derives origin and fidelity from the source path', async () => {
		const direct = await parseMain('song.mnx');
		expect(direct.score.source).toMatchObject({ origin: 'mnx-direct', fidelity: 'native' });
		const viaDenigma = await parseMain('Song_from_Finale.musx');
		expect(viaDenigma.score.source).toMatchObject({ origin: 'denigma-mnx-from-musx', fidelity: 'high' });
	});
});

describe('MnxScoreParser: diagnostics and degraded sources', () => {
	it('warns lineorder-missing and falls back to first-appearance order', async () => {
		const doc = mainFixture();
		delete (doc.global as { lyrics?: unknown }).lyrics;
		const r = await parser.parse(mnxInput(doc));
		expect(r.warnings.some((w) => w.code === 'lineorder-missing')).toBe(true);
		// v2 is listed first on every event, so first-appearance order makes
		// the IPA line verse 1 — exactly why lineOrder is the canonical path.
		expect(r.score.vocalLine[0].syllable!.text).toBe('tɨ');
	});

	it('warns once per part set when multiple parts carry lyrics', async () => {
		const doc = mainFixture();
		const parts = doc.parts as Array<Record<string, unknown>>;
		parts[1] = {
			id: 'P2',
			measures: [
				{
					sequences: [
						{ content: [ev('quarter', { lyrics: { v1: { text: 'ла', type: 'whole' } } })] },
					],
				},
				{ sequences: [{ content: [] }] },
				{ sequences: [{ content: [] }] },
			],
		};
		const r = await parser.parse(mnxInput(doc));
		expect(r.warnings.some((w) => w.code === 'multiple-vocal-parts')).toBe(true);
		expect(r.score.vocalPart.partId).toBe('P1');
	});

	it('splits a MNX combined token on an undertie but NOT on a soft hyphen (conservative guardrail)', async () => {
		const doc = {
			mnx: { version: 17 },
			global: { measures: [{ time: { count: 2, unit: 4 }, key: { fifths: 0 } }] },
			parts: [
				{
					id: 'P1',
					measures: [
						{
							sequences: [
								{
									content: [
										// Undertie U+203F: an unambiguous elision → split.
										ev('quarter', { lyrics: { v1: { text: 'ко‿я', type: 'whole' } } }),
										// Soft hyphen U+00AD inside a single syllable → must NOT split.
										ev('quarter', { lyrics: { v1: { text: 'сло­во', type: 'whole' } } }),
									],
								},
							],
						},
					],
				},
			],
		};
		const r = await parser.parse(mnxInput(doc));
		const [a, b] = r.score.vocalLine;
		expect(a.syllable!.parseFlag).toBe('elided');
		expect(a.syllable!.segments).toEqual([
			{ text: 'ко', type: 'whole' },
			{ text: 'я', type: 'whole' },
		]);
		expect(b.syllable!.parseFlag).toBeUndefined();
		expect(b.syllable!.segments).toBeUndefined();
		expect(b.syllable!.text).toBe('сло­во');
	});

	it('advances the cursor across space items', async () => {
		const doc = {
			mnx: { version: 17 },
			global: { measures: [{ time: { count: 2, unit: 4 }, key: { fifths: 0 } }] },
			parts: [
				{
					id: 'P1',
					measures: [
						{
							sequences: [
								{
									content: [
										{ type: 'space', duration: [1, 4] },
										ev('quarter', { lyrics: { v1: { text: 'да', type: 'whole' } } }),
									],
								},
							],
						},
					],
				},
			],
		};
		const r = await parser.parse(mnxInput(doc));
		expect(r.score.vocalLine).toHaveLength(1);
		expect(r.score.vocalLine[0].id).toBe('m0-1-4');
	});

	it('warns on a chord in the vocal line and keeps the first note', async () => {
		const doc = mainFixture();
		const m0 = (doc.parts as Array<{ measures: Array<{ sequences: Array<{ content: Array<Record<string, unknown>> }> }> }>)[0]
			.measures[0].sequences[0].content[0];
		(m0.notes as Array<unknown>).push({ pitch: { step: 'G', octave: 3 } });
		const r = await parser.parse(mnxInput(doc));
		expect(r.warnings.some((w) => w.code === 'unrecognised-element' && /Chord/.test(w.message))).toBe(true);
		expect(r.score.vocalLine[0].pitch).toEqual({ step: 'E', octave: 3, alter: -1 });
	});

	it('warns measure-duration-mismatch on an underfilled interior measure', async () => {
		const doc = mainFixture();
		const m1 = (doc.parts as Array<{ measures: Array<{ sequences: Array<{ content: Array<unknown> }> }> }>)[0]
			.measures[1].sequences[0].content;
		m1.pop(); // drop the closing quarter rest: measure 1 now sums to 1/2
		const r = await parser.parse(mnxInput(doc));
		expect(r.warnings.some((w) => w.code === 'measure-duration-mismatch' && w.location?.measureIndex === 1)).toBe(true);
	});

	it('warns unsupported-articulation once per unknown marking key', async () => {
		const doc = mainFixture();
		const content = (doc.parts as Array<{ measures: Array<{ sequences: Array<{ content: Array<Record<string, unknown>> }> }> }>)[0]
			.measures[0].sequences[0].content;
		content[0].markings = { sparkle: {}, tenuto: {} };
		const r = await parser.parse(mnxInput(doc));
		const sparkles = r.warnings.filter((w) => w.code === 'unsupported-articulation');
		expect(sparkles).toHaveLength(1);
		expect(r.score.vocalLine[0].articulations).toEqual(['tenuto']);
	});

	it('drops an event with an unreadable duration as a non-fatal error', async () => {
		const doc = mainFixture();
		const content = (doc.parts as Array<{ measures: Array<{ sequences: Array<{ content: Array<Record<string, unknown>> }> }> }>)[0]
			.measures[0].sequences[0].content;
		content.unshift({ duration: { base: 'zeptosecond' }, notes: [{ pitch: { step: 'C', octave: 4 } }] });
		const r = await parser.parse(mnxInput(doc));
		expect(r.errors.some((e) => !e.fatal && e.code === 'invalid-mnx-json')).toBe(true);
		expect(r.score.vocalLine.length).toBeGreaterThan(0);
	});

	it('parses tuplet children in normal time when the ratio is unreadable', async () => {
		const doc = mainFixture();
		const m2 = (doc.parts as Array<{ measures: Array<{ sequences: Array<{ content: Array<Record<string, unknown>> }> }> }>)[0]
			.measures[2].sequences[0].content;
		delete (m2[1].outer as Record<string, unknown>).multiple;
		const r = await parser.parse(mnxInput(doc));
		expect(r.warnings.some((w) => w.code === 'tuplet-without-normal-type')).toBe(true);
		// Children land in normal time, so the measure overfills and warns.
		expect(r.warnings.some((w) => w.code === 'measure-duration-mismatch')).toBe(true);
	});
});

// ── Integration: denigma's real MNX for the Kabalevsky T08 fixture ──
// Gated on SHANE_T08_MNX naming the generated file (never committed;
// see the header note). All expected values below were read from the
// actual denigma output of 2026-07-12.

const t08Path = typeof process !== 'undefined' ? (process.env.SHANE_T08_MNX ?? '') : '';
let t08Data: object | null = null;
if (t08Path.length > 0) {
	try {
		// Computed specifier: this package has no @types/node, and the import
		// only ever runs when the env var is set (a developer's machine).
		const fsSpecifier = 'node:fs';
		const fs = (await import(fsSpecifier)) as { readFileSync(path: string, encoding: string): string };
		t08Data = JSON.parse(fs.readFileSync(t08Path, 'utf8')) as object;
	} catch {
		t08Data = null;
	}
}

(t08Data ? describe : describe.skip)('MnxScoreParser: Kabalevsky T08 integration', () => {
	async function parseT08(): Promise<ParseResult> {
		return parser.parse({
			format: 'mnx',
			data: t08Data as object,
			sourcePath: 'Kabalevsky_-_Shakespeare_-_T08_No_longer_mourn_for_me_when_I_am_dead.musx',
		});
	}

	it('parses the full song without errors', async () => {
		const r = await parseT08();
		expect(r.errors).toHaveLength(0);
		expect(r.score.measures).toHaveLength(32);
		expect(r.score.vocalLine).toHaveLength(164);
	});

	it('reads the dual underlay: Cyrillic verse 1, IPA verse 2, 140 lyric events', async () => {
		const { score } = await parseT08();
		const withLyrics = score.vocalLine.filter((e) => e.syllable);
		expect(withLyrics).toHaveLength(140);
		expect(withLyrics.every((e) => e.syllable!.verseNumber === 1)).toBe(true);
		expect(withLyrics[0].syllable!.verseLabel).toBe('Verse 1');
		expect(score.source.languageHint).toBe('rus');
	});

	it('reads the opening signatures and tempo', async () => {
		const { score } = await parseT08();
		expect(score.measures[0].timeSignature).toEqual({ beats: 4, beatType: 4 });
		expect(score.measures[0].keySignature).toEqual({ fifths: -4 });
		expect(score.tempoMarkings[0]).toMatchObject({ measureIndex: 0, bpm: 66, beatUnit: 'quarter' });
	});

	it('resolves all fourteen tie starts', async () => {
		const { score } = await parseT08();
		const starts = score.vocalLine.filter((e) => e.tied?.type === 'start' || e.tied?.type === 'continue');
		const stops = score.vocalLine.filter((e) => e.tied?.type === 'stop' || e.tied?.type === 'continue');
		expect(starts.length).toBe(14);
		expect(stops.length).toBe(14);
	});

	it('marks the denigma provenance from the .musx source path', async () => {
		const { score } = await parseT08();
		expect(score.source.origin).toBe('denigma-mnx-from-musx');
		expect(score.source.fidelity).toBe('high');
	});
});

describe('MnxScoreParser: clefs (v37 §A.17)', () => {
	/** One-measure document with a configurable part-measure clefs array. */
	function clefDoc(clefs: unknown): Record<string, unknown> {
		return {
			mnx: { version: 17 },
			global: { measures: [{ time: { count: 1, unit: 4 }, key: { fifths: 0 } }] },
			parts: [
				{
					id: 'P1',
					measures: [
						{
							...(clefs !== undefined ? { clefs } : {}),
							sequences: [
								{
									content: [
										ev('quarter', { lyrics: { v1: { text: 'a', type: 'whole' } } }),
									],
								},
							],
						},
					],
				},
			],
		};
	}

	it('captures a G clef from staffPosition -2 (denigma shape) and snapshots the measure', async () => {
		const r = await parser.parse(mnxInput(clefDoc([{ clef: { glyph: 'gClef', sign: 'G', staffPosition: -2 } }])));
		expect(r.score.clefs).toEqual([{ measureIndex: 0, clef: { sign: 'G', line: 2 } }]);
		expect(r.score.measures[0].clef).toEqual({ sign: 'G', line: 2 });
	});

	it('captures an F clef from staffPosition 2', async () => {
		const r = await parser.parse(mnxInput(clefDoc([{ clef: { glyph: 'fClef', sign: 'F', staffPosition: 2 } }])));
		expect(r.score.clefs).toEqual([{ measureIndex: 0, clef: { sign: 'F', line: 4 } }]);
	});

	it('defaults the line by sign when staffPosition is absent or malformed', async () => {
		const r = await parser.parse(mnxInput(clefDoc([{ clef: { sign: 'F', staffPosition: 'x' } }])));
		expect(r.score.clefs).toEqual([{ measureIndex: 0, clef: { sign: 'F', line: 4 } }]);
	});

	it('takes the staff-1 clef from a multi-staff clefs array', async () => {
		const r = await parser.parse(mnxInput(clefDoc([
			{ clef: { sign: 'F', staffPosition: 2 }, staff: 2 },
			{ clef: { sign: 'G', staffPosition: -2 }, staff: 1 },
		])));
		expect(r.score.clefs).toEqual([{ measureIndex: 0, clef: { sign: 'G', line: 2 } }]);
	});

	it('reads a guarded octave displacement', async () => {
		const r = await parser.parse(mnxInput(clefDoc([{ clef: { sign: 'G', staffPosition: -2, octave: -1 } }])));
		expect(r.score.clefs).toEqual([{ measureIndex: 0, clef: { sign: 'G', line: 2, octaveChange: -1 } }]);
	});

	it('warns on an unsupported sign and leaves clefs empty', async () => {
		const r = await parser.parse(mnxInput(clefDoc([{ clef: { sign: 'percussion' } }])));
		expect(r.warnings.some((w) => w.code === 'unrecognised-element' && /clef sign/i.test(w.message))).toBe(true);
		expect(r.score.clefs).toEqual([]);
		expect(r.score.measures[0].clef).toBeUndefined();
	});

	it('leaves clefs empty and measures unclefted when the source carries none', async () => {
		const r = await parser.parse(mnxInput(clefDoc(undefined)));
		expect(r.score.clefs).toEqual([]);
		expect(r.score.measures[0].clef).toBeUndefined();
	});

	it('carries a clef change across measures onto later snapshots', async () => {
		const doc = {
			mnx: { version: 17 },
			global: { measures: [{ time: { count: 1, unit: 4 }, key: { fifths: 0 } }, {}, {}] },
			parts: [
				{
					id: 'P1',
					measures: [
						{
							clefs: [{ clef: { sign: 'F', staffPosition: 2 } }],
							sequences: [{ content: [ev('quarter', { lyrics: { v1: { text: 'a', type: 'whole' } } })] }],
						},
						{ sequences: [{ content: [ev('quarter', { lyrics: { v1: { text: 'b', type: 'whole' } } })] }] },
						{
							clefs: [{ clef: { sign: 'G', staffPosition: -2 } }],
							sequences: [{ content: [ev('quarter', { lyrics: { v1: { text: 'c', type: 'whole' } } })] }],
						},
					],
				},
			],
		};
		const r = await parser.parse(mnxInput(doc));
		expect(r.score.clefs).toEqual([
			{ measureIndex: 0, clef: { sign: 'F', line: 4 } },
			{ measureIndex: 2, clef: { sign: 'G', line: 2 } },
		]);
		expect(r.score.measures[1].clef).toEqual({ sign: 'F', line: 4 });
		expect(r.score.measures[2].clef).toEqual({ sign: 'G', line: 2 });
	});
});

// ── Control-flow capture: repeats, endings (voltas), and the MNX jump family ──
// MNX expresses control flow through global-measure objects (W3C MNX reference,
// verified 2026-07-17): `repeatStart`/`repeatEnd{times}`, `ending{numbers,
// duration}` where duration is a BAR COUNT, `segno`/`fine` markers, and a
// `jump{type}` whose enum is exactly 'segno' (D.S.) and 'dsalfine' (D.S. al
// Fine). Da Capo and the coda family are outside that enum (§A.78); a dropped
// coda leaves no trace, so no format-ceiling flag is emitted here (§A.79b).
// Each test asserts both the captured `Measure` markers AND the end-to-end
// performance order via the source-agnostic unfolder, proving the seam.
describe('MnxScoreParser: control-flow capture', () => {
	/**
	 * Build a control-flow document: N global measures (the first carries a 1/4
	 * time signature so a single quarter note fills each bar and no duration
	 * mismatch warns), each with a one-syllable vocal event so the part is
	 * lyric-bearing. Caller-supplied global-measure props are merged in.
	 */
	function ctrlDoc(globalMeasures: Array<Record<string, unknown>>): Record<string, unknown> {
		const gm = globalMeasures.map((g, i) => ({
			...(i === 0 ? { time: { count: 1, unit: 4 }, key: { fifths: 0 } } : {}),
			...g,
		}));
		const partMeasures = gm.map(() => ({
			sequences: [{ content: [ev('quarter', { lyrics: { v1: { text: 'а', type: 'whole' } } })] }],
		}));
		return { mnx: { version: 17 }, global: { measures: gm }, parts: [{ id: 'P1', measures: partMeasures }] };
	}

	/** Parse a control-flow doc and return the unfolded source-measure order. */
	function orderOf(score: ParseResult['score']): number[] {
		const res = unfold(markersFromMeasures(score.measures));
		expect(res.ok).toBe(true);
		return res.ok ? res.order.map((o) => o.source) : [];
	}

	it('captures simple repeat barlines with a times count and unfolds all passes', async () => {
		const r = await parser.parse(mnxInput(ctrlDoc([{ repeatStart: {} }, {}, { repeatEnd: { times: 3 } }])));
		expect(r.errors).toHaveLength(0);
		expect(r.score.measures[0].repeatStart).toBe(true);
		expect(r.score.measures[2].repeatEnd).toBe(true);
		expect(r.score.measures[2].repeatTimes).toBe(3);
		expect(orderOf(r.score)).toEqual([0, 1, 2, 0, 1, 2, 0, 1, 2]);
	});

	it('defaults a repeat with no times to two passes', async () => {
		const r = await parser.parse(mnxInput(ctrlDoc([{ repeatStart: {} }, { repeatEnd: {} }])));
		expect(r.score.measures[1].repeatEnd).toBe(true);
		expect(r.score.measures[1].repeatTimes).toBeUndefined();
		expect(orderOf(r.score)).toEqual([0, 1, 0, 1]);
	});

	it('captures first and second endings and unfolds the volta', async () => {
		const r = await parser.parse(
			mnxInput(
				ctrlDoc([
					{ repeatStart: {} },
					{},
					{ ending: { numbers: [1], duration: 1 }, repeatEnd: {} },
					{ ending: { numbers: [2], duration: 1 } },
				]),
			),
		);
		expect(r.score.measures[2].ending).toEqual({ passes: [1], startsHere: true, endsHere: true });
		expect(r.score.measures[3].ending).toEqual({ passes: [2], startsHere: true, endsHere: true });
		expect(orderOf(r.score)).toEqual([0, 1, 2, 0, 1, 3]);
	});

	it('resolves a multi-bar ending span across measures with startsHere and endsHere', async () => {
		const r = await parser.parse(mnxInput(ctrlDoc([{}, { ending: { numbers: [1], duration: 2 } }, {}, {}])));
		expect(r.score.measures[1].ending).toEqual({ passes: [1], startsHere: true });
		expect(r.score.measures[2].ending).toEqual({ passes: [1], endsHere: true });
		expect(r.score.measures[3].ending).toBeUndefined();
	});

	it('defaults a duration-less ending to a single bar with a warning', async () => {
		const r = await parser.parse(mnxInput(ctrlDoc([{}, { ending: { numbers: [2] } }])));
		expect(r.warnings.some((w) => w.code === 'unrecognised-element' && /no readable bar-count duration/.test(w.message))).toBe(true);
		expect(r.score.measures[1].ending).toEqual({ passes: [2], startsHere: true, endsHere: true });
	});

	it('captures a plain Dal Segno (type "segno") and unfolds the return to the end', async () => {
		const r = await parser.parse(
			mnxInput(
				ctrlDoc([
					{},
					{ segno: { location: { fraction: [0, 1] } } },
					{},
					{ jump: { type: 'segno', location: { fraction: [1, 1] } } },
				]),
			),
		);
		expect(r.score.measures[1].jump).toEqual({ segno: 'mnx-segno' });
		expect(r.score.measures[3].jump).toEqual({ dalSegno: 'mnx-segno' });
		expect(orderOf(r.score)).toEqual([0, 1, 2, 3, 1, 2, 3]);
	});

	it('captures a Dal Segno al Fine (type "dsalfine") and stops at Fine on the return', async () => {
		const r = await parser.parse(
			mnxInput(
				ctrlDoc([
					{ segno: { location: { fraction: [0, 1] } } },
					{ fine: { location: { fraction: [1, 1] } } },
					{},
					{ jump: { type: 'dsalfine', location: { fraction: [1, 1] } } },
				]),
			),
		);
		expect(r.score.measures[0].jump).toEqual({ segno: 'mnx-segno' });
		expect(r.score.measures[1].jump).toEqual({ fine: true });
		expect(r.score.measures[3].jump).toEqual({ dalSegno: 'mnx-segno' });
		expect(orderOf(r.score)).toEqual([0, 1, 2, 3, 0, 1]);
	});

	it('warns on an unrecognised jump type and captures no jump marker (falls back to as-written)', async () => {
		const r = await parser.parse(mnxInput(ctrlDoc([{}, { jump: { type: 'dcalcoda' } }])));
		expect(r.warnings.some((w) => w.code === 'mnx-experimental-feature' && /Unrecognised jump type/.test(w.message))).toBe(true);
		expect(r.score.measures[1].jump).toBeUndefined();
		expect(orderOf(r.score)).toEqual([0, 1]);
	});

	it('warns when a dsalfine jump has no Fine marker anywhere', async () => {
		const r = await parser.parse(mnxInput(ctrlDoc([{ segno: {} }, {}, { jump: { type: 'dsalfine' } }])));
		expect(r.warnings.some((w) => w.code === 'unrecognised-element' && /no Fine marker was found/.test(w.message))).toBe(true);
	});

	it('does not emit any coda format-ceiling flag from the parser (MNX leaves no coda trace, §A.79b)', async () => {
		// A jump-heavy intent reaching MNX simply cannot carry a coda; there is
		// nothing in the document to read, so the parser stays silent about it
		// rather than inventing a flag. The as-written order is the honest result.
		const r = await parser.parse(mnxInput(ctrlDoc([{ segno: {} }, {}, { jump: { type: 'segno' } }])));
		expect(r.warnings.some((w) => /coda/i.test(w.message))).toBe(false);
		expect(r.errors).toHaveLength(0);
	});

	it('leaves control-flow markers unset on an ordinary measure', async () => {
		const r = await parser.parse(mnxInput(ctrlDoc([{}, {}])));
		for (const m of r.score.measures) {
			expect(m.repeatStart).toBeUndefined();
			expect(m.repeatEnd).toBeUndefined();
			expect(m.ending).toBeUndefined();
			expect(m.jump).toBeUndefined();
		}
	});
});
