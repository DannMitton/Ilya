# Report: a note is known by its company (QUEUE row 21)

**Written by:** Code (Sonnet 5.5), 2026-10-02. **Brief:** `brief-code-a-note-is-known-by-its-company_r1_2026-10-02.md`, the whole brief. **Status: STOPPED AT SECTION 3, NO CODE CHANGED.** Step 3.1 does not separate its two groups on every scan page, so, as the brief says, I stopped and am reporting. Branch `Shane`, tree at `622f35f`, one file modified before I began (`docs/memory/QUEUE.md`, not mine). The only files I added are this report and `measure-company_r1_2026-10-02/`. The reader, its tests, and every fixture are as I found them.

## Provenance

The app's own raster of the Tchaikovsky PDF (`~/Downloads/Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf`, rasterized by `rasterizePdf` in `page-pdf.ts`, 400 dpi), and the repository's PNGs for the other pages, read by `read_page_geometry` in the pinned Pyodide v0.26.4 (cv2 4.9.0, numpy 1.26.4), headless Chromium under Playwright, dev server on port 5173. Scripts and raw results are in `measure-company_r1_2026-10-02/` (`m1.py` the pool, `m3.py` the one not accounted for, `m4.py` the broken stem; `sel/` the sheets I looked at).

**The pages.** Ten, not nine: the three Tchaikovsky pages, Lamm pages 1 and 2 (`pdfjs400-1`, `-2`), and the five robustness PNGs. Row 20's report counts nine because the Lamm Kalmus `p2` repeats Lamm page 1; I measured it too and report it apart as `kalmus-p2`. Every system on all ten is braced.

## Step 3.1: the pool

**The pool is 1155 raw candidates** of `detect_heads` at a response of 0.70, before `has_stem` and before the clef-and-key mask. `kept` is "a head the reader emits today". `in span` is "inside the clef-and-key mask".

| page | s | candidates | kept | in span | at 0.84 or more |
|---|---|---|---|---|---|
| tch-1 | 28 | 59 | 33 | 4 | 37 |
| tch-2 | 29 | 108 | 67 | 18 | 71 |
| tch-3 | 28 | 117 | 55 | 18 | 68 |
| lamm-1 | 30 | 149 | 39 | 29 | 73 |
| lamm-2 | 30 | 205 | 49 | 45 | 106 |
| kalmus-p2 | 22 | 177 | 47 | 34 | 80 |
| bessel s01 p2 | 21 | 57 | 35 | 5 | 47 |
| bessel s04 p3 | 21 | 51 | 30 | 13 | 35 |
| bessel s05 p3 | 21 | 78 | 36 | 14 | 39 |
| kalmus s06 p21 | 12 | 154 | 30 | 52 | 61 |

**Every measure of the brief, per candidate, is in `m1.json`** (one record each: the response; the longest run beside the head with no break and with breaks of up to 0.1, 0.2, and 0.3 staff spaces; the run followed across neighbouring columns; the thinnest width farther than 1.0 staff space from the head's centre, beside the probe at 1.5; the company at the far end; the place on the staff; the clef-and-key span and whether the clef abstained; and the same stem measures on the raster before straightening).

**Following the run across neighbouring columns (one pixel either way per row) changes some of the 18 and not others.** It lifts `tch-3` x 2204 from 1.75 to 3.82, `tch-3` x 2677 from 1.14 to 3.86, and `tch-1` x 3176 from 2.43 to 3.71: those stems step by a pixel and are not broken. It leaves `tch-1` x 2883, 3093, 2862, 3009, and 3167 where they were (2.18, 1.57, 0.61, 0.71, and 1.0): those have real gaps, which only bridging closes (all but x 3167 at 0.3). Over the whole pool it also lengthens 249 candidates by more than 0.3 staff spaces (rests, a flag's curve, a letter), so it is not a separating measure on its own.

### What I looked at, and what I did not

**By looking** (crops 5.2 staff spaces wide by 8.4 tall, the candidate at the centre; `sel/s00` to `s05`, `R0`, `R1`):
- **Every candidate on the three Tchaikovsky pages that the reader does not emit and the mask does not cover: 90 of 90.**
- **Every candidate that the rule below admits and the reader does not emit, on the other seven pages: 46 of 46.**
- Forty-eight further unread candidates on Lamm page 1, taken in order; I did not label these as carefully, because at that crop an accidental beside a head puts the centre on the accidental and I cannot tell the two apart.

**NOT ESTABLISHED: a label by looking for each of the other 1000 or so candidates.** That is the 155 emitted heads on the Tchaikovsky pages (their bars match the desk in 85 of 99, which supports them but is not looking), the 40 inside the mask on those pages, and about 450 on the other pages that I did not view. A label for every one of 1155 wanted crops large enough that an accidental can be told from a head, and I did not make them. The verdict below does not rest on them: it rests on the candidates I did look at.

## What separates, and what does not

I tried the measures one at a time and then a joint rule, **R**, drawn from the measured heads: *a bridged run (breaks up to 0.3) of at least 3.0 staff spaces and a thinnest width of at most 0.14 staff spaces.*

**On the Tchaikovsky pages R admits 18 of the 90 unread candidates, and all 18 are heads by looking.** Seventeen of them are among the 18 misses; the eighteenth is `tch-2` x 736, y 2621 (response 0.871, a head at the start of system 3, which the row 20 table does not list).

**It leaves out 1 of the 18 misses, and keeps 4 non-heads out on the same pages by a one-pixel margin.**
- **Out: `tch-1` x 3167, y 2350 (response 0.821). A head, by looking** (`m4.json.files/c39.png`: a filled head, a stem broken into three pieces by gaps of about 0.5 staff spaces, a flag beside it). Its run is 1.04 staff spaces at no break and at breaks of 0.1, 0.2, 0.3, and 0.4; it reaches 3.61 only at breaks of 0.5. The brief's range of bridges is 0.1 to 0.3. No measure I took separates it from the 'p' dynamics (`tch-3` 157 and 261, run 1.24 and 1.46) or from the quaver rests.
- **Not heads, long and thin: `tch-3` 240 (the 'f' of a dynamic, run 4.5, thinnest width 0.25), 245 (a sharp, run 3.14, 0.18), 282 and 283 (the thick closing barline, run 3.32 and 3.21, 0.18).** R keeps them out only because the thinnest width of a head is at most 0.14 and theirs is at least 0.18. At s = 28 that is a gap of **one pixel** (4 px against 5 px), and the thinnest width is quantized to whole pixels. It is a gap, but it is not a bound I would put into a reader.

**On the other seven pages R admits 46 candidates that the reader does not emit, and 44 or 45 of them are heads, by looking.** They are heads the current finder does not read, most with an accidental beside them (the probe at 1.5 staff spaces runs into the accidental's stroke); a few are quarter notes with a short stem. So **on Lamm, Kalmus, and Bessel the reader is missing a good many heads that this rule would add**, a larger gain than the 18. I did not count them against a printed total.

**The ones that are not heads, and the page on which no bound holds:**
- **`kalmus s06 p21`, system 4, x 188, y 1317 (id 1133): a sharp of the seven-sharp key signature.** Response 0.786, run 3.08, thinnest width 0.08, the stem column at -0.58 staff spaces, on a line, nothing at the far end. **R admits it.** It is inseparable from the head beside it (id 1138, x 269, a head with a sharp), and from the quarter notes on the Bessel pages (run 3.5 to 4.3, thinnest width 0.05 to 0.1, the stem column at 0.52 to 0.62), by every measure I took.
- **Why it is unmasked:** the clef-and-key mask on that page spans x 97 to 161 per system, and the seven sharps run to about x 270 (s = 12). The clef did not abstain; the span simply stops short of the key signature. That is a fault in `clefkey`, not in the finder, and the brief does not touch it.
- R admits two candidates on that page (ids 1133 and 1138). Many more sharps stand there with runs of 2.0 to 3.4 (ids 1103 to 1110, 1129 to 1136); a bound at 2.0 would admit most of them. I did not label them one by one.

**Measures that do not separate, alone or together, as measured:**
- **The response.** Missed heads 0.821 to 0.918; non-heads that have a long stem 0.70 to 0.84 (the sharps, the dynamic, the barline), and rests and text at 0.84 and above.
- **The stem's run, bridged or not.** A sharp's two strokes are as long as a stem.
- **The thinnest width.** 0.05 to 0.14 for heads on every page and 0.08 to 0.25 for non-heads; on the s = 12 page, one pixel is 0.08.
- **Company at the far end.** A flag is there on 13 of the 18 and on none of the quarter notes. A hook from `G['hooks']` stands within 3 staff spaces of the stem's end on some heads and is far from the others. My `flag` measure (the widest ink in the last 1.6 staff spaces of the run) reads 0.5 to 1.9 on heads, rests, and sharps alike, so I cannot call it a measure that separates. **The company of a quarter note is nothing, which is also the company of a sharp.**
- **Where it sits.** Heads and the key signature's sharps are both on lines and in spaces; the one head below the staff (`tch-1` x 2107, y 3517) has its ledger line.

**So: step 3.1 does not separate its two groups on every scan page.** It separates on the Tchaikovsky pages with one head left out (the 0.5-space break) and a one-pixel margin on four non-heads, and it does not separate on `kalmus s06 p21`. **I stopped.**

## Step 3.2: the 11 near the right edge

For the 18 misses, the measures on the straightened raster and on the raster before straightening (`raw` in `m1.json`; the page's vertical shift at the candidate is 1 to 13 pixels):

| | the 11 (x 2677 or more) | the other 7 |
|---|---|---|
| response under 0.84 | 4 | 0 |
| run under 2.0 staff spaces, no break, **after** straightening | 5 | 1 |
| the same, **before** | 7 | 1 |
| probe at 1.5 wider than 0.42, after / before | 3 / 4 | 5 / 5 |
| run of 3.0 or more with breaks of 0.3, after / before | 10 / 10 | 7 / 7 |

**Straightening helps, and does not explain the 11.** It restores the stem of two of them: `tch-1` x 3176 (1.5 staff spaces before, 2.43 after; 3.75 bridged) and `tch-3` x 2909 (0.93 before, 3.57 after). For the other 16, before and after are the same to the hundredth. **The 11 differ from the 7 in both images:** four of them have a response under 0.84 and none of the 7 does, and five (seven before straightening) have a stem broken in the first 2 staff spaces and one of the 7 does. The 7 are mostly the probe failures (5 of 7), a flag beside a long, unbroken stem. So the right edge of the page is where the stems break and the responses fall, which fits a scan that is a little softer or more skewed there. I did not look for a cause.

## Step 3.3: the one not accounted for (`tch-1` x 2107, y 3517)

**`has_stem` drops it, at the point the finder places it.** At a threshold of 0.84 `detect_heads` returns this head at **y 3522**, not 3517 (score 0.856 at both: the response is a plateau of equal values and `nms` takes one of them). `has_stem` is True at 3517 and False at 3522 (`m3.json`: `passes_stem` holds only the head at x 1974). It is not the clef-and-key mask (the span of system 3 is x 351 to 515), not the hollow merge (no hollow detection within 150 pixels), and not `merge_ossia` (the only other head in range is 133 pixels away). My pool took the point at 3517 because the threshold of 0.70 chose a different point of the same plateau. So the head is dropped by a **5-pixel placement difference on a plateau**, and it is a reason to be careful with any bound I would have placed from the pool's coordinates.

## Step 3.4: the desk's three leads

1. **"A filled head on a stem stands at each of the 18 places": yes, on all 18** (`sel/s00` to `s03`: ids 14, 16, 37, 38, 39, 51, 58, 75, 76, 186, 187, 208, 212, 234, 246, 247, 267, 268).
2. **"Most of the 18 are flagged notes, and the flags are long and hang close beside the stem": yes for the eight probe failures and the broken-stem cases.** At least 13 of the 18 carry a flag (two flags on `tch-3` x 2821 and 2909). The thinnest width along the run is 0.07 to 0.14 for all 18, so what the probe at 1.5 staff spaces reads, 0.64 to 1.61, is the flag and not the stem.
3. **"On several of the short-run cases the stem is printed as a broken line": yes for four, a one-pixel step for two, and one needs a wider gap.** With breaks of up to 0.3 staff spaces the run goes from 0.61, 0.75, 1.61, and 2.21 (x 2862, 3009, 3093, 2883) to 3.71, 3.57, 3.0, and 3.89. The two that step (x 2204, 2677) are read whole by following the stem across columns. The seventh (`tch-1` x 3167) needs 0.5, as above.

## Section 6, line by line

None of section 6 is met or attempted: there is no build. **Item 5 (read time) is not measured.**

## What I would do next, and what could not be established

I did not build, and the following is a recommendation, not a ruling.
- **The company rule as the brief states it cannot be derived from step 3.1 as it stands.** The stem, the thin width, the far end, and the place do not separate a head from the sharps of a key signature, which is the case the brief names ("the dynamic's ink among them").
- **A measure the brief does not name might.** A head is a filled ellipse **at the end of the stem and offset to its side**; a sharp's lozenge is crossed by its strokes. The width of the ink run through the candidate's own row (`_row_span` in `reader.py`, the ossia's size) and the stem's column relative to the head's flank are both in `m1.json` for a start (`stem.col`). I did not test them against the pool.
- **The clef-and-key mask on `kalmus s06 p21` is short of its key signature.** That wants its own look, in `clefkey`.
- **The bridging range of 0.1 to 0.3 is not enough for `tch-1` x 3167, which needs 0.5**, and a 0.5 bridge is no longer "a stem printed broken".
- **NOT ESTABLISHED:** a label by looking for each of the 1155 candidates (see above); the head counts of the other nine pages against the print; whether the 44 or 45 additional heads on the Lamm, Kalmus, and Bessel pages are all heads (I looked at them at the same crop and judged them heads, with `955` at x 834, `bessel s05 p3`, uncertain); whether R's one-pixel margin on the Tchaikovsky pages holds on another engraving.

**Two things for the desk to rule before row 21 can be built:** which of the above to try (a head-shape measure, a repaired mask, or both), and whether a rule that also adds the 44 or 45 heads on the other pages is wanted or should be held to the Tchaikovsky pages.

---

# Build against brief r2 (2026-10-02)

**Written by:** Code (Sonnet 5.5). **Brief:** `brief-code-a-note-is-known-by-its-company_r2_2026-10-02.md`, the whole brief for `QUEUE.md` row 21. **Status: WRITTEN**, uncommitted, on the tree at `622f35f`. The one file changed is `tools/e16-harness/reader/reader.py` (+110 lines; `apps/web/static/reader/` is a generated copy, refreshed by `copy-reader.mjs`). All eight gates are at baseline (gate 4 `1824 passed (1824)`, gate 5 `644 passed | 5 skipped (649)`; run from a scratch copy of `ilya-ship.sh` that cannot stage). **Section 6 item 1 is met except for one bar** (98 of 99 bars equal; the one is `tch-1` x 3167, left out by the brief's own ruling). The section above, written for r1, is superseded by this one wherever they differ; the two corrections are in "What I got wrong in the r1 section".

**Provenance.** The same as above: the app's own raster of the Tchaikovsky PDF and the repository's PNGs, in the pinned Pyodide v0.26.4 (cv2 4.9.0, numpy 1.26.4), headless Chromium under Playwright, dev server on port 5173. Scripts and raw results are in `measure-company_r1_2026-10-02/` (`m5` the measures, `m6` the crops, `m7` the plateau, `m8` the render fixtures, `v1` to `v4` the build). Item numbers below are the brief's section 3.

## What I got wrong in the r1 section

1. **"The reader is missing a good many heads on the Lamm, Kalmus, and Bessel pages that this rule would add (44 or 45)" was wrong.** My r1 crops had a tick for the row only, so a candidate whose centre fell on a flat or a natural beside a head looked like the head. With the centre marked in both directions (`m6.json.files/c00` to `c10`), most of those 46 are the white gap between an accidental and a head (11 have no ink at the candidate's own centre), or a flag's junction with its stem, and a head 1.4 staff spaces away is already read. **The rule below admits 34 heads on the seven other pages**, each looked at with the centre marked, and none is a duplicate of a head already read.
2. **`tch-2` x 736, y 2621 is not a miss.** The reader already emits it, at y 2613: `detect_heads` returns another point of the same plateau of equal responses, and my "emitted" test allowed 5 pixels. The same error would have put "unread" on any head whose plateau point differs by 6 to 22 pixels (item 3).

## Item 1: where the stem meets the head

**The pool** is the 1155 candidates of r1 (same order, same ids), measured at the point `detect_heads` returns at a response of 0.70 (`m5.json`). For every candidate the reader does not emit and the mask does not cover (502): the response; the run in the `has_stem` band (0.35 to 1.05 staff spaces either side), breaks of up to 0.3 bridged; the stem's column against the centre (`col`); **the run on the far side**, in the stem's own columns (the stem column and one pixel either side) in the opposite direction with the same bridging (`far`); and **the ink through the candidate's own row**, left and right of the centre, in staff spaces (`row`, the brief's half-width twice over). The thin probe and the thinnest width are kept in the file.

**My own measure: the row.** I added no shape measure of my own beyond `row`: it is the brief's second measure read as a width, and it is what separates a head from the white gap beside it. A head is ink at its own centre: `row` is 1.0 to 1.9 for every head I looked at, and 0 to 0.77 where the matched filter's peak falls on an accidental or in the gap (11 of the r1 "heads" had 0).

**What separates, with the gap.** The heads are the 52 the rule admits at the pool's points (`R3ids.json`: 17 of the 18 misses, `tch-2` x 736 which is already read, and 34 on the other pages), each with its centre on a filled head, by looking. The not-heads are the 134 I looked at that the reader does not emit (the 90 on the Tchaikovsky pages less two I could not call, the 16 sharps of the key signature of `kalmus s06 p21`, and the near misses). For each test: the heads' extreme, the nearest not-head that every other test lets through, and the gap, in staff spaces and in pixels at the smallest and the largest staff space that has both (s = 12 on `kalmus s06 p21`, 30 on the Lamm pages).

| test | bound | heads | nearest not-head (only this test refuses it) | gap in staff spaces | pixels |
|---|---|---|---|---|---|
| response | at least 0.80 | 0.829 and up | 0.779 (`p21` x 516, y 112, a beam's end; `kalmus-p2` x 907, the bracket of a dynamic: 0.780) | 0.05 of the ellipse's area | 7 px² at s = 12, 45 px² at s = 30 |
| run, breaks of 0.3 | at least 2.83 | 3.0 and up | 2.667 (`p21` x 417) | 0.33 | 4 px at s = 12, 10 at s = 30 |
| run, the other bound | at most 5.0 | up to 4.46 | 6.0 (the bracket; the reach is capped at 6) | 1.54 | 18 to 46 |
| far side | at most 0.97 | 0.0 to 0.864 | 1.083 (`p21` x 180, a sharp's stroke) | 0.22 | 2.6 at s = 12, 4.8 at s = 22, 6.1 at s = 28 |
| column, lower | at least 0.36 | 0.393 and up | 0.333 (`lamm-2` x 3492, a barline) | 0.06 | 1.8 at s = 30, 1.3 at s = 22 |
| column, upper | at most 0.73 | up to 0.633 | 0.833 (`p21` x 537, a beam) | 0.20 | 2.4 at s = 12 |
| row | at least 0.92 | 1.0 and up | 0.833 (`p21` x 197, a sharp) | 0.17 | 2.0 at s = 12, 3.6 at s = 21 |

**Every bound sits in its gap, and every gap is wider than one pixel at every staff space I measured.** The narrowest are the lower bound of the column (1.3 to 1.8 pixels) and the row and run at s = 12 (2.0 and 4). **The thinnest-width bound of r1's rule R is not needed once these are in:** none of the 134 not-heads is held out by it alone, and it cannot separate the two groups on `kalmus s06 p21`, where a pixel is 0.083 staff spaces and a head's stem and a sharp's stroke both measure 0.08 to 0.17.

**Which measures do the work, and which do not.** Alone: the far-side run separates the sharps and flag junctions (a stroke runs on both sides of the centre; 1.07 to 1.32) from the heads (at most 0.864), and the row separates the accidental-and-gap candidates; neither separates everything. The run of at least 2.83 refuses rests, text, and the short strokes. **R's two non-heads** (`kalmus-p2` x 907, the bracket of a dynamic; `p21` x 516, y 112, the end of a beam) **are refused by the response (0.780 and 0.779 against 0.80, and the heads' lowest is 0.829); the bracket is also refused by the upper run bound (6.0).**

**Every candidate on which the measures disagree** (a head the rule leaves out, or a not-head it lets in):
- **Heads left out (2): `tch-1` x 3167, y 2350** (the broken stem, run 1.04 until a bridge of 0.5; response 0.821), the one the brief rules out, **and `bessel-s01p2` x 2492, y 1914** (a head on a line with a stem printed as a hair: run 2.0, thinnest width 0.048; response 0.874). Neither is read.
- **Candidates I could not call (2):** `tch-2` x 3215, y 2628 (id 132), where a head, its accidental, and a flag stand together at the centre, and `tch-3` x 809, y 2526 (id 225), a small head on a stem with a second head under it. Neither is admitted (run 1.66 and 1.89).
- **Not-heads let through: none** at the build's points (item 3).
- **Not looked at:** the not-heads among the 368 candidates that fail the run test by a wide margin (run under 2.0, mostly rests, text, and dynamics) were looked at only on the Tchaikovsky pages. **A head with a very short stem in that group would be missed, and I cannot say there is none.**

## Item 2: every candidate the rule would admit, on every page

I looked at all 54 the rule R admits at the pool's points, with the centre marked (`m6.json.files/c00` to `c04`). **52 are printed heads, centred on the candidate. Two are not: the bracket of a dynamic on `kalmus-p2` (x 907, y 675, id 657) and the end of a beam on `kalmus s06 p21` (x 516, y 112, id 1030).** The build's bounds refuse both (the response, and for the bracket the upper run bound too). I then looked at **the 121 candidates that fail some test narrowly** (the 54, the sharps, and the near misses; `c05` to `c10`): the rest are flag junctions, sharps, beam ends, the 'f', the clef's digits, and the closing barline, not heads. **After the build, every one of the 51 heads it admits is one of those I looked at**, matched to within 30 pixels (`v1.json` against `R3ids.json`: no admitted candidate is new). The 6 on the Tchaikovsky pages' kind of flag-and-stem head, the ledger-line heads of `bessel-s01p2`, the heads with a sharp, a flat, or a natural, and a head on a ledger line (`tch-1` x 2107) are all among them.

## Item 3: the plateau

- **502 candidates are not emitted and not masked. 299 of them (60 percent) sit on a plateau of two or more points of equal response** (the median plateau is 2 points, the largest 28; the points lie up to 30 pixels apart, within one staff space).
- **For 292 of the 299 a stem measure differs from one point to another** (the run differs for 248; `has_stem` differs for 98). It is the rule, not the measures, that holds: the six tests give the same answer at every point of the plateau for all 52 heads I looked at.
- **It differs for three candidates the rule refuses at the returned point**: `lamm-2` x 779, y 3437 and `kalmus s06 p21` x 720, y 167 (I did not look at these two), and `kalmus s06 p21` x 188, y 520 (a sharp). At one other point of each plateau every test passes.
- **At the reader's own threshold, 126 of the unread candidates have a point at 0.84. For 41 of the 126 (a third) it is not the point at 0.70.** (`tch-1` x 2107 is one: 5 pixels.)
- **What I built from this, and why:** the rule is tested at the point `detect_heads` returns **and** at the plateau's other points (at most 13, spread evenly, within one staff space), and all must pass. A beam's end and stem at `kalmus s06 p21` x 446, y 173 passed at the returned point and was admitted by the first build; at the second point of the plateau it fails. With the second condition the build admits 51 and no not-head.
- **The pool for the build is `detect_heads` at 0.80**, because four of the 18 misses have responses of 0.829 to 0.838. A response of 0.80 or more is one of the six tests (its gap is the first row of the table); **this lowers the finder's threshold only for a candidate that the stem tests then admit, and for no other.**

## Item 4: page 2, system 3, bar 1

**The reader emits two heads there, before this build and after it: (589, 2606) and (736, 2613).** They are the dotted quarter near x 590 and the flagged eighth near x 737 of the desk's lead. **The reader read that bar as equal to the desk's count (2) with the eighth.** The "without the eighth" in the lead does not match what the reader emits. Three other candidates stand there, at (357, 2688), (367, 2604), and (380, 2577) with responses 0.73 to 0.79; they are in the clef-and-key mask (the span is 340 to 500).

## Item 5: the clef-and-key mask, reported and not fixed

The mask's span `x_lo` to `x_hi` per system, beside the printed key signature (by looking at a strip from the system's start to 8 staff spaces past the mask, `mask/`; the key signatures I could count: two sharps on the Tchaikovsky, Lamm, Kalmus `p2`, and Bessel `sunless01` and `sunless04` pages, none on Bessel `sunless05`, **seven sharps on `kalmus s06 p21`**; the reader's own `fifths` read is 2 on every system of the ten pages except `bessel-s05p3` and `tch-3` system 2, which read 0; 2 is not the printed key on `kalmus s06 p21`):

| page | s | span per system | the printed signature ends |
|---|---|---|---|
| tch-1 | 28 | 684 to 850, 358 to 520, 351 to 515 | inside the span on all three |
| tch-2 | 29 | 335 to 490, 333 to 488, 340 to 500, 336 to 490 | inside |
| tch-3 | 28 | 361 to 522, 349 to 424, 354 to 521, 355 to 521 | inside, **except system 2**, which reads a span of 349 to 424 (key 0) for a two-sharp signature |
| lamm-1 | 30 | 524 to 696, 267 to 443, 266 to 442 | inside |
| lamm-2 | 30 | 269 to 446, 276 to 447, 279 to 449 | inside |
| kalmus-p2 | 22 | 393 to 522, 201 to 333, 199 to 331 | inside |
| bessel-s01p2 | 21 | 733 to 858, 615 to 742, 621 to 745 | inside |
| bessel-s04p3 | 21 | 523 to 640, 407 to 530, 409 to 534 | inside |
| bessel-s05p3 | 21 | 663 to 720, 553 to 610, 548 to 605 | inside (no key signature) |
| **kalmus-s06p21** | **12** | **97 to 155, 98 to 160, 99 to 161, 99 to 160** | **to about x 210 on every system: the span stops 50 pixels (4 staff spaces) short, at the third of seven sharps** |

**`tch-3` system 2 is a new finding:** I did not look at its strip for the printed signature (the strip is `m5.json.files/tch-3-s1.png`). **NOT ESTABLISHED** whether the span of 349 to 424 stops short of two sharps. The system's candidates inside 349 to 424 are masked either way; a head that stood to the right of 424 and left of 520 would be unmasked.

## Section 6, line by line

1. **Tchaikovsky, on the app's own path: MET but for one bar.** The app's Worker (`appworker.json`): **183 events for the three pages: 173 heads and 10 rests**, in the 170 to 178 the brief asks. **No hollow head is emitted** (0 on every page). **98 of 99 bars equal the desk's count, no bar is wrong by more than one head** (before: 85 of 99, 156 heads). The one bar: **`tch-1`, system 2, bar 9: the desk 2, the reader 1** (the head at (3009, 2277) read; the head at (3167, 2350) not read, the printed head the brief rules out). The desk's count is a draft; for this bar I looked at the head and it stands there.
2. **Every scan page: MET.** **No head read before the build is lost** (compared head by head, ten pages, `v1.json` against the tree before: 0 lost). **Every one of the 51 heads admitted is a printed head by looking; no candidate I judged not a head is emitted.** What I did not look at is in item 1.
3. **`G['byCompany']`: MET.** One record per head the rule admitted: its x, y, system, response, the plateau's size, and the four measures that admitted it (`row`, `run`, `col`, `far`), and `emitted` (true if it is in `G['heads']` after the mask and the ossia merge). **Count per page: `tch-1` 6, `tch-2` 2, `tch-3` 9, `lamm-1` 9, `lamm-2` 5, `kalmus-p2` 3, `bessel-s01p2` 11, `bessel-s04p3` 4, `bessel-s05p3` 1, `kalmus-s06p21` 1: 51, all emitted** (the first build also listed six that the mask then removed, `lamm-2` x 328, `bessel-s05p3` x 700, and `p21` x 158, 119, 120, 120, and a beam's end at `p21` x 446; the plateau condition keeps all seven out of the list, and `emitted` is true for every one that remains).
4. **Render fixtures: NOT byte-identical in one respect, and it is my duty to say exactly which.** There are 23 pages under `tools/e16-harness/output/*/repaired/` (the names of the `R_` fixtures: sunless-01 two pages, 02 two, 03 five, 04 three, 05 six, 06 five; **I take these to be the fixtures: the PNGs under the `R_` name are not in the tree, NOT ESTABLISHED**). Read as the app reads a scan (no `vocal` in the config), **15 are unchanged and 8 move: sunless-03 pages 1 to 5 (9, 10, 7, 9, 7 heads added) and sunless-04 pages 1 to 3 (5, 11, 2 added): 60 heads in all.** I looked at all 60 (`m8.json.files/f00` to `f04`): **each is a printed head** (an eighth on a ledger line, a dotted quarter, a head with a sharp or a natural; the same low D most of the time), which the reader did not read before. The cause: these pages hold a braced pair, so the rule acts, as it does on a scan. **With the `vocal` list in the config, the 23 are identical with the rule on and off** (`v3r.json`: 23 of 23, 0 admitted). Whether the fixtures are read with a `vocal` list depends on the caller, and **I did not find which it is.** The gates do not pin these heads (gates 4 and 5 are at baseline). So: **the 15 are identical; the 8 differ by adding printed heads, unless the fixtures are read with `vocal`, when all 23 are identical.** The brief says to say before shipping which bytes move: those do.
5. **Read time (the app's Worker, two reads in one Worker, headless, unthrottled): 32.9 s then 32.3 s for the three Tchaikovsky pages, beside row 20's 29.1 s and 28.2 s: +3.8 s and +4.1 s (13 and 15 percent).** In `envelope.run` alone, per page, without and with the rule: `tch-1` 7.3 and 7.9 s, `tch-2` 11.2 and 12.4 s, `tch-3` 9.6 and 11.3 s (a second repeat agrees to 0.2 s). The cost is the second `detect_heads` at 0.80 and the stem measures of the candidates that pass the row test.
6. **Gates: at baseline.** Gate 1 `251 passed (251)`; 2 `235 passed (235)`; 3 `found 0 errors and 12 warnings in 5 files`; 4 `1824 passed (1824)`; 5 `644 passed | 5 skipped (649)`; 6 `145 passed (145)`; 7 `55 passed (55)`; 8 `ratchets: OK`. No number moved. **WRITTEN.** `DONE` is Dann's walk of the Tchaikovsky PDF on the alias.

## What was built

In `tools/e16-harness/reader/reader.py`, before `read_page_geometry`: the constants `COMPANY_THR` (0.80), `COMPANY_RUN_MIN` and `_MAX` (2.83, 5.0), `COMPANY_FAR_MAX` (0.97), `COMPANY_COL_MIN` and `_MAX` (0.36, 0.73), `COMPANY_ROW_MIN` (0.92), each with its measured gap in the comment above them; `company_measures`, `_company_passes`, and `admit_by_company`. In `read_page_geometry`: after the hollow merge, on a braced system only and when `cfg['company']` is not False (default true, so the caller's config is untouched), the admitted heads join `heads`, and `G['byCompany']` carries the records. A candidate within 0.8 staff spaces of a head already emitted is the same head and is not admitted again; nothing is removed.

## What could not be established

- **A label by looking for each of the 1155 candidates.** Looked at: the 502 not emitted and not masked, only in the groups above. A head with a stem shorter than 2 staff spaces and not on a Tchaikovsky page is not ruled out of the 368 I did not look at.
- **`tch-3` system 2's mask** and whether it stops short of two sharps.
- **The 23 fixtures' reading config** (with or without `vocal`) and whether `repaired/` is the `R_` set.
- **`bessel-s01p2` x 2492, y 1914** and **`tch-1` x 3167, y 2350** are printed heads left unread. The first has a hair stem; the second a break of 0.5 staff spaces. Neither is bridged, and I would not move a bound to take them: each would need the run bound at 2.0 and 1.0, and 1.04 is under the run of the 'p' dynamics and the quaver rests on the same page.
- **Whether the bounds hold on a song the builders have not seen** (plan r4, principle 9): they are measured on ten pages, three of which are one song. The gaps (7 percent of the ellipse and up to 0.2 staff spaces) are narrow in the column and the far side; a different engraver's flag, a heavier sharp, or a thicker stem could close them.
- **Ledger-line candidates:** one head below the staff (`tch-1` x 2107) and the ledger-line heads of `bessel-s01p2` and the fixtures are admitted. A head on a ledger line whose stem is shared with a beam is not among the measured heads.
