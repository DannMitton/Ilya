/**
 * seatPage: the reader's answer for each row, back on the page, judged, cut,
 * seated, and sewn. The dictionary and the engine are stubs (`Seams`).
 */
import { describe, expect, it } from 'vitest';
import { pageTokens, seatPage, type PageLayout, type RowLayout, type Seams, type SystemLayout, type WordBox } from './underlay-page';
import type { FrameTransform } from './underlay-frame';

const known = new Set(['шумного', 'бала', 'средь', 'и', 'грустно', 'ты', 'мир']);
const pieces: Record<string, string[]> = { шумного: ['шум', 'но', 'го'], бала: ['ба', 'ла'], грустно: ['груст', 'но'] };
const seams: Seams = { isWord: (w) => known.has(w), cut: (w) => pieces[w.toLowerCase()] ?? [w.toLowerCase()] };

const transform = (scale = 1): FrameTransform => ({ scale, pad: 16, angle: 0, width: 1200, height: 42 });
const row = (id: number, scale = 1, offsetY = 265): RowLayout => ({ id, transform: transform(scale), offsetX: 0, offsetY });
/** A word box in a framed row, from page x to page x. */
const box = (text: string, x0: number, x1: number, scale = 1): WordBox => ({ text, x0: x0 * scale + 16, x1: x1 * scale + 16, y0: 16, y1: 48 });
const notes = (...xs: number[]) => xs.map((x, i) => ({ id: i, x, bar: 1 }));
/** Notes numbered from `first`, as the notes of a later system are in a page. */
const notesFrom = (first: number, ...xs: number[]) => xs.map((x, i) => ({ id: first + i, x, bar: 2 }));
const system = (n: ReturnType<typeof notes>, rows: RowLayout[], hasBand = true): SystemLayout => ({ staffSpace: 30, notes: n, hasBand, rows });
const layout = (...systems: SystemLayout[]): PageLayout => ({ width: 1200, height: 1100, systems, unfound: 0 });
const shape = (p: ReturnType<typeof seatPage>) => p.words.map((w) => w.syllables.map((s) => [s.text, s.syllabic, s.note]));

describe('pageTokens', () => {
	it('takes a framed box back to page pixels: the padding and the scale removed, the crop\'s offset added', () => {
		const t = pageTokens({ ...row(0, 2), offsetX: 100 }, [box('ты', 50, 90, 2)]);
		expect(t).toEqual([{ text: 'ты', x0: 150, x1: 190 }]);
	});

	it('splits a word at a mark inside it', () => {
		expect(pageTokens(row(0), [box('су-е', 0, 90)]).map((t) => t.text)).toEqual(['су-', 'е']);
	});
});

describe('pageTokens, the dash that is a mark', () => {
	// A dash 20 page-pixels wide. The row's ink is 32 framed px high: 32 page px at scale 1, 16 at scale 2, 64 at scale 0.5.
	const dash = (scale: number) => pageTokens(row(0, scale), [box('—', 100, 120, scale)]).map((t) => t.text);

	it('is a mark where it is wider than half the ink height on the page, and a joint where it is not', () => {
		expect(dash(1)).toEqual(['']);
		expect(dash(2)).toEqual(['']);
		expect(dash(0.5)).toEqual(['—']);
	});
});

describe('seatPage', () => {
	it('seats the words of a row under the notes of its system, a word the engine cuts across several', () => {
		const page = seatPage(layout(system(notes(100, 200, 300, 400, 500), [row(0)])), [[box('Средь', 90, 110), box('шумного', 180, 320), box('бала', 380, 520)]], seams);
		expect(page.systems).toEqual([{ written: true, bars: [1, 1], why: null }]);
		// Six units for five notes: «но» is the one the least-cost alignment leaves out, and its letters join the next syllable of the word.
		expect(shape(page)).toEqual([
			[['Средь', 'single', 0]],
			[['шум', 'begin', 1], ['ного', 'end', 2]],
			[['ба', 'begin', 3], ['ла', 'end', 4]],
		]);
		expect(page.stats).toMatchObject({ systems: 1, banded: 1, rows: 1, russianRows: 1, systemsRussian: 1, tokens: 3, seated: 5, unseated: 1 });
	});

	it('keeps the capital and the mark of the print on the syllable', () => {
		const page = seatPage(layout(system(notes(100, 200), [row(0)])), [[box('Грустно,', 80, 220)]], seams);
		expect(shape(page)).toEqual([[['Груст', 'begin', 0], ['но,', 'end', 1]]]);
	});

	it('does not seat a row that is not Russian, and says the system took no words', () => {
		const page = seatPage(layout(system(notes(100, 200), [row(0)])), [[box('Wohl', 80, 120), box('dem', 180, 220)]], seams);
		expect(page.systems).toEqual([{ written: false, bars: [1, 1], why: 'no Russian row' }]);
		expect(page.words).toEqual([]);
		expect(page.stats).toMatchObject({ russianRows: 0, systemsRussian: 0 });
	});

	it('writes nothing for a system with no band, and says why', () => {
		const page = seatPage(layout(system(notes(100), [], false)), [], seams);
		expect(page.systems).toEqual([{ written: false, bars: [1, 1], why: 'no band' }]);
		expect(page.stats.banded).toBe(0);
	});

	it('seats the first Russian row of a system, and skips a German row above it and a second verse below', () => {
		const rows = [row(0), row(1, 1, 300), row(2, 1, 340)];
		const page = seatPage(layout(system(notes(100, 300), rows)), [[box('Wohl', 80, 120), box('dem', 180, 220)], [box('бала', 80, 320)], [box('мир', 80, 120), box('ты', 280, 320)]], seams);
		expect(shape(page)).toEqual([[['ба', 'begin', 0], ['ла', 'end', 1]]]);
		expect(page.stats).toMatchObject({ rows: 3, russianRows: 2, systemsRussian: 1 });
	});

	it('keeps the words of the system that has a Russian row where another of the page has none, and says which, with its bars', () => {
		const page = seatPage(layout(system(notes(100), [row(0)]), system(notesFrom(10, 100, 200), [row(1)])), [[box('мир', 80, 120)], [box('qq', 80, 120)]], seams);
		expect(page.systems).toEqual([
			{ written: true, bars: [1, 1], why: null },
			{ written: false, bars: [2, 2], why: 'no Russian row' },
		]);
		expect(shape(page)).toEqual([[['мир', 'single', 0]]]);
	});

	it('gives a system the first and the last bar of its notes, as homr numbers them on the page', () => {
		const n = [{ id: 0, x: 100, bar: 7 }, { id: 1, x: 200, bar: 8 }, { id: 2, x: 300, bar: 9 }];
		expect(seatPage(layout(system(n, [row(0)])), [[box('qq', 80, 120)]], seams).systems).toEqual([{ written: false, bars: [7, 9], why: 'no Russian row' }]);
	});

	it('gives a system with no note no bars', () => {
		expect(seatPage(layout(system([], [], false)), [], seams).systems).toEqual([{ written: false, bars: null, why: 'no band' }]);
	});

	it('carries a word across a system break: a hyphen at the end of one row joins the first token of the next', () => {
		const page = seatPage(layout(system(notes(100, 200), [row(0)]), system(notesFrom(10, 100, 300), [row(1)])), [[box('Средь', 80, 120), box('шум-', 180, 220)], [box('ного', 80, 140), box('мир', 280, 320)]], seams);
		expect(page.words.map((w) => w.syllables.map((s) => s.text).join(''))).toEqual(['Средь', 'шумного', 'мир']);
	});

	it('leaves a surplus token unseated and counts it, never putting it on a neighbouring note', () => {
		const page = seatPage(layout(system(notes(100, 300), [row(0)])), [[box('мир', 90, 110), box('и', 190, 210), box('ты', 290, 310)]], seams);
		expect(shape(page).flat().map((s) => s[2])).toEqual([0, 1]);
		expect(page.stats).toMatchObject({ seated: 2, unseated: 1 });
	});

	it('seats no token on a note a tie stops on', () => {
		const n = [{ id: 0, x: 100, bar: 1 }, { id: 1, x: 200, bar: 1, tiedInto: true }, { id: 2, x: 300, bar: 1 }];
		const page = seatPage(layout(system(n, [row(0)])), [[box('мир', 90, 110), box('ты', 190, 210)]], seams);
		expect(shape(page).flat().map((s) => s[2])).toEqual([0, 2]);
	});

	it('has no system, and no words, for a page with no voice note', () => {
		const page = seatPage(layout(), [], seams);
		expect(page).toMatchObject({ systems: [], words: [] });
	});

	it('counts the sewn words of two letters or more that the dictionary holds', () => {
		const page = seatPage(layout(system(notes(100, 200, 300), [row(0)])), [[box('мир', 80, 120), box('ты', 180, 220), box('zzz', 280, 320)]], seams);
		expect(page.stats).toMatchObject({ words: 3, known: 2 });
		expect(page.systems.map((x) => x.written)).toEqual([true]);
	});

	it('reads nothing for a row the reader gave no answer for', () => {
		const page = seatPage(layout(system(notes(100), [row(0)])), [], seams);
		expect(page.systems.map((x) => x.written)).toEqual([false]);
		expect(page.stats.tokens).toBe(0);
	});
});
