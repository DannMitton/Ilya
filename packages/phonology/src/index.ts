/**
 * @ilya/phonology — Russian phonological analysis for lyric diction
 *
 * Implements Craig Grayson's 2012 dissertation "Russian Lyric Diction"
 * as the sole phonological authority.
 *
 * @example
 * ```ts
 * import { transcribeWord, GraysonEngine } from '@ilya/phonology';
 *
 * const result = transcribeWord('молоко');
 * console.log(result.ipa); // 'mʌɫɑˈko'
 * ```
 *
 * @module @ilya/phonology
 */

// Engine and convenience API
export {
  GraysonEngine,
  transcribeWord,
  applyNotationPreferences,
  setStressDictionary,
  setSingerSupplement,
  DEFAULT_ENGINE_CONFIG,
} from './engine';

// Clitic chain resolution
export { resolveCliticChain } from './clitics';
export type { ChainWord, CliticChainResult } from './clitics';

// Types
export type {
  EngineConfig,
  NotationPreferences,
  TranscriptionResult,
  SyllableData,
  TranscriptionLogEntry,
  StressLookupResult,
  CliticEntry,
  ProcliticPosition,
  SpecialClusterInfo,
  BoundaryWord,
} from './engine';

// Palatalization map with reasons, prefix boundary, lexical exceptions (row 175)
export { computePalatalization, softAt, softnessOfReason, SOFT_REASONS, HARD_REASONS } from './palatalization';
export type { PalReason, PalEntry, PalMap, PalInput } from './palatalization';
export { prefixBoundary, STOP_PREFIXES, VZS_PREFIXES, LOOK_ALIKE_ROOTS } from './prefix-boundary';
export type { PrefixBoundary, LookAlikeRoot } from './prefix-boundary';
export { lexicalSoftRIndices, LEXICAL_SOFT_R_LEMMAS } from './lexical-r';
export { lexicalExceptionVowelIndex } from './lexical-exception';
