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

// ── Increment 2: the jump family ──────────────────────────────────────────────
// Jump marker builders. Tokens default to 'A' so the single-pair case is terse.
const dc = (): MeasureRepeatMarkers => ({ daCapo: true });
const ds = (token = 'A'): MeasureRepeatMarkers => ({ dalSegno: token });
const segno = (token = 'A'): MeasureRepeatMarkers => ({ segno: token });
const coda = (token = 'A'): MeasureRepeatMarkers => ({ coda: token });
const tocoda = (token = 'A'): MeasureRepeatMarkers => ({ toCoda: token });
const fine = (): MeasureRepeatMarkers => ({ fine: true });

describe('unfold: jumps (increment 2)', () => {
	it('plain D.C. plays the whole piece twice', () => {
		expect(seq(unfold([plain(), plain(), dc()]))).toBe('0.1 1.1 2.1 0.2 1.2 2.2');
	});
	it('D.C. al Fine da-capos and stops at Fine', () => {
		// m1 is Fine; on the first pass Fine is inert, on the return it ends the piece.
		expect(seq(unfold([plain(), fine(), dc()]))).toBe('0.1 1.1 2.1 0.2 1.2');
	});
	it('D.C. al Coda da-capos, then jumps at To Coda to the coda section', () => {
		expect(seq(unfold([plain(), tocoda(), dc(), coda()]))).toBe('0.1 1.1 2.1 0.2 1.2 3.1');
	});
	it('D.S. al Fine returns to the segno and stops at Fine', () => {
		expect(seq(unfold([plain(), segno(), fine(), ds()]))).toBe('0.1 1.1 2.1 3.1 1.2 2.2');
	});
	it('D.S. al Coda returns to the segno, then jumps at To Coda', () => {
		expect(seq(unfold([plain(), segno(), tocoda(), ds(), coda()]))).toBe(
			'0.1 1.1 2.1 3.1 1.2 2.2 4.1'
		);
	});
	it('a simple repeat is taken on the first pass but not on the da-capo return (minuet convention)', () => {
		// m0..m1 repeat, m2 Fine, m3 D.C. On the da capo the repeat is suppressed.
		const m = [start(), end(), fine(), dc()];
		expect(seq(unfold(m))).toBe('0.1 1.1 0.2 1.2 2.1 3.1 0.3 1.3 2.2');
	});
	it('a lone segno with no Dal Segno is inert and falls back to identity order', () => {
		expect(seq(unfold([segno(), plain(), plain()]))).toBe('0.1 1.1 2.1');
	});
});

describe('unfold: jump flags (fall back to as-written, never guess)', () => {
	it('flags an unstructured jump as unsupported (legacy hasJump path)', () => {
		const r = unfold([plain(), { hasJump: true }]);
		expect(r.ok).toBe(false);
		if (!r.ok) {
			expect(r.flag.code).toBe('jump-unsupported-v1');
			expect(r.flag.kind).toBe('unsupported');
			expect(r.flag.at).toBe(1);
		}
	});
	it('flags a printed jump mark with no <sound> as ambiguous', () => {
		const r = unfold([plain(), { jumpMarkWithoutSound: true }]);
		expect(r.ok).toBe(false);
		if (!r.ok) {
			expect(r.flag.code).toBe('jump-mark-without-sound');
			expect(r.flag.kind).toBe('ambiguous');
			expect(r.flag.at).toBe(1);
		}
	});
	it('flags voltas combined with a jump as unsupported', () => {
		const m = [start(), e([1]), e([1], { endRepeat: true }), e([2]), dc()];
		expect(seq(unfold(m))).toBe('FLAG:volta-with-jump');
	});
	it('flags more than one jump as unsupported', () => {
		expect(seq(unfold([dc(), plain(), dc()]))).toBe('FLAG:multiple-jumps');
	});
	it('flags a Dal Segno with no segno as ambiguous', () => {
		const r = unfold([plain(), ds()]);
		expect(r.ok).toBe(false);
		if (!r.ok) expect(r.flag.code).toBe('jump-target-missing');
	});
	it('flags a To Coda with no matching Coda as ambiguous', () => {
		const r = unfold([tocoda(), dc()]);
		expect(r.ok).toBe(false);
		if (!r.ok) expect(r.flag.code).toBe('jump-target-missing');
	});
	it('flags a jump control sharing a barline with a repeat as ambiguous', () => {
		const r = unfold([plain(), { daCapo: true, endRepeat: true }]);
		expect(r.ok).toBe(false);
		if (!r.ok) expect(r.flag.code).toBe('jump-repeat-collision');
	});
	it('flags after-jump as unsupported', () => {
		const m = [start(), { endRepeat: true, afterJump: true }, fine(), dc()];
		expect(seq(unfold(m))).toBe('FLAG:after-jump-unsupported');
	});
	it('flags time-only as unsupported', () => {
		expect(seq(unfold([plain(), { toCoda: 'A', timeOnly: true }, dc(), coda()]))).toBe(
			'FLAG:time-only-unsupported'
		);
	});
	it('flags a Coda placed before its To Coda as ambiguous', () => {
		const r = unfold([coda(), tocoda(), dc()]);
		expect(r.ok).toBe(false);
		if (!r.ok) expect(r.flag.code).toBe('coda-before-tocoda');
	});
	it('flags a segno placed after its Dal Segno as ambiguous', () => {
		const r = unfold([ds(), segno()]);
		expect(r.ok).toBe(false);
		if (!r.ok) expect(r.flag.code).toBe('segno-after-dalsegno');
	});
	it('flags both Fine and Coda on one jump as ambiguous', () => {
		const r = unfold([tocoda(), fine(), dc(), coda()]);
		expect(r.ok).toBe(false);
		if (!r.ok) expect(r.flag.code).toBe('fine-and-coda');
	});
	it('flags a Coda or Fine with no origin to trigger it as ambiguous', () => {
		const r = unfold([plain(), fine(), plain()]);
		expect(r.ok).toBe(false);
		if (!r.ok) expect(r.flag.code).toBe('jump-marker-without-origin');
	});
});

describe('markersFromMeasures: jump fields', () => {
	it('bridges parsed jump navigation to unfolder markers, then unfolds a D.C. al Coda', () => {
		const measures: MeasureLike[] = [
			{},
			{ jump: { toCoda: 'A' } },
			{ jump: { daCapo: true } },
			{ jump: { coda: 'A' } }
		];
		const markers = markersFromMeasures(measures);
		expect(markers).toEqual([{}, { toCoda: 'A' }, { daCapo: true }, { coda: 'A' }]);
		expect(seq(unfold(markers))).toBe('0.1 1.1 2.1 0.2 1.2 3.1');
	});
	it('maps after-jump and the mark-without-sound flag through', () => {
		const measures: MeasureLike[] = [
			{ repeatEnd: true, repeatAfterJump: true },
			{ jump: { markWithoutSound: true } }
		];
		expect(markersFromMeasures(measures)).toEqual([
			{ endRepeat: true, afterJump: true },
			{ jumpMarkWithoutSound: true }
		]);
	});
});
