# Brief for Code: the page reader finds every staff on a tilted scan, and a system with no voice staff is tacet

**Written by:** the desk (Fable), 2026-10-01 about 16:55. **Revised to r3 on 2026-10-02 at 00:10: section 3a holds the desk's rulings on Code's section 3 report, and section 6 items 1 and 7 are amended to match. Build to section 3a.** Revised to r2 about 23:25 on 2026-10-01 after the code was read firsthand and the plan reached r4; the changes are section 2's last two lines, section 3 items 6 and 7, one constraint and a widened scope line, and section 6 item 7. **Serves:** THE ONE THING in `docs/memory/STATE.md` (close of 2026-10-01 15:20): a scan in, a melody out, Russian seated under it. This is step 1 of that work. This is phase 2 of `plan-scan-reader_r4_2026-10-01.md`. Background, read in this order: that plan's sections 1 to 4, then `brief-fable-scan-to-seated-lyrics_r1_2026-10-01.md` Part 2, then `memo-fable-reader-audit-against-the-guide-model_r1_2026-10-01.md`.

**This brief follows `BRIEF-TEMPLATE.md`. It has no slot for a cause, and none is given.**

---

## 1. What was observed

**Dann's read on the alias, about 15:05 and 15:10, of `~/Downloads/Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf`** (3 pages, md5 `3d3d4684a1180bd4d4904ccbaca15bfb`): "2 systems, 4 staves", 4/4 for a printed 3/8, 5 measures, "Ilya could not read page 3", and "could not tell which staff carries the voice in 2 systems, and read the top one". His words: *"insufficient and wrong"*.

**The page, read by the desk from 200 dpi crops:** three staves per system (voice over a braced piano pair). Page 1 has 3 systems, pages 2 and 3 have 4 each. That is 9, 12, and 12 staves, and 11 systems.

**The desk's runs this session.** Instrument: the reader modules copied from `tools/e16-harness/reader/` at `8fdfcde`, run on the desk's Linux shell with **Poppler** raster at 400 dpi grey (`pdftoppm -r 400 -gray -png`), **OpenCV 5.0.0 and numpy 2.2.6**. These are not the app's raster and not the app's pins, so every number below is to be re-measured on the app's own path (section 3).

| page | staves printed | `detect_staves` today | after the prototype | `select_vocal` after |
|---|---|---|---|---|
| Tchaikovsky 1 | 9 | 9 (fallbacks 1) | 9 | `[0, 3, 6]`, fallbacks 0 |
| Tchaikovsky 2 | 12 | 2 | 12 | `[0, 3, 6, 9]`, fallbacks 0 |
| Tchaikovsky 3 | 12 | raises "contaminated staff group" | 12 | `[0, 3, 6, 9]`, fallbacks 0 |

- **Whole-page rotation does not recover page 2.** At every angle from -1.2 to +1.2 degrees in 0.1 steps, `detect_staves` returns at most 2 staves or raises. Page 3 reaches 11 of 12 at -0.4 degrees.
- **The prototype's traces on page 2:** the middle line of the top staff moves -5 px across the page and the bottom staff's moves +59 px, growing staff by staff. Staff space 29 px.
- **The prototype, `docs/sessions/proto-trace-staves_r1_2026-10-01.py`,** does two things. `trace()` cuts the page into vertical strips three staff spaces wide, finds five rows one staff space apart in each strip, and chains them across strips. `straighten()` fits each chain, then shifts every column so each staff lies level, interpolating the shift between staves. The existing `detect_staves` then runs on the straightened image.
- **The nine other scan pages in the tree** (`tools/e16-harness/robustness-samples/`, `tools/e16-harness/scans/`), same instrument:

| page | today | after the prototype |
|---|---|---|
| `sunless01..._Lamm-Muzgiz1931-Kalmus_p2.png` | 9 staves, `[0,3,6]`, fb 0 | same |
| `sunless01..._RK-Bessel-1908_p2.png` | raises | 9 staves, `[0,3,6]`, fb 2 |
| `sunless04-boredom_RK-Bessel-1908_p3.png` | 9 staves, fb 1 | 9 staves, fb 1 |
| `sunless05-elegy_RK-Bessel-1908_p3.png` | raises | **still raises**, though `trace()` returns 9 chains |
| `sunless06-on-the-river..._p21.png` (staff space 12) | raises | 10 staves, `[0,3,5,8]`; `trace()` returns 14 chains at 12 distinct heights |
| `raster400-1.png`, `raster400-2.png`, `pdfjs400-1.png`, `pdfjs400-2.png` | 9 staves, `[0,3,6]`, fb 0 | same |

  The desk has not looked at these five robustness pages, so their true staff counts are NOT ESTABLISHED.

- **With the Tchaikovsky pages straightened, the next stage halts pages 2 and 3:** `SentinelRaise: sentinel at beams.remove_lines_safe band walk ... 1 accepted row(s) below the corpus concentration envelope K_S=0.2729`, rows `(1974, 0.2636)` on page 2 and `(1845, 0.2465)` on page 3.
- **With that sentinel swallowed in the desk's harness only,** `envelope.run` finishes all three pages: 187 notes, 7 rests, 56 measures, every measure's metre 9/8. Unstraightened, page 1 read 3/8.
- **The prototype splits one staff into two chains** where a run of strips has no five-line hit (Tchaikovsky page 1, system 2, voice staff; page 3, top staff).

## 2. What is established, each line carrying its `path:line`

- `detect_staves` builds candidates from whole-row ink coverage, `rowfrac=(img<128).mean(axis=1)`, and falls back to five 200 px slices with a consensus of three (`reader.py:352-393`, `:306-339`).
- Its own comment records that Poppler passes the Lamm scan's page 2 "by 0.01 of slice fill. That is luck, not margin" (`reader.py`, the comment over `LINE_MERGE`, `:395-445`).
- A staff is returned as five row values, and pitch is computed from them: `position()` (`reader.py:766-769`).
- `select_vocal` takes `group[0]` and counts a fallback when no brace is found or every staff in the system is inside it (`reader.py:659-684`). Its comment calls that case ruled "simply" at Ruling E (`reader.py`, "THE BRACE RULE").
- The worker sums `vocalFallbacks` into the read report as `staffSelectionFallbacks` (`page-reader.worker.ts`, the `DRIVER` string).
- The sentinel is raised from `beams.py:231`, by `substrate.sentinel`.
- A measure with no events abstains, and "the reader never invents an unprinted rest" (`run_page2.py:573-575`, `:594-596`).
- The app rasterizes a PDF at 400 dpi through pdf.js (`apps/web/src/lib/reader/page-pdf.ts:52`; grep only, file not read).
- Pyodide's numpy is 32-bit `intp`; an int64 index array faults only in the browser (`reader.py:245-247`).
- A page read is not stored as its result: the reader runs again over the stored bytes on every reload, and the singer's corrections are a diff keyed by the reader's event ids, built from measure and x (`apps/web/src/lib/score/correction.ts:8-18`).
- Corrections whose event id no longer exists are kept and counted (`correction.ts:673`), and an earlier id scheme was migrated (`correction.ts:644`).

## 3. Measure before you change anything

Report these before writing code.

1. **The app's own baseline.** Run the Tchaikovsky PDF through the app's raster (pdf.js, 400 dpi) and the pinned Pyodide reader. Per page: staves found, `select_vocal`'s result, fallbacks, and any raise. Say how it differs from the desk's Poppler table.
2. **True staff counts** for the five `robustness-samples` pages, by looking at them.
3. **Why the sentinel fires on straightened pages 2 and 3,** and whether it fires when the staves come from the trace on the unstraightened page. The cause is yours to find.
4. **Why the metre read changes from 3/8 to 9/8 on page 1 once straightened.** Report only; do not fix it in this brief.
5. **Whether the 23 render fixture pages and the Lamm fixtures change at all** under your design, measured over each page's full `envelope.run` output.
6. **Read time per page on the app's own path, today,** for the Tchaikovsky PDF and the Lamm scan. The wait is part of the plan's measure.
7. **The event ids on the Lamm fixture pages, before and after your change.** Report how many change. A singer's stored corrections hang on these ids.

## 3a. The desk's rulings on the section 3 report (Fable, 2026-10-02 00:10)

**Read in full:** `report-code-staves-traced-and-straightened_r1_2026-10-01.md`, and `measure-staves_r1_2026-10-01/m3.py` with `m3-tch.json`. Each ruling is a DESK DEFAULT. Where one departs from an older decision, it says which and why (`CONTRACT.md` tether 19).

**The desk's count of what the Tchaikovsky pages print, voice staff only.** Draft truth, read from 200 dpi crops, not yet proofed by Dann.

| page | bars | note heads | per system |
|---|---|---|---|
| 1 | 27 | 40 | not recorded |
| 2 | 35 | 70 | bars 9, 8, 9, 9; heads 18, 17, 19, 16 (the head tied over the barline in system 4 is counted) |
| 3 | not counted | not counted | |

Against that count, the report's three variants read page 2 as 49 heads (linear), 70 (nearest), and 67 (whole-pixel), in 13, 16, and 17 bars. A matching count does not prove the right notes. It does rule linear resampling out. The bars are the next brief.

1. **The staves come from the trace on any page that is straightened.** `detect_staves`' row test is not run again to find them. The five rows of each staff are the traced lines at their levelled heights. Reason: `sunless05_p3` and `sunless06_p21` still raise `contaminated staff group` on the straightened page while the trace finds their staves (report, item 5). Chains at one height whose x-ranges do not overlap are one staff (report, item 1: 10 chains for 9 staves, 13 for 12).
2. **Straighten by whole pixels.** Every pixel moves a whole number of rows and no grey value is computed. Reasons: linear resampling loses note heads (the table in this section); a whole-pixel move commutes with the reader's `img < 128` and gives the same bytes under any cv2; and where every displacement rounds to zero the page is not touched and today's path runs unchanged. That last property is the drift gate: the renders drift at most 0.16 px and every scan page 2.44 px or more (report, item 5), so the render fixtures stay byte-identical with no threshold to choose.
3. **Inside one staff's own band, a column's displacement is one number.** A staff's five lines then keep their spacing and no row inside a staff is doubled or dropped. Between bands the displacement is interpolated, then rounded. `m3.py`'s `int` variant interpolates through the staves as well. Measure both against the desk's count and keep the one that reads more of it; report both.
4. **The band walk's tripwire is re-denoted.** In `beams.remove_lines_safe`, the `substrate.sentinel` call on walk-accepted rows is replaced by a structural test: no accepted row lies farther than half the staff space from its band's seed. That is the bound `_snap_seed` already derives, for the reason it already gives: beyond half the spacing, a row lies in the adjacent rule's basin. A band that breaks the bound raises `WalkRaise`. **This departs from the per-row envelope `K_S` at the band walk** (ratified 2026-07-28; re-derived at N.83 and at N.96, the last ruled by Dann). Reasons, all measured:
   - The envelope is the faintest fringe row seen so far, so every new print lowers it: 0.9737, 0.6428, 0.2809, 0.2729 (`substrate.py`), and 0.2488 on these pages (report, item 3).
   - The row it halts on is the edge of a staff line whose next row measures 0.97 to 1.0 (report, item 3). `allowed` already takes one row beyond each band, so the halt protects no decision.
   - The verdict flips between two whole-pixel warps of one page: 0.2488 raises and 0.2864 passes (`m3-tch.json`, page 2).
   - A walk that swallows the page, the fault of N.83, is caught at once by the new bound.
   `K_S` and the sentinel stay exactly as they are at `reader.detect_staves`' five-line validation (`reader.py:562`). **Do not re-derive `K_S`.** Raise-only changes cannot move a page that reads today; show that on the fixtures anyway.
5. **Report, for every page in the tree:** the lowest walk-row concentration, and the farthest accepted row from its seed in staff spaces. If any page that should read breaks the new bound, stop and report. Do not loosen the bound.
6. **A traced staff narrower than half the page's median staff width is set aside** and counted in the report. This is for the printed example in the footnote of `sunless06_p21`. "Half" is the desk's first value: report every staff's width on that page so the value can be checked.
7. **Event ids: accepted as measured** (36 of 38 on the app's raster of Lamm page 1). No migration is written here. The plan stores the reading in a later phase (plan r4, section 9, item 5).
8. **Not in this brief, and not to be fixed in passing:** the metre read (3/8 read as 9/8, report item 4), the bars (13 to 17 read of 35 on page 2), and why pdf.js and Poppler rasters differ on page 1. The trace reads the app's raster (report, item 1), so the raster question no longer blocks anything.
9. **The scan itself is never altered.** The straightened image is a working copy inside the read (plan r4, principle 2).

## 4. The rulings this serves, and the ones it touches

- **Dann, 2026-10-01 16:07:** *"Yes, this is critical: 'most staves are lost before the rule ever runs' We need to solve this today."*
- **Dann, 2026-10-01 16:08:** *"we must teach Ilya that a vocal line will not always be present. It may serve us to point out that voice lines are usually monodic while piano lines feature chords, generally. Not always, but this is a useful starting place."*
- **Dann, 2026-10-01 15:22 (the Fable brief, Part 2, item 4):** *"Guessing is not a modality for well-constructed software."* The top-staff fallback is the guess he saw in the banner.
- **Dann's brace rule,** quoted in `reader.py` over `select_vocal` (N.59, 2026-08-16). This brief completes it; it does not replace it.
- **TOUCHED, and dated per tether 17:** `reader.py:289-306` quotes E.60 (about 2026-08-19) demoting the slice comb "to a desk instrument" for the PRIMARY path, re-affirmed at N.83 on 2026-08-24. The desk has read that quotation and not E.60 itself. **The desk has told Dann it is recommending a strip trace anyway, on the measurements in section 1.** If your reading of E.60's grounds says the trace must not be primary on renders, keep renders on today's path and say so.
- **TOUCHED, and dated per tether 17:** decision 7 of the Front 3a spec (ratified 2026-07-27), carried at `run_page2.py:573-575`: "the reader never invents an unprinted rest". Section 6 item 4 emits bars of rest for a tacet system, where the voice prints nothing at all. **DESK DEFAULT, on Dann's words of 16:08 today and on the desk's sentence he answered them to** (*"if every staff in the system is inside the brace, there is no voice here, so the voice rests for as many bars as the system holds"*). Decision 7 stands untouched for an empty bar on a voice staff that IS printed. The desk has told Dann this default.
- **The charter's no-machine-learning line** (`tools/e16-harness/reader/README.md`, "What this is") is not touched. The prototype is run-length and projection arithmetic.

## 5. Constraints

- **Edit `tools/e16-harness/reader/` only; `apps/web/static/reader/` is its copy** (`apps/web/scripts/copy-reader.mjs`).
- **Render fixtures stay byte-identical,** or you say exactly which bytes move and why before shipping.
- **The pins hold:** Pyodide v0.26.4, cv2 4.9.0, numpy 1.26.4. Index arrays stay at numpy's default dtype.
- **No oracle in the runtime path.**
- **The prototype is evidence, not a specification.** Its strip width (3 staff spaces), fill (0.55), spacing tolerance (0.18), and quadratic fit are the desk's first values, tested on twelve pages. Derive or replace them. If a different mechanism meets section 6, use it.
- **Event ids do not change on a page whose read does not change.** Where a page now reads differently, ids will move, and that is accepted: the plan stores the reading in a later phase (plan r4, section 9, item 5).
- **Out of scope:** barlines, rests, the metre read, durations, any text, and storing the reading. Those are the next briefs.
- **Do not change `VocalLineEvent`,** and do not touch `apps/web/src/lib/score/reconciliation/`.
- **Displaces:** nothing scheduled moves. N.84's walkthrough French is paused at Dann's word (15:00), and `QUEUE.md` rows 5 to 17 wait behind this.

## 6. Done when

1. **Tchaikovsky, on the app's own path:** 9, 12, and 12 staves; voice staves `[0,3,6]`, `[0,3,6,9]`, `[0,3,6,9]`; zero staff-selection fallbacks; no page refused at the staff or line-removal stage. The line-removal stage is met by section 3a ruling 4, not by a constant.
2. **Every other scan page in the tree** returns its true staff count from step 3.2, and no page returns fewer staves than it does today.
3. **A staff's five lines follow the ink.** A notehead's pitch position is computed against the staff at that notehead's own x, on a straightened image or by an equivalent the report describes.
4. **Tacet.** A system whose staves are all inside the brace yields NO voice staff for that system: no notes are read from it, its bars are counted, and each is emitted as a bar of rest for the voice. The read report says how many systems were tacet. Build a fixture for it; the Tchaikovsky pages have none, so say how you made one.
5. **When the brace cannot decide and the system is not tacet,** two more signs are consulted before any fallback: a line of text under the staff, and one notehead at a time against chords. Report how often each sign agreed on the pages in the tree. If a fallback remains, it is counted as today.
6. **Render fixtures:** byte-identical, per constraint.
7. **Read time per page** is reported beside step 3.6's baseline, and **the count of changed event ids** beside step 3.7's. **Heads and bars read per Tchaikovsky page** are reported beside the desk's count in section 3a.
8. All gates at baseline, or the moved numbers named with the tests that moved them. `WRITTEN` on the code. `DONE` is Dann's walk of the Tchaikovsky PDF on the alias.

## 7. Report back

`docs/sessions/report-code-staves-traced-and-straightened_r1_2026-10-01.md`: the measurements of section 3, the commit, the results against each line of section 6, and **what could not be established. NOT ESTABLISHED beats a complete invented answer.**
