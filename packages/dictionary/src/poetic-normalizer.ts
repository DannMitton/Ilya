/**
 * @ilya/dictionary – Poetic Form Normaliser
 *
 * Russian vocal literature overwhelmingly uses poetic contracted forms:
 * soft-sign contractions that compress vowel clusters for metric and
 * phonetic reasons (e.g., восстанье for восстание). These are standard
 * in art song and opera texts but absent from dictionaries, which store
 * the full uncontracted forms.
 *
 * This module provides a normalisation fallback for dictionary lookup:
 * when a direct lookup misses, these rules attempt to restore the
 * standard grammatical form so the dictionary can resolve stress, gloss,
 * and part of speech.
 *
 * Rules are ordered by frequency in vocal literature. Only word-final
 * suffix replacement is performed (no mid-word changes).
 *
 * Architecture: Kimi (Moonshot AI K2.5), March 1, 2026.
 * Implementation: Claude (Anthropic), March 1, 2026.
 */

/**
 * Normalisation rules: poetic suffix → standard suffix.
 * Ordered by frequency in Romantic-era Russian vocal repertoire.
 */
const POETIC_RULES: ReadonlyArray<{ poetic: string; standard: string }> = [
  { poetic: 'ью', standard: 'ию' },     // instrumental/dative: мщенью → мщению
  { poetic: 'ье', standard: 'ие' },     // nominative/accusative: восстанье → восстание
  { poetic: 'ья', standard: 'ия' },     // genitive/nominative: именья → имения
  { poetic: 'ьем', standard: 'ием' },   // instrumental: нетерпеньем → нетерпением
  { poetic: 'ьём', standard: 'иём' },   // instrumental (ё variant)
  { poetic: 'ьи', standard: 'ии' },     // plural
];

/**
 * Attempt to normalise a poetic contracted form to its standard
 * dictionary form by applying soft-sign contraction rules.
 *
 * Returns an array of candidate standard forms (may be empty).
 * Candidates are ordered by rule frequency. The caller should
 * try each candidate against the dictionary and take the first hit.
 *
 * @param token - Lowercase Cyrillic word (no punctuation, no stress marks)
 * @returns Array of candidate standard forms, empty if no rules apply
 */
export function normalizePoetic(token: string): string[] {
  const candidates: string[] = [];

  for (const rule of POETIC_RULES) {
    if (token.endsWith(rule.poetic)) {
      const stem = token.slice(0, -rule.poetic.length);
      if (stem.length > 0) {
        candidates.push(stem + rule.standard);
      }
    }
  }

  return candidates;
}

/**
 * Restore the casing pattern from a source word onto a target word.
 *
 * Russian poetic texts capitalise line-initial words. When normalisation
 * produces "восстание" from "Восстанье", the display should show
 * "Восстание" to match the source casing.
 *
 * Russian has no mid-word case changes in standard orthography,
 * so this handles line-initial capitalisation only.
 *
 * @param source - Original word with casing to preserve
 * @param target - Normalised lowercase word to apply casing to
 * @returns Target word with source's casing pattern applied
 */
export function restoreCasing(source: string, target: string): string {
  if (!source || !target) return target;

  const sourceChars = Array.from(source);
  const targetChars = Array.from(target);

  // Check if first character is uppercase
  if (sourceChars.length > 0 && sourceChars[0] === sourceChars[0].toUpperCase() &&
      sourceChars[0] !== sourceChars[0].toLowerCase()) {
    targetChars[0] = targetChars[0].toUpperCase();
  }

  return targetChars.join('');
}
