# Report: Ilya asks for the fast path only where it works

> **Provenance, added by the desk (Fable), 2026-10-05 03:50.** Found by the builder of `QUEUE.md` row 29 (`report-opus-wire-the-newer-homr-build-into-ilya_r1_2026-10-05.md`, Summary item 5). Brief: `brief-sonnet-the-fast-path-only-where-it-works_r1_2026-10-05.md`. A Sonnet subagent in the desk's cloud workspace, on a copy of the row 29 builder's final tree, 03:15 to 03:38. Cost: 208,174 tokens, 73 tool uses, 24 minutes (the desk had named 250,000 and 50). **The desk copied the helper's final message here from its transcript, as returned. Its claims are its own.** The desk checked: `path-choice.ts` and the changed part of `homr-reader.ts` (read in full); the diff of `scan.ts` (read); the tests under `apps/web/src/lib/omr/` (run by the desk in the helper's tree: 43 passed in 4 files); the md5 of `guard-changes.tgz`. The desk did not re-run the eight gates or the browser runs. **Accepted by the desk, with the helper's one addition (a recognizer that asked for WebGPU and did not start is made again on WebAssembly) kept.** One thing the desk noticed and holds, not yet built: after a retry, the WebAssembly recognizer is kept for the session even where both paths answered that the pages hold no music, so a later scan in that session stays on the slow path. The deliverables are in `~/Downloads/_desk-2026-10-05/guard-f16_r1_2026-10-05.tgz`; the pictures are also in `guard-f16-proof_r1_2026-10-05/` beside this file.

## 1. Summary

1. **Proof, watched.** With the three flags (`--enable-unsafe-webgpu --use-webgpu-adapter=swiftshader --enable-features=Vulkan`), Ilya's dev server read `tch-1.png` to a score. The console line was:
   `[omr] homr read 1 of 1 pages of tch-1.png in 107271 ms on wasm (the WebGPU adapter lacks shader-f16, which the fp16 models need)`
   - The page shows the score with notes and IPA: `proof/after-guard/04-markup.png`. The side panel lists `SCORE tch-1.musicxml`.
   - The console held 0 WebGPU validation errors (`grep -c 'validation error' console.log` printed 0).
   - The per-page MusicXML that the Worker posted is byte for byte the port-alone file `/mnt/user-data/outputs/wire-465/proof/port-alone-in-browser/tch-1.musicxml`. `cmp` printed nothing, and both are 81,109 bytes with md5 `568dcb61e91cc956161bdbc47ff6bf48`.
   - The joined MusicXML Ilya ingested is 15,830 characters, md5 `28d7ef9c2e48561715d23137157ac118`. That is identical to `/mnt/user-data/outputs/wire-465/proof/build-preview/joined.musicxml`.
2. **The retry, watched.** Ilya's feature test only asks the adapter whether it has `shader-f16`. For this run only, `proof/scripts/walk-ilya-spoof.mjs` makes the main thread's adapter claim `shader-f16`, so Ilya asks for WebGPU. homr-web's Worker is another realm and sees the real adapter, so its WebGPU read fails as before.
   - Result: 1,248 validation errors, the same count as the unguarded run. Ilya then read the pages again on WebAssembly and got the score.
   - Console line: `[omr] homr read 1 of 1 pages of tch-1.png in 114978 ms on wasm (the WebGPU read ended with every page answered not_music, so the pages were read again on WebAssembly)`
   - The page's MusicXML is again identical to the port-alone file, and the joined md5 is `28d7ef9c...`, the same as in item 1. The screenshot has the same md5 as item 1's (`46d15dac...`).
3. **The observation, repeated inside Ilya, before any change.** Same flags, same file. The console showed `[omr] homr did not read tch-1.png: not_music homr found no music on any page`. The read ended 14,265 ms after the drop. The console held 1,248 validation errors, the first being `An uncaught WebGPU validation error was raised: Error while parsing WGSL: :33:68 error: 'f16' type used without 'f16' extension enabled`. See section 2.
4. **Tests.** 27 new tests pass, one for each branch of the feature test and of the retry. All eight gates pass. Only the web test count moved, from 1886 to 1913 (section 4).
5. **A lead for the port.** The right place for the `shader-f16` test is `third_party/homr-web/`, and the port does not make it. I built the Ilya-side guard anyway, as the brief asked. Details are in section 2 and under NOT ESTABLISHED.
6. **A mistake of mine.** My first proof run was spoiled. I ran vitest in `apps/web` while the dev server was serving the page. Vite logged `page reload .svelte-kit/generated/...` at 3:20:17 AM, which reloaded the page and killed the read. I killed that run and started it again with nothing else touching `apps/web`. The spoiled run is kept in `proof/aborted-run-1/` and is not evidence of anything.

## 2. Section 4's measurements

**4.1 What the singer sees, the console, and where the file goes (before any change)**
- Console: `[omr] homr did not read tch-1.png: not_music homr found no music on any page`.
- `apps/web/src/lib/omr/scan.ts:84` reads `if (result.error === 'not_music') return hooks.poem();`, so the file goes to the poem route.
- Right after the read, `proof/before-guard/02-after-read.png` shows the spinner "Reading the words out of the picture…".
- After the script pasted a poem and clicked Markup, `proof/before-guard/04-markup.png` shows "Ilya could not read this picture clearly. A flat scan or a PDF works best." with a "Try another file" button. There is no score on the page.
- I did not record network requests. The helper's claim that only the fp16 segmentation file was fetched is NOT ESTABLISHED by me.

**4.2 How the port chooses its backend and files** (all paths under `third_party/homr-web/src/`)
- `models/backend.ts:85-117`, `probeRuntime`, calls `gpu.requestAdapter()` at lines 99-102 and sets `hasAdapter: adapter !== undefined` at line 114.
- `models/backend.ts:119-124`, `capabilityOf`, returns `"webgpu"` whenever `probe.hasAdapter` is true. Otherwise it returns `"wasm-threads"` if `SharedArrayBuffer` exists, and `"wasm"` if not.
- `models/backend.ts:155-167`, `chooseBackend`, applies the `maxBackend` cap.
- **Does the port test the adapter for `shader-f16`? No.** `grep -rn "shader-f16" third_party/homr-web/src` printed nothing (exit status 1).
- `models/backend.ts:231` makes the device with `await probe.adapter.requestDevice()`, with no required features.
- **Which values `prefer` accepts:** `"webgpu"`, `"wasm-threads"`, `"wasm"`. The list is `result.ts:7`, and it is checked at `worker-protocol.ts:111-114`. The default is `"webgpu"` (`client.ts:379`). The Worker passes it on as `maxBackend` (`worker.ts:65`), where it caps the choice (`backend.ts:160-164`).
  - `prefer: 'wasm-threads'` gives `wasm-threads` where the page has `SharedArrayBuffer`, and `wasm` where it does not.
  - `prefer: 'wasm'` pins single-thread.
- The recognizer reports `backend` and `backendReason` (`client.ts:69-70`, set at `client.ts:129-130`).
- `models/session.ts:216` says the webgpu backend goes to the fp16 segnet artifact.

**4.3 The adapter's features** (`proof/gpu-features.log`, script `proof/scripts/gpu-features.mjs`)
- The adapter is `vendor: google`, `architecture: swiftshader`.
- Its features are: bgra8unorm-storage, chromium-experimental-timestamp-query-inside-passes, chromium-experimental-unorm16-texture-formats, clip-distances, core-features-and-limits, depth-clip-control, depth32float-stencil8, float32-blendable, float32-filterable, indirect-first-instance, rg11b10ufloat-renderable, subgroups, texture-component-swizzle, texture-compression-astc, texture-compression-astc-sliced-3d, texture-compression-bc, texture-compression-bc-sliced-3d, texture-compression-etc2, timestamp-query.
- **`shader-f16` is not among them.** The script printed `"adapterHasShaderF16": false`.
- A device made the way the port makes it (`requestDevice()` with no arguments) has only `core-features-and-limits`. The script printed `"deviceHasShaderF16NoArgs": false`.
- **What I take from this:** the port decides on the adapter's existence only, and a fix at `backend.ts:114-124` plus the device request at `backend.ts:231` would be the cleaner home for the test. I did not change the port.

## 3. What was changed (Ilya's own files only; nothing under `third_party/`, `docs/memory/`, or `tools/e16-harness/`)

- **New: `apps/web/src/lib/omr/path-choice.ts` (83 lines), the feature test.**
  - `probeAdapter` is at line 56. It asks `requestAdapter()` with no options, and never rejects.
  - `choosePath` is at lines 66-78. It is pure and takes what it needs as arguments.
    - It returns `{prefer:'webgpu', reason:null}` only where there is a gpu, an adapter, and `shader-f16`.
    - Otherwise it returns `prefer:'wasm-threads'` with a reason for no `navigator.gpu` (line 68), no adapter or a thrown error (line 72), or an adapter without `shader-f16` (line 75).
  - `choosePathFor` is at line 81.
- **Changed: `apps/web/src/lib/omr/homr-reader.ts` (140 lines became 265).**
  - `makeReader(deps)` is at line 110. Its `choose` and `create` are injected, so fakes can test it.
  - The feature test runs before the recognizer is made: `acquireFirst` calls `deps.choose()` (line 124), and the real `choose` is at line 240.
  - The real `create` (lines 241-243) passes `prefer` through to `createRecognizer`. Before the change `prefer` was fixed at `'webgpu'` (line 77 of the starting tree).
  - **The one retry** is at lines 198-212. The condition is `found.xmls.length === 0 && rec.backend === 'webgpu'`, so it needs no page read as music and a recognizer that actually ran on WebGPU. It disposes that recognizer, makes one with `prefer: 'wasm-threads'` (the constant `WASM`, line 107), and reads once more. It cannot retry twice.
  - A read that ran on WebAssembly is never retried. This includes a recognizer asked for WebGPU that homr-web stepped down itself, because the test is on `rec.backend`, not on what was asked.
  - After a retry, the recognizer kept for the session is the WebAssembly one.
  - **One addition beyond the brief's literal text:** lines 184-195. If a recognizer that asked for WebGPU fails to start, Ilya asks once for WebAssembly. It is covered by fake tests only, not watched in a browser. If the desk does not want it, remove lines 184-195, and the two tests under "where a recognizer does not start" that depend on it.
  - **Slow-path value:** I chose `'wasm-threads'` rather than `'wasm'`. It is what homr-web already picks on its own where there is no adapter (`backend.ts:119-124`). A device with no adapter therefore reads as it did before. Here it resolved to `wasm`, as the log line shows.
  - The result type gets an optional `pathNote` (line 69, set at line 232). Where no reason of ours applies and the backend is not WebGPU, it is homr-web's own `backendReason` (line 224).
- **Changed: `apps/web/src/lib/omr/scan.ts:88-89`.** The existing `[omr] homr read ...` line now ends with ` (<reason>)` when a reason exists. A failed read carries the retry note in the `log` of the existing `console.error` line.
- **Console only.** No string a singer sees was added, and no French was written. Only the six files below changed. `ScoreUploader.svelte` and the port's `backend.ts` are byte for byte the same as in `/home/claude/wire-465/` (`cmp`).
- **New tests:** `path-choice.test.ts` (10), `homr-reader.test.ts` (15), and 2 added to `scan.test.ts` (4 became 6).
  - They cover each feature-test branch.
  - They cover the retry on `not_music` and on an engine error.
  - They cover a title page followed by an engine error.
  - They cover no retry when some page read as music, and no retry on a WebAssembly read.
  - They cover no retry when homr-web stepped down itself, and a single retry only.
  - They cover keeping the WebAssembly recognizer for the next scan.
  - They cover start failures, and the console line with and without a reason.

## 4. Gates, before and after (logs in `proof/gates-after/`)

| Gate | Baseline | After | Moved? |
|---|---|---|---|
| phonology | 251 | 251 | no |
| dictionary | 235 | 235 | no |
| web check | 0 errors, 12 warnings | 0 errors, 12 warnings | no |
| web test | 1886 | 1913 (109 files) | +27 |
| score-parser | 650 passed, 5 skipped | 650 passed, 5 skipped | no |
| blurb | 145 | 145 | no |
| integration | 55 | 55 | no |
| ratchets | OK | OK | no |

- The +27 is the new tests: 10 in `path-choice.test.ts`, 15 in `homr-reader.test.ts`, 2 in `scan.test.ts`. The brief gave 1886 as the baseline, and 1913 minus 27 is 1886. I did not run a baseline myself.
- Ratchets: "378 source files checked" after, against "375" in the last builder's saved log. The +3 is `path-choice.ts`, `path-choice.test.ts`, and `homr-reader.test.ts`. The "ceilings can be lowered" message is the same as in the last builder's log.
- The last builder's saved `gates-before/g-webtest.log` shows 107 files and 1885 tests. That is an older figure than the brief's 1886.

## 5. NOT ESTABLISHED

- **The WebGPU branch on a real GPU.** No machine here has one. Nothing I ran shows what happens on an adapter that does have `shader-f16`. The spoof run shows only that Ilya's retry catches the failure when the main thread's answer and the Worker's disagree.
- **Whether the port's device is built correctly where `shader-f16` exists.** It is requested with no required features (`backend.ts:231`), and the one device I printed (swiftshader, no `shader-f16`) had only `core-features-and-limits`. Whether onnxruntime-web 1.30.0 then runs fp16 on a real adapter that has the feature is NOT ESTABLISHED. If it does not, a real GPU could fail the same way, and Ilya's retry would be what catches it.
- **The threaded WebAssembly path.** `vercel.json` and `vite.config.ts` carry no `Cross-Origin` header (grep count 0 in both), and the headless runs resolved to `wasm`. A page that has `SharedArrayBuffer` and gets `wasm-threads` was never run.
- **PDF input and multi-page reads.** Every browser run was one PNG page. Multi-page behaviour of the retry is covered by fake recognizers only.
- **The start-failure retry** (lines 184-195) is watched in no browser.
- **What the singer sees during the retry's second pass.** I did not look at a screenshot of that moment. Only the final page was viewed.
- **Any speed claim.** The two reads took 107,271 ms and 114,978 ms with another helper on the same two cores.

## 6. Deliverables, in `/mnt/user-data/outputs/guard-f16/`

| File | md5 |
|---|---|
| `guard-changes.tgz` (the 6 files, repository-root-relative paths, against `/home/claude/wire-465/ilya`) | `e4884b2d88a095bd9a47e7e7a4d7c057` |
| `guard.diff` (731 lines) | `d574d8807e49f5d1d0b641d45f4c0cc3` |
| `files.txt` (path, md5, changed or new) | `fe126e4030b61d703df56bfae8d36898` |

Per-file md5s are in `files.txt`:
- `homr-reader.ts` `abd0b8b45ce96293a82054f0102ea57d`
- `scan.ts` `f331e2d52709ed9e17aeb788820eab34`
- `scan.test.ts` `bbaa8bc2ed6779f42fe04e08b4e4e437`
- `path-choice.ts` `53eaf3b536bf775aa053e01119f38351`
- `path-choice.test.ts` `5485665df15a0b1d36de3d955de35778`
- `homr-reader.test.ts` `0b20bbb16b453586ff665eb4250ccb41`

Proof, in `proof/`:
- `before-guard/`: pictures 01 to 05, `console.log`, `walk.log`, `walk.json`. `02-after-read.png` md5 `45498be0...`, `04-markup.png` md5 `b297fa43...`.
- `after-guard/`: pictures 01 to 05, `console.log` (md5 `139bebcd11ca2238d0449ba3a3794b5d`), `joined.musicxml`, `page-1.musicxml`, `walk.json`. `04-markup.png` md5 `46d15dace639c25f22d4cc9edc50a65c`.
- `retry-spoofed-f16/`: the same set, `console.log` md5 `357e01ddd57a821c72f752c6136d74d0`.
- `aborted-run-1/`: the spoiled run, not evidence.
- `gpu-features.log` (md5 `a597c1bc01698c0a37196ec35e371f45`).
- `gates-after/`: eight logs and `summary.log`.
- `scripts/`: `walk-ilya.mjs` (`83d2ab22...`), `walk-ilya-spoof.mjs` (`735a821c...`), `gpu-features.mjs` (`1a0d31f0...`), `gates.sh` (`adb2e6c9...`).

## 7. Wall time

First command 03:15:51; last measurement 03:38:22, about 23 minutes of the 50. I did not count tokens, and there is no sign I passed 250,000. No git writes were made (only `git status` and `git rev-parse`). `/home/claude/wire-465/` was not touched. The dev server and Chromium were stopped by process number. One of my own `pkill -f` commands matched its own command line and killed that shell once, as the brief warned; nothing was lost.
