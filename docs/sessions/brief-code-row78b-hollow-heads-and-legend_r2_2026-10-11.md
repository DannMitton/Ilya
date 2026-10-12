# Brief for Code: row 78b, the hollow placeholder head and its legend (r2, 2026-10-11)

QUEUE row 78b. For the cloud lane, Sonnet, after 78a. Written by the desk (Opus) 2026-10-11 about 19:55 as row 78 r1; split into three by the desk at about 23:05 on Fable's review (`docs/sessions/review-fable-briefs-78-80_r1_2026-10-11.md`), with its amendments applied. Rulings: `docs/memory/OPEN.md`, from "ROW 69's FRENCH AND THE WORD \"SUNG\"" to "`insights.r2.cycles` RATIFIED", 2026-10-11 19:42 to 21:52, and `docs/memory/PRODUCT.md`'s last sections. On `cloud-lane` (row 69 and row 34 are there, not yet in `Shane`). Citations read on `cloud-lane` at `b8b07f8`.

## 1. What was observed

Row 69's report (`report-code-placeholder-vowels-labelled_r1_2026-10-11.md`, "For Dann") and row 34's (`report-code-markup-crossing-squircle_r1_2026-10-11.md`), and Dann's walk of the alias at `8e74f39` on 2026-10-11 from 20:23. Dann's rulings on what he saw are in the files named above.

## 2. What is established, each with its `path:line` (read on `cloud-lane` at `b8b07f8`)

- `apps/web/src/lib/i18n.ts:1793-1794`: `placeholder.line.many` and `.one`; a comment above them says the French singular is DESK-DERIVED.
- `i18n.ts:1798-1800`: `placeholder.comment`, `placeholder.turns.one`, `.many`, under a PROPOSED comment.
- `i18n.ts:1834-1838`: `comment.working.where.above` and `.under` (with "sung" / « chanté »), and the two `…Placeholder` variants without it.
- Row 69's report names the code that chooses between them: `comment-text.ts:295-296`, `:341`, `:446-450`; `InsightsPane.svelte:233`; and the test in `comments.test.ts`.
- Every calibration reading is taken in fry: `i18n.ts:1168`, `calib.welcome.fryAnswer`.

## 3. The work

1. **Placeholder turning noteheads are hollow, not dashed** (Dann 2026-10-11 19:56, `OPEN.md`, "PLACEHOLDER TURNING NOTES ARE HOLLOW"). Where row 69 draws a turning notehead as a dashed outline (`packages/score-parser/src/placeholder-mark.ts:36-46`, the `'outline'` style, drawn at `staff-renderer.ts:3052` in SMuFL mode and `:3054` in primitive mode; the ledger lines take their dash at `:3036` with `'stroke'`, which becomes `'tag'`), draw a hollow circle in lavender, solid stroke, stemless (Dann 20:03 to 20:04, `OPEN.md`, the AMENDED line under "PLACEHOLDER TURNING NOTES ARE HOLLOW"). Its diameter is the height of the font's half-note head (SMuFL `noteheadHalf`, read from the font's bounding box; in primitive mode, the filled head's height), so it sits on a line or in a space as a head does. Its stroke: measure the half-note head's rim at its thickest and thinnest from the glyph. The font metrics Ilya loads give bounding boxes only (`staff-renderer.ts:678`, `bBoxNE`/`bBoxSW`), not stroke weight: rasterise `noteheadHalf` at 3x and measure the rim, or read the outline from the font file; if either costs more than half an hour, use 0.12, 0.16, and 0.20 staff spaces as the three candidates (DESK DEFAULT) and say so. Then draw the circle at both and at their mean, and send one picture of the three side by side at stave size and at 3x; build with the mean unless the picture shows it too light or too heavy, and say which you chose. Centred where the head would be. Its ledger lines and accidental are solid lavender. The crossing squircle, the Insights comment's rule, and the vowel figure's bars keep their dashes. Keep `data-placeholder="true"` on the head. Keep `opacity="0.85"` as the filled head has (`staff-renderer.ts:3052`, `:3054`). Rewrite `placeholder-mark.ts`'s header, which explains the dashed outline, retire `PLACEHOLDER_OUTLINE` and `PLACEHOLDER_DASH_FINE` if nothing else uses them, and update `placeholder-mark.test.ts`.  *(r1 item 5)*
2. **Two legend entries on Markup**, after the stems entries, in `apps/web/src/lib/markup/legend.ts` beside `MARKUP_STEMS_COPY`, each drawn with its head in lavender (`--lavender`, #9585A2) before the words, as the stems entries draw their glyphs. Verbatim:
   - filled head: en `= the pitch where this vowel turns, from your voice`; fr `= la hauteur où cette voyelle change de timbre, d’après votre voix`
   - hollow head: en `= the same, from a placeholder value`; fr `= la même, d’après une valeur par défaut`
   The hollow entry shows only when the page draws at least one hollow head (DESK DEFAULT). The comment above them: RATIFIED by Dann 2026-10-11 20:01.
   The entries are drawn by `apps/web/src/lib/components/Paper/LegendItems.svelte`, which draws the stems entries from `packages/score-parser/src/stem-legend.ts`; add the two head icons there, and the flags to `buildMarkupLegend`'s options, set from `MarkupPane.svelte:791`. The filled entry shows whenever the page draws a turning head (the condition the stems entries use, `hasAcousticMarks`); the hollow entry only when at least one is hollow. The record in `OPEN.md` has straight apostrophes in « d'après »; build with U+2019, as `legend.ts:63` already does (« n’est »).  *(r1 item 6)*
3. Tests for items 1 and 2: a placeholder turning head is a hollow circle of the half-note head's height, with no dash; a sampled one is filled; the legend carries the hollow entry only when a placeholder is drawn. One picture of Markup page 1 in each language with both entries showing.  *(r1 item 7)*

## 4. The rulings this serves

Dann 2026-10-11 19:42 to 22:00, quoted in `OPEN.md` and `PRODUCT.md` at the headings each item names. Dann 2026-10-11 12:36 to 12:42, "STAND-INS ARE LABELLED", `OPEN.md`.

## 5. Constraints

Write no French that is not in this brief; use U+2019 apostrophes as given. Do not touch `tools/e16-harness/`, `third_party/homr-web/`, `apps/web/src/lib/omr/` (row 80 is measuring there on the Mac), or `docs/memory/` beyond this row's State. Other uses of "sung" in `i18n.ts` (for example `calib.roster.oNoteAria`, about the vowel as sung in Russian) are not in scope. **Displaces:** nothing.

## 6. Done when

Pictures: the three-stroke picture from item 1 (stave size and 3x, `docs/sessions/placeholder-shots/hollow-strokes.png`); Markup page 1 in each language with both legend entries showing. The eight gates pass, with gate 4's and gate 5's counts and their moving tests named. `WRITTEN`; DONE is Dann's walk after the merge.

## 7. Report back

`docs/sessions/report-code-row78b_r1_2026-10-11.md`: what changed, with `path:line`; the pictures; the gates; and **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Commit and push `cloud-lane` only (Dann's amendment of 2026-10-02 02:37, `CONTRACT.md` §5; it overrides `AGENTS.md`'s "no agent commits" for this lane only). Set row 78b's State and stop.
