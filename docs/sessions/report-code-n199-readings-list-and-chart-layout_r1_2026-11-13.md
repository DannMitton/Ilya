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
