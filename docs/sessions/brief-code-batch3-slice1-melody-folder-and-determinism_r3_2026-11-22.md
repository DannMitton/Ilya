# Code brief, consistency batch 3, first slice: the build becomes repeatable, and the folder `markup/` becomes `melody/`

r3, 2026-11-22, by the desk (Opus 5), after Fable's review of r2 (`review-fable-batch3-r2_r1_2026-11-22.md`, verdict DO NOT SEND, two blockers, ten amendments, all applied). r1 (2026-11-20) and r2 (`4e457718104e9a439ba85deb5d989cc0`) are superseded and kept. Branch when cut: `cloud-lane-84`, from `Shane` `e8f64d4f` or later.

## 0. What changed from r2, and the desk's error

**r2 said batch 3 is the folder rename and nothing else. That was wrong, and it was the desk's error.** r2 carried r1's sentence "the desk searched the consistency audit and found none" without re-running the search, which is the same failure as reasoning from a truncated lookup. `apps/web/src/lib/names.ts:102-130` records batch 3 as **five** renames, and `docs/house-style/code-conventions.md:11`, `:41`, and `:43` add more. Read by the desk in the tree 2026-11-22. **This brief is now one slice of batch 3, named so in its title, and section 4 inventories the rest.**

Two of batch 3's parts change values a singer's browser has stored. **This lane changes none of them.** Section 3's bright line is the most important paragraph in this brief.

r2's three corrections to r1 were each confirmed in the tree by Fable and stand: the service worker already inherits `version.name`; the `MODULES` key failure is real; `buildId()` is stable on a dirty tree.

## 1. What this is for

Nothing a singer sees changes in this lane. Two things that are costing the work change.

**The build cannot be compared with itself.** Two `pnpm build` runs on an unchanged tree produce 15 differing files (measured 2026-11-19 15:1x, `../memory/ENVIRONMENT.md`, THE BUILD IS NOT BYTE-DETERMINISTIC). While that holds, a behaviour baseline cannot be taken, so N.204 cannot show that a refactor changed nothing.

**One part of the app answers to two names.** The screen says MELODY and the folder says `markup/`. Three parts of the comment convention ruled for N.204 wait on the folder's name (`code-conventions.md:47`, `:49`, `:50`). Dann ruled the determinism repair in at 2026-11-19 15:20.

## 2. Step 0: the build becomes repeatable

**Cause, read in the tree 2026-11-22 and confirmed by Fable against SvelteKit's own source:** `apps/web/svelte.config.js:18-22` is the `kit.version` block; it sets `pollInterval: 0` at `:21` and sets no `name`, so SvelteKit falls back to `Date.now()` (`kit/src/core/config/options.js:312`). That value is written into `build/_app/version.json` and hashed into a global's name, which renames a chunk, which rewrites every entry chunk and `index.html` pointing at it.

**The repair, and how the value is shared.** `apps/web/vite.config.ts:13-20` already computes a commit-based `buildId()`. **Do not copy it.** `svelte.config.js` is plain JavaScript loaded by Node, and Node does not load `.ts`, so it cannot import `vite.config.ts`.

> Move `buildId()` out of `vite.config.ts` into a new plain module `apps/web/build-id.js` (ES module, no TypeScript), carrying its comment. Import it in both `vite.config.ts` and `svelte.config.js`, and set `kit.version.name: buildId()`. One function, two readers. Do not import `vite.config.ts` from `svelte.config.js`. **Do not touch `sw.js` or `stamp-sw.mjs`:** `stamp-sw.mjs:18` reads `build/_app/version.json`, `:27` takes `.version` from it, and `:75` substitutes it, so the service worker already follows `version.name`. A second wire there would be a duplicate.

The file name `build-id.js` is a DESK DEFAULT.

**Step 0 lands first, in its own commit, before the rename.** Section 3's note on scoped class names says why.

**What this changes that is worth reporting and not repairing.** Two deployments of one commit now share a version name. `updated.check` compares `version.json` with the built-in name, so a redeploy of the same commit raises no update notice, and `sw.js` is then byte-identical unless a hashed chunk named in it changed, so no new worker installs. Pages are network-first (`static/sw.js:124-126`) and chunks are content-hashed, so what can go stale is an unhashed static file, served stale-while-revalidate once (`:129-141`). **Report this; do not repair it.** On Vercel every deployment carries its own commit, so production is unaffected.

**Also report, do not guess:** whether the `'unknown'` fallback at `vite.config.ts:18` fires in any build you run, and what the version name is then. A constant `unknown` would make every such build indistinguishable from every other.

**Done when:** two consecutive `pnpm --filter @ilya/web build` runs, on one machine, one commit, and one environment, differ in zero files under `apps/web/build/`, all of it and not only `_app`. Copy the first build aside, build again, and put the `diff -rq` command and its full output in the report. **If a file still differs, name it and stop; do not chase it.** The 2026-11-19 measurement covered only `build/_app`, `build/sw.js`, and `build/index.html` (`ENVIRONMENT.md:5677`), so a second cause among the 15 files is not ruled out. One known ordering source: `stamp-sw.mjs:49` walks with `readdirSync` unsorted and writes that order into `sw.js`.

## 3. Step 1: the folder `markup/` becomes `melody/`

`git mv apps/web/src/lib/markup apps/web/src/lib/melody`, then every import and every path string that points into it follows.

**Before you start, run the sweep and put its counts in the report:** how many files import from `$lib/markup`, how many name `markup/` in a string or a comment, and how many test titles carry the word. Do not take a count from this brief; it has none on purpose.

### 3a. THE BRIGHT LINE. Read this twice

**What does not change, and it is most of what says "markup".** This lane renames one directory and the paths that point into it. **It renames no identifier, no file, and no stored value:**

- `MarkupPane.svelte` and every other file name inside the folder, including `markup-pages.test.ts`.
- The tab id `'markup'` and everything that compares against it.
- The CSS classes and ids: `.markup-paper-container`, `#tab-markup`, `.tab-markup`.
- `PUBLIC_INCLUDE_MARKUP_INSIGHTS`.
- The `guide-markup-*` anchors (36 occurrences in `apps/web/src`, desk count 2026-11-22).
- Every i18n key, including `tab.markedScore`.
- `names.ts` `identifiers` (`:106-109`) and `persisted` (`:111-130`).

`names.ts` describes those as batch 3's work. **They are a later lane's, not yours.** **If a change you are about to make would alter a string a browser stores or a selector a test reads, stop and report.**

### 3b. The site that fails silently

`scripts/ratchets.mjs:78-85` holds a `MODULES` map of what each module under `apps/web/src/lib/` may import, keyed by **directory name, not by path**: `markup: ['reader', 'score', 'voice', 'analysis']` at `:83`. `moduleOfPath` (`:87-91`) returns the first path segment only when it is a key of that map, otherwise `null`; `:109` and `:113` guard the only MODULE check on a non-null value, so nothing breaches on null. `moduleOfSpec` (`:93-97`) resolves imports INTO the module the same way, and `:115` skips a null target.

**So renaming the directory without renaming the key turns the layering gate off for that module in both directions, and the gate still passes.** A green gate would mean the check was skipped. Rename the key to `melody` in the same commit, with its permitted list unchanged, and update the comment at `:76` if the names it gives change.

**Prove the gate is live before you commit:** add one forbidden import to a file in `melody/` (for example from `$lib/insights/insights`), run `node scripts/ratchets.mjs`, paste the MODULE breach into the report, and remove the import.

### 3c. Sites that will not move themselves

- `scripts/ratchets.json:16`, `"apps/web/src/lib/markup/MarkupPane.svelte": 1231`, rekeyed with the number unchanged. This one announces itself: `ratchets.mjs:72-74` reports a ceiling whose file no longer exists.
- `scripts/ratchets.mjs:83`, the `MODULES` key above, which does not announce itself.
- **`apps/web/src/lib/names.ts:110`: set `folder` to `today` and `after` both `apps/web/src/lib/melody/`. In the same commit change the "folder today" cell at `ARCHITECTURE.md:173`**, because `names-table.test.ts:52` and `:70-73` compare the two cell by cell. Changing one without the other fails gate 4. **Leave `identifiers` and `persisted` alone.**
- Prose outside `docs/memory/` that names the folder: `ARCHITECTURE.md:137-138`, `:164`, `:237`; `AGENTS.md:11`; `docs/house-style/code-conventions.md:11`. Re-point the folder name only; do not edit those documents' claims about the rest of batch 3.
- Tests that read a source file under the folder by a relative path a grep for `lib/markup` misses: `components/Paper/one-head-one-foot.test.ts:22` (`'../../markup/MarkupPane.svelte'`), `components/footer-credit.test.ts:42` (`'../markup/MarkupPane.svelte'`), `stand-in-borrowing.test.ts:170` (`'./markup/MarkupPane.svelte'`).
- Tests that read by a path from the working directory: `components/Paper/blank-states.test.ts:101`, `:119`, `:167`, `:175`, `:233`; `markup/profile-status.test.ts:51` and `:55`.
- The hand-written key index at `i18n.ts:50`, `:51`, `:54`, `:63`, `:89`, `:91`, which `i18n-index.test.ts:62` checks with `existsSync`.
- `apps/web/src/lib/markup/strophic-byte-baseline.json` moves with the folder; it is read at `strophic-byte-baseline.test.ts:29` by `new URL('./strophic-byte-baseline.json', import.meta.url)`, and the string `markup` occurs zero times inside it (Fable's read).
- `docs/memory/` is **not** yours: the desk re-points its citations itself after the merge.

### 3d. A directory on disk that is not in the repository

**`apps/web/src/lib 2` exists on disk and is untracked by git** (desk check 2026-11-22: `git ls-files "apps/web/src/lib 2"` returns zero files). It is a synchronization conflict copy on Dann's machine and it contains its own `markup/`. **Exclude it from every grep and every edit. Do not move it, do not delete it, do not report its contents as findings.** If a sweep count looks inflated, this is why.

**Done when:** `apps/web/src/lib/melody/` exists, `apps/web/src/lib/markup/` does not, `scripts/ratchets.mjs`'s `MODULES` carries `melody` with `markup` gone, all eight gates sit at baseline, and **a grep for `markup/` (not only `lib/markup`) across `apps`, `packages`, `scripts`, `tests`, `ARCHITECTURE.md`, and `AGENTS.md`, excluding `lib 2`, returns only lines this brief says stay, each one listed in the report.**

Stale comments a narrower grep would leave, which you fix: `i18n.ts:1472`, `insights/insights.ts:55` and `:57`, `page-fit.ts:21`, `e2e/melody-no-score-count.test.ts:6`, `markup/MarkupPane.svelte:23`, `markup/key-correction-transposition.test.ts:2`, `markup/profile-status.test.ts:53`.

### 3e. The rename changes built bytes by itself

Svelte's default `cssHash` hashes the component's file name (`node_modules/svelte/src/compiler/validate-options.js:73-74`, path taken relative to the working directory), and vite-plugin-svelte replaces it only under hot reload. **So the five `.svelte` files in the folder get new scoped class names after the move.** A build before step 1 and one after it will differ in those names. **That is expected and is not a finding.** This is Fable's inference from reading, not from a build; if your own builds show otherwise, say so. It is also why step 0 lands first: its done-when has to be measured before the rename moves the bytes.

## 4. The rest of batch 3, which this lane does NOT build

Established by the desk in the tree 2026-11-22. Every item below is still open. **Report any of these you touch by accident; build none of them.**

| part | today | after | source | still open |
|---|---|---|---|---|
| identifiers | `markup`, `MarkupPane` | `melody`, `MelodyPane` | `names.ts:106-109` | yes |
| the folder | `lib/markup/` | `lib/melody/` | `names.ts:110` | **this lane** |
| stored tab id | `'markup'` | `'melody'`, keeping a read of `'markup'` | `names.ts:112-117` | yes |
| guide anchors | `guide-markup-*` | `guide-melody-*`, a second migration step | `names.ts:118-123` | yes, 36 sites |
| i18n key | `tab.markedScore` | `tab.melody` | `names.ts:124-129` | yes, `tab.melody` absent |
| profile store key | `shane.profiles.v2` | an `ilya:` key | `code-conventions.md:41` | yes, `profileStore.ts:75` |
| hyphenated i18n keys | 94 keys with a hyphen in a segment | no hyphens | `code-conventions.md:43` | NOT ESTABLISHED, not recounted |
| `console.placeholder`, `cosmetic.heading`, `songs.heading` | as named | screen names | `code-conventions.md:11` | NOT ESTABLISHED |

**One contradiction in the tree, for the desk and not for you.** `code-conventions.md:11` lists `BAND_IDS.scoreMarkup` among the exceptions "closed by batch 3", while `i18n.ts:155-156` says the key stays because `BAND_IDS.scoreMarkup` is a wire value. Two documents disagree. The desk resolves it; this lane touches neither.

The three parts of the comment convention this slice unblocks (`code-conventions.md:47`, `:49`, `:50`) belong to N.204 and are not built here.

## 5. Gates

All eight at baseline, from `~/Downloads/ilya-ship.sh`. Gate 4's baseline at `e8f64d4f` is `6804 passed | 1 skipped (6805)` and gate 5's is `911 passed | 5 skipped (916)`; where numpy and scipy are absent the script expects `6800 passed | 5 skipped (6805)` instead (`~/Downloads/ilya-ship.sh:185`, read by the desk 2026-11-22/23). Say which you got. Both figures were read from `~/Downloads/ilya-ship.sh:185` and `:187` by the desk 2026-11-22/23. Report what the script actually prints.

**Between the `git mv` and the last path fix, the tests in section 3c fail with file-not-found. That is expected.** The rule is about the final count: **if it differs from baseline when you are finished, stop and report rather than adjusting a baseline.** The same holds for the ratchets gate, with section 3b in mind: a pass there is evidence only once `MODULES` names `melody` and you have shown a breach fires.

Two phone tests are known to fail on an untouched tree and are not yours: `e2e-phone/insights-links.test.ts:32` and `e2e-phone/voice-stations.test.ts:62`, both sub-pixel.

## 6. This brief changes no computation

No number Ilya computes moves, so `CONTRACT.md` section 4's rule on naming every site that computes the same number does not apply. Say so in the report if you find otherwise, and stop.

## 7. What you could not establish

**NOT ESTABLISHED beats a complete invented answer.**

Report rather than guess: whether two builds differ in zero files once the name is fixed, and if not, which file and why; whether `readdirSync` order at `stamp-sw.mjs:49` is stable between two builds on one machine; whether any checked-in artefact encodes a `markup/` path in a form the section 3 greps would miss; whether anything outside `apps/web` reads that directory by path; and whether the scoped class names behave as section 3e says.

## 8. Two commits, one report

Commit 1 is step 0. Commit 2 is step 1. One report at `docs/sessions/report-code-batch3-slice1_r1_2026-11-22.md`. Write nothing under `docs/memory/`.
