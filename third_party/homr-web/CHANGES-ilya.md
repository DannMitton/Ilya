# Changes by the Ilya project

This copy of homr-web 0.2.0 (commit `cb333a5`) was changed by the Ilya
project on 2026-10-05 and 2026-10-06 and is published as `0.2.0-ilya.4`. It is not a release
by homr-web's author. It stays under the GNU Affero General Public License
version 3, as homr and homr-web are; LICENSE and NOTICE are unchanged.

What it adds: the option `model: "465"` (on `createRecognizer`, and on
`recognizePage` in `homr-web/internal`). With it, a page is read with homr's
transformer model 465 and with the code of homr's main branch at commit
`560ca5ce254db129b1b2167598bdc7a20ac5d6b0` wherever that code changes the
notes. Without it, the copy reads as homr-web 0.2.0 does, following homr
release 0.7.0 (commit `8b5dcf7d7bdd1a47911dc0c661c573b957271eab`).

Each place where homr main differs reads `followsHomrMain()` from
`src/model/homr-version.ts` and keeps the 0.7.0 behaviour when it is false.

## Files changed, and the homr code each follows

All homr paths are at commit `560ca5c` unless said otherwise.

| file | change | follows |
|---|---|---|
| `src/model/homr-version.ts` (new) | the active model, set by `recognizePage` for one page | none (selection only) |
| `src/transformer/vocabulary.ts` | model 465's rhythm (260), articulation (62) and position (5) tables beside model 396's; lookups use the active model's; `isLowerPosition` | `homr/transformer/vocabulary.py` |
| `src/models/manifest.ts` | records `decoder-465-fp32` and `encoder-465-fp32`, and `MODEL_465_CATALOG` | `homr/transformer/configs.py` (model name) |
| `src/pipeline/recognize.ts` | options `model` and `onVoices`; homr main's MusicXML writer for model 465 | `homr/main.py` |
| `src/pipeline/staff-image.ts` | `_find_periodic_core` and the new `_ensure_same_number_of_staffs` | `homr/staff_parsing.py` |
| `src/geometry/staff-lines.ts` | the new `are_lines_crossing` | `homr/staff_detection.py` |
| `src/geometry/other-clefs.ts` | `find_peaks` distance `0.7 * unit_size` in `find_horizontal_lines` | `homr/staff_detection.py` |
| `src/cv/box-overlap.ts` | `intersectConvexConvex` test first in `do_polygons_overlap` | `homr/bounding_boxes.py` |
| `src/cv/brace-core.ts` (new) | `_trim_symbol_to_core_span` | `homr/brace_dot_detection.py` |
| `src/pipeline/detect.ts` | trims brace candidates before the brace search | `homr/brace_dot_detection.py` |
| `src/geometry/braces.ts` | minimum candidate width; the new `_score_brace_with_staff_pair` with the staffs above and below | `homr/brace_dot_detection.py`, `homr/model.py` |
| `src/model/constants.ts` | `brace_core_width_ratio`, `min_width_for_brace_dot_candidate` | `homr/constants.py` |
| `src/transformer/duration.ts` | the multirest duration that `kern_to_symbol_duration` now returns | `homr/transformer/vocabulary.py` |
| `src/transformer/remove-duplicated-symbols.ts` | position tests through `is_lower_position` | `homr/transformer/vocabulary.py` |
| `src/transformer/symbol.ts` | `to_upper_position` maps `lower2` to `upper2` | `homr/transformer/vocabulary.py` |
| `src/pipeline/parse-staffs.ts` | a single staff drops `lower2` as well as `lower` | `homr/staff_parsing_tromr.py` |
| `src/musicxml/generate-main.ts` (new) | port of the rewritten MusicXML writer | `homr/music_xml_generator.py` |
| `src/musicxml/xml.ts` | `XmlElement.append`, which keeps call order; comment nodes | `homr/music_xml_generator.py` (ElementTree order, `imgpos` comments) |
| `src/segmentation/preprocess.ts` | `preprocessPage` reports where autocrop cut the page | `homr/autocrop.py` (`autocrop_with_offset`) |
| `src/dewarp/piecewise-affine.ts` | `inverseTransformPoint` | `homr/staff_dewarping.py` (`inverse_transform_point`) |
| `src/pipeline/staff-image.ts` (also) | `prepareStaffImageWithMapping`: the canvas and the mapping from canvas to page | `homr/staff_parsing.py`, `homr/point_mapping.py` |
| `src/pipeline/parse-staffs.ts` (also) | `imageCoordinates` on each symbol with model 465 | `homr/staff_parsing.py` (`parse_staff_image`) |
| `src/transformer/symbol.ts` (also) | the optional field `imageCoordinates` | `homr/transformer/vocabulary.py` (`image_coordinates`) |
| `src/worker.ts`, `src/worker-protocol.ts`, `src/client.ts` | the `model` setting from `createRecognizer` to the Worker | none (plumbing) |
| `src/index.ts`, `src/internal.ts`, `src/version.ts` | exports `TransformerModel`, `HOMR_MAIN_COMMIT`, the selection module | none |
| `src/golden/decode.ts` | token fields typed for both vocabularies | none (types only) |
| `README.md`, `package.json` | version `0.2.0-ilya.1`, this notice, the release line; `CHANGES-ilya.md` added to the package files | none |
| `src/models/manifest.ts` (0.2.0-ilya.2) | the record `encoder-465-fp16`; `MODEL_465_CATALOG` takes it on WebGPU, as `MODEL_ROLES` takes `encoder-396-fp16` | `homr/transformer/configs.py` (model name), `homr/onnx_providers.py` (fp16 on the GPU) |
| `test/manifest.test.ts` (0.2.0-ilya.2) | one test: the 465 catalogue's encoder and decoder on each placement | none (test) |
| `README.md`, `package.json` (0.2.0-ilya.2) | version `0.2.0-ilya.2`; the fp16 465 encoder's path and size | none |
| `src/pipeline/staff-image.ts` (0.2.0-ilya.3) | the new `regroupingCutsASystem`; `ensureSameNumberOfStaffsMain` keeps the systems as detected when the periodic regrouping would cut one | none: a departure from homr main, `homr/staff_parsing.py` `_ensure_same_number_of_staffs` |
| `src/pipeline/parse-staffs.ts` (0.2.0-ilya.3) | the number of voices is the largest system's, not the first system's | none: follows from the row above; the same count whenever the systems have one size |
| `test/regrouping-ilya3.test.ts` (0.2.0-ilya.3) | five tests: the two *Sunless* 3 layouts, homr main's own case, a mixed case, and model 396 unchanged | none (test) |
| `README.md`, `package.json` (0.2.0-ilya.3) | version `0.2.0-ilya.3` | none |
| `src/pipeline/parse-staffs.ts` (0.2.0-ilya.4) | the new `systemOffsets` and `restsForBars`: a system that begins with a grand staff, on a page whose largest system has single staffs above its grand staff, moves down by that many voices, and each voice it leaves out gets rests as long as the system's bars | none: a departure from homr main, `homr/staff_parsing.py` `parse_staffs` |
| `src/musicxml/generate-main.ts` (0.2.0-ilya.4) | a clef joined by a chord token to notes is written as a clef change before them, and not handed to `build_note_chord`; the new `barLengthsMain`; the clef writing moved into `appendClef` | none: a departure from homr main, `homr/music_xml_generator.py` `build_measures` and `build_note_chord` |
| `test/voices-ilya4.test.ts` (0.2.0-ilya.4) | eight tests: the two Kabalevsky layouts, pages that keep homr's order, model 396 unchanged, the rests for 2/4, 3/4, 4/4 and an odd bar, and the clef in a chord | none (test) |
| `README.md`, `package.json` (0.2.0-ilya.4) | version `0.2.0-ilya.4` | none |

## Not ported

From homr main, not ported because they do not change the notes Ilya reads:
title text detection (`title_detection.py`), PDF input (`pdf_utils.py`),
joining pages (`relieur.py`), command-line options (`main.py`), GPU provider
selection (`onnx_providers.py`, `segmentation/inference_segnet.py`,
`transformer/encoder_inference.py`, `transformer/decoder_inference.py`),
reading a staff-positions file (`staff_position_save_load.py`), and the
`autocrop.py` refactor. `_extrapolate_missing_staff_line` in
`staff_detection.py` is defined but never called at `560ca5c`.

Each note's place on the input image (`point_mapping.py`, the `imgpos`
comments) is ported with model 465. On the one page checked (Tchaikovsky
Op. 38 No. 3, page 1) the port writes the same 240 comments as homr main,
161 of them equal and 232 within 1 pixel, the largest difference 4 pixels.
The port's attention coordinates and staff canvases are not bit-identical to
homr's, so the positions are not either.

## Checked on 2026-10-05

With model 465, the MusicXML equals homr main's (ignoring attribute order,
comments and the title) on 17 of 20 test pages: Tchaikovsky Op. 38 No. 3
pages 1 and 3, and *Sunless* build pages 01 to 04, 06 to 15, and 17. Page 2
of the Tchaikovsky differs in one sharp, page 05 of *Sunless* in four staffs'
tokens, and page 16 in the first symbol of one piano staff. On page 2 and
page 16 the port's staff canvas differs from homr's by up to 3 and 8 grey
levels (homr-web 0.2.0 already documents its canvases as not bit-identical
to homr's), and homr's own transformer, given the port's canvas, also changes
its reading. The cause on page 05 is not established. With model 396, the three fixture
pages equal homr 0.7.0's MusicXML and the three Tchaikovsky pages equal
homr-web 0.2.0's byte for byte.

## 0.2.0-ilya.2, 2026-10-05

Adds the record `encoder-465-fp16` for homr's file
`encoder_pytorch_model_465-597144cab54c8f6d0f6c9619df5c5312694eadd6_fp16.onnx`,
26 466 256 bytes, SHA-256
`50823c061533328f5e64df016d3ed16eb9071a9f5c5ee8621646cf9ac9c8a992`, downloaded
from homr's `onnx_checkpoints` release. Its one input (`input`, float16,
`[1, 1, 256, 1280]`) and one output (`output`, float16, `[1, 1280, 512]`) have
the names, element types, and shapes of `encoder-396-fp16`, read with the
`onnx` Python package 1.23.1. With `model: "465"` a read on WebGPU now asks
for this file for the encoder; on WebAssembly it still asks for
`encoder-465-fp32`. Nothing else changes; a read on WebAssembly reads as
0.2.0-ilya.1 does.

## 0.2.0-ilya.3, 2026-10-06

With `model: "465"`, a page whose systems hold different numbers of staffs
is no longer cut into rows that split a printed system. homr main finds the
period with which the grand-staff flags of the staffs repeat down the page
and regroups the staffs by it. On the fourth page of Mussorgsky's *Sunless*
3 (IMSLP 113877, PDF page 8) the first system holds the voice, the piano,
and a third piano staff, and the two systems after it hold the voice and the
piano. The flags are F T F, F T, F T; homr main and 0.2.0-ilya.2 found the
period 3, made the second row from the voice and piano of the second system
and the voice of the third, and dropped the third system's piano. The voice
of the last system became the third part. Desktop homr main at `560ca5c`
does the same on that page (its log: "Systems repeat every 3 staffs").

The change: a row may lie inside one detected system, or be made of whole
detected systems; when the regrouping would make any other row, the systems
are kept as homr detected them, and each part keeps its place from the top
of every system. The number of voices is then the largest system's. Nothing
changes when every system has the same number of staffs, when every staff
stands alone (homr main's own case), or with model 396.

On the 20 pages of Ilya's five build songs the change alters no page's
MusicXML: measured 2026-10-06 in headless Chromium on WebAssembly, through
Ilya's own reader, from the 400 dpi pages of the desk's kit and from Ilya's
own pdf.js render of the two PDFs, byte for byte before and after.

## 0.2.0-ilya.4, 2026-10-06

Two departures from homr main, both with `model: "465"` only.

**A system that leaves out the voice's staff.** In a song the voice's
staff is printed above the piano's, and where the voice rests for some bars
an engraver may leave its staff out, so the system is the piano's grand staff
alone. Kabalevsky's op. 52 (Muzgiz plate 6028) does this: no. 4, page 3,
detects as `vg, g, vg, vg` (v a single staff, g a grand staff), and no. 7,
page 3, as `g, g, vg, vg`. homr gives each system's staffs to the voices from
the top, so the grand staff of such a system became the first voice, and
Ilya, which keeps the first part, read the piano as sung: 38 notes too many
on no. 4 and 116 on no. 7. Now `systemOffsets` takes the first of the page's
largest systems as its layout. When that layout has single staffs above its
first grand staff, a system that begins with a grand staff moves down by
that many voices, if it still fits; and `restsForBars` gives each voice it
leaves out a staff of rests, in each bar as long as that bar of the grand
staff (counted by `barLengthsMain`, as the writer counts it), with the grand
staff's bar lines. A musician reads such a system as the voice resting and
the piano playing. A page whose systems all begin alike, a page whose largest
system begins with a grand staff, and model 396 are read as before.

**A clef read inside a chord.** The transformer can join a clef to a chord
of notes with a chord token (Kabalevsky op. 52 no. 9, page 4: a G clef for
the piano's lower staff joined to a sixteenth on the upper staff). homr main
hands the clef to `build_note_chord`, where its empty pitch makes it a rest
of no length, and the assertion `group_duration > 0` then fails, so the
whole page fails: desktop homr main at `560ca5c` stops on that page with the
same `AssertionError` (run on Ilya's own render of the page, 2026-10-06).
Now a clef in a chord of notes is written as a clef change on its staff,
before the chord's notes, and the notes are written as before.

