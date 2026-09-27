> **r2, 2026-09-27, by the desk.** Citations re-checked against `f5d0dd4` after N.174 (eleven `+page.svelte` line numbers moved by one; the file and its ceiling are 6,224). N.174 already rewrote the `$lib/shane/` paths. Nothing else changed. The `audit` branch is merged, so the "run only after" condition below is met.

# Brief for Code: the audit's phase 4, first extraction from +page.svelte

**Desk brief r1, 2026-09-26. Shape: `BRIEF-TEMPLATE.md`.**
**Run only after the `audit` branch is merged into `Shane`.** This work relies on
the tests that branch adds.

## 1. What was observed

- `apps/web/src/routes/+page.svelte` is 6,224 lines at `f5d0dd4` (`wc -l`, run 2026-09-27; 6,225 at `b7c2fc6`,
  2026-09-26). Its script runs to line 4,369 (`</script>`).
- It is the top hotspot in the repository: 130 commits in six months, cyclomatic
  complexity 469 summed across its script (phase 0 hotspot table, a lead:
  `audit-2026-09-26/hotspots.csv`).

## 2. What is established, each line carrying its citation

Read in the `audit` clone at `1213fd1`, 2026-09-26; **line numbers re-read at `f5d0dd4`, 2026-09-27, each one line later**:

- `placeSyllableOnSelected` at `+page.svelte:710`; `selectedEventId` at `:785`;
  `setCursor` at `:835`; `undoStack` at `:963`; `redoStack` at `:975`;
  `pushUndo` at `:997`; `handleUndo` at `:1002`; `handleRedo` at `:1010`;
  `handleRest` at `:1242`; `handleTie` at `:1257`; `tupletOpen` at `:1332`.
- `scripts/ratchets.json` gives `+page.svelte` a ceiling of 6,224 lines (`scripts/ratchets.json:8`);
  `pnpm ratchets` fails if the file grows past it.
- Lead, not verified by the desk: the phase 0 anatomy
  (`audit-2026-09-26/page-anatomy.md`) calls lines about 639 to 1,502
  the **Correction Station** (cursor, undo and redo, pitch, duration, rest, tie,
  and tuplet editing) and ranks it the lowest-risk seam, because its hard logic
  already sits in `$lib/score/entry.ts`, `$lib/score/correction.ts`, and
  `CorrectionSurface.svelte`.

## 3. Measure before you change anything

1. Map the Correction Station yourself: which `$state`, `$derived`, and
   functions belong to it, and every place outside it that reads or writes them.
   Report the list before moving code.
2. Say which seam shape fits: a class with `$state` fields in a `.svelte.ts`
   module (the Svelte docs' recommendation for shared reactive state), context,
   or something else, and why.
3. Split the work into slices small enough that each one ships and is walked on
   its own. Undo and redo alone may be the first slice.

## 4. The rulings this serves

- Dann, 2026-09-26 00:21: *"The goal is to release stable code with a clear
  documented architecture that can be easily, predictably accessed by future
  collaborators."*
- Dann, 2026-09-26 00:25, option 3: the hotspot refactors are Code's, on his
  machine, where he walks each step (`../memory/CONTRACT.md` §5).
- `e52-fable-save-design_r1_2026-08-16.md:227`: `+page.svelte` "must shrink or
  hold, never grow".

## 5. Constraints

- **Behaviour does not change.** Not one pixel, word, or keystroke a singer
  sees. This is a move, not an improvement. If you find a bug, report it and
  leave it.
- Do not edit any file under an `__approved__/` directory, and never run
  `vitest -u`.
- Do not change `VocalLineEvent` or anything in
  `apps/web/src/lib/score/reconciliation/` (`../memory/CONTRACT.md` §6).
- No git command that writes (`../memory/CONTRACT.md` §5), including `stash`, `checkout`,
  `restore`, `worktree`. Take every "before" reading before the first edit; read old code
  with `git show <sha>:<path>`. Do not serve a second copy of the app beside the dev server
  (`../memory/ENVIRONMENT.md` §`A SECOND DEV SERVER REWRITES THE VITE CACHE`).
- The desk compares the 84 screenshots after each slice (`../memory/ENVIRONMENT.md`
  §`SCREENSHOT COMPARE`); leave the slice uncommitted until it has.
- **Displaces:** nothing scheduled. Feature work continues beside the audit by
  Dann's ruling of 2026-09-26 00:31. While a slice is open, no feature work
  touches the Correction Station.

## 6. Done when, for each slice

- `pnpm test` passes, with every approval file unchanged.
- `pnpm ratchets` passes, and the `+page.svelte` ceiling in
  `scripts/ratchets.json` is lowered to the new line count in the same change.
- In `apps/web`: `pnpm check` shows 0 errors, and
  `pnpm exec playwright test --project=chromium` passes 28 of 28.
- The new module has its own unit tests for undo and redo at least.
- `WRITTEN` on the code. `DONE` is Dann's walk: open a score, select a note,
  change its pitch, undo, redo, add a rest, tie two notes.

## 7. Report back

The commit, `+page.svelte`'s line count before and after, the results against
section 6, and what could not be established. **NOT ESTABLISHED beats a complete
invented answer.**
