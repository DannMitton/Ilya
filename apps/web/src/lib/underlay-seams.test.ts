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
