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

/** Header heights (px). Controls content origin below rule. Matched so rule-to-content gap is visually equal (~20px) on both page templates. */
export const HEADER_HEIGHTS = {
	title: 135,
	subsequent: 37,
} as const;

/** Maximum footer height with text-wrap allowance (px). */
export const FOOTER_MAX_HEIGHT = 80;

/** Gap between verse rows (px). */
export const ROW_GAP = 20;

/**
 * Universal row height (px).
 * Content layer uses overflow: visible; rows render independently of
 * header/footer layers. HEADER_HEIGHTS controls vertical positioning
 * of the content origin, not a hard boundary.
 */
export const ROW_HEIGHT = 56;

/** Row capacity per page template. */
export const ROW_COUNTS = {
	title: 10,
	subsequent: 10,
} as const;

// ── Page slicing ─────────────────────────────────────────────────

/**
 * Slice an array of verse lines into pages.
 *
 * - 0 lines → one empty page (for the empty state title page)
 * - First 10 lines → page 1 (title page)
 * - Every subsequent 10 lines → next page
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
