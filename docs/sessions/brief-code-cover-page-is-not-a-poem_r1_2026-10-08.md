# Brief for Code: a PDF that opens with a cover page still reaches the reader (r1, 2026-10-08)

Written by the desk (Opus) 2026-10-08 about 00:40. Model: Sonnet. For Code on the Mac. QUEUE row 44.

## What the singer sees today, and after

A singer drops a scanned song from IMSLP. Most such PDFs open with a cover or title page. Today Ilya rasterizes **only the first page** and asks whether it has staves (`apps/web/src/lib/score/ScoreUploader.svelte:275-282`, `rasterizeFirstPage` at `:353-376` calls `rasterizePdf(file, 1)`). A cover has no staves, so the PDF goes down the poem route, OCR finds nothing it accepts, and the singer reads "Ilya could not read this picture clearly. A flat scan or a PDF works best." (`:487`). The reader never runs.

Seen by Dann on his iMac, 2026-10-08 00:31, with `grechaninov_op20-4_uznik.pdf` (cover plus four pages of music; it reads 153 of 154 notes when handed to the reader directly). Six of the eight songs in the new unseen set open with a cover (`docs/sessions/report-heldout-truth_r1_2026-10-07.md`, phase 1 table).

After this brief: the singer drops the same PDF and the wait squircle appears, because Ilya looks past the cover for the first page with staves.

## The change (DESK DEFAULT, reversible)

1. For a PDF, look for staves page by page, from the first, and stop at the first page that has them, checking **at most the first four pages**. If any has staves, the whole PDF goes to the reader as today (`readScanAsScore`, unchanged). The reader itself already reads every page and drops pages with no music.
2. If none of those pages has staves, the poem route runs exactly as today, with **page 1's** ink, as today.
3. Pictures (one image) are unchanged.
4. `ScoreUploader.svelte` sits at its ratchet ceiling (1358 lines). Put the page-by-page search in a small module of its own (for example `apps/web/src/lib/score/ingestion/first-staved-page.ts`) with a pure, tested core, and call it from `take` in place of the single `hasStaves(ink)` check. If `rasterizePdf` cannot give one page at a time cheaply, say what it costs and choose the cheapest correct way.

## Tests and checks

- Unit tests: a PDF whose page 1 has no staves and page 2 has staves goes to the reader; a PDF with no staves in its first four pages goes to the poem route with page 1's ink; a one-page score is unchanged; a picture is unchanged.
- Browser check on the dev server: drop `~/Downloads/_desk-2026-10-07/heldout-scans/grechaninov_op20-4_uznik.pdf` (already opened for diagnosis; Dann's yes of 2026-10-07 19:47). Report that the wait squircle appears and how many measures and notes the reader returns. Do not drop any other file from that folder: the other six are an unseen test set.
- Also drop one poem PDF (text only, any you have or make) and report that it still reaches the poem route.
- All eight gates. Gate 4 baseline `1979`. Name any number that moves.

## Report

`docs/sessions/report-code-cover-page-is-not-a-poem_r1_2026-10-08.md`: changes with `path:line`, each gate, the browser checks, the time the search adds on a poem PDF, and a section **Could not establish**. NOT ESTABLISHED beats a complete invented answer.

No git writes of any kind. Dann ships.
