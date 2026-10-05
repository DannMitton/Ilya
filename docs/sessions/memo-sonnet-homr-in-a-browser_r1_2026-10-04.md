# Memo: does homr's reading run in a browser, and how long is the wait

> **Provenance, added by the desk (Fable), 2026-10-04 22:25.** Dann, 21:47, on the desk's recommendation that homr make the first reading and Ilya's own reader check it: *"Sure, we can go with your recommendation."* Brief: `brief-sonnet-homr-in-a-browser_r1_2026-10-04.md`. A Sonnet subagent, 21:49 to 22:20. Cost: 279,677 tokens, 80 tool uses, 31 minutes (the desk had named 350,000 and 40). Saved as returned. **Its claims are its own;** the desk read the summary and the first results table, read `run.sh` and `server.py` in full, and re-ran none of the measurements. The desk changed two things in the pack before sending it to Dann: `run.sh` opens the page in Google Chrome when Chrome is installed, and the folder carries one page to try (`tchaikovsky-page-1.png`). The pack as sent: `~/Downloads/homr-browser-trial.tar.gz`, md5 `3b299556e5c9eec031ffa9471f7ac59a`. It holds homr-web's code (AGPL-3.0) with its licence and notice, and it is not in the repository.


From the Sonnet helper to the desk, 2026-10-04, about 22:20. Part 15 of `parts-a-scan-to-a-seated-song_r1_2026-10-04.md`.

## Summary

1. It runs. homr-web 0.2.0 (a port of homr 0.7.0, model 396) read all three Tchaikovsky pages in headless Chromium 141 on this machine. Backend: `wasm-threads`, one thread applied (2 cores). WebGPU was not available here, so no WebGPU number exists.
2. Wait and download on this machine, page 1, notes only (OCR off): 108.9 s the first time and 101.6 s with the models stored; pages 2 and 3: 149.9 s and 156.9 s (another run used the second core). OCR adds about 36 s. The notes need no OCR.
3. Download on WebAssembly: 157.5 MB of models for the notes, 189.2 MB with OCR. Peak browser memory on a cold page: 1.5 GB (proportional set size, all browser processes).
4. Score: 93.10 of 100, the same as Python 0.7.0's 93.1. The MusicXML of all three pages equals Python 0.7.0's file once attribute order is ignored (page 1 with OCR on, title "Moderato" included).
5. Model 465 loads and runs in the port after a small patch (vocabulary, two new position tokens, two model records). Score: 91.95, below 396's 93.10 and far below homr main's 98.3. Page 1 is identical to homr main's read; the differences start on page 2. homr main also changed 15 other source files and added 3, which the port does not have. How the 98.3 divides between model and pipeline is NOT ESTABLISHED.
6. Packed: `homr-browser-trial.tar.gz` (14.6 MB; 17 MB unpacked, no models). `run.sh` downloaded and checked all ten model files here, started a server on a free port, and the page then read tch-1 end to end from that server (107.7 s, same MusicXML to the byte).
7. The owner's one line (assumes the file is in Downloads): `cd ~/Downloads && tar xzf homr-browser-trial.tar.gz && bash homr-browser-trial/run.sh`
8. Untested: macOS, bash 3.2, the Mac's Python 3, `open`, Safari, Chrome on the Mac, WebGPU (any timing), and Control-C itself (I tested the same handler with a termination signal).

## What I built

- A test page and a server, both in `src/`, packed by `pack.mjs` into `homr-browser-trial/`.
- The page uses the port as its README describes: `createRecognizer({ baseUrl: "/models/", prefer, wasmPaths })`, then `recognizePage(blob, { ocr })`. It shows the backend and why, thread count, cross-origin isolation, start-up time, and one table row per run: seconds per step, total seconds, MB the server sent, notes read, and a link that saves the MusicXML. A button runs four reads in a row: OCR off, OCR on, OCR off, OCR on.
- `server.py` (Python standard library only) sends the two cross-origin isolation headers, Content-Length, and no-store on every answer, serves `models/<sha256>/<file>` as the port expects, and counts the model bytes it sends at `/__stats`. The page reads that counter for the "MB sent" column.
- The port's library is used unchanged for model 396 (its `dist/` from `tsc`, with bare import names rewritten to local paths, as the port's own bench does). Model 465 is a second copy of the library in `site/lib465/`; the page's link switches between them.
- To stay under 20 MB, the OpenCV file and the two onnxruntime `.wasm` files travel gzip-compressed; `run.sh` unpacks them. This is the one step I added to the brief's plan for `run.sh`.

## Environment

Linux 6.18, 2 CPU cores, 8 GB memory. Playwright's Chromium 141 (`/opt/pw-browsers/chromium-1194`), headless, no proxy. `navigator.gpu` exists but granted no adapter, so the port chose `wasm-threads` and applied 1 thread. The page was cross-origin isolated. The page reads each image as a file (3,599 by 4,910 pixels, 400 dpi).

## Results, model 396

Seconds per step come from the reader's progress messages (rule at the end of this section). "MB sent" is bytes the server wrote for model files.

| Run | Image | OCR | Models | Total s | MB sent | models | segment | detect | dewarp | staff | ocr |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | tch-1 | off | first | 108.9 | 157.5 | 6.4 | 48.1 | 1.5 | 0.7 | 52.2 | - |
| 2 | tch-1 | on | OCR models first | 139.2 | 31.7 | 5.1 | 45.8 | 1.3 | 0.3 | 50.7 | 36.1 |
| 3 | tch-1 | off | stored | 101.6 | 0 | 3.8 | 45.8 | 1.1 | 0.3 | 50.6 | - |
| 4 | tch-1 | on | stored | 138.4 | 0 | 3.8 | 45.5 | 1.0 | 0.3 | 52.2 | 35.6 |
| 5 | tch-2 | off | stored | 149.9 | 0 | 4.0 | 50.1 | 1.6 | 0.5 | 93.5 | - |
| 6 | tch-3 | off | stored | 156.9 | 0 | 4.4 | 53.3 | 1.5 | 0.5 | 97.0 | - |

- Runs 1 to 4 ran one after another in one browser session. Runs 5 and 6 ran while the 465 session (below) used the other core, so their seconds are not clean.
- A second, clean run of run 1 from the packed folder's own server (`e2e`): 107.7 s, 157,472,034 bytes sent, peak 1,505 MB proportional set size and 1,961 MB resident (sum over all browser processes, sampled every 0.4 s). The earlier solo run `t0` gave 108.8 s, 1,441 MB and 1,901 MB.
- Do not use the memory figures in `out/w396/w396.summary.json` and `out/w465/w465.summary.json` (3.2 GB each): two browsers ran at once.
- Bytes sent match the file sizes: 57,311,361 + 52,861,122 + 47,299,551 = 157,472,034 for the notes; 9,929,594 + 585,532 + 21,234,383 = 31,749,509 for OCR; 189,221,543 in all.
- Notes the page counted in the MusicXML (both parts, chord notes included, so not the scorer's count): tch-1 193 notes and 48 rests, tch-2 271 and 54, tch-3 283 and 61.
- Start-up (worker, OpenCV, backend choice, no model): 1.7 s.
- Rule for the seconds columns: the time between two progress messages goes to the stage of the later message, except that a message with done = 0 marks the start of a stage, so the time before it goes to the stage before. The time between the last `models` message and the first `segment` message is therefore counted under `segment`. "prepare" is 0.0 in every run because the first message arrived at once. I did not establish what the 3.8 to 4.4 s under "models" is on runs where nothing was downloaded.
- The port's README says 7 to 9 s a page with WebGPU on an Apple M-series laptop and about 55 s on one WebAssembly thread under Node. I measured neither; my WebAssembly figure here is about 100 s a page for the notes. I do not know why it is higher than the README's.

## Score, model 396

Command: `conv.py` on the three MusicXML files, then `score.ts` (with `scan-scorer.ts`, all unchanged, from `part22/in/tools` and `ilya/tools/e16-harness`).

| Reading | Headline | Notes matched of 174 | Pitch right | Extra | Bars read of 99 |
|---|---|---|---|---|---|
| Python homr 0.7.0 (re-scored here) | 93.10 | 173 | 162 | 3 | 98 |
| Port, model 396 | 93.10 | 173 | 162 | 3 | 98 |
| Python homr main (re-scored here) | 98.28 | 174 | 171 | 0 | 99 |
| Port, model 465 | 91.95 | 173 | 160 | 4 | 99 |

- Port 396 against Python 0.7.0: the three pages are equal as canonical XML (`c14n.py`, Python's `ElementTree.canonicalize`). The raw bytes differ by attribute order (for example `<slur type= number=>` against `<slur number= type=>`), 216 lines on page 1.
- With OCR off the title is blank. Page 1 with OCR on has the same title as Python ("Moderato"). Pages 2 and 3 were read with OCR off and still equal Python's file, so Python's title on those pages is blank too (I did not read it separately).
- Runs 1 and 3 gave the same bytes; runs 2 and 4 gave the same bytes.

## Model 465 in the port

What differs between 396 and 465 (read with onnxruntime in Python, `inspect_onnx.py`, `cmp_decoder.py`):

- Encoder: same input `[1,1,256,1280]` float and output `[1,1280,512]`; same byte count (52,861,122), different hash.
- Decoder: 39 inputs, identical names, types, and shapes. 39 outputs, identical except three last dimensions: `out_rhythms` 259 to 260, `out_positions` 3 to 5, `out_articulations` 54 to 62. File 47,309,835 bytes against 47,299,551.
- Source (`transformer/vocabulary.py`, 0.7.0 install against main): `clef_TAB5` added after `clef_G2`; positions become `[nonote, upper, upper2, lower, lower2]`; the articulation list changed; `is_lower_position` and `is_upper_or_has_no_position` replace comparisons with `"lower"` and `"upper"`; `to_upper_position` uses `replace("lower", "upper")`. `transformer/configs.py` differs in the model name and two training constants only. The four tokenizer JSON files are byte-identical between the two installs. homr's `Changelog.md` stops at 0.7.0 (I read its first 60 lines), so it records none of this.

What I changed (code only, `homr-web-465-code.patch`; the copy is `/home/claude/jymen/homr-web-465`, the clone is untouched):

1. `test/golden/vocabulary.json` rewritten from homr main's `Vocabulary()`, then `tools/gen-vocabulary.mjs` regenerated the token tables in `src/transformer/vocabulary.ts` (rhythm 260, articulation 62, position 5; pitch 72, lift 7, slur 5 unchanged).
2. Added `isLowerPosition` (`startsWith("lower")`) and used it in seven places: `symbol.ts` (`toUpperPosition`, now `replace("lower","upper")`), `remove-duplicated-symbols.ts` (two), `parse-staffs.ts` (single-staff filter), `musicxml/generate.ts` (three). In `generate.ts`, `upper2` goes with `upper` and `lower2` with `lower`; homr main keeps each position as its own voice.
3. `src/models/manifest.ts`: the records `decoder-396-fp32` and `encoder-396-fp32` now point to the 465 files (bytes, sha256, url path, the three decoder output sizes). The ids still say 396. The WebGPU encoder now uses that fp32 record instead of `encoder-396-fp16`. Nothing else in the manifest changed.

Result: loads, runs, and scores 91.95. First difference from homr main's Python read: the first page's 52 events are identical; page 2 is read as 100 events where main reads 90, and the first differing event is event 34 of page 2 (song bar 39: main has MIDI 68, an eighth; the port has 67). Page 3 has 80 events in both, with differences.

What stands in the way of 98.3: the 0.7.0 install and the main install differ in 15 other source files (`autocrop.py`, `bounding_boxes.py`, `brace_dot_detection.py`, `constants.py`, `main.py`, `model.py`, `music_xml_generator.py`, `onnx_providers.py`, `segmentation/inference_segnet.py`, `staff_detection.py`, `staff_dewarping.py`, `staff_parsing.py`, `staff_parsing_tromr.py`, `staff_position_save_load.py`, `title_detection.py`) and main adds `pdf_utils.py`, `point_mapping.py`, and `relieur.py`. The port is the 0.7.0 pipeline. I read `staff_parsing.py`: main groups staffs by a repeating layout (`_find_periodic_core`), which 0.7.0 does not. I did not run any of these changes in the port, so which of them, or the model, produces the 98.3 is NOT ESTABLISHED. A homr release newer than 0.7.0 carrying the 465 model would need a new port, not a patch.

Not tried: an fp16 465 encoder for WebGPU. A HEAD request to homr's release for `encoder_pytorch_model_465-…_fp16.zip` answered 200, but I did not download or run it.

465 timings (not clean, the 396 pages 2 and 3 ran at the same time): tch-1 138.0 s (157,482,318 bytes sent), tch-2 148.3 s, tch-3 123.6 s.

## The packed folder

`homr-browser-trial/` (17 MB, no model files; largest files are the gzip-compressed engines) holds `run.sh`, `server.py`, `README.txt` (14 lines), `SOURCES.txt`, `site/`, the licences, and the source of the library as served (`homr-web-source/`, and `homr-web-source-465-patched/`). The library is AGPL-3.0, so anyone served this folder must be offered that source; it is for a trial on the owner's computer only.

`run.sh [396|465|both]`, default 396 (244.4 MB: segnet fp32 and fp16, encoder fp32 and fp16, decoder, three OCR files; `465` fetches the shared and 465 files, `both` fetches 344.5 MB):

1. Unpacks the compressed engines with `gzip`.
2. Downloads each missing model with `curl` from its public source (homr's `onnx_checkpoints` release as zip, unzipped with Python's `zipfile`; the three OCR files from ModelScope, RapidOCR v3.9.2), three tries each, checks the SHA-256 (`shasum`, else `sha256sum`, else Python), and stores it at `models/<sha256>/<file>`. Prints a line per file and curl's progress bar.
3. Starts `server.py` on a free port, prints the address, calls `open` (or `xdg-open`), and waits. Control-C stops the server and removes `server.url`.

Tests here (Linux, Python 3.13):

- First run, `465` set (seven files): six came down in about 30 s through the proxy; the seventh, the small OCR classifier, failed with "connection reset" (curl error 35). The script reported it and stopped with "Run this script again". I added the three-try loop.
- Second run, `465` set: all seven files downloaded and checked, server on port 42903, page started, `/models/…` answered with the right Content-Length and the isolation headers.
- Final script, `both`: ten files, 329 MiB on disk, server on port 36621. The page, run headless against that server with model 396, read tch-1 in 107.7 s with the same MusicXML bytes as run 1 above.
- The handler for Control-C was tested with `SIGTERM` because a background job ignores `SIGINT`; it printed "Stopped." and the server ended.

Untested on macOS: `open`, `shasum`, `curl` version, bash 3.2 (I used no arrays that bash 3.2 lacks and no bash 4 features, but did not run it there), the Mac's Python 3 (the server was written without newer syntax and run only on 3.13), Safari and Chrome behaviour with module workers and cross-origin isolation, the WebGPU backend, and a real Control-C at a keyboard.

## NOT ESTABLISHED

- Any WebGPU timing, and any timing on a Mac. The port's README figure (7 to 9 s a page, M-series) is the author's, not mine.
- Whether `upper2` or `lower2` tokens occur on these pages (the patch merges them with `upper` and `lower`).
- How much of homr main's 98.3 comes from the model and how much from the pipeline.
- Memory for several pages in one session (only the cold page-1 figure is clean).
- Clean timings for model 465 and for pages 2 and 3 of model 396.
- What the 3.8 to 4.4 s under "models" is when nothing is downloaded, and why the `staff` step is about 94 to 97 s on pages 2 and 3 against about 51 s on page 1.

## How to repeat

Files are in `/tmp/claude-0/-home-claude/cde67b8f-675a-5d24-aafe-021536ff667e/scratchpad/part15/`; copies of the scripts and results are in `/mnt/user-data/outputs/measure-homr-in-a-browser_r1_2026-10-04/`.

1. Port: `GIT_LFS_SKIP_SMUDGE=1 git clone --depth 1 https://github.com/jymen/homr-web`, then `npm ci` and `npm run build`.
2. Pack: `node pack.mjs <homr-web dir> <out dir> [<patched homr-web dir>]`.
3. Serve from here with the venv model files linked into `testmodels/<sha256>/`: `HOMR_TRIAL_MODELS=<testmodels> python3 server.py 8123`.
4. Measure: `node measure.mjs --url http://localhost:8123/ --images tch-1.png,tch-2.png,tch-3.png --plan false,true,false,true --plan2 false --prefer wasm-threads --models 396 --tag w396 --out out/w396` (add `--models 465` and port 8124 for the patched build).
5. Score: `python3 conv.py out.read.json p1.musicxml p2.musicxml p3.musicxml`, then `tsx score.ts truth.json out.read.json`.
6. Compare with Python: `python3 c14n.py <python file> <browser file>`.
7. Owner's pack: `bash run.sh` inside `homr-browser-trial/`.
