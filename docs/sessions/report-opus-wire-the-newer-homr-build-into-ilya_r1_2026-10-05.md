# Report: the newer homr build (model 465) wired into Ilya, and watched reading in a browser

> **Provenance, added by the desk (Fable), 2026-10-05 03:15.** `QUEUE.md` row 29, the one thing in `STATE.md` at the close of 2026-10-05. Brief: `brief-opus-wire-the-newer-homr-build-into-ilya_r1_2026-10-05.md`. An Opus subagent built in the desk's cloud workspace, on a clone of `Shane` at `94e5246` with the 18 step 1 files from Dann's tree unpacked over it, 02:32 to 03:09. Cost: 332,357 tokens, 158 tool uses, 37 minutes (the desk had named 600,000 and 100). The builder could not write a report file, so **the desk copied its final message here from the helper's transcript, as returned. Its claims are its own.** The desk checked: the proof picture `4-markup-notes-ipa-russian.png` (looked at: 3/8, two sharps, the seven silent bars as one rest with a 7, and IPA and Russian under the notes through the second system); the diff of `homr-reader.ts`, `fetch-omr-models.mjs`, `join-pages.ts`, `apps/web/package.json`, and `NOTICES.md` against the step 1 state (read in full); the 16 tests under `apps/web/src/lib/omr/` (run by the desk: 16 passed); the md5 of `wire-465-changes.tgz` and of the packed port (equal to the report's). The desk did not re-run the eight gates, the browser reads, or the score. The deliverables are in `~/Downloads/_desk-2026-10-05/wire-465_r1_2026-10-05.tgz` (md5 `41577e022cbd36b49e95b935bcda7516`); the pictures are also in `wire-465-proof_r1_2026-10-05/` beside this file.

Opus builder, 2026-10-05, 02:32:14 to about 03:09 by `date`. I worked on a clone of `Shane` at `94e524627808686cc6f76b59ac1e763a41d12c33`, with the 18 step-1 files unpacked over it. I made no git writes. The environment refused my attempt to write `report.md` ("Subagents should return findings as text"), so this message is the only copy of the report.

## Summary

1. **The proof.** In headless Chromium at 1,440 px, Ilya's dev server read the Tchaikovsky PDF with homr-web 0.2.0-ilya.2 and model 465. The console printed `[omr] homr read 3 of 3 pages of Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf in 328991 ms on wasm`. I pasted the poem and opened Markup.
   - `proof/ilya-pdf-read/4-markup-notes-ipa-russian.png` shows the notes with IPA and Russian under them.
   - The same picture shows the seven silent opening bars drawn as one rest with 7 above it.
   - The console printed `[Ilya] N.160 seats: 34 drawn live, 0 kept as stored, of 34 seated`.
2. **The score.** The joined voice part has 99 measures and 222 notes: 174 pitched and 48 rests.
   - The kit's scorer gives it **98.28**: 171 of 174 pitches right, 174 of 174 lengths right, 48 of 48 rests right.
   - The figures on file are 93.10 (older build) and 98.85 (changed port under Node, from the PNG pages).
   - The same scorer on the browser's reads of the kit's PNG pages gives 98.85.
3. **The port alone in a browser.** Through its Worker with `model: '465'`, it read `tch-1.png` in 152,149 ms on `wasm`, one thread.
   - `cmp.py` against a fresh Node run printed `EQUAL`.
   - The two files are byte for byte the same (md5 `568dcb61e91cc956161bdbc47ff6bf48`).
   - The browser's pages 2 and 3 are byte for byte the kit's Node output.
4. **The fp16 465 encoder** is 26,466,256 bytes, SHA-256 `50823c061533328f5e64df016d3ed16eb9071a9f5c5ee8621646cf9ac9c8a992`.
   - Its input and output equal the fp16 396 encoder's.
   - It now has the record `encoder-465-fp16` in the port, which is now 0.2.0-ilya.2.
   - The port's `tsc` passes, and vitest gives 916 passed and 42 skipped.
5. **WebGPU.** A software adapter appeared (`google swiftshader`), but the read on it ended `not_music` after 8,040 ms.
   - SwiftShader has no `f16` shader support, and onnxruntime's fp16 shaders failed validation 1,248 times.
   - A WebGPU read with model 465 is NOT ESTABLISHED.
6. **Install and gates.** A clean copy of the changed tree installs with `pnpm install --frozen-lockfile` (exit 0). All eight gates pass. One number moved: the web tests went from 1885 to 1886, because I added one test.
7. **The built app.** After `vite build` and `vite preview`, it read `pages/tch-1.png` in 108,980 ms on wasm.
   - Its MusicXML is byte for byte the harness's for that page.
   - The Markup picture is `proof/build-preview/3-markup-notes-ipa-russian.png`.
8. **A misread to know about.** On page 3 the voice part reads three sharps in its first bar.
   - I looked at a crop of `pages/tch-3.png`: the printed page shows two sharps there.
   - The join keeps any changed key, as it did before. So Ilya's joined part changes key to three sharps at bar 63 and back to two at bar 71.
   - Desktop homr main reads the same three sharps (`reference-desktop-main/tch-3.musicxml`).

## Section 3's measurements

### 3.1 Set up

`git rev-parse HEAD` printed `94e524627808686cc6f76b59ac1e763a41d12c33`. The tarball md5 matched. `pnpm install --frozen-lockfile` exited 0. The gates before any change:

| gate | baseline | printed |
|---|---|---|
| phonology | 251 (251) | `Tests  251 passed (251)` |
| dictionary | 235 (235) | `Tests  235 passed (235)` |
| web check | 0 errors, 12 warnings | `svelte-check found 0 errors and 12 warnings in 5 files` |
| web test | 1885 (1885) | `Tests  1885 passed (1885)` |
| score-parser | 650, 5 skipped (655) | `Tests  650 passed \| 5 skipped (655)` |
| blurb | 145 (145) | `Tests  145 passed (145)` |
| integration | 55 (55) | `Tests  55 passed (55)` |
| ratchets | OK | `ratchets: OK.` |

Every baseline was met.

### 3.2 The fp16 465 encoder

I downloaded the zip (curl exit 0, 24,003,849 bytes) and unzipped it. The `.onnx` is 26,466,256 bytes, SHA-256 `50823c06...a992`.

I compared it with the `onnx` Python package 1.23.1 (`onnx.load`, inputs, outputs and nodes):

| file | input | output | opset, IR, nodes |
|---|---|---|---|
| fp16 396 encoder | `input` FLOAT16 [1,1,256,1280] | `output` FLOAT16 [1,1280,512] | 17, 8, 242 |
| fp16 465 encoder | `input` FLOAT16 [1,1,256,1280] | `output` FLOAT16 [1,1280,512] | 17, 8, 242 |
| fp32 465 encoder | `input` FLOAT [1,1,256,1280] | `output` FLOAT [1,1280,512] | 17, 8, 242 |

The fp16 396 and 465 encoders have the same names, types and shapes. None of the three uses an operator outside the default domain.

### 3.3 The port's own tests

In a fresh unpack, `npm ci` exited 0 and `tsc --noEmit` exited 0. Vitest printed `46 passed | 3 skipped (49)` test files and `915 passed | 42 skipped (957)` tests. Both equal the last builder's figures.

### 3.4 How ilya.1, as received, chooses files for model 465

- `src/worker.ts:72`: model `"465"` gives the store `MODEL_465_CATALOG`.
- `src/models/store.ts:214`: the placement is `placementOf(runtime)`.
- `src/models/backend.ts:169-173`: `artifactsFor` is the backend, and the provider is `webgpu` only on WebGPU.
- `store.ts:240` calls `resolveRole`.
- `manifest.ts:234-237`: the role takes its `onWebgpu.artifact` when that is a GPU placement and `artifactsFor` is `webgpu`; otherwise it takes `cpu`.
- **On WebGPU (ilya.1)**:
  - segnet: `segnet-308-fp16` (`:182`)
  - encoder: `encoder-465-fp32` (`:1177`)
  - decoder: `decoder-465-fp32`, which stays on wasm (`:1172`, `:120-132`)
- **On WebAssembly**:
  - segnet: `segnet-308-fp32` (`:177`)
  - encoder: `encoder-465-fp32` (`:1174`)
  - decoder: `decoder-465-fp32`
- **Watched on wasm.** The harness server logged exactly those three files: segnet `6ed36640…`, encoder `92bd1833…`, decoder `18801c1e…`.
- **After my change**, WebGPU asks for `encoder-465-fp16` (`third_party/homr-web/src/models/manifest.ts:1191`).

### 3.5 What the newer writer does that the older one did not

- **Comments.** Each note carries `<!-- imgpos: x, y -->` (`generate-main.ts:494-504`; comment nodes are at `xml.ts:114-122`). The older writer writes none. All 222 comments survive the join inside their notes.
- **Element order.** It writes in call order (`xml.ts:80-81`), not schema order (`xml.ts:62-71`).
  - A note reads chord, grace, pitch or rest, duration, type, dot, time-modification, voice, staff, notations (`generate-main.ts:7-10`, `:427-493`).
  - A pitch reads step, octave, alter (`:450-461`).
  - The join and the parser read by name, and the fixtures parse with no fatal error.
- **Default metre.** When the first `<attributes>` of a page has no `<time>`, the writer adds `<time>` with beat-type 4 after the page is written (`:913-918`, `:1026-1035`).
  - A clef always opens new attributes (`:963`, `:809-818`), so a printed metre never lands in that first element.
  - Every Tchaikovsky page gets `1/4`, page 1 too, beside its printed 3/8.
  - The older writer has no default (`generate.ts:763-774`).
- **Rests after a backup.** In a chord group that holds notes, the writer writes one rest only, after a `<backup>` (`generate-main.ts:575-586`). The older writer wrote all of them in order with no backup (`generate.ts:589-596`). The voice part has 0 `<backup>` on all three pages (counted).
- **A rest of several bars.** Both writers write `<measure-style><multiple-rest>` in the attributes, with no note (`generate-main.ts:929-938`; `generate.ts:805-806`, `:940-947`, `:733-748`). The voice part has 0 of them (counted).

## What was changed, file by file

### The port: `third_party/homr-web/`, packed as 0.2.0-ilya.2

- `src/models/manifest.ts:71`: `"encoder-465-fp16"` added to the list of model ids.
- `src/models/manifest.ts:970-978`: the record, in the shape of `encoder-396-fp16`.
- `src/models/manifest.ts:1171-1197`: `MODEL_465_CATALOG` uses it on WebGPU, and its comment is updated. Line 1 also notes ilya.2.
- `test/manifest.test.ts:100-114`: one new test. It is in my working copy and in `port-ilya1-to-ilya2.diff`, not in the repository.
- `package.json:3`: version `0.2.0-ilya.2`.
- `README.md:3` and `:11-18`: the new version, and the fp16 encoder's path and size.
- `CHANGES-ilya.md:4`, `:51-53` and `:87-99`: the new version, three new rows in the table of changed files, and a section for ilya.2.
- Results:
  - `npm run build` and `tsc` both exited 0.
  - Vitest: `46 passed | 3 skipped (49)` test files, `916 passed | 42 skipped (958)` tests.
  - `npm pack` gave md5 `604b0b906657ef3c7df2995edfa4a8bf`.

### Ilya

- **`third_party/homr-web/`** (new, 124 files, 1.9 MB) holds:
  - `src/`, `tools/` and `docs/` (the port's `README.md:177-253` cites `tools/` and `docs/`);
  - `package.json`, `package-lock.json`, `tsconfig.json`, `tsconfig.build.json`;
  - `LICENSE`, `NOTICE`, `README.md`, `CHANGES-ilya.md`;
  - the tarball and a new `README-ilya.md`.
- **`test/` is left out** (22 MB). The build includes only `src`. As proof, a copy of the folder ran `npm ci`, `npm run build` and `npm pack` (exit 0) and gave the identical md5 `604b0b90…`.
- **Ignore rules and workspace.** `git check-ignore` shows that `node_modules/` and `dist/` there are ignored, and the tarball and `src/` are not. `pnpm-workspace.yaml` is unchanged.
- **`apps/web/package.json:24`**: `"homr-web": "file:../../third_party/homr-web/homr-web-0.2.0-ilya.2.tgz"`.
- **`pnpm-lock.yaml`**: against step 1, only the homr-web specifier, version and resolution changed (`:39-40`, `:940-942`, `:1962`). pnpm wrote no `allowBuilds` lines.
- **`apps/web/src/lib/omr/homr-reader.ts`**:
  - `:5-13`: the header now says what is there.
  - `:77`: `model: '465'`.
- **`apps/web/scripts/fetch-omr-models.mjs`**:
  - `:13-20`: the header now says what is there.
  - `:42-48`: the five 465-set files, and no 396 file.
  - Run alone, it downloaded and checked all five (exit 0).
- **`apps/web/src/lib/omr/join-pages.ts`**:
  - `:21-34`: the header now covers `imgpos` and the writer's own metre.
  - `:174` and `:178`: the first measure of each page is passed in.
  - `:229-243`, `writersTimeIndex`: it finds the `<time>` beside `<divisions>` in a page's first measure. That `<time>` is dropped when the same measure prints a metre, or when a metre is in force from an earlier page.
  - `:245` and `:250`: `rewriteAttributes` skips the `<time>` that is dropped.
  - `:285`: the call.
  - Everything the join did before is kept.
- **`apps/web/src/lib/omr/fixtures/tch-{1,2,3}.musicxml`**: the changed port's browser output from the kit's PNG pages (md5 `568dcb61…`, `45d70060…`, `1fe26818…`), byte for byte the Node output.
- **`apps/web/src/lib/omr/join-pages.test.ts`**:
  - Header `:3-17`.
  - Measures: 98 became 99 (`:55`, `:57`, `:92`). Pages: 27, 35, 36 became 27, 35, 37.
  - Pitched voice notes: 176 became 174 (`:62`). conv.py printed `[(27, 52), (35, 90), (37, 80)]`.
  - `<key>` count: 1 became 3, at bars 1, 63 and 71, with 2, 3 and 2 sharps (`:107`).
  - Unchanged: one `<time>`, one `<clef>`, and divisions of 2, 4 and 4 at indices 0, 27 and 62.
  - New hand-built test at `:174-187`.
- **`NOTICES.md:54-71`**: homr-web is now 0.2.0-ilya.2, a changed copy of upstream `cb333a5`, with its source in `third_party/homr-web/`. homr is now main at `560ca5c` with model 465. The form is kept.
- **Singer-facing strings that are now untrue, left as they are:**
  - `apps/web/src/lib/components/Reading/GuideContent.svelte:566`: "...homr-web; both are released under the GNU Affero General Public License, version 3, and both run unchanged."
  - The French at `:287`: "...et tous deux sont utilisés sans modification."

## Gates, before and after

| gate | before | after |
|---|---|---|
| phonology | 251 | 251 |
| dictionary | 235 | 235 |
| web check | 0 errors / 12 warnings | 0 errors / 12 warnings |
| web test | 1885 | **1886** |
| score-parser | 650 + 5 skipped | 650 + 5 skipped |
| blurb | 145 | 145 |
| integration | 55 | 55 |
| ratchets | OK | OK |

The +1 comes from the new hand-built test at `join-pages.test.ts:174`. The changed counts inside the existing tests are listed above.

**A clean copy installs.** I copied the tree without `node_modules`, `.git` or `static/omr`. `pnpm install --frozen-lockfile` exited 0 and installed homr-web `0.2.0-ilya.2`.

**The change bundle reproduces the tree.** `wire-465-changes.tgz` unpacked over a fresh clone of `94e5246` gives the same `git status --porcelain` and the same md5 for all 142 changed or new files.

## The proof

**The port alone in a browser.** My own page and server (`proof/scripts/index.html`, `serve.mjs`, `drive.mjs`) serve `dist/` and the real models in `<sha256>/<file>`. OCR was off.
- Backend: `wasm`, 1 thread. The port gave the reason: no adapter, and no cross-origin isolation.
- Times: tch-1 152,149 ms, tch-2 148,724 ms, tch-3 112,379 ms. The gates were running on the same 2 cores.
- `cmp.py` against Node: `EQUAL` on all three pages.
- `cmp.py` against desktop homr main: `EQUAL` on pages 1 and 3. Page 2 differs by one `<alter>1</alter>` on G4, which CHANGES-ilya.md already records.

**WebGPU.** The flags `--enable-unsafe-webgpu --use-webgpu-adapter=swiftshader --enable-features=Vulkan` gave an adapter.
- The recognizer chose `webgpu` and fetched only the fp16 segnet.
- Then came 1,248 validation errors starting `'f16' type used without 'f16' extension enabled`, and the read ended `not_music` in 8,040 ms.
- The fp16 465 encoder was never requested.

**Ilya, dev server, the PDF** (`proof/scripts/walk-ilya.mjs`).
- Read time: 328,991 ms by Ilya's own clock, and 340,786 ms from the drop. Nothing else heavy was running.
- Backend `wasm`. 3 of 3 pages.
- Joined part: 99 measures; 222 notes (174 pitched); 222 `imgpos` comments; one `<time>` (3/8); keys at bars 1, 63 and 71.
- Empty bars: 1 to 7, 62, 70, 84, and 94 to 99.
- Ilya's PDF raster gives different per-page MusicXML from the PNG pages. Pages 1 and 3 differ in the piano part. On page 2 the PDF read has the G4 sharp that desktop main also reads.

**Score** (kit `conv.py` and `score.ts`, against `tchaikovsky-op38-3.truth-draft.json`):

| what was scored | score | where the pitches are misread |
|---|---|---|
| Ilya's joined part, from the PDF | **98.28** | truthBar 35, 39, 67; bars all right 80 of 99 |
| The browser's reads of the PNG pages | 98.85 | truthBar 35, 67 |
| On file: older build | 93.10 | |
| On file: changed port under Node | 98.85 | |

**The built app.** `pnpm build` exited 0, and `static/sw.js` is unchanged against step 1.
- `pnpm preview`, then `tch-1.png` dropped: 108,980 ms on wasm.
- Its page MusicXML has md5 `568dcb61…`, the same as the harness's.
- The Markup picture shows the notes with IPA and Russian under them.

## NOT ESTABLISHED

- A model 465 read on a real WebGPU adapter. The fp16 encoder and the fp16 segnet were never exercised on WebGPU.
- Whether the port steps down to WebAssembly when an adapter lacks `shader-f16`. What I watched: it chose `webgpu` and returned `not_music`.
- How Ilya's parser treats a backup-then-rest, or a `multiple-rest`, in the voice part. Neither occurs in this song.
- Read time on the iMac.
- The port's `tools/gen-manifest.mjs:24-38` still lists only the older files. Running it would drop the hand-written 465 records. I did not change it.

## What I would do next

1. The owner walks the same PDF on his iMac, which has WebGPU, and reads the backend line.
2. The owner rules on the Guide sentence at `GuideContent.svelte:566` and `:287`.
3. The owner decides whether a misread key change should reach the singer as a key change.

## Deliverables, in `/mnt/user-data/outputs/wire-465/`

| file | md5 |
|---|---|
| `wire-465-changes.tgz` (142 files) | `3ca94e1433449af6e267cdad483c79d1` |
| `files.txt` | `d48494e88502a9670a405a73870313be` |
| `tracked.diff` | `c1d3a5af3d5803e07c883437221855c8` |
| `homr-web-0.2.0-ilya.2.tgz` | `604b0b906657ef3c7df2995edfa4a8bf` |
| `CHANGES-ilya.md` | `34de94382ce3f87e74800bf8ec8d3d31` |
| `models.txt` | `4066a6dd710eb36ad5aadd57ba82f73e` |
| `port-ilya1-to-ilya2.diff` | `f600a0abe5443d57d8bf7604595bff78` |
| `proof/ilya-pdf-read/4-markup-notes-ipa-russian.png` | `fa5f62c1f90ab5ecf83baee770a8dfcc` |
| `proof/ilya-pdf-read/5-opening-silent-bars-collapse_crop-of-4.png` | `109da1693983ae22f95b6bd480075b8c` |
| `proof/ilya-pdf-read/joined.musicxml` | `892de72323ee45cc9d6db1267568421f` |
| `proof/build-preview/3-markup-notes-ipa-russian.png` | `46d15dace639c25f22d4cc9edc50a65c` |
| `proof/port-alone-in-browser/tch-1.musicxml` | `568dcb61e91cc956161bdbc47ff6bf48` |

`proof/` (2.5 MB) also holds:
- the per-page MusicXML from the PDF read and from the harness;
- `webgpu-attempt/`, `node-run/`, `score/`, `gates-before/` and `gates-after/`;
- `logs/`: install, clean install, model fetch, dev, build, rebuild, and the port's tsc and vitest;
- `scripts/`;
- `cmp-results.txt`.

None of the kit's scripts went into the repository. `report.md` is not there, because the environment refused to write it.

## Wall time, and what stopped me

From 02:32:14 to about 03:09, about 37 of the 100 minutes. About 235,000 of the 600,000 tokens. Nothing stopped the work.

- One `pgrep -f "vite/bin/vite.js"` matched my own shell and killed that command, as the brief warned. I then stopped the dev server by its process number.
- The three PNG-page browser times were taken while the gates were running on the same 2 cores.
