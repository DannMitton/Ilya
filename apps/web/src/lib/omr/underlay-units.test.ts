/**
 * The hybrid cut: a token of two vowels or more is cut into the engine's
 * syllables, in proportion to its letters; the engine is a stub here, and the
 * real one is tried in `underlay-seams.test.ts`.
 */
import { describe, expect, it } from 'vitest';
import { cutUnits, VOWEL } from './underlay-units';
import { CYRILLIC_VOWEL } from '$lib/score/vowel-resolver';
import type { Token } from './underlay-seat';

const t = (text: string, x0: number, x1: number): Token => ({ text, x0, x1 });
const dictionary: Record<string, string[]> = { шумного: ['шум', 'но', 'го'], бала: ['ба', 'ла'], вечер: ['ве', 'чер'], мир: ['мир'] };
const cut = (w: string) => dictionary[w.toLowerCase()] ?? [w.toLowerCase()];

describe('cutUnits', () => {
	it('holds the same vowels as the score reader\'s CYRILLIC_VOWEL', () => {
		expect(VOWEL.source).toBe(CYRILLIC_VOWEL.source);
		expect(VOWEL.flags).toBe(CYRILLIC_VOWEL.flags);
	});

	it('cuts a token of two vowels or more into the engine\'s syllables, each but the last ending in a hyphen', () => {
		const { units, counts } = cutUnits([t('шумного', 0, 70)], cut);
		expect(units.map((u) => u.text)).toEqual(['шум-', 'но-', 'го']);
		expect(counts).toEqual({ cut: 1, whole: 0, mismatched: 0 });
	});

	it('places each syllable inside the token\'s box in proportion to its letters', () => {
		const { units } = cutUnits([t('шумного', 100, 170)], cut);
		expect(units.map((u) => [u.x0, u.x1])).toEqual([[100, 130], [130, 150], [150, 170]]);
	});

	it('leaves a token of one vowel or none whole', () => {
		const { units, counts } = cutUnits([t('мир', 0, 30), t('в', 40, 50), t(',', 60, 62)], cut);
		expect(units.map((u) => u.text)).toEqual(['мир', 'в', ',']);
		expect(counts).toEqual({ cut: 0, whole: 2, mismatched: 0 });
	});

	it('takes each piece\'s text from the token: its capital and its marks', () => {
		expect(cutUnits([t('Вечер,', 0, 60)], cut).units.map((u) => u.text)).toEqual(['Ве-', 'чер,']);
		expect(cutUnits([t('«Бала!', 0, 50)], cut).units.map((u) => u.text)).toEqual(['«Ба-', 'ла!']);
	});

	it('keeps a hyphen that was at the token\'s end or start', () => {
		expect(cutUnits([t('шумного-', 0, 80)], cut).units.map((u) => u.text)).toEqual(['шум-', 'но-', 'го-']);
		expect(cutUnits([t('-бала', 0, 50)], cut).units.map((u) => u.text)).toEqual(['-ба-', 'ла']);
	});

	it('sews into the word it came from', async () => {
		const { rowWords } = await import('./underlay-tokens');
		expect(rowWords(cutUnits([t('шумного', 0, 70), t('бала', 80, 120)], cut).units)).toEqual(['шумного', 'бала']);
	});

	it('leaves a token whole where the engine\'s pieces are as long as it is but are other letters', () => {
		const other = (w: string) => (w === 'бала' ? ['ба', 'лх'] : [w]);
		const { units, counts } = cutUnits([t('бала', 0, 40)], other);
		expect(units.map((u) => u.text)).toEqual(['бала']);
		expect(counts.mismatched).toBe(1);
	});

	it('leaves a token whole, and counts it, where the engine\'s pieces do not add up to it', () => {
		const odd = (w: string) => (w === 'бала' ? ['ба', 'л'] : ['x']);
		const { units, counts } = cutUnits([t('бала', 0, 40), t('вечер', 50, 100)], odd);
		expect(units.map((u) => u.text)).toEqual(['бала', 'вечер']);
		expect(counts).toEqual({ cut: 0, whole: 0, mismatched: 2 });
	});

	it('leaves a token whole where the engine throws or returns one piece', () => {
		expect(cutUnits([t('бала', 0, 40)], () => { throw new Error('no'); }).units).toEqual([t('бала', 0, 40)]);
		expect(cutUnits([t('бала', 0, 40)], () => ['бала']).counts.mismatched).toBe(1);
	});

	it('counts the old vowels ѣ, і, and ѵ as vowels', () => {
		const seen: string[] = [];
		cutUnits([t('мірѣ', 0, 40)], (w) => (seen.push(w), [w]));
		expect(seen).toEqual(['мірѣ']);
	});

	it('does not offer the engine a word of one vowel', () => {
		const seen: string[] = [];
		cutUnits([t('мир', 0, 30)], (w) => (seen.push(w), [w]));
		expect(seen).toEqual([]);
	});

	it('keeps a token with no letter as it is', () => {
		const { units } = cutUnits([t('-', 0, 5), t('___', 10, 90)], cut);
		expect(units.map((u) => u.text)).toEqual(['-', '___']);
	});
});

/* Row 181 B0 step 3: a piece stands where its own vowel's ink is. Each test names what would break if the rule did not hold. */
describe('cutUnits, each piece placed by its own vowel\'s ink', () => {
	const sy = (c: string, x0: number, x1: number) => ({ c, x0, x1 });
	const tok = (text: string, x0: number, x1: number, syms?: { c: string; x0: number; x1: number }[]): Token => ({ text, x0, x1, ...(syms ? { syms } : {}) });
	const box = (u: Token) => [u.x0, u.x1];
	const dict2: Record<string, string[]> = { бала: ['ба', 'ла'], вона: ['в', 'она'], хлѣба: ['хлѣ', 'ба'] };
	const cut2 = (w: string) => dict2[w.toLowerCase()] ?? [w.toLowerCase()];
	const bala = [sy('б', 0, 10), sy('а', 15, 35), sy('л', 50, 65), sy('а', 70, 90)];

	it('puts the second piece at its vowel (three quarters of the word) and not at the letter share (a half)', () => {
		const { units, boxes } = cutUnits([tok('бала', 0, 100, bala)], cut2);
		expect(units.map(box)).toEqual([[15, 35], [70, 90]]);
		expect(boxes).toEqual({ placed: 2, fallbackNoMatch: 0, fallbackNoVowel: 0 });
	});

	it('falls back to the letter share where the letter boxes drop a letter, and counts one token', () => {
		const { units, boxes } = cutUnits([tok('бала', 0, 100, [bala[0], bala[1], bala[3]])], cut2);
		expect(units.map(box)).toEqual([[0, 50], [50, 100]]);
		expect(boxes).toEqual({ placed: 0, fallbackNoMatch: 1, fallbackNoVowel: 0 });
	});

	it('falls back where the last letter\'s box is the one dropped (the count, not only the letters, is checked)', () => {
		expect(cutUnits([tok('бала', 0, 100, bala.slice(0, 3))], cut2).boxes).toEqual({ placed: 0, fallbackNoMatch: 1, fallbackNoVowel: 0 });
	});

	it('falls back, and counts one, where the reader gave no letter boxes; and where a box holds two letters or the letters differ', () => {
		expect(cutUnits([tok('бала', 0, 100)], cut2).boxes.fallbackNoMatch).toBe(1);
		expect(cutUnits([tok('бала', 0, 100, [sy('б', 0, 10), sy('ал', 15, 35), sy('а', 70, 90)])], cut2).boxes.fallbackNoMatch).toBe(1);
		expect(cutUnits([tok('бала', 0, 100, [sy('б', 0, 10), sy('а', 15, 35), sy('л', 50, 65), sy('о', 70, 90)])], cut2).boxes.fallbackNoMatch).toBe(1);
	});

	it('keeps the letter share for a piece with no vowel letter, places the other, and counts both', () => {
		const syms = [sy('в', 0, 10), sy('о', 30, 45), sy('н', 50, 60), sy('а', 70, 90)];
		const { units, boxes } = cutUnits([tok('вона', 0, 100, syms)], cut2);
		expect(units.map(box)).toEqual([[0, 25], [30, 45]]);
		expect(boxes).toEqual({ placed: 1, fallbackNoMatch: 0, fallbackNoVowel: 1 });
	});

	it('finds a pre-reform vowel: ѣ is the vowel of «хлѣ»', () => {
		const syms = [sy('х', 0, 10), sy('л', 12, 22), sy('ѣ', 30, 48), sy('б', 55, 65), sy('а', 70, 90)];
		expect(cutUnits([tok('хлѣба', 0, 100, syms)], cut2).units.map(box)).toEqual([[30, 48], [70, 90]]);
	});

	it('matches letters only, case folded: a mark\'s box and a capital do not break the match', () => {
		const syms = [sy('«', 0, 3), sy('Б', 5, 15), sy('а', 20, 40), sy('л', 55, 65), sy('а', 70, 90), sy(',', 91, 95)];
		const { units, boxes } = cutUnits([tok('«Бала,', 0, 100, syms)], cut2);
		expect(units.map(box)).toEqual([[20, 40], [70, 90]]);
		expect(boxes.fallbackNoMatch).toBe(0);
	});
});
