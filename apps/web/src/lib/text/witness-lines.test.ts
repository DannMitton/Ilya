/**
 * witness-lines.test.ts: rows 109 and 110 (N.186), the pure half of "Text shows
 * the witness there is": which text Text shows, whether the pair is offered,
 * which poem words are greyed, how a poem edit carries the poem's marks and
 * glosses, and when a wordless score's Lyrics takes the poem.
 */
import { describe, it, expect } from 'vitest';
import {
	carryPoemEdit,
	lyricsTakesPoem,
	shownWitness,
	survivingGlosses,
	unsetPoemWords,
	witnessLines,
	witnessesDiffer,
} from './witness-lines';
import { WordMarks } from './word-marks.svelte';

const POEM = 'Средь шумного бала,\nСлучайно, в тревоге мирской суеты,\nТебя я увидел.';
const none = new WordMarks();

describe('shownWitness', () => {
	it('shows Lyrics where it holds text and there is no Poem, or no choice', () => {
		expect(shownWitness(true, false, false, 'lyrics')).toBe('lyrics');
		expect(shownWitness(true, false, false, 'poem')).toBe('lyrics');
		expect(shownWitness(true, true, true, 'lyrics')).toBe('lyrics');
	});

	it('falls back to Poem where Lyrics is empty', () => {
		expect(shownWitness(false, true, false, 'lyrics')).toBe('poem');
		expect(shownWitness(false, false, false, 'lyrics')).toBe('lyrics');
	});

	it('shows Poem with both only on the singer\'s choice, and only while they differ', () => {
		expect(shownWitness(true, true, true, 'poem')).toBe('poem');
		expect(shownWitness(true, true, false, 'poem')).toBe('lyrics');
	});
});

describe('witnessesDiffer (review r2, amendment 11)', () => {
	it('is true for a repeat, a change, an omission', () => {
		expect(witnessesDiffer('Тебя я увидел, увидел.', 'Тебя я увидел.')).toBe(true);
		expect(witnessesDiffer('Тебя я увидал.', 'Тебя я увидел.')).toBe(true);
		expect(witnessesDiffer('Тебя я.', 'Тебя я увидел.')).toBe(true);
	});

	it('is false for the same words, and for a difference only in punctuation, case, or ё (the cost)', () => {
		expect(witnessesDiffer('Тебя я увидел.', 'Тебя я увидел.')).toBe(false);
		expect(witnessesDiffer('Тебя, я увидел', 'Тебя я увидел.')).toBe(false);
		expect(witnessesDiffer('тебя я увидел', 'Тебя я увидел')).toBe(false);
		expect(witnessesDiffer('Всё', 'Все')).toBe(false);
	});

	it('is false where either text is empty', () => {
		expect(witnessesDiffer('', POEM)).toBe(false);
		expect(witnessesDiffer(POEM, '')).toBe(false);
	});
});

describe('witnessLines: only a Poem is transcribed', () => {
	it('gives the poem whole, in its own lines', () => {
		const lines = witnessLines(POEM, 'en', none);
		expect(lines.map((l) => l.words.length)).toEqual([3, 5, 3]);
		expect(lines[0].words[0].cyrillic).toBe('Средь');
	});

	it('gives nothing for an empty text', () => {
		expect(witnessLines('  \n', 'en', none)).toEqual([]);
	});
});

describe('unsetPoemWords', () => {
	it('names the poem words the song does not set, by the pipeline\'s own keys', () => {
		const lyrics = 'Средь шумного бала Случайно мирской суеты Тебя я увидел';
		const muted = unsetPoemWords(lyrics, POEM, witnessLines(POEM, 'en', none));
		expect([...muted].sort()).toEqual(['1-1', '1-2']);
	});

	it('is empty where nothing is unset, and where Lyrics is empty', () => {
		const lines = witnessLines(POEM, 'en', none);
		expect(unsetPoemWords(POEM.replace(/\n/g, ' '), POEM, lines).size).toBe(0);
		expect(unsetPoemWords('', POEM, lines).size).toBe(0);
	});

	it('greys nothing on a line whose tokens and words disagree (a split particle)', () => {
		const poem = 'Кто-нибудь пришёл\nдомой';
		const lines = witnessLines(poem, 'en', none);
		expect(unsetPoemWords('домой', poem, lines).has('1-0')).toBe(false);
	});
});

describe('a Poem edit carries the poem\'s marks and glosses (test l)', () => {
	it('a mark and a gloss on a poem word follow it when a line is inserted above', () => {
		const marks = new WordMarks();
		marks.assignStress('0-1', {}, 0, 'user');
		const glosses = new Map([['0-1', 'noisy']]);
		const anchors = new Map([['0-1', 'шумного']]);
		const after = `Вступление\n${POEM}`;
		const carried = carryPoemEdit(POEM, after, marks, glosses, anchors);
		expect([...marks.stress.keys()]).toEqual(['1-1']);
		expect([...carried!.glosses]).toEqual([['1-1', 'noisy']]);
		expect([...carried!.anchors]).toEqual([['1-1', 'шумного']]);
	});

	it('a gloss whose word was replaced falls away, and one that did not move changes nothing', () => {
		const glosses = new Map([['0-1', 'noisy']]);
		const anchors = new Map([['0-1', 'шумного']]);
		const marks = new WordMarks();
		expect(carryPoemEdit(POEM, POEM.replace('шумного', 'тихого'), marks, glosses, anchors)!.glosses.size).toBe(0);
		expect(carryPoemEdit(POEM, POEM, marks, glosses, anchors)).toBeNull();
	});

	it('survivingGlosses keeps a gloss through a ё toggle of its word', () => {
		expect(survivingGlosses(new Map([['0-0', 'all']]), new Map([['0-0', 'Все']]), 'всё')).toBeNull();
	});
});

describe('lyricsTakesPoem (row 109 B)', () => {
	it('is true for a wordless score, an empty Lyrics, a poem, and no placements', () => {
		expect(lyricsTakesPoem(true, '', 'Я тебя любил', 0)).toBe(true);
	});

	it('is false for a score with words, for a restore, and for a typed poem (the caller passes false)', () => {
		expect(lyricsTakesPoem(false, '', 'Я тебя любил', 0)).toBe(false);
	});

	it('is false where the singer wrote Lyrics, where a note is placed, and where the poem is blank', () => {
		expect(lyricsTakesPoem(true, 'Мои слова', 'Я тебя любил', 0)).toBe(false);
		expect(lyricsTakesPoem(true, '', 'Я тебя любил', 3)).toBe(false);
		expect(lyricsTakesPoem(true, '', '  ', 0)).toBe(false);
	});
});
