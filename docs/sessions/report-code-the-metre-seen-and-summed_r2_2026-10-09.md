# Report: the printed metre, round 3: these editions' own figures (QUEUE row 57)

Code (Opus), 2026-10-09, on the Mac, branch `Shane`, HEAD `53035bd`. The working tree held the desk's uncommitted changes to `docs/memory/` and its new briefs, none touched. Brief: `brief-code-the-metre-seen-and-summed_r3_2026-10-09.md`, which replaces r2's section 3 only.

## The answer first: STOPPED, nothing built

With these editions' own figures added as templates, held out song by song, the reader still gives **figures the page does not print** in every configuration measured. So, per r3's "Then", r2's section 4 was not built.

- **Rendered set.** Every configuration gives at least 3 such figures. The best case uses the editions' figures only, at the strictest margins (2 and 2), and gives 3: a 6 read as C. It gives none at the signature level.
- **Real pages.** On the 17 songs, no configuration gives a false signature at the printed places or anywhere else on the voice staves.
- **Recall.** At most 6 of 32 printed signatures, and that with fonts plus examples at margins 1.5 and 1.5, which gives 47 false figures on the rendered set.
- **Without margins.** The nearest known mark alone reads 14 of 32 places, but one is wrong: Kabalevsky 3, bar 1, printed 4/8, read 3/8.

The reader is back where the desk keeps it, unchanged this round: `docs/sessions/measure-metre-r57_2026-10-09/time-signature.ts`. I moved it into `apps/web/src/lib/omr/` to measure with it and moved it out again, because nothing was built on it. `apps/` is as at HEAD.

**One departure from the brief, by Dann's prompt.** r3 asks for A to F "only as images you have already scored". Dann's prompt for this round says *"do not open A, B, C, E, or F"*. I followed the prompt: none of the five was read, measured, or run. Song D (Gurilyov) was opened by Dann on 2026-10-08 and is among the 17.

## 1. The examples

**How they were gathered.**

- **Pages read**: every page of the opened scans, every staff on each page, not only the voice:
  - the 17 opened and build songs;
  - *Sunless* 2 and 3, opened in earlier rows;
  - the 64 florid pages from Dann's library that row 56 read: Bellini (two), Donizetti (two), Handel (three), Mozart, Saint-Saëns (two), and Viardot (`flor/` in the scratchpad).
- **Downloads**: its scores are the Mussorgsky and Tchaikovsky scans already among the 17. Nothing whose name begins `heldout2` was opened, read, listed, or run.
- **Candidates**: each staff was followed across the page, and two kinds of candidate were cut, after line removal, as the reader seats them:
  - **pairs**: a word of figure-sized marks in the upper seat, centred over one in the lower seat, each mark at least 0.45 spaces wide;
  - **C-sized marks**: on the middle line.
- **Count**: 4,042 candidates (about 1,000 pairs and 3,000 C-sized marks).
- **Labelled by eye**:
  - every pair (780 after the first pass's de-duplication);
  - every C-sized mark in the first 30 percent of its staff (1,057), where a system's C stands.
  - That is 1,837 crops, each 10 by 8 staff spaces with the candidate marked, viewed in 39 numbered sheets. Crops are in the scratchpad, `m57/cands/`; the sheets are in `m57/mont/`; the labels are in `m57/labels.json`.
- **C-sized marks further right**: not labelled, and used neither as examples nor as non-figures.

**What was found.**

- 42 pairs are printed signatures; 3 of them (2/4) were dropped because their marks did not split one to a figure. 16 signs are printed: 14 C and 2 cut C.
- 1 sign was unsure and left out.
- Every other viewed candidate is a non-figure: 2,609 marks (clefs, key signatures, accidentals, notes, rests, unsplit pairs, and C halves).

**Figures by label** (marks): 2: 9; 3: 15; 4: 39; 6: 5; 8: 10; C: 14; cut C: 2. **None of 0, 1, 5, 7, or 9** is among them.

**Signatures by source** (including courtesy and piano-staff signatures):

| Source | Signatures | Source pages |
|---|---|---|
| Tchaikovsky | 3 | page 1 |
| *Sunless* 1 | 3 | page 1 |
| *Sunless* 2 | 3 | page 1 |
| *Sunless* 3 | 7 | pages 1, 4 |
| *Sunless* 4 | 2 | page 1 |
| *Sunless* 5 | 2 | page 1 |
| Kabalevsky 1 | 3 | page 1 |
| Kabalevsky 2 | 2 | page 1 |
| Kabalevsky 3 | 3 | page 1 |
| Kabalevsky 4 | 7 | pages 1 to 3 |
| Kabalevsky 6 | 3 | pages 1, 2 |
| Kabalevsky 7 | 2 | page 1 |
| Kabalevsky 8 | 2 | page 1 |
| Kabalevsky 9 | 4 | pages 1, 3 |
| Donizetti 1 | 2 | page 1 |
| Handel 2 | 3 | page 1 |
| Handel 3 | 2 | page 1 |
| Mozart | 2 | page 3 |

Of the 94 labelled figure and sign marks, 68 come from the 17 songs and 26 from other sources.

**Non-figures**: the 2,609 above, the 2,051 seated scan marks of round 2, and the fonts' signs of round 2 (clefs, accidentals, key signatures, rests, noteheads, stems, barlines, and repeat dots). A round 2 scan mark that overlaps a labelled figure was left out.

## 2. Measured, held out song by song

Each song reads with its own examples and its own scan marks left out of the templates. The rendered set reads with each font's own marks left out.

### 2.1 The four configurations

| Templates | Margins | Rendered: false figures | Rendered: false signatures | Printed places right (of 32) | False on real pages |
|---|---|---|---|---|---|
| fonts' figures + edition examples | 2 / 2 | **8** | **1** (12/16 read 1/16) | 1 | 0 |
| fonts' figures + edition examples | 1.5 / 1.5 | **47** | **19** | 6 | 0 |
| edition examples only (fonts' non-figures kept) | 2 / 2 | **3** (a 6 read as C) | 0 | 2 | 0 |
| edition examples only | 1.5 / 1.5 | **31** (26 of them a 6 read as C) | 0 | 4 | 0 |

"False on real pages" means wrong at a printed place, or a read anywhere else on the 199 voice staves found on the 17 songs. It is 0 for every configuration.

### 2.2 Rendered (found / missed / false)

| Configuration | Single figures | Pairs | C and cut C | Non-figures read as a signature (of 12,542) |
|---|---|---|---|---|
| fonts + examples, 2 / 2 | 5496 / 7079 / 7 | 2456 / 6165 / 1 | 538 / 719 / 0 | 0 |
| fonts + examples, 1.5 / 1.5 | 7174 / 5380 / 28 | 3279 / 5324 / 19 | 655 / 602 / 0 | 0 |
| examples only, 2 / 2 | 158 / 12421 / 3 | 18 / 8604 / 0 | 0 / 1257 / 0 | 0 |
| examples only, 1.5 / 1.5 | 730 / 11821 / 31 | 182 / 8440 / 0 | 3 / 1254 / 0 | 0 |

The false answers:

- **Fonts + examples, 2 / 2**:
  - 12/16 read as 1/16 once;
  - at three-quarter size: 9 read as 0 three times, 6 read as C twice, 6 read as 0 once, 0 read as 9 once.
- **Fonts + examples, 1.5 / 1.5**: the confusions are 3 with 9 and 6, 6 with 3, 8 with 5, and 7 with 9. Examples: 3/4 read as 9/4 or 6/4, 3/8 read as 9/8 or 6/8, and 12/8 read as 2/8.
- **Examples only**: the edition examples hold no 0, 1, 5, 7, or 9, so font figures of those are never found. A 6 is read as C.

### 2.3 The 32 printed places, by song (right at that configuration)

| Place | Printed | fonts + ex, 2/2 | fonts + ex, 1.5/1.5 | ex only, 2/2 | ex only, 1.5/1.5 |
|---|---|---|---|---|---|
| Tchaikovsky 1 | 3/8 | | **3/8** | | |
| *Sunless* 1, 1 | 6/4 | | **6/4** | | |
| *Sunless* 4, 1 | C | | | | **C** |
| Kabalevsky 4, 1 | 4/4 | **4/4** | **4/4** | **4/4** | **4/4** |
| Kabalevsky 6, 23 | 4/4 | | **4/4** | | **4/4** |
| Kabalevsky 8, 1 | 4/4 | | **4/4** | **4/4** | **4/4** |
| Varlamov 1 | 3/8 | | **3/8** | | |
| the other 25 | | nothing | nothing | nothing | nothing |

Grechaninov's two places can never be read: no staff is found on its grey scan, as in rounds 1 and 2.

**Recall by figure**, at the best real configuration (fonts + examples, 1.5/1.5), as printed figures at the 32 places:

- **3**: 2 of 6;
- **4**: 7 of 29;
- **6**: 1 of 4;
- **8**: 2 of 7;
- **2**: 0 of 7;
- **9**: 0 of 1;
- **C**: 0 of 5.

### 2.4 Every other bar start

On the 17 songs, every voice staff found was read end to end in each configuration. Nothing was read anywhere but the right signatures above. A to F were not run (Dann's prompt).

### 2.5 Why recall stays low: what the held-out reads show

I read each labelled figure from the 17 songs alone against every other song's examples (`m57/h/diag3.mts`).

- **The nearest known mark is mostly right**: 62 of the 68 figures and signs. The 4s read best: Kabalevsky 4s are nearest each other at 0.18 to 0.35.
- **The margins are what fail.** A 3 is typically 0.33 from a 3 and 0.47 from a 2, a ratio of 1.42 where the bar's margin wants 1.5 or 2. A 4 is near a font's 5, and a C is near a 6 or 1.
- **A signature needs both figures to pass**, so most fall.
- **Loosening the margins makes it worse.** At no margin (nearest wins), the full read finds 14 of 32 places and reads one wrong: Kabalevsky 3's 4/8 as 3/8. So no margin I measured both reads many and reads none wrong.
- **Pairs never formed.** Several places (*Sunless* 4 bar 22, *Sunless* 5 and 6, Kabalevsky 1, 2, and 10, Gurilyov) are missed before reading, because no pair or sign is formed there: a figure touches a clef, key signature, or barline, or is broken by line removal.
- **The examples are few.** 68 figures from the 17 songs, nearly all 4s; three 2/4s were lost to splitting. That is not enough to cover the shapes, and no example of 0, 1, 5, 7, or 9 exists in any opened scan.

## 3. What was built, or why not

Nothing was built. r3: *"If it shows any false figure, stop and report, as in round 2."* Every configuration shows false figures on the rendered set:

- **At the strictest setting with examples only**, the only false figure is a 6 read as C by the mark reader, with no false signature. A 6 in a figure seat cannot become a signature: a C is read only in the sign seat, and a pair needs digits.
- **At signature level**, that configuration gives 0 false signatures on rendered and real pages, but its recall is 2 of 32.
- **The brief's bar is false figures, not false signatures**, so I stopped. Building r2's section 4 on 2 of 32 would state almost nothing.

These were not done, because of the stop:

- the seen-and-summed rule and join;
- the drop-box runs, the scorer's metre field before and after, and A to F;
- the pictures, the tests, the gates, and the shipped template file.

## Could not establish

- **Whether more edition examples would close the gap.** The opened scans hold no 0, 1, 5, 7, or 9 figure, and few 2s, 6s, and 8s, so it cannot be measured here. NOT ESTABLISHED.
- **Whether a reader built at signature level would meet the bar** (all four configurations give 0 false signatures on real pages and two give 0 on rendered) is a question for the desk. The bar as written is per figure.
- **A to F** were not used, per Dann's prompt, though r3 allowed them as images.
- **The three 2/4 pairs lost to splitting**: their marks did not divide one to a figure. It was not traced whether a different split would keep them.
- **Labels are by my eye on crops.** One C-sized mark (candidate 672) was unsure and left out. A wrong label among the 2,609 non-figures would cost recall, not add false figures; that is NOT ESTABLISHED as checked.
- `heldout2` was never opened.

## Files

| Path | What |
|---|---|
| `docs/sessions/measure-metre-r57_2026-10-09/time-signature.ts` | the reader, back where the desk put it, unchanged this round |
| `docs/sessions/report-code-the-metre-seen-and-summed_r2_2026-10-09.md` | this report |
| `docs/memory/QUEUE.md`, row 57 only | status |

The scratchpad (`m57/`) holds the candidates, crops, sheets, labels, example set, harness, and every result file.
