/**
 * page-fit.ts: how Text's pages are cut, from heights the page measured, never from heights it assumed
 * (poem library, build 1, step 7, part 1; brief `docs/sessions/brief-code-poem-library-build1-step7_r4_2026-11-03.md`,
 * with Fable's two reviews of it).
 *
 * PURE. Lines and measurements in, pages out. Nothing here reads the DOM, so every case below is a unit test with
 * synthetic heights, for Letter and for A4. The DOM side is `components/Paper/TextFitProbe.svelte`, which renders what
 * is asked of it and reads back the numbers this file consumes, and `Paper.svelte`, which joins the two.
 *
 * WHY A MEASURED HEIGHT AND NOT A CONSTANT. Text's page 1 ran 7.4 px into its footer on the Tchaikovsky song once the
 * library filled its poem (step 6). Measured in a browser on 2026-11-03 (the desk's probe, and Code's, on `e4105a84`
 * and after), the page was drawing four things that its arithmetic took as constants:
 *   1. the content window's `padding-top` of 4 px was not subtracted from the window the rows were sized into, and the
 *      gap was rounded up, so ten rows needed 735 px of a 729 px window (6 px over; the ink's 1.4 px made it 7.4);
 *   2. each `.verse-row` draws 56.3 px, not the 56 of `ROW_HEIGHT`;
 *   3. each row's lowest child box reaches 1.1 px below its row box (the "overhang");
 *   4. the footer is 90 px, not the 80 of `FOOTER_MAX_HEIGHT`, as soon as a provenance legend («ё stress») stands in it,
 *      so the legend's top (918 px) sat above the content window's bottom edge (920 px).
 * Taking those from the page, and passing them in as data, is the fix; restoring any of them as a constant brings the
 * overrun back. The same rule was applied to the marked score's footer by N.83 (`markup/MarkupPane.svelte`, the
 * `Math.max(FOOTER_MAX_HEIGHT, footerHeight)` reserve), so this is the second instance of a rule, not a special case.
 *
 * THE 8 px `GAP` (`page-config.ts`) INSIDE THE WINDOW'S BOTTOM MARGIN IS WHAT KEEPS THE DASHED "VERIFY" BOX OFF THE
 * FOOTER. That box is a pseudo-element about 5 px below its word (`WordStack.svelte`), which no
 * `getBoundingClientRect` sees, so the overhang here does not count it. Do not spend the `GAP`.
 *
 * DANN'S LAYOUT STANDS (2026-02-20, `46829627`, "flex-column page layout resolves word stack collision"): a row grows
 * with its wrap under a hanging indent and pushes the next row down, so words never collide. His rule stands too: try
 * ten rows, drop to nine or eight when the gap falls below 18 px (`fitRows`). Unchanged by this file: the footer's own
 * design, the 18 px minimum gap, the rule that no page but the last is left with an empty band (`PRODUCT.md` rule 2),
 * and that a cut leaves at least two rows on each side.
 */
import { PAGE_SIZES, TEXT_CONTENT } from './page-config';
import type { LineData, WordStackData } from './types';

/** The most rows a page is tried with, and the fewest. */
export const MAX_ROWS = 10;
export const MIN_ROWS = 8;
/** The gap between rows: at least this (below it the page drops a row), at most this (a short page does not spread). */
export const MIN_GAP = 18;
export const MAX_GAP = 28;
/** Words a printed row is guessed to hold, used ONLY until the first measurement of a line arrives (`estimateMetrics`). */
export const ESTIMATED_WORDS_PER_ROW = 7;

/**
 * The numbers the page measures about itself. `FALLBACK_FIT` is what the desk measured on 2026-11-03 and stands in only
 * until the first measurement lands, so a page is never blank.
 */
export interface FitMetrics {
	/** One row's drawn height (px), measured on a one-row line. */
	rowBox: number;
	/** How far a row's lowest child box reaches below its row box (px). */
	overhang: number;
	/** The content window's own `padding-top` (px), which is inside the window. */
	padTop: number;
}
export const FALLBACK_FIT: FitMetrics = { rowBox: 56.3, overhang: 1.1, padTop: TEXT_CONTENT.padTop };

/** What a probe measured about one line, at a row gap of 0 (so it does not depend on the page the line lands on). */
export interface PieceMetrics {
	/** Visual rows the line wraps to at the content width. */
	rows: number;
	/** The index, among the line's DISPLAYED words, of the first word of each visual row; `rowStarts[0]` is 0. */
	rowStarts: number[];
	/** The line's height at a row gap of 0 (px). */
	height: number;
}

// ── Words and keys ───────────────────────────────────────────────

const CYRILLIC_RE = /[А-Яа-яЁё]/;

/** The words a line shows: `VerseLine`'s own filter (Cyrillic words, and Latin words, `latin.ts`). */
export function displayedWords(line: LineData): WordStackData[] {
	return line.words.filter((w) => w.latin || CYRILLIC_RE.test(w.cyrillic || ''));
}

/** A line (or a part of one) by what it holds: its number and its first and last word. Stable across a re-slice. */
export function pieceKey(line: LineData): string {
	const first = line.words[0];
	const last = line.words[line.words.length - 1];
	return first ? `${line.lineNumber}:${first.wordIndex}-${last.wordIndex}:${line.words.length}` : `${line.lineNumber}:empty`;
}

/** A guess, for a line nobody has measured yet: a row per `ESTIMATED_WORDS_PER_ROW` words. Replaced by a measurement. */
export function estimateMetrics(line: LineData, fit: FitMetrics): PieceMetrics {
	const n = displayedWords(line).length;
	const rows = Math.max(1, Math.ceil(n / ESTIMATED_WORDS_PER_ROW));
	return { rows, rowStarts: Array.from({ length: rows }, (_, i) => i * ESTIMATED_WORDS_PER_ROW), height: rows * fit.rowBox };
}

// ── One page's rows and gap ──────────────────────────────────────

/**
 * Rows and gap for a content window of `windowHeight` px (the window's whole height, padding included).
 *
 * Ten rows first: the gap that spreads them evenly through what the window holds after its padding and the rows'
 * overhang. Below 18 px the page drops to nine rows, then eight. The gap is FLOORED, never rounded, so the sum never
 * exceeds the window, and capped at 28 so a short page does not spread. One function for every page (page 1 and the
 * later pages differ only in their header's height), so the pages cannot drift apart again.
 */
export function fitRows(windowHeight: number, fit: FitMetrics): { rows: number; gap: number } {
	const room = windowHeight - fit.padTop - fit.overhang;
	let rows = MAX_ROWS;
	let gap = (room - rows * fit.rowBox) / (rows - 1);
	while (gap < MIN_GAP && rows > MIN_ROWS) {
		rows -= 1;
		gap = (room - rows * fit.rowBox) / (rows - 1);
	}
	return { rows, gap: Math.max(0, Math.min(Math.floor(gap), MAX_GAP)) };
}

/** The height a page's content needs: its rows' heights, the gaps between them, the padding, and the overhang. */
export function contentHeight(sumHeight: number, rows: number, gap: number, fit: FitMetrics): number {
	return sumHeight + Math.max(0, rows - 1) * gap + fit.padTop + fit.overhang;
}

// ── Cutting a line ───────────────────────────────────────────────

/**
 * The line cut before its `displayedIndex`-th displayed word, never leaving a proclitic at the end of the first part,
 * since it leans on the word after it. Both parts keep the line's number; every word carries its own `lineIndex` and
 * `wordIndex`, so a click on either part finds its word.
 */
function cutBefore(line: LineData, displayedIndex: number): [LineData, LineData] {
	let shown = 0;
	let at = line.words.length;
	for (let i = 0; i < line.words.length; i++) {
		const w = line.words[i];
		if (w.latin || CYRILLIC_RE.test(w.cyrillic || '')) {
			if (shown === displayedIndex) {
				at = i;
				break;
			}
			shown++;
		}
	}
	while (at > 1 && line.words[at - 1].isProclitic) at--;
	const { endsStanza, ...rest } = line;
	return [{ ...rest, words: line.words.slice(0, at) }, { ...line, words: line.words.slice(at) }];
}

// ── Slicing ──────────────────────────────────────────────────────

export interface SliceInput {
	lines: LineData[];
	/** What the probe measured for a piece, by `pieceKey`; undefined where it has not. */
	metricsOf: (key: string) => PieceMetrics | undefined;
	/** The content window's height (px) for page `index` (0 is the title page): its header and the footer reserve decide it. */
	windowOf: (index: number) => number;
	fit: FitMetrics;
}

export interface SlicedPage {
	lines: LineData[];
	/** The visual rows on the page. */
	rows: number;
	/** The page's rows' capacity, and the gap `fitRows` gave it. */
	capacity: number;
	gap: number;
}

/**
 * Slice the lines into pages.
 *
 * A page holds up to `capacity` visual rows (`fitRows`) AND must fit its window by the measured heights. A line costs the
 * rows it wraps to. A stanza is a paragraph (DESK DEFAULT, row 79): a line that does not fit breaks BETWEEN its rows, at
 * a point where the browser itself wrapped it, leaving at least two rows on each page; a line that would leave fewer
 * moves whole to the next page. A cut tail is looked up by its own key, because a tail's first row is wider than a
 * continuation row and may wrap to fewer rows than were left.
 *
 * `unmeasured` lists every piece it had to guess (a whole line, or a tail, nobody has measured): the caller measures them
 * and slices again. Once none is left the slice is exact; it is a fixed point, so the loop ends.
 *
 * - 0 lines gives one empty page (the empty state's title page).
 */
export function slicePages(input: SliceInput): { pages: SlicedPage[]; unmeasured: LineData[] } {
	const { lines, metricsOf, windowOf, fit } = input;
	if (lines.length === 0) {
		const { rows, gap } = fitRows(windowOf(0), fit);
		return { pages: [{ lines: [], rows: 0, capacity: rows, gap }], unmeasured: [] };
	}

	const pages: SlicedPage[] = [];
	const unmeasured = new Map<string, LineData>();
	let page: LineData[] = [];
	let rows = 0;
	let sum = 0;
	let spec = fitRows(windowOf(0), fit);

	const fitsRows = (extraRows: number, extraHeight: number) =>
		rows + extraRows <= spec.rows && contentHeight(sum + extraHeight, rows + extraRows, spec.gap, fit) <= windowOf(pages.length);
	/** The most rows of a piece (at `per` px each) that still fit on this page, up to `max`. */
	const rowsThatFit = (max: number, per: number) => {
		let k = 0;
		while (k < max && fitsRows(k + 1, (k + 1) * per)) k++;
		return k;
	};
	const turn = () => {
		pages.push({ lines: page, rows, capacity: spec.rows, gap: spec.gap });
		page = [];
		rows = 0;
		sum = 0;
		spec = fitRows(windowOf(pages.length), fit);
	};

	const queue = [...lines];
	while (queue.length > 0) {
		const line = queue.shift()!;
		const key = pieceKey(line);
		let m = metricsOf(key);
		if (!m) {
			unmeasured.set(key, line);
			m = estimateMetrics(line, fit);
		}
		const per = m.height / m.rows;

		if (fitsRows(m.rows, m.height)) {
			page.push(line);
			rows += m.rows;
			sum += m.height;
			continue;
		}
		const k = rowsThatFit(m.rows, per);
		if (k >= 2 && m.rows - k >= 2) {
			const [head, tail] = cutBefore(line, m.rowStarts[k]);
			page.push(head);
			rows += k;
			sum += k * per;
			turn();
			queue.unshift(tail);
		} else if (page.length === 0) {
			// Longer than a whole page on an empty page: it must break here, at two rows or more on each side.
			const cutRows = Math.max(2, Math.min(k, m.rows - 2));
			if (cutRows >= m.rows) {
				// A line of fewer than three rows that does not fit an empty page (a window too small to hold it): it stands alone.
				page.push(line);
				rows += m.rows;
				sum += m.height;
				turn();
				continue;
			}
			const [head, tail] = cutBefore(line, m.rowStarts[cutRows]);
			page.push(head);
			rows += cutRows;
			sum += cutRows * per;
			turn();
			queue.unshift(tail);
		} else {
			turn();
			queue.unshift(line);
		}
	}
	if (page.length > 0) pages.push({ lines: page, rows, capacity: spec.rows, gap: spec.gap });
	return { pages, unmeasured: [...unmeasured.values()] };
}

/** The content window's height (px) for a page: the sheet less its header and the footer's reserve. */
export function windowHeight(pageSize: keyof typeof PAGE_SIZES, top: number, bottom: number): number {
	return PAGE_SIZES[pageSize].height - top - bottom;
}
