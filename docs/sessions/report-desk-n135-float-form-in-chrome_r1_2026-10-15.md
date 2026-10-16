# Report: the float form of rus_prereform r2 in the browser, loaded and measured (N.135, after QUEUE row 82's retrain; r1)

Desk (Fable 5.1), in its own cloud workspace, 2026-10-15 about 23:00 to 23:20. Measures only; nothing ships. Scripts and outputs in `docs/sessions/measure-n135-float-in-chrome_2026-10-15/`; the harness it extends is `docs/sessions/measure-row82-retrain_2026-10-15/harness/` (Code, row 82's retrain report, section 5), itself a copy of N.135 stage 1's.

## The answer first

1. **The float form loads in a browser when `corePath` names the SIMD core file.** tesseract.js 7.0.0 takes a `corePath` ending in `js` as the file itself (`src/worker-script/browser/getCore.js:21-22`); given a directory it picks `tesseract-core-relaxedsimd-lstm.wasm.js` on a browser with relaxed SIMD, and the float model aborts there (`Aborted(missing function: _ZN9tesseract13DotProductSSEEPKfS1_i)`, reproduced). With `corePath` = `…/tesseract-core-simd-lstm.wasm.js` the float form (7,827,478 bytes, md5 `2ff2af3e33461cd64e7d2015ef21d10d`) loads in 0.3 to 0.5 s and reads a row in 0.2 to 0.4 s; on the plain `tesseract-core-lstm.wasm.js` it also loads, at 0.5 to 0.8 s a row (`float-in-chrome.json`). Browser: headless Chromium 141.0.7390.37 (the workspace's `/opt/pw-browsers/chromium-1194`), through tesseract.js's own browser bundle and the real `createWorker`. **Dann's Chrome 155 on the Mac: NOT ESTABLISHED;** the file served is the same.

2. **Measured as reader (dfloat) on every R2 row of the 18 songs (589 crops), read in that browser path with word boxes, and scored with the harness's own scorers:** it reads 1,875 of 2,538 printed syllables right in sound (tokens split at an internal mark) against 1,839 for the integer form (d), 1,801 for (c), 1,761 for (a) (`score42-R2-split.txt`, "all"). On S, T, K, M: 91, 164, 116, 46 of 109, 200, 131, 53 (the integer form: 87, 165, 114, 23; M is where the two forms differ). Pre-reform letters: ѣ 32 of 32, і 10 and І 1 of 11, word-final ъ 117 of 124 (the integer form: 31, 9 + 1 + 1, 115).

3. **Seated under the right note it moves 0 to 4 points a song, and 1 of 16 songs reaches 90, as before** (`summary.txt`, R2, rule 2 unless named): U1 96 (was 95), U4 71 (70, rule 3), U5 77 (76), U6 73 (71), P 66 (62, rule 3), S 79 (75), T 79 (79), B01 70 (71), B02 42 (42), B03 73 (73), B04 74 (73), B06 50 (50), B07 64 (65), B08 69 (71), B09 59 (60), B10 54 (53). It is now the best cell on U1, U4, U5, U6, P, and B10; (a) or (c) keep B01 to B09 by 1 to 7 points; (t-syl) keeps S at 88.

4. **Pages passing section 5's threshold:** (dfloat) 37 of 69, (d) 38, (c) 46, (a) 52, (t-imap) 52 (`score43-R2.txt`, last table). Why the better readers pass fewer pages is NOT ESTABLISHED (a lead: the fine-tuned model carries no dictionary data, and the half-of-words-in-the-dictionary test is taken on its sewn words).

**So the reader decision of brief section 5 is settled by measurement: the browser reader is the float form of rus_prereform r2 on the SIMD core (DESK DEFAULT), and what still holds every song but one below 9 of 10 is the photocopied Kabalevsky pages (B01 to B10, 42 to 80 seated) and P (66), type the model never saw.** Bytes a stage 2b build would serve from Ilya's origin, for Dann before anything lands in `static/`: the model 7,827,478 (gzip not measured) and `tesseract-core-simd-lstm.wasm.js` 3,899,472 (the relaxed core the app would otherwise fetch is 3,905,767).

## Controls

- The three rows of row 82's `chrome-load-d.mjs` (U1-1-s1-r1, B01-1-s1-r1, U6-2-s1-r1) read through the float form here match its integer readings on the Mac to within one or two characters a row (`float-in-chrome.json` against `chrome-load-d.json`).
- The scorers run here reproduce every cell of the Mac's `summary.txt` for (a), (c), (d), (t-imap), and (t-syl): 160 of 160 cells equal (`_before/summary.txt` against `summary.txt`).
- The float model's md5 equals the one row 82's retrain report records (`2ff2af3e…`).

## What was done, in order

1. `float-in-chrome.mjs`: three cases (directory, SIMD file, plain LSTM file) on three rows.
2. `read-dfloat-chrome.mjs`: one worker on the SIMD core, every row of `rows2/<L>.jsonl`, `recognize(..., { blocks: true })`, word boxes moved into page pixels as `ocr-rows.mjs` does, written to `ocr2/<L>-dfloat.json` and `.time.json`. 589 rows in 134 s.
3. `common2.py` of the harness copy: `'dfloat'` added to `READERS` and `READERS43`; `REPO` and `WORK` pointed at this workspace's clone (`Shane` at `01b638a`) and at the unpacked `crops2/` and `wordlists/` (`desk-crops2-wordlists.tgz`, made on the Mac from `~/Downloads/_desk-n135/`). `norm.ts`'s import made absolute. No rule changed. The patched files are in this folder as `common2.py` and `norm.ts`; the Mac's originals are untouched.
4. `RULE=R2 python3 score42.py`, the same with `SPLIT=1`, `score43.py`, `score44.py`, `summary.py`. Outputs in this folder.

## What I could not establish

NOT ESTABLISHED beats a complete invented answer.

- Chrome 155 on Dann's Mac, and Safari on his iPhone (where tesseract.js would pick the SIMD core on its own; whether the float model then loads there is not tested).
- Whether Ilya's Vite build can serve the named core and the 7.8 MB model from its own origin without a new rule; that is stage 2b's first step.
- Why the fine-tuned forms pass fewer threshold pages than (a).
- The float form on the R1 rows, and on U2, U3, B05 (no reading at the current stamp).
- Gzip size of the float model.
