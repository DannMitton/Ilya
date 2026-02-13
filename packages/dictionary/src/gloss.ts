/**
 * @ilya/dictionary – Gloss Pipeline
 *
 * Functions for extracting, cleaning, formatting, and truncating
 * dictionary glosses for display in the word stack.
 *
 * The pipeline handles:
 * - Bilingual {en, fr} gloss objects
 * - Verbose kaikki.org grammatical descriptions
 * - Semicolon-separated multi-sense entries
 * - Lemma fallback for inflected forms
 * - Curated gloss overrides for common words
 * - Truncation to word/character limits for display
 *
 * Design note: In the prototype, these functions read the global
 * `currentGlossLanguage`. In the extracted version, language is
 * an explicit parameter (default: 'en'). This makes the functions
 * pure and testable without global state.
 */

import type { BilingualGloss, GlossLanguage, StressDictionary } from './types';
import { CURATED_GLOSSES } from './curated-glosses';

// ---------------------------------------------------------------------------
// Module-level dictionary reference (for lemma fallback lookups)
// ---------------------------------------------------------------------------

let _dictionary: StressDictionary = {};

/**
 * Set the dictionary reference used by getLemmaGloss() for lemma fallback.
 * Call this after loading the dictionary, before using formatGlossForDisplay().
 */
export function setGlossDictionary(dict: StressDictionary): void {
  _dictionary = dict;
}

// ---------------------------------------------------------------------------
// extractGloss — Resolve bilingual objects to a string
// ---------------------------------------------------------------------------

/**
 * Extract gloss in the specified language from bilingual format.
 * Handles both legacy string format and bilingual {en, fr} objects.
 *
 * Returns empty string when the target language is unavailable.
 * Blank glosses leave space for pencil users on the printed page.
 *
 * @param g - A gloss value: string, BilingualGloss object, or null/undefined
 * @param language - Target language ('en' or 'fr')
 * @returns The resolved gloss string, or '' if unavailable
 */
export function extractGloss(
  g: string | BilingualGloss | null | undefined,
  language: GlossLanguage = 'en'
): string {
  if (!g) return '';

  // String format = English-only (legacy kaikki.org entries)
  if (typeof g === 'string') {
    // French users get blank for English-only strings.
    // The lemma fallback in formatGlossForDisplay will attempt
    // to find a French gloss via the base form.
    return language === 'fr' ? '' : g;
  }

  // Object format = bilingual {en, fr}
  if (typeof g === 'object') {
    if (language === 'fr') {
      return g.fr || '';
    }
    return g.en || g.fr || '';
  }

  return '';
}

// ---------------------------------------------------------------------------
// extractCleanGloss — Clean verbose dictionary glosses
// ---------------------------------------------------------------------------

/**
 * Extract clean translation from verbose dictionary glosses.
 * Handles patterns like "Usually translated as 'this'" -> "this".
 *
 * Applies semicolon splitting (takes first sense only),
 * pattern extraction, and parenthetical stripping.
 *
 * @param gloss - Raw gloss string from dictionary
 * @returns Cleaned gloss string
 */
export function extractCleanGloss(gloss: string): string {
  if (!gloss) return '';

  // Take only the first sense before semicolons (duplicate senses in kaikki.org)
  let working = gloss.split(';')[0].trim();

  // Strip trailing period (common in French Wiktionary entries)
  working = working.replace(/\.\s*$/, '');

  // Pattern: "translated as X" or "Translated as X" — extract X
  let match = working.match(/translated as ["']?([^"'.,;/]+)/i);
  if (match) return match[1].replace(/["']/g, '').trim();

  // Pattern: "diminutive of X: Y" or "augmentative of X: Y" -> extract Y
  match = working.match(
    /^(?:diminutive|augmentative|pejorative|endearing form) of [^:]+:\s*(.+)$/i
  );
  if (match) return match[1].trim();

  // Pattern: simple gloss followed by verbose parenthetical explanation
  // e.g., "I (first-person singular subject pronoun)" -> "I"
  // e.g., "house, building (a residential building)" -> "house, building"
  // But keep useful clarifications like "birch (tree or wood)"
  match = working.match(
    /^([^(]+)\s*\((?:a |the |first|second|third|singular|plural|subject|object|nominative|genitive|dative|accusative|masculine|feminine|neuter)[^)]*\)$/i
  );
  if (match) return match[1].trim();

  // Pattern: starts with linguistic jargon followed by simple gloss in parens
  // e.g., "proximal demonstrative (this)" but NOT "birch (tree or wood)"
  if (/^(mostly |generic |proximal |distal |demonstrative )/i.test(working)) {
    match = working.match(/\(([a-z][^)]{0,20})\)\s*$/i);
    if (match && !/\d/.test(match[1])) return match[1].trim();
  }

  // No extraction pattern matched — return first sense
  return working;
}

// ---------------------------------------------------------------------------
// isGrammatical — Detect verbose grammatical descriptions
// ---------------------------------------------------------------------------

/**
 * Test whether a gloss string is a grammatical description rather than
 * a semantic translation.
 *
 * Catches: inflection forms, case forms, alternative spellings,
 * participles, gerunds, transgressives, comparatives, superlatives.
 * Handles both English (kaikki.org via English Wiktionary) and
 * French (kaikki.org via French Wiktionary) patterns.
 *
 * @param gloss - Cleaned gloss string to test
 * @returns true if the gloss is a grammatical description
 */
export function isGrammatical(gloss: string): boolean {
  if (!gloss) return false;

  // English grammatical patterns (English Wiktionary via kaikki.org)
  if (
    /^(short |inflection of|nominative |genitive |dative |accusative |instrumental |prepositional |comparative |superlative |alternative (spelling|form) of)/i.test(
      gloss
    ) ||
    /\b(singular|plural)\s+(of|past|present|future)\b/i.test(gloss) ||
    /\b(participle|gerund|transgressive) of\b/i.test(gloss)
  ) {
    return true;
  }

  // French grammatical patterns (French Wiktionary via kaikki.org)
  if (
    /^(forme |flexion |inflexion |nominatif |g[ée]nitif |datif |accusatif |instrumental |pr[ée]positionnel |comparatif |superlatif |variante )/i.test(
      gloss
    ) ||
    /\b(singulier|pluriel)\s+(de|du|des)\b/i.test(gloss) ||
    /\b(participe|g[ée]rondif) (de|du|pass[ée]|pr[ée]sent)\b/i.test(gloss)
  ) {
    return true;
  }

  return false;
}

// ---------------------------------------------------------------------------
// extractLemmaFromGloss — Extract Cyrillic lemma from grammatical glosses
// ---------------------------------------------------------------------------

/**
 * Extract lemma from grammatical gloss text.
 * e.g., "short feminine singular past indicative perfective of уга́снуть (ugásnutʹ)" -> "угаснуть"
 * e.g., "forme féminine singulière de надежда" -> "надежда"
 *
 * Handles both English "of" and French "de/du/d'" prepositions.
 *
 * @param gloss - Raw gloss string potentially containing "of/de CYRILLIC_WORD"
 * @returns The extracted lowercase lemma, or null if not found
 */
export function extractLemmaFromGloss(gloss: string): string | null {
  if (!gloss) return null;

  // Pattern: "... of/de/du/d' CYRILLIC_WORD (transliteration)" or just "... of/de CYRILLIC_WORD"
  const match = gloss.match(/(?:of|de|du|d')\s+([а-яёА-ЯЁ\u0301]+)(?:\s*\(|$|\s|,)/i);
  if (match) {
    // Remove any combining accents from the extracted lemma
    return match[1]
      .normalize('NFC')
      .replace(/\u0301/g, '')
      .toLowerCase();
  }
  return null;
}

// ---------------------------------------------------------------------------
// getLemmaGloss — Look up semantic gloss for a lemma
// ---------------------------------------------------------------------------

/**
 * Look up the semantic gloss for a lemma in the dictionary.
 * Returns null if the lemma is not found or if its gloss is also grammatical.
 *
 * @param lemma - Lowercase Cyrillic lemma to look up
 * @returns The raw gloss value (string or BilingualGloss), or null
 */
export function getLemmaGloss(
  lemma: string
): string | BilingualGloss | null {
  if (!lemma) return null;

  const lemmaEntry = _dictionary[lemma];
  if (!lemmaEntry) return null;

  const entryGloss = Array.isArray(lemmaEntry)
    ? lemmaEntry[0].gloss ?? lemmaEntry[0].g ?? ''
    : lemmaEntry.gloss ?? lemmaEntry.g ?? '';

  // Don't return if it's also a grammatical description
  if (
    entryGloss &&
    typeof entryGloss === 'string' &&
    !isGrammatical(entryGloss)
  ) {
    return entryGloss;
  }

  // Also handle bilingual objects — check both sides for semantics
  if (entryGloss && typeof entryGloss === 'object') {
    const enGloss = (entryGloss as BilingualGloss).en || '';
    if (enGloss && !isGrammatical(enGloss)) {
      return entryGloss;
    }
    // English side is grammatical, but French side might be semantic
    const frGloss = (entryGloss as BilingualGloss).fr || '';
    if (frGloss && !isGrammatical(frGloss)) {
      return entryGloss;
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// truncateGloss — Enforce word and character limits
// ---------------------------------------------------------------------------

/**
 * Truncate gloss to N words max AND M characters max.
 * Strips all parenthetical content first. Removes dangling particles
 * after truncation (e.g., "to wander, to" -> "to wander").
 *
 * @param gloss - Cleaned gloss string to truncate
 * @param maxWords - Maximum number of words (default: 5)
 * @param maxChars - Maximum number of characters (default: 18)
 * @returns Truncated gloss string
 */
export function truncateGloss(
  gloss: string,
  maxWords: number = 5,
  maxChars: number = 18
): string {
  if (!gloss) return '';

  // First, strip ALL parenthetical content for word stack display
  let cleaned = gloss.replace(/\s*\([^)]*\)/g, ''); // Remove all parentheticals
  cleaned = cleaned.replace(/\s*\([^)]*$/, ''); // Remove unclosed parentheticals
  cleaned = cleaned.trim();

  // Word limit (no ellipsis)
  const words = cleaned.split(/\s+/);
  if (words.length > maxWords) {
    cleaned = words.slice(0, maxWords).join(' ');
  }

  // Character limit — truncate at word boundary, no ellipsis
  if (cleaned.length > maxChars) {
    const truncatedWords: string[] = [];
    let charCount = 0;
    for (const word of cleaned.split(/\s+/)) {
      if (
        charCount + word.length + (truncatedWords.length > 0 ? 1 : 0) <=
        maxChars
      ) {
        truncatedWords.push(word);
        charCount += word.length + (truncatedWords.length > 1 ? 1 : 0);
      } else {
        break;
      }
    }
    cleaned = truncatedWords.join(' ') || cleaned.slice(0, maxChars);
  }

  // Remove dangling particles after comma/semicolon
  // English: "to wander, to" -> "to wander"
  // French: "errer, de" -> "errer"
  cleaned = cleaned.replace(/[,;]\s+(to|a|the|of|in|on|for|and|or|de|du|des|le|la|les|un|une|et|ou)$/i, '');

  // Remove trailing punctuation for cleaner appearance
  cleaned = cleaned.replace(/[,;:]+$/, '');

  return cleaned;
}

// ---------------------------------------------------------------------------
// formatGlossForDisplay — The main pipeline orchestrator
// ---------------------------------------------------------------------------

/**
 * Format a gloss for word-stack display (minimal, translation only).
 *
 * Pipeline:
 * 1. Check curated glosses (word form, then lemma) — return as-is if found
 * 2. Resolve bilingual objects to target language via extractGloss
 * 3. If no gloss in target language, try lemma fallback
 * 4. Clean verbose dictionary patterns
 * 5. Detect grammatical descriptions — attempt lemma fallback
 * 6. Truncate to display limits
 *
 * @param gloss - Raw gloss from dictionary (string or BilingualGloss)
 * @param pos - Part of speech
 * @param lemma - Lemma (base form) from dictionary
 * @param word - The actual word form being displayed
 * @param language - Target display language ('en' or 'fr')
 * @returns Formatted gloss string ready for display
 */
export function formatGlossForDisplay(
  gloss: string | BilingualGloss | null | undefined,
  pos: string | null | undefined,
  lemma: string | null | undefined,
  word: string | null | undefined,
  language: GlossLanguage = 'en'
): string {
  // Curated glosses are hand-written and always clean — return as-is
  if (word && CURATED_GLOSSES.has(word.toLowerCase())) {
    return extractGloss(CURATED_GLOSSES.get(word.toLowerCase())!, language);
  }
  if (lemma && CURATED_GLOSSES.has(lemma.toLowerCase())) {
    return extractGloss(CURATED_GLOSSES.get(lemma.toLowerCase())!, language);
  }

  // Keep raw English gloss for lemma extraction (grammatical patterns
  // and Cyrillic lemma references are always in English from kaikki.org)
  const rawEnglishGloss =
    gloss && typeof gloss === 'object'
      ? ((gloss as BilingualGloss).en || '')
      : ((gloss as string) || '');

  // Route ALL glosses through extractGloss for proper language resolution.
  // Plain English strings return '' for French users (blank for pencil users).
  // Bilingual objects return the target language value.
  const resolvedGloss = extractGloss(gloss, language);

  // No gloss in target language — try lemma fallback before giving up
  if (!resolvedGloss) {
    return attemptLemmaFallback(rawEnglishGloss, lemma, language);
  }

  // Clean verbose dictionary patterns
  const cleanedGloss = extractCleanGloss(resolvedGloss);

  // Detect verbose grammatical patterns from kaikki.org (English or French)
  if (isGrammatical(cleanedGloss)) {
    // Use rawEnglishGloss for lemma extraction (English patterns are more reliable),
    // then fall back to resolvedGloss for French "de" patterns
    const effectiveLemma =
      lemma ||
      extractLemmaFromGloss(rawEnglishGloss) ||
      extractLemmaFromGloss(resolvedGloss);

    if (effectiveLemma) {
      const semanticGloss = getLemmaGloss(effectiveLemma);
      if (semanticGloss) {
        const resolved = extractGloss(semanticGloss, language);
        if (resolved) {
          return truncateGloss(extractCleanGloss(resolved), 5);
        }
      }
    }
    // Grammatical description with no semantic fallback: blank for pencil users
    return '';
  }

  // Clean, semantic gloss — truncate to 5 words max for PDF display
  return truncateGloss(cleanedGloss, 5);
}

// ---------------------------------------------------------------------------
// attemptLemmaFallback — Internal helper for lemma-based gloss recovery
// ---------------------------------------------------------------------------

/**
 * When no direct gloss is available in the target language, attempt to
 * find a semantic gloss via the lemma (base form).
 *
 * Uses the English gloss text for lemma extraction (more reliable patterns),
 * then looks up the lemma entry for a gloss in the target language.
 *
 * @param rawEnglishGloss - The English gloss text for pattern extraction
 * @param lemma - Explicit lemma from dictionary, if available
 * @param language - Target display language
 * @returns Formatted gloss or '' if no fallback available
 */
function attemptLemmaFallback(
  rawEnglishGloss: string,
  lemma: string | null | undefined,
  language: GlossLanguage
): string {
  // Determine the lemma: explicit field first, then extract from English gloss
  const effectiveLemma =
    lemma || extractLemmaFromGloss(rawEnglishGloss);

  if (effectiveLemma) {
    // Check curated glosses for the lemma
    if (CURATED_GLOSSES.has(effectiveLemma.toLowerCase())) {
      const curated = extractGloss(
        CURATED_GLOSSES.get(effectiveLemma.toLowerCase())!,
        language
      );
      if (curated) return curated;
    }

    // Look up lemma's semantic gloss in the dictionary
    const semanticGloss = getLemmaGloss(effectiveLemma);
    if (semanticGloss) {
      const resolved = extractGloss(semanticGloss, language);
      if (resolved) {
        return truncateGloss(extractCleanGloss(resolved), 5);
      }
    }
  }

  // No fallback available — blank for pencil users
  return '';
}
