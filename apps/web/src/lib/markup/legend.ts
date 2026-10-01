/**
 * The Markup legend: one entry, for the one mark on the page that needs a key.
 *
 * That mark is the withheld-syllable sigla (N.10b). Where the engraver's word
 * division and the engine's disagree, Ilya declines to transcribe the syllable
 * and draws a question-mark sigla instead. A drawn glyph with no word beside it
 * is exactly what a legend is for: Dann's ruling of 8 August, "human beings
 * will see a question mark sigla and know to seek out a legend."
 *
 * WHAT WAS HERE, AND WHY IT IS GONE. Until 2026-09-28 this legend also carried
 * four voice-state entries, Captured, Provisional, Estimated, and Unmeasured,
 * built from the singer's `CalibratedFormant` readings (item 1.6). Dann removed
 * them on 2026-09-28 at 22:18. His reason, 22:17: "They don't have a symbol to
 * tie them to anything. Justify them if possible, if not, let's get rid of
 * them." None could be justified: "Captured" appears nowhere on the page, whose
 * prose says "measured"; "Provisional" is already explained by the page's own
 * status sentence; and all four were placeholder copy that was never ruled.
 * Then, 22:18: "Remove the four." The readings themselves stay on
 * `CalibratedFormant` (`reading`, `noiseFloor`), because other code reads them.
 *
 * WHAT THIS IS NOT. It is not Transcribe's legend. `buildProvenanceLegend`
 * (`lib/provenance.ts`) scans `LineData[]` word stacks for STRESS provenance.
 * The two share the `LegendItem` shape and no data, so the footer renders one
 * mechanism and neither builder has to know the other's vocabulary.
 *
 * The copy sits here rather than in `i18n.ts` under E.22 §4's licence for this
 * item: "minimal form, hardcoded copy, no configurability". RATIFIED by Dann
 * 2026-09-30 23:42, English and French, as built.
 */

import type { Language } from '../i18n';
import type { LegendItem } from '../provenance';

/**
 * The withheld entry's type, which `PageFooter` compares against to draw its
 * sigla. `LegendItem.type` is a plain string, so one constant, imported on
 * both sides, is what keeps the two from drifting apart (N.174 D.2.2).
 */
export const MARKUP_WITHHELD_TYPE = 'markup-withheld';

const MARKUP_WITHHELD_COPY: Record<Language, string> = {
	en: 'The score and Ilya divide this word differently, so nothing is transcribed here rather than guessed.',
	fr: 'La partition et Ilya divisent ce mot différemment\u00a0: rien n’est transcrit ici plutôt que deviné.'
};

/**
 * Build the Markup legend. Returns `[]` unless the page actually carries a
 * withheld syllable, so the footer omits the row entirely rather than
 * explaining a mark that is not there. The flag comes from the render
 * (`withheldIpa` in `MarkupPane`), which is the only place that knows.
 *
 * The entry carries its circle, and `PageFooter` draws it from
 * `WITHHELD_SIGLA`, the same constant the renderer draws on the stave, so the
 * legend and the page can never show two different glyphs.
 */
export function buildMarkupLegend(
	language: Language,
	options: { withheldSyllables?: boolean } = {}
): LegendItem[] {
	if (!options.withheldSyllables) return [];
	return [
		{
			type: MARKUP_WITHHELD_TYPE,
			icon: 'question',
			label: MARKUP_WITHHELD_COPY[language]
		}
	];
}
