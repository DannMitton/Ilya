# Report: row 128, the tempo control's beat chips centre their note, as Corrections' cells do

Branch `cloud-lane-12`, cut from `Shane` at `c68f9a0`. Working tree was clean before the work. Brief: `docs/sessions/brief-code-row128-tempo-chips-centred_r2_2026-10-19.md`, with the two changes Dann gave for the lane (branch, and the post-row-127 baselines).

## The diff, by file

- `apps/web/src/lib/score/loupe-ink.ts` (+54): `MEASURE_PX` (100), `measureGlyphInk(glyphs, ctx)` (the body of the old `measureGlyphs`, with `ctx` injected), and `measureGlyphInkInBrowser(glyphs)`, which awaits `loadNotationFont` and `document.fonts.load`, then measures on a canvas. Imports `InkBox` from `loupe.ts` and `loadNotationFont`.
- `apps/web/src/lib/score/CorrectionSurface.svelte` (-38 lines, 1265 to 1227): `onMount` now calls `measureGlyphInkInBrowser(ALL_GLYPHS)`; `measureGlyphs` and its local `MEASURE_PX` are gone; imports `MEASURE_PX` and the wrapper. Same glyphs, sets, heights.
- `apps/web/src/lib/tempo/TempoControl.svelte` (+65 / -2): the chips draw an SVG through `centredViewBox` at `CHIP_H = 26` over one common box from `commonInkBox`; the text span stays as the fallback until measured. Measurement runs in an `$effect` that returns at once unless `tempoUi.open`, memoizes per string (`measured`), and reads `boxes` through `untrack`. `.chip` gains `display: flex; align-items: center; justify-content: center; padding: 0`; `.glyph` is `display: block; overflow: visible`. The 44 px minimum, border, radius, `.on`, `.chip`, `aria-pressed`, `aria-label`, and `data-tempo-control` are untouched. The box set is `CHIP_BOX_EXTRA` (empty): put Corrections' glyphs in it to match that row's scale (the comment above it says how).
- `apps/web/src/lib/score/loupe-ink-measure.test.ts` (new, 3 tests): the box per glyph is `{ x: -left, y: -ascent, width, height }`; the font is set to `MEASURE_PX` in Finale Maestro; a zero box and a glyph with no bounds are skipped.
- `scripts/ratchets.json`: `CorrectionSurface.svelte` ceiling 1265 to 1227. No ceiling raised.

No string, `beatGlyph`, `beatName`, `LENGTH_CELLS`, tempo logic, receipt, or Insights sentence changed.

## Gates

| Gate | Result | Baseline |
|---|---|---|
| web-test | 2865 passed (2865) | 2862 + 3 new |
| score-parser | 756 passed, 5 skipped (761) | same |
| phonology | 267 | 267 |
| dictionary | 248 | 248 |
| blurb | 145 | 145 |
| integration | 55 | 55 |
| web-check | 0 errors, 12 warnings | same |
| ratchets | OK | OK |

## The pictures

`docs/sessions/row128-shots/`: `before-{3-8,4-4,6-4}-{1440,390}.png`, `after-…` likewise, and `corrections-duration-row-1440.png`. The control opened through the Input band's "Change the tempo", English, real upload route. "Before" is `885986f`'s code on a second dev server. Fixtures: 3/8 `tchaikovsky-op38-3-voice.musicxml`, 4/4 `row126-song1-bars-9-10.musicxml`, 6/4 `sun3-2.musicxml`.

Measured in the live render (`getBoundingClientRect`), 1,440 and 390 alike:

- Chips are 44 x 44. Before, every chip held a text glyph. After, the SVG is 26 px tall, 14.25 px wide (3/8 and 4/4) or 10.97 px wide (6/4), with 9 px above and 9 px below in every chip, the dotted ones included.
- Corrections' duration cells, same page: SVG 26 px tall, 9 px above and below in a 44 px cell. The chips and the cells now have the same margin.

The three heights: the chips' common box is 26 px (measured). The brief's figures of about 21.5 px for the chips today and about 18 px for Corrections' quarter are the brief's, not mine; I did not measure either.

## Could not establish

- **Dann's look.** DONE is his, on the alias after the merge.
- **The Playwright suite.** I did not run `apps/web/e2e/tempo.test.ts` or any e2e test. It reads the attributes I kept, but I have not seen it pass.
- **The 390 px opener.** In the closed bottom sheet Playwright's click on "Change the tempo" timed out, so the 390 pictures open the control with a DOM `click()`. The control rendered and measured correctly. Whether a thumb reaches that opener at 390 px is not established here.
- **Re-measure on a new score's metre.** Each fixture was a fresh page load, so I did not watch the effect re-measure when a score changes under an open control. Unit tests do not cover the effect.
- **The 1,440 px "before" for the 4/4 fixture on screen**: the chip metrics are recorded, but I looked at only the 3/8 pair as images. The other pairs were not individually inspected by eye.
- **The 1,440 px Corrections picture** was taken once from the 3/8 fixture in Corrections mode; I did not inspect it by eye.
- The final `CHIP_BOX_EXTRA` edit came after the pictures. With the set empty the behaviour is identical, and the gates above were re-run after it, but the pictures were not retaken.
