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
