# Brief for Code, N.199: the readings list on the capture screen, and three chart layout repairs

r3, 2026-11-13, written by the desk (Fable). Fable-reviewed at r2 (`review-fable-brief-n199-readings_r1_2026-11-13.md`: SEND WITH AMENDMENTS, two blockers and eleven amendments, all applied here; section "What the review changed" maps them). Branch: `cloud-lane-53`, cut from `Shane` at or after `d32429c1`. Everything here sits behind `?calibrate=new` (`CalibrationWizard.svelte:1380`, `chart/SummarySheet.svelte:13-16`; the reviewer found no other importer): no live string and no live screen changes.

## What the singer needs

A singer on the new capture screen sees one vowel's two numbers at a time. Dann, 2026-11-13 17:34 (as written): *"One element I miss from the old design is a report of the fr1 and fr2 valuyes for each vowel in Herz. Is there a way to offer that meaningfully but not challenging the feaute of this GUI which is the vowel space?"* Ruled 17:36: a folded list, closed by default (`docs/memory/OPEN.md`, N.199, THE READINGS LIST ON THE CAPTURE SCREEN). Dann 17:37: a value is never shown without its resonance; the column headers carry fR1 and fR2, as on the sheet. The singer also needs to read the chart's numbers at every width.

## Read first, in full

`apps/web/src/lib/voice/VowelCapture.svelte`; `voice/chart/readings.ts`; `voice/chart/geometry.ts`; `voice/chart/ChartLayers.svelte`; `voice/chart/VowelChart.svelte`; `voice/chart/VowelSpaceSheet.svelte`; `voice/chart/print-sheet.ts`; `voice/chart/zones.ts`; `voice/engine/resolve-values.ts`.

## Step 1. The readings list

1. Under the hint and the explain line of the capture screen (`VowelCapture.svelte`, after `<p class="explain">`, before the hide toggle), one disclosure, closed by default: a `<details>` whose `<summary>` is `sheet.readings` ("Your readings" « Vos lectures », `i18n.ts:2540`, ratified 2026-11-13 10:48). No new string. If any new word proves necessary, stop and report it; do not write it.
2. The summary has `min-height: 44px`, as `.hide-toggle` has (`VowelCapture.svelte:640`), and its marker is drawn in CSS. The only other `<details>` in the app sets no height (`CalibrationWizard.svelte:1725-1729`).
3. Open, it lists all ten vowels in the order of the ten buttons, as a table named by the summary, with no caption. Columns as the sheet's table (`VowelSpaceSheet.svelte:112-118`): the vowel, fR1, fR2. Headers use `FrSym` and the ratified `sheet.col.vowel`, `sheet.col.fr1`, `sheet.col.fr2` (`i18n.ts:2541-2543`). Each value is Hz with the nearest note and signed cents, through `noteReading` (`readings.ts:41`), as the sheet prints them.
4. The vowel cell shows the symbol, with the vowel's spoken name visually hidden as the buttons give it (`VowelCapture.svelte:265`, `:370`). A symbol-only cell keeps a row on one line at 322 px.
5. The rows are built by a pure function in `readings.ts`, fed the model's placeholders (`VowelCapture.svelte:86`, `model.placeholders`). `readingRows` returns sung vowels only (`readings.ts:53-64`); do not change what the sheet's table receives.
   - A sung vowel ("sung" is the chart's own test, `zones.ts:82`) takes the stored reading's values, as the readout takes them (`VowelCapture.svelte:208`). It is in the ink colour, carries a small filled dot as the sheet's legend draws it (`VowelSpaceSheet.svelte:90`), and carries `capture.button.sung` (`i18n.ts:2575`) for assistive technology.
   - A vowel not yet sung takes its values from the same `ZoneSet.placeholders` the chart draws its hollow dots from (`computeZones`, `zones.ts:88-129`, which calls `resolveVowelValues(profile, voiceType, { placeholders: 'always' })` at `:93`), so a dot and its row are one number. Do not call `resolveVowelValues` a second time. It is in the tertiary grey, carries the legend's hollow dot (`VowelSpaceSheet.svelte:94`), and carries `capture.button.placed` (`i18n.ts:2576`).
   - A sung reading with no usable fR2 shows `calib.roster.tryAgain` (`i18n.ts:1360`) in the fR2 cell. "No usable fR2" is the chart's test, `f2 > 0` (`readings.ts:61`, `zones.ts:137`), not the readout's `typeof` test (`VowelCapture.svelte:312`): a stored f2 of 0 never prints "0 Hz".
6. The list never opens by itself. It follows `hiding` (`VowelCapture.svelte:197`, `:200`): with "Hide the chart and the readout while I sing" on, `startTake` (`:218`) closes it, and while `hiding` its closed line stays in place, invisible and inert, so the toggle below it does not move. It returns with the readout at the landing, as `capture.hidden` says (`i18n.ts:2565`). Whether it is open is not stored.
7. Closed, it adds one line of height and nothing else moves. On a phone at rest the list is below the fold and scrolls under the sticky stage (`VowelCapture.svelte:457-458`); that is accepted by the ruling ("under the hint text").
8. Tests, without a mount: the rows for a profile with sung, placed, implausible-but-sung, and no-fR2 vowels, for a declared type and for no type; and in the component, closed by default, and closed and inert while `hiding`.

## Step 2. The chart's numbers never run together, in every frame

Found in `docs/sessions/report-code-n199-amendment-pictures/phone-fr-pause.png`: "190018001700". Cause, confirmed by the reviewer: `geometry.ts:168` chooses the step from the spacing at the middle of a logarithmic span against `minPx = 38` chart units (`:178`), and `VowelChart.svelte:34` enlarges `labelSize` as the chart narrows. The reviewer's measure (a `tsx` script on the tree's own `buildChartModel`, `zoomTarget`, `mixView`, `gridTicks`, `project`; number width estimated at 0.5 em a digit plus the 3-unit halo, `ChartLayers.svelte:214`; no browser ran): of 110 views at rest, column numbers overlap in 24 at 320 px and in none at 484 or 700 px; the lowest row number meets the axis word in 61, 49, and 27; a row number meets a column number in 46, 24, and 20.

1. `gridTicks` receives `labelSize`; `ChartLayers.svelte:64` passes none today. The lines may stay as dense as they are.
2. The rule covers every number box: a number whose box would meet another number's box, an axis word (`ChartLayers.svelte:145`, `:150`, `:153`), or the frame's edge is not drawn; its line stays. This settles the lowest fR1 number against "tongue forward", the upper corner where a row number meets a column number, and "900" against the turned axis word.
3. It holds in both frames: the capture chart (484 by 280, `model.ts:12-13`) and the sheet (720 by 420 on screen, 360 in print, `VowelSpaceSheet.svelte:44`, `:46`).
4. **Every site that computes this number:** `gridTicks` is called at `ChartLayers.svelte:64` only (desk grep, confirmed by the reviewer); the capture chart and the sheet both draw through `ChartLayers`. `geometry.test.ts:170-177` pins the 38 px rule and the four-argument call and moves with this step; say in the report what else depended on the old spacing.
5. Tests, no browser, number width estimated as above: for every value of `TIER1` plus no type (`voiceTypes.ts:18-28`), an empty and a part-sung profile, the full view, the zoomed view of each of the ten vowels, and samples of `mixView` between them (`geometry.ts:130`), at rendered widths 320, 484, and 700 px for the capture chart and 300, 430, and 720 px for the sheet: no number box meets another box, an axis word, or the frame. Then look at it in a browser; the estimate is not the served face.

## Step 3. The capture screen has a largest width

Found by the desk in Dann's Chrome at a window 1244 CSS px wide (the Drawer as a sheet, `Drawer.svelte:1866`, `max-width: 1399px`): the chart fills the sheet and the vowel buttons fall below the fold.

1. `.capture` (`VowelCapture.svelte:360-369`) takes a largest width of 484 px (`model.ts:12`); its parent centres it (`CalibrationWizard.svelte:1638-1643`). 484 and not 520: the desk Drawer's content is 520 less 32 less 36 (`layout.ts:41`, `Drawer.svelte:1369`, `:1467`), so the phone and the 1400 px desk Drawer are unchanged. The summary's sheet takes a largest width of 720 px (`VowelSpaceSheet.svelte:150-154`).
2. Done when, at 768, 1024, and 1244 CSS px wide and 800 px high: scrolled until the stage sticks (`VowelCapture.svelte:457-458`), the chart, the ten buttons, and both action buttons are in view. A width cap alone does not bring them into view at rest: below the chart the stage needs about 265 px and the sheet's window ends at 756 px (`Drawer.svelte:1876`). Pictures at the three widths, at rest and scrolled.

## Step 4. The sheet's numbers hold a readable size on screen

`VowelSpaceSheet.svelte:82` passes `labelSize={12}` in chart units, so in the Drawer the grid numbers shrink with the chart. On screen, size them to 11 CSS px at any width, as `VowelChart.svelte:34` does. Choose the size by `forPrint`, not by a measured width: print is a second instance (`print-sheet.ts:28`) in a root that is `display: none` on screen (`VowelSpaceSheet.svelte:385-388`). Print keeps its size of today; Step 2's rule applies to it too. This step depends on Step 2: at 11 CSS px with today's spacing the reviewer counted overlaps for 10 of 10 voices at 430 and 300 px. The printed sheet still fits one letter page in both languages (`pdfinfo` Pages 1).

## Done when

- All eight gates pass on the tip (the eight `gate` lines of `~/Downloads/ilya-ship.sh`: `test:phonology`, `test:dictionary`, `--filter @ilya/web check`, `--filter @ilya/web test`, `--filter @ilya/score-parser test`, `test:blurb`, `test:integration`, `ratchets`), with gate 4's count before and after. Baseline at `d32429c1`: "5632 passed | 1 skipped (5633)".
- The summary line's rendered height, measured, is at least 44 px.
- Pictures in `docs/sessions/report-code-n199-readings-pictures/`, English and French: phone 390 by 844 with the list closed, and open and scrolled; desktop Drawer with the list open; the zoomed chart mid-take on the phone; Step 3's six; the summary's sheet in the Drawer. Look at every picture yourself before you report it.
- One report, `docs/sessions/report-code-n199-readings-list-and-chart-layout_r1_2026-11-13.md`; the branch pushed.

## Constraints

- The standing rules of `docs/memory/CONTRACT.md` are untouched by this work.
- No new English or French. The resonance symbol follows Titze et al. (2015), Table I, through `FrSym` only. The `sheet.` gloss at `i18n.ts:69` gains a consumer; update the gloss, not a string.
- Do not touch the extractor, the status of a reading, or `engine/plausibility.ts`: that is N.200.
- Do not touch the wheel (`pacifier/`); it is deleted last, after Dann's walk.
- `lib/voice` may not import `lib/insights` (`scripts/ratchets.mjs`).

## What the review changed

Blocker 1: Step 3.2's acceptance restated. Blocker 2: Step 2.3 and 2.5 cover the sheet's frames, and Step 4 names its dependence on Step 2. A1 and A2: Step 1.6. A3: Step 1.5, third point. A4: Step 1.5. A5: Step 1.3 to 1.5. A6: Step 1.2 and "Done when". A7: Step 1.7 and the pictures. A8: Step 2.1 and 2.5. A9: Step 2.2. A10: Step 3.1. A11: Step 4. The reviewer's four questions for Dann were decided by the desk as DESK DEFAULTS and told to him: the headers carry the resonance; the signed cents stay, as on the sheet; the filled and hollow dots mark the two kinds of row; the list sits below the fold on a phone at rest.

## What you could not establish

End the report with a section of this name. NOT ESTABLISHED beats a complete invented answer.

Handed to you as not established by the desk or the reviewer: any rendered behaviour of this work (nothing ran in a browser); whether a stored reading can hold an f2 of 0; whether `bind:clientWidth` on an `<svg>` reports a width in every browser Ilya supports; what a screen reader says for a note name in the list (`spokenPitchLabel`, `note-picker.ts:158`, not traced).
