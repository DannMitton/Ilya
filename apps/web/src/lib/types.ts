/**
 * Shared data interfaces for the Ilya rebuild.
 *
 * These types define the data structures that flow from pipeline.ts
 * into Svelte components. Components receive prepared data via props;
 * they never import engine functions directly.
 */

import type {
  TranscriptionResult,
  EngineConfig,
} from '@ilya/phonology';
import type { DisplayLogEntry } from '@ilya/blurb';
import type { GlossLanguage } from '@ilya/dictionary';

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

  /** Engine transcription result (raw output from GraysonEngine.transcribe). */
  result: TranscriptionResult;
  /** Final IPA for display (after cross-word assimilation and clitic merging). */
  ipaDisplay: string;
  /** IPA content before clitic display merging (used for clitic prepend/append). */
  ipaContent: string;

  /** Display log entries from @ilya/blurb (for Inspector ribbon). */
  displayLog: DisplayLogEntry[];
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
}
