# Report: Code, N.194 r5, step 0 (make room), 2026-10-26

Lane `cloud-lane-15`, cut from `origin/Shane` at `54c01bc3` and pushed with `-u`. Nothing was pushed to `Shane` or `main`, and no pull request was opened. Brief: `docs/sessions/brief-code-n194-loupe-break-button_r5_2026-10-25.md` (r5, with the 2026-10-26 addendum), its two companion files, `report-code-batch-c-b3_r1_2026-10-21.md`, and `report-code-n198_r1_2026-10-26.md`, all read in full. Fresh clone, working tree clean at the start, `pnpm install --frozen-lockfile` run in the sandbox. Nothing under `docs/memory/` was edited, the brief and its companions were not edited, and no approval was re-approved.

## What I changed

- New `apps/web/src/lib/score/undo-wiring.svelte.ts` (34 lines): `createUndoHistory(doc, cursor)`, the `UndoHistory` construction lifted out of the page, the same six fields read and the same six writes in the same order (`doc.corrections`, `doc.pairings`, `doc.seatedText`, then the three cursor fields).
- `apps/web/src/routes/+page.svelte`: the 19-line `new UndoHistory(...)` block (formerly `:848-864`) is now one line, `const undoHistory = createUndoHistory(() => doc, stationCursor);` (`:849`), and the import at `:196` is split into `stackLabel` and the new `createUndoHistory` (`:197`). The destructure `const { push: pushUndo, undo: handleUndo, redo: handleRedo } = undoHistory;` is untouched.

Two variations from the brief's DESK DEFAULT, which says "Code's to vary":

1. `doc` is passed as a getter, `() => doc`, not a value. The page declares `let doc = $state(...)` (`+page.svelte:256`) and reassigns it in `switchSong` (`:3174` before the move), so a value would capture the outgoing song's document.
2. `handleInput` is NOT passed yet. Step 0 is a move; an unused parameter would be dead code. Step 4 adds it with the `inputText` option, when something reads it.

The page reads `selectedEventId` and `gapAfter` through `$derived` copies of the cursor (`:781-782`). The wiring reads the cursor's own `selectedEventId` and `gapAfter` fields, which is what those deriveds return, so the snapshot is the same.

## Ceilings and lengths, before step 1

Ceilings that exist (`scripts/ratchets.json`): `+page.svelte` 5597, `pipeline.ts` 925, `Loupe.svelte` 3013. `LoupeSyllables.svelte` and `LoupePlacementRow.svelte` have none, so the 1000-line limit for a file without one applies.

| file | lines before | lines after step 0 | ceiling |
|---|---|---|---|
| `apps/web/src/routes/+page.svelte` | 5597 | **5581** | 5597 |
| `apps/web/src/lib/pipeline.ts` | 925 | 925 | 925 (no headroom, untouched) |
| `apps/web/src/lib/score/Loupe.svelte` | 3012 | 3012 | 3013 |
| `apps/web/src/lib/score/LoupeSyllables.svelte` | 316 | 316 | none |
| `apps/web/src/lib/score/LoupePlacementRow.svelte` | 95 | 95 | none |
| `apps/web/src/lib/score/undo-wiring.svelte.ts` (new) | n/a | 34 | none |

I did not lower the `+page.svelte` ceiling in this commit. It stays at 5597 so steps 2 to 4 have 16 lines of wiring room; the last step's commit lowers it to the file's final length. A ceiling is never raised. `pipeline.ts` has no headroom, and step 0 does not need to move anything out of it: steps 2 and 3 are told to put their logic in `boundaries.ts` or new modules, and I decide there whether a block must move first.

## Tests added

None. The move is covered by the existing suite (`undo-history.test.ts` builds the class directly and does not touch the factory; the page has no mount test). **I cannot prove the factory by a test that mounts the page.** Gate 3 (type check) and gate 4 (3057) passing is the evidence, and the six fields and six writes were compared by eye against the lines they replaced.

## The eight gates

Baselines are the figures in the task, measured here on `Shane` at `54c01bc3` before any edit. I could not read the ship script (it is not reachable from the cloud lane), so these are the task's numbers, and my own run matched all eight.

| gate | command | baseline | after step 0 |
|---|---|---|---|
| 1 | `pnpm test:phonology` | 291 passed (291) | 291 passed (291) |
| 2 | `pnpm test:dictionary` | 248 passed (248) | 248 passed (248) |
| 3 | `pnpm --filter @ilya/web check` | found 0 errors and 12 warnings in 5 files | found 0 errors and 12 warnings in 5 files |
| 4 | `pnpm --filter @ilya/web test` | 3057 passed (3057) | 3057 passed (3057) |
| 5 | `pnpm --filter @ilya/score-parser test` | 775 passed \| 5 skipped (780) | 775 passed \| 5 skipped (780) |
| 6 | `pnpm test:blurb` | 145 passed (145) | 145 passed (145) |
| 7 | `pnpm test:integration` | 55 passed (55) | 55 passed (55) |
| 8 | `pnpm ratchets` | ratchets: OK. | ratchets: OK. |

Gate 8 prints "these ceilings can be lowered" for `LearnContent.svelte` (4099 to 4086), `InsightsPane.svelte` (1351 to 760), `Loupe.svelte` (3013 to 3012), and now `+page.svelte` (5597 to 5581). The first three are not mine and I changed none of them.

## Cites that moved since the brief

The brief's `UndoHistory` block at `+page.svelte:847-864` (destructure `:865`) stood at `:848-865` (destructure `:866`) at `54c01bc3`. The brief's `handleInput` (`:2376-2380`) stands at `:2378-2382`. The `UndoHistory` import was `:196`. Every later cite will be re-located by name before I edit.

## What I could not establish

- Whether the factory behaves identically under a mounted page: NOT RUN (no mount test exists for the page).
- The ship script's gate lines: NOT READ (unreachable from the cloud lane). The baselines are the task's.
- Everything the brief lists as not established for later steps is still open; I report each in the step that closes it.

## Strings owed to Dann

None. Step 0 adds no string.
