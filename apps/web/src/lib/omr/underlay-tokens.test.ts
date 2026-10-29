/**
 * splitTokens and rowWords. The first is the harness's `tokens_of` (parts of a
 * box shared by their letters), and the check against the harness's own word
 * lists is in `docs/sessions/measure-n135-stage2b_2026-10-27/`.
 */
import { describe, expect, it } from 'vitest';
import { rowWords, splitTokens } from './underlay-tokens';
import type { Token } from './underlay-seat';

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

	it('calls a lone dash wider than half the ink height a mark, and a narrower one a joint', () => {
		const out = splitTokens([t('—', 0, 20), t('-', 30, 38)], { inkHeight: 32 });
		expect(out.map((o) => o.text)).toEqual(['', '-']);
		expect(splitTokens([t('—', 0, 16)], { inkHeight: 32 }).map((o) => o.text)).toEqual(['—']);
		expect(splitTokens([t('—', 0, 17)], { inkHeight: 32 }).map((o) => o.text)).toEqual(['']);
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

	it('does not join a lone long dash that has become a mark', () => {
		const tokens = splitTokens([t('ты', 0, 30), t('—', 40, 80), t('он', 90, 120)], { inkHeight: 32 });
		expect(rowWords(tokens)).toEqual(['ты', 'он']);
	});

	it('gives no words for no tokens', () => {
		expect(rowWords([])).toEqual([]);
	});
});
