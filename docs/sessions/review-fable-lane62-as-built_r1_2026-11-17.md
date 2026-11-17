# Fable review of N.200 lane 62 (the path picker) as built

Filed verbatim by the desk 2026-11-17 08:3x. Fable 5.2 subagent, read only; harness count 201,693 tokens, 23 tool uses, 17.1 min (cap 400k). Lane `cloud-lane-62` at `b320496d` against `Shane` `74371b54`. The desk's prompt carried the scores of Dann's 13 takes (`~/Downloads/_desk-2026-11-17/n200-lane62-score/DESK-SUMMARY_r1_2026-11-17.md`).

REVIEW MEMO: lane 62 as built (origin/cloud-lane-62 b320496d against origin/Shane 74371b54)

VERDICT: MERGE. No blockers. Nothing needs to change before merge; the fR2 and lowest-ceiling work belongs to the switch-on lane, with the tests written first.

BLOCKERS
None.

WHAT I VERIFIED (file and line, or a run)
1. Golden byte-equal at the tip. Run: `golden.run.ts` on an export of b320496d in /tmp, 1 passed, 468 s. The golden file has one commit, 849cf115, before any engine change (git log).
2. Changed-file tests at the tip. Run: path-extract, burg, capture-file, open-extract tests, 51 passed (Python with numpy and scipy present here).
3. Burg recursion (burg.ts:30-52) matches burg.py:35-51 term for term; roots kept 50 Hz to ceiling minus 50 (burg.ts:101); 50 ms Gaussian window, 6.25 ms step, order 10 (burg.ts:22-27, 93-94).
4. Criterion (path-extract.ts:140-153): W = (s2/k)^t times (chi2/d); t 1.25, 3 terms, k = 3 times terms, d = sum of (frames minus terms), floor 20 Hz, a ceiling set aside under half the frames (:146) or on a failed fit (:148). L15 and L9 at :40-41.
5. Cross-check order (path-extract.ts:174-197): no-fr1, out-of-range, a, b, c, d no-peak. The fR2 check runs whenever fR1 exists; the different-peak rule works in case (c) only (:184, :192), as the brief asks.
6. fR2 absent gives `f2` null (path-extract.ts:235; analyze.ts `if (ex.f2 !== null) out.f2`). `pathF2Quality` and `pathSteadiness` as briefed (analyze.ts diff, +109 to +128). The picker runs once.
7. No `closedPhaseF1`, no MITTON in path-extract.ts (imports at :28-32; source tests pass).
8. The route touches only the path branch (analyze.ts diff: `extractWith`, `st`, `pathPoor`, `f2Quality`, `picker`).

FIXES
1. fR2 duplicate (B). Switch-on lane, as its gate. My scratch run on the primary set only (600 takes, post hoc, /tmp, not a test) reproduces the lane: 52 misses, 530 in bar, the check keeps 42.
   - New finding: in all 52 misses the path's third track is within 12 percent of the true fR2. The tracks are shifted by one; the reading is in track 3.
   - Rule R125 (fR2 at least `RESOLUTION_HZ` above path fR1, else absent): 47 of 52 misses absent, 0 of 530 in-bar takes touched.
   - Rule DP (the fR1 peak, nearest envelope peak within T1, found in every case and excluded for fR2): 47 of 52 alone; 49 with R125; 0 in-bar touched.
   - Rule P3 (when track 2 fails R125 and DP, offer track 3 to the same two tests): 49 of 52 misses land in bar, 3 stay wrong, 0 in-bar touched; fR2 in bar 579 of 600 against 530.
   Instruction for Code: in `crossCheck` (path-extract.ts:177-195), move the `f1Peak` search out of the `else` branch so it runs in every case; import `RESOLUTION_HZ` from `open-extract.ts:41`; inside the `f2Check` branch require `pathF2 - pathF1 >= RESOLUTION_HZ`; add `pathF3` as a parameter and try it when track 2 fails; record which track gave fR2 in `PathEvidence`. Each rule behind its own option so the tables run on and off.
   Pre-registered test, committed before the one run: a third set (take seed 15000 + idx*20 + k, permutation rng(17000 + idx*31 + 1), truth factor from rng(19000 + idx)); the held-out set is spent. Bars: the rule changes fR2 on at most 1 percent of takes whose track-2 fR2 is in bar; at least half the fR2 misses end absent or in bar; at least 90 percent of promoted readings within 12 percent. On Dann's takes: all 12 path readings unchanged (R125 fires on none, per the desk). Constructed unit cases: `crossCheck(640, 647, case a, peak 647)` gives fR2 not kept; a 125 Hz gap exactly is kept.
   R125 has real-voice evidence. DP and P3 have none: NOT ESTABLISHED on Dann's takes.
2. Lowest ceiling (C). Switch-on lane; tool columns first. Same scratch run, track-2 reading before any check: L15 both bars 530; without the 3001 rung 549; without 3001 and 3188, 559; neither loses an L15 in-bar take. Without three rungs, 566 with 2 lost. With P3 added: L15 578, without the 3001 rung 582 of 582 readings. The 4 primary fR1 misses all sit at 3001 and read low (491 for 679). Synthetic bass [u] chose 3188 on 2 of 12 takes and stayed in bar.
   Instruction: the switch-on lane's Step 0 adds tool-only columns beside `path9`: the path with ladders 3188 to 7000 and 3387 to 7000 (re-scored from stored tracks, `choosePath` on a slice), plus `pathF1`, `pathF3`, and the runner-up ceiling in the evidence string (score-core.ts `evidenceOf`). The desk runs Dann's 13 before any engine rule is chosen. Bars written first: both [u] takes stay in both bars; no take in bar under L15 leaves it; [ɪ], [ɛ], and take 09 reported. L9 stays out.
   Dann's three 3001 takes are not duplicates (gap at least 347 Hz), so P3 cannot help them; whether a raised floor does is NOT ESTABLISHED.
3. Gate 4 now depends on the machine. After merge. `burg.test.ts` skips 4 tests where Python lacks numpy or scipy (`havePython`, burg-fixtures.ts:17; `it.skipIf`, burg.test.ts). The lane's 6512 passed, 1 skipped becomes 6508 passed, 5 skipped elsewhere. Record both counts in STATE, or move Tests 1 and 3 to `burg-check.run.ts`.
4. Tool config. After merge. The `include` edit (vitest.config.ts:32) makes the unfiltered command in the file's own header run `golden.run.ts` (468 s here) and `burg-check.run.ts` (no skip guard, needs Python). Guard both behind an environment variable or correct the header.
5. Weighting. Switch-on lane, report only. `fitTrack` scales rows by 1/b (path-extract.ts:127), so squared residuals carry 1/b squared (sigma equal to bandwidth). The brief says "weighted by 1/b". Which Weenink means is NOT ESTABLISHED.
6. `vercel.json`. After the iPhone timing. The two `cloud-lane-62` entries (:3, :47) are as briefed and valid; remove them once the lane's deployment is no longer needed.

OUTSIDE OWNS (D), all reported by the lane, none in Leaves
- `capture-file.test.ts:138` regex widened to allow `||`-joined branches; still one `PUBLIC_RECORDER`.
- Type-import lines: `capture-file.ts:27`, `extract.ts:4`.
- `PathEvidence.pathF3`.
- New under tools/n200-score: `burg_ref.py`, `burg-fixtures.ts` (moved from the app so the recorder-import test passes), `burg-check.run.ts`, `measure-core.ts`, `measure.run.ts`, `measure-report.run.ts`; the `include` edit.
- No change under docs/memory, no package or lockfile change (diffstat). scipy was a pip install in the lane's container only (step 0 report).
- New files 107 and 243 lines; the largest touched file is live.ts at 826; none has a ratchet ceiling.
- `analysisMs`: live.ts diff, both `holdCapture` calls. Timing, lane's figures, not re-run: path minus shipped 136 ms at 1x, 508 ms at 4x, Chromium. The test asserts only 120 s per call. The Step 4 bar is on the iPhone: NOT ESTABLISHED.

CONFLICTS (E)
`git merge-tree --write-tree origin/Shane origin/cloud-lane-62`: exit 0, tree 9591c2bd, no conflicting paths. The two sides' changed-file lists since d20f6f10 do not overlap.

FOR DANN
None for the merge.

WHAT I COULD NOT ESTABLISH
- Whether t, d, and m match Praat FormantPath, and Burg's pages.
- R125, DP, and P3 on the held-out set (deliberately not re-run) and on real voices.
- The ceilings Dann's [u], [o], and [ɑ] takes chose, so whether the floor can rise.
- Why [ɪ] and [ɛ] read fR2 low at 3001.
- The eight gates on the merged tree (not run, per instruction); gate 4's count after lane 61.
- The time the timing test adds to a full phone run.

NOTES
- Terms: R125, DP, P3 are my labels. "Duplicate gap" is the desk's.
- Scratch lives in /tmp/l62 and /tmp/scratch-rows.json only; the clone is untouched apart from the fetch.
- Memory: nothing from it was used in this memo.
- Tokens: not known exactly; roughly 130k, under the cap.
