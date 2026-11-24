# Brief: N.204 step 1, the behaviour baseline (Code, cloud lane), r2

Written by the desk (Opus 5), 2026-11-23 23:4x. **r2 applies all twenty-three items of `review-fable-brief-n204-behaviour-baseline_r1_2026-11-23.md`** (SEND WITH AMENDMENTS, four blockers, nineteen amendments, 160,971 tokens, 22 tool uses, 6.0 min). r1 is superseded and kept.

## What this is for

A photograph of exactly what Ilya produces today, taken more than once to prove the photograph itself is reliable. Every later change in the audit is checked against it: a repair meant to change nothing is proved to have changed nothing, and a repair meant to change one thing is proved to have changed only that.

**It gates more work than anything else open.** `plan-code-audit-maintainability_r9_2026-11-23.md` done-when item 3 holds every lane to this baseline, and step 8 holds tier 1 and tier 4 lanes to it and to nothing else.

**This lane changes no source.** It measures. A step that would change behaviour is a defect in this brief: stop and report it.

## 0a. THE SEARCH THIS BRIEF OWES, AND WHAT IT RETURNED

`CONTRACT.md` section 4: a brief proposing new work carries the grep it ran and what came back, or it does not go. r1 carried none; Fable's blocker 3 caught it. The desk ran it on `93edb360`.

**Ilya already photographs part of itself, and this lane extends that rather than building a second camera.** Found in the tree:

- `apps/web/src/lib/approval/__approved__/` with its own `README.md`, holding **`ipa-corpus.txt`** and **`sunless-01-engraved.primitive.svg`**.
- `packages/score-parser/src/approval/`, a second approval folder.
- `apps/web/src/lib/analysis/__golden__/adapter-snapshots.json`, with `adapter-golden.test.ts` and `stand-ins-snapshot.test.ts`.
- `apps/web/src/lib/melody/strophic-byte-baseline.json`, 29,726 bytes, with `strophic-byte-baseline.test.ts`.
- Thirty `.svg` files tracked in the repository.

**So family 2 largely exists, and families 1 and 3 exist in part, each already pinned by a test.** **Step 0b is therefore new in r2 and comes before any capture.**

## 0b. Read what already exists, and report the gap before capturing anything

Read `apps/web/src/lib/approval/__approved__/README.md` in full, the two approval folders, the golden folder, and the strophic byte baseline, with their tests. Report, as a table: what each already captures, by what mechanism, which of the ten families below it covers in whole or in part, and what it does not reach.

**Then say in one paragraph whether the ten families are better captured by extending these mechanisms or beside them, and recommend one.** The desk decides on your report; do not choose and proceed. If extending them would change a committed approval file, that is a behaviour change and this lane stops.

## The lane

Branch `cloud-lane-86`, **already created by Dann at `93edb360` before this prompt is sent**. You do not create it: the Code branch picker lists only branches that exist and offers no way to make one, and creating it is a push, which is Dann's (`ENVIRONMENT.md`, THE CODE BRANCH PICKER DOES NOT CREATE BRANCHES). The desk confirmed the name was unused.

**Your first git commands, in this order, and no others:** `git fetch origin`, then `git checkout -B cloud-lane-86 origin/Shane`. **Do not use `git reset --hard`**; the permission classifier refuses it and a lane sat stopped on that for thirty minutes on 2026-11-21 (`ENVIRONMENT.md`, A CLOUD LANE STALLS ON ITS OWN BASE BRANCH). **The base is `93edb360d397265bcea7dde693dbda81643351ac`, and it carries documents only**: the commit before it, `094d31a5`, is also documents only, so no code has changed under `apps/`, `packages/`, or `scripts/` since `b2869772`.

One commit per step with its own report. Push to that branch only; never `Shane`, never `main`. Dann merges. No pull request. **Stage by explicit path; never `git add -A` and never `git add .`** (`ENVIRONMENT.md`, the sweep of 2026-08-20).

**Model and cost.** Sonnet. **Cap 400,000 tokens**, stated here as `CONTRACT.md` section 4 requires; it is first of its kind and the figure is the widest neighbouring kind's range. Spawn no subagents of your own. **The cloud session credit expired 2026-11-05**, so this lane draws on the shared weekly pool; report your own spend in the final report.

## 1. The three builds, and the determinism proof

**Build at `b2869772` twice, and at `93edb360` once.** In the session's own clone, check out each commit in turn. The desk confirmed by `git diff --stat b2869772..93edb360 -- apps packages scripts` that nothing under those three paths differs between them; only `docs/` moved.

**Why the third build** (Fable blocker 1). The build stamps its own commit into its version name, so every later lane building at its own commit differs from this baseline in at least families 7 and 8 even when it changed nothing. The two builds at `b2869772` prove the build reproduces itself. **The third build at `93edb360`, whose source is identical, isolates what the stamp alone moves.** File that list as `STAMP-FOOTPRINT.md` beside the manifest: every file that differs between the base build and the third build, with the nature of each difference. Later lanes subtract it. "Stamp footprint" is Fable's term, adopted.

**Clean state means:** each build in its own directory, from a fresh clone or a fully cleaned tree, with build caches absent, and nothing shared between the three.

**Separate the two base builds by at least one minute and run them under different `TZ` values**, so a clock or timezone dependency shows rather than hides.

**The comparison is explicit:** for each build, the sorted list of output paths with each file's size and sha256, compared as sets. Report the build command used and the output directory.

**NOT ESTABLISHED and step 0 settles it:** how the build computes its stamp, and whether it can be pinned. Read the lines and name them; do not infer it.

**THE DETERMINISM HISTORY, and read it rather than taking this brief's word** (Fable amendment 7). Until 2026-11-19 two builds of one tree differed in fifteen files because the build stamped the clock. Dann ruled the repair in on 2026-11-19 at 15:20. The desk's record says it shipped inside N.211. **Step 0 reads `report-desk-n204-phase0-baseline_r1_2026-11-19.md` section 6 and the build's own stamp code, and reports what it finds.** If the record and the tree disagree, the tree wins.

## 2. The ten families

All at `b2869772`. **Every family is captured twice, from the two base builds**, and any family not identical across them is reported as such. Families 7, 8, and 9 are satisfied by step 1's comparison; say so rather than repeating the work.

1. **MELODY**, the drawn score: the SVG for every page of every fixture. **Enumerate the fixture set in the report.** Scanned-source fixtures are reported apart from file-source fixtures and are never dropped in silence.
2. **TEXT**: the transcription output for the whole IPA corpus.
3. **INSIGHTS**: every figure and every comment, in English and in French. **Name the voice input used**; the capture stub is development only.
4. **The printed pages.** **State the file format you capture them as**, and whether that format is byte-stable across runs.
5. **An exported `.ilya` binder and a saved-voice JSON.** Name the voice input, as in family 3.
6. **The table of interface strings**: commit the sorted table itself beside its hash, not the hash alone.
7. **The production build's file list**, with size and sha256 per file.
8. **The service worker's precache list**, from both the built and the source `sw.js`.
9. **The byte count of `static/`**, saying at which point it is measured.
10. **Both Playwright projects**, desktop and phone, **run twice**, reporting the per-test result list and not counts alone. **Use no update or snapshot-refresh flag.** A test that differs between the two runs is unstable and is named as such.

**Normalise nothing.** Do not strip or rewrite dates, generated identifiers, or ordering to make two captures agree. A difference is the finding.

**Record the environment in the manifest:** node, pnpm, operating system, architecture, and browser versions. Plan section 5c runs tier 3 lanes on Dann's Mac, and **whether a Linux capture equals a Mac capture is NOT ESTABLISHED**; say so in the report.

**Where they go:** the lane's own folder, `docs/sessions/n204-baseline_b2869772/`, with `MANIFEST.sha256` at its top level. **Put the capture harness in that same folder**, not under `scripts/`, because a new file under `scripts/` contradicts this lane's own prohibition and breaks the desk's source-equals-base check. **The harness is re-runnable by one named command and records its input list**, so a later lane can re-capture rather than guess.

**Size.** Report the byte total per family and in all **before committing any of it**. **A single family over 20 MB, or a total over 60 MB, stops and asks the desk.** Ten families at 20 MB each would put 200 MB into permanent history.

## 3. When to stop, and what a stopped lane does

Stop and report, repairing nothing, if: the two base builds differ; the eight gates are not at their baselines (`6804 passed | 1 skipped (6805)` for gate 4 and `911 passed | 5 skipped (916)` for gate 5 as of `93edb360`, **measured on Dann's Mac; `scipy` is absent in the cloud environment, so say which figure yours is**, `ENVIRONMENT.md`, A CLOUD LANE STALLS ON ITS OWN BASE BRANCH); a build fails or completes with a fetched asset missing; a capture would change a committed approval file; or a size ceiling above is reached.

**A stopped lane still commits** what it captured, its manifest, its harness, and a report naming where it stopped and why.

## 4. The report

`docs/sessions/report-code-n204-baseline_r1_2026-11-23.md` on the lane. **Run `ls` on `docs/sessions/` before naming it**, because revision and lane numbers are not unique across subjects. Per family: what was captured, how many files, the manifest hash, the byte total, and whether the runs agreed. Plus step 0b's table, the stamp footprint, your token spend, and a section headed "What I could not establish".

## What this lane must not do

- Change no file under `apps/`, `packages/`, or `scripts/`.
- Move no ratchet ceiling. Delete nothing. Refactor nothing. Change no committed approval or golden file.
- Create no `.bak` file. Touch nothing under `docs/memory/`.

## What is NOT in this lane

**The performance baseline**: cold load, time to first drawn page, the reader's wall clock on one fixture scan, and bundle and `static/` byte sizes. Timings in a cloud container are not Dann's Mac's. It runs separately on his Mac. **Report the byte totals here regardless**, so nothing waits on his Mac for a number a container can produce.

## What the plan asks, quoted so this brief cannot narrow it

Plan section 5a: *"the behaviour baseline, built at the base commit and run twice to prove it deterministic (MELODY SVG per page per fixture, TEXT for the IPA corpus, INSIGHTS figures and comments in both languages, print pages, an exported `.ilya` binder and saved-voice JSON, one hash of the sorted i18n table, the production build's file list and sizes, the `sw.js` precache list, the `static/` byte count, both Playwright projects)"*.

Done-when item 3: *"the behaviour baseline equal byte for byte except the listed intended differences"*.

## What you could not establish

Carry a section with that heading. **NOT ESTABLISHED beats a complete invented answer.** Do not report a family as captured if its capture path failed and you reached it another way; say which path you used. Four things the desk already knows are open: whether a cloud session has ever completed a production build of this tree or run either Playwright project; whether the reader's model files reach a cloud container; how the build computes its stamp; and whether a Linux capture equals a Mac capture.

## Style

Canadian spelling, the Oxford comma, no em dashes, sentence case headings, no `simply`, `just`, `easy`, and no exclamation marks.
