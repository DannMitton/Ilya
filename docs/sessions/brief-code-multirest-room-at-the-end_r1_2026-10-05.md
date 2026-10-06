# Brief: every multimeasure rest keeps the same room before its closing barline (r1, 2026-10-05)

Written by the desk (Opus) 2026-10-05 about 15:30. For the cloud lane, on Sonnet. QUEUE row 36.

## What the singer sees

Dann, 2026-10-05 15:16, on the Tchaikovsky song read on the alias (`0976735`): bar 1 is a run of 7 silent bars, and its H-bar ends with clear space before the barline. The last bar of the piece is a run of 6, and its H-bar runs almost into the closing barline. *"Can we adopt the spacing of m.1 for all multimeasure rests?"* Yes: every H-bar rest leaves the same room at its right end as bar 1's does, whatever barline closes it (single, double, final, or a system's end).

## Where it is drawn

`packages/score-parser/src/staff-renderer.ts`, "THE TACET MEASURES" (from about `:2468`). The right bound is `nextX - BARLINE_TO_COLUMN_PX - nextMeterRoom` inside a system and `contentRight` where the run ends the system (`:2490`); the H-bar is inset by `TACET_REST.barInsetSp` from each bound.

**Desk inference, not measured:** where the run ends the piece, `contentRight` may sit at or past the final barline's thin stroke, so the thick stroke eats the inset. Measure before you change anything: for the first and last runs of the Tchaikovsky reading, report the gap in staff spaces between the H-bar's right end and the nearest ink of the barline that closes it.

## Done when

The gap at the right end of every H-bar equals the gap at its left end, and equals bar 1's, within 0.1 staff space, on a system-ending run, a piece-ending run, and a mid-system run. A test pins all three. Report the eight gates and any number that moved. Commit to `cloud-lane` only; never `Shane` or `main`. Report: `docs/sessions/report-code-multirest-room-at-the-end_r1_2026-10-05.md`, with a section for what you could not establish. NOT ESTABLISHED beats a complete invented answer.

## Cost

Sonnet; 60,000 to 150,000 tokens, the desk's estimate.
