# Brief for Code: the printed metre, round 6, runs 3 and 4 (QUEUE row 57, 2026-10-11)

Written by the desk (Opus) 2026-10-11 about 13:30, after reading the run 1 and run 2 reports whole. For Code on the Mac, Opus. Branch `Shane`, at or after `8cc6202`; runs 1 and 2 shipped in `4bc9bcd`.

## Read first, whole

1. `brief-code-the-metre-seen-and-summed_r6_2026-10-11.md` (r6): sections 1.7, 1.8, 2.1 (after), 2.2 to 2.4, the constraints, and "Done when".
2. `report-code-the-metre-seen-and-summed_r6-run1_2026-10-11.md` and `..._r6-run2_2026-10-11.md`.
3. `docs/memory/OPEN.md`, "ROW 57 r6 SPLIT INTO FOUR RUNS".

## The desk's rulings on the run reports (DESK DEFAULTS)

1. **The bounded span's one-bar cost is accepted for this round.** Run 1 found that the rule (at least two of the first four countable bars) rejects 7 right one-bar changes on the 16 songs, against 0 of 15,307 wrong proposals of another length accepted. A false signature is worse than a missed one (`OPEN.md`, the reader's principle that it states nothing the page does not print). **Exception, to build:** a one-bar change whose next bar is a printed return to the metre before it (as in Kabalevsky no. 6, bars 20 to 22) is stated when that one bar sums to it. Report how many of the 7 return and whether any false proposal passes under the exception; if any does, drop the exception and say so.
2. **The reader runs off the page's thread.** Run 2 measured 8.6 to 33.8 s a song in the page's thread. Use onnxruntime's proxy worker (`env.wasm.proxy`) or a Worker of your own; report the added seconds a song in the drop box.
3. **The 45 extra bar windows stay**, under the same checks and witness 5. Report how many state anything on A to F and G to O.
4. **Kabalevsky no. 7, bar 1**: trace why both readers miss it, report, and fix only if the fix is general.

## Run 3: the join and the 17

As r6 sections 1.7 and 1.8 and your estimate's run 3: witness 5 over the bounded span with the exception above; the tuplet checks run again under each proposed signature before the sums (`triplets.ts`, `completeTriplets`, under each proposal, not once a bar); persistence to the next printed signature; courtesy signatures set aside; the console says where a proposal was rejected and why; no mark on the page or the Loupe. Then the 17 "after" through the drop box (r6 2.1), the two pictures, tests, all eight gates, and the hash over `git diff` and the untracked files under `apps/` (read-only git). **A false signature on the 17 is a wiring fault: fix it, list each change.** No song's notes lower after than before.

## Run 4: the unseen songs, once

As r6 sections 2.3 and 2.4, unchanged: A, B, C, E, and F once each, never opened; **any false signature stops the round there.** Then the six still sealed, G, H, I, J, N, and O, once each, never opened, by row 55's procedure, read once and nothing changed because of them (Dann, 04:17). Print the hash again after run 4; only the report is written after it.

## Constraints

r6's, unchanged: never open, read, list, view, or print anything whose name begins `heldout2`; no git command that writes; scratch in `~/Downloads/_code-metre-r6/`; check what is already running before starting a dev server, start at most one, stop it when you stop. Gate 4 is `2167` (`~/Downloads/ilya-ship.sh`), unless the cloud lane's rows 69 and 34 have merged first; read the script. **Dann may be away: decide what is reversible, mark it DESK DEFAULT, and stop only where this brief or r6 says stop.** NOT ESTABLISHED beats a complete invented answer.

## Report

`report-code-the-metre-seen-and-summed_r6-run3_2026-10-11.md` and `..._r6-run4_...`, as r6's "Report back" lists. Set QUEUE row 57 in one line at the end of each run. Stop the ship to Dann.
