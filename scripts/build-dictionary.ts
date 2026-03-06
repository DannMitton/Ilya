#!/usr/bin/env node
/**
 * build-dictionary.ts — Ilya Dictionary Build Script
 *
 * Three-pass streaming build that produces a single dictionary JSON file
 * from Kaikki.org Wiktionary extractions.
 *
 * Pass 1: English JSONL → word-form map + lemma index (stress, English glosses, POS)
 *         Now includes inflection expansion: declension and conjugation forms from
 *         each entry's forms array are extracted as separate dictionary entries,
 *         inheriting the lemma's gloss and POS.
 * Pass 2: French JSONL → cross-reference French glosses + lemma fallback
 * Pass 3: Output → apply overrides, truncate, validate, write final file
 *
 * Usage:
 *   npx tsx scripts/build-dictionary.ts --en <english.jsonl> [--fr <french.jsonl>]
 *
 * Authority: DICTIONARY_REBUILD_PLAN_FINAL.md
 * Implementation: Claude (Anthropic)
 * Date: February 19, 2026
 */

import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';
import * as crypto from 'crypto';

// ============================================================
// Types
// ============================================================

interface DictionaryEntry {
  stress: number;
  englishShort: string;
  frenchShort: string;
  englishFull?: string;
  frenchFull?: string;
  pos: string;
  lemma: string;
  provenance: 'kaikki-en' | 'kaikki-fr' | 'lemma-fallback' | 'curated' | 'supplement';
}

/** Compressed JSON output keys */
interface CompressedEntry {
  s: number;
  e: string;
  f: string;
  E?: string;
  F?: string;
  p: string;
  l: string;
  r: string;
}

/** Handler interface for future extensibility (e.g., OpenRussian.org) */
interface StressSource {
  name: string;
  extract(accentedForm: string, ipaData?: string[]): { stress: number | null; method: string };
}

/** Intermediate structure during Pass 1 */
interface Pass1Entry {
  stress: number;
  englishShort: string;
  englishFull: string;
  pos: string;
  lemma: string;
}

/** Lemma index entry for French fallback */
interface LemmaFrench {
  frenchShort: string | null;
  frenchFull: string | null;
}

// ============================================================
// Constants
// ============================================================

const RUSSIAN_VOWELS = new Set('аеёиоуыэюяАЕЁИОУЫЭЮЯ'.split(''));
const COMBINING_ACUTE = '\u0301';
const GLOSS_MAX_LENGTH = 20;
const PROGRESS_INTERVAL = 50_000; // report every N entries

const CANARY_WORDS = ['дума', 'песнь', 'когда', 'только', 'был', 'отец', 'музыка', 'собака'];

/**
 * Tags on forms entries that indicate metadata rows, not actual inflected forms.
 * These are skipped during inflection expansion.
 */
const INFLECTION_SKIP_TAGS = new Set([
  'table-tags',
  'inflection-template',
  'class',
  'romanization',
]);

// ============================================================
// CLI Argument Parsing
// ============================================================

function parseArgs(): { enPath: string; frPath?: string; stage7aPath?: string; stage7cPath?: string; outDir: string } {
  const args = process.argv.slice(2);
  let enPath = '';
  let frPath: string | undefined;
  let stage7aPath: string | undefined;
  let stage7cPath: string | undefined;
  let outDir = path.join(process.cwd(), 'apps', 'web', 'static', 'data');

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--en':
        enPath = args[++i];
        break;
      case '--fr':
        frPath = args[++i];
        break;
      case '--stage7a':
        stage7aPath = args[++i];
        break;
      case '--stage7c':
        stage7cPath = args[++i];
        break;
      case '--out':
        outDir = args[++i];
        break;
      default:
        console.error(`Unknown argument: ${args[i]}`);
        process.exit(1);
    }
  }

  if (!enPath) {
    console.error('Usage: npx tsx scripts/build-dictionary.ts --en <english.jsonl> [--fr <french.jsonl>] [--stage7a <stage7a.json>] [--stage7c <stage7c.json>] [--out <output-dir>]');
    process.exit(1);
  }

  if (!fs.existsSync(enPath)) {
    console.error(`English JSONL not found: ${enPath}`);
    process.exit(1);
  }

  if (frPath && !fs.existsSync(frPath)) {
    console.error(`French JSONL not found: ${frPath}`);
    process.exit(1);
  }

  if (stage7aPath && !fs.existsSync(stage7aPath)) {
    console.error(`Stage 7A JSON not found: ${stage7aPath}`);
    process.exit(1);
  }

  if (stage7cPath && !fs.existsSync(stage7cPath)) {
    console.error(`Stage 7C JSON not found: ${stage7cPath}`);
    process.exit(1);
  }

  return { enPath, frPath, stage7aPath, stage7cPath, outDir };
}

// ============================================================
// Stress Extraction
// ============================================================

/**
 * Extract 0-based stress index from an accented Russian word form.
 *
 * Strategy:
 * 1. If the form contains combining acute (U+0301), the vowel immediately
 *    preceding it is the stressed vowel. Count vowels to get the index.
 * 2. If the form contains ё (always stressed in standard Russian),
 *    use the position of ё.
 * 3. If the word is monosyllabic (one vowel), stress = 0.
 * 4. Otherwise, stress is unknown: return null.
 */
const kaikkiStressSource: StressSource = {
  name: 'kaikki-accent',

  extract(accentedForm: string, ipaData?: string[]): { stress: number | null; method: string } {
    if (!accentedForm) return { stress: null, method: 'empty' };

    // Strategy 1: combining acute
    const acuteIndex = accentedForm.indexOf(COMBINING_ACUTE);
    if (acuteIndex > 0) {
      // The vowel is the character immediately before the combining acute
      let vowelCount = 0;
      for (let i = 0; i < acuteIndex; i++) {
        if (RUSSIAN_VOWELS.has(accentedForm[i])) {
          vowelCount++;
        }
      }
      // vowelCount is now the 1-based position; subtract 1 for 0-based index
      // The stressed vowel is the last vowel counted (the one right before the accent)
      return { stress: vowelCount - 1, method: 'combining-acute' };
    }

    // Strategy 2: ё (always stressed)
    const lowerForm = accentedForm.toLowerCase();
    const yoIndex = lowerForm.indexOf('ё');
    if (yoIndex >= 0) {
      let vowelCount = 0;
      for (let i = 0; i <= yoIndex; i++) {
        if (RUSSIAN_VOWELS.has(lowerForm[i])) {
          vowelCount++;
        }
      }
      return { stress: vowelCount - 1, method: 'yo-position' };
    }

    // Strategy 3: monosyllabic
    const vowels = [...accentedForm].filter(ch => RUSSIAN_VOWELS.has(ch));
    if (vowels.length === 1) {
      return { stress: 0, method: 'monosyllabic' };
    }

    // Strategy 4: try IPA fallback
    if (ipaData && ipaData.length > 0) {
      const stressFromIpa = extractStressFromIpa(ipaData[0], accentedForm);
      if (stressFromIpa !== null) {
        return { stress: stressFromIpa, method: 'ipa-fallback' };
      }
    }

    return { stress: null, method: 'unknown' };
  }
};

/**
 * Extract stress index from IPA transcription.
 * IPA primary stress is marked with ˈ (U+02C8) before the stressed syllable.
 * We count vowel-like segments before the stress mark in the source word.
 *
 * This is a fallback; combining acute is preferred.
 */
function extractStressFromIpa(ipa: string, wordForm: string): number | null {
  // Find the IPA stress mark
  const stressMarkIndex = ipa.indexOf('ˈ');
  if (stressMarkIndex < 0) return null;

  // Count IPA vowel-like segments after the stress mark to identify which syllable
  // This is approximate; the combining-acute method is more reliable
  // For now, count the vowels in the IPA before the stress mark
  const ipaVowels = new Set('aɐeɛəiɪɨoɔuʊɵæ'.split(''));
  let syllablesBefore = 0;
  for (let i = 0; i < stressMarkIndex; i++) {
    if (ipaVowels.has(ipa[i])) {
      syllablesBefore++;
    }
  }

  return syllablesBefore;
}

// ============================================================
// Text Normalization
// ============================================================

/**
 * Strip combining acute accents and normalize to NFC lowercase.
 * Used to derive the plain dictionary key from an accented inflected form.
 */
function stripAccentsAndNormalize(accentedForm: string): string {
  return accentedForm
    .replace(/\u0301/g, '')   // remove combining acute
    .normalize('NFC')
    .toLowerCase();
}

/**
 * Check whether a forms-array entry is an actual inflected word form
 * (as opposed to metadata like table-tags, inflection-template, class, or romanization).
 */
function isInflectedForm(form: any): boolean {
  const tags: string[] = form.tags || [];
  // Skip if any tag is a metadata marker
  for (const tag of tags) {
    if (INFLECTION_SKIP_TAGS.has(tag)) return false;
  }
  // Must have a source of 'declension' or 'conjugation'
  if (form.source !== 'declension' && form.source !== 'conjugation') return false;
  // Must have a Cyrillic form string
  if (!form.form || typeof form.form !== 'string') return false;
  // Skip multi-word analytical forms like "са́мый те́сный" (superlative)
  // and forms with parentheses like "(по)тесне́е" (comparative with optional prefix)
  if (form.form.includes(' ') || form.form.includes('(')) return false;
  return true;
}

// ============================================================
// Gloss Processing
// ============================================================

/**
 * Truncate a gloss at a word boundary, respecting the 20-character cap.
 * The ellipsis character (…) counts as 1 character.
 */
function truncateAtWordBoundary(text: string, max: number = GLOSS_MAX_LENGTH): string {
  if (text.length <= max) return text;
  const truncated = text.slice(0, max - 1); // reserve 1 char for …
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace === -1) return truncated + '…';
  return truncated.slice(0, lastSpace) + '…';
}

/**
 * Clean a raw Kaikki gloss string.
 * Removes parenthetical transliterations, leading "#" markers,
 * and Wiktionary formatting artifacts.
 */
function cleanGloss(raw: string): string {
  let cleaned = raw;

  // Remove leading "# " (French Wiktionary numbered sense marker)
  cleaned = cleaned.replace(/^#\s*/, '');

  // Remove trailing period (common in French glosses)
  cleaned = cleaned.replace(/\.\s*$/, '');

  // Remove inline transliterations like (sobáka) or (carʹ)
  cleaned = cleaned.replace(/\s*\([^)]*[a-zA-Zʹ][^)]*\)\s*/g, ' ');

  // Remove "female equivalent of X:" / "diminutive of X:" prefixes for form_of senses
  cleaned = cleaned.replace(/^(female equivalent|diminutive|augmentative|male equivalent) of [^:]+:\s*/i, '');

  // Collapse whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
}

/**
 * Extract the best English gloss from a Kaikki senses array.
 * Returns { short, full } where short is truncated and full is all senses joined.
 */
function extractEnglishGlosses(senses: any[]): { short: string; full: string } {
  const allGlosses: string[] = [];

  for (const sense of senses) {
    const glosses = sense.glosses || [];
    // Skip form-of senses that are just grammatical references
    const tags = sense.tags || [];
    if (tags.includes('form-of') && glosses.length === 1 && !glosses[0].includes(':')) {
      // Pure inflection reference like "genitive plural of X" — still include it
      // as it may be the only gloss
    }
    for (const g of glosses) {
      const cleaned = cleanGloss(g);
      if (cleaned) allGlosses.push(cleaned);
    }
  }

  if (allGlosses.length === 0) return { short: '', full: '' };

  const full = allGlosses.join('; ');
  const short = truncateAtWordBoundary(allGlosses[0]);

  return { short, full };
}

// ============================================================
// Entry Extraction from Kaikki JSONL
// ============================================================

/**
 * Get the best accented form for stress extraction.
 * Priority: canonical form from forms array > head_templates arg1 > word field
 */
function getAccentedForm(entry: any): string {
  // 1. Canonical form
  const forms = entry.forms || [];
  const canonical = forms.find((f: any) =>
    f.tags && f.tags.includes('canonical') && !f.tags.includes('romanization')
  );
  if (canonical && canonical.form && canonical.form.includes(COMBINING_ACUTE)) {
    return canonical.form;
  }

  // 2. Head template arg1
  const heads = entry.head_templates || [];
  if (heads.length > 0) {
    const arg1 = heads[0].args?.['1'] || '';
    if (arg1.includes(COMBINING_ACUTE)) return arg1;
    // Some head templates put the accented form in 'head' arg
    const headArg = heads[0].args?.['head'] || '';
    if (headArg.includes(COMBINING_ACUTE)) return headArg;
  }

  // 3. Canonical form even without acute (may have ё)
  if (canonical && canonical.form) return canonical.form;

  // 4. Fall back to bare word
  return entry.word || '';
}

/**
 * Get IPA strings from the sounds array.
 */
function getIpaData(entry: any): string[] {
  const sounds = entry.sounds || [];
  return sounds
    .map((s: any) => s.ipa || '')
    .filter((ipa: string) => ipa.length > 0);
}

/**
 * Extract the lemma for an entry.
 * For inflected forms: senses[].form_of[].word (stripped of accents)
 * For lemma entries: the word itself
 */
function extractLemma(entry: any): string {
  const senses = entry.senses || [];
  for (const sense of senses) {
    const formOf = sense.form_of || [];
    if (formOf.length > 0 && formOf[0].word) {
      // Strip combining acute from lemma reference
      return formOf[0].word.replace(/\u0301/g, '');
    }
  }
  return entry.word || '';
}

// ============================================================
// Pass 1: English JSONL → word-form map + lemma index
// ============================================================

async function pass1(enPath: string): Promise<{
  wordMap: Map<string, Pass1Entry>;
  lemmaIndex: Map<string, LemmaFrench>;
  stats: {
    totalLines: number;
    russianEntries: number;
    stressResolved: number;
    stressFromAcute: number;
    stressFromYo: number;
    stressFromMono: number;
    stressFromIpa: number;
    stressUnknown: number;
    withGloss: number;
    withoutGloss: number;
    skippedNonRussian: number;
    duplicatesOverwritten: number;
    parseErrors: number;
    inflectionFormsProcessed: number;
    inflectionFormsAdded: number;
    inflectionStressResolved: number;
    inflectionStressUnknown: number;
    inflectionSkippedMetadata: number;
    inflectionSkippedMultiword: number;
    entriesWithForms: number;
  };
}> {
  console.log('\n══════════════════════════════════════════');
  console.log('  PASS 1: English Wiktionary → Russian');
  console.log('  (with inflection expansion)');
  console.log('══════════════════════════════════════════\n');

  const fileSize = fs.statSync(enPath).size;
  console.log(`Source: ${path.basename(enPath)} (${(fileSize / 1024 / 1024).toFixed(1)} MB)`);

  const wordMap = new Map<string, Pass1Entry>();
  const lemmaIndex = new Map<string, LemmaFrench>();

  const stats = {
    totalLines: 0,
    russianEntries: 0,
    stressResolved: 0,
    stressFromAcute: 0,
    stressFromYo: 0,
    stressFromMono: 0,
    stressFromIpa: 0,
    stressUnknown: 0,
    withGloss: 0,
    withoutGloss: 0,
    skippedNonRussian: 0,
    duplicatesOverwritten: 0,
    parseErrors: 0,
    // Inflection expansion stats
    inflectionFormsProcessed: 0,
    inflectionFormsAdded: 0,
    inflectionStressResolved: 0,
    inflectionStressUnknown: 0,
    inflectionSkippedMetadata: 0,
    inflectionSkippedMultiword: 0,
    entriesWithForms: 0,
  };

  let bytesRead = 0;
  let lastProgressPct = -1;

  const fileStream = fs.createReadStream(enPath, { encoding: 'utf-8' });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    bytesRead += Buffer.byteLength(line, 'utf-8') + 1; // +1 for newline
    stats.totalLines++;

    // Progress reporting
    const pct = Math.floor((bytesRead / fileSize) * 100);
    if (pct > lastProgressPct && pct % 5 === 0) {
      lastProgressPct = pct;
      process.stdout.write(`  Progress: ${pct}% (${wordMap.size.toLocaleString()} word forms)\r`);
    }

    // Parse JSON
    let entry: any;
    try {
      entry = JSON.parse(line);
    } catch {
      stats.parseErrors++;
      continue;
    }

    // Filter: Russian only
    if (entry.lang_code !== 'ru') {
      stats.skippedNonRussian++;
      continue;
    }

    stats.russianEntries++;

    const wordForm = (entry.word || '').normalize('NFC').toLowerCase();
    if (!wordForm) continue;

    // Stress extraction
    const accentedForm = getAccentedForm(entry);
    const ipaData = getIpaData(entry);
    const { stress, method } = kaikkiStressSource.extract(accentedForm, ipaData);

    if (stress !== null) {
      stats.stressResolved++;
      switch (method) {
        case 'combining-acute': stats.stressFromAcute++; break;
        case 'yo-position': stats.stressFromYo++; break;
        case 'monosyllabic': stats.stressFromMono++; break;
        case 'ipa-fallback': stats.stressFromIpa++; break;
      }
    } else {
      stats.stressUnknown++;
    }

    // Gloss extraction
    const { short: englishShort, full: englishFull } = extractEnglishGlosses(entry.senses || []);
    if (englishShort) {
      stats.withGloss++;
    } else {
      stats.withoutGloss++;
    }

    // POS
    const pos = entry.pos || '';

    // Lemma
    const lemma = extractLemma(entry);

    // Build entry (stress -1 for unknown; engine can handle this)
    const pass1Entry: Pass1Entry = {
      stress: stress ?? -1,
      englishShort,
      englishFull,
      pos,
      lemma,
    };

    // Insert into map. If duplicate word form, prefer the entry with resolved stress.
    if (wordMap.has(wordForm)) {
      const existing = wordMap.get(wordForm)!;
      if (existing.stress === -1 && pass1Entry.stress >= 0) {
        wordMap.set(wordForm, pass1Entry);
        stats.duplicatesOverwritten++;
      } else if (existing.stress >= 0 && pass1Entry.stress >= 0 && existing.englishShort === '' && pass1Entry.englishShort !== '') {
        // Both have stress, but existing lacks gloss — prefer the one with a gloss
        wordMap.set(wordForm, pass1Entry);
        stats.duplicatesOverwritten++;
      }
      // Otherwise keep existing
    } else {
      wordMap.set(wordForm, pass1Entry);
    }

    // Build lemma index (for French fallback in Pass 2)
    if (lemma === wordForm || lemma === entry.word) {
      // This is a lemma entry; register it
      if (!lemmaIndex.has(wordForm)) {
        lemmaIndex.set(wordForm, { frenchShort: null, frenchFull: null });
      }
    }

    // ============================================================
    // INFLECTION EXPANSION
    // Iterate the entry's forms array for declension/conjugation
    // forms. Each valid inflected form becomes its own dictionary
    // entry, inheriting the lemma's gloss and POS.
    // ============================================================

    const forms: any[] = entry.forms || [];
    const hasDeclConj = forms.some((f: any) =>
      f.source === 'declension' || f.source === 'conjugation'
    );

    if (hasDeclConj) {
      stats.entriesWithForms++;

      for (const form of forms) {
        // Skip metadata rows
        const tags: string[] = form.tags || [];
        const hasSkipTag = tags.some(t => INFLECTION_SKIP_TAGS.has(t));
        if (hasSkipTag) {
          stats.inflectionSkippedMetadata++;
          continue;
        }

        // Must be from declension or conjugation table
        if (form.source !== 'declension' && form.source !== 'conjugation') continue;

        // Must have a form string
        if (!form.form || typeof form.form !== 'string') continue;

        // Skip multi-word analytical forms and parenthesized variants
        if (form.form.includes(' ') || form.form.includes('(')) {
          stats.inflectionSkippedMultiword++;
          continue;
        }

        stats.inflectionFormsProcessed++;

        // The form field carries the accented spelling (e.g., "те́сная")
        const inflAccented = form.form;
        const inflKey = stripAccentsAndNormalize(inflAccented);

        // Skip empty keys or keys identical to the main word form
        // (already captured above)
        if (!inflKey || inflKey === wordForm) continue;

        // Extract stress from the accented inflected form
        const { stress: inflStress, method: inflMethod } =
          kaikkiStressSource.extract(inflAccented);

        if (inflStress !== null) {
          stats.inflectionStressResolved++;
        } else {
          stats.inflectionStressUnknown++;
        }

        // Build the inflection entry, inheriting the lemma's gloss
        const inflEntry: Pass1Entry = {
          stress: inflStress ?? -1,
          englishShort,   // inherit from lemma
          englishFull,    // inherit from lemma
          pos,            // inherit from lemma
          lemma: wordForm, // the lemma is the parent entry's word
        };

        // Same duplicate-resolution logic as lemma entries
        if (wordMap.has(inflKey)) {
          const existing = wordMap.get(inflKey)!;
          if (existing.stress === -1 && inflEntry.stress >= 0) {
            wordMap.set(inflKey, inflEntry);
            stats.duplicatesOverwritten++;
            stats.inflectionFormsAdded++;
          } else if (existing.stress >= 0 && inflEntry.stress >= 0 && existing.englishShort === '' && inflEntry.englishShort !== '') {
            wordMap.set(inflKey, inflEntry);
            stats.duplicatesOverwritten++;
            stats.inflectionFormsAdded++;
          }
          // Otherwise keep existing (it already has stress and gloss)
        } else {
          wordMap.set(inflKey, inflEntry);
          stats.inflectionFormsAdded++;
        }
      }
    }
  }

  // Final progress
  process.stdout.write('\n');

  // Report
  console.log('\n  Pass 1 Results:');
  console.log(`  ─────────────────────────────────────`);
  console.log(`  Total lines processed:    ${stats.totalLines.toLocaleString()}`);
  console.log(`  Russian entries:          ${stats.russianEntries.toLocaleString()}`);
  console.log(`  Unique word forms:        ${wordMap.size.toLocaleString()}`);
  console.log(`  Lemma index entries:      ${lemmaIndex.size.toLocaleString()}`);
  console.log(`  Parse errors:             ${stats.parseErrors.toLocaleString()}`);
  console.log(`  Skipped (non-Russian):    ${stats.skippedNonRussian.toLocaleString()}`);
  console.log(`  Duplicates overwritten:   ${stats.duplicatesOverwritten.toLocaleString()}`);
  console.log();
  console.log(`  Stress extraction (lemma entries):`);
  console.log(`    Resolved:               ${stats.stressResolved.toLocaleString()} (${((stats.stressResolved / stats.russianEntries) * 100).toFixed(1)}%)`);
  console.log(`    — combining acute:      ${stats.stressFromAcute.toLocaleString()}`);
  console.log(`    — ё position:           ${stats.stressFromYo.toLocaleString()}`);
  console.log(`    — monosyllabic:         ${stats.stressFromMono.toLocaleString()}`);
  console.log(`    — IPA fallback:         ${stats.stressFromIpa.toLocaleString()}`);
  console.log(`    Unknown:                ${stats.stressUnknown.toLocaleString()} (${((stats.stressUnknown / stats.russianEntries) * 100).toFixed(1)}%)`);
  console.log();
  console.log(`  English glosses:`);
  console.log(`    With gloss:             ${stats.withGloss.toLocaleString()} (${((stats.withGloss / stats.russianEntries) * 100).toFixed(1)}%)`);
  console.log(`    Without gloss:          ${stats.withoutGloss.toLocaleString()}`);
  console.log();
  console.log(`  Inflection expansion:`);
  console.log(`    Entries with forms:      ${stats.entriesWithForms.toLocaleString()}`);
  console.log(`    Forms processed:         ${stats.inflectionFormsProcessed.toLocaleString()}`);
  console.log(`    Forms added to map:      ${stats.inflectionFormsAdded.toLocaleString()}`);
  console.log(`    Stress resolved:         ${stats.inflectionStressResolved.toLocaleString()}`);
  console.log(`    Stress unknown:          ${stats.inflectionStressUnknown.toLocaleString()}`);
  console.log(`    Skipped (metadata):      ${stats.inflectionSkippedMetadata.toLocaleString()}`);
  console.log(`    Skipped (multi-word):    ${stats.inflectionSkippedMultiword.toLocaleString()}`);

  // Canary word check
  console.log(`\n  Canary words:`);
  for (const canary of CANARY_WORDS) {
    const found = wordMap.get(canary);
    if (found) {
      const stressOk = found.stress >= 0 ? '✓' : '✗';
      const glossOk = found.englishShort ? '✓' : '✗';
      console.log(`    ${canary.padEnd(12)} stress: ${stressOk} (${found.stress})  gloss: ${glossOk} "${found.englishShort}"  pos: ${found.pos}  lemma: ${found.lemma}`);
    } else {
      console.log(`    ${canary.padEnd(12)} ✗ NOT FOUND`);
    }
  }

  // Spot-check inflection canaries
  const inflCanaries = ['тесная', 'тихая', 'глубокая', 'думаю', 'думает'];
  console.log(`\n  Inflection canaries:`);
  for (const canary of inflCanaries) {
    const found = wordMap.get(canary);
    if (found) {
      const stressOk = found.stress >= 0 ? '✓' : '✗';
      console.log(`    ${canary.padEnd(16)} stress: ${stressOk} (${found.stress})  gloss: "${found.englishShort}"  lemma: ${found.lemma}`);
    } else {
      console.log(`    ${canary.padEnd(16)} ✗ NOT FOUND`);
    }
  }

  return { wordMap, lemmaIndex, stats };
}

// ============================================================
// French Gloss Extraction
// ============================================================

/**
 * Extract French glosses from a French Wiktionary senses array.
 * Same structure as English, but glosses are in French.
 */
function extractFrenchGlosses(senses: any[]): { short: string; full: string } {
  const allGlosses: string[] = [];

  for (const sense of senses) {
    const glosses = sense.glosses || [];
    for (const g of glosses) {
      const cleaned = cleanGloss(g);
      if (cleaned) allGlosses.push(cleaned);
    }
  }

  if (allGlosses.length === 0) return { short: '', full: '' };

  const full = allGlosses.join('; ');
  const short = truncateAtWordBoundary(allGlosses[0]);

  return { short, full };
}

// ============================================================
// Pass 2: French JSONL → cross-reference + lemma fallback
// ============================================================

async function pass2(
  frPath: string,
  wordMap: Map<string, Pass1Entry>,
  lemmaIndex: Map<string, LemmaFrench>
): Promise<{
  frenchMap: Map<string, { frenchShort: string; frenchFull: string; provenance: 'kaikki-fr' | 'lemma-fallback' | 'supplement' }>;
  stats: {
    totalLines: number;
    russianEntries: number;
    directMatches: number;
    lemmaPopulated: number;
    lemmaFallbackApplied: number;
    noMatch: number;
    skippedNonRussian: number;
    parseErrors: number;
  };
}> {
  console.log('\n══════════════════════════════════════════');
  console.log('  PASS 2: French Wiktionary cross-reference');
  console.log('══════════════════════════════════════════\n');

  const fileSize = fs.statSync(frPath).size;
  console.log(`Source: ${path.basename(frPath)} (${(fileSize / 1024 / 1024).toFixed(1)} MB)`);

  const frenchMap = new Map<string, { frenchShort: string; frenchFull: string; provenance: 'kaikki-fr' | 'lemma-fallback' | 'supplement' }>();

  const stats = {
    totalLines: 0,
    russianEntries: 0,
    directMatches: 0,
    lemmaPopulated: 0,
    lemmaFallbackApplied: 0,
    noMatch: 0,
    skippedNonRussian: 0,
    parseErrors: 0,
  };

  let bytesRead = 0;
  let lastProgressPct = -1;

  const fileStream = fs.createReadStream(frPath, { encoding: 'utf-8' });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  // Phase A: stream French JSONL, match directly and populate lemma index
  for await (const line of rl) {
    bytesRead += Buffer.byteLength(line, 'utf-8') + 1;
    stats.totalLines++;

    const pct = Math.floor((bytesRead / fileSize) * 100);
    if (pct > lastProgressPct && pct % 5 === 0) {
      lastProgressPct = pct;
      process.stdout.write(`  Phase A (streaming): ${pct}% (${stats.russianEntries.toLocaleString()} Russian entries)\r`);
    }

    let entry: any;
    try {
      entry = JSON.parse(line);
    } catch {
      stats.parseErrors++;
      continue;
    }

    if (entry.lang_code !== 'ru') {
      stats.skippedNonRussian++;
      continue;
    }

    stats.russianEntries++;

    const wordForm = (entry.word || '').normalize('NFC').toLowerCase();
    if (!wordForm) continue;

    const { short: frenchShort, full: frenchFull } = extractFrenchGlosses(entry.senses || []);
    if (!frenchShort) continue;

    // Direct match: word form exists in our English-derived wordMap
    if (wordMap.has(wordForm)) {
      if (!frenchMap.has(wordForm)) {
        frenchMap.set(wordForm, { frenchShort, frenchFull, provenance: 'kaikki-fr' });
        stats.directMatches++;
      }
    }

    // Populate lemma index for fallback
    if (lemmaIndex.has(wordForm)) {
      const lemmaEntry = lemmaIndex.get(wordForm)!;
      if (lemmaEntry.frenchShort === null) {
        lemmaEntry.frenchShort = frenchShort;
        lemmaEntry.frenchFull = frenchFull;
        stats.lemmaPopulated++;
      }
    }
  }

  process.stdout.write('\n');

  // Phase B: lemma fallback for inflected forms without direct French glosses
  console.log('  Phase B: applying lemma fallback...');

  for (const [wordForm, pass1Entry] of wordMap) {
    // Skip if already has a direct French match
    if (frenchMap.has(wordForm)) continue;

    // Look up the lemma in the lemma index
    const lemmaKey = pass1Entry.lemma.normalize('NFC').toLowerCase();
    const lemmaFrench = lemmaIndex.get(lemmaKey);

    if (lemmaFrench && lemmaFrench.frenchShort) {
      frenchMap.set(wordForm, {
        frenchShort: lemmaFrench.frenchShort,
        frenchFull: lemmaFrench.frenchFull || lemmaFrench.frenchShort,
        provenance: 'lemma-fallback',
      });
      stats.lemmaFallbackApplied++;
    } else {
      stats.noMatch++;
    }
  }

  // Report
  const totalCoverage = frenchMap.size;
  const coveragePct = ((totalCoverage / wordMap.size) * 100).toFixed(1);

  console.log('\n  Pass 2 Results:');
  console.log('  ─────────────────────────────────────');
  console.log(`  Total lines processed:    ${stats.totalLines.toLocaleString()}`);
  console.log(`  Russian entries:          ${stats.russianEntries.toLocaleString()}`);
  console.log(`  Parse errors:             ${stats.parseErrors.toLocaleString()}`);
  console.log(`  Skipped (non-Russian):    ${stats.skippedNonRussian.toLocaleString()}`);
  console.log();
  console.log('  French gloss coverage:');
  console.log(`    Direct matches:         ${stats.directMatches.toLocaleString()}`);
  console.log(`    Lemmas populated:       ${stats.lemmaPopulated.toLocaleString()}`);
  console.log(`    Lemma fallback applied: ${stats.lemmaFallbackApplied.toLocaleString()}`);
  console.log(`    Total with French:      ${totalCoverage.toLocaleString()} / ${wordMap.size.toLocaleString()} (${coveragePct}%)`);
  console.log(`    Missing French:         ${stats.noMatch.toLocaleString()} (${((stats.noMatch / wordMap.size) * 100).toFixed(1)}%)`);

  // Canary word French check
  console.log('\n  Canary words (French):');
  for (const canary of CANARY_WORDS) {
    const found = frenchMap.get(canary);
    if (found) {
      console.log(`    ${canary.padEnd(12)} ✓ "${found.frenchShort}" (${found.provenance})`);
    } else {
      console.log(`    ${canary.padEnd(12)} ✗ no French gloss`);
    }
  }

  return { frenchMap, stats };
}

// ============================================================
// Pass 3: Output — merge, override, truncate, validate, write
// ============================================================

/** Check if truncation may have lost critical meaning */
function shouldFlag(full: string, short: string): boolean {
  if (full === short) return false;
  // Flag if full contains parentheses or commas that were removed
  if ((full.includes('(') || full.includes(',')) && !short.includes('(') && !short.includes(',')) {
    return true;
  }
  return false;
}

// ============================================================
// Supplementary Glosses: Stage 7A + 7C Integration
// ============================================================

/**
 * Categories from Stage 7A to include as dictionary entries.
 * func/pron: true function words and pronouns (93.7% of tokens).
 * verb/noun/adj/num: short forms with glosses.
 * Excluded: frag (tokenization artifacts), ukr (Ukrainian), name (proper name fragments).
 */
const STAGE7A_INCLUDE_CATEGORIES = new Set(['func', 'pron', 'verb', 'noun', 'adj', 'num']);

/**
 * Apply supplementary French glosses from Stage 7A (function words)
 * and Stage 7C (English-to-French gloss mapping) to the dictionary.
 *
 * Stage 7A: Adds new dictionary entries for words missing from Kaikki.
 * Stage 7C: Adds French glosses to existing entries that lack them.
 *
 * Called between Pass 2 and Pass 3.
 */
function applySupplementaryGlosses(
  stage7aPath: string | undefined,
  stage7cPath: string | undefined,
  wordMap: Map<string, Pass1Entry>,
  frenchMap: Map<string, { frenchShort: string; frenchFull: string; provenance: 'kaikki-fr' | 'lemma-fallback' | 'supplement' }>
): {
  stage7aAdded: number;
  stage7aSkipped: number;
  stage7aAlreadyPresent: number;
  stage7cApplied: number;
  stage7cSkipped: number;
  stage7cAlreadyHasFrench: number;
} {
  console.log('\n══════════════════════════════════════════');
  console.log('  SUPPLEMENT: Stage 7A + 7C Integration');
  console.log('══════════════════════════════════════════\n');

  const stats = {
    stage7aAdded: 0,
    stage7aSkipped: 0,
    stage7aAlreadyPresent: 0,
    stage7cApplied: 0,
    stage7cSkipped: 0,
    stage7cAlreadyHasFrench: 0,
  };

  // ── Stage 7A: Function Word Table ──────────────────────────
  if (stage7aPath) {
    console.log(`  Stage 7A: ${path.basename(stage7aPath)}`);
    const raw = JSON.parse(fs.readFileSync(stage7aPath, 'utf-8'));
    const entries: any[] = raw.entries || [];
    console.log(`  Entries in file: ${entries.length}`);

    for (const entry of entries) {
      const word = (entry.word || '').normalize('NFC').toLowerCase();
      if (!word) continue;

      const category = entry.category || '';

      // Skip excluded categories
      if (!STAGE7A_INCLUDE_CATEGORIES.has(category)) {
        stats.stage7aSkipped++;
        continue;
      }

      // Add to wordMap if not already present
      if (!wordMap.has(word)) {
        // Infer stress: monosyllabic → 0, else -1 (unknown)
        const vowels = [...word].filter(ch => RUSSIAN_VOWELS.has(ch));
        const stress = vowels.length === 1 ? 0 : -1;

        const englishGloss = entry.gloss_en || '';

        wordMap.set(word, {
          stress,
          englishShort: truncateAtWordBoundary(englishGloss),
          englishFull: englishGloss,
          pos: entry.pos || '',
          lemma: entry.lemma || word,
        });
        stats.stage7aAdded++;
      } else {
        stats.stage7aAlreadyPresent++;
      }

      // Add French gloss (supplement takes priority only if no French exists)
      if (!frenchMap.has(word)) {
        const frenchGloss = entry.gloss_fr || '';
        if (frenchGloss) {
          frenchMap.set(word, {
            frenchShort: truncateAtWordBoundary(frenchGloss),
            frenchFull: frenchGloss,
            provenance: 'supplement',
          });
        }
      }
    }

    console.log(`  — Added to dictionary:   ${stats.stage7aAdded}`);
    console.log(`  — Already in dictionary: ${stats.stage7aAlreadyPresent}`);
    console.log(`  — Skipped (frag/ukr/name): ${stats.stage7aSkipped}`);
  } else {
    console.log('  [Skipping Stage 7A: no --stage7a flag provided]');
  }

  // ── Stage 7C: French Gloss Mapping ─────────────────────────
  if (stage7cPath) {
    console.log(`\n  Stage 7C: ${path.basename(stage7cPath)}`);
    const raw = JSON.parse(fs.readFileSync(stage7cPath, 'utf-8'));
    const entries: any[] = raw.entries || [];
    console.log(`  Entries in file: ${entries.length}`);

    for (const entry of entries) {
      const word = (entry.word || '').normalize('NFC').toLowerCase();
      if (!word) continue;

      // Only apply to words that exist in wordMap (these are in-dictionary words missing French)
      if (!wordMap.has(word)) {
        stats.stage7cSkipped++;
        continue;
      }

      // Skip if already has French from Kaikki or lemma fallback
      if (frenchMap.has(word)) {
        stats.stage7cAlreadyHasFrench++;
        continue;
      }

      const frenchGloss = entry.gloss_fr || '';
      const frenchGlossFull = entry.gloss_fr_full || frenchGloss;
      if (!frenchGloss) {
        stats.stage7cSkipped++;
        continue;
      }

      frenchMap.set(word, {
        frenchShort: truncateAtWordBoundary(frenchGloss),
        frenchFull: frenchGlossFull,
        provenance: 'supplement',
      });
      stats.stage7cApplied++;
    }

    console.log(`  — French glosses applied: ${stats.stage7cApplied}`);
    console.log(`  — Already had French:    ${stats.stage7cAlreadyHasFrench}`);
    console.log(`  — Not in dictionary:     ${stats.stage7cSkipped}`);
  } else {
    console.log('\n  [Skipping Stage 7C: no --stage7c flag provided]');
  }

  // Canary word check post-supplement
  console.log('\n  Canary words (post-supplement):');
  for (const canary of CANARY_WORDS) {
    const inWord = wordMap.has(canary) ? '✓' : '✗';
    const french = frenchMap.get(canary);
    const frOk = french ? `✓ "${french.frenchShort}" (${french.provenance})` : '✗ no French';
    console.log(`    ${canary.padEnd(12)} dict:${inWord}  fr:${frOk}`);
  }

  return stats;
}

async function pass3(
  wordMap: Map<string, Pass1Entry>,
  frenchMap: Map<string, { frenchShort: string; frenchFull: string; provenance: 'kaikki-fr' | 'lemma-fallback' | 'supplement' }>,
  outDir: string
): Promise<void> {
  console.log('\n══════════════════════════════════════════');
  console.log('  PASS 3: Output');
  console.log('══════════════════════════════════════════\n');

  // Ensure output directory exists
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const flagged: { word: string; field: string; short: string; full: string }[] = [];
  const output: Record<string, CompressedEntry> = {};

  let totalEntries = 0;
  let withStress = 0;
  let withoutStress = 0;
  let withEnglish = 0;
  let withFrenchDirect = 0;
  let withFrenchLemma = 0;
  let withFrenchSupplement = 0;
  let withoutFrench = 0;
  let truncatedCount = 0;
  let homographCount = 0;
  let fullFieldsStored = 0;

  for (const [wordForm, pass1Entry] of wordMap) {
    totalEntries++;

    // Merge French data
    const frenchData = frenchMap.get(wordForm);
    const frenchShort = frenchData?.frenchShort || '';
    const frenchFull = frenchData?.frenchFull || '';
    const frenchProvenance = frenchData?.provenance;

    // Determine provenance
    let provenance: string = 'kaikki-en';
    if (frenchProvenance === 'kaikki-fr') provenance = 'kaikki-en'; // primary source is English
    if (frenchProvenance === 'lemma-fallback') provenance = 'kaikki-en';
    if (frenchProvenance === 'supplement') provenance = 'supplement';

    // Stats
    if (pass1Entry.stress >= 0) withStress++;
    else withoutStress++;

    if (pass1Entry.englishShort) withEnglish++;

    if (frenchProvenance === 'kaikki-fr') withFrenchDirect++;
    else if (frenchProvenance === 'lemma-fallback') withFrenchLemma++;
    else if (frenchProvenance === 'supplement') withFrenchSupplement++;
    else withoutFrench++;

    // Check if short differs from full (needs fullField storage)
    const englishFullStored = pass1Entry.englishFull !== pass1Entry.englishShort ? pass1Entry.englishFull : undefined;
    const frenchFullStored = frenchFull && frenchFull !== frenchShort ? frenchFull : undefined;
    if (englishFullStored || frenchFullStored) fullFieldsStored++;

    // Track truncation
    if (pass1Entry.englishShort.endsWith('…')) truncatedCount++;
    if (frenchShort.endsWith('…')) truncatedCount++;

    // Flag for review
    if (shouldFlag(pass1Entry.englishFull, pass1Entry.englishShort)) {
      flagged.push({ word: wordForm, field: 'english', short: pass1Entry.englishShort, full: pass1Entry.englishFull });
    }
    if (frenchFull && shouldFlag(frenchFull, frenchShort)) {
      flagged.push({ word: wordForm, field: 'french', short: frenchShort, full: frenchFull });
    }

    // Build compressed entry
    const compressed: CompressedEntry = {
      s: pass1Entry.stress,
      e: pass1Entry.englishShort,
      f: frenchShort,
      p: pass1Entry.pos,
      l: pass1Entry.lemma,
      r: provenance,
    };

    if (englishFullStored) compressed.E = englishFullStored;
    if (frenchFullStored) compressed.F = frenchFullStored;

    output[wordForm] = compressed;
  }

  // Write dictionary file
  console.log('  Writing dictionary file...');
  const dictLines = [];
  for (const [word, entry] of Object.entries(output)) {
    dictLines.push(JSON.stringify([word, entry]));
  }
  const ndjsonContent = dictLines.join('\n');
  const contentHash = crypto.createHash('md5').update(ndjsonContent).digest('hex').slice(0, 8);
  const dictFilename = `dictionary.${contentHash}.json`;
  const dictPath = path.join(outDir, dictFilename);

  fs.writeFileSync(dictPath, ndjsonContent, 'utf-8');
  const fileSizeMB = (fs.statSync(dictPath).size / 1024 / 1024).toFixed(1);
  console.log(`  Written: ${dictFilename} (${fileSizeMB} MB)`);

  // Write manifest
  const manifest = {
    version: new Date().toISOString().slice(0, 10),
    hash: contentHash,
    file: dictFilename,
  };
  const manifestPath = path.join(outDir, 'dictionary-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`  Written: dictionary-manifest.json`);

  // Write flagged glosses
  const scriptsDir = path.join(process.cwd(), 'scripts');
  if (!fs.existsSync(scriptsDir)) fs.mkdirSync(scriptsDir, { recursive: true });
  const flaggedPath = path.join(scriptsDir, 'flagged-glosses.json');
  fs.writeFileSync(flaggedPath, JSON.stringify(flagged, null, 2), 'utf-8');
  console.log(`  Written: scripts/flagged-glosses.json (${flagged.length.toLocaleString()} entries)`);

  // Validation report
  const frenchTotalCoverage = withFrenchDirect + withFrenchLemma + withFrenchSupplement;
  const frenchCoveragePct = ((frenchTotalCoverage / totalEntries) * 100).toFixed(1);

  const report = {
    buildDate: new Date().toISOString(),
    totalEntries,
    withStress,
    withoutStress,
    stressCoveragePct: ((withStress / totalEntries) * 100).toFixed(1),
    englishGlossCoverage: withEnglish,
    englishCoveragePct: ((withEnglish / totalEntries) * 100).toFixed(1),
    frenchDirect: withFrenchDirect,
    frenchLemmaFallback: withFrenchLemma,
    frenchSupplement: withFrenchSupplement,
    frenchMissing: withoutFrench,
    frenchTotalCoverage,
    frenchCoveragePct,
    truncatedGlosses: truncatedCount,
    flaggedForReview: flagged.length,
    fullFieldsStored,
    fileSizeMB,
    contentHash,
    canaryWords: {} as Record<string, any>,
  };

  // Canary word validation
  for (const canary of CANARY_WORDS) {
    const entry = output[canary];
    report.canaryWords[canary] = entry
      ? { stress: entry.s, english: entry.e, french: entry.f, pos: entry.p, lemma: entry.l, pass: entry.s >= 0 && !!entry.e }
      : { pass: false, reason: 'NOT FOUND' };
  }

  const reportPath = path.join(scriptsDir, 'build-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`  Written: scripts/build-report.json`);

  // Console summary
  console.log('\n  Pass 3 Results:');
  console.log('  ─────────────────────────────────────');
  console.log(`  Total entries:            ${totalEntries.toLocaleString()}`);
  console.log(`  Dictionary file:          ${dictFilename} (${fileSizeMB} MB)`);
  console.log(`  Content hash:             ${contentHash}`);
  console.log();
  console.log('  Stress:');
  console.log(`    With numeric stress:    ${withStress.toLocaleString()} (${report.stressCoveragePct}%)`);
  console.log(`    Without stress:         ${withoutStress.toLocaleString()}`);
  console.log();
  console.log('  English glosses:');
  console.log(`    Coverage:               ${withEnglish.toLocaleString()} (${report.englishCoveragePct}%)`);
  console.log();
  console.log('  French glosses:');
  console.log(`    Direct:                 ${withFrenchDirect.toLocaleString()}`);
  console.log(`    Lemma fallback:         ${withFrenchLemma.toLocaleString()}`);
  console.log(`    Supplement (7A+7C):     ${withFrenchSupplement.toLocaleString()}`);
  console.log(`    Total:                  ${frenchTotalCoverage.toLocaleString()} (${frenchCoveragePct}%)`);
  console.log(`    Missing:                ${withoutFrench.toLocaleString()}`);
  console.log();
  console.log('  Quality:');
  console.log(`    Truncated glosses:      ${truncatedCount.toLocaleString()}`);
  console.log(`    Flagged for review:     ${flagged.length.toLocaleString()}`);
  console.log(`    Full fields stored:     ${fullFieldsStored.toLocaleString()}`);

  // Canary words final check
  console.log('\n  Canary words (final):');
  for (const canary of CANARY_WORDS) {
    const entry = output[canary];
    if (entry) {
      const stressOk = entry.s >= 0 ? '✓' : '✗';
      const enOk = entry.e ? '✓' : '✗';
      const frOk = entry.f ? '✓' : '✗';
      console.log(`    ${canary.padEnd(12)} s:${stressOk}(${entry.s})  en:${enOk}"${entry.e}"  fr:${frOk}"${entry.f}"  ${entry.p}`);
    } else {
      console.log(`    ${canary.padEnd(12)} ✗ NOT FOUND`);
    }
  }
}

// ============================================================
// Main
// ============================================================

async function main(): Promise<void> {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   Ilya Dictionary Build Script           ║');
  console.log('║   Authority: Grayson (2012)              ║');
  console.log('║   Source: Kaikki.org / Wiktionary        ║');
  console.log('╚══════════════════════════════════════════╝');

  const { enPath, frPath, stage7aPath, stage7cPath, outDir } = parseArgs();

  // Pass 1: English
  const { wordMap, lemmaIndex, stats: pass1Stats } = await pass1(enPath);

  // Pass 2: French (if provided)
  let frenchMap = new Map<string, { frenchShort: string; frenchFull: string; provenance: 'kaikki-fr' | 'lemma-fallback' | 'supplement' }>();
  if (frPath) {
    const pass2Result = await pass2(frPath, wordMap, lemmaIndex);
    frenchMap = pass2Result.frenchMap;
  } else {
    console.log('\n  [Skipping Pass 2: no --fr flag provided]');
  }

  // Supplement: Stage 7A + 7C (if provided)
  if (stage7aPath || stage7cPath) {
    applySupplementaryGlosses(stage7aPath, stage7cPath, wordMap, frenchMap);
  }

  // Pass 3: Output
  await pass3(wordMap, frenchMap, outDir);

  console.log('\n══════════════════════════════════════════');
  console.log('  Build complete.');
  console.log('══════════════════════════════════════════\n');
}

main().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
