/**
 * @ilya/dictionary – Shared type definitions
 *
 * Types for the gloss pipeline, dictionary data structures,
 * and bilingual content handling.
 */

/** Supported gloss display languages */
export type GlossLanguage = 'en' | 'fr';

/** Bilingual gloss object as stored in curated glosses and some dictionary entries */
export interface BilingualGloss {
  en: string;
  fr?: string | null;
}

/**
 * A single dictionary entry as stored in the compressed JSON dictionary.
 * Uses short keys (s, g, p, l) in the compressed format and
 * long keys (stress, gloss, pos, lemma) in the expanded format.
 */
export interface DictionaryEntry {
  /** Stress index (0-based syllable index, or -1 for monosyllable, -2 for unknown) */
  stress?: number;
  s?: number;
  /** Gloss — may be a string, bilingual object, or absent */
  gloss?: string | BilingualGloss;
  g?: string | BilingualGloss;
  /** Part of speech */
  pos?: string;
  p?: string;
  /** Lemma (base form) */
  lemma?: string;
  l?: string;
  /** Source tag (e.g., 'supplement') */
  source?: string;
  /** Original poetic form, present when entry was resolved via normalisation */
  normalizedFrom?: string;
}

/**
 * The full stress dictionary: a record mapping lowercase Cyrillic words
 * to either a single entry or an array of entries (homographs).
 */
export type StressDictionary = Record<string, DictionaryEntry | DictionaryEntry[]>;

/**
 * Singer supplement entry format.
 * Same structure as DictionaryEntry but typically includes
 * hand-curated stress and gloss data for high-frequency vocabulary.
 */
export type SingerSupplement = Record<string, DictionaryEntry | DictionaryEntry[]>;
