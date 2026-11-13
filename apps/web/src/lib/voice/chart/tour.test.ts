import { describe, expect, it } from 'vitest';
import type { Vowel } from '../engine/types';
import { TOUR_HARDEST, TOUR_ORDER, TOUR_SEVEN, nextVowel } from './tour';

describe('Ilya’s linear order', () => {
	it('is the seven, then the three hardest, and matches the wizard’s lists', () => {
		expect([...TOUR_ORDER]).toEqual(['i', 'e', 'ɛ', 'a', 'ɑ', 'o', 'u', 'ɨ', 'ɪ', 'ʌ']);
		expect([...TOUR_SEVEN]).toEqual(['i', 'e', 'ɛ', 'a', 'ɑ', 'o', 'u']);
		expect([...TOUR_HARDEST]).toEqual(['ɨ', 'ɪ', 'ʌ']);
	});
	it('walks the whole order from the start, one vowel at a time, then is null', () => {
		const sung: Vowel[] = [];
		let last: Vowel | null = null;
		const seen: Vowel[] = [];
		for (let k = 0; k < 12; k++) {
			const n = nextVowel(sung, last);
			if (n === null) break;
			seen.push(n);
			sung.push(n);
			last = n;
		}
		expect(seen).toEqual([...TOUR_ORDER]);
		expect(nextVowel(sung, last)).toBeNull();
	});
});

describe('after a manual pick, Ilya carries on from the singer’s lead', () => {
	it('goes round the seven from the vowel just sung, wrapping', () => {
		expect(nextVowel(['ɑ'], 'ɑ')).toBe('o');
		expect(nextVowel(['ɑ', 'o', 'u'], 'u')).toBe('i'); // wraps to the first unsung of the seven
		expect(nextVowel(['e'], 'e')).toBe('ɛ');
	});
	it('skips what is already sung', () => {
		expect(nextVowel(['i', 'e', 'ɛ'], 'i')).toBe('a');
		expect(nextVowel(['o', 'u'], 'ɑ')).toBe('i');
	});
	it('takes the seven before the three hardest even when the lead was a hard one', () => {
		expect(nextVowel(['ɨ'], 'ɨ')).toBe('i');
		expect(nextVowel(['ʌ', 'i'], 'ʌ')).toBe('e');
	});
	it('goes to the three hardest only once the seven are sung, in their order', () => {
		const seven = [...TOUR_SEVEN];
		expect(nextVowel(seven, 'u')).toBe('ɨ');
		expect(nextVowel([...seven, 'ɨ'], 'ɨ')).toBe('ɪ');
		expect(nextVowel([...seven, 'ɨ', 'ɪ'], 'ɪ')).toBe('ʌ');
		expect(nextVowel([...seven, 'ɪ'], 'ɪ')).toBe('ɨ');
	});
	it('is null when all ten are sung', () => {
		expect(nextVowel(TOUR_ORDER, 'ʌ')).toBeNull();
		expect(nextVowel(TOUR_ORDER, null)).toBeNull();
	});
});

describe('a pass', () => {
	it('walks the given list after the last vowel, then returns null', () => {
		const pass: Vowel[] = ['e', 'o', 'ʌ'];
		expect(nextVowel(TOUR_ORDER, null, pass)).toBe('e');
		expect(nextVowel(TOUR_ORDER, 'e', pass)).toBe('o');
		expect(nextVowel(TOUR_ORDER, 'o', pass)).toBe('ʌ');
		expect(nextVowel(TOUR_ORDER, 'ʌ', pass)).toBeNull();
	});
	it('starts at the first when the last vowel is not in the list, and is null for an empty one', () => {
		expect(nextVowel([], 'i', ['u', 'o'])).toBe('u');
		expect(nextVowel([], null, [])).toBeNull();
	});
});
