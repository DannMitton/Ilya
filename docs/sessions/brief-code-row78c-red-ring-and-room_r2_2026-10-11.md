# Brief for Code: row 78c, the red ring outside the selection ring, and the room for it (r2, 2026-10-11)

QUEUE row 78c. For the cloud lane, Opus (it reasons about layout, system height, and pagination), after 78b. Written by the desk (Opus) 2026-10-11 about 19:55 as row 78 r1; split into three by the desk at about 23:05 on Fable's review (`docs/sessions/review-fable-briefs-78-80_r1_2026-10-11.md`), with its amendments applied. Rulings: `docs/memory/OPEN.md`, from "ROW 69's FRENCH AND THE WORD \"SUNG\"" to "`insights.r2.cycles` RATIFIED", 2026-10-11 19:42 to 21:52, and `docs/memory/PRODUCT.md`'s last sections. On `cloud-lane` (row 69 and row 34 are there, not yet in `Shane`). Citations read on `cloud-lane` at `b8b07f8`.

## 1. What was observed

Row 69's report (`report-code-placeholder-vowels-labelled_r1_2026-10-11.md`, "For Dann") and row 34's (`report-code-markup-crossing-squircle_r1_2026-10-11.md`), and Dann's walk of the alias at `8e74f39` on 2026-10-11 from 20:23. Dann's rulings on what he saw are in the files named above.

## 2. What is established, each with its `path:line` (read on `cloud-lane` at `b8b07f8`)

- `apps/web/src/lib/i18n.ts:1793-1794`: `placeholder.line.many` and `.one`; a comment above them says the French singular is DESK-DERIVED.
- `i18n.ts:1798-1800`: `placeholder.comment`, `placeholder.turns.one`, `.many`, under a PROPOSED comment.
- `i18n.ts:1834-1838`: `comment.working.where.above` and `.under` (with "sung" / « chanté »), and the two `…Placeholder` variants without it.
- Row 69's report names the code that chooses between them: `comment-text.ts:295-296`, `:341`, `:446-450`; `InsightsPane.svelte:233`; and the test in `comments.test.ts`.
- Every calibration reading is taken in fry: `i18n.ts:1168`, `calib.welcome.fryAnswer`.

## 3. The work

1. **The red crossing ring stands outside the selection ring, always** (Dann 20:11 to 20:12, `OPEN.md`, "THE RED CROSSING RING STANDS OUTSIDE THE SELECTION RING"). In `apps/web/src/lib/score/crossing-ring.ts`, grow the box `ringBox` returns by `RING_STROKE` plus a gap of `RING_STROKE` on every side before drawing the red ring; the outer ring's corner radius is `RING_RADIUS` plus the offset (6 + 4 = 10), so the two rings are concentric at the corners (DESK DEFAULT; `crossing-ring.ts:55` sets `rx` today to `RING_RADIUS`). The selection ring is unchanged. Measure on the live page: the red ring's box inside the system's viewBox on every crossing of *Without Sun*, no. 1 and of the Tchaikovsky song (`ringBox` clamps its top to the viewBox plus half a stroke, `selection-ring.ts:388-393`, and the renderer's headroom is one staff space above the highest ink, `staff-renderer.ts:3482`; widen the headroom in the renderer, the `top` term at `:3482`, for a system that holds a crossing, not by patching the viewBox in the page, so print and screen agree and `paginateScore` sees the new height; say by how much); and one picture each of a crossing unselected and selected, desktop and phone, both rings visible when selected. Update `crossing-ring.test.ts`.  *(r1 item 9)*
2. **The notes make room for the red ring** (Dann 20:14, `OPEN.md`, same heading as item 1). The renderer knows which events cross before layout (`AnalyzedEvent.crossing`, `packages/score-parser/src/analysis-types.ts:196`). `columnAdvance` (`staff-renderer.ts:1562`) receives `ColumnInk` (left, right, turningDisplaced; `:1461-1468`), not the event, but `columnInk` (`:1500-1504`) already receives the `AnalyzedEvent`, so `a.crossing` is known there. Carry the ring's reach (item 1's margin, plus the ring's own padding beyond the ink as `ringBox` draws it, plus half its stroke) as a field on `ColumnInk` and add it in `columnAdvance`'s ink term (`:1598-1603`) AND its text term (`:1577-1583`): the ring encloses the IPA syllable (`ringBox` reads `[data-ipa-of]`, `selection-ring.ts:310-317`), so where the IPA is wider than the head the reach is measured from the syllable's edge. A barline counts as neighbouring ink: where a crossing opens or closes a measure, `BARLINE_ROOM` grows by the same reach. Share the numbers from one place rather than copying them: if `ringBox`'s padding lives only in `apps/web/src/lib/score/selection-ring.ts`, move the constants to `@ilya/score-parser` and import them in both. Widen the system's headroom in the renderer as item 1 says. Nothing changes for a song with no crossing (`packages/score-parser/src/approval/__approved__/renderDemo*.svg`, six files, `staff-renderer.approval.test.ts`, stay byte for byte where the fixture has no crossing; say which of the six have one). Measure on the live page: on every crossing of *Without Sun*, no. 1 and the Tchaikovsky song, the gap between the red ring and the nearest neighbouring ink, before and after; the line count per page before and after. Same pictures as item 1.  *(r1 item 10)*

## 4. The rulings this serves

Dann 2026-10-11 19:42 to 22:00, quoted in `OPEN.md` and `PRODUCT.md` at the headings each item names. Dann 2026-10-11 12:36 to 12:42, "STAND-INS ARE LABELLED", `OPEN.md`.

## 5. Constraints

Write no French that is not in this brief; use U+2019 apostrophes as given. Do not touch `tools/e16-harness/`, `third_party/homr-web/`, `apps/web/src/lib/omr/` (row 80 is measuring there on the Mac), or `docs/memory/` beyond this row's State. Other uses of "sung" in `i18n.ts` (for example `calib.roster.oNoteAria`, about the vowel as sung in Russian) are not in scope. **Displaces:** nothing.

## 6. Done when

The pictures in items 1 and 2, plus the before and after line counts per page and the gap table. Row 79 takes its before measurements only after this row is merged into the lane. The eight gates pass, with gate 4's and gate 5's counts and their moving tests named. `WRITTEN`; DONE is Dann's walk after the merge.

## 7. Report back

`docs/sessions/report-code-row78c_r1_2026-10-11.md`: what changed, with `path:line`; the pictures; the gates; and **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Commit and push `cloud-lane` only (Dann's amendment of 2026-10-02 02:37, `CONTRACT.md` §5; it overrides `AGENTS.md`'s "no agent commits" for this lane only). Set row 78c's State and stop.
