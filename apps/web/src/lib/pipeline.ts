/**
 * Text processing pipeline for Ilya.
 *
 * This module orchestrates the three Phase 1 packages to transform
 * Russian text into fully annotated transcription data. It replicates
 * the prototype's InputManager.transcribe() + InputManager.transcribeAllLines()
 * logic as a single processText() function.
 *
 * Architectural guardrail: this file is the ONLY place in the app
 * that imports from @ilya/phonology, @ilya/dictionary, and @ilya/blurb.
 * Components receive prepared data via props.
 */

import {
  GraysonEngine,
  DEFAULT_ENGINE_CONFIG,
} from '@ilya/phonology';
import type {
  EngineConfig,
  TranscriptionResult,
  SyllableData,
} from '@ilya/phonology';

import {
  formatGlossForDisplay,
  extractGloss,
  addStressMarkToCyrillic,
} from '@ilya/dictionary';
import type { GlossLanguage } from '@ilya/dictionary';

import { buildDisplayLog } from '@ilya/blurb';

import type { WordStackData, LineData, ProcessTextOptions } from './types';

// ── Constants ────────────────────────────────────────────────────

const PUNCTUATION_REGEX = /[.,!?;:"""''–—]/g;
const TRAILING_PUNCT_REGEX = /[.,!?;:"""'']+$/;
const DASH_REGEX = /[-–—]/g;

const CYRILLIC_VOWELS = new Set([
  'а', 'е', 'ё', 'и', 'о', 'у', 'ы', 'э', 'ю', 'я',
  'А', 'Е', 'Ё', 'И', 'О', 'У', 'Ы', 'Э', 'Ю', 'Я',
]);

function hasVowel(word: string): boolean {
  return Array.from(word).some((char) => CYRILLIC_VOWELS.has(char));
}

// ── Intermediate types (internal to pipeline) ────────────────────

/** Word data after stress lookup, before engine transcription. */
interface PreTranscribeWord {
  cyrillic: string;
  cleanWord: string;
  punctuation: string;
  stress: number;
  stressSource: string;
  gloss: string;
  pos: string;
  lemma: string;
  isHomograph: boolean;
  originalInput: string | null;
  dictionaryForm: string | null;
  yoSource: string | null;
  hasYo: boolean;
  rightBoundary: string | null;
  boundarySource: string | null;
}

/** Word data after engine transcription, used for cross-word assimilation. */
interface TranscribedWord {
  wordData: PreTranscribeWord;
  wordIdx: number;
  lineIdx: number;
  cleanWord: string;
  punct: string;
  isProclitic: boolean;
  isEnclitic: boolean;
  isOInterjection: boolean;
  isFirstWord: boolean;
  lineEndsWithQuestion: boolean;
  procliticPosition: string | null;
  hasYo: boolean;
  /** Raw engine result (syllables and transcriptionLog may be mutated in place). */
  engineResult: TranscriptionResult;
  syllables: SyllableData[];
  ipaUnderlying: string;
  transcriptionLog: any[];
  ipaSurface: string | null;
  skipFinalDevoicing: boolean;
  rightBoundary: string | null;
  boundarySource: string | null;
  ipaContent?: string;
  ipaDisplay?: string;
  isVowellessClitic?: boolean;
}

// ── Main pipeline ────────────────────────────────────────────────

/**
 * Process Russian text into fully annotated transcription data.
 *
 * This is the single entry point for the transcription loop.
 * Call it when the user clicks Transcribe.
 *
 * @param text - Raw Russian text (may contain multiple lines)
 * @param options - Engine config and display language
 * @returns Array of LineData, one per non-empty input line
 */
export function processText(
  text: string,
  options: ProcessTextOptions = {},
): LineData[] {
  const {
    engineConfig = DEFAULT_ENGINE_CONFIG,
    language = 'en' as GlossLanguage,
  } = options;

  if (!text.trim()) return [];

  // ── Step 1: Split into lines, build pre-transcribe word data ──

  const rawLines = text.split('\n').filter((line) => line.trim());

  const preLines: PreTranscribeWord[][] = rawLines
    .map((line) => {
      const words = line
        .trim()
        .split(/\s+/)
        .filter((word) => {
          const cleaned = word.replace(PUNCTUATION_REGEX, '');
          return cleaned.length > 0;
        });

      return words.map((word) => buildPreTranscribeWord(word));
    })
    .filter((line) => line.length > 0);

  // ── Step 2: Auto-detect boundaries per line ───────────────────

  preLines.forEach((line) => {
    autoDetectBoundaries(line);
  });

  // ── Step 3: Transcribe each line with cross-word assimilation ─

  const lineDataArray: LineData[] = preLines.map((preLine, lineIdx) => {
    const transcribedWords = transcribeLine(preLine, lineIdx, engineConfig);

    // ── Step 4: Build final WordStackData for each word ─────────

    const wordStackDataArray: WordStackData[] = transcribedWords.map(
      (tw, wordIdx) => {
        const displayLog = buildDisplayLog(tw.transcriptionLog);

        // Gloss: clitics use their canonical gloss; regular words use the pipeline
        let gloss: string;
        if (tw.isProclitic || tw.isEnclitic) {
          const cliticEntry = GraysonEngine.cliticData.get(
            tw.cleanWord.toLowerCase(),
          );
          gloss = extractGloss(cliticEntry?.gloss ?? null, language);
        } else {
          gloss = formatGlossForDisplay(
            tw.wordData.gloss,
            tw.wordData.pos,
            tw.wordData.lemma,
            tw.cleanWord,
            language,
          );
        }

        const stressedCyrillic = addStressMarkToCyrillic(
          tw.cleanWord,
          tw.wordData.stress,
        );

        return {
          cyrillic: tw.wordData.cyrillic,
          cleanWord: tw.cleanWord,
          punctuation: tw.punct,
          stressIndex: tw.wordData.stress,
          stressSource: tw.wordData.stressSource,
          stressedCyrillic,
          result: tw.engineResult,
          ipaDisplay: tw.ipaDisplay ?? tw.ipaContent ?? '',
          ipaContent: tw.ipaContent ?? '',
          displayLog,
          gloss,
          isProclitic: tw.isProclitic,
          isEnclitic: tw.isEnclitic,
          isVowellessClitic: tw.isVowellessClitic ?? false,
          hasYo: tw.hasYo,
          isOInterjection: tw.isOInterjection,
          rightBoundary: tw.rightBoundary,
          boundarySource: tw.boundarySource,
          pos: tw.wordData.pos,
          lemma: tw.wordData.lemma,
          isHomograph: tw.wordData.isHomograph,
          originalInput: tw.wordData.originalInput,
          dictionaryForm: tw.wordData.dictionaryForm,
          yoSource: tw.wordData.yoSource,
          wordIndex: wordIdx,
          lineIndex: lineIdx,
        };
      },
    );

    return {
      lineNumber: lineIdx,
      words: wordStackDataArray,
    };
  });

  return lineDataArray;
}

// ── Step 1 helper: stress lookup and ё restoration ──────────────

function buildPreTranscribeWord(rawWord: string): PreTranscribeWord {
  // Normalize NFC so precomposed ё is preserved, then strip combining acutes
  const word = rawWord.normalize('NFC').replace(/\u0301/g, '');

  // Extract trailing punctuation
  const trailingPunctMatch = word.match(TRAILING_PUNCT_REGEX);
  const punctuation = trailingPunctMatch ? trailingPunctMatch[0] : '';

  const lookup = GraysonEngine.lookupStress(word);

  let displayWord = word;
  let wasYoRestored = false;
  let dictionaryForm: string | null = null;

  if (lookup?.source === 'yo-restored' && lookup.canonicalForm) {
    displayWord = GraysonEngine.applyCasePattern(word, lookup.canonicalForm);
    dictionaryForm = displayWord;
    wasYoRestored = true;
  }

  const yoSyllable = GraysonEngine.findYoSyllable(displayWord);

  let stress: number;
  let stressSource: string;
  let yoSource: string | null;

  if (yoSyllable !== -1) {
    stress = yoSyllable;
    stressSource = wasYoRestored ? 'yo-restored' : 'yo-rule';
    yoSource = wasYoRestored ? 'yo-restored' : null;
  } else if (lookup && lookup.stress != null && lookup.stress >= 0) {
    stress = lookup.stress;
    stressSource = lookup.source;
    yoSource = null;
  } else {
    // No stress data: -2 signals unknown. All vowels render cardinal,
    // no stress mark displayed. VERIFY badge shows via stressSource 'inferred'.
    stress = -2;
    stressSource = 'inferred';
    yoSource = null;
  }

  // Clean word for pipeline use (strip punctuation and dashes)
  const cleanWord = displayWord
    .replace(PUNCTUATION_REGEX, '')
    .replace(DASH_REGEX, '');

  return {
    cyrillic: displayWord,
    cleanWord,
    punctuation,
    stress,
    stressSource,
    gloss: lookup ? lookup.gloss ?? '' : '',
    pos: lookup ? lookup.pos ?? '' : '',
    lemma: lookup ? lookup.lemma ?? '' : '',
    isHomograph: lookup ? lookup.isHomograph ?? false : false,
    originalInput: wasYoRestored ? rawWord : null,
    dictionaryForm,
    yoSource,
    hasYo: yoSyllable !== -1,
    rightBoundary: null,
    boundarySource: null,
  };
}

// ── Step 2 helper: boundary detection ───────────────────────────

/**
 * Auto-detect word boundaries within a line.
 * Mirrors GraysonEngine.autoDetectBoundaries() but operates on
 * PreTranscribeWord[] before engine transcription.
 */
function autoDetectBoundaries(words: PreTranscribeWord[]): void {
  const punctuationRegex = /[.,!?;:"""''–—]$/;

  words.forEach((word, i) => {
    // Preserve user-set boundaries (future feature)
    if (word.boundarySource === 'user') return;

    const isLastWord = i === words.length - 1;
    const cleanLower = word.cleanWord.toLowerCase();
    const hasPunctuation = punctuationRegex.test(word.cyrillic);
    const isProclitic = GraysonEngine.proclitics.has(cleanLower);

    // Check if next word is enclitic
    const nextWord = words[i + 1];
    const nextCleanLower = nextWord ? nextWord.cleanWord.toLowerCase() : null;
    const nextIsEnclitic =
      nextCleanLower != null && GraysonEngine.enclitics.has(nextCleanLower);

    // Apply rules in priority order
    if (isLastWord) {
      word.rightBoundary = 'hard';
      word.boundarySource = 'auto';
    } else if (hasPunctuation) {
      word.rightBoundary = 'hard';
      word.boundarySource = 'punctuation';
    } else if (isProclitic) {
      word.rightBoundary = 'clitic';
      word.boundarySource = 'auto';
    } else if (nextIsEnclitic) {
      word.rightBoundary = 'clitic';
      word.boundarySource = 'auto';
    } else {
      // Default: SOFT -- assimilation happens automatically
      word.rightBoundary = 'soft';
      word.boundarySource = 'auto';
    }
  });
}

// ── Step 3: per-line transcription with cross-word assimilation ──

function transcribeLine(
  preLine: PreTranscribeWord[],
  lineIdx: number,
  engineConfig: EngineConfig,
): TranscribedWord[] {
  // Build line text for context detection
  const lineText = preLine.map((w) => w.cyrillic).join(' ');
  const lineEndsWithQuestion = /\?$/.test(lineText.trim());

  // Transcribe each word
  const transcribedWords: TranscribedWord[] = preLine.map(
    (wordData, wordIdx) => {
      const cleanWord = wordData.cleanWord;
      const cleanLower = cleanWord.toLowerCase();

      const isFirstWord = wordIdx === 0;

      // Detect о as interjection vs. preposition
      const isOWord = cleanLower === 'о';
      const hasPunctAfter = /[,!]/.test(wordData.punctuation);
      const isOInterjection =
        isOWord && (hasPunctAfter || (isFirstWord && !lineEndsWithQuestion));

      const isProclitic =
        !isOInterjection && GraysonEngine.proclitics.has(cleanLower);
      const isEnclitic = GraysonEngine.enclitics.has(cleanLower);

      // Determine proclitic reduction position relative to host stress
      let procliticPosition: string | null = null;
      if (isProclitic && wordIdx < preLine.length - 1) {
        const nextWord = preLine[wordIdx + 1];
        const nextStress = nextWord.stress;
        procliticPosition = nextStress === 0 ? 'pretonic' : 'remote';
      }

      // Clitic stress is -1 (unstressed)
      const effectiveStress =
        isProclitic || isEnclitic ? -1 : wordData.stress;

      // Call the engine
      const engineResult = GraysonEngine.transcribe(
        cleanWord,
        effectiveStress,
        isProclitic || isEnclitic,
        procliticPosition,
        engineConfig,
      );

      return {
        wordData,
        wordIdx,
        lineIdx,
        cleanWord,
        punct: wordData.punctuation,
        isProclitic,
        isEnclitic,
        isOInterjection,
        isFirstWord,
        lineEndsWithQuestion,
        procliticPosition,
        hasYo: wordData.hasYo,
        engineResult,
        syllables: engineResult.syllables,
        ipaUnderlying: engineResult.ipaUnderlying,
        transcriptionLog: engineResult.transcriptionLog,
        ipaSurface: null,
        skipFinalDevoicing: false,
        rightBoundary: wordData.rightBoundary,
        boundarySource: wordData.boundarySource,
      };
    },
  );

  // ── Cross-word assimilation ──

  GraysonEngine.applyCrossWordAssimilation(transcribedWords);

  // ── Post-process: update syllable IPA after assimilation ──

  transcribedWords.forEach((tw) => {
    if (tw.ipaSurface !== tw.ipaUnderlying && tw.syllables.length > 0) {
      const lastSyl = tw.syllables[tw.syllables.length - 1];
      const underlyingConcat = tw.syllables.map((s: SyllableData) => s.ipa).join('');
      const surfaceClean = (tw.ipaSurface ?? '').replace(/[ˈ\s]+/g, '');
      const prefixLen = underlyingConcat.length - lastSyl.ipa.length;

      if (surfaceClean.length >= prefixLen) {
        const newLastSylIpa = surfaceClean.slice(prefixLen);
        lastSyl.ipa = newLastSylIpa;

        // Update transcription log: mark final consonant as devoiced
        if (tw.transcriptionLog && tw.transcriptionLog.length > 0) {
          for (let i = tw.transcriptionLog.length - 1; i >= 0; i--) {
            const entry = tw.transcriptionLog[i];
            if (entry.features && entry.features.type === 'consonant') {
              const devoicingMap = GraysonEngine.voicedToVoiceless;
              if (devoicingMap[entry.ipa]) {
                entry.ipa = devoicingMap[entry.ipa];
                entry.features.finalDevoicing = true;
              }
              break;
            }
          }
        }
      }
    }

    // Build ipaContent from syllable data (preserves intersyllabic spaces)
    const ipaCore = tw.syllables
      .map((s: SyllableData) => (s.isStressed ? 'ˈ' + s.ipa : s.ipa))
      .join(' ');
    tw.ipaContent = ipaCore;
    tw.ipaDisplay = ipaCore;
  });

  // ── Clitic display merging ──

  // First pass: resolve vowelless clitic IPA
  transcribedWords.forEach((tw) => {
    if (tw.isProclitic || tw.isEnclitic) {
      const isVowelless = !hasVowel(tw.cleanWord);
      if (isVowelless) {
        if (tw.ipaSurface !== tw.ipaUnderlying) {
          tw.ipaContent = tw.ipaSurface ?? '';
        } else {
          const cliticInfo = GraysonEngine.cliticData.get(
            tw.cleanWord.toLowerCase(),
          );
          tw.ipaContent = cliticInfo?.canonicalIpa || tw.ipaContent || '';
        }
      }
    }
  });

  // Second pass: merge clitic IPA into host words for display
  transcribedWords.forEach((tw, idx) => {
    if (tw.isProclitic) {
      const nextWord = transcribedWords[idx + 1];
      const isVowelless = !hasVowel(tw.cleanWord);

      tw.ipaDisplay = '→';
      tw.isVowellessClitic = isVowelless;

      if (nextWord && !nextWord.isProclitic) {
        if (isVowelless) {
          // Vowelless proclitic: tuck IPA into host's stressed syllable
          if (nextWord.ipaDisplay?.startsWith('ˈ')) {
            nextWord.ipaDisplay =
              'ˈ' + tw.ipaContent + nextWord.ipaDisplay!.slice(1);
          } else {
            nextWord.ipaDisplay = tw.ipaContent + nextWord.ipaDisplay;
          }
        } else {
          // Vowel-bearing proclitic: separate with space
          nextWord.ipaDisplay = tw.ipaContent + ' ' + nextWord.ipaDisplay;
        }
      }
    } else if (tw.isEnclitic) {
      const prevWord = transcribedWords[idx - 1];
      const isVowelless = !hasVowel(tw.cleanWord);

      tw.ipaDisplay = '←';
      tw.isVowellessClitic = isVowelless;

      if (prevWord && !prevWord.isEnclitic) {
        if (isVowelless) {
          prevWord.ipaDisplay = (prevWord.ipaDisplay ?? '') + tw.ipaContent;
        } else {
          prevWord.ipaDisplay =
            (prevWord.ipaDisplay ?? '') + ' ' + tw.ipaContent;
        }
      }
    }
  });

  return transcribedWords;
}

// ── Re-export for convenience ────────────────────────────────────

export { applyNotationPreferences } from '@ilya/phonology';
export type { NotationPreferences, EngineConfig } from '@ilya/phonology';
export type { GlossLanguage } from '@ilya/dictionary';
