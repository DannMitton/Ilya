/**
 * Clitic chain resolution for Russian lyric diction.
 *
 * Russian clitics (unstressed function words) attach phonologically
 * to adjacent stressed words. Proclitics attach forward to a host;
 * enclitics attach backward. Chains of consecutive proclitics before
 * a host are rare but possible (e.g., "не в силах").
 *
 * This module provides chain resolution logic used by the pipeline
 * to determine vowel reduction quality for each clitic relative to
 * the actual host word's stress position.
 *
 * The clitic inventory itself lives in GraysonEngine.cliticData
 * (the authoritative single source of truth). This module imports
 * the derived Sets for O(1) classification lookups.
 *
 * Sources: Grayson 2012 "Russian Lyric Diction" pp. 248-257,
 * standard Russian pedagogical grammars.
 *
 * @module @ilya/phonology
 */

import { GraysonEngine } from './engine';
import type { ProcliticPosition } from './engine';

// ── Chain resolution ────────────────────────────────────────────

/**
 * Minimal word interface for chain resolution.
 * Matches the shape of PreTranscribeWord in the pipeline.
 */
export interface ChainWord {
  cleanWord: string;
  stress: number;
}

/**
 * Result of resolving a proclitic chain from a given position.
 */
export interface CliticChainResult {
  /** Index of the host word in the line, or null if no host found. */
  hostIndex: number | null;
  /** Stress position of the host word, or -2 if unknown. */
  hostStress: number;
  /** ProcliticPosition for the engine's vowel reduction rules. */
  position: ProcliticPosition;
}

/**
 * Maximum number of consecutive proclitics to scan through when
 * searching for a host word. Russian clitic chains rarely exceed 2;
 * this bound is defensive programming for pathological input.
 *
 * Behaviour at the bound: if the scan reaches MAX_CHAIN_SCAN
 * consecutive proclitics, the next word is treated as the host
 * regardless of its clitic status (best-effort with a sanity cap).
 */
const MAX_CHAIN_SCAN = 5;

/**
 * Resolve a proclitic's host word by scanning forward past any
 * intervening proclitics in the line.
 *
 * In "не в силах":
 * - resolveCliticChain(line, 0) → host is "силах" (index 2)
 * - resolveCliticChain(line, 1) → host is "силах" (index 2)
 *
 * The returned ProcliticPosition determines vowel reduction quality:
 * - pretonic: host stress on syllable 0 (adjacent to stress)
 * - remote: host stress on syllable 1+ (not adjacent)
 *
 * @param line - Array of words in the current verse line
 * @param startIdx - Index of the proclitic to resolve
 * @returns Chain result with host index and reduction position
 */
export function resolveCliticChain(
  line: ChainWord[],
  startIdx: number,
): CliticChainResult {
  let hostIdx = startIdx + 1;
  let scanCount = 0;

  while (
    hostIdx < line.length &&
    scanCount < MAX_CHAIN_SCAN &&
    GraysonEngine.proclitics.has(line[hostIdx].cleanWord.toLowerCase())
  ) {
    hostIdx++;
    scanCount++;
  }

  // If we hit the bound or end of line, treat whatever is at hostIdx
  // as the host (best-effort) or null if past the array
  if (hostIdx >= line.length) {
    return { hostIndex: null, hostStress: -2, position: null };
  }

  const hostStress = line[hostIdx].stress;
  const position: ProcliticPosition =
    hostStress === 0
      ? { type: 'pretonic' }
      : { type: 'remote' };

  return { hostIndex: hostIdx, hostStress, position };
}
