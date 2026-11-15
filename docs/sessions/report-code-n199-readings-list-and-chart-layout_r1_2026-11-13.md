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
