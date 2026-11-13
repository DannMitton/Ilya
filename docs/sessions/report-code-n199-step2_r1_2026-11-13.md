# Report, N.199 Step 2: the sheet, behind the switch

2026-11-13, cloud lane, branch `cloud-lane-51`. Seen only with `?calibrate=new`; without it nothing on screen changes. **Not yet looked at in a browser: see "Could not establish".**

## What changed, with path:line

**The switch.** `apps/web/src/lib/voice/chart/calibrate-switch.ts:12`, `calibrateNewOn(search)`, true only for `?calibrate=new`, read the way `omr/underlay-switch.ts:19-30` reads its own. Read once at the wizard's mount: `CalibrationWizard.svelte:256`. Step 8a removes it.

**The words.** `voice/chart/draft-strings.ts:13` (`DRAFT`), `:39` (`ds`). The brief's section 7 `sheet.*` table, verbatim, plus two the table does not list, which are mine and flagged: `sheet.print` ("Print this sheet") and `sheet.chartAlt` (the chart's accessible name). Nothing enters `i18n.ts`. The words the brief adopts from the tree are read through `t()`: `vowel.name.*` (`spokenName`), `calib.common.hz`, `calib.roster.tryAgain`.

**The readings table as data.** `voice/chart/readings.ts`: `noteReading` `:41`, `readingRows` `:53`, `signedCents` `:35`. Hz rounded; note from the tree's `hzToPitch` and `pitchToHz`, name from `pitchName` (`voice/note-picker.ts:150`), cents from `centsBetween` (`packages/score-parser/src/overlay-engine.ts`), as the brief named. **My typography choices**: negative cents use a true minus (U+2212), "D4 −3", and zero is "±0"; a rounded negative zero never prints "−0" (tested).

**The drawing.** `voice/chart/ChartLayers.svelte` (new): the SVG layers, which Step 4a's `VowelChart` will reuse, so the sheet and the screen cannot draw two charts. Zones are ellipses in each vowel's colour at the opacities of board D's script (0.24; personal 0.30 on the guard's window, 0.15 on a placeholder; 0.5 when active), blended by multiplication, with **no stroke**; the grid is drawn after them; then the hull (dashed until ten are sung), placeholders (hollow, dashed ring, grey symbol), sung dots (filled, black symbol), numbers on the grid. A reading with no fR2 draws a bar at its fR1 across its zone, as Step 4b says. `voice/chart/colours.ts` names each vowel's property; `colours.test.ts` reads `app.css` and fails if a named property is not declared.
- `voice/chart/geometry.ts:178` `gridTicks`: grid lines at round numbers of Hz at least 38 px apart (board D hard-coded two fixed steps).
- `voice/chart/zones.ts:68` `SungDot`, `:131` `sungDots`.

**Tokens.** `apps/web/src/app.css:177-183`: `--zone-i`, `--zone-e`, `--zone-open-e`, `--zone-dark-a`, `--zone-o`, `--zone-u`, `--zone-personal` (the Voice family's `--lavender-jewel`). The six hex values are board D's, DESK DEFAULT, Dann's to retune. The brief says named tokens, never a board's hex values: they are named tokens whose values I could take from nowhere else.

**The sheet.** `voice/chart/VowelSpaceSheet.svelte` (new). Header (title, subtitle, voice name), the chart at 720 by 420 in its own units with the axes named (`sheet.axis.front`, `.back`, `.open`) and the two resonance symbols through `FrSym`, the legend of four, the readings table (vowel with symbol and spoken name, fR1 and fR2 each as Hz and "note ±cents", a missing fR2 as the tree's "Try again"), and the provenance line. The table lists the sung vowels only, in Grayson's order; with none sung it is absent, since "your readings" would be empty. Placed on the summary under the roster, in both summary branches: `CalibrationWizard.svelte:1240-1250` (snippet), `:1478` (finished), `:1486` (not finished).

**Printing.** `voice/chart/print-sheet.ts:23` `printVowelSheet`. The app prints by `window.print()` of the page and hides the drawer in print (`app.css`, `@media print`), where the sheet lives, so a button on the screen copy mounts a **second copy** of the sheet as a direct child of the body with `forPrint`, marks the body, and the sheet's own rules hide every other body child and give the copy a half-inch margin on white at 8.5 in (`VowelSpaceSheet.svelte:345-379`); `afterprint` takes it down. Nothing interactive is drawn in the copy (no print control). The page is the app's own `@page { size: letter; margin: 0 }`; A4 is the dialogue's. The screen copy is not touched.

**Existing files touched.** `CalibrationWizard.svelte` (3 imports, the `calibrateNew` constant, the snippet, two render calls; 2086 to 2108 lines, ceiling 2124 not exceeded), `app.css` (the tokens). `Pacifier.svelte` and everything under `docs/memory/` are not touched in this step.

## Gates after Step 2

| Gate | Baseline | After Step 2 |
|---|---|---|
| phonology | 462 | 462 passed |
| dictionary | 248 | 248 passed |
| web-check | 0 errors, 12 warnings | 0 errors, 12 warnings (5 files) |
| web-test | 5252 passed, 1 skipped | **5483 passed, 1 skipped** (297 files) |
| score-parser | 785 passed, 5 skipped | 785 passed, 5 skipped |
| blurb | 178 | 178 passed |
| integration | 155 | 155 passed |
| ratchets | OK | OK |

web-test is 5451 after Step 1 plus 32 here, all mine: `VowelSpaceSheet` 9, `readings` 10, `draft-strings` 4, `calibrate-switch` 3, `colours` 3, `geometry` 2 (the grid), `zones` 1 (the dots).

## Could not establish

- **How the sheet looks, and whether it fits one letter sheet.** Nothing was rendered in a browser. The tests render it on the server and read the markup, which proves what it draws and what it does not say, not its pixels. The height budget by hand is about 10.1 in of 11, tight; Step 6 measures the printed page, and if it spills I change the sheet, not the claim.
- **Legibility of the symbols at the Drawer's width and the phone's.** The chart scales to the width it is given; its 22-unit symbols are about 15 px at 484 px and about 12 px at 358 px. That is under what I would call comfortable on the phone. Step 6 measures it.
- **Board B3.** Not in the repository. The sheet follows the brief's description and board D's chart; layout, spacing, and the legend's arrangement are mine.
- **The print path in a real print dialogue.** Not exercised: no browser. In particular, whether Safari's `afterprint` fires after the dialogue closes, which decides when the copy is taken down. Step 6's printed picture uses Playwright's PDF.
- **Whether the four personal vowels sharing lavender is what Dann wants.** The review noted ruling 3 says one colour per vowel; I kept the prototype's choice and named it.
- **The `sheet.col.fr1`/`.fr2` rendering.** The brief's table reads "Hz and note (the symbol through FrSym)". I rendered the symbol, then "Hz and note" in small type. If the table meant the symbol alone, that is a one-line change.
- **Contrast of the symbols over the zone colours.** Not measured.
