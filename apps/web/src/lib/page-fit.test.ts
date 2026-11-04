/**
 * page-fit.test.ts: Text's pages are cut from measured heights (step 7, part 1), and never overrun their window.
 *
 * The measurements are synthetic here (the browser side is `e2e/pages-without-gaps.test.ts`), so every case is a pure
 * function of numbers: Letter and A4, a footer of one legend row and of two, many short lines, lines that wrap past
 * what the old seven-words-a-row estimate said, and a long poem that reaches Text as one line. It replaces
 * `text-pages.test.ts` (row 79), whose cases that still hold are kept below.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { FOOTER_MAX_HEIGHT, GAP, HEADER_GAP, HEADER_HEIGHTS_AT_LETTER, MARGINS, PAGE_SIZES } from './page-config';
import {
	contentHeight,
	displayedWords,
	ESTIMATED_WORDS_PER_ROW,
	estimateMetrics,
	FALLBACK_FIT,
	fitRows,
	MAX_GAP,
	MIN_GAP,
	pieceKey,
	slicePages,
	type FitMetrics,
	type PieceMetrics,
} from './page-fit';
import type { LineData, WordStackData } from './types';

const word = (lineIndex: number, wordIndex: number, extra: Partial<WordStackData> = {}): WordStackData =>
	({ cyrillic: 'слово', cleanWord: 'слово', lineIndex, wordIndex, isProclitic: false, ...extra }) as unknown as WordStackData;
const line = (n: number, words: number): LineData => ({ lineNumber: n, words: Array.from({ length: words }, (_, i) => word(n, i)) });
const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8');

/** What the browser measured on 2026-11-03 (the desk's probe, and Code's): a row draws 57.4 px, with nothing below it. */
const FIT: FitMetrics = { rowBox: 57.40625, overhang: 0, padTop: 4 };

/** The content window for a page: the sheet less its header and the footer's reserve, as `Paper.svelte` computes it. */
function windowFor(size: 'letter' | 'a4', header: number, footer: number): number {
	return PAGE_SIZES[size].height - (MARGINS.vertical + header + HEADER_GAP) - (MARGINS.vertical + Math.max(FOOTER_MAX_HEIGHT, footer) + GAP);
}
const TITLE = HEADER_HEIGHTS_AT_LETTER.title;
const SUB = HEADER_HEIGHTS_AT_LETTER.subsequent;
/** A footer with no legend, with one legend row (the desk's 90 px), and with two (about 110 px, inference). */
const FOOTERS = { none: 0, one: 90, two: 110 } as const;

/** Metrics a line of `perRow` words a row would have, with each row `FIT.rowBox` high; the first row is as wide as the rest. */
function uniform(perRow: number) {
	return (l: LineData): PieceMetrics => {
		const n = displayedWords(l).length;
		const rows = Math.max(1, Math.ceil(n / perRow));
		return { rows, rowStarts: Array.from({ length: rows }, (_, i) => i * perRow), height: rows * FIT.rowBox };
	};
}

/** Slice with a full set of measurements, so `unmeasured` is empty and the cut is exact. */
function sliceMeasured(lines: LineData[], metrics: (l: LineData) => PieceMetrics, win: (i: number) => number, fit = FIT) {
	// Measure every piece the slicer asks about, until it asks about none (a tail is a new piece).
	const known = new Map<string, PieceMetrics>();
	let out = slicePages({ lines, metricsOf: (k) => known.get(k), windowOf: win, fit });
	for (let n = 0; out.unmeasured.length > 0; n++) {
		expect(n, 'the measure and slice loop did not settle').toBeLessThan(8);
		for (const piece of out.unmeasured) known.set(pieceKey(piece), metrics(piece));
		out = slicePages({ lines, metricsOf: (k) => known.get(k), windowOf: win, fit });
	}
	return out.pages;
}

/** Every page fits its window by the numbers it was cut from, and no page but the last stands half empty. */
function expectFit(pages: ReturnType<typeof sliceMeasured>, win: (i: number) => number, metrics: (l: LineData) => PieceMetrics, fit = FIT) {
	pages.forEach((p, i) => {
		const sum = p.lines.reduce((t, l) => t + metrics(l).height, 0);
		const rows = p.lines.reduce((t, l) => t + metrics(l).rows, 0);
		expect(rows, `page ${i + 1} rows`).toBeLessThanOrEqual(p.capacity);
		// computed here by hand (rows, the gaps between them, the 4 px padding, the overhang), not by the function under test
		const needed = sum + (rows - 1) * p.gap + 4 + fit.overhang;
		expect(needed, `page ${i + 1} overruns its window`).toBeLessThanOrEqual(win(i));
	});
}

describe('fitRows: ten rows, nine or eight when the gap falls below 18 (Dann), from true heights', () => {
	it('floors the gap and counts the padding and the overhang, so ten rows never need more than the window', () => {
		for (let w = 300; w <= 1100; w += 0.5) {
			const { rows, gap } = fitRows(w, FIT);
			expect(Number.isInteger(gap)).toBe(true);
			expect(gap).toBeLessThanOrEqual(MAX_GAP);
			if (rows > 8) expect(gap).toBeGreaterThanOrEqual(MIN_GAP);
			// whenever the window can hold the rows at all, they fit
			if (w >= rows * FIT.rowBox + (rows - 1) * 18 + FIT.padTop + FIT.overhang) {
				expect(contentHeight(rows * FIT.rowBox, rows, gap, FIT), `window ${w}`).toBeLessThanOrEqual(w);
			}
		}
	});

	it('the Tchaikovsky page 1: nine rows at 24 px with a one-row legend (footer 90), nine rows at 26 px without', () => {
		expect(fitRows(windowFor('letter', TITLE, FOOTERS.one), FIT)).toEqual({ rows: 9, gap: 24 });
		expect(fitRows(windowFor('letter', TITLE, FOOTERS.none), FIT)).toEqual({ rows: 9, gap: 26 });
		expect(windowFor('letter', TITLE, FOOTERS.one)).toBe(719);
		expect(windowFor('letter', TITLE, FOOTERS.none)).toBe(729);
	});

	it('the old arithmetic, for the record: ten rows of 56 at a rounded gap of 19 into 729 px needed 735 px plus 1.4 px of ink', () => {
		const old = 10 * 56 + 9 * 19 + 4;
		expect(old).toBe(735);
		expect(old + 1.4 - 729).toBeCloseTo(7.4, 5); // the overrun of step 6
		// the desk's sum-only fix (padding counted, gap floored) at rows of 56.3 left 1.1 px
		expect(10 * 56.3 + 9 * 18 + 4 + 1.1 - 729).toBeCloseTo(1.1, 5);
	});

	it('with the desk’s first measure (56.3 px rows, 1.1 px overhang) a 729 px window needs 17.88 px for ten rows, so it too lands on nine', () => {
		expect(fitRows(729, { rowBox: 56.3, overhang: 1.1, padTop: 4 })).toEqual({ rows: 9, gap: 27 });
	});

	it('the same rule on A4 (794 by 1123), where the window is taller', () => {
		const w = windowFor('a4', TITLE, FOOTERS.one);
		expect(w).toBe(1123 - (48 + 127 + 16) - (48 + 90 + 8));
		const { rows, gap } = fitRows(w, FIT);
		expect(rows).toBe(10);
		expect(gap).toBeGreaterThanOrEqual(MIN_GAP);
		expect(contentHeight(rows * FIT.rowBox, rows, gap, FIT)).toBeLessThanOrEqual(w);
	});

	it('uses the fallback numbers before the first measurement, and they are the desk’s', () => {
		expect(FALLBACK_FIT).toEqual({ rowBox: 56.3, overhang: 1.1, padTop: 4 });
	});
});

describe('slicePages: many short lines, on every sheet and every footer', () => {
	for (const size of ['letter', 'a4'] as const) {
		for (const [name, footer] of Object.entries(FOOTERS)) {
			it(`${size}, footer ${name} (${footer} px): 40 one-row lines never overrun, and every page but the last is full`, () => {
				const win = (i: number) => windowFor(size, i === 0 ? TITLE : SUB, footer);
				const lines = Array.from({ length: 40 }, (_, i) => line(i, 4));
				const metrics = uniform(ESTIMATED_WORDS_PER_ROW);
				const pages = sliceMeasured(lines, metrics, win);
				expectFit(pages, win, metrics);
				expect(pages.flatMap((p) => p.lines.map((l) => l.lineNumber))).toEqual(lines.map((l) => l.lineNumber));
				pages.slice(0, -1).forEach((p, i) => expect(p.lines.length, `page ${i + 1} is full`).toBe(p.capacity));
				// no page but the last is more than 15 percent empty (`PRODUCT.md` rule 2)
				pages.slice(0, -1).forEach((p, i) => {
					const empty = win(i) - contentHeight(p.lines.length * FIT.rowBox, p.lines.length, p.gap, FIT);
					expect(empty / win(i), `page ${i + 1}`).toBeLessThanOrEqual(0.15);
				});
			});
		}
	}

	it('a legend that grows the footer shrinks every page’s window, and the rows with it, without moving a line off the slice', () => {
		const lines = Array.from({ length: 25 }, (_, i) => line(i, 3));
		const metrics = uniform(7);
		const rowsOn = (footer: number) => sliceMeasured(lines, metrics, (i) => windowFor('letter', i === 0 ? TITLE : SUB, footer), FIT).map((p) => p.lines.length);
		const plain = rowsOn(0);
		const legend = rowsOn(90);
		expect(plain.reduce((a, b) => a + b)).toBe(25);
		expect(legend.reduce((a, b) => a + b)).toBe(25);
		expect(legend[0]).toBeLessThanOrEqual(plain[0]);
		expect(Math.max(...legend)).toBeLessThanOrEqual(10);
	});

	it('is a function of its input: the same lines, measurements, and windows give the same pages, and the windows do not read the pages', () => {
		const lines = Array.from({ length: 30 }, (_, i) => line(i, 3 + (i % 9)));
		const win = (i: number) => windowFor('letter', i === 0 ? TITLE : SUB, 90);
		const a = sliceMeasured(lines, uniform(7), win);
		const b = sliceMeasured(lines, uniform(7), win);
		expect(a.map((p) => p.lines.map(pieceKey))).toEqual(b.map((p) => p.lines.map(pieceKey)));
	});
});

describe('slicePages: wrapping lines, which the seven-words-a-row estimate counted as one row', () => {
	it('counts the rows the browser wrapped, not the words: seven long words that wrap to three rows cost three', () => {
		const long = line(0, 7);
		const m = (l: LineData): PieceMetrics => (l === long ? { rows: 3, rowStarts: [0, 3, 5], height: 3 * FIT.rowBox } : uniform(7)(l));
		const win = (i: number) => windowFor('letter', i === 0 ? TITLE : SUB, 90);
		const lines = [long, ...Array.from({ length: 12 }, (_, i) => line(i + 1, 3))];
		const pages = sliceMeasured(lines, m, win);
		// nine rows on page 1: the wrapped line (3) and six one-row lines, not the seven the estimate would take
		expect(pages[0].lines.map((l) => l.lineNumber)).toEqual([0, 1, 2, 3, 4, 5, 6]);
		expectFit(pages, win, m);
		// the estimate alone would have counted it as one row (the blind spot this fix closes)
		expect(estimateMetrics(long, FIT).rows).toBe(1);
	});

	it('wrapped rows cost their own gaps: a page of wrapped lines fits as the sum of its rows says', () => {
		const lines = Array.from({ length: 10 }, (_, i) => line(i, 14)); // two rows each
		const win = (i: number) => windowFor('letter', i === 0 ? TITLE : SUB, 90);
		const pages = sliceMeasured(lines, uniform(7), win);
		expectFit(pages, win, uniform(7));
		expect(pages.length).toBeGreaterThan(2);
	});

	it('rows taller than the fit assumed (70 px drawn, 57.4 assumed) cost rows by their measured height: the height decides, not the row count', () => {
		const win = (i: number) => windowFor('letter', i === 0 ? TITLE : SUB, 90);
		const m = (l: LineData): PieceMetrics => ({ ...uniform(7)(l), height: uniform(7)(l).rows * 70 });
		const pages = sliceMeasured(Array.from({ length: 20 }, (_, i) => line(i, 3)), m, win, FIT);
		expectFit(pages, win, m, FIT);
		expect(pages[0].capacity).toBe(9);
		expect(pages[0].lines.length).toBeLessThan(9); // nine rows would fit by count, not by height
	});

	it('counts the content window’s own 4 px padding: eight rows of 68.6 px fit by 2.2 px without it and overrun by 1.8 px with it', () => {
		const win = (i: number) => windowFor('letter', i === 0 ? TITLE : SUB, 90); // 719 px on page 1, gap 24
		const m = (l: LineData): PieceMetrics => ({ ...uniform(7)(l), height: uniform(7)(l).rows * 68.6 });
		const pages = sliceMeasured(Array.from({ length: 20 }, (_, i) => line(i, 3)), m, win, FIT);
		expectFit(pages, win, m, FIT); // hand-computed, padding included
		expect(pages[0].lines.length).toBe(7);
	});

	it('a taller row (a measured 70 px) leaves fewer rows on the page, never an overrun', () => {
		const fit = { ...FIT, rowBox: 70 };
		const win = (i: number) => windowFor('letter', i === 0 ? TITLE : SUB, 90);
		const m = (l: LineData): PieceMetrics => ({ ...uniform(7)(l), height: uniform(7)(l).rows * 70 });
		const pages = sliceMeasured(Array.from({ length: 20 }, (_, i) => line(i, 3)), m, win, fit);
		expectFit(pages, win, m, fit);
		expect(pages[0].capacity).toBeLessThan(9);
	});
});

describe('slicePages: cutting a line at the browser’s own wrap points (row 79, kept)', () => {
	it('a poem that arrives as one line of 95 words breaks across pages at measured rows, every page within its window', () => {
		const metrics = uniform(8);
		const win = (i: number) => windowFor('letter', i === 0 ? TITLE : SUB, 90);
		const pages = sliceMeasured([line(0, 95)], metrics, win);
		expect(pages.length).toBeGreaterThan(1);
		expectFit(pages, win, metrics);
		// every word printed once, in order
		expect(pages.flatMap((p) => p.lines.flatMap((l) => l.words.map((w) => w.wordIndex)))).toEqual(Array.from({ length: 95 }, (_, i) => i));
		// each part at least two rows
		for (const p of pages) for (const l of p.lines) if (l.words.length > 8) expect(metrics(l).rows).toBeGreaterThanOrEqual(2);
	});

	it('cuts where the line wrapped: the head ends at a measured row start', () => {
		const starts = [0, 6, 13, 19, 27, 33, 40, 47, 52, 60, 66, 71];
		const l = line(0, 75);
		const m = (p: LineData): PieceMetrics => {
			if (p.words.length === 75) return { rows: starts.length, rowStarts: starts, height: starts.length * FIT.rowBox };
			return uniform(7)(p);
		};
		const win = (i: number) => windowFor('letter', i === 0 ? TITLE : SUB, 90);
		const pages = sliceMeasured([line(1, 3), line(2, 3), l], m, win);
		const head = pages[0].lines[pages[0].lines.length - 1];
		expect(head.lineNumber).toBe(0);
		expect(starts).toContain(head.words.length);
	});

	it('leaves at least two rows on each page, or moves the line whole', () => {
		const win = (i: number) => windowFor('letter', i === 0 ? TITLE : SUB, 90);
		const lines = [...Array.from({ length: 8 }, (_, i) => line(i, 3)), line(8, 12)]; // 8 rows, then 2 rows: one left on page 1
		const pages = sliceMeasured(lines, uniform(7), win);
		expect(pages[0].lines.map((l) => l.lineNumber)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
		expect(pages[1].lines[0].lineNumber).toBe(8);
		expect(pages[1].lines[0].words).toHaveLength(12);
	});

	it('never ends a part on a proclitic, which leans on the word after it', () => {
		const words = Array.from({ length: 40 }, (_, i) => word(0, i, i === 13 ? { isProclitic: true } : {}));
		const l: LineData = { lineNumber: 0, words };
		const win = (i: number) => windowFor('letter', i === 0 ? TITLE : SUB, 90);
		const m = (p: LineData): PieceMetrics => (p.words.length === 40 ? { rows: 3, rowStarts: [0, 14, 27], height: 3 * FIT.rowBox } : uniform(7)(p));
		const pages = sliceMeasured([...Array.from({ length: 8 }, (_, i) => line(i + 1, 3)), l], m, win);
		const head = pages[0].lines[pages[0].lines.length - 1];
		if (head.lineNumber === 0) expect(head.words[head.words.length - 1].isProclitic).toBe(false);
	});

	it('a tail is measured as its own piece: its first row is wider, so it can wrap to fewer rows than were left', () => {
		const l = line(0, 60);
		const win = (i: number) => windowFor('letter', i === 0 ? TITLE : SUB, 90);
		const known = new Map<string, PieceMetrics>();
		known.set(pieceKey(l), { rows: 8, rowStarts: [0, 8, 16, 24, 32, 40, 48, 56], height: 8 * FIT.rowBox });
		for (let i = 1; i <= 7; i++) known.set(pieceKey(line(i, 3)), { rows: 1, rowStarts: [0], height: FIT.rowBox });
		const first = slicePages({ lines: [line(1, 3), line(2, 3), line(3, 3), line(4, 3), line(5, 3), l], metricsOf: (k) => known.get(k), windowOf: win, fit: FIT });
		// the head is cut at a measured row start; the tail was never measured, so it is asked for
		const tails = first.unmeasured.filter((u) => u.lineNumber === 0);
		expect(tails.length).toBeGreaterThan(0);
		expect(first.unmeasured.every((u) => !known.has(pieceKey(u)))).toBe(true);
		// measuring the tail with fewer rows than the estimate gives a slice that asks for nothing more
		for (const t of tails) known.set(pieceKey(t), { rows: 3, rowStarts: [0, 9, 20], height: 3 * FIT.rowBox });
		const second = slicePages({ lines: [line(1, 3), line(2, 3), line(3, 3), line(4, 3), line(5, 3), l], metricsOf: (k) => known.get(k), windowOf: win, fit: FIT });
		expect(second.unmeasured.filter((u) => u.lineNumber === 0 && !known.has(pieceKey(u)))).toEqual([]);
	});
});

describe('slicePages: the measuring loop settles', () => {
	/** A browser stand-in: lays words out at `perRow` a row, with the first row of a line one word wider than a continuation row. */
	const oracle = (perRow: number) => (l: LineData): PieceMetrics => {
		const n = displayedWords(l).length;
		const starts = [0];
		let at = perRow + 1;
		while (at < n) {
			starts.push(at);
			at += perRow;
		}
		return { rows: starts.length, rowStarts: starts, height: starts.length * FIT.rowBox };
	};

	it('measure, slice, measure ends in a few cycles and the result obeys the measurements it was cut from', () => {
		const lines = Array.from({ length: 14 }, (_, i) => line(i, 9 + ((i * 7) % 60)));
		const win = (i: number) => windowFor('letter', i === 0 ? TITLE : SUB, 90);
		const known = new Map<string, PieceMetrics>();
		let cycles = 0;
		let out = slicePages({ lines, metricsOf: (k) => known.get(k), windowOf: win, fit: FIT });
		while (out.unmeasured.length > 0) {
			cycles++;
			for (const piece of out.unmeasured) known.set(pieceKey(piece), oracle(8)(piece));
			out = slicePages({ lines, metricsOf: (k) => known.get(k), windowOf: win, fit: FIT });
			expect(cycles).toBeLessThanOrEqual(6);
		}
		expect(cycles).toBeGreaterThan(0);
		expectFit(out.pages, win, (l) => known.get(pieceKey(l)) ?? oracle(8)(l));
	});

	it('once nothing is unmeasured the slice is a fixed point: slicing again changes nothing', () => {
		const lines = Array.from({ length: 12 }, (_, i) => line(i, 5 + i * 4));
		const win = (i: number) => windowFor('letter', i === 0 ? TITLE : SUB, 90);
		const a = sliceMeasured(lines, oracle(8), win);
		const b = sliceMeasured(lines, oracle(8), win);
		expect(JSON.stringify(a)).toBe(JSON.stringify(b));
	});

	it('before any measurement it still slices, by the estimate, and lists every line as unmeasured', () => {
		const lines = Array.from({ length: 12 }, (_, i) => line(i, 4));
		const out = slicePages({ lines, metricsOf: () => undefined, windowOf: (i) => windowFor('letter', i === 0 ? TITLE : SUB, 90), fit: FALLBACK_FIT });
		expect(out.pages.length).toBeGreaterThan(0);
		expect(out.unmeasured.map((u) => u.lineNumber)).toEqual(lines.map((l) => l.lineNumber));
	});

	it('no lines is one empty page', () => {
		const out = slicePages({ lines: [], metricsOf: () => undefined, windowOf: () => 700, fit: FIT });
		expect(out.pages).toHaveLength(1);
		expect(out.pages[0].lines).toEqual([]);
		expect(out.unmeasured).toEqual([]);
	});
});

describe('the pages take the fit from the measurement, not from constants (a guard against restoring them)', () => {
	const paper = read('./components/Paper/Paper.svelte');
	const title = read('./components/Paper/TitlePage.svelte');
	const next = read('./components/Paper/SubsequentPage.svelte');
	const config = read('./page-config.ts');

	it('the page components hold no footer constant, row constant, or fixed gap', () => {
		for (const [name, src] of [['TitlePage', title], ['SubsequentPage', next]] as const) {
			expect(src, name).not.toContain('FOOTER_MAX_HEIGHT');
			expect(src, name).not.toContain('subsequentRowGap');
			expect(src, name).not.toContain('rowConfig');
			expect(src, name).not.toContain('onbudgetchange');
		}
	});

	it('Paper reserves the footer from one measurement over the whole document, floored at the old constant', () => {
		expect(paper).toContain('Math.max(FOOTER_MAX_HEIGHT, footerMeasured)');
		expect(paper).toContain('buildProvenanceLegend(lines, language, spotReconstitution)');
		expect(paper).toContain('richterCredit={wholeCredit}');
		expect(paper).toContain('MAX_MEASURE_CYCLES');
		// the real footers are not what is measured: no page passes onheightchange to its footer
		expect(title).not.toMatch(/<PageFooter[^>]*onheightchange/);
		expect(next).not.toMatch(/<PageFooter[^>]*onheightchange/);
	});

	it('the estimate and its budget are gone from page-config, and the probe is never display: none', () => {
		for (const gone of ['LINES_PER_PAGE', 'WORDS_PER_ROW', 'rowsOf', 'sliceLinesToPages']) expect(config).not.toMatch(new RegExp(`export (const|function) ${gone}`));
		const probe = read('./components/Paper/TextFitProbe.svelte');
		const css = probe.slice(probe.indexOf('<style>'));
		const screenRules = css.slice(0, css.indexOf('@media print'));
		expect(screenRules).not.toMatch(/display:\s*none/);
		expect(probe).toContain('visibility: hidden');
		expect(probe).toContain('document.fonts?.ready');
	});

	it('every page takes its window from `contentTop` and `contentBottom`, and its gap from the fit', () => {
		for (const src of [title, next]) {
			expect(src).toContain('--row-gap: {rowGap}px');
			expect(src).toContain('top: {contentTop}px; bottom: {contentBottom}px');
		}
	});
});
