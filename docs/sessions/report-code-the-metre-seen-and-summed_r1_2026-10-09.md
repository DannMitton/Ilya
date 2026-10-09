# Report: the printed metre, seen and summed (QUEUE row 57)

Code (Opus), 2026-10-09, on the Mac, branch `Shane`, HEAD `53035bd` (row 56 shipped); the working tree held the desk's uncommitted changes to `docs/memory/` and five new briefs, none touched. Brief: `brief-code-the-metre-seen-and-summed_r2_2026-10-09.md`. Dann's prompt: *"Measure the figure reader before you wire anything, and stop and report if it gives a figure the page does not print."*

## The answer first: STOPPED at section 3, nothing wired

The figure reader was built and measured. **It gives figures the page does not print** on the rendered set, at every setting tried, from the loosest to the strictest. At the strictest setting there are 8 such answers among about 22,500 rendered single figures, pairs, and signs, each font held out:

- 12/16 read as 1/16, once;
- small (three-quarter size) figures, seven times: 9 read as 0 three times, 6 read as C twice, 6 read as 0 once, and 0 read as 9 once.

On the 17 opened and build songs' real pages, the reader read every voice staff end to end. At the setting the app would use (margins 1.5 and 1.5) it gave **3 signatures, all right, and nothing anywhere else**. Looser margins read heavy barlines as 1/1. **Recall on the 32 printed signatures is 3**, far under half. The cause is in section 3.5.

Per the prompt, section 4 was not built. The seen-and-summed rule, the join change, the drop-box runs, the five unseen songs, the two pictures, and the gates for a wired build were not done.

What stays in the tree: one new file, `apps/web/src/lib/omr/time-signature.ts`, imported by nothing. It is the reader measured here. No template file ships. The join is byte for byte as at HEAD: a join change I had begun was restored from `git show HEAD:` (a read), and the summing module I had begun is set aside in the scratchpad. Type check: 0 errors (12 warnings, as before). `src/lib/omr` tests: 113 passed, as at HEAD. The eight gates were not run, because nothing the app runs has changed.

## 2. The desk's inference, checked against the code (section 2)

Every line of it is confirmed, read in `53035bd`. There is one more cause the desk did not list.

- **Templates.** The tuplet reader's templates hold no time-signature glyph. CONFIRMED: `tuplet-digits.ts` `loadTemplates` loads `tuplet-digit-templates.json`, whose figures are `tuplet0` to `tuplet9` (row 56's report, section 1).
- **Inner lines.** It refuses marks between the staff's inner lines. CONFIRMED: `tuplet-number.ts:320`, "Not between the staff's inner lines (from its second line to its fourth)".
- **Stroke cut.** It takes out thin long strokes first. CONFIRMED: `tuplet-number.ts:150`, before "Connected marks" at `:207`.
- **Stack rule.** It refuses a numeral with another directly above or below. CONFIRMED: `tuplet-number.ts:516`.
- **ADDED: numeral height.** A numeral must be at most 2.0 staff spaces tall (`tuplet-number.ts`, the `numeral` filter after `:247`). A time-signature figure fills half the staff, two spaces, and often more on these scans (2.0 to 2.5 measured), so many figures were never candidates.

## 3. The figure reader and its measurements

### 3.1 What it is

`apps/web/src/lib/omr/time-signature.ts` (new, 433 lines, imported by nothing). It uses row 56's feature code (`featuresOf`, `distance` from `tuplet-digits.ts`) and none of its templates.

- **The staff, from the image** (`findStaff`, `:41`): five rows of ink across at least 60 percent of a stretch, evenly spaced, the nearest to a height.
  - On a page it is followed across the whole width in stretches of 12 spaces, 8 apart (`readAlongStaff`, `:373`).
  - The voice staff's height comes from homr's notes on each of homr's systems (`systemsOf`, `:401`, which uses `<print new-system>`).
  - It does not depend on homr's note positions to reach bar 1. Those positions are wrong for some whole rests: Kabalevsky 4, bar 1, places the rest at x 2579 where it is printed near 1340.
  - The staff was found on 199 of 215 systems. The 16 misses are 15 systems in Grechaninov, a grey scan where row 37 found Ilya's staff finder fails too, and 1 in Gurilyov.
- **Line removal** (`staffMarks`, `:95`).
  - In each column, a run of ink over a line no taller than the line is the line, and is taken out.
  - For pairs, the middle line is taken out whole (`:122`), because the upper and lower figures meet on it.
  - Parts of one mark that removal parts again are rejoined, and line ink inside a mark's own gap of under a third of a space is put back (`:197`). Without this the 2's curve, which rests on the top line, came apart.
- **Seats** (`seatOf`, `:222`). An upper figure is centred on the second line, a lower one on the fourth, each 1.4 to 2.7 spaces tall. C and cut C are 1.5 to 4.8 spaces tall, on the middle line.
- **Reading** (`readMark`, `:255`): nearest known mark. It answers only where:
  - the nearest is within 0.6;
  - the nearest other figure is more than `MIN_MARGIN` times farther;
  - the nearest non-figure is more than `OTHER_MARGIN` times farther.
- **Pairs** (`readSignatures`, `:303`):
  - the lower word stands centred under the upper (`:341`);
  - no other mark stands in its half right beside it (`:326`); without this, a 12 whose 2 was not seated read as 1;
  - two narrow strokes are a barline, not 1/1 (`:348`);
  - a mark read as 1 must be twice as tall as wide (`:282`);
  - both words must read, and the lower must be 1, 2, 4, 8, 16, or 32.
- **Bar** (`barAt`, `:426`): the bar whose first note follows the signature, where the bar before ends before it. A signature after a system's last note (a courtesy) is given no bar.
- **Thresholds**: every number above is JUDGEMENT, set on these examples.

### 3.2 Templates

All templates were rendered on a five-line staff and taken through the same line removal.

- **Fonts**: the ten fonts the brief names, each from `/Library/Fonts`: Bravura, Leland, Finale Maestro, Finale Engraver, Finale Broadway, Finale Ash, Finale Jazz, Finale Legacy, Petaluma, and Sebastian. Codepoints were read from SMuFL's `glyphnames.json` (Dorico 5's copy): `timeSig0` to `timeSig9` U+E080 to U+E089, `timeSigCommon` U+E08A, `timeSigCutCommon` U+E08B.
- **Licences read**:
  - `apps/web/static/fonts/finale-maestro/OFL.txt` names Finale, Maestro, Broadway, Engraver, Jazz, Ash, and Legacy under the SIL OFL 1.1.
  - Bravura's `OFL.txt` and Leland's `LICENSE.txt` say SIL OFL 1.1.
  - Petaluma and Sebastian were not checked here: the brief's statement (SIL OFL by smufl.org) is taken as given.
- **Sizes**: three staff spaces (22, 28, and 34 px).
- **Figure sizes**: as the font draws them, and at 85 and 75 percent. Old editions print figures about three quarters of a half staff; one of the causes in 3.5.
- **Degradations**: clean, blurred, skewed 1.5°, threshold noise, thinner, thicker, and bold (ink spread by a tenth of a space). A staff line runs through every figure, since every figure is drawn on its staff.
- **Non-figures from the same fonts**:
  - G, F, and C clefs;
  - sharps, flats, and naturals at every line and space;
  - three-sharp and three-flat key signatures;
  - whole to sixteenth rests;
  - black, half, and whole noteheads, and noteheads with stems;
  - single, heavy, final, and double barlines, repeat barlines, and repeat dots.
- **Non-figures from opened scans**: 2,051 seated marks. Left out were those near a printed signature or a courtesy place, and those stacked under or over another seated mark (any could be a figure). Each song is read with its own scan marks left out.
- **Shipped byte count**: none shipped. Measured with 40,525 template marks. Nothing was wired, so no template file was written to the app.

### 3.3 Rendered: found, missed, false, each font held out

Pairs are read as the app would read them (`readSignatures` over the whole image), single figures by `readMark`.

| Kind and size | Margins 1.5 / 1.5 (found / missed / **false**) | Margins 2 / 2 |
|---|---|---|
| single figures, font size | 2202 / 1971 / **9** | 1646 / 2536 / **0** |
| single figures, 85 % | 2524 / 1668 / **8** | 1986 / 2214 / **0** |
| single figures, 75 % | 2488 / 1699 / **13** | 1896 / 2297 / **7** |
| pairs, font size | 959 / 1844 / **12** | 664 / 2150 / **1** |
| pairs, 85 % | 1203 / 1677 / **1** | 919 / 1962 / **0** |
| pairs, 75 % | 1116 / 1802 / **8** | 861 / 2065 / **0** |
| C and cut C, all sizes | 657 / 600 / **0** | 538 / 719 / **0** |
| non-figures (12,542 at 2 / 2) | **0** read as a signature | **0** |

By figure, at font size, margins 2 / 2 (found / missed / false):

- **Single figures**: 0 132/288/0; 1 193/227/0; 2 147/267/0; 3 148/272/0; 4 212/196/0; 5 159/261/0; 6 137/283/0; 7 188/232/0; 8 215/205/0; 9 115/305/0.
- **Pairs**: 2/4 57/145/0; 3/4 35/168/0; 4/4 99/105/0; 5/4 76/128/0; 6/4 40/163/0; 3/8 51/159/0; 6/8 26/183/0; 7/8 85/125/0; 9/8 21/189/0; 12/8 5/160/0; 2/2 53/154/0; 3/2 35/172/0; **12/16 6/164/1 (read 1/16)**; 5/8 75/135/0.
- **Signs**: C 36/174/0; cut C 88/119/0.

At 1.5 / 1.5 the false answers at font size are 3 read as 9 (3/4 to 9/4 twice, 3/8 to 9/8 three times), 3 and 6 swapped, 8 read as 5, and 6/4 and 6/8 read as 62/4 and 62/8. The strictest setting tried (nearest within 0.3, margins 2 and 2) still gives 8 false answers.

### 3.4 Printed: the 32 signatures in the 17 songs, and every other bar start

Row 37's table is completed here from the page crops, where it said "not looked":

- Kabalevsky 3, bar 1: **4/8**;
- Kabalevsky 4, bars 1, 16, and 36: **4/4**;
- Kabalevsky 6, bars 1, 21, and 23: **4/4**;
- Kabalevsky 9, bar 31: **4/4**;
- *Sunless* 4, bars 1 and 23, *Sunless* 5, and *Sunless* 6: **C**;
- Gurilyov: **C**.

The printed signatures are 27 pairs and 5 Cs.

Reading the whole voice staff of every page, margins 1.5 / 1.5:

| Song, bar | Printed | Read |
|---|---|---|
| Tchaikovsky 1 | 3/8 | **3/8, right** |
| *Sunless* 1, 1 | 6/4 | **6/4, right** |
| Varlamov 1 | 3/8 | **3/8, right** |
| the other 29 (24 pairs, 5 Cs) | as above | nothing |

Every other bar start, and every other place on all 199 staves found: **nothing read**.

At margins 2 / 2 nothing is read at all. At looser margins, false answers appear on the page:

- **1.5 / 1.0**: a heavy barline read as 1/1 in *Sunless* 6, page 6.
- **1.3 / 1.2**: a 1/1 in *Sunless* 5, page 5. Kabalevsky 4's 3/4 at bar 14 is also read right.

The 46 figures that sat in their seats as pairs at 23 printed signatures, read alone, on the best setting with no false answer: 8 of 46 at 1.5 / 1.5, 1 of 46 at 2 / 2.

**What else at the start of a bar is taken for a figure:**

- at 1.5 / 1.5 and stricter, nothing;
- looser, a heavy barline cut in two at the middle line, read as 1/1, twice.

No clef, key-signature accidental, rest, or flag was taken for a figure on any real page.

### 3.5 Why recall is so low (the cause)

Recall is 3 of 32, far under half. From the measurements, in order of weight:

1. **The printed figures do not look like the fonts' figures, and look more like other marks.** At the 23 signatures where both figures were seated, I compared each figure with every known mark.
   - For most, the nearest known mark is not a figure. It is a flag, a flat, a sharp, a stem, or a clef part, from the fonts or from other songs' scans. I looked at 16 of those nearest scan marks; all are such marks, none a missed figure.
   - These editions print figures about 1.5 spaces tall, not 2. Their 3 has a flat top, and their 4's small counter is filled in.
   - **Distance variants**: features that ignore ink weight (each mark thinned to its centre line and compared by mean distance) did no better, 5 to 8 of 46. Rendering the fonts smaller and heavier helped a little, and added false answers between 3, 6, 8, and 9.
2. **Loops are fragile.**
   - The reader compares only marks with the same number of closed loops.
   - Staff lines cross figures at their loops: the 6's loop sits on a line, and the 4's counter fills in.
   - So a real 4 often has no loop where the fonts' 4s have one. Putting line ink back inside a mark's own gaps fixed some of these, not most.
3. **Seating.** 23 of the 27 printed pairs were seated, as two marks centred one over the other in the two halves of the staff. The other 4 lost a figure:
   - a figure touching a barline or the clef;
   - a figure broken by line removal;
   - Grechaninov, where no staff is found.
4. **C is never read on these pages.**
   - The five printed Cs (*Sunless* 4 bars 1 and 23, *Sunless* 5, *Sunless* 6, and Gurilyov) are seated as signs.
   - Their nearest known marks are non-figures or a 6 or 7 (for example *Sunless* 4, bar 1: "6 0.23, 7 0.29, non-figure 0.33").

The step that would change this, examples of these editions' own figures as templates, is outside the brief, which allows font templates only. That is a decision for the desk and Dann.

## 4. Section 4: not built, and the order question answered from the code

Not built, per the prompt. The order question was asked first, so it is answered from the code as it stands:

- **The tuplet checks read the metre in force.** In `join-pages.ts` `rewriteMeasure`, a bar's attributes set `state.time` before `completeTriplets(children, readMetre(state.time), …)` runs on the same bar.
- **They stand down in a bar that states a metre.** `completeTriplets` returns the bar unchanged when the bar states its own metre (`statesMetre`, `triplets.ts` `completeTriplets`, `if (!metre || !divisions || statesMetre) return unchanged`). The reason is that homr works out the upper figure from the bar lengths.
- **The order that would state the printed figure and keep the printed rhythm** is:
  1. state the figure seen, in its bar, before that bar is rewritten;
  2. let the tuplet checks run in that bar too, since its metre is then printed, not homr's;
  3. sum the bars the figure governs after the tuplet checks, up to the next bar that states a metre.

  Summing before the tuplet checks would count a bar of unread triplets against a right figure. Stating after them would leave the checks reading homr's metre. Row 56 made the checks keep a change only where the bar then fits the metre in force, so a figure stated wrongly would also refuse a right tuplet. That is why the reader must give no false figure.
- **The changes I began and took out**:
  - the join's `seen` input and its tuplet-check exception (restored from `git show HEAD:`);
  - a summing module (`printed-metre.ts`: `stateFigure`, `barsOf`, `sumFigures`, with the bar rule's exceptions), set aside unrun in the scratchpad.

## 5. Not done, because the prompt stops here

The following were not done:

- the rule's measurement over section 3's places;
- the scorer's metre field before and after;
- the notes before and after through the drop box;
- A, B, C, E, F;
- the two Markup pictures;
- the brief's five tests;
- the gates for a wired build.

The "does not add up" count (`i18n.ts:1616`, `:1681`) is unchanged, because nothing the app runs has changed.

## Could not establish

- **Whether any font-only reader can reach useful recall on these editions with no false figure.** Two feature sets and many settings were tried; none did. NOT ESTABLISHED either way.
- **The false answers on rendered figures are measured, not explained.** The cause of each of the 8 at the strictest setting was not traced. They look like near-identical marks across fonts, one a figure and one another figure.
- **Petaluma's and Sebastian's licences** were not read in this row.
- **Whether a printed signature lies at a place row 37's table does not list**, for example where 3/4 changes to 6/8 and the bar's length does not change, is NOT ESTABLISHED. Whole-staff reading found nothing beyond the 3 right ones, so it shows no such place, but recall is too low to show there is none.
- **`timesig.py` as a witness** was not tried. Section 3 gives no right answer it could add to without a reader to compare it with, and it gave figures the page does not print in row 37.
- `heldout2` was never opened. A, B, C, E, and F were not run.

## Files

| Path | What |
|---|---|
| `apps/web/src/lib/omr/time-signature.ts` (new, untracked) | the figure reader measured here; imported by nothing |
| `docs/sessions/report-code-the-metre-seen-and-summed_r1_2026-10-09.md` | this report |
| `docs/memory/QUEUE.md`, row 57 only | status |

The scratchpad holds the measurement harness and every result file (`m57/`).
