/**
 * text-pages.test.ts: Text's pages hold no empty space mid-document and never
 * run off a page (QUEUE row 79; Dann 2026-10-11 21:50, `PRODUCT.md` "No empty
 * space mid-document", rule 2). A stanza is a paragraph: a line that does not
 * fit breaks between its rows, at least two on each page.
 */
import { describe, expect, it } from 'vitest';
import { LINES_PER_PAGE, rowsOf, sliceLinesToPages, WORDS_PER_ROW } from './page-config';
import type { LineData, WordStackData } from './types';

const word = (lineIndex: number, wordIndex: number, extra: Partial<WordStackData> = {}): WordStackData =>
	({ cyrillic: 'слово', cleanWord: 'слово', lineIndex, wordIndex, isProclitic: false, ...extra }) as unknown as WordStackData;
const line = (n: number, words: number): LineData => ({ lineNumber: n, words: Array.from({ length: words }, (_, i) => word(n, i)) });
const rows = (page: LineData[]) => page.reduce((t, l) => t + rowsOf(l), 0);

describe("Text's pages (row 79)", () => {
	it('costs a line its rows: one for seven words or fewer, as before, then a row per seven', () => {
		expect(rowsOf(line(0, 7))).toBe(1);
		expect(rowsOf(line(0, 8))).toBe(2);
		expect(rowsOf(line(0, 14))).toBe(2);
		expect(rowsOf(line(0, 95))).toBe(Math.ceil(95 / WORDS_PER_ROW));
	});

	it('breaks a poem that arrives as one long line across pages, every page within its budget', () => {
		const pages = sliceLinesToPages([line(0, 95)], 9);
		expect(pages.length).toBeGreaterThan(1);
		expect(rows(pages[0])).toBeLessThanOrEqual(9);
		for (const p of pages.slice(1)) expect(rows(p)).toBeLessThanOrEqual(LINES_PER_PAGE);
		// Every word printed once, in order, and each part at least two rows.
		const all = pages.flat().flatMap((l) => l.words.map((w) => w.wordIndex));
		expect(all).toEqual(Array.from({ length: 95 }, (_, i) => i));
		for (const p of pages) for (const l of p) if (l.words.length > 7) expect(rowsOf(l)).toBeGreaterThanOrEqual(2);
	});

	it('fills a page before it turns: a full page but the last leaves no whole row unused that a line could take', () => {
		const pages = sliceLinesToPages([line(0, 7), line(1, 7), line(2, 40), line(3, 7)], 9);
		expect(rows(pages[0])).toBe(9);
	});

	it('moves a line whole where breaking it would leave a single row on either page', () => {
		const pages = sliceLinesToPages([...Array.from({ length: 8 }, (_, i) => line(i, 7)), line(8, 12)], 9);
		// One row is left on page 1 and the line has two: it moves whole.
		expect(pages[1][0].words.length).toBe(12);
		expect(pages[0]).toHaveLength(8);
	});

	it('never ends a part on a proclitic, which leans on the word after it', () => {
		const ws = Array.from({ length: 30 }, (_, i) => word(0, i, i === 11 ? { isProclitic: true } : {}));
		const pages = sliceLinesToPages([line(1, 7), line(2, 7), line(3, 7), line(4, 7), line(5, 7), line(6, 7), line(7, 7), { lineNumber: 0, words: ws }], 9);
		const head = pages[0][pages[0].length - 1];
		expect(head.words[head.words.length - 1].isProclitic).toBe(false);
	});

	it('keeps the old answer for a poem of short lines', () => {
		const pages = sliceLinesToPages(Array.from({ length: 12 }, (_, i) => line(i, 5)), 9);
		expect(pages.map((p) => p.length)).toEqual([9, 3]);
	});
});
