/**
 * QUEUE row 108, Part C: the phrase ends come from the music. Each test is
 * named for the letter of the brief's section 6
 * (`docs/sessions/brief-code-row108-lyrics-lines_r3_2026-10-19.md`).
 *
 * `phrase-ends.today.json` is the IPA of every word of both fixtures, one line
 * and in lines of seven, recorded on the tree before this row (`5efa88bd`): the
 * guard of test i, and the "today" of tests f, g, and h.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { processText, wordGrid } from '$lib/pipeline';
import { buildSlotQueue, firstPass } from './pairings';
import { seatCliticFolds } from './clitic-seat';
import { seatScoreWords } from './score-seat';
import { musicPhraseEnds, phraseEndsKey, shouldRerunForPhraseEnds } from './phrase-ends';
import { buildScore, inLines, loadFixture, loadRealDictionary, oneLine, rekeyToLines, SUNLESS, TCHAIKOVSKY, type NoteSpec } from './row108.support';
import today from './phrase-ends.today.json';
import type { WordStackData } from '$lib/types';

beforeAll(loadRealDictionary, 60_000);

const words = (text: string, phraseEnds?: ReadonlyMap<string, boolean>): WordStackData[] =>
	processText(text, { phraseEnds }).flatMap((l) => l.words);
const ipas = (ws: WordStackData[]) => ws.map((w) => w.ipaDisplay);

/** Seats the one-line fill from the score's own mapping, as an arrival does. */
async function seatOneLine(file: string) {
	const score = await loadFixture(file);
	const text = oneLine(score);
	const seated = seatScoreWords(score, {}, processText(text));
	return { score, text, map: seatCliticFolds(score, seated.map), seated: seated.seated };
}

describe('c. a mark the parser carries ends a phrase', () => {
	const text = 'сад и дом';
	const score = (second: NoteSpec) => buildScore([{ text: 'сад', step: 'C', ...second }, { text: 'и', step: 'D' }, { text: 'дом', step: 'E' }]);
	const seat = (parsed: Awaited<ReturnType<typeof buildScore>>) => seatScoreWords(parsed, {}, processText(text)).map;

	it('a. a rest ends a phrase inside a line: «сад» is hard, from the score; without the score it is soft (N.198: [sɑt] either way before «и», so the boundary fields carry the difference)', async () => {
		const parsed = await buildScore([{ text: 'сад', step: 'C' }, { rest: true }, { text: 'и', step: 'D' }, { text: 'дом', step: 'E' }]);
		const ends = musicPhraseEnds(parsed, seat(parsed), wordGrid(text));
		expect(ends.get('0-0')).toBe(true);
		expect(ends.get('0-1')).toBe(false);
		const [sad] = words(text, ends);
		expect([sad.rightBoundary, sad.boundarySource, sad.ipaDisplay]).toEqual(['hard', 'score', 'ˈsɑt']);
		const [bare] = words(text);
		expect([bare.rightBoundary, bare.boundarySource, bare.ipaDisplay]).toEqual(['soft', 'auto', 'ˈsɑt']);
	});

	it('N.188: a fermata kept on a rest changes no phrase end, because a rest already ends one', async () => {
		const spec = (fermata: boolean) => [{ text: 'сад', step: 'C' }, { rest: true, fermata }, { text: 'и', step: 'D' }, { text: 'дом', step: 'E' }];
		const [plain, marked] = await Promise.all([buildScore(spec(false)), buildScore(spec(true))]);
		expect(marked.vocalLine[1]).toMatchObject({ type: 'rest', fermata: {} });
		expect(plain.vocalLine[1].fermata).toBeUndefined();
		const endsOf = (parsed: typeof plain) => [...musicPhraseEnds(parsed, seat(parsed), wordGrid(text)).entries()];
		expect(endsOf(marked)).toEqual(endsOf(plain));
	});

	it('b. a line end the music does not end is soft: «сад\\nи дом» seated with no rest', async () => {
		const parsed = await buildScore([{ text: 'сад', step: 'C' }, { text: 'и', step: 'D' }, { text: 'дом', step: 'E' }]);
		const two = 'сад\nи дом';
		const lines = processText(two);
		const map = firstPass(parsed.vocalLine.map((e) => e.id), buildSlotQueue(lines));
		const ends = musicPhraseEnds(parsed, map, wordGrid(two));
		expect(ends.get('0-0')).toBe(false);
		const [sad] = words(two, ends);
		expect([sad.rightBoundary, sad.boundarySource, sad.ipaDisplay]).toEqual(['soft', 'score', 'ˈsɑt']);
		const [bare] = words(two);
		expect([bare.rightBoundary, bare.boundarySource, bare.ipaDisplay]).toEqual(['hard', 'auto', 'ˈsɑt']);
	});

	it.each([
		['a breath mark', { breath: true }],
		['a caesura', { caesura: true }],
		['a fermata', { fermata: true }],
	])('c. %s on the word’s note ends a phrase with no rest', async (_, mark) => {
		const parsed = await score(mark);
		const ends = musicPhraseEnds(parsed, seat(parsed), wordGrid(text));
		expect(ends.get('0-0')).toBe(true);
		const [sad] = words(text, ends);
		expect([sad.rightBoundary, sad.ipaDisplay]).toEqual(['hard', 'ˈsɑt']);
		expect(ends.get('0-1')).toBe(false);
	});

	it('c. a fermata on the tied last note of a melisma ends the phrase too', async () => {
		const parsed = await buildScore([{ text: 'сад', step: 'C' }, { step: 'C', tieStop: true, fermata: true }, { text: 'и', step: 'D' }, { text: 'дом', step: 'E' }]);
		const ends = musicPhraseEnds(parsed, seat(parsed), wordGrid(text));
		expect(ends.get('0-0')).toBe(true);
	});
});

describe('d, e. the guards that hold today', () => {
	it('d. punctuation and the last word keep hard with a score', async () => {
		const parsed = await buildScore([{ text: 'сад,', step: 'C' }, { text: 'и', step: 'D' }, { text: 'дом', step: 'E' }]);
		const text = 'сад, и дом';
		const ends = musicPhraseEnds(parsed, seatScoreWords(parsed, {}, processText(text)).map, wordGrid(text));
		const [sad, , dom] = words(text, ends);
		expect([sad.rightBoundary, sad.boundarySource, sad.ipaDisplay]).toEqual(['hard', 'punctuation', 'ˈsɑt']);
		expect([dom.rightBoundary, dom.boundarySource]).toEqual(['hard', 'auto']);
	});

	it('e. an unseated word, and a seat whose origin.word does not match the grid, leave the word on today’s rule', async () => {
		const parsed = await buildScore([{ text: 'сад', step: 'C' }, { rest: true }, { text: 'и', step: 'D' }, { text: 'дом', step: 'E' }]);
		const two = 'сад\nи дом';
		const map = firstPass(parsed.vocalLine.filter((e) => e.type !== 'rest').map((e) => e.id), buildSlotQueue(processText(two)));
		expect(musicPhraseEnds(parsed, {}, wordGrid(two)).size).toBe(0);
		const wrong = Object.fromEntries(Object.entries(map).map(([id, p]) => [id, p.kind === 'syllable' ? { ...p, origin: { ...p.origin, word: 'другое' } } : p]));
		const ends = musicPhraseEnds(parsed, wrong, wordGrid(two));
		expect(ends.size).toBe(0);
		const [sad] = words(two, ends);
		expect([sad.rightBoundary, sad.boundarySource]).toEqual(['hard', 'auto']);
	});
});

describe('f, g. «Within Four Walls»', () => {
	it('f. one line, arrived: дума, сердце, неподвижный, ночь are hard from the score, and every word reads as today', async () => {
		const { text, map, score } = await seatOneLine(SUNLESS);
		const ends = musicPhraseEnds(score, map, wordGrid(text));
		const ws = words(text, ends);
		// the brief’s ordinals (0-based indices): «дума» 10, «сердце» 16, «неподвижный» 25, «ночь» 37 (the second «ночь»)
		for (const [i, w] of [[10, 'дума'], [16, 'сердце'], [25, 'неподвижный'], [37, 'ночь']] as const) {
			expect(ws[i].cleanWord).toBe(w);
			expect([w, ws[i].rightBoundary, ws[i].boundarySource]).toEqual([w, 'hard', 'score']);
		}
		expect(ipas(ws)).toEqual(today['sunless:one']);
	});

	it('g. in the stand-in’s six lines: all 39 words read as on one line, and «полёт» is [pɑ ˈlʲod]', async () => {
		const { text, map, score } = await seatOneLine(SUNLESS);
		const laid = inLines(text);
		const ends = musicPhraseEnds(score, rekeyToLines(map), wordGrid(laid));
		const ws = words(laid, ends);
		expect(ipas(ws)).toEqual(today['sunless:one']);
		expect(ws[20].cleanWord).toBe('полёт');
		expect(ws[20].ipaDisplay).toBe('pɑ ˈlʲod');
		// the gap this closes: with no score, the six lines read «полёт» as [pɑ ˈlʲot]
		expect(today['sunless:sevens'][20]).toBe('pɑ ˈlʲot');
	});
});

describe('h. Tchaikovsky', () => {
	it('the score’s own seat reads the old spelling (172 of 172, 0 before), and then «так» is [ˈtɑk]; the other 94 read as today', async () => {
		const { text, map, score, seated } = await seatOneLine(TCHAIKOVSKY);
		expect(seated).toBe(172);
		const ends = musicPhraseEnds(score, map, wordGrid(text));
		const ws = words(text, ends);
		const at = 77;
		expect(ws[at].cleanWord).toBe('так');
		expect(today['tchaikovsky:one'][at]).toBe('ˈtɑɡ');
		expect(ws[at].ipaDisplay).toBe('ˈtɑk');
		const rest = (a: string[]) => a.filter((_, i) => i !== at);
		expect(rest(ipas(ws))).toEqual(rest(today['tchaikovsky:one']));
	});
});

describe('i. the cross-line restructure changes nothing by itself', () => {
	it.each([
		['sunless:one', SUNLESS, false],
		['sunless:sevens', SUNLESS, true],
		['tchaikovsky:one', TCHAIKOVSKY, false],
		['tchaikovsky:sevens', TCHAIKOVSKY, true],
	] as const)('%s: processText without phraseEnds gives today’s IPA on every word', async (key, file, lined) => {
		const text = oneLine(await loadFixture(file));
		expect(ipas(words(lined ? inLines(text) : text))).toEqual(today[key]);
	});
});

describe('cc. the page re-runs the pipeline only when it should', () => {
	it('an unchanged key does not re-run; a changed key re-runs only when the transcription is of the field’s text', () => {
		const a = phraseEndsKey(new Map([['0-0', true], ['0-1', false]]));
		const b = phraseEndsKey(new Map([['0-1', false], ['0-0', true]]));
		expect(a).toBe(b);
		expect(phraseEndsKey(undefined)).toBe('');
		expect(shouldRerunForPhraseEnds(a, b, 'x', 'x', true)).toBe(false);
		expect(shouldRerunForPhraseEnds(a, '0-0:0', 'x', 'x', true)).toBe(true);
		expect(shouldRerunForPhraseEnds(a, '0-0:0', 'x', 'xy', true)).toBe(false);
		expect(shouldRerunForPhraseEnds(a, '0-0:0', 'x', 'x', false)).toBe(false);
	});
});
