# Report: every multimeasure rest keeps the same room before its closing barline (r1)

**QUEUE row 36, state: WRITTEN, pushed to `cloud-lane`. DONE is Dann's look on a real reading.** The desk carries this line into `QUEUE.md`; this session does not edit `docs/memory/`.

Written by Code (cloud lane) 2026-10-11, for `docs/sessions/brief-code-multirest-room-at-the-end_r1_2026-10-05.md`, on `cloud-lane` after row 66 (`88529f83`), clean tree before the first edit. One commit on `cloud-lane`; nothing pushed to `Shane` or `main`, no pull request.

## What was wrong, measured

The desk's inference holds. The H-bar is inset `TACET_REST.barInsetSp` (1.25 stave-spaces) from each bound. The left bound and a mid-system right bound are the **centre** of the barline beside the rest. Where the run ends the system, the right bound was `contentRight`, the stave's **outer edge** (`staff-renderer.ts`, "THE TACET MEASURES"), while the closing barline is drawn inside that edge:

- a single barline's centre stands half a thin stroke inside it, so the rest lost half a stroke of air;
- the final thin-plus-thick barline (Gould r96) puts its thin stroke a thick stroke plus half a stave-space inside it, so the rest lost about 0.66 stave-spaces in the primitive drawing, and more in a face whose thick stroke is heavier.

Measured on the demo score's render (primitive drawing, `lineGap` 10 px; the gap is from the H-bar's end to the nearest ink of the barline beside it, in stave-spaces):

| Run | Left gap, before | Right gap, before | Left gap, after | Right gap, after |
|---|---|---|---|---|
| Inside the system (bars 2 to 3) | 1.20 | 1.20 | 1.20 | 1.20 |
| Ending the system, single barline (bars 4 to 5) | 1.20 | 1.15 | 1.20 | 1.20 |
| Ending the piece, final barline (bars 4 to 5) | 1.20 | **0.54** | 1.20 | **1.20** |

## The change

- `packages/score-parser/src/barline-geometry.ts` (new): `closingBarlineStrokeX`, the centre of the stroke a system's closing barline draws nearest the music: the single thin line, or the thin line of the final pair. Its arithmetic is the end barline's own.
- `staff-renderer.ts`, "THE TACET MEASURES": where a run ends the system, its right bound is `closingBarlineStrokeX(...)`, not `contentRight`. Every bound is now the centre of the nearest stroke, so the inset leaves the same air at both ends whatever closes the run. A single-bar whole rest is centred in the same bounds.
- `staff-renderer.test.ts`: a new `describe` with three tests: the mid-system run, the system-ending run, and the piece-ending run each keep both gaps within 0.1 stave-space of bar 1's left gap; the piece-ending gap is more than one stave-space. The piece-ending test fails on the old code (0.54).
- `scripts/ratchets.json`: `staff-renderer.ts`'s ceiling rises **on purpose** from 3,493 to 3,494. The file stood exactly at its ceiling, and the fix needs one line, its import; the helper itself lives in the new module. The commit message says so, as the ratchet file asks.

## The eight gates

| # | Gate | Before (row 66) | After row 36 |
|---|---|---|---|
| 1 | `pnpm test:phonology` | 251 passed (251) | 251 passed (251) |
| 2 | `pnpm test:dictionary` | 235 passed (235) | 235 passed (235) |
| 3 | `pnpm --filter @ilya/web check` | 0 errors and 12 warnings in 5 files | same |
| 4 | `pnpm --filter @ilya/web test` | 2125 passed (2125) | 2125 passed (2125) |
| 5 | `pnpm --filter @ilya/score-parser test` | 650 passed, 5 skipped (655) | **653 passed, 5 skipped (658)** |
| 6 | `pnpm test:blurb` | 145 passed (145) | 145 passed (145) |
| 7 | `pnpm test:integration` | 55 passed (55) | 55 passed (55) |
| 8 | `pnpm ratchets` | OK | OK, with the ceiling raised by one line |

Gate 5 moved by +3, the three new tests.

## Could not establish

- **The Tchaikovsky reading itself.** It lives in Dann's library on the alias (`0976735`); this session has no copy. The brief's measurement on its first and last runs is NOT ESTABLISHED; the demo score stands in, and its numbers are the table's.
- **The numbers in Finale Maestro.** The table is the primitive drawing. With a loaded face the bounds are the same strokes, so the gaps are equal by construction, but the face's own gap in stave-spaces was not measured in a browser.
- **A run that opens a system.** Its left bound is the head's last symbol, not a barline, as built; the brief's three cases do not include it, and it was not changed.
