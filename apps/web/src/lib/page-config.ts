/**
 * Page layout configuration for the layered page model.
 *
 * Pure constants and arithmetic. No DOM measurement, no overflow detection,
 * no fallback logic. The page is a fixed-size box with absolutely positioned
 * header, content, and footer layers.
 *
 * Content rows use min-height in a flex column. If a line wraps, it grows
 * and the next row starts below it. Page slicing budgets wide lines
 * (>7 display words) as 2 slots to prevent 11-row pages.
 */

import type { LineData } from './types';

// ── Page dimensions (px at 96dpi) ────────────────────────────────

export const PAGE_SIZES = {
	letter: { width: 816, height: 1056 },
	a4: { width: 794, height: 1123 },
} as const;

// ── Layout constants ─────────────────────────────────────────────

export const MARGINS = { vertical: 48, horizontal: 96 } as const;

/** Gap between header/content and content/footer layers (px). */
export const GAP = 8;

/**
 * Space between a header's horizontal rule and the first line of body text.
 *
 * ONE number, used by BOTH the title page and every subsequent page, because
 * Dann's requirement is that the negative space under the rule be identical
 * on every page. It is identical by construction, not by tuning: both header
 * components END at their rule (nothing renders below it), both report their
 * own measured offsetHeight, and both pages set
 *     contentTop = MARGINS.vertical + measuredHeaderHeight + HEADER_GAP
 * so the space below the rule IS this number on every page.
 *
 * It replaces TitlePage's local TITLE_HEADER_GAP of 18 and the pairing of
 * HEADER_HEIGHTS.subsequent (a hardcoded 37 nobody measured) with GAP of 8,
 * which produced two different visible gaps and could not be made to agree.
 */
export const HEADER_GAP = 16;

/**
 * Header heights MEASURED AT LETTER WIDTH (816px), in headless Chromium with
 * Source Sans 3 and Source Serif 4 loaded, 2026-08-15.
 *
 * These exist because a live bind:offsetHeight is taken at whatever width the
 * page happens to be on screen. On a phone .paper-page is 100% wide, the song
 * title wraps to a second line, and the header measures about 40px too tall.
 * Print is ALWAYS 816px. So below the mobile breakpoint the pages use these
 * numbers instead of the live measurement.
 *
 * Both header components END at their rule (it is the last child, nothing
 * renders below it), verified in the same run: title rule bottom 127.38 of a
 * 127px box, running rule bottom 29.0 of a 29px box. That is what makes
 *     visible gap = contentTop - (MARGINS.vertical + headerHeight)
 * exactly HEADER_GAP on every page.
 *
 * Check against the spacing Dann approved on page two:
 *   old page two contentTop = 48 + 37 + 8 = 93; rule at 48 + 29 = 77; gap 16.
 *   new page two contentTop = 48 + 29 + 16 = 93. IDENTICAL, by arithmetic.
 *   new page one contentTop = 48 + 127 + 16 = 191; rule at 175; gap 16.
 *
 * NOT the same as HEADER_HEIGHTS above, which stays untouched because
 * MarkupPane depends on those values.
 */
export const HEADER_HEIGHTS_AT_LETTER = {
	title: 127,
	subsequent: 29,
} as const;

// ── Calibrated constants ─────────────────────────────────────────

/** Header heights (px). Subsequent page uses fixed value. Title page measures dynamically via bind:offsetHeight. */
export const HEADER_HEIGHTS = {
	title: 135,
	subsequent: 37,
} as const;

/** Maximum footer height with text-wrap allowance (px). */
export const FOOTER_MAX_HEIGHT = 80;

/** Gap between verse rows (px). Used as baseline for title page. */
export const ROW_GAP = 20;

/**
 * Minimum row height (px).
 * Normal rows render at this height. Wrapping rows grow beyond it
 * naturally via flex layout; the next row starts below.
 */
export const ROW_HEIGHT = 56;

/** Row-slot budget per page. */
export const LINES_PER_PAGE = 10;

// ── Page slicing ─────────────────────────────────────────────────

/** Cyrillic character test (with `w.latin`, matches VerseLine's display filter). */
const CYRILLIC_RE = /[А-Яа-яЁё]/;

/**
 * The words a printed row holds, for the budget: the threshold this file has always used ("more than 7 display
 * words" wraps). Checked 2026-10-12 (QUEUE row 79) on the Tchaikovsky song, whose poem reaches Text as one line of
 * 95 words: it drew about twelve rows at desktop width, seven or eight words a row, so seven is the safe side.
 */
export const WORDS_PER_ROW = 7;

/** The words a line shows (with `w.latin`, VerseLine's display filter). */
function displayed(line: LineData): number {
	return line.words.filter((w) => w.latin || CYRILLIC_RE.test(w.cyrillic || '')).length;
}

/** A line's rows on the page, estimated: a row per `WORDS_PER_ROW` words, at least one. */
export function rowsOf(line: LineData): number {
	return Math.max(1, Math.ceil(displayed(line) / WORDS_PER_ROW));
}

/**
 * The line cut after its first `rows` rows: the words up to that many displayed words, never leaving a proclitic
 * at the end of the first part, since it leans on the word after it. Both parts keep the line's number; every word
 * carries its own `lineIndex` and `wordIndex`, so a click on either part finds its word.
 */
function cutAfterRows(line: LineData, rows: number): [LineData, LineData] {
	let shown = 0;
	let at = line.words.length;
	for (let i = 0; i < line.words.length; i++) {
		const w = line.words[i];
		if (w.latin || CYRILLIC_RE.test(w.cyrillic || '')) {
			if (shown === rows * WORDS_PER_ROW) { at = i; break; }
			shown++;
		}
	}
	while (at > 1 && line.words[at - 1].isProclitic) at--;
	const { endsStanza, ...rest } = line;
	return [{ ...rest, words: line.words.slice(0, at) }, { ...line, words: line.words.slice(at) }];
}

/**
 * Slice an array of verse lines into pages.
 *
 * Each page fills up to its budget in rows. A line costs its estimated rows (`rowsOf`).
 *
 * NO EMPTY SPACE MID-DOCUMENT (QUEUE row 79; Dann 2026-10-11 21:50, `PRODUCT.md` rule 2): a stanza is a paragraph
 * (DESK DEFAULT), so a line that does not fit breaks between its rows, leaving at least two rows on each page; a
 * line that would leave fewer moves whole to the next page. Before row 79 a line cost at most two rows, so a poem
 * that reaches Text as one long line (a score's underlay) printed as one page and ran off it.
 *
 * @param lines - All verse lines to paginate
 * @param page1Budget - Row-slot budget for the first page (default: LINES_PER_PAGE).
 *   TitlePage computes this from its measured header height and passes it
 *   via Paper's reactive callback chain.
 *
 * - 0 lines → one empty page (for the empty state title page)
 */
export function sliceLinesToPages(lines: LineData[], page1Budget: number = LINES_PER_PAGE): LineData[][] {
	if (lines.length === 0) {
		return [[]];
	}

	const pages: LineData[][] = [];
	let currentPage: LineData[] = [];
	let currentUnits = 0;
	const budget = () => (pages.length === 0 ? page1Budget : LINES_PER_PAGE);
	const turn = () => {
		pages.push(currentPage);
		currentPage = [];
		currentUnits = 0;
	};

	const queue = [...lines];
	while (queue.length > 0) {
		const line = queue.shift()!;
		const cost = rowsOf(line);
		const room = budget() - currentUnits;
		if (cost <= room || currentPage.length === 0 && cost <= budget()) {
			currentPage.push(line);
			currentUnits += cost;
		} else if (room >= 2 && cost - room >= 2) {
			const [head, tail] = cutAfterRows(line, room);
			currentPage.push(head);
			turn();
			queue.unshift(tail);
		} else if (currentPage.length === 0) {
			// Longer than a whole page on an empty page: it must break here.
			const [head, tail] = cutAfterRows(line, Math.max(2, Math.min(budget(), cost - 2)));
			currentPage.push(head);
			turn();
			queue.unshift(tail);
		} else {
			turn();
			queue.unshift(line);
		}
	}

	if (currentPage.length > 0) pages.push(currentPage);
	return pages;
}

// ── Running header ───────────────────────────────────────────────

/**
 * Extract a surname from a display name string.
 *
 * - Strips parenthesized content (dates, birth/death years)
 * - If name contains a comma, text before the comma is the surname
 * - Otherwise, the last word is the surname
 * - Returns uppercase
 */
export function extractSurname(name: string): string {
	const stripped = name.replace(/\s*\([^)]*\)/g, '').trim();

	if (stripped.includes(',')) {
		return stripped.split(',')[0].trim().toUpperCase();
	}

	const parts = stripped.split(/\s+/);
	return parts[parts.length - 1].toUpperCase();
}

/**
 * Format a running header string for subsequent pages.
 *
 * Returns "COMPOSER SURNAME | POET SURNAME | TITLE" in uppercase: one pipe joins every part, since no
 * em dash is shown to the singer (`AGENTS.md`; the pipe, Dann 2026-10-11 22:00, QUEUE row 78a).
 * Poet omitted if empty. Composer omitted if empty.
 * If title is empty, returns empty string.
 */
export function formatRunningHeader(composer: string, title: string, poet?: string): string {
	if (!title.trim()) {
		return '';
	}

	const titleUpper = title.trim().toUpperCase();

	const nameParts: string[] = [];
	if (composer.trim()) {
		nameParts.push(extractSurname(composer));
	}
	if (poet && poet.trim()) {
		nameParts.push(extractSurname(poet));
	}

	if (nameParts.length === 0) {
		return titleUpper;
	}

	return `${nameParts.join(' | ')} | ${titleUpper}`;
}
