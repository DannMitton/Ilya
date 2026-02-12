/**
 * Paper Manager — page distribution, overflow logic, and provenance legend.
 *
 * Distributes verse lines across paginated pages following
 * the WYSIWYG Paper architecture. Title page (page 1) holds
 * 10 lines (fallback 9), subsequent pages hold 12 (fallback 11).
 * Row budgets assume worst-case VERIFY-height stacks, so pages
 * with normal rows receive generous negative space.
 */

import type { LineData, Page, PageSize, LegendItem } from './types';

/** Maximum verse lines per template before overflow fallback. */
const TITLE_MAX = 10;
const TITLE_FALLBACK = 9;
const SUBSEQUENT_MAX = 12;
const SUBSEQUENT_FALLBACK = 11;

/**
 * Display order for provenance legend entries.
 * Matches the icon table in the Phase 3 design spec.
 */
const LEGEND_ORDER: string[] = [
	'user-dictionary',
	'user-composer',
	'user-override',
	'yo',
	'inferred',
];

/**
 * Distribute lines across pages.
 * Returns an array of Page objects with lines assigned.
 */
export function distributeLinesToPages(
	lines: LineData[],
	_pageSize: PageSize
): Page[] {
	if (lines.length === 0) return [];

	const pages: Page[] = [];
	let cursor = 0;

	// Page 1 — title template
	const titleLines = lines.slice(cursor, cursor + TITLE_MAX);
	pages.push({
		pageIndex: 0,
		template: 'title',
		lines: titleLines,
		maxLines: TITLE_MAX,
		fallbackLines: TITLE_FALLBACK,
	});
	cursor += titleLines.length;

	// Subsequent pages
	while (cursor < lines.length) {
		const pageLines = lines.slice(cursor, cursor + SUBSEQUENT_MAX);
		pages.push({
			pageIndex: pages.length,
			template: 'subsequent',
			lines: pageLines,
			maxLines: SUBSEQUENT_MAX,
			fallbackLines: SUBSEQUENT_FALLBACK,
		});
		cursor += pageLines.length;
	}

	return pages;
}

/**
 * Check if a page container's content overflows into the footer.
 * Call after DOM render using $effect + untrack().
 */
export function checkOverflow(container: HTMLElement): boolean {
	const contentArea = container.querySelector('.page-content');
	const footer = container.querySelector('.page-footer');
	if (!contentArea || !footer) return false;

	const contentRect = contentArea.getBoundingClientRect();
	const footerRect = footer.getBoundingClientRect();

	return contentRect.bottom > footerRect.top;
}

/**
 * Format the running header for subsequent pages.
 * Returns "SURNAME — TITLE" with the surname extracted
 * from the composer field (last word before comma, or full string).
 */
export function formatRunningHeader(
	composer: string,
	title: string
): string {
	if (!composer && !title) return '';

	// Extract surname: last word, or text before first comma
	let surname = composer.trim();
	if (surname.includes(',')) {
		surname = surname.split(',')[0].trim();
	} else {
		const parts = surname.split(/\s+/);
		surname = parts[parts.length - 1] || '';
	}

	if (!surname && !title) return '';
	if (!surname) return title;
	if (!title) return surname.toUpperCase();

	return `${surname.toUpperCase()} \u2014 ${title}`;
}

/**
 * Build the contextual provenance legend for a single page.
 *
 * Scans all words on the page for non-standard stress sources
 * (anything other than dictionary, supplement, or clitic).
 * Returns legend items in fixed display order. If no special
 * provenance appears on the page, returns an empty array and
 * the footer omits the legend entirely.
 *
 * yo-rule and yo-restored are collapsed into a single "yo" entry.
 */
export function buildProvenanceLegend(lines: LineData[]): LegendItem[] {
	const sources = new Set<string>();

	for (const line of lines) {
		for (const word of line.words) {
			const s = word.stressSource;
			if (s === 'user-dictionary' || s === 'user-composer' || s === 'user-override') {
				sources.add(s);
			} else if (s === 'yo-rule' || s === 'yo-restored') {
				sources.add('yo');
			} else if (s === 'inferred') {
				sources.add(s);
			}
		}
	}

	return LEGEND_ORDER
		.filter((s) => sources.has(s))
		.map((s) => ({ source: s, labelKey: `legend.${s}` }));
}
