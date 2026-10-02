# Brief for Code: a note's length is read from its shape (r2, the build)

**Written by:** the desk (Fable), 2026-10-02 about 13:40. **This is the whole brief for the build of `QUEUE.md` row 23. It replaces sections 3 and 6 of `brief-code-length-is-read-from-shape_r1_2026-10-02.md`; r1's sections 2, 4, and 5 still hold and are not repeated.** **Serves:** THE ONE THING in `docs/memory/STATE.md`: a scan in, a melody out, IPA seated under it and Russian seated under that. **Runs on the tree at `389d4db` plus your uncommitted measurement.** Background: your own `report-code-length-is-read-from-shape_r1_2026-10-02.md`, read in full by the desk, and `measure-length_r1_2026-10-02/`.

**This brief follows `BRIEF-TEMPLATE.md`. It has no slot for a cause, and none is given.**

**What the singer gets from it.** Each note of their melody lasts as long as it is printed, and where Ilya cannot tell, it says so at that note and guesses nothing.

**The desk's answers to what your report asked it to rule:**

1. **The one-pixel gap does not bind. Build parts A and B.** The gate was the desk's and it was the wrong shape. Plan r4, principle 8, gives every fact three states: read, deduced, unsure. A bound with a narrow gap is the place for the third state. So: a note whose measure lies clear of every bound is read; a note that lies within the margin of a bound abstains. You stopped where r1 told you to, and that was right.
2. **What counts now is the wrong lengths.** A wrong length that Ilya states with confidence is the harm. An abstention is honest and the bar's arithmetic can settle it later. Section 6 is written that way.
3. **The three Tchaikovsky pitches (bars 20, 22, 76) are the reader's errors, and the draft stands.** The desk looked at `crops.files/tch-pitch.png`: the ledger line passes through the head in bar 20 (C♯4), and the heads of bars 22 and 76 lie in the first space (F♯4). A second witness agrees: the outside engine homr reads all three as the draft does (`memo-desk-yardstick-homr-on-seven-songs_r1_2026-10-02.md`). All ten pitch differences are therefore reader errors. Pitch is not this brief's work.
4. **Your harness changes are accepted:** `matches` in `scan-scorer.ts`, and the Tchaikovsky song as song 7 in `scan-baseline.ts`.
5. **Part C's finding is recorded for the next brief** (hollow heads and the braced-system gate). Build none of it here.

---

## 1. What was observed

From your report, on the app's own path at `389d4db`:

- The count of strokes gives the printed class on 90 to 96 in 100 of the 697 matched, filled, stemmed notes. It differs from the print on 41: 10 where the file and the scan differ or the aligner mispaired, 15 where a flag is there and the measure misses or miscounts it (13 on the Tchaikovsky pages), 2 where ink that is no flag touches the stem's tip, and 14 where it abstains.
- On the Tchaikovsky pages a flag is 7 to 9 pixels thick in a vertical cut, and two plain quarters carry a 6-pixel bump where a staff line crosses the stem. Some flags lie inside a staff line's band and are set aside as the line's residue.
- Of the 345 components `_has_dot` accepts beside the matched notes, 53 are printed dots by your looking and 292 are not. Your three tests (0.15 staff spaces from a line, an area of 0.082 staff spaces squared, the aspect) pass all 53 with margin; four of the others come within a pixel of a bound. The reader reads 173 plain notes as dotted.
- Applied by arithmetic to the matched notes, the measures take length right from 42, 50, 35, 57, and 24 to 85, 109, 175, 113, and 151, and length wrong from 21, 52, 118, 70, and 128 to 8, 2, 24, 15, and 14.
- The reader finds a beam on 0 of 28, 10 of 72, 0 of 130, 15 of 45, and 1 of 140 printed eighths.

**By the desk's eye, and a lead only** (`crops.files/tchm-1.png`): every flagged eighth in that sheet shows a flag that is thin, and long. It leaves the stem's tip to the right and curves back toward the head over about two staff spaces. The two plain quarters in the same sheet show a stem that crosses the staff lines and nothing else. To the eye the two groups are far apart in the length of the stroke, and close only in its thickness.

## 3. Measure, then build without waiting for the desk

1. **The flag as a path, measured first.** For the 697 notes of r1's step 3.2, follow the stroke that leaves the stem at its far end as row 21 follows a stem: along its own course, with a break of up to one staff line's band bridged, so that a flag cut where it crosses a line is still one stroke. Measure:
   - **its travel back toward the head,** in staff spaces: how far along the stem's direction the stroke runs from the tip;
   - **its reach** away from the stem, in staff spaces, and whether it ends or runs on;
   - **your own measure of the flag's outline,** if you judge it better. Say why.

   Report the spread of each for printed quarters and for flagged notes, on each page, as r1's gap table did. Say whether the 15 missed flags and the 2 touching inks now fall on the right side, and by how much.
2. **Choose the rule from the measures you now hold** (the count of strokes, the persistence, the path). Each bound sits in the gap between the groups the truth gives, on each page's own staff space and line thickness. **Set a margin at each bound. A note inside a margin abstains.** Ink at the tip that runs on past a flag's reach (a slur, a tie, a dynamic's letter) abstains. Say what margin you chose and what it costs in abstentions on each song.
3. **Beams.** A beamed note's count comes from the same strokes at the stem's far end. Say, for the printed eighths and sixteenths the reader finds no beam on today, how many are beamed in print and what the strokes say for them.
4. **The dot.** Build your three tests, with the two bounds your report found beside them: the dot's distance from the head, and its vertical offset from the head's row. A component within a pixel of a bound makes the note's length abstain. The 16 printed dots that are not a component of their own are reported, not fixed.
5. **Before you change the reader, run the chosen rule offline once more** on the five build songs, as `sim.py` did. **If length wrong would rise on any build song, stop and report. Otherwise build.**

## 6. Done when

1. **On every build song, the count of matched notes read with a wrong length is lower than today's, and the count read right is higher.** Today's are 21, 52, 118, 70, and 128 wrong and 42, 50, 35, 57, and 24 right. Report wrong, right, and abstained, before and after.
2. No build song loses a matched note or a right pitch.
3. **On the two test-only songs, totals only:** length wrong does not rise and length right does not fall. Today's are 27 and 81 wrong, 19 and 54 right. If either moves the wrong way, say so first in the report. This is the check that the bounds hold on songs nobody studied.
4. Every bound is reported with its gap and its margin on every page.
5. The 23 render pages are byte-identical. If the rule cannot hold that, apply it on ink-heavy pages only (`tools/e16-harness/reader/run_page2.py:270`) and say so.
6. Read time for each song is reported beside row 22's.
7. All gates at baseline: gate 4 is `1824 passed (1824)` and gate 5 is `644 passed | 5 skipped (649)`. Name any number you move and the tests that move it.

## 7. Report back

A new section, "Build against brief r2", in `docs/sessions/report-code-length-is-read-from-shape_r1_2026-10-02.md`: step 3.1's measurements first, then the rule and its margins, then section 6 line by line, and **what could not be established. NOT ESTABLISHED beats a complete invented answer.** Scripts and results stay in `docs/sessions/measure-length_r1_2026-10-02/`. Stay on Sonnet. No agent writes with git.
