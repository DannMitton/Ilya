/**
 * Voicing across a word boundary: Grayson (2012) p. 251, rule 2 (N.198).
 *
 * "Sonorants and vowels do not influence voicing assimilation across any
 * boundary, but do allow final voiced consonants of prepositions, particle
 * contractions, prefixes and word roots (boundary #4) to retain voicing."
 * Boundary #4 (p. 248) is "in between a preposition and its object or a
 * prefix/suffix and a word root". An ordinary word sits at boundary #3 and
 * devoices (p. 252: сад наш, сад Анны, сад ваш are sung with a final [t]).
 *
 * These helpers hold what `applyCrossWordAssimilation` needs for that rule.
 * They live here and not in `engine.ts`, which is at its line ceiling
 * (`scripts/ratchets.json`). This file imports nothing from the engine.
 */

/**
 * Voiced-final prepositions outside the engine's clitic list, ruled by Dann
 * 2026-10-26 17:26 (brief N.198, step 1, part B). Read only by the voicing
 * branch. Stress, reduction, and boundaries do not read it. Keys are what
 * `cleanWord` holds: no punctuation and no hyphen, so «из-под» is «изпод».
 * NOT ESTABLISHED in Grayson: whether his "prepositions" take in these.
 */
export const VOICING_PREPOSITIONS: ReadonlySet<string> = new Set([
  'вокруг', 'сквозь', 'близ', 'средь', 'изпод', 'вслед', 'вглубь', 'промеж',
]);

/** Cyrillic letters only, lower case: strips punctuation, quotes, and hyphens. */
export function lettersOf(word: string): string {
  return word.replace(/[^а-яёА-ЯЁ]/g, '').toLowerCase();
}

interface LeftWordFacts {
  cyrillic: string;
  cleanWord?: string;
  isProclitic?: boolean;
}

/**
 * Does this left word sit at boundary #4: a preposition, or the particle
 * contraction б or ж? `isProclitic` comes from the pipeline when it has it
 * (it excludes the «о» interjection and a word promoted from a clitic); a
 * hand-built word falls back to the engine's proclitic set. «ли» and «бы» are
 * full particles, not contractions (p. 252, «если б мог»).
 */
export function keepsVoicingAtBoundary4(word: LeftWordFacts, proclitics: ReadonlySet<string>): boolean {
  const clean = lettersOf(word.cleanWord ?? word.cyrillic);
  return (word.isProclitic ?? proclitics.has(clean)) || clean === 'б' || clean === 'ж' || VOICING_PREPOSITIONS.has(clean);
}

interface RightWordFacts {
  ipaSurface: string;
  rightBoundary: string;
}

/**
 * The right initial that influences voicing once в is ignored: p. 251,
 * "ignore /u/ (-d-) [в] when it is in a position of regressive influence and
 * ... look to the next letter in line". `index` is the left word. Called when
 * the right word begins with в: skips the в in the right word, or, for the bare
 * proclitic «в», takes the first segment of the word after it (not across a
 * hard boundary). Null means a vowel, or nothing to look at.
 */
export function initialPastV(
  words: ReadonlyArray<RightWordFacts>,
  index: number,
  initialOf: (ipa: string) => string | null,
): string | null {
  const bare = (s: string) => s.replace(/[ˈˌ]/g, '');
  const right = words[index + 1];
  const v = initialOf(right.ipaSurface) ?? '';
  const rest = bare(right.ipaSurface).slice(v.length);
  if (rest) return initialOf(rest);
  const after = words[index + 2];
  if (!after || right.rightBoundary === 'hard') return null;
  return initialOf(after.ipaSurface);
}

/**
 * «бог» keeps [x] (Grayson p. 144, [box]). `transcribe` writes it into the
 * surface and the syllables, not into `ipaUnderlying`, and the cross-word pass
 * starts from `ipaUnderlying`, so a word the pass devoices to [k] gets its [x]
 * back here. Only inside a line: before a hard boundary «бог» stays as it was
 * (reported in N.198, not ruled).
 */
export function restoreBogFinish(word: { cyrillic: string; cleanWord?: string; ipaSurface: string; rightBoundary: string }): string {
  if (word.rightBoundary === 'hard' || lettersOf(word.cleanWord ?? word.cyrillic) !== 'бог') return word.ipaSurface;
  return word.ipaSurface.endsWith('k') ? word.ipaSurface.slice(0, -1) + 'x' : word.ipaSurface;
}
