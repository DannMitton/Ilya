/**
 * Provenance icon logic, legend building, and per-page filtering.
 *
 * Separated from page-config because provenance is a content concern,
 * not a layout concern. Icons signal departures from normal operation.
 * Their sparing use is the point.
 */

import type { LineData } from './types';
import type { Language } from './i18n';
import { t } from './i18n';

// ── Legend item ───────────────────────────────────────────────────

export interface LegendItem {
	/** The provenance type key (e.g. 'yo-rule', 'inferred'). */
	type: string;
	/** Display icon: SVG reference key or text character. */
	icon: string;
	/** Bilingual label for the legend. */
	label: string;
}

// ── Display predicate ────────────────────────────────────────────

/**
 * Determine whether a provenance icon should be shown for a given stress source.
 *
 * Returns false for 'dictionary' and 'supplement' (normal operation, no icon).
 * Returns true for all user-attributed and inferred sources.
 */
export function showProvenance(stressSource: string): boolean {
	switch (stressSource) {
		case 'dictionary':
		case 'supplement':
			return false;
		default:
			return true;
	}
}

// ── Stable display order ─────────────────────────────────────────

/**
 * Ordering for provenance types in the legend.
 * ё-rule first, then user types, then inferred last (the warning state).
 */
const LEGEND_ORDER: string[] = [
	'yo-rule',
	'yo-restored',
	'user-dictionary',
	'user-composer',
	'user-override',
	'inferred',
];

// ── Icon mapping ─────────────────────────────────────────────────

/**
 * Map provenance type to its icon identifier.
 * Components use this to render the appropriate SVG or text.
 */
const PROVENANCE_ICONS: Record<string, string> = {
	'yo-rule': 'ё',
	'yo-restored': 'ё',
	'user-dictionary': 'book',
	'user-composer': 'notes',
	'user-override': 'torso',
	'inferred': 'question',
};

// ── Legend i18n key mapping ───────────────────────────────────────

/**
 * Map provenance type to its i18n legend key.
 * yo-rule and yo-restored share the same legend entry.
 */
const LEGEND_KEYS: Record<string, string> = {
	'yo-rule': 'legend.yo',
	'yo-restored': 'legend.yo',
	'user-dictionary': 'legend.user-dictionary',
	'user-composer': 'legend.user-composer',
	'user-override': 'legend.user-override',
	'inferred': 'legend.inferred',
};

// ── Legend builder ────────────────────────────────────────────────

/**
 * Build a provenance legend for a single page's lines.
 *
 * 1. Scans all word stacks across the page's lines
 * 2. Collects unique provenance types that pass showProvenance()
 * 3. Maps each type to its icon and bilingual label
 * 4. Returns in stable display order (ё first, inferred last)
 * 5. Returns empty array if no special provenance exists (legend omitted)
 *
 * yo-rule and yo-restored are consolidated into a single legend entry.
 */
export function buildProvenanceLegend(lines: LineData[], language: Language): LegendItem[] {
	// Collect unique provenance types on this page
	const seen = new Set<string>();

	for (const line of lines) {
		for (const word of line.words) {
			if (showProvenance(word.stressSource)) {
				seen.add(word.stressSource);
			}
		}
	}

	if (seen.size === 0) {
		return [];
	}

	// Consolidate yo-rule and yo-restored into a single 'yo' display key
	// to avoid duplicate legend entries
	const displayKeys = new Set<string>();
	for (const source of seen) {
		if (source === 'yo-rule' || source === 'yo-restored') {
			displayKeys.add('yo-rule'); // Use yo-rule as canonical key for both
		} else {
			displayKeys.add(source);
		}
	}

	// Build legend items in stable order
	const items: LegendItem[] = [];

	for (const type of LEGEND_ORDER) {
		if (displayKeys.has(type)) {
			const legendKey = LEGEND_KEYS[type];
			if (legendKey) {
				items.push({
					type,
					icon: PROVENANCE_ICONS[type] || '',
					label: t(legendKey, language),
				});
			}
		}
	}

	return items;
}
