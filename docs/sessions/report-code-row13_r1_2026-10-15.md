# Report: row 13, does a stored scan's first reopen still read, and where its time goes (N.166, r2, 2026-10-15)

Lane: a Claude Code cloud session on `cloud-lane-9`, after rows 5 and 47 (row 48 is not in this batch). Brief: the replacement brief inside `review-fable-brief-row13_r1_2026-10-15.md`, which supersedes `brief-code-n166-where-the-minute-goes_r1_2026-10-01.md`. **This row changes nothing that ships.** This commit carries this report and nothing else.

Every time below is a **wasm** time. This box has no WebGPU adapter (the console line on each read says « no WebGPU adapter (the browser granted no adapter) »). The Mac's WebGPU numbers for (d) and (e) are **owed** and are not here.

## Method, and what it ran on

- Build: `pnpm --filter @ilya/web build` at `32eb13c` (rows 5 and 47 on top of `14e2ff8`). Question 1 ran on that build unstamped. Question 2 ran on the same build with `performance.now()` lines added to three source files (below). Served with `python3 -m http.server 5199 --bind 127.0.0.1` from `apps/web/build` (Python 3.13.16), so every download is over loopback.
- Browser: Chromium 141.0.7390.37 (`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`), headless, viewport 1440 by 1000, one fresh context per scan, driven by Playwright 1.58.2 scripts kept outside the tree (git-excluded, not committed).
- The scan: `tools/e16-harness/scans/sunless-01-v-chetyryokh-stenakh_lamm-scan.pdf` (2 pages), and its first page as a PNG from `pdftoppm -r 300 -f 1 -l 1 -png` (`p-1.png`).
- Reader stamp in force: `homr-web@0.2.0-ilya.7/465` (`apps/web/src/lib/omr/stamp.ts`).
- **The scan went in through `input.hidden-input`** (`IntakePanel.svelte:498`), the picker the e2e tests use. The brief says "the second `input[type=file]`"; that input did not start a read in this build (two ten-minute waits on it produced no `/omr/` request at all), so I do not know what it is. I did not look further.
- **The PDF needed a harness polyfill, and that is a finding.** In Chromium 141 the first PDF drop failed with « Ilya could not open that PDF » and the console error `[ScoreUploader] the PDF could not be rasterized: TypeError: i(...).getOrInsertComputed is not a function`. `pdfjs-dist` 6.2.108 calls `Map.prototype.getOrInsertComputed`, a method this Chromium does not have, and nothing in `apps/web/src` supplies it. For every PDF number below the test adds `Map` and `WeakMap` `getOrInsert` and `getOrInsertComputed` with an init script. Nothing in the app was changed. **What a user's browser does is NOT ESTABLISHED:** I do not know which browser versions carry the method, so I cannot say who sees « could not open that PDF » today. The picture (PNG) path does not use pdf.js and ran without the polyfill.

## Question 1: a scan dropped at HEAD, then reopened

Expectation, stated before the measurement (the control rule): it reopens from the kept reading, with no `[omr] homr read` line, no request under `/omr/models/`, and the score painted in a few seconds. The failure mode I named, the reading not stored at the first save, did not occur once at least four seconds separated arrival and reload.

| Run | `[omr] homr read` line on the reopen | Requests matching `ort-wasm\|\.onnx\|/omr/` | Navigation to `.receipt-score` visible | Busy label shown |
|---|---|---|---|---|
| PDF, the drop itself | `homr read 2 of 2 pages … in 266,748 ms on wasm` | 12 (6 models) | 285,311 ms | « Starting the reader … » at 12,457 ms |
| PDF, reopen 1 (4 s after arrival) | none | 0 | 425 ms | none seen |
| PDF, reopen 2 | none | 0 | 365 ms | none seen |
| PNG, the drop itself | `homr read 1 of 1 pages … in 145,400 ms on wasm` | 10 (6 models) | 152,764 ms | « Starting the reader … » at 2,525 ms |
| PNG, reopen 1 (4 s after arrival) | none | 0 | 426 ms | none seen |
| PNG, reopen 2 | none | 0 | 406 ms | none seen |

No response was 400 or above in any run. The busy label was looked for by polling the page text every 200 ms, so a label shown for less than that could be missed.

**A scan dropped at HEAD does not read on its first reopen.** The kept reading is used: on the stamped build every kept-path reopen logged `restoreStoredScan called, kept=current`, then `restoreScan returned from=kept`, then `ingest start`, all inside 400 to 650 ms of the page clock, and made no `/omr/` request.

**How soon after arrival, measured further (the reopen is a PNG):**

| Reload this long after the score arrived | Result |
|---|---|
| 300 ms | **No song at all**: the page opens empty, no `.receipt-score`, no read, no request. A second reload was empty too. |
| 1,000 ms | restored from the kept reading in 439 ms, no read |
| 2,000 ms | restored from the kept reading in 379 ms, no read |

So a reload inside the first moments after arrival finds nothing stored. The library saves on a trailing debounce of 800 ms (`apps/web/src/lib/library/library.ts:441`, `SAVE_DEBOUNCE_MS`) and flushes on `pagehide` (`document.svelte.ts:217`); that flush did not keep the song in this run. The window lies between 0.3 and 1.0 s and was not narrowed further. I did not look at why the `pagehide` flush did not land (an IndexedDB write that a reload interrupts is one candidate, NOT ESTABLISHED). A person reloading 300 ms after a read that took minutes is unlikely, so I call this a finding for the desk and not a defect.

## Question 2: the read that still happens once per reader bump

The kept reading was made stale by setting `reading.stamp` to `r13-stale-stamp` on the song's record in `ilya-library`, store `sources`, then reloading. `isCurrent` (`restore.ts:42-44`) compares the stamp alone, so every such reload re-read the scan. `.receipt-score` appeared only after the re-read ended, so it is a valid end point. The stamps are `[r13]` console lines carrying `performance.now()`, which restarts at each navigation, so every time is from that reload's own start.

Segments, in milliseconds (the brief's letters):

| | PDF warm | PDF cold | PNG warm | PNG cold |
|---|---|---|---|---|
| **(a)** navigation to the call of `restoreStoredScan` | 294 | 918 | 309 | 583 |
| **(b)** `import('$lib/reader/page-pdf')` | 26 | 143 | n/a | n/a |
| **(b)** `rasterizePdf` (PDF) or `toGreyscalePng` (PNG) | 6,599 | 7,120 | 569 | 583 |
| pdf.js took its wasm decoder? | yes (`/pdfjs-wasm/jbig2.wasm`) | yes | n/a | n/a |
| **(c)** `import('./homr-reader')` | 43 | 132 | 3 | 10 |
| engine start (`read()` begins to recognizer ready) | 1,769 | 1,838 | 1,783 | 1,967 |
| recognizer ready to the first `models` progress | 3,893 | 4,010 | 3,073 | 2,830 |
| **(d)** first `models` progress to the first other stage | 12,311 | 13,606 | 13,584 | 11,610 |
| **(e)** that to the end of `read()` (`join done`) | 250,592 | 255,238 | 127,859 | 123,736 |
| of which the join (page metre reads included) | 17,066 | 17,349 | 16,119 | 15,504 |
| **(f)** `hooks.ingest` start to `.receipt-score` visible | 175 | 189 | 72 | 50 |
| Total, navigation to `.receipt-score` visible | **275,714** | **283,203** | **147,256** | **141,373** |
| Parts not stamped (total less the sum of the rows above) | 12 | 9 | 4 | 4 |
| `[omr] homr read` line, `durationMs` | 268,567 | 274,692 | 146,300 | 140,143 |
| **(g)** the reload after the re-read: time, read, requests | 558 ms, none, 0 | 839 ms, none, 0 | 399 ms, none, 0 | 510 ms, none, 0 |

Backend on every row: **wasm**. (g) held on all four: the re-read was kept and the next reload took the kept path.

**Which of (a) to (g) holds most of the time: (e), the read itself after its first stage, 87 to 91 percent of the total** (250,592 of 275,714 ms for the PDF, warm). Everything before it, (a) to (d) with the engine start, is 24.9 s for the PDF (9 percent; 6.6 s of that is rasterizing the PDF) and 17.6 to 19.3 s for the PNG (12 to 13 percent). The kept-path restore, (a) and (f) alone, is under a second.

**The parts reach the total:** the unstamped remainder is 4 to 12 ms.

**What the warm and cold pair does not tell you.** The static server answered `200` for the three homr models and the engine on the warm runs as well, with a `304` only for one metre file, so the HTTP cache did not serve them and the two columns differ only by run-to-run noise (about 1 to 5 seconds). The pair does **not** bound download time. NOT ESTABLISHED why the warm runs were refetched (the Python server sends `Last-Modified` and no cache policy). The models are fetched lazily during the read, not before it: the segmentation model about 22 s into the PDF drop, the encoder and decoder together about 84 s in, the metre model after the page's notes (loopback, so each took well under a second). Over a real network each of those would be inside (d) or (e).

## What stays on the Mac

The Mac's (d) and (e) on WebGPU are owed; this table is the wasm shape of the read. **Question 1 does not depend on the backend**: the kept path never starts a reader. Since a scan dropped now reopens without a read, and the one remaining read is the per-bump re-read, the Mac measurement is lower priority. Dann decides whether it is taken.

## Files stamped, and clean again

Stamped for question 2 only: `apps/web/src/lib/omr/restore.ts`, `apps/web/src/lib/omr/scan.ts`, `apps/web/src/lib/omr/homr-reader.ts` (28 lines added across the three). I took copies of the three files before editing and copied them back after: their md5 values match the copies exactly (`restore.ts` `478f2f74…`, `scan.ts` `6b0212a8…`, `homr-reader.ts` `5566ceaa…`), no `__r13` or `[r13]` remains under `apps/web/src`, and `git --no-optional-locks diff --stat` printed nothing before this report was written.

## Gates, after the stamps were removed

| Gate | Result |
|---|---|
| 1 phonology | 251 passed |
| 2 dictionary | 248 passed |
| 3 web-check | 0 errors, 12 warnings in 5 files |
| 4 web-test | 2591 passed (2580 after row 5, plus row 47's 11) |
| 5 score-parser | 683 passed, 5 skipped (675 plus row 47's 8) |
| 6 blurb | 145 passed |
| 7 integration | 55 passed |
| 8 ratchets | OK |

## Could not establish

- Which browsers lack `Map.prototype.getOrInsertComputed`, and so which singers see « Ilya could not open that PDF » on a PDF drop. Only Chromium 141 was tried, and only with the polyfill for every PDF number.
- Whether the PDF number would differ without the polyfill. It would not run at all.
- What the brief's "second `input[type=file]`" is in this build.
- Why a reload 300 ms after arrival finds no song despite the `pagehide` flush, and where between 300 ms and 1,000 ms the window closes.
- Why the warm runs refetched the models.
- Download time as a real network would give it (everything here was loopback).
- Whether the busy label can appear for under 200 ms on the kept path (it was looked for every 200 ms).
- WebGPU timings of any kind.
