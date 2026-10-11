# Report: the printed metre, round 4: a trained classifier, judged by signature (QUEUE row 57)

Code (Opus), 2026-10-10, on the Mac, branch `Shane`, HEAD `a7161ce`. The working tree held the desk's uncommitted changes to `docs/memory/INBOX.md` and `docs/memory/QUEUE.md`; neither was touched except row 57 of `QUEUE.md`. Brief: `brief-code-the-metre-seen-and-summed_r4_2026-10-10.md`, with r2's kept sections. No git command that writes was run. Nothing whose name begins `heldout2` was opened, read, listed, or run. Songs A, B, C, E, and F were not opened or run.

## The answer first: STOPPED, nothing wired

A small trained classifier reads **24 of the 32 printed signatures** on the 17 songs, held out song by song, and states **no false signature at any of the 814 bar starts** on those songs. The baseline was 4 of 32.

**It does not meet the bar.** On renders of the held-out font, it states **43 false signatures in 5,100 rendered staves**. The bar is 0 false signatures anywhere, rendered included, and the rendered count is taken with configuration 1 for both configurations (r4 section 3). So r4 section 4's first case does not hold, and its third case applies: stop and report, nothing wired. `apps/` is as at HEAD.

**Configuration 2 was not measured.** It needs the current build's homr reading of each song, and none is on disk (see "Could not establish"). It cannot change the outcome: witness 5 only takes statements away, and the rendered count is configuration 1's.

## 1. The training set, by class and source

### Lost and rebuilt

Round 3's labelled crops and harness lived in that session's scratchpad (`m57/`), and that directory is gone from `/private/tmp`. I rebuilt the edition examples from the page images, labelling by eye. This round's harness, labels, and results are kept in the tree at `docs/sessions/measure-metre-r57-r4_2026-10-10/` (492 KB, no models or crop data) so the next round need not rebuild them.

### The pages and the places

- **Pages.** The 17 songs' PDFs, plus *Sunless* 2 and 3, rasterized at 300 dpi and deskewed (68 pages). The Gurilyov, Grechaninov, and Varlamov PDFs were copied from `~/Downloads/_desk-2026-10-07/heldout-scans/` by exact file name; that folder was not listed.
- **Staves.** Found from the image (`staff.py`): five evenly spaced rows of ink, followed across the page in strips 14 spaces wide. Found on 60 of 68 pages. Not found on any of Grechaninov's 5 pages (the grey scan, as in rounds 2 and 3), on Gurilyov's cover, or on Varlamov's text pages.
- **Voice staves.** Marked by eye on each page from labelled overlays (`voices.py`): the top staff of each system, with 13 pages listed by hand where systems have 2 or 4 staves or a staff was missed.
- **Windows (Dann's placement rule).** On the voice staff only:
  - at each system's start, from the staff's left end over 15 spaces (clef, key, signature);
  - after each barline, over 4.5 spaces. A barline is a stroke from the top line to the bottom line that goes no further and has no notehead at either end. A heavy barline counts, and a double barline is one place.
  - On the 17 songs: **198 system starts and 616 bars, 814 windows.**
- **The places, labelled by eye** from crops of all 876 windows (the 814 plus 62 in *Sunless* 2 and 3):
  - **30 printed signatures** on the 17 songs, the same 30 as row 37's table less Grechaninov's 2. All 30 fall in a window.
  - **2 courtesy signatures**: Kabalevsky 6, end of page 2's third system (4/4); Kabalevsky 9, end of page 3 (3/2).
  - In *Sunless* 2 and 3, 5 signatures and 2 courtesies (training only).

### What the classifier learned from

The classifier labels one mark: 0 to 9, C, cut C, or none (13 classes).

| Source | Figures | Non-figures | Classes present |
|---|---|---|---|
| **Rendered**, 10 fonts (Bravura, Leland, Finale Maestro, Engraver, Broadway, Ash, Jazz, Legacy, Petaluma, Sebastian), 300,000 staves | 777,160 crops | 3,168,640 crops | all 13 |
| **These editions' figures**, voice staves | 67 marks | | 2, 3, 4, 6, 8, 9, C |
| **These editions' figures**, piano staves of the same systems | 132 marks | | 2, 3, 4, 6, 8, 9, C |
| **These editions' non-figures**: every position in every window, on the voice staff and on the piano staves of its system, at three seats | | 249,421 crops | none |

- **Rendered figures by class** (crops in the pool, two to a mark; each fold draws 250,000 figure and 350,000 other crops from it): 0: 18,880; 1: 153,904; 2: 122,886; 3: 45,988; 4: 140,286; 5: 37,060; 6: 62,910; 7: 28,364; 8: 85,572; 9: 28,094; C: 34,534; cut C: 18,682.
- **The missing figures 0, 1, 5, 7, and 9 come from the renders only.** These editions print one 9 (Kabalevsky 7, three marks with its piano staves) and no 0, 1, 5, or 7.
- **Edition figure marks by class**: 4: 88; 3: 27; 2: 27; C: 27; 8: 18; 6: 9; 9: 3. By song: Kabalevsky 6: 36; Kabalevsky 4: 28; Kabalevsky 9: 24; *Sunless* 3: 21; Kabalevsky 7: 18; *Sunless* 4: 12; 6 each for Kabalevsky 1, 2, 3, 8, and 10, *Sunless* 1, Tchaikovsky, and Varlamov; 3 each for Gurilyov, *Sunless* 5, *Sunless* 6, and *Sunless* 2. Each mark gives 30 crops jittered by up to 0.15 of a space (5,970 crops).
- **How the edition figures were located.** A first model trained on renders only (no song) read each labelled window. Where it read the label, its figure positions were taken; then the piano staves of that system were read the same way. 199 marks were located; 2 piano staves were not (Kabalevsky 4 bar 16, and a *Sunless* 3 courtesy), and their windows were left out of the non-figures. Every located crop was checked by eye (`pos-check.png` in the kept folder).
- **Rendered staves** (`render.py`): a five-line staff with a clef, a key signature of 0 to 7 sharps or flats, then a signature or none, then notes, rests, accidentals, flags, ledger lines, and dots; or notes, a thin or heavy barline, a signature or none, and notes. Clutter: dynamics, slurs, and **tuplet numerals** (`tuplet0` to `tuplet9`, on and off the staff) as negatives. Degradations: render size 7 to 16 pixels a space, then resampled; dilation or erosion; elastic shape jitter; blur; grey background and ink levels; noise; thresholding.
- **Mixed-metre forms** were not rendered; none is printed in these songs.

## 2. The method

- **What reads a mark.** A small convolutional network: three blocks of two 3 by 3 convolutions, then two dense layers; **171,901 parameters, 689,048 bytes as ONNX** (`metre-f00.onnx`, exported from fold 0; onnxruntime 1.31 reproduces PyTorch's output to 1e-6). I chose it because it is small enough for onnxruntime-web, which the app already loads for homr, and because round 3 showed nearest-template matching cannot separate these editions' figures from flags and flats.
- **Its input.** A 32 by 32 crop at 10 pixels a space, staff lines left in, centred on one of three seats: the second line from the top (an upper figure), the middle line (C, cut C), and the second line from the bottom (a lower figure). It is slid across each window in steps of 0.2 of a space.
- **From marks to a signature** (`decode.py`), witnesses 1 to 4:
  - **Perception**: a mark is present where the network gives it at least 0.3 of not being "none"; marks nearer than 0.45 of a space are one mark, and nearer than 0.8 of a space unless the presence dips between them (two-digit figures).
  - **Semiotics**: figures in the upper and lower seats stand one over the other; figures within 1.6 spaces of each other in a seat form one number (12, 16). A C or cut C stands on the middle line with no figure over or under it.
  - **Logic**: every mark in the signature must read above the fold's cut; the two numbers must be centred on each other within the fold's tolerance (Gould's stacked figures); the lower number is 1, 2, 4, 8, 16, or 32; the upper is at least 1. Anything else is no answer.
  - **Expectation**: a window states one signature or nothing; an unsure mark within 3 spaces of it states nothing. A signature after a system's last barline with under 6 spaces of staff after it is a courtesy and is set aside. Common metres are not used as a gate.
- **Held out song by song** (`fold.py`). Fold *f* holds out song *f* and font *f* mod 10 (fonts 0 to 6 are each held out twice). Inside each fold:
  - its 16 training songs (Grechaninov contributes nothing) are split once at random, seed *f*, into 12 to train on and 4 to tune on; *Sunless* 2 and 3 are always trained on;
  - the render scale range is set from the training songs' printed signature heights (pair height over the staff, 0.82 to 1.02 measured), widened: 0.72 to 1.10 in 16 folds, 0.75 to 1.10 in one;
  - the network trains for 3 epochs on 600,000 render crops (held-out font left out, scale in range) and the 12 songs' crops;
  - the centring tolerance and the cut are chosen together, on the 4 tuning songs' windows and 300 rendered tuning staves of the training fonts: for each tolerance, the lowest cut with 0 false signatures there; then the pair that reads most right there.
- **Time.** Training: 17 folds at 188 to 217 seconds each, about 56 minutes, plus a 3.5-minute first model. Judging and tuning: about 15 minutes. Under the brief's two hours.

### Changes made after looking at results (stated so the measurement can be weighed)

- The decoder's presence threshold, its two-digit spacing, and the centring check were written after reading the false reads in fold 0's and fold 1's renders (Bravura and Leland held out), and the first model's reads over all 876 windows. That first model had seen no song.
- The rendered test was first drawn at scales 0.60 to 1.15; I narrowed it to each fold's own range (0.72 to 1.10), which still covers round 2's 75 and 85 percent sizes. 0.60 is below every printed signature measured and every scale trained on.
- So the final rendered measurement uses **fresh render seeds** that no step had looked at. On the earlier seeds, with a fixed centring tolerance of 0.4, the count was 20 false signatures in 3,501 staves. It was not 0 either.

## 3. The bar, by configuration

### Configuration 1 (witnesses 1 to 4)

**The 17 songs, every bar start (814 windows), each read by its own fold:**

| Song | Held-out font | Cut | Printed (readable) | Right | Missed | **False** | Courtesies set aside |
|---|---|---|---|---|---|---|---|
| Tchaikovsky | Bravura | 0.5 | 1 | 1 | 0 | **0** | |
| *Sunless* 1 | Leland | 0.97 | 1 | 0 | 1 | **0** | |
| *Sunless* 4 | Finale Maestro | 0.8 | 3 | 3 | 0 | **0** | |
| *Sunless* 5 | Finale Engraver | 0.98 | 1 | 1 | 0 | **0** | |
| *Sunless* 6 | Finale Broadway | 0.995 | 1 | 0 | 1 | **0** | |
| Kabalevsky 1 | Finale Ash | 0.7 | 1 | 1 | 0 | **0** | |
| Kabalevsky 2 | Finale Jazz | 0.6 | 1 | 1 | 0 | **0** | |
| Kabalevsky 3 | Finale Legacy | 0.6 | 1 | 1 | 0 | **0** | |
| Kabalevsky 4 | Petaluma | 0.8 | 5 | 4 | 1 | **0** | |
| Kabalevsky 6 | Sebastian | 0.93 | 5 | 3 | 2 | **0** | 1 (4/4, right) |
| Kabalevsky 7 | Bravura | 0.5 | 3 | 3 | 0 | **0** | |
| Kabalevsky 8 | Leland | 0.99 | 1 | 0 | 1 | **0** | |
| Kabalevsky 9 | Finale Maestro | 0.7 | 3 | 3 | 0 | **0** | 1 (3/2, right) |
| Kabalevsky 10 | Finale Engraver | 0.6 | 1 | 1 | 0 | **0** | |
| Gurilyov | Finale Broadway | 0.5 | 1 | 1 | 0 | **0** | |
| Grechaninov | Finale Ash | 0.7 | 0 of 2 (no staff found) | 0 | 2 | **0** | |
| Varlamov | Finale Jazz | 0.7 | 1 | 1 | 0 | **0** | |
| **Total** | | | **30 of 32** | **24** | **8** | **0** | **2** |

The centring tolerance chosen was 0.4 of a space in 15 folds, 0.2 for Kabalevsky 8, and 0.15 for Gurilyov.

**The 32 places, one row each:**

| Place | Printed | Read |
|---|---|---|
| Tchaikovsky, bar 1 | 3/8 | 3/8 |
| *Sunless* 1, bar 1 | 6/4 | nothing |
| *Sunless* 4, bars 1, 22, 23 | C, 2/4, C | C, 2/4, C |
| *Sunless* 5, bar 1 | C | C |
| *Sunless* 6, bar 1 | C | nothing |
| Kabalevsky 1, 2, 3, bar 1 | 3/4, 2/4, 4/8 | 3/4, 2/4, 4/8 |
| Kabalevsky 4, bars 1, 14, 16, 35, 36 | 4/4, 3/4, 4/4, 2/4, 4/4 | 4/4, 3/4, 4/4, nothing, 4/4 |
| Kabalevsky 6, bars 1, 20, 21, 22, 23 | 4/4, 2/4, 4/4, 2/4, 4/4 | 4/4, 2/4, nothing, 2/4, nothing |
| Kabalevsky 7, bars 1, 47, 48 | 6/8, 9/8, 6/8 | 6/8, 9/8, 6/8 |
| Kabalevsky 8, bar 1 | 4/4 | nothing |
| Kabalevsky 9, bars 1, 30, 31 | 4/4, 3/2, 4/4 | 4/4, 3/2, 4/4 |
| Kabalevsky 10, bar 1 | 3/4 | 3/4 |
| Gurilyov, bar 1 | C | C |
| Grechaninov, bars 1, 10 | 2/4, 6/8 | not read: no staff found |
| Varlamov, bar 1 | 3/8 | 3/8 |

- **Every other bar start** (782 windows with nothing printed): **nothing stated.**
- **False single figures**: 1 mark read as a figure above its fold's cut at a bar start with nothing printed. It formed no signature.
- **Expectation**: of the 24 metres stated, 0 are uncommon (upper outside 2, 3, 4, 6, 8, 9, 12, 16 or lower outside 2, 4, 8, 16).
- **Why the misses**: the cuts. The three folds with cuts of 0.97 to 0.995 (*Sunless* 1, *Sunless* 6, Kabalevsky 8) read nothing; their cuts were forced up by false reads on their tuning renders, not by their tuning songs, which gave 0 false at every cut in every fold.

**Rendered, held-out font, fresh seeds (300 staves a fold, 5,100 in all; 3,035 carry a signature):**

| Held-out font (folds) | Found | Missed | **False** |
|---|---|---|---|
| Bravura (0, 10) | 331 | 16 | **1** |
| Leland (1, 11) | 176 | 198 | **0** |
| Finale Maestro (2, 12) | 359 | 21 | **1** |
| Finale Engraver (3, 13) | 339 | 34 | **0** |
| Finale Broadway (4, 14) | 112 | 224 | **14** |
| Finale Ash (5, 15) | 127 | 215 | **17** |
| Finale Jazz (6, 16) | 212 | 151 | **7** |
| Finale Legacy (7) | 166 | 7 | **3** |
| Petaluma (8) | 12 | 155 | **0** |
| Sebastian (9) | 171 | 9 | **0** |
| **Total** | **2,005** | **1,030** | **43** |

The false signatures, by kind (from each fold's list; examples quoted):

- **A two-digit upper figure read with a figure lost**, mostly Finale Ash's thin 1: 13/4 read 3/4, 14/8 read 4/8, 12/2 read 2/2.
- **A figure read as another**: Finale Jazz's 7 read as 1 (7/4 read 1/4, twice), 3/2 read 5/2, 9/4 read 7/4, 3/4 read 9/4.
- **A stray 1 added**: 3/4 read 13/4, 8/4 read 11/4.
- **C and cut C swapped**: Finale Legacy, Finale Ash, Bravura.
- **A lower figure misread**: Finale Broadway's 8 read as 2, 10 times in fold 14 (6/8 read 6/2, 2/8 read 2/2, 8/4 read 2/4); Finale Legacy's 4 read as 1 (9/4 read 9/1, 5/4 read 5/1).
- 14 of the 43 come from fold 14 (Gurilyov, Finale Broadway held out), whose tuning chose the loosest pair, tolerance 0.15 and cut 0.5.

### Configuration 2 (witnesses 1 to 5)

**NOT MEASURED.** The count of proposals witness 5 rejected, how many of those were right, and how often beaming agreed: all NOT ESTABLISHED. On the rendered bar, configuration 2 has configuration 1's 43 false signatures by the brief's own rule.

## 4. What was built, or why not

Nothing in `apps/` was changed. r4 section 4: *"Otherwise: stop and report. Nothing wired."* The rendered count fails the "0 false signatures anywhere" condition; the songs' count meets both of its other halves (0 false, 24 of 32 at least 16).

Not done, because of the stop: the join's change, witness 5, the drop-box runs before and after, the scorer's metre field, the "does not add up" count, the two Markup pictures, the five tests, the gates, and where the model would live under `/omr/models/`.

## Could not establish

NOT ESTABLISHED beats a complete invented answer.

- **Configuration 2.** No reading by the current build (homr-web 0.2.0-ilya.6) of the 17 songs is on disk: the kept files are older (`measure-checks_r1_2026-10-05/joined/` holds five songs from 2026-10-05). Measuring it needs a drop-box read of each song on the dev server, with per-page output kept so a signature's page place can be matched to homr's note places (`placeOf`, `join-pages.ts`). It was not done because it cannot change this round's outcome. Its rejection count, the right rejections among them, and beaming's agreement are NOT ESTABLISHED.
- **Whether a reader can meet 0 false signatures on held-out renders of Finale Ash, Jazz, and Broadway** while keeping its recall on these editions. With those fonts held out, Ash's thin 1, Jazz's 7, and Broadway's 8 are never seen in training. NOT ESTABLISHED either way.
- **How the 43 rendered false signatures would fall with the fonts in training** (the case of an edition set in one of them) was not measured.
- **Barlines my finder missed.** All 30 printed places fell in a window, checked by eye. How many of the songs' other barlines it missed, and so how many bar starts went unread, was not counted.
- **Kabalevsky 4's courtesy 4/4** at the end of page 3's second system (seen in a strip) falls outside the window after the last barline, so it was neither read nor counted. Other courtesies outside windows: NOT ESTABLISHED.
- **Labels are by my eye** on crops at 12 pixels a space. A missed printed signature among the 782 windows labelled "nothing printed" would make a right read count as false, not the other way. None was read there.
- **The edition figure positions** came from a model reading the labelled windows, then checked by eye; a position off by a fraction of a space was not measured.
- **The deskew, the 300 dpi raster, and my staff finder are not the app's path.** The app rasterizes with pdf.js and has its own staff finding. Any wiring would need the same windows on the app's page images, and that agreement is NOT ESTABLISHED.
- **Petaluma's and Sebastian's licences** were taken as given in report r1, as the brief says.
- `heldout2` was never opened. A, B, C, E, and F were not opened or run.

## Files

| Path | What |
|---|---|
| `docs/sessions/report-code-the-metre-seen-and-summed_r3_2026-10-10.md` | this report |
| `docs/sessions/measure-metre-r57-r4_2026-10-10/` (new, untracked) | the harness's code, the window list, the labels, the located figures, the per-fold final results (`folds/final*.json`), and the run log |
| `docs/memory/QUEUE.md`, row 57 only | status |

The scratchpad holds the page images, the render pool (2.4 GB), the crop sets, the 17 fold models, and every probability file. It is not kept between sessions.
