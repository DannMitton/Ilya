/**
 * Exception words whose vowel the rules do not reach.
 *
 * «счастье» and its derivatives (Grayson 2012, p. 287, ch. 6 section 5): the
 * ⟨а⟩ sits interpalatally (between two soft consonants), where the rules
 * require a fronted [a]. Grayson shares that many Russian speakers keep the
 * dark [ɑ], which he finds less tense and more resonant for singing, and
 * "(including derivatives)" extends the exception to the whole family.
 *
 * Row 175 addendum (2026-11-02): the engine listed four forms (счастье,
 * счастья, счастлив, счастливый) under the citation "Appendix F". The stem
 * счаст- covers the family instead. Every override records reason
 * `lexical-exception` with the word.
 *
 * The stem is matched anywhere in the word, so the derivatives with a prefix
 * (несчастный, злосчастный, посчастливиться, осчастливить) are covered. The
 * dictionary at 86d83340 holds 177 forms that contain счаст; the report of
 * row 175 step 1 lists them.
 */

const STEM = 'счаст';

/** Index of the ⟨а⟩ of the stem счаст- in the word, or -1 when the word lacks the stem. */
export function lexicalExceptionVowelIndex(word: string): number {
  const i = word.toLowerCase().indexOf(STEM);
  return i < 0 ? -1 : i + 2;
}
