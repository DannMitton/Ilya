/**
 * N.194 r5, step 2: a typed # takes effect at the end of its unit (Dann 2026-10-21 02:18 and 02:19), and the
 * glued form «я\u00A0#» reads as the bare one (Dann 2026-10-25 23:52).
 *
 * Every IPA is the engine's, compared with another output of the same engine. The Lyrics text lives in
 * `doc.inputText` and reaches `processText` by value, so "the text is unchanged" is tested as: the words keep
 * the Cyrillic that was typed, with no # in it, and `wordGrid` (the page's diff over the same text) agrees.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { processText, wordGrid } from '$lib/pipeline';
import { moveBreaksToUnitEnds } from '$lib/boundaries';
import { ipaOf, loadRealData, wordsOf } from '$lib/syntactic-break.support';
import { GLUED_MARK, WORD_SPLIT, WORD_TOKEN } from './break-glue';

beforeAll(loadRealData, 60_000);

const NBSP_HASH = '\u00A0#';
const cyrillicOf = (text: string) => wordsOf(text).map((w) => w.cyrillic);
const withoutMarks = (text: string) => text.replace(/\u00A0*#/g, '').replace(/ {2,}/g, ' ').trim();
const lastWord = (text: string) => wordsOf(text).at(-1)!;

describe('the glue patterns', () => {
	it('WORD_SPLIT keeps a word and its glued # together, and splits everywhere else', () => {
		expect('я\u00A0# на правду'.split(WORD_SPLIT)).toEqual(['я\u00A0#', 'на', 'правду']);
		expect('я# на\u00A0правду'.split(WORD_SPLIT)).toEqual(['я#', 'на', 'правду']);
		expect('я \u00A0# на'.split(WORD_SPLIT)).toEqual(['я', '\u00A0#', 'на']);
	});
	it('WORD_TOKEN finds the same tokens', () => {
		expect([...'я\u00A0# на правду'.matchAll(WORD_TOKEN)].map((m) => m[0])).toEqual(['я\u00A0#', 'на', 'правду']);
		expect([...'я# на\u00A0правду'.matchAll(WORD_TOKEN)].map((m) => m[0])).toEqual(['я#', 'на', 'правду']);
	});
	it('a plain \\s split cuts the glued form, which is why the patterns exist', () => {
		expect('я\u00A0# на'.split(/\s+/)).toEqual(['я', '#', 'на']);
	});
	it('GLUED_MARK takes the # and the no-break spaces before it', () => {
		expect('вас\u00A0# ва#с \u00A0\u00A0#'.replace(GLUED_MARK, '')).toBe('вас вас ');
	});
});

describe('done-when 1: «не # в силах» and «не в силах #» are one thing', () => {
	it('the same IPA, the same Russian, and the hard boundary on the unit’s last word', () => {
		expect(ipaOf('не # в силах')).toEqual(ipaOf('не в силах #'));
		expect(cyrillicOf('не # в силах')).toEqual(['не', 'в', 'силах']);
		const [ne, v, sily] = wordsOf('не # в силах');
		expect([ne.syntacticBreak, v.syntacticBreak, sily.syntacticBreak]).toEqual([undefined, undefined, true]);
		expect([ne.rightBoundary, v.rightBoundary, sily.rightBoundary, sily.boundarySource]).toEqual(['clitic', 'clitic', 'hard', 'user']);
		expect(wordGrid('не # в силах')).toEqual(wordGrid('не в силах'));
	});
	it('and the # is printed once, after the unit', () => {
		expect(ipaOf('не # в силах').join(' ').match(/#/g)).toHaveLength(1);
		expect(ipaOf('не # в силах').at(-1)!.endsWith('#')).toBe(true);
	});
});

describe('done-when 2: «X # же Y» and «X же # Y» are one thing', () => {
	for (const [x, zhe, y] of [['друг', 'же', 'дом'], ['слух', 'же', 'был'], ['сказал', 'бы', 'он']]) {
		it(`«${x} # ${zhe} ${y}»`, () => {
			expect(ipaOf(`${x} # ${zhe} ${y}`)).toEqual(ipaOf(`${x} ${zhe} # ${y}`));
			expect(ipaOf(`${x} # ${zhe} ${y}`)).toEqual(ipaOf(`${x} ${zhe}# ${y}`));
		});
	}
});

describe('done-when 3: a # already at a unit’s end behaves as batch C built it', () => {
	// batch C's oracle: the IPA of the same words with a comma, plus a bare # after the word. This fails on no tree; it is a regression guard.
	for (const [typed, comma] of [['слух # был', 'слух, был'], ['Ты же # дом', 'Ты же, дом'], ['друг ж # дом', 'друг ж, дом'], ['лес # дремучий', 'лес, дремучий']]) {
		it(`«${typed}»`, () => {
			const hash = ipaOf(typed);
			const plain = ipaOf(comma);
			const at = hash.findIndex((s) => s.endsWith('#'));
			expect(at).toBeGreaterThanOrEqual(0);
			expect(hash.map((s, i) => (i === at ? s.slice(0, -1) : s))).toEqual(plain);
		});
	}
});

describe('done-when 4: a # where the boundary is already hard changes nothing audible', () => {
	it('after a line’s last word: the IPA shows the bare # after that word, and nothing else moves', () => {
		const plain = ipaOf('слух был');
		const hash = ipaOf('слух был #');
		expect(hash).toEqual([plain[0], plain[1] + '#']);
		expect(lastWord('слух был #').boundarySource).toBe('user');
	});
	it('after a punctuated word: the IPA shows the bare # after it, and the comma’s boundary stands', () => {
		const comma = ipaOf('слух, был');
		const hash = ipaOf('слух, # был');
		expect(hash).toEqual([comma[0] + '#', comma[1]]);
		expect(wordsOf('слух, # был')[0].rightBoundary).toBe('hard');
	});
	it('a # on the last word of a line of several lines, one per line', () => {
		const lines = processText('слух был #\nдрузья мои');
		expect(lines.map((l) => l.words.map((w) => w.syntacticBreak ?? false))).toEqual([[false, true], [false, false]]);
	});
});

describe('done-when 5: taking the # out returns the transcription to what it was', () => {
	// The # blocks voicing across its boundary, so stripping the printed # from the IPA is not the test. The text without it is.
	// Step 3 tests the same with the button's own Remove.
	for (const [typed, plain] of [
		['не # в силах', 'не в силах'],
		['сказал # бы он', 'сказал бы он'],
		['вас ##благодать', 'вас благодать'],
		['ва#с благодать', 'вас благодать'],
		['вас\u00A0# благодать', 'вас благодать'],
		['велит-ли # дом', 'велит-ли дом'],
	]) {
		it(`«${typed}»`, () => {
			expect(withoutMarks(typed)).toBe(plain);
			const back = processText(plain).flatMap((l) => l.words);
			expect(back.map((w) => w.boundarySource)).not.toContain('user');
			expect(back.map((w) => w.syntacticBreak)).toEqual(back.map(() => undefined));
			expect(back.map((w) => w.ipaDisplay)).not.toEqual(wordsOf(typed).map((w) => w.ipaDisplay));
		});
	}
});

describe('done-when 6: a # is read wherever it stands in a token, and takes effect at the end of its unit', () => {
	// Read inside each test: the real dictionary loads in `beforeAll`, after this block is collected.
	const unmarked = () => ipaOf('вас благодать');
	it('the pair assimilates without a boundary, so the tests below prove something', () => {
		expect(ipaOf('вас, благодать')[0]).not.toBe(unmarked()[0]);
	});
	it('«ва#с благодать» is «вас# благодать»: a # inside the first word ends that word', () => {
		expect(ipaOf('ва#с благодать')).toEqual(ipaOf('вас# благодать'));
		expect(ipaOf('ва#с благодать')[0]).toBe(ipaOf('вас, благодать')[0] + '#');
	});
	it('«вас ##благодать» and «вас #благодать» are «вас# благодать»: a leading # ends the word before it', () => {
		expect(ipaOf('вас ##благодать')).toEqual(ipaOf('вас# благодать'));
		expect(ipaOf('вас #благодать')).toEqual(ipaOf('вас# благодать'));
	});
	it('«вас благо#дать» is «вас благодать#»: a # inside the second word ends the second word', () => {
		expect(ipaOf('вас благо#дать')).toEqual(ipaOf('вас благодать#'));
		expect(ipaOf('вас благо#дать')).not.toEqual(ipaOf('вас# благодать'));
	});
	it('a lone # first on a line changes nothing from the unmarked line', () => {
		expect(ipaOf('# вас благодать')).toEqual(unmarked());
		expect(ipaOf('#вас благодать')).toEqual(unmarked());
		expect(ipaOf('# вас благодать\n# вас благодать')).toEqual([...unmarked(), ...unmarked()]);
	});
	it('in every case the words keep the Russian typed, and the dictionary finds them', () => {
		const plain = wordsOf('вас благодать');
		for (const typed of ['ва#с благодать', 'вас благо#дать', 'вас ##благодать', 'вас #благодать', '# вас благодать']) {
			const got = wordsOf(typed);
			expect(got.map((w) => w.cleanWord), typed).toEqual(plain.map((w) => w.cleanWord));
			expect(got.map((w) => w.stressSource), typed).toEqual(plain.map((w) => w.stressSource));
			expect(got.map((w) => w.stressSource), typed).not.toContain('inferred');
			for (const w of got) expect([w.cyrillic, w.punctuation, w.stressedCyrillic], typed).not.toEqual(expect.arrayContaining([expect.stringContaining('#')]));
		}
		expect(cyrillicOf('ва#с благодать')).toEqual(['вас', 'благодать']);
	});
});

describe('done-when 7: «вас\\u00A0# благодать» reads as «вас# благодать»', () => {
	const glued = 'вас\u00A0# благодать';
	it('the same IPA, cleanWord, and dictionary entry', () => {
		expect(ipaOf(glued)).toEqual(ipaOf('вас# благодать'));
		const [vas] = wordsOf(glued);
		expect(vas.cleanWord).toBe('вас');
		expect(vas.stressSource).toBe(wordsOf('вас благодать')[0].stressSource);
		expect(vas.stressSource).not.toBe('inferred');
	});
	it('the Russian and the page’s word grid are those of the bare form', () => {
		expect(cyrillicOf(glued)).toEqual(['вас', 'благодать']);
		expect(wordGrid(glued)).toEqual(wordGrid('вас# благодать'));
		expect(wordGrid('я\u00A0# на правду')).toEqual(wordGrid('я# на правду'));
	});
	it('a glued # twice, inside a word, and standing alone behind a space', () => {
		expect(ipaOf('вас\u00A0#\u00A0# благодать')).toEqual(ipaOf('вас# благодать'));
		expect(ipaOf('ва\u00A0#с благодать')).toEqual(ipaOf('вас# благодать'));
		expect(ipaOf('вас \u00A0# благодать')).toEqual(ipaOf('вас# благодать'));
	});
});

describe('where it moves', () => {
	it('«сказал # бы»: the # ends the unit after the enclitic', () => {
		expect(ipaOf('сказал # бы он')).toEqual(ipaOf('сказал бы # он'));
		expect(wordsOf('сказал # бы он').map((w) => w.syntacticBreak ?? false)).toEqual([false, true, false]);
	});
	it('«велит-ли»: a # on the host ends the unit after the particle', () => {
		expect(wordsOf('велит-ли # дом').map((w) => w.syntacticBreak ?? false)).toEqual([false, true, false]);
	});
	it('a # after the last word of a unit stays where it is', () => {
		expect(wordsOf('слух # был').map((w) => w.syntacticBreak ?? false)).toEqual([true, false]);
	});
	it('moving is idempotent, and leaves a word with no # untouched', () => {
		const sets = { proclitics: new Set(['в']), enclitics: new Set(['бы']) };
		const word = (cleanWord: string, syntacticBreak?: boolean) => ({
			cyrillic: cleanWord, cleanWord, punctuation: '', ...(syntacticBreak ? { syntacticBreak } : {}),
			rightBoundary: 'soft' as const, boundarySource: 'auto' as const,
		});
		const line = [word('в', true), word('доме'), word('бы'), word('мы')];
		moveBreaksToUnitEnds(line, sets);
		expect(line.map((w) => w.syntacticBreak ?? false)).toEqual([false, false, true, false]);
		moveBreaksToUnitEnds(line, sets);
		expect(line.map((w) => w.syntacticBreak ?? false)).toEqual([false, false, true, false]);
		expect(Object.keys(line[0])).not.toContain('syntacticBreak');
	});
	it('a punctuation boundary keeps its source; only a placed # is the singer’s', () => {
		expect(wordsOf('слух, был')[0].boundarySource).toBe('punctuation');
		expect(wordsOf('слух # был')[0].boundarySource).toBe('user');
		expect(wordsOf('слух был')[0].boundarySource).toBe('auto');
	});
});

describe('the glued form is what a score folds', () => {
	it('«я\u00A0#» as a word of the text reads as «я#»', () => {
		const text = `правду я${NBSP_HASH} на`;
		expect(ipaOf(text)).toEqual(ipaOf('правду я# на'));
	});
});
