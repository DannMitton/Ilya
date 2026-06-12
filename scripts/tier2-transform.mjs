/**
 * Tier 2 dictionary transform
 *
 * Reads the current NDJSON dictionary files and emits a two-tier payload:
 *
 *   Core tier  (dictionary.<hash>-a.json, -b.json)
 *     Per entry: { s, e, f, p, l } — what transcription and the quick
 *     gloss need. The build-provenance field (r) is dropped entirely:
 *     nothing in the application reads it.
 *
 *   Gloss tier (dictionary.<hash>-gloss-a.json, -gloss-b.json)
 *     Per entry: { E, F } — full glosses, present only for forms that
 *     have at least one. Loaded lazily in the background after the app
 *     is interactive and merged into the in-memory dictionary.
 *
 * French capitalization fix (applies to f and F; English untouched):
 *   frwiktionary writes sentence-style definitions, so nearly all French
 *   glosses begin with a capital. Rule, ratified 2026-06-12:
 *     - Non-name entries: lowercase the first character, unless the
 *       first word is an all-caps acronym (two or more letters, all
 *       uppercase, accent-aware: ÉU, NKVD, SDF).
 *     - Name entries (p === 'name'): keep the capital, except when the
 *       gloss begins with one of the six Russian case names in French
 *       (Génitif, Datif, Accusatif, Instrumental, Locatif, Nominatif),
 *       which are inflection descriptors, not proper nouns.
 *   Only the first character of the gloss is affected; segments after
 *   semicolons keep their capitals (they cannot be POS-guarded).
 *
 * Manifest: data/dictionary-manifest.json gains a glossFiles array.
 * The content hash (md5, first 8 hex chars, mirroring
 * scripts/build-dictionary.ts) is computed over the core NDJSON content.
 *
 * Usage: node scripts/tier2-transform.mjs
 * Prints a full accounting; refuses to write if entry counts disagree.
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import crypto from 'node:crypto';

// ── Capitalization rule ─────────────────────────────────────────────

const CASE_DESCRIPTORS = new Set([
  'Génitif',
  'Datif',
  'Accusatif',
  'Instrumental',
  'Locatif',
  'Nominatif'
]);

function isUpperLetter(ch) {
  return ch.toLowerCase() !== ch && ch.toUpperCase() === ch;
}

function isLetter(ch) {
  return ch.toLowerCase() !== ch.toUpperCase();
}

function firstWordOf(gloss) {
  const m = gloss.match(/^[^\s,;:.…]+/u);
  return m ? m[0] : '';
}

/**
 * Apply the ratified French capitalization rule to one gloss string.
 * Returns the (possibly unchanged) gloss. Pure function; exported for tests.
 */
export function fixFrenchCaps(gloss, pos) {
  if (!gloss) return gloss;
  const c0 = gloss[0];
  if (!isUpperLetter(c0)) return gloss; // already lowercase, digit, punctuation
  const word = firstWordOf(gloss);

  if (pos === 'name') {
    // Proper-noun entries keep their capital unless the gloss is an
    // inflection descriptor (case name), which gets the same treatment
    // as its common-noun twins.
    if (CASE_DESCRIPTORS.has(word)) {
      return c0.toLowerCase() + gloss.slice(1);
    }
    return gloss;
  }

  // Acronym guard: first word with >= 2 letters, all uppercase.
  const letters = [...word].filter(isLetter);
  if (letters.length >= 2 && letters.every(isUpperLetter)) {
    return gloss;
  }

  return c0.toLowerCase() + gloss.slice(1);
}

// ── Per-entry transform ─────────────────────────────────────────────

/**
 * Split one parsed entry into core and gloss objects.
 * Returns { core, gloss } where gloss is null when the entry has no
 * full glosses. Key order (s, e, f, p, l / E, F) is kept stable so the
 * content hash is deterministic. Exported for tests.
 */
export function splitEntry(entry) {
  const core = {};
  if (entry.s !== undefined) core.s = entry.s;
  if (entry.e !== undefined) core.e = entry.e;
  if (entry.f !== undefined) core.f = fixFrenchCaps(entry.f, entry.p);
  if (entry.p !== undefined) core.p = entry.p;
  if (entry.l !== undefined) core.l = entry.l;
  // r is dropped deliberately: build provenance, no consumer in the app.

  let gloss = null;
  if (entry.E !== undefined || entry.F !== undefined) {
    gloss = {};
    if (entry.E !== undefined) gloss.E = entry.E;
    if (entry.F !== undefined) gloss.F = fixFrenchCaps(entry.F, entry.p);
  }
  return { core, gloss };
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  const dataDir = path.join(process.cwd(), 'data');
  const manifestPath = path.join(dataDir, 'dictionary-manifest.json');
  const oldManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const inputFiles = oldManifest.files.map((f) => path.join(dataDir, f));

  const coreLines = [];
  const glossLines = [];

  // Accounting
  let entriesIn = 0;
  let glossEntries = 0;
  let bytesIn = 0;
  let rDropped = 0;
  let fLowered = 0;
  let FLowered = 0;
  let acronymKept = 0;
  let nameKept = 0;
  let nameDescriptorLowered = 0;

  for (const file of inputFiles) {
    bytesIn += fs.statSync(file).size;
    const rl = readline.createInterface({
      input: fs.createReadStream(file, { encoding: 'utf-8' }),
      crlfDelay: Infinity
    });
    for await (const line of rl) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const [form, entry] = JSON.parse(trimmed);
      entriesIn++;

      // Accounting probes (before transform)
      if (entry.r !== undefined) rDropped++;
      for (const [key, counter] of [['f', 'f'], ['F', 'F']]) {
        const g = entry[key];
        if (g && isUpperLetter(g[0])) {
          const fixed = fixFrenchCaps(g, entry.p);
          if (fixed !== g) {
            if (key === 'f') fLowered++;
            else FLowered++;
            if (entry.p === 'name') nameDescriptorLowered++;
          } else if (entry.p === 'name') {
            nameKept++;
          } else {
            acronymKept++;
          }
        }
      }

      const { core, gloss } = splitEntry(entry);
      coreLines.push(JSON.stringify([form, core]));
      if (gloss) {
        glossLines.push(JSON.stringify([form, gloss]));
        glossEntries++;
      }
    }
  }

  if (coreLines.length !== entriesIn) {
    throw new Error(
      `Entry count mismatch: ${entriesIn} in, ${coreLines.length} core out. Aborting; nothing written.`
    );
  }

  // Hash over core content, mirroring build-dictionary.ts
  const coreContent = coreLines.join('\n');
  const hash = crypto.createHash('md5').update(coreContent).digest('hex').slice(0, 8);

  // Split each tier into two halves by line count
  const half = Math.ceil(coreLines.length / 2);
  const glossHalf = Math.ceil(glossLines.length / 2);
  const out = [
    [`dictionary.${hash}-a.json`, coreLines.slice(0, half)],
    [`dictionary.${hash}-b.json`, coreLines.slice(half)],
    [`dictionary.${hash}-gloss-a.json`, glossLines.slice(0, glossHalf)],
    [`dictionary.${hash}-gloss-b.json`, glossLines.slice(glossHalf)]
  ];

  let coreBytes = 0;
  let glossBytes = 0;
  for (const [name, lines] of out) {
    const filePath = path.join(dataDir, name);
    const content = lines.join('\n');
    fs.writeFileSync(filePath, content, 'utf-8');
    const size = fs.statSync(filePath).size;
    if (name.includes('-gloss-')) glossBytes += size;
    else coreBytes += size;
    console.log(`written  ${name}  ${(size / 1024 / 1024).toFixed(1)} MB  (${lines.length.toLocaleString()} lines)`);
  }

  const manifest = {
    version: new Date().toISOString().slice(0, 10),
    hash,
    files: [`dictionary.${hash}-a.json`, `dictionary.${hash}-b.json`],
    glossFiles: [`dictionary.${hash}-gloss-a.json`, `dictionary.${hash}-gloss-b.json`]
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');
  console.log('written  dictionary-manifest.json');

  // Accounting report
  const mb = (n) => (n / 1024 / 1024).toFixed(1) + ' MB';
  console.log('\n── Accounting ──────────────────────────────');
  console.log(`entries in:                 ${entriesIn.toLocaleString()}`);
  console.log(`core entries out:           ${coreLines.length.toLocaleString()} (must equal entries in)`);
  console.log(`gloss entries out:          ${glossEntries.toLocaleString()}`);
  console.log(`bytes in:                   ${mb(bytesIn)}`);
  console.log(`core tier out:              ${mb(coreBytes)}`);
  console.log(`gloss tier out:             ${mb(glossBytes)}`);
  console.log(`eager-payload reduction:    ${mb(bytesIn - coreBytes)} (${(100 * (1 - coreBytes / bytesIn)).toFixed(1)}%)`);
  console.log(`r fields dropped:           ${rDropped.toLocaleString()}`);
  console.log(`FR short glosses lowered:   ${fLowered.toLocaleString()}`);
  console.log(`FR full glosses lowered:    ${FLowered.toLocaleString()}`);
  console.log(`acronym capitals kept:      ${acronymKept.toLocaleString()}`);
  console.log(`name capitals kept:         ${nameKept.toLocaleString()}`);
  console.log(`name descriptors lowered:   ${nameDescriptorLowered.toLocaleString()}`);
  console.log(`new content hash:           ${hash}`);
}

// Run only when invoked directly (not when imported by tests)
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
