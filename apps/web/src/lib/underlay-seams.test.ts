/**
 * The seams: the dictionary's test with the modern form tried after the word as
 * read, the engine's cut, and the wait for the dictionary. The real engine cuts
 * a list of words, and every cut is held against the word it came from.
 */
import { describe, expect, it } from 'vitest';
import { loadSeams, makeSeams, READY_MS } from './underlay-seams';
import { cutUnits } from './omr/underlay-units';
import { GraysonEngine } from '@ilya/phonology';

describe('makeSeams', () => {
	const words = new Set(['мир', 'шумного']);
	const modern = (w: string) => ({ міръ: 'мир', шумнаго: 'шумного' })[w as 'міръ'] ?? null;
	const seams = makeSeams((w) => words.has(w), (w) => [w], modern);

	it('knows a word the dictionary holds as read', () => {
		expect(seams.isWord('мир')).toBe(true);
	});

	it('knows a pre-reform word by its modern form', () => {
		expect(seams.isWord('міръ')).toBe(true);
		expect(seams.isWord('шумнаго')).toBe(true);
	});

	it('does not know a word neither form of which the dictionary holds', () => {
		expect(seams.isWord('xyz')).toBe(false);
		expect(seams.isWord('мирр')).toBe(false);
	});

	it('does not ask again for a modern form that is the same word', () => {
		const asked: string[] = [];
		makeSeams((w) => (asked.push(w), false), (w) => [w], (w) => w).isWord('слово');
		expect(asked).toEqual(['слово']);
	});

	it('passes the engine\'s cut through', () => {
		expect(makeSeams(() => false, (w) => [w.slice(0, 1), w.slice(1)], () => null).cut('да')).toEqual(['д', 'а']);
	});
});

describe('loadSeams', () => {
	it('waits for the dictionary to load, asking again each time', async () => {
		let asks = 0;
		let waited = 0;
		await loadSeams(() => ++asks > 3, async () => void waited++);
		expect(asks).toBe(4);
		expect(waited).toBe(3);
	});

	it('does not wait where the dictionary has loaded', async () => {
		let waited = 0;
		await loadSeams(() => true, async () => void waited++);
		expect(waited).toBe(0);
	});

	it('rejects after the time it is given, so that a page whose dictionary never loads answers null', async () => {
		let waited = 0;
		// The wait gives up on its own after a thousand polls, so that a loop with no time out fails here and does not hang.
		const wait = async () => {
			if (++waited > 1000) throw new Error('never gave up');
		};
		await expect(loadSeams(() => false, wait)).rejects.toThrow('the dictionary did not load');
		expect(waited * 200).toBeGreaterThanOrEqual(READY_MS - 200);
		expect(waited * 200).toBeLessThanOrEqual(READY_MS);
	});

	it('is the pipeline\'s lookup and the engine\'s cut once it is ready', async () => {
		const seams = await loadSeams(() => true);
		expect(seams.cut('шумного')).toEqual(['шум', 'но', 'го']);
		expect(seams.isWord('мама')).toBe(false); // no dictionary is loaded in a test: every word looks unknown, which is what the wait is for
	});
});

describe('the engine\'s cut, held against the words it cuts', () => {
	const words = ['шумного', 'бала', 'суеты', 'грустно', 'звучит', 'тебя', 'комнатка', 'тесная', 'тихая', 'милая', 'печальные', 'средь', 'случайно', 'тревоге', 'мирской', 'любовь', 'встречи', 'ненастный'];
	const cut = (w: string) => GraysonEngine.syllabify(w);

	it('gives pieces that add up to the word, for every word of the list', () => {
		for (const w of words) expect(cut(w).join(''), w).toBe(w);
	});

	it('cuts the word of the worked example the way the print divides it', () => {
		expect(cut('шумного')).toEqual(['шум', 'но', 'го']);
		expect(cut('бала')).toEqual(['ба', 'ла']);
	});

	it('is accepted by the hybrid cut for every word of two vowels or more, with none left whole by a mismatch', () => {
		const tokens = words.map((text, i) => ({ text, x0: i * 100, x1: i * 100 + 90 }));
		const { counts } = cutUnits(tokens, cut);
		expect(counts.mismatched).toBe(0);
		expect(counts.cut + counts.whole).toBe(words.length);
	});

	it('keeps the capital and the mark of the print when it is cut', () => {
		const { units } = cutUnits([{ text: 'Грустно,', x0: 0, x1: 80 }], cut);
		expect(units.map((u) => u.text)).toEqual(['Груст-', 'но,']);
	});
});

import { cliticCalls } from './underlay-seams';

describe('cliticCalls: the transcription\'s own call, row by row (brief r5 step 4)', () => {
	it('calls «в» before a word a proclitic and «ж» after one an enclitic, and a word with a vowel of its own neither', () => {
		expect(cliticCalls(['в', 'тиши', 'ночи'])).toEqual(['proclitic', null, null]);
		expect(cliticCalls(['мой', 'друг', 'ж'])).toEqual([null, null, 'enclitic']);
	});

	it('is case and mark blind, as the print has capitals and marks', () => {
		expect(cliticCalls(['В', 'тиши,'])[0]).toBe('proclitic');
	});

	it('calls a word the transcription does not return null, never folding it', () => {
		expect(cliticCalls(['в', '...', 'тиши'], () => [{ cleanWord: 'тиши', isProclitic: false, isEnclitic: false }])).toEqual([null, null, null]);
	});

	it('reaches a word the dictionary does not hold (N.163): it still has its syllables and takes its clitic', () => {
		expect(cliticCalls(['к', 'Ксюштрам'])).toEqual(['proclitic', null]);
	});
});

import { modernisePreReform } from '@ilya/dictionary';
import { foldClitics } from './omr/underlay-clitics';
import { rowWordSpans } from './omr/underlay-tokens';

describe('cliticCalls reads the modern spelling (brief r5 step 5)', () => {
	const modern = (w: string) => modernisePreReform(w);
	/**
	 * The transcription as the built app gives it, with the dictionary loaded: «в» and «с» for a printed «въ» and «съ»
	 * (`pipeline.ts`, the modern form adopted where it is a known word), each a proclitic; the desk's replay measured it
	 * (`report-desk-n135-stage2b-r5-replay_r1_2026-10-29.md` section 3). Under vitest the dictionary is not loaded
	 * (`GraysonEngine.lookupStress('в')` is null), so `processText` keeps «въ» and calls it nothing; a stub stands in.
	 */
	const loaded = (line: string) =>
		line.split(' ').map((w) => {
			const cleanWord = modernisePreReform(w) ?? w;
			return { cleanWord, isProclitic: ['в', 'с'].includes(cleanWord.toLowerCase()), isEnclitic: false };
		});

	it('calls a printed «въ» and «съ» proclitics, as «в» and «с» are', () => {
		expect(cliticCalls(['въ', 'мир'], loaded, modern)).toEqual(['proclitic', null]);
		expect(cliticCalls(['съ', 'нею'], loaded, modern)).toEqual(['proclitic', null]);
		expect(cliticCalls(['в', 'мир'], loaded, modern)).toEqual(['proclitic', null]);
	});

	it('does not find them comparing raw letters (the mutant: no modern form)', () => {
		expect(cliticCalls(['въ', 'мир'], loaded)).toEqual([null, null]);
		expect(cliticCalls(['съ', 'нею'], loaded)).toEqual([null, null]);
	});

	it('also matches a pre-reform word the transcription kept as printed (its modern form unknown to the dictionary)', () => {
		const kept = () => [{ cleanWord: 'въ', isProclitic: true, isEnclitic: false }];
		expect(cliticCalls(['въ'], kept, modern)).toEqual(['proclitic']);
	});

	it('folds «въ мир» and «съ нею» as «в мир» and «с нею» fold', () => {
		const row = (a: string, b: string) => {
			const tokens = [{ text: a, x0: 100, x1: 120 }, { text: b, x0: 150, x1: 250 }];
			const { units, origin } = cutUnits(tokens, (w) => [w]);
			const words = rowWordSpans(tokens);
			return foldClitics(units, origin, words, cliticCalls(words.map((x) => x.text), loaded, modern)).units.map((u) => u.text);
		};
		expect(row('въ', 'мир')).toEqual(['въ\u00a0мир']);
		expect(row('в', 'мир')).toEqual(['в\u00a0мир']);
		expect(row('съ', 'нею')).toEqual(['съ\u00a0нею']);
	});
});
