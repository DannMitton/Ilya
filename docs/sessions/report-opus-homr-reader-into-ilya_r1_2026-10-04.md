# Report: the homr reader inside Ilya (step 1)

> **Provenance, added by the desk (Fable), 2026-10-04 23:20.** Dann, 21:47: *"Sure, we can go with your recommendation."* Dann, 22:27: *"We need a working OMR module."* Brief: `brief-opus-homr-reader-into-ilya_r1_2026-10-04.md`. An Opus subagent built in a cloud clone of `Shane` at `b2106d09`, 22:34 to 23:14. Cost: 298,998 tokens, 131 tool uses, 40 minutes (the desk had named 700,000 and 60). The builder could not write this file itself (its environment refused report files), so **the desk saved its final message here, as returned.** Its claims are its own. The desk checked: the proof picture `pdf-4-markup-notes-ipa-russian.png` (looked at); the list of 17 changed files against `git status` in the build clone (equal); the diff of the seven changed tracked files (read in full, the lockfile in part); `homr-reader.ts` and `scan.ts` (read in full); `fetch-omr-models.mjs` (read without its comments); the 14 new tests (run by the desk: 14 passed). The desk did not re-run the eight gates or the proof.

From the Opus builder to the desk, 2026-10-04, 22:34 to 23:14. Built in `/home/claude/ilya-build`, a fresh clone at `b2106d0` (branch `Shane`), with no git writes.

## Summary

1. The proof works, and the builder watched it. `tchaikovsky-op38-3.pdf` was dropped on Ilya in headless Chromium at 1,440 px. homr read all three pages with no clef-and-key question. After the poem was pasted, the Markup tab showed the notes with IPA and Russian under them (`step1-proof/pdf-4-markup-notes-ipa-russian.png`).
2. The read took 361.4 s for three pages on WebAssembly with one thread (backend reported `wasm`; there is no WebGPU in the cloud workspace).
3. The owner would see: the start-up wait message, then "Reading the page…", then the score with "This score has no words in it". Pasting the poem puts one syllable on each note straight away. The code already did that; nothing in `+page.svelte` was changed.
4. The joined score has 98 measures, not 99: homr misses one bar of the song. The voice part has 176 notes, which matches the desk's converter.
5. All eight gates pass before and after. The web suite goes from 1,870 to 1,884 tests. `check` shows the same 0 errors and the same 12 warnings.
6. Not done: WebGPU inside Ilya, a full read in the built app, the headers that would allow more WebAssembly threads, and a poem picture in the browser. The format line says "MusicXML (direct)".

## Gates

| Gate | Before (22:34 to 22:41) | Final (23:05 to 23:12, after the last change) |
|---|---|---|
| test:phonology | 251 passed (8 files) | 251 passed (8 files) |
| test:dictionary | 235 passed (4 files) | 235 passed (4 files) |
| web check | 0 errors, 12 warnings | 0 errors, 12 warnings; the 12 warning lines are identical by `diff` |
| web test | 1,870 passed (105 files) | 1,884 passed (107 files) |
| score-parser test | 650 passed, 5 skipped | 650 passed, 5 skipped |
| test:blurb | 145 passed | 145 passed |
| test:integration | 55 passed | 55 passed |
| ratchets | OK | OK |

- The install overlapped the first web run: `pnpm add homr-web` ran at about 22:41, in the last seconds of the "before" web test run, which passed.
- An "after" run from 22:54 to 23:02 also passed everything. `worker.format` in `vite.config.ts` was then changed and all eight gates were run again; the "Final" column is that run.
- `ScoreUploader.svelte` was already at its ratchet ceiling of 1,340 lines, so the edit there is net zero lines. No ceiling was raised.

## What was built

All paths are relative to the repository root.

**New: `apps/web/src/lib/omr/`**

- **`join-pages.ts`, `joinPages(pages)`.** Works on the text of homr's output, not on a DOM, so it runs in vitest. Keeps homr's first part and only its first staff. Numbers the measures from 1 and copies each note's text unchanged, so ties, slurs, and tuplets survive. On a later page's first measure it removes a key, metre, or clef that repeats the one in force, and keeps one that changes. Each page keeps its own `<divisions>`. No default that homr-web inserts was found (homr-web `src/musicxml/generate.ts`, lines 755 to 855), so nothing treats a default specially.
- **`join-pages.test.ts`, 10 tests.** On the three fixtures: one part ("Voice"); 98 measures numbered 1 to 98; 176 notes counted the way `conv.py` counts them; every note kept; key, metre, and clef stated once; the joined file parses with no fatal error in `MusicXmlScoreParser`. On hand-built pages: a tie across the join survives; a key change on a later page is kept; a two-staff voice part keeps only staff 1; a page with no part is refused. Cross-check: `conv.py` on the joined file gives 231 events, identical to its events on the three page files; the only difference is that the 3/8 metre now carries through pages 2 and 3.
- **`fixtures/tch-{1,2,3}.musicxml`:** homr-web's own output, unchanged.
- **`homr-reader.ts`.** The only file that imports homr-web, with a dynamic `import()`. `OMR_MODELS_BASE` is `PUBLIC_OMR_MODELS_BASE` when set, otherwise `/omr/models/`. `ORT_WASM_BASE` is `/omr/ort/`. One recognizer per session, preferring WebGPU. Reads pages one at a time with `{ ocr: false }` and skips a page homr calls `not_music`. On `worker_lost` it disposes the recognizer. It never throws.
- **`scan.ts`.** `readScan` rasterizes with Ilya's own `rasterizePdf` or `toGreyscalePng`, then reads with homr. `readScanAsScore` hands the joined MusicXML on as `<stem>.musicxml`; `not_music` goes to the poem route; any other error shows the failure message. `useIlyaReader` is true for `?reader=ilya`.
- **`scan.test.ts`:** 4 tests.

**Changed**

- **`ScoreUploader.svelte`.** One import line. In `take()`, when staves are found: with `?reader=ilya` it calls `handleFile(file)` as before; otherwise it calls `readScanAsScore`, whose `ingest` step is `handleFile(xml)` then `announceArrival()`, the same path as a dropped MusicXML file. The poem fallback is the one `readAsked` uses. `take()`'s doc comment was rewritten, because its old wording about the clef-and-key question would have become false. The old reader and `tools/e16-harness/` are untouched.
- **`vite.config.ts`.** `optimizeDeps`: homr-web and onnxruntime-web excluded, opencv-js included, as homr-web's README says for Vite's dev server. `worker: { format: 'es' }`: without it `vite build` failed with `Invalid value "iife" for option "worker.format"`; both of Ilya's existing workers already start with `{ type: 'module' }`.
- **`apps/web/package.json` and `pnpm-lock.yaml`.** `"homr-web": "0.2.0"`, exact. `dev` and `build` now also run `copy-ort-wasm.mjs` and `fetch-omr-models.mjs`. pnpm printed "Ignored build scripts: protobufjs@7.6.6"; the read worked without it.
- **`static/sw.js`.** The service worker no longer intercepts anything under `/omr/`. It never precached the models, but its catch-all caching would have copied 213 MB into Cache Storage.
- **`.gitignore`.** Adds `apps/web/static/omr/`.
- **`NOTICES.md`.** Lists homr-web 0.2.0 (AGPL-3.0-only, source offered at its repository), homr 0.7.0 (AGPL-3.0; the models are homr's release assets), onnxruntime-web 1.30.0 (MIT), @techstark/opencv-js 4.12.0-release.1 (Apache 2.0), and delaunator 5.1.0 (ISC). `LICENSE` and the README are untouched.

**New scripts**

- **`fetch-omr-models.mjs`.** Downloads homr's five release zips, unzips them, checks each SHA-256 against homr-web's README table, and writes `static/omr/models/<sha256>/<file>`. Run by the builder: with the decoder missing, it downloaded it and the hash matched; a second run skipped all five files silently; with fetch made to fail, it printed five warnings and exited 0; with `OMR_MODELS_STRICT=1` it exited 1. A real network outage is NOT ESTABLISHED.
- **`copy-ort-wasm.mjs`.** Copies the four onnxruntime `.mjs` and `.wasm` files to `static/omr/ort/`. Run by the builder.

**Why the npm package, not a git dependency or a tarball.** homr-web 0.2.0 is published on npm. Its `dist/` is byte-identical to the build of the clone at `cb333a5` (`diff -rq` printed nothing). The clone does not track `dist/` and has no `prepare` script, so a git dependency would install no built code. The npm package's recorded commit (`8e5f6bb`) is not in the shallow clone, so the commit-level match is NOT ESTABLISHED; the byte-level match of `dist/` is.

## Proof and checks the builder watched

- **PDF, dev server.** The PDF was dropped and the start-up wait message showed (`pdf-1-reading.png`). The read finished at 361,352 ms on `wasm`. The score arrived as `tchaikovsky-op38-3.musicxml` (`pdf-2`). The poem was pasted and the Text tab showed (`pdf-3`), then the Markup tab: 3/8, D major, «Средь шум-но-го» with ˈsrʲetʲ ˈʃum nʌ vʌ under the notes (`pdf-4`). The page text shows syllables seated through «чер-ты.» (`pdf-markup-page-text.txt`). Why `wasm` and not `wasm-threads`: Ilya's dev server sends no cross-origin isolation headers, so WebAssembly gets one thread.
- **`tch-1.png`, dev server.** Read in 137.2 s, with Markup pictures (`png-tch1-*`). In the bar-17 picture the Markup page draws a "25" over the clef; not looked into.
- **`?reader=ilya`.** The old clef-and-key prompt appeared after 9 s (`old-reader-with-reader-ilya.png`).
- **Built app (`vite build` plus `vite preview`).** The worker chunk, the fp32 segmentation model, and onnxruntime's `.mjs` loaded, and after 40 s the label changed to "Reading the page…" (`built-app-check.txt`, `built-app-reading.png`). Stopped there, so a full read in the built app is NOT ESTABLISHED.

## Strings

No strings were added. The new path uses `upload.status.preparingReader`, `upload.status.readingPage`, and `upload.err.parseFailed`. One is not true on WebAssembly: `upload.status.preparingReader` says "a few seconds for each page", and in the cloud a page takes about 100 to 150 s. On the owner's iMac with WebGPU a page took 10.9 s.

## Not established

- WebGPU inside Ilya; Mac and Safari.
- A full read in the built app.
- The fetch script during a real network outage.
- A poem picture dropped in the browser (its code path is unchanged).
- Memory use inside Ilya.
- The "25" drawn at bar 17.

## What the next builder should do first

1. A full read in `vite preview` with `tch-1.png`.
2. The cross-origin isolation headers, then WebGPU on the owner's iMac inside Ilya.
3. What a song read this way stores and shows. Today it stores the joined MusicXML and the format line says "MusicXML (direct)". A `via: 'homr'` value in the ingest provenance could name the PDF instead.

## Deliverables

- `step1-proof/`: 12 screenshots and logs.
- `step1-changes.tgz`: 17 files (md5 `bcfda208ec44cf9cbf799e271e7a153b`).
- `step1-changes.diff`: the output of `git diff`, tracked files only (md5 `cfc775f55bb52649e7e34052c95aaafc`).
