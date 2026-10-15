# Report: the trimming audit, measured first, only what is proven unused removed (r1)

Code (cloud lane, Sonnet), 2026-10-15, branch `cloud-lane-10`. Brief: `brief-code-trimming-audit_r1_2026-10-15.md`, with the seven amendments of `review-fable-brief-trimming-audit_r1_2026-10-15.md` applied (licences kept, the Guide pictures listed not removed, live egress and `knip` with NOT ESTABLISHED paths, the WebGPU line in the commit message, the corrected `denigma` reference, branch, last in the lane). Nothing in (b) or (d) was shipped. No model, dictionary, font, or string was touched.

## The answer in three lines

1. One removal: the plain WebAssembly onnxruntime pair is no longer copied. The build falls from 453 MB to 439 MB (14,264,278 bytes), the Lamm scan check makes the same ten requests with no response of 400 or more, and the first-visit list is unchanged (it never contained the pair). The WebGPU path is owed a run on the Mac before merge.
2. The dictionary is 54.6 percent of the first visit by raw bytes on loopback (96.4 MB of 176.6 MB), plus another 42.4 percent for the gloss tier fetched once the app is interactive. The compressed live figures are NOT ESTABLISHED: the cloud box cannot reach the live site. Three proposals are below; none is shipped.
3. The PDF failure reproduces: `getOrInsertComputed is not a function` in `pdfjs-dist` 6.2.108, in a Chromium that lacks the method. No static file qualified for removal under the grep rule (30 have no reference: six licences, which stay, and 24 Guide pictures, which are listed for Dann).

## Step 0. Build size, before and after

Instrument: `pnpm --filter @ilya/web build`, then `du -sm` and `find apps/web/build -type f -printf '%s %p\n' | sort -rn | head -25`. "Before" is `cloud-lane-10` at the row 101 commit; "after" is this row's commit. Both are fresh builds.

| folder | before | after |
|---|---|---|
| `apps/web/build` | 453 MB | 439 MB |
| `build/omr` | 245 MB | 231 MB |
| `build/data` | 166 MB | 166 MB |
| `build/_app` | 33 MB | 33 MB |
| `build/pdfjs-wasm` | 2 MB | 2 MB |
| `build/fonts`, `build/guide` | 2 MB each | 2 MB each |

The 14 MB is `ort-wasm-simd-threaded.wasm` (14,239,897 bytes) and `.mjs` (24,381 bytes). The 25 largest files before, in bytes (path shortened): `omr/models/6ed3…/segnet_308-…onnx` 57,311,361; `omr/models/92bd…/encoder_…onnx` 52,861,122; `data/dictionary…-b.json` 48,896,620; `data/dictionary…-a.json` 47,485,378; `omr/models/1880…/decoder_…onnx` 47,309,835; `data/dictionary…-gloss-b.json` 37,970,717; `…-gloss-a.json` 36,869,100; `omr/models/60f4…/segnet_…_fp16.onnx` 28,667,207; `omr/ort/ort-wasm-simd-threaded.jsep.wasm` 28,312,028; `omr/models/5082…/encoder_…_fp16.onnx` 26,466,256; `omr/ort/ort-wasm-simd-threaded.wasm` 14,239,897; `_app/immutable/workers/chunks/4S7rass8.js` 10,791,018; `webmscore.lib…wasm` 9,248,386; `denigma_wasm_mnx.wasm` 4,511,746; `webmscore.lib.mem…wasm` 4,152,039; `webmscore.lib…data` 4,099,973; `pdf.worker…mjs` 2,222,991; `data/homographs.json` 2,004,513; `_app/immutable/chunks/phnydL8z.js` 950,228; `fonts/bravura/bravura_metadata.json` 733,542; `omr/models/metre/metre-a-r6.onnx` 689,387; `workers/worker-7aFnp5lO.js` 537,558; `chunks/C1gUo6dv.js` 479,344; `pdfjs-wasm/quickjs-eval.wasm` 469,105; `pdfjs-wasm/openjpeg_nowasm_fallback.js` 451,590. After: the same list without the `ort-wasm-simd-threaded.wasm` row, and with `385,983` (`fonts/finale-maestro/FinaleMaestro.json`) entering at the bottom; the main chunk's hash changed (`phnydL8z.js` is `Ck3IcKMb.js` after, same 950,228 bytes).

### The first visit, local and uncompressed

Instrument: `python3 -m http.server 5199 --bind 127.0.0.1` from `apps/web/build`; Playwright Chromium (`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, version 141.0.7390.37) with a fresh context each time, so no IndexedDB. Ready signal: the poem textarea `textarea.text-input` becoming enabled (its `disabled` is bound to `loaderState.isLoading`, `IntakePanel.svelte:380`; the same signal `e2e/helpers.ts` uses). Every response's body length was read with Playwright (`response.body()`), then the page was held 3 s to let the idle gloss tier finish. **This is loopback with no compression. It is not what a singer downloads.**

Both viewports (1440 by 1000 and 390 by 844) made the **same 39 requests totalling 176,581,913 bytes**, in a slightly different order. By kind:

| kind | bytes | share |
|---|---|---|
| `dictionary…-a.json` and `-b.json` | 96,381,998 | 54.6% |
| gloss tier (`-gloss-a`, `-gloss-b`) | 74,839,817 | 42.4% |
| `homographs`, `singer-supplement`, `blurb-composer`, `dictionary-manifest` | 2,139,120 | 1.2% |
| own fonts (Bravura, Finale Maestro, metadata) | 1,647,677 | 0.9% |
| JavaScript | 1,092,002 | 0.6% |
| Google Fonts CSS and woff2 | 343,661 | 0.2% |
| own CSS, favicon, HTML | 137,638 | 0.1% |

The order on desktop (arrival time in ms from navigation start, status 200 for all): HTML 44; app JS 77 to 96; Google Fonts CSS 319; page chunks and CSS 371 to 465; the 950 KB main chunk 465; `dictionary-manifest.json` 683; Bravura 699; Bravura metadata 818; Finale Maestro 863 and its metadata 907; `dictionary…-a.json` (47,485,378) complete at 1,418; `…-b.json` (48,896,620) 3,446; `singer-supplement.json` 4,943; `blurb-composer.json` 5,412; `…-gloss-a.json` 6,163; `homographs.json` 6,298; `…-gloss-b.json` 8,438. On the phone viewport: the same files, with `-a` at 1,630, `-b` at 3,826, and gloss-b at 8,110. The list is unchanged by the row's removal (the pair is under `/omr/`, which the first visit never touches), and I took it both before and after: 39 requests and 176,581,913 bytes both times.

### The first visit, live and compressed: NOT ESTABLISHED

`curl -sSI https://ilya.dannmitton.com` returned `CONNECT tunnel failed, response 403` from the box's proxy. Per review amendment 3 I tried it once and did not retry through any proxy flag. So there are no live compressed figures and no `content-encoding` header.

As a substitute that I label as such: `gzip -6` run locally on the data files gives `dictionary…-a` 3,184,175 and `-b` 2,675,890 (together 5,860,065 bytes), `…-gloss-a` 2,994,019, `…-gloss-b` 2,245,526, `homographs` 221,249. This is **a local estimate with one tool at one level; the live host may serve brotli or nothing, and I did not measure it.** The desk's figure "about 10.7 MB of the first visit" is NOT ESTABLISHED by any instrument I ran. The local gzip total for the dictionary and gloss files (about 11.1 MB) is the same order, which is a coincidence of magnitude, not a confirmation.

## Step 1. (a) The non-jsep pair

**Proof it is unused, in the built site.** `grep -rl 'ort-wasm-simd-threaded\.wasm\|ort-wasm-simd-threaded\.mjs' apps/web/build` named exactly one file, `build/omr/ort/ort-wasm-simd-threaded.mjs` (the file whose own text contains its name), and no file outside `build/omr/ort/`. A grep for `ort-wasm-simd-threaded` over `apps/web/src`, `e2e`, `scripts`, `packages`, the root `scripts`, and `tools` found only the four lines of the copy list in `copy-ort-wasm.mjs:47-50`, and a grep for `onnxruntime-web/wasm` found no import. `homr-reader.ts:34` does not name the pair (it says "onnxruntime's `.wasm` and `.mjs` files"), so I left it.

**The change.** `apps/web/scripts/copy-ort-wasm.mjs`: the two names removed from `FILES`, and its header updated to say one pair is copied and why. I also deleted the two stale generated copies from the git-ignored `static/omr/ort/` so the rebuild could not carry them.

**The scan check, unchanged from row 98** (amendment 3 of that row). The Lamm scan's first page, `pdftoppm -r 300 -f 1 -l 1` (320,006 bytes, the same size as row 98's), on the second `input[type=file]` of the built site, 1440 by 1000. Requests matching `ort-wasm|\.onnx|/omr/`, with duplicates, in order, were identical to row 98's ten:

1. `/omr/models/<sha>/segnet_308-3296…onnx`
2. `/omr/ort/ort-wasm-simd-threaded.jsep.mjs`
3. `/omr/ort/ort-wasm-simd-threaded.jsep.wasm`
4. `/omr/models/<sha>/encoder_pytorch_model_465-5971…onnx`
5. `/omr/models/<sha>/decoder_pytorch_model_465-5971…onnx`
6. `/omr/models/metre/metre-a-r6.onnx`
7. `/omr/models/metre/metre-a-r6-ref.f16`
8. `/omr/models/metre/metre-a-r6-ref.cls`
9. `/omr/ort/ort-wasm-simd-threaded.jsep.mjs`
10. `/omr/ort/ort-wasm-simd-threaded.jsep.wasm`

Responses of 400 or more: none. `.receipt-score` visible. Console: `[omr] metre: bar 1 (page 1): 6/4 stated: 4 bars add up to 6/4` and `[omr] homr read 1 of 1 pages of lamm-1.png in 136056 ms on wasm (no WebGPU adapter (the browser granted no adapter))`. The run took 145 s end to end, longer than row 98's 98 to 102 s; I did not investigate (the box also ran other work around it). I did not diff the MusicXML the reader produced.

**OWED BEFORE MERGE: the WebGPU path (the Mac's) has not been run.** This box grants no WebGPU adapter. Dann reads one scan with WebGPU after merge, as row 98's desk default says, and the commit is reverted if that fails. That line is also in the commit message (review amendment 5).

## Step 2. (b) The dictionary: measured, three proposals, none shipped

**Bytes.** Raw, local: the two dictionary files are 96,381,998 bytes (54.6 percent of the 176,581,913 the first visit made); with the gloss tier, 171,221,815 (97.0 percent). Compressed on the live site: NOT ESTABLISHED (above); local `gzip -6` estimate 5,860,065 for the two files and 11,099,610 for all four.

**When it starts.** On desktop, first paint is at 360 ms and first contentful paint at 664 ms; the manifest request starts at 597 ms and `dictionary…-a.json` at 660 ms (`performance` resource timing `startTime`; the second run, after the removal, read 520 and 756 against 695 and 803). On the phone viewport, FCP 816 ms, `-a` starts at 891 ms. So the fetch starts at about first contentful paint, not after it. The field became enabled at 5,390 ms (desktop) and 5,846 ms (phone) on loopback with no throttling. A real connection will be slower; I did not throttle.

**What the singer sees.** `loadDictionary` is started in `onMount` (`+page.svelte:4127-4131`). While `loaderState.isLoading`: the poem textarea and the camera button are disabled (`IntakePanel.svelte:380`, `:392`); a load error shows a line (`:325-328`); if the box already holds text, the Paper's empty page shows `dict.loading` (`TitlePage.svelte:178-179` via `emptyTextNotice`, `one-action.ts:152-158`). I saw the textarea disabled at load in every run; I did not capture a screenshot of the notice.

**What blocks on it.** Transcription: `joinText('boot')` at `+page.svelte:4126` returns `wait` almost every time and the effect on `loaderState` spends it later (`:4118-4126`); the readiness tests at `:2022`, `:2956`, and `:2998` all read `!loaderState.isLoading && loaderState.entryCount > 0`. Loading at boot is ruled (N.108-5, Dann 2026-09-07).

**Proposals** (the desk decides; the boot-time load stands until then):

1. **Begin the fetch later** (first focus of the text field, or first paste). Cost: a singer who types in the first second waits for the whole download after typing instead of during it, which breaks the ruled boot-time transcription for a pasted poem; it also needs a second trigger on the score-drop path, which transcribes. It changes what a singer sees, so it needs a ruling.
2. **Keep the boot fetch, lower its bytes.** Options: split the dictionary by word frequency so the first file is small and the long tail follows; or serve a compressed form. Each needs the script that writes `data/` (`scripts/build-dictionary.ts`) to change and a new manifest shape; the loader (`loader.ts`) would need to merge chunks. Local `gzip -6` would cut the two files from 96.4 MB to 5.9 MB, which suggests the host's own compression decides most of the saving; I could not see whether the host already compresses.
3. **Do nothing.** Cost on a phone viewport on loopback: the same 176.6 MB list, field enabled at 5.8 s. A real phone on a mobile connection will be slower by a factor I did not measure.

Of these, none changes nothing the singer sees except possibly the part of option 2 that is compression alone, which is transparent to the browser if the host already serves it; whether it does is the one thing I could not read. The section is therefore a proposal for the desk and the ruled boot-time load stands.

## Step 3. (c) Dead code and unused static assets

Instrument: for each of the 62 regular files tracked under `apps/web/static` (63 in `git ls-files`, minus the `data` symlink), `grep -rIFn` for the exact web path (for example `/fonts/bravura/Bravura.woff2`) and then for the bare file name, over `apps/web/src`, `apps/web/scripts`, `apps/web/static`, `packages`, `svelte.config.js`, `vite.config.ts`, and, in addition to the brief's list, `apps/web/e2e`, `apps/web/e2e-phone`, the root `scripts`, and `tools` (excluding `node_modules`, the generated `omr`, and the file itself). Full table in the scratch output; summary:

| result | files | what |
|---|---|---|
| referenced by path | 31 | the fonts, metadata, icons, favicon, manifest, `sw.js`, `denigma_wasm_mnx.js` (`score-reader.worker.ts:96`, `gluePath = '/denigma_wasm_mnx.js'`), `russian-alphabet-song.png` (`LearnContent.svelte:54`), 15 Guide pictures |
| referenced by name only | 1 | `denigma_wasm_mnx.wasm` (prose at `score-reader.worker.ts:8`, and loaded by the glue next to `denigma_wasm_mnx.js`); kept |
| NONE on every grep | 30 | below |

**KEPT, licence (not removed, per review amendment 1):** `fonts/bravura/OFL.txt` 4,420 bytes, `fonts/bravura/FONTLOG.txt` 44,891, `fonts/finale-maestro/OFL.txt` 5,017, `fonts/lato-OFL.txt` 4,407, `fonts/leland/LICENSE.txt` 4,400, `fonts/leland/FONTLOG.txt` 8,350. No code references them; the fonts' licences require them beside the font files (`notation-fonts.ts:28`).

**Found, not removed (review amendment 2): 24 Guide pictures** with no reference by name in `GuideContent.svelte` or anywhere else: `guide-step-03, 05, 07, 09, 10, 11, 12, 15, 19, 21, 23, 24, 26, 27, 28, 29, 30, 31, 33, 34, 36, 37, 38, 39.webp`, 21,568 + 20,942 + 31,622 + 68,040 + 11,330 + 15,790 + 30,584 + 12,912 + 36,274 + 34,136 + 48,214 + 36,696 + 36,326 + 36,068 + 36,220 + 35,784 + 36,228 + 36,236 + 38,322 + 37,768 + 10,546 + 17,160 + 12,042 + 46,072 bytes, **746,880 bytes** in total (summed by script; the folder is 2 MB). The Guide references 15 by name (63 `guide-step-` strings in the file, 39 files minus 24). Which pictures the Guide keeps is Dann's content decision.

**Font metadata files** (`bravura_metadata.json`, `FinaleMaestro.json`, `leland_metadata.json`): all three are named in `notation-fonts.ts:37-39`, so all stay under the grep rule.

**Removals under (c): none.** So there is no removal commit for (c) and no gate run for one.

**Source.** `pnpm --filter @ilya/web check` stays at 0 errors, 12 warnings in 5 files. `npx --yes knip@5 --no-progress` ran once with no configuration (exit 1, under the ten-minute cap) and listed 206 unused files, 141 unused exports, and 181 unused exported types. Unconfigured, it is mostly noise, and I confirmed this: it reports `LearnContent.svelte` unused, but `+page.svelte:4878` imports it dynamically, and it reports `tesseract.js` as an unused dependency, but `ScoreUploader.svelte:449` imports it dynamically. I did not go through the 328 export lines. Two leads I checked by grep: `apps/web/src/lib/insights/FitTable.svelte` (5,847 bytes) and `apps/web/src/lib/insights/Tessituragram.svelte` (8,212 bytes) have no importer in `src`, `e2e`, or the docs I searched. I **did not remove them**: `ARCHITECTURE.md:122` and the `i18n.ts` header (`:37`) both name `Tessituragram.svelte`, and `Tessituragram.svelte` carries legacy `insights.fit.*` keys, so whether they are retired code or a component waiting to be wired is a call for the desk. `ts-prune` was not run. No source file was removed, so no ceiling moved.

## Step 4. (d) The PDF path: reproduced, caller named, three fixes proposed

**Reproduction.** On the built site (served locally), Chromium 141.0.7390.37 headless, the tracked `tools/e16-harness/scans/sunless-01-v-chetyryokh-stenakh_lamm-scan.pdf` on the second `input[type=file]`. After 25 s the page showed "Ilya could not open that PDF. If it is password protected, save an unlocked copy and try again." (the line twice, once as the echo), no `.receipt-score`, and the console held:

```
[error] [ScoreUploader] the PDF could not be rasterized: TypeError: i(...).getOrInsertComputed is not a function
    at V0.$o (…/_app/immutable/chunks/C1gUo6dv.js:45:128089)
    at V0.getOptionalContentConfig (…/chunks/C1gUo6dv.js:45:126741)
    at em.render (…/chunks/C1gUo6dv.js:45:106660)
    at b (…/chunks/Q97vqo-g.js:1:1880)
    at async bO (…/chunks/Ck3IcKMb.js:34:190509)
```

The first frame that names a `pdfjs-dist` file is `_app/immutable/chunks/C1gUo6dv.js` (479,344 bytes; it contains `getOptionalContentConfig`, the pdf.js main-thread API) at the minified function `V0.$o`. The build carries no source map, so the function name is minified; by reading `pdfjs-dist@6.2.108/build/pdf.mjs`, the callers in that path are `getOptionalContentConfig` (`:16757`), with `#methodPromises.getOrInsertComputed` at `:16248` and `:16765`. **Which of the two is `$o` is NOT ESTABLISHED.**

**The method is absent.** In the same page, `typeof Map.prototype.getOrInsertComputed` is `undefined` and `typeof Map.prototype.getOrInsert` is `undefined`; `browser.version()` is 141.0.7390.37; the user agent reads `HeadlessChrome/141.0.0.0`.

**Which browsers ship it.** I could not read MDN or caniuse directly: `WebFetch` of the MDN page failed with `getaddrinfo ENOTFOUND developer.mozilla.org`. A web search returned a summary of caniuse's table at https://caniuse.com/mdn-javascript_builtins_map_getorinsertcomputed and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/getOrInsertComputed : Chrome 145 (desktop and Android), Edge 145, Firefox 144 (desktop) and 151 (Android), Safari 26.2 on macOS and iOS, Opera 131. **That is a search summary of the page, not the table read by me, so treat it as unverified**, and it says MDN lists the method as Baseline 2026. If true, a current release of Chrome, Firefox, and Safari has it; Dann's singers on a Safari earlier than 26.2 (including iOS 18 and earlier), a Chrome earlier than 145, or a Firefox earlier than 144 would hit this failure today. That the sandbox's Chrome 141 fails is consistent with that table.

**Which versions of `pdfjs-dist` call it.** I downloaded `build/pdf.mjs` for each from the npm registry and counted the string: 0 calls in 4.10.38, 5.3.93, 5.4.149, 5.4.296, 5.4.394, 5.4.449, 5.4.530, and 5.4.624 (and 0 in the worker of 5.4.624); 9 in 5.5.207, 11 in 5.6.205, 5.7.284, and 6.0.227, 15 in 6.1.200, 16 in 6.2.108, and 17 in 6.3.289 and 6.4.299. So the call arrives between 5.4.624 and 5.5.207, and the newest versions still call it. I did not read changelogs.

**Three fixes, not shipped** (N.59 step 8 is Dann's ruling approving 6.2.108, `page-pdf.ts:4`, so any version change is his):

1. **The legacy build.** `pdfjs-dist@6.2.108` ships `legacy/build/pdf.mjs` and `pdf.worker.mjs` that define the method themselves (`legacy/build/pdf.mjs:5063` and `:5809`, the Map and WeakMap versions; `legacy/build/pdf.worker.mjs:4548` and `:5294`). Bytes: `build/pdf.mjs` 853,537 against `legacy/build/pdf.mjs` 1,032,996 (+179,459), and `build/pdf.worker.mjs` 2,222,991 against `legacy/build/pdf.worker.mjs` 2,383,409 (+160,418), **+339,877 bytes together**, loaded only when a PDF is dropped. Cost: the import paths in `page-pdf.ts:150-162` and `:273-285`, and the worker URL, change to the legacy ones; the same version Dann approved. It is the smallest change and keeps 6.2.108. I did not test that the legacy build rasterizes the Lamm PDF here. Recommended, subject to that test.
2. **A small polyfill** loaded before the dynamic import: 
   ```ts
   if (!Map.prototype.getOrInsertComputed) {
     Map.prototype.getOrInsertComputed = function (key, fn) { if (this.has(key)) return this.get(key); const v = fn(key); this.set(key, v); return v; };
   }
   ```
   with the same for `WeakMap`. About a dozen lines, no extra bytes to download. Cost: it mutates a built-in prototype for the whole page, and I have not checked the worker, which runs in its own realm and would need the same lines at the head of its own file; pdf.js's worker is a third-party file, so the worker would still fail. That makes this the weakest option.
3. **An older `pdfjs-dist`** that does not call it: 5.4.624 is the newest I found with 0 calls in both files. Cost: a version change that Dann approved at 6.2.108, a different API surface (`wasmUrl: '/pdfjs-wasm/'` at `page-pdf.ts:183` may not exist in 5.4), and the loss of every fix since. I did not read its changelog or test it.

## Gates

Run after the (a) commit, in the repo as committed:

| # | gate | baseline | result |
|---|---|---|---|
| 1 | phonology | 267 (251 plus row 91) | 267 passed |
| 2 | dictionary | 248 | 248 passed |
| 3 | web-check | 0 errors, 12 warnings, 5 files | 0 errors, 12 warnings, 5 files |
| 4 | web-test | 2542 (2512 plus the four earlier rows) | 2542 passed |
| 5 | score-parser | 675 passed, 5 skipped | 675 passed, 5 skipped |
| 6 | blurb | 145 | 145 passed |
| 7 | integration | 55 | 55 passed |
| 8 | ratchets | OK | OK |

This report's own commit adds only this file and changes no code, so I did not run the gates again for it. `gates-scratch.sh:111`'s gate 4 string (2433) is stale and was not edited.

## What I could not establish

- **The live, compressed first visit**, and the desk's 10.7 MB figure: the host is unreachable from this box (403 at the proxy).
- **WebGPU.** No adapter here; owed to the Mac before merge.
- **Real-network timing.** Every timing is loopback and unthrottled, from a box that was running other work.
- **Whether the legacy `pdfjs-dist` build rasterizes the PDF** here (not tested), and which browser versions ship `getOrInsertComputed` (a search summary of caniuse only).
- **The minified function `$o`** and which of the two `getOrInsertComputed` call sites in `getOptionalContentConfig` raised.
- **The 328 `knip` export lines**, and whether `FitTable.svelte` and `Tessituragram.svelte` are meant to be wired.
- **A diff of the scan reader's MusicXML before and after (a)**; I compared request lists, status codes, and the success line.
- **Whether a second visit refetches the dictionary.** I measured first visits only.
