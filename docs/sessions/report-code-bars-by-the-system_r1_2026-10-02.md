# Report: bars by the system, section 3 measurements

**Written by:** Code (Sonnet 5.5), 2026-10-02. **Brief:** `brief-code-bars-by-the-system_r1_2026-10-02.md`, section 3. **Status: MEASUREMENTS ONLY. No code has been changed.** Sections for the build and for brief section 6 are not written; they follow once the desk has read this.

## Provenance of the readings

- Branch `Shane`, HEAD `a7fd740` (row 18, shipped). Working tree dirty with documents only. `apps/web/static/reader/reader.py` is byte-identical to `tools/e16-harness/reader/reader.py`.
- **Instrument:** the dev server (`ilya-web`, port 5173) driven by headless Chromium 145 under Playwright on Dann's Mac; pages rasterized by the app's own `rasterizePdf` (pdf.js, 400 dpi) for the Tchaikovsky and Lamm PDFs, the repository's PNGs for the robustness pages and the 23 renders; the reader in pinned Pyodide v0.26.4 (cv2 4.9.0, numpy 1.26.4). Every number comes from `read_page_geometry` on the straightened working copy (`G['img']`, `G['nl']`), so the x positions are on the working copy and match the ids the reader would give.
- **What could make this instrument lie.** (a) The "printed barline" positions. I have no independent x for them, so I took the union of two witnesses, the voice staff's `detect_barlines` and a solid-stroke test across the piano's staves, and then **counted the printed bars by looking at every one of the 33 systems** (the 11 Tchaikovsky systems against the desk's draft count; the other 22 by my own eye on overlays). The union's count equals the looked count on all 33 systems, which is the check that it is not missing or inventing a barline. It is not an independent x. (b) A solid-stroke test that is too strict loses a barline (it did, three times) and one that is too loose finds stems (it does on the renders): both appear below. (c) The 0.93 fill and the 0.6 staff-space matching tolerance are mine, measurement-only.
- Scripts and raw results: `measure-bars_r1_2026-10-02/` (`pyrun.mjs` runs any script in the pinned Pyodide; `b1` to `b7` are the measurements; `b3.json`, `b4.json`, `b6.json`, `b7.json` are the raw results).

## 1. The 11 Tchaikovsky systems, today's `detect_barlines`

The reader finds **59 of 99** barlines (the row 18 figure), **40 missed**. Every miss is a barline the desk's count and the piano's staves both show. Positions are pixels on the straightened page; width is the connected component's width in staff spaces, height its height as a fraction of the staff's height (`s` 28 to 29 px).

| page | system | printed bars | barlines read | read at x | missed at x (width in staff spaces; height as fraction of the staff's) |
|---|---|---|---|---|---|
| 1 | 1 | 9 | 9 | 1189, 1434, 1705, 1972, 2235, 2498, 2717, 2947, 3277 | none |
| 1 | 2 | 9 | 5 | 837, 1120, 1441, 2941, 3272 | 1715 (w 1.29, h 1.05), 2022 (w 1.11, h 1.06), 2345 (w 1.54, h 1.07), 2617 (w 3.46, h 1.21) |
| 1 | 3 | 9 | 9 | 839, 1118, 1404, 1725, 2053, 2322, 2598, 2928, 3269 | none |
| 2 | 1 | 9 | 4 | 833, 1163, 1464, 3038 | 1809 (w 1.10, h 1.05), 2136 (w 2.55, h 1.07), 2411 (w 17.21, h 1.84), 2748 (w 3.86, h 1.19), 3324 (w 2.17, h 1.07) |
| 2 | 2 | 8 | 6 | 869, 1547, 1902, 2206, 2938, 3322 | 1230 (w 2.00, h 1.04), 2544 (w 1.38, h 1.04) |
| 2 | 3 | 9 | 6 | 801, 1098, 1758, 2005, 2969, 3314 | 1429 (w 1.93, h 1.06), 2268 (w 4.21, h 1.17), 2641 (w 5.69, h 1.18) |
| 2 | 4 | 9 | 4 | 830, 1516, 2085, 3016 | 1193 (w 1.45, h 1.06), 1801 (w 7.79, h 1.22), 2372 (w 2.45, h 1.09), 2675 (w 2.59, h 1.09), 3300 (w 5.28, h 1.08) |
| 3 | 1 | 8 | 3 | 889, 2981, 3282 | 1227 (w 1.32, h 1.07), 1590 (w 0.96, h 1.04), 1952 (w 2.57, h 1.05), 2259 (w 2.50, h 1.07), 2623 (w 1.36, h 1.04) |
| 3 | 2 | 9 | 5 | 1144, 1453, 1764, 2609, 3281 | 852 (w 4.89, h 1.43), 2011 (w 1.82, h 1.06), 2275 (w 1.54, h 1.04), 2999 (w 1.79, h 1.07) |
| 3 | 3 | 9 | 6 | 932, 1277, 1915, 2195, 3033, 3289 | 1622 (w 4.75, h 1.48), 2452 (w 2.71, h 1.73), 2743 (w 2.14, h 1.05) |
| 3 | 4 | 11 | 2 | 2385, 2898 | 798 (w 1.54, h 1.08), 1090 (w 2.18, h 1.06), 1407 (w 4.14, h 1.07), 1633 (w 2.11, h 1.04), 1880 (w 2.46, h 1.06), 2138 (w 2.61, h 1.05), 2653 (w 2.04, h 1.05), 3103 (w 2.14, h 1.05), 3281 (w 3.14, h 1.05) |

**What the stroke is in the line-free image at each missed x.** At the voice staff's middle row there is ink at every one of the 40 x positions, so no barline is missing from the image. I looked at all 40 (a montage of the line-free image at each, `b5` in my scratch, not kept):
- **In 36 the component is the right height (1.04 to 1.09 of the staff's) and too wide**: 0.96 to 7.79 staff spaces against the 0.5 bound (`BARLINE_WIDTH_BOUND`). The barline is a clean full-height stroke, and the neighbouring ink (a note's stem and head, a flag, a rest, the end of a tie) sits within one to three staff spaces of it, joined to it by what the line removal leaves behind: short horizontal remnants of the staff lines, broken by speckle. The component is therefore one object, a barline plus a neighbour.
- **In 4 the component is also too tall** (1.43, 1.48, 1.73, and 1.84 of the staff's height): the same join, with a tie, beam, or flag above or below the staff as well.
- **The search for a stroke inside a wide component (`_refine_merged_barline`) rejects them.** For each of the 40 I took the column near the missed x that fails the fewest of its three tests, and asked which it fails (`b4`): **24 fail solidity** (some other ink in the same column within two staff spaces above or below the staff; in 18 of those the extra ink is above the staff), **16 fail the row-width test** (a neighbouring stroke touching the barline is wider than 1.07 staff spaces at some row), and **one passes all three** but sits in a component 1.84 staff-heights tall, which is never searched. What the extra ink is in each of the 24 solidity failures I did not identify. NOT ESTABLISHED.
- **Two kinds of last barline.** The final thin-and-thick barline of page 3 (system 4, x 3281) is among the 40; the thin stroke of a two-stroke barline on other pages is read.

## 2. True bars per system, the other scan pages

Counted by looking at an overlay of each system, **on the voice staff** (the voice staff's own barlines, which stand at the same x as the piano's). A system's bars are the barlines that close them; the stroke that opens a system is not a barline; a thin stroke and a thick one at a system's end count once.

| page | bars per system | total |
|---|---|---|
| Lamm scan page 1 (`pdfjs400-1`, the app's raster) | 3, 3, 3 | 9 |
| Lamm scan page 2 (`pdfjs400-2`) | 3, 3, 3 | 9 |
| `sunless01..._Lamm-Muzgiz1931-Kalmus_p2` | 3, 3, 3 | 9 |
| `sunless01..._RK-Bessel-1908_p2` | 3, 3, 3 | 9 |
| `sunless04-boredom_RK-Bessel-1908_p3` | 3, 3, 3 | 9 |
| `sunless05-elegy_RK-Bessel-1908_p3` | 3, 4, 2 | 9 |
| `sunless06-on-the-river..._p21` | 3, 3, 2, 2 | 10 |

Total 64 bars on these pages. **Today's reader on them** (voice-staff finder alone): 100 barlines in all of the 33 systems including Tchaikovsky's 59, so 41 of these 64 (counting from `b6.json`: lamm1 8, lamm2 6, Kalmus p2 5, Bessel01 5, Bessel04 5, Bessel05 4, s06 8 = 41). I note the Lamm scan page 1 and `sunless01..._Lamm-Muzgiz1931-Kalmus_p2` show the same printed page.

## 3. A stroke from the upper piano staff's top line to the lower one's bottom line

For each system I looked for a column whose ink fills at least 0.93 of the rows from the top line of the first piano staff to the bottom line of the last one (the system's opening line is left out; strokes within one staff space collapse to one). **163 printed barlines in the 33 scan systems:**

| | count |
|---|---|
| printed barlines with an unbroken stroke across the piano's staves at the same x | **160** |
| printed barlines with none | **3** (Tchaikovsky p1 system 3, the closing barline at x 3269; p2 system 3, x 801 and 1098) |
| strokes across the piano that are not barlines | **0** (one flagged stroke on the Lamm scan is the thick half of a final thin-and-thick barline, not collapsed in that script) |

The three that lack one are barlines the voice staff's finder does read, so the two witnesses never both miss. **Every voice-staff barline the reader reads (100) has such a stroke within 1.5 staff spaces except three**, the same three.

**The 23 render fixtures are the other case (item 5).**

## 4. The distance in x between a voice-staff barline and its piano barline

On the straightened working copy, over the 97 voice-staff barlines (of the 100 read) that have a piano stroke within 1.5 staff spaces, in staff spaces, voice minus piano:

| bin (0.1 s) | -0.1 | 0.0 | +0.1 | +0.2 |
|---|---|---|---|---|
| barlines | 33 | 30 | 27 | 7 |

Whole range **-0.143 to +0.241**, median 0.000. By page: Lamm and Bessel pages -0.13 to +0.09; Tchaikovsky 1 +0.04 to +0.18, 2 -0.10 to +0.24, 3 -0.14 to +0.14. So a voice barline and its piano barline stand within a quarter of a staff space of each other everywhere in the tree; the barline's own thickness is about 0.1 to 0.2 staff spaces. The widest of the pairs is 0.24, so a tolerance of half a staff space (0.6 as I used) has a wide margin on both sides: the next nearest unrelated stroke in any system is a note's stem, at least one staff space off.

## 5. The 23 render fixtures

The renders' systems have **two staves each** (the voice and one piano staff), so "the top line of the upper piano staff to the bottom line of the lower" is one staff on them. I ran the same test on the piano staff of each of the 83 systems (`b7`):
- **Voice-staff barlines read: 213. Each of the 213 has a stroke across the piano staff within 0.6 staff spaces. Disagreements in that direction: 0.**
- **Piano-staff strokes with no voice barline answering: 95**, on 25 of the 83 systems. These are stems: a render draws a stem as a perfectly solid vertical stroke, and where a stem spans the whole piano staff (an octave or a chord) it passes a solid-stroke test that no scan stem does. The disagreements are listed per page and system in `b7.json` (`piano_without_voice`).
- **So on the renders a test that asks the system finds every barline today's finds, plus 95 strokes that are not barlines.** A rule that took a piano stroke as a barline would move 25 systems' bars; a rule that confirms a voice barline by the piano and counts an unanswered piano stroke without adding it would leave every render as it is.

## What could not be established

- The x positions of the printed barlines, independently of the two witnesses. Counts per system were checked by eye; positions were not.
- What the extra ink is in the 24 cases where the refine's solidity test fails.
- Whether the 33 systems are representative. They are one song by Tchaikovsky (Jurgenson 1878), one by Musorgsky in two editions, and two Bessel pages. No page has a repeat sign, a barline with a double stroke mid-system, a key change at a barline, or a tacet system.
- The renders' result with a two-piano-staff system. They have one piano staff.
- The bars of pages with a barline that does not stand at the same x on the voice and piano staves (Gould r181 allows it). None is in the tree.

## State

Nothing was changed in `tools/`, `apps/`, or `packages/`. New files: `measure-bars_r1_2026-10-02/` and this report; Dann must `git add` them before any ship. I removed my staging copy of the renders from `apps/web/.svelte-kit/fx/`. The `ilya-web` dev server is running on port 5173.

---

# Build against brief r2 (2026-10-02)

**Written by:** Code (Sonnet 5.5). **Brief:** `brief-code-bars-by-the-system_r2_2026-10-02.md`, section 3a. **Status: WRITTEN**, uncommitted. All eight gates are at baseline. The "State" paragraph above is superseded.

## What changed, by file

| file | change |
|---|---|
| `tools/e16-harness/reader/reader.py` | `page_barlines` (the system as witness), `_stroke_columns`, `_witness_clusters`, `PIANO_STROKE_FILL`, `VOICE_STROKE_FILL`, `BARLINE_SAME_X`; `select_voices` returns `systems` (each system's staves, voice, braced staves, left edge); `_brace_span` joins touching halves of a broken brace; `BRACE_COVER` replaces the 0.6 in `_in_span`; `read_page_pitch` stores `G['barlines']`; `detect_tacet_barlines` and `_solid_barline_columns` are deleted |
| `tools/e16-harness/reader/run_page2.py`, `envelope.py` | read the barlines from `G['barlines']`; the tacet systems' bars are the piano's strokes |
| `apps/web/src/lib/reader/page-reader.worker.ts`, `recognized.ts` | additive: `barlineWitness` in the read report, sums over the pages, optional like `tacetSystems`. Outside the reader directory; brief section 5 allows it |

`detect_barlines`, `_refine_merged_barline`, and their three constants are untouched (ruling 7). `K_S`, `VocalLineEvent`, and `reconciliation/` are untouched.

## The two fill bounds (ruling 5), set from the 33 systems that have a braced pair

The 33 systems are the 11 Tchaikovsky systems, the 6 Lamm systems (the Lamm scan, whose two pages repeat in `robustness-samples`, counted once), and the 16 of the five robustness pages. The true barlines are the union of the two witnesses, whose count equals the count made by eye on all 33 (`c2.json`).
- **Piano witness, fill of a column across the braced pair's rows.** The best columns of the true barlines fill: lowest 0.783 (Tchaikovsky p2, system 3), then 0.879 (Tchaikovsky p1, system 3), then 0.94 (RK-Bessel sunless05 p3, system 3), then 0.949 (RK-Bessel sunless01 p2, system 2), and up. The strongest column that is not a barline (38 such runs above 0.7 in the 33 systems) fills **0.836** (Tchaikovsky p2, system 4, x 2621); the next are 0.826 (p1, system 2), 0.824 (p3, system 3 and p2, system 4). The ranges overlap, so no bound separates all of them. **`PIANO_STROKE_FILL = 0.89`**, the midpoint of the clean gap between 0.836 and 0.94. The two weak barlines (0.783, 0.879) fall below it and are read by the voice's witness; that is what the union is for. The non-barline strokes at 0.82 to 0.84 are, from their fill, stems that cross the gap between the staves; I did not look at them. That is the case ruling 8 names, and it now exists in the tree.
- **Voice witness, fill across the voice staff's own rows,** used only to record that the voice answers a piano stroke. The true barlines' best columns fill 0.952 or more (RK-Bessel sunless01 p2, system 3), and a stem fills 1.0, so there is no gap above. **`VOICE_STROKE_FILL = 0.95`**, that lowest value truncated. It records and decides nothing.

## Section 6, line by line

**1. Tchaikovsky: MET.** The bars read on each system equal the desk's count on all 11 systems: page 1 9, 9, 9; page 2 9, 8, 9, 9; page 3 8, 9, 9, 11. **99 of 99.** Through the app's Worker the three pages read 99 measures, numbered 0 to 98 without a break (`tch-worker3.json`; before, 59). No system is wrong by a bar.

**2. Every other scan page: MET.** Bars per system equal my count from item 2 of the first report on every one: Lamm page 1 and 2, `Kalmus_p2`, `Bessel sunless01 p2`, `sunless04 p3` 3, 3, 3 each; `sunless05 p3` 3, 4, 2; `sunless06 p21` 3, 3, 2, 2. **64 of 64.** Two of these needed more than the stroke witness: on `Bessel sunless01 p2` system 3 and `sunless04 p3` system 3 no braced pair was found (the brace is drawn shorter than the staves it braces, and on the first it is also split at its waist), so today's finder ran alone and read 1 and 2 of 3 bars. Two changes to the brace rule fix that (below). The renders and the other 31 systems are unaffected by them.

**3. A barline is confirmed by its system: MET.** Each barline records who saw it. The counts are in `G['barlines']` (per system and summed per page, `witness`) and in the read report as `barlineWitness`. On the Tchaikovsky PDF through the Worker: **both 96, the piano alone 0, the voice staff alone 3, no braced pair 0.** The three the voice alone saw are the three the piano's stroke lacked at the first report (p1 system 3, x 3269; p2 system 3, x 801 and 1098). On the Lamm scan: both 18, nothing else. Per page: p1 both 26, voice alone 1; p2 both 33, voice alone 2; p3 both 37. "The piano alone" is 0 everywhere in the tree, because the voice's own stroke test (`VOICE_STROKE_FILL`) answers every piano stroke; the category stays so a cross-staff stem would show.

**4. Thin and thick are one barline; the opening line is not a barline: MET.** Strokes within half a staff space are one barline for the witnesses, and the result then collapses with the existing 1.0 staff-space `BARLINE_CLUSTER_GAP`, leftmost wins, as before. The opening line is left out by ignoring strokes within two staff spaces of the system's left edge. The last barline of Tchaikovsky page 3 (thin and thick) counts once: system 4 reads 11.

**5. Tacet: MET.** The tacet system's bars are the piano's strokes (`detect_tacet_barlines`'s four lists are deleted). The painted-out fixture of row 18 (Tchaikovsky page 1, system 2, voice painted out) now reads **9 bars of rest for the 9 printed**, each 9/8, integrity `False` (its length equals the measure's). The Lamm fixture reads 3 bars of rest. A page with all three voice staves painted out reads 26 bars of rest of 27 printed (the first system is one short; I did not find which).

**6. Render fixtures: MET.** All 23 give the same `envelope.run` output, sha256 over the whole canonical `ro` with ids, as before (`m8f.json` against `m5fx.json`). By construction: no render system has a braced pair, so `page_barlines` returns `detect_barlines` untouched.

**7. Read time.** The app's Worker, headless, unthrottled, two reads in one Worker: Tchaikovsky 29.1 s then 28.6 s (`readSeconds`), against row 18's 31.5 s and 31.0 s. Lamm 14.7 s and 14.7 s, against 16.5 s and 16.1 s. The reads are not faster by design: more bars means fewer fallbacks and the measure loop is cheap. Warm-up 3.7 s this time.

**8. Gates: MET.** 1 phonology 251, 2 dictionary 235, 3 web-check 0 errors and 12 warnings in 5 files, 4 web-test 1784, 5 score-parser 636 and 5 skipped, 6 blurb 145, 7 integration 55, 8 ratchets OK. `ilya-ship.sh` not run (untracked files).

## The two changes to the brace rule, which section 3a did not rule

Both are in `select_voices`' brace test and both were needed for section 6 item 2. They are my DESK DEFAULTS; say if you want either undone.
1. **`_brace_span` joins touching halves.** Components of the brace region at least 2.5 staff spaces tall that touch (within half a staff space) are one brace, and the taller of that and the tallest single component wins. An unbroken brace reads as before. Evidence: `RK-Bessel sunless01 p2`, system 2, the brace is two halves of 147 px.
2. **`BRACE_COVER = 0.2`, was 0.6,** the share of a staff the brace must cover for the staff to count as braced. Measured on the 33 three-staff systems: the voice staff's overlap with its brace is never above 0 (it lies 1.6 to 3.7 staff heights clear); the piano staves run from **0.353** (`RK-Bessel sunless01 p2`, system 3, lower staff) to 1.0. 0.2 is the midpoint of the gap. At 0.6 a brace that is drawn shorter than its staves left them unbraced. Evidence also: `sunless04 p3`, system 3, overlaps 0.541 and 0.512.
Effect: the voice staff chosen is the same on all 33 systems as before; the fallbacks on `RK-Bessel sunless01 p2` fell from 2 to 0 (the signs had been breaking its tie). The render pages have no brace and do not move.

## Changed ids

Tchaikovsky through the Worker: 208 ids at row 18, 209 now, **195 of the old 208 gone** (the page's bar count went from 59 to 99, and an id is `r{measure}-{x}`). Lamm: 80 at row 18, 99 now, 80 of 80 gone (14 bars became 18). Accepted, as in row 18. On the 23 render pages none change.

## What could not be established

- The x positions of the printed barlines independently of the two witnesses; counts were checked by eye on all 33 systems, positions were not.
- What the 38 non-barline strokes at fill 0.7 to 0.84 are. I believe they are stems that cross the gap between the piano staves (their fill is too high for anything else I know of) and did not look.
- That the bounds hold on prints unlike these: the tree has no repeat sign, no double barline mid-system, no barline that falls at a different x on the voice and piano staves, and no real tacet system. The tacet reading was made on painted-out fixtures.
- Why the all-voices-painted-out fixture reads 26 of 27.
- Read time on a phone, on a hidden Browser pane, or on another machine.
- Whether the bars read are right on the Lamm scan in the sense of Dann's own eye. They equal mine.

## State

Code is `WRITTEN`, uncommitted; `DONE` is Dann's walk. New files to `git add`: `docs/sessions/measure-bars_r1_2026-10-02/` (now also `c2`, `d1`, `d3`, and the Worker runs) and this report. My staging in `apps/web/.svelte-kit/fx/` is removed. The `ilya-web` dev server is running on port 5173.
