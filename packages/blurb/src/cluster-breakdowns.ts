/**
 * @ilya/blurb – Cluster Breakdowns
 *
 * Maps cluster strings to per-character entries for educational display.
 * Used by buildDisplayLog() to expand cluster log entries into individual
 * character rows in the inspector ribbon.
 *
 * Two formats:
 * - Array format: each character has its own IPA (silent letters, sibilant mergers)
 * - Merged format: both characters produce a single shared IPA (сч, зч → щ sound)
 */

import type { TranscriptionFeatures } from './types';

/** A single character within a cluster breakdown (array format) */
export interface ClusterCharEntry {
  char: string;
  ipa: string;
  features: TranscriptionFeatures;
}

/** Members of a merged cluster (no individual IPA) */
export interface MergedClusterMember {
  char: string;
  features: TranscriptionFeatures;
}

/** A merged cluster breakdown */
export interface MergedClusterBreakdown {
  type: 'merged';
  mergedIpa: string;
  members: MergedClusterMember[];
}

/** Either an array of character entries or a merged cluster */
export type ClusterBreakdown = ClusterCharEntry[] | MergedClusterBreakdown;

/** Type guard for merged clusters */
export function isMergedCluster(
  breakdown: ClusterBreakdown
): breakdown is MergedClusterBreakdown {
  return !Array.isArray(breakdown) && breakdown.type === 'merged';
}

/**
 * Cluster breakdown definitions for educational display.
 * Keyed by the cluster string as it appears in the transcription log.
 */
export const CLUSTER_BREAKDOWNS: Record<string, ClusterBreakdown> = {
  // Silent consonant clusters (Grayson pp. 235-236)
  'рдц': [
    { char: 'р', ipa: 'r', features: { type: 'consonant', soft: false } },
    { char: 'д', ipa: '', features: { type: 'consonant', silent: true, deletionCluster: true, clusterSource: 'рдц' } },
    { char: 'ц', ipa: 'ts', features: { type: 'consonant', soft: false, alwaysHard: true } },
  ],
  'лнц': [
    { char: 'л', ipa: '', features: { type: 'consonant', silent: true, deletionCluster: true, clusterSource: 'лнц' } },
    { char: 'н', ipa: 'n', features: { type: 'consonant', soft: false } },
    { char: 'ц', ipa: 'ts', features: { type: 'consonant', soft: false, alwaysHard: true } },
  ],
  'вств': [
    { char: 'в', ipa: '', features: { type: 'consonant', silent: true, deletionCluster: true, clusterSource: 'вств' } },
    { char: 'с', ipa: 's', features: { type: 'consonant', soft: false } },
    { char: 'т', ipa: 't', features: { type: 'consonant', soft: false } },
    { char: 'в', ipa: 'v', features: { type: 'consonant', soft: false } },
  ],

  // Geminate simplification (Grayson p. 233)
  'сс': [
    { char: 'с', ipa: 's', features: { type: 'consonant', soft: false } },
    { char: 'с', ipa: '', features: { type: 'consonant', silent: true, geminateSimplified: true } },
  ],

  // Assimilated clusters — TRUE MERGERS (Grayson pp. 230-231)
  // Both letters merge into ONE sound — use merged display
  'сч': {
    type: 'merged',
    mergedIpa: 'ʃʲʃʲ',
    members: [
      { char: 'с', features: { type: 'consonant', soft: true, clusterAssimilation: true } },
      { char: 'ч', features: { type: 'consonant', soft: true, alwaysSoft: true } },
    ],
  },
  'зч': {
    type: 'merged',
    mergedIpa: 'ʃʲʃʲ',
    members: [
      { char: 'з', features: { type: 'consonant', soft: true, clusterAssimilation: true } },
      { char: 'ч', features: { type: 'consonant', soft: true, alwaysSoft: true } },
    ],
  },

  // Sibilant mergers (Grayson pp. 235-236)
  'сш': [
    { char: 'с', ipa: '', features: { type: 'consonant', silent: true, sibilantMerger: true, mergesInto: 'ш' } },
    { char: 'ш', ipa: 'ʃː', features: { type: 'consonant', soft: false, alwaysHard: true, receivesLength: true } },
  ],
  'зш': [
    { char: 'з', ipa: '', features: { type: 'consonant', silent: true, sibilantMerger: true, mergesInto: 'ш', devoices: true } },
    { char: 'ш', ipa: 'ʃː', features: { type: 'consonant', soft: false, alwaysHard: true, receivesLength: true } },
  ],
  'сж': [
    { char: 'с', ipa: '', features: { type: 'consonant', silent: true, sibilantMerger: true, mergesInto: 'ж', voices: true } },
    { char: 'ж', ipa: 'ʒː', features: { type: 'consonant', soft: false, alwaysHard: true, receivesLength: true } },
  ],
  'зж': [
    { char: 'з', ipa: '', features: { type: 'consonant', silent: true, sibilantMerger: true, mergesInto: 'ж' } },
    { char: 'ж', ipa: 'ʒː', features: { type: 'consonant', soft: false, alwaysHard: true, receivesLength: true } },
  ],

  // Word-specific чн → шн (Grayson p. 239)
  'чн': [
    { char: 'ч', ipa: 'ʃ', features: { type: 'consonant', soft: false, clusterAssimilation: true } },
    { char: 'н', ipa: 'n', features: { type: 'consonant', soft: false } },
  ],

  // Word-specific чт → шт (Grayson p. 240)
  'чт': [
    { char: 'ч', ipa: 'ʃ', features: { type: 'consonant', soft: false, clusterAssimilation: true } },
    { char: 'т', ipa: 't', features: { type: 'consonant', soft: false } },
  ],
};
