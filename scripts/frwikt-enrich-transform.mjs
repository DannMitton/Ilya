/**
 * FR gloss enrichment transform (French Wiktionnaire candidate merge)
 *
 * Reads the current two-tier dictionary payload plus a candidate file of
 * French full glosses (frwikt-F-candidates.ndjson, prepared 2026-06-12
 * from Dann's kaikki Russe dump of 2026-02-19) and emits a regenerated
 * payload in which each candidate form's gloss-tier entry gains an F.
 *
 * Ratified policies (FRWIKT-ENRICHMENT-DECISIONS.md, ratified 2026-06-12):
 *   1. Inflected/form-of entries receive the lemma's lexical senses only.
 *   2. Senses joined with "; ", deduplicated, original order, no truncation.
 *   3. Trailing periods stripped per sense; ellipses kept.
 *   4. Wiki markers cleaned; whitespace collapsed.
 *   5. Tier 2 capitalization rule applied at candidate generation.
 *   6. Gap-filling only: existing F is never overwritten.
 * Policies 1-5 are properties of the candidate file (already applied at
 * generation; the F strings here are merged verbatim). Policy 6 is
 * enforced here: an existing F causes the candidate to be skipped and
 * counted, and any skip aborts the run (the candidate set was derived
 * from this exact payload, so a skip means stale inputs).
 *
 * Provenance (ratified decision C): the candidate file's src and head
 * fields go to a build report (scripts/frwikt-enrichment-report.json,
 * gitignored) and the console accounting only. Nothing ships client-side.
 *
 * Content hash (deviation from the Tier 2 mould, on the record): computed
 * over core AND gloss content. This run leaves core entries byte-identical,
 * so a core-only hash would not change, filenames would not change, and
 * returning clients would keep serving the old gloss tier from the
 * IndexedDB cache (keys gloss-{hash}-part{i}) and the service worker.
 * Hashing both tiers guarantees cache busting whenever either changes.
 *
 * Output: four data files under the new hash, updated manifest. Core
 * entries pass through untouched (same accounting guarantee as the Tier 2
 * transform: refuses to write on any count mismatch).
 *
 * Usage: node scripts/frwikt-enrich-transform.mjs <candidate-file.ndjson>
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import crypto from 'node:crypto';

// ── Pure merge rule ─────────────────────────────────────────────────

/**
 * Merge one candidate F into a gloss-tier object for a form.
 * existing: the current gloss object ({E}, {E,F}, {F}) or null when the
 * form has no gloss-tier entry. candidateF: the proposed French gloss.
 * Returns { gloss, action } where action is one of:
 *   'added-to-existing'  F added beside an existing E
 *   'created'            form had no gloss entry; one is created with F
 *   'skipped-has-F'      existing F present; candidate NOT applied
 * Key order (E, F) is kept stable for hash determinism.
 * Pure function; exported for tests.
 */
export function mergeCandidate(existing, candidateF) {
  if (existing && existing.F !== undefined) {
    return { gloss: existing, action: 'skipped-has-F' };
  }
  if (existing) {
    const gloss = {};
    if (existing.E !== undefined) gloss.E = existing.E;
    gloss.F = candidateF;
    return { gloss, action: 'added-to-existing' };
  }
  return { gloss: { F: candidateF }, action: 'created' };
}

// ── NDJSON helpers ──────────────────────────────────────────────────

async function readNDJSON(file, onEntry) {
  const rl = readline.createInterface({
    input: fs.createReadStream(file, { encoding: 'utf-8' }),
    crlfDelay: Infinity
  });
  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    onEntry(JSON.parse(trimmed));
  }
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  const candidatePath = process.argv[2];
  if (!candidatePath || !fs.existsSync(candidatePath)) {
    throw new Error('Usage: node scripts/frwikt-enrich-transform.mjs <candidate-file.ndjson>');
  }

  const dataDir = path.join(process.cwd(), 'data');
  const manifestPath = path.join(dataDir, 'dictionary-manifest.json');
  const oldManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

  // 1. Load candidates: form -> { F, src, head }
  const candidates = new Map();
  await readNDJSON(candidatePath, ([form, obj]) => {
    if (candidates.has(form)) {
      throw new Error(`Duplicate candidate form: ${form}. Aborting; nothing written.`);
    }
    candidates.set(form, obj);
  });

  // 2. Load existing gloss tier: form -> gloss object
  const glossMap = new Map();
  let glossLinesIn = 0;
  let fBearingIn = 0;
  for (const f of oldManifest.glossFiles) {
    await readNDJSON(path.join(dataDir, f), ([form, gloss]) => {
      glossMap.set(form, gloss);
      glossLinesIn++;
      if (gloss.F !== undefined) fBearingIn++;
    });
  }
  if (glossMap.size !== glossLinesIn) {
    throw new Error(
      `Gloss tier has duplicate forms: ${glossLinesIn} lines, ${glossMap.size} distinct. Aborting.`
    );
  }

  // 3. Walk core in order; emit core lines unchanged and gloss lines
  //    (existing, enriched, or created) in core order.
  const coreLines = [];
  const glossLines = [];
  let entriesIn = 0;
  let addedToExisting = 0;
  let created = 0;
  let skippedHasF = 0;
  let fBearingOut = 0;
  let bytesIn = 0;
  const srcCounts = {};
  const consumed = new Set();

  for (const f of oldManifest.files) {
    const filePath = path.join(dataDir, f);
    bytesIn += fs.statSync(filePath).size;
    await readNDJSON(filePath, ([form, core]) => {
      entriesIn++;
      coreLines.push(JSON.stringify([form, core]));

      const existing = glossMap.get(form) ?? null;
      const cand = candidates.get(form);
      let gloss = existing;

      if (cand) {
        consumed.add(form);
        const result = mergeCandidate(existing, cand.F);
        gloss = result.gloss;
        if (result.action === 'added-to-existing') addedToExisting++;
        else if (result.action === 'created') created++;
        else skippedHasF++;
        srcCounts[cand.src] = (srcCounts[cand.src] || 0) + 1;
      }

      if (gloss) {
        glossLines.push(JSON.stringify([form, gloss]));
        if (gloss.F !== undefined) fBearingOut++;
      }
    });
  }

  // 4. Hard accounting gates. Any failure aborts before a byte is written.
  const fail = (msg) => {
    throw new Error(`${msg} Aborting; nothing written.`);
  };
  if (coreLines.length !== entriesIn) {
    fail(`Core count mismatch: ${entriesIn} in, ${coreLines.length} out.`);
  }
  if (skippedHasF !== 0) {
    fail(`${skippedHasF} candidates skipped (form already has F): stale candidate file.`);
  }
  if (consumed.size !== candidates.size) {
    fail(`${candidates.size - consumed.size} candidate forms absent from core.`);
  }
  if (glossLines.length !== glossLinesIn + created) {
    fail(`Gloss count mismatch: expected ${glossLinesIn + created}, got ${glossLines.length}.`);
  }
  if (fBearingOut !== fBearingIn + addedToExisting + created) {
    fail(`F-bearing count mismatch: expected ${fBearingIn + addedToExisting + created}, got ${fBearingOut}.`);
  }

  // 5. Hash over BOTH tiers (see header note), then write.
  const coreContent = coreLines.join('\n');
  const glossContent = glossLines.join('\n');
  const hash = crypto
    .createHash('md5')
    .update(coreContent)
    .update('\n')
    .update(glossContent)
    .digest('hex')
    .slice(0, 8);

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
    console.log(
      `written  ${name}  ${(size / 1024 / 1024).toFixed(1)} MB  (${lines.length.toLocaleString()} lines)`
    );
  }

  const manifest = {
    version: new Date().toISOString().slice(0, 10),
    hash,
    files: [`dictionary.${hash}-a.json`, `dictionary.${hash}-b.json`],
    glossFiles: [`dictionary.${hash}-gloss-a.json`, `dictionary.${hash}-gloss-b.json`]
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');
  console.log('written  dictionary-manifest.json');

  // 6. Build report (decision C: provenance lives here, not client-side).
  const report = {
    generated: new Date().toISOString(),
    candidateFile: path.basename(candidatePath),
    previousHash: oldManifest.hash,
    newHash: hash,
    entriesIn,
    glossLinesIn,
    glossLinesOut: glossLines.length,
    fBearingIn,
    fBearingOut,
    candidatesApplied: addedToExisting + created,
    addedToExistingGlossEntries: addedToExisting,
    createdGlossEntries: created,
    srcCounts
  };
  const reportPath = path.join(process.cwd(), 'scripts', 'frwikt-enrichment-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n', 'utf-8');
  console.log(`written  ${path.relative(process.cwd(), reportPath)} (build report, not committed)`);

  // 7. Accounting report.
  const mb = (n) => (n / 1024 / 1024).toFixed(1) + ' MB';
  console.log('\n── Accounting ──────────────────────────────');
  console.log(`entries in:                  ${entriesIn.toLocaleString()}`);
  console.log(`core entries out:            ${coreLines.length.toLocaleString()} (must equal entries in)`);
  console.log(`gloss lines in:              ${glossLinesIn.toLocaleString()}`);
  console.log(`gloss lines out:             ${glossLines.length.toLocaleString()}`);
  console.log(`candidates applied:          ${(addedToExisting + created).toLocaleString()}`);
  console.log(`  F added beside E:          ${addedToExisting.toLocaleString()}`);
  console.log(`  new gloss entries:         ${created.toLocaleString()}`);
  console.log(`  skipped (had F):           ${skippedHasF.toLocaleString()} (must be 0)`);
  console.log(`F-bearing entries in:        ${fBearingIn.toLocaleString()}`);
  console.log(`F-bearing entries out:       ${fBearingOut.toLocaleString()}`);
  console.log(`F coverage of core:          ${((100 * fBearingOut) / entriesIn).toFixed(1)}%`);
  console.log(`core tier out:               ${mb(coreBytes)}`);
  console.log(`gloss tier out:              ${mb(glossBytes)}`);
  console.log('src provenance (report only):');
  for (const [src, n] of Object.entries(srcCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${src.padEnd(18)} ${n.toLocaleString()}`);
  }
  console.log(`new content hash:            ${hash} (over core + gloss)`);
}

// Run only when invoked directly (not when imported by tests)
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
