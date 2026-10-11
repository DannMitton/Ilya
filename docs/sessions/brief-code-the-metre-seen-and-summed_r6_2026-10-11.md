# Brief for Code: the printed metre, round 6: wire the chosen reader and measure it on real editions (r6, 2026-10-11)

Written by the desk (Opus) 2026-10-11 about 04:25, after reading round 5's report whole (`report-code-the-metre-seen-and-summed_r4_2026-10-10.md`). **Revised about 04:40 after an independent review by Fable (four must-fix, six should-fix, three minor; all taken).** For Code on the Mac, Opus. QUEUE row 57. **r6 replaces r5's sections 3 to 5.** r2's sections 4 to 7 stand as amended by r4 and r5, except where this brief amends them (last section but one).

## What the singer sees

A singer drops a score. Where the page prints a time signature at the start of a bar, Ilya states that signature, and the bars that follow are read in it. Where Ilya is not sure, it states nothing new and reads on as it does today. A signature the page does not print is never stated.

## Why

Rounds 4 and 5 measured the reader two ways. **On real editions** (the 17 songs, each read by a model that never saw it), every variant stated 0 false signatures at 814 bar starts. **On renders of music fonts it never saw** (Finale Jazz, Legacy, Ash), the reader alone still misnames figures, 10 to 20 in 5,100; with witness 5 (the bars that follow must agree) the count is 0, SIMULATED.

**The residual risk, named.** Witness 5 on real pages rejected 15,392 of 15,494 wrong signatures of another length, but it accepted 681 of 834 of the same length, by construction (report section 3). Same-length families: C, 4/4, and cut C with 2/2; 2/4 and 4/8; 3/4 and 6/8; 3/2 and 6/4. On the 17 songs, 29 of the 32 printed places lie in such a family. One rendered false read was a same-length swap (Sebastian, cut C read C, report section 2). Section 1.5's guard and section 2.0's render stop close this.

**The desk dropped r5's render bar for the reader alone** (configuration 1 at or under 10, no font above 3), which was its own default. **This is the desk's choice of real editions over a proxy**, recorded in `docs/memory/OPEN.md`, "ROW 57 AFTER ROUND 5". It keeps one render stop, for same-length swaps (section 2.0).

## 1. What to build

1. **The reader is round 5's written choice: network A, nine readings, the checks, and witness 5** (report, sections 1 and 5). **Network B is not shipped.**
2. **Training and tuning never share a song.** Train network A on 13 of the 17 songs (plus all ten music fonts and the 16 text faces), and set the cut, centring tolerance, and check settings on the other 4, chosen by seed 57 and named in the report. Grechaninov contributes nothing either way.
3. **The checks that ship:** uncovered ink, and C against cut C. **Unfamiliar shape ships only if its feature reference and the penultimate-layer output fit within 200 KB beyond the model** (a DESK DEFAULT; round 5 measured it worth 1 false read in 5,100 renders and nothing on the songs). Say which shipped and their bytes.
4. **The model loads only when a signature window is read** (r4's amendment of r2 section 6), beside homr's models under `/omr/models/` if that is how onnxruntime-web loads it. Say where and why, and state the byte count of everything that ships (`CONTRACT.md` §6).
5. **The same-length guard.** A signature in a same-length family is stated only when, in all nine readings, its class beats its same-length rival by a margin set on the 4 tuning songs and the tuning renders (C against cut C included). Report the margin.
6. **Windows on the app's own page images.** Crops come from the image homr reads, scaled by homr's staff spacing, with no deskew. **DESK DEFAULT: place the windows from homr's own staves and bar boundaries**, voice staff only, under Dann's placement rule (r4, "Dann's design"). A courtesy window needs the staff's right end (r3 report, section 2); if homr gives none, say so and count set-asides in the console. If homr does not expose what the windows need, port your finder, and say which and why.
7. **Witness 5, with a bounded span.** A signature is stated only when at least two of the first four countable bars it governs are countable and every countable one among them sums to it. Past those four bars, today's rule stands. **The tuplet checks run again under each proposed signature before the sums** (r2 section 4's order). Before wiring, re-run `w5power.py` on round 5's data with the bounded span, and report the power and how many of the 7 rejected right signatures return.
8. **Then r2 section 4:** the join states the signature and the bars it governs; persistence until the next printed signature; courtesy signatures set aside; the console says where a proposal was rejected and why. No mark, flag, or word on the page or the Loupe.

## 2. Measure, in this order

0. **The render stop, before anything is wired.** Run round 5's fresh seeds (29000 + *f*) through the shipped network, checks, and guard (about three minutes). **Any same-length false signature stops the round.** Report other false reads by kind; they are witness 5's to catch.
1. **The 17 songs on the dev build through the drop box, before and after.** "Before" first, before any edit. The shipped network trained on 13 of them, so this set checks the wiring and the notes, not unseen reading. **A false signature here is a wiring fault: fix it, list each change, and carry on.** For each song: notes right, and the signature at each of the 32 printed places and every other bar start.
2. **Then finish the build:** tests, the two pictures, the gates. **Record a hash over `git diff` and the untracked files under `apps/`** (read-only git).
3. **Songs A, B, C, E, and F, once each, never opened.** For each, a script prints "stated S, agreeing M" against the truth at the bars where Ilya states a signature: by figure where the truth carries one, else by length, and the line says which. False is S minus M. **Any false signature stops the round here.**
4. **The six still-sealed songs, G, H, I, J, N, and O, once each, never opened**, by row 55's procedure and letter mapping (`brief-code-the-final-test_r2_2026-10-08.md`, "The run", steps 3 and 4; `measure-final-test_r1_2026-10-08/final-line.ts`), on the dev build, dropping only these six. K, L, M, and P are opened and not in this set. Each line carries row 55's counts and the "stated S, agreeing M" line beside them. The ten-minute refusal rule applies; report the reader's added seconds a song. **Rule agreed by Dann at 04:17: read once, report the lines, change nothing because of them.** The `keep` folder is never opened. **The report prints the hash from step 2 again after this step; only the report is written after it.**

**Done when:** 0 same-length false at step 0; 0 false signatures at steps 3 and 4; no song's notes lower after than before on the 17; r2 "Done when" as amended, including its metre-field conditions (no song lower, total above 666 of 721). Signature recall (right of 32 on the 17) is reported, not gated. Stop before the ship.

**Priority if time runs short:** steps 0 to 3 come first. If time runs out after step 3, the six stay unspent and the report says so.

## Constraints

- **Never open, read, list, view, or print anything whose name begins `heldout2`**, or any scan, truth, reading, or bar of songs A, B, C, E, F, or G to P; the scripts handle them.
- No git command that writes, including `add`, `commit`, `stash`, `checkout`, `restore`, `reset`, and `worktree`. To read old code, `git show <sha>:<path>`.
- Scratch in `~/Downloads/_code-metre-r6/`, never `/private/tmp`. Round 5's models and pool are in `~/Downloads/_code-metre-r5/`.
- Gate 4 is `2088` (`~/Downloads/ilya-ship.sh`); all eight gates, and say if a count moves.
- If the work would take more than about four hours on the Mac, stop and report the estimate first (a DESK DEFAULT).

## Earlier lines amended by this round

- r5 section 3, the render bar for configuration 1: dropped; replaced by section 2.0's same-length stop.
- r5 section 1.1, the 1.5 MB line for two networks: one network ships, about 0.7 MB, plus at most 200 KB for unfamiliar shape.
- r5 section 2.3, witness 5's span: bounded to the first four countable bars (section 1.7).
- r4 "r2 lines amended", "A, B, C, E, F once: struck for this round": restored for this round.

## Report back

`docs/sessions/report-code-the-metre-seen-and-summed_r5_2026-10-11.md`: the answer first; step 0's counts by kind; the bounded span's power and the returns; the 17's signature table, before and after; the lines for A to F and G to O; the hash before and after step 4; each change with its `path:line`; what shipped and its bytes; the tests and gates; and **Could not establish**. NOT ESTABLISHED beats a complete invented answer. `WRITTEN` on the code; `DONE` is Dann's look. Set QUEUE row 57 in one line ahead of its earlier state, say so in one line, and stop.
