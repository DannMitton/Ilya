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
import { t, type Language } from './i18n';

/** Maximum verse lines per template before overflow fallback. */
const TITLE_MAX = 10;
const TITLE_FALLBACK = 9;
const SUBSEQUENT_MAX = 12;
const SUBSEQUENT_FALLBACK = 11;

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

/** Fixed order for legend items. */
const LEGEND_ORDER: LegendItem['type'][] = [
	'user-dictionary',
	'user-composer',
	'user-override',
	'yo',
	'inferred',
	'spot-reconstitution',
];

/**
 * Build a provenance legend for a single page.
 * Scans all words on the page and returns legend items (pre-translated)
 * for any non-standard stress sources present, in a fixed display order.
 * Omitted entirely when a page has only dictionary/supplement stress.
 *
 * The optional spotReconstitution map flags words with per-word
 * reconstitution active; when any such word appears on the page,
 * a "Spot reconstitution" legend entry is included.
 */
export function buildProvenanceLegend(
	lines: LineData[],
	language: Language,
	spotReconstitution?: Map<string, boolean>
): LegendItem[] {
	const seen = new Set<LegendItem['type']>();

	for (const line of lines) {
		for (const word of line.words) {
			const src = word.stressSource;

			// Map stress sources to legend types
			switch (src) {
				case 'user-dictionary':
					seen.add('user-dictionary');
					break;
				case 'user-composer':
					seen.add('user-composer');
					break;
				case 'user-override':
					seen.add('user-override');
					break;
				case 'yo-rule':
				case 'yo-restored':
					seen.add('yo');
					break;
				case 'inferred':
					seen.add('inferred');
					break;
				// dictionary, supplement, clitic: no legend entry
			}

			// Check for spot reconstitution on this word
			if (spotReconstitution) {
				const key = `${word.lineIndex}-${word.wordIndex}`;
				if (spotReconstitution.has(key)) {
					seen.add('spot-reconstitution');
				}
			}
		}
	}

	if (seen.size === 0) return [];

	// Return items in fixed order with translated labels
	return LEGEND_ORDER
		.filter(type => seen.has(type))
		.map(type => ({
			type,
			label: t(`legend.${type}`, language),
		}));
}
