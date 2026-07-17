import { describe, it, expect } from 'vitest';
import {
	unfold,
	asWrittenOrder,
	markersFromMeasures,
	type MeasureRepeatMarkers,
	type MeasureLike,
	type UnfoldResult
} from './unfold';

/** Render a result as a compact "source.pass ..." string, or "FLAG:code". */
function seq(r: UnfoldResult): string {
	if (!r.ok) return `FLAG:${r.flag.code}`;
	return r.order.map((o) => `${o.source}.${o.pass}`).join(' ');
}

// Compact marker builders.
const plain = (): MeasureRepeatMarkers => ({});
const start = (): MeasureRepeatMarkers => ({ startRepeat: true });
const end = (times?: number): MeasureRepeatMarkers => ({ endRepeat: true, ...(times ? { times } : {}) });
/** A measure inside an ending, sounding on `passes`. */
const e = (passes: number[], opts?: { endRepeat?: boolean }): MeasureRepeatMarkers => ({
	endingPasses: passes,
	...(opts?.endRepeat ? { endRepeat: true } : {})
});

describe('unfold: no repeats', () => {
	it('empty score is an empty order', () => {
		expect(seq(unfold([]))).toBe('');
	});
	it('plain measures are identity order, all pass 1', () => {
		expect(seq(unfold([plain(), plain(), plain()]))).toBe('0.1 1.1 2.1');
	});
});

describe('unfold: simple repeats', () => {
	it('a simple repeat plays twice by default', () => {
		expect(seq(unfold([plain(), start(), plain(), end(), plain()]))).toBe(
			'0.1 1.1 2.1 3.1 1.2 2.2 3.2 4.1'
		);
	});
	it('a repeat with times 3 plays three times', () => {
		expect(seq(unfold([start(), plain(), end(3)]))).toBe('0.1 1.1 2.1 0.2 1.2 2.2 0.3 1.3 2.3');
	});
	it('two sequential repeats are independent', () => {
		expect(seq(unfold([start(), end(), plain(), start(), end()]))).toBe(
			'0.1 1.1 0.2 1.2 2.1 3.1 4.1 3.2 4.2'
		);
	});
	it('a backward repeat with no forward repeat repeats from the top', () => {
		expect(seq(unfold([plain(), plain(), end()]))).toBe('0.1 1.1 2.1 0.2 1.2 2.2');
	});
});

describe('unfold: voltas', () => {
	it('a two-ending volta plays the first ending on pass 1 and the second on pass 2', () => {
		const m = [plain(), start(), plain(), e([1]), e([1], { endRepeat: true }), e([2]), e([2])];
		expect(seq(unfold(m))).toBe('0.1 1.1 2.1 3.1 4.1 1.2 2.2 5.2 6.2');
	});
	it('one-bar first and second endings (same measure opens and closes the ending)', () => {
		const m = [start(), plain(), e([1], { endRepeat: true }), e([2])];
		expect(seq(unfold(m))).toBe('0.1 1.1 2.1 0.2 1.2 3.2');
	});
	it('a three-ending volta plays each ending on its own pass', () => {
		const m = [
			start(),
			plain(),
			e([1]),
			e([1], { endRepeat: true }),
			e([2]),
			e([2], { endRepeat: true }),
			e([3]),
			e([3])
		];
		expect(seq(unfold(m))).toBe('0.1 1.1 2.1 3.1 0.2 1.2 4.2 5.2 0.3 1.3 6.3 7.3');
	});
	it('an ending shared across two passes plays on both, then a distinct third ending', () => {
		const m = [start(), e([1, 2]), e([1, 2], { endRepeat: true }), e([3]), e([3])];
		expect(seq(unfold(m))).toBe('0.1 1.1 2.1 0.2 1.2 2.2 0.3 3.3 4.3');
	});
});

describe('unfold: flags (fall back to as-written, never guess)', () => {
	it('flags a jump as unsupported in this increment', () => {
		const r = unfold([plain(), { hasJump: true }]);
		expect(r.ok).toBe(false);
		if (!r.ok) {
			expect(r.flag.code).toBe('jump-unsupported-v1');
			expect(r.flag.kind).toBe('unsupported');
			expect(r.flag.at).toBe(1);
		}
	});
	it('flags a nested repeat as unsupported', () => {
		expect(seq(unfold([start(), start(), end(), end()]))).toBe('FLAG:nested-repeat');
	});
	it('flags endings spread across more than one repeat span', () => {
		const m = [start(), e([1]), e([1], { endRepeat: true }), e([2]), e([2]), start(), end()];
		expect(seq(unfold(m))).toBe('FLAG:volta-multi-span');
	});
	it('flags endings with no repeat barline as ambiguous', () => {
		const m = [start(), e([1]), e([1]), e([2]), e([2])];
		const r = unfold(m);
		expect(r.ok).toBe(false);
		if (!r.ok) {
			expect(r.flag.code).toBe('volta-without-repeat');
			expect(r.flag.kind).toBe('ambiguous');
		}
	});
});

describe('markersFromMeasures', () => {
	it('bridges parsed measure fields to unfolder markers, then unfolds', () => {
		const measures: MeasureLike[] = [
			{},
			{ repeatStart: true },
			{ repeatEnd: true, repeatTimes: 3 }
		];
		const markers = markersFromMeasures(measures);
		expect(markers).toEqual([{}, { startRepeat: true }, { endRepeat: true, times: 3 }]);
		const r = unfold(markers);
		expect(r.ok && r.order.map((o) => `${o.source}.${o.pass}`).join(' ')).toBe(
			'0.1 1.1 2.1 1.2 2.2 1.3 2.3'
		);
	});
	it('maps ending passes through', () => {
		const measures: MeasureLike[] = [
			{ repeatStart: true },
			{ ending: { passes: [1] }, repeatEnd: true },
			{ ending: { passes: [2] } }
		];
		expect(markersFromMeasures(measures)).toEqual([
			{ startRepeat: true },
			{ endRepeat: true, endingPasses: [1] },
			{ endingPasses: [2] }
		]);
	});
});

describe('asWrittenOrder', () => {
	it('is the honest identity fallback', () => {
		expect(asWrittenOrder(3)).toEqual([
			{ source: 0, pass: 1 },
			{ source: 1, pass: 1 },
			{ source: 2, pass: 1 }
		]);
	});
});
