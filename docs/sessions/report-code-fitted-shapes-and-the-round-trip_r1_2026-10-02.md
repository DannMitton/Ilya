# Report: fitted shapes and the round trip (QUEUE row 24)

**Written by:** Code (Sonnet 5.5), 2026-10-02. **Brief:** `brief-code-fitted-shapes-and-the-round-trip_r1_2026-10-02.md`, the whole brief. **Tree:** branch `Shane`, `b709012`, working tree dirty only with the desk's records (`QUEUE.md`, `STATE.md`) and the brief. **Status: MEASURED. THE TRIAL DOES NOT PASS.** Steps 3.1 to 3.7 are done and each is written below in order. The step 3.2 stop did not fire. **What changed in the tree:** `tools/e16-harness/reader/fitted.py` is new; `run_page2.py` gains one default-off block of ten lines (`cfg['fitted_lengths']`, below); the scripts and results are in `measure-fitted_r1_2026-10-02/`. No product code changed. `shape.py`, `INK_WEIGHT_GUARD`, and the events a default read emits are untouched. No git command was run.

Scripts and results: `measure-fitted_r1_2026-10-02/`.

## Section 6, items 5 and 6, first

**Item 5, the check row 23 missed: NOT MET.** On the test-only songs (read once, with everything frozen, totals only):

| Song | misread, limit 27 and 76 | read as printed, floor 27 and 91 | abstained | row 23's own: misread, right, abstained |
|---|---|---|---|---|
| *Sunless* 2 | **17** (met) | **22** (not met) | 28 | 34, 27, 6 |
| *Sunless* 3 | **58** (met) | **38** (not met) | 101 | 76, 91, 30 |

The trial misreads fewer lengths on both test-only songs than row 23 does (17 against 34, 58 against 76), and it reads far fewer as printed, because it abstains on 28 and 101 notes where row 23 abstained on 6 and 30.

**Item 6, the build songs: NOT MET.**

| Song | misread, limit | read as printed, floor | abstained | row 23 |
|---|---|---|---|---|
| *Sunless* 1 | **3** (limit 6, met) | **62** (floor 81, not met) | 31 | 6, 81, 9 |
| *Sunless* 4 | **5** (limit 3, **not met**) | **44** (floor 100, not met) | 66 | 3, 100, 12 |
| *Sunless* 5 | **11** (limit 14, met) | **81** (floor 170, not met) | 119 | 14, 170, 31 |
| *Sunless* 6 | **13** (limit 34, met) | **68** (floor 89, not met) | 56 | 34, 89, 14 |
| Tchaikovsky | **4** (limit 17, met) | **46** (floor 135, not met) | 123 | 17, 135, 21 |

**In one sentence:** the trial is more careful than row 23 and far less productive. On four of five build songs it misreads fewer lengths, on the fifth (*Sunless* 4) two more than the floor allows, and on every song it reads fewer lengths as printed (19, 56, 89, 21, and 89 fewer), because a note that does not match a drawing made from the page's own clear cases to within the tolerance those same cases show abstains, and that happens to most notes that are not clear. **This is a trial that did not pass, reported as it is. I tuned nothing toward a pass.**

## Step 3.1.1: the render pages, scored

**What I ran.** The 24 render pages of the six Sunless songs (`tools/e16-harness/output/<song>/repaired/pageN_300dpi.png`) on the app's own path: `WorkerPageReader` under Pyodide 0.26.4, clef G2, the song's key (2, 2, 0, 2, 0, 7), no `vocal` list, all of a song's pages in one read (`read-renders.mjs`). Three reads: the shape rule off (`cfg.shape = false`), on everywhere (`cfg.shape = true`, `cfg.shape_ink_heavy_only = false`), and today's default. Scored with `score-songs.ts`, a copy of `scan-baseline.ts` that skips a song with no read (the render corpus has no Tchaikovsky). **Sunless 6's page 6 raises in `detect_staves` on every read** (`failedPages = [6]`), so that song is scored on five of its six pages, as in row 23. The render pages of *Sunless* 2 and 3 were read by the script and scored; **only their totals were printed or kept**, and I did not open their pages or notes.

**Today's default and the rule off are byte-identical** on all six songs (the `ro` of each read, equal as JSON): the ink-heavy gate holds the rule off on the render pages, as row 23 reported.

Notes the scorer matched; `right`, `wrong`, and `abstained` are lengths, as in row 23's table:

| Song | rule | matched | length right | length wrong | length abstained | pitch right | both right | headline |
|---|---|---|---|---|---|---|---|---|
| 1 | off (= default) | 95 | 92 | 3 | 0 | 2 | 1 | 1.0 |
| 1 | on everywhere | 92 | 74 | 5 | 13 | 6 | 2 | 2.1 |
| 4 | off (= default) | 98 | 31 | 67 | 0 | 98 | 31 | 26.7 |
| 4 | on everywhere | 98 | 40 | 0 | 58 | 98 | 40 | 34.5 |
| 5 | off (= default) | 258 | 255 | 3 | 0 | 258 | 255 | 98.8 |
| 5 | on everywhere | 258 | 132 | 3 | 123 | 258 | 132 | 51.2 |
| 6 | off (= default) | 155 | 154 | 1 | 0 | 151 | 150 | 93.2 |
| 6 | on everywhere | 155 | 116 | 0 | 39 | 151 | 113 | 70.2 |
| 2 (test, totals) | off (= default) | 68 | 41 | 27 | 0 | 67 | 40 | 58.8 |
| 2 (test, totals) | on everywhere | 68 | 21 | 10 | 37 | 67 | 21 | 30.9 |
| 3 (test, totals) | off (= default) | 156 | 25 | 131 | 0 | 96 | 14 | 6.3 |
| 3 (test, totals) | on everywhere | 156 | 18 | 38 | 100 | 96 | 13 | 5.9 |

**What it says.** On the render pages the gate does two opposite things. **It protects** *Sunless* 1, 5, and 6: with the rule on, the lengths read as printed fall from 92 to 74, 255 to 132, and 154 to 116, and the notes that abstain rise from 0 to 13, 123, and 39. The area rule is already close to right on those songs (3, 3, and 1 wrong). **It holds back** *Sunless* 4 (wrong 67 to 0, right 31 to 40, abstained 0 to 58) and the two test-only songs (wrong 27 to 10 and 131 to 38, right 41 to 21 and 25 to 18, abstained 0 to 37 and 0 to 100). So on the render pages the shape rule trades wrong lengths for abstentions, and it is a good trade only where the area rule is badly wrong. **The row 23 rule's bounds are not tuned for a clean render page, and a clean render page abstains on them.** Said plainly: on the render pages the shape rule reads fewer lengths right on five of six songs than the area rule does. That is a fact about row 23's bounds on thin-lined pages, and it bears on step 3.4, where the trial's own bounds come from the page.

**Not established here.** Why *Sunless* 1's render scores 2 and 6 pitches right of 95 and 92 matched, against 98 of 98 on *Sunless* 4 and 258 of 258 on *Sunless* 5: the config's key for the render of song 1 may differ from the scan's, or the render's clef or octave may. It does not touch a length, so I did not chase it. The scorer's own `shift` for each is in `scores-renders-*/song1.score.json`.

## Step 3.1.2: the Sunless scan at its own 600 ppi

**What I ran.** `read-scans.mjs` rasterizes the Sunless PDF with the app's own `rasterizePdf` (pdf.js 6.2.108, `page-pdf.ts`) and reads each song on the app's path, today's reader, today's rule (ink-heavy pages take the shape rule). At 600 ppi the harness serves `page-pdf.ts` with the one constant `TARGET_DPI = 400` rewritten to `600` by a Playwright route; **product code is unchanged**. The same script ran at 400 as the control. The 400 ppi read **reproduces row 23 exactly** (every song's right, wrong, and abstained figure, and the read times to within 0.3 s). The test-only songs, *Sunless* 2 and 3, were read by the script and scored; **totals only**.

| Song | ppi | matched | length right | length wrong | length abstained | pitch right | both right | headline | read seconds | pages that raise |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 400 | 96 | 81 | 6 | 9 | 72 | 62 | 64.6 | 17.8 | none |
| 1 | 600 | 96 | 78 | 8 | 10 | 73 | 60 | 62.5 | 42.4 | none |
| 4 | 400 | 115 | 100 | 3 | 12 | 92 | 81 | 69.8 | 17.7 | none |
| 4 | 600 | 116 | 103 | 6 | 7 | 100 | 89 | 76.7 | 40.4 | none |
| 5 | 400 | 215 | 170 | 14 | 31 | 150 | 119 | 46.1 | 54.2 | page 12 |
| 5 | 600 | 190 | 130 | 16 | 44 | 127 | 84 | 32.6 | 130.9 | pages 13 and 14 |
| 6 | 400 | 137 | 89 | 34 | 14 | 98 | 66 | 41.0 | 46.5 | none |
| 6 | 600 | 126 | 95 | 11 | 20 | 84 | 63 | 39.1 | 94.1 | page 18 |
| 2 (test, totals) | 400 | 67 | 27 | 34 | 6 | 48 | 16 | 23.5 | 13.9 | none |
| 2 (test, totals) | 600 | 66 | 26 | 34 | 6 | 50 | 19 | 27.9 | 33.8 | none |
| 3 (test, totals) | 400 | 197 | 91 | 76 | 30 | 136 | 72 | 32.4 | 44.3 | none |
| 3 (test, totals) | 600 | 199 | 90 | 82 | 27 | 132 | 68 | 30.6 | 103.8 | none |

**The read runs at 600 ppi** on all six songs, in the app's own Worker, under Pyodide 0.26.4. **It takes 2.3 to 2.4 times as long** (the staff space is 44 to 47 px against 30 to 32; the Tchaikovsky is a 400 ppi PDF and was not read at 600). **Peak resident memory of the browser's own processes over the whole run** (every page of the PDF rasterized, then each song read, the Worker never restarted): **2.66 GB at 400 ppi, 3.55 GB at 600 ppi.** It is the sum over this Playwright browser's processes, sampled every 1.5 s, so it is a floor on the peak.

**Three pages raise at 600 ppi, one at 400.** At 400, *Sunless* 5 page 12 raises in `remove_lines_safe` (`WalkRaise`: "snap exhausted at row 4069 ... within half the rule spacing (16 px)"), as in row 23. At 600, *Sunless* 5 page 14 and *Sunless* 6 page 18 raise in the same function (page 14: "a band reaches 158 rows from its seed 4258, beyond half the staff space (22.0 px)"; page 18: "snap exhausted at row 4396 ... (22 px)"), and *Sunless* 5 page 13 raises later, at `Fraction(metre_beats, metre_beat_type)` in `run_page2.py:548`. Page 12 reads at 600 and page 13 reads at 400. **The line removal's constants are in pixels, tuned at about 30 px to a staff space.** That is why *Sunless* 5 loses 25 matched notes at 600 (215 to 190) and why its figures fall.

**What it says.** The resolution does not rescue the length read. On the four build songs it moves right and wrong by a few notes either way: *Sunless* 4 gains 3 right and 3 wrong; *Sunless* 1 loses 3 right and gains 2 wrong; *Sunless* 6 reads 6 more right and 23 fewer wrong, but on 11 fewer matched notes. **Page 18 is one of the two *Sunless* 6 pages that held 24 of the 34 wrong lengths at 400, and it did not read at 600, so some of the 23 fewer are a page lost.** I did not count how many, and I did not separate the effect of resolution from the effect of a lost page. On the test-only songs the totals are within 6 notes of 400. **Nothing here shows 600 ppi helps, and the reader's pixel constants say it is not a setting to turn on as it stands.** NOT ESTABLISHED: whether a reader whose constants scale with the staff space would gain at 600.

## Step 3.2: the fit, checked where the geometry is known

**The stop did not fire.** At the 95th percentile the fitted head's centre differs from the SVG's by **0.036 staff spaces up or down** (0.037 across), against the desk's stop at 0.15. The instrument is fit to read a scan with, on the evidence of the render pages, and I went on. **What this does and does not show:** the render pages are Verovio's clean, anti-aliased output, drawn by the same kind of analytic rasterizer my model assumes, at 21 px to a staff space. It shows that the fit's code recovers a form that is known to be there, with the staff lines in. It does not show that the fit holds on a scan: that is step 3.3's job.

**What was fitted** (`tools/e16-harness/reader/fitted.py`, new; `fit_page.py` drives it under Pyodide 0.26.4 on the reader's own geometry). On the render pages of the four *Sunless* build songs, run with no `vocal` list, at each of the 606 heads the reader finds on a voice staff and that pair with an SVG head (below):

- **The head:** an ellipse (centre, two semi-axes, tilt), fitted by Levenberg-Marquardt to the **grey-level ink** (`1 - img/255`, not the cut at 128), against a model that is the union of the five staff lines (analytic bands at the lines' own place and thickness, measured in a strip either side of the head; ledger lines at their nominal rows) and the ellipse (each pixel takes the share of it the form covers). The stem's corridor is left out. Ink farther than 0.30 staff spaces from the form and not on a line is another element and takes weight 0. Three starts of tilt and three of height; the lowest loss is kept. A hollow head (the reader's flag) is fitted as a ring with a free inner scale.
- **The stem:** the column (centroid), the thickness, and the far end, read from the grey-level ink in the seven columns around the reader's stem column; a row inside a line's band is skipped for the column and the thickness and bridged for the far end.
- **The dot:** a disc, in the window 0.85 to 2.4 staff spaces right of the head's centre and 1.0 above to 0.75 below it; the candidate is the nearest blob of ink (line bands cut out) with an area of 0.04 to 0.6 s²; the disc is then fitted to the grey-level ink.
- **The beam:** coded (`fit_beam`), and **NOT ESTABLISHED on the render pages: the Verovio SVGs of these songs hold no `beam` element** (counted over every render page of the six songs: zero), so there is nothing printed to compare with. It is first used in step 3.3.

**What the SVG gives** (`svgtruth.py`, new): the head's centre and its equivalent ellipse (the second moments of the glyph's own outline, taken from the `<defs>` path of E0A4 or E0A3, scaled and placed by the `use` transform and the `page-margin` translate of (500, 500) units); the stem's column, ends, and thickness; the dots' centres and diameters; the flag's glyph. Units are the SVG's own: 180 units, 21.26 px, to a staff space; PNG pixels are SVG units times 2480/21000; a pixel's centre is 0.5 before its SVG coordinate. **The name of the music font is NOT ESTABLISHED**; the glyph ids are SMuFL's, and the head's width is 1.26 staff spaces. For a hollow head the SVG axes are those of the outer outline.

**Pairing.** Each reader head took the nearest SVG head within 1.0 staff space. **606 paired. 8 reader heads have no SVG head** (6 on *Sunless* 6 page 1, 1 on *Sunless* 5 page 3, and 1 on *Sunless* 6 page 5: reader false heads, reported). **19 SVG heads have no reader head** (18 on *Sunless* 4, 1 on *Sunless* 6): reader misses, reported. *Sunless* 6 page 6 raises in `detect_staves` and is not fitted.

**The differences, fit minus SVG, in staff spaces** (`compare32.py`; median of the signed difference, and the median and 95th percentile of its absolute value):

| Form | Quantity | n | median (signed) | median \|diff\| | 95th pct \|diff\| | largest \|diff\| |
|---|---|---|---|---|---|---|
| head, all | centre, up | 606 | +0.000 | 0.002 | **0.036** | 0.059 |
| head, all | centre, across | 606 | +0.004 | 0.005 | 0.037 | 0.095 |
| head, all | long semi-axis | 606 | +0.004 | 0.007 | 0.064 | 0.068 |
| head, all | short semi-axis | 606 | +0.001 | 0.002 | 0.024 | 0.026 |
| head, filled | centre, up | 570 | +0.000 | 0.002 | 0.033 | 0.043 |
| head, filled | centre, across | 570 | +0.004 | 0.004 | 0.026 | 0.041 |
| head, filled | long semi-axis | 570 | +0.005 | 0.006 | 0.023 | 0.060 |
| head, filled | short semi-axis | 570 | +0.001 | 0.002 | 0.006 | 0.017 |
| head, hollow | centre, up | 36 | +0.025 | 0.030 | 0.051 | 0.059 |
| head, hollow | centre, across | 36 | +0.049 | 0.049 | 0.089 | 0.095 |
| head, hollow | long semi-axis | 36 | -0.066 | 0.066 | 0.068 | 0.068 |
| head, hollow | short semi-axis | 36 | -0.025 | 0.025 | 0.026 | 0.026 |
| stem | column | 606 | +0.000 | 0.001 | 0.001 | 0.044 |
| stem | thickness | 606 | +0.000 | 0.000 | 0.000 | 0.113 |
| stem | far end (+ = fit longer) | 606 | +0.020 | 0.020 | 0.118 | 0.646 |
| dot | centre, across | 62 | +0.001 | 0.001 | 0.003 | 0.004 |
| dot | centre, up | 62 | -0.001 | 0.001 | 0.002 | 0.003 |
| dot | diameter | 62 | +0.004 | 0.004 | 0.007 | 0.008 |

**The tilt is stable on the render pages.** The SVG's glyph is one shape, tilted 30.6 degrees. The fitted tilt of the 570 filled heads has a median of 30.6, a 5th to 95th percentile of 29.4 to 32.7, and a standard deviation of 1.1 degrees; the difference from the SVG has a 95th percentile of 2.1 degrees (the hollow heads' median is 1.8 degrees under). The fitted axes are 0.683 and 0.476 staff spaces against the SVG's 0.678 and 0.475 (a ratio of 1.43 each). **That the tilt is stable here says nothing about a scan:** the desk's sketch on the Tchaikovsky gave 58, 27, and 55 degrees on three heads, and step 3.3 measures it on the scans.

**Filled and hollow.** The fit's own test (the ink in the inner 40% of the fitted ellipse) separates the two without a threshold in dispute: the filled heads' interior ink has a minimum of 1.00, and the hollow heads' a maximum of 0.23. The model for a hollow head was chosen by the reader's flag, which agrees with the SVG on all 606.

**The stem.** The column differs by 0.001 staff spaces at the 95th percentile and the thickness by 0.000. The far end is the loosest: 0.118 at the 95th percentile (0.014 median for plain stems, 0.030 for flagged ones), because a row within 1.5 px of a line's band is bridged, and the true end may lie anywhere in that stretch (about 0.23 staff spaces in all). **One outlier: *Sunless* 6 page 5, x 1484, y 2210, a flagged note, the fit runs 0.65 staff spaces past the SVG's end;** I did not look at why. **The head's end of the stem is not compared:** the SVG's stem starts inside the head, where the ink of the stem and the head are one, so it is not observable; the fit reports where the column leaves the fitted ellipse, and nothing is claimed of it. The reader found a stem for all 606 heads and its direction is right on all 606.

**The dot.** Fitted only at the 62 heads where the SVG prints a dot; found at 62 of 62. It is sub-pixel (0.003 across, 0.002 up, 0.007 in diameter, at the 95th percentile), and the printed disc is 0.40 staff spaces across (8.5 px), not half a staff space. **The fit found a round mark in the dot window at 40 of the 544 heads that carry no printed dot** (an accidental, a slur's end, a lyric's ink, the next note's ledger line: not examined). A fitted dot is therefore not evidence of a printed one; step 3.4 will have to say what rules one out.

**A first run of the dot fit gave 1.2 pixels of bias and diameters 1.4 px small.** It was a start value in `fit_dot` (half the radius where the radius was meant) and is fixed; the table is the fixed run's. The first run is not kept.


## Step 3.3: pass 1, the page teaches its own values

**What I used for a clear case** (the brief's bounds, set wide; every one is listed in the numbers table at the end with its source). A note is **clear** in two separate things, its stem and its dot, and an element is measured from the notes where that element is clear.

- **Stem.** The fitted stem is at least 2.5 staff spaces from the head's end to the far end. In the two strips beside the stem (1.9 staff spaces wide, from 0.6 past the tip to 0.35 past the head's end), with the neighbours' stems and heads, and this note's own head, taken out, and each staff line's band bridged where ink lies above and below it:
  - **plain:** no ink beyond the stem's own edge (ink within 0.20 staff spaces of the stem's corridor is its ragged edge or a line's junction with it). A quarter.
  - **flag:** one stroke touching the stem near its tip, on the right, that travels 2.0 to 3.5 staff spaces back toward the head, whose count of strokes at the cuts 0.25 to 0.85 staff spaces from the stem (only cuts the stroke reaches, runs starting no later than 2.0 from the tip) is one at every cut (an eighth) or two at every cut (a sixteenth).
  - **beam:** a stroke that runs to the strip's outer edge, a bar 0.25 to 0.75 staff spaces thick at both of the cuts 0.85 and 1.05, one bar or two, and a traced bar that covers at least 0.9 of the columns to the nearest same-direction stem.
  - Anything else is not clear. A note with ink in the strips that none of the above explains (a neighbour's flag, a dynamic's letter, an accidental, a barline), a stem under 2.5, a hollow head, or a stem with no fit is **not clear**, with the reason written beside it.
- **Dot.** A round blob (area 0.09 to 0.33 staff spaces squared, a disc of 0.34 to 0.65 across; equal principal axes to 0.8) at 0.9 to 2.2 staff spaces from the head's centre, at least 0.2 from a line's centre, **not part of a flag's stroke**, and no other ink in the dot window. A **clear absence** is a window that holds nothing larger than a speck.
- **A flag's tail looks like a dot.** On a first pass 14 to 60 of the 'clear dots' per song were the end of a flag. The tests above (the blob is not within 0.12 staff spaces of a stroke, and it is round) remove nearly all of them; 2 remain, in the check above.

**The check from the truth** (the scorer's matches on row 23's read; the table's last two columns): of the clear cases the scorer matched, how many does the truth give a different length. For the stem, the class is compared with the truth's base value (a quarter, an eighth, a sixteenth); for the dot, dotted or not.

| Song | page | heads | plain | flag1 | flag2 | beam1 | beam2 | dotted / undotted | stem class contradicted by the truth | dot contradicted by the truth |
|---|---|---|---|---|---|---|---|---|---|---|
| Sunless 1 | 1 | 48 | 22 | 7 | 0 | 0 | 0 | 2 / 23 | 0 of 29 | 0 of 25 |
| Sunless 1 | 2 | 54 | 24 | 6 | 0 | 0 | 0 | 5 / 28 | 1 of 29 | 1 of 30 |
| Sunless 4 | 9 | 43 | 9 | 7 | 0 | 0 | 0 | 3 / 15 | 0 of 16 | 0 of 18 |
| Sunless 4 | 10 | 72 | 14 | 9 | 0 | 2 | 0 | 2 / 22 | 0 of 25 | 0 of 24 |
| Sunless 5 | 11 | 16 | 2 | 5 | 0 | 0 | 0 | 2 / 2 | 0 of 6 | 1 of 3 |
| Sunless 5 | 12 | raises in the reader |  |  |  |  |  |  |  |
| Sunless 5 | 13 | 39 | 6 | 5 | 0 | 0 | 0 | 1 / 11 | 0 of 11 | 0 of 11 |
| Sunless 5 | 14 | 29 | 7 | 5 | 0 | 0 | 0 | 1 / 14 | 0 of 12 | 0 of 15 |
| Sunless 5 | 15 | 50 | 4 | 19 | 0 | 0 | 0 | 1 / 11 | 0 of 23 | 0 of 12 |
| Sunless 5 | 16 | 58 | 9 | 12 | 0 | 0 | 0 | 4 / 29 | 1 of 21 | 0 of 33 |
| Sunless 5 | 17 | 42 | 11 | 4 | 0 | 0 | 0 | 2 / 18 | 1 of 15 | 0 of 18 |
| Sunless 6 | 18 | 19 | 9 | 2 | 0 | 0 | 0 | 2 / 11 | 1 of 9 | 0 of 10 |
| Sunless 6 | 19 | 35 | 13 | 0 | 0 | 3 | 0 | 1 / 24 | 2 of 16 | 0 of 25 |
| Sunless 6 | 20 | 31 | 14 | 3 | 0 | 1 | 0 | 2 / 23 | 1 of 18 | 0 of 24 |
| Sunless 6 | 21 | 25 | 8 | 3 | 0 | 0 | 0 | 3 / 12 | 0 of 11 | 0 of 15 |
| Sunless 6 | 22 | 25 | 9 | 4 | 0 | 0 | 0 | 4 / 10 | 0 of 13 | 0 of 13 |
| Sunless 6 | 23 | 14 | 6 | 2 | 0 | 0 | 0 | 1 / 8 | 0 of 8 | 0 of 9 |
| Tchaikovsky | 1 | 39 | 3 | 6 | 0 | 0 | 0 | 1 / 9 | 0 of 9 | 0 of 10 |
| Tchaikovsky | 2 | 70 | 3 | 11 | 0 | 0 | 0 | 4 / 30 | 0 of 14 | 0 of 34 |
| Tchaikovsky | 3 | 64 | 3 | 11 | 0 | 0 | 0 | 3 / 13 | 0 of 14 | 0 of 16 |

**Totals, over the five songs:** of 299 matched clear stems, **7 are contradicted by the truth**; of 345 matched clear dots, **2** are; and of the 181 matched notes whose stem and dot are both clear, 8 are contradicted in one or the other. The 7 contradicted stems are plain stems (of 173 matched) that the truth gives as an eighth (3) or as a half note (4); I did not look at them (row 23's report names about 10 notes on *Sunless* 5 and 6 where the file and the print differ). **No clear flag or beam is contradicted by the truth (0 of 126 matched).** **There is no clear sixteenth and no clear two-bar beam on any page of the five songs:** the clear flags and beams are all single strokes, so **a sixteenth cannot be drawn from any page's own clear cases and always abstains in this trial.**

**The page's own values, median and (n), with the 5th and 95th percentile of the clear cases where the table gives a spread.** A value marked with an asterisk has fewer than **5 clear cases on that page** (a desk default: with fewer, a median and a spread say nothing), and the value shown is the **song's pool**; the page's own count is in the bracket. Where the song's pool is also under 5, the value is 'none'.

| Song | page | head a (s) | head b (s) | head tilt (deg) [p5, p95] | stem length (s) | stem thickness (s) | line thickness (s) |
|---|---|---|---|---|---|---|---|
| Sunless 1 | 1 | 0.640 (29) | 0.470 (29) | 29 [-0, 34] (29) | 3.17 (29) | 0.200 (29) | 0.200 (240) |
| Sunless 1 | 2 | 0.650 (30) | 0.474 (30) | 29 [-30, 35] (30) | 3.13 (30) | 0.200 (30) | 0.208 (270) |
| Sunless 4 | 9 | 0.621 (16) | 0.463 (16) | 1 [-0, 35] (16) | 3.36 (16) | 0.189 (16) | 0.169 (215) |
| Sunless 4 | 10 | 0.658 (25) | 0.479 (25) | 31 [0, 38] (25) | 3.03 (25) | 0.169 (25) | 0.153 (360) |
| Sunless 5 | 11 | 0.639 (7) | 0.466 (7) | 30 [-19, 35] (7) | 3.55 (7) | 0.181 (7) | 0.158 (78) |
| Sunless 5 | 13 | 0.717 (11) | 0.475 (11) | 30 [-0, 33] (11) | 3.28 (11) | 0.207 (11) | 0.164 (195) |
| Sunless 5 | 14 | 0.629 (12) | 0.466 (12) | 1 [0, 33] (12) | 3.28 (12) | 0.197 (12) | 0.158 (145) |
| Sunless 5 | 15 | 0.651 (23) | 0.477 (23) | 29 [0, 31] (23) | 3.23 (23) | 0.171 (23) | 0.167 (250) |
| Sunless 5 | 16 | 0.627 (21) | 0.465 (21) | 2 [-0, 32] (21) | 3.19 (21) | 0.196 (21) | 0.158 (290) |
| Sunless 5 | 17 | 0.632 (15) | 0.467 (15) | 3 [-0, 34] (15) | 3.31 (15) | 0.167 (15) | 0.158 (210) |
| Sunless 6 | 18 | 0.653 (11) | 0.465 (11) | 28 [0, 34] (11) | 3.09 (11) | 0.167 (11) | 0.133 (95) |
| Sunless 6 | 19 | 0.632 (16) | 0.465 (16) | 30 [18, 32] (16) | 2.86 (16) | 0.183 (16) | 0.175 (175) |
| Sunless 6 | 20 | 0.698 (18) | 0.493 (18) | 28 [0, 32] (18) | 2.86 (18) | 0.188 (18) | 0.149 (155) |
| Sunless 6 | 21 | 0.628 (11) | 0.465 (11) | 30 [-0, 33] (11) | 2.91 (11) | 0.188 (11) | 0.167 (125) |
| Sunless 6 | 22 | 0.634 (13) | 0.468 (13) | 30 [-0, 35] (13) | 3.00 (13) | 0.194 (13) | 0.169 (125) |
| Sunless 6 | 23 | 0.683 (8) | 0.484 (8) | 30 [12, 36] (8) | 3.05 (8) | 0.171 (8) | 0.137 (70) |
| Tchaikovsky | 1 | 0.626 (9) | 0.464 (9) | 31 [30, 47] (9) | 3.30 (9) | 0.143 (9) | 0.179 (195) |
| Tchaikovsky | 2 | 0.621 (14) | 0.465 (14) | 30 [0, 45] (14) | 3.23 (14) | 0.138 (14) | 0.172 (350) |
| Tchaikovsky | 3 | 0.624 (14) | 0.472 (14) | 34 [30, 50] (14) | 3.33 (14) | 0.143 (14) | 0.179 (320) |

| Song | page | flag reach (s) | flag travel (s) | beam thickness (s) |
|---|---|---|---|---|
| Sunless 1 | 1 | 1.00 [0.92, 1.06] (7) | 3.55 [3.34, 3.59] (7) | none |
| Sunless 1 | 2 | 1.03 [0.98, 1.09] (6) | 3.54 [3.43, 3.58] (6) | none |
| Sunless 4 | 9 | 0.92 [0.87, 1.01] (7) | 3.44 [2.54, 3.50] (7) | 0.58 [0.58, 0.64] (0)* |
| Sunless 4 | 10 | 0.87 [0.80, 1.12] (9) | 3.21 [2.78, 3.53] (9) | 0.58 [0.58, 0.64] (4)* |
| Sunless 5 | 11 | 0.90 [0.85, 0.99] (5) | 3.55 [3.18, 3.58] (5) | none |
| Sunless 5 | 13 | 1.10 [1.01, 1.17] (5) | 3.57 [3.38, 3.58] (5) | none |
| Sunless 5 | 14 | 1.07 [1.01, 1.15] (5) | 3.53 [3.49, 3.58] (5) | none |
| Sunless 5 | 15 | 1.03 [0.99, 1.14] (19) | 3.52 [3.06, 3.58] (19) | none |
| Sunless 5 | 16 | 1.05 [0.99, 1.13] (12) | 3.15 [2.72, 3.50] (12) | none |
| Sunless 5 | 17 | 1.03 [0.92, 1.15] (4)* | 3.52 [2.81, 3.58] (4)* | none |
| Sunless 6 | 18 | 0.96 [0.80, 1.11] (2)* | 3.24 [2.74, 3.42] (2)* | 0.41 [0.30, 0.56] (0)* |
| Sunless 6 | 19 | 0.96 [0.80, 1.11] (0)* | 3.24 [2.74, 3.42] (0)* | 0.39 [0.30, 0.52] (6) |
| Sunless 6 | 20 | 0.96 [0.80, 1.11] (3)* | 3.24 [2.74, 3.42] (3)* | 0.41 [0.30, 0.56] (2)* |
| Sunless 6 | 21 | 0.96 [0.80, 1.11] (3)* | 3.24 [2.74, 3.42] (3)* | 0.41 [0.30, 0.56] (0)* |
| Sunless 6 | 22 | 0.96 [0.80, 1.11] (4)* | 3.24 [2.74, 3.42] (4)* | 0.41 [0.30, 0.56] (0)* |
| Sunless 6 | 23 | 0.96 [0.80, 1.11] (2)* | 3.24 [2.74, 3.42] (2)* | 0.41 [0.30, 0.56] (0)* |
| Tchaikovsky | 1 | 1.02 [0.93, 1.07] (6) | 3.23 [2.97, 3.43] (6) | none |
| Tchaikovsky | 2 | 0.90 [0.83, 0.97] (11) | 2.96 [2.71, 3.36] (11) | none |
| Tchaikovsky | 3 | 0.96 [0.93, 1.05] (11) | 3.34 [2.80, 3.45] (11) | none |

| Song | page | dot diameter (s) | dot centre dx (s) | dot gap from head edge (s) | dot up, head on a line (s) | dot up, head in a space (s) |
|---|---|---|---|---|---|---|
| Sunless 1 | 1 | 0.49 (2)* | 1.15 (2)* | 0.53 (2)* | 0.52 (1)* | 0.00 (1)* |
| Sunless 1 | 2 | 0.52 (5) | 1.16 (5) | 0.54 (5) | 0.52 (1)* | 0.00 (4)* |
| Sunless 4 | 9 | 0.44 (3)* | 1.18 (3)* | 0.56 (3)* | 0.41 (2)* | -0.01 (1)* |
| Sunless 4 | 10 | 0.44 (2)* | 1.18 (2)* | 0.56 (2)* | 0.41 (0)* | -0.01 (2)* |
| Sunless 5 | 11 | 0.51 (2)* | 1.36 (2)* | 0.70 (2)* | 0.45 (1)* | -0.05 (1)* |
| Sunless 5 | 13 | 0.51 (1)* | 1.36 (1)* | 0.70 (1)* | 0.45 (1)* | -0.05 (0)* |
| Sunless 5 | 14 | 0.51 (1)* | 1.36 (1)* | 0.70 (1)* | 0.45 (1)* | -0.05 (0)* |
| Sunless 5 | 15 | 0.51 (1)* | 1.36 (1)* | 0.70 (1)* | 0.45 (0)* | -0.05 (1)* |
| Sunless 5 | 16 | 0.51 (4)* | 1.36 (4)* | 0.70 (4)* | 0.45 (2)* | -0.05 (2)* |
| Sunless 5 | 17 | 0.51 (2)* | 1.36 (2)* | 0.70 (2)* | 0.45 (1)* | -0.05 (1)* |
| Sunless 6 | 18 | 0.46 (2)* | 1.14 (2)* | 0.53 (2)* | 0.47 (1)* | 0.00 (1)* |
| Sunless 6 | 19 | 0.46 (1)* | 1.14 (1)* | 0.53 (1)* | 0.47 (1)* | 0.00 (0)* |
| Sunless 6 | 20 | 0.46 (2)* | 1.14 (2)* | 0.53 (2)* | 0.47 (2)* | 0.00 (0)* |
| Sunless 6 | 21 | 0.46 (3)* | 1.14 (3)* | 0.53 (3)* | 0.47 (2)* | 0.00 (1)* |
| Sunless 6 | 22 | 0.46 (4)* | 1.14 (4)* | 0.53 (4)* | 0.47 (4)* | 0.00 (0)* |
| Sunless 6 | 23 | 0.46 (1)* | 1.14 (1)* | 0.53 (1)* | 0.47 (1)* | 0.00 (0)* |
| Tchaikovsky | 1 | 0.46 (1)* | 1.20 (1)* | 0.61 (1)* | 0.62 (0)* | -0.02 (1)* |
| Tchaikovsky | 2 | 0.46 (4)* | 1.20 (4)* | 0.61 (4)* | 0.62 (0)* | -0.02 (4)* |
| Tchaikovsky | 3 | 0.46 (3)* | 1.20 (3)* | 0.61 (3)* | 0.62 (1)* | -0.02 (2)* |

**The song-level values beside Gould's** (the desk's draft, section 1; Gould's row says where it comes from):

| Song | head a | head b | tilt | stem length | stem thickness | flag reach | flag travel | beam thickness | dot diameter | dot dx | line thickness |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Sunless 1 | 0.645 (59) | 0.471 (59) | 29 (59) | 3.15 (59) | 0.200 (59) | 1.03 (13) | 3.55 (13) | none (0) | 0.49 (7) | 1.15 (7) | 0.202 (510) |
| Sunless 4 | 0.629 (41) | 0.466 (41) | 30 (41) | 3.17 (41) | 0.177 (41) | 0.89 (16) | 3.24 (16) | 0.58 (4) | 0.44 (5) | 1.18 (5) | 0.153 (575) |
| Sunless 5 | 0.635 (89) | 0.471 (89) | 28 (89) | 3.27 (89) | 0.183 (89) | 1.03 (50) | 3.52 (50) | none (0) | 0.51 (11) | 1.36 (11) | 0.158 (1168) |
| Sunless 6 | 0.648 (77) | 0.470 (77) | 30 (77) | 2.93 (77) | 0.186 (77) | 0.96 (14) | 3.24 (14) | 0.41 (8) | 0.46 (13) | 1.14 (13) | 0.159 (745) |
| Tchaikovsky | 0.624 (37) | 0.465 (37) | 31 (37) | 3.26 (37) | 0.143 (37) | 0.93 (28) | 3.16 (28) | none (0) | 0.46 (8) | 1.20 (8) | 0.179 (865) |

| Value | Gould (the desk's draft) | What the five songs show |
|---|---|---|
| Stem length | 3.5, never under 2.5 (r86) | 2.93 to 3.27 median by song (from the head's end, so the desk's 3.50 from the head's centre is a different measure) |
| Stem thickness | thinner than a line (r84) | 0.14 to 0.20 staff spaces; the line is 0.15 to 0.20 on the scans: about equal on *Sunless*, thinner on the Tchaikovsky (0.14 against 0.18) |
| Flag travel | 2.5 to 3.25 (r87) | **not measurable here**: a stroke that reaches the window's far end (0.35 past the head's end) has a travel of at least that, and **11 of 13 clear flags on *Sunless* 1, 35 of 50 on *Sunless* 5, 3 of 16 on *Sunless* 4, 3 of 14 on *Sunless* 6, and 0 of 28 on the Tchaikovsky** do. The median travel of the others is 3.1 to 3.4. The tails on these editions end at or near the head's row |
| Beam thickness | 0.5 (r249) | 0.58 (*Sunless* 4, 4 cases) and 0.41 (*Sunless* 6, 8 cases); none elsewhere |
| Dot size | about twice a staccato dot (r111) | 0.44 to 0.51 staff spaces across (5 to 13 cases per song) |
| Dot, centre to centre | median 1.21 (the desk's measure) | 1.14 to 1.36 |
| Dot, height | centred in a space; a line-note's goes in the space above (r111) | up 0.41 to 0.62 for a head on a line, -0.05 to 0.00 for a head in a space (the pooled values; 0 to 4 cases per page) |
| Head | an oval slanting up (r83); size never photographed | semi-axes 0.62 to 0.65 by 0.47 (the render's glyph: 0.68 by 0.48) |

**Is the head's tilt stable on the scans? No.** The render's glyph is 30.6 degrees and the fit recovers it to 1 degree there. On the scans the fitted tilt of the clear cases is under 15 degrees for 44% of the heads of *Sunless* 1, 32% of 4, 43% of 5, 22% of 6, and 8% of the Tchaikovsky, and 15 to 45 degrees for the rest (19% of the Tchaikovsky's are over 45). The page medians split into two groups, about 30 degrees on 14 pages and 1 to 3 degrees on 4 pages (*Sunless* 4 page 9, *Sunless* 5 pages 14, 16, and 17). The heavy staff lines merge with the head's ink, so the tilt is under-determined when a head sits on a line. The trial draws each head from its own fitted ellipse, not from a page tilt, so the instability does not enter the drawings; it does mean the 'page's tilt' is not a value the page gives.

**The staff line's thickness** (the last column of the first values table): 0.13 to 0.21 of a staff space on the scans. It differs by page and by song as row 23's report said (0.200 on *Sunless* 1, 0.153 on 4, 0.158 on 5, 0.159 on 6, 0.179 on the Tchaikovsky, medians of the locally measured thickness).

**The flag's own outline, harvested from the clear flags and aligned at the stem's far end, one for each stem direction** (the median of the grey-level ink beyond the stem's corridor, on a grid of 1/32 staff space, the staff lines inpainted away; `outlines.files/`). The count of clear eighth flags by direction and by page:

| Song | clear flags up-stem, by page | clear flags down-stem, by page | the song's pool, up / down |
|---|---|---|---|
| *Sunless* 1 | p1 7, p2 6 | none | 13 / 0 |
| *Sunless* 4 | p9 4, p10 6 | p9 3, p10 3 | 10 / 6 |
| *Sunless* 5 | p11 5, p13 5, p14 5, p15 17, p16 6, p17 3 | p15 2, p16 6, p17 1 | 41 / 9 |
| *Sunless* 6 | p18 2, p20 3, p21 3, p22 4, p23 1 | p23 1 | 13 / 1 |
| Tchaikovsky | p1 3, p2 2, p3 9 | p1 3, p2 9, p3 2 | 14 / 14 |

**Where I pooled** (the rule: fewer than 5 of a kind on a page, take the song's pool; the table of outlines used, below, gives every page's source). Up-stem outlines are the page's own on 9 of the 18 pages and the song's pool on the rest. Down-stem outlines are the page's own on 2 pages (*Sunless* 5 page 16 and the Tchaikovsky page 2) and pooled on the rest. **There is no down-stem outline for *Sunless* 1 or 6** (the song's pool is 0 and 1, under 5), so **no down-stemmed flag on those songs can be drawn and each abstains.** Beam values are pooled on every *Sunless* 6 page except 19, and there are none for any other song. Dot values (diameter, gap from the head's edge, and the residual of the dot's height from the space's centre) are the page's own only on *Sunless* 1 page 2 (5 clear dots) and are the song's pool elsewhere. The page-by-page sources are in the next table.

## Step 3.4: pass 2, the rest are read by drawing them

**What was drawn** (`fitted.py`, `note_errors`): for each note with a stem fit and a filled head, the lines at their locally measured places and thickness (ledger lines at their nominal rows), the head's ellipse and the stem at their fitted places, the neighbours' stems and heads, and then each candidate: **a quarter** (nothing more), **an eighth** (the page's flag outline once, or one bar from this tip to the next same-direction stem's tip, thickness the page's beam thickness), **a sixteenth** (the page's two-stroke outline, or two bars a bar-pitch apart; **neither is drawable on any song**, there is no clear case), and **the dot** (a disc of the page's diameter, its centre a page-median gap right of the head's edge and up by the centre of the space, 0.5 for a head on a line and 0 in a space, GOULD r111, plus the page's own median residual).

**The comparison I chose, and why.** The mean squared difference between the drawing and the scan's grey-level ink over the area in which the candidates differ: the strips either side of the stem (where a flag or a bar would be), and the dot's window (a box right of the head), each pixel in one or the other. A flag's tail that passes through the dot window is the flag's to explain, so the pixels a candidate's flag or bar covers in that window belong to the stem's comparison, and the rest of the window to the dot's. I chose it because it is where a candidate adds ink that another does not and nothing else of the note is in it, and because a mean over the area, unlike a count of pixels, does not depend on how long the stem is.

**The decision, with no constant fitted to these songs.** For the stem and the dot separately, the best-fitting drawable candidate (the lowest difference) is **read** if its difference is no larger than the largest difference that the page's clear cases of that kind show against their own drawings (the song's pool where the page has under 5), and no candidate of another length is also within its own bound. Otherwise the note **abstains** and the reason names what was close: how many times the bound the best fit is, or which two lengths were both within. A first version of this rule read the candidate that was within its bound whatever its fit, and it read dots that the flag's tail had put in the window; the rule above (best fit first) replaced it before any note was read from the final runs, and the first version's numbers are not kept. **The statistic, the maximum over the clear cases, is the brief's 'what the clear cases show'; a different statistic (a high percentile, a spread) would change the counts, and I did not try one.**

**The bounds, and the outlines used, page by page** (tolerances are mean squared differences of darkness; the bracket is where the bound comes from and the count of clear cases behind it; the last column is step 3.5's bound):

| Song | page | quarter bound | eighth (flag) bound | undotted bound | dotted bound | round trip U / V bound |
|---|---|---|---|---|---|---|
| Sunless 1 | 1 | 0.042 (page 22) | 0.033 (page 7) | 0.100 (page 23) | 0.054 (song 7) | 0.88 / 0.40 (page 16) |
| Sunless 1 | 2 | 0.040 (page 24) | 0.030 (page 6) | 0.147 (page 28) | 0.054 (page 5) | 0.97 / 0.41 (page 22) |
| Sunless 4 | 9 | 0.032 (page 9) | 0.032 (page 7) | 0.037 (page 15) | 0.074 (song 5) | 0.59 / 0.32 (page 9) |
| Sunless 4 | 10 | 0.031 (page 14) | 0.030 (page 9) | 0.044 (page 22) | 0.074 (song 5) | 0.55 / 0.34 (page 13) |
| Sunless 5 | 11 | 0.136 (song 39) | 0.079 (page 5) | 0.225 (song 85) | 0.091 (song 11) | 0.89 / 0.54 (song 44) |
| Sunless 5 | 13 | 0.023 (page 6) | 0.068 (page 5) | 0.038 (page 11) | 0.091 (song 11) | 0.57 / 0.12 (page 5) |
| Sunless 5 | 14 | 0.025 (page 7) | 0.037 (page 5) | 0.031 (page 14) | 0.091 (song 11) | 0.43 / 0.44 (page 7) |
| Sunless 5 | 15 | 0.136 (song 39) | 0.037 (page 19) | 0.020 (page 11) | 0.091 (song 11) | 0.54 / 0.13 (page 6) |
| Sunless 5 | 16 | 0.031 (page 9) | 0.050 (page 12) | 0.044 (page 29) | 0.091 (song 11) | 0.89 / 0.27 (page 15) |
| Sunless 5 | 17 | 0.031 (page 11) | 0.079 (song 50) | 0.225 (page 18) | 0.091 (song 11) | 0.60 / 0.54 (page 10) |
| Sunless 6 | 18 | 0.028 (page 9) | 0.050 (song 13) | 0.031 (page 11) | 0.104 (song 13) | 0.43 / 0.39 (page 9) |
| Sunless 6 | 19 | 0.027 (page 13) | 0.050 (song 13) | 0.025 (page 24) | 0.104 (song 13) | 0.74 / 0.35 (page 16) |
| Sunless 6 | 20 | 0.024 (page 14) | 0.050 (song 13) | 0.035 (page 23) | 0.104 (song 13) | 0.44 / 0.25 (page 14) |
| Sunless 6 | 21 | 0.029 (page 8) | 0.050 (song 13) | 0.038 (page 12) | 0.104 (song 13) | 0.70 / 0.34 (page 7) |
| Sunless 6 | 22 | 0.023 (page 9) | 0.050 (song 13) | 0.027 (page 10) | 0.104 (song 13) | 0.64 / 0.42 (page 9) |
| Sunless 6 | 23 | 0.022 (page 6) | 0.050 (song 13) | 0.020 (page 8) | 0.104 (song 13) | 0.37 / 0.27 (page 6) |
| Tchaikovsky | 1 | 0.051 (song 9) | 0.058 (page 6) | 0.036 (page 9) | 0.081 (song 8) | 0.56 / 0.54 (song 18) |
| Tchaikovsky | 2 | 0.051 (song 9) | 0.058 (page 11) | 0.062 (page 30) | 0.081 (song 8) | 0.56 / 0.54 (page 11) |
| Tchaikovsky | 3 | 0.051 (song 9) | 0.067 (page 11) | 0.054 (page 13) | 0.081 (song 8) | 0.56 / 0.54 (song 18) |

**Which outlines each page drew from, and the beam and dot values:**

| Song | page | flag outlines used (source, count) | beam values | dot values |
|---|---|---|---|---|
| Sunless 1 | 1 | flag1_up page (n 7) | {'thick_s': None, 'pitch_s': None} | {'d_s': 0.4861031522044834, 'gap_s': 0.5286347154150463, 'resid_s': 0.0036477691966714096} |
| Sunless 1 | 2 | flag1_up page (n 6) | {'thick_s': None, 'pitch_s': None} | {'d_s': 0.5157185218596699, 'gap_s': 0.5385883989387518, 'resid_s': 0.036360579067301536} |
| Sunless 4 | 9 | flag1_down song (n 6), flag1_up song (n 10) | {'thick_s': None, 'pitch_s': None} | {'d_s': 0.43535287656226807, 'gap_s': 0.5575034232712618, 'resid_s': -0.013860887096774193} |
| Sunless 4 | 10 | flag1_down song (n 6), flag1_up page (n 6) | {'thick_s': None, 'pitch_s': None} | {'d_s': 0.43535287656226807, 'gap_s': 0.5575034232712618, 'resid_s': -0.013860887096774193} |
| Sunless 5 | 11 | flag1_down song (n 9), flag1_up page (n 5) | {'thick_s': None, 'pitch_s': None} | {'d_s': 0.5101542785876317, 'gap_s': 0.7036742292725743, 'resid_s': -0.045873064981909316} |
| Sunless 5 | 13 | flag1_down song (n 9), flag1_up page (n 5) | {'thick_s': None, 'pitch_s': None} | {'d_s': 0.5101542785876317, 'gap_s': 0.7036742292725743, 'resid_s': -0.045873064981909316} |
| Sunless 5 | 14 | flag1_down song (n 9), flag1_up page (n 5) | {'thick_s': None, 'pitch_s': None} | {'d_s': 0.5101542785876317, 'gap_s': 0.7036742292725743, 'resid_s': -0.045873064981909316} |
| Sunless 5 | 15 | flag1_down song (n 9), flag1_up page (n 17) | {'thick_s': None, 'pitch_s': None} | {'d_s': 0.5101542785876317, 'gap_s': 0.7036742292725743, 'resid_s': -0.045873064981909316} |
| Sunless 5 | 16 | flag1_down page (n 6), flag1_up page (n 6) | {'thick_s': None, 'pitch_s': None} | {'d_s': 0.5101542785876317, 'gap_s': 0.7036742292725743, 'resid_s': -0.045873064981909316} |
| Sunless 5 | 17 | flag1_down song (n 9), flag1_up song (n 41) | {'thick_s': None, 'pitch_s': None} | {'d_s': 0.5101542785876317, 'gap_s': 0.7036742292725743, 'resid_s': -0.045873064981909316} |
| Sunless 6 | 18 | flag1_up song (n 13) | {'thick_s': 0.40625, 'pitch_s': None} | {'d_s': 0.4637642294004752, 'gap_s': 0.5253418910103186, 'resid_s': -0.0267016641609365} |
| Sunless 6 | 19 | flag1_up song (n 13) | {'thick_s': 0.390625, 'pitch_s': None} | {'d_s': 0.4637642294004752, 'gap_s': 0.5253418910103186, 'resid_s': -0.0267016641609365} |
| Sunless 6 | 20 | flag1_up song (n 13) | {'thick_s': 0.40625, 'pitch_s': None} | {'d_s': 0.4637642294004752, 'gap_s': 0.5253418910103186, 'resid_s': -0.0267016641609365} |
| Sunless 6 | 21 | flag1_up song (n 13) | {'thick_s': 0.40625, 'pitch_s': None} | {'d_s': 0.4637642294004752, 'gap_s': 0.5253418910103186, 'resid_s': -0.0267016641609365} |
| Sunless 6 | 22 | flag1_up song (n 13) | {'thick_s': 0.40625, 'pitch_s': None} | {'d_s': 0.4637642294004752, 'gap_s': 0.5253418910103186, 'resid_s': -0.0267016641609365} |
| Sunless 6 | 23 | flag1_up song (n 13) | {'thick_s': 0.40625, 'pitch_s': None} | {'d_s': 0.4637642294004752, 'gap_s': 0.5253418910103186, 'resid_s': -0.0267016641609365} |
| Tchaikovsky | 1 | flag1_down song (n 14), flag1_up song (n 14) | {'thick_s': None, 'pitch_s': None} | {'d_s': 0.4585925377591676, 'gap_s': 0.6112042040977843, 'resid_s': -0.016644192534127356} |
| Tchaikovsky | 2 | flag1_down page (n 9), flag1_up song (n 14) | {'thick_s': None, 'pitch_s': None} | {'d_s': 0.4585925377591676, 'gap_s': 0.6112042040977843, 'resid_s': -0.016644192534127356} |
| Tchaikovsky | 3 | flag1_down song (n 14), flag1_up page (n 9) | {'thick_s': None, 'pitch_s': None} | {'d_s': 0.4585925377591676, 'gap_s': 0.6112042040977843, 'resid_s': -0.016644192534127356} |

**What it gave on the notes pass 2 took, beside row 23's rule on the same notes** (matched notes only; 'notes' says which group: **clear** is a note whose stem and dot are both clear and which the trial reads as they are; **pass 2** is every note with a stem or a dot that is not clear; **kept** is a hollow head or a note with no stem fit, whose length the trial leaves as the reader gave it; the right, wrong, and abstained are by the truth; scored on the trial's reads, so the matches are the trial's):

| Song | notes | trial right | trial wrong | trial abstained | row 23 right | row 23 wrong | row 23 abstained |
|---|---|---|---|---|---|---|---|
| Sunless 1 | clear | 36 | 2 | 0 | 33 | 3 | 2 |
| Sunless 1 | pass 2 | 25 | 0 | 30 | 47 | 2 | 6 |
| Sunless 1 | kept | 1 | 1 | 1 | 1 | 1 | 1 |
| Sunless 4 | clear | 22 | 0 | 0 | 21 | 0 | 1 |
| Sunless 4 | pass 2 | 20 | 3 | 66 | 77 | 1 | 11 |
| Sunless 4 | kept | 2 | 2 | 0 | 2 | 2 | 0 |
| Sunless 5 | clear | 42 | 1 | 0 | 42 | 1 | 0 |
| Sunless 5 | pass 2 | 39 | 5 | 112 | 123 | 7 | 26 |
| Sunless 5 | kept | 0 | 5 | 7 | 0 | 5 | 7 |
| Sunless 6 | clear | 58 | 3 | 0 | 39 | 18 | 4 |
| Sunless 6 | pass 2 | 6 | 4 | 55 | 42 | 14 | 9 |
| Sunless 6 | kept | 4 | 6 | 1 | 4 | 6 | 1 |
| Tchaikovsky | clear | 18 | 0 | 0 | 18 | 0 | 0 |
| Tchaikovsky | pass 2 | 27 | 0 | 123 | 116 | 13 | 21 |
| Tchaikovsky | kept | 1 | 4 | 0 | 1 | 4 | 0 |

**What pass 2 did, in a sentence a singer could use:** it read 25, 20, 39, 6, and 27 notes right that were not clear, **misread 0, 3, 5, 4, and 0**, and abstained on 30, 66, 112, 55, and 123. Row 23's rule read 47, 77, 123, 42, and 116 of the same notes right, and misread 2, 1, 7, 14, and 13. **Where pass 2 reads, it is as good as row 23 or better (fewer misreads on *Sunless* 1, 5, and 6 and the Tchaikovsky, 2 more on *Sunless* 4); where it abstains it is mostly refusing notes that row 23 read right.**

**Why it abstains** (the reasons it recorded, counted over the notes it abstained on; the key counts):

Sunless 1: [('best_fit_K_is_Nx_its_bound', 33), ('a_second_length_is_also_within_its_bound:dotted+undotted', 4), ('a_second_length_is_also_within_its_bound:undotted+dotted', 1)]
Sunless 4: [('best_fit_K_is_Nx_its_bound', 84), ('a_second_length_is_also_within_its_bound:undotted+dotted', 3), ('a_second_length_is_also_within_its_bound:dotted+undotted', 1)]
Sunless 5: [('best_fit_K_is_Nx_its_bound', 116), ('a_second_length_is_also_within_its_bound:flag1+plain', 17), ('a_second_length_is_also_within_its_bound:plain+flag1', 7), ('a_second_length_is_also_within_its_bound:undotted+dotted', 3), ('a_second_length_is_also_within_its_bound:dotted+undotted', 2)]
Sunless 6: [('best_fit_K_is_Nx_its_bound', 45), ('best_fit_is_K_whose_tolerance_the_song_has_not_shown(no_clear_case)', 10), ('a_second_length_is_also_within_its_bound:undotted+dotted', 4)]
Tchaikovsky: [('best_fit_K_is_Nx_its_bound', 131), ('a_second_length_is_also_within_its_bound:flag1+plain', 22), ('a_second_length_is_also_within_its_bound:undotted+dotted', 7), ('a_second_length_is_also_within_its_bound:plain+flag1', 3)]

The dominant reason is 'best fit is N times its bound'. On the same notes, run again on the same extracted fits outside Pyodide (numpy 2.4, not the pin, so it is a check of the shape and not a number to quote), the best fit's error was a median of 1.3, 1.8, 2.2, 2.1, and 1.4 times its bound by song, and 44, 18, 15, 14, and 34 percent of those were within 1.25 times. **So most abstentions are notes whose best drawing differs from their scan by more than any clear case's does. They are not borderline. They are notes with ink that no drawing from the page's own clear cases explains: the previous note's flag or the next one's head in the window, a dynamic's letter, a slur, an accidental.** On *Sunless* 5 and the Tchaikovsky a second reason is large: 24 and 25 notes had a plain and an eighth both within their bounds, so the trial refused to choose. On *Sunless* 6, 10 notes' best fit was a beam, and the song has no clear beam of that form to bound it.


## Step 3.5: the round trip

**What was drawn.** For each note the trial read, the drawing of its reading (lines, head, stem, the page's flag outline or the bars, the dot's disc, the neighbours' stems and heads) is laid over its scan, in the note's own area (from 1.0 staff space left of the stem and head to 2.4 right of them, and 0.7 past the head and the tip). **The scan's ink the drawing does not hold (U), and the drawing's ink the scan does not hold (V), each as a share of the drawing's ink apart from the lines.** `rt` in the per-note records.

**The spread, for the notes read as printed and the notes misread** (by the truth; the trial's own reading drawn), pooled over the five songs:

| Notes | n | U median [5th, 95th percentile] | V median [5th, 95th percentile] |
|---|---|---|---|
| read as printed | 290 | 0.40 [0.22, 0.85] | 0.17 [0.08, 0.37] |
| misread | 18 | 0.40 [0.18, 0.86] | 0.20 [0.15, 0.30] |

By song, read as printed and misread: *Sunless* 1: U median 0.53 (61 notes) and 0.87 (2); *Sunless* 4: 0.36 (40) and 0.24 (3); *Sunless* 5: 0.39 (81) and 0.43 (6); *Sunless* 6: 0.39 (63) and 0.38 (7); Tchaikovsky: 0.37 (45) and none. The V medians run 0.15 to 0.27 for reads and 0.19 to 0.22 for misreads.

**Would a bound taken from the page's clear cases mark the misread notes unsure? No.** The bound is the largest U and the largest V that the page's clear cases (stem and dot both clear) show against their own drawings (the song's where the page has under 5; in the table of step 3.4). **It marks 2 of the 18 misread notes (both on *Sunless* 5) and 36 of the 290 notes read as printed (3, 5, 16, 2, and 10 on the five songs).** The two distributions overlap almost entirely. The share is dominated by the head's edge (the fitted ellipse is smaller than the printed head where the head merges with a line, a red crescent on the sheets) and by the stem's junctions with the lines, which every note shows, so it does not carry the length.

**The overlay sheets** (`overlay-sheets.files/`, one for each build song; each tile is a note the trial read: the scan in grey, the drawing's ink that the scan holds in blue, the drawing's ink that the scan does not hold in orange, the scan's unexplained ink in red; the frame is green where the trial's length is right by the truth, red where it is wrong, grey where no truth note matches; the label says C for a clear case or P for a pass-2 note, the page, the head's x, and the length read).

## Step 3.6: the pitch, to report and not to change

For every matched note, the pitch step that the fitted centre gives against the traced lines (the reader's own formula: the top line's row less the centre's, over half the line spacing, rounded), beside the reader's step and the truth's pitch. Nothing is emitted from it.

| Song | matched notes with a fit | same step as the reader | fitted step differs | ...and the fit agrees with the truth, the reader does not | ...the reader agrees, the fit does not | ...neither |
|---|---|---|---|---|---|---|
| *Sunless* 1 | 93 | 93 | 0 | 0 | 0 | 0 |
| *Sunless* 4 | 113 | 112 | 1 | 1 | 0 | 0 |
| *Sunless* 5 | 207 | 206 | 1 | 0 | 0 | 1 |
| *Sunless* 6 | 135 | 135 | 0 | 0 | 0 | 0 |
| Tchaikovsky | 173 | 172 | 1 | 1 | 0 | 0 |

**The fitted centre gives the reader's step on 718 of 721 notes, and on the 3 where it differs it agrees with the truth on 2 and the reader on none.** The reader's pitch errors on these songs are therefore not errors of the step. They come from accidentals and the key, which the fitted centre does not touch. (Where the step differs I give the pitch with the key's alteration for the new letter; where the reader had read an accidental, the comparison is approximate. Three notes.)

## Step 3.7: the score

The trial's lengths put in place of the reader's in each read (`cfg['fitted_lengths']` in `run_page2.py`: ten lines, **off unless a measurement hands them in**; the bars, onsets, and sums are derived from the durations as they always are), merged as the Worker merges, and scored with `score-songs.ts` (a copy of `scan-baseline.ts`; the same scorer). The five build songs in full; then, once, with everything frozen, the two test-only songs, totals only; nothing was changed after the first test-only run, and I did not run them again.

| Song | matched | length right | length wrong | length abstained | pitch right | both right | headline | row 23: right, wrong, abstained, headline |
|---|---|---|---|---|---|---|---|---|
| *Sunless* 1 | 96 | 62 | 3 | 31 | 72 | 47 | 49.0 | 81, 6, 9, 64.6 |
| *Sunless* 4 | 115 | 44 | 5 | 66 | 92 | 38 | 32.8 | 100, 3, 12, 69.8 |
| *Sunless* 5 | 211 | 81 | 11 | 119 | 153 | 64 | 24.8 | 170, 14, 31, 46.1 |
| *Sunless* 6 | 137 | 68 | 13 | 56 | 98 | 46 | 28.6 | 89, 34, 14, 41.0 |
| Tchaikovsky | 173 | 46 | 4 | 123 | 163 | 44 | 25.3 | 135, 17, 21, 73.0 |
| *Sunless* 2 (test, totals) | 67 | 22 | 17 | 28 | 48 | 13 | 19.1 | 27, 34, 6, 23.5 |
| *Sunless* 3 (test, totals) | 197 | 38 | 58 | 101 | 136 | 30 | 13.5 | 91, 76, 30, 32.4 |

(The *Sunless* 5 row's pitch right and matched notes differ from row 23's, 150 and 215, because the aligner pairs notes by pitch and length together and paired them differently once the lengths moved, as in row 23's own report.)

**Read time with the switch on** (wall seconds in the app's Worker under Pyodide; the trial reads the song, fits and decides, and reads it again with its lengths, so it is about 2.4 times row 23's one read: read, trial, re-read): *Sunless* 1 **46.7** (21.4, 8.0, 17.3; row 23: 19.7), 4 **50.0** (22.3, 10.1, 17.6; 17.7), 5 **129.8** (62.8, 13.3, 53.7; 54.3), 6 **104.9** (53.0, 5.8, 46.1; 46.6), Tchaikovsky **78.4** (36.0, 12.9, 29.5; 26.8), and the test-only *Sunless* 2 **34.7** (13.9) and 3 **117.3** (44.4). **The trial itself is 6 to 20 seconds a song.** A build that put the fits into the one read would cost the 6 to 20 seconds and not the second read.

## Section 6, items 1 to 4, 7, and 8, line by line

1. **Step 3.1's two tables: reported** (above).
2. **Step 3.2's differences: reported; the stop did not fire** (0.036 at the 95th percentile against 0.15).
3. **Steps 3.3 to 3.6: reported page by page, each number's source in the table below.**
4. **The table of row 23 beside the trial's: the table in step 3.7.**
7. **With the switch off the 23 render pages are byte-identical: MET.** I re-read all six render songs with today's default after adding the hook; the events' JSON equals the earlier default read on all six (the 23 pages that read; *Sunless* 6 page 6 raises as before). **Gates at baseline: MET.** Gate 4 is `1824 passed (1824)` (`@ilya/web`); gate 5 is `644 passed | 5 skipped (649)` (`@ilya/score-parser`); and `@ilya/phonology` 251, `@ilya/dictionary` 235, `@ilya/blurb` 145, and the root suite 55 (as row 23's report). I did not run `ilya-ship.sh` (it is not in the tree) or the type check, the build, or the end-to-end suite: **no product code changed**, and the one reader file I touched is Python that the type check and the build do not read.
8. **Read time: in step 3.7.**

## What could not be established

- **That the maximum is the right statistic for 'what the clear cases show'.** It is the brief's wording read literally. A single clear case with a large difference widens the bound for every note on the page (one *Sunless* 5 page's undotted bound is 0.225, the song's pool, against 0.02 to 0.04 on its sibling pages). I did not try another statistic.
- **Whether sixteenths, two-bar beams, and down-stem flags on *Sunless* 1 and 6 would be read if the page gave clear cases of them.** There are none, so none can be drawn. The pool across the *Sunless* songs (same engraver, same plates) would give a down-stem outline for 1 and 6 (9 and 6 clear down flags on 5 and 4); the brief says to pool across the song, and I did.
- **The flag's true travel on these editions.** Most clear flags reach the window's far end; I do not know whether the tail touches the head's ink or ends close to it.
- **Why the 4 plain stems and the 5 longer-valued ones that the truth contradicts are so.** I looked at none of them. Row 23's report says the file and the print differ at about 10 notes on *Sunless* 5 and 6.
- **Whether the 2 'clear dots' that the truth gives as plain are printed dots (a file error) or a flag's broken tail.** On *Sunless* 5 page 11 one looked, on an earlier crop, like a printed dot on an eighth that the truth gives undotted.
- **The beam on the render pages:** the Verovio SVGs hold none, so step 3.2 did not test the beam fit against a known bar. It was used on the scans (`beam_trace`) and not checked against anything.
- **Head's end of the stem** (the brief's 'the head's end'): not observable, the stem and head ink are one.
- **Out of scope, seen and not fixed:** hollow heads (36 on the render pages, fitted as rings and agreeing with the SVG to 0.09 staff spaces across and 0.06 on the axes; on the scans they are 'kept' and keep the reader's length), rests, the metre, accidentals (the reader's pitch errors are these), ties and slurs (a slur's ink in the strips is the commonest 'other ink' on the scans), and spacing. **The reader's false heads and misses** on the render pages (8 and 19) are reported in step 3.2.
- **A cross-platform check:** the native re-run differed from the Pyodide run by one note on *Sunless* 1 (61 against 62 right), so numbers quoted here are Pyodide's; the native numbers appear only where marked.

## Every number in the trial, and where it comes from

**The brief's (section 3.3.1, set wide, and GOULD where it is the source):** stem at least 2.5 staff spaces (r86); flag travel 2.0 to 3.5 (r87 gives 2.5 to 3.25); beam bar 0.25 to 0.75 thick (r249 gives 0.5); dot of about half a space across (area 0.09 to 0.33 staff spaces squared); the dot to the right, in a space.

**The desk's default (written in `fitted.py` beside each; none fitted to the five songs):** the head window 0.85 staff spaces half-width; the head's starts (semi-axes 0.62 by 0.46, tilts -30, 0, 30 degrees, heights 0, -2.5, 2.5 px); 40 Levenberg-Marquardt iterations; ink more than 0.30 from the form and not on a line has weight 0; the strip for a line's own place 3.5 staff spaces either side, leaving 1.0 and 1.1 about the head; the strips 1.9 staff spaces wide, from 0.6 past the tip to 0.35 past the head's end; the head zone 0.8 (other ink starting there is the head's fringe); the stem corridor half its thickness plus 1.5 px; the ragged-edge reach 0.20; the speck 0.007 staff spaces squared; the line guard 2.0 px; the own-head inflation 0.12; the count cuts 0.25, 0.45, 0.65, 0.85 (row 23's own) and the beam cuts 0.85 and 1.05; a run of at least 2 px; strokes counted only if they start between -0.4 and 2.0 from the tip (row 23's own); a dot's roundness at least 0.8, its distance 0.9 to 2.2, 0.2 clear of a line (GOULD r111 and the desk's measure, widened); a head is on a line within 0.25 of a line's centre; **5 clear cases** is the least for a page's own value; the outline grid of 1/32 staff space; a beam is looked for within 8 staff spaces; the patch margins 1.3 rows and 2.4 and 3.0 columns; the pass 2 strips stop 0.5 short of the head's end; the dot window 0.85 to 2.4 right and 1.0 above to 0.75 below the head's centre; the round trip's area 1.0 and 2.4 and 0.7. **From the pages:** every other number (the head's axes, the stem's thickness, the flag's outline, the beam's thickness, the dot's size and offsets, the line's thickness, and every bound) is a median or a maximum of the page's own clear cases or the song's, in the tables above. **From the desk's stop:** 0.15 staff spaces in step 3.2.
