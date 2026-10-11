# Report: the printed metre, round 6: stopped at the estimate (QUEUE row 57)

Code (Opus), 2026-10-11, on the Mac, branch `Shane`, HEAD `a7161ce`, working tree holding the desk's uncommitted `docs/` changes. Brief: `brief-code-the-metre-seen-and-summed_r6_2026-10-11.md`, read whole, then round 5's report (`report-code-the-metre-seen-and-summed_r4_2026-10-10.md`), r2, r4, and r5. No git command that writes was run. Nothing whose name begins `heldout2` was opened. No song was read. `apps/` is as at HEAD. Nothing was built or trained.

## The answer first: about 12 to 14 hours, over the brief's four

The brief's constraint applies: "If the work would take more than about four hours on the Mac, stop and report the estimate first (a DESK DEFAULT)." The round as written is about **12 to 14 hours** of work on the Mac. So I stopped here.

The cost is in the wiring, not the training. Round 5's harness is Python on the GPU, with its own staff finder, deskew, and 300 dpi raster. None of it runs in the app. The reader, its windows, and its checks must be written again in TypeScript against homr's page images, and shown to agree with the Python reader before any song is measured.

## The estimate, part by part

| Part | Brief | Hours | Basis |
|---|---|---|---|
| Split the songs 13 and 4 by seed 57; train network A once; set the cut, centring tolerance, checks, and same-length margin on the 4 | 1.2, 1.3, 1.5 | 1.0 to 1.5 | Round 5 trained network A in 186 seconds a fold (`folds/f00-meta.json`); `fold5.py` and `eval5.py` adapt to one fixed split |
| Step 0, the render stop, on seeds 29000 + *f* | 2.0 | 0.5 | Round 5's evaluation took about 3 minutes; the guard is new code |
| Re-run `w5power.py` with the bounded span; count the 7 returns | 1.7 | 0.5 | 38 lines today |
| Port the reader to TypeScript: crop cutter matching `grid_sample`, nine readings, peaks, grouping, the statement rule, uncovered ink, C against cut C, unfamiliar shape if it fits 200 KB | 1.1, 1.3 | 3.0 to 4.0 | `decode5.py`, `reading5.py`, and `checks5.py`, about 210 lines of NumPy, plus a parity check against the Python reader window by window |
| Windows from homr's staves; a barline finder; courtesy windows; the model loaded on demand | 1.4, 1.6 | 1.5 to 2.0 | See the first two findings |
| The join: witness 5 over the bounded span, the tuplet checks run again under each proposal, persistence, set-asides, the console | 1.7, 1.8 | 2.0 to 3.0 | `join-pages.ts` and `triplets.ts`; see the third finding |
| The 17 songs before and after, scored | 2.1 | 1.0 | Round 5's drop-box reads took 18 minutes for 16 songs (`reads-minutes.log`) |
| Tests, the two pictures, the eight gates, the hash | 2.2 | 1.0 | |
| A, B, C, E, F, then G, H, I, J, N, O | 2.3, 2.4 | 1.0 to 1.5 | Row 55's procedure, two runs |
| The report | | 0.75 | |
| **Total** | | **about 12 to 14** | |

## What the survey found that bears on the brief

1. **homr gives staff boxes, not bar lines.** Each page's answer carries `staves`, one `StaffBox` each: `cx`, `cy`, `w`, `h`, and `index` (`third_party/homr-web/src/result.ts:25-31`, `:105`). That is enough for a system-start window and a courtesy window (the staff's right end is `cx + w/2`). It holds no bar line and no staff-line positions along the staff. So a window after a mid-system bar line needs a bar-line finder, and the three seats need the five lines found inside each window. Section 1.6 anticipates this: "If homr does not expose what the windows need, port your finder." Round 4's finder is `staff.py` (196 lines), with `barlines` and `isbar`.
2. **onnxruntime-web is homr-web's dependency, not the app's.** `apps/web/package.json:24` names only `homr-web`; `third_party/homr-web/package.json:48` pins `onnxruntime-web` `1.30.0`, and homr runs it inside its own Worker. For the app to run network A, it either adds `onnxruntime-web` `1.30.0` as its own dependency (a lockfile change), or homr-web gains a call for it (a new `0.2.0-ilya.7` tarball and a `CHANGES-ilya.md` entry). **DESK DEFAULT proposed:** the app's own dependency, pinned to `1.30.0`, so the `.wasm` files already served under `/omr/ort/` serve both, and the model sits under `/omr/models/`. It is reversible.
3. **Running the tuplet checks again under each proposal** means the join runs `completeTriplets` (`apps/web/src/lib/omr/triplets.ts`) for each proposed signature over its first four countable bars, before the sums. Today it runs once a bar under the metre in force (`apps/web/src/lib/omr/join-pages.ts:244`). This is the largest change to the join.

## A split into four runs, each under about four hours (a proposal for the desk)

1. **Python only, nothing in `apps/`** (about 3 hours): the "before" read of the 17 through the drop box, taken first; the 13 and 4 split; training and tuning; the same-length margin; step 0; the bounded-span power. It ends at step 0's stop, which is the round's first gate.
2. **The reader in TypeScript** (about 4 to 5 hours): the port, the windows, the bar-line finder, the model loading, and parity with the Python reader on the 17 songs' windows. Nothing reads from it yet.
3. **The join and the 17** (about 4 hours): witness 5, the tuplet re-run, persistence, the console, tests, the 17 after, the pictures, the gates, and the hash.
4. **The unseen songs and the report** (about 2 hours): A to F, then the six, and the report.

Run 2 can be cut by an hour if the parity check runs on the 17 songs' windows only and not on the renders.

## Could not establish

- **How many windows homr's staff boxes place where round 4's finder placed them.** NOT ESTABLISHED; measured in run 2.
- **Whether the TypeScript crop matches the Python one** closely enough to keep round 5's cut. Round 5's GPU cut matched the training cut within 1.5 percent of ink; the browser cut is unmeasured.
- **The reader's added seconds a song in the browser.** Round 5 measured the GPU batch only. A system start costs 2,025 crops for nine readings (report r4, section 2).
- The estimate's ranges are my judgement from round 5's timings and the code's size, not a measurement.

## Files

| Path | What |
|---|---|
| `docs/sessions/report-code-the-metre-seen-and-summed_r5_2026-10-11.md` | this report |
| `docs/memory/QUEUE.md`, row 57 only | status |
