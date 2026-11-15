# Brief for Code, N.199: the readings list on the capture screen, and three chart layout repairs

r2, 2026-11-13, written by the desk (Fable); r2 seats the placeholder source after the desk read `zones.ts` and `resolve-values.ts` at Dann's word of 17:38. NOT YET REVIEWED (`CONTRACT.md` section 1 item 19). Branch: `cloud-lane-53`, cut from `Shane` at or after `d32429c1`. Everything here sits behind `?calibrate=new`: no live string and no live screen changes.

## What the singer needs

A singer on the new capture screen sees one vowel's two numbers at a time. Dann, 2026-11-13 17:34 (as written): *"One element I miss from the old design is a report of the fr1 and fr2 valuyes for each vowel in Herz. Is there a way to offer that meaningfully but not challenging the feaute of this GUI which is the vowel space?"* Ruled 17:36: a folded list, closed by default (`docs/memory/OPEN.md`, N.199, THE READINGS LIST ON THE CAPTURE SCREEN). The singer also needs to read the chart's numbers at every width.

## Read first, in full

`apps/web/src/lib/voice/VowelCapture.svelte`; `voice/chart/readings.ts`; `voice/chart/geometry.ts:161-183`; `voice/chart/ChartLayers.svelte`; `voice/chart/VowelChart.svelte`; `voice/chart/VowelSpaceSheet.svelte`; `voice/chart/zones.ts`; `voice/engine/resolve-values.ts`.

## Step 1. The readings list

1. Under the hint and the explain line of the capture screen (`VowelCapture.svelte`, after `<p class="explain">`, before the hide toggle), one disclosure, closed by default: a `<details>` whose `<summary>` is `sheet.readings` ("Your readings" « Vos lectures », ratified 2026-11-13 10:48). No new string. If any new word proves necessary, stop and report it; do not write it.
2. Open, it lists all ten vowels in the order of the ten buttons. Columns as the sheet's table (`VowelSpaceSheet.svelte:112-118`): the vowel, fR1, fR2, each as Hz with the nearest note and signed cents, through `noteReading` (`readings.ts`). Headers use `FrSym` and the ratified `sheet.col.*` strings.
3. A sung vowel is in the ink colour. A vowel not yet sung shows its placeholder's values in the tertiary grey, taken from the same `ZoneSet.placeholders` the chart draws its hollow dots from (`computeZones`, `voice/chart/zones.ts:87-125`, which calls `resolveVowelValues(profile, voiceType, { placeholders: 'always' })` at `:93`; `engine/resolve-values.ts:96`; read by the desk 2026-11-13), so a dot and its row are one number; do not call `resolveVowelValues` a second time for the list. A sung vowel's values are the stored reading's, as the readout takes them (`VowelCapture.svelte:208`, `profile[subject]`), and "sung" is the chart's own test (`zones.ts:81`). The placeholder rows carry the ratified screen-reader word `capture.button.placed` ("placeholder" « valeur par défaut ») reaching assistive technology. A sung reading with no usable fR2 shows what the readout shows today (`calib.roster.tryAgain`, `VowelCapture.svelte:312`).
4. The list never opens by itself, and it is closed while a take runs or lands when "Hide the chart and the readout while I sing" is on (it is a readout). Whether it is open is not stored.
5. It adds no height while closed beyond one line, and the vowel buttons and the two action buttons stay where they are.
6. Tests: the rows for a profile with sung, placed, and no-fR2 vowels; closed by default; hidden under the hide toggle during a take.

## Step 2. The chart's numbers never run together

Found in `docs/sessions/report-code-n199-amendment-pictures/phone-fr-pause.png`: "190018001700". Cause, read by the desk: `geometry.ts:168` chooses the step from the spacing at the middle of a logarithmic span against `minPx = 38` chart units (`:178`), so lines at the high end sit closer than 38; and `VowelChart.svelte:34` enlarges `labelSize` as the chart narrows, so a four-digit number is wider than the gap.

1. The step is chosen so that the two closest neighbouring numbers on each axis clear each other by the width of the widest number at the current `labelSize` plus a gap, at every view the motion passes through. Lines may stay denser than numbers if you prefer (a number on every second line); say which you chose.
2. The fR1 row number nearest the lower edge does not touch the axis word at the lower left ("800" above "tongue forward" today).
3. **Every site that computes this number:** `gridTicks` is called at `ChartLayers.svelte:64` only (desk grep 2026-11-13); the capture chart and the sheet both draw through `ChartLayers`, so both change together. Confirm with your own grep and say what depended on the old spacing (tests in `geometry.test.ts`).
4. Tests: for the full view and for the zoomed view of each of the ten vowels, at chart widths 320, 484, and 700 CSS px, no two number boxes on an axis overlap.

## Step 3. The chart has a largest size

Found by the desk in Dann's Chrome at a window 1244 CSS px wide (the Drawer as a sheet): the chart fills the sheet's width and height and the vowel buttons fall below the fold. `VowelCapture.svelte:469` sets the chart box by `aspect-ratio: 484 / 280` with no largest width.

1. The capture screen's content has a largest width (DESK DEFAULT 520 px, board D's width) and is centred in a wider sheet; the phone and the 1400 px desk Drawer are unchanged.
2. Picture: the capture screen at 768, 1024, and 1244 CSS px wide, at rest, with the buttons and both action buttons in view at 800 px of height.

## Step 4. The sheet's numbers hold a readable size on screen

`VowelSpaceSheet.svelte:82` passes `labelSize={12}` in chart units, so in the Drawer the grid numbers shrink with the chart. On screen, size them as `VowelChart.svelte:34` does (11 CSS px at any width). In print, keep what the printed sheet has today; the sheet still fits one letter page in both languages (`pdfinfo` Pages 1).

## Done when

All eight gates pass on the tip, with the count of gate 4 stated before and after; pictures for Steps 1 to 4 in English and French, phone 390 by 844 and desktop Drawer, in `docs/sessions/report-code-n199-readings-pictures/`; one report `docs/sessions/report-code-n199-readings-list-and-chart-layout_r1_2026-11-13.md`; the branch pushed. Look at every picture yourself before you report it.

## Constraints

- One vowel per note and the other standing rules of `docs/memory/CONTRACT.md` are untouched by this work.
- No new English or French. The resonance symbol follows Titze et al. (2015), Table I, through `FrSym` only.
- Do not touch the extractor, the status of a reading, or `engine/plausibility.ts`: that is N.200.
- Do not touch the wheel (`pacifier/`); it is deleted last, after Dann's walk.
- `lib/voice` may not import `lib/insights` (`scripts/ratchets.mjs`).

## What you could not establish

End the report with a section of this name. NOT ESTABLISHED beats a complete invented answer.

Known gap handed to you: whether `<details>` meets the 44 px touch floor for its summary in this stylesheet.
