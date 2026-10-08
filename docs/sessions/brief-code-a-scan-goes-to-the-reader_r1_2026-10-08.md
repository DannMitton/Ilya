# Brief for Code: an image-only PDF goes to the reader, whatever the staff check says (r1, 2026-10-08)

Written by the desk (Opus) 2026-10-08 about 00:50. Model: Sonnet. For Code on the Mac. QUEUE row 45. Builds on row 44 (built, not yet shipped: `first-staved-page.ts`).

## Why

Row 44's report (`docs/sessions/report-code-cover-page-is-not-a-poem_r1_2026-10-08.md`): the staff check at the door (`hasStaves`, `apps/web/src/lib/reader/staff-detect.ts:112`) answers false on all four pages of `grechaninov_op20-4_uznik.pdf`, including its three music pages, because the scan's staff lines are skewed and fuzzy (widest ink row 0.16, 0.41, 0.22 of page width against a gate of 0.4 on five rows). So the PDF goes to the poem route and the singer reads "Ilya could not read this picture clearly". Handed to the reader directly, the same PDF reads 153 of 154 printed notes. IMSLP's scans are image-only PDFs, often worn: the door check refuses exactly the files the reader can read.

The reader already decides for itself: when it finds no music on any page it reports `not_music`, and `take` then runs the poem route (`ScoreUploader.svelte`, the `poem:` hook of `readScanAsScore`).

## The change (DESK DEFAULT, reversible)

For a PDF, in `take`:

1. If row 44's search finds a page with staves in the first four pages: the reader, as now.
2. Otherwise, if the PDF **has no usable text layer** (an image-only scan): the reader anyway. If the reader returns `not_music`, the poem route runs as today (OCR on page 1).
3. Otherwise (a text layer and no staves): the poem route at once, as today.

"Usable text layer": use whatever the poem route already uses to read a PDF's text (`extractPdfText`, `apps/web/src/lib/reader/page-pdf.ts`), and treat a layer with no letters, or only a few, as none. Choose the threshold from what you measure on the poem PDFs you have, and say what you chose. Pictures (one image) are unchanged. Keep `ScoreUploader.svelte` at or under its ratchet ceiling; put the decision in a small tested module (row 44's `first-staved-page.ts` or a sibling).

## Tests and checks

- Unit tests for the three branches, and for `not_music` from the reader falling through to the poem route.
- Browser check on the dev server, `~/Downloads/_desk-2026-10-07/heldout-scans/grechaninov_op20-4_uznik.pdf` only (opened for diagnosis; do not drop any other file from that folder): the wait squircle appears and the reader runs. The cloud and headless browsers have no WebGPU adapter and may report no music; if so, say so plainly and state that Dann's look on the alias settles it.
- A text-layer poem PDF still goes straight to the poem route, with no reader wait.
- An image-only poem (a scanned page of verse, if you have or can make one): report how long it waits before the poem route.
- All eight gates. Gate 4 baseline `1986` (row 44's). Name any number that moves.

## Report

`docs/sessions/report-code-a-scan-goes-to-the-reader_r1_2026-10-08.md`: changes with `path:line`, each gate, the checks, the text-layer threshold and why, and a section **Could not establish**. NOT ESTABLISHED beats a complete invented answer.

No git writes of any kind. Dann ships rows 44 and 45 together.
