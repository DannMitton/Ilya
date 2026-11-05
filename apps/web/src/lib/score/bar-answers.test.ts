/**
 * bar-answers.test.ts: what the singer answered about a bar is kept, and honoured only while the bar is the same.
 *
 * Expectations are written from the brief (corrections slice 3, r2, 2026-11-05) and its amendments 4, 6, and 7,
 * not from the mechanism under test. Scores are built from plain quarters as `bars-to-confirm.test.ts` builds them;
 * the "after an offer" cases run the real `applyCorrections` so the fingerprint is read off a corrected line.
 */

import { describe, it, expect } from 'vitest';
import type { Measure, NoteBase, ParsedScore, VocalLineEvent } from '@ilya/score-parser';
import { applyCorrections, durationFraction, type CorrectionMap } from './correction';
import { barsToConfirm } from './bars-to-confirm';
import {
	answeredBars,
	barsToAsk,
	emptyBarAnswers,
	fingerprintOfBar,
	stillToConfirm,
	withBarAnswer,
	type BarAnswers,
} from './bar-answers';

type Scorish = Pick<ParsedScore, 'measures' | 'vocalLine'>;

const note = (id: string, measureIndex: number, base: NoteBase = 'quarter', over: Partial<VocalLineEvent> = {}): VocalLineEvent => ({
	id,
	type: 'note',
	measureIndex,
	rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
	duration: { base, dots: 0, fraction: durationFraction(base, 0) },
	pitch: { step: 'G', octave: 3, alter: 0 },
	...over,
});

const measure = (index: number, beats = 4, beatType = 4): Measure => ({
	index,
	number: String(index + 1),
	timeSignature: { beats, beatType },
	keySignature: { fifths: 0 },
	expectedDuration: { numerator: beats, denominator: beatType },
});

/** `bars[i]` is how many quarters measure i holds. Event ids are `m{bar}-{n}`. */
function score(bars: number[], sig = { beats: 4, beatType: 4 }): Scorish {
	return {
		measures: bars.map((_, i) => measure(i, sig.beats, sig.beatType)),
		vocalLine: bars.flatMap((n, i) => Array.from({ length: n }, (_, k) => note(`m${i}-${k}`, i))),
	};
}

/** The score the page would compute from, after hand corrections. */
const corrected = (s: Scorish, map: CorrectionMap): Scorish => ({ measures: s.measures, vocalLine: applyCorrections(s.vocalLine, map) });

// Bar 1 holds three quarters in 4/4. It is the one bar slice 1 names (the first and last bars are whole).
const BASE = score([4, 3, 4, 4]);

describe('a bar answered "Matches my score" is not asked again', () => {
	it('is asked before it is answered, and not after', () => {
		const bars = barsToConfirm(BASE);
		expect(bars.map((b) => b.measureIndex)).toEqual([1]);
		expect(stillToConfirm(bars, emptyBarAnswers(), BASE).map((b) => b.measureIndex)).toEqual([1]);

		const answers = withBarAnswer(emptyBarAnswers(), BASE, 1, 'matches-print');
		expect(stillToConfirm(bars, answers, BASE)).toEqual([]);
	});

	it('does not drop a different bar that was never answered', () => {
		const s = score([4, 3, 4, 5]);
		const bars = barsToConfirm(s);
		expect(bars.map((b) => b.measureIndex)).toEqual([1, 3]);
		const answers = withBarAnswer(emptyBarAnswers(), s, 1, 'matches-print');
		expect(stillToConfirm(bars, answers, s).map((b) => b.measureIndex)).toEqual([3]);
	});

	it('keeps one entry per bar, the last answer replacing', () => {
		const first = withBarAnswer(emptyBarAnswers(), BASE, 1, 'matches-print');
		const second = withBarAnswer(first, BASE, 1, 'changed');
		expect(Object.keys(second.bars)).toEqual(['1']);
		expect(second.bars['1'].kind).toBe('changed');
		// The input is not mutated.
		expect(first.bars['1'].kind).toBe('matches-print');
	});

	it('records nothing for a bar with no metre to read, so it is asked again', () => {
		const noMetre: Scorish = { measures: [], vocalLine: BASE.vocalLine };
		const answers = withBarAnswer(emptyBarAnswers(), noMetre, 1, 'matches-print');
		expect(answers).toEqual(emptyBarAnswers());
	});
});

describe('the same bar after one of its notes changes is asked again', () => {
	const bars = barsToConfirm(BASE);
	const answered = withBarAnswer(emptyBarAnswers(), BASE, 1, 'matches-print');

	it('asks again when a note gains a dot', () => {
		const dotted = corrected(BASE, { 'm1-0': { dots: 1 } });
		expect(stillToConfirm(barsToConfirm(dotted), answered, dotted).map((b) => b.measureIndex)).toEqual([1]);
	});

	it('asks again when a note changes length', () => {
		// The bar now fills its metre, so slice 1 stops listing it; the answer is checked against the list as it was.
		const longer = corrected(BASE, { 'm1-1': { base: 'half' } });
		expect(barsToConfirm(longer)).toEqual([]);
		expect(fingerprintOfBar(longer, 1)).not.toBe(fingerprintOfBar(BASE, 1));
		expect(stillToConfirm(bars, answered, longer).map((b) => b.measureIndex)).toEqual([1]);
	});

	it('asks again when a note becomes a rest', () => {
		const rested = corrected(BASE, { 'm1-2': { type: 'rest' } });
		expect(stillToConfirm(barsToConfirm(rested), answered, rested).map((b) => b.measureIndex)).toEqual([1]);
	});

	it('asks again when a note is deleted', () => {
		const fewer = corrected(BASE, { 'm1-2': { deleted: true } });
		expect(stillToConfirm(barsToConfirm(fewer), answered, fewer).map((b) => b.measureIndex)).toEqual([1]);
	});

	it('asks again when the metre in force changes under the same notes', () => {
		const sixFour: Scorish = { measures: BASE.measures.map((m) => (m.index === 1 ? measure(1, 3, 4) : m)), vocalLine: BASE.vocalLine };
		// 3 quarters now fits 3/4, so the bar leaves slice 1's list anyway: the check is on the fingerprint.
		expect(fingerprintOfBar(sixFour, 1)).not.toBe(fingerprintOfBar(BASE, 1));
		expect(stillToConfirm(bars, answered, sixFour).map((b) => b.measureIndex)).toEqual([1]);
	});

	it('does NOT ask again when only the pitch changes (DESK DEFAULT, amendment 4)', () => {
		const nudged = corrected(BASE, { 'm1-0': { pitch: { step: 'A', octave: 3, alter: 0 } } });
		expect(fingerprintOfBar(nudged, 1)).toBe(fingerprintOfBar(BASE, 1));
		expect(stillToConfirm(barsToConfirm(nudged), answered, nudged)).toEqual([]);
	});

	it('does NOT ask again when only the event ids and onsets differ (amendment 4)', () => {
		const rekeyed: Scorish = {
			measures: BASE.measures,
			vocalLine: BASE.vocalLine.map((e) => ({ ...e, id: `x-${e.id}`, rhythmicPosition: { fraction: { numerator: 1, denominator: 8 } } })),
		};
		expect(fingerprintOfBar(rekeyed, 1)).toBe(fingerprintOfBar(BASE, 1));
		expect(stillToConfirm(barsToConfirm(rekeyed), answered, rekeyed)).toEqual([]);
	});

	it('tells a tuplet from a plain run of the same printed notes', () => {
		const triplet: Scorish = {
			measures: BASE.measures,
			vocalLine: BASE.vocalLine.map((e) =>
				e.id === 'm1-0' ? { ...e, duration: { ...e.duration, tuplet: { actualNotes: 3, normalNotes: 2, normalType: 'quarter' as NoteBase } } } : e,
			),
		};
		expect(fingerprintOfBar(triplet, 1)).not.toBe(fingerprintOfBar(BASE, 1));
	});

	it('Undo after an applied offer changes the fingerprint, so the bar is asked again (amendment 4)', () => {
		// She applied an offer (a dot on the first note) and the app recorded "changed" against the DOTTED bar.
		const dotted = corrected(BASE, { 'm1-0': { dots: 1 } });
		const afterOffer = withBarAnswer(emptyBarAnswers(), dotted, 1, 'changed');
		expect(afterOffer.bars['1'].fingerprint).not.toBe(fingerprintOfBar(BASE, 1));
		// With the offer in place the answer is honoured, wherever slice 1 lists the bar.
		expect(stillToConfirm(bars, afterOffer, dotted)).toEqual([]);

		// Undo: the correction is cleared, the bar reads as printed again, and the answer was about the dotted note.
		const undone = corrected(BASE, {});
		expect(stillToConfirm(barsToConfirm(undone), afterOffer, undone).map((b) => b.measureIndex)).toEqual([1]);
	});
});

describe('put-away hides the line and not the answers', () => {
	const bars = barsToConfirm(score([4, 3, 4, 5]));
	const s = score([4, 3, 4, 5]);
	const answers: BarAnswers = { ...withBarAnswer(emptyBarAnswers(), s, 1, 'matches-print'), putAway: true };

	it('shows no bars to ask about', () => {
		expect(barsToAsk(bars, answers, s)).toEqual([]);
	});

	it('still keeps every answer, and stillToConfirm still sees them', () => {
		expect(answeredBars(answers).map((a) => [a.measureIndex, a.kind])).toEqual([[1, 'matches-print']]);
		expect(stillToConfirm(bars, answers, s).map((b) => b.measureIndex)).toEqual([3]);
	});

	it('asks as stillToConfirm does when the line is not put away', () => {
		const { putAway: _gone, ...open } = answers;
		expect(barsToAsk(bars, open, s).map((b) => b.measureIndex)).toEqual([3]);
	});
});

describe('a replaced score drops answers whose fingerprints no longer match', () => {
	it('honours a bar that is the same in the new score and asks again about one that is not', () => {
		const before = score([4, 3, 4, 5]);
		const answers = withBarAnswer(withBarAnswer(emptyBarAnswers(), before, 1, 'matches-print'), before, 3, 'matches-print');

		// The replacement keeps bar 1 as it was and has a different bar 3 (six quarters).
		const after = score([4, 3, 4, 6]);
		const asked = stillToConfirm(barsToConfirm(after), answers, after).map((b) => b.measureIndex);
		expect(asked).toEqual([3]);
	});

	it('keeps the stale answer in the record, not pruned (amendment 6), and honours it again if the bar returns', () => {
		const before = score([4, 3, 4, 5]);
		const answers = withBarAnswer(emptyBarAnswers(), before, 3, 'matches-print');
		const after = score([4, 3, 4, 6]);

		// Bar 1 was never answered, so it is asked in both scores; bar 3 is the one under test.
		expect(stillToConfirm(barsToConfirm(after), answers, after).map((b) => b.measureIndex)).toEqual([1, 3]);
		expect(answeredBars(answers).map((a) => a.measureIndex)).toEqual([3]);
		expect(stillToConfirm(barsToConfirm(before), answers, before).map((b) => b.measureIndex)).toEqual([1]);
	});

	it('asks again about an answered bar the new score no longer has a metre for', () => {
		const before = score([4, 3, 4, 5]);
		const answers = withBarAnswer(emptyBarAnswers(), before, 3, 'matches-print');
		const bars = barsToConfirm(before);
		const gone: Scorish = { measures: before.measures.filter((m) => m.index !== 3), vocalLine: before.vocalLine };
		expect(stillToConfirm(bars, answers, gone).map((b) => b.measureIndex)).toEqual([1, 3]);
	});
});

describe('answeredBars reads the field and tolerates a damaged one', () => {
	it('lists answers in bar order', () => {
		const s = score([4, 3, 4, 5]);
		const answers = withBarAnswer(withBarAnswer(emptyBarAnswers(), s, 3, 'changed'), s, 1, 'matches-print');
		expect(answeredBars(answers).map((a) => a.measureIndex)).toEqual([1, 3]);
	});

	it('leaves out an entry that is not well formed and keeps the rest', () => {
		const damaged = {
			bars: {
				'1': { kind: 'matches-print', fingerprint: '4/4|nquarter.0' },
				'2': { kind: 'surprise', fingerprint: 'x' },
				'3': { kind: 'changed' },
				'4': { kind: 'changed', fingerprint: 7 },
				'x': { kind: 'changed', fingerprint: 'x' },
				'1.5': { kind: 'changed', fingerprint: 'x' },
			},
		} as unknown as BarAnswers;
		expect(answeredBars(damaged).map((a) => a.measureIndex)).toEqual([1]);
	});

	it('returns nothing for an absent or empty field', () => {
		expect(answeredBars(undefined)).toEqual([]);
		expect(answeredBars(emptyBarAnswers())).toEqual([]);
	});
});
