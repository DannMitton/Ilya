# Report: QUEUE row 98, one copy of the reader engine, and Vercel builds only Shane and main (r1)

Code (cloud lane, Sonnet 5.5), 2026-10-14. Branch `cloud-lane-7`, from `origin/Shane` at `0b0c52a`. Change commit `10d6553`. Brief: `brief-row98_r2_2026-10-14` (with Fable's seven amendments), saved to `/tmp/briefs/`, not committed. Nothing under `docs/memory/` was touched. No pull request.

## The answer in three lines

1. The built site now holds one copy of `ort-wasm-simd-threaded.jsep.wasm` (under `build/omr/ort/`), and the build is 480 MB, down to 453 MB. One setting in `apps/web/vite.config.ts` did it.
2. The scan reader read page 1 of the Lamm scan end to end on the wasm path before and after, with the identical ten requests, no 400 or worse, and the engine loaded from `/omr/ort/` by both the reader and the metre model. All eight gates are unchanged.
3. `vercel.json` now carries the allow-list. Its `false` side is NOT YET ESTABLISHED (see Vercel, below); its `true` side is untested until the next merge to `Shane`. WebGPU is NOT ESTABLISHED.

## Build size

Measured with `du -sm` on the same clean clone, before and after the one setting.

| | before | after |
|---|---|---|
| `apps/web/build` | 480 MB | 453 MB |
| `build/omr` | 245 MB | 245 MB |
| `build/data` | 166 MB | 166 MB |
| `build/_app` | 60 MB | 33 MB |

Engine files (`find apps/web/build -name '*ort-wasm*'`):

- Before: `omr/ort/ort-wasm-simd-threaded.jsep.wasm` 28,312,028 bytes; `_app/immutable/workers/assets/ort-wasm-simd-threaded.jsep-MDYUKy93.wasm` 28,312,028 bytes; plus `omr/ort/ort-wasm-simd-threaded.jsep.mjs` 46,851, `ort-wasm-simd-threaded.mjs` 24,381, and `ort-wasm-simd-threaded.wasm` 14,239,897.
- After: only the four under `omr/ort/`, same sizes. The `_app` copy is gone.

`grep -rl 'ort-wasm-simd-threaded' apps/web/build/_app` after: `workers/worker-7aFnp5lO.js` and `workers/chunks/coansDkg.js`. `grep -rhoE` over `_app` finds exactly two matches, both the string `ort-wasm-simd-threaded.jsep.mjs`, and no `assets/ort-wasm-…wasm` path.

## The mechanism

`apps/web/vite.config.ts`: `import { defaultClientConditions } from 'vite'` and `resolve: { conditions: ['onnxruntime-web-use-extern-wasm', ...defaultClientConditions] }`, with a comment in the file's voice. It was the first mechanism the brief named, and it worked first time, so the `resolve.alias` fallback was not needed.

Why it works: onnxruntime-web 1.30.0's `package.json` `exports["."].import` has `"onnxruntime-web-use-extern-wasm": "./dist/ort.min.mjs"` (line 80) and `"default": "./dist/ort.bundle.min.mjs"` (line 81). The default holds `new URL("ort-wasm-simd-threaded.jsep.wasm", import.meta.url)`, which is what Vite emitted as the `_app` asset. `ort.min.mjs` holds no such call and imports the engine from `wasmPaths`. Vite is 6.4.1, which exports `defaultClientConditions`. `svelte-check` reported 0 errors (unchanged), and the build and every test suite accepted the condition.

`wasmPaths` and `/omr/ort/` are untouched (`homr-reader.ts:54`, `:407`; `metre-model.ts:21`, `:66`).

One consequence worth knowing: the condition is in the Vite config that Vitest also reads, so unit tests now resolve `onnxruntime-web` through `ort.min.mjs` too. All suites pass, so nothing depended on the bundled entry.

## The scan check, before and after

Method as the brief's amendment 3, with three differences: Python 3.13.16 served `.mjs` as `text/javascript` and `.wasm` as `application/wasm` (checked with `curl -sI`); the PNG came from `pdftoppm -r 300 -f 1 -l 1` on the Lamm scan (320,006 bytes); Playwright drove `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` at 1440 by 1000 with the PNG on the second `input[type=file]`. The script is a scratchpad file and is not committed.

Requests matching `ort-wasm|\.onnx|/omr/`, with duplicates, in order. The list was identical before and after:

1. `/omr/models/6ed36640…/segnet_308-3296ccd4….onnx`
2. `/omr/ort/ort-wasm-simd-threaded.jsep.mjs`
3. `/omr/ort/ort-wasm-simd-threaded.jsep.wasm`
4. `/omr/models/92bd1833…/encoder_pytorch_model_465-597144ca….onnx`
5. `/omr/models/18801c1e…/decoder_pytorch_model_465-597144ca….onnx`
6. `/omr/models/metre/metre-a-r6.onnx`
7. `/omr/models/metre/metre-a-r6-ref.f16`
8. `/omr/models/metre/metre-a-r6-ref.cls`
9. `/omr/ort/ort-wasm-simd-threaded.jsep.mjs`
10. `/omr/ort/ort-wasm-simd-threaded.jsep.wasm`

| | before (unchanged build) | after |
|---|---|---|
| Responses with status 400 or more | none | none |
| Success line (`scan.ts:107-110`) | `homr read 1 of 1 pages … in 94657 ms on wasm` | `homr read 1 of 1 pages … in 92729 ms on wasm` |
| `.receipt-score` visible | yes | yes |
| Whole run | 102 s | 98 s |
| `_app` engine copy requested | no | gone from the build |

Both runs logged `[omr] metre: page read in … s, 10 windows, 1 stating a signature` and `[omr] metre: bar 1 (page 1): 6/4 stated: 4 bars add up to 6/4`. The `pathNote` in both was "no WebGPU adapter (the browser granted no adapter)".

What I used as "a reading comes back": the success line with N = 1, plus `.receipt-score` visible. I did not inspect the notes themselves. The two runs agree on the metre bar (6/4) and the page count; I did not diff the MusicXML the reader produced.

## The metre model

The second pair of requests (items 9 and 10) is the metre worker loading its engine, after items 6 to 8 load its model. Both come from `/omr/ort/`, so this is the dynamic evidence, not only the static. Statically, `metre-model.ts:66` sets `wasmPaths` before any session, and the metre worker's chunk (`workers/chunks/coansDkg.js`) now holds no `assets/ort-wasm-…wasm` path.

## The MusicXML check

On the changed build, `tchaikovsky-op38-3-voice.musicxml` (from `src/lib/score/ingestion/fixtures/`) went to `input[type="file"].hidden-input`. After the dictionary loaded, the Text page showed the title, composer, poet, "95 words", the score file listed, and IPA with glosses for every word. No engine request was made, as expected (this path does not use the reader), and no response was 400 or worse. I checked this on the changed build only; I did not run it on the unchanged one, since the change cannot reach this path. The PDF and MuseScore paths are out of scope and were not run.

## The non-jsep pair

`build/omr/ort/ort-wasm-simd-threaded.wasm` and `.mjs` are referenced by nothing: a grep over `apps/web/src`, `apps/web/e2e`, `packages`, `scripts`, and `tools` finds no import of `onnxruntime-web/wasm` and no use of the string except the copy list in `scripts/copy-ort-wasm.mjs:47-50` and the prose at `homr-reader.ts:34`. They remain in the build, as instructed. Removing them is a later row.

## The gates

Run in the clone with `pnpm install --frozen-lockfile` (pnpm 10.28.0, Node 22.22.0; it wrote nothing into `pnpm-workspace.yaml`). Before and after outputs are identical.

| gate | result | `gates-scratch.sh` baseline |
|---|---|---|
| 1 phonology | 251 passed | 251 |
| 2 dictionary | 248 passed | 248 |
| 3 web-check | 0 errors, 12 warnings in 5 files | same |
| 4 web-test | 2512 passed | **2433** |
| 5 score-parser | 675 passed, 5 skipped (680) | same |
| 6 blurb | 145 passed | 145 |
| 7 integration | 55 passed | 55 |
| 8 ratchets | OK | OK |

Gate 4 reads 2512, not the 2433 in `gates-scratch.sh:78-117`. All pass, and my change touches no test, so the 79 difference is rows merged after that script was last moved, not mine. The desk should move the baseline. I did not check which rows account for it.

## Vercel

`vercel.json` now has `"git": { "deploymentEnabled": { "**": false, "Shane": true, "main": true } }`, every existing key kept. The `false` side was tested by pushing `10d6553` to `cloud-lane-7`; the result is under VERCEL RESULT, below.

Evidence that the rule is needed: the Vercel deployment list shows `cloud-lane-4`, `cloud-lane-5`, and `cloud-lane-6` each built before this change.

The `true` side is untested until the next merge to `Shane`. If `Shane` then fails to auto-deploy, the fallback is `{"cloud-lane*": false, "audit*": false, "v7-rebuild": false}`.

## VERCEL RESULT

Pushed `10d6553` to `cloud-lane-7` at about 03:27 UTC on 2026-10-15 (the clone's clock). I then listed deployments for the team `dannmittons-projects` twice through the Vercel connector, filtered by branch `cloud-lane-7` and unfiltered (newest three). Both lists, taken some minutes after the push, held **no deployment for `cloud-lane-7` or for `10d6553`**; the newest was the `Shane` build of `0b0c52a`. By contrast `cloud-lane-4`, `cloud-lane-5`, and `cloud-lane-6` each have READY deployments from earlier today.

That is consistent with the `false` side working. It is not proof: I do not know how long Vercel takes to create a deployment after a push, and one empty listing cannot exclude a late one. The desk should look once at the Vercel dashboard for `cloud-lane-7`. This report's own commit is a second push to the same branch, which tests it again.

## Not established

- **WebGPU.** No adapter was granted in this box ("no WebGPU adapter (the browser granted no adapter)" in both runs). Fable's earlier run found the adapter present but lacking `shader-f16`; I saw a different message, and I did not investigate the difference. Per the desk default, the WebGPU path is checked on the alias by Dann reading one scan after the ship, and the commit is reverted if that fails. **The WebGPU path (the Mac's path) is owed a run before `cloud-lane-7` merges, because the cloud box cannot take it.**
- That `**` matches every branch name under Vercel's minimatch, and that the `true` entries win over it for `Shane` and `main`. Both rest on Vercel's documented sentence, quoted in the brief, not on a test.
- That the readings are note-for-note equal before and after (see the scan check).
- Whether `ort.min.mjs` differs from the bundled entry in any behaviour besides where the engine comes from. The two runs agree on everything I measured; I did not diff the packages.

## Found, not for this row

- **The PDF path.** I did not reproduce the failure, so I cannot say which call raised `getOrInsertComputed is not a function`. What I found: `pdfjs-dist@6.2.108` (`node_modules/.pnpm/pdfjs-dist@6.2.108`) calls `Map.prototype.getOrInsertComputed` in `build/pdf.mjs` (for example line 2454, 6889, 6896, 11022) and in `build/pdf.worker.mjs` (for example line 943, 1681, 3124), and `pdf.mjs` contains no definition of it. Chromium 1194 lacks that method. That makes `pdfjs-dist` 6.2.108 the likely caller. LIKELY, not established.
- **A stale comment.** `metre-model.ts:13-14` says the network runs in the page's own thread, while `metre-client.ts:23` runs it in a Worker. Not fixed here.

## Housekeeping

- `docs/memory/` untouched. No model, dictionary, or font file touched. `git status` was clean after the install and after the build.
- The brief is at `/tmp/briefs/brief-row98_r2_2026-10-14.md`, a condensed copy, not verbatim; the full text is in the prompt. It is not committed.
