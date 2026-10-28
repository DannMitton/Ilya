# Brief for Code: QUEUE row 113, Ilya opens iPhone photos in HEIC, r1, 2026-10-27

Desk (Opus 5.5). For a cloud session, Sonnet, one dedicated branch. Every `path:line` was read in a clone of `Shane` at `234eff3f` on 2026-10-27.

## 1. The need, in Dann's words

2026-10-27 14:42: *"it is gtroubling that ILya is fun ctional ofn mobile but cannot accpet HEIC files, which is the native photograph format for iPhones. This represetns the exclusion of a large cohort of our users and must be resolved."* (transcribed as written). Row 113 (`docs/memory/QUEUE.md`) was the desk's default of 2026-10-18: a HEIF decoder compiled to WebAssembly, loaded only when a picture sniffs as HEIF, decoding into the existing greyscale path, its byte count told to Dann before it ships.

What the singer sees after this row: she drops or picks an iPhone photo (HEIC) of a printed page, on any browser, and Ilya reads it exactly as it reads a JPEG. Today she gets `upload.err.imageHeic` (`apps/web/src/lib/i18n.ts:1154`), which tells her to convert it in Preview.

## 2. What the code is today (read 2026-10-27)

- Every photograph enters through `toGreyscalePng(file)` (`apps/web/src/lib/reader/page-image.ts:57-73`): `createImageBitmap(file)`, drawn to an `OffscreenCanvas`, flattened to grey by `greyscaleCanvasToPng`; a decode failure throws `ImageUndecodableError` (`:60-62`). Its header says Chromium does not decode HEIC and that whether iOS transcodes HEIC to JPEG through the unfiltered picker is NOT ESTABLISHED (`:46-50`).
- Callers: `apps/web/src/lib/omr/scan.ts:41` (the homr route) and `apps/web/src/lib/score/ScoreUploader.svelte:359`, `:646`, `:719`. The refusal string is chosen by `undecodablePictureMessage` (`ScoreUploader.svelte:495-498`) using `isHeifImage` (`apps/web/src/lib/score/ingestion/format-detection.ts:121`), and reached at `:362` and `:602`.
- `ScoreUploader.svelte` is at its ceiling, 1358 of 1358 (`scripts/ratchets.json`): this row does not touch it.
- `IntakeCamera.svelte:42-56` logs what the camera hands the page and says it is NOT ESTABLISHED whether that is HEIC or JPEG.
- The picker drops `accept` on a coarse pointer (N.70; `ScoreUploader.svelte:156-159`), so iOS may hand over the HEIC unconverted. NOT ESTABLISHED.
- No HEIF decoder is a dependency (`apps/web/package.json:19-29`).

## 3. The design (DESK DEFAULTS, each reversible)

1. **The fix lives in `page-image.ts`, not in the uploader.** `toGreyscalePng` tries `createImageBitmap` first, as today (Safari can decode HEIC itself; that path is kept and not measured here). On failure, and only when the bytes sniff as HEIF (`isHeifImage`), it calls a new module `apps/web/src/lib/reader/heic-decode.ts`, which lazy-loads a WebAssembly HEIF decoder, decodes the primary image to RGBA, and returns it; `toGreyscalePng` draws that to its `OffscreenCanvas` and continues unchanged. Every caller benefits with no edit. If the decoder also fails, the existing `ImageUndecodableError` is thrown, so the existing refusal still shows for a broken file.
2. **The decoder is loaded only for a HEIF picture**, by dynamic `import()`, never on page load, and never for a JPEG, PNG, or PDF. It runs in the page or a Worker, whichever loads in Chromium; say which.
3. **The decoder's files are served from Ilya's own origin** (N.197's direction: no outside service at run time), as Vite emits them, or under `apps/web/static/` if the package needs a URL; the report gives the byte count of every file it adds to the build (`CONTRACT.md` section 8: nothing into `static/` without telling Dann the byte count). The ship waits for Dann to hear that number.
4. **The orientation flag** (EXIF or HEIF `irot`): the page must come out upright. Say what the chosen decoder does with rotation, and if it does not apply it, apply it.

## 4. Steps

### Step 0. Choose the decoder, measure first, change nothing
Survey the WebAssembly HEIF decoders on npm (for example `libheif-js`, `heic-decode`, `heic-to`; list what you find). For each: licence (Ilya is free and open source; an LGPL WebAssembly module loaded at run time is acceptable if its licence text ships with it; GPL is not, say which), published size of what the browser would load, last release date, whether it decodes in headless Chromium, in a Worker, and with no network. Pin an exact version published at least two weeks before today. Choose the smallest that decodes the fixtures below and passes the licence test; state the choice and why in the report. Report the bytes.

Fixtures: make three HEIC files in the session with Python (`pip install pillow pillow-heif --break-system-packages`; `pillow_heif` encodes HEIF): (a) a rendered page of black staff lines and noteheads on white, 1,600 by 2,200 px; (b) the same page with an orientation of 90 degrees set in the file; (c) a grey photo-like page (paper about 200, ink about 40, a little noise). Commit them under `apps/web/src/lib/reader/fixtures/` only if under 300 KB together; otherwise generate them in the test from committed PNGs, if the chosen decoder can, or say why neither works.

### Step 1. `heic-decode.ts` and the fallback in `toGreyscalePng`
As section 3. Tests: each fixture decodes; (a) through `toGreyscalePng` gives a PNG of the same pixel size whose grey matches decoding the source PNG through the same function within 2 grey levels on 99 percent of pixels; (b) comes out upright; a JPEG and a PNG never load the decoder (spy on the dynamic import); a file that sniffs as HEIF but is truncated throws `ImageUndecodableError`. Mutants: skip the fallback; skip the orientation; load the decoder for every picture. Each must be killed.

### Step 2. The real path, in headless Chromium
Run the app's dev build in Playwright Chromium (which does not decode HEIC itself, so the fallback is exercised) and drop fixture (a) through the page's own file input. Report what the drawer shows, and that the homr route reads the page (a note count is enough; no scorer). Capture a screenshot into the report's folder.

## 5. Strings

None added or changed in this row. `upload.err.imageHeic` stays as it is and now shows only when the decoder fails on a damaged file; its English, "Ilya cannot yet open iPhone photos in HEIC format", becomes untrue. **Owed to Dann after this row:** new text for that key, EN and FR, drafted by the desk. Say in the report every place the key is reached.

## 6. Gates and ceilings

The eight gates at `234eff3f`: phonology 291 passed (291); dictionary 248 passed (248); web check 0 errors and 12 warnings in 5 files; web test 3231 passed (3231); score-parser 775 passed, 5 skipped (780); blurb 145 passed (145); integration 55 passed (55); ratchets OK. Measure them yourself before any edit; a web-test rise is your new tests, counted per file. Ceilings: `ScoreUploader.svelte` 1358 and `+page.svelte` 5586 untouched; `page-image.ts` (98 lines) and the new file stay under 1000. This row changes no computation another site repeats, so the cross-site line of `CONTRACT.md` section 4 does not apply.

## 7. Where would this wall a singer in?

- A HEIC with several images (a burst, a Live Photo's still): the primary image is the right one; say what the decoder picks.
- A very large photo (48 MP): say the decode time and peak memory in Chromium for a 48 MP fixture if you can make one; a phone browser may run out of memory where a desktop does not. NOT ESTABLISHED on a phone until Dann's look.
- Safari on iPhone may never reach the fallback (it may decode HEIC itself, or iOS may transcode). Dann's look on his iPhone settles which.

## 8. Report

`docs/sessions/report-code-row113-heic_r1_2026-10-27.md`: the decoder chosen and why, its licence and bytes, the tests and which fail on the mutants, the Chromium run with its screenshot, the eight gates before and after, and "What I could not establish". NOT ESTABLISHED beats a complete invented answer.

## What the desk could not establish

- Whether iOS Safari hands the page a HEIC or a JPEG through the picker or the camera (`IntakeCamera.svelte:42-45`). Dann's look on his iPhone with Safari's Web Inspector settles it; the fix covers both.
- Whether Safari's own `createImageBitmap` decodes HEIC on Dann's iOS version.
