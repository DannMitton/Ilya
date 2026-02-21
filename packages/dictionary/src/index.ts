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
