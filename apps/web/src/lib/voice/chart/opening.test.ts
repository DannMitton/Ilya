import { describe, expect, it } from 'vitest';
import type { CalibratedFormant, Vowel } from '../engine/types';
import { openChallenging, openRetake, openTour } from './opening';

const f = { f1: 300, f2: 1700, confidence: 'high', reading: 'captured', source: 'measured-user' } as CalibratedFormant;
const has = (...vs: Vowel[]) => Object.fromEntries(vs.map((v) => [v, f])) as Partial<Record<Vowel, CalibratedFormant>>;

describe('where the screen opens', () => {
	it('begin opens on the first vowel Ilya’s order lacks', () => {
		expect(openTour({})).toEqual({ start: 'i' });
		expect(openTour(has('i', 'e'))).toEqual({ start: 'ɛ' });
		expect(openTour(has('i', 'e', 'ɛ', 'a', 'ɑ', 'o', 'u'))).toEqual({ start: 'ɨ' });
		expect(openTour(has('i', 'e', 'ɛ', 'a', 'ɑ', 'o', 'u', 'ɨ', 'ɪ', 'ʌ'))).toEqual({ start: 'i' });
	});
	it('the invitation opens on the first of the three hardest not yet sung', () => {
		expect(openChallenging({})).toEqual({ start: 'ɨ' });
		expect(openChallenging(has('ɨ'))).toEqual({ start: 'ɪ' });
		expect(openChallenging(has('ɨ', 'ɪ', 'ʌ'))).toEqual({ start: 'ɨ' });
	});
	it('a re-take opens on the first vowel it names and walks the list', () => {
		expect(openRetake(['e'])).toEqual({ start: 'e', pass: ['e'] });
		expect(openRetake(['u', 'o'])).toEqual({ start: 'u', pass: ['u', 'o'] });
	});
});
