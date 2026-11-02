/**
 * The one check that keeps a vowelless syllable off a note (`CONTRACT.md` §0.1,
 * Dann 2026-10-29 01:18 and 2026-11-02 13:46, no exceptions): a note is assigned
 * a vowel, so a unit whose letters hold no vowel letter takes no note.
 *
 * Every path that writes text under a note passes through this file:
 * - the scan, in `seatPage` (`underlay-page.ts`), on the row's units before
 *   `seatTokens`, where the unit is dropped and counted;
 * - typed text and every re-seat, in `buildSlotQueue` (`score/pairings.ts`),
 *   where a vowelless piece joins the neighbouring piece of its word;
 * - a file's own lyrics on arrival (`score/ingestion/`), where a vowelless
 *   syllable joins its host.
 * The mechanisms differ, the rule is the same one: `hasVowelLetter`.
 *
 * WHICH LETTERS ARE VOWELS is `VOWEL` (`underlay-units.ts`), held equal to
 * `score/vowel-resolver.ts`'s `CYRILLIC_VOWEL` by `underlay-units.test.ts`. «й»
 * is a consonant. ѣ, і, and ѵ are vowels in a word that holds other letters.
 *
 * A STRAY MARK is the one case where a vowel letter is not a vowel: a unit that
 * is its whole token and whose only letter is one і, ѣ, or ѵ is a bar line or a
 * bracket the reader took for a letter. A piece `cutUnits` made always carries
 * a vowel the engine placed, so it is never tested: «по-ѣ-ду» keeps its «ѣ».
 *
 * Pure. No DOM.
 */
import { VOWEL } from './underlay-units';

const LETTER = /\p{L}/u;
const LETTERS = /\p{L}/gu;
const STRAY_LETTER = /^[іѣѵ]$/iu;

/** True where the text holds a vowel letter. */
export const hasVowelLetter = (text: string): boolean => VOWEL.test(text);

/** True where the text holds a letter and no vowel letter: a syllable that cannot take a note. */
export const isVowelless = (text: string): boolean => LETTER.test(text) && !VOWEL.test(text);

/** True where the text's only letter is one і, ѣ, or ѵ. */
export const isStrayLetter = (text: string): boolean => STRAY_LETTER.test((text.match(LETTERS) ?? []).join(''));

/** Why a unit was refused a note. */
export type Refusal = 'vowelless' | 'stray';

export interface VowelCheck<T> {
	/** The units that may take a note, in their order; a unit with no letter is kept (a joint, an extender, a mark). */
	kept: T[];
	/** The units refused, with why and where they stood. */
	refused: { item: T; index: number; why: Refusal }[];
}

/**
 * Keep the units that may take a note. `whole(i)` says unit `i` is its whole
 * token (the only unit of its `origin`); only such a unit can be a stray mark.
 * Absent, no unit is tested as one.
 */
export function assertVowelPerNote<T extends { text: string }>(units: readonly T[], whole: (index: number) => boolean = () => false): VowelCheck<T> {
	const kept: T[] = [];
	const refused: VowelCheck<T>['refused'] = [];
	units.forEach((item, index) => {
		if (whole(index) && isStrayLetter(item.text)) refused.push({ item, index, why: 'stray' });
		else if (isVowelless(item.text)) refused.push({ item, index, why: 'vowelless' });
		else kept.push(item);
	});
	return { kept, refused };
}

/**
 * `whole` for `assertVowelPerNote`: unit `i` is its whole token where it is the only unit `cutUnits` made of that token.
 * `cutOrigin` is `cutUnits`' origin before any fold; `origin` is the origin of the units being checked.
 */
export const wholeTokenOf = (cutOrigin: readonly number[], origin: readonly number[]) => (i: number): boolean =>
	cutOrigin.filter((o) => o === origin[i]).length === 1;
