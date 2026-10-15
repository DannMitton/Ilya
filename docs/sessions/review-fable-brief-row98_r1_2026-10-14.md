# Fable review of the row 98 brief (one engine, two branches), r1

Reviewer: Fable 5.1, 2026-10-14. Brief: `/home/claude/b98/brief-code-row98-one-engine-and-two-branches_r1_2026-10-14.md`. Checked against the clone of `Shane` at `50a5f85` in `/home/claude/shanebuild`, its completed build in `apps/web/build`, the installed `onnxruntime-web@1.30.0` and `homr-web@0.2.0-ilya.7`, Vercel's Git configuration page (fetched this session, last updated 2026-08-25), and one end-to-end run of the scan reader in headless Chromium 1194 against the desk's server on port 5199.

## Verdict

SEND WITH AMENDMENTS. The facts in the brief are right; every `path:line` is confirmed. The brief leaves four things to Code's invention that this session could establish, and the Vercel rule as written does not match Dann's words. Nothing in it is unsound.

## Citations

| Citation | Status |
|---|---|
| `apps/web/src/lib/omr/homr-reader.ts:34` names `scripts/copy-ort-wasm.mjs` | CONFIRMED (line 34 of the header comment) |
| `homr-reader.ts:54` `ORT_WASM_BASE = '/omr/ort/'` | CONFIRMED |
| `homr-reader.ts:407` passes `wasmPaths: ORT_WASM_BASE` | CONFIRMED |
| `metre-model.ts:21` `const ORT_WASM = '/omr/ort/'` | CONFIRMED |
| `metre-model.ts:66` `ort.env.wasm.wasmPaths = ORT_WASM` | CONFIRMED |
| Build 480 MB; `omr` 245 MB, `data` 166 MB, `_app` 60 MB | CONFIRMED (`du -sh`) |
| Two engine copies, 27 MB each | CONFIRMED: `build/omr/ort/ort-wasm-simd-threaded.jsep.wasm` and `build/_app/immutable/workers/assets/ort-wasm-simd-threaded.jsep-MDYUKy93.wasm`, both 28,312,028 bytes |
| The worker chunk refers to the `_app` copy through `import.meta.url` | CONFIRMED, and there are two such chunks, not one: `_app/immutable/workers/worker-e4J_OzDd.js` (homr-web's worker, 583 KB) and `_app/immutable/workers/chunks/0MBk74_Z.js` (onnxruntime for `metre.worker`, 414 KB, imported at `metre.worker-njRMdkIX.js`). No main-thread chunk refers to it. |
| `build/omr/ort/ort-wasm-simd-threaded.wasm` 13.6 MB, not jsep | CONFIRMED (14,239,897 bytes) |
| The second `input[type=file]` takes the score | CONFIRMED: two inputs on the page; index 1 took the PNG and the reader ran |
| `vercel.json` (root): `installCommand`, `buildCommand`, `outputDirectory`, `framework`, `headers` | CONFIRMED; no `git` key today |
| Vercel docs: minimatch, unspecified branches default to true | CONFIRMED, and one more sentence matters (amendment 1) |
| Remote branches | `Shane`, `main`, `cloud-lane`, `cloud-lane-2` to `cloud-lane-6`, `v7-rebuild`. No `audit*` branch exists on the remote today. |

## What this session established beyond the brief

1. **The reading completes in headless Chromium 1194.** On the unchanged build, the scan reader read the page in 97,115 ms on wasm and logged `[omr] homr read 1 of 1 pages of p-1.png in 97115 ms on wasm (the WebGPU adapter lacks shader-f16, which the fp16 models need)`; `.receipt-score` became visible; the metre reader logged `[omr] metre: page read in 9.5 s, 10 windows, 1 stating a signature`; no response was 4xx or 5xx. Requests matching the brief's pattern: three homr `.onnx` models under `/omr/models/<sha256>/`, `/omr/ort/ort-wasm-simd-threaded.jsep.mjs`, `/omr/ort/ort-wasm-simd-threaded.jsep.wasm`, and the three metre files under `/omr/models/metre/`. The `_app` copy was never requested. Step 4 is executable in a cloud Linux box.

2. **Why the `_app` copy exists, and the mechanism that removes it.** `onnxruntime-web`'s package.json `exports["."].import.default` is `./dist/ort.bundle.min.mjs`, which inlines the Emscripten glue and contains `new URL("ort-wasm-simd-threaded.jsep.wasm", import.meta.url)` twice; Vite's asset handling emits that file. The same package declares an export condition, `onnxruntime-web-use-extern-wasm`, that resolves `"."` to `./dist/ort.min.mjs` instead; that file has no `new URL("…wasm", import.meta.url)` (its only literal `new URL` self-reference is written through an aliased constructor, which Vite does not transform) and always imports `ort-wasm-simd-threaded.jsep.mjs` from `wasmPaths`. Both importers (homr-web's `dist/models/backend.js:11` and the app's `metre-model.ts:65`) import bare `onnxruntime-web` and both are bundled by Vite, so one resolver setting covers both. Vite is 6.4.1 and exports `defaultClientConditions`.

3. **No code path reaches the `_app` copy while `wasmPaths` is set.** In the built chunks the hashed URL appears in two places: the Emscripten `locateFile` fallback, taken only when `locateFile` is absent, and a proxy-worker default taken only when `wasmPaths` is unset. homr-web sets `env.wasm.wasmPaths` (`dist/models/backend.js:126-128`) from the option `homr-reader.ts:407` passes, and sets `env.wasm.proxy = false` (`backend.js:131`); `metre-model.ts:66` sets `wasmPaths` before any session. onnxruntime 1.30 ships one wasm per variant (`-simd-threaded`), so wasm-threads and single-thread load the same file; WebGPU uses the same jsep file. The relative prefix `/omr/ort/` in `metre-model.ts` works: onnxruntime's URL normaliser throws on a relative base, returns undefined, and the fallback concatenates `/omr/ort/` + the file name, which this run's requests show.

4. **Nothing references the non-jsep pair.** No file in the repository imports `onnxruntime-web/wasm` (the only export that names `ort-wasm-simd-threaded.wasm`); `ort.min.mjs` names only `ort-wasm-simd-threaded.jsep.mjs`. `ort-wasm-simd-threaded.wasm` (14.2 MB) and `.mjs` (24 KB) are copied by `copy-ort-wasm.mjs:49-50` and never requested. Leaving them is right for this row; removing them is a later row for Dann.

5. **WebGPU cannot be forced here.** The headless adapter exists and lacks `shader-f16`, so `path-choice.ts` chooses wasm. NOT ESTABLISHED for WebGPU is the expected outcome of step 4 in any cloud box.

6. **The desk's `scan.mjs` cannot answer "did a reading come back".** Its loop stops 35 s after the first `.onnx` request; the reading took 97 s.

## Amendments

### 1. Step 1: the Vercel rule as an allow-list, to match Dann's words

Reason. Dann said *"build only `Shane` and `main`"*. The brief's deny-list leaves `v7-rebuild` and every future branch building. Vercel's page says: *"If a branch matches multiple rules and at least one rule is `true`, a deployment will occur."* That sentence makes an allow-list expressible: a wildcard `false` and two named `true`. The docs give no wildcard-`false` example, so the first push on `cloud-lane-7` tests the `false` side and the next merge to `Shane` tests the `true` side. If `Shane` fails to auto-deploy after that merge, the fallback is the brief's deny-list form with `v7-rebuild` added.

Replace the first paragraph of Step 1 with:

> Add to the repository's `vercel.json` (root) this `git` key, keeping every existing key:
>
> ```json
> "git": {
>   "deploymentEnabled": {
>     "**": false,
>     "Shane": true,
>     "main": true
>   }
> }
> ```
>
> Vercel's documented form (https://vercel.com/docs/project-configuration/git-configuration): keys are minimatch patterns, unspecified branches default to true, and *"if a branch matches multiple rules and at least one rule is `true`, a deployment will occur."* So `Shane` and `main` match `**` (false) and their own name (true) and build; every other branch matches only `**` and does not. Note in the report that this branch's own push is the first test of the `false` side: if Vercel builds `cloud-lane-7` after this commit, say so. The `true` side is tested at the next merge to `Shane`; if `Shane` then fails to auto-deploy, the fallback is `{"cloud-lane*": false, "audit*": false, "v7-rebuild": false}`.

### 2. Step 3: name the mechanism to try first, with its evidence

Reason. The brief leaves the mechanism to Code's invention. This session established one that needs no plugin and covers both importers; naming it saves Code a search and gives the report its `path:line`.

Append to Step 3:

> Try first: onnxruntime-web's own export condition. Its `package.json` `exports["."].import` has `"onnxruntime-web-use-extern-wasm": "./dist/ort.min.mjs"` and `"default": "./dist/ort.bundle.min.mjs"`. The default inlines the Emscripten glue and holds `new URL("ort-wasm-simd-threaded.jsep.wasm", import.meta.url)` twice, which is what Vite emits; `ort.min.mjs` holds no such call and always imports `ort-wasm-simd-threaded.jsep.mjs` from `wasmPaths`. In `apps/web/vite.config.ts` add, with a comment in the file's existing voice:
>
> ```ts
> import { defineConfig } from 'vitest/config';
> import { defaultClientConditions } from 'vite';
> // …
> resolve: { conditions: ['onnxruntime-web-use-extern-wasm', ...defaultClientConditions] },
> ```
>
> Both importers are bundled by Vite (homr-web's `dist/models/backend.js:11` inside `_app/immutable/workers/worker-*.js`, and `metre-model.ts:65` inside `_app/immutable/workers/chunks/*.js`), so one setting covers both. Verify: after the build, `find apps/web/build -name '*ort-wasm*'` lists only the four files under `build/omr/ort/`, and `grep -rl 'ort-wasm-simd-threaded' apps/web/build/_app` names chunks that contain the string `ort-wasm-simd-threaded.jsep.mjs` and no `assets/ort-wasm-…wasm` path. If `svelte-check` or the SSR build objects to the condition, fall back to `resolve.alias: { 'onnxruntime-web': 'onnxruntime-web/dist/ort.min.mjs' }` and report why.

### 3. Step 4: the success signals, the wait, and the server

Reason. "A reading with notes comes back" has two concrete signals in the code; the desk's `scan.mjs` stops before the reading ends (97 s on wasm here); the server and the PNG are left to Code's invention.

Replace the first bullet of Step 4 with:

> - Serve `apps/web/build` with `python3 -m http.server 5199 --bind 127.0.0.1` run from that folder (Python 3.13 answers `.mjs` as `text/javascript` and `.wasm` as `application/wasm`; check `curl -sI` on `/omr/ort/ort-wasm-simd-threaded.jsep.mjs` if your Python is older). Make the PNG with `pdftoppm -r 300 -f 1 -l 1 -png tools/e16-harness/scans/sunless-01-v-chetyryokh-stenakh_lamm-scan.pdf <out>`. Launch Chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` with viewport 1440 by 1000, give the PNG to the second `input[type=file]`, and wait up to seven minutes for one of two console lines: `[omr] homr read N of M pages of <file> in <ms> on <backend>` (`apps/web/src/lib/omr/scan.ts:107-110`, success; require N ≥ 1) or `[omr] homr did not read <file>: <error>` (`scan.ts:96`, failure). Then confirm `.receipt-score` is visible (the e2e suite's own signal, `apps/web/e2e/insights-page.test.ts:60`). Record every request matching `ort-wasm|\.onnx|/omr/`, with duplicates, and every response with status 400 or more. On the unchanged build here the reading took 97 s on wasm. Run it on the wasm path; the headless adapter lacks `shader-f16`, so WebGPU is NOT ESTABLISHED in this box; say so.

### 4. Step 4: how to attribute the metre engine load

Reason. The jsep `.mjs` and `.wasm` are requested by two workers; a de-duplicated list cannot show the second.

Replace the second bullet of Step 4 with:

> - The metre model: it runs in its own Worker (`metre-client.ts:23`), so expect `/omr/ort/ort-wasm-simd-threaded.jsep.mjs` and `.wasm` twice in the undeduplicated request list, once per worker, with the line `[omr] metre: page read in … s` in the console. If the second pair is absent (served from cache without a request event), report the static evidence instead: `metre-model.ts:66` sets `wasmPaths` before any session, and the metre worker's chunk after the change holds no `assets/ort-wasm-…wasm` path. Say which you had.

### 5. The non-jsep pair: give Code the answer to confirm, not to find

Replace the last bullet under "The facts the desk measured" with:

> - `build/omr/ort/ort-wasm-simd-threaded.wasm` (13.6 MB) and `.mjs` (24 KB), the non-jsep pair, are copied by `scripts/copy-ort-wasm.mjs:49-50` and referenced by nothing: no file in the repository imports `onnxruntime-web/wasm`, and `ort.min.mjs` names only `ort-wasm-simd-threaded.jsep.mjs`. Leave them (Dann asked about the duplicate, not about them). Confirm by grep after your build and put one line in the report; removing them is a later row.

### 6. Constraints: the gates by name

Append to Constraints:

> The eight gates and their baselines are in `docs/sessions/measure-4f-quadruplet_2026-10-12/gates-scratch.sh:78-117`; the cloud-clone notes (`PW_CHROMIUM_PATH`, pnpm 12's `allowBuilds` lines in `pnpm-workspace.yaml`, pushes) are `docs/memory/ENVIRONMENT.md`, section "THE GATES RUN IN A CLOUD CLONE".

### 7. Report: one owed line

Append to Report:

> One line that the WebGPU path (the Mac's path) is owed a run before `cloud-lane-7` merges, because the cloud box cannot take it; and one line on `metre-model.ts:13-14`, whose header says the network runs in the page's own thread while `metre-client.ts:23` runs it in a Worker (a stale comment; do not fix here).

## What the brief forbids or invites, checked

- Nothing it forbids is needed. `/omr/ort/` stays, `wasmPaths` stays, no model, dictionary, or font is touched, `docs/memory/` is untouched.
- It invites nothing beyond Dann's two sentences, except the `audit*` pattern, which is harmless and which amendment 1 subsumes.
- `CONTRACT.md:75` has the cloud lane's ruling *"the scan reader stays on the Mac."* This brief changes how the scan reader's engine is bundled, in the cloud lane. The ruling's reason (the Mac has the WebGPU path) is met by amendment 7's owed line; the desk decides whether that is enough.

## What I could not establish

- Whether Vercel accepts `"**": false` beside named `true` keys exactly as the "at least one rule is true" sentence implies. The docs show no wildcard-false example. The first push tests one side, the next merge the other; the fallback is written in amendment 1.
- Whether SvelteKit's Vite plugin sets `resolve.conditions` of its own that the amendment 2 setting would displace. A grep of `@sveltejs/kit/src/exports/vite/index.js` found none; the build is the test.
- Whether `pdftoppm` exists in Code's cloud box. It is at `/usr/bin/pdftoppm` here.
- Whether the WebGPU path works at all after the change. No cloud box can answer it.
- Whether the Vercel project's Root Directory is the repository root. The root `vercel.json` carrying `installCommand` and `outputDirectory: apps/web/build` says it is; I did not open the project's settings.
- The library and version behind `getOrInsertComputed is not a function` on the PDF path. Not looked at; out of this review's scope.
