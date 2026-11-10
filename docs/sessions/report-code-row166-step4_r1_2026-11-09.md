# Report: row 166, step 4, gates, Playwright, screenshots (Code, cloud lane, r1, 2026-11-09)

Branch `cloud-lane-39`, merged with `origin/cloud-lane-38` at `534d998` (the lane's steps 11 and 12 reports) before the final run. Brief: `docs/sessions/brief-code-row166-generic-profiles_r2_2026-11-09.md`, step 4.

## The eight gates, against the start

Start: `cloud-lane-38` at `69174bd`, on this branch before any change (step 0 report). End: `cloud-lane-39` after merging `534d998`. Ceilings were not raised.

| Gate | Start | End |
| --- | --- | --- |
| 1 `pnpm test:phonology` | 14 files, 456 tests, pass | 14 files, 456 tests, pass |
| 2 `pnpm test:dictionary` | 4 files, 248 tests, pass | 4 files, 248 tests, pass |
| 3 `pnpm --filter @ilya/web check` | 0 errors, 12 warnings | 0 errors, 12 warnings |
| 4 `pnpm --filter @ilya/web test` | 255 files, 4689 passed, 1 skipped | 257 files, 4733 passed, 1 skipped |
| 5 `pnpm --filter @ilya/score-parser test` | 35 files, 785 passed, 5 skipped | 35 files, 785 passed, 5 skipped |
| 6 `pnpm test:blurb` | 4 files, 168 tests | 4 files, 168 tests |
| 7 `pnpm test:integration` | 7 files, 125 tests | 7 files, 125 tests |
| 8 `pnpm ratchets` | OK, 697 files | OK |

Gate 4's growth is mine plus the lane's own new tests from the merge (`scan-banner.test.ts`, and the step 11 and 12 changes); I did not split the two. My new tests are in `stand-ins-snapshot.test.ts`, `identity.test.ts`, `ratified-lines.test.ts`, `analyze-score-adapter.test.ts`, and `insights/placeholder-profile-pages.test.ts`.

Gate 8 failed once in the middle of the work, on two breaches of mine (INSIGHTS 748 lines over a 744 ceiling; a test in `analysis/` importing `insights/`). Both are fixed (see the step 2 report); no ceiling moved. The "ceilings can be lowered" list is the one the start already printed.

## Playwright, both projects

Final run, on the merged tree: **160 passed, 11 failed, 2 skipped** (40.2 minutes; chromium and phone). The start-of-work run, on a clean worktree of `cloud-lane-38` at `69174bd`, of the nine spec files that held the reds: the **same 11 failed**, with the same error values where I compared them. The full suite was also run once on this branch before the merge: 160 passed, 11 failed, 2 skipped, the same eleven.

| Red test | Red at the start? |
| --- | --- |
| `[chromium] glue-typed-marks.test.ts:29` leaves «я #на» as typed | yes |
| `[chromium] glue-typed-marks.test.ts:39` Control+Z after the blur | yes |
| `[chromium] heic-reader-path.test.ts:111` a HEIC poem with no staves reaches tesseract as a PNG (3.4 min) | yes |
| `[chromium] insights-page.test.ts:95` the page runs the frame, the conclusion, then the moments... (`order` is `[-1,503,886]` at both) | yes |
| `[chromium] loupe-header.test.ts:47` a drag on the desk moves the card (expected -40, received -30 at both) | yes |
| `[chromium] print-pages.test.ts:20` Text, Markup, and Insights each print the pages Ilya numbers (`markup`: expected 2, received 3 at both) | yes |
| `[chromium] singer-paths.test.ts:169` Learn and Guide open and show their first heading | yes |
| `[phone] input-views.test.ts:134` a poem typed into Poem moves no seat of «Within Four Walls» | yes |
| `[phone] phrase-ends.test.ts:26` Tchaikovsky onto an empty song | yes |
| `[phone] relining.test.ts:70` y. a poem pasted into Poem | yes |
| `[phone] relining.test.ts:95` bb. a poem typed key by key | yes |

None is new. Two touch pages this build changes. `insights-page.test.ts` stores a voice with all ten vowels sung, so the new profile never reaches it. `print-pages.test.ts` stores no voice and declares no type, so it is also not an eligible case. Both fail with the same values on the untouched lane. I did not diagnose them.

## Screenshots

`docs/sessions/row166-screens_2026-11-09/`. Song 1 is the tracked engraved fixture `sunless-01-engraved.musicxml` ("Without Sun, no. 1: Within Four Walls"). Each was taken from a **first visit**: a fresh browser context, no stored data, the score dropped in, then Voice, Calibrate, name the voice (the default "Voice 1"), pick the type in "Your voice type", and Back out without sampling. Desk layout, 1440 wide. The dev server was this branch's.

| File | What it shows |
| --- | --- |
| `baritone-insights-en.png`, `soprano-insights-en.png` | INSIGHTS: the identity line "INSIGHTS FOR VOICE 1 · BARITONE · NOT CALIBRATED" (and SOPRANO), the lede, the placeholder line, then the findings as for a measured voice |
| `baritone-melody-en.png`, `soprano-melody-en.png` | MELODY: marks drawn, the hollow heads for placeholder values, the placeholder line naming nine vowels, and the footer broad note without the measured-resonances sentence |
| `*-melody-raw-en.png` | The same before I pressed Escape: the clef chooser ("Voice line as written") is open over the header. It is there for the contralto too, so it is the existing clef chip and not part of this change |
| `baritone-insights-fr.png`, `baritone-melody-fr.png`, `baritone-melody-raw-fr.png` | The French baritone: « APERÇUS POUR VOICE 1 · BARYTON · SANS CALIBRATION » |
| `contralto-insights-en.png` | A declared contralto: the withheld page, unchanged ("Nothing is claimed about your voice", "NOT CALIBRATED") |
| `contralto-melody-en.png` | MELODY for the contralto: the score without marks; the withheld statement stays on the commentary page |

The lede printed on the baritone page, exactly: "These findings use placeholder values for a baritone, not your specific voice. You can offer samples of your own vowels in vocal fry using Calibrate in the Voice section of the Drawer." and on the soprano page "...for a soprano...". The French baritone line is in `baritone-insights-fr.png`.

## What the pages show that the brief did not say

- **The legend still lists a solid head "from your voice".** On a generic MELODY page every head is a placeholder, so the legend's first entry ("the pitch where this vowel turns, from your voice") has no instance on the page. `buildMarkupLegend` is not in this brief's scope; I report it and did not touch it.
- **No note comments at all** for a generic voice with no typed passaggio (step 2, item 5). INSIGHTS' "moments" squircle is empty until the singer types a passaggio. By the code, for every one of the five types.
- **The ratified frame line** (`insights.r2.frame`, "your voice as you calibrate and describe it") still opens every INSIGHTS page. It is ratified general copy and the lede sits directly above it; I did not change it.
- **The key search has no vowel evidence** for a generic voice (`key-suggest.ts:291`), as the step 2 report says.

## What Code could not establish

- **Why the 11 Playwright tests are red.** They are red identically at the start; I did not diagnose them. A different Chromium build from CI's is the obvious suspect and is NOT ESTABLISHED.
- **Rendered look in other widths.** I took the desk layout at 1440 wide only; the phone layout of INSIGHTS with a third header line was not screenshotted (the phone Playwright project runs, but has no test on this page's header).
- **French wording of the three unratified strings** (two method lines, one broad note). Mine, flagged DESK DEFAULT in `i18n.ts`, wanting Dann's eye.
