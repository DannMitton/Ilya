# Brief: QUEUE row 98, one copy of the reader engine, and Vercel builds only Shane and main (r2)

Desk (Opus 5.5), 2026-10-14 about 22:55. For Code (cloud lane, Sonnet), on `Shane` at `50a5f85` or later. r2 2026-10-14 about 23:05: Fable reviewed (`review-fable-brief-row98_r1_2026-10-14.md`, SEND WITH AMENDMENTS; it ran the unchanged build: the reader read the page in 97 s on wasm, only `/omr/ort/` requested). Its seven amendments below are binding and override any line above they contradict. DESK DEFAULT on the review's CONTRACT point: the WebGPU path is checked on the alias by Dann reading one scan after the ship; the commit is reverted if it fails. Dann 2026-10-14 22:42: *"Remove the duplicate reader engine, if it is one. Ensure that its deletion has no bad consequence."* and *"Yes please set Vercel to build only `Shane` and `main`"*.

## What must be true

**Done when:** (a) a commit to any branch named `cloud-lane…` or `audit…` starts no Vercel build, while `Shane` and `main` still do; (b) the built site holds one copy of onnxruntime's `ort-wasm-simd-threaded.jsep.wasm` (today two, 27 MB each); (c) the scan reader still reads a page end to end in a browser, loading the engine from `/omr/ort/`; (d) all eight gates pass.

## The facts the desk measured (2026-10-14, build of `50a5f85` in the desk's workspace)

- The build is 480 MB: `build/omr` 245 MB, `build/data` 166 MB, `build/_app` 60 MB.
- The engine is in the build twice: `build/omr/ort/ort-wasm-simd-threaded.jsep.wasm` (copied by `apps/web/scripts/copy-ort-wasm.mjs`, named at `apps/web/src/lib/omr/homr-reader.ts:34`) and `build/_app/immutable/workers/assets/ort-wasm-simd-threaded.jsep-<hash>.wasm` (emitted by Vite; the worker chunk refers to it through `import.meta.url`).
- The code points the engine at `/omr/ort/` on both paths: `ORT_WASM_BASE` (`homr-reader.ts:54`), passed as `wasmPaths` at `:407`; `ORT_WASM` (`metre-model.ts:21`), set at `:66`.
- At run time (desk's Playwright run on the built site, headless Chromium, wasm path, a PNG of page 1 of `tools/e16-harness/scans/sunless-01-v-chetyryokh-stenakh_lamm-scan.pdf` at 300 dpi given to the score file input, the second `input[type=file]`), the browser requested `/omr/ort/ort-wasm-simd-threaded.jsep.mjs` and `/omr/ort/ort-wasm-simd-threaded.jsep.wasm`, and never the `_app` copy. Whether the reading completed was not checked.
- `build/omr/ort/ort-wasm-simd-threaded.wasm` (13.6 MB, not jsep) was not requested in that run. Leave it: other paths may use it. Report whether anything references it.

## Step 1. The Vercel rule

Add to the repository's `vercel.json` (root) a `git.deploymentEnabled` map that turns off `cloud-lane*` and `audit*` (Vercel's documented form, https://vercel.com/docs/project-configuration/git-configuration: unspecified branches default to true, patterns use minimatch). Keep every existing key. Note in the report that this branch's own pushes are the first to test it: if Vercel builds `cloud-lane-7` after this commit, say so.

## Step 2. Measure first

Build (`pnpm --filter @ilya/web build`), record the build's total size and both engine copies' paths and sizes. Run the scan check in step 4 on this unchanged build and record what it requests and whether a reading comes back (notes drawn, or the reading object with notes; say which you used).

## Step 3. Remove the Vite-emitted copy

Make the build stop emitting the `_app` copy while the code keeps loading `/omr/ort/`. The mechanism is yours (for example a Vite or Rollup setting or plugin that drops that asset, or importing onnxruntime-web in a form that carries no `new URL(…wasm…)`); report what you chose and why, with `path:line`. Do not move or rename `/omr/ort/`, and do not change `wasmPaths`.

## Step 4. Prove nothing broke

On the changed build, served locally:
- The scan check: upload the same PNG; record every request matching `ort-wasm|\.onnx|/omr/`; confirm no request 404s and that a reading with notes comes back. Run it on the wasm path; if a WebGPU path can be forced in this environment, run it there too, otherwise say NOT ESTABLISHED for WebGPU.
- The metre model: confirm its engine load also comes from `/omr/ort/` (it runs during a scan reading; cite the request or say NOT ESTABLISHED).
- A MusicXML upload still works (the PDF and MuseScore paths are out of scope).
- Record the new build size.

## Constraints

- Do not edit `docs/memory/`. Commit to `cloud-lane-7` only (the cloud lane rule).
- No change to what a singer sees. No model file, dictionary file, or font is touched.
- Run all eight gates before and after.

## Found by the desk, not for this row

The PDF path failed in headless Chromium 1194 with "getOrInsertComputed is not a function" (`[ScoreUploader] the PDF could not be rasterized`). Do not fix it here; if you can name the library and version that calls it, add that to the report.

## Report

`docs/sessions/report-code-row98-one-engine-and-two-branches_r1_2026-10-14.md`: the answer in three lines; the build size before and after; the mechanism (`path:line`); every request from the scan check before and after, and whether a reading came back each time; the metre model; the MusicXML check; the gates; what could not be established. NOT ESTABLISHED beats a complete invented answer.


## Amendments from Fable's review, binding

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
