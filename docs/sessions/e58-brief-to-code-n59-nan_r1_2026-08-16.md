# BRIEF: N.59, the NaN that crashed the read, and the staff space that survives rotation

For the Claude Code session pointed at `~/Desktop/ilya-rewrite`. Written by the
coordinating desk, E.58, 2026-08-16, after Dann walked increment 1 on a real
photograph of his own score and it failed three times.

Every claim below carries a `path:line`, a run, a measurement made this session,
or a paper citation. Where a ruling is mine I say so and give the grounds.

**NOT ESTABLISHED beats a complete invented answer.**

---

## 0. What happened, so you are not solving the wrong problem

Dann photographed page 32 of Kabalevsky op. 52 no. 9 with his iPhone and uploaded
it to `383f368`. Three attempts, all refused. The dropzone said *"Ilya could not
read this page. A flat, straight photograph of the whole page reads best."*

**That message is a guess.** The console, once its filter was cleared, carried this:

```
File "/home/pyodide/envelope.py",  line  80, in run
File "/home/pyodide/run_page2.py", line 121, in run
File "/home/pyodide/reader.py",    line 654, in read_page_pitch
File "/home/pyodide/reader.py",    line 507, in read_page_geometry
    bw, nl = remove_lines(img, s, staves, cfg.get("png"))
File "/home/pyodide/reader.py",    line 409, in remove_lines
File "/home/pyodide/beams.py",     line 163, in remove_lines_safe
    hk = cv2.getStructuringElement(cv2.MORPH_RECT, (int(1.7 * s), 1))
ValueError: cannot convert float NaN to integer
```

Preceded by `RuntimeWarning: Mean of empty slice` from
`numpy/core/fromnumeric.py:3504`.

**`s` is NaN.** `detect_staves` has an honest failure at `reader.py:200`,
`raise RuntimeError("no staff lines")`, and never reached it. It found some rows,
produced a degenerate `diffs`, took `np.median` of an empty array at
`reader.py:209`, and returned NaN. That NaN travelled four frames before anything
noticed, and what noticed was `int()`.

**The reader did not report that it could not find staves. It crashed on
arithmetic and the UI invented a reason.**

### The mechanism, measured, not inferred

`reader.py:197` is `rowfrac = (img < 128).mean(axis=1)`: the fraction of dark
pixels per row **across the entire image width**. That is a full-page horizontal
projection. It only equals "this row is a staff line" when the page is square to
the frame and nothing but page is in the frame.

Measured on Dann's photograph (`~/Downloads/IMG_5162.HEIC`, HEIF, 3024 x 4032)
this session, in this container, not on his machine:

| what | value |
|---|---|
| luma p1 / median / p95 | 4 / 187 / 228, so ink and paper are well separated |
| true staff space `s` | **17.0 px**, found at five separate x positions |
| page rotation | **1.04 degrees** |
| top staff line drift | **29 px across 1,600 px**, which is 1.7 staff spaces |

The measurement that matters: **`s = 17.0` was recovered from the untouched,
tilted photograph by projecting rows within 200 px wide vertical slices instead
of across the whole width.** One degree over 200 px moves a line 3.5 px, well
under one staff space. The information was always in the image. The instrument
averaged it away.

Independent confirmation that this family of algorithm is the fragile one: Dalitz,
Droettboom, Pranzas, and Fujinaga, *A Comparative Study of Staff Removal
Algorithms*, IEEE TPAMI 30(5), 2008, say of Fujinaga's projection method that
*"it is essential that the stafflines are not rotated nor curved"*, which is why
it deskews per strip before projecting. PDF:
`http://lionel.kr.hs-niederrhein.de/~dalitz/data/publications/tpami-staffremoval.pdf`

---

## 1. The reproducer, which already exists on Dann's machine

`~/Downloads/score-page32-deskewed.png` (2830 x 3740, greyscale PNG).

This is Dann's photograph rotated by the measured 1.04 degrees and cropped to the
page. Nothing else was changed: not the contrast, not the scale, not the
greyscale conversion. **It still produces the NaN**, which is what makes it the
right reproducer: it isolates the crash from the rotation.

`~/Downloads/IMG_5162.HEIC` is the original. Chromium on the desktop refuses it at
`createImageBitmap` and shows `upload.err.imageUndecodable` correctly, so it never
reaches the reader on a Mac. To use it from Python, convert outside the repository
with macOS's own tool:

```
sips -s format png ~/Downloads/IMG_5162.HEIC --out ~/tmp/n59/IMG_5162.png
```

---

## 2. What to build. Three steps, and the third is not yours

### Step 1. Guard the NaN. `detect_staves` must fail the way it already knows how.

At `reader.py:205-209`:

```
lines = np.array(lines)
diffs = np.diff(lines)
intra = diffs[diffs < np.median(diffs) * 1.6]
s = float(np.median(intra))
```

Every one of these can degenerate. `lines` of length 1 gives an empty `diffs`;
`np.median` of an empty array is NaN; `diffs < NaN` is all False, so `intra` is
empty; `np.median` of that is NaN again. Two silent NaNs, no exception.

**The fix is not a new failure mode.** `reader.py:200` already raises
`RuntimeError("no staff lines")` and `ScoreUploader.svelte:428` already maps the
resulting failure to a string. Extend that guard so a non-finite or implausible
`s` raises the same way, before anything downstream consumes it.

*Proof:* feed `score-page32-deskewed.png` through the worker and observe
`RuntimeError("no staff lines")` in the console instead of
`ValueError: cannot convert float NaN to integer`. Report the exact text you see.

**Also assert the invariant where it is consumed.** `beams.py:163` computes
`int(1.7 * s)`. Whatever guard you add upstream, a reader that reaches that line
with a non-finite `s` is a bug either way.

### Step 2. Estimate `s` from vertical run lengths, as a FALLBACK, not a replacement.

**The method.** Cardoso and Rebelo, *Robust Staffline Thickness and Distance
Estimation in Binary and Gray-Level Music Scores*, ICPR 2010,
DOI 10.1109/ICPR.2010.458. Run-length encode each column of the binarized image
into alternating black and white runs. The modal black run is the staff line
thickness; the modal white run is the staff space.

Their own words: *"These estimates are also immune to severe rotation of the
image."* They are a per-column measurement and never sum ink across the page
width, which is precisely the operation that returned NaN.

**Use the paired-sum variant, not the naive one.** The same paper reports the
naive version failing measurably on a degraded score: it returned line height 1
and space height 1 against true values of 5 and 19, defeated by isolated black
pixels and by fluctuation in line thickness. Their fix is to histogram the
**sum of a black run and its adjacent white run**, because a local thickness
fluctuation is usually compensated by an opposite fluctuation in spacing. The
naive version would pass on every scan in the corpus and fail on exactly the
photographs we are trying to read, which is the bug we are already fixing.

**MY RULING, with grounds: this goes in as a fallback triggered only when the
existing estimator returns a non-finite or implausible `s`, not as the primary
estimator.** Grounds: the 23 fixture pages all read today, and their `ro` output
is the baseline every downstream number rests on. A new primary estimator could
shift `s` by a fraction of a pixel on every one of them and move measurements
nobody asked to move. A fallback that never fires on a working page cannot do
that. If Dann later rules it primary, that is a separate change with its own
before-and-after.

*Proofs, all three required:*

1. **Every existing fixture is byte-identical.** Run the corpus before and after.
   The fallback must never fire on a page that reads today. State how many pages
   you ran and confirm zero fired.
2. **`ilya-test-page.png` is unchanged**: staves 8, s 21.0, 37 notes, per Code's
   own E.57 measurements.
3. **The photograph now yields a finite `s`.** Run `score-page32-deskewed.png`
   and report the `s` the fallback produces. **The hand measurement is 17.0 on
   the unrotated original.** If your number is far from that, report the
   difference as a finding and do not reconcile it.

Whether the read then SUCCEEDS is not part of this step's definition of done. A
finite `s` followed by an honest "no staff lines" is a pass. Say which you got.

### Step 3. NOT YOURS. The copy, and whether Ilya accepts photographs at all.

`i18n.ts:309` currently reads *"Ilya could not read this page. A flat, straight
photograph of the whole page reads best."* It asserts a cause the code has not
established, and tonight it sent this desk chasing tilt for an hour.

**Do not rewrite it, and do not write any French.** Dann has not seen new French
and CONTRACT forbids it. Flag in your report that the string claims knowledge the
code does not have, and stop there. Whether the message changes, and whether Ilya
should offer photograph import in the beta at all, is a product ruling Dann owns.

---

## 3. Explicitly out of scope, so nobody drifts

- **Stable Paths** (Cardoso, Capela, Rebelo et al., IEEE TPAMI 31(6), 2009) was
  investigated in full this session and **ruled out on cost, not on merit**. Its
  graph is column-monotone, one pixel per column, so the dynamic programme cannot
  be vectorized across columns: roughly 3,000 to 4,000 Python-level loop
  iterations per sweep, two sweeps per round, four to six rounds, under CPython in
  WASM. No absolute runtime is published, and no faithful numpy reimplementation
  exists to port from. See `e58-research-stable-paths_r1_2026-08-16.md`.
- **Making `detect_staves` strip-wise.** It works, it is the right long-term
  answer, and it is a change to the one algorithm every fixture depends on.
  Dann's to rule, not tonight's.
- **Hough transform.** Ruled out: documented to produce many false lines under
  symbol clutter, and 13 times slower than a morphological baseline in the one
  benchmark found. A table edge and a facing page are exactly what it votes for.
- **Deskewing the image.** The deskewed reproducer still fails. Rotation is the
  root cause of the projection collapsing, but correcting it is not the fix for an
  unguarded NaN.
- **`pdfjs-dist` and increment 2.** Untouched until Dann rules.

---

## 4. Gates and the ship

Run all five and state every number **before** Dann ships, never after. Baselines
as of this session: phonology 216, dictionary 235, web-check 0 errors / 7 warnings
/ 4 files, web-test 552, score-parser 444 passed and 5 skipped. If a count moves,
give the new number and the reason. The baseline at `~/Downloads/ilya-ship.sh:79`
moves only on Dann's explicit yes.

List every new file explicitly, one per line, because the ship script refuses
untracked files and Dann adds each one by hand.

---

## 5. Hard rules

- **Never run `git`, not even `status`.**
- Keep every scratch script outside the repository. `.claude/` is not gitignored.
- No lockfile operation without Dann's yes.
- Canadian spelling, Oxford comma, no em-dashes, in code comments and copy alike.
- **WRITTEN is not DONE.** Every proof above is a run or a browser observation.
  Report the observation, not the intention.
- Report anything you decided that this brief did not cover, with your reason.
  A ruling made quietly becomes canon nobody agreed to.

---
*Commissioned by the coordinating desk, E.58, 2026-08-16, on Dann's instruction.
The traceback was read off Dann's own console. The image measurements were made
this session in the coordinating desk's container on `IMG_5162.HEIC`, staged from
Dann's Downloads. The two papers were researched by two Sonnet subagents and their
memos are in this folder.*
