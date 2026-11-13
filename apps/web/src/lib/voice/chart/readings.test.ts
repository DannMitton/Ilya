import { describe, expect, it } from 'vitest';
import type { CalibratedFormant, Vowel } from '../engine/types';
import { noteReading, readingRows, signedCents } from './readings';

const f = (f1: number, f2?: number, extra: Partial<CalibratedFormant> = {}): CalibratedFormant =>
	({ f1, ...(f2 === undefined ? {} : { f2 }), confidence: 'high', reading: 'captured', source: 'measured-user', ...extra }) as CalibratedFormant;

describe('signed cents', () => {
	it('prints a plus, a true minus, and ±0', () => {
		expect(signedCents(16)).toBe('+16');
		expect(signedCents(-3)).toBe('−3');
		expect(signedCents(0)).toBe('±0');
		expect(signedCents(-3)).not.toContain('-');
	});
});

describe('a frequency as note and cents', () => {
	it('A4 at 440 Hz is A4 ±0', () => {
		const r = noteReading(440);
		expect([r.hzText, r.note, r.cents, r.centsText, r.text]).toEqual(['440', 'A4', 0, '±0', 'A4 ±0']);
	});
	it('D4 is 293.66 Hz: 296 Hz is D4 +14', () => {
		// 1200 * log2(296 / 293.6648) = 13.7, rounded to 14.
		expect(noteReading(296).text).toBe('D4 +14');
	});
	it('a reading below the nearest note carries a true minus', () => {
		// 381 Hz lies between F♯4 (369.99) and G4 (392.00); it is 49 cents under G4, so the nearest note is G4 and the cents are negative.
		const r = noteReading(381);
		expect(r.note).toBe('G4');
		expect(r.cents).toBe(-49);
		expect(r.centsText.startsWith('−')).toBe(true);
	});
	it('writes sharps with the sharp sign, as the pages do, and the digit flush to the name', () => {
		expect(noteReading(369.99).note).toBe('F♯4');
	});
	it('uses the same name in French (the page convention writes pitch as English does)', () => {
		expect(noteReading(440, 'fr').note).toBe('A4');
	});
	it('never prints −0', () => {
		for (const hz of [440, 440.01, 439.99, 261.63, 261.62, 261.64]) expect(noteReading(hz).centsText).not.toBe('−0');
	});
});

describe('the rows', () => {
	it('lists only sung vowels, in Grayson’s order, and leaves out an estimate', () => {
		const profile: Partial<Record<Vowel, CalibratedFormant>> = {
			u: f(346, 804),
			i: f(296, 1705),
			ɨ: f(404, 1100, { reading: 'estimated' }),
			ɛ: f(577, 1311, { reading: 'provisional', confidence: 'low' })
		};
		expect(readingRows(profile).map((r) => r.vowel)).toEqual(['i', 'ɛ', 'u']);
	});
	it('gives a reading with no fR2 no fR2 cell', () => {
		const [r] = readingRows({ e: f(381) });
		expect(r.fR1.hzText).toBe('381');
		expect(r.fR2).toBeUndefined();
	});
	it('is empty for an empty profile', () => {
		expect(readingRows({})).toEqual([]);
	});
});
