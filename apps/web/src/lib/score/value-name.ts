/**
 * A duration's name in the loupe's readout and a tempo chip's spoken beat name
 * (row 133, ratified by Dann 2026-10-19 23:41, `docs/sessions/ratified-loupe-dot-words_2026-10-19.md`).
 *
 * "Dotted quarter", « Noire pointée », « Demi-soupir pointé ». One function,
 * built from whole-phrase keys in `i18n.ts` (not words assembled by grammar, so
 * the French agreement stays as ratified). A rest's phrase is the whole fragment:
 * English "Rest · Dotted eighth", French « Demi-soupir pointé », so neither
 * readout pushes `loupe.rest` for a base this names.
 *
 * A base the tables do not name (`128th`, `breve`) returns null, and the caller
 * keeps today's readout: the base's word, then `correct.dot` or `loupe.doubleDot`.
 */
import type { NoteBase } from '@ilya/score-parser';
import { t, type Language } from '$lib/i18n';
import { LENGTH_CELLS } from '$lib/score/correction';

/** The base ids the keys use; the plain note's word is the Corrections table's own. */
const NAMED = new Set<string>(LENGTH_CELLS.map((c) => c.base));

/** Two or more dots read as double-dotted, as the readout always has. */
const dotKey = (dots: number): 0 | 1 | 2 => (dots >= 2 ? 2 : dots === 1 ? 1 : 0);

export function valueName(base: NoteBase | string, dots: number, isRest: boolean, language: Language): string | null {
	if (!NAMED.has(base)) return null;
	const d = dotKey(dots);
	if (isRest) return t(`loupe.restValue.${base}.${d}`, language);
	if (d === 0) return t(LENGTH_CELLS.find((c) => c.base === base)!.key, language);
	return t(`loupe.value.${base}.${d}`, language);
}

/**
 * A rest's fragment as the loupe's second line takes it, split where the beat
 * clause goes between: "Rest · Dotted eighth" is "Rest", the beat, "Dotted
 * eighth"; a French name has no " · " and stands first alone.
 */
export function restFragmentParts(fragment: string): string[] {
	const i = fragment.indexOf(' · ');
	return i < 0 ? [fragment] : [fragment.slice(0, i), fragment.slice(i + 3)];
}

/**
 * The pieces both loupe readouts are made of, before the syllable: the rest's
 * word or the pitch, the beat clause where there is one, then the value. A base
 * the tables do not name keeps today's pieces: the base's word and its dot word.
 */
export function valueParts(a: {
	isRest: boolean;
	label: string | null;
	base: NoteBase | null;
	dots: number;
	language: Language;
	/** The Corrections word for a base (`durationWord`). */
	word: (base: NoteBase) => string;
	beat?: string;
}): string[] {
	const name = a.base ? valueName(a.base, a.dots, a.isRest, a.language) : null;
	const split = name === null ? null : a.isRest ? restFragmentParts(name) : [name];
	const head = a.isRest ? [split ? split[0] : t('loupe.rest', a.language)] : a.label ? [a.label] : [];
	const tail = split ? split.slice(a.isRest ? 1 : 0) : a.base ? [a.word(a.base), ...dotWords(a.dots, a.language)] : [];
	return [...head, ...(a.beat ? [a.beat] : []), ...tail];
}

const dotWords = (dots: number, language: Language): string[] =>
	dots === 1 ? [t('correct.dot', language)] : dots >= 2 ? [t('loupe.doubleDot', language)] : [];
