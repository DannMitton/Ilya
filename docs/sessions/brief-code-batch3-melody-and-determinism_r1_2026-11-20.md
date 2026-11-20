# Code brief, consistency batch 3: the build becomes repeatable, and `markup/` becomes `melody/`

r1, 2026-11-20, by the desk (Opus 5), for Fable's review before the lane is cut. Branch when cut: `cloud-lane-77`, from `Shane` after lane 75 merges. It unblocks N.204's units from c onward and the behaviour baseline, both of which have been waiting on it.

## 1. What this is for

Nothing a singer sees changes in this lane. Two things that are costing the work change.

**The build cannot be compared with itself.** Two `pnpm build` runs on an unchanged tree produce 15 differing files of the 53 under `build/_app`, `build/sw.js`, and `build/index.html` (measured 2026-11-19 15:1x, `../memory/ENVIRONMENT.md`, THE BUILD IS NOT BYTE-DETERMINISTIC). While that holds, a behaviour baseline cannot be taken, so N.204 cannot show that a refactor changed nothing.

**One part of the app answers to two names.** The screen says MELODY and the code says `markup/`. Every reader of that code pays a small translation tax, and three parts of the comment convention ruled for N.204 wait on the rename: the generated module map, the header-comment test, and the sweep of line-number comments. Dann ruled the repair in at 2026-11-19 15:20.

## 2. Step 0: the build becomes repeatable

**Cause, read and confirmed in `../memory/ENVIRONMENT.md` and to be re-read in the tree:** `apps/web/svelte.config.js:18-22` sets `version.pollInterval: 0` and does not set `version.name`, so SvelteKit falls back to `Date.now()`. That timestamp lands in `build/_app/version.json` and is inlined into a chunk; the chunk's content hash changes, which renames it, which rewrites every entry chunk and `index.html` that points at it. `build/sw.js` stamps its own `CACHE_VERSION` separately.

**The repair is a wire, not a mechanism.** `apps/web/vite.config.ts:13-18` already computes a commit-based `buildId()`. Set `version.name` from it, and give `sw.js`'s `CACHE_VERSION` the same value.

**Done when:** two consecutive builds of one unchanged tree differ in zero files. Prove it by building twice and comparing, and put the command and its output in the report. Say what happens on a tree with uncommitted changes, since `buildId()` may have nothing stable to read there; if that case produces a timestamp again, say so rather than hiding it.

## 3. Step 1: `markup/` becomes `melody/`

`git mv apps/web/src/lib/markup apps/web/src/lib/melody`, then every import, every path string, and every mention in a comment or a test name follows it.

**Before you start, run the sweep and put its counts in the report:** how many files import from `$lib/markup`, how many name `markup/` in a string or a comment, and how many test titles carry the word. Do not take a count from this brief; it has none on purpose.

**Sites that will not move themselves, and must be checked by name:**

- `scripts/ratchets.json` and `scripts/ratchets.mjs`, where any ceiling keyed to a `markup/` path has to be rekeyed, with the numbers unchanged.
- `apps/web/e2e/` and `apps/web/e2e-phone/`, where a test may read a source file by path.
- Any generated or checked-in artefact keyed by path, including `apps/web/src/lib/markup/strophic-byte-baseline.json`.
- `docs/memory/` is **not** yours: the desk re-points its citations itself after the merge.

**What does not change:** the string keys in `i18n.ts` that carry `markup` in their name. They are cited by name in rulings and tests, and lane 69's own note in that file records why such keys keep their names. Renaming them is a separate decision and not this lane's.

**Done when:** `apps/web/src/lib/melody/` exists, `markup/` does not, all eight gates sit at baseline, and a grep for `lib/markup` across `apps`, `packages`, `scripts`, and `tests` returns nothing.

## 4. What this brief does not cover, and why

The desk searched the consistency audit (`brief-desk-consistency-audit_r2_2026-11-01.md`) for a list of batch 3 items and found none; the only batch 3 content in the record is the rename (`../memory/OPEN.md:4140`). **If the lane finds other items marked for batch 3, report them and do not build them.**

The three parts of the comment convention this unblocks belong to N.204 and are not built here.

## 5. Gates

All eight at baseline, from `~/Downloads/ilya-ship.sh`. Gate 4 is `6743 passed | 1 skipped (6744)` where numpy and scipy are installed and `6739 passed | 5 skipped (6744)` where they are not; say which you got. A rename should move no count: if gate 4 moves, stop and report rather than adjusting a baseline.

Two phone tests are known to fail on an untouched tree and are not yours: `e2e-phone/insights-links.test.ts:32` and `e2e-phone/voice-stations.test.ts:62`, both sub-pixel.

## 6. This brief changes no computation

No number Ilya computes moves, so `CONTRACT.md` section 4's rule on naming every site that computes the same number does not apply. Say so in the report if you find otherwise, and stop.

## 7. What you could not establish

**NOT ESTABLISHED beats a complete invented answer.**

Report rather than guess: whether `buildId()` yields a stable value on a tree with uncommitted changes; whether any checked-in artefact encodes a `markup/` path in a form a grep for `lib/markup` would miss; and whether anything outside `apps/web` reads that directory by path.

## 8. One commit per step, one report

Two commits, one report at `docs/sessions/report-code-batch3_r1_2026-11-20.md`. Write nothing under `docs/memory/`.
