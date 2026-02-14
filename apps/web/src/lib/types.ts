/**
 * Shared data interfaces for the Ilya rebuild.
 *
 * These types define the data structures that flow from pipeline.ts
 * into Svelte components. Components receive prepared data via props;
 * they never import engine functions directly.
 */

import type {
  TranscriptionResult,
  SyllableData,
  EngineConfig,
} from '@ilya/phonology';
import type { DisplayLogEntry } from '@ilya/blurb';
import type { GlossLanguage } from '@ilya/dictionary';

// ── User overrides ───────────────────────────────────────────────

/** User stress override for a specific word (keyed by "lineIndex-wordIndex"). */
export interface UserStressOverride {
  stressIndex: number;
  stressSource: 'user-dictionary' | 'user-composer' | 'user-override';
}

/** Character-level ё toggle (keyed by "lineIndex-wordIndex-charIndex"). */
export interface YoToggle {
  source: 'user-dictionary' | 'user-composer' | 'user-override';
}

// ── Pipeline output ──────────────────────────────────────────────

/** A single word fully processed for rendering. */
export interface WordStackData {
  /** Original Cyrillic as entered (with ё restored if applicable). */
  cyrillic: string;
  /** Cyrillic stripped of punctuation and dashes. */
  cleanWord: string;
  /** Trailing punctuation stripped from the word. */
  punctuation: string;
  /** Stress index (0-based syllable). -1 = clitic, -2 = unknown. */
  stressIndex: number;
  /** Where stress came from: dictionary, supplement, yo-rule, yo-restored, inferred. */
  stressSource: string;
  /** Cyrillic with combining acute on stressed vowel. */
  stressedCyrillic: string;

  /** Engine's original stress assignment before any user override. */
  originalStressIndex: number;
  /** Engine's original stress source before any user override. */
  originalStressSource: string;
  /** Whether ё ↔ е toggle is available for this word. */
  yoAlternation: boolean;
  /** The other form (not currently displayed) for ё ↔ е toggle. Null if no alternation. */
  yoAlternateForm: string | null;

  /** Engine transcription result (raw output from GraysonEngine.transcribe). */
  result: TranscriptionResult;
  /** Final IPA for display (after cross-word assimilation and clitic merging). */
  ipaDisplay: string;
  /**
   * IPA with vowel reconstitution applied (Grayson Ch. 3, §8).
   * Pre-computed at pipeline time using the transcription log for
   * source-character disambiguation. Clitic merging applied in parallel
   * with ipaDisplay so the two strings have identical structure.
   */
  ipaReconstituted: string;
  /** IPA content before clitic display merging (used for clitic prepend/append). */
  ipaContent: string;
  /** IPA with reconstitution applied, before clitic merging (for Inspector analysis). */
  ipaOwnReconstituted: string;

  /** Display log entries from @ilya/blurb (for Inspector ribbon). */
  displayLog: DisplayLogEntry[];
  /** Per-syllable transcription data from the engine (for Ribbon groupings). */
  syllables: SyllableData[];
  /** Formatted gloss string for display. */
  gloss: string;

  /** True if this word is a proclitic (в, на, об, ...). */
  isProclitic: boolean;
  /** True if this word is an enclitic (ли, же, бы, ...). */
  isEnclitic: boolean;
  /** True if this clitic has no vowel (в, к, с, ...). */
  isVowellessClitic: boolean;
  /** True if word contains ё. */
  hasYo: boolean;
  /** True if word is о used as interjection (not preposition). */
  isOInterjection: boolean;

  /** Right boundary type: hard, soft, clitic. */
  rightBoundary: string | null;
  /** How boundary was determined: auto, punctuation, user. */
  boundarySource: string | null;

  /** Part of speech from dictionary lookup. */
  pos: string;
  /** Lemma from dictionary lookup. */
  lemma: string;
  /** True if word has multiple dictionary entries. */
  isHomograph: boolean;
  /** Original input before ё restoration (null if no restoration). */
  originalInput: string | null;
  /** Dictionary form after ё restoration (null if no restoration). */
  dictionaryForm: string | null;
  /** Source of ё: yo-restored or null. */
  yoSource: string | null;

  /** Position in the line (0-based). */
  wordIndex: number;
  /** Position of the line (0-based). */
  lineIndex: number;
}

/** A single line of transcribed words. */
export interface LineData {
  lineNumber: number;
  words: WordStackData[];
}

// ── Pipeline input ───────────────────────────────────────────────

/** Options for processText(). */
export interface ProcessTextOptions {
  engineConfig?: EngineConfig;
  language?: GlossLanguage;
  /** User stress overrides keyed by "lineIndex-wordIndex". */
  userStressOverrides?: Map<string, UserStressOverride>;
  /** Character-level ё ↔ е toggles keyed by "lineIndex-wordIndex-charIndex". */
  yoToggles?: Map<string, YoToggle>;
}

// ── WYSIWYG Paper ────────────────────────────────────────────────

/** Page size options. */
export type PageSize = 'letter' | 'a4';

/** Dimensions in pixels at 96dpi. */
export const PAGE_DIMENSIONS: Record<PageSize, { width: number; height: number }> = {
  letter: { width: 816, height: 1056 },
  a4: { width: 794, height: 1123 },
};

/** Song metadata for page headers and footers. */
export interface SongMetadata {
  title: string;
  composer: string;
  poet: string;
  opus: string;
  transcriber: string;
}

/** A page of distributed verse lines. */
export interface Page {
  /** 0-based page index. */
  pageIndex: number;
  /** 'title' for page 1, 'subsequent' for pages 2+. */
  template: 'title' | 'subsequent';
  /** Verse lines assigned to this page. */
  lines: LineData[];
  /** Maximum lines before overflow fallback. */
  maxLines: number;
  /** Fallback line count if overflow detected. */
  fallbackLines: number;
}
