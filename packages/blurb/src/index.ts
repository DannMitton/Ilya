/**
 * @ilya/blurb – Public API
 *
 * IPI (Identity-Process-Implication) blurb composition system.
 * Composes context-aware educational blurbs for the inspector ribbon.
 *
 * Usage:
 *   import { setBlurbData, composeBlurb, deriveRule, buildDisplayLog } from '@ilya/blurb';
 *
 *   // After loading blurb-composer.json:
 *   setBlurbData(jsonData);
 *
 *   // Compose a blurb for a single entry:
 *   const result = composeBlurb(transcriptionLogEntry);
 *
 *   // Build the full display log for the inspector ribbon:
 *   const displayLog = buildDisplayLog(transcriptionLog);
 */

// Composer functions
export {
  setBlurbData,
  getBlurbData,
  substituteVars,
  formatCitations,
  deriveRule,
  deriveRuleStandard,
  composeBlurb,
  lookupBlurb,
  lookupClusterCharBlurb,
  mergeJGlidePairs,
  buildDisplayLog,
} from './composer';

// Cluster breakdowns data
export {
  CLUSTER_BREAKDOWNS,
  isMergedCluster,
} from './cluster-breakdowns';

// Types
export type {
  BlurbData,
  BlurbResult,
  BilingualBlurb,
  TranscriptionFeatures,
  TranscriptionLogEntry,
  DisplayLogEntry,
  IdentityEntry,
  ProcessEntry,
  ImplicationEntry,
  CitationStyle,
  IpiLangEntry,
} from './types';

export type {
  ClusterBreakdown,
  ClusterCharEntry,
  MergedClusterBreakdown,
  MergedClusterMember,
} from './cluster-breakdowns';
