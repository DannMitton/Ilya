/**
 * ONE VOWEL PER NOTE, as a check (N.135 stage 2b r5, step 6; `CONTRACT.md` §0.1,
 * Dann 2026-10-29 01:18): Russian lyric diction sings one vowel per note, no more
 * and no less. A note whose text has letters and no vowel, a note whose text has
 * two vowels or more, and a note whose text is a mark alone are breaches. It
 * reports; it changes nothing.
 *
 * - A note with no text, or only a hyphen or an underscore (a joint, an
 *   extender), is not tested.
 * - A note that is a continuation (tied into, under an extender, a melisma's
 *   later note) is not tested for a missing vowel; it sings no new syllable. The
 *   caller says so with `continuation`. Two vowels on it are still a breach.
 * - A letter of U+00A0-joined text is part of the one unit: «в бью» is one
 *   unit with one vowel, «бью ж» one.
 * - «й» is a consonant (Dann, 2026-10-29 01:18). A mark alone, `#` above all, is
 *   a breach: a syntactic break is fused to its syllable with a no-break space
 *   («я #»), never a note of its own (Dann 2026-10-29 01:44: "An isolated
 *   octothrope is not possible or permissible."). No entry here allows a lone `#`.
 *
 * THE VOWEL LETTERS are `VOWEL` (`underlay-units.ts`: а е ё и о у ы э ю я and
 * ѣ і ѵ), held equal to `CYRILLIC_VOWEL` (`score/vowel-resolver.ts`) by
 * `underlay-units.test.ts`. No new set. Every other copy of the question agrees
 * with it on every letter but ѣ, і, ѵ (see the step 6 report).
 *
 * The caller runs the vowel count on a verse that holds a Cyrillic letter, and
 * the mark check on every verse (`isCyrillicVerse`): an IPA syllable has letters
 * and no Cyrillic vowel.
 *
 * Pure.
 */
import { VOWEL } from './underlay-units';

const VOWELS = new RegExp(VOWEL.source, 'giu');
const LETTER = /\p{L}/u;
const CYRILLIC = /[Ѐ-ӿ]/u;
/** Text that is only joints: hyphens and underscores, with spaces. */
const JOINT_ONLY = /^[\s \-–—‐‑_]*$/u;

/** What is under one note. */
export interface NoteText {
	/** The caller's name for the note. */
	id: string | number;
	/** The syllable text, or null/empty where there is none. */
	text: string | null | undefined;
	/** The note sings no new syllable: tied into, under an extender, or a melisma's later note. */
	continuation?: boolean;
}

export type BreachKind = 'no-vowel' | 'many-vowels' | 'mark-alone';

export interface Breach {
	id: string | number;
	text: string;
	kind: BreachKind;
	/** The vowel letters counted (0 for a mark). */
	vowels: number;
}

/** True where the text holds a Cyrillic letter: a verse the vowel count applies to. */
export function isCyrillicVerse(texts: readonly (string | null | undefined)[]): boolean {
	return texts.some((t) => !!t && CYRILLIC.test(t));
}

/** Each note whose text breaks the rule, in the order given. */
export function vowelsPerNote(notes: readonly NoteText[], options: { vowelCount?: boolean } = {}): Breach[] {
	const vowelCount = options.vowelCount ?? true;
	const out: Breach[] = [];
	for (const note of notes) {
		const text = note.text ?? '';
		if (text.trim() === '' || JOINT_ONLY.test(text)) continue;
		if (!LETTER.test(text)) {
			out.push({ id: note.id, text, kind: 'mark-alone', vowels: 0 });
			continue;
		}
		if (!vowelCount) continue;
		const vowels = (text.match(VOWELS) ?? []).length;
		if (vowels >= 2) out.push({ id: note.id, text, kind: 'many-vowels', vowels });
		else if (vowels === 0 && !note.continuation) out.push({ id: note.id, text, kind: 'no-vowel', vowels });
	}
	return out;
}
