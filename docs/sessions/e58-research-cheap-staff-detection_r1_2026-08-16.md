# RESEARCH MEMO: the cheapest robust way to estimate staff space on a rotated photograph

Farmed to a Sonnet subagent by the coordinating desk, E.58, 2026-08-16, on Dann's
instruction, in parallel with the Stable Paths memo. The question asked: what is
the cheapest thing that fixes a NaN staff-space estimate on a page rotated 1.04
degrees, under Pyodide with cv2 4.9.0 and numpy 1.26.4 pinned.

**Outcome: this memo produced the fix.** Cardoso and Rebelo, ICPR 2010. See the
brief `e58-brief-to-code-n59-nan_r1_2026-08-16.md` §2 step 2.

The agent was instructed that **NOT ESTABLISHED beats a complete invented answer**
and that its own inferences must be marked as its own. Its memo follows verbatim.

---

## THE SHORTEST ANSWER

Replace, or fall back to when the current estimator returns NaN or an implausible
value, a **vertical run-length histogram** computed per column: histogram the
lengths of vertical black runs and vertical white runs across a sample of columns,
take the mode of each. This measurement never sums ink position across the page
width, so a 1.04 degree tilt barely perturbs it (a line of true thickness *t*
crossed by a vertical scan at angle θ reads as *t*/cos θ, which is *t* x 1.0002 at
1 degree). It needs no deskew step, no line-linking across strips, and only numpy
primitives already pinned. This is cheaper than the strip-projection approach Dann
already validated by hand, because it skips the "link lines across strips" step
entirely: it needs only the scalar spacing, not the line y-coordinates.

## ESTIMATING STAFF SPACE ROBUSTLY

**Origin.** Reviewed as Aoyama and Tojo's 1982 method in Ichiro Fujinaga's PhD
thesis, *Adaptive Optical Music Recognition* (McGill),
https://www.nlc-bnc.ca/obj/s4/f2/dsk2/ftp02/NQ29937.pdf §2.1: "By using the result
of [staff-candidate extraction], and creating a histogram of black runs and white
runs from the staffline candidates, staffspace height and staffline height are
obtained." Note this is distinct from Gamera's `MusicStaves_rl_fujinaga`, which
despite the name is a strip-deskew-then-project staff *removal* algorithm.

**Modern formulation, and the rotation claim.** Cardoso and Rebelo, *Robust
Staffline Thickness and Distance Estimation in Binary and Gray-Level Music
Scores*, ICPR 2010, DOI 10.1109/ICPR.2010.458
(https://ieeexplore.ieee.org/document/5597199/, method extracted via
https://www.academia.edu/4504631/): "the most common black-runs represents the
staffline height and the most common white-runs represents the staffspace height."
Critically: **"These estimates are also immune to severe rotation of the image."**

**The measured failure mode of the naive version, and the fix.** The same paper
reports that on a degraded score the naive method measured staffline height 1 and
staffspace height 1 against true values of 5 and 19, defeated by "isolated black
pixels and fluctuations in the thickness and distance between lines." Their fix is
to histogram the **sum of two consecutive runs**, a black run plus its adjacent
white run, because "a local fluctuation in the thickness of the staffline... is
often compensated by a variation with an opposite sign of the local distance
between lines." No exact degree ceiling is given; "severe" is qualitative.

**Implementation sketch** (the agent's, not sourced). On the existing `img < 128`
mask: for a sample of columns, every k-th column is enough, record run lengths of
consecutive True and consecutive False via a diff of a padded boolean array rather
than a Python loop. Pool black-run lengths and take the histogram peak restricted
to a plausible pixel range: that is `stafflineheight`. Pool the paired black-plus-
following-white sums and take that peak: that is the staff-line period, which is
the `s` `reader.py` wants. Roughly 15 to 25 lines of vectorized numpy, no scipy.

**Failure modes:** noisy or degraded ink can pollute the histogram with spurious
short runs, per Cardoso and Rebelo; the paired-sum variant mitigates it. Given the
photograph's measured luma separation (p1 = 4, median 187), binarization should be
clean, which favours this method here specifically.

## THE FOUR CANDIDATES, COMPARED

| Method | Rotation tolerance, published | Curvature | Approx. lines | Deps beyond cv2/numpy | Source |
|---|---|---|---|---|---|
| Vertical run-length histogram | "immune to severe rotation", no number | not established | ~15-25 (est.) | none | Cardoso & Rebelo ICPR 2010; Fujinaga thesis §2.1 |
| Strip-wise / windowed projection | Fujinaga's strip deskew defaults `max_skew` = 5.0 deg per strip, a design limit not a measured failure point | Szwoch targets "skew and barrel/pincushion distortions" | ~40-80 (est.) | none | Szwoch, CAIP 2005, https://link.springer.com/chapter/10.1007/11556121_86; Gamera `rl_fujinaga` docs |
| Gamera MusicStaves toolkit | Skeleton: best for 5 to 17 deg, tested -18 to +18 in 1 deg steps. Carter and Bacon second best beyond 5 deg | Skeleton strongest overall but weakest on historic typeset | 150-400+ to reimplement (est.) | C++ core plus a GUI framework, not pip-installable; Pyodide compatibility not established | Dalitz et al., TPAMI 30(5):753-766, 2008, http://lionel.kr.hs-niederrhein.de/~dalitz/data/publications/tpami-staffremoval.pdf |
| Hough (`cv2.HoughLinesP`) | "suitable ... when the image is skewed", no number | poor by construction | ~20-40 (est.) | none | Chen et al., ICMULT 2010, DOI 10.1109/ICMULT.2010.5631269 |

Additional sourced facts on Hough: it produces many spurious lines when the image
has "a large amount of musical symbols", and in a 68-image test ran 13.28 times
slower than a morphological baseline, 1.47 s against 0.11 s. The agent's own
inference, marked as such: a cluttered table and a facing page are exactly the
conditions that generate long high-contrast straight edges competing for Hough
votes.

## WHAT THE COMPARATIVE STUDY CONCLUDES ABOUT ROTATION

Dalitz, Droettboom, Pranzas, Fujinaga, *A Comparative Study of Staff Removal
Algorithms*, IEEE TPAMI 30:753-766, 2008. Self-archived PDF fetched successfully
at http://lionel.kr.hs-niederrhein.de/~dalitz/data/publications/tpami-staffremoval.pdf

- Six algorithms compared: LineTrack Height, LineTrack Chord, Roach/Tatem, Carter,
  Fujinaga, Skeleton.
- Rotation tested from -18 to +18 degrees in 1 degree steps.
- The skeleton algorithm is "the most robust and performs better than all other
  algorithms for rotation angles between 5 and 17 degrees". Carter and Bacon is
  "the second best for rotations greater than 5 degrees".
- Overall: "there is no clearly best algorithm with respect to all three error
  metrics", and robustness to rotation does not imply robustness to curvature.
- **The load-bearing quote for Ilya.** Of Fujinaga's own projection algorithm:
  "it is essential that the stafflines are not rotated nor curved" before the
  horizontal-projection step runs, which is why it deskews per strip first. This is
  the direct confirmation that full-page horizontal projection, the family
  `reader.py:197` belongs to, is the fragile one.
- The study is silent below 5 degrees. That the six algorithms would all perform
  near baseline at 1.04 degrees is the agent's inference, not a reported result.
- The study evaluates staff *removal* quality, not estimation of a scalar `s`.

Caveat on method, stated by the agent: these quotes were extracted by a
summarizing fetch of the PDF, not read character by character. Wording is
reliable; table-level numeric detail is unverified.

## ROTATION TOLERANCE IN DEGREES, WHERE A NUMBER EXISTS AT ALL

| Method | Degrees, sourced |
|---|---|
| Skeleton (Gamera) | best in the 5 to 17 range, tested -18 to +18 |
| Carter and Bacon | second best beyond 5 |
| Fujinaga strip deskew | `max_skew` default 5.0 per strip, a configured limit |
| Run-length histogram | "severe rotation", no number |
| Hough | "suitable when skewed", no number |
| Roach/Tatem, Miyao, plain projection, line tracking | NOT ESTABLISHED |

For three of the four candidates no number could be found.

## THE AGENT'S RECOMMENDATION, MARKED AS ITS OWN

Add the vertical run-length histogram as either the primary estimator of `s` or a
fallback triggered when the current projection returns NaN or a value outside a
sane range. Reasons:

1. Rotation-invariant by construction for small angles, because it is a per-column
   measurement and never sums ink across x. Confirmed qualitatively by Cardoso and
   Rebelo (2010).
2. No deskew step and no line-linking, so strictly cheaper in code than the
   strip-projection candidate, while doing the one job that is broken.
3. Needs only numpy 1.26.4, already pinned.
4. Degrades gracefully: even on a cluttered rotated photograph, the mode across
   many sampled columns should still find the staffline period, since staff lines
   vastly outnumber other 10 to 20 px periodic vertical structures on a page of
   music.

**Do not pursue Hough as the primary fix:** this photograph has a cluttered table
and a facing page in frame, both long-straight-edge generators that Hough is
documented to be vulnerable to in music contexts, and it is an order of magnitude
slower in the one benchmark found.

**Do not port Gamera MusicStaves:** a C++ core with a GUI framework, not a
numpy/cv2 library. Its value is as a description of algorithms to imitate in a few
lines, never as a dependency. That it cannot run under Pyodide as-is is the
agent's inference from the architecture, not a sourced claim.

**Keep the windowed-strip approach in reserve.** It is the right tool if
`reader.py` ever needs actual line y-coordinates on a rotated page, and it already
works on Ilya's own photograph, but it is more code than the current bug requires.

## WHAT COULD NOT BE ESTABLISHED

- An exact numeric rotation ceiling for the run-length histogram, Hough,
  Roach/Tatem, or Miyao.
- Whether Dalitz et al. report results below 5 degrees.
- Curvature tolerance for the run-length histogram or for Hough in a music context.
- Authors and abstract for "Staff line detection and revision algorithm based on
  subsection projection and correlation algorithm", SPIE Proc. 8784 (2013); ADS
  blocked the fetch.
- Whether any staff-detection library has ever run under Pyodide or WASM.
- Precise line counts for any candidate. All are the agent's estimates.
