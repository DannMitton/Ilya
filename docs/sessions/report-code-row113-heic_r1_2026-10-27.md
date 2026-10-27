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

## Step 1

(not started)

## What I could not establish

- libde265's licence from a file in the package (above).
- A cold offline load of the decoder files.
- Whether the AV1, JPEG 2000, or H.264 paths are compiled into `libheif.wasm` (not needed: `isHeifImage` excludes AVIF, and iPhone photographs are HEVC).
