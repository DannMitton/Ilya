# Brief: N.204 step 1, the behaviour baseline (Code, cloud lane)

Written by the desk (Opus 5), 2026-11-23 23:2x. **NOT SENT. Fable review owed first** (`CONTRACT.md` section 1 item 19).

## What this is for

A photograph of exactly what Ilya produces today, taken twice to prove the photograph itself is reliable. Every later change in the audit is checked against it: a repair that was meant to change nothing is proved to have changed nothing, and a repair that was meant to change one thing is proved to have changed only that.

**It is the gate on more work than anything else open.** `plan-code-audit-maintainability_r9_2026-11-23.md` done-when item 3 holds every lane to this baseline, and step 8 holds tier 1 and tier 4 lanes to it and to nothing else. Until it exists, no repair lane can start.

**This lane changes no source.** It measures. A step that would change behaviour is a defect in this brief: stop and report it.

## The lane

Branch `cloud-lane-86`, cut from `Shane` at `93edb360`. One commit per step with its own report. Push to that branch only; never `Shane`, never `main`. Dann merges. No pull request.

**The baseline is pinned to commit `b2869772`**, which is the plan's base. The desk confirmed by `git diff --stat b2869772..93edb360 -- apps packages scripts` that nothing under those three paths has changed since, so the source you build is the source the plan describes; only `docs/` has moved. **Build at `b2869772` itself**, not at the branch tip, because the build stamps the commit into its own version name and two builds must carry the same stamp to be comparable.

## Step 0. The ground, and one thing to confirm before anything else

Install with `pnpm`, confirm the eight gates pass at their current baselines, and report the versions of node, pnpm, and the browser Playwright uses. **Report the eight gate numbers as you find them**; they are `6804 passed | 1 skipped (6805)` for gate 4 and `911 passed | 5 skipped (916)` for gate 5 as of `93edb360`.

## Step 1. Build twice, and prove the build is deterministic

Build the production app twice from a clean state at `b2869772`. Compare the two outputs byte for byte and **report every file that differs, with its path and the nature of the difference**.

**Context you need, and it is the point of this step.** Until 2026-11-19 this build was NOT byte-deterministic: two builds of one tree differed in fifteen files, because the build stamped the clock into its own version name. Dann ruled the repair in on 2026-11-19 at 15:20 and it shipped inside N.211. **This step is where that repair is proved.** If the two builds still differ, say exactly where, and stop before step 2: a baseline taken on a non-deterministic build is worthless and the lane reports that rather than producing one.

## Step 2. Capture the baseline

Ten families, all at `b2869772`, each written as files plus a `MANIFEST.sha256` of everything captured.

1. **MELODY**, the drawn score: the SVG for every page of every test fixture.
2. **TEXT**: the transcription output for the whole IPA corpus.
3. **INSIGHTS**: every figure and every comment it produces, **in both English and French**.
4. **The printed pages**, as the print path renders them.
5. **An exported `.ilya` binder**, and a saved-voice JSON.
6. **One hash of the sorted table of interface strings**, so a later accidental string change is visible as one changed hash.
7. **The production build's file list with each file's size.**
8. **The service worker's precache list.**
9. **The byte count of `static/`.**
10. **Both Playwright projects**, desktop and phone, with their pass counts.

**Where they go:** committed to the lane under `docs/sessions/n204-baseline_b2869772/`, with `MANIFEST.sha256` at its top level. These are text artifacts and they belong in the repository, because a baseline nobody can diff later is not a baseline. If any one family exceeds about 20 MB, report its size before committing it and hold that family out pending the desk's word.

**Take families 1 to 5 twice as well**, from the two builds of step 1, and report any family that is not identical across them. A baseline that cannot reproduce itself is not yet a baseline.

## Step 3. The report

`docs/sessions/report-code-n204-baseline_r1_2026-11-23.md` on the lane. It states, per family: what was captured, how many files, the manifest hash, and whether the two runs agreed. It names anything that could not be captured and why.

## What this lane must not do

- Change no file under `apps/`, `packages/`, or `scripts/`. If a capture needs a harness, the harness is new and lives under `scripts/baseline/` or in the lane's own folder, and the brief says which.
- Move no ratchet ceiling. Delete nothing. Refactor nothing.
- Create no `.bak` file.
- Touch nothing under `docs/memory/`.

## What is NOT in this lane

**The performance baseline**, which is cold load, time to first drawn page, the reader's wall clock on one fixture scan, and bundle and `static/` byte sizes. Timings taken in a cloud container are not Dann's Mac's, and the plan records that as NOT ESTABLISHED. It runs separately on his Mac and reaches him as one paste.

## What you could not establish

Carry a section with that heading. **NOT ESTABLISHED beats a complete invented answer.** In particular, do not report a family as captured if the capture path failed and you reconstructed it another way; say which path you used.

## Style

Canadian spelling, the Oxford comma, no em dashes, sentence case headings, no `simply`, `just`, `easy`, and no exclamation marks.
