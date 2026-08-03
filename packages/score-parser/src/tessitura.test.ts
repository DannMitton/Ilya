/**
 * Pacheco tessitura tests.
 *
 * The headline acceptance test is PACHECO'S OWN WORKED EXAMPLE, published in the
 * Journal of Singing in 2013 with its bar heights, its threshold, and its stated
 * answer. Standing Rule V1 is satisfied by a journal article: no expected value
 * here can have come from the mechanism under test.
 *
 * The second fixture is Mitton's *Sunless 4*, the documented degeneracy, whose
 * expected answer was settled in E.19 by reading Fig. 6.27 directly rather than
 * by accepting a recollection.
 */

import { describe, expect, it } from 'vitest';
import { DEFAULT_MARGIN, optimalRegion, pachecoTessitura, thresholdAsNumber } from './tessitura';
import { midiOf } from './phonation';
import type { Fraction } from './types';

const q = (n: number): Fraction => {
	// Half-quaver resolution is the finest the sources record.
	const doubled = Math.round(n * 2);
	return doubled % 2 === 0 ? { numerator: doubled / 2, denominator: 1 } : { numerator: doubled, denominator: 2 };
};

const midi = (label: string): number => {
	const m = /^([A-G])(#?)(\d+)$/.exec(label);
	if (!m) throw new Error(`bad label ${label}`);
	const [, step, sharp, oct] = m;
	return midiOf({ step: step as 'A', octave: Number(oct), alter: sharp ? 1 : 0 });
};

const barsOf = (spec: Record<string, number>): Map<number, Fraction> =>
	new Map(Object.entries(spec).map(([label, v]) => [midi(label), q(v)]));

describe("Pacheco's own published example, Journal of Singing 69/5 (2013) p. 559", () => {
	// His figure, read off the article: bar heights per pitch.
	const CATALANI = barsOf({
		D4: 10, E4: 40, F4: 50, G4: 70, 'G#4': 2, A4: 110,
		B4: 130, C5: 100, 'C#5': 4, D5: 70, E5: 50, F5: 10,
	});

	it('reproduces his threshold: half the tallest bar, which he calls "the mean"', () => {
		const r = pachecoTessitura(CATALANI)!;
		// Tallest is 130 at B4. He states "the mean of this graph is 65."
		expect(thresholdAsNumber(r)).toBe(65);
	});

	it('reproduces his stated answer, G4 to D5', () => {
		const r = pachecoTessitura(CATALANI)!;
		expect(r.low).toBe(midi('G4'));
		expect(r.high).toBe(midi('D5'));
		expect(r.basis).toBe('half-maximum');
		expect(r.degenerate).toBe(false);
		// G4 70, A4 110, B4 130, C5 100, D5 70 reach 65. Five bars.
		expect(r.barsReaching).toBe(5);
	});

	it("WEAKNESS OF THIS FIXTURE, recorded rather than hidden: his figure does NOT discriminate the two readings of 'the mean' by band", () => {
		// Computed, not assumed. A first version of this test asserted that the
		// arithmetic mean "widens the band" and admits F4 and E5. It does not, and
		// the test failed. The honest statement is below.
		const heights = [10, 40, 50, 70, 2, 110, 130, 100, 4, 70, 50, 10];
		const arithmeticMean = heights.reduce((a, b) => a + b, 0) / heights.length;
		expect(arithmeticMean).toBeCloseTo(53.83, 2);
		// Both readings admit exactly the same five bars, because F4 and E5 sit at
		// 50, below BOTH thresholds. So the band alone cannot tell the two rules
		// apart on Pacheco's own figure.
		const byMean = [...CATALANI.values()].filter((v) => v.numerator / v.denominator >= arithmeticMean).length;
		const byHalfMax = [...CATALANI.values()].filter((v) => v.numerator / v.denominator >= 65).length;
		expect(byMean).toBe(5);
		expect(byHalfMax).toBe(5);
		// What DOES discriminate on his figure is the threshold itself, 65 against
		// 53.83, which the test above asserts. Recorded so nobody later reads the
		// band agreement as evidence about the rule.
		expect(arithmeticMean).not.toBeCloseTo(65, 1);
	});

	it('NEGATIVE CONTROL: on a histogram that DOES discriminate, the module takes half-maximum and not the mean', () => {
		// Constructed so the two rules give different BANDS, since Pacheco's own
		// figure cannot: heights 100, 60, 55, 50, 10.
		//   half-maximum = 50 → admits all four of 100, 60, 55, 50 → C4 to F4
		//   arithmetic mean = 55 → admits only 100, 60, 55        → C4 to E4
		const discriminating = barsOf({ C4: 100, D4: 60, E4: 55, F4: 50, G4: 10 });
		const mean = (100 + 60 + 55 + 50 + 10) / 5;
		expect(mean).toBe(55);

		const r = pachecoTessitura(discriminating)!;
		expect(thresholdAsNumber(r)).toBe(50); // half of 100, not the mean of 55
		expect(r.low).toBe(midi('C4'));
		expect(r.high).toBe(midi('F4')); // F4 is IN, which the mean reading would exclude
		expect(r.barsReaching).toBe(4);
	});

	it('NEGATIVE CONTROL: the band must MOVE when the bars move', () => {
		// A band that survives a changed histogram is measuring the plumbing.
		const shifted = barsOf({ D4: 130, E4: 100, F4: 70, G4: 40, A4: 10 });
		const r = pachecoTessitura(shifted)!;
		expect(thresholdAsNumber(r)).toBe(65);
		expect(r.low).toBe(midi('D4'));
		expect(r.high).toBe(midi('F4'));
	});
});

describe('the degeneracy, and Mitton\'s documented fallback', () => {
	// Sunless 4's bars, ROWS 52 TO 71 of `Mitton_Daniel_A_202006_DMA_datatables.xlsx`.
	//
	// PROVENANCE CHAIN, stated in full because the last version of this fixture was
	// read faithfully and was still wrong. These heights are read from
	// `claude/e21-tessitura-block-audit_2026-08-02.md` §3, which is itself a
	// recorded reading of the workbook with `openpyxl`, loaded twice, once
	// `data_only=True` for values and once for formula text, on 2026-08-02.
	// The workbook is one further link up and was not reachable from a connected
	// folder when this correction was made.
	//
	// WHY THE BLOCK CHANGED. The workbook carries TWO per-song row blocks, rows
	// 3-22 and rows 52-71, differing on almost every pitch. The prior fixture was
	// rows 3-22, read verbatim from `shane_mitton_reference_dataset.json`, which
	// was itself built from that block. The workbook's own `Worksheet sums` and
	// the dissertation prose both use rows 52-71. Printed p. 99, verbatim:
	// "F#3 occurs so frequently in this song (the equivalent of 50 out of 165
	// eighth notes)... If we calculate using the next most frequent value (G3)
	// instead, the tessitura becomes E3-C4." Both 165 and E3-C4 are this block.
	//
	// Reading protects you from inventing a number. It does not protect you from
	// inheriting one. Ask what the file you are reading was derived from.
	const SUNLESS_4 = barsOf({
		'D#4': 1, D4: 4, 'C#4': 9, C4: 12, B3: 15.5, 'A#3': 11, A3: 9,
		'G#3': 10, G3: 19, 'F#3': 51.5, E3: 15, 'D#3': 3.5, 'C#3': 3, B2: 1.5,
	});

	it("returns a ONE-NOTE band under the published rule, exactly as Fig. 6.27 draws it", () => {
		// 51.5 / 2 = 25.75 cuts only F#3, the next bar being G3 at 19. The
		// degeneracy is drawn on Mitton's own page, so reproducing it is the
		// correct behaviour, not a bug.
		const r = pachecoTessitura(SUNLESS_4, { allowFallback: false })!;
		expect(thresholdAsNumber(r)).toBe(25.75);
		expect(r.barsReaching).toBe(1);
		expect(r.low).toBe(midi('F#3'));
		expect(r.high).toBe(midi('F#3'));
		expect(r.basis).toBe('half-maximum');
	});

	it('re-bases on half the second-tallest bar and records that it did', () => {
		// Half of G3's 19 is 9.5, which admits E3 up to C4. This reproduces the
		// dissertation's own stated answer at printed p. 99, which is the
		// independent side of this cross-measure: the expected value comes from a
		// 2020 published sentence, never from `pachecoTessitura`.
		const r = pachecoTessitura(SUNLESS_4)!;
		expect(r.degenerate).toBe(true);
		expect(r.basis).toBe('half-second-maximum');
		expect(thresholdAsNumber(r)).toBe(9.5);
		expect(r.low).toBe(midi('E3'));
		expect(r.high).toBe(midi('C4'));
	});

	it('flags the knife-edge, which is a property of the method', () => {
		// C#4 holds 9 against a threshold of 9.5, so it falls HALF A QUAVER short
		// of the band, and C4 at 12 is the bar immediately above the line. The
		// upper edge turns on that half quaver, which is why it is reported.
		const r = pachecoTessitura(SUNLESS_4, { margin: q(2.5) })!;
		expect(r.marginal).toBe(true);
		expect(r.marginalPitches).toContain(midi('C#4'));
		expect(r.marginalPitches).toContain(midi('C4'));
	});

	it('NEGATIVE CONTROL: a histogram with no bar near the line is NOT flagged marginal', () => {
		const clean = barsOf({ C4: 100, D4: 90, E4: 5, F4: 4 });
		const r = pachecoTessitura(clean)!;
		expect(thresholdAsNumber(r)).toBe(50);
		expect(r.marginal).toBe(false);
		expect(r.marginalPitches).toEqual([]);
	});

	it('does not loop when every bar is the same height', () => {
		// The fallback must find a DISTINCT second height or decline to run.
		const flat = barsOf({ C4: 10, D4: 10, E4: 10 });
		const r = pachecoTessitura(flat)!;
		expect(r.barsReaching).toBe(3);
		expect(r.degenerate).toBe(false);
		expect(r.basis).toBe('half-maximum');
	});

	it('a single-pitch histogram degenerates and has no second bar to fall back to', () => {
		const one = barsOf({ C4: 40 });
		const r = pachecoTessitura(one)!;
		expect(r.low).toBe(midi('C4'));
		expect(r.high).toBe(midi('C4'));
		expect(r.basis).toBe('half-maximum');
		expect(r.degenerate).toBe(false); // no fallback was available, so none is claimed
	});
});

describe('abstention and shape', () => {
	it('returns undefined rather than a zero-width band when there is nothing to cut', () => {
		expect(pachecoTessitura(new Map())).toBeUndefined();
		expect(pachecoTessitura(new Map([[60, { numerator: 0, denominator: 1 }]]))).toBeUndefined();
	});

	it('refuses input that is not a Map', () => {
		expect(() => pachecoTessitura({ 60: 4 } as unknown as Map<number, Fraction>)).toThrow(/Map/);
	});

	it('states the margin it used, so a figure can be re-derived', () => {
		const r = pachecoTessitura(barsOf({ C4: 100, D4: 60 }))!;
		expect(r.margin).toEqual(DEFAULT_MARGIN);
	});
});

describe("Pacheco's optimal region: the intersection across a repertoire", () => {
	it('intersects overlapping bands', () => {
		expect(optimalRegion([{ low: 50, high: 62 }, { low: 55, high: 65 }, { low: 53, high: 60 }])).toEqual({
			low: 55,
			high: 60,
		});
	});

	it('NEGATIVE CONTROL: reports an EMPTY intersection rather than collapsing it', () => {
		// A repertoire that shares no common region is a real finding about the
		// repertoire. Returning a point would invent one.
		expect(optimalRegion([{ low: 50, high: 54 }, { low: 60, high: 66 }])).toBeUndefined();
	});

	it('a single tessitura is its own optimal region', () => {
		expect(optimalRegion([{ low: 55, high: 60 }])).toEqual({ low: 55, high: 60 });
	});

	it('abstains on no input, and refuses malformed input', () => {
		expect(optimalRegion([])).toBeUndefined();
		expect(() => optimalRegion([{ low: NaN, high: 60 }])).toThrow(/finite/);
	});
});
