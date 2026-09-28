# Brief for Code: N.86, remove three dead items

**Desk brief r1, 2026-09-28.** Ruling: the section "Ruling" at the end of `docs/sessions/n86-dead-code_r1_2026-09-28.md`.

## What to do

1. Before anything, confirm each item is still unreferenced: `grep -rna` the whole tree (excluding `node_modules` and `.git`) for its file name and its exported names. Report the commands and their empty results. Stop on any hit.
2. Remove the three items with ordinary file deletion (no git command that writes; `git rm` is forbidden):
   - `apps/web/src/lib/score/TextualWitnesses.svelte`
   - `packages/score-parser/src/renderer-output.ts`, and its export from the package's index if it has one
   - `tools/e16-harness/_rhythm_spike/`, the whole folder
3. **Do not touch `apps/web/src/lib/score/reconciliation/`** (`CONTRACT.md` §6). If a tool (knip, a ratchet) then flags it as unused, report it and leave it; the desk will add an exemption.
4. Update `ARCHITECTURE.md` if it names any removed file.

## Done when

`pnpm test`, `pnpm ratchets`, `pnpm check` (0 errors), and Playwright 28 of 28 pass, and the report lists the line counts removed. List every deleted path in the report, so the desk can check the ship.
