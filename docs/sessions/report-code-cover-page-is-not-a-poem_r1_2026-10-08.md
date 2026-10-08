# Report: a PDF that opens with a cover page still reaches the reader (r1, 2026-10-08)

Answers `brief-code-cover-page-is-not-a-poem_r1_2026-10-08.md` (QUEUE row 44). Written by Code (Sonnet) on branch `Shane`, base `9cfcd17` plus rows 43 and this one uncommitted. No git writes. **WRITTEN, not DONE.**

## The result that matters first

**The change works, but it does not rescue `grechaninov_op20-4_uznik.pdf`.** That PDF still goes down the poem route and still ends on "Ilya could not read this picture clearly". The cause is not the search: the existing staff check `hasStaves` answers **false on all four of its pages**, including the three music pages. Measured in the browser (rasterized at 4400 px wide, the reader's own scale):

| Page | Size | Widest ink row (share of page width) | `hasStaves` |
|---|---|---|---|
| 1 (cover) | 4400 x 6714 | 0.085 | false |
| 2 (music) | 4400 x 5777 | 0.158 | false |
| 3 (music) | 4400 x 6133 | 0.414 | false |
| 4 (music) | 4400 x 6005 | 0.221 | false |

`detectStavesLight` (`apps/web/src/lib/reader/staff-detect.ts`) needs five evenly spaced rows that are each more than 40 percent ink (`rowGate: 0.4`). On this scan the staves are slightly skewed and fuzzy, so a staff line is spread across several pixel rows and no row reaches 0.4 (page 3 has 14 rows over 0.3 and a widest row of 0.414, which fails the even-spacing test). Page 2 is plainly music (I viewed it). So the brief's premise, that the reader handles this PDF once it is handed over, holds, but the gate in front of it refuses it page after page.

**I did not change the detector.** The brief did not authorize it, and lowering the gate is not safe on its own: a justified line of Cyrillic text can put 15 to 25 percent of a row in ink, and five evenly spaced text lines would pass as a staff, which would send poem PDFs to the reader. A skew-tolerant detector (a deskew first, or a run-length test per row window) is the real fix. That is a separate row; say if you want it.

## What changed

| Where | What |
|---|---|
| `apps/web/src/lib/score/ingestion/first-staved-page.ts` (new, 70 lines) | `searchForStaves` (pure core), `firstStavedPdfPage` (the real PDF wrapper), `COVER_SEARCH_PAGES = 4`. Looks page by page from page 1, stops at the first page with staves, at most four. Returns page 1's ink (for the poem route) and the staved page number, or null. A page after the first that will not render ends the search quietly (page 1 stays for the poem route) instead of failing the drop; page 1 failing, or no pages, still fails as before. |
| `apps/web/src/lib/reader/page-pdf.ts:146`, `:232` | `rasterizePdf` takes an optional `stop(ink, page)` callback and ends the render at the page it returns true for. This is the cheapest correct way: one open of the PDF, pages rendered lazily, nothing rendered past the page wanted. Existing callers pass no `stop` and are unchanged. |
| `apps/web/src/lib/score/ScoreUploader.svelte:367`, `:283` | `rasterizeFirstPage`'s PDF branch calls `firstStavedPdfPage`; `take` uses its answer for a PDF and still calls `hasStaves(ink)` for a picture. The poem route still receives page 1's ink. The file stays at its ceiling: **1358 lines**, the same as before (I shortened a doc comment to pay for the import). |
| `apps/web/src/lib/score/ingestion/first-staved-page.test.ts` (new, 7 tests) | Page 1 bare and page 2 staved goes to the reader and stops rendering at page 2; no staves in four pages goes to the poem route with page 1's ink and renders exactly four; a one-page score and a one-page poem are unchanged; staves on page 4 found, on page 5 not; a later page that will not render ends the search, keeping page 1; page 1 failing rejects and a PDF with no pages answers null. |

"A picture is unchanged" is not a unit test: the picture branch is inside `ScoreUploader.svelte` and was not touched (`rasterizeFirstPage` returns `{ ink }` with no `stavedPage`, so `take` takes the `hasStaves(ink)` side). I did not drop a picture in the browser.

## Browser checks (dev server `http://localhost:5173`, headless Chromium)

- **A cover, then staves** (a test PDF I made: a title page, then pages with three five-line staves drawn as thick rules; `scratchpad/cover-music.pdf`): the search found staves on page 3 (page 2 came out blank from my page layout), **the wait squircle appeared** ("Ilya is reading the notes off your page...", `docs/sessions/cover-page-shots/cover-then-staves-wait-squircle.png`), and the reader ran. The reader then answered `not_music` ("no WebGPU adapter (the browser granted no adapter)", logged `[omr] homr did not read`), because headless Chromium has no GPU, and the app fell through to the poem route as designed. So this proves the route, not a reading. **I could not run the reader to a result in this environment**, so I have no measure and note counts to report.
- **`grechaninov_op20-4_uznik.pdf`** (the one file I was allowed): no squircle; poem route; OCR logged "Line cannot be recognized"; the singer's error shows (see above). Not rescued, for the reason above. No other file from that folder was opened.
- **A text-only poem PDF** (five pages of Russian, made with Chromium, `scratchpad/poem.pdf`): no staves on any of the first four pages, the poem route ran as today (the text transcribed, `BlurbComposer` logged). Screenshot `docs/sessions/cover-page-shots/poem-pdf-poem-route.png`.

## Time the search adds on a poem PDF

Measured in the browser, three runs each, on the dev server (not a production build), against the old single-page render:

| PDF | Old (page 1 only) | New (up to four pages plus the staff check) |
|---|---|---|
| 10-page text poem (made here) | 318 to 354 ms | 889 to 906 ms (about **+0.55 s**) |
| `grechaninov_op20-4_uznik.pdf` (no staves found, so all four pages) | 396 to 435 ms | 1.69 to 1.92 s (about **+1.3 s**; this is a 4400 px scan, rendered four times) |
| Cover then staves (found at page 3) | 305 to 371 ms | 669 to 849 ms |

A PDF whose first page has staves costs the same as before: the callback stops at page 1. The cost lands on text PDFs and on scans whose staves the detector misses.

## Gates (run one at a time: `ilya-ship.sh` refuses on untracked files)

| Gate | Result | Baseline |
|---|---|---|
| 1 phonology | 251 passed | 251 |
| 2 dictionary | 235 passed | 235 |
| 3 web-check | 0 errors, 12 warnings, 5 files | same |
| 4 web-test | **1986 passed** (117 files) | 1979; **+7**, all in `first-staved-page.test.ts` |
| 5 score-parser | 650 passed, 5 skipped (655) | same |
| 6 blurb | 145 passed | 145 |
| 7 integration | 55 passed | 55 |
| 8 ratchets | OK (`ScoreUploader.svelte` 1358, at its ceiling) | OK |

`ilya-ship.sh` line 79 needs 1986 (the desk's file, not touched).

## Could not establish

- **That the reader reads `grechaninov_op20-4_uznik.pdf` through the uploader.** The staff check blocks it, and headless Chromium has no WebGPU adapter, so the reader cannot run to a result here at all. Dann's machine, not this one, can answer "how many measures and notes".
- **Measures and notes from the reader** on any PDF (above).
- **The picture route in the browser** (not touched, not dropped).
- **Whether the other five covered scans in the unseen set pass `hasStaves`.** I was told not to open them. If the detector's gate is the problem on this one, it may be on others; the desk can ask for a count with the detector alone on the page images it already has.
- **Production-build timings** (the numbers above are the dev server's).
- The dev server is still running on 5173 (`ilya-web`).
