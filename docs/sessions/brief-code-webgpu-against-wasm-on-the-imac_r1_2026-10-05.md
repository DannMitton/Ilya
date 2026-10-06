# Brief for Code on Dann's iMac: the WebGPU read against the WebAssembly read (r1, 2026-10-05)

Written by the desk (Opus) 2026-10-05 about 15:20. For Claude Code on Dann's Mac, on Sonnet. QUEUE row 35.

## What the singer saw

On 2026-10-05 at 15:08, Dann dropped `~/Downloads/Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf` on the branch alias (`0976735`) in his Chrome. Ilya drew the voice part in 9/8. The page prints 3/8 (`docs/sessions/truth-draft-tchaikovsky-op38-3-voice_r2_2026-10-02.md`: "Every bar adds up to 3/8"). Few of the bars Ilya drew add up to 9/8; some hold a single eighth note. Nothing in Ilya flagged it. Dann: nobody can use this as it is.

## What is known, and from where

1. homr never reads a time signature's top number. Its writer sets it to the median bar length of the part on that page (`report-opus-the-checks-measured_r1_2026-10-05.md`, item 5 and section 4b). So 9/8 means homr's bars on that page were mostly 9/8 long: bars were joined or lengths misread.
2. The only reads of model 465 that were scored ran on WebAssembly, in headless Chromium in the desk's cloud workspace (QUEUE row 29: 99 measures, 174 pitched notes, score 98.28; its proof picture shows 3/8).
3. Dann's Chrome grants a WebGPU adapter with `shader-f16` (the desk asked it between 15:16 and 15:22: vendor `apple`, architecture `metal-3`). With that, `apps/web/src/lib/omr/path-choice.ts:74-77` asks homr-web for WebGPU, and the fp16 models run. **No WebGPU read of model 465 has been scored anywhere.**
4. So the leading explanation is that the fp16 WebGPU path reads this page differently from WebAssembly. **That is the desk's inference, not a measurement.** Part A measures it.

## Part A: measure, change nothing

Before you start a server, list what is already listening: `lsof -nP -iTCP -sTCP:LISTEN | grep node`. Do not stop a process you did not start. Run your own dev server on a port nothing is using, and stop only that process at the end.

1. Drive Dann's installed Google Chrome (headed; Playwright `channel: 'chrome'`, a fresh profile), not bundled Chromium, so the read gets the same Metal adapter his browser has. Confirm in the page that `navigator.gpu.requestAdapter()` returns an adapter with `shader-f16`, and record it.
2. Read the Tchaikovsky PDF twice through Ilya's own reader (`apps/web/src/lib/omr/homr-reader.ts`): once on the path Ilya chooses (WebGPU), and once forced to `wasm-threads` (a test-only override is fine; it must not ship in Part A). Keep both joined MusicXML files.
3. Score both against the truth with `tools/e16-harness/src/scan-scorer.ts`, as `tools/e16-harness/src/scan-baseline.ts` does for song 7 (`docs/sessions/truth-draft-tchaikovsky-op38-3-voice_r2_2026-10-02.json`).
4. For each path report: the metre on each page; the number of bars; bars whose written lengths add up to the stated metre; notes read with pitch and length as printed, misread, missing, and extra; the read time; and the console line `[omr] homr read ...`, which names the backend.
5. Take one picture of Markup's first page for each path.

## Part B: only if Part A shows WebGPU reading worse

If the WebGPU read is worse than the WebAssembly read on bars that add up or on notes read as printed, change `path-choice.ts` so Ilya asks for `wasm-threads` everywhere, keep the WebGPU code in place behind that one decision, and update `path-choice.test.ts`. A DESK DEFAULT: the singer gets the reading that was measured good, and WebGPU comes back when a scored read says it matches. Record the WebAssembly read time on the iMac, since the singer waits for it.

If WebGPU is not worse, change nothing and say so: then the cause is elsewhere, and the report names where the two reads first differ from the truth.

## Done when

The report exists at `docs/sessions/report-code-webgpu-against-wasm-on-the-imac_r1_2026-10-05.md` with Part A's table for both paths, the two pictures beside it, and, if Part B ran, the eight gates with any number that moved and the tests that moved it. Do not commit or stage anything. Dann ships.

## What you could not establish

Give this its own section. NOT ESTABLISHED beats a complete invented answer.

## Cost

Sonnet. The desk's range is 150,000 to 400,000 tokens, an estimate. Stop and report at 400,000.
