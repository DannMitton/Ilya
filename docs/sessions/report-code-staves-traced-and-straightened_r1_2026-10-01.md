# Report: staves traced and straightened, section 3 measurements

**Written by:** Code (Sonnet 5.5), 2026-10-01 about 23:55. **Brief:** `brief-code-staves-traced-and-straightened_r2_2026-10-01.md`, section 3. **Status: MEASUREMENTS ONLY. No application code has been changed.** Sections 4 and 5 of this report (the build against section 6) are not written, because the build's model is named by Dann after he reads this (`STATE.md`, THE ONE THING, 2026-10-01 about 23:00).

## Provenance of the readings

- Branch `Shane`, HEAD `8fdfcde`. The working tree was dirty with documents only (`git status`: four `docs/memory/` files modified, the rest untracked under `docs/sessions/`). No file under `tools/e16-harness/reader/`, `apps/web/src/`, or `apps/web/static/` was touched, and `apps/web/static/reader/reader.py` is byte-identical to `tools/e16-harness/reader/reader.py` (`md5`).
- **Instrument for every number below unless it says otherwise:** the dev server (`ilya-web`, port 5173) driven by headless Chromium 145 under Playwright on Dann's Mac (arm64). Pages are rasterized by the app's own `rasterizePdf` (`apps/web/src/lib/reader/page-pdf.ts:52`, pdf.js, 400 dpi). The reader runs in Pyodide v0.26.4 with its pinned cv2 4.9.0 and numpy 1.26.4, fetched from the CDN as the Worker does (`page-reader.worker.ts`). Where a number comes from the app's own Worker (`WorkerPageReader`), it says so. Where it comes from a script that calls the reader's functions in Pyodide on the main thread, it says so.
- **What could make this instrument lie, and what I did about it.** (a) A hidden pane throttles timers; headless Chromium has no pane, so read times are unthrottled and are the best case. (b) The prototype is the desk's file, run unmodified apart from removing its `__main__` block and `sys.path` line; its numbers on Poppler's raster reproduce the desk's (page 1: 9 staves, vocal `[0,3,6]`). (c) The 3/8 reading on an unstraightened Poppler page 1 reproduces the desk's statement in the brief, which is the positive control for item 4.
- The scripts and raw JSON are in `measure-staves_r1_2026-10-01/`. `pyrun.mjs` runs any script in the pinned Pyodide; `appworker.mjs` drives the app's own Worker.

## 1. The app's own baseline

**Worker run, the app's real path, three pages chained, clef G2, key 0.** The read report is the banner Dann saw: `pages 3, systems 2, staves 4, notes 47, rests 7, measures 5, staffSelectionFallbacks 2, failedPages [3]`. His read (2 systems, 4 staves, 5 measures, page 3 refused) is reproduced exactly (`tch-worker.json`).

**Per page, `detect_staves` and `select_vocal` on the app's raster (`tch-pyodide.json`):**

| page | staves printed | staves found | `select_vocal` | fallbacks | raise |
|---|---|---|---|---|---|
| 1 | 9 | 2 | `[0]` | 1 | none |
| 2 | 12 | 2 | `[0]` | 1 | none |
| 3 | 12 | none | none | none | `contaminated staff group`, group sizes `[5, 5, 4, 1, 1, 2, 4, 4, 1, 4]` |

**How it differs from the desk's Poppler table.** Page 2 and page 3 agree (2 staves, then a raise). **Page 1 differs: 2 staves on pdf.js's raster against 9 on Poppler's.** The desk's table said page 1 was the one page `detect_staves` already read. On the app's raster it is not. The app's raster is 4910 by 3598 for all three pages. I did not establish why the two rasters differ on page 1.

**For comparison, the trace and straighten prototype on the app's raster** (`m3-tch.json`, linear resampling, the prototype as written): page 1, 10 chains, 9 staves after straightening, vocal `[0,3,6]`, fallbacks 0. Page 2, 12 chains, 12 staves, `[0,3,6,9]`, fallbacks 0. Page 3, 13 chains, 12 staves, `[0,3,6,9]`, fallbacks 0. So the staff and voice-staff lines of section 6 item 1 are met on the app's own raster by the prototype. The line-removal stage is a separate matter (item 3).

## 2. True staff counts, the five `robustness-samples` pages, by looking

I read each page at reduced size (`rb_*.png`, 1500 px tall) and counted systems and staves.

| page | systems | staves printed |
|---|---|---|
| `sunless01..._Lamm-Muzgiz1931-Kalmus_p2` | 3 | **9** (voice over a braced piano pair) |
| `sunless01..._RK-Bessel-1908_p2` | 3 | **9** |
| `sunless04-boredom_RK-Bessel-1908_p3` | 3 | **9** |
| `sunless05-elegy_RK-Bessel-1908_p3` | 3 | **9** (system 2's piano pair is two treble staves) |
| `sunless06-on-the-river..._p21` | 4 | **12**, plus one small five-line staff in the footnote at the bottom right, which is a printed example and not a staff of the song |

Against the desk's earlier table (staves found after the prototype): the Lamm p2 page's 9 and the Bessel p3 boredom page's 9 are right. **The Bessel sunless01 p2 page's 9 is right. The sunless05 page still raises, and the prototype's 9 chains are right. The sunless06 p21 page's 10 staves was wrong: the page has 12**, and `trace()` returned 14 chains on it (12 plus the footnote staff plus one split). The five pages' true counts are therefore 9, 9, 9, 9, 12. I did not read the whole page for a fourth staff on the Lamm p2 page's edge; none is visible.

## 3. Why the sentinel fires on straightened pages 2 and 3

**What the sentinel is.** `substrate.sentinel` (`substrate.py`, the end of the module) raises when a row the band walk has accepted has bridged concentration below `K_S = 0.2729`. That constant is the minimum over a corpus, re-derived at N.83 and again at N.96 (the latter ruled by Dann) every time a new print joined it. It is a halt on a row no measured population contains, not a classifier.

**What fires, measured on the app's raster of page 2, straightened with the prototype's linear resampling.** Three accepted rows: 1887 (0.2544), 1975 (0.2493), 2192 (0.2680). The walk's accepted population on that page is 370 rows; the minimum is 0.2493 (`m3-tch.json`, `walk min conc`).

**What the three rows are** (read from the straightened PNG with `substrate.page_substrate`, in an inline script I did not save): each is the first row of a staff line's upper edge. The row above has 0.10 to 0.13 concentration and 540 to 760 dark pixels; the row itself has 1900 to 1960 dark pixels broken into 165 to 193 runs, the longest 74 to 109 pixels; the row below has 0.97 to 1.0 concentration and 2800 to 2870 dark pixels. So it is the partly inked fringe of a thick scan line. The walk accepts it because its membership band is wide: a row is a member when its principal bridged extent is within `T_REL = 0.79327` of the staff's extent (`beams.py`, `_extent_consistent`), which admits any row whose extent is at least 21 percent of the staff's. The sentinel then refuses it because the row's principal run holds only about a quarter of its ink.

**Does it fire because of straightening? No, measured.** The same kind of row appears on pages that are not straightened. Of the five pages in `robustness-samples` and the Lamm scan's own page 2, after the prototype: the sentinel halts `sunless01_RK-Bessel_p2` (4 rows, the lowest 0.2575), `sunless04_RK-Bessel_p3` (2 rows, the lowest 0.2695), and the app's raster of Lamm page 2 (1 row, 0.2717). Each sits below `K_S` by 0.002 to 0.024. The straightened Tchaikovsky page 3 passes (minimum 0.3031 with linear resampling, 0.2871 nearest, 0.2778 with integer shifts). The desk's Poppler page 3 did not pass (0.2465), so the margin on page 3 is raster-dependent and within 0.03 either way.

**The resampling moves the verdict.** On page 2: linear and nearest resampling raise on 3 rows (0.2493 and 0.2488); integer column shifts pass (minimum 0.2864). A change of the interpolation changes whether the page halts, and also changes the read: page 2 reads 49 notes in 13 measures with linear, 70 notes in 16 measures with nearest, and 67 in 17 with integer shifts (all from the recorded run; `m3-tch.json`). I have no truth for these pages, so **which count is nearer to the truth is NOT ESTABLISHED.** Resampling is therefore not a neutral step.

**Whether it fires when the staves come from the trace on the unstraightened page: yes, and much harder.** I fed `remove_lines_safe` the five rows per staff from each traced chain (the median of each line's rows) on the unstraightened page. Page 1 passes. **Page 2 raises with 113 rows below `K_S`** (lowest 0.1889), and **page 3 raises with 11 rows** (lowest 0.2351). On a tilted page one row cuts a line at an angle, so its principal run is a fragment. That is why the walk needs a level page and why straightening is needed at all.

**What this means for the build, stated as a fact and not as a ruling.** `substrate.py` already says to re-derive `K_S` whenever the corpus changes, and it was done twice (N.83, N.96). The Tchaikovsky pages and the three robustness pages are a new corpus. The lowest row measured across them is 0.2488, so a re-derivation by the module's own rule would land at about 0.24 (truncated to four figures). `K_S` only ever lowers a halt threshold, so no render page can newly raise; I have not run the re-derivation and have not changed the file.

## 4. Why the metre changes from 3/8 to 9/8 on page 1 once straightened

Report only, as the brief says.

- **The printed signature is 3/8** (I read it on page 1, the first system, clef and two sharps then a stacked 3 over 8).
- **The reader's 9/8 comes from the first system's start window** (x from 0 to the first barline at 1187, `m4-p1.json`): one validated stack, `9/8`, unflagged. No other window hit. Every measure after it inherits 9/8 (`source: inherited`).
- **The cause is the digit matcher's choice of "9" over "3".** At the numerator's position the template scores, on the app's raster straightened with linear resampling, are 9 at 0.482 and 3 at 0.395 (`m5.json`). The denominator reads 8 at 0.694. The stack pairing then makes 9/8. There is also a spurious "1" at x 658 in both bands, which is rejected as 1/1 (beat type 1 is not legal).
- **It is raster- and resampling-sensitive, not a clean effect of straightening.** On Poppler's raster of page 1 (`m6.json`): unstraightened, 3 scores 0.664 and 9 scores 0.588 (reads 3/8, a margin of 0.076); straightened with linear resampling, 3 scores 0.568 and 9 scores 0.584 (reads 9/8, a margin of 0.016 the wrong way); straightened with nearest or integer shifts, 3 scores 0.395 and 9 scores 0.482 (9/8) (`m7.json`). So on the one page where a clean 3/8 was ever read, straightening lowers the "3" score by 0.1 to 0.27 and barely moves the "9". The digit templates are the Leipzig render font (`timesig.py`, `render_digit`), and the 1878 engraver's 3 is nearer to the Leipzig 9 than to the Leipzig 3 on this page.
- **On the app's raster, unstraightened, no metre was ever read:** `detect_staves` finds 2 staves, so there is no first system to search, and the 4/4 Dann saw is what the app showed when no signature was read (I did not trace where the 4/4 comes from). Page 1 therefore moves from a missing signature to a wrong one, not from a right one to a wrong one.
- **NOT ESTABLISHED:** why the straightened "3" scores lower. I did not separate a row-window effect (the band is cut at the staff's top and middle rows, which move when the staves are levelled) from a blurring effect. The metre read is the next brief's, per section 5.

## 5. Whether the 23 render fixtures and the Lamm fixtures change under the design

The design measured is the prototype as written: trace the staves, straighten always, then run the existing `envelope.run`. For each page I compared the full `envelope.run` output (a sha256 over the whole canonical `ro`, ids included) before and after. Run in the pinned Pyodide (`m5fx.json`).

**The 23 render fixtures**

- **17 are unchanged by construction**: the straightened image is byte-identical to the input (maximum drift 0.0 px), so the read is the same read.
- **4 straighten to a different image but read identically** (maximum drift 0.08 to 0.16 px; digests equal): sunless-01 p1, sunless-02 p2, sunless-05 p1, sunless-06 p1.
- **2 MOVE: sunless-06 p6 (drift 0.09 px, 2 of 34 ids differ) and sunless-06 p7 (drift 0.13 px, 1 of 26 ids differs).** A sub-pixel resample moves a note's x by a pixel.
- **So "straighten always" does not meet "render fixtures stay byte-identical". A gate does.** The measured maximum drift is 0.0 to 0.16 px on the renders and 2.44 px or more on every scan page in the tree (3.26, 3.53, 9.03, and 10.01 on the Lamm scan pages; 2.44 on the Lamm robustness page; 6.18, 15.66, 18.12, and 10.32 on the other four robustness pages; 17.5 on Poppler's Tchaikovsky page 1). A threshold anywhere from 0.5 to 2 px separates the two populations with a wide margin. I have not applied a threshold; that is a design step in the build, to be derived and not copied from this paragraph.

**The Lamm fixtures change, by design.** Straightened, the four Lamm pages read differently:

| page | notes before | notes after | ids before not in after | note |
|---|---|---|---|---|
| `raster400-1` | 47 | 45 | 15 of 47 | |
| `raster400-2` | 54 | 51 | 18 of 54 | measures 9 to 8 |
| `pdfjs400-1` (the app's own raster) | 38 | 49 | 36 of 38 | measures 7 to 8 |
| `pdfjs400-2` (the app's own raster) | 37 | not read | | halts on the sentinel, one row at 0.2717 |
| `sunless01..._Lamm_p2` (robustness) | 48 | 50 | 17 of 48 | |

**I have no truth file for the Lamm pages' voice notes, so whether the straightened read is closer to the truth is NOT ESTABLISHED.** The phase 0 truth files and scorer are what settle it. The constraint "ids do not change on a page whose read does not change" is met on the 17 plus 4 render pages, and the pages whose reads change are the scans.

**The other robustness pages after the prototype:** `sunless01_RK-Bessel_p2` and `sunless04_RK-Bessel_p3` halt on the sentinel (item 3), and `sunless05_p3` and `sunless06_p21` still raise `contaminated staff group` (a group of 7 lines on each). Neither is solved by the prototype and the build must say so.

## 6. Read time per page on the app's own path, today

The app's own Worker, headless Chromium, no throttling, 400 dpi. Two reads in one Worker (`tch-worker.json`, `lamm-worker.json`).

| file | rasterize | Worker warm-up (Pyodide, numpy, cv2, matplotlib, reader) | read, first call | read, second call |
|---|---|---|---|---|
| Tchaikovsky, 3 pages (2 read, 1 refused) | 2.3 s | 7.0 s | `readSeconds` 8.3 s (wall 15.3 s with the warm-up) | 7.8 s |
| Lamm scan, 2 pages | 1.7 s | 5.0 s | 16.0 s (wall 21.1 s with the warm-up) | 15.6 s |

Per page, the main-thread run of `envelope.run` was 4.2 s for Tchaikovsky page 1 and 3.6 s for page 2 on 2 staves each, which is why the baseline is fast: it reads very little. On the straightened pages, which the reader actually reads in full, a page takes about 7 s (page 1, 9 staves) to 10.5 s (page 3, 12 staves) per `envelope.run`. Trace costs 0.04 s per page and straightening 0.15 to 0.26 s. These straightened-page figures come from a script that ran `envelope.run` twice per variant, so I halved the totals; they are indicative, and the build's report measures them on the Worker.

## 7. Event ids on the Lamm fixture pages, before and after

An id is `r{measureIndex}-{x}` (`reader-ids.test.ts` states the shape; sample ids `r0-1265`, `r1-543`, `r10-3493`). A stored correction hangs on that id (`correction.ts:8-18`).

The Lamm PDF through the app's Worker today reads 75 notes in 11 measures across 2 pages (`lamm-worker.json`; first ids `r0-1265, r0-1734, r0-2059, r1-543`). After a straightening step, per page (table in item 5): `pdfjs400-1` loses 36 of its 38 ids, `raster400-1` 15 of 47, `raster400-2` 18 of 54, and the robustness Lamm page 2 loses 17 of 48. **A page that gets straightened will lose most of its ids, as the brief predicted and accepted** (constraint, "Where a page now reads differently, ids will move"). On the render fixtures a gate removes any change. On a chained read, a change in one page's measure count shifts every later page's id prefix as well; I measured pages one at a time and did not run the chained read after a change.

## What could not be established

- Why pdf.js's raster of Tchaikovsky page 1 yields 2 staves where Poppler's yields 9.
- Which resampling produces the note count nearest the truth. Page 2 reads 49, 70, or 67 notes depending on the interpolation, and no truth file exists for any Tchaikovsky or Lamm page.
- Whether the straightened Lamm reads are better or worse than today's. The scorer and truth files are phase 0 and do not exist yet.
- Why the straightened "3" scores lower than the unstraightened one (row window against blur).
- The two raise cases the prototype does not fix (`sunless05_p3`, `sunless06_p21`), whose causes I did not examine beyond the group sizes.
- E.60's own grounds. I did not read E.60; the brief says the desk has not either.
- Read times on a phone, on a hidden Browser pane, or on a machine other than this Mac.

## State and next step

- **No code was changed. Nothing was committed or staged.** The harness scripts are the only new files, in `measure-staves_r1_2026-10-01/`, which Dann must `git add` before any ship (`CONTRACT.md` §5).
- The staging copies I put in `apps/web/.svelte-kit/fx/` (gitignored) are removed. The dev server `ilya-web` is still running on port 5173.
- **Waiting on Dann:** the build's model, as `STATE.md` says (he pastes the usage screen when the measurements return). The measurements above bear on the design, and I have put each as a fact; the three that the build will turn on are the `K_S` re-derivation (item 3), the drift gate (item 5), and the sensitivity of the read to the resampling (items 3 and 5).

---

# Build against brief r3 (2026-10-02)

**Written by:** Code (Sonnet 5.5), 2026-10-02. **Brief:** `brief-code-staves-traced-and-straightened_r3_2026-10-02.md`. **Status: WRITTEN.** The code is in the working tree, uncommitted. `DONE` is Dann's walk of the Tchaikovsky PDF on the alias. All eight gates are at baseline (item 8). The earlier "state and next step" paragraph above is superseded by this section.

## What changed, by file

| file | change |
|---|---|
| `tools/e16-harness/reader/reader.py` | `trace_staves`, `straighten_whole_pixel`, `find_staves` (ruling 1, 2, 3, 6); `select_voices` with the tacet system and the two signs (section 6 items 4 and 5); `detect_tacet_barlines`; `read_page_geometry` and `probe_clef_key` call `find_staves`; the geometry dict gains `trace` and `voices` |
| `tools/e16-harness/reader/beams.py` | the band walk's `substrate.sentinel` call replaced by the half-staff-space bound (ruling 4); `WALK_STATS` counts the lowest walk-row concentration and the farthest accepted row (ruling 5) |
| `tools/e16-harness/reader/run_page2.py`, `envelope.py` | systems are counted in page order; a tacet system's bars are counted and each is emitted as a rest event for the voice, with the measure's length once the metre is resolved |
| `apps/web/src/lib/reader/page-reader.worker.ts`, `recognized.ts` | additive: `tacetSystems` in the read report, and `systems` counts tacet systems. This is outside the reader directory; the read report cannot say how many systems were tacet (section 6 item 4) without it. The field is optional, so no existing report or test changes |

`K_S` and `substrate.sentinel` are untouched, and still bind at `detect_staves`' five-line validation. `VocalLineEvent` and `reconciliation/` are untouched. `apps/web/static/reader/` is refreshed by `copy-reader.mjs` and is gitignored.

## Section 6, line by line

**1. Tchaikovsky on the app's own path: MET.** The app's Worker, three pages chained, clef G2, key 0: `pages 3, systems 11, staves 33, staffSelectionFallbacks 0, tacetSystems 0, failedPages []` (`tch-worker2.json`). Per page, on pdf.js's raster in pinned Pyodide: page 1 9 staves, voice `[0,3,6]`; page 2 12 staves, `[0,3,6,9]`; page 3 12 staves, `[0,3,6,9]`; fallbacks 0 on all three (`m8d.json`). No page is refused at the staff or line-removal stage. Before: 4 staves, 2 fallbacks, page 3 refused.

**2. Every other scan page in the tree: MET.** True counts are 9, 9, 9, 9, 12 (item 2 above). Read: `Lamm_Kalmus_p2` 9, `RK-Bessel sunless01 p2` 9, `RK-Bessel sunless04 p3` 9, `RK-Bessel sunless05 p3` 9, `sunless06 p21` 12, voice staves `[0,3,6]` or `[0,3,6,9]`. The Lamm scan (`raster400-1`, `-2`, `pdfjs400-1`, `-2`) stays at 9 each. No page returns fewer staves than before. Fallbacks (brace could not decide): 2 on `RK-Bessel sunless01 p2`, 0 on every other scan page.

**3. A staff's five lines follow the ink: MET by the equivalent.** The reader's pitch arithmetic is unchanged. Every later stage reads a whole-pixel straightened working copy on which each staff's five rows are levelled (`G['img']`, `G['staves']`), so a notehead's position is computed against the staff's rows at that notehead's own column. The scan is never altered (ruling 9).

**4. Tacet: MET, with one stated limit.**
- A system with a brace and no staff outside it has no voice staff. `select_voices` lists it in `order` as `None`; no note is read from it; its barlines are counted from its own staves; each bar is emitted as a rest event (`tacet: true`) whose duration is the measure's, once the envelope has resolved the metre. If the metre abstained, the duration abstains and says why.
- The read report carries `tacetSystems`.
- **Fixtures, made by erasing the voice staff:** from the app's raster of Tchaikovsky page 1, the voice staff, its lyric line, and its notes are painted white from the staff's left edge on, for system 2 (`mk_tacet.py`); the brace and the system barline stay. Result: `order [0, null, 1]`, `tacetRef [3]`, vocal `[0, 5]`, 8 bars of rest read for the 9 printed, each 9/8 and integrity `False` (its length equals the measure's). The same on the Lamm scan's page 1: 3 bars of rest, 3/2. A third fixture erases all three voice staves of Tchaikovsky page 1: `vocal []`, `order [null, null, null]`, 3 tacet systems, no crash, metre abstained (no voiced system to search).
- **A brace that the first staff's edge hides:** on the first fixture the brace was not found at first, because a piano staff's left edge lands on the brace's tip and the brace window then sits left of the brace. `select_voices` now tries again from the system barline (`_system_barline_x`) when the first look finds no brace. It runs only where the first look found nothing, so no decided system moved.
- **Limit:** the bars are counted with `detect_tacet_barlines`, which takes the best of four readings (components the height of the system or of its first staff, and solid-stroke columns). The existing barline finder lost all but one barline of a piano system on this scan, which is the bars brief's problem. The count on the fixture is 8 of 9 printed.

**5. The two more signs: MET as a measurement, and the finding is that they cannot decide alone.**
- **Text** (a line of marks on one baseline under the staff) and **chord** (fraction of head columns with two or more heads), `sign_scores`. Constants (`SIGN_*`) are first values, each in the code with its meaning.
- **Agreement with the known voice staff over every system of two or more staves in the tree** (the Lamm scan counted once; `m9b.json`):

| population | systems | text right / abstained / wrong | chord right / abstained / wrong | both agree | both agree and wrong |
|---|---|---|---|---|---|
| scans, brace decided (truth is the brace) | 35 | 22 / 13 / 0 | 11 / 24 / 0 | 6 | 0 |
| scans, brace cannot decide (truth read by looking) | 4 | 4 / 0 / 0 | 2 / 2 / 0 | 2 | 0 |
| render fixtures, brace cannot decide (voice is staff 0) | 83 | 15 / 62 / **6** | 30 / 47 / **6** | 1 | 0 |

- **So the signs vote only together.** On the renders a pedal mark reads as a line of text, and a piano part written as single notes reads as monodic; either sign alone named the wrong staff 6 times of 83, and a first version that let the chord sign decide alone moved one render fixture (`sunless-05` page 1) and was replaced. They never agree on a wrong staff in 124 systems. Where they agree, the system is decided; where they differ or one abstains, staff 0 is taken and counted, as before.
- **How often each sign agreed with the brace, on the scans where the brace decided:** text 22 of 35 systems (13 abstained, none wrong); chord 11 of 35 (24 abstained, none wrong).

**6. Render fixtures: MET.** All 23 render pages give the same `envelope.run` output, a sha256 over the whole canonical `ro` with ids, as before the change (`m8d.json`, `m8e.json` against `m5fx.json`). Ruling 2's property holds: on a render every displacement rounds to zero, so the image is not touched and today's path runs. Nothing moved.

**7. Read time, changed ids, heads and bars.**
- **Read time, the app's Worker, headless, unthrottled, two reads in one Worker.** Tchaikovsky, 3 pages: `readSeconds` 31.5 s then 31.0 s (before: 8.3 s and 7.8 s, which read 2 staves on each of 2 pages and refused the third). About 10 s a page, in line with the 7 to 10.5 s the report measured on a straightened page. Lamm, 2 pages: 16.5 s then 16.1 s (before 16.0 s and 15.6 s). Worker warm-up 1.8 to 1.9 s this time (7.0 and 5.0 s before: the browser's cache was warm). The trace cost 0.04 s a page in the earlier prototype run; I did not time the whole-pixel straightening on its own, and it is inside the 10 s a page.
- **Changed ids.** Lamm PDF through the Worker: 75 ids before, 80 after; 73 of the 75 old ids are gone. Page by page (page-local): `pdfjs400-1` 36 of 38, `pdfjs400-2` 27 of 37, `raster400-1` 10 of 47, `raster400-2` 16 of 54, `Lamm_Kalmus_p2` 44 of 48. Accepted as measured (ruling 7); no migration written. On the 23 render pages: none change.
- **Heads and bars per Tchaikovsky page, beside the desk's draft count** (voice staves only; "heads" is `notes` of type note; bars are the reader's measure count, which the bars brief owns):

| page | desk heads | read heads | desk bars | read bars |
|---|---|---|---|---|
| 1 | 40 | 36 (and 6 rests) | 27 | 23 |
| 2 | 70 (18, 17, 19, 16 by system) | 86 (24, 19, 26, 18 by system) | 35 | 20 |
| 3 | not counted | 76 | not counted | 16 |

  Page 2 over-reads by 16. I looked at the circled heads on systems 1 and 3 of page 2: the extra marks are the flags of eighth notes, which the filled-head matched filter takes for heads on the 1878 plate (the staff finder is not involved). That is the notehead finder's behaviour and is outside this brief (ruling 8). Under-reading of bars (20 of 35) is the barline finder's. A matching count does not prove the right notes, and these do not match.

**8. Gates: MET.** The eight gates, run on the working tree: 1 phonology 251, 2 dictionary 235, 3 web-check 0 errors and 12 warnings in 5 files, 4 web-test **1784**, 5 score-parser 636 passed and 5 skipped, 6 blurb 145, 7 integration 55, 8 ratchets OK. **Gate 4 first failed once**: `reader-ids.test.ts` slices `run_page2.py` between `segev = sorted(` and the first `msum[mi] =`, and my tacet branch put an `msum[mi] =` before the first. I rewrote that line as `msum.update(...)`. It is back at 1784, and `reader-ids.test.ts` also asserts that the served copy of `run_page2.py` equals the source, which holds. `ilya-ship.sh` was not run; it refuses on the untracked files.

## The rulings of section 3a, one by one

1. **The staves come from the trace on a straightened page: DONE.** The five rows are the traced lines at their levelled heights. Chains at one height whose x-ranges do not overlap are merged (a staff split by a run of strips with no five-line hit). **Addition, measured:** a shorter chain that overlaps a longer one in x and lies within 3.5 staff spaces of its middle line is dropped as the same staff seen wrongly (three such chains on `sunless06 p21`, one on `sunless05 p3`). Without it those two pages read 15 and 11 chains and the walk halted on a staff that was not there. Two real staves are never closer than the height of one (4 spaces).
   **Where `detect_staves` finds more staves on the page as printed than the trace does, today's path is kept** and `trace.fallback` says so. It never fired on any page in the tree. It is my DESK DEFAULT for "no page returns fewer staves".
2. **Straighten by whole pixels: DONE.** Every pixel moves a whole number of rows; no grey value is computed. Where every displacement rounds to zero the page is untouched. Measured maximum whole-pixel displacement: 0 on every render; 3 (Lamm) to 37 (Tchaikovsky page 2) on the scans.
3. **One displacement inside a staff's band: DONE, both variants measured.** `band` gives a staff's band (its five lines and one staff space either side, capped to half the gap to its neighbour) one number per column and interpolates between bands; `interp` interpolates through the staves' middle lines as `m3.py`'s `int` did. Heads and bars on page 2 against the desk's count:

| variant | page 1 heads / bars | page 2 heads / bars | page 3 heads / bars | page 2 heads by system (desk 18, 17, 19, 16) | lowest walk-row concentration, pages 1 to 3 |
|---|---|---|---|---|---|
| `band` | 36 / 23 | 86 / 20 | 76 / 16 | 24, 19, 26, 18 | 0.313, 0.243, 0.294 |
| `interp` | 36 / 23 | 82 / 19 | 76 / 17 | 23, 19, 26, 18 | 0.313, 0.280, 0.275 |

   The counts do not separate them: `interp` reads 4 fewer heads on page 2, all of them false, and `band` one more bar. **I kept `band`** because it keeps a staff's five lines exactly level and exactly spaced inside the band, which is what section 6 item 3 asks for. If Dann prefers `interp`, it is the one constant `STRAIGHTEN_MODE`.
4. **The band walk's tripwire: DONE as ruled.** `beams.remove_lines_safe` raises `WalkRaise` if an accepted row lies more than half a staff space from its band's seed. `K_S` was not re-derived. Over every scan page in the tree the farthest accepted row is at most 0.167 staff spaces from its seed (the bound is 0.5), and a page that swallows the whole page breaks it at once.
5. **Per page, the lowest walk-row concentration and the farthest row from its seed, in staff spaces** (`m8d.json`):

| page | lowest concentration | farthest row, staff spaces |
|---|---|---|
| Tchaikovsky 1 / 2 / 3 | 0.313 / 0.243 / 0.294 | 0.107 / 0.138 / 0.143 |
| Lamm `raster400-1` / `-2` | 0.299 / 0.288 | 0.133 / 0.133 |
| Lamm `pdfjs400-1` / `-2` | 0.297 / 0.296 | 0.133 / 0.133 |
| `Lamm_Kalmus_p2` | 0.327 | 0.136 |
| `RK-Bessel sunless01 p2` | 0.239 | 0.095 |
| `RK-Bessel sunless04 p3` | 0.271 | 0.143 |
| `RK-Bessel sunless05 p3` | 0.250 | 0.143 |
| `sunless06 p21` | 0.340 | 0.167 |
| the 23 render pages | 0.9764 or higher | 0.048 at most |

   No page that should read breaks the bound.
6. **A traced staff narrower than half the page's median width is set aside and counted: DONE.** The count is in `G['trace']['setAside']` (it is in the geometry dict, not yet in the read report). **On `sunless06 p21`** the 12 staves' widths are `1224, 1224, 1116, 1224, 1080, 1224, 1224, 1188, 1224, 1224, 1224, 1224` (median 1224, so the set-aside line is 612). **The footnote's printed example is not among them: the trace never found it** (it is drawn at a smaller scale than the page's 12 px staff space, so its five rows do not match a spacing of 12 within 0.18). So on this page the narrow rule had nothing to set aside once the same-staff chains were dropped; before that, chains of 180 and 288 px were set aside by it. Whether the rule would catch the footnote at some other scale is NOT ESTABLISHED.
7. **Event ids accepted as measured: DONE** (item 7 above).
8. **Left alone, as ruled:** the metre read, the bars, the pdf.js against Poppler difference. Page 1 of Tchaikovsky still reads 9/8 for a printed 3/8 (`G`'s first measure inherits it).
9. **The scan is never altered: DONE.**

## What could not be established

- **Whether any of these reads is right**, as distinct from counted. There is no truth file for any page (phase 0's), and the desk's count is draft and unproofed.
- Which of `band` and `interp` reads more of the true notes. The counts cannot say.
- Whether the footnote staff of `sunless06 p21` would be set aside by the narrow rule, since the trace never finds it.
- Whether the tacet bar count is right on a real tacet page: the fixtures are Tchaikovsky and Lamm pages with the voice painted out, 8 of 9 and 3 of an unknown number printed. No real page in the tree has a tacet system.
- The text and chord signs' behaviour on repertoire that is not in the tree (a printed piano-only system with a text line, say).
- Read time on a phone, on a hidden Browser pane, or on a machine other than this Mac.
- Whether the trace's strip width (3 staff spaces), fill (0.55), and spacing tolerance (0.18) hold on prints unlike these 34 pages.
- The brief's one-line reading of E.60: I did not read it. Renders stay on today's path because nothing moves on them, so the question of whether the trace may be primary on renders does not arise.

## State

- Code is `WRITTEN`, uncommitted. **Dann must `git add` the new files before any ship:** `docs/sessions/measure-staves_r1_2026-10-01/` and the report. The reader and web edits are tracked modifications.
- `QUEUE.md` row 18 updated.
- I removed `apps/web/.svelte-kit/fx/` (my staging). The `ilya-web` dev server is still running on port 5173, with `apps/web/static/reader/` at the new reader.
- **The walk:** `~/Downloads/Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf` on the alias after a ship, or on `localhost:5173` now. Expect 11 systems and 33 staves, no page refused, no fallbacks. Expect also the wrong 9/8, too many heads on page 2, and too few bars, which are the next briefs'.
