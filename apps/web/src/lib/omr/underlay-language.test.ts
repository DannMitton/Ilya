/**
 * rowLanguage with a stub dictionary: a Set of words stands in for
 * `isKnownWord`, which the caller passes in.
 */
import { describe, expect, it } from 'vitest';
import { RUSSIAN_SHARE, rowLanguage } from './underlay-language';

const dictionary = new Set(['комнатка', 'тесная', 'тихая', 'милая', 'ты', 'и', 'мир', 'ёлка']);
const isWord = (w: string) => dictionary.has(w);

describe('rowLanguage', () => {
	it('calls a row of dictionary words Russian', () => {
		expect(rowLanguage(['Комнатка', 'тесная,', 'тихая,', 'милая;'], isWord)).toBe('russian');
	});

	it('calls a row of other words other', () => {
		expect(rowLanguage(['Wohl', 'dem', 'der', 'wandelt'], isWord)).toBe('other');
	});

	it('calls a row Russian where exactly half its words are entries', () => {
		expect(rowLanguage(['тесная', 'тихая', 'xxx', 'yyy'], isWord)).toBe('russian');
	});

	it('holds the share at three in ten (brief r5 step 1)', () => {
		expect(RUSSIAN_SHARE).toBe(0.3);
	});

	it('calls a row other where under three in ten of its words are entries', () => {
		expect(rowLanguage(['тесная', 'xxx', 'yyy', 'zzz'], isWord)).toBe('other');
		expect(rowLanguage(['тесная', 'тихая', 'xxx', 'yyy', 'zzz', 'www', 'vvv', 'uuu'], isWord)).toBe('other');
	});

	it('calls a row Russian at exactly three words in ten', () => {
		expect(rowLanguage(['тесная', 'тихая', 'милая', 'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1'], isWord)).toBe('russian');
	});

	it('calls a row Russian at one word in three and at two in five, which a share of a half called other (the mutant at 0.5 fails here)', () => {
		expect(rowLanguage(['тесная', 'xxx', 'yyy'], isWord)).toBe('russian');
		expect(rowLanguage(['тесная', 'тихая', 'xxx', 'yyy', 'zzz'], isWord)).toBe('russian');
	});

	it('counts one misread word in a row of five against it, and the row stays Russian', () => {
		expect(rowLanguage(['Комнатка', 'теснан', 'тихая', 'милая', 'мир'], isWord)).toBe('russian');
	});

	it('does not count a word of one letter, either way', () => {
		// «и» is an entry, but alone it is chance: it is neither counted nor known.
		expect(rowLanguage(['и', 'а', 'о'], isWord)).toBe('other');
		expect(rowLanguage(['тесная', 'а', 'б', 'в', 'г'], isWord)).toBe('russian');
		expect(rowLanguage(['xxx', 'и', 'и', 'и', 'и'], isWord)).toBe('other');
	});

	it('counts a word of two letters', () => {
		expect(rowLanguage(['ты'], isWord)).toBe('russian');
		expect(rowLanguage(['ты', 'xx', 'yy', 'zz'], isWord)).toBe('other');
	});

	it('calls a row with nothing to count other', () => {
		expect(rowLanguage([], isWord)).toBe('other');
		expect(rowLanguage(['', ',', '-', '1'], isWord)).toBe('other');
	});

	it('asks the dictionary for the word\'s letters in lower case, with no mark or hyphen', () => {
		const asked: string[] = [];
		rowLanguage(['Ты,', 'ТИХАЯ;', '«мир»', 'ко-мнатка'], (w) => (asked.push(w), true));
		expect(asked).toEqual(['ты', 'тихая', 'мир', 'комнатка']);
	});

	it('asks again with ё written е where the word holds a ё, and not otherwise', () => {
		const asked: string[] = [];
		rowLanguage(['Ёлка'], (w) => (asked.push(w), false));
		rowLanguage(['тихая'], (w) => (asked.push(w), false));
		expect(asked).toEqual(['ёлка', 'елка', 'тихая']);
		expect(rowLanguage(['елка'], (w) => w === 'елка')).toBe('russian');
		expect(rowLanguage(['Ёлка'], (w) => w === 'елка')).toBe('russian');
	});

	it('does not ask for a word it has already counted out', () => {
		let calls = 0;
		rowLanguage(['а', 'б', 'тихая'], () => (calls++, true));
		expect(calls).toBe(1);
	});

	it('takes the dictionary\'s answer about a word as it is: a look-alike Latin word is not Russian', () => {
		// «cop» is Latin letters; the dictionary does not hold it.
		expect(rowLanguage(['cop', 'ec', 'pa'], isWord)).toBe('other');
	});
});
