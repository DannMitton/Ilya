/**
 * QUEUE row 139: the # for a syntactic break, in the pipeline.
 *
 * Every IPA is the engine's, compared with another output of the same engine: the `#` run
 * against the same words with a comma, which is the boundary the # is ruled to make, and
 * against the words with nothing between them.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { applyNotationPreferences, processText, wordGrid } from '$lib/pipeline';
import { applyOpenSyllabificationToLines } from '$lib/syllable-utils';
import { peelSyntacticBreaks } from './syntactic-break';
import { ipaOf, loadRealData, wordsOf } from './syntactic-break.support';

beforeAll(loadRealData, 60_000);

const isWord = (t: string) => t.replace(/[.,!?;:"«»–—…()]/g, '').length > 0;
const peel = (line: string) => peelSyntacticBreaks(line.split(/\s+/), isWord);

describe('peelSyntacticBreaks', () => {
	it('a # inside a word is read, and belongs to that word (Dann 02:19)', () => {
		expect(peel('сло#во на')).toEqual({ words: ['слово', 'на'], broken: [true, false] });
	});
	it('a # between spaces ends the word before it', () => {
		expect(peel('я # на правду')).toEqual({ words: ['я', 'на', 'правду'], broken: [true, false, false] });
	});
	it('a trailing # ends its own word, the shape a score folds a bare # into', () => {
		expect(peel('я# на правду')).toEqual({ words: ['я', 'на', 'правду'], broken: [true, false, false] });
	});
	it('a leading # ends the word before it', () => {
		expect(peel('я #на правду')).toEqual({ words: ['я', 'на', 'правду'], broken: [true, false, false] });
	});
	it('a # with no word before it ends nothing and is dropped', () => {
		expect(peel('# я на')).toEqual({ words: ['я', 'на'], broken: [false, false] });
	});
	it('several #s are one mark', () => {
		expect(peel('я ## на')).toEqual({ words: ['я', 'на'], broken: [true, false] });
	});
	it('a # after punctuation alone ends the word before that', () => {
		expect(peel('я — # на')).toEqual({ words: ['я', 'на'], broken: [true, false] });
	});
});

describe('the pipeline counts the same words with or without a #', () => {
	const plain = wordsOf('я на правду').map((w) => w.cleanWord);
	for (const typed of ['я # на правду', 'я# на правду', 'я #на правду', 'я ## на правду', '# я на правду', 'я на правду #']) {
		it(`«${typed}»`, () => {
			expect(wordsOf(typed).map((w) => w.cleanWord)).toEqual(plain);
			expect(wordGrid(typed)).toEqual(wordGrid('я на правду'));
		});
	}
	it('a # alone makes no line and no word', () => {
		expect(processText('#')).toEqual([]);
		expect(processText('я\n#\nна').map((l) => l.words.length)).toEqual([1, 1]);
	});
});

describe('done-when 1: the # blocks voicing as punctuation does, and prints only itself', () => {
	// Each pair is one where the engine's own output voices or devoices X's final across the boundary
	// (found by running the pairs with nothing between them: plain differs from comma).
	for (const [x, y] of [['слух', 'был'], ['лес', 'дремучий'], ['свет', 'дня']]) {
		it(`«${x} # ${y}»`, () => {
			const plain = ipaOf(`${x} ${y}`);
			const comma = ipaOf(`${x}, ${y}`);
			const hash = ipaOf(`${x} # ${y}`);
			expect(plain[0], 'the pair must assimilate for this to prove anything').not.toBe(comma[0]);
			expect(hash[0]).not.toBe(plain[0]);
			expect(hash[0]).toBe(comma[0] + '#');
			expect(hash.slice(1)).toEqual(comma.slice(1));
			expect(hash.join(' ').replace('#', '')).toBe(comma.join(' '));
		});
	}
	it('the same IPA whether the # stands alone or trails its word', () => {
		expect(ipaOf('слух# был')).toEqual(ipaOf('слух # был'));
		expect(ipaOf('слух #был')).toEqual(ipaOf('слух # был'));
	});
	it('the boundary is hard, and its source is the singer’s: a typed # is placed, not implied (N.194 step 2)', () => {
		const [x] = wordsOf('слух # был');
		expect([x.rightBoundary, x.boundarySource]).toEqual(['hard', 'user']);
		expect(wordsOf('слух, был')[0].boundarySource).toBe('punctuation');
	});
});

describe('the # lives in its own field, and in no other', () => {
	// Read inside each test: the real dictionary loads in `beforeAll`, after this block is collected.
	const hashedWords = () => wordsOf('слух # был');
	it('the word before it carries syntacticBreak', () => {
		expect(hashedWords().map((w) => w.syntacticBreak ?? false)).toEqual([true, false]);
	});
	it('cyrillic, cleanWord, punctuation, and the stressed spelling hold no #', () => {
		for (const w of hashedWords()) for (const field of [w.cyrillic, w.cleanWord, w.punctuation, w.stressedCyrillic]) expect(field ?? '').not.toContain('#');
	});
	it('the syllables hold no #, so the engine log and the open-syllable re-cut read the engine’s own', () => {
		for (const w of hashedWords()) for (const s of w.syllables) expect(s.ipa).not.toContain('#');
	});
	it('the gloss, stress, and clitic classes are those of the same words with no #', () => {
		const plain = wordsOf('слух был');
		expect(hashedWords().map((w) => [w.gloss, w.stressIndex, w.stressSource, w.isProclitic, w.isEnclitic])).toEqual(
			plain.map((w) => [w.gloss, w.stressIndex, w.stressSource, w.isProclitic, w.isEnclitic]),
		);
	});
	it('a singer’s ё toggle keeps the # on the word it rebuilds', () => {
		const toggles = new Map([['0-0-1', true]]);
		const lines = processText('слёз # был', { yoToggles: toggles as never });
		expect(lines[0].words[0].syntacticBreak).toBe(true);
		expect(lines[0].words[0].ipaDisplay.endsWith('#')).toBe(true);
	});
});

describe('done-when 4: an enclitic stays an enclitic of its word', () => {
	it('«Ты же # дом»: же is Ты’s enclitic, Ты is clitic, and the hard boundary sits after же', () => {
		const [x, zhe, y] = wordsOf('Ты же # дом');
		expect([zhe.isEnclitic, x.rightBoundary, zhe.rightBoundary, zhe.boundarySource]).toEqual([true, 'clitic', 'hard', 'user']);
		expect(y.syntacticBreak).toBeUndefined();
		const comma = ipaOf('Ты же, дом');
		const hash = ipaOf('Ты же # дом');
		expect(hash[0]).toBe(comma[0] + '#');
		expect(hash.slice(1)).toEqual(comma.slice(1));
	});
	it('«друг ж # дом»: дом’s д voices neither друг’s г nor ж’s final', () => {
		const plain = ipaOf('друг ж дом');
		const comma = ipaOf('друг ж, дом');
		const hash = ipaOf('друг ж # дом');
		expect(plain[0]).not.toBe(comma[0]);
		expect(hash[0]).toBe(comma[0] + '#');
		expect(hash.slice(1)).toEqual(comma.slice(1));
	});
	it('«Ты # же дом»: же still attaches to Ты, and the # takes effect at the end of their unit, as in «Ты же # дом» (N.194 step 2)', () => {
		const [x, zhe] = wordsOf('Ты # же дом');
		expect([zhe.isEnclitic, x.rightBoundary, zhe.rightBoundary]).toEqual([true, 'clitic', 'hard']);
		expect(ipaOf('Ты # же дом')).toEqual(ipaOf('Ты же # дом'));
		expect(ipaOf('Ты # же дом')[0]).toBe('ˈtɨ ʒɨ#');
	});
});

describe('a # after a proclitic takes effect at the end of the proclitic’s unit', () => {
	it('«в # доме» is «в доме #»: the preposition keeps its voicing, and the # is printed after the unit (N.194 step 2; row 139 finding 2 closed)', () => {
		const [v, dom] = wordsOf('в # доме');
		expect([v.isProclitic, v.rightBoundary, dom.rightBoundary, dom.boundarySource]).toEqual([true, 'clitic', 'hard', 'user']);
		expect(ipaOf('в # доме')).toEqual(ipaOf('в доме #'));
		expect(ipaOf('в # доме')[1]).toBe(ipaOf('в доме')[1] + '#');
		expect(ipaOf('в # доме')[1]).not.toContain('f');
	});
});

describe('every IPA string the page re-derives carries the # the same way', () => {
	const strings = (w: { ipaDisplay: string; ipaReconstituted: string; ipaOwnReconstituted: string; ipaContent: string }) => [w.ipaDisplay, w.ipaReconstituted, w.ipaOwnReconstituted, w.ipaContent];
	it('the pipeline’s four IPA strings on the word before the #', () => {
		for (const text of ['слух # был', 'правду # я']) for (const str of strings(wordsOf(text)[0])) expect(str.endsWith('#'), `${text}: ${str}`).toBe(true);
	});
	it('the host of an enclitic that carries the #: «тропинка же # дом»', () => {
		const [host, zhe] = wordsOf('тропинка же # дом');
		expect(zhe.isEnclitic).toBe(true);
		for (const str of [host.ipaDisplay, host.ipaReconstituted]) expect(str, str).toMatch(/ ʒ\S#$/u);
		// the host's own strings stay its own, as the Inspector reads them
		for (const str of [host.ipaContent, host.ipaOwnReconstituted]) expect(str).not.toContain('#');
		// the enclitic itself still shows its arrow; its own IPA carries the # the host receives
		expect([zhe.ipaDisplay, zhe.ipaReconstituted]).toEqual(['←', '←']);
		for (const str of [zhe.ipaContent, zhe.ipaOwnReconstituted]) expect(str.endsWith('#'), str).toBe(true);
	});
	it('open syllabification and a re-cut rebuild them from the syllables and keep the # once, at the end', () => {
		const open = (text: string) => applyOpenSyllabificationToLines(processText(text), undefined, true)[0].words;
		for (const [typed, comma] of [['правду # я', 'правду, я'], ['тропинка же # дом', 'тропинка же, дом'], ['слух # был', 'слух, был']]) {
			const [hash, ref] = [open(typed)[0], open(comma)[0]];
			for (const field of ['ipaDisplay', 'ipaReconstituted'] as const) {
				expect(hash[field].match(/#/g), `${typed} ${field}`).toHaveLength(1);
				expect(hash[field], `${typed} ${field}`).toBe(ref[field] + '#');
			}
		}
	});
	it('the Notation switches leave the # alone', () => {
		const ipa = wordsOf('слух # был')[0].ipaDisplay;
		for (const reducedVowel of [true, false]) for (const geminate of [true, false]) {
			expect(applyNotationPreferences(ipa, { reducedVowel, geminate, shcha: true, palatalNasal: true } as never, true).endsWith('#')).toBe(true);
		}
	});
});
