/**
 * N.194 step 1: the two doors into `unitEnd`, run on `processText`'s own output (the real dictionary, the real
 * clitic sets), not on hand-built flags.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { GraysonEngine } from '@ilya/phonology';
import { processText } from '$lib/pipeline';
import { loadRealData, wordsOf } from '$lib/syntactic-break.support';
import { unitEnd } from './syntactic-break-unit';
import { unitWordsFromPre, unitWordsFromStacks } from './syntactic-break-adapters';

beforeAll(loadRealData, 60_000);

/** The unit end of every word of a one-line text, by each door. */
function unitEnds(text: string) {
	const words = wordsOf(text);
	const fromStacks = unitWordsFromStacks(words);
	const fromPre = unitWordsFromPre(words, GraysonEngine);
	return {
		words,
		stacks: words.map((_, i) => unitEnd(fromStacks, i)),
		pre: words.map((_, i) => unitEnd(fromPre, i)),
	};
}

describe('which field carries the hyphen', () => {
	it('«велит-ли»: the host keeps the hyphen as its trailing punctuation, and «ли» is not an enclitic here', () => {
		const [host, particle] = wordsOf('велит-ли');
		expect([host.cyrillic, host.cleanWord, host.punctuation]).toEqual(['велит-', 'велит', '-']);
		expect([particle.cyrillic, particle.punctuation, particle.isEnclitic]).toEqual(['ли', '', false]);
	});
	it('a spaced en dash is dropped before any word is built; a spaced ASCII hyphen is a word with no letters', () => {
		expect(wordsOf('слово – слово').map((w) => w.cyrillic)).toEqual(['слово', 'слово']);
		const spaced = wordsOf('слово - слово');
		expect(spaced.map((w) => [w.cyrillic, w.cleanWord, w.punctuation])).toEqual([
			['слово', 'слово', ''],
			['-', '', '-'],
			['слово', 'слово', ''],
		]);
	});
	it('neither spaced dash joins the word before it', () => {
		for (const text of ['слово – слово', 'слово - слово']) {
			expect(unitEnds(text).stacks[0]).toBe(0);
			expect(unitEnds(text).pre[0]).toBe(0);
		}
	});
	it('a hyphen is a joiner only as the one trailing mark; a dash or a hyphen with a comma is not', () => {
		const mark = (punctuation: string) => unitWordsFromStacks([{ isProclitic: false, isEnclitic: false, punctuation }])[0].hyphenToNext;
		expect(['-', '‐', '‑'].map(mark)).toEqual([true, true, true]);
		expect(['', '–', '—', ',', '-,', '--'].map(mark)).toEqual([false, false, false, false, false, false]);
	});
});

describe('a hyphen where the particle is not in HYPHENATED_PARTICLES', () => {
	// `typed-hyphens.ts` splits a host from its particle only for ли ль бы б же ж. Any other hyphenated token stays one word.
	for (const text of ['кое-что', 'вот-вот', 'чёрно-белый', 'ну-ка', 'пойдём-ка']) {
		it(`«${text}» is one word with no trailing mark, so it is one unit`, () => {
			const words = wordsOf(text);
			expect(words).toHaveLength(1);
			expect(words[0].punctuation).toBe('');
			const { stacks, pre } = unitEnds(text);
			expect([stacks, pre]).toEqual([[0], [0]]);
		});
	}
});

describe('both doors give the unit\'s last word, on the four lines of the brief', () => {
	const cases: [string, number[]][] = [
		['велит-ли', [1, 1]],
		['сказал бы', [1, 1]],
		['не в силах', [2, 2, 2]],
		['тень непроглядная', [0, 1]],
	];
	for (const [text, ends] of cases) {
		it(`«${text}»`, () => {
			const got = unitEnds(text);
			expect(got.stacks).toEqual(ends);
			expect(got.pre).toEqual(ends);
		});
	}
});

describe('the two doors agree', () => {
	const lines = [
		'велит-ли', 'сказал бы', 'не в силах', 'тень непроглядная',
		'если б мог', 'сад ли', 'Ты же дом', 'О дай', 'О, дай', 'в доме', 'я не в силах', 'тень, же дом',
		'слово - слово', 'слово – слово', 'вот-вот пойдём-ка',
	];
	for (const text of lines) {
		it(`«${text}»`, () => {
			const { stacks, pre } = unitEnds(text);
			expect(pre).toEqual(stacks);
		});
	}
	it('a word after punctuation is not an enclitic, in either door', () => {
		// «тень, же дом»: «же» follows a comma. The pipeline sets isEnclitic false; the clitic set alone would say true.
		const words = wordsOf('тень, же дом');
		expect(words[1].isEnclitic).toBe(false);
		expect(GraysonEngine.enclitics.has('же')).toBe(true);
		expect(unitWordsFromPre(words, GraysonEngine)[1].isEnclitic).toBe(false);
	});
});

describe('the merge pass fuses a vowelless clitic into the word `unitEnd` puts it with', () => {
	// `ipaDisplay` is '→' for a proclitic merged forward and '←' for an enclitic merged back (`clitic-merge.ts`).
	for (const text of ['не в силах', 'сказал бы', 'если б мог', 'сад ли', 'Ты же дом', 'в доме', 'я не в силах']) {
		it(`«${text}»`, () => {
			const { words, stacks } = unitEnds(text);
			let merged = 0;
			words.forEach((w, i) => {
				if (w.ipaDisplay !== '→' && w.ipaDisplay !== '←') return;
				merged++;
				const step = w.ipaDisplay === '→' ? 1 : -1;
				let host = i + step;
				while (words[host]?.ipaDisplay === '→' || words[host]?.ipaDisplay === '←') host += step;
				expect(words[host], `host of «${w.cyrillic}»`).toBeDefined();
				expect(stacks[i], `«${w.cyrillic}» and its host «${words[host].cyrillic}» share one unit`).toBe(stacks[host]);
			});
			expect(merged).toBeGreaterThan(0);
		});
	}
});

describe('the lines are built from processText, not by hand', () => {
	it('a multi-line text gives one flag line per line', () => {
		const lines = processText('не в силах\nсказал бы');
		expect(lines.map((l) => unitWordsFromStacks(l.words).map((_, i, all) => unitEnd(all, i)))).toEqual([[2, 2, 2], [1, 1]]);
	});
});
