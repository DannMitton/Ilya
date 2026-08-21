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
	/** The provenance type key (e.g. 'yo-restored', 'user-override'). */
	type: string;
	/** Display icon: SVG reference key or text character. */
	icon: string;
	/** Bilingual label for the legend. */
	label: string;
	/**
	 * Render the label with no icon circle beside it.
	 *
	 * Added for the Fit legend (item 1.6, `lib/shane/fit-legend.ts`), whose
	 * states appear in that page's prose as WORDS rather than as glyphs. An
	 * icon circle there would introduce a mark that is nowhere else on the
	 * page, which is a legend explaining itself. Optional and additive, so
	 * every Transcribe item is unaffected: absent means "draw the circle", the
	 * behaviour every existing caller already has.
	 */
	textOnly?: boolean;
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
 * ё-rule first, then the user-attributed types.
 */
const LEGEND_ORDER: string[] = [
	'yo-restored',
	'user-dictionary',
	'user-composer',
	'user-override',
];

/**
 * The one legend entry that is NOT a stress source.
 *
 * `WordStack.svelte:165-166` prints an `R` whenever a spot override inverts the
 * global reconstitution setting for one word. The renderer and the copy for its
 * legend item were both built (`PageFooter.svelte:58`, `i18n.ts`'s
 * `legend.spot-reconstitution`); the producer never was, so the mark printed
 * and nothing decoded it.
 *
 * N.65, DANN'S RULING OF 2026-08-21, AND IT IS A PRINCIPLE RATHER THAN A PATCH:
 * "When a sigil prints to the page it must be decoded with a legend."
 *
 * It is a separate constant rather than a fifth member of `LEGEND_ORDER`
 * because that array is the ALLOWLIST the stress scan tests words against, and
 * no word's `stressSource` is ever this. It comes from the `spotReconstitution`
 * map instead.
 */
const SPOT_RECONSTITUTION = 'spot-reconstitution';

/**
 * The order the legend PRINTS in, derived from `LEGEND_ORDER` so the two cannot
 * drift.
 *
 * Spot reconstitution prints last, the position it has held since it was added.
 * It sits after the stress sources because it is not one: it is the singer's own
 * decision about a single word, read from the `spotReconstitution` map rather
 * than from any word's `stressSource`. Appending it leaves `LEGEND_ORDER`'s own
 * ё-first, user-types-after shape untouched.
 */
const LEGEND_DISPLAY_ORDER: string[] = [...LEGEND_ORDER, SPOT_RECONSTITUTION];

// ── Icon mapping ─────────────────────────────────────────────────

/**
 * Map provenance type to its icon identifier.
 * Components use this to render the appropriate SVG or text.
 */
const PROVENANCE_ICONS: Record<string, string> = {
	'yo-restored': 'ё',
	'user-dictionary': 'book',
	'user-composer': 'notes',
	'user-override': 'torso',
	/* The mark IS the character, as it is for `yo-restored`. `WordStack`
	   prints a literal `R`; `PageFooter` draws a traced one at legend size. */
	[SPOT_RECONSTITUTION]: 'R',
};

// ── Legend i18n key mapping ───────────────────────────────────────

/**
 * Map provenance type to its i18n legend key.
 */
const LEGEND_KEYS: Record<string, string> = {
	'yo-restored': 'legend.yo',
	'user-dictionary': 'legend.user-dictionary',
	'user-composer': 'legend.user-composer',
	'user-override': 'legend.user-override',
	[SPOT_RECONSTITUTION]: 'legend.spot-reconstitution',
};

// ── Legend builder ────────────────────────────────────────────────

/**
 * Build a provenance legend for a single page's lines.
 *
 * 1. Scans all word stacks across the page's lines
 * 2. Collects unique provenance types that match known legend entries (allowlist)
 * 3. Maps each type to its icon and bilingual label
 * 4. Returns in stable display order (ё first, spot reconstitution last)
 * 5. Returns empty array if no special provenance exists (legend omitted)
 *
 * `spotReconstitution` is the page's spot-override map, the same one
 * `Paper.svelte` already passes down to `VerseLine` and `WordStack`. It is
 * optional so every existing caller and test keeps its behaviour: absent means
 * no `R` is printed, which is what a page with no spot overrides has.
 */
export function buildProvenanceLegend(
	lines: LineData[],
	language: Language,
	spotReconstitution?: Map<string, boolean>
): LegendItem[] {
	// Collect unique provenance types on this page
	const seen = new Set<string>();

	for (const line of lines) {
		for (const word of line.words) {
			/* THE CLITIC ARROW IS NOT A SIGIL. RULED BY DANN 2026-08-21: "the
			   clitic arrow does not count as a sigil. The clitic arrow is fully
			   explained in the GUIDE section." So this skip stays, and it is
			   ruled rather than incidental. It also drops synthetic pipeline
			   entries (clitic arrows with negative stressIndex), whose stress
			   source is irrelevant to the legend. */
			if (word.isProclitic || word.isEnclitic || word.stressSource === 'clitic') continue;
			if (word.stressIndex < 0) continue;
			if (LEGEND_ORDER.includes(word.stressSource)) {
				seen.add(word.stressSource);
			}
		}
	}

	/* THE SPOT SCAN IS SEPARATE, AND IT IS NOT SUBJECT TO THE SKIP ABOVE.
	   `WordStack.svelte:165` prints the `R` for any word it renders, clitics
	   included, and the skip above is about a STRESS source, which this is not.
	   Reading the map here is what makes the legend per-page: a page with a
	   spot-reconstituted word gets the entry and a page without one does not,
	   which is the filtering the other four already do.

	   THE KEY AND THE PREDICATE ARE `VerseLine.svelte`'s, not new ones.
	   `VerseLine.svelte:69` builds `${lineIndex}-${wordIndex}` and
	   `VerseLine.svelte:20-22` renders a stack only for words carrying
	   Cyrillic. Testing both is what stops this emitting a legend for a mark
	   the page never drew, which would be Dann's own ruling in a mirror. */
	if (spotReconstitution && spotReconstitution.size > 0) {
		outer: for (const line of lines) {
			for (const word of line.words) {
				if (!/[А-Яа-яЁё]/.test(word.cyrillic || '')) continue;
				if (spotReconstitution.has(`${word.lineIndex}-${word.wordIndex}`)) {
					seen.add(SPOT_RECONSTITUTION);
					break outer;
				}
			}
		}
	}

	if (seen.size === 0) {
		return [];
	}

	// Build legend items in stable order
	const items: LegendItem[] = [];

	for (const type of LEGEND_DISPLAY_ORDER) {
		if (seen.has(type)) {
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
