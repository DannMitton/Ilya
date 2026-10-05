# Report: the checks over homr's output, measured

> **Provenance, added by the desk (Fable), 2026-10-05 03:50.** Serves `STATE.md`, the close of 2026-10-05, "After the wiring, in this order", item 1, and Dann's direction of 2026-10-04 23:35. Brief: `brief-opus-the-checks-measured_r1_2026-10-05.md`. An Opus subagent in the desk's cloud workspace, 03:16 to 03:36. Cost: 372,233 tokens, 101 tool uses, 22 minutes (the desk had named 500,000 and 90). It measured only; nothing in Ilya changed. **The desk copied the helper's final message here from its transcript, as returned. Its claims are its own.** The desk checked: the keys that the page 3 fixture states (the voice part states 3 sharps at its first measure and 2 at its ninth; the piano part 2), and that the three Tchaikovsky fixtures hold no `<accidental>` element (both read by the desk's own script from `apps/web/src/lib/omr/fixtures/`); the picture of the footnote on `sun-05` (looked at). The desk did not re-run the helper's scripts. The scripts, tables, joined readings, and crops are in `measure-checks_r1_2026-10-05/` beside this file, and in `~/Downloads/_desk-2026-10-05/checks-measured_r1_2026-10-05.tgz`. **The table that answers Dann's question of 01:03 is this report's section "The carry-over table", and `measure-checks_r1_2026-10-05/carry-over-table.md`.**
>
> **What this changes, decided by the desk.** `STATE.md` had the bar check first among the checks, on a count made on the older build's readings (21 flagged bars holding 39 of 48 differences). On the newer build's readings the bar check finds 14 of the 56 differences and none of the 15 pitch misreads. Of those 15, 14 are accidentals (8 printed double sharps, 4 naturals, 1 sharp with no printed sign, 1 under a misread key), and 34 of the 35 extra notes and rests are one footnote that homr read as part of the song. So the order of the work after the wiring changes: see `STATE.md`, the note of 2026-10-05 about 04:00.

*Ran `date` at the start (03:16:00 EDT) and at the close (03:36:02 EDT). Nothing in Ilya was changed and nothing was committed.*

## Summary

1. **Baseline.** On the five build songs, model 465 gets 786 of 805 printed notes present with the right pitch and the right length (97.64 in 100). The scorer finds 56 differences:
   - 15 wrong pitches;
   - 4 wrong lengths;
   - 1 wrong rest length;
   - 1 missing rest;
   - 35 extras: 27 notes and 7 rests from page sun-05's footnote, plus 1 ossia note on sun-11.
2. **The 8 extra bars of *Sunless* 5** are bars 5 to 12 of the reading, all on page sun-05. They are the footnote printed small under the song, which gives the autograph's first sketch of the opening. homr reads them as part of the song. Every later bar of the reading is 8 bars off the truth.
3. **The bar check (corrected rule)** flags 6 of 270 bars. 5 of them hold a difference. 1 is a false flag: *Sunless* 4 bar 22, where the page prints 2/4 and the reading says 4/4. The flagged bars hold 14 of the 56 differences. The other 42 sit in bars that pass: 15 pitch, 25 extra, 1 missing, 1 length.
4. ***Sunless* 5 on the 465 readings:** 4 of 69 bars are flagged, not 74 of 78.
   - Bar 1: a triplet read without its tuplet.
   - Bars 9 and 11: footnote bars.
   - Bar 65: an ossia note read as a second voice.

   The cause of the old count on homr 0.7.0 is NOT ESTABLISHED.
5. **Metre.** Model 465 has time-signature tokens for the bottom number only. homr's writer sets the top number to the median bar length of that part on that page. This produces 1 misread metre in the voice parts (*Sunless* 4 bar 22). In the piano part it produces 5/4 or 6/4 on 7 pages where the page prints C.
6. **Keys.** The 20 pages hold 44 key statements, which give 142 part-systems. 4 part-systems are misread: 1 voice and 3 piano.
   - Rule (iii), "differs from the song's majority": 4 right, 0 false, 0 missed.
   - Rule (i) as written: 1 right, 18 false.
   - Rule (ii), voice staff: 1 right, 3 false.
7. **A misread key changes the pitch, not only the drawing.** On the Tchaikovsky, 17 voice notes sit under the misread three-sharp key (reading bars 63 to 70). The 1 note on G is written G sharp (`<alter>1</alter>`). That note is the scorer's pitch difference at truth bar 67.
8. **All 15 pitch differences are on the truth's own step.**
   - 14 are misreads of the accidental only:
     - 8 printed double sharps, or their carry within the bar;
     - 4 printed or carried naturals read as sharps;
     - 1 sharp where nothing is printed;
     - 1 from the misread key.
   - In 1 (*Sunless* 5, reading bar 60) the reading follows the page, which prints E sharp, and the truth file holds E.
9. **homr writes no `<accidental>` on any of the 20 pages.** Its `<alter>` is the model's lift token copied as is. On 19 of the 20 pages (all but tch-1, which has no lift-token file), the voice notes' lift tokens are: 393 sharp, 380 none, 21 flat, 0 double sharp, 0 natural.
10. **The accidental rule on the reading alone** flags 182 of 834 voice notes: 5 right, 171 false, 6 on extra notes.
11. **4e check 1 ("the parts of a page must hold the same number of bars")** flags 1 page of 20 (sun-05). It is right, with 0 false flags.
12. **4e check 2 (a double sharp beside the note, from the page image).**
    - With Ilya's own bounds: 0 of 8 printed double sharps found, 35 false flags.
    - With the helper's four-lobe variant: 4 of 8 found, 1 false flag.

    The variant was tuned on these same songs.
13. **The carry-over table** has 13 rows: 7 from the memo and 6 the helper's own. 1 line citation in the memo differs from the code, and 1 memo statement needed adding to.

## 4a. The baseline

**What was run.**
- Each song's pages were joined with Ilya's `joinPages`, unchanged (`join.mts`). The input was the port's output (`port-465-out/`) for tch-2, tch-3 and sun-01 to sun-17, and desktop main's output (`reference-desktop-main/`) for tch-1, where the kit has no port output. The kit's `cmp.py` printed EQUAL for desktop tch-1 against the port's Node run of tch-1 (`proof/node-run/tch-1.musicxml`). It printed DIFFERENT for tch-2, sun-05 and sun-16, and EQUAL for the other 16 pages.
- The joined parts were then put through `conv.py` and `score.ts full`, both unchanged.

| Song | Truth bars / read bars | Notes truth / read | Missing / extra | Pitch right / wrong | Length right / wrong | Rests truth / read / matched / length right | Score | Octave shift |
|---|---|---|---|---|---|---|---|---|
| Tchaikovsky | 99 / 99 | 174 / 174 | 0 / 0 | 172 / 2 | 174 / 0 | 48 / 48 / 48 / 48 | 98.85 | 0 |
| *Sunless* 1 | 18 / 18 | 96 / 96 | 0 / 0 | 96 / 0 | 94 / 2 | 19 / 19 / 19 / 19 | 97.92 | 12 |
| *Sunless* 4 | 29 / 29 | 116 / 116 | 0 / 0 | 116 / 0 | 116 / 0 | 29 / 29 / 29 / 29 | 100 | 0 |
| *Sunless* 5 | 61 / 69 | 258 / 286 | 0 / 28 | 250 / 8 | 256 / 2 | 48 / 54 / 47 / 46 | 96.12 | 12 |
| *Sunless* 6 | 55 / 55 | 161 / 161 | 0 / 0 | 156 / 5 | 161 / 0 | 26 / 26 / 26 / 26 | 96.89 | 12 |
| **Total** | 262 / 270 | 805 / 833 | 0 / 28 | 790 / 15 | 801 / 4 | 170 / 176 / 169 / 168 | 97.64 | |

**Every difference.** "Truth bar" is the truth's `measureIndex`, counted from 0, as the scorer prints it. "Reading bar" is the joined measure number, counted from 1.

- **Tchaikovsky**
  - Pitch, truth bar 35, reading bar 36: D read as D sharp.
  - Pitch, truth bar 67, reading bar 68: G read as G sharp.
- ***Sunless* 1**
  - Length ×2, truth bar 16, reading bar 17: two dotted quarters written as halves.
- ***Sunless* 5**
  - Rest length and length, truth bar 0, reading bar 1: a triplet eighth rest and triplet quarter, written as plain eighth and plain quarter.
  - Pitch ×2, truth bar 1, reading bar 2.
  - Pitch at truth bars 14, 22, 26, 29, 33 and 51: reading bars 23, 31, 35, 38, 42 and 60.
  - Missing rest and length, truth bar 42, reading bar 51: an eighth rest dropped and an eighth written as a quarter.
  - Extras in reading bars 5 (4), 6 (5), 7 (6), 8 (6), 9 (6), 10 (1), 11 (3), 12 (3) and 65 (1).
- ***Sunless* 6**
  - Pitch at truth bars 20, 21, 22, 35 and 43: reading bars 21, 22, 23, 36 and 44.

**How a truth bar was matched to a bar of the reading.**
- The scorer aligns the two event sequences. Each pair of aligned events gives a truth bar and a reading bar.
- A missing event is put in the reading bar that holds most of the matched events of its truth bar.
- The offset (reading bar minus truth bar) is 0 throughout four songs.
- On *Sunless* 5 the offset is 0 for truth bars 0 to 3 and +8 for truth bars 4 to 58. Reading bars 5 to 12 hold no matched event. The two counts of bars differ only on that song: 61 against 69.
- The script check `lib.py` asserts that its own events equal `conv.py`'s, one for one, on all five songs. It passed.

**Evidence for the footnote.** `evidence/sun-05-small.png` shows the footnote. The first extra rest's `imgpos` is (463, 3289), which is inside the footnote. Table: `4a-differences.csv`.

## 4b. The bar check

Script: `barcheck.py`. Each bar is summed from written lengths (type, dots and time-modification, as `conv.py` counts them) against the metre in force in the reading.

**How each case is treated, and how often it occurs**

| Case | Treatment | Count |
|---|---|---|
| First bar | Passes when it is short but not empty. | 5. 4 are empty. *Sunless* 5 bar 1 is long (9/8) and is flagged. The short-first-bar allowance was used 0 times. |
| Last bar and its complement | Passes if full, or if it and bar 1 make one full bar. | 5. 2 full, 3 empty. The complement was used 0 times. |
| Repeat sign or double bar inside a song | A double bar (`light-light`, `light-heavy`, `heavy-heavy`) or a `<repeat>` makes the bar before it a "last" bar and the bar after it a "first" bar. | 0 in the joined voice parts. See below for what homr writes. |
| Change of metre | "Full" follows the `<time>` in force. | 1 stated inside a song: *Sunless* 4 bar 22 (4/4 written where the page prints 2/4). |
| Tuplets | `time-modification` scales the length. | 2 bars, *Sunless* 5 bars 6 and 17. Both add up. |
| Grace notes | Left out of the sum. | 0. |
| Chords | Chord notes are left out of the sum. | 1 bar, *Sunless* 5 bar 10 (footnote). |
| `<backup>` or `<forward>` | Summed per `<voice>`; the longest voice is the bar's length. | 1 bar, *Sunless* 5 bar 65. 0 `<forward>`. |
| Empty bar | homr wrote only rests and the join dropped them. Passes as voice silent; homr's pre-join rests are summed apart, and a single whole rest counts as full. | 29: Tchaikovsky 16, *Sunless* 1 1, *Sunless* 4 2, *Sunless* 5 3, *Sunless* 6 7. |
| Bar of rest shorter or longer than the metre | Counted; passes as an empty bar. | 1: *Sunless* 1 bar 1, rests summing 3/4 in 6/4. |
| `<ending>` | Counted, not treated as a boundary. | 2: *Sunless* 4 bars 6 and 23. |
| Bar marked free | Cannot be known from the reading. | None counted. |

Notes on the cases:
- **What homr writes for a double bar.** `<barline location="right"><bar-style>light-light</bar-style></barline>` (sun-04, part 2, measure 10), and `heavy-heavy` at each song's end. No `<repeat>` appears on any of the 20 pages. At sun-04 bars 22 to 23 the page prints a double bar in the voice too, but the model gave the voice staff a plain `barline` token (x 1878 in the port's raw output), so no barline element was written.
- **The `<ending>` at *Sunless* 4 bar 23** comes from a `voltaStart` token at x 2020, where the page prints C after the double bar (`evidence/sun-04-b21-23.png`).
- **Two ways of summing.** Sums from written lengths and from `<duration>` differ in 0 bars on all five songs.

**Results**

| Song | Bars | Flagged | Hold a difference | False flags | Differences in no flagged bar |
|---|---|---|---|---|---|
| Tchaikovsky | 99 | 0 | 0 | 0 | pitch 2 |
| *Sunless* 1 | 18 | 1 (bar 17, 7/4 in 6/4) | 1 | 0 | none |
| *Sunless* 4 | 29 | 1 (bar 22, 1/2 in 4/4) | 0 | 1 | none |
| *Sunless* 5 | 69 | 4 (bars 1, 9, 11, 65) | 4 | 0 | pitch 8, extra 25, missing 1, length 1 |
| *Sunless* 6 | 55 | 0 | 0 | 0 | pitch 5 |
| **Total** | 270 | 6 | 5 | 1 | pitch 15, extra 25, missing 1, length 1 |

**The false flag.** *Sunless* 4 bar 22 (sun-04 m10) holds A4 quarter, F sharp 4 eighth, A4 eighth, which is 1/2. All of them are read as printed. The page prints 2/4 there. The model's token at x 1414 is `timeSignature/4`, and the writer made it 4/4.

**Why *Sunless* 5's bars are flagged, with evidence**
- **Bar 1.** It holds half rest, quarter rest, eighth rest and D sharp 4 quarter: 9/8. The truth holds a triplet: a 1/12 rest and a 1/6 note. So the tuplet was misread.
- **Bars 9 and 11.** These are footnote bars: F sharp 4, F sharp 4, E sharp 4, F sharp 4, D sharp 4, D sharp 4 summing to 7/8, and three G4 quarters summing to 3/4.
- **Bar 65.** homr read a small E5 above the sung F sharp 4 dotted half as voice 1 (`evidence/sun11-b65.png`), with two `<backup>` elements between the voices. The longest voice is 3/4.

The metre the reading states for the voice is 4/4 on all seven pages, matching the page's C. A misread metre is not the cause on these readings.

**What a separate metre check would have to look at.** homr never reads a time signature's top number:
- the model's tokens are bottom numbers only (`homr-web/src/transformer/vocabulary.ts:479-488`);
- the writer sets beats from the median bar length of the page's part (`generate-main.ts:131-165`, `:979-990`, `:1026-1035`).

So a metre check needs the page image at the signature, which `<time>` gives no `imgpos` for. A `<time>` that appears inside a song in the reading marks a place where the model saw a sign: 1 case, *Sunless* 4 bar 22.

**Hand check, on *Sunless* 5, from the raw MusicXML of `out/joined/sun5.musicxml`.** Lengths are in quarters.
- **Flagged bar 1:** 2 + 1 + 0.5 + 1 = 4.5 (durations 24+12+6+12 = 54 at 12 per quarter). Long.
- **Flagged bar 9:** 0.5 + 0.5 + 0.25 + 0.25 + 1.5 + 0.5 = 3.5. Short.
- **Flagged bar 65:** voice 1 is 1.5 + 1 = 2.5; voice 2 is 3. The longest is 3. Short.
- **Unflagged bar 2:** 1 + 0.5 + 0.5 + 1.5 + 0.5 = 4.
- **Unflagged bar 6:** 1 + 1 + 1 + 2/3 + 1/3 = 4.
- **Unflagged bar 10:** a whole note, with the chord note left out = 4.

All six agree with the script.

## 4c. The key check

Script: `keycheck.py`. The unit is one part on one system of one page. homr writes one `<key>` per part, so a piano part's two staves always share one key.

**What the truth holds.** Each truth file holds one key per song (`keySignature.fifths`) and no key change.

**Every key stated, by page and part (measure:fifths), against the truth's key**

| Pages | Voice part | Piano part | Truth |
|---|---|---|---|
| tch-1, tch-2 | 1:2 | 1:2 | 2 |
| tch-3 | **1:3**, 9:2 | 1:2 | 2 |
| sun-01 to sun-04 | 1:2 | 1:2 | 2 |
| sun-05 to sun-11 | 1:0 | 1:0 | 0 |
| sun-12 | 1:7 | **1:5**, 4:7, **7:5** | 7 |
| sun-13 to sun-16 | 1:7 | 1:7 | 7 |
| sun-17 | 1:7 | 1:7, **7:5** | 7 |

- 44 statements in all, 4 of them misread.
- Misread part-systems:
  - Tchaikovsky: 1 of 22, the voice on tch-3 system 1.
  - *Sunless* 1: 0 of 12.
  - *Sunless* 4: 0 of 14.
  - *Sunless* 5: 0 of 50.
  - *Sunless* 6: 3 of 44, the piano on sun-12 systems 1 and 3 and sun-17 system 3.
- I checked all four against the page in `evidence/keys-montage.png`: tch-3 prints 2 sharps, and sun-12 and sun-17 print 7.

**The candidate rules** (flags / right / false / missed)

| Rule | Tchaikovsky | *Sunless* 6 | Others | Total |
|---|---|---|---|---|
| (i) as written: a later statement anywhere restores the old key | 1 / 1 / 0 / 0 | 18 / 0 / 18 / 3 | 0 | 19 / 1 / 18 / 3 |
| (i), restoring statement on the same page | 1 / 1 / 0 / 0 | 0 / 0 / 0 / 3 | 0 | 1 / 1 / 0 / 3 |
| (ii), the voice staff differs from both piano staves | 1 / 1 / 0 / 0 | 3 / 0 / 3 / 3 (the misreads are piano) | 0 | 4 / 1 / 3 / 3 |
| (ii), every staff of a disagreeing system | 2 / 1 / 1 / 0 | 6 / 3 / 3 / 0 | 0 | 8 / 4 / 4 / 0 |
| (iii), differs from the song's majority | 1 / 1 / 0 / 0 | 3 / 3 / 0 / 0 | 0 | 4 / 4 / 0 / 0 |

Why rule (i) as written fails: the piano's key in force at the end of sun-12 was itself a misread (5 sharps), so the correct readings on sun-13 to sun-17 count as departures from it.

**Which rule finds the misread keys with no false flag.** Rule (iii) alone, on these 20 pages. Combining (ii, every staff) with (iii) gives the same flags.

**What a misread key does to the notes.** The writer copies the model's lift token to `<alter>` (`generate-main.ts:453-460`); it does not apply the key itself. Under the misread three-sharp key (joined bars 63 to 70, the key restored at bar 71), the one G is written with `<alter>1</alter>`, so the pitch changes. Tables: `4c-keys.csv`, `4c-rules.csv`, `4c-notes-under-misread-key.csv`.

## 4d. An accidental must have a source

Script: `acccheck.py`.

**Part 1: does each pitch difference lie in the accidental only?** All 15 lie within two semitones of the reading's own written step. I checked each against the page (`evidence/pitchdiffs.png`, numbered in the order of `4d-pitch-differences.csv`, plus the zooms).

| Song, reading bar | Read | What the page prints | Kind |
|---|---|---|---|
| Tchaikovsky 36 | D sharp | D, no sign | sharp with no printed sign |
| Tchaikovsky 68 | G sharp | G, under the misread key | key misread |
| *Sunless* 5, 2 (two notes) | C, C | double sharp C, then C carried | double sharp missed |
| *Sunless* 5, 35 | C | double sharp C | double sharp missed |
| *Sunless* 5, 38 | G | double sharp G | double sharp missed |
| *Sunless* 5, 23 | G sharp | natural G | natural read as sharp |
| *Sunless* 5, 31 | C sharp | natural C | natural read as sharp |
| *Sunless* 5, 42 | G sharp | natural G | natural read as sharp |
| *Sunless* 5, 60 | E sharp | E sharp (the truth file holds E) | not a misread |
| *Sunless* 6, 21 | F | double sharp F | double sharp missed |
| *Sunless* 6, 22 | G sharp | double sharp G | double sharp missed |
| *Sunless* 6, 23 | G sharp | double sharp G | double sharp missed |
| *Sunless* 6, 44 | G sharp | double sharp G | double sharp missed |
| *Sunless* 6, 36 | B sharp | B, natural carried from earlier in the bar | natural read as sharp |

**What homr writes that tells you a sign was printed: nothing.**
- 0 `<accidental>` elements on 20 pages.
- `<alter>` is the learned sounding alteration: 19 of 24 voice notes on sun-12 carry a lift `#` on steps the key sharpens.

**Part 2: the rule, measured on the reading alone.** A note is flagged when its alteration differs from both the key and the latest earlier note on the same step and octave in its bar.

| Song | Notes | Flags | Right | False | On extra notes |
|---|---|---|---|---|---|
| Tchaikovsky | 174 | 7 | 1 | 6 | 0 |
| *Sunless* 1 | 96 | 16 | 0 | 16 | 0 |
| *Sunless* 4 | 116 | 20 | 0 | 20 | 0 |
| *Sunless* 5 | 287 | 99 | 2 | 91 | 6 |
| *Sunless* 6 | 161 | 40 | 2 | 38 | 0 |
| **Total** | 834 | 182 | 5 | 171 | 6 |

- The rule flags 5 of the 15 pitch differences: Tchaikovsky 36, *Sunless* 5 bars 31 and 60, *Sunless* 6 bars 21 and 36. One of the 5 (*Sunless* 5 bar 60) is the case where the reading follows the page.
- **Hand check, Tchaikovsky.** Bar 40 holds G sharp then G natural. The scorer finds both right, and the rule flags both: every chromatic note is flagged because the reading carries no printed sign.

## 4e. Two more checks

**Check 1: the parts of a page must hold the same number of bars.** Reading alone; script `partbars.py`.
- 1 of 20 pages is flagged: sun-05, where part 1 has 12 bars and part 2 has 11. That page holds 34 extra events, so the flag is right.
- 0 false flags.
- 2 pages with one extra or missing event are missed: sun-10 and sun-11.
- A related count from the same run: a `<chord/>` or `<backup>` in the joined voice part occurs in 2 bars (*Sunless* 5 bars 10 and 65). Both hold an extra note; 0 false.

**Check 2: a double sharp beside the note.** Page image plus `imgpos`; script `dsharp.py`. 8 of the 15 pitch differences are printed double sharps.

| Version | Found (of 8) | False flags |
|---|---|---|
| v1, Ilya's `classify_compact` bounds | 0 | 35 (plus 5 on extra notes) |
| v2, helper's four-lobe variant | 4 (*Sunless* 5 bars 2, 2, 35, 38) | 1 |
| v3, one last widening | 4 | 2 |

- Why v1 finds none: this edition's double sharp has a fill of 0.74 to 0.79 (`evidence/dbg3.png`), outside Ilya's 0.28 to 0.62. And `imgpos` lands 6 to 32 px from the head, so Ilya's head test cannot be fed from it.
- v2 and v3 miss all 4 on *Sunless* 6.
- v2 and v3 were tuned on these songs. No held-out count exists.

## The carry-over table

Every `path:line` was opened by me in `/home/claude/wire-465/ilya` (commit 94e5246, working tree dirty with the step-1 changes; the memo read b2106d09). `reader/` means `tools/e16-harness/reader/`; `homr-web` means `third_party/homr-web/src/`.

| # | Technique | Where (opened) | homr misread it would catch | Needs | Risk of false flags, and why | Section 4 says | Source |
|---|---|---|---|---|---|---|---|
| 1 | Key from the singer, accidental carried by letter and octave, carry reset each bar | `reader/reader.py:1536-1542`, `:2009`, `:2015-2025` | A note whose alteration has no source in the key, its bar, or a printed sign | Image and each note's place: homr writes no `<accidental>`, and `<alter>` is the lift token (`homr-web/musicxml/generate-main.ts:453-460`) | Very high on the reading alone, because every chromatic note lacks a visible source. With signs read from the image: NOT ESTABLISHED | 4d: 182 flags, 5 right, 171 false | memo |
| 2 | Printed accidental named by structural rule (sharp or natural by overhang, double sharp as a compact sign, double flat) | `reader/reader.py:1618-1648` (window `:1625-1626`), `:1556-1565`, `:1595-1604`, `:1606-1615` | Printed double sharps missed (8 of 15 pitch differences); naturals read as sharps (4 of 15) | Image and place | High as written for this edition: the fill bound at `:1614` excludes its double sharp, and Ilya's head test cannot be fed from `imgpos` | 4e: v1 0 of 8 found, 35 false; helper variant 4 of 8, 1 false (tuned here) | memo |
| 3 | Bar-integrity flag, flag only; the first bar may be short; an empty bar abstains | `reader/run_page2.py:602-661` | A length misread that changes the sum, a foreign bar, a second voice | Reading and a metre | Low here: 1 false in 270 bars, caused by homr's metre. Blind to 42 of 56 differences | 4b: 6 flagged, 5 right, 1 false | memo |
| 4 | Metre never inferred from bar sums (`tuplet_catch` struck: "inverts on exactly the pages where the validator is most needed") | `reader/run_page2.py:564-580` (`:566-567`) | None by itself. It warns that homr's numerator is the page median (`homr-web/transformer/vocabulary.ts:479-488`; `generate-main.ts:131-165`, `:979-990`, `:1026-1035`) | n/a | A bar check against homr's metre checks each bar against its own page's median, so a printed metre change becomes a false flag | 4b: *Sunless* 4 bar 22 | helper |
| 5 | Time signature read after every barline | `reader/timesig.py:637-669`, `:671-700` | The numerator homr does not read | Image; the place is between the neighbouring notes' `imgpos` | NOT ESTABLISHED (not run) | 4b: 1 case | helper |
| 6 | Key signature per system; the page's answer is the systems' majority | `reader/clefkey.py:534-562`, `:623-674` (`:633`) | Misread keys (4 of 142 part-systems) | Reading, for rule (iii); image, for Ilya's own read | Low here. Fails on a real key change, or where most systems are misread | 4c: rule (iii) 4 right, 0 false | helper |
| 7 | Voice staff chosen by engraving rules, tacet as an outcome | `reader/reader.py:991-1048` | A wrong staff taken as the voice | Image | NOT ESTABLISHED: no misselection occurred on these 20 pages | none | memo |
| 8 | Staves traced at one staff space per page (within 0.18 s) | `reader/reader.py:596-598`, `:632` | A footnote system read as the song (sun-05: 8 bars, 27 notes, 7 rests) | Image | Whether Ilya drops the small staves: NOT ESTABLISHED. Line gaps measured: 16 px against 30 to 32 px, 24 gaps on sun-05 and 10 on sun-07 | 4e check 1 (reading stand-in): 1 right, 0 false | helper |
| 9 | Two heads on one stem merged (ossia) | `reader/reader.py:1243-1254` (`:1245`), `:1255-1323` | An ossia note read as a second voice (*Sunless* 5 bar 65) | Image; the stand-in needs the reading only | Low here. Real double stops or divisi in the voice would flag | 4e stand-in: 2 bars, both right | helper |
| 10 | Barlines from voice and piano witnesses | `reader/reader.py:1942-2003` | Moved or missing voice barlines | Image | NOT ESTABLISHED. No moved barline except the footnote; homr dropped the voice's double bar on sun-04 | 4a offsets | memo |
| 11 | Length from stem strokes and dot | `reader/shape.py:203-224`, `:226-240` (filled stemmed heads only, `:227`) | *Sunless* 1 bar 17; *Sunless* 5 bar 51 | Image and place | NOT ESTABLISHED. It abstains outside filled stemmed heads | 4a: 4 lengths, 1 rest length, 1 missing rest | memo |
| 12 | Rests by font template | `reader/run_page2.py:195-217` | A rest misread or dropped | Image | High miss rate: the memo reports 10 of 48 rests on the Tchaikovsky. A triplet's rest is not seen | 4a | memo |
| 13 | Clef with octave sign read as a glyph, octave change applied | `reader/clefkey.py:663-671` (`:671`), `reader/reader.py:1056-1062`, `:1485` | A voice part an octave off: model 465 has no octave-transposing clef token (`homr-web/transformer/vocabulary.ts:453-463`) | Image | NOT ESTABLISHED | 4a: shift 12 on *Sunless* 1, 5 and 6 | memo |

**Where the memo and the code differ**
- The memo cites the carry at `reader.py:2016-2027`; in this tree the code has it at `:2015-2025`.
- The memo says the envelope "carries metre, key, clef, voice staff" (memo line 138). The code agrees that it carries them, but only metre and grouping are read from ink. Key, clef, octave change and voice staff are config pass-through cells (`reader/envelope.py:48-61`, the sentence at `:50`). So a key check comes from `clefkey.py`, not from the envelope.
- I found no other disagreement at the lines I opened.

## NOT ESTABLISHED

- **The cause of the old 74-of-78 count on homr 0.7.0.** No 0.7.0 reading is on disk: `find` for Sunless 5 MusicXML returned only the kit's 465 readings.
- **Whether the pages print an 8 under the voice clef** on *Sunless* 1, 5 and 6, where the octave shift is 12.
- **What homr read as a volta start at *Sunless* 4 bar 6.** The `voltaStart` token is at sun-03 x 1440, and my crop shows no bracket there.
- **Which source is right at *Sunless* 5 reading bar 60.** The page prints E sharp and the truth file holds E.
- **Rule (ii) cannot say which part is misread** when only two parts disagree.
- **The double-sharp check on songs it was not tuned on.**
- **Carry-over rows 5, 7, 8, 10, 11, 12 and 13** were not run, so their false-flag rates are unknown.

## Deliverables, in `/mnt/user-data/outputs/checks-measured/`, with md5

| File | md5 |
|---|---|
| `README.txt` | 9fd168dbdecc45370e6fc56cf078335a |
| `carry-over-table.md` | fb8fb107bc5aced87596c9a812acbd1d |
| `scripts/acccheck.py` | e55ab45efcd52ee73351088d5efd4a03 |
| `scripts/barcheck.py` | af27f0ac6c311f5ddb805ebe2b2560ea |
| `scripts/baseline.py` | 763ad24ee0052a380a4684b16c12dd03 |
| `scripts/dsharp.py` | c8255e51ec8d2b623922088ac1b8537a |
| `scripts/join.mts` | 133d6ac7c45533ddd58b8928a0b11dfd |
| `scripts/keycheck.py` | 20ecb16322f408638c70cc0dd4e79da7 |
| `scripts/lib.py` | b053af3bfef9d187dbe454642136da97 |
| `scripts/partbars.py` | 5593f993e0c09f67d1fda4740176e077 |
| `scripts/run_all.sh` | eb400d9c9b5ef1e499608cc4cd1331fe |
| `scripts/scorer/conv.py` | 017fa4be2510ab7534d8ae8c258b2ed6 |
| `scripts/scorer/scan-scorer.ts` | f7a7f9c24edfdeb88b57aee5c2398e5f |
| `scripts/scorer/score.ts` | b4d53a3f68711f6a6b4e4e69848dfbe7 |
| `joined/tch.musicxml` | 9b44d525efe697530f2a2f6709f9aebf |
| `joined/sun1.musicxml` | 6c2a0f4b42d6d558a9ff159538f91e4c |
| `joined/sun4.musicxml` | 86499ded5c4683026ba348b3401f9a8d |
| `joined/sun5.musicxml` | 9bc7227669b7e30c8ae846b361a54bcb |
| `joined/sun6.musicxml` | 36d19ff816ece371614a44e7ceff997b |
| `tables/4a-baseline.csv` | fa504748f68853eaa1da5ef7c0338c5d |
| `tables/4a-differences.csv` | f4d720ca9d390bf4d40d0f639cf24c41 |
| `tables/4a-barmap.json` | 7d0c804e8ed5777205e27b56f9963002 |
| `tables/4b-summary.csv` | d561de36407fad0c0cdbd30618a01a02 |
| `tables/4b-falseflags.csv` | 5433d92df93b52d76bf991f166c61feb |
| `tables/4b-bars-tch.csv` | b65e951810694aa36d290488091e6b3c |
| `tables/4b-bars-sun1.csv` | b5107e616f3756d384c23c34e51640e2 |
| `tables/4b-bars-sun4.csv` | dde4a5587e7ffad07bd7c501f44f0337 |
| `tables/4b-bars-sun5.csv` | e8bfa405359cb5c0caa7eced8cf1efc3 |
| `tables/4b-bars-sun6.csv` | 25a97d21d0e44712c3feabda6ce8cede |
| `tables/4c-keys.csv` | 2e2ad8293486112dab3fdafbd4fd81ac |
| `tables/4c-rules.csv` | 86d390c4b64a6ed93c5954cb92d9f93a |
| `tables/4c-metres.csv` | c5f3341307af65e8c3e7df0361c268f4 |
| `tables/4c-notes-under-misread-key.csv` | b63ca55e4c9afff4b50a92cc748dad12 |
| `tables/4d-pitch-differences.csv` | 97e35d9b30d0c0fe16bb4805baeff884 |
| `tables/4d-flags.csv` | cb8365aad792463e6920c209ecfbf8c7 |
| `tables/4d-summary.csv` | cba6291801b124248961d142fbbfa62f |
| `tables/4e-partbars.csv` | 79d076ab063611e5d9caa24ea04cb18e |
| `tables/4e-dsharp-summary.csv` | 1839b5f7a593f33f343ae6705dcd837f |
| `tables/4e-dsharp-flags.csv` | f4aaf04dcefd699cee898869a8306cf4 |

The folder also holds `score/*.read.json` and `score/*.score.json` for each song, and `evidence/*.png` (crops of the kit's scans). The md5s for every file are in a list in my scratchpad. `run_all.sh` reran everything and reproduced every output byte for byte.

## Wall time

20 minutes, 03:16:00 to 03:36:02 EDT. About 360,000 tokens by the session counter.
