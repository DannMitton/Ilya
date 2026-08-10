/**
 * build-homographs.mjs — Ilya stress-homograph payload build (N.14)
 *
 * The shipped dictionary holds exactly one entry per headword. Where a Russian
 * spelling carries two or more stress positions with different meanings, that
 * format cannot hold the second reading, and the build that produced the shards
 * discarded it (scripts/build-dictionary.ts:564-575, counted as
 * `duplicatesOverwritten`). го́ре (grief) and му́ка (torment) were lost that way.
 *
 * The lookup path already reads array-valued entries and has since before this
 * script existed: packages/phonology/src/engine.ts:707-717 returns
 * `isHomograph` with `allEntries`, packages/dictionary/src/gloss.ts:53 returns
 * arrays, apps/web/src/lib/pipeline.ts:338-343 selects the entry whose `s`
 * matches the singer's effective stress, and
 * InspectorPanel.svelte:1026-1044 renders every entry with the stress-matched
 * one marked. This script supplies the data those four sites are waiting for.
 *
 * POLICIES
 *  1. A word earns an array only when its source entries disagree about STRESS
 *     POSITION. Same-stress polysemy is not a stress problem, and the printed
 *     gloss is already the singer's to override (InspectorPanel.svelte:841).
 *  2. ELEMENT 0 IS THE ENTRY WE SHIP TODAY, verbatim. lookupStress returns
 *     entry[0], so this guarantees no stress and no printed gloss moves on any
 *     score that exists today. The alternatives are additive.
 *  3. Same-stress siblings ARE carried, after element 0. They are what makes a
 *     choice legible in the dictionary panel; collapsing to one per stress had
 *     already thrown away the prepositional of гора́ and kept the adverb "up".
 *  4. Glosses are copied verbatim from the source. No gloss is composed,
 *     translated, or shortened here: truncateGloss (gloss.ts:329) caps display
 *     at 5 words and 20 characters at render time, which is where the page
 *     geometry is defended.
 *  5. A word absent from the shipped shards is skipped. This payload corrects
 *     entries; it does not introduce headwords.
 *
 * SOURCES: kaikki.org extractions of English Wiktionary and French
 * Wiktionnaire, the same files scripts/build-dictionary.ts was built from,
 * attributed in NOTICES.md under CC BY-SA 4.0 / GFDL.
 *
 * USAGE
 *   node scripts/build-homographs.mjs \
 *     --en ~/Downloads/kaikki.org-dictionary-Russian.jsonl \
 *     --fr ~/Downloads/kaikki.org-dictionary-Russe.jsonl \
 *     --out data/homographs.json
 */

import fs from 'node:fs';
import readline from 'node:readline';
import zlib from 'node:zlib';
import path from 'node:path';

const VOWELS = new Set('аеёиоуыэюяАЕЁИОУЫЭЮЯ'.split(''));
const ACUTE = '́';

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const EN_PATH = arg('--en');
const FR_PATH = arg('--fr');
const OUT_PATH = arg('--out', 'data/homographs.json');
const SHARDS = [
  arg('--shard-a', 'data/dictionary.86d83340-a.json'),
  arg('--shard-b', 'data/dictionary.86d83340-b.json'),
];

if (!EN_PATH) {
  console.error('build-homographs: --en is required');
  process.exit(1);
}

/** Stress position as a 0-based VOWEL index, or null when not derivable. */
function deriveStress(form) {
  if (!form) return null;
  const chars = Array.from(form);
  const hasAcute = chars.includes(ACUTE);
  let vowelIndex = -1;
  let acuteAt = null;
  let yoAt = null;
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (!VOWELS.has(c)) continue;
    vowelIndex++;
    if (chars[i + 1] === ACUTE) acuteAt = vowelIndex;
    if ((c === 'ё' || c === 'Ё') && yoAt === null) yoAt = vowelIndex;
  }
  if (acuteAt !== null) return acuteAt;
  // ё is inherently stressed, but only trust it when the form carries no acute
  // at all; a form with an acute elsewhere has already told us where stress is.
  if (!hasAcute && yoAt !== null) return yoAt;
  return null;
}

function canonicalForms(obj) {
  return (obj.forms || [])
    .filter((f) => Array.isArray(f.tags) && f.tags.includes('canonical'))
    .map((f) => f.form)
    .filter(Boolean);
}

/** One stress per entry, or null when its own canonical forms disagree. */
function entryStress(obj) {
  const values = [...new Set(canonicalForms(obj).map(deriveStress).filter((s) => s !== null))];
  return values.length === 1 ? values[0] : null;
}

function stripAcute(s) {
  return (s || '').replace(new RegExp(ACUTE, 'g'), '');
}

/** Lemma from Kaikki's own form_of field where present, else the word itself. */
function lemmaOf(obj) {
  for (const sense of obj.senses || []) {
    const fo = (sense.form_of || [])[0];
    if (fo && fo.word) return stripAcute(fo.word);
  }
  return obj.word;
}

function sensesOf(obj) {
  return (obj.senses || [])
    .map((s) => (s.glosses || []).join('; '))
    .filter(Boolean);
}

async function streamJsonl(file, onObject) {
  const rl = readline.createInterface({
    input: fs.createReadStream(file),
    crlfDelay: Infinity,
  });
  let lines = 0;
  let parseErrors = 0;
  for await (const line of rl) {
    if (!line) continue;
    lines++;
    let obj;
    try {
      obj = JSON.parse(line);
    } catch {
      parseErrors++;
      continue;
    }
    onObject(obj);
  }
  return { lines, parseErrors };
}

// ── Pass 1: English source ───────────────────────────────────────────

const enByWord = new Map();
let enUndrivable = 0;

const enStats = await streamJsonl(EN_PATH, (obj) => {
  const stress = entryStress(obj);
  if (stress === null) {
    enUndrivable++;
    return;
  }
  const senses = sensesOf(obj);
  if (!senses.length) return;
  if (!enByWord.has(obj.word)) enByWord.set(obj.word, []);
  enByWord.get(obj.word).push({
    s: stress,
    e: senses[0],
    E: senses.join('; '),
    p: obj.pos || '',
    l: lemmaOf(obj),
  });
});

/** The homograph set: two or more DISTINCT stress positions. Policy 1. */
const candidates = new Map();
for (const [word, entries] of enByWord) {
  if (new Set(entries.map((x) => x.s)).size > 1) candidates.set(word, entries);
}
enByWord.clear();

console.log(`EN: ${enStats.lines} lines, ${enUndrivable} undrivable, ${candidates.size} stress homographs`);

// ── Pass 2: French source, for the f/F fields only ───────────────────

const frByWord = new Map();
let frStats = { lines: 0, parseErrors: 0 };
if (FR_PATH && fs.existsSync(FR_PATH)) {
  frStats = await streamJsonl(FR_PATH, (obj) => {
    if (!candidates.has(obj.word)) return;
    const stress = entryStress(obj);
    if (stress === null) return;
    const senses = sensesOf(obj);
    if (!senses.length) return;
    if (!frByWord.has(obj.word)) frByWord.set(obj.word, []);
    frByWord.get(obj.word).push({ s: stress, f: senses[0], F: senses.join('; ') });
  });
  console.log(`FR: ${frStats.lines} lines, ${frByWord.size} of the homograph set matched`);
} else {
  console.log('FR: skipped, no --fr path given or file absent');
}

// ── Pass 3: the shipped shards, for policy 2 and policy 5 ────────────

const shipped = new Map();
for (const shard of SHARDS) {
  if (!fs.existsSync(shard)) {
    console.error(`build-homographs: shard not found: ${shard}`);
    process.exit(1);
  }
  await streamJsonl(shard, (row) => {
    if (!Array.isArray(row)) return;
    const [word, entry] = row;
    if (candidates.has(word)) shipped.set(word, entry);
  });
}
console.log(`shipped: ${shipped.size} of ${candidates.size} homographs exist as headwords`);

// ── Emit ─────────────────────────────────────────────────────────────

const out = {};
const stats = { words: 0, entries: 0, shippedFirst: 0, noShippedStressMatch: 0, skippedNotShipped: 0, dedupedSiblings: 0 };

for (const [word, entries] of candidates) {
  const ship = shipped.get(word);
  if (!ship) {
    stats.skippedNotShipped++;
    continue; // Policy 5
  }
  const fr = frByWord.get(word) || [];
  const decorated = entries.map((en) => {
    const match = fr.find((x) => x.s === en.s);
    return match ? { ...en, f: match.f, F: match.F } : en;
  });

  // Policy 2: the shipped entry leads, verbatim, so entry[0] is what ships now.
  const shippedStress = ship.s ?? ship.stress;
  const rest = decorated.filter((x) => x.s !== shippedStress);
  const sameStress = decorated.filter((x) => x.s === shippedStress);
  if (sameStress.length === 0) stats.noShippedStressMatch++;

  // Policy 6: a same-stress sibling that names the same lemma IS the shipped
  // entry, arriving a second time from the source. One row, not two. Compared on
  // the lemma because the two wordings differ: the shard says "mountain" where
  // the source says "dative/prepositional singular of гора".
  const shippedLemma = (ship.l ?? ship.lemma ?? '').toLowerCase();
  const siblings = sameStress.filter((x) => (x.l ?? '').toLowerCase() !== shippedLemma);
  stats.dedupedSiblings += sameStress.length - siblings.length;

  // Policy 3: same-stress siblings survive, behind the shipped entry.
  const arr = [ship, ...siblings, ...rest];
  out[word] = arr;
  stats.words++;
  stats.entries += arr.length;
  if ((arr[0].s ?? arr[0].stress) === shippedStress) stats.shippedFirst++;
}

const json = JSON.stringify(out);
fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, json);

console.log('');
console.log(`words written      : ${stats.words}`);
console.log(`entries written    : ${stats.entries}`);
console.log(`element 0 is shipped: ${stats.shippedFirst} (must equal words)`);
console.log(`shipped stress absent from source: ${stats.noShippedStressMatch}`);
console.log(`skipped, not a shipped headword  : ${stats.skippedNotShipped}`);
console.log(`deduped same-lemma siblings     : ${stats.dedupedSiblings}`);
console.log(`raw                : ${(json.length / 1024 / 1024).toFixed(2)} MB`);
console.log(`gzipped            : ${(zlib.gzipSync(Buffer.from(json)).length / 1024).toFixed(0)} KB`);
console.log(`out                : ${OUT_PATH}`);

for (const probe of ['горе', 'мука']) {
  const v = out[probe];
  console.log(`${probe}: ${v ? v.length + ' entries, stresses ' + v.map((x) => x.s ?? x.stress).join(',') : 'ABSENT'}`);
}
