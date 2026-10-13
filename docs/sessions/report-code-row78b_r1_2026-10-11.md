# Report: row 78b, the hollow placeholder head and its legend (r1)

Code (Opus 5.5) on Dann's Mac, 2026-10-12, brief `brief-code-row78b-hollow-heads-and-legend_r2_2026-10-11.md`, read whole.

- **Tree:** `9f9e896` on `Shane`, with row 78a's work uncommitted before this row began.
- **Where the brief was set aside.** It was written for the cloud lane. As Dann directed, its git instructions were ignored: no git command that writes, and all work is left uncommitted.
- **Citations re-checked on this tree; all held at the same lines.**
  - `placeholder-mark.ts:36-46`.
  - `staff-renderer.ts:3036`, `:3052`, `:3054`, and `:678`. At `:678` sits `meterInk`'s use of `bBoxNE`/`bBoxSW`; the metrics type is `smufl-metadata.ts:38-39`.
  - `MarkupPane.svelte:791` was at `:792`.
  - `legend.ts:63` (« n’est »).

## What changed

**1. The placeholder turning notehead is a hollow circle.**

- **`packages/score-parser/src/placeholder-mark.ts`, rewritten.**
  - Its header now explains the hollow circle and quotes Dann's 19:56 and 20:03 to 20:04 rulings.
  - `PlaceholderStyle` is now `'stroke' | 'tag' | HollowHead`, where `HollowHead` is the head's centre, outer diameter, and staff space, all in px.
  - Given a `HollowHead`, `placeholderMark` returns a `<circle>` that keeps the mark's `data-analysis`, its fill colour (as the stroke), and its `opacity="0.85"`. It also carries `data-placeholder="true"`, `fill="none"`, and a solid stroke.
  - The stroke straddles the path, so the radius is (outer diameter less the stroke) ÷ 2, and the outer edge is the half-note head's height.
  - New: `rotatedEllipseHeight` (the primitive head's footprint, 9.15 px for the renderer's 6 by 4.4 ellipse turned 18°) and `PLACEHOLDER_HOLLOW_STROKE_SP`.
  - Retired: `PLACEHOLDER_OUTLINE`, `PLACEHOLDER_DASH_FINE`, and the `'outline'` style. Nothing else used them (grep of `packages/` and `apps/web/src`), and their export in `index.ts:58` is replaced.
- **`staff-renderer.ts`, four lines changed in place.** The file stays at its ratchet ceiling of 3486 lines.
  - `:55` imports `rotatedEllipseHeight`.
  - `:865` exports `TURNING_COLOUR`, so the legend draws in the stave's own lavender.
  - `:3036`: a placeholder ledger line is `'tag'`, solid lavender.
  - `:3052` (SMuFL): the diameter is `noteheadHalf`'s bounding-box height × `lineGap`.
  - `:3054` (primitive): the diameter is `rotatedEllipseHeight(6, 4.4, 18)`, the filled head's own height.
- **The accidental** was already `'tag'`, solid.
- **What keeps its dash:** the crossing squircle, the Insights comment's rule, and the vowel figure's bars, as the ruling says.

**The stroke, measured.**

- **Method.** I rasterised `FinaleMaestro.otf`'s `noteheadHalf` at 100 px a staff space with PIL. Rim thickness is the shortest distance from each point of the hole's edge to the outside.
- **Result.** The rim is **0.098 sp at its thinnest and 0.297 sp at its thickest; their mean is 0.198 sp**. The diameter is 1.064 sp, from `FinaleMaestro.json`'s bounding box.
- **A first method I discarded.** Rays from the box's centre graze the rim and gave a thinnest of 0.003 sp, which is not plausible.
- **The picture.** `docs/sessions/placeholder-shots/hollow-strokes.png`, made by `docs/sessions/rows-78-79-shots/hollow-strokes.py`. It shows the three circles, in a space and on a line, beside the font's half and black heads, at stave size (12 px a space, the renderer's `lineGap`) and at 3x.
- **Built with the mean, 0.198 sp.** At stave size the thinnest nearly vanishes against the staff lines. The thickest reads as a dark ring, easily taken for a filled head. The mean reads as hollow without looking faint.

**2. Two legend entries on Markup.**

- **`apps/web/src/lib/markup/legend.ts`.**
  - `MARKUP_TURN_FILLED_TYPE`, `MARKUP_TURN_HOLLOW_TYPE`, and `MARKUP_TURN_COPY` (`:65-82`), verbatim from the brief, with the ratification of 20:01 in the comment above them.
  - « d’après » is built with U+2019, as the brief asks.
  - `buildMarkupLegend` takes `turningHeads` and `hollowHeads` (`:110`) and adds the entries after the stems entries (`:125-135`).
- **`apps/web/src/lib/provenance.ts:42-47`:** `LegendItem.head?: 'filled' | 'hollow'`.
- **`packages/score-parser/src/stem-legend.ts:107-140`:** `turningHeadLegendDrawing`.
  - The filled head is the renderer's turning head (`noteheadBlack`, or its primitive ellipse), lavender at 0.85.
  - The hollow head is that same mark passed through `placeholderMark`, the call the stave makes. So the legend and the page cannot disagree.
- **`LegendItems.svelte:34-37`** draws it, as it draws the stems.
- **`MarkupPane.svelte:793-794`** sets the flags.
  - `turningHeads` is `hasAcousticMarks`, the stems entries' condition.
  - `hollowHeads` is set when any analysed event is a placeholder. Every analysed event draws a turning head (`staff-renderer.ts`, the `if (a)` that opens the turning block), so this is "the page draws at least one hollow head".
- **One size I chose (JUDGEMENT).** The head entries draw at `TURNING_LEGEND_LINE_GAP` = 7 px a staff space, twice the stems key's 3.5. At 3.5 px a lone head is about 3.7 px tall and the hollow stroke under 1 px, too small to tell hollow from filled beside the 9.5 px label.

**3. Tests.**

- **`placeholder-mark.test.ts`.**
  - A placeholder head is a `<circle>` whose stroke plus diameter equals the half-note head's height (the SMuFL bounding box, or the primitive head's footprint).
  - It is `fill="none"` with no dash, and keeps `opacity="0.85"`.
  - A sampled head stays filled.
  - The ledger lines and the accidental are tagged, with no dash and no outline.
  - `rotatedEllipseHeight` is checked against 9.15 and 8.8.
- **`stem-legend.test.ts`:** both drawings, with the font and with the primitives.
- **`legend.test.ts`.**
  - The order of the entries, and the hollow entry only with `hollowHeads`.
  - The four ratified strings, character for character.

## The pictures

- `docs/sessions/placeholder-shots/hollow-strokes.png`: the three strokes, at stave size and 3x.
- `docs/sessions/rows-78-79-shots/78b/after-sunless-markup-en-p1.png` and `-fr-p1.png`: Markup page 1 of *Without Sun*, no. 1.
  - Taken on localhost:5173, with a bass voice that sampled only [i], [a], and [ɑ].
  - Both entries show after the stems entries.
  - The hollow circles stand where the placeholder vowels turn.
  - The top line ends "drawn hollow or dashed" (row 78a).

## The gates

| Gate | After 78a | After 78b |
|---|---|---|
| 1 phonology | 251 | 251 |
| 2 dictionary | 242 | 242 |
| 3 web-check | 0 errors, 12 warnings, 5 files | the same |
| 4 web-test | 2457 | **2459**, all passed |
| 5 score-parser | 663 passed, 5 skipped (668) | **668 passed, 5 skipped (673)** |
| 6 blurb | 145 | 145 |
| 7 integration | 55 | 55 |
| 8 ratchets | OK | OK (`staff-renderer.ts` still 3486) |

- **Gate 4: +2.** `markup/legend.test.ts` 9 to 11.
- **Gate 5: +5.**
  - `placeholder-mark.test.ts` 10 to 11 (the outline test is replaced by the hollow-circle test, plus the footprint test).
  - `stem-legend.test.ts` 8 to 12.
- **For the desk:** against the script's baseline of 2448 and 663/668, the run now reads 2459 and 668/673.

## Could not establish

NOT ESTABLISHED beats a complete invented answer.

- **The hollow head in print.** The pictures are screen renders at 1x. I measured the circle on a stave only in the comparison picture, not on a printed page.
- **The primitive mode on the page.** The primitive circle is tested but not pictured; the live page loads Finale Maestro.
- **Whether 7 px a space is right for the legend's heads.** That size is my JUDGEMENT. The stems key draws its heads at 3.5 px.

## For Dann

- Walk Markup on **http://localhost:5173** (uncommitted; Vercel will not show this until you commit and push), with a voice that has not sampled every vowel.
- The stroke is 0.198 sp, the mean of the half-note head's rim. If it reads too heavy or too light on your screen, the one number to change is `PLACEHOLDER_HOLLOW_STROKE_SP` in `packages/score-parser/src/placeholder-mark.ts`.
