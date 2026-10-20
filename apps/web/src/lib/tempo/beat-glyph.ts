/**
 * beat-glyph.ts — a metronome beat as the notation face draws it.
 *
 * ROW 48 (2026-10-15). The `{beat}` in the Insights sentence, the receipt, and
 * the control's chips are SMuFL metronome notes set in Finale Maestro, as the
 * DURATION cells set theirs (`LENGTH_CELLS`, `score/correction.ts`), and not the
 * text-font characters `TempoResolution.beatGlyph` carries (U+2669, U+266A).
 * A dot is `metAugmentationDot`, U+E1E7, present in `FinaleMaestro.json`.
 *
 * The name of a beat for a screen reader is the note-value word (`correct.lenQuarter`
 * and the rest) and, for a dotted beat, the ratified dotted phrase (row 133, Dann
 * 2026-10-19 23:41): "Dotted quarter", « Noire pointée ». A beat is never a rest.
 */
import type { NoteBase } from '@ilya/score-parser';
import { t, type Language } from '$lib/i18n';
import { LENGTH_CELLS } from '$lib/score/correction';
import { valueName } from '$lib/score/value-name';

/** SMuFL `metAugmentationDot`. */
export const DOT = '';

/** The beat's glyphs: the stem-up metronome note, then one dot per dot. Empty for a unit the face has none for. */
export function beatGlyph(unit: NoteBase | string, dots: number): string {
	const cell = LENGTH_CELLS.find((c) => c.base === unit);
	return cell ? cell.glyph + DOT.repeat(Math.max(0, dots)) : '';
}

/** What a screen reader says for a beat: the note value, and the dot word after it where dotted. */
export function beatName(unit: NoteBase | string, dots: number, language: Language): string {
	const phrase = valueName(unit, dots, false, language);
	if (phrase !== null) return phrase;
	const cell = LENGTH_CELLS.find((c) => c.base === unit);
	const name = cell ? t(cell.key, language) : String(unit);
	return dots > 0 ? `${name} · ${t('correct.dot', language)}` : name;
}
