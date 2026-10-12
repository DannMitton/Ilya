# Report: Markup's red crossing squircle takes the Loupe's squircle (QUEUE row 34, r1)

**QUEUE row 34, state: WRITTEN, pushed to `cloud-lane`. The red crossing squircle on Markup now has the selection squircle's box: it holds the note and its IPA syllable. It keeps its red, its weight, and its handle. Row 69's dash carries over.** The desk carries this line into `QUEUE.md`; this session does not edit `docs/memory/`.

Written by Code (cloud lane) 2026-10-11, for `docs/sessions/brief-code-markup-crossing-takes-the-loupe-squircle_r1_2026-10-11.md`, on `cloud-lane` after row 69 (`297eeba8`), clean tree before the first edit.

## Pictures

All in `docs/sessions/crossing-squircle-shots/`, of *Without Sun*, no. 1 (`sunless-01-engraved.musicxml`), a bass voice with all ten vowels sung. The song's one crossing is m. 2's [ˈmʲi]. `before-*` is `297eeba8`; `after-*` is this commit.

- **Markup page 1:**
  - `before-markup-desktop.png` and `after-markup-desktop.png` (1440 px);
  - `before-markup-phone.png` and `after-markup-phone.png` (390 px).
- **The crossing up close:** `before-zoom.png`, `after-zoom.png`.
- **The crossing note taken:** `before-selected-zoom.png`, `after-selected-zoom.png`.
- **On a placeholder vowel (row 69):** `after-placeholder-zoom.png`. This is voice A of row 69, with [a], [o], and [u] sampled, so [i] is a placeholder and the ring is dashed.
- **Print preview, page 1** (Chromium print media, Letter): `before-print-1.png`, `after-print-1.png`.

Measured on the live page, in the system's own units:

| | Before | After |
|---|---|---|
| Ring box (x, y, w, h) | 491.3, 68.5, 22, 22 | 490.5, 55, 26.4, 84 |
| Selection ring box on the same note | 490.5, 55, 26.4, 84 | 490.5, 55, 26.4, 84 |
| System viewBox | 0 54 624 121 | 0 54 624 121 |
| Inside the viewBox | yes | yes |
| Under print media | visible, 22 × 22 | visible, 26 × 84 |
| Desktop and phone | the same box | the same box |

## Each step of the brief

1. **One geometry.** The crossing squircle's box is `ringBox`'s (`apps/web/src/lib/score/selection-ring.ts:260`), the same call the selection ring and the loupe make. No squircle arithmetic was written.
   - `ringBox` measures the rendered ink, and the renderer emits a string with no ink to measure. So the ring is now drawn by the page, not by `staff-renderer.ts`.
   - The page already knows which notes cross: `analyzed.events[id].crossing`.
2. **The page's rule.** The ring re-spaces nothing. It goes under the music, at the front of its system, as the selection ring does. A collision with a neighbour's accidental is accepted.
3. **Colour and stroke kept:** `#b23b3b`, 1.8 (DESK DEFAULT, as the brief says). The stroke does not need to match `RING_STROKE` (2). The two rings never show side by side, and when they share a box the selection ring covers the red (step 4).
4. **A selected crossing.** The two rings share one box, and the selection ring draws on top: the measured box is identical and the selection ring follows the crossing ring in document order.
   - **How it looks:** the lavender 2 px ring covers the red 1.8 px ring completely, so while the note is taken the crossing is not visible (`after-selected-zoom.png`).
   - Before this row the small red ring showed inside the lavender one (`before-selected-zoom.png`).
   - This is the brief's default; it is listed for Dann.
5. **Print.** The ring is an element of the page's SVG, not a screen-only overlay. It is visible under print media and appears in the PDF (`after-print-1.png`).
6. **Handle kept.** The ring carries `data-analysis="crossing"`. The loupe now renders its own measure through `renderAnalyzedStaff`, which draws no crossing at all, so the crossing cannot reach the loupe either way.
7. **The old rectangle and its widening are removed.** Nothing else needed the widening.
   - On the song, the system's viewBox is the same before and after.
   - On the demo fixture's approved SVGs, the only change is the deleted `<rect>` line, one in each of four files; no height moved.
8. **Pictures:** listed in "Pictures".
9. **Tests:** listed in "Tests".

## The changes

- `apps/web/src/lib/score/crossing-ring.ts` (new):
  - `crossingRingAttributes` (`:47`): the ring's attributes, with row 69's dash and `data-placeholder` on a placeholder.
  - `drawCrossingRings` (`:73`): clears and draws every ring under a page from `ringBox`.
  - `selectionAnchor` (`:98`): where the selection ring goes, past any crossing ring, so it draws on top.
- `apps/web/src/lib/markup/MarkupPane.svelte`:
  - `:387`: the selection ring inserts at `selectionAnchor`.
  - `:390-401`: a new effect draws the crossing rings with each page render, and again once the fonts are ready, since the box is measured from glyph ink.
- `apps/web/src/lib/score/system-ground.ts`: the crossing ring is named among the marks never read as ground, beside the selection ring and the held-measure rectangle.
- `packages/score-parser/src/staff-renderer.ts:3123-3124`: the fixed `rect` and its `lowestInk`/`highestInk` widening are replaced by a two-line pointer. The file is 3486 lines, and its ceiling in `scripts/ratchets.json` is lowered from 3494 to 3486, as that file asks.
- `packages/score-parser/src/index.ts`: exports `PLACEHOLDER_DASH` and its siblings, so the page dashes with row 69's value.
- `packages/score-parser/src/approval/__approved__/renderDemo{,Dotted}.{primitive,smufl}.svg`: regenerated. Each loses one line, the crossing `<rect>`.

## Tests

- **New, `apps/web/src/lib/score/crossing-ring.test.ts` (6):**
  - The ring is the box it is given, with the selection ring's corner, in `#b23b3b` at 1.8.
  - It keeps `data-analysis="crossing"`.
  - It is solid on a sung vowel and dashed with `data-placeholder` on a placeholder.
  - The selection ring stands past the crossing rings, at the front when there are none, and after the ground.
- **Changed in `packages/score-parser/src/staff-renderer.test.ts` (3).** Each asserted the renderer's own red rectangle, which this row removes by design:
  - "3. red squircle at the fR1/fo crossing (n6)" now asserts that the analysis marks n6 as crossing and the renderer draws no red ring;
  - the `data-analysis` census drops `crossing`;
  - the SMuFL case drops its `#b23b3b` line.
- **Removed from `placeholder-mark.test.ts` (2).** These were row 69's "dashes the crossing squircle" cases, one per glyph mode. The dash now lives on the page, and `crossing-ring.test.ts` checks it.
- **The live placement is measured, not unit-tested.** The unit suite has no layout engine, so the box itself is measured on the live page: the table in "Pictures".

## The eight gates

All pass.

1. `pnpm test:phonology`: 251 passed (251)
2. `pnpm test:dictionary`: 242 passed (242)
3. `pnpm --filter @ilya/web check`: 0 errors and 12 warnings in 5 files
4. `pnpm --filter @ilya/web test`: 2181 → **2187** passed (+6, `crossing-ring.test.ts`)
5. `pnpm --filter @ilya/score-parser test`: 665 → **663** passed, 5 skipped (668). That is −2: row 69's two renderer crossing-dash cases left with the rectangle. The three changed tests and the four regenerated approvals are counted in both totals.
6. `pnpm test:blurb`: 145 passed (145)
7. `pnpm test:integration`: 55 passed (55)
8. `pnpm ratchets`: OK, with the renderer's ceiling lowered to 3486.

## For Dann

1. **A taken crossing hides its red.** The two rings share one box, and the lavender ring covers the red.
   - Alternatives: draw the red over the lavender, or inset one ring by its stroke so both show.
   - The brief's default is built and shown in `after-selected-zoom.png`.
2. **Red stays red, at 1.8.** The colour carries "crossing"; your objection was to what the ring encloses.
3. **The ring now holds the turning notehead too.** In the box's column, the lavender turning head below the note sits inside the red ring (`after-zoom.png`). This follows from the box being the note's whole column, as the selection ring's is.

## Found, not fixed

- **Older ratchet slack.** `scripts/ratchets.json` could lower five more ceilings, for example `InsightsPane.svelte` from 1351 to 706. They are not this row's files, so I left them for the desk.

## Could not establish

- **A song with many crossings.** The tree's one engraved fixture has one crossing for these voices. Every crossing is drawn the same way, but a dense page was not seen.
- **Late font loading on a slow connection.** The ring is redrawn once `document.fonts.ready` resolves. A font that loads after that point would leave a box measured from the fallback face until the next render. This was not observed here.
- **A real print dialogue.** Print was checked with Chromium's print media and `page.pdf`, not a printer or Safari's dialogue.
