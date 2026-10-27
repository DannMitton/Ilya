# Report: row 134, printed pages keep their screen colours (2026-10-27)

Brief: `brief-code-row134-printed-colours_r2_2026-10-25.md`, with `review-fable-brief-row134_r1_2026-10-25.md`, both read in full. Branch `cloud-lane-17`, on top of the row 122 commit `b6a186a7` (cut from `origin/Shane` at `234eff3f`). Cloud session, Sonnet. Chromium under Playwright, headless, Linux; Safari not run.

## The instrument

- Fixture: `apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml`, in the repository. A stored bass voice with typed range, tessitura, and passaggi is seeded into `localStorage` (`shane.profiles.v2`) exactly as `apps/web/e2e/insights-page.test.ts` seeds it, because without a voice the Insights stack draws no dose bars and the brief's positive control (the `SingerBlock` bars) would not exist. Viewport 1440 by 1300, `pnpm dev` on the clone, `PUBLIC_INCLUDE_MARKUP_INSIGHTS=true` from `apps/web/.env`.
- Each of Text, Markup, and Insights, and the Guide (reached by setting `ilya:activeTab` to `guide`), was rendered with `page.emulateMedia({ media: 'print' })` then `page.pdf({ preferCSSPageSize: true, printBackground: false })` (the singer's default) and `printBackground: true` (the control).
- Rasterizer: `pdftoppm` 24.02.0 (poppler), already at `/usr/bin/pdftoppm` in the lane, nothing installed. 300 dpi for the three documents, 100 dpi for the Guide (its band is large). Python Pillow read the PNGs.
- Two readings: (a) pixel counts within 4 per channel of every distinct computed colour found inside the three stacks under print media; (b) for named elements, the most common non-white colour inside the element's rectangle in the raster, the rectangle taken from the live print layout relative to its `.paper-page`.
- Positive control, before anything else: Insights `.within` (`SingerBlock.svelte`, rgb 180,138,138) has 56720 matching pixels with backgrounds on and 318 with them off. The instrument sees a background drop. The `.band-swatch` rectangle reads white only with backgrounds off, `(238,229,229)` with them on.
- The measuring scripts are in the session scratchpad and are not committed; the tables below are their output.

## Step 0 table (before any change). `print-color-adjust` on all three stacks computed `economy`

| Element | Screen colour | Printed, backgrounds off | Printed, backgrounds on |
|---|---|---|---|
| Text footer line (`.footer-hairline`, border-top) | 131,146,117 | 131,146,117 | 131,146,117 |
| Markup footer line | 149,133,162 | 149,133,162 | 149,133,162 |
| Insights footer line | 171,127,127 | 171,127,127 | 171,127,127 |
| Text gloss line (`.gloss-row`, text) | 122,138,108 | **47,54,42** | 122,138,108 |
| Text logo bracket (text) | 131,146,117 | **55,62,49** | 131,146,117 |
| Markup logo bracket (text) | 149,133,162 | **71,64,78** | 149,133,162 |
| Insights logo bracket (text) | 171,127,127 | **87,64,64** | 171,127,127 |
| Insights `.within` bar (background) | 180,138,138 | **318 px of 56720** | 56720 px |
| Insights `.band-swatch` (background, 20% rose) | 238,229,229 on white | **white only** | 238,229,229 |
| Insights `.ring-before`, `.bar` rects (SVG stroke, fill) | 217,196,196; 136,95,96 | unchanged | unchanged |
| Song title, IPA row, attribution lines (dark text) | as screen | unchanged | unchanged |
| Sheet (`.paper-page`) | white (`app.css`) | white | white |

One line, as the brief asks: **yes, colours inside the three stacks dropped.** The footer lines did not (the border colour prints with backgrounds off). Light coloured text is darkened (gloss line, logo bracket in all three documents), and two Insights backgrounds are lost (`.within`, `.band-swatch`). Step 1 therefore went ahead.

The Guide's chapter band, report only (`ReadingPaper.svelte:126-138`): with backgrounds off the umber/cobalt fill is absent (band blue 2600 px against 776051 with backgrounds on, at 100 dpi) and the near-white heading prints pale grey, `(169,168,164)` on white, faint but present, on the page I looked at (`A Walkthrough`, page 6 of 25). It is not lost. This row does not touch it; the desk may open a row.

## What I changed

- `apps/web/src/app.css`, inside the existing `@media print` block, after the three-stack reset: one new rule on `.paper-container, .markup-paper-container, .insights-container` setting `print-color-adjust: exact` and `-webkit-print-color-adjust: exact`, with a comment that cites this row and the measure. `app.css` is 471 lines (457 before; it has no ratchet entry and none was added). `--paper-cream: #ffffff` and `.paper-page`'s white are untouched, so the sheet stays white. Not set on `*`, `body`, or the Guide.
- New `apps/web/src/lib/print-colour-adjust.test.ts` (the DESK DEFAULT pin, 3 tests, in the style of `ratified-lines.test.ts`): it reads `app.css`, takes the `@media print` block, and checks one rule on the three stacks carries both spellings set to `exact`, and that none is set on `body`, `html`, or `*`. It fails when the value is changed (I ran it with `exact` replaced by `economy`: 1 failed, 2 passed), and passes as shipped.

## Step 2 table (after the change). `print-color-adjust` on all three stacks computed `exact`

| Element | Screen colour | Printed, backgrounds off | Printed, backgrounds on |
|---|---|---|---|
| Text, Markup, Insights footer lines | 131,146,117; 149,133,162; 171,127,127 | same as screen | same as screen |
| Text gloss line | 122,138,108 | **122,138,108** (was 47,54,42) | 122,138,108 |
| Text, Markup, Insights logo bracket | 131,146,117; 149,133,162; 171,127,127 | **same as screen** (were 55,62,49; 71,64,78; 87,64,64) | same as screen |
| Insights `.within` bar | 180,138,138 | **56720 px** (was 318) | 56720 px |
| Insights `.band-swatch` | 238,229,229 on white | **238,229,229** (was white only) | 238,229,229 |
| Sheet | white | white | white |

At least one element changed between step 0 and step 2 (the gloss line, the logo brackets, `.within`, `.band-swatch`), so the footer lines were not what proved the rule. For every colour found inside the stacks, the count with backgrounds off now equals the count with backgrounds on (the pixel-count table, all three documents). The claim this report makes is about `printBackground: false` in headless Chromium only. The three documents are told apart by the colour of their footer line in the PDF: sage (131,146,117), lavender (149,133,162), rose (171,127,127), each 100% of the pixels in its rectangle.

## Page counts

Same before and after, for the same fixture and voice, from `pdfinfo` on each render: Text 1, Markup 3, Insights 3, Guide 25, with backgrounds off and on.

## Eight gates

| Gate | Before (after row 122, `b6a186a7`) | After |
|---|---|---|
| `pnpm test:phonology` | 291 passed (291) | 291 passed (291) |
| `pnpm test:dictionary` | 248 passed (248) | 248 passed (248) |
| `pnpm --filter @ilya/web check` | 0 errors, 12 warnings in 5 files | 0 errors, 12 warnings in 5 files |
| `pnpm --filter @ilya/web test` | 3245 passed (3245) | 3248 passed (3248) |
| `pnpm --filter @ilya/score-parser test` | 775 passed, 5 skipped (780) | 775 passed, 5 skipped (780) |
| `pnpm test:blurb` | 145 passed (145) | 145 passed (145) |
| `pnpm test:integration` | 55 passed (55) | 55 passed (55) |
| `pnpm ratchets` | OK | OK |

The 3231 baseline at `234eff3f` rose to 3245 in row 122 (its tests); the rise of 3 here is `print-colour-adjust.test.ts`. No new string and no French.

## What I could not establish

- **`apps/web/e2e/print-pages.test.ts` fails in the lane, before and after this change.** With `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome` it fails on Markup: `Expected: 2, Received: 3` (`print-pages.test.ts:34`), and fails identically with my change stashed. Without that variable it cannot launch the browser. I did not diagnose it. It is consistent with my own measure, which prints Markup as 3 pages both before and after. NOT ESTABLISHED: whether the count is a real defect of the tip or an artefact of the lane (the test counts `.paper-page:visible`, which may disagree with the sheets Markup prints). The brief's constraint that the page count is the same before and after holds in my measure; the e2e guard cannot confirm it as a green test.
- Safari. Playwright renders PDF in Chromium only (Checkly, Playwright PDF guide, per the brief). NOT ESTABLISHED. The check is Dann's print of one song after the ship; before then the desk tells him which checkbox Safari's print dialog shows for backgrounds.
- Whether a Chrome print dialog with "Background graphics" off prints the same as `page.pdf({ printBackground: false })`. The measure is the headless equivalent; I did not drive the dialog. Also that this reading is on one fixture, one stored voice, and one Chromium build (`chromium-1243`).
- Colours the fixture does not draw: the Insights `.above` and `.past` dose bars are `--rose-ink` (103,65,65), which is also the `.tab-mark` text colour, so their pixels could not be separated from it by colour count. They were not probed by rectangle.
- Whether Chromium's `economy` darkening of the gloss line and logo bracket is what the singer's printer showed on 2026-09-24 (`INBOX.md:194`, "printed Texte's sage rule green"). My finding is that the footer rule printed in its colour before this change; the darkening of text was not in that report.
- The cream (`--paper-cream`) stays off paper, as the brief's DESK DEFAULT says; Dann has not ruled it.
