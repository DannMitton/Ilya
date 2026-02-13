/**
 * Page layout configuration for the layered page model.
 *
 * Pure constants and arithmetic. No DOM measurement, no overflow detection,
 * no fallback logic. The page is a fixed-size box with absolutely positioned
 * header, content, and footer layers.
 *
 * Constants begin as provisional estimates and are calibrated empirically
 * after building PageFooter, TitleHeader, and RunningHeader (Step 4).
 */

import type { LineData, PageSize } from './types';

// ── Page dimensions (px at 96dpi) ────────────────────────────────

export const PAGE_SIZES = {
	letter: { width: 816, height: 1056 },
	a4: { width: 794, height: 1123 },
} as const;

export type { PageSize };

// ── Layout constants ─────────────────────────────────────────────

export const MARGINS = { vertical: 48, horizontal: 96 } as const;

/** Gap between header/content and content/footer layers (px). */
export const GAP = 8;

// ── Calibrated constants ─────────────────────────────────────────

/** Header heights (px). Title = logo + title + metadata + rule. Subsequent = running header + underline + breathing room. */
export const HEADER_HEIGHTS = {
	title: 110,
	subsequent: 50,
} as const;

/** Maximum footer height with text-wrap allowance (px). */
export const FOOTER_MAX_HEIGHT = 80;

/** Gap between verse rows (px). Generous spacing prevents VERIFY boxes from crowding adjacent rows. */
export const ROW_GAP = 12;

/**
 * Universal row height (px).
 * Derived from the tightest constraint: Letter subsequent page.
 * Available = 1056 - 48 - 48 - 50 - 80 - 16 = 814px.
 * 12 rows at 56px + 11 gaps at 12px = 672 + 132 = 804px. Buffer = 10px.
 * All four template/size combinations pass the ≥10px quality gate.
 */
export const ROW_HEIGHT = 56;

/** Row capacity per page template. */
export const ROW_COUNTS = {
	title: 10,
	subsequent: 12,
} as const;

// ── Page slicing ─────────────────────────────────────────────────

/**
 * Slice an array of verse lines into pages.
 *
 * - 0 lines → one empty page (for the empty state title page)
 * - First 10 lines → page 1 (title page)
 * - Every subsequent 12 lines → next page
 *
 * Pure arithmetic. No measurement, no adjustment.
 */
export function sliceLinesToPages(lines: LineData[]): LineData[][] {
	if (lines.length === 0) {
		return [[]];
	}

	const pages: LineData[][] = [];

	// Page 1: up to ROW_COUNTS.title lines
	const titleSlice = lines.slice(0, ROW_COUNTS.title);
	pages.push(titleSlice);

	// Subsequent pages: ROW_COUNTS.subsequent lines each
	let offset = ROW_COUNTS.title;
	while (offset < lines.length) {
		const subsequentSlice = lines.slice(offset, offset + ROW_COUNTS.subsequent);
		pages.push(subsequentSlice);
		offset += ROW_COUNTS.subsequent;
	}

	return pages;
}

// ── Running header ───────────────────────────────────────────────

/**
 * Format a running header string for subsequent pages.
 *
 * - Strips parenthesized dates: "Dmitri Shostakovich (1906–1975)" → "Dmitri Shostakovich"
 * - If composer contains a comma, text before the comma is the surname
 * - Otherwise, the last word is the surname
 * - Returns "SURNAME — TITLE" in uppercase
 * - If composer is empty, returns title only in uppercase
 * - If title is empty, returns empty string
 */
export function formatRunningHeader(composer: string, title: string): string {
	if (!title.trim()) {
		return '';
	}

	const titleUpper = title.trim().toUpperCase();

	if (!composer.trim()) {
		return titleUpper;
	}

	// Strip parenthesized content (dates, birth/death years)
	const stripped = composer.replace(/\s*\([^)]*\)/g, '').trim();

	let surname: string;

	if (stripped.includes(',')) {
		// "Shostakovich, Dmitri" → surname is before the comma
		surname = stripped.split(',')[0].trim();
	} else {
		// "Dmitri Shostakovich" → surname is the last word
		const parts = stripped.split(/\s+/);
		surname = parts[parts.length - 1];
	}

	return `${surname.toUpperCase()} \u2014 ${titleUpper}`;
}
