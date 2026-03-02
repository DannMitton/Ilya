#!/usr/bin/env node
/**
 * Stage 7B: French Coverage Check
 * 
 * Run from the Ilya repo root:
 *   node scripts/stage7b-french-coverage-check.mjs
 * 
 * Reads the built runtime dictionary and checks French gloss coverage
 * for the 13,434 repertoire words identified in Stage 6.
 * 
 * Output: stage7b-french-coverage-report.json
 */

import fs from 'fs';
import path from 'path';

// ============================================================
// 1. Load the runtime dictionary
// ============================================================
// Check both possible locations
const candidates = [
  path.join('data', 'dictionary-manifest.json'),
  path.join('apps', 'web', 'static', 'data', 'dictionary-manifest.json'),
];
const manifestPath = candidates.find(p => fs.existsSync(p));
if (!manifestPath) {
  console.error('dictionary-manifest.json not found in data/ or apps/web/static/data/');
  console.error('Run this script from the Ilya repo root.');
  process.exit(1);
}

const manifestDir = path.dirname(manifestPath);
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
const dictPath = path.join(manifestDir, manifest.file);
console.log(`Loading dictionary: ${manifest.file} ...`);
const dict = JSON.parse(fs.readFileSync(dictPath, 'utf-8'));
const dictSize = Object.keys(dict).length;
console.log(`  ${dictSize.toLocaleString()} entries loaded.\n`);

// ============================================================
// 2. Load the repertoire word list (Stage 6 inDictionary)
//    Paste the word list inline — extracted from gap analysis
// ============================================================

// We check ALL words in the dictionary for French coverage stats,
// then specifically report on the 13,434 repertoire words.

// Runtime dictionary fields (compressed):
//   s = stress, e = englishShort, f = frenchShort,
//   E = englishFull, F = frenchFull, p = pos, l = lemma, r = provenance

// ============================================================
// 3. Global French coverage
// ============================================================
let totalEntries = 0;
let hasFrench = 0;
let noFrench = 0;
let hasEnglish = 0;
let noEnglish = 0;

for (const [word, entry] of Object.entries(dict)) {
  totalEntries++;
  if (entry.f && entry.f.length > 0) {
    hasFrench++;
  } else {
    noFrench++;
  }
  if (entry.e && entry.e.length > 0) {
    hasEnglish++;
  } else {
    noEnglish++;
  }
}

console.log('=== GLOBAL DICTIONARY COVERAGE ===');
console.log(`Total entries:     ${totalEntries.toLocaleString()}`);
console.log(`English glosses:   ${hasEnglish.toLocaleString()} (${((hasEnglish/totalEntries)*100).toFixed(1)}%)`);
console.log(`French glosses:    ${hasFrench.toLocaleString()} (${((hasFrench/totalEntries)*100).toFixed(1)}%)`);
console.log(`Missing French:    ${noFrench.toLocaleString()} (${((noFrench/totalEntries)*100).toFixed(1)}%)`);
console.log();

// ============================================================
// 4. Repertoire-specific coverage
//    Read the gap analysis if available, otherwise check all words
// ============================================================

// Try to load the gap analysis for the repertoire word list
const gapPaths = [
  'ilya-stage6-gap-analysis.json',
  path.join('data', 'ilya-stage6-gap-analysis.json'),
];

let repertoireWords = null;
for (const gp of gapPaths) {
  if (fs.existsSync(gp)) {
    const gap = JSON.parse(fs.readFileSync(gp, 'utf-8'));
    repertoireWords = gap.inDictionary.map(w => w.word || w);
    console.log(`Loaded repertoire word list from ${gp}: ${repertoireWords.length} words\n`);
    break;
  }
}

if (!repertoireWords) {
  console.log('No gap analysis file found. Place ilya-stage6-gap-analysis.json in repo root or data/.');
  console.log('Skipping repertoire-specific analysis.\n');
} else {
  let repHasFrench = 0;
  let repNoFrench = 0;
  let repNotInDict = 0;
  const missingFrenchWords = [];

  for (const word of repertoireWords) {
    const entry = dict[word];
    if (!entry) {
      repNotInDict++;
      continue;
    }
    if (entry.f && entry.f.length > 0) {
      repHasFrench++;
    } else {
      repNoFrench++;
      missingFrenchWords.push({
        word,
        english: entry.e || '',
        pos: entry.p || '',
        lemma: entry.l || '',
        stress: entry.s
      });
    }
  }

  const repTotal = repHasFrench + repNoFrench;
  console.log('=== REPERTOIRE COVERAGE (13,434 in-dictionary words) ===');
  console.log(`Found in runtime dict: ${repTotal.toLocaleString()}`);
  console.log(`Not found:             ${repNotInDict.toLocaleString()}`);
  console.log(`With French gloss:     ${repHasFrench.toLocaleString()} (${((repHasFrench/repTotal)*100).toFixed(1)}%)`);
  console.log(`Missing French gloss:  ${repNoFrench.toLocaleString()} (${((repNoFrench/repTotal)*100).toFixed(1)}%)`);
  console.log();

  // Sort missing by... we don't have frequency here, sort alphabetically
  missingFrenchWords.sort((a, b) => a.word.localeCompare(b.word, 'ru'));

  // Write report
  const report = {
    date: new Date().toISOString().slice(0, 10),
    dictionaryFile: manifest.file,
    dictionaryEntries: totalEntries,
    globalCoverage: {
      english: hasEnglish,
      french: hasFrench,
      englishPct: ((hasEnglish/totalEntries)*100).toFixed(1),
      frenchPct: ((hasFrench/totalEntries)*100).toFixed(1),
    },
    repertoireCoverage: {
      totalWords: repertoireWords.length,
      foundInDict: repTotal,
      notFoundInDict: repNotInDict,
      withFrench: repHasFrench,
      withFrenchPct: ((repHasFrench/repTotal)*100).toFixed(1),
      missingFrench: repNoFrench,
      missingFrenchPct: ((repNoFrench/repTotal)*100).toFixed(1),
    },
    missingFrenchWords,
  };

  const reportPath = 'stage7b-french-coverage-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`Report written: ${reportPath}`);
  console.log(`  (${missingFrenchWords.length} words missing French glosses, listed in report)`);
}
