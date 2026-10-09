# Report: every bar against the metre printed on the page (r1, 2026-10-08)

Code (Opus 5.5) on Dann's Mac, QUEUE row 37, brief `brief-code-bars-against-the-printed-metre_r2_2026-10-08.md`. Tree at `6b7c3de` on `Shane` (row 54 committed). No git command that writes was run. Nothing in `~/Downloads/_desk-2026-10-08/` whose name begins `heldout2` was opened, listed, or run.

## The result

**Part B is not built.** `timesig.py` read a time signature at 17 places on 14 pages of the opened songs. It was right at 11 and wrong at 6. It read the Tchaikovsky's printed 3/8 as **9/8**, and it read **1/4** five times where no time signature is printed (*Sunless* 5, Kabalevsky 3, Kabalevsky 6, and twice in Kabalevsky 10). So 5 of the 14 pages where it answered carry a wrong metre, and the brief's condition (right on every page where it answers) fails. Ilya's reading is unchanged.

**Part A's scorer field is built.** `tools/e16-harness/src/scan-scorer.ts` now scores the metre bar by bar, and the line carries "metre right N of M bars". On the 17 opened and build songs the metre in force is right in **666 of 721** pairable bars, and Grechaninov holds 47 of the 55 wrong ones. On the five unseen songs it is right in **100 of 104**.

**Bars that do not fit the metre:** of 723 bars that hold an event, 10 do not fit the printed metre, and 9 of those hold a real misread. Against homr's own metre, 65 do not fit, but only 9 of those hold a misread (47 are Grechaninov's, where homr states the printed 6/8 as 4/8). A check against the printed metre would flag almost only real misreads; a check against homr's metre would mostly flag homr's guessed numerator.

## How `timesig.py` was run

- **The code:** Ilya's own page reader, from its source of truth `tools/e16-harness/reader/` (`apps/web/static/reader/` is a generated copy, the same files). Per page: `reader.read_page_geometry` (staves, staff space, the line-free image; voices chosen by the brace rule, no `cfg['vocal']`), `reader.page_barlines`, then `timesig.search_system_signatures` on each vocal system: the system start and after every barline (`timesig.py:671`). Hits were mapped to page-local bars as `envelope.py:140` to `:162` maps them.
- **Where:** Python 3.14 in a scratchpad venv (NumPy 2.5.3, OpenCV 5.0.0, Matplotlib), with the glyph caches from `tools/e16-harness/reader/fonts/` (without them the modules shell out to Verovio at a cloud path and fail). The app runs these modules in Pyodide; this run did not.
- **The pages:** Ilya's own 400 dpi renders of the songs' PDFs (`rasterizePdf`), the same pages the drop box reads: the PDFs of rows 53 and 54.
- **Judged against:** the page, by eye, at every answer (crops of each window), and the truth files' bar lengths. The truth records bar lengths, not figures, so 6/8 and 3/4 are the same length there.

## Part A table: each printed time signature

"Printed" is what the page shows where it was looked at, or else the truth's bar length. "homr states" is the `<time>` in the reading (row 53's drop-box reading on the deployed `3a93f60`).

| Song | Bar | Printed | homr states | `timesig.py` reads |
|---|---|---|---|---|
| Tchaikovsky op. 38 no. 3 | 1 | 3/8 (looked) | 3/8 | **9/8, wrong** |
| *Sunless* 1 | 1 | 6/4 (looked) | 6/4 | 6/4, right |
| *Sunless* 4 | 1 | a whole bar (not looked) | 4/4 | abstains |
| *Sunless* 4 | 22 | 2/4 (looked) | 4/4 | 2/4, right |
| *Sunless* 4 | 23 | a whole bar again | none | abstains |
| *Sunless* 5 | 1 | a whole bar | 4/4, and 2/2 at bar 5 | abstains (page 2: Ilya's beam walk stopped, no read); **1/4 on page 5 where none is printed, wrong** |
| *Sunless* 6 | 1 | a whole bar | 4/4, and 2/2 at bar 44 | abstains |
| Kabalevsky op. 52 no. 1 | 1 | 3/4 (looked) | 3/4 | 3/4, right |
| no. 2 | 1 | 2/4 (looked) | 2/4 | 2/4, right |
| no. 3 | 1 | a half-note bar | 4/8 | abstains; **1/4 on page 4 where none is printed, wrong** |
| no. 4 | 1, 14, 16, 35, 36 | whole, 3/4, whole, 2/4, whole | 4/4 at 1, 16, 35 | abstains at all five |
| no. 6 | 1, 20, 21, 22, 23 | whole, 2/4, whole, 2/4, whole | 4/4 at 1 and 20 | 2/4 twice on page 2 (looked: printed there), right; **1/4 on page 2 where none is printed, wrong**; abstains elsewhere |
| no. 7 | 1 | 6/8 (looked) | 6/8 | 6/8, right |
| no. 7 | 47, 48 | 9/8, then the bar length of 6/8 | 6/8 at 47 | abstains at 47; 6/8 on page 5 where a 6/8 is printed after a barline (looked), right |
| no. 8 | 1 | 4/4 (looked) | 4/4 | 4/4, right (page 2: Ilya's beam walk stopped, no read) |
| no. 9 | 1 | 4/4 (looked) | 4/4 | 4/4, right |
| no. 9 | 30, 31 | 3/2, then a whole bar | none | abstains |
| no. 10 | 1 | 3/4 | 3/4 | abstains; **1/4 twice on page 3 where none is printed, wrong** |
| Gurilyov «Раскаяние» | 1 | C (common time) | 4/4 | abstains (a C is not a numeral; page 1, the cover, has no staff) |
| Grechaninov op. 20 no. 4 | 1 | 2/4 (row 49) | 2/4 | no read: Ilya's staff finder finds no staff on any of its 5 pages |
| Grechaninov | 10 | 6/8 (row 49) | **4/8** | no read |
| Varlamov «Скажи, зачем?» | 1 | 3/8 (looked) | 3/8 | 3/8, right (pages 1 and 4 have no staff) |

**Summary of `timesig.py`:** 17 answers: 11 right, 6 wrong. Of the printed signatures above, it reads 11 and misses the rest. Where Ilya's own geometry fails (all of Grechaninov; *Sunless* 5 page 2; Kabalevsky 8 page 2), it cannot run at all. It never reads a C or a cut C. The six wrong answers come in two kinds: a 3 read as a 9 (Tchaikovsky), and a "1 over 4" found among notes at the start of a system, in the window `search_system_signatures` opens there. Why the 1/4 passes `_validate_stacks` (`timesig.py:609`, numerator 1 to 15 legal) is NOT ESTABLISHED; a lone stem over a notehead fits "1 over 4" by shape, but that is an inference.

## Part A: bars that do not fit

Per song, from row 53's drop-box readings on the deployed `3a93f60`. A bar is counted when it holds an event. "Printed" means the truth's length for the truth bar whose events the bar holds most of. A real misread is a scorer difference in that bar other than pitch: a missing, extra, length, or rest-length difference.

| Song | Bars with events | Do not fit homr's metre (real) | Do not fit the printed metre (real) |
|---|---|---|---|
| Tchaikovsky | 83 | 0 | 0 |
| *Sunless* 1 | 17 | 1 (1) | 1 (1) |
| *Sunless* 4 | 27 | 1 (0) | 0 |
| *Sunless* 5 | 61 | 3 (2) | 3 (2) |
| *Sunless* 6 | 48 | 0 | 0 |
| Kabalevsky 1 | 61 | 1 (1) | 1 (1) |
| Kabalevsky 2 | 36 | 0 | 0 |
| Kabalevsky 3 | 44 | 0 | 0 |
| Kabalevsky 4 | 32 | 3 (0) | 0 |
| Kabalevsky 6 | 34 | 2 (0) | 0 |
| Kabalevsky 7 | 39 | 3 (2) | 2 (2) |
| Kabalevsky 8 | 31 | 0 | 0 |
| Kabalevsky 9 | 31 | 1 (0) | 0 |
| Kabalevsky 10 | 70 | 0 | 0 |
| Gurilyov | 29 | 1 (1) | 1 (1) |
| Grechaninov | 56 | 47 (0) | 0 |
| Varlamov | 24 | 1 (1) | 1 (1) |
| **Total** | **723** | **64 (8)** | **9 (8)** |

On row 54's reading (the tree now), Gurilyov has 2 bars that do not fit, both real: bar 25's second group, and bar 7, whose long B4 rule 3 no longer hides. The totals become 65 (9) and 10 (9).

## The metre field: "metre right N of M bars"

**How it scores** (`tools/e16-harness/src/scan-scorer.ts:52` to `:58`, `:199`, `:348` to `:368`, `:405`): each truth bar that holds an event is paired with the reader bar holding most of its matched events. The metre is right there when the `<time>` in force in that reader bar is as long as the truth bar. A truth bar with no event (a whole bar of rest) cannot be paired and is counted apart (`unpaired`). Because the truth records lengths, 3/8 and 6/16 count as the same metre.

Before (row 53, deployed `3a93f60`), unedited:

```
tch: webgpu; 171 of 174 right; missing 0; extra 0; pitch misreads 3; length misreads 0; bars read 99 of 99; metre right 83 of 83 bars; score 98.3 PASS
sun1: webgpu; 94 of 96 right; missing 0; extra 0; pitch misreads 0; length misreads 2; bars read 18 of 18; metre right 17 of 17 bars; score 97.9 PASS
sun4: webgpu; 116 of 116 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 29 of 29; metre right 26 of 27 bars; score 100.0 PASS
sun5: webgpu; 246 of 258 right; missing 1; extra 10; pitch misreads 9; length misreads 2; bars read 64 of 61; metre right 58 of 58 bars; score 91.5 BELOW
sun6: webgpu; 155 of 161 right; missing 0; extra 0; pitch misreads 6; length misreads 0; bars read 55 of 55; metre right 48 of 48 bars; score 96.3 PASS
k01: webgpu; 150 of 152 right; missing 0; extra 0; pitch misreads 1; length misreads 1; bars read 67 of 67; metre right 61 of 61 bars; score 98.7 PASS
k02: webgpu; 93 of 157 right; missing 64; extra 0; pitch misreads 0; length misreads 0; bars read 41 of 70; metre right 37 of 37 bars; score 59.2 BELOW
k03: webgpu; 157 of 157 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 52 of 52; metre right 44 of 44 bars; score 100.0 PASS
k04: webgpu; 150 of 151 right; missing 0; extra 0; pitch misreads 1; length misreads 0; bars read 39 of 39; metre right 29 of 32 bars; score 99.3 PASS
k06: webgpu; 153 of 153 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 37 of 37; metre right 32 of 34 bars; score 100.0 PASS
k07: webgpu; 160 of 163 right; missing 0; extra 0; pitch misreads 0; length misreads 3; bars read 53 of 53; metre right 38 of 39 bars; score 98.2 PASS
k08: webgpu; 154 of 154 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 32 of 32; metre right 31 of 31 bars; score 100.0 PASS
k09: webgpu; 143 of 149 right; missing 0; extra 0; pitch misreads 6; length misreads 0; bars read 39 of 39; metre right 30 of 31 bars; score 96.0 PASS
k10: webgpu; 154 of 156 right; missing 0; extra 0; pitch misreads 2; length misreads 0; bars read 83 of 83; metre right 70 of 70 bars; score 98.7 PASS
gur: webgpu; 138 of 153 right; missing 0; extra 0; pitch misreads 0; length misreads 15; bars read 31 of 31; metre right 29 of 29 bars; score 90.2 BELOW
grech: webgpu; 153 of 154 right; missing 0; extra 0; pitch misreads 1; length misreads 0; bars read 58 of 58; metre right 9 of 56 bars; score 99.4 PASS
varl: webgpu; 61 of 63 right; missing 0; extra 1; pitch misreads 0; length misreads 2; bars read 26 of 26; metre right 24 of 24 bars; score 95.2 PASS
Total: 2448 of 2567 right; missing 65; extra 11; pitch misreads 29; length misreads 25; bars read 823 of 849; metre right 666 of 721 bars; score 94.9
```

After: no app code changed, so "after" is the tree as it stands, which is row 54's reading (its local drop-box run). Every line is the same except Gurilyov and the total, unedited:

```
gur: webgpu; 149 of 153 right; missing 0; extra 0; pitch misreads 0; length misreads 4; bars read 31 of 31; metre right 29 of 29 bars; score 97.4 PASS
Total: 2459 of 2567 right; missing 65; extra 11; pitch misreads 29; length misreads 14; bars read 823 of 849; metre right 666 of 721 bars; score 95.4
```

Where the metre is wrong: Grechaninov from bar 10 (printed 6/8, stated 4/8: 47 bars); Kabalevsky 4 (the 3/4 at 14 and the 2/4 at 35, stated 4/4: 3 bars); Kabalevsky 6 (two 2/4 bars stated 4/4); *Sunless* 4 bar 22 (2/4 stated 4/4); Kabalevsky 7 bar 47 (9/8 stated 6/8); Kabalevsky 9 bar 30 (3/2 stated 4/4). Each is a bar where the page changes metre and homr keeps one numerator for the page.

## The five unseen songs

No app code changed, so the five were not read again. Row 54's readings of them (in a private folder, never opened) were rescored with the metre field by the same script, which prints these lines, unedited:

```
A: webgpu; 67 of 69 right; missing 0; extra 0; pitch misreads 2; length misreads 0; bars read 12 of 12; metre right 10 of 10 bars; score 97.1 PASS
B: webgpu; 79 of 79 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 16 of 16; metre right 13 of 13 bars; score 100.0 PASS
C: webgpu; 126 of 126 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 17 of 17; metre right 11 of 15 bars; score 100.0 PASS
E: webgpu; 230 of 231 right; missing 0; extra 0; pitch misreads 1; length misreads 0; bars read 50 of 50; metre right 46 of 46 bars; score 99.6 PASS
F: webgpu; 81 of 85 right; missing 0; extra 0; pitch misreads 4; length misreads 0; bars read 20 of 20; metre right 20 of 20 bars; score 95.3 PASS
Total: 583 of 590 right; missing 0; extra 0; pitch misreads 7; length misreads 0; bars read 115 of 115; metre right 100 of 104 bars; score 98.8
```

## Every change

| Where | What |
|---|---|
| `tools/e16-harness/src/scan-scorer.ts:52` to `:58` | the header: how the metre is scored |
| `scan-scorer.ts:199` | `ScanScore.metre`: `{ right, paired, unpaired }` |
| `scan-scorer.ts:348` to `:368` | each truth bar paired with its reader bar; the metre in force there compared with the truth bar's length |
| `scan-scorer.ts:405` | `metre` returned |
| `tools/e16-harness/src/scan-scorer-selftest.ts:157` | check 10: a perfect echo, one bar in 3/4 where the truth bar is a whole, 8/8 as long as 4/4, a bar with no event counted apart |

Nothing in `apps/web` and nothing in `tools/e16-harness/reader/` changed. Part B's flag in the Loupe is not built: the brief builds it only with Part B.

## Tests

`node tools/e16-harness/src/scan-scorer-selftest.ts`: all checks pass, including the new check 10. That self-test is not one of the eight gates.

## Gates

From the copy of `ilya-ship.sh` that cannot stage. **All eight at baseline**, against row 54's (gate 4: 2012).

| Gate | Result |
|---|---|
| 1 phonology | 251 passed (251) |
| 2 dictionary | 235 passed (235) |
| 3 web-check | 0 errors and 12 warnings in 5 files |
| 4 web-test | 2012 passed (2012) |
| 5 score-parser | 650 passed, 5 skipped (655) |
| 6 blurb | 145 passed (145) |
| 7 integration | 55 passed (55) |
| 8 ratchets | OK |

## What a Part B would need, stated as findings, not a plan

- `timesig.py` gives a false 1/4 in the start window of five systems. A false metre is worse than homr's guessed numerator wherever homr's guess was right. On these 17 songs homr's numerator is right on every page except where the page changes metre.
- It runs only on pages where Ilya's own staff finder and beam walk succeed (not on Grechaninov, the song with the clearest need), and it does not read C or cut C.
- The checks of Part A show where the need is: the bars that do not fit the printed metre are almost all real misreads (9 of 10), so a flag on them would be honest. But flagging needs the printed metre, and the only source of it that answers reliably here is the truth, which a singer's scan does not have.

## Could not establish

NOT ESTABLISHED beats a complete invented answer.

- **Why `timesig.py` reads a 1/4 where none is printed**, and the Tchaikovsky's 3 as a 9. Only the outcome was looked at, not the template scores.
- **The printed figures where the page was not looked at.** "A whole bar" in the table is the truth's length; whether the page prints 4/4, C, or 2/2 there was not checked, except where marked "looked".
- **Which bar each Kabalevsky 6 and Kabalevsky 7 page-5 answer belongs to.** `timesig.py`'s own bar count (from Ilya's barlines) does not match homr's or the truth's on those pages, so the answers were judged by the crop, not by bar number.
- **`timesig.py` in Pyodide.** It was run in CPython 3.14 with OpenCV 5.0.0; the app's Pyodide build carries its own versions, and the results there were not compared.
- **The metre field where the truth would tell figures apart.** 6/8 and 3/4, or 4/4 and 2/2, score the same, because the truth records bar lengths.
- **The unseen songs' metres.** C's 11 of 15 says four of its pairable bars are stated at another length; which bars, and why, is not looked at.
