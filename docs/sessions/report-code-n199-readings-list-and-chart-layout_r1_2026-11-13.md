# Report: N.199 readings list and chart layout (brief r3), lane 53

Branch `cloud-lane-53`, cut from `Shane` at d85a54c (the tip the brief names; the clone's local `Shane` was at 649fe49 and was fetched first). Working tree clean at the cut. Gates are the eight of the brief, run from a fresh `pnpm install --frozen-lockfile` in a Linux sandbox. The order of work is Step 2, Step 4, Step 3, Step 1.

## Baseline: the eight gates on the untouched tip (d85a54c)

| Gate | Result |
|---|---|
| 1 `test:phonology` | 462 passed |
| 2 `test:dictionary` | 248 passed |
| 3 `@ilya/web check` | 0 errors, 12 warnings |
| 4 `@ilya/web test` | **5632 passed, 1 skipped (5633)**, 310 files; the brief's baseline is the same |
| 5 `@ilya/score-parser test` | 785 passed, 5 skipped |
| 6 `test:blurb` | 178 passed |
| 7 `test:integration` | 155 passed |
| 8 `ratchets` | OK |

The brief gives a baseline for gate 4 only; the other counts are as run here.

## Step 2: the chart's numbers never run together

**Built.**
- `geometry.ts`: `gridTicks(view, w, h, labelSize, words = [], minPx = 38)` now also returns `f2Numbers` and `f1Numbers`, the lines whose numbers are drawn. The lines are as dense as before (the 38 unit rule is unchanged, so the lines stay). A number is not drawn when its box, halo included, would meet another number's box, an axis word's box, or the frame's edge (1 unit inset). Where two meet, the rounder number is kept (1000 before 500 before 100 before 50), a column before a row, then the lower in Hz. JUDGEMENT: the order of preference, the clearance of 0.4 of the number's size, the 1 unit inset.
- `axisWordBoxes` gives the capture chart's four axis words as boxes (`ChartLayers.svelte` `axisWords`); letter width estimated at 0.55 em, the symbol `fR2` at 1.2 em.
- The number placement constants (`NUMBER_ROW_X`, `NUMBER_ROW_LIFT`, `numberColBaseline`) are shared by the drawing and the rule, so the two cannot disagree.
- `labelSizeFor(frameW, renderedW, cssPx = 11)` replaces the inline sum in `VowelChart.svelte`; Step 4 reuses it.
- `ChartLayers.svelte` passes its `labelSize` and the axis word boxes to `gridTicks` and draws numbers only for `f2Numbers` and `f1Numbers`.

**Every site that computes this number.** `gridTicks` is called at `ChartLayers.svelte` only (grep over `apps`, `packages`, `scripts`, read this session); the capture chart and the sheet both draw through it. The only other file that named it is `geometry.test.ts`. What depended on the old spacing: `geometry.test.ts` (the two grid tests; moved to the new signature, assertions unchanged) and nothing else. `VowelChart.test.ts` and `VowelSpaceSheet.test.ts` render the numbers and pass unchanged.

**Tests** (`grid-numbers.test.ts`, 8 new; gate 4 went from 5632 to 5640). No browser. Boxes are computed in the test from the drawing's own placement, not read from `geometry.ts`. For all nine `TIER1` values and no type, an empty and a part-sung profile (one reading outside its zone, one with no fR2), the full view, the zoom to each of the ten vowels, and mixes at 0.25, 0.5, 0.75 between them: 410 views a width. Capture chart at 320, 484, 700 px, in English and French; sheet on screen at 300, 430, 720 px; sheet in print at 12 units. No number box meets another, an axis word, or the frame. Positive control: with a number on every line, as before, the same instrument finds column numbers running together at 320 px, so it can fail.

**Picture** (looked at): `report-code-n199-readings-pictures/step2-phone-fr-pause.png` and `step2-phone-en-pause.png`, phone 390 by 844 at 3x, mid-take on [i] in the dev server on the stub. French: the columns read 2200, 2000, 1800, 1600, 1400 with clear space between them (the earlier picture read "190018001700"); the rows read 250, 300, 350, 400; the 450 row's number is not drawn and its line is, so it no longer meets "langue avancée"; the turned axis word at the right is clear of the numbers. The page was scrolled with the sticky stage up, as in the earlier picture.

**Not looked at.** The estimate's widths against the served face (Source Sans 3) on every one of the 410 views; I looked at one view in two languages. The sheet's numbers are pictured under Step 4.

Gates after Step 2: 1 462, 2 248, 3 0 errors and 12 warnings, **4 5640 passed, 1 skipped (5641)**, 5 785 and 5 skipped, 6 178, 7 155, 8 OK. All eight pass. Gate 4: 5632 before, 5640 after.

## Step 4: the sheet's numbers hold a readable size on screen

**Built** (`VowelSpaceSheet.svelte`). The grid numbers' size is `forPrint ? 12 : labelSizeFor(720, chartWidth)`. On screen `chartWidth` is `bind:clientWidth` on the sheet's `<svg>`, so the numbers hold 11 CSS px at any width, as `VowelChart.svelte` does; before the first measure it is the frame's own width (11 units). The choice is by `forPrint`, not by a measured width: print is a second instance in a root that is `display: none` on screen (`print-sheet.ts:28`, `VowelSpaceSheet.svelte` print root), where a measured width would be 0. Print keeps 12 units as today, and Step 2's rule applies to both (`grid-numbers.test.ts` covers the sheet at 300, 430, and 720 px on screen and at 720 by 360 in print). The `sheet.` gloss at `i18n.ts:69` gains a consumer only in Step 1, so it is updated there.

**Test** (`VowelSpaceSheet.test.ts`, 1 new): on the server the numbers group is `font-size="11"` on screen and `12` for print. Gate 4: 5641 after this step (5640 before).

**Printed sheet** (`pdfinfo`, from the dev server, `window.print` stubbed, the print root mounted, `page.pdf` at Letter, `emulateMedia` print): **Pages: 1** in English and in French (`step4-print-en.pdf`, `step4-print-fr.pdf`). This is Chromium's headless PDF of the page with the print root, not the browser's print dialogue.

**Pictures** (looked at, all six), `report-code-n199-readings-pictures/`:
- `step4-sheet-desk-en.png`, `step4-sheet-desk-fr.png`: the Drawer on a 1440 by 900 window at 2x, ten vowels sung. The numbers are small and legible; "1300 1200 1100" is the tightest run, with a gap of a few pixels, not touching.
- `step4-sheet-phone-en.png`, `step4-sheet-phone-fr.png`: 390 by 844 at 3x. Columns read 1900 1700 1500, 1200, 1000 900 800 700; rows 300 to 800. No number meets another or an axis word.
- `step4-sheet-mid-en.png`, `step4-sheet-mid-fr.png`: 430 by 900 at 2x, four vowels sung, the other six placeholders. Clear.

**Not established for Step 4.** That 11 CSS px is the size on the user's own screen: the pictures are in headless Chromium at the scale named. Whether `bind:clientWidth` on an `<svg>` reports a width in every browser Ilya supports (the brief's list); it did in this Chromium, and in Safari and Firefox I did not look.

Gates after Step 4: all eight pass; gate 4 **5641 passed, 1 skipped (5642)**.

## Step 3: the capture screen has a largest width

**Built.** `VowelCapture.svelte` `.capture`: `max-width: 484px; margin-inline: auto` (the chart's own frame, `model.ts` `CHART_W`). Its parent already centres it (`CalibrationWizard.svelte` `.wizard-phase`, `align-items: center`); the auto margins are a second guarantee. The desk Drawer's content is 484 px already (520 less 32 less 36), so the phone and the 1400 px desk are unchanged. `VowelSpaceSheet.svelte`: `.vowel-sheet:not(.for-print) { max-width: 720px; margin-inline: auto }`; print is not capped.

**Measured** (dev server, Chromium, 800 px high, non-touch, getBoundingClientRect; the Drawer is `top 0` to `bottom 756`; the takeover scrolls to its end, 374 px of scroll, and the stage sticks at 60). At 768, 1024, and 1244 px, in English and French, all six the same figures:

| | at rest | scrolled until the stage sticks |
|---|---|---|
| `.capture` | 484 px wide, centred (left 142, 270, 380) | same |
| chart | 345 to 625 | 66 to 346 |
| ten buttons | 799 to 895 (below the Drawer's end, 756) | 519 to 615 |
| both actions | 904 to 948 | 624 to 668 |

So the chart, the ten buttons, and both action buttons are in view, scrolled, at all three widths, as the brief's acceptance (review blocker 1) states. At rest the buttons are below the fold at all three widths: a width cap alone does not bring them in, as the brief said. Without the cap the screen is 1176 px wide at 1244 (the same test, run with the CSS reverted, failed on that).

**Test** (e2e, `calibrate-new.test.ts`, 3 new, one a width; run here with `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`: 3 passed). Asserts 484 px, centred, and the chart, buttons, and both actions inside the Drawer after the scroll. The file's `open` now presses the Drawer's pull below 1400 px. The rest of the e2e file was not run in this step.

**Pictures** (all thirteen looked at; the chart, buttons, and both actions sit as measured, centred, and the numbers are clear of each other and of the axis words at every width):
`report-code-n199-readings-pictures/step3-capture-{768,1024,1244}-{en,fr}-{rest,scrolled}.png` (the six the brief asks for, in two languages) and `step3-sheet-1244-en.png` (the summary's sheet at 720 px, centred, in the Drawer at 1244).

Gates after Step 3: all eight pass; gate 4 **5641 passed, 1 skipped (5642)**.

## Step 1: the readings list

**Built.**
- `readings.ts`: `readingListRows(profile, placeholders, language)`, a pure function. It returns the ten rows in the buttons' order. A sung vowel (the same test as `zones.ts` `isSung`) takes its stored values, with an fR2 only when `f2 > 0`. A vowel not yet sung takes the placeholder it is handed, which the component takes from `model.placeholders` (`buildChartModel`, the very `ZoneSet.placeholders` the chart's hollow dots are drawn from, so a dot and its row are one number); `resolveVowelValues` is not called a second time. A vowel with neither has no row. `readingRows` and the sheet's table are untouched.
- `VowelCapture.svelte`: after `<p class="explain">` and before the hide toggle, one `<details class="readings">` with `<summary>` `sheet.readings` ("Your readings", « Vos lectures »). Closed by default; `listOpen` is state and is not stored. The table is named by the summary (`aria-labelledby`), with no caption; the headers are `sheet.col.vowel` and `FrSym` with `sheet.col.fr1` and `sheet.col.fr2`; each value is Hz with the note and signed cents through `noteReading`. The vowel cell shows the symbol, with `buttonLabel(...)` ("cardinal-i, sung", "smallcaps-i, placeholder") visually hidden. A sung row is in the ink colour with the legend's filled dot; a placeholder row is in the tertiary grey with the legend's hollow dot. A sung reading with no usable fR2 says `calib.roster.tryAgain`; a placeholder row never does.
- It follows `hiding`: `startTake` closes it when the toggle is on, and while `hiding` it keeps its closed line, `visibility: hidden` and `inert`, so the toggle below does not move. At the landing it is visible again, still closed.
- The summary is `min-height: 44px` with its marker drawn in CSS (a chevron that turns). The `sheet.` gloss at `i18n.ts:69` now names `VowelCapture.svelte` as a second consumer; the count (16) is unchanged. **No new English or French was written.**

**Tests.** `readings.test.ts` (15 new: one for each of the ten voice settings, and five more): rows for the nine `TIER1` values and no type, with sung, placed, sung-but-implausible ([ɑ] 1100/2900), no-fR2 ([e]), a stored f2 of 0 ([u]), and an estimate; each placeholder row equals `computeZones(...).placeholders` value for value; an empty profile gives ten positive placeholders; the sheet's rows are unchanged; no row is invented. `VowelCapture.test.ts` (6 new, server render): one `<details>`, closed, below the explanation and above the toggle; ten rows in order; table named by the summary, no caption, headed by `f R 1` and `f R 2`; marks and spoken labels; Hz, note and cents; "Try again" for no fR2 and for f2 0, never for a placeholder; no type, and French. e2e (`calibrate-new.test.ts`, 2 new, passed): closed by default, summary at least 44 px (measured 44), ten rows when open, still closed after a take; with the toggle on, the take closes it, it is `visibility: hidden` and `inert`, its closed line has the same height and the same gap to the toggle as at rest, and at the landing it is visible, not inert, and closed.

**Measured** (390 by 844 phone, scale 3, dev server): `.capture` 322 px wide; the summary 44 px tall; all ten rows 32 px, so one line each, with no horizontal overflow; also 32 px a row and no overflow at a 320 px window (content 252 px), in both languages.

**Pictures** (all ten looked at), `report-code-n199-readings-pictures/step1-*`:
- `phone-{en,fr}-closed.png`: the phone at rest, list closed. It is below the fold, as the ruling accepts (A7).
- `phone-{en,fr}-closed-scrolled.png`: scrolled to the end, the closed line "Your readings" / « Vos lectures » with its chevron above the toggle.
- `phone-{en,fr}-open-scrolled.png`: open and scrolled to the end; the stage covers the upper rows (see the finding below), the last three rows show.
- `desk-{en,fr}-open.png`: the desk Drawer at 1440 by 900, four vowels sung, six placeholders, the list open and scrolled: the sung rows in black with the filled dot, the placeholders in grey with the hollow dot.
- `phone-{en,fr}-midtake.png`: the zoomed chart mid-take, with the pause line, the numbers clear and the list's closed line beneath.

**A finding that changes what was accepted (A7 and the ruling's "under the hint text"): on a phone shorter than the brief's 844 px, the sticky stage can cover the list's summary at the end of the scroll.** Measured (the same dev server, Chromium, touch, English and French, scrolled to the end; stage bottom against the summary's top and bottom):

| window | stage bottom | summary top to bottom | clear of the stage |
|---|---|---|---|
| 390 by 844 | 601 (en), 623 (fr) | 674 to 718 | yes |
| 360 by 740 | 583 (en), 605 (fr) | 570 to 614 | **no** (13 to 35 px covered) |
| 375 by 667 | 592, 595 | 497 to 541 | **no** (all covered) |
| 320 by 700 | 578, 628 | 529 to 573 | **no** |
| 320 by 568 | 496 | 397 to 441 | **no** |

At 375 by 667 the hide toggle (top about 551, bottom 595) is also under the stage (bottom 592) with the list in place. I did not measure the unchanged tip at these windows, so whether the toggle was covered before this work is NOT ESTABLISHED; the stage's rules (`VowelCapture.svelte` `.stage`) are as they were. Open, the visible band below the stage is about 187 px at 844 and less on a shorter phone, so about five of the ten rows at a time, reached by scrolling; the desk Drawer at 900 high shows about four. I did not change the stage: it is a layout decision (the stage's stickiness, or the list's place) that is Dann's. My proposals, offered and not built: let the stage stop sticking while the list is open; or place the list above the chart on a short phone; or build neither.

## Gates after Step 1 and the whole lane

All eight pass at the tip of this branch: 1 462 passed; 2 248 passed; 3 0 errors and 12 warnings (the same 12 as the baseline); **4 5662 passed, 1 skipped (5663)**; 5 785 passed, 5 skipped; 6 178 passed; 7 155 passed; 8 ratchets OK. Gate 4: **5632 before, 5662 after** (+30): +8 in `grid-numbers.test.ts` (Step 2, 5640), +1 in `VowelSpaceSheet.test.ts` (Step 4, 5641), none in Step 3 (its tests are e2e, 5641), then +15 in `readings.test.ts` and +6 in `VowelCapture.test.ts` (Step 1, 5662). Counted from the runner's totals after each step.

## What you could not establish

- **Any behaviour in Safari or Firefox.** Every picture and measure is headless Chromium from the dev server; the Playwright suite ran only the `chromium` project, and only `calibrate-new.test.ts` (see the last line of this section for what it did).
- **Whether `bind:clientWidth` on an `<svg>` reports a width in every browser Ilya supports.** It did in Chromium (the sheet's numbers sized to 11 CSS px at 300 to 720 px). Before the first measure, and in a browser where it stays 0, the sheet's numbers are 11 units and the capture chart's too (`labelSizeFor`'s fallback to the frame's own width), and the thinning rule still holds at that size.
- **Whether a stored reading can hold an f2 of 0.** I did not trace the extractor or the store. The list treats it as "no usable fR2", as the chart does, and a test pins it, so "0 Hz" never prints.
- **What a screen reader says for a note name in the list.** `spokenPitchLabel` (`note-picker.ts:158`) was not traced, and I ran no screen reader. The list prints the note as text ("D4 +14") the way the sheet does; the vowel cell's spoken label is the buttons' ("cardinal-i, sung"); how the values are spoken is NOT ESTABLISHED.
- **The grid numbers' widths against the served face.** The test estimates them (half an em a digit plus the halo, as the reviewer did); the 410 views a width are checked by that estimate, and I looked at the pictures, not at every view. Source Sans 3's figures are narrower than half an em, so the estimate drops numbers rather than letting them meet.
- **The printed sheet from the browser's own print dialogue.** The PDFs are `page.pdf` of the page with the print root mounted and `window.print` stubbed (Pages: 1, letter, both languages). The dialogue's own output was not produced.
- **A listing of the other eight gates' counts in the brief.** The brief gives gate 4's baseline only; the other counts here are as run.
- **The two e2e files other than `calibrate-new.test.ts`.** Not run. The whole `calibrate-new.test.ts` run is in the line below.
- **The `calibrate-new.test.ts` run:** the whole file, 14 tests (the nine that were there, the three width tests, the two list tests), **14 passed** in 6.0 minutes on the dev server, chromium project, with `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`. The rest of the chromium project and the phone project were not run.

## Files changed

`geometry.ts`, `ChartLayers.svelte`, `VowelChart.svelte`, `VowelSpaceSheet.svelte`, `VowelCapture.svelte`, `readings.ts`, `i18n.ts` (the gloss at line 69 only); tests `grid-numbers.test.ts` (new), `geometry.test.ts`, `readings.test.ts`, `VowelSpaceSheet.test.ts`, `VowelCapture.test.ts`, `e2e/calibrate-new.test.ts`. Not touched: the extractor, `engine/plausibility.ts`, `pacifier/`, `lib/insights`. Commits on `cloud-lane-53` only; no pull request.
