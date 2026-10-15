/**
 * beat-glyph.ts — a metronome beat as the notation face draws it.
 *
 * ROW 48 (2026-10-15). The `{beat}` in the Insights sentence, the receipt, and
 * the control's chips are SMuFL metronome notes set in Finale Maestro, as the
 * DURATION cells set theirs (`LENGTH_CELLS`, `score/correction.ts`), and not the
 * text-font characters `TempoResolution.beatGlyph` carries (U+2669, U+266A).
 * A dot is `metAugmentationDot`, U+E1E7, present in `FinaleMaestro.json`.
 *
 * The name of a beat for a screen reader is the existing note-value word
 * (`correct.lenQuarter` and the rest), with the existing `correct.dot` word
 * after it for a dotted beat. No `dotted` adjective exists in `i18n.ts`, so the
 * dotted label reads « Quarter · Dot », as the loupe's readout joins its parts
 * (`+page.svelte`, `selectedLabel`). Owed to Dann if he wants a better word.
 */
import type { NoteBase } from '@ilya/score-parser';
import { t, type Language } from '$lib/i18n';
import { LENGTH_CELLS } from '$lib/score/correction';

/** SMuFL `metAugmentationDot`. */
export const DOT = '';

/** The beat's glyphs: the stem-up metronome note, then one dot per dot. Empty for a unit the face has none for. */
export function beatGlyph(unit: NoteBase | string, dots: number): string {
	const cell = LENGTH_CELLS.find((c) => c.base === unit);
	return cell ? cell.glyph + DOT.repeat(Math.max(0, dots)) : '';
}

/** What a screen reader says for a beat: the note value, and the dot word after it where dotted. */
export function beatName(unit: NoteBase | string, dots: number, language: Language): string {
	const cell = LENGTH_CELLS.find((c) => c.base === unit);
	const name = cell ? t(cell.key, language) : String(unit);
	return dots > 0 ? `${name} · ${t('correct.dot', language)}` : name;
}
