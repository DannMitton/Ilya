/**
 * @ilya/blurb – Type Definitions
 *
 * Types for the IPI (Identity-Process-Implication) blurb composition system.
 */

// ---------------------------------------------------------------------------
// Blurb data structures (loaded from blurb-composer.json)
// ---------------------------------------------------------------------------

/** A single language entry in an IPI layer (identity, process, or implication) */
export interface IpiLangEntry {
  template: string;
  citation?: string;
}

/** An identity entry: per-character data with optional selfSufficient flag */
export interface IdentityEntry {
  en?: IpiLangEntry;
  fr?: IpiLangEntry;
  selfSufficient?: boolean;
}

/** A process entry: per-rule:char data with optional standalone flag */
export interface ProcessEntry {
  en?: IpiLangEntry;
  fr?: IpiLangEntry;
  standalone?: boolean;
}

/** An implication entry: optional educational follow-up */
export interface ImplicationEntry {
  en?: IpiLangEntry;
  fr?: IpiLangEntry;
}

/** Citation style configuration from blurb-composer.json */
export interface CitationStyle {
  en?: {
    template: string;
    singular: string;
    plural: string;
    separator: string;
  };
}

/** The full blurb-composer.json data structure */
export interface BlurbData {
  identities: Record<string, IdentityEntry>;
  processes: Record<string, ProcessEntry>;
  implications?: Record<string, ImplicationEntry>;
  citation_style?: CitationStyle;
}

// ---------------------------------------------------------------------------
// Transcription log entry (input to the blurb system)
// ---------------------------------------------------------------------------

/** Features attached to a transcription log entry */
export interface TranscriptionFeatures {
  type?: 'vowel' | 'consonant' | 'sign' | 'cluster' | 'glide';
  position?: 'stressed' | 'pretonic' | 'initial' | 'posttonic-immediate' | 'remote';
  interpalatal?: boolean;
  afterHard?: boolean;
  exception?: string;
  soft?: boolean;
  signType?: 'soft' | 'hard';
  source?: string;
  triggeredBy?: string;
  trigger?: string;
  clusterSource?: string;
  silent?: boolean;
  deletionCluster?: boolean;
  voicingAssimilation?: boolean;
  devoiced?: boolean;
  voiced?: boolean;
  finalDevoicing?: boolean;
  genitiveEnding?: boolean;
  bogException?: boolean;
  alwaysHard?: boolean;
  alwaysSoft?: boolean;
  clusterAssimilation?: boolean;
  sibilantMerger?: boolean;
  mergesInto?: string;
  voices?: boolean;
  devoices?: boolean;
  receivesLength?: boolean;
  geminateSimplified?: boolean;
  jGlideMerged?: boolean;
  [key: string]: unknown;
}

/** A single entry in the transcription log (from the phonology engine) */
export interface TranscriptionLogEntry {
  char: string;
  ipa: string;
  features: TranscriptionFeatures;
  syllableIndex?: number;
  position?: number;
}

// ---------------------------------------------------------------------------
// Blurb output
// ---------------------------------------------------------------------------

/** A bilingual blurb string */
export interface BilingualBlurb {
  en?: string;
  fr?: string;
  [key: string]: string | undefined;
}

/** The result of composing a blurb */
export interface BlurbResult {
  blurb: BilingualBlurb | string;
  citation: string | null;
  notable: boolean;
}

/** A display log entry (transcription log entry enriched with blurb data) */
export interface DisplayLogEntry extends TranscriptionLogEntry {
  blurbData?: BlurbResult;
  clusterSource?: string;
  clusterMerged?: boolean;
  clusterStart?: boolean;
  clusterEnd?: boolean;
  clusterContinuation?: boolean;
}
