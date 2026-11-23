# Code brief, consistency batch 3: the build becomes repeatable, and `markup/` becomes `melody/`

r2, 2026-11-22, by the desk (Opus 5), for Fable's review before the lane is cut. r1 (2026-11-20, md5 `19b175d2f538c2ae9782d846a2c55391`) was never reviewed; it is superseded and kept. Branch when cut: `cloud-lane-84`, from `Shane` `e8f64d4f` (DESK DEFAULT: r1 named `cloud-lane-77`, which row 200 now holds, and a base of "after lane 75 merges", which shipped 2026-11-20).

It unblocks N.204's unit l and every unit read that touches `markup/`, and the behaviour baseline, both of which have been waiting on it (`../memory/OPEN.md`, N.204: ITS PURPOSE, ITS COMMENTS, AND THE DESK'S DECISION RIGHTS, the paragraph beginning "Established by the desk 2026-11-19 14:5x").

## 0. What changed from r1, and why

Every citation in r1 was re-read in the tree on 2026-11-22 at `e8f64d4f`. Three things moved.

1. **r1 said `build/sw.js` stamps its own `CACHE_VERSION` separately, and told you to give it the same value. That is wrong.** `apps/web/static/sw.js:20` reads `const CACHE_VERSION = 'ilya-__BUILD_VERSION__';`, and `apps/web/scripts/stamp-sw.mjs:75` replaces that placeholder at build time with SvelteKit's own per-build version (`stamp-sw.mjs:6` says so in its own words). The service worker already inherits `version.name`. Setting `version.name` is therefore the whole repair, and a second wire into `sw.js` would be a duplicate. **Search run, per `CONTRACT.md` section 4:** `grep -rn "__BUILD_VERSION__"` across `.ts`, `.js`, `.mjs`, `.json`, and `.svelte` outside `node_modules` returned `static/sw.js:11` and `:20`, `scripts/stamp-sw.mjs:6`, `:39`, `:40`, and `:75`, the built copy under `.svelte-kit/`, and `src/lib/sw-shell.test.ts:104`. Nothing else stamps a version.
2. **A rename turns one gate off instead of failing it, and r1 does not cover that site.** Section 3 carries it.
3. **One NOT ESTABLISHED of r1 is answerable from the code, and its real risk is a different one.** Section 2 carries it.

## 1. What this is for

Nothing a singer sees changes in this lane. Two things that are costing the work change.

**The build cannot be compared with itself.** Two `pnpm build` runs on an unchanged tree produce 15 differing files of the 53 under `build/_app`, `build/sw.js`, and `build/index.html` (measured 2026-11-19 15:1x, `../memory/ENVIRONMENT.md`, THE BUILD IS NOT BYTE-DETERMINISTIC). While that holds, a behaviour baseline cannot be taken, so N.204 cannot show that a refactor changed nothing.

**One part of the app answers to two names.** The screen says MELODY and the code says `markup/`. Every reader of that code pays a small translation tax, and three parts of the comment convention ruled for N.204 wait on the rename: the generated module map, the header-comment test, and the sweep of line-number comments. Dann ruled the repair in at 2026-11-19 15:20.

## 2. Step 0: the build becomes repeatable

**Cause, re-read in the tree 2026-11-22 and confirmed:** `apps/web/svelte.config.js:18-22` is the `kit.version` block. It sets `pollInterval: 0` at `:21` and sets no `name`, so SvelteKit falls back to `Date.now()`. That timestamp lands in `build/_app/version.json` and is inlined into a chunk; the chunk's content hash changes, which renames it, which rewrites every entry chunk and `index.html` that points at it.

**The repair is a wire, not a mechanism.** `apps/web/vite.config.ts:13-20` already computes a commit-based `buildId()` (r1 cited `:13-18`, which stops two lines short of the function). Set `kit.version.name` from the same value. Do not touch `sw.js` or `stamp-sw.mjs`: they already follow `version.name`, as section 0 item 1 shows.

**What r1 filed as NOT ESTABLISHED, now established by reading, and the caveat it hides.** `buildId()` reads `VERCEL_GIT_COMMIT_SHA` first (`vite.config.ts:14`) and otherwise `git rev-parse --short=8 HEAD` (`:16`), falling back to the string `unknown` (`:18`). HEAD is a commit, not the working tree, so the value is **stable** on a tree with uncommitted changes: two builds of one dirty tree agree, which is what determinism needs. It is **not unique**: two different working trees on one commit produce one version name, so on a local build `updated.check` and the service worker's cache key cannot tell them apart. On Vercel every deployment carries its own commit, so production is unaffected. **Report whether the `unknown` fallback can fire in any build you run, and say what the version name is in that case**; a constant `unknown` would make every such build indistinguishable from every other.

**Done when:** two consecutive builds of one unchanged tree differ in zero files. Prove it by building twice and comparing, and put the command and its output in the report.

## 3. Step 1: `markup/` becomes `melody/`

`git mv apps/web/src/lib/markup apps/web/src/lib/melody`, then every import, every path string, and every mention in a comment or a test name follows it.

**Before you start, run the sweep and put its counts in the report:** how many files import from `$lib/markup`, how many name `markup/` in a string or a comment, and how many test titles carry the word. Do not take a count from this brief; it has none on purpose.

**The site that fails silently, and it is the reason to read this section twice.** `scripts/ratchets.mjs:76-85` holds a `MODULES` map of what each module under `apps/web/src/lib/` may import, keyed by **directory name, not by path**: `markup: ['reader', 'score', 'voice', 'analysis']` at `:83`. `moduleOfPath` at `:87-91` takes the first path segment under `apps/web/src/lib/` and returns it only when it is a key of that map, otherwise `null`. Rename the directory without renaming the key and every file in `melody/` resolves to `null`, so the layering check stops examining the module **and the gate still passes**. A green gate here would mean the check was skipped, not that it held. Rename the key to `melody` in the same commit and keep its permitted list unchanged.

**Sites that will not move themselves, and must be checked by name:**

- `scripts/ratchets.json:16`, `"apps/web/src/lib/markup/MarkupPane.svelte": 1231`, rekeyed with the number unchanged. This one announces itself: `ratchets.mjs:73-74` already reports a ceiling whose file no longer exists.
- `scripts/ratchets.mjs:83`, the `MODULES` key above, which does not announce itself.
- `apps/web/e2e/` and `apps/web/e2e-phone/`, where a test may read a source file by path.
- `apps/web/src/lib/markup/strophic-byte-baseline.json` (present, 29,726 bytes), and any other generated or checked-in artefact keyed by path.
- `docs/memory/` is **not** yours: the desk re-points its citations itself after the merge.

**What does not change:** the string keys in `i18n.ts` that carry `markup` in their name. They are cited by name in rulings and tests, and lane 69's own note in that file records why such keys keep their names. Renaming them is a separate decision and not this lane's.

**Done when:** `apps/web/src/lib/melody/` exists, `markup/` does not, all eight gates sit at baseline, a grep for `lib/markup` across `apps`, `packages`, `scripts`, and `tests` returns nothing, and `scripts/ratchets.mjs`'s `MODULES` carries `melody` with `markup` gone.

## 4. What this brief does not cover, and why

The desk searched the consistency audit (`brief-desk-consistency-audit_r2_2026-11-01.md`) for a list of batch 3 items and found none; the only batch 3 content in the record is the rename (`../memory/OPEN.md:4140`). **If the lane finds other items marked for batch 3, report them and do not build them.**

The three parts of the comment convention this unblocks belong to N.204 and are not built here.

## 5. Gates

All eight at baseline, from `~/Downloads/ilya-ship.sh`. Gate 4's baseline at `e8f64d4f` is `6804 passed | 1 skipped (6805)` and gate 5's is `911 passed | 5 skipped (916)`; where numpy and scipy are absent the skip count rises, so say which you got. A rename should move no count: **if gate 4 moves, stop and report rather than adjusting a baseline.** The same holds for the ratchets gate, with section 3's warning in mind: a pass there is only evidence if `MODULES` names `melody`.

Two phone tests are known to fail on an untouched tree and are not yours: `e2e-phone/insights-links.test.ts:32` and `e2e-phone/voice-stations.test.ts:62`, both sub-pixel.

## 6. This brief changes no computation

No number Ilya computes moves, so `CONTRACT.md` section 4's rule on naming every site that computes the same number does not apply. Say so in the report if you find otherwise, and stop.

## 7. What you could not establish

**NOT ESTABLISHED beats a complete invented answer.**

Report rather than guess: whether the `unknown` fallback at `vite.config.ts:18` fires in any build you run; whether any checked-in artefact encodes a `markup/` path in a form a grep for `lib/markup` would miss; and whether anything outside `apps/web` reads that directory by path.

## 8. One commit per step, one report

Two commits, one report at `docs/sessions/report-code-batch3_r1_2026-11-22.md`. Write nothing under `docs/memory/`.
