# Brief for Code: the trial of fitted shapes, the page's own values, and the round trip

**Written by:** the desk (Fable), 2026-10-02 about 16:18. **This is the whole brief for `QUEUE.md` row 24.** **Serves:** THE ONE THING in `docs/memory/STATE.md`: a scan in, a melody out, IPA seated under it and Russian seated under that. **Runs on the tree at `b709012`.** Background: your own `report-code-length-is-read-from-shape_r1_2026-10-02.md` (both halves) and `measure-length_r1_2026-10-02/`; the desk's `draft-gould-expectations-for-the-scan-reader_r1_2026-10-02.md`; `docs/memory/OPEN.md`, "N.178 AND THE SCAN READER", item 19; `docs/memory/OWED.md`, the items under "A design to measure next".

**This brief follows `BRIEF-TEMPLATE.md`. It has no slot for a cause, and none is given.**

**What the singer gets from it.** Nothing changes on their screen yet. The trial says, by measurement, whether Ilya can read a note's length the way an engraver drew it: a head, a stem, a flag or a beam, and a dot, each a form with a few numbers, sitting on five known lines. If it can, each note of their melody lasts as long as it is printed on more of their pages, and where Ilya cannot tell, it says so at that note.

**This is a trial, and a trial has two endings.** It is done when it is measured and reported. It passes only if section 6, items 5 and 6, hold. A trial that does not pass is a useful result: report it as it is. Do not tune toward a pass.

**The desk's design, a DESK DEFAULT, and the one rule that shapes it: no bound in the trial is a number fitted to the five build songs.** Each bound is either Gould's (wide, the same for every page) or the page's own (measured on that page from its clear cases). Row 23's bounds are single numbers for every page, and its report shows the pages differ.

---

## 1. What was observed

From your build report for row 23, on the app's own path:

- Lengths Ilya misreads on the build songs fell from 21, 52, 118, 70, and 128 to 6, 3, 14, 34, and 17; lengths read as printed rose from 42, 50, 35, 57, and 24 to 81, 100, 170, 89, and 135; abstentions went from 33, 13, 59, 10, and 21 to 9, 12, 31, 14, and 21.
- **On *Sunless* 2, test only, misread lengths rose from 27 to 34** (read as printed 19 to 27, abstained 21 to 6). On *Sunless* 3 they fell from 81 to 76 (read as printed 54 to 91).
- The reach of a flagged note's stroke starts at 0.14 staff spaces on the Tchaikovsky page 2 and at 0.87 on *Sunless* 5 page 16 (the 5th percentile, your per-page table). The one margin from 0.07 to 0.55 leaves 11 faint flags unsure on the Tchaikovsky pages.
- Sixteen printed dots are not a component of their own. The dot rule removed 173 false dots and reads 4, 1, 4, 2, and 3 dotted notes as plain. A printed dot passes every bound by more than the 1.5-pixel margin on 5 of the 18 pages that hold a labelled dot.
- Applied to every page, the shape rule changes lengths on 22 of the 23 render pages. Whether those changes are closer to the truth or farther from it was not scored.
- 24 of the 34 misread lengths on *Sunless* 6 are on two pages whose staff-line thickness is 0.129 of a staff space, under the guard of 0.1428.

Measured by the desk from your data (`draft-gould-expectations-for-the-scan-reader_r1_2026-10-02.md`, section 1): the median stem is 3.50 staff spaces over 728 stems (3.34 to 3.62 by song); the flag's travel has a median of 2.4 to 2.9 on every song; beam bars are 0.28 to 0.65 thick; of 54 labelled dots, 18 sit level with the head and 23 half a space above it; dot centre to head centre has a median of 1.21.

**A lead only, the desk's sketch and not the reader** (`drawing-fitted-ovals-demo_r1_2026-10-02.py` and `.png`): an ellipse fitted to three heads of the Tchaikovsky page 1, bar 17, put the centres 0.06, 0.02, and 0.07 of a step from the printed pitches, with axes of about 1.04 by 1.37 staff spaces. The fitted tilt came out 58, 27, and 55 degrees.

**Established by the desk with `pdfimages -list`, 2026-10-02** (`docs/memory/OWED.md`): both test scans are 1 bit per pixel. The Tchaikovsky PDF is 400 ppi. The *Sunless* PDF is 600 ppi, and the app reads it at 400.

**The outside engine homr**, scored by the same scorer: 81.3, 97.4, 86.8, 94.4, and 93.1 on the build songs, and 66.2 and 69.8 on the two test-only songs (`memo-desk-yardstick-homr-on-seven-songs_r1_2026-10-02.md`).

## 2. What is established, each line carrying its `path:line`

Read by the desk in the tree at `b709012`, 2026-10-02.

- The heads are found on the raster with the staff lines in: a matched filter with an elliptical kernel of 1.35 by 0.92 staff spaces, kept at a response of 0.84 or more (`tools/e16-harness/reader/reader.py:1108`, `:1124-1129`).
- The raster is cut to ink at 128 (`reader.py:1124`; `tools/e16-harness/reader/beams.py:184`).
- The staff lines are taken out through one mask, under three conditions (`beams.py:170-181`). The tree's own comment calls for "Non-destructive, non-exclusive masks over an immutable raster" (`reader.py:1073-1086`).
- The shape rule reads the line-removed image: `nl2 = G['nl_safe']` (`tools/e16-harness/reader/run_page2.py:247`), passed to `shape.read_length` with the voice staff's lines and the line thickness (`run_page2.py:314`).
- The dot's candidates are connected components of the line-removed image (`run_page2.py:248`; `tools/e16-harness/reader/shape.py:203-224`).
- Every bound of the shape rule is one fixed number for every page (`shape.py:68-87`), "taken on the five build songs and no others" (`shape.py:57-59`). The dot's margin is in pixels, `M_PX = 1.5` (`shape.py:86`).
- The shape rule acts on ink-heavy pages only (`run_page2.py:106`, `:271`, `:307`). `cfg['shape_ink_heavy_only'] = False` applies it everywhere (`run_page2.py:307`).
- The reader already takes one number from the page itself: on an ink-heavy page the flag's area threshold is derived from that page's own areas (`run_page2.py:287-289`).
- The app rasterizes a PDF at 400 dpi (`apps/web/src/lib/reader/page-pdf.ts:52`).
- A config that names its `vocal` staves bypasses the voice selection (`reader.py:1407`).
- **The render pages carry their own geometry.** Under `tools/e16-harness/output/<song>/repaired/` each `pageN_300dpi.png` has a `pageN.svg` beside it (24 of each, counted by the desk; your row 23 report read 23, one raising in `detect_staves`). The SVG is Verovio 6.2.0's (line 2 of `page1.svg` for *Sunless* 1), and it tags its elements by class: on that page 208 `notehead`, 143 `stem`, 25 `flag`, 48 `dots`. The PNG is the SVG at 2480 pixels wide (`tools/e16-harness/src/render.ts:19-24`). The folder is git-ignored (`tools/e16-harness/.gitignore:2`). The name of the music font is NOT ESTABLISHED; the glyph ids are SMuFL's.
- The scorer returns the headline and every matched pair (`tools/e16-harness/src/scan-scorer.ts:200`, `:371`, `:374`). `scan-baseline.ts` writes totals only for the two test-only songs (`tools/e16-harness/src/scan-baseline.ts:21-22`, `:57`).

**A lead, yours:** whether the render fixtures are read with a `vocal` list was not established in row 21's report (its section 6, item 4).

## 3. Measure, in this order, and keep going without waiting for the desk

Write each step into the report as it finishes. **The one stop is in step 3.2.**

**3.1. Two measurements on today's reader, with no new code.**

1. **The render pages, scored.** Read the render pages as the app reads a scan (no `vocal` list), once with the shape rule off and once with it on everywhere, and score each song against its truth file with `scan-scorer.ts`. Report the row 23 table for both. This says whether the ink-heavy gate protects the render pages or holds the rule back from them. The render pages of *Sunless* 2 and 3 are totals only.
2. **The *Sunless* scan at its own 600 ppi.** Read the four *Sunless* build songs from a 600 ppi raster made in the harness with the same pdf.js, with today's reader, and score them beside the 400 ppi reads. Product code does not change. Report the table, the read time, and the memory, and say if the read does not run at that size. The test-only songs are totals only.

**3.2. The fit, checked where the geometry is known. THE STOP IS HERE.** On the render pages of the four *Sunless* build songs, at each head the reader finds on the voice staff, fit these forms to the ink with the staff lines left in:

- **the head:** an ellipse (centre, two axes, tilt, filled or hollow);
- **the stem:** a segment (column, the head's end, the far end, thickness);
- **the dot:** a disc (centre, diameter), where one is printed;
- **the beam:** a bar (thickness, slope), where one is printed.

Compare each with the same element in the page's SVG, in staff spaces: the head's centre (across and up), its axes, the stem's far end, the dot's centre. Report the median and the 95th percentile of each difference, and say whether the tilt is stable. **If the head's centre differs from the SVG's by more than 0.15 staff spaces up or down at the 95th percentile, stop and report: the instrument is not yet fit to read a scan with.** (The desk's number: a step is half a staff space, so a quarter of a staff space is where one pitch becomes the next.)

**3.3. Pass 1: the page teaches its own values.** On every scan page of the five build songs:

1. Take the **clear cases**: notes that lie clear of every one of Gould's bounds, set wide. Start from these, and say what you used: a stem of at least 2.5 staff spaces; for a quarter, no ink at the stem's far end beyond the stem's own thickness; for a flagged note, one stroke that travels 2.0 to 3.5 staff spaces back toward the head; for a beamed note, a bar 0.25 to 0.75 thick that runs on to another stem; for a dot, a round mark of about half a staff space, right of the head, in a space. A note that touches other ink is not a clear case.
2. From the clear cases alone, measure the page's own values, each with its count, median, and spread: the head's two axes and tilt; the stem's length and thickness; the flag's reach and travel, **and the flag's own outline**, harvested from the clear flags and aligned at the stem's far end, one for each stem direction; the beam's thickness; the dot's diameter and its offset from the head (across from the head's edge, and up, for a head on a line and for a head in a space); the staff line's thickness.
3. **The check on pass 1, from the truth:** of the clear cases the scorer matched, how many does the truth give a different length? Report it for each page. Clear cases that the truth contradicts would teach the page a false value.
4. Where a page holds too few clear cases of a kind to give a value, pool across the song, and say on which pages you pooled and what count you took as too few.
5. Set each value beside Gould's (the desk's draft, section 1), page by page.

**3.4. Pass 2: the rest are read by drawing them.** For every note that is not a clear case:

1. The candidates are a quarter, an eighth, and a sixteenth, each plain and dotted; a flag or a beam as the page prints at that stem.
2. Draw each candidate from the page's own values: the five lines at their traced places and measured thickness, the head's ellipse at its fitted place, the stem, the page's flag outline once or twice, or the bar, and the dot's disc in the one place the page's own offset predicts for that head.
3. Compare each drawing with the scan, lines in, over the area in which the candidates differ. Say what you chose as the comparison and why.
4. **The decision carries no number fitted to these songs.** A candidate is read when its difference from the scan lies within what that page's clear cases of the same kind show against their own drawings, and the next candidate's does not. Otherwise the note abstains, with a reason that names what was close.
5. Report, for each song, the lengths read, misread, and abstained among the notes pass 2 took, beside what row 23's rule gave for the same notes.

**3.5. The round trip.** Draw the whole reading of each voice staff back over its scan: lines, heads, stems, flags, beams, dots. For each note, within the note's own area, count the scan's ink that the drawing does not hold and the drawing's ink that the scan does not hold, each as a share of the drawing's ink apart from the lines.

1. Report the spread of both counts for the notes read as printed and for the notes misread (length, by the truth). Say whether a bound taken from the page's clear cases would mark the misread notes unsure, and how many notes read as printed it would also mark.
2. Make one overlay sheet for each build song, in a `.files` folder, for the desk's eye: the scan in grey, the drawing's ink in one colour, the unexplained ink in another.

**3.6. The pitch, to report and not to change.** For every matched note, give the pitch step that the fitted centre gives against the traced lines, beside the reader's and the truth's. Count where the fitted centre agrees with the truth and the reader does not, and the reverse. Emit no pitch from it.

**3.7. The score.** Put the trial's lengths in place of the reader's in each read, with every other field untouched, and score with `scan-baseline.ts`: the five build songs in full. **Then, once, with everything frozen, the two test-only songs, totals only. Do not change anything and run them again.**

## 4. The rulings this serves

- **Dann, 2026-10-01 22:22, the measure:** 95 of every 100 notes right in pitch and length, for each song, on the app's own path (plan r4, section 2).
- **Dann, 2026-10-01 15:22:** *"Guessing is not a modality for well-constructed software."*
- **Dann, 2026-10-02, 15:05 to 15:55** (`OPEN.md`, item 19; a living draft, his questions and directions, none an edict): *"I think I'm asking for an application of the analysis through synthesis paradigm?"*; *"we know what a pristine stave looks like: five identical parallel horizontal lines"*; *"my take would be to have the notehead *be* a mathematical ovid whos centroid would sit at a fixed coordinate on the stave"* (transcribed as written); *"Ilya may be able to distil the house stylue of a page... reconstruct a page and use our comparison between its virtual synthetic rendering against the pixellated scan to choose"* (transcribed as written); *"I really think Gould will help us correctly locate augmentation dots as well."*
- **Dann, 2026-08-18, as `OPEN.md` item 19 records it:** a Gould prior bounds a dimension and never decides a meaning.
- **Plan r4, principles 6, 8, and 9:** the page teaches Ilya its own glyphs; three states for every fact (read, deduced, unsure); no new fixed number without a check on songs the builders have not seen.
- **The desk's choices in this brief, each a DESK DEFAULT:** the head, stem, dot, beam, and line are forms with a few numbers, and the flag is the page's own outline, because a flag has no simple formula and Gould bounds only its length. The render pages in the tree stand in for Dann's "Finale files" of 15:26: they are his engravings drawn by Verovio, and their SVG gives every element's place. Pages exported from Finale in Maestro are not in the tree.

## 5. Constraints

- **Default behaviour does not change.** The trial lives in a new module, `tools/e16-harness/reader/fitted.py`, behind a switch that is off unless a measurement turns it on. `shape.py`, `INK_WEIGHT_GUARD`, and the reader's emitted events stay as they are.
- **Every number in the trial is listed in the report with its source:** Gould's, the page's own, or the desk's stop in step 3.2. A number of any other kind is named as such.
- **The test-only songs (*Sunless* 2 and 3): totals only, once.** Do not open their scan pages, their render pages, their crops, or their note-by-note output, and tune nothing on them.
- **Change `tools/e16-harness/` only.** No product code. `VocalLineEvent` and the seam's shape do not change.
- **Out of scope, to report where seen and not to fix:** hollow heads, rests, the metre, accidentals, ties, slurs, and spacing as a witness.
- **The pins hold:** Pyodide v0.26.4, cv2 4.9.0, numpy 1.26.4.
- **Crops and sheets go in a `.files` folder.** The truth files in `tools/e16-harness/output/truth/` are never committed.
- **Words for the record:** where a printed page differs from Gould, it is outside the expected range. Where Ilya's reading differs from the print, it is Ilya's misread.
- **Stay on Sonnet. No agent writes with git.**
- **What this displaces:** the brief for hollow heads and the braced-system gate, the rests brief, and the metre brief, each by one step. `QUEUE.md` rows 5 to 17 wait as before.

## 6. Done when

1. Step 3.1's two tables are reported.
2. Step 3.2's differences are reported, and the stop either held or did not.
3. Steps 3.3 to 3.6 are reported page by page, with every number's source.
4. The table of row 23 is reported for the trial beside row 23's own figures: lengths read as printed, misread, and abstained, and the headline, for the five build songs; totals for the two test-only songs.
5. **The trial passes the check row 23 missed if, on the test-only songs, misread lengths are at most 27 on *Sunless* 2 and 76 on *Sunless* 3, and lengths read as printed are at least 27 and 91.** Say first in the report whether it did.
6. **The trial passes on the build songs if, on each, misread lengths do not rise above row 23's 6, 3, 14, 34, and 17, and lengths read as printed do not fall below 81, 100, 170, 89, and 135.**
7. With the switch off, the 23 render pages are byte-identical and all gates are at baseline: gate 4 is `1824 passed (1824)` and gate 5 is `644 passed | 5 skipped (649)`.
8. Read time with the switch on is reported for each song beside row 23's.

## 7. Report back

A new file, `docs/sessions/report-code-fitted-shapes-and-the-round-trip_r1_2026-10-02.md`: section 6, items 5 and 6, first; then steps 3.1 to 3.7 in order; then **what could not be established. NOT ESTABLISHED beats a complete invented answer.** Scripts and results go in `docs/sessions/measure-fitted_r1_2026-10-02/`.
