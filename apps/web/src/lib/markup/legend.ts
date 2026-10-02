/**
 * The Markup legend: the withheld-syllable sigla, and since N.176 the stems key.
 *
 * The withheld mark is a sigla (N.10b). Where the engraver's word
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

/**
 * The two stems entries (N.176, ruled by Dann 2026-10-01 01:51; French
 * RATIFIED 2026-10-01 02:33, underline on the adjective alone). Source:
 * Mitton 2020, Appendix B. « hampe » is the standard French engraving term for
 * a stem; « fermé » and « ouvert » follow `vowel.name.e` and `vowel.name.ɛ`.
 */
export const MARKUP_STEMS_UP_TYPE = 'markup-stems-up';
export const MARKUP_STEMS_DOWN_TYPE = 'markup-stems-down';

const MARKUP_STEMS_COPY: Record<'up' | 'down', Record<Language, { label: string; emphasis: string }>> = {
	up: {
		en: { label: 'stems up = close timbre', emphasis: 'close' },
		fr: { label: 'hampes vers le haut = timbre fermé', emphasis: 'fermé' }
	},
	down: {
		en: { label: 'stems down = open timbre', emphasis: 'open' },
		fr: { label: 'hampes vers le bas = timbre ouvert', emphasis: 'ouvert' }
	}
};

const MARKUP_WITHHELD_COPY: Record<Language, string> = {
	en: 'The score and Ilya divide this word differently, so nothing is transcribed here rather than guessed.',
	fr: 'La partition et Ilya divisent ce mot différemment\u00a0: rien n’est transcrit ici plutôt que deviné.'
};

/**
 * Build the Markup legend. The withheld entry is present only when the page
 * carries a withheld syllable, and the two stems entries only when the page
 * draws at least one note with a timbre analysis (the condition under which
 * the stave's stems are semantic, `staff-renderer.ts`, `a ? a.timbre === 'close'`),
 * so the footer never explains a mark that is not there. The flags come from
 * the render (`withheldIpa` and `analyzed` in `MarkupPane`), which is the only
 * place that knows.
 *
 * The withheld entry carries its circle, and `PageFooter` draws it from
 * `WITHHELD_SIGLA`, the same constant the renderer draws on the stave, so the
 * legend and the page can never show two different glyphs. The stems entries
 * are drawn by `PageFooter` from `stemLegendDrawing`, the renderer's own
 * heads, stems, beam, and ink.
 */
export function buildMarkupLegend(
	language: Language,
	options: { withheldSyllables?: boolean; stems?: boolean } = {}
): LegendItem[] {
	const items: LegendItem[] = [];
	if (options.stems) {
		for (const dir of ['up', 'down'] as const) {
			const copy = MARKUP_STEMS_COPY[dir][language];
			items.push({
				type: dir === 'up' ? MARKUP_STEMS_UP_TYPE : MARKUP_STEMS_DOWN_TYPE,
				icon: 'stems',
				label: copy.label,
				stems: dir,
				emphasis: copy.emphasis
			});
		}
	}
	if (options.withheldSyllables) {
		items.push({
			type: MARKUP_WITHHELD_TYPE,
			icon: 'question',
			label: MARKUP_WITHHELD_COPY[language]
		});
	}
	return items;
}
