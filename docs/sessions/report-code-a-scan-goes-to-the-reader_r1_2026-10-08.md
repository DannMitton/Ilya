# Report: an image-only PDF goes to the reader, whatever the staff check says (r1, 2026-10-08)

Answers `brief-code-a-scan-goes-to-the-reader_r1_2026-10-08.md` (QUEUE row 45), on top of row 44 (`report-code-cover-page-is-not-a-poem_r1_2026-10-08.md`). Written by Code (Sonnet), base `9cfcd17` plus rows 43, 44, and this one uncommitted. No git writes. **WRITTEN, not DONE: Dann's look on the alias settles whether the reader reads the Grechaninov PDF.**

## What changed

| Where | What |
|---|---|
| `apps/web/src/lib/score/ingestion/first-staved-page.ts:80`, `:88`, `:100` | `MIN_TEXT_LETTERS = 20`; `decidePdfRoute` (pure, the three branches); `routePdf` (row 44's search plus the text-layer read). Replaces `firstStavedPdfPage`, which only row 44 used. |
| `apps/web/src/lib/score/ScoreUploader.svelte:367` and `take` | A PDF now goes to `routePdf`. The reader runs when the route is `reader`. The poem hook is told `stavesFound` truthfully: `true` when staves were found (as row 44), **`false` with `sungLineFound` null when the reader was tried only because the PDF is image-only**, which is exactly what the poem route is told today for a PDF with no staves, so a scanned poem keeps today's behaviour and message. Pictures still go through `hasStaves`. File stays at its ceiling: **1358 lines** (the long `take` comment and the helper's comment were condensed to pay for it). |
| `apps/web/src/lib/score/ingestion/first-staved-page.test.ts` | Five new tests (twelve in the file). |

## The decision, per the brief

1. Staves on one of the first four pages: the reader (row 44).
2. No staves, and no usable text layer: the reader anyway. `not_music` from the reader falls through to the poem route (OCR on page 1) exactly as before.
3. No staves and a text layer: the poem route at once. A text layer that cannot be read at all also goes to the poem route, as before.

`not_music` falling through is already tested at `apps/web/src/lib/omr/scan.test.ts:82` ("tries the poem route where homr finds no music"); I did not duplicate it.

## The text-layer threshold: 20 letters

"Usable" means at least 20 Unicode letters in what `extractPdfText` returns (digits, spaces, and marks do not count). Measured with `extractPdfText` in the browser:

| PDF | Letters | Route |
|---|---|---|
| Five-page typed Russian poem (made here) | 9,320 | poem, at once |
| Title page of the cover-then-staves test PDF | 17 | reader (staves found on a later page, so the layer is not read) |
| Image-only scan of a Russian poem (made here) | 0 | reader, then poem |
| `grechaninov_op20-4_uznik.pdf` | 0 | reader |

I chose 20 because the two real image scans carry no text at all, a typed stanza carries well over 100 letters, and 20 clears the stray letters an image scan can hold in a watermark. **The cost of the choice:** a typed PDF of a single very short line (under 20 letters) would be sent to the reader first, wait for the reader's `not_music`, and only then reach the poem route. Nothing breaks; it is slower for that rare file. The margin is thin against the 17-letter title page, but that PDF has staves on a later page and never reaches the text check. The number is a desk default and one constant to change.

## Browser checks (dev server `http://localhost:5173`, headless Chromium)

- **`grechaninov_op20-4_uznik.pdf`** (the only file I opened from that folder): **the wait squircle appears** and the reader starts (`docs/sessions/cover-page-shots/grechaninov-wait-squircle-row45.png`). Headless Chromium has no WebGPU adapter ("No available adapters"), so the reader falls back to WebAssembly, and it had not finished after 150 s when my check ended. **So I have no measure and note counts.** Whether it reads 153 of 154 notes on the alias is settled by Dann's look, not by this environment.
- **A typed poem PDF** (five pages of text): straight to the poem route, **no reader wait**: the poem text was in the field about **2.6 s** after the drop, and the log shows no `[omr]` line and no "reading the notes" squircle.
- **An image-only poem PDF** (a page of verse rendered as a picture, no text layer): the reader ran first and answered `not_music` after **about 21.7 s** in headless WebAssembly (23 s to my loop's stop; the OCR then transcribed the poem to eight lines with IPA and glosses, `image-only-poem-after-reader-row45.png`). So a scanned poem now waits for the reader's verdict before the poem route. **That 21.7 s is a headless CPU number including warm-up; on a machine with a GPU the reader's own guidance says about a minute for the first start.** On Dann's iMac this wait is the thing to look at.

## Gates (one at a time: `ilya-ship.sh` refuses on untracked files)

| Gate | Result | Baseline |
|---|---|---|
| 1 phonology | 251 passed | 251 |
| 2 dictionary | 235 passed | 235 |
| 3 web-check | 0 errors, 12 warnings, 5 files | same |
| 4 web-test | **1991 passed** | 1986 (row 44's); **+5**, all in `first-staved-page.test.ts` |
| 5 score-parser | 650 passed, 5 skipped (655) | same |
| 6 blurb | 145 passed | 145 |
| 7 integration | 55 passed | 55 |
| 8 ratchets | OK; `ScoreUploader.svelte` at 1358, its ceiling | OK |

`ilya-ship.sh` line 79 needs 1991 for rows 44 and 45 together (1979 → 1991: row 44 +7, row 45 +5; the file is the desk's, not touched).

## Could not establish

- **That the reader reads the Grechaninov PDF through the uploader** (measures, notes), as above: no GPU here, and the WebAssembly read did not finish in 150 s.
- **The wait a scanned poem pays on a real machine.** 21.7 s is headless WebAssembly; a GPU machine's number is unmeasured here.
- **How many of the other covered scans in the unseen set the new route sends to the reader.** I was told not to open them. By the measured rule, any image-only PDF now goes to the reader.
- **A picture (one image) in the browser:** unchanged code, not dropped.
- **A PDF that is image-only but also carries an OCR text layer of 20 or more letters** (some scans have one): it goes to the poem route as typed text would. If IMSLP files like that exist, the staff check or a bar of the layer's quality would need to guard it. Not measured.
- The dev server is still running on 5173 (`ilya-web`).
