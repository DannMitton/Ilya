# Report: poem library build 1, step 1, the data build (Code cloud lane, r1, 2026-11-03)

Brief: `brief-code-poem-library-build1_r3_2026-11-03.md`, step 1. Branch `cloud-lane-31`, on top of the step 0 commit `e9e609b`. Step 0's report: `report-code-poem-build1-step0_r1_2026-11-03.md`.

## What was built

| File | State |
|---|---|
| `scripts/build-poem-library.mjs` | new, 170 lines |
| `data/dictionary.poems.a97f2074.json` | new, generated |
| `data/dictionary-manifest.json` | adds `poemFiles` and `poemHash`; no other key moved |
| `tests/build-poem-library.test.ts` | new, 14 tests |

Run it from the repository root: `node scripts/build-poem-library.mjs`. It reads `tools/poems/library.json`, writes the poem file, removes any earlier `dictionary.poems.*.json`, and rewrites the manifest.

## The byte count (`CONTRACT.md:150`, §8)

`data/` is served whole: `apps/web/static/data` is a symlink to `../../../data` (`ls -la`, step 0), so the poem file is served as a static file.

- **`data/dictionary.poems.a97f2074.json`: 131,622 bytes** (`ls -l`). Gzipped: 32,727 bytes (`gzip -c | wc -c`). 14 entries.
- `data/dictionary-manifest.json`: 239 bytes before, 324 after (`git show HEAD:... | wc -c`, `wc -c`).
- For comparison, `tools/poems/library.json` is 108,533 bytes and is not served.

The 131,622 bytes break down as (counted from the built file): `textModern` 47,085 bytes, `letters` 39,106 bytes, `at` (offsets) 39,124 bytes, and about 6,300 bytes of other fields and JSON syntax (the remainder; not itemised).

## What an entry holds

Per entry: `id`, `work`, `title`, `incipit`, `author`, `translator`, `source: { site, url }`, `spelling`, `textModern`, `letters`, `at`. `textEdition`, `rightsHolderDates`, `status`, `editionAsNamed`, `revid`, `page`, and `licenceTemplate` are not shipped (the brief's list).

`letters` is the folded letter stream of `textModern`. `at` is the map from each letter back to its offset in `textModern`. **I delta-coded `at`** (the first value is the first letter's offset; each later value is the distance from the letter before) to save bytes, because absolute offsets run to five digits in the 19,433-character «Мцыри». `decodeOffsets` in the script restores them; step 3's matcher needs the same few lines. **DESK DEFAULT (mine), reversible:** it is one function pair and one test; plain offsets would add about 40 KB.

**The fold is `reference_sw_match.py`'s, line for line:** lowercase; ѣ→е, і→и, ѳ→ф, ѵ→и, ё→е, й→и; ъ dropped; everything outside а-я dropped. I checked it against the Python reference on all 14 entries: the 19,553 letters match, and each decoded offset points at a character that folds to its letter (a one-off check in this session; the committed test checks the same property in TypeScript, not against the Python).

## Hash and name

The hash is the first 8 hex digits of the MD5 of the file's text, as the dictionary's own build computes its hash (`scripts/build-dictionary.ts:1192`). The build is deterministic: no date, no random value. The name `dictionary.poems.a97f2074.json` begins `dictionary.` and ends `.json`, so `apps/web/static/sw.js:100` returns without intercepting it. The test reads `sw.js` and fails if that line changes.

`hash` in the manifest is untouched: `86d83340` before and after.

## Two findings

**1. The poem file is ignored by git, as the dictionary shards are, and has to be force-added.** `.gitignore:12` reads `data/dictionary.*.json`, and `git check-ignore -v` confirms it matches the new file. The existing shards are tracked anyway (`git ls-files data` lists them), so they were force-added. I added the poem file with `git add -f`. Without that, the committed manifest would name a file the deploy does not have. The drift test below fails if the file is missing.

**2. The brief says 12 works; `library.json` holds 13.** 14 entries, 13 distinct `work` values (`python3`, read from the file): `0127a63f`, `21568f1c`, `2ba9040d`, `307359f1`, `36f13ef5`, `56eb0aac`, `78b74873`, `7b9b662a`, `82c93fcf`, `87376c17`, `c1964bc3`, `cc7237d9`, `f1a88510` (the last holds two entries, `298e556367` and `6b51c54db7`). The brief's "12 works" (inputs section) and the shortlist note ("with 12 works the shortlist is everything") are one short. Nothing changes: 13 is still under the shortlist size of 20. The test pins 13.

## One question for Dann (a cost, not a blocker)

`CONTRACT.md:144` says "Do not store anything derived." `letters` and `at` are derived from `textModern` and are 78,230 of the file's 131,622 bytes (59%). The brief orders them in the file, so I shipped them. Without them the file is about 53 KB, and the client would compute the same stream from `textModern` once per library load (about 19,553 letters, a few milliseconds; NOT MEASURED on a phone). Step 2 stores the file in IndexedDB, so the derived bytes are stored on the singer's device too. **Recommendation:** ship it as the brief says for build 1, and measure the load on a phone before deciding. The change, if wanted, is local to `shipEntry` and the matcher's input. It is Dann's call; I am not holding the steps for it.

## Tests

`tests/build-poem-library.test.ts`, run by `pnpm test:integration` (the root suite): 14 tests.

- The fold: case, й ё ѣ і ѳ ѵ, ъ dropped, Latin and punctuation dropped.
- Offsets: each points at a letter; delta coding round-trips.
- An entry: exactly the fields listed; the decoded offsets of every shipped entry rebuild its `letters`.
- A bad library fails the build: empty title, spelling `old`, no `source.url`, a numeric translator, no entries, a repeated id.
- Deterministic; the name is `dictionary.poems.<hash8>.json`; 14 entries of 13 works.
- The manifest: `withPoemKeys` adds two keys and moves none.
- **Drift:** the committed manifest names the file the library builds; the file on disk equals a fresh build byte for byte; `data/` holds exactly one poem file; the file is not one of the dictionary shards; `sw.js:100` is unchanged.

One slip of mine, fixed before the commit: my first fold test typed a Latin `i` for the Cyrillic `і`; the test now writes `і`.

## Gates after step 1

| Gate | Before (step 0) | After |
|---|---|---|
| phonology | 407 | not rerun (no change in the package) |
| dictionary | 248 | not rerun |
| blurb | 148 | not rerun |
| score-parser | 785 + 5 skipped | not rerun |
| web unit | 3898 + 1 skipped | 3898 + 1 skipped (rerun) |
| integration (root) | 98 | **112** (+14) |
| svelte-check | 0 errors, 12 warnings | not rerun (no `.ts` or `.svelte` under `apps/web/src` changed) |
| ratchets | OK | OK (rerun) |

The e2e baseline (8 failures at `979fdd78`, step 0 section 9) is not rerun for this step: no app code changed. Step 6 reruns it.
