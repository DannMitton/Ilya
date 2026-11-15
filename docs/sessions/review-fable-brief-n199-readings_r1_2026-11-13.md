# Fable review of brief N.199 r2 (readings list and three chart repairs)

2026-11-13 17:4x. Filed by the desk (Fable) from the reviewer's hand-back, whole. 221,992 tokens (harness count), cap 330k, 26 tool uses, 6.6 min. Read in the desk's clone (`cloud-lane-51` `680c847f` merged with `Shane` `df29c050`; source identical to `d32429c1` for the files named). All amendments applied in brief r3.

**Verdict:** SEND WITH AMENDMENTS. Two blockers, eleven amendments, no new word needed.

## Blockers

1. **Step 3.2's acceptance cannot be met by a width cap.** Below the chart the stage needs about 265 px (`VowelCapture.svelte:462`, `:494`, `:510`, `:551-552`, `:594`). In `phone-fr-pause.png` the chart starts 322 px down and the action buttons end near 770 px, which this sum reproduces (322 + 186 + 265 = 773). At 520 px wide the chart is 301 px tall, so the buttons end near 888 px; at 484 px, near 867 px. The sheet's window ends at 756 px (`Drawer.svelte:1876`, `bottom: 44px`). Restate the acceptance: scrolled until the stage sticks (`VowelCapture.svelte:457-458`), the chart, ten buttons, and both action buttons are in view at 800 px.
2. **Step 4 makes the sheet's numbers overlap for every voice unless Step 2 covers the sheet's frame.** Measured below: 10 of 10 voices at 430 and 300 px. Step 2.4 names only the 484 frame; the sheet's is 720 by 420, and 360 in print (`VowelSpaceSheet.svelte:44`, `:46`). Step 4 also says print keeps what it has, while Step 2.3 says both change together.

## Amendments

- **A1.** Step 1.4: strike "or lands"; the list follows `hiding`. `hiding` excludes the landing (`VowelCapture.svelte:197`, `:200`), the readout shows then (`:210`, `:307`), and `capture.hidden` says so (`i18n.ts:2565`).
- **A2.** Step 1.4: close the list in `startTake` when the toggle is on (`:218`), and keep its closed line in place but invisible and inert while `hiding`. A `<details>` cannot be disabled, and removing it would move the toggle.
- **A3.** Step 1.3: "no usable fR2" is `f2 > 0` (`readings.ts:61`, `zones.ts:137`), not the readout's `typeof` test (`VowelCapture.svelte:312`). A stored f2 of 0 would print "0 Hz" in the row while the chart draws a bar.
- **A4.** Build the rows as a pure function in `readings.ts`, fed `model.placeholders` (`VowelCapture.svelte:86`). `readingRows` returns sung vowels only (`readings.ts:53-64`), and Step 1.6 needs a test without a mount.
- **A5.** Name the accessible parts: sung rows carry `capture.button.sung` (`i18n.ts:2575`); the vowel cell shows the symbol with the spoken name visually hidden (`VowelCapture.svelte:265`, `:370`); the table is named by the summary, with no caption. A symbol-only cell keeps a row on one line at 322 px.
- **A6.** Give the summary `min-height: 44px` as `.hide-toggle` has (`VowelCapture.svelte:640`) and draw its marker in CSS. The only other `<details>` sets no height (`CalibrationWizard.svelte:1725-1729`). Move the "known gap" into "Done when" as a measured height.
- **A7.** Say that the list is below the fold on a phone at rest (the picture ends at the action buttons) and scrolls under the sticky stage, leaving about 296 px. Require a phone picture with the list open and scrolled.
- **A8.** Step 2: `gridTicks` must receive `labelSize`; `ChartLayers.svelte:64` passes none. Name the test inputs: every value of `TIER1` plus no type (`voiceTypes.ts:18-28`), an empty and a part-sung profile, `mixView` samples (`geometry.ts:130`), and both frames.
- **A9.** Step 2: widen the rule to every number box. Numbers are cut by the frame edge, a row number meets a column number at the upper corner, and "900" meets the turned axis word in the picture (`ChartLayers.svelte:145`, `:150`, `:153`). For 2.2, recommend: a number whose box meets another box or the frame is not drawn; its line stays.
- **A10.** Step 3: put the largest width on `.capture` (`VowelCapture.svelte:360-369`); the parent centres it (`CalibrationWizard.svelte:1638-1643`). Use 484 px (`model.ts:12`), not 520: the desk Drawer's content is 520 less 32 less 36 (`layout.ts:41`, `Drawer.svelte:1369`, `:1467`). Cap the sheet at 720 px too (`VowelSpaceSheet.svelte:150-154`).
- **A11.** Step 4: choose the size by `forPrint`, not by a measured width. Print is a second instance (`print-sheet.ts:28`) in a root that is `display: none` on screen (`VowelSpaceSheet.svelte:385-388`).

Also: `geometry.test.ts:170-177` pins the 38 px rule and the four-argument call and will move; the `sheet.` gloss at `i18n.ts:69` gains a consumer.

## Citation table

| Citation | Result |
|---|---|
| `VowelSpaceSheet.svelte:112-118` | CONFIRMED |
| `zones.ts:87-125` | MOVED: `computeZones` is `:88-129` |
| `zones.ts:93` | CONFIRMED |
| `resolve-values.ts:96` | CONFIRMED |
| `VowelCapture.svelte:208` | CONFIRMED |
| `zones.ts:81` | MOVED: the test is `:82` |
| `VowelCapture.svelte:312` | CONFIRMED |
| `geometry.ts:161-183`, `:168`, `:178` | CONFIRMED |
| `VowelChart.svelte:34` | CONFIRMED |
| `ChartLayers.svelte:64`, only call site | CONFIRMED by grep |
| `VowelCapture.svelte:469` | CONFIRMED, but the cap belongs at `:360` |
| `VowelSpaceSheet.svelte:82` | CONFIRMED |
| "520 px, board D's width" | CONFIRMED in `OPEN.md` N.199 (the chart there is 484) |
| Strings: `i18n.ts:2540-2543`, `:2576`, `:1360` | CONFIRMED, meanings as assumed |
| `noteReading(hz, language)` | CONFIRMED, `readings.ts:41`; import allowed (`ratchets.mjs:81`) |
| Breakpoint | `Drawer.svelte:1866`, `max-width: 1399px` |
| "Behind `?calibrate=new`" | CONFIRMED: `CalibrationWizard.svelte:1380`, `SummarySheet.svelte:13-16`; no other importer |

## What the reviewer measured

Instrument: a `tsx` script calling the tree's `buildChartModel`, `zoomTarget`, `mixView`, `gridTicks`, and `project` for ten voices with an empty profile (the reviewer's scratch `measure.ts`, `cross.ts`; not kept). Number width is estimated at 0.5 em a digit plus the 3-unit halo (`ChartLayers.svelte:214`).

- **Placeholders:** ten for every voice type and for no type, all positive; seven with three vowels sung, one of them implausible and one with no f2.
- **Capture chart, 110 views at rest:** column numbers overlap in 24 at 320 px, 0 at 484 px, 0 at 700 px. Worst is about 8 px of overlap at 320 px. Tenor at 320 px draws 2500 to 1500 in steps of 100. Row numbers never overlap each other.
- **Lowest row number against the axis word:** 61, 49, and 27 of 110.
- **A row number meets a column number:** 46, 24, and 20 of 110.
- **Sheet at 11 CSS px:** 10 of 10 voices overlap at 430 px and at 300 px. At today's 12 units, 1 of 10 (soprano, 2500 against 2400), inside the estimate's error.

What could make it lie: the digit width is an estimate, not Source Sans 3 measured; no browser ran; sung readings widen the views. The picture confirms the 320 px result. The brief's cause is right. Its test passes today at 484 and 700 px, so only 320 px and the sheet exercise it.

## Questions the reviewer marked as Dann's (each decided by the desk as a DESK DEFAULT and told to him)

1. Does a column header carrying the resonance symbol satisfy "a value is never shown without its resonance"? Recommendation: the header, as on the sheet.
2. The ruling says Hz and the nearest note; the brief adds signed cents. Recommendation: keep them, as on the sheet.
3. Black against grey is the only visible difference between row kinds. Recommendation: add the legend's filled and hollow dot (`VowelSpaceSheet.svelte:90`, `:94`); no word.
4. On a phone the list sits below the fold at rest. His to accept or move.

## What the reviewer could not establish

Any rendered behaviour (nothing ran in a browser); the desk Drawer's rendered content width, and the desk's finding at 1244 px; whether a stored reading can hold an f2 of 0; whether `bind:clientWidth` on an `<svg>` reports a width in every browser; what the eight gates are; the spoken text of a note name in the list (`spokenPitchLabel`, `note-picker.ts:158`, not traced).
