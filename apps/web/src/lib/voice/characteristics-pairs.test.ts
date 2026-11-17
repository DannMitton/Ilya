import { describe, expect, it } from 'vitest';
import { invertedPairs } from './characteristics-pairs';

const p = (step: string, octave: number, alter = 0) => ({ step, octave, alter }) as never;

describe('the inverted-pair tests', () => {
	it('says nothing with no values, or with one end of a pair', () => {
		expect(invertedPairs(undefined)).toEqual({ range: false, tessitura: false });
		expect(invertedPairs({ rangeLow: p('C', 3) })).toEqual({ range: false, tessitura: false });
	});
	it('finds a range whose low note is above its high note, and only that pair', () => {
		expect(invertedPairs({ rangeLow: p('A', 4), rangeHigh: p('C', 3) })).toEqual({ range: true, tessitura: false });
		expect(invertedPairs({ rangeLow: p('C', 3), rangeHigh: p('A', 4) }).range).toBe(false);
	});
	it('finds a tessitura inverted on its own', () => {
		expect(invertedPairs({ tessituraLow: p('G', 4), tessituraHigh: p('E', 3) })).toEqual({ range: false, tessitura: true });
	});
	it('reads spellings by pitch: B sharp 3 and C 4 are one note, so that pair is not inverted; C 4 above B 3 is', () => {
		expect(invertedPairs({ rangeLow: p('B', 3, 1), rangeHigh: p('C', 4) }).range).toBe(false);
		expect(invertedPairs({ rangeLow: p('C', 4), rangeHigh: p('B', 3) }).range).toBe(true);
	});
});
