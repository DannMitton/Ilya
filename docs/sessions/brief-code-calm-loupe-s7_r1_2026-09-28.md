# Brief for Code: the calm loupe, slice 7. One squircle for every stop

**Desk brief r1, 2026-09-28, at `7d2fcd6`. Shape: `BRIEF-TEMPLATE.md`.** Under Dann's delegation of 2026-09-28 01:36 (`brief-code-calm-loupe_r1_2026-09-28.md`, top): design questions come to the desk, not to Dann.

## 1. What was observed

Dann's walk, 2026-09-28 14:44 to 14:47, «Скучай» m. 25, desktop, with screenshots:

1. **A taken rest carries no squircle.** The readout says `Rest · beat 4, pulse 2 · Eighth`, but the only mark is a pale grey-blue vertical band behind the rest, which reads as a gap rather than a selection. His words: *"I cannot effectively select a rest. Compare this to the selection squircle on a note."*
2. **A taken gap carries no squircle either.** In Corrections the cursor stops on the carets, but nothing marks which caret it stands on. His words: *"the squircle doesn't capture the carets as I expected."*
3. **At E1, three octaves below the staff,** the window follows the note down (slice 5), and the IPA and lyric rows scroll out of view, leaving fragments at the window's bottom edge.

## 2. What is established

- The ring is built from the selected event by `ringBox` (`apps/web/src/lib/score/selection-ring.ts:241`), drawn through `stripRing` (`apps/web/src/lib/score/loupe.ts:719-734`). Lead, from `memo-loupe-window-sizing_r1_2026-09-27.md`.
- Your own report says *"a rest carries no ring"* (`report-code-calm-loupe_r1_2026-09-28.md`), which is why slice 4's follow used the hit rectangle for a rest.
- `handleRest` converts a taken rest to a note and back (`apps/web/src/routes/+page.svelte:1113-1131` at `9ebfdc0`), so the verb exists; only the mark is missing.

**What draws the grey band, and why a rest has no ring, is NOT ESTABLISHED by the desk.**

## 3. Measure before you change anything

1. Find what draws the grey band on a taken rest, and where the ring declines a rest and a gap.
2. Report both with `path:line` before you change anything.

## 4. What to build (DESK DEFAULT, under the delegation)

- **One mark for every stop.** The same squircle, in the same colour and stroke, surrounds whatever the cursor stands on:
  - **a note:** as today;
  - **a rest:** around the rest's own glyph, with the same padding a note gets;
  - **a gap:** around the caret, narrow, spanning the caret's arrowheads.
  The grey band goes, unless it serves something else; if it does, report it.
- **The squircle never collides with a neighbour's ink.** The tap-floor and clearance rules of `docs/memory/OPEN.md` §THE CARET, clauses 4 and 13, apply to the new marks as they do to the note's.
- **Observation 3, a note far below the staff:** keep the note in view, as slice 5 does. When the note and the lyric rows cannot both fit, show the note and leave the rows cleanly out of view, with no fragment of a glyph at the window's edge. Report what you choose, with a measurement at E1 and at C7.

## 5. Constraints

The same as the calm-loupe brief §5. Stage the patch to the desk before running Playwright a second time.

**Displaces:** nothing. The Correction Station's slices 4 to 6 follow this.

## 6. Done when

- The gates pass.
- The desk has checked the patch in its cloud copy.
- `DONE` is Dann's walk: take a note, a rest, and a gap in turn, and see the same squircle on each.
