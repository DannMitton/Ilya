/**
 * One test decides every note, on arrival (`vowelless-fold.ts`; `CONTRACT.md` §0.1;
 * cloud-lane-88, item 2 of the arrival seam). Scores are built by hand; `fixture-rule.test.ts` runs the
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

const types = (score: ParsedScore) => score.vocalLine.map((e) => e.syllable?.type ?? null);

describe('foldVowelessSyllables: fusing the fragments', () => {
	it('joins a known proclitic to the NEXT syllable on the CLITIC\'S OWN note, and closes the tail up; the last note is the leftover', () => {
		const out = foldVowelessSyllables(scoreOf(note('a', syl('ты')), note('b', syl('в')), note('c', syl('мир')), note('d', syl('дом'))));
		expect(texts(out.score)).toEqual(['ты', `в${NBSP}мир`, 'дом', null]);
		expect(out).toMatchObject({ folded: 1, undrawn: 0 });
		expect(out.verses[0].vacated.map((p) => p.eventId)).toEqual(['d']);
	});

	it('joins an enclitic to the syllable BEFORE it, onto that syllable\'s note, and closes the tail up', () => {
		const out = foldVowelessSyllables(scoreOf(note('a', syl('друг')), note('b', syl('ж')), note('c', syl('мой'))));
		expect(texts(out.score)).toEqual([`друг${NBSP}ж`, 'мой', null]);
	});

	it('joins any other vowelless syllable to the syllable before it (the leftward fold of buildSlotQueue)', () => {
		const out = foldVowelessSyllables(scoreOf(note('a', syl('мой')), note('b', syl('чр')), note('c', syl('друг'))));
		expect(texts(out.score)).toEqual([`мой${NBSP}чр`, 'друг', null]);
	});

	it('reads the old-spelling letter map before the clitic table: «въ» is «в», a proclitic, and goes FORWARD', () => {
		const out = foldVowelessSyllables(scoreOf(note('a', syl('ты')), note('b', syl('въ')), note('c', syl('мир'))));
		expect(texts(out.score)).toEqual(['ты', `въ${NBSP}мир`, null]);
	});

	it('fuses a fragment marked `end` BACKWARD within its word, with no joiner: «жи» + «знь» sings «жизнь», and the word is whole', () => {
		const out = foldVowelessSyllables(scoreOf(note('a', syl('жи', 1, { type: 'start' })), note('b', syl('знь', 1, { type: 'end' })), note('c', syl('моя'))));
		expect(texts(out.score)).toEqual(['жизнь', 'мо', 'я']);
		expect(types(out.score)).toEqual(['whole', 'start', 'end']);
	});

	it('fuses a fragment marked `start` or `middle` FORWARD within its word, with no joiner', () => {
		const out = foldVowelessSyllables(scoreOf(note('a', syl('с', 1, { type: 'start' })), note('b', syl('вет', 1, { type: 'end' }))));
		expect(texts(out.score)).toEqual(['свет', null]);
		expect(types(out.score)).toEqual(['whole', null]);
	});

	it('does not draw a vowelless syllable with no host in its verse, counts it, and records it with its note', () => {
		const first = foldVowelessSyllables(scoreOf(note('a', syl('ж')), note('b', syl('мир'))));
		expect(texts(first.score)).toEqual(['мир', null]);
		expect(first).toMatchObject({ folded: 0, undrawn: 1 });
		expect(first.verses[0].orphans.map((p) => [p.eventId, p.text])).toEqual([['a', 'ж']]);
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
		// Verse 1: «в» joins «ты» on its own note and the last note loses verse 1. Verse 2 is untouched.
		expect(out.score.vocalLine.map((e) => e.syllable?.text)).toEqual(['мир', `в${NBSP}ты`, 'мой']);
		expect(out.score.vocalLine.map(v)).toEqual([['мир', 'дом'], [`в${NBSP}ты`, 'ты'], ['мой']]);
		expect(out.score.vocalLine[2].syllable?.verseNumber).toBe(2);
		expect(out.score.vocalLine[2].syllable?.verses).toEqual(['мой']);
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

describe('foldVowelessSyllables: dividing the tokens of two vowels or more', () => {
	it('divides a token of two vowels between the nuclei; the later syllable takes the following note and the cascade pushes the last one off the end', () => {
		const out = foldVowelessSyllables(scoreOf(note('a', syl('тени')), note('b', syl('я')), note('c', syl('дом')), note('d', syl('ту'))));
		expect(texts(out.score)).toEqual(['те', 'ни', 'я', 'дом']);
		expect(types(out.score)).toEqual(['start', 'end', 'whole', 'whole']);
		expect(out.verses[0]).toMatchObject({ divided: 1, syllables: 5 });
		expect(out.verses[0].overflow.map((p) => p.text)).toEqual(['ту']);
		expect(out.undrawn).toBe(1);
	});

	it('a fusion and a later division cancel by themselves: nothing is left over', () => {
		const out = foldVowelessSyllables(scoreOf(note('a', syl('в')), note('b', syl('тени')), note('c', syl('я'))));
		expect(texts(out.score)).toEqual([`в${NBSP}те`, 'ни', 'я']);
		expect(out.verses[0]).toMatchObject({ vacated: [], overflow: [], orphans: [] });
	});

	it('keeps the token\'s case and punctuation on its ends, and the pieces rejoin to it character for character', () => {
		const out = foldVowelessSyllables(scoreOf(note('a', syl('Тени,')), note('b', syl('я'))));
		expect(texts(out.score).slice(0, 2)).toEqual(['Те', 'ни,']);
	});

	it('divides NOTHING where the named call finds fewer pieces than the vowels: «тѣни» has two nuclei to this test and one to the engine, so it keeps its note and the place is counted', () => {
		const score = scoreOf(note('a', syl('тѣни')), note('b', syl('я')));
		const out = foldVowelessSyllables(score);
		expect(out.score).toBe(score);
		expect(out.verses[0].undivided.map((p) => p.text)).toEqual(['тѣни']);
	});

	it('counts on NFC: «й» written as two code points is no second vowel, so «мой» is one syllable and nothing moves', () => {
		const nfd = 'мой';
		expect(nfd.normalize('NFC')).toBe('мой');
		const score = scoreOf(note('a', syl(nfd)), note('b', syl('дом')));
		expect(foldVowelessSyllables(score).score).toBe(score);
	});

	it('leaves an elision (U+203F) alone: the print itself puts two syllables on one note', () => {
		const score = scoreOf(note('a', syl('и‿я')), note('b', syl('дом')));
		const out = foldVowelessSyllables(score);
		expect(out.score).toBe(score);
		expect(out.verses[0].undivided).toEqual([]);
	});

	it('does not divide a token that is not one run of letters (a space or a hyphen inside it) and counts the place', () => {
		const score = scoreOf(note('a', syl('в мире')), note('b', syl('дом')));
		const out = foldVowelessSyllables(score);
		expect(out.score).toBe(score);
		expect(out.verses[0].undivided).toHaveLength(1);
	});
});
