# Report, lane 71, step 7: the tests, the golden, and the eight gates again

2026-11-19. Branch `cloud-lane-71`, on `684004c9` (step 6) plus this step. Brief section 7. Paths are under `apps/web/` unless a path starts at the repository root.

## 1. The eight gates, against my own Step 0 baseline

All eight, on the final tree, from the repo root, with the commands of `report-code-lane71-step0_r1_2026-11-19.md`. Logs in the session scratchpad, not committed.

| Gate | Step 0 baseline (verbatim) | Now (verbatim) | Verdict |
| --- | --- | --- | --- |
| 1 phonology | `Tests  462 passed (462)` | `Tests  462 passed (462)` | at baseline |
| 2 dictionary | `Tests  248 passed (248)` | `Tests  248 passed (248)` | at baseline |
| 3 web-check | `svelte-check found 0 errors and 12 warnings in 5 files` | `svelte-check found 0 errors and 12 warnings in 5 files` | at baseline |
| 4 web-test | `Tests  6687 passed \| 5 skipped (6692)`, 362 files | `Tests  6723 passed \| 5 skipped (6728)`, 363 files, 0 failed, `real 5m5.717s` | **moved by +36 passed and +1 file, all added tests** |
| 5 score-parser | `Tests  904 passed \| 5 skipped (909)` | `Tests  904 passed \| 5 skipped (909)` | at baseline |
| 6 blurb | `Tests  178 passed (178)` | `Tests  178 passed (178)` | at baseline |
| 7 integration | `Tests  159 passed (159)` | `Tests  159 passed (159)` | at baseline |
| 8 ratchets | `ratchets: OK.` | `ratchets: OK.` | at baseline |

**Gate 4's expected baseline (task, from `docs/memory/STATE.md:21`, which is where the figure is, not `:19`): `6691 passed | 1 skipped (6692)`.** This sandbox runs the other form, `6687 passed | 5 skipped (6692)`, at Step 0 and now; the four extra skips are the four `it.skipIf(!havePython)` tests in `voice/engine/burg.test.ts`, with scipy absent here (step 0 report, section 2). Both halves of the total, against the expected figure: passed 6691 expected, 6687 here at the start; skipped 1 expected, 5 here. **Now: 6723 passed | 5 skipped (6728).** The skips are unchanged; the 36 are new passing tests. On a machine with scipy the same tree should read 6727 passed | 1 skipped (6728); that is arithmetic, not a run, and the ship script's gate 4 string will need that move on the merge (not moved by me).

**Where the +36 came from (by subtraction and by file, from the diffs):** the new file `src/lib/stand-in-borrowing.test.ts` has 24 tests (`vitest` reported 24 passed); `insights/ratified-lines.test.ts` gained 7 (two new `describe` blocks of 4 and 3); `components/Drawer/voice-pane.test.ts` gained 3 (two new sentence rows and one new test); `insights/identity.test.ts` gained 2. 24 + 7 + 3 + 2 = 36. `stand-ins-snapshot.test.ts` gains 3 rows (the three types join the template loop) and loses 3 (they leave the empty-profile loop), net 0. Not verified by a per-file run of the whole suite at the end; I counted the `it(` lines I changed.

**Ratchets (gate 8).** None moved. The nine "could be lowered" notices are line for line what Step 0 printed (`diff` of the two outputs: identical): `Drawer.svelte` 1990 -> 1986; `InspectorPanel.svelte` 2432 -> 2396; `LearnContent.svelte` 4099 -> 4097; `pipeline.ts` 901 -> 896; `ScoreUploader.svelte` 867 -> 865; `pairings.ts` 1422 -> 1421; `CalibrationWizard.svelte` 1126 -> 1124; `routes/+page.svelte` 5534 -> 5532; `score-parser/src/musicxml-parser.ts` 1167 -> 1166. I moved no ceiling. Two ceilings were hit on the way and met by moving code, not by raising a number: Step 4 (`InsightsPane.svelte` 677, `MarkupPane.svelte` 1349) and this step (a module-boundary breach: my new test first sat in `voice/` and imported `markup/`, `insights/`, and `analysis/`, which `scripts/ratchets.mjs:78-85` forbids, tests included; it now sits at `src/lib/stand-in-borrowing.test.ts`, outside the six modules).

## 2. Tests the lane broke, and what each became

| File | What changed |
| --- | --- |
| `voice/engine/resolve-values.test.ts` | `WITHHELD` is now `['not-sure', undefined, '']`; the list is the eight; titles say "eight" |
| `analysis/stand-ins-snapshot.test.ts` | the nothing-sung template loop covers the eight, with `contralto`, `countertenor`, and `tenor` on `tenor-mezzo` and `bass-baritone` on `bass`; the empty-profile loop is `not-sure`, `other-text`, and no type; the "no placeholder type" and "one to four" tests use `not-sure` for the empty case |
| `insights/identity.test.ts` | the no-score key for a contralto, countertenor, and bass-baritone is `insights.method.noScore.generic`; `not-sure` and no type are `.none`; two new tests (below) |
| `components/Drawer/voice-pane.test.ts` | "a type with none" is gone; rows for contralto, countertenor, and bass-baritone read the staff ("a mezzo-soprano voice", "a mezzo and tenor voice", "a bass voice"); the "Not sure" row carries the ratified 11:59 text; the door test covers the eight; one new test that `typed-none` no longer exists |
| `insights/ratified-lines.test.ts` | the three Method strings and the broad note pin the 12:01 text; two new `describe` blocks (below) |
| `analysis/analyze-score-adapter.test.ts` | the broad note's closing sentence, EN and FR |
| `voice/chart/ratified-strings.test.ts` | `sheet.provenance` and `capture.hint.placed.typed` pin the 12:01 text; `sheet.provenance.undeclared` is a new pinned row (seventy-one to seventy-two), marked DESK DEFAULT |
| `voice/chart/screen-logic.test.ts` | the typed hint reads "from its bass values" |
| `e2e/voice-pane.test.ts` | a contralto reads "a mezzo-soprano voice" and the door opens; "Not sure" reads the new sentence and the door stays shut |
| `e2e/insights-no-score.test.ts` | the generic Method line is the 12:01 text; the third case is "Not sure"; a new case for a contralto, both languages, asserting the generic Method line and the borrowing line with no score loaded |
| `i18n-index.test.ts` | not edited: its numbers are in `i18n.ts`'s own header, which Steps 2, 4, and 6 moved (total 1,342 to 1,347; `voiceType.` 42 to 45; `placeholder.` 12 to 13; `sheet.` 16 to 17) |

**Section 7's list, against what failed.** Every file it names was edited, except that `voice/chart/screen-logic.test.ts` kept its `hasDeclaredType` assertions (`:49-50`) unchanged, because the function is unchanged. Step 1's report lists sites in section 7 that did not fail at that step (`ratified-lines`, `analyze-score-adapter.test`, `screen-logic.test`, `ratified-strings`) and failed later, once Steps 3 and 6 changed the strings they pin.

## 3. The adapter golden, regenerated on purpose

`UPDATE_ADAPTER_GOLDEN=1 pnpm exec vitest run src/lib/analysis/adapter-golden.test.ts`, then the same test without it (5 passed). Before: a copy of the file, kept in the scratchpad. `diff` of the parsed JSON, row by row:

- 144 rows before, 144 after, the same keys.
- **Three rows changed, no more:** `contralto | none`, `countertenor | none`, and `bass-baritone | none`. The other nine sets of each of those types did not change, because a voice with any sampled vowel already ran the stand-ins (lane 68).
- Each changed row: `generic` false to true; `completeness.formants` false to true (range, tessitura, and passaggio stay false); `standIns` from absent to present with bucket `tenor-mezzo` (contralto and countertenor) or `bass` (bass-baritone), steps `template` and `derived`; `snapshot.fR1` from empty to ten vowels, every source `surrogate` (contralto's [i] 339.3 and [o] 538.6; bass-baritone's [i] 311.1 and [o] 440). Each is **equal, key for key, to its twin's row:** `contralto | none` equals `mezzo-soprano | none`, `countertenor | none` equals `tenor | none`, `bass-baritone | none` equals `bass | none`.
- **The `not-sure`, `(undefined)`, and `''` rows did not move:** 12 rows each, 0 changed.
- The file's diff is 195 insertions and 12 deletions (`git diff --stat`).

## 4. Tests the lane adds (brief section 7's sixteen)

`src/lib/stand-in-borrowing.test.ts` (24 tests, each over both languages where a language applies), and two `describe` blocks in `insights/ratified-lines.test.ts`:

| Brief | Where | Notes |
| --- | --- | --- |
| 1 gate | `stand-in-borrowing.test.ts`, `describe` 1 | the eight true; `not-sure`, none, `''`, an unknown id false; the list equals `TIER1` less `not-sure` |
| 2 declared type in no `{voiceType}` fill | `describe` 2, both languages | every site rendered through the page's own function. **The vowel chart caption is rendered by the same two calls the pane makes (`placeholderLabel`, then `fillVoiceType`), not through `singerBlocks`**, which needs a whole model. The section 3 line is the stated exception and asserted to carry both names |
| 3 Other and Tier 2 | `describe` 3 | `haute-contre`, `sopranist`, Other's text, and a Tier 2 that repeats the id, on each of the three |
| 4 "Not sure" | `describe` 4 | `undefined` for `not-sure` with and without Other's text, none, `''`, an unknown id, `'Contralto'`, and `' contralto'` (the last two return `undefined` too: see NOT ESTABLISHED 3) |
| 5 strings never say "your voice type" | `describe` 5, by key | the six keys |
| 6 `notSure` and `noScore.none` | `describe` 6; also pinned in `ratified-lines.test.ts` with the date | |
| 7 the draw rule | `describe` 7 | draws with 0, 1, 3, 4 core vowels for each of the three; not at 5 or 6; not for the five published types, `not-sure`, none, `''`, unknown. **The "on both pages and with no score" half is two source assertions** that each pane's `note={[...]}` contains the `borrowingLine(...)` call, plus the function taking no analysis, **plus the Playwright case** `e2e/insights-no-score.test.ts` ("a contralto with nothing recorded ..."), which renders INSIGHTS with no score and reads the line on the page, EN and FR. MELODY with a score was not rendered |
| 8 `{type}` is the Tier 1 name | `describe` 8 | « pour un contralto. », « un contre-ténor », « un baryton-basse » |
| 9 octavist | `describe` 9 | **tested as the Tier 1 id `bass`, the input every one of these three functions takes.** It does not render a stored voice whose Tier 2 is `octavist`; the guarantee is that no function here reads Tier 2 |
| 10 the door | `describe` 10, and `voice-pane.test.ts` | |
| 11 undeclared forms | `describe` 11 | `sheet.provenance.undeclared` and `capture.hint.placed.untyped` for `not-sure`, none, `''`, unknown; the typed forms for the eight |
| 12 no brace at any site | `describe` 12 | nine Tier 1 ids, none, `''`, `'castrato'`, both languages |
| 13 one page read whole | `describe` 13 | **read from the pure functions, not from a rendered page**: for each of the three types, every sentence that names a staff names the same one and no other type (the sheet's note is compared from its "placeholder values" clause, since the earlier clause names Bozeman's baritones); the four sentences that carry no token name no type |
| 14 characters | `describe` 14 | thirteen keys: no straight apostrophe in either language; every French colon preceded by U+00A0 |
| 15 the Guide passage | `ratified-lines.test.ts`, "row 167: the Guide passage is seated whole" | the text content of `<p id="guide-markup-stand-ins">` equals the ruling's passage, EN and FR, the middle-of-five-staves sentence included, and the anchor is in both branches |
| 16 French as well | every `describe` above loops `LANGS` | |

**"Pin every ratified string with its ruling's date"**: the block "row 167: the borrowing strings (Dann 2026-11-19)" in `insights/ratified-lines.test.ts` pins the borrowing line (09:43, 09:52), the three staff labels, `calib.pane.notSure` (11:59), and `calib.pane.typedNone` (kept, unused). The 12:01 strings are pinned in the row 166 block and in `voice/chart/ratified-strings.test.ts`, each with its date in a comment.

## 5. Playwright, run here, not among the eight gates

A throwaway `pw-scratch.config.ts` (not committed, deleted) pointed the project's Playwright at `/opt/pw-browsers/chromium`; the project's own config wants a Chromium build that is not installed here.

- `e2e/voice-pane.test.ts` and `e2e/insights-no-score.test.ts`: **32 passed**, including the edited and the new cases.
- `e2e/pages-without-gaps.test.ts`: **31 passed** (9.3 minutes).
- `e2e/insights-links.test.ts`, `e2e/melody-no-score-count.test.ts`, `e2e/singer-paths.test.ts`, with the first 44 of 53 tests of a run that I cut at ten minutes: no failure printed in what ran. **Not a complete result.** I did not re-run them to the end.
- Phone project, `e2e-phone/voice-stations.test.ts` and `e2e-phone/insights-links.test.ts`: **9 passed, 2 failed.**
  - `e2e-phone/insights-links.test.ts:32` ("L1 with the Drawer open on VOICE lands on its station, in view"): **the known flake fired**, `expect(boundingBox().y).toBeGreaterThanOrEqual(0)` receiving `-0.0625` at `:46`, as the task states. Not chased.
  - `e2e-phone/voice-stations.test.ts:62` ("Add your range" with the Drawer raised): **failed once in the first run**, `the Range pickers are inside the window`, `Expected: >= 0, Received: -0.09375` at `:76`. **The same family of sub-pixel result, in a different test I did not know to flake.** I re-ran the file with `--repeat-each=4`: 24 of 24 passed, including this test four times. So it did not recur. I have no run of this test on the untouched cut, so whether it flakes without this lane is NOT ESTABLISHED; I did not chase it.

## NOT ESTABLISHED

1. Whether `e2e-phone/voice-stations.test.ts:62` flakes on the untouched cut `6c0bb4fc`. One failure in the first run, four passes in the repeat; no baseline run.
2. How MELODY's page 1 reads for a contralto, a countertenor, and a bass-baritone with a score. The line is in the `note` array (a source assertion); no page was rendered, no screenshot taken, and the header's added height was not measured on MELODY or on INSIGHTS with a score. `e2e/pages-without-gaps.test.ts` passed, which does not say the header fits.
3. `borrowedStaffLabel` exact-matches Tier 1 ids (`isTier1`), so a stored `'Contralto'` or `' contralto'` returns `undefined`, where `hasPlaceholderProfile` and `standInBucket` trim and lower-case. Test 4 pins the current behaviour. Whether a stored id can carry that spelling is not read.
4. Whether the singer-facing tests of the brief's 13 ("one page rendered whole") are satisfied by pure functions: I read them as sentences, not a screen.
5. Gate 4 with scipy present: 6727 passed | 1 skipped (6728) is arithmetic, not a run.
6. Whether `e2e/insights-links.test.ts`, `melody-no-score-count.test.ts`, and `singer-paths.test.ts` pass to the end. Their first 44 of 53 results, in a run I stopped, showed no failure.
7. Every place the brief's section 9 items 1 to 6 leave open: `capture.hint.placed.typed` still false at five stable core vowels (1); the sources note's first clause for an undeclared voice (2); `bucketFor` and the countertenor (3, **I left `bucketFor` alone and changed no line of `plausibility.ts`**; a countertenor's chart zones are the union bands while his placeholders are the mezzo and tenor staff's, and his page now says "mezzo and tenor values" beside them, as the brief records); `calib.pane.notSure` offering "published values" for the three that have none (4); `knip` on `calib.pane.typedNone` and `hasDeclaredType` (5); Other's text for the five published types (6, behaviour kept).
