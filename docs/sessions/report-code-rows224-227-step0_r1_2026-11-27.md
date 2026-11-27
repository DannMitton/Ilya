# Report: rows 224 and 227, step 0 (measure only), BLOCKED

2026-11-27, Code in the cloud lane, branch `cloud-lane-90`, cut from `Shane` at `f2280cf3`. Working tree clean at the start (`git status -sb` showed only the branch line). Brief read in full: `brief-code-rows224-227-lyric-band-and-row-choice_r3_2026-11-27.md`.

**Result: step 0 could not be run. No part of it is established. No code was changed.**

## Why

Step 0 measures the scans, and the scans are not in this checkout or this sandbox.

| step 0 part | needs | found here |
|---|---|---|
| a. the key, by eye from the crops | page images of Nightingale page 4 and song2 page 1 | none. `nightingale-p4.png`, `nightingale-p4-only.pdf`, and the song2 page image are read from a Mac path by `step0c-bandtop.mjs:7` and `step0c-metre.mjs:12`; no copy is committed |
| b. whether the band's edge cuts ink, per system | the page pixels plus the Worker's `core[0]` | none |
| c. ink profile of the 1.5 spaces above each band | the page pixels | none |
| d. what each look gives, per system | the run's e2e JSON (layout and tesseract blocks) that `step3-rows.mjs:8-10` reads, a dev server on :5173, and the homr and tesseract models | JSON not committed; `node_modules` absent (`ls node_modules` returned nothing) |
| e. staged pages with `core[0]` at 0 | the staged set | none; only the Mac holds it |

Searched: `git ls-files` for `nightingale`, `song2`, `p4-only`, `.pdf`, `.png`; `find /` for `*nightingale*` and `*p4-only*`; the committed measure folder `docs/sessions/measure-staff-finder-light-scan_2026-11-25/`. The only scan-like inputs in the repository are `tools/e16-harness/scans/*` and `tools/e16-harness/irregular-fixtures/*`, which are other material and not the pages the brief names. I did not substitute them: the key must come from these two pages, and the brief says a measure on other pages would not close its done-whens.

What does exist is the lane's earlier output as text: `step3-rows.out.txt` and `step3-summary.out.txt` in the folder above. Those are the brief's own sources for its figures. I have not re-derived any of them. Re-reading them would repeat what the brief already cites and would not be step 0.

## What I did not do, and why

1. **The key (a) is not written.** It has to come from looking at the crops. Writing it from `step3-rows.out.txt` text would be using the code's own reading, which the brief forbids ("by looking at the crops and not by any rule the code already holds").
2. **No code was changed, including step 4.** Step 4 is buildable without the scans, and I considered it. I held it because the brief orders step 0's report before any code change, and because step 0 (d) can end the lane: where the measure scores the German row above the key's line on any system, the lane stops before step 2 is built. Building step 4 first on a lane whose measure has not run risks a branch of code the desk then discards.
3. **Step 1 is also blocked by a desk decision, not only by the scans.** The brief says the desk sets a ceiling on added reader time per page from step 0 (d), and a floor for the share if one is needed, before step 1 is built. Neither exists yet.
4. **The gates were not run.** `node_modules` is absent, so `pnpm install --frozen-lockfile` would come first, and no baseline for gate 4 is established. `scipy` is absent from this sandbox's Python (`ModuleNotFoundError`), so gate 4's scipy baseline is NOT ESTABLISHED here. The non-scipy figure is also NOT ESTABLISHED, because the gate was not run.

## What unblocks it

Any one of these:

1. Commit the inputs to a path the lane can read: `nightingale-p4.png` (or the `-only.pdf`), the song2 page 1 image, and the e2e `.json` that `step3-rows.mjs` takes. The staged set for part (e) is also needed, with its names.
2. Run step 0 on the Mac, where the inputs are, and hand the lane the step 0 report with the key, the part (d) table, the floor, and the ceiling. The lane then builds step 4, then steps 1 to 3.
3. Attach the Mac folder through Remote Control, which I have not requested.

Open choice for the desk, marked DESK DEFAULT: I take option 1 or 2 as the next input and will not start step 4 before it arrives. If the desk would rather have step 4 built now on its own merits, say so and I build it first, with its unit tests, and keep steps 1 to 3 held.

## Nothing contradicts the chain yet

No measurement was taken, so none contradicts link 1 or any other link. Part (b)'s stop condition (the band's edge cuts no ink on any system) is **not** triggered; it is untested.
