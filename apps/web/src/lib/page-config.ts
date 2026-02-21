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

/** Cyrillic character test (matches VerseLine's display filter). */
const CYRILLIC_RE = /[А-Яа-яЁё]/;

/**
 * Budget a line's slot cost: 1 for normal, 2 for wide lines
 * that will visually wrap in the flex layout.
 *
 * Simple word-count threshold. Lines with more than 7 Cyrillic
 * display words are budgeted as 2 slots.
 */
function slotCost(line: LineData): 1 | 2 {
	const displayWords = line.words.filter(
		w => CYRILLIC_RE.test(w.cyrillic || '')
	);
	return displayWords.length > 7 ? 2 : 1;
}

/**
 * Slice an array of verse lines into pages.
 *
 * Each page fills up to its budget in slots. A wide line (>7 display
 * words) costs 2 slots. All other lines cost 1.
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

	for (const line of lines) {
		const cost = slotCost(line);

		const currentBudget = pages.length === 0 ? page1Budget : LINES_PER_PAGE;
		if (currentUnits + cost > currentBudget && currentPage.length > 0) {
			pages.push(currentPage);
			currentPage = [line];
			currentUnits = cost;
		} else {
			currentPage.push(line);
			currentUnits += cost;
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
 * Returns "COMPOSER SURNAME | POET SURNAME — TITLE" in uppercase.
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

	return `${nameParts.join(' | ')} \u2014 ${titleUpper}`;
}
