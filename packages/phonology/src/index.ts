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
