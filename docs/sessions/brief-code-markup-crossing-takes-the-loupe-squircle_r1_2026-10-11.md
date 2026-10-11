# Brief for Code: Markup's red crossing squircle takes the Loupe's squircle (QUEUE row 34, r1, 2026-10-11)

Written by the desk (Opus) 2026-10-11 about 09:10, at a scheduled check-in, from a read-only clone of `cloud-lane` at `f8d8ca3`. For the cloud lane, Sonnet. **Not yet in the tree:** the link to Dann's Mac was down at 09:00, so this file waits to be placed in `docs/sessions/`.

## What the singer sees

On Markup, a note where the voice's first resonance crosses a harmonic carries a red squircle. Today it rings the notehead alone. After this, the red squircle has the same shape as the squircle that marks a selected note: it holds the note and its IPA syllable, because the crossing is about that note's vowel at that pitch. Dann, 2026-10-05 06:55, on a picture of Markup (`../sessions/picture-dann-markup-squircle_2026-10-05.png`): *"The squircle is supposed to highlight a formant/harmonic interaction. Right now it highlights an isolated notehead. Please adopt the Loupe's squircle treatment for Markup."*

## What is in the tree (read 09:05, at `f8d8ca3`)

- **Today's crossing mark:** `packages/score-parser/src/staff-renderer.ts:3127-3132`, a fixed 22 by 22 `rect` with `rx="7"`, centred on the notehead, stroke `#b23b3b`, stamped `data-analysis="crossing"`; it also widens `lowestInk` and `highestInk` by 11.
- **The squircle grammar:** `apps/web/src/lib/score/selection-ring.ts`, `ringBox` (`:260`): width from the note's own ink and its rendered IPA syllable; bottom at the IPA baseline, shared by every ring on a system; top a floor of one stave space above the stave, higher for a note whose ink reaches higher; a beam may be crossed. Rulings: `docs/memory/OPEN.md` §N.141, "THE GRAMMAR, RULED BY DANN 2026-09-14" and the sections after it.
- **Markup already draws the selection squircle with it:** `apps/web/src/lib/markup/MarkupPane.svelte:350`.
- **The Loupe filters analysis marks out** by `data-analysis` (`apps/web/src/lib/score/Loupe.svelte`, the comment at about `:1068`), so the crossing never shows in the Loupe, before or after this row.

## The work

1. Every crossing note on Markup gets a red squircle whose box is `ringBox`'s for that note. One geometry for both marks (DESK DEFAULT): do not write a second squircle calculation in the renderer.
2. **The page's rule holds, not the Loupe's** (`OPEN.md` §N.141, the table "the loupe's squircle / the page's squircle"): the crossing squircle never re-spaces the music; a collision with a neighbour's accidental is accepted.
3. Keep the colour `#b23b3b` and the stroke weight (DESK DEFAULT: the colour carries the meaning "crossing"; Dann's objection was to what the ring encloses). Say in the report if the stroke must change to match the selection squircle's `RING_STROKE`.
4. When the selected note is also a crossing, both squircles share one box; the selection's draws on top. Report how it looks.
5. **Print:** the crossing squircle prints exactly as before, now in the new shape (`PRODUCT.md`, WYSIWYG: if it appears on Ilya's page, it can be printed). Check the print path, not only the screen.
6. Keep `data-analysis="crossing"` on the new mark so the Loupe's filter still drops it.
7. Remove the old fixed `rect`, and the `lowestInk`/`highestInk` widening if nothing else needs it; say what you found.
8. Before and after pictures of *Without Sun*, no. 1 (the tree's fixture `apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml`) on Markup with a voice that produces crossings, at desktop width and at 390 px, plus one print preview page.
9. Tests for the new placement. All eight gates; say if a count moves.

## Constraints

- Commit and push to `cloud-lane` only; never `Shane` or `main`; no pull request; no edits in `docs/memory/`.
- Anything that needs Dann's taste (for example, whether red stays red): build the DESK DEFAULT, show it in the pictures, and list it under "For Dann".
- NOT ESTABLISHED beats a complete invented answer.

## Report

`docs/sessions/report-code-markup-crossing-squircle_r1_2026-10-11.md`: the state line first; the pictures; each change with its `path:line`; the gates; "For Dann"; **Could not establish**.
