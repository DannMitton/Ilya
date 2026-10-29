/**
 * N.194 r5, section 5a (Dann 2026-10-25 23:52): where Ilya itself writes a `#` into Lyrics, a no-break space
 * sits between the word and the `#` («я\u00A0#»), and every site that splits Lyrics on whitespace keeps the
 * two together. JavaScript's `\s` matches `\u00A0` and `\S` does not, so a plain `split(/\s+/)` cuts the glued
 * form in two and a plain `/\S+/g` does too. These two patterns are the only place that decides what a token
 * is; no site writes its own.
 *
 * Write the no-break space as the escape `\u00A0` in source and in tests, never as a literal character.
 */

/** A whitespace run, except a `\u00A0` that stands immediately before a `#`. For `String.split`. */
export const WORD_SPLIT = /(?:(?!\u00A0#)\s)+/;

/** A run of non-space characters, or a `\u00A0` that stands immediately before a `#`. For `matchAll`; it is global, so never `.test` it. */
export const WORD_TOKEN = /(?:\S|\u00A0(?=#))+/g;

/** Every `#` with the no-break spaces that stand immediately before it, for a strip. */
export const GLUED_MARK = /\u00A0*#/g;

/**
 * N.135 stage 2b r5, step 9 (Dann 2026-10-29 01:48, *"Yes I love it make it so."*): when the singer leaves the Lyrics field,
 * a `#` that stands after a word with an ordinary space becomes the no-break form, «я #» to «я #».
 *
 * One or more U+0020 spaces or tabs between a word's last character and a `#` that is followed by whitespace, a line end, the
 * text's end, or another `#` become one ` `. A `#` already glued is left alone (the character before it is the ` `,
 * not a space). «я #на» is left as it is: `WORD_TOKEN` would read «я #на» as ONE token and fuse two words. A line break
 * is never touched (only spaces and tabs are), a `#` inside a word («ва#с») has no space before it, and a `#` that follows
 * another `#` across a space («я # #») does not take the glue: the character before the space must not be a `#`.
 * The words, their syllables, every seat, and the IPA are the same before and after, because `peelSyntacticBreaks`
 * (`syntactic-break.ts:28-32`, applied at `:41-49`) attaches every typed `#` to the word before it either way.
 */
export function glueTypedMarks(text: string): string {
	return text.replace(/([^\s#])[ \t]+(?=#(?:\s|$|#))/gu, '$1 ');
}

/**
 * What leaving the Lyrics field changes, if anything: the text with its typed `#` glued (`glueTypedMarks`), or null where nothing
 * changes or where the field is showing the score's derived words (a change there would claim them, `claimDerivedPoem` in
 * `+page.svelte`, and the score's own text is never touched).
 */
export function lyricsOnLeave(value: string, shownIsDerived: boolean): string | null {
	if (shownIsDerived) return null;
	const glued = glueTypedMarks(value);
	return glued === value ? null : glued;
}
