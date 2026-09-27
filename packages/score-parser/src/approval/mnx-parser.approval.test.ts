/**
 * Approval (golden-master) test for `MnxScoreParser` (mnx-parser.ts,
 * 1,170 lines). Pins today's exact `ParsedScore` for the package's own
 * "main fixture", which already exists in the repo at
 * `mnx-parser.test.ts:42-193` (the `ev` helper and `mainFixture()`),
 * reproduced verbatim below rather than imported (this audit may only
 * CREATE files under `packages/score-parser/src/approval/`, not export
 * from an existing test file).
 *
 * No real, committed `.mnx` fixture file exists in this repository: the
 * only other MNX fixture (`mnx-parser.test.ts`'s integration test against
 * the Kabalevsky Op. 52 No. 8 denigma output) is explicitly NOT committed,
 * because it derives from a copyrighted score, and runs only when the
 * `MNX_T08_PATH` environment variable names a locally generated file.
 * That environment variable is unset here, so that path is NOT ESTABLISHED
 * by this suite; see the memo. This synthetic fixture is therefore the
 * best available stand-in, and per `mnx-parser.test.ts`'s own header, it
 * is "original material built to the MNX v17 shapes observed in denigma's
 * real output", not arbitrary test data.
 *
 * The synthetic fixture is the musical twin of `musicxml-parser.test.ts`'s
 * main fixture (same 3/4, one flat, quarter=60, pickup, "погрузись"
 * melisma, tie, eighth-triplet); this suite does not re-assert that
 * cross-parser agreement (`mnx-parser.test.ts` and `musicxml-parser.test.ts`
 * already do), only that MnxScoreParser's own output on it is pinned.
 *
 * Determinism and the one thing normalized: `mnx-parser.ts:251-259`
 * (`syllableId`) assigns each syllable a fresh `crypto.randomUUID()` (or a
 * `Date.now()`/`Math.random()` fallback) when the source's lyric carries
 * no id of its own, as is the case for every lyric in this fixture, so
 * every `syllable.id` in the raw `ParsedScore` differs from run to run.
 * Proven and then normalized exactly as in
 * `musicxml-parser.approval.test.ts` (see that file's header for the full
 * rationale): each unique `syllable.id`, in first-encountered order
 * walking `vocalLine`, becomes `SYL_0`, `SYL_1`, ... before snapshotting.
 * Nothing else in `mnx-parser.ts` calls `Date.now`, `Math.random`, or
 * `crypto` outside `syllableId`.
 *
 * The approved JSON has its object keys sorted at every level so a
 * reviewer's diff is about the data, not incidental key order.
 */

import { describe, expect, it } from 'vitest';
import { MnxScoreParser } from '../mnx-parser';
import type { MnxScoreInput, ParsedScore } from '../types';

// ── mainFixture: verbatim copy of mnx-parser.test.ts:42-193 ──────────

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

function mnxInput(data: unknown, sourcePath?: string): MnxScoreInput {
	return { format: 'mnx', data: data as object, ...(sourcePath ? { sourcePath } : {}) };
}

// ── helpers (identical in spirit to musicxml-parser.approval.test.ts) ─

function syllableIdsInOrder(score: ParsedScore): string[] {
	const seen: string[] = [];
	for (const e of score.vocalLine) {
		const id = e.syllable?.id;
		if (id !== undefined && !seen.includes(id)) seen.push(id);
	}
	return seen;
}

function normalizeSyllableIds(score: ParsedScore): ParsedScore {
	const order = syllableIdsInOrder(score);
	const map = new Map(order.map((id, i) => [id, `SYL_${i}`]));
	return {
		...score,
		vocalLine: score.vocalLine.map((e) =>
			e.syllable ? { ...e, syllable: { ...e.syllable, id: map.get(e.syllable.id)! } } : e,
		),
	};
}

function stableStringify(value: unknown): string {
	const sortKeys = (v: unknown): unknown => {
		if (Array.isArray(v)) return v.map(sortKeys);
		if (v !== null && typeof v === 'object') {
			const out: Record<string, unknown> = {};
			for (const k of Object.keys(v as object).sort()) {
				out[k] = sortKeys((v as Record<string, unknown>)[k]);
			}
			return out;
		}
		return v;
	};
	return JSON.stringify(sortKeys(value), null, 2) + '\n';
}

// ── the approval itself ──────────────────────────────────────────

const parser = new MnxScoreParser();

describe('MnxScoreParser approval: main fixture', () => {
	it('assigns a fresh syllable id on every parse (documents the non-determinism normalized below)', async () => {
		const a = await parser.parse(mnxInput(mainFixture()));
		const b = await parser.parse(mnxInput(mainFixture()));
		const idsA = syllableIdsInOrder(a.score);
		const idsB = syllableIdsInOrder(b.score);
		expect(idsA.length).toBeGreaterThan(0);
		expect(idsA).not.toEqual(idsB);
	});

	it('produces the approved ParsedScore, syllable ids normalized', async () => {
		const result = await parser.parse(mnxInput(mainFixture(), 'mnx-approval-main-fixture'));
		expect(result.errors).toEqual([]);
		const normalized = normalizeSyllableIds(result.score);
		await expect(stableStringify(normalized)).toMatchFileSnapshot(
			'./__approved__/mnx-main-fixture.parsed-score.json',
		);
	});

	it('produces the approved warnings list', async () => {
		const result = await parser.parse(mnxInput(mainFixture(), 'mnx-approval-main-fixture'));
		await expect(stableStringify(result.warnings)).toMatchFileSnapshot(
			'./__approved__/mnx-main-fixture.warnings.json',
		);
	});
});
