# Report: QUEUE row 113, Ilya opens iPhone photos in HEIC, 2026-10-27

Brief: `brief-code-row113-heic_r2_2026-10-27.md` (saved at `/tmp/briefs/`, not committed). Branch `cloud-lane-18`, started from `origin/Shane` at `234eff3f`, working tree clean at the start. Cloud session, Sonnet. Every step below was run in this session unless it says NOT ESTABLISHED.

## Gates before any edit (2026-10-27, `234eff3f`, fresh `pnpm install --frozen-lockfile`)

| Gate | Result |
|---|---|
| phonology | 291 passed (291) |
| dictionary | 248 passed (248) |
| web check | 0 errors, 12 warnings in 5 files |
| web test | 3231 passed (3231), 180 files |
| score-parser | 775 passed, 5 skipped (780) |
| blurb | 145 passed (145) |
| integration | 55 passed (55) |
| ratchets | OK |

All eight match section 6 of the brief.

## Step 0: the decoder, measured, nothing in the app changed

### Choice

**`libheif-js` 1.23.5**, published 2026-10-04 (23 days before today), LGPL-3.0, pinned exactly in step 1.

Why, in the order the brief ranks:

1. It is the only candidate that ships the `.wasm` as its own file (`libheif-wasm/libheif.wasm`, 1,463,506 bytes) beside a separate Emscripten glue file (`libheif-wasm/libheif.js`, 91,255 bytes). The brief needs that for the LGPL replacement condition and for the lazy load. `heic-to` and `heic2any` each put the engine inside one JavaScript file.
2. It is the one candidate that carries the library's licence text as a file (below).
3. It decodes all five fixtures in Node, in headless Chromium in the page, and in a Worker.
4. It is recent (`libheif` 1.23.x, `libde265` compiled in), and the smaller candidate is not usable (see `heic2any`).

### The survey

| Package | Version, published | Licence file in the package | What the browser would load | Decodes the fixtures |
|---|---|---|---|---|
| `libheif-js` | 1.23.5, 2026-10-04 | `LICENSE` at the root (LGPL-3.0 text, 7,652 bytes) and `libheif-wasm/LICENSE` (44,366 bytes: libheif's header, then LGPL-3.0, then GPL-3.0) | `libheif.js` 91,255 + `libheif.wasm` 1,463,506 = 1,554,761 raw; 29,054 + 482,812 = 511,866 gzip -9 | Node: all five. Chromium page: all four HEIC pages. Worker: yes. Offline: see below |
| `heic-decode` | 2.1.0, 2025-07-04 | ISC (package) | 6,656 bytes of its own, plus `libheif-js` ^1.19.8 as a dependency; the default `libheif-js` build it uses is the pure JavaScript one, 3,189,493 bytes | Node: all five. Not run in Chromium: it is a wrapper over `libheif-js`, adds nothing the app needs, and loads the larger build |
| `heic-to` | 1.6.6, 2026-10-11 (16 days; 1.6.7 is from today and excluded) | LGPL-3.0 (`LICENSE`) | one file, `dist/heic-to.js`, 3,152,244 bytes, engine inside; README says libheif 1.23.6 | Chromium page: all (a, b, c, e) |
| `heic2any` | 0.0.4, 2023-03-29 | `LICENSE.md` is MIT only; it names neither libheif nor libde265 | one file, `dist/heic2any.min.js`, 1,351,840 bytes, engine inside | Chromium page: all (a, b, c, e) |
| `@saschazar/wasm-heif` | 2.0.0, 2021-04-15 | MIT `LICENSE`; `package.json` lists libde265 v1.0.8 and libheif v1.11.0 | `wasm_heif.js` 120,013 + `wasm_heif.wasm` 466,186 | No. Fails to initialize in Node 22 as documented, and with `wasmBinary` supplied `m.decode` is not a function. Not pursued |

`heic2any` is 203,000 bytes smaller than `libheif-js` and decodes the fixtures. It fails the licence test: it ships LGPL code (libheif, libde265) inside a single file under an MIT licence file, with no LGPL text, and its last release is 2023. The brief says "smallest that decodes the fixtures and passes the licence test". It does not pass.

No candidate is GPL. The `libheif-wasm/LICENSE` of `libheif-js` also holds the GPL-3.0 text after the LGPL-3.0 text, under a header that says the library is LGPL and the sample applications are MIT; the GPL text is not stated to apply to anything that ships in the `.wasm`.

### Libraries compiled into `libheif.wasm`

Read from the binary (`strings`, 2026-10-27), not from a package file. The package names no component libraries.

- libheif: the string `1.23.5` is in the binary beside `heif_get_version`. The README says the package follows libheif's major and minor version.
- libde265, the HEVC decoder: present. The strings `libde265 HEVC decoder`, `../libde265/image.h`, `init_CABAC_decoder`, and `de265_get_image_plane` are in the binary. The string `1.0.15` sits beside `1.23.5`; I read it as libde265's version. That reading is an inference from adjacency.
- Not found in the binary: symbols for `x265`, `aom`, `dav1d`, `opj_`, `jpeg_read_header`, `WelsCreateDecoder`. The words `openjpeg`, `libjpeg`, `openh264`, `vvdec` appear only as name strings, and I did not establish that any of them is compiled in. The decode of an AV1 or JPEG 2000 HEIF was not tested.
- **NOT ESTABLISHED: libde265's licence, as read from a file in the package.** The package ships only the libheif text. My recollection is that libde265 is LGPL-3.0; I did not read it from a source, and the desk should before the ship.

### Files that must ship beside the binary

`libheif.wasm` (1,463,506), `LICENSE` from `libheif-wasm/` (44,366), and `libheif.js` (91,255) if the glue is served as its own file. Step 1 decides the third; the byte count is final only then.

`NOTICES.md` gains (proposed, lands in step 1):

> - **libheif-js** 1.23.5, <https://github.com/catdad-experiments/libheif-js>, an Emscripten build of libheif, <https://github.com/strukturag/libheif>, with the libde265 HEVC decoder. GNU Lesser General Public License version 3. Ilya loads `libheif.wasm` unchanged, as its own file from `/heif/`, only when a photograph is in HEIC format. The licence text is served beside it.

### Behaviours of `libheif-js` that step 1 must handle

1. `HeifDecoder.decode()` returns every top-level image in item-ID order (`heif_js_context_get_list_of_top_level_image_IDs`), not the primary first. Index 0 is not established to be the primary. Step 1 uses `heif_js_context_get_primary_image_handle` and tests a two-image HEIC.
2. On a parse failure `decode()` logs to the console and returns an empty array. It does not throw. The wrapper must treat `[]` as a failure.
3. `libheif-js/wasm` reads `./libheif-wasm/libheif.wasm` relative to the working directory, so it throws `ENOENT` from any other directory. Step 1 passes the bytes as `wasmBinary` and does not use that entry.
4. Rotation: libheif applied the `irot` box. Fixture (b), stored 2,200 by 1,600 with an `irot` box, came back 1,600 by 2,200 with 120 dark rows and 0 dark columns, the same as the upright fixture. So the decoder applies rotation and step 1 adds none. The brief's mutant "skip the orientation" therefore has no code of mine to skip unless the test strips it; see step 1.
5. Types: `libheif.d.ts` is Emscripten's `MainModuleFactory(options?: unknown): MainModule` and does not declare `HeifDecoder` or `HeifImage` (no match in the file). Step 1 adds a `.d.ts`.

### Fixtures

Written by `apps/web/src/lib/reader/fixtures/make-fixtures.py` (`pillow-heif` 1.8.1, Pillow 12.3.0, libheif 1.23.6 inside `pillow-heif`). Regenerating gave byte-identical files for (a) and (e). All HEIC are lossless (`quality=-1`), brand `heic`.

| File | Brief name | What it is | Bytes |
|---|---|---|---|
| `staff-page.heic` | (a) | 1,600 by 2,200, eight systems of staff lines and noteheads, black on white | 77,145 |
| `staff-page.png` | (a) source | the PNG it was encoded from, for the Playwright comparison | 21,695 |
| `staff-page-irot.heic` | (b) | stored 2,200 by 1,600, an `irot` box with angle 3 (`pillow_heif` wrote an `irot` box, not only EXIF; the file also carries an Exif item) | 211,214 |
| `photo-page.heic` | (c) | grey photo-like page: paper about 200, ink about 40, a gradient, Gaussian noise (sigma 4) | 1,960,242 |
| `staff-page-grid.heic` | (e) | (a) as a `grid` item of 512 px tiles: `pillow_heif` could write it with `GRID_TILE_SIZE`; the boxes show one `grid` item and a `dimg` reference | 126,843 |
| `poem-page.heic` | step 2 | four lines of Russian on white, 1,600 by 900 | 49,241 |
| `make-fixtures.py` | | the generator | 2,685 |

Total committed: 2,448,865 bytes. (d), the real iPhone HEIC, is not in the tree; the tests read it from `ILYA_HEIC_REAL` when set.

Not made: a PNG of (c) (3.3 MB, not needed).

### What was run (Step 0)

- Node 22.22.0, one process per package, `libheif-js` wasm build with `wasmBinary` supplied: (a) 163 ms, (b) 130 ms, (c) 349 ms, (e) 83 ms, poem 32 ms, first call includes instantiation. Dark-row and dark-column counts: 120 and 0 for all four pages; the poem has none by design.
- Playwright Chromium (headless shell 1243), a static server on 127.0.0.1: page decode of (a), (b), (e), (c) in 818 ms including instantiation, each 1,600 by 2,200, one image each. Worker decode of (b) in 182 ms, 1,600 by 2,200. Zero requests to any host other than 127.0.0.1.
- Offline: the Worker decode of (a) passed with the context set offline, in 141 ms. **The files may have come from the browser's HTTP cache**, so this shows the decoder makes no outside call, not that a cold offline load works. NOT ESTABLISHED: a cold offline load.

Nothing in the app was changed in this step. The commit holds the fixtures, the generator, and this report.

## Step 1: `heic-decode.ts`, the fallback in `toGreyscalePng`, and the offline amendment

Two desk amendments arrived during this step and are applied here: Dann's 14:58 ruling (the decoder must work offline once Ilya has been opened online, not only after a first HEIC; step 0 was done, so it sits in step 1 as asked), and the Fable note that `ScoreUploader.svelte` already has its own `function inkFile(original: File)` (line 770, read by `announceArrival` at line 626). **The new export is therefore `inkPng(source, ink)`, not `inkFile`**, in `page-image.ts`, in its tests, and at its four call sites. The component's own `inkFile` is untouched.

### What changed

| File | Change |
|---|---|
| `apps/web/src/lib/reader/heic-decode.ts` (new, 80 lines) | `decodeHeic(bytes, wasmBinary?)`: dynamic `import()` of the libheif glue, fetch of `/heif/libheif.wasm`, picks the primary image by `is_primary()`, treats libheif's empty array as a failure, frees the images. A fresh WebAssembly instance per call, so the heap is collectable. Runs in the page (see below) |
| `apps/web/src/lib/reader/libheif-js.d.ts` (new) | types for the one entry; the package's own `.d.ts` lacks `HeifDecoder` and `HeifImage` |
| `apps/web/src/lib/reader/page-image.ts` (98 to 156 lines, with the step 2 memo) | on `createImageBitmap` failure, and only if the first 12 bytes sniff as HEIF, imports `heic-decode`, draws the RGBA with `putImageData` to the same `OffscreenCanvas`, and continues through `greyscaleCanvasToPng`. Any decoder failure is the existing `ImageUndecodableError`. Exports `inkPng`. `stemOf` is shared with `pieceIdFor` |
| `apps/web/src/lib/reader/heif-brand.ts` (new) | `HEIF_BRANDS` and `isHeifImage`, **moved** from `score/ingestion/format-detection.ts` (see the departure below) |
| `apps/web/src/lib/score/ingestion/format-detection.ts` | imports both from `reader/heif-brand.ts`; `ISO_BMFF_IMAGE_BRANDS` is now `[...HEIF_BRANDS, 'avif', 'avis']`; `isHeifImage` is re-exported. Same brand set, same behaviour |
| `apps/web/src/lib/score/ScoreUploader.svelte` (1358 to 1357) | four call sites hand `readAsPoemByOcr(inkPng(file, ink), ...)`; the `stem` line before the PDF call is gone |
| `apps/web/scripts/copy-heif-wasm.mjs` (new), `package.json` `dev` and `build`, `.gitignore` | writes `static/heif/libheif.wasm` and `LICENSE-libheif.txt`, rebuilt each run, exits non-zero if either is missing; wired after `copy-ort-wasm.mjs` |
| `apps/web/package.json`, `pnpm-lock.yaml` | `libheif-js` `1.23.5`, exact. The lockfile gains 9 lines. `pnpm` 10.28 also wanted to delete the `libc:` lines elsewhere in the lockfile; I kept them, so the lockfile diff is the dependency only |
| `NOTICES.md` | the libheif-js line, as proposed in step 0 |
| `apps/web/static/sw.js`, `apps/web/scripts/stamp-sw.mjs` | the offline amendment, below |

**Departure from the brief, and why.** The brief has `page-image.ts` call `isHeifImage` from `score/ingestion/format-detection.ts`. `pnpm ratchets` refuses it: `reader/` may not import `score/` (`scripts/ratchets.mjs`, MODULES, `reader: []`). I did not change the module table. The sniff and the HEIF brand list moved to `reader/heif-brand.ts`; `score/` may import `reader/`, so `format-detection.ts` imports them back. One definition, not two.

**Where the decoder runs.** In the page. The glue is synchronous, so a 48 MP photograph blocks the page while it decodes (measured below). A Worker also loads and decodes in Chromium (step 0: 182 ms for a 1,600 by 2,200 page), so moving it is open if Dann's look on a phone finds the block too long.

**Rotation.** libheif applies `irot`, `imir`, and `clap` itself and reassembles `grid` items. No orientation code was added. Fixture (b), stored 2,200 by 1,600 with an `irot` box, decodes upright. The brief's mutant "skip the orientation" cannot be built against libheif-js: it has no switch for it. Instead `heic-decode.test.ts` carries a positive control: a quarter turn of the decoded (b) is judged on its side. NOT SCORED: a decoder that really skipped `irot`.

**Which image is chosen.** The primary, by `is_primary()`. libheif-js lists every top-level image in item-ID order. `two-images-second-primary.heic` (49,809 bytes, committed, made by `make-fixtures.py`) holds a blank 640 by 480 image first and the primary 800 by 1,100 page second; the test asserts 800 by 1,100.

### Offline (Dann 14:58)

`static/sw.js` fetches the decoder's files in the background, 3 seconds after the app shell is cached, inside the install event. The files are not in `APP_SHELL`, a failed fetch is swallowed so it cannot fail the install, and nothing is under `/omr/`. The files are: `/heif/libheif.wasm`, `/heif/LICENSE-libheif.txt`, and the decoder's JavaScript chunks. **The chunks are hashed and a lazy `import()` fails whole if any dependency is missing offline**, so `stamp-sw.mjs` finds them at build time by content (`HeifDecoder`, `/heif/libheif.wasm`), adds the chunks they import, writes the URLs into `sw.js`, and exits non-zero if it finds fewer than two. In this build that is six chunks. My first version cached only two and the offline test caught it: the glue chunk imports `Bx2EM-6T.js`, and the dynamic import failed with `Failed to fetch dynamically imported module`.

**Extra bytes every visitor now downloads once**, measured on this build (`build/`, 2026-10-27):

| File | Raw bytes | gzip -9 |
|---|---|---|
| `/heif/libheif.wasm` | 1,463,506 | 482,812 |
| `/heif/LICENSE-libheif.txt` | 44,366 | 14,394 |
| `KqkYyNJv.js` (libheif glue) | 89,634 | 28,008 |
| `BDOmw9LV.js` (`heic-decode`) | 1,062 | 641 |
| `fM3fQ8ZP.js`, `CJyy1nuf.js`, `C2qyyL9V.js`, `Bx2EM-6T.js` (shared helpers the two import) | 30,284 | not measured |
| **Total** | **1,628,852** | about 526,000 plus the helpers |

The four helper chunks are probably fetched by the app anyway; the figure that is certainly new is 1,598,568 raw. Whether the host compresses `.wasm` in transit is NOT ESTABLISHED, so the raw figure is the one to plan on. **`static/heif/` is 1,507,872 bytes (2 files). One HEIC on a visitor who has not yet had the background fetch costs the wasm, the glue, and the `heic-decode` chunk: 1,554,202 bytes raw.** The ship waits for Dann to hear these numbers (`CONTRACT.md` section 8).

Limits of the offline cache, NOT hidden:

- It happens at install of each new build (`CACHE_VERSION` changes every deploy), so every deploy fetches the decoder's files again, about 1.6 MB, unless the bytes are unchanged in the browser's HTTP cache. NOT ESTABLISHED how often that hits.
- A fetch that fails (no connection at install) is not retried until the next build. The lazy path still caches the files on first use, as before.
- The first load of a new visitor runs before the service worker controls the page, so the app's own files are cached by the worker only on the second visit. That is how the shell already behaved. The offline spec does the second online visit.
- Offline, the reader's models under `/omr/` are held by the HTTP cache only (`sw.js` refuses that prefix). The offline spec proves the wait shows and the decode starts. Whether homr then finishes offline is NOT ESTABLISHED and is not this row's.

### Tests

| File | Tests | Result |
|---|---|---|
| `heic-decode.test.ts` | 9 run, 1 skipped (`ILYA_HEIC_REAL`) | (a) 1,600 by 2,200 with 120 dark rows and 0 dark columns; (b) upright; the quarter-turn control reads sideways; (c) paper grey between 185 and 215; (e) the grid reassembled; the primary is chosen; a truncated HEIF, non-HEIF bytes, and an unfetchable decoder each reject |
| `page-image.test.ts` | 9 (7 at step 1) | PNG and JPEG resolve with the decoder module never loaded; a HEIF loads it once for two photographs; a decoder failure and an AVIF and unreadable bytes each give `ImageUndecodableError`; `inkPng` returns an `image/png` File named `<stem>.png` |
| `e2e/heic-fallback.test.ts` | 1 | Playwright Chromium, dev server: `toGreyscalePng` on (a) and on its source PNG: 1,600 by 2,200 both, **100.000 percent of pixels within 2 levels, worst difference 0**. The spec also asserts this Chromium does not decode HEIC itself |
| `e2e/heic-offline.test.ts` | 1 | Serves `build/` on 127.0.0.2 (the service worker does not register on `localhost`, `app.html`). Loads online, waits until the worker has cached the decoder files, loads once more, goes offline, reloads, drops (a): the reader's wait shows, neither refusal text appears, no `IMAGE_UNDECODABLE`. Needs `pnpm build` first and skips without it |

`ILYA_HEIC_REAL=/path/to/photo.heic pnpm exec vitest run src/lib/reader/heic-decode.test.ts` runs the real-photograph test. It judges upright by comparing the variance of row means to the variance of column means (a photograph is not binary) and prints the size and both variances. **NOT SCORED here: (d) was not available to me.** The metric is untried on a real photograph, so if the desk's run fails, check the printed variances before trusting the failure.

### Mutants

| Mutant | Killed by |
|---|---|
| skip the fallback (`createImageBitmap` failure throws at once) | `page-image.test.ts`, "decodes a HEIF the browser refuses ..."; and `e2e/heic-fallback.test.ts` (failed) |
| load the decoder for every picture (an `import()` at the top of `toGreyscalePng`) | `page-image.test.ts`, "resolves a PNG and a JPEG without loading the HEIC decoder" |
| skip the orientation | not constructible (above); the positive control in `heic-decode.test.ts` shows the instrument can fail |
| hand tesseract the original file | step 2 (the poem drop reads what tesseract is handed) |
| service worker does not cache the decoder (`DECODER_FILES = []`) | `e2e/heic-offline.test.ts` (timed out waiting for the cache); restored, it passes |

### Large photograph (brief section 7)

A 6,000 by 8,000 (48 MP) HEIC, lossy quality 80, 202,174 bytes, made with `pillow_heif` (not committed). Playwright Chromium, headless shell, desktop, page: listing 47 ms, decode 1,284 ms (the page is blocked for about that long), WebAssembly heap 382 MB, renderer resident memory 648 MB after the decode (that includes the 192 MB RGBA array). **NOT ESTABLISHED on a phone**; the desktop figure does not bound it. The long-task observer reported 0 and I do not trust it for a synchronous block inside one call.

### Gates after step 1

| Gate | Before | After |
|---|---|---|
| phonology | 291 | 291 |
| dictionary | 248 | 248 |
| web check | 0 errors, 12 warnings in 5 files | 0 errors, 12 warnings in 5 files |
| web test | 3231 | 3249 passed, 1 skipped (3250): +9 in `heic-decode.test.ts`, +9 in `page-image.test.ts` (7 at step 1, 2 added at step 2 for the memo) |
| score-parser | 775 passed, 5 skipped | 775 passed, 5 skipped |
| blurb | 145 | 145 |
| integration | 55 | 55 |
| ratchets | OK | OK |

`ScoreUploader.svelte` is 1357 of 1358; I did not lower the ceiling in `ratchets.json` (the brief says it stays). `page-image.ts` is 156 lines (137 at step 1, before the memo of step 2), `heic-decode.ts` 80. `vite build` and `stamp-sw.mjs` run clean.

## Step 2: the real path, in headless Chromium

Run 2026-10-27 in Playwright Chromium (the bundled headless shell, revision 1243, which does not decode HEIC, so the fallback is the path that runs) against the dev server, by `apps/web/e2e/heic-reader-path.test.ts`. Pictures are in `docs/sessions/row113-heic-shots/`.

### Fixtures (a) and (c), set on `input.hidden-input`

| Check | (a) `staff-page.heic` | (c) `photo-page.heic` |
|---|---|---|
| `upload.err.imageHeic` or `upload.err.imageUndecodable` text on the page | none | none |
| the reader's wait | `upload.status.preparingReader` shown ("Ilya is reading the notes off your page ..."), then "Reading your score, page 1 of 1" | same |
| `IMAGE_UNDECODABLE` in the console | none | none |
| requests after the drop to any origin other than Ilya's | none | none |
| the decoder's requests | `/node_modules/.vite/deps/libheif-js_libheif-wasm_libheif__js.js` (the glue, from the dev server's dependency cache) and `/heif/libheif.wasm`, both on `localhost:5173` | same |
| homr | finished in under 100 s: the drawer shows a score named `staff-page.musicxml`, tempo "estimated" | finished in under 100 s: `photo-page.musicxml` |

Pictures: `wait-staff-page.png` and `wait-photo-page.png` (the drawer at the wait), `after-staff-page.png` and `after-photo-page.png` (the drawer when homr had finished). The dev glue file name is Vite's; on a build it is the hashed chunk of step 1.

**Not established: the note count.** The page's notes carry no attribute the spec can count, and the fixtures are synthetic noteheads placed at random, not a score with a truth file, so a count would be NOT SCORED in any case (`CONTRACT.md` section 1, item 18). What is shown is that the reader accepted the ink and produced a MusicXML file.

### Finding: the HEIC was decoded twice per drop

The first run requested `/heif/libheif.wasm` twice per drop. Several routes each call `toGreyscalePng` on the same `File` (the reader, the clef and key probe, `scan.ts:41`), so each decoded the HEIC again, seconds each at 12 MP and about 1.3 s at 48 MP on this machine. **I added a memo** in `page-image.ts`: the fallback's ink is kept per `File` object in a `WeakMap`, in memory only, never stored. Each caller gets a copy (`slice(0)`), because a caller may transfer its buffer to a Worker and detach it. A failed decode is not kept. This is outside the brief's text; it is the desk's to keep or strike. With it the run requests the wasm once. Two tests cover it (same File decodes once and each caller gets its own buffer; a failure is not kept).

### Third drop: a HEIC poem with no staves (`poem-page.heic`)

- The busy label `intake.picture.reading` ("Reading the words out of the picture...") showed, and the poem landed: the Poem box holds four lines, `Я помню чудное мгновенье: / Передо мной явилась ты, / Как мимолётное виденье, / Как гений чистой красоты.`, with IPA and glosses on the page (`poem-landed.png`). The OCR failure literal (`OCR processing failed.`) did not appear.
- What tesseract was handed, read from the bytes the page posts to its Worker (`payload.image`): `89 50 4e 47 0d 0a 1a 0a 00 00 00 0d`, a PNG signature. With the mutant (the original file handed over) it was handed `00 00 00 1c 66 74 79 70 68 65 69 63`, the HEIC's own `ftyp heic`, and the spec failed. That kills the mutant "hand tesseract the original file".
- **A finding about the outside world, not about this row.** tesseract.js loads its Worker script, its WebAssembly core, and the Russian language data from `cdn.jsdelivr.net` (its defaults; `createWorker('rus')` passes no paths). The run logged the three requests: `/npm/tesseract.js@v7.0.0/dist/worker.min.js`, `/npm/tesseract.js-core@v7.0.0/tesseract-core-relaxedsimd-lstm.wasm.js`, `/npm/@tesseract.js-data/rus/4.0.0_best_int/rus.traineddata.gz`. This sandbox cannot reach that host (the proxy answers 403), so my first poem run ended in `OCR processing failed.` with no HEIC involved. For the poem run the spec serves those three files from disk (`@tesseract.js-data/rus` 1.0.0 from `npm pack`, the worker and core from `node_modules`), so the poem result above is from a run where the CDN was not used. The brief cites N.197's direction of no outside service at run time; the poem route does not meet it today, for every picture format. Not changed here.

### Every place `upload.err.imageHeic` is reached, and what makes it fire

`ScoreUploader.svelte:362` (a rasterize failure on the first read, in `rasterizeFirstPage`) and `:602` (a `ImageUndecodableError` on the other route), both through `undecodablePictureMessage` (`:495-498`), which returns `upload.err.imageHeic` when the bytes sniff as HEIF and `upload.err.imageUndecodable` otherwise. After this row it fires only when the decoder also fails: a damaged or truncated HEIF, a HEIF shape libheif does not read, or the decoder's files cannot be fetched (offline with no cached copy; the service worker now caches them after install, so that is a visitor whose install-time fetch failed, or a browser with no service worker). The English "Ilya cannot yet open iPhone photos in HEIC format" is then untrue for the first case and a half-truth for the others. No string was changed (brief section 5); the desk's replacement is owed before the ship.

### Gates after step 2

Same as the step 1 table except web test, now 3249 passed and 1 skipped (3250). Web check 0 errors and 12 warnings in 5 files, ratchets OK, the other five unchanged.

## What I could not establish

- (d), the real iPhone photograph: not available to me. The `ILYA_HEIC_REAL` test is written and skipped; its upright metric (row-mean variance against column-mean variance) was never run on a real photograph.
- Whether iOS Safari hands the page a HEIC or a JPEG, and whether Safari's own `createImageBitmap` decodes HEIC (the desk's own gaps; Dann's look on his iPhone settles them).
- Decode time and memory on a phone. The 48 MP figures are desktop Chromium.
- The note count for fixtures (a) and (c), and any score-against-truth reading: NOT SCORED.
- Whether the host compresses `.wasm` in transit, and how often the browser's HTTP cache saves the decoder's re-fetch at each deploy.

- libde265's licence from a file in the package (above).
- A cold offline load of the decoder files.
- Whether the AV1, JPEG 2000, or H.264 paths are compiled into `libheif.wasm` (not needed: `isHeifImage` excludes AVIF, and iPhone photographs are HEVC).
