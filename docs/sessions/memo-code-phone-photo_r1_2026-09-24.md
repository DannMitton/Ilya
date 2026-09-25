# MEMO. A real phone photo of a score does not get through

**Claude Code, 2026-09-24, `Shane` at `1987157`, tree dirty. DIAGNOSED, nothing built.** Measured on the dev server in the Browser pane (Chromium 152), with the app's own modules. Gates before and after: 216, 235, 0 errors and 12 warnings, 1402, 602 plus 5 skipped.

## 1. The JPEG was routed as a poem

`hasStaves` (`engine/staff-detect.ts:48`, `rowGate: 0.4`) returned **false**. It needs a row with 40% of the full frame width in ink. At 0.4, two staves each yield four lines, not five (vocal staff, rows 1203 to 1261; the fifth line, row 1281, falls short). At 0.3, three real staves pass, with gaps of 17 to 20 px. So `take()` (`ScoreUploader.svelte:281`) went straight to OCR.

Fixing the gate alone would not help. The reader, run directly, refuses the page: `detect_staves: contaminated staff group ... group sizes: [1, 4, 3, 2, 1, 1]`. The probe returned null. A failed read also falls back to OCR (`ScoreUploader.svelte:575-581`).

## 2. The message is false

OCR returned about 2,300 characters in 3.7 s, lyrics included ("тень не про-гляд - на-я"). The guard refused them: 74 of 112 tokens unknown (66%, cutoff 50%). `ScoreUploader.svelte:481` shows "No text recognised" for every refusal.

## 3. HEIC

The pane's Chromium also refuses it (`ImageUndecodableError`). Files per jsDelivr:

- `heic2any` 0.0.4, MIT, last published 2023: 1,351,840 bytes.
- `libheif-js` 1.23.2, LGPL-3.0: 1,422,377 (wasm) plus 91,255 (loader) bytes.
- A message telling a Mac user how to get a JPEG: 0 bytes.

## NOT ESTABLISHED

- Dann's Chrome and the sha deployment. Nothing ran there.
- Whether either decoder applies the HEIC's rotation. The HEIC is 4032 x 3024, the upright JPEG 3024 x 4032.
- Whether any change makes this page readable.
- LGPL's implications here.
