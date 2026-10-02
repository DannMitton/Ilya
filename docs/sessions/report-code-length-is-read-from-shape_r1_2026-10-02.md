# Report: a note's length is read from its shape (QUEUE row 23)

**Written by:** Code (Sonnet 5.5), 2026-10-02. **Brief:** `brief-code-length-is-read-from-shape_r1_2026-10-02.md`, the whole brief. **Status: MEASURED. NOTHING BUILT.** Section 3's measurements are done and written here first. **Part A (flags and beams) does not separate its classes on every build song with a gap wider than one pixel, so I stopped it. Part B (dots) does not separate its two groups by more than one pixel on every build song either, so I stopped it.** As the brief says, I built neither. Part C is measured and reported. **No reader code and no product code changed.** The tree is at `389d4db`; I added one field and one song to the harness (below), and the scripts and results in `measure-length_r1_2026-10-02/`. All eight gates are at baseline (gate 4 `1824 passed (1824)`, gate 5 `644 passed | 5 skipped (649)`; scratch copy of `ilya-ship.sh`). **The strongest thing this report holds is not a build but an offline measurement (below): the same measures, applied by arithmetic to the notes the scorer matched, would take the notes with the right length from 42, 50, 35, 57, and 24 to 85, 109, 175, 113, and 151 on the five build songs.** It is offline, fitted on the same songs, and not a build. The desk rules whether the gap criterion is to bind, or to be read differently, before anything goes into the reader.

## Provenance

The app's own path, as in row 22: pdf.js raster at 400 dpi, then the `WorkerPageReader`, one call per song, headless Chromium under Playwright, pinned Pyodide v0.26.4, cv2 4.9.0, numpy 1.26.4, on the tree as row 21 shipped (nothing in the reader has changed since). G clef on line 2, no octave change, the key printed on the scan (2, 2, 0, 7 sharps for *Sunless* 1, 4, 5, 6; 2 for the Tchaikovsky). The Tchaikovsky truth is `truth-draft-tchaikovsky-op38-3-voice_r2_2026-10-02.json` (the desk's reading by eye, not proofed by Dann). The *Sunless* truth files are `tools/e16-harness/output/truth/`, git-ignored. **The two test-only songs (*Sunless* 2 and 3) are totals only: I did not open their pages, their crops, or their note-by-note output, and measured nothing of the shape of their notes.** Their reads sit in the scratchpad directory, outside the repository.

**Harness changes** (`tools/e16-harness/src/`): `scan-scorer.ts` now also returns `matches` (every aligned pair, by index); `scan-baseline.ts` now scores the Tchaikovsky song as song 7, a build song. The self-test still passes. **Scripts and results:** `read-songs.mjs` (the reads), `m_a.py` and `m_c.py` (the measures, run in Pyodide on the reader's own modules), `join.py`, `a1.py` to `e1.py`, `sim.py` (the analyses), `reads-before/` and `scores-before/` (the reads and scores, build songs), `crops.files/` (the crops), `images.files/` (the straightened pages), all but the last two small.

## Step 3.1: the fifth row of the table

The baseline before the change. **Nothing in the reader changes in this report, so "after" is the same table.**

| Song | Bars file / read | Notes in the file | Matched | Pitch right | Length right | Length wrong | Length abstained | Both right | Rests file / read | **Headline** |
|---|---|---|---|---|---|---|---|---|---|---|
| *Sunless* 1 | 18 / 18 | 96 | 96 | 72 | 42 | 21 | 33 | 35 | 19 / 0 | **36.5** |
| *Sunless* 4 | 29 / 29 | 116 | 115 | 92 | 50 | 52 | 13 | 43 | 29 / 2 | **37.1** |
| *Sunless* 5 | 61 / 60 | 258 | 212 | 152 | 35 | 118 | 59 | 30 | 48 / 0 | **11.6** |
| *Sunless* 6 | 55 / 53 | 161 | 137 | 98 | 57 | 70 | 10 | 37 | 26 / 2 | **23.0** |
| Tchaikovsky Op. 38 No. 3 | 99 / 99 | 174 | 173 | 163 | 24 | 128 | 21 | 23 | 48 / 10 | **13.2** |
| *Sunless* 2 (test only, totals) | 12 / 12 | 68 | 67 | 48 | 19 | 27 | 21 | 11 | 13 / 0 | **16.2** |
| *Sunless* 3 (test only, totals) | 41 / 43 | 222 | 197 | 136 | 54 | 81 | 62 | 46 | 40 / 1 | **20.7** |

**The Tchaikovsky song, as the fifth build song:** 99 bars read for 99, 173 of 174 notes matched, **pitch right on 163, length right on 24**, both right on 23: **13.2 of every 100 printed notes.** Of the 128 wrong lengths, an eighth is read as a quarter 53 times and as a dotted quarter 45, a quarter as a dotted quarter 9, an eighth as a dotted eighth 7. The song has 48 rests and the reader emits 10 (the whole-bar rests of the first seven bars). Bars all right: 6 of 99. The read takes 31.9 s for the three pages (8.0, 12.5, 11.4 s each page alone), against row 21's 32.5 and 32.1 s.

**Where the truth draft and the scan differ.** I found the ten pitch differences between the draft and the reader (`crops.files/tch-pitch.png`; bars 20, 22, 40, 53, 56, 76, 80, 83, 87 twice). **Seven of them have an accidental sign beside the head** (bars 53, 56, 83, 87 twice, and 40 and 80, where the head also stands a step from the reader's letter): the draft agrees with the sign, so I judge each a reader error (the sign not read, or not carried through the bar). **For three (bars 20, 22, 76) there is no sign and the reader's letter differs from the draft's by one step; I cannot tell from the crop whether the reader or the draft has the head's place wrong: NOT ESTABLISHED, for the desk.** For bar 83, «сплю», the draft's own note says D♯4 is the least sure reading; the head is under the bottom line with a sharp before it, which is the draft's reading. **I found no place where the scan disagrees with the draft's written length** among the Tchaikovsky notes I looked at in step 3.2 (about 30 of the 41, and the crops of the exceptions): every one shows the flag, or its absence, that the draft says.

## Step 3.2: Part A, the flags and the beams

**What I measured.** For each of the 697 matched, filled notes that have a stem on the five build songs (93, 111, 199, 126, and 168; `m_a.py`, `ma/`), from the page's own line-free image, in the reader's own coordinates:
- the **strokes** that leave the stem at its far end: with the stem followed to its far end with breaks of up to 0.3 staff spaces bridged (row 21's rule), the ink of the stem's own connected component is cut by vertical lines at 0.10, 0.25, 0.45, 0.55, 0.65, 0.75, 0.85, and 1.05 staff spaces from the stem's edge, on each side. For each cut, every run of ink: its start along the stem from the tip, and its thickness, in staff spaces. Counted along the stem, with the side they leave on. A run that lies wholly inside a staff-line's band is set aside as the line's own residue (the line's rows are known);
- the **hooks**: the distance from the stem's far end to the nearest entry of `G['hooks']` on the system (hooks exist only on braced systems);
- the **beams** the reader finds today (`beams_on_stem`) and the **area** it uses today (`_head_cc_area`);
- two measures of my own: **the persistence of the stroke**, the number of cuts (of seven, from 0.25 to 1.05 staff spaces) at which a non-residue run starts within 1.6 staff spaces of the tip (a flag sweeps outward and persists; a bump on a line crossing does not); and **the count of strokes**, the second-largest, over the cuts at 0.25, 0.45, 0.65, and 0.85, of the number of non-residue runs at least 0.2 of a staff line's own thickness thicker than the line (I used one times the line's thickness).

**Why those measures.** The area of the head's ink is the reader's own measure and I report it, but the brief rules it out as a measure of length, and the data say why: the printed eighths and quarters overlap in it on every song. The strokes are what the ruling names. The persistence is mine, added because the thickness of a stroke at one cut is not stable: a thin flag that sweeps away from the stem is only 7 to 9 pixels thick in a vertical cut on the Tchaikovsky pages.

**What the reader's own measures say** (area in staff spaces squared; the notes are the printed classes, dots set aside):

| Song | printed quarters: area median (min to max), beams found | printed eighths: area median (min to max), beams found | hooks within 2 staff spaces of the stem's end |
|---|---|---|---|
| *Sunless* 1 | 2.28 (1.64 to 9.29), 0 | 3.58 (3.09 to 5.06), 0 | 0 of 92 |
| *Sunless* 4 | 2.00 (1.56 to 6.16), 1 | 2.85 (1.61 to 7.40), 10 | 2 of 111 |
| *Sunless* 5 | 2.12 (1.62 to 5.66), 0 | 3.09 (1.93 to 23.84), 0 | 17 of 184 |
| *Sunless* 6 | 1.99 (1.65 to 4.27), 0 | 3.03 (1.76 to 7.95), 15 | 9 of 117 |
| Tchaikovsky | 1.83 (1.51 to 13.85), 0 | 2.37 (1.35 to 9.63), 1 | 6 of 168 |

The ranges overlap on every song (an eighth is as small as 1.35 where a quarter is as large as 2.4 and past). **The reader finds a beam on 0 of 28 printed eighths on *Sunless* 1, 10 of 72 on 4, 0 of 130 on 5, 15 of 45 on 6, and 1 of 140 on the Tchaikovsky (which prints no beam).** Which of the others are beamed and which flagged in print I did not separate. The hooks are in reach of the stem's end for a small share of the flagged notes only; the hook is not the flag.

**What separates, and what does not.** The count of strokes reads the class of 90 to 96 percent of the notes on each song **if the rule is "no stroke is a quarter, one an eighth, two a sixteenth":** the table gives what the count says for each printed class (the thickness bound is the page's own line thickness; the notes where the measure and the print disagree are listed after it).

| Song | printed quarter: read quarter / eighth / sixteenth / abstain | printed eighth: quarter / eighth / sixteenth / abstain | printed sixteenth: quarter / eighth / sixteenth / abstain |
|---|---|---|---|
| *Sunless* 1 | 59 / 1 / 1 / 3 | 0 / 28 / 0 / 0 | 0 / 0 / 0 / 0 |
| *Sunless* 4 | 35 / 0 / 0 / 2 | 0 / 70 / 0 / 2 | 0 / 0 / 2 / 0 |
| *Sunless* 5 | 56 / 2 / 0 / 3 | 7 / 120 / 0 / 3 | 0 / 0 / 4 / 1 |
| *Sunless* 6 | 68 / 0 / 0 / 6 | 1 / 42 / 0 / 2 | 0 / 0 / 0 / 0 |
| Tchaikovsky | 19 / 2 / 0 / 0 | 2 / 128 / 1 / 9 | 0 / 2 / 5 / 0 |

**But it does not separate with a gap wider than one pixel at every page.** The gap that matters is the one between the thickest ink a printed quarter carries at its stem's far end and the thinnest stroke a printed eighth or sixteenth carries there, per page, at that page's staff space. With my best measure, the second-largest over the cuts of the thickest non-residue run, in pixels:

| Song | page | s (px) | line (px) | printed quarters | thickest quarter (px) | flagged notes | thinnest flagged (px) | gap (px) |
|---|---|---|---|---|---|---|---|---|
| Sunless 1 | 1 | 30 | 6 | 31 | 17 | 16 | 19 | 2 |
| Sunless 1 | 2 | 30 | 7 | 32 | 2 | 12 | 24 | 22 |
| Sunless 4 | 9 | 31 | 5 | 14 | 0 | 26 | 12 | 12 |
| Sunless 4 | 10 | 31 | 5 | 23 | 1 | 48 | 0 | -1 |
| Sunless 5 | 11 | 30 | 5 | 3 | 0 | 10 | 0 | 0 |
| Sunless 5 | 13 | 29 | 5 | 8 | 0 | 19 | 5 | 5 |
| Sunless 5 | 14 | 30 | 5 | 10 | 0 | 17 | 0 | 0 |
| Sunless 5 | 15 | 30 | 5 | 7 | 0 | 42 | 0 | 0 |
| Sunless 5 | 16 | 30 | 5 | 16 | 17 | 28 | 1 | -16 |
| Sunless 5 | 17 | 30 | 5 | 17 | 15 | 17 | 0 | -15 |
| Sunless 6 | 18 | 30 | 4 | 9 | 1 | 3 | 0 | -1 |
| Sunless 6 | 19 | 32 | 6 | 14 | 0 | 15 | 14 | 14 |
| Sunless 6 | 20 | 32 | 5 | 17 | 2 | 9 | 0 | -2 |
| Sunless 6 | 21 | 32 | 6 | 13 | 0 | 8 | 18 | 18 |
| Sunless 6 | 22 | 31 | 5 | 12 | 1 | 6 | 14 | 13 |
| Sunless 6 | 23 | 31 | 4 | 8 | 2 | 4 | 11 | 9 |
| Tchaikovsky | 1 | 28 | 5 | 6 | 0 | 29 | 0 | 0 |
| Tchaikovsky | 2 | 29 | 6 | 9 | 6 | 61 | 0 | -6 |
| Tchaikovsky | 3 | 28 | 5 | 6 | 6 | 56 | 7 | 1 |

**Eleven of the nineteen pages have a gap of 1 pixel or less, or a negative one.** The notes behind it, which I looked at (`crops.files/dexc-1.png` to `dexc-6.png`, 41 notes where the rule's class differs from the printed one, and `crops.files/exce-1.png`, `tchm-1.png`, `excc-1.png`, `excc-2.png` for the earlier measures):
- **A thin flag on the Tchaikovsky pages is as thin as a bump on a line crossing.** The thinnest flagged note there is 7 pixels in a vertical cut (page 3) and two printed quarters on pages 2 and 3 carry a 6-pixel bump where a staff line crosses the stem: a gap of 1 pixel. Some of the flags there lie wholly in a line's band (a thin diagonal stroke 5 to 8 pixels thick, where the band with its allowance is 8 pixels), so the residue test sets the flag aside and the note reads as a quarter (the thinnest flagged note reads 0 on pages 1 and 2). **This is a real limit of the measure, not a mispairing: the notes are clear eighths in the crops** (`tchm-1.png`: nearly every tile shown is a plain flagged eighth).
- **Ink that touches the stem's tip and is not a flag:** a dynamic's letters or its bracket (*Sunless* 1, bars 1 and 5: `p`, `cres.`), and a neighbour's accidental. The shape is the same as a flag's: a printed quarter reads as an eighth. **No measure I took separates them.**
- **A stem printed as a dotted line, with the flag broken** (*Sunless* 4 bar 22, x 2230).

**Every note on which the stroke rule's class differs from the printed one, 41, sorted by looking:**

| What it is | Notes | Which |
|---|---|---|
| The scan and the file differ, or the aligner paired the wrong note: the crop shows the shape the rule reads, and the file says another (the file says eighth where the scan shows a plain or dotted quarter, or the file says quarter where the scan shows a flag) | 10 | *Sunless* 5, 8 (ids r3-2944, r30-2315, r44-2973, r44-3366, r45-898, r50-574, r50-583, r51-1121); *Sunless* 6, 2 (r6-1348, r17-1219) |
| A flag is there and the rule misses it or miscounts it (thin flag in a line's band; a second flag not counted; a broken stem) | 15 | the Tchaikovsky pages 13, *Sunless* 4 one (r22-2230), *Sunless* 5 one (r21-1291) |
| Ink touching the stem that is not a flag (a dynamic's letters) | 2 | *Sunless* 1 |
| The rule abstains (a short stem under 2.6 staff spaces bridged, a neighbour's accidental, a flag with 3 of 7 cuts) | 14 | all songs |
| **Total** | **41** | of 697 |

**The 106 `beam_scale_ink_no_beam` abstentions, as a group** (*Sunless* 1, 4, 5, and 6; 33, 13, 51, and 9, and 21 more on the Tchaikovsky). What the strokes say for them: **printed eighth, one stroke: 81. Printed quarter, no stroke: 13. Printed sixteenth, two strokes: 5.** Two printed quarters read as an eighth (touching ink), one printed half as a quarter, one as an eighth, one abstains, and one printed quarter has no stem. **The abstentions are 98 percent right by the strokes** (104 of 106 on the notes with a stem), and the cause is the same as the cause of today's confusions: the head's ink area is large because a flag or a beam is attached, and the reader, which finds no beam, abstains.

**Verdict on step 3.2: the classes do not separate on every build song with a gap wider than one pixel.** Part A is not built.

## Step 3.3: Part B, the dots

**What I listed.** For every matched note (the five build songs: 96, 115, 211, 137, 173 with a head), each connected component that `_has_dot` accepts today, and not only the first: **345** (38, 47, 69, 60, 131 on the five songs). For each: its centre against the staff's lines (in a space or on a line), its distance from the head's centre, its size, and its shape (the bounding box's fill, its aspect, its circularity).

**What they are, by looking** (`crops.files/dotin-1.png` to `dotin-3.png`: all 62 whose centre is in a space; `dotout-1.png` to `dotout-3.png`: 70 of the 283 that are not; `dotgap-1.png`: the first 24 of the 104 in between). Of the 62 in a space, **53 are printed augmentation dots, by looking** (a round, filled dot of about 0.3 staff spaces' width in the space to the right of the head), **and 9 are not: specks of 0.011 to 0.027 s² (6), a fragment of a stem printed as a dotted line (2), and the bowl of a lyric letter (1).** **Of the 283 that are not in a space, every one of the 70 I looked at is not a dot:** a fragment of a staff line left by the removal, lying on the line (a bump of 0.011 to 0.04 s², 3 to 6 pixels long). The 345 split by the line test (distance of the centre from the nearest line of at least 0.15 staff spaces): in a space 15, 20, 19, 15, and 18, and on a line 23, 27, 50, 45, and 113 on the five songs. **So by the groups I judged, 53 of 345 are printed dots, and the other 292 are line fragments (about 284 of them), specks (6), stem fragments (2), and text (1).**

**The reader's dot today, against the file:**
- *Sunless* 1: 8 of 14 printed dotted notes read dotted, and **15 of 82 plain notes read dotted**.
- *Sunless* 4: 11 of 11, and 21 of 104.
- *Sunless* 5: 12 of 20, and 35 of 191.
- *Sunless* 6: 10 of 12, and 37 of 125.
- Tchaikovsky: 11 of 12, and **65 of 161**.
- **Altogether 173 plain notes read as dotted, against 69 printed dots.** This is where the 65 "one and a half times" wrong lengths of the brief's section 1 come from, and more.

**The measures that separate the two groups.**

| Measure | Printed dots | The others | Gap |
|---|---|---|---|
| **Place against the lines:** distance of the centre from the nearest staff line | 0.225 s and more (6.5 px at s = 29); typically 0.35 to 0.5 s (10 to 15 px) | line fragments: 0.0 to 0.2 s (up to 6 px) | on one page 0.215 s (6.7 px) against 0.225 s (6.5 px) in the other: **no gap across pages; a gap on each page of 3.5 px at the narrowest** |
| **Size:** area, s² | 0.109 and more (the smallest) | specks 0.011 to 0.027; stem fragments 0.056 to 0.084 | 0.027 to 0.109 for the specks (24 to 98 px² at s = 30); **0.084 to 0.109 for the nearest fragment: about 1 pixel of width** |
| **Shape:** fill of the bounding box | 0.59 and more | stem fragments 0.39 to 0.55; the lyric bowl 0.66 | **0.55 to 0.59: not a gap** |
| **Shape:** aspect, short side over long | 0.69 and more | the lyric bowl 0.53 | 0.16 |
| **Place against the head:** vertical offset from the head's centre | -0.58 to +0.20 s | the lyric bowl +0.71 | 0.5 s (15 px) |
| **Place against the head:** distance from the head's centre | 1.05 to 2.09 s | the stem fragments 0.94 to 0.99 | 0.06 s (about 1.8 px) |

**Each test refuses almost all of the others by a wide margin, and the three together (a centre 0.15 staff spaces from a line, an area of 0.082 s², and the aspect) pass all 53 printed dots with a margin of more than 1 pixel on every page.** I computed the margin of every one of the 345 against every bound: **all 53 dots pass every test by at least 2.3 pixels** (place), **2.3 to 7.0 pixels** (area, as the width of a disc of that area) and **0.9 to 4.2 pixels** (fill, one Tchaikovsky dot at 0.9). **But four of the others are not refused by more than 1 pixel on any test:** a stem fragment on *Sunless* 4 page 9 at x 1042 (area 0.080, 0.1 pixel), a stem fragment on *Sunless* 4 page 10 (area 0.103, fill 0.50, and a distance from the head of 0.99 s), the lyric bowl on *Sunless* 6 page 20 (it passes the place and the size tests and is refused by the vertical offset, by 15 pixels, which I had not counted as a bound), and a speck cluster on the Tchaikovsky page 2 (area 0.068, 0.8 pixel). **On the strict reading, the two groups do not separate by more than a pixel on *Sunless* 4, 6, and the Tchaikovsky, and Part B is not built.** On a looser reading (the lyric bowl is refused by the offset by a wide margin, so it is not "not refused"), 3 of the 292 others fall within a pixel of a bound, all of them fragments of a broken stem and a speck cluster. The offline effect of the rule is in the offline table below.

**Every printed dot the reader misses today** (16 of 69 by the rule above, `crops.files/missed-dots.png`): a round, filled dot is visible in every one of the 16 crops, in the space to the right of the head. **In none of them does the reader's list hold a component that passes the dot's tests: the dot's component is merged with a staff line's remnant, or with the head's ink, or is larger than the window `_has_dot` allows** (4 of them on *Sunless* 1, 6 on *Sunless* 5, 2 each on 4, 6, and the Tchaikovsky). **That is a cause I did not separate case by case: NOT ESTABLISHED for each.** The measures above cannot find a dot that is not a component of its own.

## Step 3.4: Part C, the hollow heads, measured and reported

**Printed half notes and dotted half notes on *Sunless* 5 and 6, and what the reader does with each** (10 on *Sunless* 5 and 25 on *Sunless* 6; page 12 of *Sunless* 5, which is not read, holds more):

| What the reader does | *Sunless* 5 | *Sunless* 6 |
|---|---|---|
| No detection | 4 | 10 |
| A hollow detection set aside as a hook, in the bar, at the note's row | 1 | 5 |
| A hollow detection admitted, not paired with the note | 0 | 1 |
| Admitted, and abstained (`hollow_head_on_ink_heavy_page`) | 2 (a half and a dotted half) | 1 |
| Read as a half note, 1/2, from a hollow head | 0 | 1 |
| The note is paired with a filled head the reader read (its length 1/16, 3/32, and 1/8; 1/4, 1/4, 1/8, and 3/16; or abstained, 3) | 3 | 7 |

**The aligner paired the printed half notes with filled heads in 10 cases**; the filled head the reader read may be a neighbour's, so I do not count those as "read".

**For each note that carries `hollow_head_on_ink_heavy_page`: what the detection sits on** (*Sunless* 5: 15 notes, *Sunless* 6: 1; `ma/c5.json`, `c6.json`):
- **The core is closed with the staff lines removed, and its area is 0.23 to 0.38 s² (4 detections, 3 matched to a printed half or dotted half):** *Sunless* 5 page 17, x 1419 (the dotted half) and x 448 (a half), *Sunless* 5 page 16 x 3007 (a head the aligner did not pair), and *Sunless* 6 page 20 x 668 (a half). **These are genuine hollow heads**, as the printed notes show.
- **The core is open with the lines removed, and its area is 1.15 to 4.54 s² (11 detections):** each sits on the **hook of a flag** beside a printed **filled** head (eighths, a quarter, a dotted quarter). With the lines in, **8 of those 11 close** (a staff line closes the hook, as row 20 found), and 3 do not.
- **So the two groups separate on the core's area (0.23 to 0.38 against 1.15 to 4.54) and on the core's closure with the lines removed (closed 4 of 4, open 11 of 11).** Row 20's rule would set the 11 aside as hooks. **It does not act on these detections: it acts only on a braced system, and I infer these detections lie on systems where no braced pair was found (the same pages hold hooks that were set aside on other systems; I did not trace the brace rule further: NOT ESTABLISHED)**: so the hooks stay in as hollow heads, and each abstains. That is a finding to hand the desk: row 20's gate on "braced" decides whether a hook is a head, and a page without a detected brace falls on the wrong side of it.
- **Dann's ruling of 2026-10-02 02:37** (a hollow head on a line reads as two closed shapes, with the staff line in): the half note on *Sunless* 5 page 17 at x 448 is the case: its core is closed with the lines removed (area 0.35) and **not** closed with them in, which is what a head on a line should do. *Sunless* 6's half note at x 668 (page 20) is closed in both images (area 0.23). **NOT ESTABLISHED for the half notes that were not detected at all.**

## Offline: what the measures would do if applied (not built)

The same measures, applied by arithmetic to the notes the scorer matched, with a filled head and a stem of at least 2.6 staff spaces (bridged): **a length is the class from the count of strokes (none, one, or two; anything else abstains), times 3/2 if the dot rule (a centre 0.15 s from a line, an area of 0.082 s², the aspect) finds a dot.** Hollow heads and notes without a stem keep what they read today. Nothing here is in the reader. The thresholds were fitted on these five songs; **the test-only songs were not touched, and this is not evidence for them.**

| Song | length right today | length right if the offline rule were applied | wrong today | wrong offline | abstained today | abstained offline | notes right today and not offline |
|---|---|---|---|---|---|---|---|
| *Sunless* 1 | 42 | 85 | 21 | 8 | 33 | 3 | 1 |
| *Sunless* 4 | 50 | 109 | 52 | 2 | 13 | 4 | 2 |
| *Sunless* 5 | 35 | 175 | 118 | 24 | 59 | 13 | 4 |
| *Sunless* 6 | 57 | 113 | 70 | 15 | 10 | 9 | 5 |
| Tchaikovsky | 24 | 151 | 128 | 14 | 21 | 8 | 1 |

**On every build song the count of matched notes with the right length would rise and the count of wrong lengths would fall,** and 1 to 5 notes per song that read right today would not. **If the desk rules that the gap criterion is to be read as the separation of the printed classes on the notes where the file and the scan agree, and that the narrow cases are to abstain, this is where a build would start.** I did not decide that.

## Section 6, line by line

1. **The baseline table with five build songs, before and after, and the two test-only songs' totals, before and after: before MET, after = before** (nothing was built; the table is above).
2. **Right length higher and wrong length lower on every build song: NOT BUILT.** The offline table shows the effect the build would have.
3. **Test-only totals for length right do not fall: NOT BUILT, so unchanged** (19 and 54 length right, as before).
4. **Every length for a flagged or beamed note rests on the measures of section 3, with its gap: NOT BUILT.** The gaps are in the tables above; four of the separations fall to a pixel.
5. **The 23 render pages byte-identical: MET by construction** (no reader code changed).
6. **Read time per song beside row 22's:** *Sunless* 1: 20.9 s (row 22: 21.7), 2: 14.9 (15.1), 3: 47.4 (47.8), 4: 19.8 (20.2), 5: 57.4 (57.8), 6: 49.0 (50.1), Tchaikovsky 31.9 (32.5). No difference.
7. **Gates: at baseline.** 251, 235, `found 0 errors and 12 warnings in 5 files`, 1824, `644 passed | 5 skipped (649)`, 145, 55, `ratchets: OK.` No number moved.

## What could not be established

- **That any measure separates the classes by more than a pixel on every page.** The thin flags of the Tchaikovsky engraving defeat every thickness measure I took (7 pixels against a 6-pixel bump). A measure of the flag's *length* across the stem (how far it reaches) failed on ties and slurs that touch the stem, and the chain of runs from cut to cut failed on a flag that slants. **I did not try a measure on the flag's own outline** (its contour's curvature), which the desk may want to name.
- **Whether the 10 notes where the file and the scan differ in length are mispairings by the aligner or differences in the edition.** I judged each by the crop; I cannot tell which from the crop alone.
- **The causes of the 16 missed dots, case by case.**
- **Why the brace rule finds no braced pair on some pages of *Sunless* 5 and 6**, which decides whether a hook is read as a head.
- **Whether the 25 undetected half notes of *Sunless* 6 are hollow detections the finder never made or heads it drops.** I looked at where hooks fall; I did not look at the finder's raw output for them.
- **The Tchaikovsky draft's three pitches (bars 20, 22, 76)**, above.
- **The test-only songs' shape data:** not measured, by design. Whether the thresholds hold on a song nobody has studied is exactly what a build must check, and it cannot be checked here.


---

# Build against brief r2 (2026-10-02)

**Written by:** Code (Sonnet 5.5). **Brief:** `brief-code-length-is-read-from-shape_r2_2026-10-02.md`, which replaces sections 3 and 6 of r1. **Status: WRITTEN**, uncommitted, on the tree at `389d4db`. All eight gates are at baseline.

## First: one test-only song moved the wrong way

**On *Sunless* 2 (a test-only song, totals only), length wrong rose from 27 to 34, and length right rose from 19 to 27.** Section 6 item 3 asks that length wrong not rise on either; it did on this one. On *Sunless* 3 length wrong fell from 81 to 76 and length right rose from 54 to 91. The abstentions on *Sunless* 2 fell from 21 to 6: net, the new rule read 15 notes the old one abstained on and got 8 more right and 7 more wrong. **This is the check the desk asked for, and it says the bounds do not hold as cleanly on a song nobody studied as on the five.** I did not open that song's pages, crops, or notes, and I tuned nothing on it. Everything else in section 6 is met on the five build songs, except where it says otherwise.

## What was built

- **`tools/e16-harness/reader/shape.py` (new).** The rule, with every bound and margin named and the reason beside it: the stem followed to its far end (breaks of up to 0.3 staff spaces bridged), the stroke at its far end followed as a path, the count of strokes at four cuts, the beam, and the dot. `read_length` returns the length, or an abstention with a reason.
- **`tools/e16-harness/reader/run_page2.py`, three small edits.** `import shape`; for a filled head with a stem, `shape.read_length` is asked first, and its answer stands (a length, or an abstention with its reason in the same `abstain.duration` field, with new reason strings); `_has_dot`'s multiply is skipped when the shape rule answered. A note with no stem, or a stem under 2.6 staff spaces bridged, takes the old path exactly as before. Nothing else moved: `VocalLineEvent`, the seam's shape, and the abstain path are as they were. No product code changed.
- **It acts on ink-heavy pages only** (`run_page2.py`, the same `INK_WEIGHT_GUARD` the hollow rule uses; `cfg['shape_ink_heavy_only']` lets a measurement lift it). **Applied to every page the rule changes the notes' lengths on 22 of the 23 render pages (measured), so r2's section 6 item 5 applies: ink-heavy pages only. With that gate the 23 render pages are byte-identical (23 of 23, the events' JSON with the rule on and off).** One render page of the 24 under `repaired/` raises in `detect_staves` on this tree with or without the rule, so I read 23.
- **Harness (accepted by the desk):** `matches` in `scan-scorer.ts`; the Tchaikovsky as song 7 in `scan-baseline.ts`.

## Step 3.1: the flag as a path

**What I measured** (`m_p.py`, `mp/`; the 697 matched, filled, stemmed notes of r1's step 3.2, 93, 111, 199, 126, and 168 on the five songs, less the notes whose bridged stem is under 2.6 staff spaces). For each note, on each side of the stem, from 0.12 staff spaces clear of the stem's edge out to 1.7, and from 0.6 past the tip to the head's end less 0.8:
- the ink of the components the stem passes through (the stem is broken on some notes, so the head's component alone is not enough: a flag above a break is a component of its own);
- each staff line's band is set aside, because it carries the line's own residue across the page, and put back in a column only where the stroke has ink above and below it: **a flag cut where it crosses a line is one stroke, and a line's residue is none**;
- the stroke is the connected component that touches the clear column near the tip. **Its travel** is how far it runs back toward the head from the tip (`tmax`), in staff spaces. **Its reach** is how far it runs from the stem. **It runs on** if it reaches the outer limit.

**Why the path and not the thickness.** A flag on the Tchaikovsky pages is 7 to 9 pixels thick in a vertical cut and a bump where a line crosses a stem is 6. The reach of the stroke is the measure the desk's eye named, and it is: **a plain quarter's stroke reaches 0.00 to 0.07 staff spaces on all but a few of the notes (a speck), and a flagged note's reaches 0.45 to 1.1.** A flag also travels back along the stem (a median of 2.4 to 2.9 staff spaces, except the beamed notes); the touching ink of a dynamic's letter does not (0.2 to 0.8).

**The spread, per page** (reach in staff spaces; p95 and p5 of the printed quarters and of the flagged notes; the gap is the flagged p5 less the quarters' p95, in staff spaces and pixels; the travel of the flagged notes, p5 and median; the flagged notes whose stroke runs on, which are the beamed ones). Pages 11 and 18 hold few notes; a page whose flagged p5 is 0.00 holds a flagged note with no stroke found:

| Song | page | s (px) | printed quarters: n, reach p95 (max) | flagged notes: n, reach p5 (min) | gap p5 - p95 (s / px) | flagged: travel p5 (median) | flagged that run on |
|---|---|---|---|---|---|---|---|
| Sunless 1 | 1 | 30 | 31, 0.53 (1.00) | 16, 0.80 (0.80) | 0.27 / 8 | 2.50 (2.70) | 0 |
| Sunless 1 | 2 | 30 | 32, 0.03 (0.07) | 12, 0.83 (0.83) | 0.80 / 24 | 2.43 (2.67) | 0 |
| Sunless 4 | 9 | 31 | 14, 0.00 (0.00) | 26, 0.74 (0.71) | 0.74 / 23 | 0.90 (2.61) | 2 |
| Sunless 4 | 10 | 31 | 23, 0.00 (0.07) | 48, 0.68 (0.65) | 0.68 / 21 | 0.61 (2.42) | 7 |
| Sunless 5 | 11 | 30 | 3, 0.00 (0.03) | 10, 0.00 (0.00) | 0.00 / 0 | 0.00 (2.90) | 1 |
| Sunless 5 | 13 | 29 | 8, 0.03 (0.03) | 19, 0.45 (0.45) | 0.41 / 12 | 0.93 (2.79) | 0 |
| Sunless 5 | 14 | 30 | 10, 0.00 (0.00) | 17, 0.50 (0.50) | 0.50 / 15 | 0.97 (2.67) | 0 |
| Sunless 5 | 15 | 30 | 7, 0.00 (0.00) | 42, 0.83 (0.00) | 0.83 / 25 | 1.73 (2.73) | 0 |
| Sunless 5 | 16 | 30 | 16, 0.93 (1.23) | 28, 0.87 (0.07) | -0.07 / -2 | 2.30 (2.67) | 1 |
| Sunless 5 | 17 | 30 | 17, 0.50 (0.93) | 17, 0.00 (0.00) | -0.50 / -15 | 0.00 (2.73) | 0 |
| Sunless 6 | 18 | 30 | 9, 0.00 (0.00) | 3, 0.00 (0.00) | 0.00 / 0 | 0.00 (2.57) | 0 |
| Sunless 6 | 19 | 32 | 14, 0.06 (0.16) | 15, 0.81 (0.81) | 0.75 / 24 | 0.22 (0.88) | 9 |
| Sunless 6 | 20 | 32 | 17, 0.00 (0.44) | 9, 0.66 (0.66) | 0.66 / 21 | 0.34 (0.69) | 6 |
| Sunless 6 | 21 | 32 | 13, 0.06 (0.16) | 8, 0.79 (0.79) | 0.73 / 23 | 0.29 (2.67) | 2 |
| Sunless 6 | 22 | 31 | 12, 0.00 (0.03) | 6, 0.71 (0.71) | 0.71 / 22 | 1.90 (2.58) | 0 |
| Sunless 6 | 23 | 31 | 8, 0.00 (0.10) | 4, 0.48 (0.48) | 0.48 / 15 | 1.00 (2.45) | 0 |
| Tchaikovsky | 1 | 28 | 6, 0.00 (0.00) | 29, 0.32 (0.18) | 0.32 / 9 | 0.96 (2.89) | 0 |
| Tchaikovsky | 2 | 29 | 9, 0.03 (1.69) | 61, 0.14 (0.00) | 0.10 / 3 | 0.79 (2.76) | 1 |
| Tchaikovsky | 3 | 28 | 6, 0.04 (1.68) | 56, 0.86 (0.00) | 0.82 / 23 | 0.93 (2.75) | 1 |

**What it does to the eleven pages r1 listed with a gap of 1 pixel or less: six now have a gap of 8 to 25 pixels** (*Sunless* 4 page 10, *Sunless* 5 pages 14 and 15, *Sunless* 6 page 20, and the Tchaikovsky pages 1 and 3). **Five do not:** *Sunless* 5 pages 16 and 17 (-2 and -15 pixels), the Tchaikovsky page 2 (3 pixels), and *Sunless* 5 page 11 and *Sunless* 6 page 18 (a flagged note whose stroke was not found, on pages that hold 10 and 3 flagged notes). The *Sunless* 5 pages 16 and 17 are the pages that hold most of the 10 notes where the file and the scan differ (a printed flag where the file says quarter, and the other way): the crops show the shape the rule reads, and the rule is right and the file is not. On the Tchaikovsky page 2 the gap is 3 pixels because the flags there are the thinnest (the p5 of the reach is 0.14).

**The 15 missed flags and the 2 touching inks now:** of the 15 flags r1's measure missed or miscounted, **8 are now read right, 4 abstain, and 3 are read wrong** (one an eighth read as a sixteenth, one a quarter, one an eighth wrongly: a flag whose stroke is broken). **Both touching inks (the 'p' and the 'cres.' on *Sunless* 1) abstain**: their stroke travels 0.17 and 0.77 staff spaces, under the 1.0 a flag travels. The two plain quarters on the Tchaikovsky pages 2 and 3 that carry a 6-pixel bump (and whose bump ran along the line for 1.7 staff spaces) **abstain** (`bump_on_a_line_at_the_stem_tip`: the ink runs on and is no thicker than 0.25 staff spaces, where a beam bar is at least 0.28 to 0.65).

**My own measure: the travel.** I added it beside the reach because the reach alone cannot tell a flag from the dynamic's letter that touches the tip (reach 0.7 to 1.0 on both); the travel can, by a gap of 0.2 to 1.5 staff spaces. I judged it better than a thickness because a flag's thickness is not stable and its travel is (median 2.4 to 2.9, against 0.2 to 0.8 for a touching ink).

## The rule, and its margins

Every number is in staff spaces (`s`), on each page's own staff space; the line thickness is used only to set the line's band aside. **The class:**

| The stroke | The length | The gap it sits in | The margin |
|---|---|---|---|
| reach at most 0.07 | a quarter | clean quarters: 0.00 to 0.07 | the whole gap from 0.07 to 0.55 abstains |
| reach from 0.07 to 0.55 | **abstains** (`stroke_inside_the_margin`) | | |
| reach at least 0.55, travel at least 1.0 | a flag; its strokes are counted | flagged p5: 0.45 to 0.87; travel p5 0.2 to 2.5 | a flag with travel under 1.0 abstains (`stroke_travel_too_short`) |
| reach under 1.5 | counted at the cuts 0.25, 0.45, 0.65, and 0.85 from the stem, runs that start within -0.4 to 2.0 of the tip: one at every cut, an eighth; two at two cuts, a sixteenth; anything else abstains (`stroke_count_ambiguous`) | | a note on which any cut shows two and fewer than two cuts agree abstains |
| reach at least 1.5 (runs on), bar at least 0.38 thick at both far cuts | a beam: one bar an eighth, two a sixteenth | beams 0.28 to 0.65 thick, bumps 0.1 to 0.25 | thickness 0.25 to 0.38 abstains (`ink_at_the_stem_tip_runs_on`); at most 0.25, `bump_on_a_line_at_the_stem_tip` |

**The cost in abstentions** (the count is the notes the scorer matched; the reasons are counted over every note event the reader emits, so they differ from the count by a note or two):

| Song | abstained before | abstained after | after: by reason |
|---|---|---|---|
| *Sunless* 1 | 33 | 9 | 4 `dot_inside_the_margin`, 2 `stroke_travel_too_short`, 1 each `stroke_inside_the_margin`, `stroke_count_ambiguous`; the rest keep the old reason (a stem under 2.6) |
| *Sunless* 4 | 13 | 12 | 9 `stroke_count_ambiguous`, 3 `dot_inside_the_margin` |
| *Sunless* 5 | 59 | 31 | 16 `stroke_count_ambiguous`, 5 `dot_inside_the_margin`, 3 `stroke_inside_the_margin`, 2 `ink_at_the_stem_tip_runs_on`; 15 hollow notes keep their reason |
| *Sunless* 6 | 10 | 14 | 5 `stroke_travel_too_short`, 4 `stroke_inside_the_margin`, 3 `ink_at_the_stem_tip_runs_on`, 3 `dot_inside_the_margin` |
| Tchaikovsky | 21 | 21 | 11 `stroke_inside_the_margin`, 4 `stroke_count_ambiguous`, 3 `bump_on_a_line_at_the_stem_tip`, 2 `dot_inside_the_margin`, 1 `ink_at_the_stem_tip_runs_on` |

The abstentions are the honest part of the margin: **the Tchaikovsky's 21 are 11 flags too faint to call, 4 ambiguous counts, and 3 bumps that the old rule read.**

## Step 3.3: beams

For the printed eighths and sixteenths, by the path: **no beam on *Sunless* 1 or 5 or the Tchaikovsky (which prints none); 9 of the 72 printed eighths on *Sunless* 4, and 14 of the 45 on *Sunless* 6 (and 3 more that run on and abstain).** The reader's own `beams_on_stem` finds 10 and 15. The strokes agree with the reader's beams in count and say more: **a beamed eighth reads one bar (a bar 0.28 to 0.65 thick at both far cuts), a beamed sixteenth two; the beamed notes read right by the same rule as the flagged ones.** The rule does not use `beams_on_stem`; the notes where it and the path disagree are the ones the old rule read from the area (no beam found, a large area, `beam_scale_ink_no_beam`), which is why that reason is nearly gone from the table above.

## Step 3.4: the dot

Built as r1's three tests with the two bounds r1's report found beside them: **the centre at least 0.15 s from a line; the area at least 0.082 s² (as the width of a disc); the shorter side over the longer at least 0.60; the distance from the head's centre at least 1.02 s; the vertical offset from the head's row at most 0.45 s.** A component that fails any bound by more than 1.5 pixels (0.05 on the aspect) is not a dot; one that passes every bound by more than the margin is; **one that is within the margin of a bound, and fails none beyond it, makes the note's length abstain** (`dot_inside_the_margin`: 4, 3, 5, 3, and 2 notes on the five songs).

**Plain notes the reader reads dotted: from 15, 21, 35, 37, and 65 to 1, 0, 3, 6, and 2** (the plain notes of the file, matched). **Dotted notes read dotted: from 8, 11, 12, 10, and 11 to 6, 8, 9, 7, and 7**, with 4, 2, 7, 3, and 2 abstaining and **4, 1, 4, 2, and 3 read plain** (before: 4, 0, 3, 1, 1). **The rule gives up some dots (a printed dot a pixel or two outside a bound) to remove 173 false ones; the dotted notes read plain rose by 1, 1, 1, and 2 on four songs. Each of those is a wrong length the old rule did not give.** The per-page margins:

| Song | page | printed dots (labelled) | smallest margin of a dot over every bound (px; the margin is 1.5) | printed dots inside a margin | other components | other components not refused beyond the margin |
|---|---|---|---|---|---|---|
| Sunless 1 | 1 | 5 | -1.3 | 2 | 16 | 0 |
| Sunless 1 | 2 | 4 | -0.3 | 2 | 13 | 0 |
| Sunless 4 | 9 | 4 | -1.0 | 2 | 12 | 1 |
| Sunless 4 | 10 | 5 | -1.9 | 1 | 26 | 2 |
| Sunless 5 | 11 | 2 | 0.9 | 1 | 0 | 0 |
| Sunless 5 | 13 | 2 | -0.3 | 1 | 11 | 0 |
| Sunless 5 | 14 | 2 | 1.0 | 1 | 5 | 0 |
| Sunless 5 | 15 | 2 | -0.2 | 1 | 13 | 0 |
| Sunless 5 | 16 | 4 | 0.1 | 1 | 9 | 0 |
| Sunless 5 | 17 | 4 | 1.7 | 0 | 15 | 0 |
| Sunless 6 | 18 | 1 | 4.2 | 0 | 3 | 0 |
| Sunless 6 | 19 | 1 | 2.0 | 0 | 16 | 0 |
| Sunless 6 | 20 | 2 | -1.7 | 2 | 16 | 0 |
| Sunless 6 | 21 | 2 | 2.2 | 0 | 11 | 0 |
| Sunless 6 | 22 | 3 | 0.1 | 2 | 4 | 1 |
| Sunless 6 | 23 | 1 | -2.3 | 1 | 0 | 0 |
| Tchaikovsky | 1 | 0 | - | 0 | 18 | 1 |
| Tchaikovsky | 2 | 3 | 3.4 | 0 | 71 | 0 |
| Tchaikovsky | 3 | 6 | -3.7 | 3 | 33 | 0 |

(The "other components" are the 345 minus the labelled dots; "inside a margin" counts the printed dots whose smallest margin is under 1.5 pixels, and the negative margins are printed dots the rule refuses by more than 1.5 pixels. The page-by-page spread shows where the rule gives up dots: *Sunless* 1 and 6 (page 20), and the Tchaikovsky page 3.) **The 16 printed dots that are not a component of their own** (r1's report) **are unchanged: reported, not fixed.**

## Offline once, then the build

Before I changed the reader I ran the chosen rule by arithmetic on the five songs, as `sim.py` did (`sim2.py`): **length wrong from 21, 52, 118, 70, 128 to 6, 3, 22, 15, 14; right from 42, 50, 35, 57, 24 to 79, 99, 156, 105, 133.** It did not rise on any song, so I built. **The build's numbers differ from the offline ones on *Sunless* 6 and on *Sunless* 5, for two reasons I know:** the build acts on ink-heavy pages only, and two pages of *Sunless* 6 (18 and 23) have a staff-line thickness of 0.129 of a staff space, under the guard of 0.1428, so they keep the old rule (**24 of *Sunless* 6's 34 wrong lengths are on those two pages**); and on *Sunless* 5 the aligner paired 3 more notes after the lengths changed.

## Section 6, line by line

**1. On every build song, length wrong is lower and length right is higher: MET.**

| Song | wrong, before | wrong, after | right, before | right, after | abstained, before | abstained, after |
|---|---|---|---|---|---|---|
| *Sunless* 1 | 21 | **6** | 42 | **81** | 33 | 9 |
| *Sunless* 4 | 52 | **3** | 50 | **100** | 13 | 12 |
| *Sunless* 5 | 118 | **14** | 35 | **170** | 59 | 31 |
| *Sunless* 6 | 70 | **34** | 57 | **89** | 10 | 14 |
| Tchaikovsky | 128 | **17** | 24 | **135** | 21 | 21 |

(Notes the scorer matched. Of every 100 printed notes, present with the right pitch and the right length: *Sunless* 1 36.5 to 64.6, 4 37.1 to 69.8, 5 11.6 to 46.1, 6 23.0 to 41.0, Tchaikovsky 13.2 to 73.0.)

**2. No build song loses a matched note or a right pitch: MET for every event, with one caution.** The reader's events are the same events, with the same ids, and **no event's pitch changed on any of the five songs** (0 of 101, 117, 230, 146, and 183). **The scorer's counts do differ on *Sunless* 5**: matched 212 to 215 and pitch right 152 to 150, because the aligner pairs notes by pitch and length together and it paired 3 more notes once the lengths moved. Under the old pairs (the same 212 matched) the pitch right count is 152 and the length figures are 156 right, 22 wrong, 34 abstained, still better than before.

**3. The test-only songs, totals only: NOT MET on *Sunless* 2** (said first, above). *Sunless* 2: wrong 27 to 34, right 19 to 27, abstained 21 to 6, both right 11 to 16, headline 16.2 to 23.5. *Sunless* 3: wrong 81 to 76, right 54 to 91, abstained 62 to 30, both right 46 to 72, headline 20.7 to 32.0. Pitch right and notes matched are unchanged on both (48 of 67; 136 of 197).

**4. Every bound reported with its gap and its margin on every page: MET** for the path (the per-page table above, and the rule's table) **and for the dot** (the per-page margin table). **The bounds of the dot are the narrow ones:** a printed dot passes every bound by more than 1.5 pixels on 5 of the 18 pages that hold a labelled dot (*Sunless* 5 page 17, *Sunless* 6 pages 18, 19, and 21, the Tchaikovsky page 2), and falls inside a margin or outside a bound on the rest.

**5. The 23 render pages are byte-identical: MET** by the ink-heavy gate (23 of 23 read, the events' JSON equal with the rule on and off); the rule moved 22 of 23 when I let it act everywhere.

**6. Read time per song, beside row 22's** (wall seconds on the app's Worker; the figures of the build's second pass; the first pass, before I read the stem's window instead of the page, was 5 to 13 s slower per song): *Sunless* 1 19.7 (row 22: 21.7), 2 13.9 (15.1), 3 44.5 (47.8), 4 17.8 (20.2), 5 54.4 (57.8), 6 47.3 (50.1), Tchaikovsky 27.0 (32.5). **No slower, within the run-to-run difference** (a pass of the unchanged reader earlier in the same session read 20.9, 14.9, 47.4, 19.8, 57.4, 49.0, and 31.9 s).

**7. Gates: at baseline.** 251, 235, `found 0 errors and 12 warnings in 5 files`, 1824, `644 passed | 5 skipped (649)`, 145, 55, `ratchets: OK.` No number moved. The new module and the other new files are untracked (the real `ilya-ship.sh` will refuse until they are committed). **There is no test of `shape.py` in the gates; the proof is the measurement** (`m_p.py`, `sim2.py`, and the build's reads).

## What could not be established

- **That the bounds hold on a song nobody studied.** *Sunless* 3 improves on every count; *Sunless* 2's wrong lengths rose by 7 (and its right ones by 8), from notes the old rule abstained on. Two songs are too few to say which of them is the exception.
- **The three flags the rule reads wrong and the 14 wrong lengths it still gives on *Sunless* 5 and the 17 on the Tchaikovsky.** I looked at the 41 notes of r1's list and the 17 above, not at every wrong length that remains.
- **Whether lowering the ink-heavy guard from 0.1428 to about 0.12 would carry the rule onto *Sunless* 6's pages 18 and 23** (24 wrong lengths) **without moving the render pages** (0.0952): a render page would stay untouched, and the pages between the two values would take the rule on the evidence of five pages I did not measure on. It is the desk's to rule.
- **The causes of the 16 printed dots that are not a component of their own,** and of the dots a pixel or two outside a bound.
- **Whether a flag's outline (its curvature) would separate the Tchaikovsky's faint flags better than the reach.** I did not try it; the 11 `stroke_inside_the_margin` abstentions on the Tchaikovsky are those flags.
