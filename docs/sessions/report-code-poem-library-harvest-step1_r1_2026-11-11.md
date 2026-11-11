Model: Sonnet 5.5 (claude-sonnet-5-5)

# Report: poem library harvest, step 1 (the 224 entries enter the library), 2026-11-11

Branch `cloud-lane-45`, on top of the step 0 commit. `docs/memory/OPEN.md` left alone and unstaged.

## What changed

- `tools/poems/library.json`: the 224 entries appended after the existing 103, in the data file's order; `version` `r2` to `r3`; `built` `2026-11-11`. The data file's top-level keys were not copied. Same formatting as before (one-space indent, no trailing newline). 327 entries.
- The three pre-reform entries now carry modern titles and incipits (`textEdition` untouched):
  - `7f571e4227`: title «Странник», incipit «Томит меня мой страннический путь,»
  - `43ce5bb096`: title «Сон в летнюю ночь», incipit «Долго ночью вчера я заснуть не могла,» (the old incipit was already modern)
  - `91a716b953`: title «Нет, только тот, кто знал…» (the entry's own title keeps its guillemets, as the printed title had them; the brief writes the guillemets around the title), incipit «Нет, только тот, кто знал»
  Each incipit is the first line of its `textModern`.
- `scripts/build-poem-library.mjs`: `POEM_PROVENANCE_KEYS` (the ten keys the brief lists), `LAST_RIGHTS_HOLDER_DEATH_YEAR` = 1971, and `poemTrailFault`, called from `shipEntry` for every entry that is not a libretto. The build refuses a poem whose `rightsHolderDates[1]` is not a whole year of 1971 or earlier (missing, null, a string, a fraction, or 1972 and later all refuse), and a poem whose `provenance` holds a key outside the list, naming the key. The 14 first poems carry no `provenance` and pass. A libretto is not touched by either check (its trail has its own).
- `tests/build-poem-library.test.ts`: a block of four tests for the two checks (refusal of each, the list pinned, the 14 first poems and all 238 poems of the library pass, a libretto is unaffected); the two count pins moved (238 poems of 237 works with the 14 first checked by id; 327 entries of 266 works). The pin for the 14 is by id (`FIRST_FOURTEEN`), not a count of entries with no `kind`.
- `node scripts/build-poem-library.mjs`: removed `data/dictionary.poems.a7c468a0.json`; wrote `data/dictionary.poems.d77d09cd.json` (1,134,338 bytes, 327 entries); the manifest's `poemFiles` and `poemHash` moved and its dictionary `hash` `86d83340` is unchanged (the diff of the manifest is those two lines only). The new file is added with `git add -f`; the old one is removed from the index. Nothing else in the tree names `a7c468a0` except reports.
- `tools/poems/poems-harvest-for-library_r2_2026-11-10.json` removed from the tree (`git rm`) in this commit.

## Verified

- `tests/build-poem-library.test.ts`: 57 passed (the root vitest config).
- The builder's `shipEntry` passed all 327 entries with no throw (the build ran).

## Red until step 3 (not fixed here, per the brief)

`pnpm --filter @ilya/web exec vitest run src/lib/text/poem`: 10 failed of 318.
1. `poem-arias.test.ts` (103 entries of 42 works).
2. `poem-library.test.ts` (committed file: 103).
3. `poem-library-strings.test.ts` (every site is listed: `az.lib.ru` is not yet; step 2).
4. `poem-match.test.ts`: U4, U5, r114-song4 (the second or top work moved, as the brief predicted); "the shortlist is everything (13)" and "42 works".
5. `poem-source.test.ts`: the stanza-start pin (846 against 166).
6. **`poem-source.test.ts` "no poem in the library fills its dating line, and each still ends on its last verse": fails on «Русская песня»** (`expected false to be true`). The brief did not predict this one. It is a content fault to read in step 3, and not changed here.

Gate 4 is therefore red at this commit. Gates 1, 2, 5, 6, 7 do not read the library and are not affected; gates 3 and 8 not re-run for this step.

## What Code could not establish

- Whether the «Русская песня» failure is a fault in the data (the entry's ending) or in the test's expectation: not read yet.
- The gate figures after this step: only the poem test files and the root build test were run, not all eight gates.
- Whether any entry other than the three above carries a title that departs from the five pre-reform entries' convention: I read only those three, as the brief names them.
