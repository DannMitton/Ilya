/**
 * A file's own vowelless syllable, repaired on arrival (`vowelless-fold.ts`;
 * `CONTRACT.md` §0.1). Scores are built by hand; `fixture-rule.test.ts` runs the
 * real parser over every tracked fixture.
 */
import { describe, expect, it } from 'vitest';
import type { ParsedScore, SyllableInfo, VocalLineEvent } from '@ilya/score-parser';
import { foldVowelessSyllables } from './vowelless-fold';

const NBSP = ' ';

const syl = (text: string, verseNumber = 1, over: Partial<SyllableInfo> = {}): SyllableInfo =>
	({ id: `s-${text}-${verseNumber}`, text, type: 'whole', verseNumber, wordContext: text, ...over }) as SyllableInfo;
const note = (id: string, s?: SyllableInfo): VocalLineEvent => ({ id, type: 'note', ...(s ? { syllable: s } : {}) }) as unknown as VocalLineEvent;
const scoreOf = (...events: VocalLineEvent[]): ParsedScore => ({ vocalLine: events }) as unknown as ParsedScore;
const texts = (score: ParsedScore) => score.vocalLine.map((e) => e.syllable?.text ?? null);

describe('foldVowelessSyllables', () => {
	it('joins a known proclitic to the NEXT syllable and leaves its own note with no syllable; nothing after it moves', () => {
		const out = foldVowelessSyllables(scoreOf(note('a', syl('тебя')), note('b', syl('в')), note('c', syl('мир')), note('d', syl('ты'))));
		expect(texts(out.score)).toEqual(['тебя', null, `в${NBSP}мир`, 'ты']);
		expect(out).toMatchObject({ folded: 1, undrawn: 0 });
	});

	it('joins an enclitic to the syllable BEFORE it', () => {
		const out = foldVowelessSyllables(scoreOf(note('a', syl('друг')), note('b', syl('ж')), note('c', syl('мой'))));
		expect(texts(out.score)).toEqual([`друг${NBSP}ж`, null, 'мой']);
	});

	it('joins any other vowelless syllable to the syllable before it (the leftward fold of buildSlotQueue)', () => {
		const out = foldVowelessSyllables(scoreOf(note('a', syl('мой')), note('b', syl('чр')), note('c', syl('друг'))));
		expect(texts(out.score)).toEqual([`мой${NBSP}чр`, null, 'друг']);
	});

	it('does not draw a vowelless syllable with no host in its verse, and counts it', () => {
		const first = foldVowelessSyllables(scoreOf(note('a', syl('ж')), note('b', syl('мир'))));
		expect(texts(first.score)).toEqual([null, 'мир']);
		expect(first).toMatchObject({ folded: 0, undrawn: 1 });
		const last = foldVowelessSyllables(scoreOf(note('a', syl('мир')), note('b', syl('в'))));
		expect(texts(last.score)).toEqual(['мир', null]);
		expect(last.undrawn).toBe(1);
	});

	it('leaves a rest, a syllable with a vowel, and a mark alone (the `#` fold\'s) as they are, and returns the input by reference', () => {
		const score = scoreOf(note('a', syl('мир')), { id: 'r', type: 'rest' } as unknown as VocalLineEvent, note('b', syl('#')), note('c'));
		expect(foldVowelessSyllables(score).score).toBe(score);
	});

	it('repairs each verse on its own', () => {
		const two = (t1: string, t2: string) => note(`n-${t1}`, syl(t1, 1, { versesInfo: [{ verseNumber: 1, text: t1, type: 'whole' }, { verseNumber: 2, text: t2, type: 'whole' }], verses: [t1, t2] }));
		const out = foldVowelessSyllables(scoreOf(two('мир', 'дом'), two('в', 'ты'), two('ты', 'мой')));
		const v = (e: VocalLineEvent) => e.syllable?.versesInfo?.map((x) => x.text);
		// Verse 1: «в» joins «ты» on the next note and its note loses verse 1. Verse 2 is untouched.
		expect(out.score.vocalLine.map((e) => e.syllable?.text)).toEqual(['мир', 'ты', `в${NBSP}ты`]);
		expect(out.score.vocalLine.map(v)).toEqual([['мир', 'дом'], ['ты'], [`в${NBSP}ты`, 'мой']]);
		expect(out.score.vocalLine[1].syllable?.verseNumber).toBe(2);
		expect(out.score.vocalLine[1].syllable?.verses).toEqual(['ты']);
	});

	it('leaves an IPA verse alone: Latin letters hold no Cyrillic vowel, and are not this rule\'s reading', () => {
		const score = scoreOf(note('a', syl('ˈko')), note('b', syl('mnɑ')), note('c', syl('ʃt')));
		expect(foldVowelessSyllables(score).score).toBe(score);
	});

	it('does not mutate the input', () => {
		const score = scoreOf(note('a', syl('мир')), note('b', syl('ж')));
		foldVowelessSyllables(score);
		expect(texts(score)).toEqual(['мир', 'ж']);
	});
});
