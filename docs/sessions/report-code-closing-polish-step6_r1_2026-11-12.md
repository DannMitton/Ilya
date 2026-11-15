# Report: closing polish lane, step 6, Ilya's fonts and photo reader from its own site (Code, cloud-lane-48, r1, 2026-11-12)

Code commits `5bc19fe` and `242a70c` on `cloud-lane-48`. Amendments 2, 11, and 12 govern.

## What changed

- **Fonts.** Google's two stylesheets (`app.html:49`, `+page.svelte:3675` on `dc078b9`) were fetched with a Chrome 131 Linux user agent; every woff2 they name was downloaded: 58 distinct files behind 84 `@font-face` blocks. They are in `apps/web/static/fonts/{source-sans-3,source-serif-4,noto-sans,noto-serif}/`, with the four `OFL.txt` copied from `github.com/google/fonts` (`ofl/sourcesans3`, `sourceserif4`, `notosans`, `notoserif`); their first lines are the copyright lines the GUIDE sentence names. The blocks are in `static/fonts/google-families.css`, unchanged (family, style, weight range, `unicode-range`, `font-display: swap`) but for `url()`. File list with source URL, bytes, and sha256: `report-code-closing-polish-step6-fonts-appendix_r1_2026-11-12.md`. Google's host answered from here, so the stop condition did not apply.
- `src/app.html`: the two preconnects and the stylesheet link are replaced by one `<link rel="stylesheet" href="/fonts/google-families.css" />`. `routes/+page.svelte`: the `<svelte:head>` block with the preconnects and the Noto link is removed (5514 to 5509 lines).
- **Photo path.** `@tesseract.js-data/rus` is added to `apps/web/package.json` at exactly `1.0.0` (the lockfile gains only that package's three entries; I kept the file's existing `libc:` lines, which this sandbox's pnpm 10.28 would have dropped). Its `4.0.0_best_int/rus.traineddata.gz` is 2,679,598 bytes, md5 `9c66849e0afcfd659d613e71695d6f1c`, as the amendment states (checked). `copy-underlay-model.mjs` copies it as it is to `static/omr/models/underlay/rus.traineddata.gz`. `omr/underlay-recognize.ts` gains `photoWorkerArgs(origin)`, returning `['rus', 1, {workerPath, corePath, langPath}]` from `recognizerPaths`; no `gzip` or `cacheMethod`, so tesseract unpacks and keeps the model as before. It is re-exported from `omr/scan.ts` so `ScoreUploader.svelte` takes it on its existing import line: `createWorker(...photoWorkerArgs(location.origin))`. The file stays 867 of 867 lines.
- `e2e/heic-reader-path.test.ts`: `serveOcrLocally` and its jsDelivr route are deleted with the `OCR_LOCAL` note; the poem test now ends by asserting no request to any other origin.
- `vercel.json:37`: the three outside hosts are removed (`cdn.jsdelivr.net` from `script-src` and `connect-src`, `fonts.googleapis.com` from `style-src`, `fonts.gstatic.com` from `font-src`). `lib/vercel-headers.test.ts:38-41` now expects no origin.
- GUIDE's Fonts sentence names the four families, in the ratified words, EN `GuideContent.svelte:589` and FR `:302`. `NOTICES.md` gains the `@tesseract.js-data/rus` entry (below).

## Tests added

`lib/self-hosted-fonts.test.ts` (no Google host in the shell, the page, `app.css`, or the stylesheet; one link; 84 blocks of the four families, each with swap and a unicode-range; every one of 58 files exists and starts `wOF2`; an `OFL.txt` per family; the photo call, no `gzip` or `cacheMethod`, the pinned package); `lib/components/Reading/guide-licences.test.ts` (both Fonts sentences, rendered); `omr/underlay-recognize.test.ts` (`photoWorkerArgs`); `vercel-headers.test.ts` (moved).

## Done-when: the HEIC path with no outside request

`e2e/heic-reader-path.test.ts` "a HEIC poem with no staves reaches tesseract as a PNG", run in Chromium against `pnpm dev` with no route or mock: passed (15.5 s). Tesseract was handed a PNG (`89 50 4e 47 ...`), the poem landed («Я помню чудное мгновенье: ...»), and the new assertion held: no request to any other origin. This sandbox cannot reach jsdelivr (`ERR_TUNNEL_CONNECTION_FAILED`, measured), so before this change the test could not have passed here without its mock.

## Bytes (CONTRACT §8: Dann hears the count before the ship)

- Added under `static/fonts/`: 1,861,608 bytes in 58 woff2 files, plus four `OFL.txt` (17,771) and `google-families.css` (32,163): **1,911,542 bytes**. (`static/fonts/` was 2.0 MB.)
- The `rus` model for the photo path: **2,679,598 bytes**, copied at build into the git-ignored `static/omr/models/underlay/`, so it is served, not committed.

## Screenshots and PDFs, before and after

Method: the harness of `docs/sessions/n174-c2/` (`capture.test.ts`, `voiced.test.ts`, its baseline config), the fixture `tchaikovsky-op38-3-voice.musicxml`, against `pnpm dev`, before and after the font change; pixels counted with ImageMagick `compare -metric AE` (any differing pixel). Captures are in the scratchpad, not committed.
- **Not captured, because the harness is stale against the app (my finding, not changed):** the desk Learn and Guide shots (`getByRole('button', {name: 'Learn'})` finds nothing; 4 tests time out), and every phone shot but TEXT (the harness's `getByRole('tab').nth(1)` resolves to the Input's LYRICS tab). The desk "TEXT", "MELODY", and "INSIGHTS" shots are in fact three views of the same TEXT screen for the same reason (`tabs.nth(1)` is LYRICS). So what was compared: desk EN and FR, three scroll positions each, 'text/markup/insights' (all TEXT), and the voiced pair (6, 7); phone EN and FR TEXT; 36 pairs in all.
- **27 pairs identical (0 pixels):** all desk FR, all voiced, all phone.
- **9 pairs differ, all desk EN:** `desk-en-1-text-{a-top,b-mid,c-end}`, `-2-markup-*`, `-3-insights-*`, by 7,726, 9,468, and 4,267 pixels (the same three numbers for each, as they are the same screen; 7,726 of 1,296,000 is 0.6%). Looked at by eye at 3x: no word or box has moved; the differences are scattered anti-aliasing-level pixels inside text. A second run on the same new code differs from the first "after" by 0 to 4 pixels, so the change is stable, not noise; **why only EN differs is NOT ESTABLISHED.** I did not test the fonts' rasterisation against Google's served bytes beyond the identical FR captures.
- **Print PDFs of one song (`sunless-01-engraved.musicxml`), TEXT and MELODY:** TEXT 1 page, MELODY 3 pages, before and after; rasterised at 100 dpi, every page identical (0 pixels). MELODY printing 3 pages here is the `print-pages.test.ts:20` failure on the desk's list (step 11).

## What I could not establish

- Why the EN desk captures differ (above).
- Whether a browser with no WebAssembly SIMD reaches the photo path today (the page reader runs before it): not checked. With the SIMD core named by file, such a browser cannot start the photo read, as the desk default says.
- Offline behaviour of the new fonts: `static/sw.js` names no font file (I read it), so they are cached by the browser's HTTP cache, as Lato is; I did not test the service worker.
- The licence of the Tesseract data behind `@tesseract.js-data/rus`: the package says MIT, ships no licence file and no copyright holder; `NOTICES.md` says exactly that and serves no file beside the model.
