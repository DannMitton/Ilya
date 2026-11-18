# Report: lane 66, Step 6 (a recorder build for this lane) and the lane's final gates

2026-11-18, Code (cloud session). Branch `cloud-lane-66`, cut from `Shane` at `ab67b836`. No pull request; nothing pushed to `Shane` or `main`; nothing under `docs/memory/` changed; no brief edited. Pushed with this report, so the lane makes one build.

## Step 6: `vercel.json`

`:3` and `:47-49` named `cloud-lane-52`, `cloud-lane-62`, and `cloud-lane-64`. Both places now name `cloud-lane-66` alone:

- `buildCommand`: `if [ "$VERCEL_GIT_COMMIT_REF" = "cloud-lane-66" ]; then export PUBLIC_RECORDER=1; fi; pnpm --filter @ilya/web build`.
- `git.deploymentEnabled`: `"cloud-lane-66": true` beside `Shane` and `main`.

The file still parses as JSON. The pin at `voice/engine/capture-file.test.ts:135-139` is confirmed as the brief's reviewer read it, with one correction to the reading: its pattern (`^if [ "$VERCEL_GIT_COMMIT_REF" = "cloud-lane-\d+" ]( || [ ... ])*; then export PUBLIC_RECORDER=1; fi; ...`) accepts one branch or several, so it passes for one. `capture-file.test.ts`: 20 passed.

## The eight gates, on the lane's final tree

| Gate | Baseline (Step 0) | Result |
|---|---|---|
| 1 phonology | 462 passed (462) | 462 passed (462) |
| 2 dictionary | 248 passed (248) | 248 passed (248) |
| 3 web-check | found 0 errors and 12 warnings in 5 files | found 0 errors and 12 warnings in 5 files |
| 4 web-test | 6589 passed, 1 skipped (6590), with Python, numpy, scipy | **6613 passed, 1 skipped (6614)**, 358 files |
| 5 score-parser | 904 passed, 5 skipped (909) | 904 passed, 5 skipped (909) |
| 6 blurb | 178 passed (178) | 178 passed (178) |
| 7 integration | 159 passed (159) | 159 passed (159) |
| 8 ratchets | OK | ratchets: OK (no ceiling raised; the run lists the ceilings that could be lowered: `CalibrationWizard.svelte` 1126 to 1122, `InsightsPane.svelte` 744 to 742, `+page.svelte` 5534 to 5531, and others the lane did not touch) |

Gate 4 moved by 24 tests: Step 2 +5 (`capture-file.test.ts`), Step 3 +4 (`sections.test.ts`), Step 5 +15 (`every-sung-reading-counts.test.ts` 11; one each in `plausibility.test.ts`, `voice-pane.test.ts`, `voice-pane-usable.test.ts`, and `profileStore.test.ts`). The tool's tests (`tools/n200-score`, 47 tests, 3 files) are in no gate.

## Playwright, `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`, `--trace off`, against the development server

- Desktop (`--project=chromium`): `voice-pane` 24, `voice-stations` 8, `voice-links` 6, `insights-links` 13, `calibrate-new` 37: **88 passed**, 0 failed, 0 flaky (16.6 minutes).
- Phone (`--project=phone`): `voice-stations` 6 (the two new tests among them) and `insights-links` 5: **11 passed**.

The brief's open question, whether any seeded e2e store gains a summary note once the note reads the judged copy: none of the 99 tests failed, so none of these suites' seeded stores gained a note that a test asserts against. NOT ESTABLISHED for suites outside the named list.

## What the lane did, in one list

1. Step 0: the eight gates at baseline, the census, the golden's contents.
2. Step 1: sixteen comments that stated a ruled-out rule, rewritten.
3. Step 2: the recorder panel follows the session; the card names the picker in use, the last take's stamp, and what the address gave; the default is `path`.
4. Step 3: the voice type row is a station of the tier; on a phone the VOICE pane's three rows open one at a time. Pictures in `report-code-lane66-pictures/`, four, English and French.
5. Step 4: the runner (golden and folder) and the measure, `n200-lane66-step4-measure_2026-11-17.md`.
6. Step 5: every sung reading counts. One predicate. The golden moved in exactly the 12 entries expected.
7. Step 6: the recorder build, this report.

## For the desk

- **Read the Step 4 numbers before merging Step 5** (`docs/memory/PRODUCT.md:1273`). The two to look at first: for a bass with [i] at 1063 Hz, counting the reading moves every other vowel's fR1 by 21 st with one vowel sung and 10.9 st with two, away from the truth; from three, only the derived [ɨ] still follows it (1451 Hz). And for the cross-type cases (59 of 60 are higher voices judged as a bass), counting moves the others toward the truth on average.
- **The folder run** has not been run on real takes: `N200_LANE66_DIR=<folder> N200_LANE66_TYPE=<declared type>`, header of `tools/n200-score/lane66-measure.run.ts`.
- **Step 5 is one commit** (`7af295c`), so a revert removes the whole of it.
- **Not built, as the brief says:** the far-off [ɨ] choice (`calib.summary.outsideIgh` still has no reader), stored statuses, lane 63's second fix.
- DESK DEFAULT, mine: the new phone test allows one pixel of slack on the Range pickers' top, which the reveal aligns to the window's top within a fraction of a pixel (-0.09 px measured).
