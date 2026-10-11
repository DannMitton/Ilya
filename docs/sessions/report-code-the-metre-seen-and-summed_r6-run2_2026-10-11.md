# Report: the printed metre, round 6, run 2: the reader in TypeScript (QUEUE row 57)

Code (Opus), 2026-10-11, 05:35 to 06:15, on the Mac, branch `Shane`, HEAD `9ad4082`. The working tree held the desk's uncommitted `docs/` changes (`CONTRACT.md`, `OPEN.md`, `QUEUE.md`, `STATE.md`, and one older brief, some edited by the desk during the run); I touched only row 57 of `QUEUE.md`. Brief: `brief-code-the-metre-seen-and-summed_r6-runs1-2_2026-10-11.md`, run 2. Run 1's step 0 found 0 same-length false, so run 2 ran (`report-code-the-metre-seen-and-summed_r6-run1_2026-10-11.md`). No git command that writes was run. Nothing whose name begins `heldout2` was opened. No song outside the 17 was read. **Nothing reads from the port yet:** `join-pages.ts` and `triplets.ts` are untouched, and nothing in the app imports the three new modules.

## The answer first: the port agrees with the Python reader

- **On the Python reader's own inputs: 814 of 814 windows agree.** Each window was given the same band and staff lines. The probabilities differ by at most 0.0005, which is float16 rounding.
- **On the app's own path: 811 of the Python reader's 814 windows are found, and all 811 agree.** Here the windows come from homr's staff boxes on homr's page images, with no deskew, and the staff lines and bar lines are found in the ink.
  - The 3 not found are ordinary bar starts.
  - The app path makes 45 windows the Python reader has none for (bar lines it accepts and round 4's finder did not), and none of them states anything.
- **The printed places:** both paths state 29 of the 30 readable places right and nothing false. Kabalevsky no. 7, bar 1, is missed by both. Both courtesies are stated and marked as courtesy places, so they are set aside.
- **Bytes fetched when a signature window is first read:** the network, 689,387; the shape reference, 185,280; onnxruntime's main-thread module, 413,523. That is **1,288,190**, and no new WebAssembly. The three modules come to 15,488 bytes minified (6,773 gzipped).
- **The reader's own time** on WebAssembly in the page's thread: 8.6 to 33.8 seconds a song, 341 seconds for the 16 songs.
- **Gates:** all eight pass. Gate 4 moves **2088 → 2105** (+17 new tests). The other seven are at baseline.
- **Hash** over `git diff HEAD -- apps pnpm-lock.yaml` and the untracked files under `apps/`: `a85c26ae1efc9040464ab8e4d8a3f236f413f4f8861b5d141b18df219611a10c`.

## 1. Parity

### Part 1: the port, on the Python reader's inputs

`parity.mjs`, headless Chrome on the dev server, onnxruntime-web on WebAssembly.

- **The inputs:** for each of the 814 windows of the 16 songs, the Python reader's own band (its 300 dpi deskewed page, shrunk to 10 pixels a space), its staff-line samples, and its window. They were exported by `export_bands.py`.
- **The TypeScript reader:** `readWindow`, then `decide`, with run 1's settings and the 80-a-class reference.
- **The result:** 814 of 814 statements agree. 31 windows state a signature (29 right, 2 at courtesy places) and 783 state nothing, as in Python.
- **The probabilities:** over every window, the plain reading's probabilities differ from Python's by at most 0.00049. The median of the per-window greatest difference is 0.000001.
- **The time:** 0.45 ms a crop. 5.4 minutes for the 814 windows.

### Part 2: the app's own path

`parity2.mjs`, then `match2.py`.

- **The inputs:** for each page homr answered on, the page image homr read (kept by run 1's "before" read), homr's staff boxes and MusicXML for that page, and `readPageMetres`.
- **The path:** voice staves from homr's first part, the staff found in each box, bar lines found along it, windows, and the network.
- **The matching:** each Python window's left edge and top line are mapped onto homr's image (undoing the deskew and the 300 to 400 dpi scale). A system start matches the app's start window on the same staff. A bar start matches the app's bar window within 1.5 spaces across.

| | Count |
|---|---|
| Python windows found by the app's path | 811 of 814 (all 198 system starts; 613 of 616 bar starts) |
| Of those, the same statement | **811** |
| App windows with no Python window | 45, none stating anything |
| Voice boxes whose staff was not found | 1 (Gurilyov's cover; see "Could not establish") |
| Staves set aside as much smaller than the page's others | 1 (*Sunless* 5, the footnote's excerpt) |

What the first runs of part 2 found, and what I changed for it (each a DESK DEFAULT, because the page homr reads is not deskewed):

1. **Kabalevsky no. 10, page 1, tilts about 2 degrees.** Round 4's strips, 14 spaces wide, smear a tilted line across rows, so no staff was found on that page. Strips are now 2 spaces wide (`metre-windows.ts:192`).
2. **In strips that narrow, a word can pass for staff lines.** The tempo text ("semplice") made five-line candidates two spaces above the staff. The staff in each homr box is now the Theil–Sen line through every candidate's middle line, and only candidates within half a space of it are kept (`metre-windows.ts:199`). homr's box holds one staff, so most candidates fall on it.
3. **The staff's ends** are found with its lines carried along their slope beyond the first and last sample, not held flat (`linesBeyond`, `metre-windows.ts:138`).
4. **A tilted bar line** has no column 97 percent ink. The stroke test now follows the tilt and accepts ink within a pixel of the predicted column (`strokes`, `metre-windows.ts:268` to `:336`). On a level page a stroke is still its column.
5. **A footnote's engraved excerpt** (*Sunless* 5, page 1, with its own C) is in homr's first part. A voice staff under 0.8 of the page's median space is now left out, as round 4's `clean_staves` left it out (`metre-model.ts:146`).

Before these changes, part 2 found 722 of 814 windows, and 719 of those agreed. None of the 3 that disagreed stated anything false. After the changes: 811 of 814 found, 811 agree. **No false statement appeared at any stage.**

## 2. Each change, with its place

| Path | What |
|---|---|
| `apps/web/src/lib/omr/metre-reader.ts` (new, 523 lines) | The reader, ported from `decode5.py`, `reading5.py`, and `checks5.py`. `cut` matches PyTorch's `grid_sample` (`:94`). `readWindow` takes the nine readings, rounding probabilities and features to float16 as Python stores them (`:129`, `toHalf` `:75`). Then `peaks` (`:193`), `candidates` (`:249`), `state` (`:288`), unfamiliar shape `nnDist` (`:314`), uncovered ink (`:357`), C against cut C `cutRatio` (`:416`), the same-length guard `rivals` and `margin` (`:446`, `:468`), and `decide`, the statement rule, which gives the reason for each abstention (`:492`) |
| `apps/web/src/lib/omr/metre-windows.ts` (new, 465 lines) | Windows on homr's page image, ported from round 4's `staff.py` and `windows.py`, with the five changes of section 1: the staff in a homr box (`staffIn`, `:199`); its lines along their slope (`:128`, `:138`); bar lines (`strokes`, `isBar`, `barLines`, `:281` to `:356`); windows and courtesy places (`:357`, `:376`); the band, shrunk as `cv2.resize(INTER_AREA)` shrinks (`:384` to `:456`); a window's places and seats (`:457`) |
| `apps/web/src/lib/omr/metre-model.ts` (new, 159 lines) | Run 1's settings (`:31`). The network and reference fetched and opened on first use, onnxruntime-web imported then, on WebAssembly (`loadMetreNet`, `:63`). The voice's boxes from homr's first part (`voiceBoxes`, `:93`). A page's windows read (`readPageMetres`, `:125`) |
| `apps/web/src/lib/omr/metre-reader.test.ts` (new) | 12 tests: float16 rounding, the crop, candidates, the statement, the guard, the checks |
| `apps/web/src/lib/omr/metre-windows.test.ts` (new) | 5 tests on a drawn page: the staff in a box, a bar line kept and a stem left out, the band, the voice boxes, float16 bytes |
| `apps/web/omr-metre/metre-a-r6.onnx`, `metre-a-r6-ref.f16`, `metre-a-r6-ref.cls` (new) | The network and its reference: run 1's `A.pt` exported with two outputs, and 80 crops a class |
| `apps/web/scripts/copy-metre-model.mjs` (new) | Copies them to `static/omr/models/metre/` at `dev` and `build`; fails loudly |
| `apps/web/package.json:9`, `:10`, `:25` | `copy-metre-model.mjs` in `dev` and `build`; `onnxruntime-web` `1.30.0` as the app's own dependency |
| `apps/web/scripts/copy-ort-wasm.mjs:28` | Comment only: the app now pins the same onnxruntime-web, so these files serve both |
| `pnpm-lock.yaml` | +21 lines: the importer's new dependency, resolved offline to the version already installed |

**Where the model is served, and why (DESK DEFAULT, `OPEN.md`'s placement taken):**

- The files are served at `/omr/models/metre/`, beside homr's models.
- `/omr/` is git-ignored and generated, and the service worker never intercepts it (`static/sw.js:57` to `:60`). So the browser's own HTTP cache keeps these bytes, as it keeps homr's.
- The network is this project's own, so its files are committed in `apps/web/omr-metre/` and copied there, as `copy-ort-wasm.mjs` copies onnxruntime's.
- onnxruntime-web takes a model from any bytes, so the place is not its requirement. It is the app's own origin, not `PUBLIC_OMR_MODELS_BASE`, because the files are copied there.

**Where it runs (DESK DEFAULT):** WebAssembly, in the page's own thread. The network is small, and WebGPU is homr's while a scan is read. 341 seconds of reader time over 16 songs is long enough to block the page, so run 3 should consider onnxruntime's proxy worker (`env.wasm.proxy`) or WebGPU.

## 3. Bytes

| What | Bytes | When |
|---|---|---|
| `metre-a-r6.onnx` | 689,387 | fetched on the first window read |
| `metre-a-r6-ref.f16` and `.cls` | 185,280 | the same |
| `onnxruntime-web`'s main entry (`ort.bundle.min.mjs`), a lazy chunk | 413,523 | imported on the first window read |
| `ort-wasm-simd-threaded.jsep.wasm` | 0 new | the file homr's Worker already fetches from `/omr/ort/` (28,312,028 bytes, cached) |
| The three modules | 15,488 minified, 6,773 gzipped (esbuild, onnxruntime external) | not in the app's bundle until run 3 imports them |
| **Total new on a first read** | **1,288,190** | |

The repository gains 874,667 bytes of model files in `apps/web/omr-metre/`.

## 4. Tests and gates

All eight gates were run from a scratch copy of `~/Downloads/ilya-ship.sh` that cannot stage (the real script refuses on untracked files): `measure-metre-r57-r6_2026-10-11/run2/gates-scratch.sh`.

| Gate | Baseline | Now |
|---|---|---|
| 1 phonology | 251 passed | 251 passed |
| 2 dictionary | 235 passed | 235 passed |
| 3 web check | 0 errors, 12 warnings in 5 files | the same |
| 4 web tests | 2088 passed | **2105 passed** (+12 `metre-reader.test.ts`, +5 `metre-windows.test.ts`) |
| 5 score-parser | 650 passed, 5 skipped | the same |
| 6 blurb | 145 passed | the same |
| 7 integration | 55 passed | the same |
| 8 ratchets | OK | OK (new files under 1,000 lines) |

Gate 4's baseline is the desk's to move.

## 5. The hash

`a85c26ae1efc9040464ab8e4d8a3f236f413f4f8861b5d141b18df219611a10c`: SHA-256 of `git diff HEAD -- apps pnpm-lock.yaml`, followed by each untracked file under `apps/` (sorted) with its SHA-256. The input is kept as `run2/hash-input.txt`.

- **DESK DEFAULT:** the hash covers `apps/` and the lockfile, not the desk's `docs/` edits, which moved during the run.
- Read-only git only (`diff`, `ls-files`).

## 6. Servers

- **Before:** nothing on 5173 or 4173.
- **During:** one `ilya-web` dev server, started in run 1 on 5173, used for every read.
- **After:** I stopped it at the end of run 2.

## Could not establish

NOT ESTABLISHED beats a complete invented answer.

- **The reader's time in the app as wired.** The 341 seconds were measured in headless Chrome on this Mac, with no scan being read at the same time. Run 3 measures it in the drop box.
- **Whether the app's 45 extra bar windows matter elsewhere.** None states anything on these 16 songs. On unseen songs they are more places to be wrong, under the same checks and witness 5.
- **Gurilyov's cover page.** One voice box on its cover had no staff found. The app's `withoutCovers` drops that page before the join, and this parity read every page homr answered, so it changes nothing here.
- **The tilt changes on pages tilted more than about 2 degrees.** Kabalevsky no. 10's page 1 is the steepest of the 16 songs. Strips 2 spaces wide drift 2 pixels at 2 degrees.
- **Kabalevsky no. 7, bar 1.** Missed by both paths. Why was not traced.
- **Witness 5 and the join** are run 3's. Nothing here sums a bar.

## Files

| Path | What |
|---|---|
| `docs/sessions/report-code-the-metre-seen-and-summed_r6-run2_2026-10-11.md` | this report |
| `apps/web/src/lib/omr/metre-reader.ts`, `metre-windows.ts`, `metre-model.ts`, two test files, `apps/web/omr-metre/` (3 files), `apps/web/scripts/copy-metre-model.mjs` (all new, untracked) | the port |
| `apps/web/package.json`, `apps/web/scripts/copy-ort-wasm.mjs`, `pnpm-lock.yaml` (modified) | the dependency and the copy step |
| `docs/sessions/measure-metre-r57-r6_2026-10-11/` (untracked) | `export_bands.py`, `match2.py`, round 5's reader sources the port cites; `run2/`: both parity scripts, their logs and results, the gates script, the hash input |
| `~/Downloads/_code-metre-r6/parity/` (outside the tree) | the exported bands and both parity outputs in full |
| `docs/memory/QUEUE.md`, row 57 only | status |
