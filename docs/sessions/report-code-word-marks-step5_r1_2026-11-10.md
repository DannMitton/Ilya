# Report: word marks, step 5, the as-built review's four parts (Code, cloud-lane-42, r1, 2026-11-10)

Branch `cloud-lane-42`, QUEUE row 184 (the word marks). Parts (a), (b), (c), the merge of `origin/Shane`, and (d) are separate commits. Lane 44 (`cloud-lane-44`) is an ancestor of `origin/Shane` (`git merge-base --is-ancestor` true), so the merge went ahead.

## (a) One vowel per note on a stored division
- `reslicedSyllables` (`syllable-utils.ts`) uses an override only where `keepsEveryVowel` holds: the recut has the engine's number of syllables and, in each place, the engine syllable's count of vowel letters (`VOWEL`, й a consonant). Otherwise the override is ignored and the engine's division, or the global open-syllabification rule, stands.
- `mapsFromRows` refuses the same rows (`boundariesKeepOneVowel`, on the word's letters alone: boundaries whole, rising, inside the word, one vowel a piece) and counts them as dropped, so a bad row is not written back.
- `pairings.ts` comment updated. `VOWEL` is exported by `omr/underlay-units.ts`, not `assert-vowel-per-note.ts` (which imports it); I imported it from the first.
- Tests: new `syllable-utils.test.ts` (too few boundaries, a boundary past the end, a boundary that moves a vowel, each falls back; й; the letters-only rule) and one in `word-mark-rows.test.ts`. A cut such as `москв|а` moves no vowel count (one each side) and is used; I judged that correct under the rule as written.

## (b) Relabel
22 comment lines in 15 files now say "row 184 (word marks)". None says "row 182" in `apps/` or `packages/`. The earlier reports under `docs/sessions/` are left as written.

## (c) The Chrome-on-iPhone install line
The two ratified strings are in `InstallPrompt.svelte` (apostrophes U+2019), the comment says "Ratified by Dann 2026-11-09 23:14", and `install-prompt-gate.test.ts` pins both lines; the held-down title and the null test are gone, the raise and draw tests kept (the `string | null` declaration test is kept too).

## The merge of `origin/Shane`
Conflicts in three files only: `document.svelte.ts` (kept every import), `library.ts` (this lane's destructuring with `wordMarks: _wordMarks`, then lane 44's `rowsFromEdits` line), `+page.svelte` (lane 44's import line, then `spotInversions`; the `WordMarks` import dropped). `i18n.ts` merged without a conflict, so no recount was needed. `svelte-check`: 0 errors, 12 warnings.

## (d) The homograph gloss after a reload
`LoaderState.homographsReady` (false at start) turns true when `installHomographEntries` returns, through a callback `scheduleHomographTier` takes, which announces the state. In the page, `poemLines` and the score-derived Lyrics lines read it, and one `$effect` runs `runPipeline()` when it turns true, untracked, if Lyrics have a stress mark and are transcribed (`lines.length > 0`; one guard beyond the brief, so it never runs before the first transcription). Tests: a loader test (false at ready, announced once when the tier lands), and the e2e test now asserts the gloss after the reload. With the effect disabled it fails ("castle" for "lock"); with it, both runs pass.

## Gates, on the merged tip
| # | gate | result |
|---|---|---|
| 1 | phonology | 456 passed |
| 2 | dictionary | 248 passed |
| 3 | web check | 0 errors, 12 warnings |
| 4 | web tests | 4822 passed, 1 skipped |
| 5 | score-parser | 785 passed, 5 skipped |
| 6 | blurb | 168 passed |
| 7 | integration | 125 passed |
| 8 | ratchets | OK after one fix: the run showed `pairings.ts` 1423 lines over its ceiling of 1422 (my comment in (a) was a line too long); I shortened it to 1421 and re-ran gate 8 and the `lib/score` and `syllable-utils` tests (1244 passed). No ceiling was raised. |

## Playwright
`chromium`: 141 passed, 7 failed. `phone`: 25 passed, 4 failed. The 11 reds are the same 11 I showed fail on `origin/cloud-lane-38` in step 4, by name: `glue-typed-marks` (2), `heic-reader-path` (HEIC poem), `insights-page` (page order), `loupe-header` (drag), `print-pages`, `singer-paths` (Learn and Guide headings); `input-views` (poem typed into Poem), `phrase-ends`, `relining` (y and bb). I did not re-run them on `origin/Shane` itself, so "among the 11 known reds on Shane" rests on those names matching; no red is new.

## What I could not establish
- That the 11 reds fail identically on `origin/Shane` (compared by name only).
- That the homograph re-run is the only late tier that can change a printed word: the gloss tier (`scheduleGlossTier`) also lands late, and I did not check whether a saved mark is affected by it.
- Playwright after the one-line comment fix in `pairings.ts`: not re-run (comment only; unit tests re-run).
