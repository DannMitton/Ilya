# Brief for Code: N.86's remainder, the dead notation-only overlay (r1, 2026-10-12)

Written by the desk (Opus) 2026-10-12 about 01:47. QUEUE row 84, N.86 (`docs/memory/SCHEDULE.md`, week 5). For the cloud lane, Sonnet, after row 83. Fable reviews this brief before Code gets it (`docs/memory/CONTRACT.md`, the paragraph of 2026-10-11 22:36).

## 1. What was observed

- `SCHEDULE.md` week 5 lists N.86's open candidates from the code audit of 2026-09-24: `notation-overlay.ts`, `optimalRegion`, the font lab route, and the `wall.ts` ruling (the line beginning "[CHECKED 2026-10-11 19:40 against git log").

## 2. What is established, each line carrying its `path:line`

Read by the desk 2026-10-12:

- `apps/web/src/lib/analysis/notation-overlay.ts:1-27`: `notationOnlyOverlay`, a stand-in for `analyzeScore` with no acoustic marks, "Replaced by a real `analyzeScore()` call when the two named follow-ups land".
- `apps/web/src/lib/markup/MarkupPane.svelte:535-536`: "This replaces notationOnlyOverlay"; `:721` calls `analyzeScore`.
- A search of `apps/` and `packages/` finds `notationOnlyOverlay` imported only by `apps/web/src/lib/analysis/notation-overlay.test.ts:11`.
- Two comments still send the reader to the removed helper: `MarkupPane.svelte:123-125` ("see notation-overlay.ts for why that is the engine's own semantics") and `:963-964` ("no acoustic marks; see notation-overlay.ts").

## 3. Measure before you change anything

1. Confirm with a search that nothing outside its own test imports `notation-overlay`.
2. Read `MarkupPane.svelte:118-130` and `:955-970` and say what the page renders today, so the two comments can be rewritten to the truth.

## 4. The rulings this serves

- N.86, the dead-code audit (`SCHEDULE.md`, week 5).
- The 2026-07-13 slice-1 scope ruling the helper carried ("notation first") is superseded in the tree by `MarkupPane.svelte:535-536`; its reasoning (an empty events map draws the plain vocal line, which is the engine's own semantics) moves into the comment at `:535` if it is not already there.

## 5. Constraints

- Remove `apps/web/src/lib/analysis/notation-overlay.ts` and `notation-overlay.test.ts`. Rewrite the two comments in `MarkupPane.svelte` to say what the page does now, keeping the one sentence of reasoning from the helper's header that still holds.
- **Kept, DESK DEFAULT, do not touch:** `optimalRegion` (`packages/score-parser/src/tessitura.ts:196-215`, exported at `packages/score-parser/src/index.ts:182`). It is unused, but it is twenty tested lines encoding a cited idea (Pacheco, p. 559, the intersection of a repertoire's tessituras) that a library-wide view can use. **Kept:** the font lab route `apps/web/src/routes/notation-font-lab/`, a working dev tool; whether it ships publicly is part of the `wall.ts` question Dann owes, which this row does not touch.
- No other file changes. Gate 4 falls by the removed test's count; report it.
- **Displaces:** nothing.

## 6. Done when

- No file in the tree names `notation-overlay` or `notationOnlyOverlay` except history in `docs/`.
- All eight gates pass; gate 4's new count is reported with the number of tests removed.
- `WRITTEN` on the code. Nothing for Dann to walk; the page is unchanged.

## 7. Report back

`docs/sessions/report-code-n86-notation-overlay_r1_2026-10-12.md`: the commit, section 6's results, the two rewritten comments quoted, and **Could not establish**. NOT ESTABLISHED beats a complete invented answer.
