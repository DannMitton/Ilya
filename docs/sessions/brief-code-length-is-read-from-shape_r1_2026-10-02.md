# Brief for Code: a note's length is read from its shape

**Written by:** the desk (Fable), 2026-10-02 about 09:55. **This is the whole brief for `QUEUE.md` row 23.** **Serves:** THE ONE THING in `docs/memory/STATE.md`: a scan in, a melody out, IPA seated under it and Russian seated under that. It is the first half of phase 5 of `plan-scan-reader_r4_2026-10-01.md`. **Runs on the tree after row 22 ships.** Background: your own `report-code-the-baseline-on-eight-songs_r1_2026-10-02.md` and `measure-baseline_r1_2026-10-02/`.

**This brief follows `BRIEF-TEMPLATE.md`. It has no slot for a cause, and none is given.**

**What the singer gets from it.** Each note of their melody lasts as long as it is printed. The rhythm in Markup then matches the page on their stand, and the time Ilya counts on each vowel is true. Today, of the notes the reader finds, the length is right on 17 to 44 in every 100.

**Why this runs before the metre brief (the desk's sequencing).** Your baseline shows length as the largest loss on every song. Dann's metre audition weighs the printed sign against the arithmetic of a confirmed bar (`docs/memory/OPEN.md`, "N.178 AND THE SCAN READER", item 11), and that arithmetic needs lengths that are right. So the order is lengths, then rests, then the metre. This departs from plan r4, section 5, "Phase 4 before 5", which was the desk's own ordering.

---

## 1. What was observed

From your report, on the app's own path at `887931f`:

| Song | Notes matched | Length right | Length wrong | Length abstained |
|---|---|---|---|---|
| *Sunless* 1 | 96 | 42 | 21 | 33 |
| *Sunless* 4 | 115 | 50 | 52 | 13 |
| *Sunless* 5 | 212 | 35 | 118 | 59 |
| *Sunless* 6 | 137 | 57 | 70 | 10 |

Tabulated by the desk from `measure-baseline_r1_2026-10-02/scores/`, `reads/`, and the truth files, for the differences whose kind names length:

- **The 261 wrong lengths, by what was read over what is printed:** half, 87; one and a half times, 65; double, 47; three quarters, 22; three times, 17; a quarter, 8; two thirds, 6; all others, 9.
- **The largest single confusions, song by song:**
  - *Sunless* 1: a quarter read as a dotted quarter, 13.
  - *Sunless* 4: an eighth read as a quarter, 27; an eighth read as a dotted quarter, 9; an eighth read as a dotted eighth, 8.
  - *Sunless* 5: an eighth read as a sixteenth, 37; a quarter read as an eighth, 15; an eighth read as a quarter, 11; an eighth read as 3/32, 11.
  - *Sunless* 6: a quarter read as a dotted quarter, 22; a quarter read as an eighth, 13.
- **The 115 abstentions on matched notes:** 106 carry `beam_scale_ink_no_beam` and 9 carry `hollow_head_on_ink_heavy_page`. Of the 106, the printed length is an eighth on 80, a quarter on 12, a sixteenth on 5, a dotted quarter on 4, a half on 3, and a dotted eighth on 2.
- **On *Sunless* 5, 15 notes the reader emits carry `hollow_head_on_ink_heavy_page`.** Of the 8 the scorer matched, the printed length is an eighth on 4 and a dotted quarter, a quarter, a half, and a dotted half on one each.
- **Your report:** the hollow half notes of *Sunless* 6 are not read (25 are printed), and row 20's report said no scan page held a genuine hollow head.

**The Tchaikovsky song now has truth for pitch and length:** `truth-draft-tchaikovsky-op38-3-voice_r2_2026-10-02.json`, in `docs/sessions/`, in the shape of the *Sunless* truth files. It is the desk's reading by eye and Dann has not proofed it. By the desk's reading, the voice staff of that song prints no beam: every note shorter than a quarter carries its own flag. The 174 printed heads there are 139 eighths, 16 quarters, 7 sixteenths, 6 dotted quarters, and 6 dotted eighths (counted by script from the file).

## 2. What is established, each line carrying its `path:line`

Read by the desk in the tree at `887931f`, 2026-10-02.

- For each head the reader takes the area of the head's connected component and the count of beams on its stem (`tools/e16-harness/reader/run_page2.py:258-259`).
- A beam decides the length first: `1 / (4 * 2^beams)` (`run_page2.py:343`).
- With no beam, the count of flags comes from that area against two thresholds (`run_page2.py:353`). The thresholds are `FLAG_AREA_RATIO = 1.65` (`tools/e16-harness/reader/reader.py:2045`) and `FLAG2_AREA_RATIO = 2.27` (`run_page2.py:37`), each times the staff space squared. On a page whose staff lines are thicker than `INK_WEIGHT_GUARD` allows, the first threshold is derived from the page's own areas (`run_page2.py:270`, `:288`).
- With no beam and an area of at least `FLAG_AREA_MAX = 3.26` staff spaces squared, the length abstains as `beam_scale_ink_no_beam` (`run_page2.py:68`, `:351`).
- A hollow head on an ink-heavy page abstains as `hollow_head_on_ink_heavy_page`; on any other page it is a half note (`run_page2.py:339-341`).
- A dot multiplies the length by 3/2 (`run_page2.py:356`). `_has_dot` accepts any connected component of the page whose area is between 0.3 times the staff space and 0.25 times its square, whose width and height are each at most 0.7 staff spaces and differ by at most 0.35, whose centre is 0.35 to 2.2 staff spaces to the right of the head, and within 0.8 staff spaces of its row (`reader.py:2066-2083`).
- `find_stem` returns the stem's column, its direction, its far end, and its length (`tools/e16-harness/reader/beams.py:303-324`).
- On a braced system, each hollow detection set aside as the inside of a flag's hook is kept in `G['hooks']` with its place, its score, and its core's area (`reader.py:1447`, `:1492`).
- The rests come from `detect_rests_multi` with three kinds: quarter, eighth, and sixteenth (`run_page2.py:108`, `:383`). Rests are the next brief and are not part of this one.

## 3. Measure before you change anything

Report these first. **Build part A if step 3.2 separates its classes on every build song, and part B if step 3.3 separates its two groups on every build song, each with a gap wider than one pixel at every page's staff space. If a part does not separate, do not build that part: report it and stop there. Part C is measured and reported only.**

1. **The fifth row of the table.** Read the Tchaikovsky song on the app's own path, as you read the others (G clef on line 2, two sharps, no octave change), keep the reader's events, and score them against the truth draft named in section 1. Add the song to `scan-baseline.ts` as a build song. Where the truth draft and the scan differ, the scan decides: list each such place for the desk.
2. **Part A, the flags and the beams.** The truth gives the printed length of every note the scorer matched. For each matched, filled note on the five build songs, measure at the far end of its stem:
   - **the strokes that leave the stem:** how many separate strokes of ink leave the stem at its far end, counted along the stem, with their thickness and their spacing in staff spaces, and the side they leave on;
   - **the hooks:** how many entries of `G['hooks']` lie within reach of that stem's far end, and how far;
   - **the beams** the reader finds today, and **the area** it uses today;
   - **your own measure of a flag's shape,** if you judge it better than these. Say why.

   For each printed class (quarter, eighth, sixteenth, each with and without a dot) and each song, report the spread of every measure. Say which measure, or which pair, separates the classes, and by what gap in staff spaces and in pixels on each page. List every note on which the measures disagree with the printed length, with a crop.
3. **Part B, the dots.** For every matched note, list each component `_has_dot` accepts today. Sort them by looking into two groups: a printed augmentation dot of that note, and anything else. Say what each of the others is, by kind, with a count for each song. Then measure, for both groups: the component's place against the staff lines (in a space or on a line), its distance from the head's edge, its size against the page's own printed dots, and how round it is. Say which measure separates the two groups, and by what gap. Do the same for every printed dot the reader misses.
4. **Part C, the hollow heads, to report and not to build.** For each printed half note and dotted half note on *Sunless* 5 and 6, say what the reader does with it today: no detection, set aside as a hook, admitted and abstained, or read. For each note that carries `hollow_head_on_ink_heavy_page` and whose printed head is filled, say what the detection sits on. For each, give the core measures of row 20: whether the white core is closed, with the staff lines in and with them removed, and its area. Dann's ruling on a hollow head that sits on a line is in section 4.
5. **The 106 `beam_scale_ink_no_beam` abstentions** are part of step 2's pool. Report what the measures of step 2 say for them as a group of their own.

## 4. The rulings this serves, and the ones it touches

- **Dann, 2026-10-01 22:22, the measure:** 95 of every 100 notes right in pitch and length, per song, not pooled, on the app's own path (plan r4, section 2).
- **Dann, 2026-10-01 15:22:** *"Guessing is not a modality for well-constructed software."*
- **Dann, 2026-10-01 22:27, plan r4 principle 5:** decide late, by likeness and by sense.
- **Plan r4, principle 9:** no new fixed number without a check on songs the builders have not seen.
- **Plan r4, phase 5:** *"Flags, beams, and dots read from shape; ties and slurs; bar arithmetic as evidence."* Ties, slurs, and the bar arithmetic are not in this brief.
- **Dann, 2026-10-02 02:11 and 02:15** (`OPEN.md`, same section, item 13): a head's white core is a closed shape, and the head and the hook each have a shape of their own.
- **Dann, 2026-10-02 02:37** (item 14): *"When the notehead appears centred on a stave space, it will appear as a closed shape. But when that hollow notehead intersects a stave line, it will read as two closed shapes because the horizontal stave line will bisect the hollow nnotehead."* (Transcribed as written.)
- **A lead, not read by the desk this session:** plan r4, section 4, cites Gould's rule 68 (p. 435) for old vocal engraving, which flags each syllable and does not beam.
- **The desk's ruling for this brief, a DESK DEFAULT: a note's length is read from its shape.** The shape is the head (hollow or filled), its stem, the flags or beams at the stem's far end, counted as strokes, and a dot in the space to its right. The area of the ink is not a measure of length. Every bound comes from the groups the truth gives you, sits in the gap between them, and is reported with that gap. Where the measures disagree, or a note falls in a gap, the length abstains, as it does today.

## 5. Constraints

- **The 23 render pages stay byte-identical.** If the shape rule cannot hold that on every render page, apply it on ink-heavy pages only (`run_page2.py:270`) and say so.
- **The test-only songs (*Sunless* 2 and 3): totals only.** Do not open their pages, their crops, or their note-by-note output, and tune nothing on them.
- **Change the reader in `tools/e16-harness/reader/` and the harness in `tools/e16-harness/src/` only.** No product code. `VocalLineEvent` and the seam's shape do not change. The abstain path stays.
- **Rests, the metre, hollow heads, ties, and slurs are out of scope.** Report what you see of them; fix none.
- **The pins hold:** Pyodide v0.26.4, cv2 4.9.0, numpy 1.26.4.
- **Crops go in a `.files` folder.** The truth files in `tools/e16-harness/output/truth/` are never committed.
- **Stay on Sonnet. No agent writes with git.**
- **What this displaces:** the metre brief, by one more step, and the rests brief behind this one. `QUEUE.md` rows 5 to 17 wait as before.

## 6. Done when

1. The baseline table holds five build songs, the Tchaikovsky song among them, before the change and after it, with the two test-only songs' totals before and after.
2. On every build song, the count of matched notes with the right length is higher than before, and the count read with a wrong length is lower. No build song loses a matched note or a right pitch.
3. On the two test-only songs, the totals for length right do not fall. If either falls, say so first in the report.
4. Every length the reader emits for a flagged or beamed note rests on the measures of section 3, and each bound is reported with its gap on every build song.
5. The 23 render pages are byte-identical.
6. Read time for each song is reported beside row 22's.
7. All gates at baseline: gate 4 is `1824 passed (1824)` and gate 5 is `644 passed | 5 skipped (649)`. Name any number you move and the tests that move it.

## 7. Report back

A new file, `docs/sessions/report-code-length-is-read-from-shape_r1_2026-10-02.md`: section 3's measurements first, then the build against section 6, line by line, and **what could not be established. NOT ESTABLISHED beats a complete invented answer.** Scripts and results go in `docs/sessions/measure-length_r1_2026-10-02/`.
