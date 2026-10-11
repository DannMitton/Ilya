# Brief for Code: the printed metre, round 6, runs 1 and 2 (QUEUE row 57, 2026-10-11)

Written by the desk (Opus) 2026-10-11 about 04:50. For Code on the Mac, Opus. Branch `Shane`, HEAD `9ad4082`; the only change in the tree is the desk's `docs/memory/STATE.md`.

## Read first, whole

1. `docs/sessions/brief-code-the-metre-seen-and-summed_r6_2026-10-11.md` (r6). Its sections 1 and 2, its constraints, and its amendments stand.
2. Your own estimate, `docs/sessions/report-code-the-metre-seen-and-summed_r5_2026-10-11.md`, and its proposed split into four runs.
3. `docs/memory/OPEN.md`, the paragraph "ROW 57 r6 SPLIT INTO FOUR RUNS" (about line 2946). The desk took your split as its DESK DEFAULT there.

## What changes from r6

- **This brief runs r6 as your runs 1 and 2, back to back, and stops at the end of run 2.** Runs 3 and 4 get their own brief after the desk reads your reports.
- **r6's four-hour stop is replaced, for these two runs, by the stops written here** (DESK DEFAULT: the estimate is known, and the split keeps each run near four hours).
- **Dann is asleep while you work.** No question reaches him. Where this brief or r6 says stop, write the report and stop. Where a choice is reversible and the briefs do not settle it, decide, mark it DESK DEFAULT in the report, and carry on.
- **Reports:** `docs/sessions/report-code-the-metre-seen-and-summed_r6-run1_2026-10-11.md` and `..._r6-run2_2026-10-11.md`. The r5 report file stays as the estimate.

## Before anything: what is already running

Dann has ended up with several dev servers before (`CONTRACT.md`, posture paragraph of 2026-10-05, rule 3). Check what already listens, for example with `lsof -nP -iTCP -sTCP:LISTEN`. If an Ilya dev server on this tree is running, use it. Start at most one. Stop any server you started when you stop. The run-1 report says what was running before you began and after you finished.

## Run 1: Python only. Nothing in `apps/` changes

1. **The "before" read of the 17 songs through the drop box on the dev build at `9ad4082`, first, before any other step** (r6 section 2.1, its "before" half). Keep the reads under `~/Downloads/_code-metre-r6/before/`.
2. **Split the 17 songs 13 and 4 by seed 57**, name the 4, and train network A once on the 13 plus the ten music fonts and the 16 text faces (r6 section 1.2). Round 5's models and pool are in `~/Downloads/_code-metre-r5/`.
3. **Set the cut, the centring tolerance, and the check settings on the 4** (r6 sections 1.2 and 1.3). Measure whether unfamiliar shape fits within 200 KB beyond the model (section 1.3) and say so.
4. **Set the same-length margin** (r6 section 1.5) and report it.
5. **Step 0, the render stop** (r6 section 2.0), on seeds 29000 + *f*. **Any same-length false signature stops here: write the run-1 report and do not start run 2.** Report every other false read by kind.
6. **Re-run `w5power.py` with the bounded span** (r6 section 1.7): the power, and how many of the 7 rejected right signatures return.

Write the run-1 report: the answer first; the 17's "before" table; the 4 tuning songs by name; the settings; step 0's counts by kind; the bounded span's power and returns; **Could not establish**.

## Run 2: the reader in TypeScript. Only if step 0 found 0 same-length false

As your estimate's run 2 describes it:

1. Port the reader (`decode5.py`, `reading5.py`, `checks5.py`): the crop cutter matching `grid_sample`, the nine readings, peaks, grouping, the statement rule, the shipped checks, and the same-length guard.
2. Windows from homr's staff boxes (`third_party/homr-web/src/result.ts:25-31`), voice staff only, under Dann's placement rule (r4, "Dann's design"). Port the bar-line finder from round 4's `staff.py` for windows after a mid-system bar line, and for the five lines inside each window.
3. The model loads only when a signature window is read, under `/omr/models/` (r6 section 1.4). `onnxruntime-web` `1.30.0` becomes the app's own dependency, pinned to homr-web's version so `/omr/ort/` serves both (DESK DEFAULT, `OPEN.md`). State the byte count of everything that would ship.
4. **Parity with the Python reader, window by window, on the 17 songs' windows** (not the renders). Report agreement, and every window that disagrees.
5. **Nothing reads from the port yet.** The join (`join-pages.ts`, `triplets.ts`) is run 3's and is not touched.
6. Run all eight gates at the end and say whether any count moves. Record a hash over `git diff` and the untracked files under `apps/` (read-only git).

Write the run-2 report: the answer first; parity; each change with its `path:line`; bytes; tests and gates; the hash; **Could not establish**. Then stop. Do not start run 3.

## Constraints, all from r6 and still binding

- **No sealed or unseen song is read in these runs.** Songs A, B, C, E, F and G to P are not run. Never open, read, list, view, or print anything whose name begins `heldout2`.
- No git command that writes, including `add`, `commit`, `stash`, `checkout`, `restore`, `reset`, and `worktree`. To read old code, `git show <sha>:<path>`.
- Scratch in `~/Downloads/_code-metre-r6/`, never `/private/tmp`.
- Gate 4 is `2088` (`~/Downloads/ilya-ship.sh`).
- **NOT ESTABLISHED beats a complete invented answer.**
- At the end of each run, set QUEUE row 57 in one line ahead of its earlier state.
