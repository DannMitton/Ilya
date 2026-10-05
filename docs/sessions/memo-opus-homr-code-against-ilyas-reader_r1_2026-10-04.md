# Memo: homr's code read against Ilya's page reader

> **Provenance, added by the desk (Fable), 2026-10-04 21:15.** Dann, 20:22: *"what IM' really asking is about the code. Have we taken a critical look at homr's code, the way it is conceived, structrured, and written, and what can we learbn about that versus what we have as Ilya's re4ader's code base?"* The desk spawned an Opus subagent at about 20:26; it returned at about 20:40. Cost: 400,404 tokens, 90 tool uses, 14 minutes (the desk had named a worst case of 450,000). Saved as returned. **Its claims are its own.** The desk read the memo in full and checked five citations in the code: `tools/e16-harness/reader/README.md:7` (tripwire T3), the shipped `apps/web/static/reader/manifest.json` (it lists `oracle.py` and `fitted.py`), `homr/transformer/decoder_inference.py:110-124` (greedy argmax), `homr/circle_of_fifths.py:178-188` (naturals stripped), and `apps/web/src/lib/score/ingestion/recognized-to-musicxml.ts:15-31` (counted, never marked). All five held. One addition from that last file, which the memo does not say: counting without marking was ruled, in E.47, and plan r4 reopens it. The memo's own scripts were left in the desk's cloud scratchpad (`review/metrics.py`) and are not in the repository.


**Written by** an Opus subagent for the desk, 2026-10-04, in answer to your question: *"Have we taken a critical look at homr's code, the way it is conceived, structured, and written, and what can we learn about that versus what we have as Ilya's reader's code base?"*

**Trees read, both read-only:** homr at `560ca5c` (AGPL-3.0), Ilya at `b2106d09`, branch `Shane` (MIT). No homr code is copied here beyond single short identifiers. Nothing was written to either tree.

**Tags.** [S] sourced: read in the code this session, with `path:line`. [I] inference: reasoned, not observed. [J] judgement: my assessment. NOT ESTABLISHED is written in full.

---

## Summary

1. **Verdict.** homr's code is better engineered (typed, linted, tested in CI, small functions). Ilya's code records more truth per note. homr's lead in accuracy comes from where it puts its learning, not from cleverer geometry: it also carries a large hand-written geometry layer. [J]
2. **Lesson 1: make labelled data from renders, degraded on purpose.** homr's accuracy rests on about 190,000 rendered staves in several fonts, roughened with ink, paper, and blur effects. Ilya already owns the parts: Verovio, four music fonts, and an SVG oracle. [S]
3. **Lesson 2: separate the kinds of ink before measuring them.** homr's barline code is 28 lines because its network has already split stems and barlines from flags, beams, and heads. Every barline Ilya missed on the Tchaikovsky at the 2026-10-02 count (40 of 99) was a barline joined to neighbouring ink. [S]
4. **Lesson 3: keep a map back to the scan for every step that moves pixels.** homr does this in 55 lines. Ilya's straightening discards its displacement, and its output carries no coordinates beyond the x in each id. [S]
5. **Ilya does one thing better: it keeps seeing apart from music reasoning.** It names the printed sign, applies key and bar rules in code, and abstains with a reason. homr learns the sounding accidental end to end and discards its own scores; its three misreads tonight were all accidentals. [S, J]
6. **That advantage does not reach the singer yet.** Ilya's converter turns each abstention into a counted quarter note or natural, never a mark. [S]
7. **The desk's proposal (small classifiers on Ilya's crops) is feasible and right in spirit, but aimed at the smaller loss.** The crops exist in the code today. They answer naming questions; Ilya loses more at finding and separating ink. [S, J]
8. **My version:** window verifiers trained on renders, heads and stem ends first, accidentals third, rests only after a rest finder exists. Measure each one's ceiling by substituting truth before training anything. It needs your ruling on charter tripwire T3 ("no machine learning anywhere", `tools/e16-harness/reader/README.md:7`). [J]

---

## 1. Conception

### The central idea of each

| | homr | Ilya's reader |
|---|---|---|
| Central idea | Find and straighten each staff with geometry helped by a pixel classifier, then let one trained model read the whole staff as a sentence of symbols. [S] `homr/main.py:256-325`, `homr/staff_parsing.py:336-373` | Find the voice staff with geometry, then measure each sign on it with hand rules grounded in Gould and SMuFL, and say when a measure is not clear. [S] `reader/README.md:7`, `:84-95` |
| Unit of reading | One staff, or one braced pair as a ten-line staff, as a 256 by 1280 image. [S] `homr/transformer/configs.py:91-92`, `homr/model.py:297-311` | One notehead and its neighbourhood, on the voice staff only, on the whole straightened page. [S] `reader.py:1108-1134`, `reader.py:1401-1499` |
| What it outputs per note | A token: duration, pitch, sounding accidental, articulation, slur, staff position. A rough page point from attention. [S] `homr/transformer/decoder_inference.py:136-145`, `homr/music_xml_generator.py:758-761` | A record: id from measure and x, onset, duration, MIDI, and an `abstain` object naming each unsure fact. [S] `apps/web/src/lib/reader/recognized.ts:29-50` |
| Who reads the piano | Every staff is read. [S] `homr/staff_parsing.py:398-417` | Only the voice staff; the piano is used as evidence. [S] `reader.py:991-1048` |

### What each stage hands the next

**homr** [S]

1. Page image to `InputPredictions`: five binary masks at page size (`homr/model.py:20-37`), from one network (`homr/segmentation/inference_segnet.py:235-239`).
2. Masks to boxes: `PredictedSymbols` of ellipses and rotated boxes (`homr/main.py:53-66`, `:143-162`).
3. Boxes to `Staff`: a grid of `StaffPoint`s, each five (or ten) y values and an angle at one x (`homr/model.py:229-253`, `:274-284`).
4. Staffs to `MultiStaff`: a system's staves, grouped by braces and by the page's repeating layout (`homr/model.py:402-409`, `homr/staff_parsing.py:82-129`).
5. Each staff to a dewarped, normalized canvas plus a chain of inverse maps (`homr/staff_parsing.py:239-304`).
6. Canvas to a list of `EncodedSymbol` per voice (`homr/transformer/vocabulary.py:287-316`; `homr/staff_parsing.py:376-418`).
7. Symbols to MusicXML (`homr/main.py:234`).

**Ilya** [S]

1. PNG to straightened image, staves as five row numbers each, and staff space `s` (`reader.py:732-781`).
2. To `G`, one untyped dict of about 20 keys: image, staves, voice staves, line-free image, heads (each a dict of `x`, `y`, `sys`, `score`, `hollow`, `L`, `O`), and diagnostics (`reader.py:1491-1499`).
3. `G` to pitch records, adding accidental class, carry, and MIDI (`reader.py:2004-2029`).
4. Records to events per measure with durations and abstentions (`run_page2.py:244-561`).
5. Events to a piece-level context across pages (`envelope.py:1-66`), then to TypeScript (`recognized.ts`) and MusicXML (`recognized-to-musicxml.ts`).

### Where knowledge of notation lives

| Knowledge | homr | Ilya |
|---|---|---|
| What ink is a staff line, head, stem, clef or accidental | Learned, per pixel (one U-Net, six classes). [S] `training/segmentation/dense_dataset_definitions.py:125-139` | Code: matched filters, run lengths, connected components. [S] `reader.py:1108-1134`, `beams.py:170` |
| Staff geometry, braces, systems | Code, in multiples of unit size. [S] `homr/constants.py:27-77`, `homr/staff_detection.py:782` | Code, in multiples of staff space, many derived per page. [S] `reader.py:20`, `reader.py:596-604` |
| Durations, pitches, accidentals, rests, slurs | Learned weights plus a token vocabulary of 260 + 72 + 7 + 62 + 5 + 5 entries. [S] `homr/transformer/vocabulary.py:31-193`; sizes measured from the shipped ONNX outputs | Code and tables: stroke rules, dot bounds, accidental rules, Leipzig glyph templates. [S] `shape.py:68-87`, `reader.py:1618-1648`, `rest_templates.py:73-76` |
| Key signature and bar-scope accidentals | Learned: the model must output the sounding alteration. [S] `training/omr_datasets/music_xml_parser.py:454-464`; naturals stripped from labels, `homr/circle_of_fifths.py:178-188` via `training/omr_datasets/convert_lieder.py:585` | Code: `key_alter` and a carry keyed by letter and octave, reset each bar. [S] `reader.py:1536-1542`, `reader.py:2016-2027` |
| Bar arithmetic | Code that rewrites silently: tuplets removed from any bar shorter than the median bar. [S] `homr/transformer/vocabulary.py:594-607` | Code that flags only (ruled in July). [S] `run_page2.py:602` |

### Corrections to what was known

- **homr's first stage is one network, not oemer's two.** A ResNet-18 U-Net with six classes replaced oemer's two U-Nets (`training/architecture/segmentation/model.py:152-155`). homr's README still says "models" (`README.md:70`). [S]
- **homr does compute exact note positions, then throws them away.** `add_notes_to_staffs` places every notehead on its staff (`homr/note_detection.py:149-185`), but the result reaches only a debug image (`homr/main.py:311-323`). The transformer never sees it. [S]
- **homr also computes a score for every token, then throws it away.** Decoding is greedy argmax (`homr/transformer/decoder_inference.py:110-124`); the segmentation is argmax too (`homr/segmentation/inference_segnet.py:221`). So "no measure of doubt" is a choice in the code, not a property of the model. [S]
- **Ilya's "exact places" stop at the reader.** `RecognizedNote` carries no coordinates (`recognized.ts:29-50`); only the id holds x, on the straightened page, and the straightening keeps no inverse (`reader.py:687-728`, the `info` at `:702`). [S]

---

## 2. Structure

### Stages in order

| # | homr | Ilya |
|---|---|---|
| 1 | Autocrop, resize to 1920 px wide, CLAHE. `homr/main.py:121-124`, `homr/resize.py:7-20` | Read PNG at its own resolution (400 dpi in the app). `reader.py:1402` |
| 2 | Segnet on 320 px tiles; argmax; five masks. `homr/segmentation/inference_segnet.py:179-241` | None |
| 3 | Boxes from masks; heads paired with stems. `homr/main.py:143-162`, `homr/note_detection.py:120-146` | Staff space from run lengths; trace five-line hits in strips; quadratic fit; whole-pixel straighten. `reader.py:250`, `:606-728` |
| 4 | Barlines: stem-class blobs not touching heads or stems, size filter. `homr/main.py:281-287`, `homr/bar_line_detection.py:15-28` | Systems by the left barline; voice staff by the brace rule and a two-sign vote; tacet systems. `reader.py:991-1048` |
| 5 | Staffs from anchors (clefs, barlines) and line fragments. `homr/staff_detection.py:782-828` | Non-destructive line removal. `beams.py:170` |
| 6 | Braces merge staff pairs; systems regrouped by repeating layout. `homr/brace_dot_detection.py:183-207`, `homr/staff_parsing.py:31-129` | Filled heads (matched filter), stem test, hollow heads, company test, clef-and-key mask, staff position. `reader.py:1430-1490` |
| 7 | Per staff: crop, piecewise-affine dewarp, canvas, inverse maps. `homr/staff_parsing.py:239-304` | Accidental class per head and bar carry. `reader.py:2004-2029` |
| 8 | Transformer reads the staff. `homr/transformer/staff2score.py:52-84` | Barlines from voice and piano witnesses. `reader.py:1942` |
| 9 | Post-rules: tuplet removal, lower-staff filter, duplicate removal. `homr/transformer/vocabulary.py:633-641` | Durations: area rule, page guard, shape rule; rests by template; events with abstentions. `run_page2.py:244-561` |
| 10 | MusicXML; slurs between adjacent equal pitches become ties. `homr/music_xml_generator.py:460-533` | Piece envelope: metre and facets across pages. `envelope.py:67` |

### Where boundaries are clean and where they leak

- **homr's cleanest seam is the staff crop** [J]. Everything before it is geometry; everything after it sees one normalized image. The inverse map chain makes the seam reversible (`homr/staff_parsing.py:277-284`). [S]
- **homr leaks through dead structure.** `model.py` defines `Accidental`, `Rest`, and note fields for beams, flags, and dots (`homr/model.py:56-111`, `:135-151`); nothing outside `model.py` creates them (grep). They are oemer's design, kept after the transformer replaced it. [S, I]
- **homr's names leak across the seam.** The segmentation class the code calls `stems_rests` holds stems and barlines, and the class it calls `symbols` holds braces and brackets (`homr/segmentation/inference_segnet.py:235-239` against `training/segmentation/dense_dataset_definitions.py:125-135`). [S]
- **Ilya leaks through `G`.** Every stage reads and writes one dict, and `run_page2.run` reaches back into it for geometry (`run_page2.py:245-247`). Nothing states which stage owns which key. [S, J]
- **Ilya leaks through `cfg`.** It carries 18 distinct keys, half of them feature switches (`hollow`, `company`, `clef_key_mask`, `shape`, `shape_ink_heavy_only`, `require_stem`, `fitted_lengths`, and others), read with `.get` at the point of use (grep over the reader). [S]
- **Ilya's piece envelope is a clean seam.** It keeps the physical axis (page, system, bar) apart from the musical axis (piece, measure index), and each facet records its source (`envelope.py:20-24`, `:48-66`). homr has no equivalent: pages are read alone and merged afterwards (`homr/main.py:400-403`). [S]

### Hand-set constants

**Method.** Python's `tokenize` over each runtime tree, counting numeric literals other than 0, 1, and 2; comments and docstrings excluded. homr: the 41 files of `homr/`. Ilya: the 12 runtime modules (not `test_metre.py`, not the harness-only `oracle.py`). Named constants: module-level assignments to an UPPER_CASE name. Script: `review/metrics.py` in the session scratchpad. [S]

| | homr `homr/` | Ilya reader |
|---|---|---|
| Lines | 8,050 | 7,521 |
| Numeric literals other than 0, 1, 2 | 405 | 740 |
| Named module-level constants | 1, plus 13 unit-size functions in `homr/constants.py:27-77` | 142 |
| Learned parameters | about 39 million [I: from fp32 file sizes of the three ONNX files] | 0 |

Both literal counts overstate thresholds. homr's include drawing colours and vocabulary ranges; Ilya's include the default-off `fitted.py` trial (263 of the 740). [S]

**How they are derived.** homr's are mostly round multiples of unit size, set by hand, with a few explained by observation (`homr/constants.py:99-118`). Ilya's are mostly midpoints between measured classes on named pages, with the derivation written beside them (`reader.py:1670-1680`, `run_page2.py:29-38`), and two are derived per page (`reader.py:20`, `run_page2.py:132`). Ilya's practice is more honest; homr's is more portable, because a round multiple fitted to nothing cannot overfit a corpus. [S, J]

### How errors and uncertainty travel

| | homr | Ilya |
|---|---|---|
| Inside the reader | Discarded: argmax at both models. [S] `inference_segnet.py:221`, `decoder_inference.py:119-124` | Carried: per-fact `abstain` with a reason; onset nulled after a duration abstains. [S] `run_page2.py:446-500` |
| On structural failure | The page fails ("No staffs found", "No noteheads found"). [S] `homr/main.py:271-272`, `:297-298` | Raises loudly on a six-line staff group; sentinel raises. [S] `reader/README.md:105`, `substrate.py:385-389` |
| Silent fallbacks | Dewarp failure reads the staff unstraightened. [S] `homr/staff_dewarping.py:409-411`. Staves trimmed from page edges to fit the layout. [S] `homr/staff_parsing.py:106-118`. Tuplets removed by bar length. [S] `vocabulary.py:594-607` | Voice staff falls back to staff 0, counted. [S] `reader.py:811-816`, `:1045` |
| At the output | A rough point per note in an XML comment. [S] `music_xml_generator.py:758-761` | Counted, never marked: abstained lengths become quarters, abstained pitches become naturals. [S] `recognized-to-musicxml.ts:15-31` |
| Several pages | The first page error abandons the whole set. [S] `homr/main.py:396-398` | Each page threads context into the next. [S] `envelope.py:67` |

### How each copes

| Case | homr | Ilya |
|---|---|---|
| Tilted or bent staff | Grid of staff points per x; per-staff piecewise-affine dewarp from the middle line every 80 px; trained with ±2° rotation and perspective. [S] `homr/staff_dewarping.py:325-390`, `training/transformer/image_utils.py:274-275` | Trace in strips of 3 staff spaces, quadratic per staff, whole-pixel column shift; falls back to the old detector if the trace finds fewer staves. [S] `reader.py:596-781` |
| Braced piano beside a voice staff | Braced pair read as one ten-line staff with upper and lower tokens; voice is another part. [S] `homr/model.py:297-311`, `homr/staff_parsing_tromr.py:20-22`. In the yardstick run homr grouped the voice with the piano's upper staff as one part (`docs/sessions/report-code-the-yardstick_r1_2026-10-02.md`). | Brace rule, then text-line and chord signs must agree; tacet is an outcome. [S] `reader.py:783-817`, `:991-1048` |
| Accidentals and key | Learned sounding alteration, written as `<alter>` only. [S] `music_xml_generator.py:715-718` | Printed sign by structural rules; key from the singer; carry in code. [S] `reader.py:1618-1648`, `:2010-2027` |
| Note lengths | Learned, with dots, grace notes, tuplet durations. [S] `vocabulary.py:55-70` | Area rule with a page guard; shape rule on ink-heavy pages; abstain. [S] `run_page2.py:258-312`, `shape.py:226-240` |
| Rests | Learned, including bar rests of 2 to 10 bars. [S] `vocabulary.py:56`, `:69-70` | Quarter, eighth, sixteenth by Leipzig template; tacet bars. [S] `run_page2.py:109`, `:195` |
| Ties, slurs, tuplets | Slur branch; ties recovered from slurs; tuplet durations. [S] `vocabulary.py:182-185`, `music_xml_generator.py:460-533` | None; bar-integrity flag. [S] `reader/README.md:101`, `run_page2.py:602` |
| Several pages | Independent, merged afterwards. [S] `homr/main.py:400-403` | Envelope carries metre, key, clef, voice staff. [S] `envelope.py:48-66` |
| Unfamiliar engraving font | Trained on five MuseScore fonts for one corpus and on other corpora. [S] `convert_lieder.py:182`, `training/transformer/train.py:150-157` | Heads and accidentals by font-free rules; rests, digits, clefs, keys against Leipzig only. [S] `rest_templates.py:73-76`, `clefkey.py:53-66` |

---

## 3. Writing

| Aspect | homr | Ilya |
|---|---|---|
| Naming | Descriptive verbs (`find_staff_anchors`, `combine_noteheads_with_stems`). Some names lie: `remove_duplicated_symbols` also rewrites tuplets and staff positions (`vocabulary.py:633-641`); a variable called `mean` holds a median (`vocabulary.py:583-603`). [S] | Constants named well (`BARLINE_WIDTH_BOUND`, `STEM_MIN`). Locals terse: `nl`, `hh2`, `br`, `ohl`, `ci`, `KA` (`reader.py:1556-1565`, `:1618-1633`). [S] |
| Typing | 459 of 460 functions annotated; mypy strict. [S] `pyproject.toml:137-160` | 0 of 198 functions annotated; records are dicts. [S] |
| Function size | 6 of 460 over 80 lines; longest 148 (`main`). [S] | 9 of 198 over 80 lines; `run_page2.run` is 318 lines (`run_page2.py:244`), `envelope.run` 254 (`envelope.py:67`). [S] |
| Comments | About 10% of lines (comments plus docstrings); they explain why (`homr/staff_parsing.py:31-60`). Some are wrong: the encoder comment says the vertical axis gets more capacity, the code gives it a third (`training/architecture/transformer/encoder.py:48-51` against `homr/transformer/configs.py:110`). [S] | About 44% of lines. Every threshold carries its measurement, which is a real strength; but rulings, dates, and struck history sit in the code (`reader.py:1650-1760` is 110 lines of comment before one function). A newcomer reads a case file, not a program. [S, J] |
| Tests | 89 test functions in 17 files, run in CI with lint and mypy (`Makefile:59-62`, `.github/workflows/main.yml:37`). Strong on vocabulary, MusicXML, and scoring; staff detection has 1 test. System validation uses a private set (`Training.md:76`). [S] | The Python reader has one test script, 62 checks, all on `metre.py` (`test_metre.py`), not run by a runner. TypeScript tests guard the converter (18) and read the Python id expression as text (`reader-ids.test.ts:24-37`). Real checking is by hand-run measurement with a self-tested scorer (9 checks, `tools/e16-harness/src/scan-scorer-selftest.ts:59-154`). [S] |
| Dead code | `Accidental`, `Rest`, note beams and flags; the geometric note list; an unused MUSCIMA dataset class (`training/segmentation/train.py:162-179`). [S] | `tuplet_catch` and `measure_integrity_flag_legacy` (`run_page2.py:564`, `:583`), `detect_rests` (`reader.py:2098`), a constant "not read anywhere" (`run_page2.py:107`). `fitted.py` (1,091 lines) is not imported on the runtime path, yet it and `oracle.py` are shipped to every browser (`apps/web/static/reader/manifest.json`). [S] |
| Configuration | Dataclasses and a `Config` class; CLI flags. [S] `homr/main.py:165-180`, `configs.py:85-132` | Untyped `cfg` dict with 18 keys; hard-coded sandbox paths (`run_page2.py:25`, `rest_templates.py:73`). [S] |
| Global state | Two model singletons. [S] `inference_segnet.py:122`, `staff_parsing_tromr.py:7` | `TRACE_REPORT`, `FALLBACK_FIRINGS`, `WALK_STATS`. [S] `reader.py:323`, `:730`, `beams.py:65` |
| Dependency weight | 675 MB installed with models; about 157 MB of weights; onnxruntime. [S, measured] | numpy, OpenCV, matplotlib under Pyodide from a CDN; 20 KB of glyph data. [S] `page-reader.worker.ts:92` |
| Changing it safely | A newcomer can change a stage and know within minutes if types, lint, and tests pass. Changing what the model knows means a 2 to 4 day GPU run (`Training.md:39`). [S, J] | A newcomer cannot tell what a change breaks without running the measurement harness on the songs; the essays tell them why each number is what it is. [J] |

**Two latent defects worth naming.** homr averages class indices where segmentation tiles overlap, so a staff-line pixel (class 4) beside background (0) can become a notehead (2) (`homr/segmentation/inference_segnet.py:147-176`, `:221`). With the tile step equal to the tile size (`homr/main.py:89`) this happens only at the right and bottom edges; its effect is NOT ESTABLISHED. In Ilya, the README's module table predates `substrate.py`, `shape.py`, `fitted.py`, and `clefkey.py` (`reader/README.md:9-19`). [S]

---

## 4. homr's learned parts, exactly

### The segmentation network

- **In:** a 320 by 320 tile, greyscale copied to three channels, from the page autocropped, resized to 1920 px wide, and CLAHE-equalized. [S] `inference_segnet.py:87`, `:202-214`; `homr/main.py:121-124`
- **Out:** six classes per pixel: background; stems with barlines; noteheads (hollow ones filled in for training); clefs, key signatures, and accidentals; staff lines; braces and brackets. [S] `dense_dataset_definitions.py:125-141`, `training/segmentation/build_label.py:18-70`
- **Size:** U-Net on ResNet-18, ImageNet start, about 14 million parameters [I: 57.3 MB fp32 file]. [S] `training/architecture/segmentation/model.py:26-33`, `:152-155`
- **The question it is asked:** for every pixel, what kind of ink is this?
- **Training:** the `ds2_dense` set (DeepScores v2 by its name [I]), 3 epochs, Dice loss, 10% validation. Labels add long vertical lines between staves as brackets (`build_label.py:88-128`). Augmentation: grey gradients, scale, contrast loss, noise, perspective, CLAHE, blur, paper tone (`training/segmentation/train.py:222-280`). [S] `train.py:316-332`, `model.py:42`

### The transformer

- **In:** one staff or braced pair, cropped with margins, dewarped, edge blobs removed, scaled into a 256 by 1280 canvas, normalized. [S] `homr/staff_parsing.py:239-304`, `homr/transformer/staff2score.py:87-98`
- **Encoder:** ConvNeXt-tiny up to stride 16, giving 16 by 80 = 1,280 patches of 512 values, with separate vertical and horizontal position embeddings. About 13 million parameters [I: file size]. [S] `training/architecture/transformer/encoder.py:26-102`
- **Decoder:** 8 layers, 8 heads, width 512, cross-attention to the patches, 608 steps at most. Six output heads per step: rhythm 260, pitch 72, lift 7, articulation 62, slur 5, position 5. About 12 million parameters [I]. [S] `configs.py:93`, `:104-115`; `training/architecture/transformer/decoder.py:64-69`; head sizes measured from the ONNX outputs
- **The question it is asked:** write out this staff, left to right, as a sequence of symbols, each with its duration, pitch, sounding accidental, articulation, slur, and staff. Note positions come from where attention fell (`decoder.py:199-229`). [S]
- **Loss:** cross-entropy per head, label smoothing on rhythm only, plus a consistency term that ties the heads together. [S] `decoder.py:471-552`

### How the training data is made

| Corpus | How images and labels are made |
|---|---|
| OpenScore Lieder | MuseScore 4.6.5 renders each score to SVG and MusicXML in one of five fonts (Leland, Bravura, Petaluma, MuseJazz, Gonville), chosen by a hash of the file name. Staff crops are cut from the SVG's own staff boxes; tokens from the MusicXML. [S] `convert_lieder.py:173-224`, `:521-599`, `:728-729` |
| GrandStaff | Images cropped with an oemer-derived row profile; tokens from kern. [S] `convert_grandstaff.py:36-46`, `:80-86` |
| Camera-PrIMuS | Incipits with distorted variants; accidentals re-carried through the bar to match the other sets. [S] `convert_primus.py:30`, `:67`; `circle_of_fifths.py:129-175` |
| PDMX, MuseTrainer | Public MusicXML rendered through the Lieder pipeline. [S] `convert_pdmx.py:84-92`, `convert_musetrainer.py:29-32`, `Training.md:100` |

All five weigh equally; about 190,000 staves (`train.py:150-157`, `Training.md:38`). Filters drop staves with more than 20% tuplets, more than five ledger lines, unsupported clefs, or octave-transposing clefs (`convert_lieder.py:582`, `training/transformer/data_loader.py:104-126`, `music_xml_parser.py:486-487`). [S]

**Closing the gap to real scans.** Augraphy ink bleed, faded lines, brightness, bleed-through, dirty screen and rollers, noise, JPEG, shadow (`training/transformer/augraphy_augment.py:49-134`); paper textures and gradients (`image_utils.py:200-245`); stray text (`:68-110`); rotation and perspective (`:272-300`). The training crop comes from the renderer's geometry, not from homr's own staff finder, so the two crops differ, and augmentation is what covers it. [S, I]

**Training settings:** 35 epochs, AdamW at 1e-4, cosine schedule, bf16, backbone frozen for 2 epochs, early stop after 5, best model by accuracy. [S] `train.py:136-240`

### What `Training.md` records as helping and hurting

| Helped | Hurt or discarded |
|---|---|
| Fixing accidentals in the data, repeatedly (Runs 76, 80, 286; `Training.md:672-678`, `:643-647`, `:326-334`) | Semantic accidentals without visual adjustment: 80.9 diffs (Run 79, `:649-661`) |
| Dropping a dataset where "it seems impossible to reliably tell if a natural is in an image" (`:543`) | Agnostic encoding: 12.3 diffs against 5.6 (Run 368, `:236-243`) |
| Depth 4 to 8 (Run 100, `:526-533`); scheduled sampling (Run 331, `:272-279`) | Focal loss and extra weight on accidentals (Runs 70, 74, `:688-710`) |
| Cleaning and adding corpora (Runs 414, 426, `:113-133`) | Harder augmentation: 16.0 diffs (Run 328, `:281-288`); bigger backbones overfit (Runs 50, 333, 334) |
| Full resolution for single staves (Run 242) | A tie vocabulary, a separate slur branch, a triplet branch: all too eager or worse (Runs 396, 197) |

The pattern: **data quality moved homr more than architecture did**, and accidentals were the longest fight. homr's own advice says the same (`IDEAS_FOR_CONTRIBUTORS.md:61-70`). One discrepancy: the log says runs keep the last iteration (`Training.md:524`), the code keeps the best (`train.py:197`). [S]

---

## 5. Lessons for Ilya, ranked

Each is an idea to re-express in Ilya's own code. Gains are NOT ESTABLISHED unless a measurement is cited.

| # | Idea | Where in homr | Where it lands in Ilya | Expected gain, and evidence | Cost and risk |
|---|---|---|---|---|---|
| 1 | Labelled data from renders, degraded on purpose, with labels from the renderer | `convert_lieder.py:173-224`, `:521-599`; `augraphy_augment.py:49-134`; `image_utils.py:200-325` | Extend `oracle.py:45` from staff counts to glyph classes and boxes; reuse the Verovio glyph pipeline (`rest_templates.py`, `clefkey.py`) and the four fonts the plan names | Enables lesson 2. Also gives every hand constant a held-out test bed, which the critique asked for ("no new constant without a held-out check"). Evidence it is the lever: homr's log above | Days. Risk: render-to-scan gap; always score on real scans |
| 2 | Separate ink kinds before geometry, by classifying fixed windows rather than connected components | Segnet classes, `dense_dataset_definitions.py:125-139`; the 28-line barline stage it makes possible, `bar_line_detection.py:15-28`, `homr/main.py:281-287` | Verifiers at `reader.py:1430-1450` (heads), `shape.py:139` (stem end), `reader.py:1625-1633` (accidental), `reader.py:1858` (barline candidates) | Targets Ilya's measured losses: all 40 missed Tchaikovsky barlines were joins (`report-code-bars-by-the-system`); 43 of 199 heads on the Tchaikovsky were hollow-head hits on a song with no hollow heads, those inspected sitting on flag hooks (`report-code-one-head-to-a-stem`). Ceiling: measure first (section 7) | Weeks. Needs the T3 ruling. Browser cost NOT ESTABLISHED |
| 3 | Keep an inverse map for every pixel-moving step | `homr/point_mapping.py:1-55`; `homr/staff_parsing.py:277-284`; `homr/main.py:126-128` | `straighten_whole_pixel` returns its displacement (`reader.py:695`, discarded at `:702`); any page rescaling the plan adds | No accuracy. Makes plan step 4 (the unsure spot beside the same spot on the singer's page) possible, and boxes right | Hours. Low risk |
| 4 | Normalize scale once, before any rule | `homr/resize.py:7-20`; canvas `homr/staff_parsing.py:140-200` | Plan principle 2 (`docs/sessions/plan-scan-reader_r4_2026-10-01.md:61`); pixel constants `reader.py:316`, `shape.py:86`, `fitted.py:38`, `:428`, `:431`, `:442` | The critique measured staves moving with the raster (9, 4, 2). Whether this fixes it is NOT ESTABLISHED | Days; every constant re-checked at the new scale |
| 5 | Typed stage records and CI gates | `homr/model.py:229-409`; `vocabulary.py:287`; `pyproject.toml:137-160`; `Makefile:59-62` | `G` (`reader.py:1491-1499`), head dicts (`:1132`), records (`:2027`), `cfg` | Safer change, no accuracy | Days. Low risk with byte-identical event checks |
| 6 | Check each system's voice choice against the page's repeating layout | `homr/staff_parsing.py:31-129` | `select_voices` (`reader.py:991-1048`): the voice staff's index within a system should repeat; a break is a question for the singer (plan step 5) | Catches a single misselected system; how often that happens now is NOT ESTABLISHED | Hours |
| 7 | One results ledger: commit, date, headline per song, one line on what changed, kept for failures too | `Training.md:80-791` | `docs/` beside the harness | Regressions visible at a glance | Minutes per run |

**Do not copy.** Silent rewriting by bar arithmetic (`vocabulary.py:594-607`; time-signature numerators from the median bar, `Vocabulary.md:25`). Discarded scores. Averaged class indices. One page's error ending the set. [S, J]

### The desk's proposal, tested against the code

**The proposal:** keep Ilya's geometry and add very small trained classifiers, each answering one narrow question about one crop Ilya's geometry cuts.

**Feasible from what Ilya computes today: yes.** [S]

| Question | The crop already exists | Labels | Classes |
|---|---|---|---|
| Sharp, flat, natural, or nothing? | Components in x from `hx - 2.3s` to `hx - 0.28s`, within `1.7s` of the head row (`reader.py:1625-1626`) | Verovio renders via SVG; truth MusicXML `<accidental>` on matched notes | none, sharp, flat, natural, double sharp, double flat |
| How many flags or beams? | The stem-end window: 1.7 s out from the stem, 0.6 s past the tip to the head (`shape.py:16-27`, `:68-78`); patch rules in `fitted.py:323-335` | Renders; truth durations on the 697 matched stemmed notes of the build songs (`shape.py:6-8`) | none, flag 1, flag 2, beam 1, beam 2 |
| Dot or not? | `fitted.py:784` (`DOT_WIN`); `shape.py:81-87` | Renders; truth | dot, none |
| Which rest? | **No.** Rest candidates come only from Leipzig template hits (`run_page2.py:195`); on the Tchaikovsky the reader emitted 10 of 48 rests (`report-code-length-is-read-from-shape`) | | |

**What informs it.** oemer did exactly this: four SVMs on 40 by 70 pixel crops for clef, accidental, and rest type (the July teardown, question 3). Its teardown found "the hard part on clean input is isolating symbols, not naming them". homr then dropped oemer's crop classifiers and its rhythm geometry for a learned staff reader, and kept only the staff-finding geometry. [S from the memo; J]

**My verdict.** The proposal is sound but aimed at the smaller loss. Its three questions name things already found. Ilya's measured losses are mostly in finding and separating: merged barlines, flag hooks taken for heads, missed heads, rests never found. A classifier that only names cannot recover a note that was never cut out. [J]

**What I would do differently.** [J]

1. **Classify a fixed window, not a connected component.** A window normalized to staff space (for example 3 by 4 staff spaces at 8 px per staff space) does not care whether the sign touches a ledger line or a stem. Connected-component rules are what failed in the barline and head reports.
2. **Start with verifiers, not namers.** Head or not, filled or hollow, at each `detect_heads` and hollow candidate; then the stem-end class. Heads feed pitch, rhythm, and syllable seating, so their errors cost the most.
3. **Accidentals third, and ask only what is printed.** Keep `key_alter` and the carry in code (`reader.py:2016-2027`). homr's design shows the cost of learning the sounding alteration: its lift branch was its longest fight.
4. **Rests last, and only with a finder.** For example: ink on the voice staff that no head, stem, accidental, dot, or barline claims, offered to a rest-or-other classifier.
5. **Train on renders in all four fonts with homr-style degradation; test only on the scans,** with held-out songs untouched.
6. **Emit a probability and abstain below a threshold set on held-out data.** That fits Ilya's abstain path and does what homr does not.
7. **Run it small.** A logistic regression or a two-layer network over a window is a few thousand to tens of thousands of weights; a numpy forward pass fits Pyodide [I]. Whether Pyodide's OpenCV includes `cv2.dnn` is NOT ESTABLISHED.

---

## 6. Where Ilya's design is the better one, and should be kept

1. **Seeing kept apart from reasoning.** Printed sign by rule (`reader.py:1618-1648`), key and bar carry in code (`:2010-2027`). homr entangles them in one label (`music_xml_parser.py:454-464`, `convert_lieder.py:585`), so when it errs on an accidental nothing can say why. Whatever Ilya learns, keep this split. [S, J]
2. **Exact geometry and ids keyed to ink.** Measure and x survive a neighbour's removal, so a singer's correction keeps its place (`run_page2.py:470-500`). homr has exact heads and drops them, and gives attention points instead. [S]
3. **Abstention with a reason, per fact.** Three states are the right carrier for "unsure, flagged" (`reader/README.md:84-95`). Carry it through the converter; today it stops at a count. [S]
4. **The voice staff chosen by engraving rules, with tacet as an outcome** (`reader.py:991-1048`). homr reads all staves and grouped the voice with the piano in the yardstick run. [S]
5. **Piece-level state with provenance across pages** (`envelope.py:48-66`). [S]
6. **Loud failure.** A six-line staff group raises; homr dewarps nothing, trims staves, or removes tuplets with a log line. [S]
7. **Size and place.** It runs in the singer's browser on 20 KB of glyph data. homr needs about 157 MB of weights and onnxruntime. [S]
8. **Voice clefs.** Ilya takes an octave change (`reader.py:1485`). homr has no octave-transposing clef token (`vocabulary.py:45-49`) and drops such staves from training (`music_xml_parser.py:486-487`), so a tenor's treble-8 line comes out an octave high [I].

---

## 7. What I would measure next, most valuable first

1. **Error share by cause, on the build songs, on the current tree.** For each wrong note: head missing, head extra, staff position, accidental, stroke count, dot, or barline. The scorer already returns aligned pairs. This decides which classifier comes first.
2. **Each classifier's ceiling, with truth substituted.** Replace the reader's accidental class, stroke count, dot, or head decision with the truth on matched notes, and rescore. No training and no ruling needed; it bounds every gain in section 5.
3. **homr's errors by field on the same songs,** through Ilya's scorer: pitch, accidental, length. Tonight's evidence that its residue is accidentals rests on one song.
4. **The render-to-scan gap of the plainest learned baseline,** after your ruling: logistic regression on staff-space windows from renders in four fonts, scored on build-song scan crops against today's hand rule.
5. **Raster invariance after scale normalization:** the same page at 200, 300, and 400 dpi should read the same.
6. **Browser cost:** time and memory for a numpy forward pass over about 300 windows per page under Pyodide.

---

## What I read

**homr, in full:** `README.md`, `Vocabulary.md`, `IDEAS_FOR_CONTRIBUTORS.md`, `Training.md`, `homr/main.py`, `homr/staff_parsing.py`, `homr/staff_parsing_tromr.py`, `homr/point_mapping.py`, `homr/constants.py`, `homr/resize.py`, `homr/color_adjust.py`, `homr/bar_line_detection.py`, `homr/segmentation/config.py`, `homr/segmentation/inference_segnet.py`, `homr/transformer/configs.py`, `homr/transformer/staff2score.py`, `training/architecture/segmentation/model.py`, `training/segmentation/build_label.py`, `training/segmentation/train.py`, `training/architecture/transformer/encoder.py`, `training/architecture/transformer/tromr_arch.py`, `training/transformer/data_loader.py`.

**homr, in part:** `homr/model.py` (1-500), `homr/note_detection.py` (120-185), `homr/staff_detection.py` (outline, `detect_staff`), `homr/staff_dewarping.py` (325-411, outline), `homr/transformer/vocabulary.py` (16-200, 583-645, outline), `homr/transformer/decoder_inference.py` (100-227), `homr/music_xml_generator.py` (grep), `homr/circle_of_fifths.py` (96-188), `homr/brace_dot_detection.py` and `homr/noise_filtering.py` (outline), `training/transformer/train.py` (1-240), `training/transformer/image_utils.py` and `augraphy_augment.py` (outline), `training/architecture/transformer/decoder.py` (outline, 199-229, 471-552 by grep), `training/omr_datasets/convert_lieder.py` (170-226, 551-600, grep), `convert_grandstaff.py` (30-110), `music_xml_parser.py` (454-525), `dense_dataset_definitions.py`, `Benchmark.md` (1-30), `pyproject.toml`, `Makefile`, the CI workflow (grep), `tests/test_staff_detection.py`; test counts by grep. Model shapes from the shipped ONNX files in the scratchpad install.

**homr, not read:** `Changelog.md`, `CONTRIBUTING.md`, `docs/`, `docker/`, `homr/bounding_boxes.py`, `title_detection.py`, `relieur.py`, `debug.py`, `find_peaks.py`, `autocrop.py`, `staff_position_save_load.py`, `onnx_providers.py`, `download_utils.py`, `pdf_utils.py`, `encoder_inference.py`, `custom_x_transformer.py`, `training/onnx/`, the other dataset converters' bodies, `validation/`.

**Ilya, in full:** `tools/e16-harness/reader/README.md`; the audit memo and the independent critique.

**Ilya, in part:** `reader.py` (1-30, 596-818, 991-1048, 1087-1145, 1401-1530, 1533-1760, 2004-2044, outline), `run_page2.py` (1-40, 244-330, 430-500, outline), `shape.py` (1-87, 226-240), `envelope.py` (1-66), `fitted.py`, `beams.py`, `substrate.py`, `clefkey.py`, `timesig.py`, `metre.py`, `hollow.py`, `rest_templates.py` (constants and outlines only), `test_metre.py` (1-19, count), `recognized.ts` (25-75), `recognized-to-musicxml.ts` (1-60), `page-reader.worker.ts` (grep), `reader-ids.test.ts` (1-40), `manifest.json`, `scan-scorer-selftest.ts` (outline); plan r4 (1-90); the openings of the yardstick, baseline, heads, bars, length, company, and fitted reports; the July oemer teardown memo (project knowledge).

**Ilya, not read:** the bodies of `clefkey.py`, `timesig.py`, `metre.py`, `hollow.py`, `rest_templates.py`, `substrate.py`, `beams.py`, `fitted.py`; the cloud-lane and loupe reports; the two survey memos. No held-out song file was opened.

## What I could not establish

- The current error breakdown of Ilya's reader at `b2106d09`. The 41 to 73 figures are the desk's; the reports I read hold the earlier baseline.
- Whether homr's residual errors on Ilya's songs are mostly accidentals beyond one song.
- The gain of any classifier, or of scale normalization.
- Whether Pyodide's OpenCV has `cv2.dnn`, and the browser cost of a numpy network.
- Exact parameter counts (mine are from fp32 file sizes).
- The effect of homr's averaged class indices at tile edges.
- Why homr's agnostic encoding (Run 368) did worse. A whole-staff model sees the key signature and can learn the rule; a crop classifier cannot, which is why my version asks crops only what is printed.
- That `ds2_dense` is DeepScores v2 (from its name only), and how GrandStaff and PrIMuS images were rendered (not in the code read).

---

## Appendix: the constants count, file by file

Numeric literals other than 0, 1, 2 (named UPPER_CASE constants in brackets). [S, `review/metrics.py`]

**homr, largest:** `vocabulary.py` 57, `staff_dewarping.py` 40, `staff_detection.py` 36, `bounding_boxes.py` 32, `staff_position_save_load.py` 31, `staff_parsing.py` 26, `debug.py` 20, `configs.py` 19, `constants.py` 18 (1); 32 other files 126. Total 405 (1).

**Ilya:** `fitted.py` 263 (40), `reader.py` 235 (40), `shape.py` 64 (18), `clefkey.py` 40 (14), `metre.py` 39 (1), `timesig.py` 35 (9), `run_page2.py` 20 (4), `beams.py` 18 (8), `hollow.py` 13 (2), `rest_templates.py` 8 (4), `substrate.py` 5 (2), `envelope.py` 0 (0). Total 740 (142).

Comment and docstring lines: homr 813 of 8,050; Ilya 3,314 of 7,521. Functions over 80 lines: homr 6 of 460; Ilya 9 of 198.
