# Report: the printed metre, round 5: a reader that abstains on a shape it does not know (QUEUE row 57)

Code (Opus), 2026-10-11, on the Mac, branch `Shane`, HEAD `a7161ce`. The working tree held the desk's uncommitted changes to `docs/memory/` and `docs/sessions/LOG.md` and its new files; none was touched except row 57 of `QUEUE.md`. Brief: `brief-code-the-metre-seen-and-summed_r5_2026-10-10.md`. Dann's go of 2026-10-11 set the time at 4 to 5 hours, counted a font's own licence field naming the SIL Open Font License as its licence, and kept Sebastian in training and in the rendered test on smufl.org's statement that it is SIL OFL. No git command that writes was run. Nothing whose name begins `heldout2` was opened, read, listed, or run. Songs A, B, C, E, and F were not opened or run.

## The answer first: STOPPED, nothing wired

- **The songs meet the bar.** Every one of the 12 variants states **0 false signatures** at the 814 bar starts and the 32 printed places on the 17 songs, held out song by song.
- **The written choice is A9 with the checks and witness 5.** It reads **21 of 32** printed signatures on the songs. On the fresh renders of the held-out fonts, configuration 2 (SIMULATED) states **0 false in 5,100**.
- **The renders fail the bar's second clause.** The choice's configuration 1 (A9 with the checks, no witness 5) states **20 false signatures in 5,100 fresh renders, 8 of them in Finale Jazz**. The bar needs configuration 1 at or under 10, with no font above 3 (section 3).
- **No variant would have passed.** The best configuration 1 on the fresh seeds is A and B with the checks: 10 false, but 4 of them in Finale Legacy.
- So section 5's last case applies: stop and report, nothing wired. `apps/` is as at HEAD.

## 1. The written choice

Written in `measure-metre-r57-r5_2026-10-10/choice-rule.md` (00:36) before any total existed, and applied in `choice.md` (03:38) before the fresh seeds were drawn.

- **The rule.** A variant was eligible if it stated 0 false signatures on the earlier render seeds (round 4's seeds 9000 + *f*, the held-out music font), summed over the 17 folds. Among eligible variants, the one with the most right on the tuning songs won.
- **Three were eligible:** A9 with checks and witness 5, AB18 with witness 5, and AB18 with checks and witness 5. The choice was **A9 with checks and witness 5**, with 98 right on the tuning songs.
- **What the rule left out.** It did not test the bar's second clause, configuration 1 at or under 10 false with no font above 3. On the earlier seeds the choice's configuration 1 had 19 false. I kept the rule as written, because section 4 counts only the written choice. On the fresh seeds no variant meets that clause, so the outcome does not depend on it.
- **Seen before the rule was written:** fold 0's earlier-seed counts while testing the evaluator (0 false in all 12 variants), and witness 5's power on real pages. No held-out song's result was seen before `choice.md`.

**Earlier seeds and tuning, summed over the 17 folds** (`choice.md`):

| Variant | Tuning songs right | Tuning renders found | Earlier seeds found (of 5,100) | Earlier seeds false |
|---|---|---|---|---|
| A1 | 117 | 2,611 | 2,001 | 32 |
| A1 + witness 5 | 109 | 2,161 | 1,847 | 4 |
| A1 + checks | 117 | 2,561 | 1,947 | 24 |
| A1 + checks + witness 5 | 109 | 2,105 | 1,763 | 3 |
| A9 | 123 | 2,481 | 2,044 | 21 |
| A9 + witness 5 | 98 | 1,927 | 1,571 | 1 |
| A9 + checks | 123 | 2,427 | 1,980 | 19 |
| **A9 + checks + witness 5 (chosen)** | **98** | **1,879** | **1,507** | **0** |
| AB18 | 120 | 2,336 | 1,905 | 11 |
| AB18 + witness 5 | 92 | 1,806 | 1,444 | 0 |
| AB18 + checks | 120 | 2,285 | 1,820 | 6 |
| AB18 + checks + witness 5 | 92 | 1,760 | 1,376 | 0 |

## 2. Every variant on the fresh seeds, by configuration

### The songs (17 songs, 814 bar starts, 32 printed places; Grechaninov's 2 are out of reach)

| Variant | Configuration | Right of 32 | Missed | **False** | Courtesies set aside |
|---|---|---|---|---|---|
| A1 | 1 | 25 | 5 | **0** | 1 |
| A1 + checks | 1 | 25 | 5 | **0** | 1 |
| A9 | 1 | 28 | 2 | **0** | 2 |
| A9 + checks | 1 | 28 | 2 | **0** | 2 |
| AB18 | 1 | 28 | 2 | **0** | 2 |
| AB18 + checks | 1 | 27 | 3 | **0** | 2 |
| A1 + witness 5 | 2 | 25 | 5 | **0** | 2 |
| A1 + checks + witness 5 | 2 | 25 | 5 | **0** | 2 |
| A9 + witness 5 | 2 | 21 | 9 | **0** | 2 |
| **A9 + checks + witness 5 (chosen)** | 2 | **21** | 9 | **0** | 2 |
| AB18 + witness 5 | 2 | 21 | 9 | **0** | 2 |
| AB18 + checks + witness 5 | 2 | 19 | 11 | **0** | 2 |

"Missed" counts the 30 readable places. Grechaninov's 2 add to the 32 in every row.

**The chosen variant, place by place** (configuration 1, then configuration 2):

| Place | Printed | A9 + checks | + witness 5 |
|---|---|---|---|
| Tchaikovsky 1 | 3/8 | 3/8 | 3/8 |
| *Sunless* 1, bar 1 | 6/4 | 6/4 | rejected |
| *Sunless* 4, bars 1, 22, 23 | C, 2/4, C | C, nothing, C | rejected, nothing, C |
| *Sunless* 5, bar 1 | C | C | rejected |
| *Sunless* 6, bar 1 | C | C | C |
| Kabalevsky 1, bar 1 | 3/4 | 3/4 | rejected |
| Kabalevsky 2 and 3, bar 1 | 2/4, 4/8 | 2/4, 4/8 | 2/4, 4/8 |
| Kabalevsky 4, bars 1, 14, 16, 35, 36 | 4/4, 3/4, 4/4, 2/4, 4/4 | all five right | all five right |
| Kabalevsky 6, bars 1, 20, 21, 22, 23 | 4/4, 2/4, 4/4, 2/4, 4/4 | 4/4, nothing, 4/4, 2/4, 4/4 | rejected, nothing, 4/4, 2/4, 4/4 |
| Kabalevsky 7, bars 1, 47, 48 | 6/8, 9/8, 6/8 | 6/8, 9/8, 6/8 | rejected, 9/8, 6/8 |
| Kabalevsky 8, 9, 10 | 4/4; 4/4, 3/2, 4/4; 3/4 | all right | all right |
| Gurilyov, bar 1 | C | C | rejected |
| Varlamov, bar 1 | 3/8 | 3/8 | 3/8 |

- **Witness 5 on the songs, measured** (configuration 2 of the chosen variant): it rejected **9 proposals**. **7 were right on the page:** bar 1 of *Sunless* 1, 4, and 5, Kabalevsky 1, 6, and 7, and Gurilyov. The other 2 were the courtesies, set aside anyway. It rejected no wrong proposal, because there was none to reject. Each of the 7 fails because homr's reading has at least one bar of another length among the bars that signature governs; *Sunless* 5, for example, has 3 such bars of 61 countable.
- **Beaming's agreement: NOT ESTABLISHED.** homr writes no beam elements (0 in each reading checked), so the readings hold no beaming to measure.
- **False single figures** (network A's base reading, a mark read above the fold's cut at a bar start with nothing printed): **2**, one each in Kabalevsky 7 and 9. Neither formed a signature.

### The renders (fresh seeds 29000 + *f*, 300 a fold of its held-out music font, 5,100 in all; 3,079 carry a signature)

Configuration 2 on renders is **SIMULATED** (section 2.3): the bars after each rendered staff are drawn from the fold's tuning songs, one window a staff.

| Variant | Configuration | Found | Missed | **False** | False by font |
|---|---|---|---|---|---|
| A1 | 1 | 1,964 | 1,076 | **39** | Ash 16, Legacy 9, Jazz 4, Bravura 3, Maestro 3, Broadway 2, Sebastian 2 |
| A1 + checks | 1 | 1,919 | 1,126 | **34** | Ash 14, Legacy 7, Jazz 4, Bravura 3, Maestro 3, Leland 1, Broadway 1, Sebastian 1 |
| A9 | 1 | 2,036 | 1,024 | **19** | Jazz 6, Ash 4, Legacy 4, Broadway 3, Maestro 1, Sebastian 1 |
| **A9 + checks (the choice's configuration 1)** | 1 | **1,975** | 1,084 | **20** | **Jazz 8**, Ash 4, Legacy 4, Broadway 2, Maestro 1, Sebastian 1 |
| AB18 | 1 | 1,941 | 1,125 | **13** | Legacy 4, Broadway 3, Jazz 3, Ash 2, Sebastian 1 |
| AB18 + checks | 1 | 1,869 | 1,200 | **10** | Legacy 4, Ash 2, Jazz 2, Broadway 1, Sebastian 1 |
| A1 + witness 5 | 2, SIMULATED | 1,793 | 1,286 | **0** | |
| A1 + checks + witness 5 | 2, SIMULATED | 1,717 | 1,362 | **0** | |
| A9 + witness 5 | 2, SIMULATED | 1,568 | 1,511 | **0** | |
| **A9 + checks + witness 5 (chosen)** | 2, SIMULATED | **1,504** | 1,575 | **0** | |
| AB18 + witness 5 | 2, SIMULATED | 1,449 | 1,630 | **0** | |
| AB18 + checks + witness 5 | 2, SIMULATED | 1,392 | 1,687 | **0** | |

**The original ten fonts** are the whole rendered test. No other music font with a licence source is on the Mac, so the table below is the choice's two configurations, font by font:

| Font | Config. 1: found | missed | **false** | Config. 2 (SIMULATED): found | missed | **false** |
|---|---|---|---|---|---|---|
| Bravura | 274 | 88 | **0** | 228 | 134 | **0** |
| Leland | 271 | 87 | **0** | 252 | 106 | **0** |
| Finale Maestro | 293 | 70 | **1** | 145 | 219 | **0** |
| Finale Engraver | 313 | 57 | **0** | 204 | 166 | **0** |
| Finale Broadway | 162 | 185 | **2** | 159 | 190 | **0** |
| Finale Ash | 151 | 208 | **4** | 128 | 235 | **0** |
| Finale Jazz | 202 | 163 | **8** | 159 | 214 | **0** |
| Finale Legacy | 151 | 30 | **4** | 103 | 82 | **0** |
| Petaluma | 15 | 169 | **0** | 18 | 166 | **0** |
| Sebastian | 143 | 27 | **1** | 108 | 63 | **0** |

**The choice's 20 false signatures under configuration 1, by kind:**

- **Finale Jazz's 7 read as 9:** 7/4 read 9/4 four times, 7/8 read 9/8 twice, 7/2 read 9/2. Also 5/1 read 5/4.
- **Finale Legacy's 4 read as 1:** 2/4 read 2/1 twice, 3/4 read 3/1, 5/4 read 5/1.
- **Finale Ash:** 11/2 read 1/2 twice, 1/2 read 1/1, 5/4 read 3/4.
- **Finale Broadway's 8 read as 2:** 2/8 read 2/2, 8/4 read 2/4.
- **Others:** Finale Maestro 3/8 read 4/8; Sebastian cut C read C.

**Why configuration 2 reaches 0 on renders, and what that number means.** In every fold's tuning songs, homr's countable bars sum to the printed length in 98 to 100 percent of cases (for example, 157 of 158 in fold 0). So the simulation draws almost every governed bar at its true length, and a wrong reading of another length fails at its first countable bar. None of the fresh false reads was a swap of the same length, so none survived. The 0 is SIMULATED, and its strength comes from homr's bar sums, not from the reader.

**Inference cost per window.** A crop at each of 3 seats every 0.2 of a space.
- System start (75 places): A1 takes 225 crops, A9 takes 2,025, and AB18 takes 4,050.
- After a barline (18.6 places on average): A1 takes 56 crops, A9 takes 503, and AB18 takes 1,006.
- The nine readings are cut on the GPU in one batch (`reading5.py`).

## 3. Witness 5's measured power on real pages

At each of the 814 bar starts, each wrong metre from round 4's rendered false list (27 metres, from 1/2 to 9/4, C, and cut C) was proposed in place of the metre in force. The bars from that bar start to the next printed signature were summed under the bar rule (`w5power.py`).

| Proposal | Rejected by the bars | Rejected: no countable bar | **Accepted** |
|---|---|---|---|
| Another length than the metre in force (15,494) | 15,392 | 100 | **2** |
| The same length (834) | 153 | | **681** |

- **The 2 wrong proposals accepted** are 7/4 and 14/8 at one *Sunless* 1 bar start whose span has one countable bar, misread by homr at that length.
- **Same-length proposals pass by construction** (section 2.3). The 153 rejected among them fall on bars homr misread.
- **188 of the 814 bar starts map to no bar of homr's**: 144 after a system's last barline, 38 where homr placed no voice note, and 6 system starts. A proposal there has no countable bar and is not stated. All 30 printed places mapped.

## 4. The fonts added, and their licences

Every font file under `/Library/Fonts`, `~/Library/Fonts`, the Homebrew casks, and `apps/web/static/fonts` was read (174 files; `fonts.py`, list in `fontlist.json`).

- **Licence files, read in full:** `apps/web/static/fonts/bravura/OFL.txt`, `leland/LICENSE.txt`, `finale-maestro/OFL.txt` (Reserved Font Names Finale, Maestro, Broadway, Engraver, Jazz, Ash, and Legacy), and `lato-OFL.txt`.
- **Licence fields:** each file's own `name` table entries 13 and 14, by Dann's go.
- **Music fonts (training and the rendered test), the same ten as round 4:**
  - Bravura, Leland: their licence files.
  - Finale Maestro, Engraver, Broadway, Ash, Jazz, and Legacy: the Finale licence file.
  - Petaluma: its own licence field.
  - Sebastian: smufl.org's statement that it is SIL OFL (Dann, 2026-10-11). Its own licence field does not name the SIL licence.
- **Text faces (digits only, training only), the heaviest upright face of each family, lining figures:**

| Face | Licence source |
|---|---|
| Academico Bold, Charis SIL Bold, Crimson Bold, Crimson Text Bold, Domine Bold, Doulos SIL, Gentium Plus Bold, Golden Age Regular, Libre Baskerville Bold, Libre Bodoni Bold, Montserrat Black, Nepomuk Bold, Noto Sans JP Black, Petaluma Script, Sebastian Text | the face's own licence field |
| Lato Black | `apps/web/static/fonts/lato-OFL.txt`, and its own licence field |

- **Licensed but left out:** Bravura Text, Leland Text, and Petaluma Text carry no ordinary digits (their figures are the music fonts' own). 76 files in all, among them Finale's text faces and Finale Lyrics, have no licence file and no licence field naming the SIL licence.
- **How the digits were drawn.** Pillow on this Mac has no text-shaping library, so each digit was drawn by glyph name with fontTools and FreeType. The glyph comes from the font's `lnum` feature where it names one. Every face's digits were checked by eye as lining (`textdigits.png`).
- **How the folds hold out fonts.** No music font beyond the original ten was found. So fold *f* holds out music font *f* mod 10 from training and tests on it, as round 4 did. It also holds out text face *f* mod 16 from training. Text faces are never in the test, per the brief.
- **Share in training.** 35 percent of rendered signatures use a text face: 660,195 of the pool's 1,854,135 crops.

## 5. What was built and how

- **Pool:** 200,000 rendered staves, each cut for both networks at the same places; 1,854,135 crops, 533,064 of them figures; built in 120 seconds.
- **Networks:**
  - A is round 4's, a 32 by 32 crop at 10 pixels a space; 171,901 parameters, 689,048 bytes as ONNX.
  - B takes a 40 by 40 crop at 12 pixels a space, which is finer detail over about the same 3.3 spaces; 175,549 parameters, 703,640 bytes as ONNX.
  - Together they are 1,392,688 bytes, under 1.5 MB. Both train for 3 epochs in each fold on the same 600,000 render crops plus the 12 training songs' crops.
- **Readings:** grid offsets of −0.1, 0, and +0.1 of a space, at scales 0.95, 1, and 1.05, so nine readings a network. The GPU cut matches the training cut to within 1.5 percent of ink. A signature is stated only when every reading names it.
- **The checks, each tuned inside the fold** (`checks5.py`):
  - **Unfamiliar shape:** a mark's distance from the training crops of its class, against the 0.99, 0.999, or 1.0 quantile of the tuning set's right marks.
  - **Uncovered ink:** ink running on from the stated marks in one seat and not the other, threshold 0.15, 0.3, or 0.6.
  - **C against cut C:** ink just above and below the staff through the sign's middle, cut between the tuning set's C and cut C.
- **Witness 5** (`w5.py`, `w5map.py`), section 2.3's rule:
  - **The songs:** homr's joined reading through the app's own pipeline. `dropread.mjs` runs `rasterizePdf`, `makeReader` with the app's path choice and `createRecognizer`, and `joinLookingAtPages` on the dev server. Its only addition is a wrapper that keeps each page's answer.
  - **The reads:** 16 songs at 0.47 to 2.16 minutes each, 18 minutes in all, all on WebGPU, stamped `homr-web@0.2.0-ilya.6/465`.
  - **Matching:** a window's bars are found through homr's note places, after undoing my deskew and scaling 300 to 400 dpi.
  - **The renders:** SIMULATED from the 4 tuning songs' bar sums, their share of bars the bar rule leaves out (4.8 to 14.3 percent), and their governed-bar counts.
- **Tuning inside each fold.** For each variant, centring tolerance (0.4, 0.3, or 0.2), and check setting, the lowest cut with 0 false on the 4 tuning songs and 300 tuning renders; then the setting with most right there.
- **Time:**
  - Pool: 2 minutes.
  - Training and readings: 17 folds, 6 hours of process time in two parallel processes, 3 hours 21 minutes on the clock.
  - Evaluation: about 3 minutes.
  - Fresh draw: about 40 minutes.
  - Drop-box reads: 18 minutes, run during training.
  - The round ran from 00:05 to about 04:15, inside the 4 to 5 hours approved.

### Changes made after looking at a result

- **Checks kept active.** After fold 0's first tuning run picked "check off" inside the checks variants, I removed the "off" settings so those variants keep every check active. This was before any total existed.
- **A second training process** was started at fold 3 to use the GPU better. It changes no result.
- **A count of my own corrected:** my first count of false single figures missed marks in unsure candidates; the 2 reported come from the peaks directly.

## Could not establish

NOT ESTABLISHED beats a complete invented answer.

- **Whether any decode-time variant can bring configuration 1 to 10 or under with no font above 3 on fresh renders.** None did: the closest was AB18 with checks, at 10 false with Finale Legacy at 4. With Finale Jazz and Legacy held out, Jazz's 7 and Legacy's 4 are never seen, and both read confidently as other figures.
- **Configuration 2 on renders is SIMULATED.** Its 0 rests on homr's bar sums being right in 98 to 100 percent of countable tuning-song bars, drawn independently bar by bar. Real misreads cluster, and a misread bar may happen to sum to a wrong metre. How the simulation compares with real pages set in these fonts is NOT ESTABLISHED.
- **Witness 5's tuplet checks.** The bars summed are the join's, whose tuplet checks ran under homr's own metre, not again under each proposal as r2's order asks. homr's metre differs from the printed one at some places (row 37's table: *Sunless* 4 bar 22, Kabalevsky 4 bars 14 and 35, Kabalevsky 6 bars 20 and 22, and Grechaninov bar 10, among others). How re-running the checks under each proposal would change witness 5's verdicts, on the songs or in the power test, is NOT ESTABLISHED.
- **Beaming's agreement:** NOT ESTABLISHED. homr writes no beams.
- **The 38 bars after a mid-system barline that map to no homr bar.** Whether my barline was a stem, or homr's voice notes have no place there, was not traced.
- **Labels, windows, and the page path** are round 4's, with its stated limits: labels by my eye; my staff finder, deskew, and 300 dpi raster, not the app's. Wiring would need the windows found on the app's page images.
- `heldout2` was never opened. A, B, C, E, and F were not opened or run. Grechaninov was not worked on.

## Files

| Path | What |
|---|---|
| `docs/sessions/report-code-the-metre-seen-and-summed_r4_2026-10-10.md` | this report |
| `docs/sessions/measure-metre-r57-r5_2026-10-10/` (new, untracked, 1.1 MB) | the harness code, `dropread.mjs`, `choice-rule.md`, `choice.md`, the font list and digit sheet, the labels and windows, every fold's meta, evaluation, and fresh results, witness 5's power, the summaries, and the read and training logs |
| `~/Downloads/_code-metre-r5/` (outside the tree) | page images, the render pool (4.5 GB), crop sets, the 34 fold models, the probability files, the homr readings, and both ONNX files |
| `docs/memory/QUEUE.md`, row 57 only | status |
