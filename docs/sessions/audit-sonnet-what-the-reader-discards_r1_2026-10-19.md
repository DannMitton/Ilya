# Audit: what the scan reader computes that the singer never sees

Read-only. Repository /root/lane11 at f06c1af4, after one `git pull --quiet`. Every claim carries a file and line read this session. Anything without one is marked NOT ESTABLISHED.

How the passes map to the tables. Table 1 is pass 1 (everything homr's model and decoder can output) and traces each item through pass 2's question (stored, parsed, drawn). Table 2 covers the rest of pass 1 (the page-reader worker and the OMR glue) with the same trace. Table 3 is pass 3 (a MusicXML file a singer uploads).

Path key. H = third_party/homr-web/src. W = apps/web/src/lib. P = packages/score-parser/src. "Stored" means present in the joined MusicXML that Ilya keeps (W/omr/stamp.ts:35 `KeptReading.musicXml`; W/omr/scan.ts:116 `readingFile`). The live model is 465 (W/omr/stamp.ts:20), so the live writer is H/musicxml/generate-main.ts (H/pipeline/recognize.ts:237), not generate.ts. Both write the same articulation, slur and lift logic.

## Correction to the brief

"Nothing in apps/web/src/lib/score reads articulations" is not right. W/score/phrase-ends.ts:34-35 reads `ev.fermata` and `ev.articulations` for `breath-mark` and `caesura`, and uses them as a phrase-end signal for word sounds. P/conditions.ts:173 and 312-338 and P/sustain.ts:99 read the same. They are used, not drawn.

## Table 1: model outputs (vocabulary.ts, decoder, post-processing, writer)

| element | reader emits | stored | parser keeps | drawn or used | note |
|---|---|---|---|---|---|
| Rhythm: note durations, dots, tuplet values (note_7, _11 etc.) | yes, H/transformer/vocabulary.ts:439-700 | yes, `<type>`, `<dot>`, `<time-modification>`, H/musicxml/generate-main.ts:463-488 | yes, P/musicxml-parser.ts:737-753 | drawn (P/staff-renderer.ts:26-27 tuplets) | The tuplet bracket mark `<tuplet type>` (generate-main.ts:371-373) is not read; the renderer rebuilds brackets from `time-modification`. |
| Rhythm: fixOverEagerTuplets | yes, H/transformer/remove-duplicated-symbols.ts:109-117 | n/a | n/a | n/a | Strips tuplet values from bars shorter than the median bar. Computed, changes the rhythm, never reported. |
| Rhythm: rests, multirest rest_2m..10m | yes, vocabulary.ts:489-497 | yes, `<measure-style><multiple-rest>N`, generate-main.ts:982-992 | no; grep for `multiple-rest` and `measure-style` finds nothing under P/ or W/ | no | A real homr output holds `<multiple-rest>10</multiple-rest>` inside one measure (docs/sessions/measure-m-p-r74_2026-10-11/step2/drops/I.musicxml:35). joinPages renumbers measures 1..n (W/omr/join-pages.ts:251), so the printed bar count of a multirest is lost. That bars after it are numbered too low is an inference, not read. |
| Rhythm: grace flag "G" | yes, vocabulary.ts:85 | yes, `<grace/>`, generate-main.ts:435-437 | no, skipped with a warning, musicxml-parser.ts:707-709 | no | |
| Rhythm: `chord` token | yes, vocabulary.ts:3 | yes, `<chord/>`, generate-main.ts:426-428 | no, skipped, musicxml-parser.ts:713-716 | no | |
| Rhythm: barline, doublebarline, bolddoublebarline | yes, vocabulary.ts:4-6 | yes, `<bar-style>`, generate-main.ts:1057-1068 | no; the barline case reads only `<repeat>` and `<ending>`, musicxml-parser.ts:539-563 | final bar only, from the last measure, not the file (staff-renderer.ts:3450-3467; page-layout.ts:204) | W/score/bars-to-confirm.ts:26-32 says in its own header that the parser drops `<bar-style>`. |
| Rhythm: repeatStart, repeatEnd, repeatEndStart | yes, vocabulary.ts:7-9 | yes, `<repeat>`, generate-main.ts:1069-1078 | yes, `repeatStart`, `repeatEnd`, musicxml-parser.ts:540-552 | used (unfolding for the sung order, W/markup/MarkupPane.svelte:592-595; W/score/bars-to-confirm.ts:111-118); not drawn: no "repeat" in staff-renderer.ts | The singer's copy shows no repeat signs. |
| Rhythm: voltaStart/Stop/Discontinue | yes, vocabulary.ts:10-12 | yes, `<ending>`, generate-main.ts:1079-1085 | yes, `Measure.ending`, musicxml-parser.ts:553-561 | used for unfolding; not drawn (no "ending" in staff-renderer.ts); P/types.ts:301-305 says startsHere/endsHere are "for drawing the bracket later" | |
| Rhythm: clef_F3..G2, clef_TAB5 | yes, vocabulary.ts:453-462 | yes, H/musicxml/generate-main.ts:940-947 | yes, first clef of staff 1, musicxml-parser.ts:462-481 | clef chosen by `chooseClef` (staff-renderer.ts:52); per-measure clef changes drawn: NOT ESTABLISHED | Redundant clefs are removed inside homr (remove-duplicated-symbols.ts:164-199). Staff 2 clefs dropped by joinPages (join-pages.ts:336-340). |
| Rhythm: keySignature_-7..7 | yes, vocabulary.ts:464-478 | yes, `<key><fifths>`, generate-main.ts:1039-1043 | yes, every change, musicxml-parser.ts:440-447 | only the first is drawn: renderer reads `keySignatures[0]` (staff-renderer.ts:1680, 1854; stated at :532-535) | Mid-piece key changes are parsed and then ignored by the renderer. |
| Rhythm: timeSignature/N | yes, only the lower figure is read, vocabulary.ts:479-488 | yes, upper figure computed from bar lengths, generate-main.ts:1044-1056 | yes, musicxml-parser.ts:448-458 | drawn (staff-renderer.ts:680-700) | The metre network (Table 2) replaces homr's signature where it states one. |
| Rhythm: `newline` (system break) | yes, parse-staffs.ts:111 | yes, `<print new-system="yes">`, generate-main.ts:1028-1031 | no (`print` not read) | no; Ilya reflows (page-layout.ts) | The scan's system breaks never reach the singer. |
| Pitch: step and octave | yes, vocabulary.ts:287-360 | yes, `<pitch>`, generate-main.ts:450-452 | yes, musicxml-parser.ts:755-767 | drawn | removeDuplicatedPitches drops a repeated pitch in a chord, with a ported homr bug (remove-duplicated-symbols.ts:139-162). |
| Lift: ., _, #, ##, N, b, bb | yes, vocabulary.ts:363 | alter only, generate-main.ts:453-461 | alter only, musicxml-parser.ts:765-767 | accidental recomputed by Ilya's own carry rule (staff-renderer.ts:463-510) | Whether the scan printed an accidental, a natural, or nothing is lost; `N` and "nothing" both become alter 0 against the key. A cautionary accidental printed on the page is re-derived, not copied. |
| Articulation: accent, staccato, staccatissimo, tenuto, caesura, doit | yes, vocabulary.ts:703-766 | yes, `<articulations>`, generate-main.ts:328-336, 374-379 | accent, staccato, tenuto, staccatissimo, caesura kept (musicxml-parser.ts:253-264, 786-796); `doit` warned and dropped | breath-mark and caesura used for phrase ends only (phrase-ends.ts:35); the rest not drawn | `caesura` is not in the 465 articulation table (vocabulary.ts:703-766), so the scan reader cannot produce it. |
| Articulation: breathMark | yes, vocabulary.ts:735-741 | yes, `<breath-mark/>`, generate-main.ts:337-339 | yes, musicxml-parser.ts:261, 786-791 | used (phrase-ends.ts:35; conditions.ts:173); not drawn | |
| Articulation: fermata | yes, vocabulary.ts:742-747 | yes, `<fermata/>`, generate-main.ts:324-327 | yes on notes, not on rests (`!isRest`, musicxml-parser.ts:784-785) | used (phrase-ends.ts:34; sustain.ts:99; conditions.ts:312-338); not drawn | |
| Articulation: arpeggiate, tremolo, trill, turn, mordent | yes, vocabulary.ts:723-765 | yes, `<ornaments>`, generate-main.ts:340-350; `arpeggiate` as a notation; `mordent` is written into `<articulations>` (generate-main.ts:328-335), which is the wrong parent | no (only `<articulations>` read, musicxml-parser.ts:786); `mordent` raises an unsupported-articulation warning (:792-795) | no | tremolo start/stop is a toggle across notes (generate-main.ts, ConversionState). |
| Slur: slurStart, slurStop, both | yes, vocabulary.ts:424-430 | yes, `<slur type number>`, generate-main.ts:388-414 | no (no `slur` in musicxml-parser.ts) | no; the renderer draws melisma slurs by absence of a syllable (staff-renderer.ts:2380-2410) | Same-pitch adjacent slurs become ties first (generate-main.ts:835-851); those survive as `<tie>` (parser :769-777) and are drawn. All other slurs are discarded at the parser. |
| Position: upper, lower, upper2, lower2 | yes, vocabulary.ts:769-775 | staff 1 or 2 only, generate-main.ts:300-301 | staff not read | joinPages keeps staff 1 only (join-pages.ts:233-235) | upper2/lower2 (a second voice on a staff) is folded into the staff. Lower symbols on a single staff are discarded by `filterPositions` (parse-staffs.ts:71-79). |
| Per-symbol confidence | no. The decoder takes argmax of each head and keeps no logit or probability (H/transformer/decoder.ts:50-51, 128-135) | no | no | no | There is no model confidence to discard. |
| Per-symbol attention position | yes, `coordinates` (decoder.ts:145-150), mapped to the page as `imageCoordinates` (parse-staffs.ts:47-64) | yes, as an XML comment `imgpos: x, y` (generate-main.ts:494-503) | no (comments are not parsed) | used inside the join only: tuplet digit lookup and metre windows (join-pages.ts:436-439, 540; metre-model.ts:97; metre-witness.ts:114) | Not drawn. Raw `coordinates` in encoder pixels are dropped. |
| Tie tokens, dynamics, tempo words, lyrics, chord symbols as tokens | no. None of these are in the six vocabularies (vocabulary.ts:24-775) | n/a | n/a | n/a | homr's model does not read dynamics, tempo words, or lyrics. Lyrics are not on the scan route at all. |
| Part list: voice and piano parts, staff 2, `<staves>` | yes, generate-main.ts:1107-1126, 968-971 | piano part and staff 2 dropped by joinPages (join-pages.ts:10-14, 20-23) | n/a | n/a | The piano is read and then deliberately discarded. |

## Table 2: page-reader worker, OMR glue, and OCR

| element | reader emits | stored | parser keeps | drawn or used | note |
|---|---|---|---|---|---|
| Chord-symbol strips and title (RapidOCR, `PageText`: text, box, score) | computed only when `ocr` is not false (H/pipeline/recognize.ts:221-233; H/result.ts:33-42) | no | no | no | Ilya passes `ocr: false` (W/omr/homr-reader.ts:305), so title and text boxes are never computed. The written `<work-title>` is empty (H/musicxml/generate-main.ts:1140-1142; recognize.ts:222-223). |
| Tesseract word boxes and confidences | not requested. The only call is `worker.recognize(file)` and only `data.text` is read (W/score/ScoreUploader.svelte:449-453) | n/a | n/a | text feeds the poem route only | Tesseract never touches a score. Boxes and confidences are available from the library and are not asked for. |
| Staff boxes (`StaffBox`: cx, cy, w, h, index) | yes, H/pipeline/staff-positions.ts:50-59 | no | no | used for cover detection and metre windows (W/omr/homr-reader.ts:106-134, 312) | `isGrandstaff` is dropped when boxes are made (staff-positions.ts:55-58). Only the count of wide boxes survives. |
| Staff and system detection, braces, dewarp, segmentation masks | yes, H/pipeline/detect.ts; H/geometry/*.ts | no | no | indirectly (voice versus piano choice) | Systems that omit the voice get computed rests (parse-staffs.ts:229-278); that is stored as rests, then emptied by `silent` (join-pages.ts:295-298). |
| Cover pages | computed, W/omr/homr-reader.ts:130-134 | pages left out | n/a | n/a | Not reported to the singer: NOT ESTABLISHED that any notice is shown. |
| Pages homr finds no music on | `not_music` (homr-reader.ts:315) | left out | n/a | n/a | Count shown only in the console line (scan.ts:107-111). |
| Reader log, backend, duration | yes, H/result.ts:93-99 | no | no | console only (scan.ts:107-111); on success `result.log` is not read (homr-reader.ts:308-313) | |
| Time-signature network (`MetreSeen`: lab, why, courtesy, start; class probabilities and features inside) | yes, W/omr/metre-reader.ts, metre-model.ts | lab becomes `<time>` where bars add up (join-pages.ts:553, 564-576) | yes | drawn | `why` reasons, courtesy signatures, and unplaced signatures go to the console only (homr-reader.ts:382; join-pages.ts:502-507). Probabilities are not kept. |
| Printed tuplet digits (templates, n:m) | yes, W/omr/tuplet-number.ts, tuplet-digits.ts | bars rewritten as triplets (join-pages.ts:276; triplets.ts) | via `time-modification` | drawn | The numbers read are logged only (homr-reader.ts:381). No `<tuplet>` bracket start or stop is written by the join (triplets.ts:85-87). |
| Tacet and piano-alone pages | computed, join-pages.ts:418-422 | notes removed, bars kept | bars kept | tacet runs drawn | The E.16 reader's `tacetSystems` count goes to its read report (page-reader.worker.ts:229); in the homr route there is no tacet count. |
| Bars after the last double bar | computed, join-pages.ts:369-376 | bars removed | n/a | n/a | |
| Silent bars (rests only) | n/a | rests removed, bar empty (join-pages.ts:252, 295-298) | bar kept | tacet run | |
| E.16 page reader (behind `?reader=ilya`, W/omr/scan.ts:29-31): `ReadReport`, per-note `abstain`, `midiAssumedNatural`, `classification`, `beatBoundaries`, `printedAt`, `integrity` (W/reader/recognized.ts) | yes | substitutions counted, not marked (recognized-to-musicxml.ts:25-40) | n/a | "NOTHING here is drawn on the page" (recognized.ts:97-100) | Its Python source was not read; its internals are NOT ESTABLISHED. Not the default route. |

## Table 3: what the MusicXML parser drops from an uploaded file

All line numbers are P/musicxml-parser.ts. The measure loop switches on `attributes`, `direction`, `sound`, `backup`, `forward`, `note`, `barline` and ignores every other child (:432-566). Notes are read at :690-858.

| element | reader emits | stored | parser keeps | drawn or used | note |
|---|---|---|---|---|---|
| `<accidental>` (printed, courtesy, editorial) | n/a | n/a | no (not referenced) | accidental recomputed (staff-renderer.ts:492-510) | A printed cautionary accidental that the carry rule would not draw is not drawn. |
| `<slur>` | n/a | n/a | no | no | |
| `<tied>` | n/a | n/a | no; only `<tie>` is read (:772-776) | tie drawn from `<tie>` | |
| `<dynamics>`, `<wedge>` | n/a | n/a | no; a `<direction>` yields tempo, modulation and words only (:493-506) | no | |
| `<words>` | n/a | n/a | kept as `tempoWords`, every word (:500-501, 1006-1016) | used for the tempo estimate (tempo-seam.ts:484-485); not drawn | Expression words ("dolce") are collected as tempo words. |
| `<metronome>` | n/a | n/a | yes (:972-999) | tempo | |
| `<breath-mark>`, `<caesura>`, `<fermata>` | n/a | n/a | yes (:261, 785-791) | used for phrase ends (phrase-ends.ts:34-35); not drawn | |
| `<ornaments>` (trill, turn, mordent, tremolo) | n/a | n/a | no | no | |
| `<technical>`, `<fingering>` | n/a | n/a | no | no | |
| `<articulations>` other than the ten mapped (doit, plop, scoop, falloff, spiccato, mordent, ...) | n/a | n/a | warned and dropped (:792-795) | no | |
| `<notehead>`, cue notes (`<cue/>`), `<stem>`, `<beam>` | n/a | n/a | no | beams and stems derived (staff-renderer.ts:21-25) | |
| Grace notes | n/a | n/a | skipped (:707-709) | no | |
| Chord tones | n/a | n/a | skipped (:713-716) | no | |
| `<staff>`, `<voice>` on notes | n/a | n/a | not read; all notes of the vocal part enter by cursor | n/a | A second voice or staff in the vocal part enters the line. |
| `<print new-system new-page>`, `<system-layout>`, `<page-layout>` | n/a | n/a | no | Ilya reflows | |
| `<measure number>` | n/a | n/a | yes, verbatim (:600) | drawn (staff-renderer.ts:1135-1160, 2253, 2614) | |
| `<bar-style>` | n/a | n/a | no (:539-563) | final bar only, by position | |
| `<repeat>`, `<ending>` | n/a | n/a | yes (:540-561) | used, not drawn | |
| `<sound>` segno, coda, dacapo, dalsegno, tocoda, fine | n/a | n/a | yes (:139-172) | used for unfolding | |
| `<segno>`, `<coda>` glyphs, jump words | n/a | n/a | detected only (:182-191) | not drawn | |
| `<key>` mode, `<time symbol>` | n/a | n/a | yes (:442-457) | symbol drawn: NOT ESTABLISHED | Only the first key is drawn. |
| `<clef-octave-change>` | n/a | n/a | yes (:478-480) | | |
| `<measure-style><multiple-rest>`, `<multiple-rest>` | n/a | n/a | no | no | |
| `<lyric>`: `<extend>`, `<humming>`, `<laughing>`, `<end-line>`, `<end-paragraph>` | n/a | n/a | no; text, syllabic and elision kept (:880-894) | | Melismas come from absence of a syllable, not `<extend>`. |
| `<credit>`, `<rehearsal>`, `<harmony>`, `<figured-bass>` | n/a | n/a | no | no | |
| `<creator>` types, `<work-number>`, `<movement-title>` | n/a | n/a | yes (:1061-1096) | | |
| Parts other than the first lyric-bearing part | n/a | n/a | no (:335-353) | | A warning is raised for several lyric parts. |
| Editorial parentheses (`<accidental parentheses>`, `<notehead parentheses>`) | n/a | n/a | no | no | |

## The five discarded elements that would most improve the singer's copy

1. Breath marks, fermatas, and caesuras, drawn. The scan reader emits them (vocabulary.ts:735-747), the parser keeps them (musicxml-parser.ts:785-791), and phrase-ends already acts on them (phrase-ends.ts:34-35), so the singer's words change at a breath the singer cannot see. Cost: draw SMuFL glyphs in staff-renderer from `ev.fermata` and `ev.articulations`; no parser work.
2. Repeat signs and volta brackets, drawn. The singer sees a copy that omits a repeat the unfolder has taken into account. Rhythm and word order are what a singer follows. Cost: draw from `Measure.repeatStart`, `repeatEnd`, `ending` in the barline code; the data is already parsed.
3. Slurs. The reader emits them (vocabulary.ts:424-430), generate-main.ts:388-414 writes them, and the parser drops them. They tell a singer which notes share a breath and one syllable (legato, phrasing), and unlike the melisma rule they are what the engraver printed. Cost: add a `slur` field to the event in the parser notations block and feed the existing arc code (arc-outline.ts); needs a ruling on slur versus melisma slur (staff-renderer.ts:2428-2431).
4. Multirest bar count. The reader emits `<multiple-rest>N</multiple-rest>` (generate-main.ts:982-992), nothing reads it, and joinPages numbers the bars 1..n (join-pages.ts:251). Rhythm and position: the singer counts N bars, Ilya draws one. Cost: read `measure-style` in the `attributes` case and expand the measure to N empty bars or draw a counted tacet run.
5. Dynamics and expression words (uploaded MusicXML only; homr reads neither). Expression is what a singer marks first. Cost: read `<dynamics>`, `<wedge>` and non-tempo `<words>` in the `direction` case (musicxml-parser.ts:492-508) and place them above the staff; a larger renderer change than the first four.

Runners-up: key changes mid-piece (parsed, renderer reads `keySignatures[0]` only, staff-renderer.ts:1680); grace notes (parser skips them, :707); `<bar-style>` double bars.

## What I could not establish

- The E.16 page reader's Python modules (envelope, run_page2, timesig, reader). Their source is copied by apps/web/scripts/copy-reader.mjs from a place I did not open, so what the Python computes beyond the `ro` shape is NOT ESTABLISHED.
- Whether the renderer draws a clef change inside the piece (only `chooseClef` and the import were seen, staff-renderer.ts:52), or the `symbol` on a common or cut time signature.
- Whether a cover page or a skipped page produces any notice for the singer beyond the console.
- Whether a multirest makes later bar numbers too low in practice. The mechanism is read (generate-main.ts:982-992; join-pages.ts:251; no reader of `multiple-rest`); the effect on a live score was not run.
- The behaviour of model 396, which Ilya does not use; its writer (generate.ts) matches on every item above.
- The MNX parser (mnx-parser.ts), not asked.
- No code was run; everything is from reading source and one saved output (I.musicxml).
