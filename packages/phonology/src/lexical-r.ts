/**
 * The lexical exceptions to the rule for ⟨р⟩ (Derwing and Priestly 1980,
 * p. 87, rule 3R(c)).
 *
 * The ratified rule for ⟨р⟩ before a soft consonant (OPEN.md, 2026-11-01
 * 23:53; Grayson 2012, p. 209 rule 2 and n. 277; D&P pp. 86 to 87) softens ⟨р⟩
 * in two cases only: doubled, or after и, е, э with the stress on that vowel
 * or the next. D&P's own rule 3R(c), p. 87, lists three words whose ⟨р⟩ is
 * soft before a consonant anyway: борщ, скорбь, церковь. The review reports
 * Panov's view there that церковь is the one such word still sung with рь.
 *
 * DESK DEFAULT (row 175, 2026-11-02): the three stay soft in every case form,
 * keyed by dictionary lemma, as for ц and ш in `lexical-palatalization.ts`.
 * Row 175 step 0 measured 29 dictionary forms (борща, церквей, скорбей, and
 * so on). Reason `lexical-soft`.
 */

import { lemmasOf, type LemmaLookup } from './lexical-palatalization';

/** Lemmas whose ⟨р⟩ is soft before a consonant (D&P 1980, p. 87, 3R(c)). */
export const LEXICAL_SOFT_R_LEMMAS: ReadonlySet<string> = new Set(['борщ', 'скорбь', 'церковь']);

/** Character indices of the soft ⟨р⟩ of those lemmas' forms. */
export function lexicalSoftRIndices(word: string, lookup: LemmaLookup | null): number[] {
  const w = word.toLowerCase();
  const found = lemmasOf(lookup).map((l) => l.toLowerCase());
  const lemmas = found.length > 0 ? found : [w]; // a word the dictionary lacks stands for its own lemma
  if (!lemmas.some((l) => LEXICAL_SOFT_R_LEMMAS.has(l))) return [];
  const i = [...w].indexOf('р');
  return i >= 0 ? [i] : [];
}
