# Brief for Code, cloud lane: row 128, the tempo control's beat chips centre their note, as Corrections' duration cells do, r1

> **SUPERSEDED by r2** (`brief-code-row128-tempo-chips-centred_r2_2026-10-19.md`, 2026-10-19 23:3x), which applies Fable's seven amendments (`review-fable-brief-row128_r1_2026-10-19.md`). Kept for the record; do not send.

Written by the desk (Opus) 2026-10-19 23:2x. QUEUE row 128. For a cloud session, Sonnet 5.5, on branch `cloud-lane-11`, after row 127. Fable reviews this brief before Code gets it (`CONTRACT.md` §1 item 19). Row 128's QUEUE entry and Dann's words are not on the branch; this brief carries them.

## What the singer sees today

The tempo control (opened by "Change the tempo"; its line reads "Your tempo. Every figure follows.") shows the beat unit as a row of chips, each a note glyph in a 44 px button. Dann, 2026-10-19 23:18, with a screenshot of the control on the Shane alias: *"Please recentre the note sin their buttons, these are too high. There should be a consistent buffer around the notes inside the button constraint. Please reference the other similar buttons if you need guidance"* (transcribed as written).

## Why it happens, and the model to follow

- The chips set the glyph as text: `<span class="mus">{beatGlyph(c.unit, c.dots)}</span>` (`apps/web/src/lib/tempo/TempoControl.svelte:90-91`), `font-family: 'Finale Maestro'; font-size: 1.5rem` (`:192-195`), in a button with `line-height: 1` (`:153-166`). A SMuFL metronome note's ink is not centred in its font box: the notehead sits at the baseline and the stem rises from it (`apps/web/src/lib/score/CorrectionSurface.svelte:250-259` measured `noteQuarterUp` from 88.9 above the baseline to 13.2 below at 100 px). So the note sits where its metrics put it, not in the middle of the chip.
- **The model, "the other similar buttons":** Corrections' duration cells draw the same glyphs (`LENGTH_CELLS`, `apps/web/src/lib/score/correction.ts`; `beat-glyph.ts` takes its glyphs from the same table) by their **measured ink**: each glyph is measured once with canvas `measureText`'s `actualBoundingBox*` (`CorrectionSurface.svelte:303-323`, `measureGlyphs`), the set shares one common ink box (`commonInkBox`, `apps/web/src/lib/score/loupe.ts:240`), and each glyph is drawn in an SVG through a viewBox centred on its own ink (`centredViewBox`, `loupe.ts:253`; the `drawn` function at `CorrectionSurface.svelte:333-346`; the `cell` snippet at `:367-384`) at a fixed height (`NOTE_H = 26`, `:261`), inside a flex cell that centres it on both axes (`.cell`, `:1057-1071`). One box for the set gives one scale and the same margin in every cell; the comment block at `:230-259` explains why canvas and not `getBBox`.

## The work

1. **The chips draw their note the way the duration cells do.** In `TempoControl.svelte`, replace the text span with the same drawing: measure the chips' glyph strings (a note plus any dots, as `beatGlyph` returns them) by canvas ink after the notation face loads (`loadNotationFont`, `apps/web/src/lib/score/notation-fonts.ts`, as `CorrectionSurface.svelte:281-300` waits for it), take one common ink box over the chips shown, and draw each in an SVG through `centredViewBox` at height `NOTE_H` (26), centred in the chip by flex. While the face has not loaded, the chip shows its glyph as text, as today (no empty chip).
2. **Share, don't copy, the measurement.** Move the canvas measurement (`measureGlyphs`' body, `CorrectionSurface.svelte:303-323`) into one exported function in `apps/web/src/lib/score/loupe.ts` beside `commonInkBox` (or a new small module beside it), and have both `CorrectionSurface.svelte` and `TempoControl.svelte` call it. Corrections' drawing must not change by a pixel: same glyphs, same sets, same heights, same output.
3. **The chip box.** Keep the chip's 44 px minimum, its border, radius, and the `on` state (`:153-171`). Make the chip a flex box centring its content (as `.cell` does at `CorrectionSurface.svelte:1062-1064`), so the drawn note has the same buffer on all sides in every chip, the dotted ones included.
4. **Nothing else.** No string changes. The receipt's beat glyph (`TempoReceipt.svelte`) and the beat in Insights' sentence are inline text, not buttons; leave them. No change to `beatGlyph`, `beatName`, `LENGTH_CELLS`, or the tempo logic.

## Tests and the done state

1. A test of the shared measurement on a stub canvas context (the shape `measureGlyphs` reads): it returns `{ x: -left, y: -ascent, width, height }` per glyph and skips a glyph with a zero box, as today.
2. Every existing test passes unchanged, Corrections' included. If a test pins the chips' text span, stop and report it.
3. Pictures (`docs/sessions/row128-shots/`): the tempo control open at 1,440 px and 390 px, before and after, with a quarter, a half, an eighth, and a dotted beat among the chips (use a score whose metre offers them; say which), and one of Corrections' duration row at the same zoom for comparison.
4. Gates: phonology 267, dictionary 248, web-check 0 errors and 12 warnings, web-test at its baseline after row 127 plus your new tests, score-parser at its baseline after row 127, blurb 145, integration 55, ratchets OK. No ceiling raised; lower `CorrectionSurface.svelte`'s if it shrinks.
5. **DONE** is Dann's look at the tempo control on the alias after the merge.

## The lane

Branch `cloud-lane-11`, after row 127, its own commit and push. Never `Shane` or `main`; no pull request; Dann merges. Do not merge or rebase `Shane` or `main` into the lane. Do not edit `docs/memory/`. Never commit a `brief-code-*` file: the brief lives in `/tmp/briefs` only. Commit subject: `Row 128: the tempo control's beat chips centre their note, as Corrections' cells do`. Report: `docs/sessions/report-code-row128_r1_2026-10-19.md`, with the diff by file and line, the test counts, the pictures, and a section "Could not establish". NOT ESTABLISHED beats a complete invented answer.
