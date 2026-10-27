/**
 * N.194 r5, step 3: from a unit to a place in the Lyrics text.
 *
 * Song 1 is Dann's engraving of Musorgsky's *Without Sun* no. 1, `score/ingestion/fixtures/sunless-01-engraved.musicxml`
 * (the fixture `score-seat.test.ts` reads), whose sung verse fills Lyrics as one line of 39 words.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MusicXmlScoreParser } from '@ilya/score-parser';
import { parseXml } from '$lib/score/ingestion/mini-dom';
import { collectScoreWords, scoreWordsText } from '$lib/score/vowel-resolver';
import { processText, splitIntoPreLines } from '$lib/pipeline';
import { loadRealData, wordsOf } from '$lib/syntactic-break.support';
import { insertBreak, removeBreak, tokenEndOffset, unitStart, BREAK_MARK } from './break-text';
import { unitEnd } from './syntactic-break-unit';
import { unitWordsFromStacks } from './syntactic-break-adapters';

let song1 = '';
beforeAll(async () => {
	loadRealData();
	const xml = readFileSync(fileURLToPath(new URL('../score/ingestion/fixtures/sunless-01-engraved.musicxml', import.meta.url)), 'utf8');
	const { score } = await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document, sourcePath: 'sunless-01-engraved.musicxml' });
	song1 = scoreWordsText(collectScoreWords(score, 1));
}, 60_000);

/** The unit that holds transcribed word `W` of line `L`, from the pipeline's own words: first word, last word, and the last word's verdict. */
function unitAt(text: string, L: number, W: number) {
	const words = processText(text)[L].words;
	const flags = unitWordsFromStacks(words);
	const last = unitEnd(flags, W)!;
	return { first: unitStart(flags, last), last, source: words[last].boundarySource };
}

describe('done-when 1: the offset of every transcribed word lands on the end of the raw token it came from', () => {
	it('song 1: 39 words in one line', () => {
		expect(song1.split(' ')).toHaveLength(39);
		let end = 0;
		song1.split(' ').forEach((token, w) => {
			end += token.length;
			expect(tokenEndOffset(song1, 0, w), `word ${w} «${token}»`).toBe(end);
			end += 1;
		});
		expect(song1.slice(0, tokenEndOffset(song1, 0, 0)!)).toBe('Комнатка');
	});

	// A blank line before the first line, an extra space inside a line, a leading space, a hyphenated particle, a blank line between.
	const text = '\n  Комнатка тесная,   тихая\n\nвот-вот велит-ли  дом\r\nя\u00A0# не в силах';
	const tokens: string[][] = [
		['Комнатка', 'тесная,', 'тихая'],
		['вот-вот', 'велит-ли', 'велит-ли', 'дом'],
		['я\u00A0#', 'не', 'в', 'силах'],
	];
	it('hand-written lines: each word ends at the end of its own token, whatever the blank lines and spaces before it', () => {
		const lines = processText(text);
		expect(lines.map((l) => l.words.length)).toEqual(tokens.map((t) => t.length));
		tokens.forEach((row, L) =>
			row.forEach((token, W) => {
				const at = tokenEndOffset(text, L, W)!;
				expect(text.slice(at - token.length, at), `line ${L} word ${W}`).toBe(token);
				expect(text[at] === undefined || /\s/.test(text[at]) && text[at] !== '\u00A0').toBe(true);
			}),
		);
	});
	it('a word split from a hyphenated token maps to the whole raw token’s end', () => {
		expect(tokenEndOffset(text, 1, 1)).toBe(tokenEndOffset(text, 1, 2));
		expect(text.slice(0, tokenEndOffset(text, 1, 2)!).endsWith('велит-ли')).toBe(true);
	});
	it('the glued form is one token: the end of «Комнатка\\u00A0# тесная» is the index after the #', () => {
		const glued = 'Комнатка\u00A0# тесная';
		expect(tokenEndOffset(glued, 0, 0)).toBe('Комнатка\u00A0#'.length);
		expect(tokenEndOffset(glued, 0, 1)).toBe(glued.length);
	});
	it('a word that is not there has no offset', () => {
		expect(tokenEndOffset(text, 0, 9)).toBeNull();
		expect(tokenEndOffset(text, 7, 0)).toBeNull();
		expect(tokenEndOffset('', 0, 0)).toBeNull();
	});
});

describe('the spans tell a hyphen that joins from a hyphen with a space after it (step 1’s open case)', () => {
	// Pieces of one hyphenated token share one span; «слово- слово» is two tokens. The adapters read `punctuation` and cannot tell.
	const spansOf = (text: string) => splitIntoPreLines(text.split('\n'))[0].spans;
	it('«велит-ли»: both words came from one token', () => {
		const [host, particle] = spansOf('велит-ли');
		expect(host).toBe(particle);
	});
	it('«слово- слово»: the host keeps its hyphen but the next word is another token', () => {
		const [host, next] = spansOf('слово- слово');
		expect(host).not.toBe(next);
		expect(wordsOf('слово- слово')[0].punctuation).toBe('-');
	});
});

describe('done-when 2: inserting then removing returns the text byte for byte', () => {
	const texts = ['вас благодать', '  вас   благодать\n\nне в силах,\r\nдом', 'велит-ли дом', 'Комнатка тесная, тихая'];
	for (const text of texts) {
		it(`«${JSON.stringify(text)}», at every unit`, () => {
			const lines = processText(text);
			lines.forEach((line, L) =>
				line.words.forEach((_, W) => {
					const { first, last } = unitAt(text, L, W);
					const marked = insertBreak(text, L, last)!;
					expect(marked, `L${L} W${W}`).toContain(BREAK_MARK);
					expect(marked.length).toBe(text.length + BREAK_MARK.length);
					expect(removeBreak(marked, L, first, last), `L${L} W${W}`).toBe(text);
				}),
			);
		});
	}
	it('the inserted text is a no-break space and a #, written as the escape', () => {
		expect(BREAK_MARK).toBe('\u00A0#');
		expect(insertBreak('вас благодать', 0, 0)).toBe('вас\u00A0# благодать');
	});
	it('song 1, at «Комнатка»', () => {
		const marked = insertBreak(song1, 0, 0)!;
		expect(marked.startsWith('Комнатка\u00A0# тесная,')).toBe(true);
		expect(marked.slice(0, 8) + marked.slice(10)).toBe(song1);
		expect(removeBreak(marked, 0, 0, 0)).toBe(song1);
	});
});

describe('done-when 3: Remove leaves no # in the unit by step 2’s rule, and the unit reads "insert" again', () => {
	// state after Remove: the unit's last word is not the singer's (`boundarySource` 'user')
	for (const [typed, plain] of [
		['вас #благодать', 'вас благодать'],
		['ва#с благодать', 'вас благодать'],
		['вас # благодать', 'вас благодать'],
		['вас ##благодать', 'вас благодать'],
		['вас\u00A0# благодать', 'вас благодать'],
		['вас\u00A0#\u00A0# благодать', 'вас благодать'],
		['вас # # благодать', 'вас благодать'],
		['не # в силах', 'не в силах'],
		['не #в силах', 'не в силах'],
		['не в# силах', 'не в силах'],
		['сказал # бы он', 'сказал бы он'],
		['сказал бы # он', 'сказал бы он'],
		['велит-ли # дом', 'велит-ли дом'],
		['благо#дать', 'благодать'],
	] as const) {
		it(`«${typed}»`, () => {
			const before = unitAt(typed, 0, 0);
			expect(before.source, 'the typed # is read as placed').toBe('user');
			const removed = removeBreak(typed, 0, before.first, before.last)!;
			expect(removed).toBe(plain);
			expect(unitAt(removed, 0, 0).source).not.toBe('user');
			expect(wordsOf(removed).map((w) => w.ipaDisplay)).toEqual(wordsOf(plain).map((w) => w.ipaDisplay));
		});
	}
	it('a # on a different unit is not touched', () => {
		const text = 'вас # благодать # дом';
		const first = unitAt(text, 0, 0);
		expect(removeBreak(text, 0, first.first, first.last)).toBe('вас благодать # дом');
		const second = unitAt(text, 0, 1);
		expect(removeBreak(text, 0, second.first, second.last)).toBe('вас # благодать дом');
	});
	it('a leading # on the next word is the previous unit’s, and the next unit keeps it as its own previous mark', () => {
		const text = 'слово #вас благодать';
		const second = unitAt(text, 0, 1);
		expect(unitAt(text, 0, 0).source).toBe('user');
		expect(removeBreak(text, 0, second.first, second.last)).toBe(text);
	});
	it('other lines are not touched', () => {
		const text = 'вас # благодать\nвас # благодать';
		const u = unitAt(text, 1, 0);
		expect(removeBreak(text, 1, u.first, u.last)).toBe('вас # благодать\nвас благодать');
	});
	it('a unit that does not exist has no edit', () => {
		expect(removeBreak('вас', 0, 0, 4)).toBeNull();
		expect(removeBreak('вас', 3, 0, 0)).toBeNull();
		expect(insertBreak('вас', 0, 5)).toBeNull();
	});
});

describe('the edits agree with the pipeline about where the mark lands', () => {
	it('a mark inserted at a unit’s last word makes that word the singer’s boundary', () => {
		for (const [text, W] of [['не в силах', 0], ['сказал бы он', 0], ['велит-ли дом', 0], ['вас благодать', 0]] as const) {
			const { last } = unitAt(text, 0, W);
			const marked = insertBreak(text, 0, last)!;
			const words = processText(marked)[0].words;
			expect(words[last].boundarySource, marked).toBe('user');
			expect(words.map((w) => w.boundarySource).filter((s) => s === 'user')).toHaveLength(1);
		}
	});
});
