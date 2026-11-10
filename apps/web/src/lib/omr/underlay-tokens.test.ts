/**
 * splitTokens and rowWords. The first is the harness's `tokens_of` (parts of a
 * box shared by their letters), and the check against the harness's own word
 * lists is in `docs/sessions/measure-n135-stage2b_2026-10-27/`.
 */
import { describe, expect, it } from 'vitest';
import { rowWords, splitTokens } from './underlay-tokens';
import { kindOf, type Token } from './underlay-seat';

const t = (text: string, x0: number, x1: number): Token => ({ text, x0, x1 });

describe('splitTokens', () => {
	it('leaves a word with no mark inside it whole', () => {
		expect(splitTokens([t('Средь', 0, 100)])).toEqual([t('Средь', 0, 100)]);
	});

	it('splits at a hyphen, and keeps a hyphen on every part but the last so that the parts sew into one word', () => {
		const out = splitTokens([t('су-е', 0, 90)]);
		expect(out.map((o) => o.text)).toEqual(['су-', 'е']);
		expect(rowWords(out)).toEqual(['суе']);
	});

	it('splits at the period or dash a reader gives where the print has a short underscore', () => {
		expect(splitTokens([t('Ком.нат', 0, 70)]).map((o) => o.text)).toEqual(['Ком-', 'нат']);
		expect(splitTokens([t('Ком–нат', 0, 70)]).map((o) => o.text)).toEqual(['Ком-', 'нат']);
	});

	it('shares the box among the parts by their letters', () => {
		const out = splitTokens([t('су-е', 0, 90)]);
		expect(out).toEqual([t('су-', 0, 60), t('е', 60, 90)]);
		const three = splitTokens([t('ко-му-то', 100, 160)]);
		expect(three.map((o) => [o.x0, o.x1])).toEqual([[100, 120], [120, 140], [140, 160]]);
		const uneven = splitTokens([t('а-бвг', 0, 50)]);
		expect(uneven.map((o) => [o.x0, o.x1])).toEqual([[0, 12.5], [12.5, 50]]);
	});

	it('splits at a run of marks, not only one', () => {
		expect(splitTokens([t('ко_.му', 0, 40)]).map((o) => o.text)).toEqual(['ко-', 'му']);
	});

	it('keeps the marks at the ends of a part: a comma, a hyphen, a quotation mark', () => {
		expect(splitTokens([t('ты,', 0, 30), t('нат-', 40, 80), t('«су', 90, 120)]).map((o) => o.text)).toEqual(['ты,', 'нат-', '«су']);
		expect(splitTokens([t('су-е,', 0, 50)]).map((o) => o.text)).toEqual(['су-', 'е,']);
	});

	it('keeps a combining acute inside a word', () => {
		expect(splitTokens([t('мо́ре', 0, 50)]).map((o) => o.text)).toEqual(['мо́ре']);
	});

	it('trims the spaces a reader leaves around a word', () => {
		expect(splitTokens([t(' ю, ', 0, 30)]).map((o) => o.text)).toEqual(['ю,']);
	});

	it('puts the tokens in x order whatever order they came in', () => {
		expect(splitTokens([t('б', 50, 60), t('а', 0, 10)]).map((o) => o.text)).toEqual(['а', 'б']);
	});

	it('keeps a token with no letter, a lone hyphen, an extender, or a mark, for the seating to read', () => {
		expect(splitTokens([t('ка', 0, 20), t('-', 22, 30), t('___', 40, 120), t('.', 130, 134)]).map((o) => o.text)).toEqual(['ка', '-', '___', '.']);
	});

	/* Integration step 7c: a long dash ends the word: an empty mark with its box and its flag. The hyphen beside it stays a joint. */
	it('makes a lone dash wider than half the ink height an empty mark, flagged long, its box unchanged (row 181 step 7c)', () => {
		const out = splitTokens([t('—', 0, 20), t('-', 30, 38)], { inkHeight: 32 });
		expect(out.map((o) => o.text)).toEqual(['', '-']);
		expect(kindOf(out[1].text)).toBe('joint');
		expect(out[0]).toMatchObject({ x0: 0, x1: 20, longDash: true });
		expect(out[1].longDash).toBeUndefined();
		expect(splitTokens([t('—', 0, 16)], { inkHeight: 32 })[0].longDash).toBeUndefined();
		expect(splitTokens([t('—', 0, 17)], { inkHeight: 32 })[0].longDash).toBe(true);
	});

	it('calls no dash a mark where the ink height is not given', () => {
		expect(splitTokens([t('—', 0, 200)]).map((o) => o.text)).toEqual(['—']);
	});

	it('does not call a long underscore a mark: it is an extender', () => {
		expect(splitTokens([t('___', 0, 200)], { inkHeight: 32 }).map((o) => o.text)).toEqual(['___']);
	});

	it('gives nothing for nothing', () => {
		expect(splitTokens([])).toEqual([]);
	});
});

describe('rowWords', () => {
	it('sews a row into the words a hyphen makes', () => {
		const tokens = [t('Ком-', 0, 40), t('нат', 40, 80), t('ка', 100, 130), t('тес-', 140, 170), t('-', 171, 175), t('ная', 176, 220)];
		expect(rowWords(tokens)).toEqual(['Комнат', 'ка', 'тесная']);
	});

	/* Integration step 7c: the long dash splits the word (385 of 590 seats against the joint's 376, row 114); a hyphen still sews. If
	   this reverts, a word sews across a dash that ends it. */
	it('ends the word at a long dash between two syllables, and sews across a hyphen (row 181 step 7c)', () => {
		const tokens = splitTokens([t('ту', 0, 30), t('—', 40, 80), t('ман', 90, 120)], { inkHeight: 32 });
		expect(rowWords(tokens)).toEqual(['ту', 'ман']);
		expect(rowWords(splitTokens([t('ту', 0, 30), t('-', 40, 48), t('ман', 90, 120)], { inkHeight: 32 }))).toEqual(['туман']);
	});

	it('gives no words for no tokens', () => {
		expect(rowWords([])).toEqual([]);
	});
});

/* Row 181 B0 step 3: the parts of a split token stand where their own vowels' ink is. */
describe('splitTokens, each part placed by its own vowel\'s ink', () => {
	const sy = (c: string, x0: number, x1: number) => ({ c, x0, x1 });
	const withSyms = (text: string, x0: number, x1: number, syms: { c: string; x0: number; x1: number }[]): Token => ({ text, x0, x1, syms });

	it('gives each part the box of its vowel, carries its own letter boxes on, and counts them placed', () => {
		const boxes = { placed: 0, fallbackNoMatch: 0, fallbackNoVowel: 0 };
		const syms = [sy('с', 0, 10), sy('у', 12, 30), sy('-', 32, 38), sy('е', 60, 80)];
		const out = splitTokens([withSyms('су-е', 0, 90, syms)], { boxes });
		expect(out.map((u) => [u.text, u.x0, u.x1])).toEqual([['су-', 12, 30], ['е', 60, 80]]);
		expect(out.map((u) => u.syms)).toEqual([[sy('с', 0, 10), sy('у', 12, 30)], [sy('е', 60, 80)]]);
		expect(boxes).toEqual({ placed: 2, fallbackNoMatch: 0, fallbackNoVowel: 0 });
	});

	it('gives a part of two vowels or none the span of its own letters\' boxes', () => {
		const syms = [sy('м', 0, 10), sy('о', 12, 25), sy('я', 30, 42), sy('-', 44, 48), sy('н', 60, 70), sy('о', 72, 85)];
		const out = splitTokens([withSyms('моя-но', 0, 90, syms)]);
		expect(out.map((u) => [u.x0, u.x1])).toEqual([[0, 42], [72, 85]]); // «моя»: two vowels, the span; «но»: one vowel, its box
		const none = splitTokens([withSyms('в-ты', 0, 60, [sy('в', 0, 12), sy('-', 14, 20), sy('т', 30, 40), sy('ы', 42, 58)])]);
		expect(none.map((u) => [u.text, u.x0, u.x1])).toEqual([['в-', 0, 12], ['ты', 42, 58]]);
	});

	it('keeps the letter share where the boxes drop a letter, counts the token once, and carries no boxes on', () => {
		const boxes = { placed: 0, fallbackNoMatch: 0, fallbackNoVowel: 0 };
		const syms = [sy('с', 0, 10), sy('-', 32, 38), sy('е', 60, 80)];
		const out = splitTokens([withSyms('су-е', 0, 90, syms)], { boxes });
		expect(out.map((u) => [u.x0, u.x1])).toEqual([[0, 60], [60, 90]]);
		expect(out.every((u) => !('syms' in u))).toBe(true);
		expect(boxes).toEqual({ placed: 0, fallbackNoMatch: 1, fallbackNoVowel: 0 });
	});

	it('leaves a token with no mark inside it whole, its letter boxes with it', () => {
		const syms = [sy('м', 0, 10), sy('и', 12, 30), sy('р', 32, 48)];
		expect(splitTokens([withSyms('мир', 0, 50, syms)])).toEqual([withSyms('мир', 0, 50, syms)]);
	});
});
