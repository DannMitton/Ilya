# The three builds and the determinism proof

**Command, each build:** `pnpm build` in `apps/web` (the package script: `copy-pdfjs-wasm`, `copy-ort-wasm`, `copy-heif-wasm`, `fetch-omr-models`, `copy-metre-model`, `copy-underlay-model`, `vite build`, `stamp-sw`). **Output directory:** `apps/web/build/` of each clone. Run under `NODE 22.23.5`, `pnpm 10.28.0`, no `VERCEL_GIT_COMMIT_SHA` set.

**Clean state.** Each build has its own clone (`git clone --no-hardlinks` of the session's repository, then `git checkout <commit>`), its own `node_modules` from `pnpm install --frozen-lockfile`, no `.svelte-kit`, no `build/`, no `static/` generated folders. **Shared between them: pnpm's content-addressed package store (read only) and the network.** Neither carries build output. Whether the store could carry a build difference is NOT ESTABLISHED, but the store holds downloaded packages and no step of the build writes to it.

| build | commit | clone | `TZ` | started (UTC) | finished (UTC) | files | bytes |
|---|---|---|---|---|---|---:|---:|
| 1 | `b2869772` | A | `UTC` | 04:40:53 | 04:41:24 | 218 | 478,881,059 |
| 2 | `b2869772` | B | `Pacific/Kiritimati` (UTC+14) | 04:42:58 | 04:43:24 | 218 | 478,881,059 |
| 3 | `93edb360` | C | `America/St_Johns` | after 04:41:24, before 04:42:32 | 04:42:32 | 218 | 478,881,059 |

Build 1 and build 2 start **2 minutes 5 seconds** apart (brief: at least one minute). An earlier attempt at build 2 (clone `B-first-attempt`, 04:41:32, **39 seconds** after build 1, under the same `TZ=Pacific/Kiritimati`) did not meet the one-minute rule, so it was thrown away and build 2 was redone in a fresh clone. **That discarded attempt's file list is also identical to build 1's** (same sha256 of the list, `a02a9461…`), kept here as extra evidence and not as the build of record.

**The comparison.** For each build, the sorted list of output paths with each file's size and sha256 (`builds/*.files.txt`, one line `sha256  size  path`), compared as sets.

* **Build 1 against build 2: identical.** 218 paths each, every size and sha256 equal. The two lists have the same sha256: `a02a9461675adb7e580dc09e552ee89eea7684d56faa2a5c999ee5b7f3775180`. **The build reproduces itself across a clock gap and across timezones UTC and UTC+14.**
* **Build 1 against build 3: 4 files differ at the same path and 12 are renamed; 202 are byte-identical.** The source is identical (`git diff --stat b2869772..93edb360 -- apps packages scripts` printed nothing), so these are what the stamp alone moves. See `../STAMP-FOOTPRINT.md`.

## How the stamp is computed (read, not inferred)

* `apps/web/build-id.js:17-23`, `buildId()`: returns `process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 8)` if that variable is set, else the output of `git rev-parse --short=8 HEAD` run in the current directory, else the literal `'unknown'`.
* `apps/web/svelte.config.js:19-25` sets `kit.version.name: buildId()` and `pollInterval: 0`. SvelteKit writes that name to `build/_app/version.json`.
* `apps/web/vite.config.ts:12` defines `__ILYA_BUILD__` as `JSON.stringify(buildId())`, which the bundler inlines into two chunks.
* `apps/web/scripts/stamp-sw.mjs` reads `_app/version.json` and replaces every `__BUILD_VERSION__` in `build/sw.js` with it, so `CACHE_VERSION` becomes `ilya-<commit>`. It exits non-zero if it cannot stamp.
* **Can it be pinned?** Yes: set `VERCEL_GIT_COMMIT_SHA` to any string whose first eight characters are the value wanted. Not done here, because the brief wants each lane's own commit; it would let a later lane build at its own commit and still match the stamp of this baseline. Whether a later lane may do that is the desk's call.
* **A caution about the fallback.** If `git` is absent or the directory is not a repository, the stamp is `'unknown'` and every build of every commit would carry the same stamp, which would defeat N.72. Not tested here.

## The determinism history, checked against the tree

`report-desk-n204-phase0-baseline_r1_2026-11-19.md` section 6 says two builds of one tree differed in 15 files because `kit.version.name` was unset and SvelteKit fell back to `Date.now()`, and that the repair is to point `kit.version.name` at `buildId()`. **The tree agrees with the record:** `svelte.config.js` now carries that line, with a comment that says why. The repair is in the tree at `b2869772`, and the measurement above (two builds, no differences) is the proof that it works on this container. The commit that made the repair is `4a8100b4` ("Step 0: the build becomes repeatable (kit.version.name is the commit)"), read from `git log` on `build-id.js`; the desk's record says N.211, and I did not look for that label.
