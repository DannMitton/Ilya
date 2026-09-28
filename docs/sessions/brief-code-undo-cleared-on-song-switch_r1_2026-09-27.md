# Brief for Code: Undo must not cross a song switch

**Desk brief r1, 2026-09-27, at `9fa49b7`. Shape: `BRIEF-TEMPLATE.md`.**

## 1. What was observed

Code reported it at the close of cut 1 slice 1 (`code-audit-correction-station-map_r1_2026-09-27.md`, and its report to Dann): after a song switch, Undo may write the previous song's corrections into the song now open, which then autosaves. **Found by reading. Not reproduced by anyone.**

## 2. What is established, each line carrying its `path:line`

Read by the desk at `9fa49b7`, 2026-09-27:

- `switchSong` is at `apps/web/src/routes/+page.svelte:3699`. It calls `resetSessionState()` and resets several fields; nothing in it touches `undoHistory`.
- `undoHistory` is constructed at `+page.svelte:921`; its write callback assigns `doc.corrections`, `doc.pairings` and `doc.seatedText` on whatever `doc` is current.
- `UndoHistory` in `apps/web/src/lib/score/undo-history.svelte.ts` has `push`, `undo` and `redo`, and no method that empties both stacks (grep for `clear` returns nothing).
- New song (`+page.svelte:3753`), delete of the open song (`:3807`), the library's open (`:3826`) and the recognize prompt (`:3218`) all go through `switchSong`.

## 3. Measure before you change anything

1. Reproduce it: two songs, a pitch correction in song A, switch to song B, Undo. Say what song B's stored corrections hold before and after. If it does not reproduce, stop and report.
2. Say whether any other path replaces `doc` without going through `switchSong`.

## 4. The rulings this serves

- `CONTRACT.md` §6: do not add a second silent save site while N.27 is open. The fix adds none; it only empties an in-memory stack.
- The desk's placement, DESK DEFAULT 2026-09-27: this ships between slice 1 and slice 2, because it can damage a singer's stored song.

## 5. Constraints

- Only the song switch empties the stacks. Clear, a text edit, and a reload are out of scope.
- No other behaviour changes. Constraints of `brief-code-audit-correction-station_r2_2026-09-27.md` §5 apply (no git writes, no approval files, no `vitest -u`, no second dev server).
- **Displaces:** slice 2 of the Correction Station moves back by this one change.

## 6. Done when

- A test in `undo-history.test.ts` for the emptying method, and a test or a documented browser step showing Undo after a switch does nothing.
- `pnpm test`, `pnpm ratchets` (lower the `+page.svelte` ceiling if the file shrinks; it must not grow past 6,135 unless you say why), `pnpm check` 0 errors, Playwright 28 of 28.
- `WRITTEN` on the code. `DONE` is Dann's walk.

## 7. Report back

The commit is Dann's. Report the reproduction result, the change, the test count (gate 4 is 1547), line counts, and what could not be established. **NOT ESTABLISHED beats a complete invented answer.**
