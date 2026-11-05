# What the two readers give Ilya, and what Ilya keeps (Sonnet helper report r1, 2026-11-05; filed by the desk)

The helper's Write tool refused the file, so the desk filed its report as returned, condensed only where marked. Helper cost 228,694 tokens against 160,000 stated (over by 69k; the desk's sizing error). Code read on `origin/cloud-lane-34` (`05db2dac`). Words-reader evidence from the feasibility probe (`report-desk-row181-read-as-matching-feasibility_r1_2026-11-04.md`). Notes-reader evidence from the five stored m0 captures (Ilya's joined output, first Mussorgsky file only) and homr-web's source (`third_party/homr-web/src/`). Desk check 00:1x: `underlay-tokens.ts:63-69` (letter-share split) and `underlay-recognize.ts:65`, `:74` (parameters and `{blocks:true}`) read and confirmed.

Path prefixes: `omr/` is `apps/web/src/lib/omr/`; `hw/` is `third_party/homr-web/src/`.

## Counts

- Words reader: 24 items observed. Ilya reads 2 (W13 word text, W14 word box), keeps 1 (W13). 8 more API outputs (W25 to W32) not probed.
- Notes reader: 35 items (N3 empty by choice, `ocr:false`). Ilya reads 27; 30 pass into the joined MusicXML.

## 1. The words reader (tesseract.js 7.0.0, `rus_prereform_r2_29000`, psm 7)

Ilya sets `tessedit_pageseg_mode '7'`, `preserve_interword_spaces '1'` (`omr/underlay-recognize.ts:65`), asks `{blocks: true}` (`:74`), keeps word `text` and box (`:55-57`); `pageTokens` keeps `text`, `x0`, `x1` only (`omr/underlay-page.ts:207-214`).

| # | Item | What it says (probe) | Ilya reads? | Keeps? | Helps with |
|---|---|---|---|---|---|
| W1 | page `text` | row as a string | no | no | none seen |
| W2 | page `confidence` | 78 on the probe row | no | no | row choice, beside the dictionary share (`omr/underlay-language.ts:56-66`); untested |
| W3-W4 | version, rotateRadians | | no | no | none seen |
| W5-W6 | block bbox, blocktype | | traversed | no | none seen |
| W7 | block text, confidence | 79 | no | no | row choice, as W2 |
| W8-W10 | paragraph, line bbox/text/confidence, is_ltr | | traversed | no | none seen |
| W11 | line `baseline` | tilt | no | no | none seen for x seating |
| W12 | line `rowAttributes` | rowHeight 39, descenders 5, ascenders 13 | no | no | row choice: text height against a piano cue or tempo mark; untested |
| W13 | word `text` | крас, -, на, я?, ко ... | yes | yes | where the wrong letters arise |
| W14 | word `bbox` | pixel box | yes (x only after `underlay-page.ts:209-211`) | no | already seats; long-dash test (`underlay-tokens.ts:50`) |
| W15 | word `confidence` | misread `ко` (print `по`) 32; right words 82 to 92 | no | no | wrong letters: flags the word to repair against the poem; row choice |
| W16-W17 | word `choices`, `font_name` | one entry; empty | no | no | none seen |
| W18 | symbol `text` | 45 symbols | no | no | token splitting: letters one by one |
| W19 | symbol `bbox` | box per letter | no | no | token splitting (replaces the letter-share split, `underlay-tokens.ts:63-69`); seating by the vowel's own x |
| W20 | symbol `confidence` | misread `к` 90, neighbours 94 to 99 | no | no | names the weak letter; weaker signal than W15 |
| W21 | super/subscript, dropcap | 0 (first symbol) | no | no | none seen |
| W22 | hOCR ranked alternatives (`lstm_choice_mode=2`) | for `ко`: к 85.97, н 78.16, х 64.33, п 60.11 (print's п at rank 4); not probabilities | no | no | wrong letters: the poem's letter scored against the list; none for merged, split, or dropped letters |
| W23 | per-timestep dump (mode 1) | labels do not match | no | no | none (untrustworthy) |
| W24 | TSV | float confidence | no | no | none beyond W15 |

Not given: any dictionary flag, bold, italic, font size, per-word language. Not probed: W25 to W32 (`box`, `unlv`, `pdf`, `imageBinary`, `imageGrey`, `imageColor`, `osd`, `debug`); `imageBinary` alone could show whether the engine saw ink where a note has ink and no reading.

## 2. The notes reader (homr-web 0.2.0-ilya.7, model 465, `ocr:false`)

Argmax decoding only (`hw/transformer/decoder.ts:50-51`): no per-symbol probability exists. Counts over the five captures (773 notes).

| # | Item | Ilya reads? | Kept? | Helps with |
|---|---|---|---|---|
| N1 | `result.musicXml` | yes (`omr/homr-reader.ts:337`) | first part, staff 1 | base |
| N2 | `result.staves[]` | yes | lyric band as fractions | already used |
| N3 | `result.texts[]` | empty, `ocr:false` (`omr/homr-reader.ts:333`) | n/a | none seen |
| N4-N6 | log, backend/time, error | partly | partly | none seen |
| N7-N10 | pitch, rest, duration/type/dot, time-modification | yes | yes | read today |
| N11 | `<grace>` | yes; underlay counts it as a note (`omr/underlay-prepare.ts:123-139`) | yes (4) | seating: a grace note gets a seat candidate today |
| N12 | `<chord/>` | not in underlay path | yes (0) | seating, as N11 |
| N13 | `<voice>` | not in underlay path | yes (766 v1, 7 v2) | second voice sharing a label |
| N14 | `<staff>` | yes | staff 1 | none seen |
| N15 | `imgpos` comment | yes | 773 of 773 | the only note position there is |
| N16-N17 | slur; tie | yes; tie stop only | yes (126; 12) | read today |
| N18-N21 | tuplet, articulations, ornaments, fermata | mostly no | yes | none seen |
| N22-N28 | divisions, key, time, clef, staves, measure number, multi-rest | mostly yes | mostly | none seen |
| N29 | `<print new-system>` | no | yes (61) | systems: homr's own break, Ilya derives systems from staff boxes; untested |
| N30-N35 | barline, repeat, ending, backup, parts, titles | mostly yes | mostly | N33 marks where voice 2 starts |
| N36 | `onVoices` hook (`hw/pipeline/recognize.ts:68,236`) | no | no | second voice: the engine's own voice call before XML |

Not given by homr: dynamics, text directions, beams, stems, lyrics, note or system boxes, any confidence.

## 3. Ignored items that touch the largest losses

1. Word and symbol confidence (W15, W20).
2. Ranked alternatives per letter (W22), with `lstm_choice_mode=2` and hOCR.
3. Symbol boxes and text (W19, W18), replacing the letter-share split.
4. `<voice>`, `<chord>`, `onVoices` position (N13, N12, N36); 7 of 773 notes are voice 2 here.
5. Page and line confidence and text height (W2, W7, W12) for "is this row Russian?". Untested.

## 4. Not established

Model md5 against the shipped one; W25 to W32; whether the probe's plain crop matches Ilya's framed rows (confidences indicative); W23's labels; no raw homr page XML stored; packed homr-web against source; what `seatPage` keeps of word boxes; how the parser uses N18 to N21, N29, N30; the separate poem reader at `apps/web/src/lib/score/ScoreUploader.svelte:372-374`; the loss figures used as given.
