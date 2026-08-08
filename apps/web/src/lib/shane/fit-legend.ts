/**
 * The Fit provenance legend (item 1.6), minimal form.
 *
 * E.22 §4 kept this item when two others were cut, and gave the reason: it is
 * "the surface through which a singer sees where calibration is absent, so it
 * is load-bearing for the ratified clause and cannot be cut." The clause is
 * "read or print a complete Fit result that never guesses where calibration is
 * absent."
 *
 * WHAT THIS IS NOT. It is not Transcribe's legend. `buildProvenanceLegend`
 * (`lib/provenance.ts`) scans `LineData[]` word stacks for STRESS provenance:
 * ё-restored, user-dictionary, inferred. **The two share a shape and no data.**
 * They are deliberately separate functions over the same `LegendItem` type, so
 * the footer renders one mechanism and neither builder has to know about the
 * other's vocabulary.
 *
 * WHAT IT EXPLAINS. The Fit page states a singer's calibration in prose:
 * "...with seven vowels measured", "...are provisional". Those words are the
 * referent. **This legend defines the vocabulary that page already uses**, and
 * it emits an entry ONLY for a state actually present in the profile, on the
 * same discipline as `buildProvenanceLegend`, which returns `[]` when a page
 * has no special provenance. A legend that lists a state the singer does not
 * have is a claim about their voice that nobody measured.
 *
 * THE FOURTH ENTRY IS ORTHOGONAL, AND THAT IS THE POINT. `Unmeasured` is not a
 * fourth kind of reading. It rides on `CalibratedFormant.noiseFloor` (item
 * 1.4b), so a reading can be Captured AND Unmeasured at once: we heard the
 * singer perfectly and could not measure their room. Dann ruled the word on
 * 2026-08-04 and ruled its placement with it: on its own line beneath the
 * reading rather than beside it, "because 'Captured Unmeasured' on one line
 * reads as a contradiction rather than as two facts."
 *
 * ALL EIGHT STRINGS BELOW ARE PLACEHOLDER, drafted so Dann edits rather than
 * composes. **The French is mine and needs his eye more than the English does.**
 * E.22 §4's licence for this item is "minimal form, hardcoded copy, no
 * configurability", which is why the copy sits here rather than in `i18n.ts`:
 * that file is a shared surface and this is one item's vocabulary.
 */

import type { Language } from '../i18n';
import type { LegendItem } from '../provenance';
import type { CalibratedFormant, Vowel } from './engine/types';

/**
 * Stable display order, and it is not alphabetical. It runs from the most
 * evidence to the least: sung and clean, sung and uncertain, not sung at all.
 * `Unmeasured` sits last because it is a statement about our instrument rather
 * than about the singer, and it is the only one that can co-occur with any of
 * the others.
 */
export const FIT_LEGEND_ORDER = [
	'fit-captured',
	'fit-provisional',
	'fit-estimated',
	'fit-unmeasured'
] as const;

export type FitLegendType = (typeof FIT_LEGEND_ORDER)[number];

/** PLACEHOLDER copy, flagged for Dann. See the module note. */
const FIT_LEGEND_COPY: Record<FitLegendType, Record<Language, string>> = {
	'fit-captured': {
		en: 'Captured: you sang it, and it read cleanly.',
		fr: 'Capturé : vous l’avez chanté, et la lecture est nette.'
	},
	'fit-provisional': {
		en: 'Provisional: you sang it, but it read with less certainty. You can re-take it.',
		fr: 'Provisoire : vous l’avez chanté, mais la lecture est moins sûre. Vous pouvez le reprendre.'
	},
	'fit-estimated': {
		en: 'Estimated: not sung. Derived from the vowels you did sing.',
		fr: 'Estimé : non chanté. Dérivé des voyelles que vous avez chantées.'
	},
	'fit-unmeasured': {
		en: 'Unmeasured: your device could not measure the room for this sample. It says nothing about your voice.',
		fr: 'Non mesuré : votre appareil n’a pas pu mesurer la pièce pour cet échantillon. Cela ne dit rien de votre voix.'
	}
};

/**
 * N.10b: the withheld-syllable entry, and it is NOT one of the four above.
 *
 * The four are states of the singer's VOICE, derived from their formants.
 * This one is a state of the SCORE: Ilya declined to transcribe a syllable
 * because the engraver's division and the engine's disagree there. It is
 * kept out of `FitLegendType` and out of `fitLegendTypes` so that function
 * keeps its single subject, and it is appended by `buildFitLegend` on a flag
 * the caller supplies from the render, which is the only place that knows.
 *
 * This entry is the ONE exception to the Fit legend's no-circle rule, and
 * Dann's ruling of 8 August is why: the page mark is now a drawn sigla rather
 * than a typeset character, and "human beings will see a question mark sigla
 * and know to seek out a legend." A legend that named the glyph in words
 * while refusing to show it would send the reader back to the page to guess
 * which mark was meant. So it carries the circle, and `PageFooter` draws it
 * from `WITHHELD_SIGLA`, the same constant the renderer draws on the stave.
 *
 * PLACEHOLDER copy, flagged for Dann, on the same footing as the four above.
 * The French is mine and needs his eye more than the English does.
 */
const FIT_WITHHELD_COPY: Record<Language, string> = {
	en: 'The score and Ilya divide this word differently, so nothing is transcribed here rather than guessed.',
	fr: 'La partition et Ilya divisent ce mot différemment : rien n’est transcrit ici plutôt que deviné.'
};

/**
 * Which legend entries does this profile actually warrant?
 *
 * Split out from `buildFitLegend` so the decision is reachable by `vitest`
 * without a `Language`, and so the copy and the logic can be wrong
 * independently of each other.
 *
 * `Unmeasured` is tested across every reading rather than per state, because it
 * is orthogonal: one Captured vowel with an unmeasurable room earns the entry.
 */
export function fitLegendTypes(
	formants: Partial<Record<Vowel, CalibratedFormant>>
): FitLegendType[] {
	const present = new Set<FitLegendType>();

	for (const f of Object.values(formants)) {
		if (!f) continue;
		if (f.reading === 'captured') present.add('fit-captured');
		else if (f.reading === 'provisional') present.add('fit-provisional');
		else if (f.reading === 'estimated') present.add('fit-estimated');
		// Orthogonal, and deliberately not an `else`: see the module note.
		if (f.noiseFloor === 'unmeasured') present.add('fit-unmeasured');
	}

	return FIT_LEGEND_ORDER.filter((t) => present.has(t));
}

/**
 * Build the Fit legend for a profile. Returns `[]` for an empty or
 * uncalibrated profile, so the footer omits the row entirely rather than
 * printing a glossary for readings that do not exist.
 *
 * `textOnly` is set on every item: Fit's states appear in the page's prose as
 * words, not as glyphs, so a legend circle would introduce a mark that is
 * nowhere else on the page.
 */
export function buildFitLegend(
	formants: Partial<Record<Vowel, CalibratedFormant>>,
	language: Language,
	options: { withheldSyllables?: boolean } = {}
): LegendItem[] {
	const items: LegendItem[] = fitLegendTypes(formants).map((type) => ({
		type,
		icon: '',
		label: FIT_LEGEND_COPY[type][language],
		textOnly: true
	}));
	// N.10b. Last, and emitted only when the page actually carries the mark,
	// on the same discipline as everything above it: a legend that lists a
	// state the page does not have is an explanation of nothing. It is last
	// because it is the only entry that is not about the singer's voice.
	if (options.withheldSyllables) {
		items.push({
			type: 'fit-withheld',
			icon: 'question',
			label: FIT_WITHHELD_COPY[language],
			// The exception: this one is a glyph on the page, so it is a glyph
			// here. Every entry above it is a word in the page's prose.
			textOnly: false
		});
	}
	return items;
}
