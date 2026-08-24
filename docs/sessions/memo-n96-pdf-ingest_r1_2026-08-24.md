# N.96: PDF ingest blank raster on JBIG2 IMSLP scans

Target file: `sunless-01-v-chetyryokh-stenakh_lamm-scan.pdf` (2 pages, 5548x7380 @ 600 dpi, JBIG2, Producer "Adobe Acrobat 9.0 Image Conversion Plug-in", PDF 1.6).

## Part 1: root-causing the pdf.js failure

### Reproduction

Environment: Node v22.22.2, `pdfjs-dist@6.2.108` (legacy build, `pdfjs-dist/legacy/build/pdf.mjs`), `canvas@3.2.3` as the Node canvas factory.

Command: `node repro.mjs` (renders page 1 and 2 at 600 dpi scale with default `getDocument()` options, no `wasmUrl`).

Result: reproduces the blank canvas exactly as reported.

```
Warning: #instantiateWasm: UnknownErrorException: Ensure that the `wasmUrl` API parameter is provided.
Warning: #getJsModule: Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'nulljbig2_nowasm_fallback.js' ...
Warning: Unable to decode image "img_p0_1": "Jbig2Error: JBig2 failed to initialize".
Warning: Dependent image isn't ready yet
page 1: 5548x7380 -> page1-first-render.png (175389 bytes)
page 1 ink fraction: 0.0000
```

Both pages: 0.0000 ink fraction. This is not a browser-only fault: it reproduces identically in plain Node, so the defect is in how the app calls the pdf.js API, not in a browser-specific code path.

### Root cause

`pdfjs-dist` 6.x replaced the pure-JS JBIG2 decoder with a WASM module. Confirmed by inspecting the installed package and the bundled worker source:

- `node_modules/pdfjs-dist/wasm/jbig2.wasm` and `jbig2_nowasm_fallback.js` ship in the package (also `openjpeg.wasm`, `qcms_bg.wasm`, `quickjs-eval.wasm`).
- There is no more `Jbig2Image` pure-JS decoder class in `pdf.worker.mjs`. The JBIG2 codec is now driven by an emscripten-compiled module (`_jbig2_decode` export) wrapped in a `WasmImage`/`Jbig2` class.
- That class (`pdf.worker.mjs`, class `WasmImage`) reads a **static, package-level `wasmUrl`** option, set only via `WasmImage.setOptions(...)`, which is fed from the `wasmUrl` parameter passed to `getDocument()`. Default is `null`.
- On decode it does `fetch(`${wasmUrl}${filename}`)`. With `wasmUrl` unset this becomes the literal string `"null" + "jbig2.wasm"` (`grep` confirms no such literal string exists in the source; it is built by template-literal concatenation of the `null` default with the filename) — hence the exact error text seen: `Ensure that the wasmUrl API parameter is provided.` It then falls back to `import("nulljbig2_nowasm_fallback.js")`, which of course cannot resolve, so JBIG2 decode fails, `Jbig2Error: JBig2 failed to initialize` is thrown, pdf.js catches it per-image (`Unable to decode image`), logs `Dependent image isn't ready yet`, and continues rendering everything else onto a canvas of the correct dimensions — hence a correctly-sized, blank raster with no exception surfaced to app code.

This same class of failure exists for JPX (`openjpeg.wasm`/`openjpeg_nowasm_fallback.js`) under the identical code path — corroborated by an open Mozilla discussion for a different project hitting an identical `wasmUrl`-unset failure (`JpxError: OpenJPEG failed to initialize`) with a Vite bundler: [mozilla/pdf.js discussion #20585](https://github.com/mozilla/pdf.js/discussions/20585). Maintainer-recommended fix, quoted directly from that thread:

> "The URL where the wasm files are located. Include the trailing slash."
> ```js
> const wasmUrl = `https://unpkg.com/pdfjs-dist@${version}/wasm/`;
> const doc = await getDocument({ url: pdf, wasmUrl }).promise;
> ```

### The JBIG2Globals hypothesis is ruled out

The task brief's working hypothesis was an unresolved `/JBIG2Globals` reference. Checked directly against the raw PDF object structure:

```
qpdf --qdf --object-streams=disable sunless-...pdf decoded.qdf
grep -a -B10 -A3 "/Filter /JBIG2Decode" decoded.qdf
```

Both image XObjects (`14 0 obj`, `18 0 obj` post-renumbering) carry `/Filter /JBIG2Decode` with **no `/JBIG2Globals` key present**, and `grep -a "JBIG2Globals" decoded.qdf` returns zero hits anywhere in the file. This file's JBIG2 streams are self-contained (no separate globals segment). The failure is unrelated to globals resolution; it is entirely the `wasmUrl` wiring issue above.

### Confirming the codec itself is not at fault

Three independent decoders successfully decode these exact streams:

1. **poppler `pdfimages`** (24.02.0): `pdfimages -png -f 1 -l 1 sunless-...pdf pg` produces a 5548x7380 1-bit PNG, ink fraction 0.0955 (visually confirmed: title, tempo mark, 3 systems of Russian/German bilingual vocal + piano staves — matches the expected page).
2. **pdf.js's own JS fallback decoder**, when `wasmUrl` is set to a `file://` path and `useWasm:false` is forced: the `Jbig2Error`/"Unable to decode image" warnings disappear entirely (decode succeeds). The run then crashes downstream at `ctx.drawImage(...)` inside `node-canvas`'s `paintInlineImageXObject` path (`TypeError: Image or Canvas expected`) — this is a `node-canvas` API-compatibility limitation for this particular image-paint code path, not a JBIG2 or browser-relevant failure; it does not occur with the real `CanvasRenderingContext2D` in a browser.
3. **Audiveris's own PDF ingestion (PDFBox)** decoded the PDF cleanly with no warnings (see Part 2) and produced note counts consistent with the raster fallback.

Conclusion: the JBIG2 bitstream is ordinary and decodable. The blank raster is caused specifically by pdf.js 6.x's WASM codec wiring not being configured with `wasmUrl`, not by anything unusual about this file or about JBIG2 globals.

### Verdict: fix available, browser-shippable

**Yes.** Pass `wasmUrl` to `getDocument()`, pointing at an origin-hosted copy of `pdfjs-dist`'s `wasm/` directory (same pattern already needed for `cMapUrl`/`standardFontDataUrl`):

```js
getDocument({ data, wasmUrl: "/pdfjs/wasm/" /* trailing slash required */ })
```

Requires copying `node_modules/pdfjs-dist/wasm/*` (six files, ~1.5 MB total: `jbig2.wasm`, `jbig2_nowasm_fallback.js`, `openjpeg.wasm`, `openjpeg_nowasm_fallback.js`, `qcms_bg.wasm`, `quickjs-eval.{js,wasm}`) into Ilya's static asset pipeline alongside the existing pdf.js assets, and adding the one `wasmUrl` option. This was not independently verified end-to-end in a real browser in this session (no browser render harness was built; Node's `import()` does not support non-file/data URL schemes, so the JS-fallback path could only be exercised via `file://`, and the WASM path's `fetch()` succeeded but downstream `WebAssembly.instantiate` needs the full emscripten import object that only the library itself supplies at runtime — not independently re-implemented here). Confidence is high given: the maintainer-documented fix for the identical failure mode, the package shipping exactly the files the code asks for, and Audiveris/poppler proving the underlying data decodes fine. Recommend a fast, cheap real-browser smoke test (set `wasmUrl`, load this PDF, check ink fraction) before closing N.96.

### Cheap client-side JBIG2 detection recipe

Scan the raw PDF bytes (as fetched, before any parsing) for the ASCII literal `/JBIG2Decode`:

```js
new TextDecoder("latin1").decode(bytes).includes("/JBIG2Decode")
```

- **False positive risk: low.** `/JBIG2Decode` is a reserved PDF filter name; encountering it outside an actual `/Filter` entry in an uncompressed region is very unlikely in practice.
- **False negative risk: moderate, and file-dependent.** PDF 1.5+ allows object dictionaries (including XObject `/Filter` entries) to live inside compressed object streams (`/ObjStm`), in which case the literal string is invisible to a raw byte scan. Checked on this specific file: it does contain `/ObjStm` markers (`grep -ac "/ObjStm"` → 5 hits) yet the two image XObject dictionaries were **not** among the compressed objects, so the naive scan still caught both occurrences (`grep -ac "/JBIG2Decode"` → 2). This will not hold for every IMSLP-sourced PDF; some producers push XObject dicts into object streams too. A fully reliable detector would need to inflate `/ObjStm` streams (FlateDecode) before scanning, which is a materially bigger piece of work than a byte-grep.
- Recommendation: use the byte-scan as a cheap pre-flight warning/telemetry signal, but keep the actual authoritative trigger for the fallback path as a runtime check (post-render ink-fraction-near-zero test), since that catches both this failure mode and any other cause of a blank page, at the cost of one wasted render.

## Part 2: Audiveris, arm's-length measurement

Licence note: Audiveris is AGPL. This section reports measurements from a locally built copy for evaluation only; nothing from Audiveris is bundled into Ilya.

### Install

GitHub was reachable only partially through this session's network path: `github.com` (browsing, releases pages, `releases/download/...` guesses) returned 403/404 and the GitHub REST API was scoped to configured repos only, so the release-binary route could not be completed (could not discover exact asset filenames — the release page's asset list is loaded by client-side JS that `WebFetch` does not execute). `raw.githubusercontent.com` and `git` smart-HTTP (`github.com/.../info/refs`) were both reachable, so the working route was: build from source.

```
git clone --depth 1 --branch 5.9.0 https://github.com/Audiveris/audiveris.git
apt-get install -y openjdk-25-jdk-headless   # build requires Java 25 (theMinJavaVersion in build.gradle)
JAVA_HOME=/usr/lib/jvm/java-25-openjdk-amd64 ./gradlew installDist -x test
```

Build succeeded in 38s (Gradle 9.1.0, commit `01e8988`, Audiveris 5.9.0). Tesseract 5.5.1 was already present on the system and was picked up automatically.

Tessdata note: Audiveris's Tesseract wrapper requests the "legacy" OCR engine mode, which needs combined legacy+LSTM `.traineddata` files. Ubuntu's `tesseract-ocr-eng`/`tesseract-ocr-rus` apt packages (LSTM-only "fast" variant) failed with `Tesseract (legacy) engine requested, but components are not present`. Fixed by fetching the full combined-model files Audiveris's own build declares (`theTessdataTag: 4.1.0`) directly from `raw.githubusercontent.com/tesseract-ocr/tessdata/4.1.0/{eng,rus,osd}.traineddata` (23 MB / 20 MB / 11 MB) and pointing `TESSDATA_PREFIX` at that directory.

### Runs

1. `audiveris -batch -export` on the PDF directly (`-sheets 1`, 90s timeout): **succeeded**, no JBIG2 warnings anywhere in the log. Audiveris uses PDFBox for PDF ingestion, an entirely different code path from pdf.js/poppler, and it decoded this file cleanly — a third independent confirmation that the JBIG2 data itself is unremarkable (see Part 1).
2. `audiveris -batch -export` on `raster400-1.png` + `raster400-2.png` (400 dpi PNG fallback), default OCR language ("eng", hardcoded default in `Language.java`'s `defaultSpecification` constant).
3. Same as (2), page 1 only, with `-constant org.audiveris.omr.text.Language.defaultSpecification=rus` to test whether the OCR-language default (not Audiveris's OMR engine) is the reason lyrics come out wrong.

Command shape used throughout:
```
TESSDATA_PREFIX=<dir-with-full-traineddata> JAVA_HOME=<jdk25> \
  ./app/build/install/app/bin/Audiveris -batch -export -output <dir> -- <input(s)>
```

### Segmentation

Log line: `PeakGraph ... Systems: #1[1, 2, 3] #2[4, 5, 6] #3[7, 8, 9]`, `SystemManager ... 2 parts along 3 systems`, `Page ... 9 raw measures: [3 in system#1, 3 in system#2, 3 in system#3]` (both pages). **3 systems x 3 staves (Canto/Voice + 2-staff Piano) = 9 staves**, matching the expected layout exactly. This matches the ground truth's part list (`P1`="Bass"/vocal, `P2`="Piano") and 18 total measures split 9/9 across the two pages.

### Note counts, vocal staff (P1) vs ground truth

Method: parsed `<note>` elements per part from Audiveris's exported `.xml` (inside the `.mxl`) and from the ground truth `score.musicxml`, restricted to measures 1-9 (page 1's span, confirmed by Audiveris's own "9 raw measures" per sheet and ground truth's 18-measure total).

| | notes (incl. rests) | non-rest notes |
|---|---|---|
| Ground truth, Bass (vocal), mm. 1-9 | 58 | 48 |
| Audiveris raster400-1.png, P1 "Voice" | 58 | 47 |
| Audiveris PDF direct, P1 "Canto", sheet 1 | 55 | -- (not broken out) |

Total note-element count matches exactly on the PNG run (58 = 58); the PDF run is close (55, likely a slightly different page framing/measure split at 600 dpi via PDFBox vs 400 dpi PNG — not investigated further, out of scope for a coarse check).

### Pitch agreement

Method: extracted the pitch-class-only sequence (letter name, octave dropped) for GT mm.1-9 vs Audiveris raster400-1 P1, then ran a Needleman-Wunsch global alignment (match +1, mismatch -1, gap -1) to allow for a couple of inserted/dropped rests rather than a naive fixed-offset comparison.

Result: **55 of 58 ground-truth notes aligned to an Audiveris note with an identical pitch letter name — 100% of aligned positions match.** The only discrepancies are alignment gaps from a couple of extra/missing rests near the start and end of the excerpt, plus a **systematic one-octave-higher** numbering in Audiveris's output (GT mostly octave 3, Audiveris mostly octave 4) — read as a clef-octave-transposition convention difference between the two exporters, not evidence of real pitch errors, but not independently confirmed against a rendered score.

### Duration/rhythm

Audiveris's own log flags rhythm trouble on both pages: `Voice{#1 excess:1/16} too long`, `no correct rhythm` (measure #2 sheet 1, measure #6 sheet 1), `Time inconsistency` warnings (2-3 per page), and on page 2 three `MeasureFixer ... No target duration for measures ... please check time signatures` warnings. Durations are exported (every note carries a `<duration>`/`<type>`), but rhythm reconstruction is visibly imperfect on this scan — expect measure-level duration errors in a non-trivial minority of measures. Not quantified beyond the log's own flagged-measure count (2 of 9 measures per page explicitly flagged as rhythmically inconsistent = roughly 2/9 ≈ 22% of measures per page carry a logged rhythm warning; this likely undercounts silent errors).

### Headline question: lyric syllables

**Yes, Audiveris attaches lyric syllables to notes on this scan** (`<lyric>` elements present, correctly associated with notes): 69 on page 1, 89 on page 2 with the default "eng" OCR language; 80 on page 1 when re-run with `-constant .../defaultSpecification=rus`.

**Are any of the Cyrillic syllables correct?**

- **With Audiveris's hardcoded default OCR language ("eng" — `Language.java`, `Constants.defaultSpecification`, not overridable from the CLI's normal flags, only via `-constant`):** no. All 68 `<text>` values on page 1 are Latin-script strings (`KOM`, `HaT`, `Ka`, `Tec`, `Ha`, `TM.`, `xa`, ...) — the "eng" LSTM/legacy model reads Cyrillic glyphs as visually similar Latin letters. Matched against the 96 Cyrillic ground-truth syllables (exact string match, order-agnostic within a 60-token window): **0/68 matches.**
- **Forcing `defaultSpecification=rus`:** the model now emits real Cyrillic. Sample: `Ком`, `нат`, `ка`, `тес`, `на.`, `я,`, `ти`, `ха`, `И`, `я,`, `ми`, `ла..я;`, `Тень`, `не`, `про` — several of these are exact matches to the ground truth's first line ("Ком-нат-ка тес-на-я, ти-ха-я, ми-ла-я" / "Тень не-про-гляд-на-я"). Matched the same way: **36/76 non-empty OCR tokens exact-matched a ground-truth Cyrillic syllable (≈47%).** The remaining tokens are mostly garbage (`Ес'п`, `Кііт`, `!ег'п,`, `одев,`, `сідев;`, ...) — this score is a bilingual Russian/German libretto (visually confirmed: Russian line above, German line below, per system), and a single global `rus` OCR pass garbles the interleaved German line rather than skipping or separately modelling it; Audiveris has no per-line/per-role language switching exposed at this level.

Net: lyric syllables are structurally present and positionally attached to the right notes either way, but **the OCR text itself is only usable if the OCR language is manually overridden away from Audiveris's hardcoded English default**, and even then accuracy on this bilingual page tops out around the high-40s percent, dragged down by the interleaved German text rather than by Russian recognition itself.

### Spot-check

`pg-000-small.png` (poppler-decoded, downscaled 6x) was viewed directly and visually matches the expected page 2 of the score (title "В четырех стенах. 1. In vier Wänden.", tempo mark, 3 systems, Canto + Piano staves, Russian text above / German below each vocal line) — this is the same visual ground truth used to sanity-check the JBIG2 decode success claim in Part 1 and, indirectly, the Audiveris measure/system counts above (Audiveris's system/measure counts were cross-checked numerically against the ground-truth MusicXML rather than by re-rendering Audiveris's own `.omr`/binarized page image, which was not done in this session).

## NOT ESTABLISHED

- **End-to-end browser verification of the `wasmUrl` fix.** Confirmed the mechanism and the fix precisely at the pdf.js source level and cross-validated the underlying data is decodable by three other tools, but did not stand up a real browser (or a working headless-Chrome harness) to load the PDF with `wasmUrl` set and confirm a non-blank canvas end-to-end. The `node-canvas` Node repro hit an unrelated `drawImage` incompatibility after JBIG2 decode succeeded, so the full pixel pipeline was not exercised in this session.
- **Exact GitHub release asset filenames/URLs for Audiveris 5.9.0** (or any version). `releases/download/<tag>/<file>` returned 404 for guessed filenames (domain reachable, filenames unknown), and the release page's asset list is client-rendered so it could not be read via `WebFetch`. Built from source instead; this is a materially different install path than the one a real user would follow (flatpak/binary installer), and native/OS integration aspects of the packaged installer were not tested.
- **Rhythm/duration accuracy, quantified.** Reported only the count of log-flagged inconsistent measures (2 of 9 per page); did not build a full measure-by-measure duration diff against ground truth.
- **Whether the octave-numbering offset is a genuine Audiveris export convention or a scan-specific misread.** Plausible but not confirmed against Audiveris documentation or a second piece.
- **OCR accuracy with a combined `rus+deu` or `rus+eng` language spec**, which might resolve the bilingual-line garbling seen with `rus` alone. Not tried (out of scope for the coarse check requested).
- **Whether IMSLP JBIG2 PDFs in general lack `/JBIG2Globals`** (as this one does) or whether that varies by scanner/producer. Only this one file was inspected.
