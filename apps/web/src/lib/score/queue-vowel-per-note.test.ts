/**
 * ONE VOWEL PER NOTE in the slot queue (`CONTRACT.md` §0.1; N.135 step 4). Every
 * writer of typed text (`firstPass`, `refreshPairings`, `placeSyllable`,
 * `applyCliticSeat`, `reseatByDiff`, `seatScoreWords`, `applyHeal`, and the
 * rest) copies a slot from `buildSlotQueue`, so a piece with no vowel letter
 * that never becomes a slot never reaches a note. Hand-built words: the rule
 * under test is the fold, not the engine.
 */
import { describe, expect, it } from 'vitest';
import type { LineData, WordStackData } from '$lib/types';
import { buildSlotQueue, firstPass } from './pairings';

const NBSP = '\u00A0';

interface Piece {
	cyrillic: string;
	ipa: string;
	isStressed?: boolean;
}

/** A word whose engine pieces are given, so a piece can be vowelless (the engine's own cut is not under test). */
const word = (pieces: Piece[], over: Partial<WordStackData> = {}): WordStackData =>
	({
		cleanWord: pieces.map((p) => p.cyrillic).join(''),
		punctuation: '',
		ipaContent: pieces.map((p) => p.ipa).join(''),
		isProclitic: false,
		isEnclitic: false,
		lineIndex: 0,
		syllables: pieces.map((p) => ({ isStressed: false, ...p })),
		result: { transcriptionLog: [] },
		...over,
	}) as unknown as WordStackData;

const lines = (...words: WordStackData[]): LineData[] => [{ words } as unknown as LineData];

describe('buildSlotQueue, a piece of a word with no vowel letter', () => {
	it('joins the piece before it in its word, and owns no slot', () => {
		const q = buildSlotQueue(lines(word([{ cyrillic: 'ту', ipa: 'tu' }, { cyrillic: 'ст', ipa: 'st' }, { cyrillic: 'ра', ipa: 'ra' }])));
		expect(q.map((s) => s.cyrillic)).toEqual(['туст', 'ра']);
		expect(q.map((s) => s.ipa)).toEqual(['tust', 'ra']);
		expect(q.map((s) => s.origin.slotIndex)).toEqual([0, 1]);
	});

	it('joins the next piece where it is the word\'s first, and the slot is still the word\'s first (slotIndex 0)', () => {
		const q = buildSlotQueue(lines(word([{ cyrillic: 'вз', ipa: 'vz' }, { cyrillic: 'ро', ipa: 'ro', isStressed: true }, { cyrillic: 'ра', ipa: 'ra' }])));
		expect(q.map((s) => s.cyrillic)).toEqual(['взро', 'ра']);
		expect(q[0].ipa.startsWith('ˈvz')).toBe(true);
		expect(q.map((s) => s.origin.slotIndex)).toEqual([0, 1]);
	});

	it('carries the word\'s trailing punctuation when the vowelless piece is the last', () => {
		const q = buildSlotQueue(lines(word([{ cyrillic: 'ту', ipa: 'tu' }, { cyrillic: 'ст', ipa: 'st' }], { punctuation: ',' })));
		expect(q.map((s) => s.cyrillic)).toEqual(['туст,']);
	});

	it('leaves a word whose pieces all hold a vowel as it was, slotIndex = k', () => {
		const q = buildSlotQueue(lines(word([{ cyrillic: 'ту', ipa: 'tu' }, { cyrillic: 'ра', ipa: 'ra' }])));
		expect(q.map((s) => [s.cyrillic, s.origin.slotIndex])).toEqual([['ту', 0], ['ра', 1]]);
	});

	it('hands no note a vowelless text through firstPass: every slot it copies has a vowel letter', () => {
		const q = buildSlotQueue(
			lines(
				word([{ cyrillic: 'в', ipa: 'v' }], { isProclitic: true }),
				word([{ cyrillic: 'ту', ipa: 'tu' }, { cyrillic: 'ст', ipa: 'st' }, { cyrillic: 'ра', ipa: 'ra' }]),
			),
		);
		const map = firstPass(['n0', 'n1', 'n2'], q);
		const texts = Object.values(map).map((p) => (p.kind === 'syllable' ? p.cyrillic : ''));
		expect(texts).toEqual([`в${NBSP}туст`, 'ра']);
		expect(texts.every((t) => /[аеёиоуыэюяѣіѵ]/iu.test(t))).toBe(true);
	});
});
