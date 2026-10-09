/**
 * bars-to-confirm.test.ts: which bars a singer is asked to confirm.
 *
 * Expectations are written from the bar rule (Dann, 2026-10-05 00:52) and from
 * plain beat counts, never from the mechanism under test.
 */

import { describe, it, expect } from 'vitest';
import type { Measure, NoteBase, ParsedScore, VocalLineEvent } from '@ilya/score-parser';
import { durationFraction } from './correction';
import { barsToConfirm } from './bars-to-confirm';

const note = (id: string, measureIndex: number, base: NoteBase = 'quarter'): VocalLineEvent => ({
	id,
	type: 'note',
	measureIndex,
	rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
	duration: { base, dots: 0, fraction: durationFraction(base, 0) },
	pitch: { step: 'G', octave: 3, alter: 0 },
});

/** A bar of `n` quarters in measure `m`. */
const quarters = (m: number, n: number): VocalLineEvent[] =>
	Array.from({ length: n }, (_, i) => note(`m${m}-${i}`, m));

const measure = (index: number, beats = 4, beatType = 4, extra: Partial<Measure> = {}): Measure => ({
	index,
	number: String(index + 1),
	timeSignature: { beats, beatType },
	keySignature: { fifths: 0 },
	expectedDuration: { numerator: beats, denominator: beatType },
	...extra,
});

/** `bars[i]` is how many quarters measure i holds; extras patch a measure. */
function score(bars: number[], extras: Record<number, Partial<Measure>> = {}, sig = { beats: 4, beatType: 4 }) {
	return {
		measures: bars.map((_, i) => measure(i, sig.beats, sig.beatType, extras[i])),
		vocalLine: bars.flatMap((n, i) => quarters(i, n)),
	} satisfies Pick<ParsedScore, 'measures' | 'vocalLine'>;
}

describe('which bars a singer is asked to confirm', () => {
	it('names a bar short by a beat, reading "3 of 4"', () => {
		expect(barsToConfirm(score([4, 3, 4, 4]))).toEqual([{ measureIndex: 1, number: '2', actual: 3, expected: 4 }]);
	});

	it('names a bar that is too long', () => {
		expect(barsToConfirm(score([4, 5, 4]))).toEqual([{ measureIndex: 1, number: '2', actual: 5, expected: 4 }]);
	});

	it('does not name a bar that fits, and says nothing for a score of fitting bars', () => {
		expect(barsToConfirm(score([4, 4, 4]))).toEqual([]);
	});

	it('does not name a pickup', () => {
		expect(barsToConfirm(score([1, 4, 4, 4], { 0: { isPickup: true, number: '0' } }))).toEqual([]);
	});

	it('does not name a first bar that is short, flagged a pickup or not', () => {
		expect(barsToConfirm(score([2, 4, 4]))).toEqual([]);
	});

	it('does not name a pickup and the last bar that completes it', () => {
		expect(barsToConfirm(score([1, 4, 4, 3]))).toEqual([]);
	});

	it('names a short last bar that does not complete the pickup', () => {
		expect(barsToConfirm(score([1, 4, 4, 2]))).toEqual([{ measureIndex: 3, number: '4', actual: 2, expected: 4 }]);
	});

	it('names a short last bar when the first bar is a whole bar', () => {
		expect(barsToConfirm(score([4, 4, 3]))).toEqual([{ measureIndex: 2, number: '3', actual: 3, expected: 4 }]);
	});

	it('still names a long first bar', () => {
		expect(barsToConfirm(score([5, 4, 4]))).toEqual([{ measureIndex: 0, number: '1', actual: 5, expected: 4 }]);
	});

	it('honours a metre change: each bar is read against its own signature', () => {
		const s = {
			measures: [
				measure(0, 3, 4),
				measure(1, 3, 4),
				measure(2, 4, 4),
				measure(3, 4, 4),
				measure(4, 4, 4),
			],
			vocalLine: [...quarters(0, 3), ...quarters(1, 3), ...quarters(2, 4), ...quarters(3, 3), ...quarters(4, 4)],
		};
		// Three quarters fit 3/4 and are named under 4/4.
		expect(barsToConfirm(s)).toEqual([{ measureIndex: 3, number: '4', actual: 3, expected: 4 }]);
	});

	it('reads a bar in the signature\'s own unit, fractional where it must be', () => {
		const s = score([6, 6]);
		s.vocalLine.push(note('extra', 1, 'eighth'));
		expect(barsToConfirm({ ...s, measures: s.measures.map((m) => ({ ...m, timeSignature: { beats: 6, beatType: 4 } })) }))
			.toEqual([{ measureIndex: 1, number: '2', actual: 6.5, expected: 6 }]);
	});

	it('sets aside the pair either side of a repeat sign, and names a lone short bar elsewhere', () => {
		// bar 0 whole; bar 1 short with the end repeat; bar 2 short and completing it; bar 3 short on its own.
		const s = score([4, 3, 1, 4, 2, 4], { 1: { repeatEnd: true } });
		expect(barsToConfirm(s)).toEqual([{ measureIndex: 4, number: '5', actual: 2, expected: 4 }]);
	});

	it('sets aside the pair on the other side of a forward repeat sign', () => {
		const s = score([4, 4, 3, 1, 4], { 3: { repeatStart: true } });
		expect(barsToConfirm(s)).toEqual([]);
	});

	it('sets aside the first and last bar of a repeated section', () => {
		// The section opens at bar 2 (forward repeat) on one beat and closes at bar 4 on three.
		const s = score([4, 4, 1, 4, 3, 4], { 2: { repeatStart: true }, 4: { repeatEnd: true } });
		expect(barsToConfirm(s)).toEqual([]);
	});

	it('does not set aside two short bars across a repeat sign that do not make a whole bar', () => {
		const s = score([4, 3, 2, 4], { 1: { repeatEnd: true } });
		expect(barsToConfirm(s).map((b) => b.measureIndex)).toEqual([1, 2]);
	});

	it('names a short bar mid-piece when no repeat sign is carried, even if its neighbour would complete it', () => {
		// A double bar is not carried by the parser, so it is not guessed.
		expect(barsToConfirm(score([4, 3, 1, 4, 4]))).toEqual([
			{ measureIndex: 1, number: '2', actual: 3, expected: 4 },
			{ measureIndex: 2, number: '3', actual: 1, expected: 4 },
		]);
	});

	it('skips bars that hold no event and gives the number as printed', () => {
		const s = score([4, 0, 3], { 2: { number: 'X2' } });
		expect(barsToConfirm(s)).toEqual([{ measureIndex: 2, number: 'X2', actual: 3, expected: 4 }]);
	});

	it('changes no input and returns [] for an empty score', () => {
		const s = score([1, 4, 3]);
		const before = JSON.stringify(s);
		barsToConfirm(s);
		expect(JSON.stringify(s)).toBe(before);
		expect(barsToConfirm({ measures: [], vocalLine: [] })).toEqual([]);
	});
});
