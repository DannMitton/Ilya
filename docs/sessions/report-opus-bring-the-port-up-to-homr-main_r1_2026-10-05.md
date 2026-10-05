# Report: the browser port brought up to homr's newest build

> **Provenance, added by the desk (Fable), 2026-10-05 02:05.** Dann, 00:54: *"Please check to see if homr's new version is available in a format we can assimilate?"* The desk found it was not (homr's last release is 0.7.0; the port `homr-web` 0.2.0 ports 0.7.0; the newer model's files are published; the newer reading code, 22 files, is in neither) and commissioned the port. Brief: `brief-opus-bring-the-port-up-to-homr-main_r1_2026-10-05.md`. An Opus subagent, 00:57 to 01:57. Cost: 433,085 tokens, 199 tool uses, 61 minutes (the desk had named 900,000 and 85). **The desk saved the builder's final message here, as returned; its claims are its own.** The desk checked two of them itself at 02:00: it ran the builder's working copy with model `465` on `sun-01.png` under Node (83 seconds) and the builder's `cmp.py` printed `EQUAL` against desktop main's `sun-01.musicxml`; and it scored *Sunless* 1 from the port's two pages with the unchanged scorer: 97.92, 94 of 96 notes, as the report says. One error of the desk's own on the way: it overwrote the builder's `hwm/out3/sun-01.musicxml` in the cloud scratchpad by passing it to `conv.py` as the output name, and restored it with that same run. The builder's deliverables (`homr-web-0.2.0-ilya.1.tgz`, md5 beginning `3b5454ad`; `CHANGES-ilya.md`; `homr-web-main-src.patch`) are AGPL-3.0 code and are kept in `~/Downloads/_desk-2026-10-05/`, outside the repository, until they are wired in. **Added at the close of the thread, about 02:10:** the builder's whole working copy (`homr-web-main-worktree.tgz`), its scripts, the 20 test pages, desktop main's answer for each page, and the port's own outputs (`resume-kit.tgz`, with a `README.txt` and `models.txt`) are in that same Downloads folder, because a new thread's cloud workspace starts empty. The last section of this report names cloud paths that no longer exist; the kit replaces them. One correction to the brief's wording, found at the close: the brief says the cloud held the `465` files "fp32 and fp16"; it held the fp32 encoder and the decoder only. The fp16 `465` encoder was never downloaded, so its SHA-256 is NOT ESTABLISHED.

## Summary

1. With model 465 the port's MusicXML matches desktop homr main on **17 of the 20 pages run**. The check ignores attribute order, comments, and the work title. Matching pages: Tchaikovsky 1 and 3, and *Sunless* 01 to 04, 06 to 15, and 17. Tchaikovsky page 2 differs in one sharp.
2. Scores, port against main: Tchaikovsky 98.85 against 98.28 (172 against 171 of 174 notes; the port is one note better here by chance, from the tch-2 difference). *Sunless* songs 1, 4, 5, and 6 are equal: 97.92, 100.0, 96.12, and 96.89.
3. Model 396 still gives what 0.2.0 gives. The three fixture pages equal homr 0.7.0's `page.musicxml`, title included. The three Tchaikovsky pages are byte-identical to the 0.2.0 reference copy's output.
4. vitest gives the same result before and after: 46 files passed and 3 skipped; 915 tests passed and 42 skipped. The 42 model tests skip in both runs because the file `decoder-396-web-fp16` is not on the machine.
5. Why the 3 pages differ. **tch-2 and sun-16:** the port's staff canvas differs from main's by up to 3 and up to 8 grey levels; given the port's canvas, main's own transformer also changes its reading; homr-web 0.2.0 already documents that its canvases are not bit-identical to homr's. **sun-05:** the canvas is ruled out for the one staff checked; the cause is NOT ESTABLISHED.
6. Not ported, because they do not change notes: title detection, PDF input, page joining, command-line options, GPU provider selection, and reading a staff-positions file. Note positions (`imgpos`) are ported: every page has the same number of comments as main, and most values agree within 1 pixel.
7. Nothing stopped the work. Code was final at about 60 minutes.

## Which of the 22 files can change the notes

Evidence is reading `git diff v0.7.0 HEAD` for each file, plus the 17 matching pages after porting the "yes" rows.

| File | Can change notes? | Evidence |
|---|---|---|
| `autocrop.py` | no | `autocrop()` now calls `autocrop_with_offset()` and returns the same image; the offset only feeds note positions |
| `bounding_boxes.py` | yes | `do_polygons_overlap` now returns true when `cv2.intersectConvexConvex` area is above 0, before the corner test |
| `brace_dot_detection.py` | yes | `_trim_symbol_to_core_span` on every candidate, plus a 5 px minimum width; decides which staffs join |
| `constants.py` | yes | the two constants the brace changes use |
| `main.py` | no | ElementTree writing, `--no-title`, PDF and merge, the CLAHE step in the `--read-staff-positions` path only, and the input-image mapping (positions only) |
| `model.py` | yes | new `_score_brace_with_staff_pair`; decides grand-staff pairs |
| `music_xml_generator.py` | yes | the start time of each group, one chord per position, rests after a backup, durations at least 1, division counted from every note, a default time signature, slurs converted to ties, element order, `imgpos` |
| `onnx_providers.py` | no | ROCm provider selection only |
| `pdf_utils.py` | no | renders PDFs (new file) |
| `point_mapping.py` | no | maps coordinates for `imgpos` only |
| `relieur.py` | no | joins multi-page MusicXML (new file) |
| `segmentation/inference_segnet.py` | no | ROCm, and the session kept in a global; CPU inference unchanged |
| `staff_detection.py` | yes | new `are_lines_crossing`, and `find_peaks` distance `0.7 * unit_size` |
| `staff_dewarping.py` | no | adds the inverse point mapping, used only for positions |
| `staff_parsing.py` | yes | `_ensure_same_number_of_staffs` now regroups staffs by a repeating layout (`_find_periodic_core`) |
| `staff_parsing_tromr.py` | yes, with 465 only | the single-staff filter also drops `lower2` |
| `staff_position_save_load.py` | no | only used with `--read-staff-positions` |
| `title_detection.py` | no | title text only |
| `transformer/configs.py` | yes | model name 396 becomes 465 |
| `transformer/decoder_inference.py` | no | device string and ROCm only |
| `transformer/encoder_inference.py` | no | GPU check only |
| `transformer/vocabulary.py` | yes | rhythm table gains `clef_TAB5` (later indices shift), 5 positions, new articulation list, `is_lower_position`, `to_upper_position`, and the multirest duration is now returned |

## What was ported, file by file (in the working copy's `src/`)

Each change is switched by `followsHomrMain()` from the new `model/homr-version.ts`. The model is set for one page by `recognizePage({ model: "465" })` or `createRecognizer({ model: "465" })`. When the model is 396, each place keeps the 0.7.0 code.

- `transformer/vocabulary.ts`: model 465's tables (rhythm 260, articulation 62, position 5) beside model 396's.
- `models/manifest.ts`: the records `decoder-465-fp32` and `encoder-465-fp32`, and `MODEL_465_CATALOG`.
- `pipeline/recognize.ts`: the `model` and `onVoices` options, and the page-to-input mapping.
- `pipeline/staff-image.ts`: the periodic-core regrouping, and `prepareStaffImageWithMapping`.
- `geometry/staff-lines.ts` (line crossing), `geometry/other-clefs.ts` (peak distance), and `cv/box-overlap.ts` (convex intersection).
- New `cv/brace-core.ts`, plus `pipeline/detect.ts`, `geometry/braces.ts`, and `model/constants.ts`: the brace trim, width filter, and scoring.
- `transformer/duration.ts` (multirest), `remove-duplicated-symbols.ts`, `symbol.ts`, and `pipeline/parse-staffs.ts`: the position tests.
- New `musicxml/generate-main.ts`, a port of the rewritten writer; `musicxml/xml.ts` gains `append` and comment nodes.
- Note positions: `segmentation/preprocess.ts` (autocrop offset), `dewarp/piecewise-affine.ts` (`inverseTransformPoint`), and `parse-staffs.ts`.
- Plumbing: `worker.ts`, `worker-protocol.ts`, `client.ts`, `index.ts`, `internal.ts`, and `version.ts`.
- Every changed file starts with a one-line Ilya notice. Version is `0.2.0-ilya.1`. `CHANGES-ilya.md` is in the package. LICENSE and NOTICE are unchanged. `tsc` passes.

## Page comparisons (first difference where a page does not match)

- **tch-2:** part P1, measure 13, the third note of system 2 of the voice. Main has G♯4; the port has G4. The only differing symbol on the page.
- **sun-05:** part P1, measure 6. Main writes accent plus a tremolo; the port writes accent only. Four staffs differ by single tokens.
- **sun-16:** part P2, measure 16, a chord note. Main has C♯5 with a slur start; the port's symbol has its lift, articulation, slur, and position heads empty.
- **Note positions:** counts are equal on every page checked. tch-1: 161 of 240 equal and 232 within 1 px, largest difference 4 px; tch-3 largest 11 px; sun-01 and sun-02 largest 3 px.

## NOT ESTABLISHED

- The cause on sun-05.
- The 42 skipped model tests.
- **The browser path:** the Worker and `createRecognizer({ model: "465" })` were type-checked, not run in a browser. WebGPU with the 465 encoder was not run, and only the fp32 465 encoder has a model record.
- Whether the "no" rows change notes on pages other than these.

## Where things are (cloud scratchpad, not on the Mac)

The working copy is `/home/claude/homr-web-main`. The comparison scripts (`run-page.mts`, `cmp.py`, `cmp-imgpos.py`, `main-voices.py`, `py-canvas.py`, `margins.py`, `port-canvas.mts`) and all outputs are in `scratchpad/hwm/`.
