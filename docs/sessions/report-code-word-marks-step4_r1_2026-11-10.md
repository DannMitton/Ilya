# Report: word marks saved, step 4, gates and the Playwright test (Code, cloud-lane-42, r1, 2026-11-10)

Branch `cloud-lane-42`. One file added: `apps/web/e2e/word-marks-saved.test.ts`. `origin/cloud-lane-38` was still at `534d9981` at the final merge, so the merge was a no-op and the gates below are the final ones.

## The Playwright test

On song 1 (a fresh browser), type «замок молоко», set the other stress on «замок» in the Inspector's dictionary panel, tick the spot box on «молоко», wait out the save, reload, and check that the word's IPA row still shows the chosen stress, the `R` sigla is on «молоко», and its Inspector box is ticked. It runs twice, once on Lyrics and once on Poem. Both pass. To check it can fail, I disabled the load line in `#apply` once: the Lyrics run then failed with the unmarked reading (`ˈzɑ mʌk`), and I restored the line.

## Gates (final, after the merge)

| # | gate | result |
|---|---|---|
| 1 | phonology | 456 passed |
| 2 | dictionary | 248 passed |
| 3 | web check | 0 errors, 12 warnings |
| 4 | web tests | 4738 passed, 1 skipped (baseline 4707, plus 31 new across steps 1 to 3) |
| 5 | score-parser | 785 passed, 5 skipped |
| 6 | blurb | 168 passed |
| 7 | integration | 125 passed |
| 8 | ratchets | OK; `+page.svelte` 5523 of 5534; no ceiling touched |

## Playwright, both projects

`chromium`: 138 passed, 7 failed. `phone`: 24 passed, 4 failed. I then checked out the untouched base (`origin/cloud-lane-38`, `534d9981`) and ran the same files: the same 7 and the same 4 fail there. They are not caused by this build, and I did not investigate why they fail in this sandbox.

- chromium: `glue-typed-marks` (2), `heic-reader-path` (HEIC poem to tesseract), `insights-page` (page order), `loupe-header` (drag), `print-pages`, `singer-paths` (Learn and Guide headings).
- phone: `input-views` (poem typed into Poem), `phrase-ends`, `relining` (y and bb).

## Finding for the desk: a saved stress on a homograph shows the first entry's gloss after a reload

After a reload, «замок» with the saved stress `замо́к` prints the IPA `zɑ ˈmok` but the gloss "castle" (the first entry's), not "lock". Typing in the field again fixes it. Cause, read from the code and confirmed by a probe: the loader installs the homograph entries lazily after the app is interactive (`loader.ts`, `scheduleHomographTier`), and nothing re-transcribes when they land, so the first transcription cannot match the gloss to the singer's stress (`pipeline.ts:399-432`). It is the loader's ordering, not this feature, but persistence makes it visible. I did not fix it: the fix is a re-run when the tier installs, in `loader.ts` and the page, and lane 41 may touch `loader.ts`. Desk decision.

## What I could not establish

- That a load does not bump `updatedAt` in a running app (see the step 2 report); the Playwright test reads the marks back but does not read the stored timestamp.
- Why the 11 baseline Playwright tests fail here (environment or old regressions).
- The flow of a binder import and the poem-offer undo in a browser, as in the earlier reports.
