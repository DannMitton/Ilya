/**
 * The app-side performance-order seam (M0 jump-family wiring).
 *
 * This pins the composition `VoiceProfilePane` performs: the analysis path reads
 * the score in sung PERFORMANCE order (`scoreInPerformanceOrder` → `analyzeScore`
 * → `buildWatchList`), while the render path reads the NOTATED score unchanged
 * (`paginateScore`). The two must diverge exactly at material the sung sequence
 * skips: an event a jump never reaches earns no acoustic mark and no watch entry,
 * yet still renders as written. The engraved order itself never changes here; the
 * strophic-render ruling (D3) is not pre-empted.
 *
 * Pure composition test (no Svelte mount): it exercises the same package + app
 * functions the pane wires together, with a stub vowel resolver so the assertion
 * is about the sung SEQUENCE, not Russian vowel resolution (covered by
 * analyze-per-verse.test.ts and vowel-resolver.test.ts).
 */

import { describe, it, expect } from 'vitest';
import {
	analyzeScore,
	paginateScore,
	scoreInPerformanceOrder,
	type Measure,
	type ParsedScore,
	type VocalLineEvent,
	type VoiceProfileSnapshot,
	type VowelResolver
} from '@ilya/score-parser';
import { buildWatchList } from './watchlist';

const TS = { beats: 4, beatType: 4 } as const;
const KS = { fifths: 0 } as const;
const WHOLE = { numerator: 1, denominator: 1 };

function measure(index: number, extra: Partial<Measure> = {}): Measure {
	return {
		index,
		number: String(index + 1),
		timeSignature: { ...TS },
		keySignature: { ...KS },
		expectedDuration: { ...WHOLE },
		...extra
	};
}

function note(id: string, measureIndex: number): VocalLineEvent {
	return {
		id,
		type: 'note',
		measureIndex,
		rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
		duration: { base: 'quarter', dots: 0, fraction: { numerator: 1, denominator: 4 } },
		pitch: { step: 'C', octave: 4, alter: 0 }
	};
}

function scoreOf(measures: Measure[]): ParsedScore {
	return {
		source: { format: 'musicxml', fidelity: 'native', origin: 'musicxml-direct', sourceWarnings: [] },
		vocalPart: { partId: 'P1', partName: 'Voice' },
		measures,
		keySignatures: [{ measureIndex: 0, signature: { ...KS } }],
		timeSignatures: [{ measureIndex: 0, signature: { ...TS } }],
		tempoMarkings: [],
		vocalLine: measures.map((m) => note(`n${m.index}`, m.index))
	};
}

const allA: VowelResolver = () => 'a';
const profile: VoiceProfileSnapshot = { fR1: { a: 700 } };

describe('performance-order seam (VoiceProfilePane analysis vs render)', () => {
	// segno@0, Fine@2, D.S.@3, then m4 — a tail the jump never reaches.
	const notated = scoreOf([
		measure(0, { jump: { segno: 'A' } }),
		measure(1),
		measure(2, { jump: { fine: true } }),
		measure(3, { jump: { dalSegno: 'A' } }),
		measure(4)
	]);

	it('analysis sees performance order while the render input stays notated', () => {
		// The two derivations the pane makes from one `readingScore`.
		const analysisScore = scoreInPerformanceOrder(notated).score;
		const analyzed = analyzeScore(analysisScore, profile, allA);

		// Analysis: sung sequence, so the never-reached m4 note has no mark.
		expect(analysisScore.vocalLine.map((e) => e.id).join(' ')).toBe('n0 n1 n2 n3 n0 n1 n2');
		expect(analyzed.events['n4']).toBeUndefined();

		// Render: the notated score is untouched, and pagination lays out ALL
		// notated measures — including m4, which analysis dropped.
		expect(notated.vocalLine.map((e) => e.id).join(' ')).toBe('n0 n1 n2 n3 n4');
		const paginated = paginateScore(notated, analyzed, { pageWidth: 4000 });
		const covers = (i: number): boolean =>
			paginated.systems.some((s) => s.fromMeasure <= i && s.toMeasure >= i);
		expect(covers(4)).toBe(true);
	});

	it('the watch list reads the notated score but never surfaces a never-sung note', () => {
		const analyzed = analyzeScore(scoreInPerformanceOrder(notated).score, profile, allA);
		const watch = buildWatchList(notated, analyzed, 1);
		// Whatever it lists, no entry may anchor to the note the jump never reaches.
		expect(watch.entries.every((e) => e.eventId !== 'n4')).toBe(true);
	});

	it('a plain score is analysed exactly as before the wiring (no reordering)', () => {
		const plain = scoreOf([measure(0), measure(1), measure(2)]);
		const projected = scoreInPerformanceOrder(plain);
		expect(projected.score).toBe(plain); // identical input reaches both paths
		expect(projected.reordered).toBe(false);
		const before = analyzeScore(plain, profile, allA);
		const after = analyzeScore(projected.score, profile, allA);
		expect(Object.keys(after.events).sort()).toEqual(Object.keys(before.events).sort());
	});
});
