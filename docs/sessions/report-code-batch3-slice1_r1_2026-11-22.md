# Report: consistency batch 3, first slice (build repeatability, then the folder `markup/` to `melody/`)

r1, written 2026-11-23 by the cloud lane (Sonnet 5.5) on `cloud-lane-84`, answering `brief-code-batch3-slice1-melody-folder-and-determinism_r3_2026-11-22.md` (committed at `94e133b3`).

**Read at:** branch `cloud-lane-84`, from `94e133b3`. A fresh clone with `pnpm install --frozen-lockfile`, so the tree was clean at the start. Node 22.23.5, pnpm 10.28.0, Linux, 4 cores.

**Commits.** Commit 1 is step 0 (`4a8100b`). Commit 2 is step 1 and carries this report, so its hash is the tip of the branch and is given in the hand-off message, not here. No pull request. Nothing written under `docs/memory/`. Neither `Shane` nor `main` was touched.

## Summary

- **Step 0 is done.** Two consecutive builds on one commit differ in **zero** of 218 files under `apps/web/build/`.
- **Step 1 is done.** `apps/web/src/lib/melody/` exists, `markup/` does not, and `MODULES` carries `melody`. The layering gate is shown live in both directions.
- **All eight gates sit at baseline after each commit.** Gate 4 reads `6800 passed | 5 skipped (6805)`, the brief's scipy-absent figure, because scipy is absent here (section 5).
- **No stored value, identifier, file name, selector, or i18n key was changed.**

## Instrument notes (read first)

1. **`~/Downloads/ilya-ship.sh` is not in this sandbox.** I could not run it. I reconstructed the eight gates from the repo's own scripts and from the gate table in `report-code-lane83_r1_2026-11-22.md`: 1 `packages/phonology` test, 2 `packages/dictionary` test, 3 `pnpm --filter @ilya/web check`, 4 `apps/web` test, 5 `packages/score-parser` test, 6 `packages/blurb` test, 7 `pnpm test:integration`, 8 `node scripts/ratchets.mjs`. **The script's own verdict logic was not run.** Gate 3's baseline (`0 errors, 12 warnings in 5 files`) is the lane 83 report's figure, not the brief's.
2. **The baseline was measured, not assumed.** I ran gates 4 and 5 on an untouched detached worktree of `94e133b3` before changing anything. Gate 4: `6800 passed | 5 skipped (6805)` (367 files). Gate 5: `911 passed | 5 skipped (916)`.
3. **`apps/web/src/lib 2` does not exist in this checkout** (`ls` returns "No such file or directory"). The exclusion was therefore not exercised, and no count here was inflated by it.

## Step 0: the build becomes repeatable

**Change.** `buildId()` moved from `vite.config.ts` into the new plain ES module `apps/web/build-id.js`, comment carried across and extended by one paragraph. `vite.config.ts` and `svelte.config.js` both import it. `svelte.config.js` sets `kit.version.name: buildId()` beside `pollInterval: 0`. `sw.js` and `stamp-sw.mjs` are untouched. Three files, +29 -18.

**Measurement.** Same machine, same commit, same environment. `pnpm --filter @ilya/web build` ran through `pnpm build` in `apps/web`, whose chain includes `stamp-sw.mjs`. The first `build/` was copied aside, the build was run again, and the two compared whole:

```
cp -a build <scratch>/build-first
pnpm build
diff -rq <scratch>/build-first build
```

Output: empty. Exit status 0. `find build -type f | wc -l` gave 218. `version.json` read `{"version":"94e133b3"}`. `sw.js` reads `CACHE_VERSION is now ilya-94e133b3` in both runs.

**Control.** The same two builds with step 0 reverted (`git stash`) gave **28 lines of `diff -rq` output**, for example `Only in ...ctrl-first/_app/immutable/entry: app.B17LRfEp.js` against `Only in build/_app/immutable/entry: app.0P331N5A.js`, and `version.json` reading `{"version":"1795422903522"}` (a `Date.now()` value). So the comparison can see the fault, and the repair removes it.

**After the rename.** Two more builds on the step 1 tree, at commit `4a8100b4`: `diff -rq` empty, exit 0. The step 0 property holds after the move.

**Reported, not repaired.**

- **Two deployments of one commit now share a version name.** I did not test `updated.check` or a service worker install. What I did observe: two builds of one commit give a byte-identical `sw.js`, so no new worker would install on a redeploy of the same commit. The staleness path through unhashed static files is as the brief describes (`static/sw.js:124-141`); I did not re-read it for this report. Production on Vercel is unaffected as the brief says, because each deployment has its own commit.
- **The `'unknown'` fallback did not fire in any build I ran.** Git was present and the tree is a git checkout every time. I exercised the function alone: `buildId()` called from `/tmp` (no repository) with `VERCEL_GIT_COMMIT_SHA` unset returns `"unknown"`, and with `VERCEL_GIT_COMMIT_SHA=abcdef0123456789` returns `abcdef01`. **I did not run a full build in the unknown state**, so that the version name is then the constant `unknown` is established for the function and inferred for the build (`kit.version.name` takes the function's return, `svelte.config.js`). Every such build would carry the same name, as the brief feared.
- **`readdirSync` order at `stamp-sw.mjs:49`.** Stable between two builds on this machine: `sw.js` was byte-identical across them, and the decoder-chunk list it embeds was the same six names in the same order. **NOT ESTABLISHED across machines or filesystems.** The walk is unsorted, so a different filesystem may order directory entries differently. I did not change it.
- **The 2026-11-19 measurement's gap** (only `_app`, `sw.js`, `index.html`) is closed for this machine: the comparison above covers all 218 files and found nothing.

## Step 1: the folder `markup/` becomes `melody/`

### Sweep counts, taken before the move

| what | count | how |
|---|---|---|
| files importing from `$lib/markup` | **4** | `git grep -lE '\$lib/markup'`: `components/Paper/LegendItems.svelte`, `markup/MarkupPane.svelte`, `stand-in-borrowing.test.ts`, `routes/+page.svelte` |
| files naming `markup/` in a string or comment | **18 files, 41 lines** | `git grep -nE 'markup/'` over `apps packages scripts tests ARCHITECTURE.md AGENTS.md` |
| test titles carrying the word | **23 lines** | `describe`, `it`, or `test` whose first quoted argument contains `markup` or `Markup`. An approximate pattern, not an exhaustive parse. **None were changed**, by the bright line. |
| tracked files in the folder | 24 | `git ls-files apps/web/src/lib/markup`; five of them `.svelte` |

Relative imports of the folder from outside it (`'../markup'`, `'./markup'`, without a trailing slash): zero.

### What changed

- `git mv apps/web/src/lib/markup apps/web/src/lib/melody` (24 files, all recorded as renames).
- `markup/` to `melody/` in the **path strings** of 14 files: `routes/+page.svelte`, `components/Paper/LegendItems.svelte`, `melody/MarkupPane.svelte` (`:23`, `:59`, `:1070`), the tests in section 3c (`blank-states.test.ts`, `one-head-one-foot.test.ts`, `footer-credit.test.ts`, `stand-in-borrowing.test.ts`, `melody/profile-status.test.ts`), the hand-written index at `i18n.ts:50`, `:51`, `:54`, `:63`, `:89`, `:91`, and the stale comments the brief lists (`i18n.ts:1472`, `insights/insights.ts:55` and `:57`, `page-fit.ts:21`, `e2e/melody-no-score-count.test.ts:6`, `melody/key-correction-transposition.test.ts:2`, `melody/profile-status.test.ts:53`), plus `provenance.ts:25`, a comment path the brief did not list.
- `scripts/ratchets.json:16` rekeyed to `apps/web/src/lib/melody/MarkupPane.svelte`, ceiling still 1231.
- **`scripts/ratchets.mjs` `MODULES`: the key `markup` became `melody`, permitted list unchanged** (`['reader', 'score', 'voice', 'analysis']`). The comment at `:76` names no module, so it needed no change.
- `names.ts:110`: `folder.today` set to `apps/web/src/lib/melody/`, `after` unchanged. `identifiers` and `persisted` untouched.
- Prose, folder name only: `ARCHITECTURE.md` (the module bullet, the Names paragraph, the `folder today` cell at the melody row, invariant 13's module list), `AGENTS.md:11` and `:21`, `docs/house-style/code-conventions.md:11`. In `ARCHITECTURE.md` and `AGENTS.md:11` I also wrote that the files and identifiers still say `markup` until the rest of batch 3. That clause states what is true now. It is the one place I wrote more than a bare re-point; strike it if you prefer.

### The gate is live (section 3b)

With `MODULES` renamed, I prepended `import { } from '$lib/insights/insights';` to `apps/web/src/lib/melody/legend.ts` and ran `node scripts/ratchets.mjs`:

```
ratchets: 1 breach(es):
  MODULE apps/web/src/lib/melody/legend.ts imports "$lib/insights/insights". melody/ may not import insights/.
exit 1
```

And the other direction, prepending `import { } from '$lib/melody/legend';` to `insights/insights.ts`:

```
ratchets: 1 breach(es):
  MODULE apps/web/src/lib/insights/insights.ts imports "$lib/melody/legend". insights/ may not import melody/.
```

Both files were restored from copies and `git diff` on `legend.ts` is empty. Clean `ratchets.mjs` afterwards: `ratchets: OK.` Neither probe is in either commit. I did not run the negative control (renamed folder, unrenamed key) to show the gate going silent; the brief's reading of `moduleOfPath` is what I relied on.

### The final grep

`markup/` across `apps packages scripts tests ARCHITECTURE.md AGENTS.md`, once with `git grep` (tracked) and once with `grep -r` on disk excluding `node_modules`, `build`, `.svelte-kit`, `test-results`, and `lib 2`: **zero lines**. So no line is left that "stays", and none needs listing. `docs/house-style` outside `code-conventions.md:11` has none either.

### What stays, on purpose (the bright line, checked and untouched)

`MarkupPane.svelte` and every file name in the folder, including `markup-pages.test.ts`; the tab id `'markup'` and its comparisons; `.markup-paper-container`, `#tab-markup`, `.tab-markup`; `PUBLIC_INCLUDE_MARKUP_INSIGHTS`; `guide-markup-*`; every i18n key including `tab.markedScore` and the `markup.` prefix row at `i18n.ts:54`; `names.ts` `identifiers` and `persisted`. No change I made altered a string a browser stores or a selector a test reads.

## Gates

| Gate | Baseline | after commit 1 | after commit 2 |
|---|---|---|---|
| 1 phonology | 462 passed | 462 passed | 462 passed |
| 2 dictionary | 248 passed | 248 passed | 248 passed |
| 3 web check | 0 errors, 12 warnings in 5 files | same | same |
| 4 web test | `6800 passed \| 5 skipped (6805)` | same | same, 367 files |
| 5 score-parser | `911 passed \| 5 skipped (916)` | same | same |
| 6 blurb | 178 passed | 178 passed | 178 passed |
| 7 integration | 159 passed | 159 passed | 159 passed |
| 8 ratchets | OK | OK, exit 0 | OK, exit 0, and `MODULES` names `melody` with a breach shown |

**Which gate 4 figure:** `6800 passed | 5 skipped (6805)`, the brief's numpy-and-scipy-absent figure. `import scipy` fails here. It is not the `6804 | 1` figure. The final count equals the baseline measured on the untouched tree, so no baseline was adjusted. I did not see the "file-not-found between the move and the last fix" failures, because I ran no gate between the `git mv` and the last path fix.

Playwright suites were not run (they are not among the eight). The two phone tests the brief names as failing on an untouched tree were therefore not exercised.

## Section 3e: the scoped class names

**Confirmed, with a caveat.** I built the pre-rename tree (step 0, version `94e133b3`) and the post-rename tree (version `4a8100b4`) and listed the `svelte-<hash>` strings in `_app/immutable`. Each has 86 distinct; 81 are common; **exactly five differ on each side**, and the folder holds five `.svelte` files. Pre-only: `svelte-15pbkcu`, `svelte-17d2abh`, `svelte-3oifd3`, `svelte-iwuqet`, `svelte-lot036`. Post-only: `svelte-121lfdx`, `svelte-17nemil`, `svelte-1satwab`, `svelte-7lselq`, `svelte-8jdapm`. **I did not map each hash to its file**, so "one per file" is the count's fit, not a per-file proof. **The two builds also carry different version names** (the commit changed), so the 30-line `diff -rq` between them (4 files in common differ: `version.json`, `index.html`, `notation-font-lab.html`, `sw.js`; 26 `Only in`) is not attributable to the rename alone. The two post-rename builds against each other are identical.

## Section 7: what I could not establish

- **A full build in the `'unknown'` state.** Function only (above).
- **`readdirSync` order across machines.** Same-machine stable only.
- **The per-file mapping of the five changed scoped class names**, and whether any hashed name is stored anywhere a user keeps it. I read no stored value.
- **Any checked-in artefact encoding a `markup/` path that the greps would miss.** The greps in this report found none in tracked files or on disk under the six scoped roots. `strophic-byte-baseline.json` carries zero occurrences of `markup` (`grep -ci`). I did not read binary or generated artefacts outside those roots.
- **Anything outside `apps/web` reading the directory by path.** None found in `packages`, `scripts` (apart from `ratchets.json` and `ratchets.mjs`, both fixed), `tests`, `tools`, `.github`, `.claude`, `workflows`, `vercel.json`, or the root config files. `markup-pages.test.ts` lists tracked files with `git ls-files` and so follows the move by itself.
- **The Mac, and `lib 2`.** Neither is reachable from this sandbox.

## Found, not fixed

- **`code-conventions.md:11` says the folder has "15 files".** `git ls-files` finds **24** in it. I re-pointed the folder name only, as briefed, and left the count. It was already stale before this lane.
- **Residual mentions of `markup/` in the records:** `lib/markup` or `markup/` appears on 699 lines in 231 files under `docs/memory/` and `docs/sessions/`. Those are the desk's to re-point and mostly history. Not touched.
- **Section 4's open parts were not touched by accident.** The contradiction at `code-conventions.md:11` against `i18n.ts:155-156` (`BAND_IDS.scoreMarkup`) is untouched.
- **No computation moved.** `CONTRACT.md` section 4's rule on naming every site that computes a number does not apply.
