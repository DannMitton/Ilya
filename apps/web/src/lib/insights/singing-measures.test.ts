/**
 * N.123 part 2: the half-mass band, the centre of gravity, and the cycle dose.
 * Every expected value below is worked by hand from the rows, never read back
 * from the functions under test.
 */
import { describe, expect, it } from 'vitest';
import type { Pitch } from '@ilya/score-parser';
import type { FigureRow, SecondsFigure } from './insights';
import { centreOfGravity, cycleDose, formatCycles, halfMassBand } from './singing-measures';

const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });
const row = (midi: number, quavers: number, spellings: Pitch[] = []): FigureRow => ({ midi, quavers, spellings, tags: [] });

describe('the half-mass band', () => {
	it('is the narrowest run holding at least half the time', () => {
		// Total 20. D3..F3 (50, 52, 53) holds 4 + 4 + 4 = 12, width 3. No run of width 2 or less reaches 10.
		const rows = [row(45, 2), row(50, 4), row(52, 4), row(53, 4), row(57, 3), row(62, 3)];
		expect(halfMassBand(rows)).toEqual({ low: 50, high: 53, share: 12 / 20 });
	});

	it('takes the heavier of two runs of equal width', () => {
		// Total 20. 48..50 holds 10 (width 2); 50..52 holds 6 + 5 = 11 (width 2). One pitch alone never reaches 10.
		const rows = [row(48, 4), row(50, 6), row(52, 5), row(55, 5)];
		expect(halfMassBand(rows)).toEqual({ low: 50, high: 52, share: 11 / 20 });
	});

	it('is one pitch when one pitch holds half', () => {
		expect(halfMassBand([row(50, 1), row(55, 5), row(60, 4)])).toEqual({ low: 55, high: 55, share: 0.5 });
	});

	it('is null with no time', () => {
		expect(halfMassBand([])).toBeNull();
	});
});

describe('the centre of gravity (Rastall, via Barcan 2013 p. 37)', () => {
	it('is the time-weighted mean semitone, named as the piece spells it', () => {
		// (50·2 + 52·1 + 55·1) / 4 = 207 / 4 = 51.75, nearest 52, sung as E3.
		const c = centreOfGravity([row(50, 2, [P('D', 3)]), row(52, 1, [P('E', 3)]), row(55, 1, [P('G', 3)])])!;
		expect(c.value).toBe(51.75);
		expect(c.midi).toBe(52);
		expect(c.pitch).toEqual(P('E', 3));
	});

	it('takes the least-altered spelling the piece sings there', () => {
		// Der Mond's case: the piece sings both B♯3 and C4 at MIDI 60.
		const c = centreOfGravity([row(60, 1, [P('B', 3, 1), P('C', 4)])])!;
		expect(c.pitch).toEqual(P('C', 4));
	});

	it('names an unsung black key by the nearest sung accidental', () => {
		// (50 + 52) / 2 = 51, not sung; the nearest sung accidental is B♭3 (58), a flat: E♭3.
		const c = centreOfGravity([row(50, 1, [P('D', 3)]), row(52, 1, [P('E', 3)]), row(58, 0.0001, [P('B', 3, -1)])])!;
		expect(c.midi).toBe(51);
		expect(c.pitch).toEqual(P('E', 3, -1));
	});

	it('names an unsung black key a sharp when the piece sings no accidental', () => {
		const c = centreOfGravity([row(50, 1, [P('D', 3)]), row(52, 1, [P('E', 3)])])!;
		expect(c.pitch).toEqual(P('D', 3, 1));
	});
});

describe('the cycle dose', () => {
	const point = (q: number): SecondsFigure => ({ kind: 'point', seconds: q * 0.5 });
	it('sums f0 × seconds over the sung pitches', () => {
		// A3 = 220 Hz for 10 quavers × 0.5 s = 1100; A4 = 440 Hz for 2 × 0.5 s = 440. Total 1540.
		expect(cycleDose([row(57, 10), row(69, 2)], point)).toEqual({ kind: 'point', cycles: 1540 });
	});

	it('is a span when the tempo is inferred', () => {
		const range = (q: number): SecondsFigure => ({ kind: 'range', low: q * 0.4, high: q * 0.6 });
		// A3 for 10 quavers: 220 × 4 = 880 to 220 × 6 = 1320.
		const d = cycleDose([row(57, 10)], range)!;
		expect(d.kind).toBe('range');
		if (d.kind === 'range') {
			expect(d.low).toBeCloseTo(880, 9);
			expect(d.high).toBeCloseTo(1320, 9);
		}
	});

	it('is absent without a tempo', () => {
		expect(cycleDose([row(57, 10)], null)).toBeNull();
	});
});

describe('the count as printed', () => {
	it('rounds to two significant figures and groups thousands by language', () => {
		expect(formatCycles(14_327, 'en')).toBe('14,000');
		expect(formatCycles(14_327, 'fr')).toBe('14 000');
		expect(formatCycles(1_540, 'en')).toBe('1,500');
		expect(formatCycles(986, 'fr')).toBe('990');
	});
});
