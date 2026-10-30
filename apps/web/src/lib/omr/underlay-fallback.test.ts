/**
 * The row fallback (N.135, dictionary sewing): a row the reader read exactly
 * but spaced by syllables, taken for a row of words only where the dictionary
 * holds the words the syllables make.
 */
import { describe, expect, it } from 'vitest';
import { fallbackRow, MIN_WORDS, sewByDictionary } from './underlay-fallback';

const known = new Set(['тейской', 'мелочи', 'незаглушимый', 'шопот', 'мир', 'ты']);
const isWord = (w: string) => known.has(w);
const U5 = ['тейской', 'ме', 'ло', 'чи', 'неза.', 'глу.', 'шимый', 'шо', 'пот,', 'у-'];

describe('sewByDictionary', () => {
	it('joins the syllables of a printed row into the words the dictionary holds, and leaves the rest', () => {
		expect(sewByDictionary(U5, isWord)).toEqual(['тейской', 'мелочи', 'неза.глу.шимый', 'шопот,', 'у-']);
	});

	it('joins no word the dictionary does not hold', () => {
		expect(sewByDictionary(['ка', 'ко', 'ва'], isWord)).toEqual(['ка', 'ко', 'ва']);
	});

	it('joins at most four words', () => {
		expect(sewByDictionary(['не', 'за', 'глу', 'ши', 'мый'], isWord)).toEqual(['не', 'за', 'глу', 'ши', 'мый']);
	});
});

describe('fallbackRow', () => {
	it('qualifies the row of the U5 print', () => {
		expect(fallbackRow([U5], isWord)).toBe(0);
	});

	it('never qualifies a row of one-letter noise', () => {
		expect(fallbackRow([['і'], ['у'], ['т', 'т', 'ь'], ['ѵ', 'ъ', 'о', 'а', 'а']], isWord)).toBeNull();
	});

	it('wants three words of two letters or more, not two', () => {
		expect(MIN_WORDS).toBe(3);
		expect(fallbackRow([['ме', 'ло', 'чи', 'шо', 'пот']], isWord)).toBeNull();
		expect(fallbackRow([['ме', 'ло', 'чи', 'шо', 'пот', 'ты']], isWord)).toBe(0);
	});

	it('takes the first row, top to bottom', () => {
		expect(fallbackRow([['х'], U5, ['мир', 'ты', 'мир']], isWord)).toBe(1);
	});
});
