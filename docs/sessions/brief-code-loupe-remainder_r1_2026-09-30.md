# Brief for Code: the loupe's ruled remainder

Written by the desk 2026-09-30 11:25. Draft r1. Found by the audit of 2026-09-30 (`audit-briefs-A_r1_2026-09-30.md`, `../memory/QUEUE.md` row 10; rulings audit items A1 to A3). Every item below was ruled by Dann and never built. Re-read each cited `path:line` first; the tree has moved since.

## What to build

1. **The tween, Syllables to Corrections, both directions.** `../memory/OPEN.md` §"THE LOUPE'S TWO MODES", ruling 3, refining clause 14 (2026-09-18): notes and rests move while the carets fade in to 0.32; the perimeter moves on the same curve (about 220 ms in, 150 ms out); the mode toggle is locked during the tween; Escape, swipe, and the chevron stay live. Honour `prefers-reduced-motion`. It waited on N.149, which is closed. The audit found no tween (`Loupe.svelte:2738-2741` has only `loupe-rise`; carets are static at `:1764`).
2. **Meter run-in 1 stave space in the loupe only.** Same section, ruling 7. The page keeps 2 (`staff-renderer.ts:169`, `METER_RUN_IN_SP`); `loupe-render.ts:55-79` passes no override.
3. **The tie runs into the run-on with a tapered end**, as if it reached a note not shown. Same section, ruling 9. The tail panel draws only `<line>` elements today.
4. **One notation size per song, and a zoom.** `brief-code-calm-loupe_r1_2026-09-28.md`, the lines on clause 8 as amended by Dann 2026-09-28 01:34 and the zoom courtesy; your own report `report-code-calm-loupe_r1_2026-09-28.md` §4 item 2 has the plan (derive every measure's spacing once, on first raise or in idle time; lower the size until the ordinary measures fit). Zoom: − and + in the loupe bar beside Undo; the chosen zoom holds for the session and applies to every measure. **The zoom's `aria-label`s are ratified** (Dann 2026-09-30 11:17): "Zoom out" / « Réduire le zoom », "Zoom in" / « Agrandir le zoom ». Record clause 8's retraction and amendment in the comments that cite it.
5. **A bar left standing in a gap.** Your report §4 item 3: close the panel while the bar stands in a gap and no caret is drawn until the next arrow. DESK DEFAULT 2026-09-30: move it to the gap's anchor on close.

**Not in this brief:** cause 1c (the head caret re-raises the previous measure). Your report shows its clean fix is an entered note that knows its measure, which is Correction Station territory; it goes with slices 4 to 6 (`../memory/QUEUE.md` row 5).

## Prove it

- Gates at baseline or better, with counts; ratchets OK; if a ceiling must rise, report it and do not raise it.
- Screenshots or short recordings, desk and phone: the tween both ways; the meter at 1 sp in the loupe and 2 on the page; a tie into the run-on; the same song's narrowest and widest measures at one size; zoom − and +.

## Report

`report-code-loupe-remainder_r1_<date>.md`, with **What I could not establish**. NOT ESTABLISHED beats a complete invented answer.
