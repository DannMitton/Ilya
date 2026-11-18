# Report: lane 67, Step 8 (strings, pictures, the recorder build, the end gates)

2026-11-18, Code (cloud session), branch `cloud-lane-67`. Paths under `apps/web/` unless they begin with `docs/`.

## 1. The seven strings

Added in the steps that read them (Step 5: `calib.summary.unstable`; Step 6: the four `calib.pane.core*` keys; Step 7: `calib.summary.keepOne`, `calib.summary.useEstimate`). Checked here two ways: `src/lib/lane67-strings.test.ts` (new, 7 tests) pins each key, English and French, character for character; and a one-off test compared `t(key, lang)` with the brief's section 6 table as parsed from the file (7 of 7 equal, the ` ` of the table read as U+00A0). The key count line (`src/lib/i18n.ts`) says 1,335 and the `calib.` index count 127; `i18n-index.test.ts` passes. Nothing else a singer reads is new: the only other change a singer reads is the existing `calib.summary.outsideIgh` now having a reader.

## 2. Pictures (`docs/sessions/report-code-lane67-pictures/`), 20, each looked at

Desktop 1440 by 900 at 2x, phone 390 by 844 at 3x; English and French; a bass type; the stub session (`?capture=stub`); the seeded stores are in `report-code-lane67-pictures/` only as the pictures (the script was a scratch file and is not kept).
- `pane-3core-{desk,phone}-{en,fr}`: "You have recorded 3 of the 6 core vowels. Record 2 more, and Ilya builds your resonance profile. Until then, it uses generic values for a bass voice." / « Vous avez capté 3 des 6 voyelles de base… une voix type de basse. » The doors read "Carry on recording" and "Your vowel space".
- `pane-5core-…`: the existing sentence, "You have recorded 5 of the 10 vowels. Ilya fills the other 5…".
- `summary-unstable-…`: the one note, "These readings were unstable: [e] close-e. Another try may help." with Keep them and Re-take; the roster still marks [e] Provisional.
- `summary-far-igh-…`: the ratified [ɨ] message with Keep it, Re-take, and Use Ilya's estimate for now (« Le garder », « Reprendre », « Utiliser l’estimation d’Ilya pour l’instant »).
- `insights-3core-…`: INSIGHTS for [i], [e], [u], and a non-core [a]: "INSIGHTS FOR DANN · BASS · NOT CALIBRATED", "These findings use placeholder values for a generic bass, not your specific voice."
**One defect found by looking, and fixed**: on the phone the far-off note's three buttons stood in one row and broke inside words ("Re-" / "take", "Keep" / "it"). `voice/OutsideNote.svelte`'s `.outside-actions` now wraps and centres, so the phone shows two buttons and one. The pictures are of the fixed layout (re-made after the fix; the first phone pictures of this note were replaced).
What the pictures do not show: the desktop pictures are of the whole page at 1440 by 900, so the tall summary is cut at the Drawer's foot, as in lane 66's.

## 3. `vercel.json`

Both places name `cloud-lane-67` alone (`buildCommand` and `git.deploymentEnabled`). It parses as JSON.

## 4. The eight gates, on the lane's final tree (checked once at the end, before the last CSS and test-only commits; the type check, ratchets, and the voice tests were run again after them)

| Gate | Baseline (Step 0) | Result |
|---|---|---|
| 1 phonology | 462 passed (462) | 462 passed (462) |
| 2 dictionary | 248 passed (248) | 248 passed (248) |
| 3 web-check | found 0 errors and 12 warnings in 5 files | 0 errors, 12 warnings, 5 files (1240 files) |
| 4 web-test | 6609 passed, 5 skipped (6614) without Python, numpy, scipy (this container) | **6656 passed, 5 skipped (6661)**, +47 tests |
| 5 score-parser | 904 passed, 5 skipped (909) | 904 passed, 5 skipped (909) |
| 6 blurb | 178 passed (178) | 178 passed (178) |
| 7 integration | 159 passed (159) | 159 passed (159) |
| 8 ratchets | OK | ratchets: OK; no ceiling raised (`CalibrationWizard.svelte` 1124 of 1126, `MarkupPane.svelte` 1353 of 1353, `+page.svelte` 5532 of 5534, `InsightsPane.svelte` 742 of 744) |

Gate 4 moved by 47 tests across the lane's steps (new: `voice/engine/sung.test.ts`, `voice/outside-igh.test.ts`, `lane67-strings.test.ts`; added or replaced in existing files in Steps 2, 3, 5, and 6). I did not tally each file's delta to the 47. The with-scipy figure (6613 | 1 skipped at `Shane`) is not measured here. The tool's tests (`tools/n200-score`, 55 passed, 1 skipped) are in no gate.

## 5. Playwright, `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`, `--trace off`, development server

Desktop (`--project=chromium`, `voice-pane voice-stations voice-links insights-links calibrate-new`), first run: **82 passed, 6 failed** (23.6 minutes). Phone (`--project=phone`, `voice-stations insights-links`), first run: 9 passed, 2 failed. Each failure is listed below with its cause and the change.

The six desktop failures are seeded stores that the brief's section 1 now treats differently; I changed the expectation in each, and only there:
1. `calibrate-new.test.ts` "a tap focuses and never records…Use what I've recorded shows after one vowel": below five core vowels the finish control no longer shows (brief Step 2.3). The test now asserts it is absent after one vowel; a new test, "Use what I've recorded shows from the fifth core vowel, and opens the summary with the five rows", seeds five core vowels and asserts it shows and opens a summary of five rows.
2. to 4. "a rolled-back re-take…", "a re-take from the summary walks its pass…", "a tap during the dwell…": the seeds were an [i] with a high-confidence reading judged `implausible`, which the summary's note named and offered Re-take for. The note is now on an unstable take (brief Step 5), so the seeds are an [i] with `confidence: 'low'`. Test 2 also needed a different route: a re-take is rolled back only when the stored reading is the clearer one, so it seeds six steady core vowels, opens the capture screen from "Carry on recording", focuses [i], and starts it; and at its end the control reads "Let Ilya work out the other four" (six core vowels: the four left can all be worked out), with six rows.
5. `insights-links.test.ts` L4 "is not drawn when a vowel is recorded": the seed had three core vowels and a non-core [a], which is below five, so INSIGHTS correctly offers the record link. It now seeds five core vowels (and its title says so).
6. `voice-pane.test.ts` "refused over the capture screen…": below five core vowels INSIGHTS offers a link with the same words as the pane's door ("Carry on recording"), so the role query matched two buttons. The test now picks the pane's door by its class, `.vp-door`.
Re-run of the five changed tests and their neighbours (`-g`): **9 passed, 1 failed** on the first pass, then the failing one (test 2, after its re-route) passed alone: so, after the changes, every desktop test I changed passes. I did not re-run the whole desktop set a second time; the 82 that passed in the first run are unchanged files.

The two phone failures are sub-pixel: `insights-links` "L1 with the Drawer open on VOICE lands on its station, in view" read the station's `y` as -0.0625 and `voice-stations` "Add your range with the Drawer raised" read -0.09375, against `>= 0`. Run twice more unchanged, the phone project gave 11 passed, then 10 passed and 1 failed (the first test again, -0.06). So they are **intermittent**, and I changed neither. NOT ESTABLISHED: whether they were intermittent before this lane (the pane's sentence for these seeds, three core vowels, is now three lines instead of two on a phone, which moves the page by a line; I did not test the seeds with five core vowels). Lane 66's report has these phone tests passing once.

## 6. Comments corrected, by the lane

Each step's report lists its own. In Step 8: `voice/OutsideNote.svelte` (the style comment for the wrapping actions).

## 7. What I could not establish

- The with-scipy gate 4 count; whether the two phone failures predate this lane.
- Whether an exported file carries vowel values (Step 0).
- Behaviour of stored data with `confidence` unset (Step 5).
