# Report: tuplets of any number, n in the space of m (QUEUE row 56)

Code (Opus), 2026-10-08 into 2026-10-09, on the Mac, branch `Shane`, built on `6b7c3de` (row 54) with row 37's uncommitted scorer change in the tree. Brief: `brief-code-tuplets-of-any-number_r1_2026-10-08.md`, with the desk's three changes (the metre in force in the reading stands for the printed metre; the time-signature measurement, wired into nothing; gates against row 37's baseline). Everything here is uncommitted. Uncommitted work runs on `localhost:5173` only, not on Vercel.

## In one paragraph

Ilya now reads a printed tuplet number of any digit, 2 to 9, two-digit numbers, and the n:m form. It gives the number its space by a convention, and keeps the change only where the bar then fits its metre exactly. On the 17 opened and build songs, Gurilyov «Раскаяние» goes from 149 to 152 of 153, and the other 16 readings are byte for byte as in row 54. A, B, C, E, and F are unchanged. No false number appeared on any negative set. The cost is recall. The real printed 3s are now found 18 times in 40 by the reader alone, and over 10 of the 62 printed groups in the controls, down from row 54's 24. **No real tuplet other than a 3 was found in any score Code may open, so the reader is proven on non-3 digits only against rendered font digits.** The convention for m is a DESK DEFAULT. Gould's Table 2 was not read.

## 1. The digit reader

`apps/web/src/lib/omr/tuplet-digits.ts` (new). A mark is described by:

- **loops**: background regions closed inside its box, of at least 2 percent of it;
- **where the loops sit**, from top to bottom;
- **aspect**: log of height over width;
- **ink by zone**: 6 across by 9 down, relative to the mark's mean ink, after the slant is taken out (each row shifted by the shear its second moments show, so italic digits compare upright);
- **strokes crossed** along 9 rows and 5 columns.

It is compared with known marks (`TemplateMark`), and only marks with the same number of loops are compared. A digit is given only when the nearest known mark is a digit, at most 0.6 away (`MAX_DISTANCE`), and the nearest mark that is not a digit is more than 1.8 times as far (`MIN_MARGIN`). Both thresholds are **JUDGEMENT**, set on the examples below with false answers held at zero.

A word on the page (marks side by side on one line, a colon allowed between them) is read by `readWord` (`tuplet-number.ts:479`):

- one mark is a tuplet number only as 2 to 9;
- two marks make 10 or more;
- a colon splits n:m;
- row 54's 3-shape still counts, but only where no non-digit is nearer than the nearest digit, and where the two readers disagree there is no answer;
- a digit other than 1 more than 2.8 times as tall as it is wide is refused (`:490`).

The bar-level look `lookOverNotes` (`:501`) refuses a word for any of these reasons:

- it is a word of the lyric (a letter beside it on its line, centred or on its baseline);
- it is an 8va-type sign (smaller letters joined on its right);
- it is a letter with a dot above;
- it stands between the staff's second and fourth lines;
- it is within 4 staff spaces of the band's edge;
- it is a figure of a stack: a digit-like mark directly above or below it (`:516`), as in a time signature, a fingering, or a figured bass;
- its row holds a digit-like mark within 4 spaces that does not read the same number (`:526`).

### The examples

| Source | Count | Notes |
|---|---|---|
| SMuFL tuplet digits `tuplet0` to `tuplet9` (U+E880 to U+E889) and `tupletColon` (U+E88A) | 162 per digit | Codepoints read from SMuFL's `glyphnames.json` (the copy in Dorico 5, `/Applications/Dorico 5.app/Contents/Resources/fonts/metadata/glyphnames.json`), not asserted. Nine fonts on this Mac: Bravura, Leland, Finale Maestro, Petaluma, Sebastian, Finale Broadway, Finale Ash, Finale Jazz, and Finale Legacy (Finale Engraver has no tuplet glyphs). Three sizes (staff space 22, 28, and 34 px), each clean, blurred, skewed 4°, with threshold noise, thinner, and thicker. |
| Real printed 3s from opened scans | 40 | Row 54's labelled candidates |
| Real non-numeral marks from opened scans | 137 | Row 54's labelled candidates. The brief says 138; one of row 54's was labelled "unsure" and is left out of both sides. |
| Lyric letters | 1728 | Isolated renders of а б в з и к о с у ч э я and their capitals, in Times New Roman and Georgia (upright, bold, italic, bold italic), at several sizes, clean, blurred, and noisy |
| Music signs | 1020 | SMuFL rests, accidentals, flags, p, m, f, fermata, turn, and trill, from ten fonts |
| Real non-3 tuplets | **0** | None found; see "Could not establish" |

**Shipped templates:** `apps/web/src/lib/omr/tuplet-digit-templates.json` (new), 1401 marks, 299,455 bytes, 74,593 gzipped. It holds:

- 54 per digit 0 to 9: nine fonts at 28 px, six kinds;
- 861 non-digits: the 137 real marks, 384 letters at 52 px (clean and blurred), and 340 music signs at 28 px (clean and blurred).

It is a dynamic import, loaded only when a bar is in doubt.

### The reader on every example: found, missed, false

Each rendered font is held out: its own digits and signs are left out of the templates it is read against. Real non-numeral marks are read with their own song's marks left out. Digits 2 to 9 are read as the app reads a one-mark word. 0, 1, and the colon are read by the reader alone, since a 0 or 1 alone is never a tuplet number.

| Digit | Found | Missed | False |
|---|---|---|---|
| 0 | 29 | 133 | 0 |
| 1 | 61 | 101 | 0 |
| 2 | 64 | 98 | 0 |
| 3 | 136 | 26 | 0 |
| 4 | 66 | 96 | 0 |
| 5 | 93 | 69 | 0 |
| 6 | 60 | 102 | 0 |
| 7 | 92 | 70 | 0 |
| 8 | 80 | 82 | 0 |
| 9 | 81 | 81 | 0 |
| colon (as one mark) | 0 | 162 | 0 |
| real printed 3s | 18 | 22 | 0 |

The colon is found by the word builder (two dots one above the other between numerals, `tuplet-number.ts:274`), not by the reader. It is tested in `tuplet-number.test.ts:333`.

| Negative set | Count | Read as a digit |
|---|---|---|
| Real non-numeral marks | 137 | **0** |
| Music signs (font held out) | 1020 | **0** |
| Lyric letters, isolated | 1728 | **2** (a capital З read as 3, twice). In use, a letter stands in a word and is refused there: **0** of 256 lyric words cut from opened scans in context. |
| Row 54's 293 plain groups (controls) | 293 | **0** numbers over a group's middle, 0 anywhere in the bands |

Positive controls: row 54's 62 printed groups, **10 found** (row 54's shape rule alone found 24). Gurilyov's four groups in bar 25 read [3, none, 3, 3].

**Florid sweep, Dann's library** (`~/Documents/Repertoire & Scores/Scores - vocal/`): 64 pages read with every part, 1957 bars. The pages came from Mozart, Bellini (two), Donizetti (two), Handel (three), Saint-Saëns (two), and Viardot. **24 numbers read, all real tuplet 3s** (Donizetti, Bellini), **0 false.** No printed tuplet other than 3 was found in that sweep, and homr itself marked only 3:2 there.

## 2. The ratio rule and its source

`conventionalSpace` (`apps/web/src/lib/omr/triplets.ts:201`), **DESK DEFAULT, not checked against Gould.** Code cannot read the desk's memo of Gould's Table 2 (p. 203), and does not have the table.

- In simple metre, n is in the space of the next lower power of two: 3:2, 5:4, 6:4, 7:4, 9:8, and so on. A power of two printed alone gets no space and no change.
- In compound metre (beats a multiple of 3, 6 or more, `:190`), 2 and 4 are in the space of 3, and every other n is as in simple metre.
- Where the page prints n:m, the printed m is used (`:316`).

## 3. The bar check

Per the desk's change 1, "the metre printed there" is the metre in force in the reading. Whatever the page step and rules 1 to 3 make of a bar is kept only where the bar then adds up to that metre exactly (`triplets.ts:383` to `:385`: `if (!eq(after, bar)) return unchanged;`). A read digit that does not make the bar fit changes nothing (test `triplets.test.ts:177`).

## 4. The repair rules, generalized

The file stays `triplets.ts` and the function `completeTriplets`, because renaming it would touch its importers and four test files. The rule changes:

- **Page step** (`:313` to `:340`): every number read, any n, sets n:m on the run of n plain notes whose middle is nearest it, within half a note.
- **Rules 1 to 3** keep their refusal to guess. Rule 3 now chooses among runs of 3:2, and in compound metre also 2:3 and 4:3 (`ruleRatios`, `:277`). Where the page has been read, rule 3 takes only runs with a digit-like mark over the run's middle, ±0.6 of a note (`:366` to `:369`).
- **Short bars**: a bar too short is now looked at on the page, because a duplet missed in 6/8 leaves the bar short. The rules still act only on a bar too long (`:308` to `:309`).
- **Grace notes** keep the rules off a bar unless the page has been read over it (`:299`, `:345`).
- **Divisions** are multiplied by the least factor that keeps every changed duration whole (`:386` to `:394`).

## 5. Each change, with path:line

| Where | What |
|---|---|
| `apps/web/src/lib/omr/tuplet-digits.ts` (new) | `loopsOf` `:54`, `upright` `:109`, `featuresOf` `:133`, `distance` `:164`, `MAX_DISTANCE`/`MIN_MARGIN` `:178`, `readDigit` `:192`, `unpack` `:221`, `loadTemplates` `:236` |
| `apps/web/src/lib/omr/tuplet-digit-templates.json` (new) | 1401 templates |
| `apps/web/src/lib/omr/tuplet-number.ts` | header rewritten for rows 54 and 56; `markWords` `:133` (marks to words, colon, refusals); `readWord` `:479`; `lookOverNotes` `:501` (stack `:516`, row `:526`); `lookForTupletNumber` `:546` kept for row 54's callers, now taking templates |
| `apps/web/src/lib/omr/triplets.ts` | `Ratio` `:155`; `compound` `:190`; `conventionalSpace` `:201`; `isRun` `:209`; `onlyRunsThatFill` `:224`; `PageReading` `:256` (numbers with n, m, and place; places of digit-like marks); `makeTuplet` `:263`; `ruleRatios` `:277`; `completeTriplets` `:287` (page step, rules, bar check, divisions) |
| `apps/web/src/lib/omr/join-pages.ts` | `placeOf` `:333`; `LookAtPage` `:344` returns numbers with x and the centres of marks; `fillPlaces` `:353` (fills a note with no image position between its neighbours); `notesAt` `:374`; the look turned into a `PageReading` `:400` to `:410` |
| `apps/web/src/lib/omr/homr-reader.ts` | imports `:38` to `:39`; `Seen` `:158`; `joinLookingAtPages` `:168` (templates loaded once, `lookOverNotes` `:205`); console line "[omr] printed tuplet numbers: looked over N bars, read K" |

Not changed by this row: `tools/e16-harness/src/scan-scorer.ts` and its selftest, which are row 37's uncommitted work and are still in the tree.

## 6. Tests

`apps/web/src/lib/omr`: 113 passed in 10 files. The 23 new tests:

- `tuplet-digits.test.ts` (new, 6): loops, deslant, reading Bravura's 5, 7, 1, and 2, no digit where a non-digit is as near, no digit for a mark near none, no comparison across loop counts.
- `tuplet-number.test.ts` (+5): one digit 2 to 9 and never a 1 alone; two digits and n:m; a word with a non-digit refused; a 5 over a bar's notes; nothing where nothing is printed.
- `triplets.test.ts` (+6): bar 25 with three of four 3s read; bar 7 stands down; the convention; a quintuplet 5:4 (divisions to 20); a duplet in 6/8 (a short bar); a printed 7:6; the bar check refusing.

`join-pages.test.ts` has one expectation changed: the look now receives places filled between neighbours.

## 7. Gates (against row 37's baseline)

| Gate | Result | Baseline |
|---|---|---|
| 1 phonology | 251 passed (251) | same |
| 2 dictionary | 235 passed (235) | same |
| 3 web-check | 0 errors and 12 warnings in 5 files | same |
| 4 web-test | **2035 passed (2035)** | 2012: **moved by 23**, exactly the 23 tests above (22 in the three files at HEAD, 45 now) |
| 5 score-parser | 650 passed, 5 skipped (655) | same |
| 6 blurb | 145 passed (145) | same |
| 7 integration | 55 passed (55) | same |
| 8 ratchets | OK | same |

The script was run from a scratch copy that cannot stage, because of untracked files. After the gates ran, one comment in `tuplet-digits.ts` was corrected (the template list). The omr tests were re-run after it (113 passed), and the type check showed 0 errors.

## 8. Before and after: the 17 opened and build songs

Before: row 54 as shipped (`6b7c3de`), read through the drop box with row 37's scorer. After: this build, local. Only two lines differ:

```
before  gur: webgpu; 149 of 153 right; missing 0; extra 0; pitch misreads 0; length misreads 4; bars read 31 of 31; metre right 29 of 29 bars; score 97.4 PASS
after   gur: webgpu; 152 of 153 right; missing 0; extra 0; pitch misreads 0; length misreads 1; bars read 31 of 31; metre right 29 of 29 bars; score 99.3 PASS
before  Total: 2459 of 2567 right; missing 65; extra 11; pitch misreads 29; length misreads 14; bars read 823 of 849; metre right 666 of 721 bars; score 95.4
after   Total: 2462 of 2567 right; missing 65; extra 11; pitch misreads 29; length misreads 11; bars read 823 of 849; metre right 666 of 721 bars; score 95.5
```

The other 16 readings are byte for byte the same. **No song got worse.** In Gurilyov, the page look read 3 numbers over 2 bars. Other songs were looked over for 1 to 7 bars each and read nothing.

## 9. The five unseen songs, once, never opened

```
A: webgpu; 67 of 69 right; missing 0; extra 0; pitch misreads 2; length misreads 0; bars read 12 of 12; metre right 10 of 10 bars; score 97.1 PASS
B: webgpu; 79 of 79 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 16 of 16; metre right 13 of 13 bars; score 100.0 PASS
C: webgpu; 126 of 126 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 17 of 17; metre right 11 of 15 bars; score 100.0 PASS
E: webgpu; 230 of 231 right; missing 0; extra 0; pitch misreads 1; length misreads 0; bars read 50 of 50; metre right 46 of 46 bars; score 99.6 PASS
F: webgpu; 81 of 85 right; missing 0; extra 0; pitch misreads 4; length misreads 0; bars read 20 of 20; metre right 20 of 20 bars; score 95.3 PASS
```

All five readings are byte for byte as at row 52. One song was looked over for 3 bars, and nothing was read.

## 10. The added measurement: time-signature figures (wired into nothing)

### Rendered

The SMuFL time-signature glyphs `timeSig0` to `timeSig9` (U+E080 to U+E089), `timeSigCommon` (U+E08A), and `timeSigCutCommon` (U+E08B), codepoints from the same `glyphnames.json`. They were rendered as in step 2 in ten fonts (Finale Engraver has them), 3 sizes, and 6 kinds: 180 each. The templates are the shipped ones, which include no time-signature glyph.

| Figure | Reader alone: found / missed / false | As a one-mark tuplet word: found / missed / false |
|---|---|---|
| 0 | 57 / 123 / 0 | 0 / 180 / 0 (never a tuplet number) |
| 1 | 122 / 58 / 0 | 0 / 180 / 0 (never alone) |
| 2 | 154 / 26 / 0 | 154 / 26 / 0 |
| 3 | 113 / 64 / **3** (read 9) | 169 / 8 / **3** |
| 4 | 157 / 23 / 0 | 157 / 23 / 0 |
| 5 | 154 / 26 / 0 | 154 / 26 / 0 |
| 6 | 135 / 45 / 0 | 135 / 45 / 0 |
| 7 | 136 / 44 / 0 | 136 / 44 / 0 |
| 8 | 157 / 23 / 0 | 157 / 23 / 0 |
| 9 | 161 / 19 / 0 | 161 / 19 / 0 |
| C (common time) | never taken for a digit (0 of 180) | 0 of 180 |
| cut C | never taken for a digit (0 of 180) | 0 of 180 |

### Printed, in the 17 opened and build songs

Each signature place in row 37's Part A table was measured: 32 windows, from the bar's first note back to 9 staff spaces before it (16 at bar 1), and 4.5 spaces above and below. 29 windows hold their signature. At bar 1 of Kabalevsky 4, 6, and 7, the window does not reach the signature.

| Song, bar | Printed (row 37) | Read by the reader alone | Bar-level look |
|---|---|---|---|
| Tchaikovsky 1 | 3/8 | none (2 marks, no digit) | none |
| *Sunless* 1, bar 1 | 6/4 | none | none |
| *Sunless* 4, bar 22 | 2/4 | **2** (the top figure) | **2** (its 4 was not found, so the stack rule could not refuse it) |
| Kabalevsky 1, 2 | 3/4, 2/4 | none | none |
| Kabalevsky 4, bars 14, 35 | 3/4, 2/4 | none | none |
| Kabalevsky 6, bars 20, 22 | 2/4, 2/4 | none | none |
| Kabalevsky 6, bar 23 | a whole bar again (row 37; whether 4/4 or C is printed was not looked at there) | **4** (100 px below the first note, where a lower figure of 4/4 would stand) | refused (stacked) |
| Kabalevsky 7, bar 1 | 6/8 | window missed it | none |
| Kabalevsky 7, bars 47, 48 | 9/8, 6/8 | none | none |
| Kabalevsky 8, 9, bar 1 | 4/4, 4/4 | none | none |
| Kabalevsky 9, bar 30 | 3/2 | **2** (the bottom figure) | refused (stacked) |
| Kabalevsky 10 | 3/4 | none | none |
| Grechaninov 1, 10 | 2/4, 6/8 | none | none |
| Varlamov 1 | 3/8 | none | none |
| Gurilyov 1 | C | none | none |
| The other bars marked "a whole bar" or "a half-note bar" in row 37 (*Sunless* 4 bars 1 and 23, 5, 6; Kabalevsky 3, 4 bars 1, 16, 36; Kabalevsky 6 bars 1, 21) | not looked at in row 37 (C or 4/4 unknown) | none | none |

Counted as figures, about 46 printed digits were in reach, and the reader found 3 of them, with **0 false**. The C was never taken for a digit. **Nothing else at the start of a bar was taken for a figure**: no clef, key-signature accidental, rest, or lyric mark in any window read as a digit.

The one number that survives the bar-level look, *Sunless* 4 bar 22's top 2, stands before the bar's first note, over no run, so it changes nothing. The reader is a poor time-signature reader as it stands. On real scans it misses 43 of about 46 figures.

## Could not establish

- **No real tuplet other than a 3.** No opened or build song prints one: the truth files of the 17 show only thirds (*Sunless* 5, Kabalevsky 2, Gurilyov, Varlamov). A duplet in compound metre (2 in the space of 3) gives durations a truth file cannot tell from plain dotted values, so the truth files cannot rule duplets out. The florid sweep of 64 pages found only 3s. The brief's duplets (Zhitomirsky «Белая луна», 12/8) are in the final test, which was not opened. **So the reader's work on 2, 4, 5, 6, 7, 9, and two-digit numbers is shown only on rendered font digits, NOT ESTABLISHED on any real scan.**
- **Gould's Table 2 was not read.** `conventionalSpace` is a DESK DEFAULT.
- **The degradation set has no staff line through the digit**, which the brief named. The renders have blur, skew, noise, thin, and thick. The app takes thin long strokes out before reading (`tuplet-number.ts:150`), but that was not measured on rendered digits with a line through them.
- **Recall is lower than row 54's.** 10 of 62 printed groups are found, against 24. The reader on real 3s finds 18 of 40. Gurilyov still gains, because its bar 25 needs only three of its four 3s and rule 3 chooses the fourth. Whether lower recall costs any song in the final test is NOT ESTABLISHED.
- **Thresholds** (0.6, 1.8, 2.8, 4 spaces, ±0.6 of a note, the band of 7 by 8 spaces) are JUDGEMENT, set on these examples, with false answers held at zero.
- **Font licences.** Petaluma, Sebastian, and the Finale fonts were rendered to make templates that ship as features (numbers, not glyph images). Whether that use is within each font's licence is NOT ESTABLISHED. Bravura, Leland, and Petaluma are SIL Open Font Licence by their makers' statements, but the licence files were not read in this row.
- **A codepoint discrepancy, not acted on.** `tools/e16-harness/reader/timesig.py:56` to `:59` names SMuFL `timeSigPlus` as U+E08D. `glyphnames.json` (Dorico 5's copy) gives `timeSigPlus` U+E08C and `timeSigPlusSmall` U+E08D. This row did not change `timesig.py`.
- **The time-signature table's per-figure count** ("about 46") was counted from row 37's table. The bars it lists only as "a whole bar" are not known to print C or 4/4.
- **Not deployed.** Every reading here is local: drop box on `localhost:5173`, Chrome headless, WebGPU.
- `heldout2` was never opened. A, B, C, E, and F were never opened or viewed. Each gave one line through a script.
