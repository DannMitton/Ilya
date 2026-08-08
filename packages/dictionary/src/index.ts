/**
 * @ilya/dictionary – Public API
 *
 * Dictionary data management, gloss formatting pipeline,
 * curated glosses, and Cyrillic display helpers.
 */

// Gloss pipeline
export {
  extractGloss,
  extractCleanGloss,
  isGrammatical,
  extractLemmaFromGloss,
  getLemmaGloss,
  truncateGloss,
  formatGlossForDisplay,
  setGlossDictionary,
  lookupFullEntry,
} from './gloss';

// Poetic form normalisation
export {
  normalizePoetic,
  restoreCasing,
} from './poetic-normalizer';

// Pre-1918 orthography normalisation (N.12)
// `modernisePreReform` is the intake entry point and returns one form or null;
// `normalizePreReform` is the candidate-list form and delegates to it.
export {
  hasAbolishedLetter,
  modernisePreReform,
  normalizePreReform,
} from './pre-reform-normalizer';

// Curated glosses
export { CURATED_GLOSSES } from './curated-glosses';

// Cyrillic display helpers
export {
  addStressMarkToCyrillic,
  addAcuteToSyllable,
} from './cyrillic';

// Types
export type {
  BilingualGloss,
  GlossLanguage,
  DictionaryEntry,
  StressDictionary,
  SingerSupplement,
} from './types';

export type { SyllableInfo } from './cyrillic';
