# RESEARCH MEMO: Stable Paths staff-line detection, implementation grade

Farmed to a Sonnet subagent by the coordinating desk, E.58, 2026-08-16, on Dann's
instruction. The question asked: describe Stable Paths precisely enough to
implement it in numpy under Pyodide, and say honestly what it would cost.

**Outcome: ruled out on cost, not on merit.** See the brief
`e58-brief-to-code-n59-nan_r1_2026-08-16.md` §3.

The agent was instructed that **NOT ESTABLISHED beats a complete invented answer**
and that its own inferences must be marked as its own. Its memo follows verbatim.

---

Primary source used for the algorithm itself: J.S. Cardoso, A. Capela, A. Rebelo,
C. Guedes, J. Pinto da Costa, "Staff Detection with Stable Paths," IEEE
Transactions on Pattern Analysis and Machine Intelligence, vol. 31, no. 6,
pp. 1134-1139, June 2009, DOI 10.1109/TPAMI.2009.34. The IEEE Xplore copy
(https://ieeexplore.ieee.org/document/4775904) is paywalled and the direct fetch
was blocked by a provenance check; the open-access institutional-repository copy
at https://repositorio.upt.pt/bitstreams/4287bd09-3e5d-4915-be42-59fa34644e96/download
was used instead, located via
https://repositorio.upt.pt/items/090ea399-f415-42c2-b3fb-e980faf83c3f. Citation
metadata cross-checked against
https://scispace.com/papers/staff-detection-with-stable-paths-21awdjdmdh. The
precursor conference paper (Capela, Rebelo, Cardoso, SIGMAP 2008,
https://www.inescporto.pt/~jsc/publications/conferences/2008ACapelaSIGMAP.pdf)
would not fetch and contributed nothing.

## WHAT STABLE PATHS ACTUALLY IS

Stable Paths treats the page image as a weighted graph, pixels as nodes, and finds
staff lines as paths of minimum-ish cost from the left margin to the right margin.
Unlike a single global shortest path, a stable path is defined by a mutual-optimality
condition between two boundary regions: it is a path that is simultaneously the best
path from its start into the whole target region and the best path from its end back
into the whole source region, so it is a fixed point of two opposing shortest-path
maps rather than one global minimum. A single leftmost shortest path would recover
only the single cheapest line; the mutual-best condition, computed once over the
whole image, yields several lines' worth of mutually optimal paths in one pass.
Because staff-line pixels are cheap and everything else is expensive, correct paths
hug real staff lines even when those lines curve, tilt, or are interrupted by
symbols. Lines are extracted iteratively: find the current stable paths, validate
them, erase them from the image, repeat. Preprocessing estimates staff line
thickness and inter-line spacing from vertical run-length statistics, and these two
numbers parameterize both the cost function and the grouping rules.

## THE ALGORITHM, STEP BY STEP

1. **Preprocessing, estimate `stafflineheight` and `staffspaceheight`.** Quoted
   (§2.3.1): "the technique starts by computing the vertical run-lengths
   representation of the image. If a bit-mapped page of music is converted to
   vertical run-lengths coding, the most common black runs represents the staff
   line height and the most common white runs represents the staff space height."

2. **Graph construction.** "the image grid is considered as a graph with pixels as
   nodes and arcs connecting neighboring pixels" (§2). A staff line is "an
   8-connected path of pixels in the image from left to right, containing one and
   only one pixel in each column" (§2.1), so from column x to x+1 a path may move
   only to row y-1, y, or y+1: a monotone one-step-per-column DAG, not a free walk.
   The paper states this "imposes a maximum detectable 45 degree rotation"
   (§2.1, footnote 1).

3. **Edge cost, quoted from Listing 2:**

```
WeightFunction(pixelValue1, pixelValue2, vRun1, vRun2,
               nearestVRun1, nearestVRun2, NeighbourhoodType)
{
  value  = min(pixelValue1, pixelValue2)
  weight = baseWeight(value, NeighbourhoodType)
  if (vRun1 <= STAFFLINEHEIGHT) OR (vRun2 <= STAFFLINEHEIGHT):
      weight = weight - delta
  if (nearestVRun1 >= STAFFSPACEHEIGHT + STAFFLINEHEIGHT)
     OR (nearestVRun2 >= STAFFSPACEHEIGHT + STAFFLINEHEIGHT):
      weight = weight + delta
  return weight
}
```

   `baseWeight` is "4 on black pixels and 8 on white pixels for 4-neighborhoods,
   and 6 and 12 for 8-neighborhoods", with "delta ... set to 1". `vRun` is the
   length of the vertical black run the pixel sits in, so short runs comparable to
   `stafflineheight` are cheapened. `nearestVRun` is the distance to the nearest
   other vertical black run in the same column; a neighbour farther than one
   staff-space-plus-line-height is penalized as likely belonging to an isolated
   symbol rather than one of five evenly spaced lines. NOT ESTABLISHED: whether
   diagonal moves receive a geometric length correction.

4. **Computing the stable paths.** Two full-image dynamic-programming sweeps, not
   per-pair shortest paths: "the first step ... corresponds ... to the computation
   of the shortest path between the whole left margin and each point on the right
   margin. In a second step, one repeats the same procedure, now traversing the
   graph from the right column to the left ... if the two endpoints of a direct and
   reverse path coincide, we are in the presence of a stable path" (§2.2).
   Formally a path is stable iff `F2->1(F1->2(s)) = s`. Hence "roughly twice the
   complexity of the shortest path computation", and "a score with 60 staff lines
   would require 60 iterations of the shortest path algorithm ... [but] requires a
   few (typically between four and six) iterations with the stable path method".
   NOT ESTABLISHED: the paper names no shortest-path algorithm and gives no Big-O.
   The column-sweep DP reading is the agent's structural inference from the
   one-pixel-per-column definition.

5. **Main cycle, quoted from Listing 1:**

```
Preprocessing: compute staffspaceheight and stafflineheight;
               compute weights of the graph
Main Cycle:
  compute stable paths
  validate paths with blackness and shape
  erase valid paths from image
  add valid paths to list of stafflines
  end of cycle if no valid path was found
Postprocessing: uncross stafflines; organize stafflines in staves;
                smooth and trim stafflines
```

   "Erase" means setting to white "a vertical strip centred on the detected staff
   line" of height `staffspaceheight` (§2.3.2). Validation is by "blackness and
   shape" (§2.3.3); the thresholds are NOT ESTABLISHED.

6. **Uncrossing.** "local discontinuities can induce a stable path to zigzag back
   and forth between consecutive lines" (§2.3.4). The fix: "for each image column,
   sort on y the pixels of the detected lines and assign the i-pixel to the
   i-line."

7. **Grouping into staves.** "starting a new staff whenever the distance between
   two consecutive lines is above a fixed threshold (= 2 x staffspaceheight)", then
   "discarding sets with a single line" (§2.3.4). NOT ESTABLISHED: any rule
   requiring exactly five lines, or any rule for grouping staves into systems.

## WHAT IT ASSUMES BEFORE IT RUNS

- A binarized or thresholded image where black and white are separable.
- `stafflineheight` and `staffspaceheight` estimated first, **globally**, from
  vertical run-length histograms over the whole page: one scalar pair, not
  per-region. A photograph with strong perspective could skew the modal estimate,
  a risk the paper does not address.
- The monotone one-pixel-per-column model, bounding detectable rotation under 45
  degrees, which is far outside the 1.04 degrees in Ilya's failing input. **Rotation
  is not the obstacle for this algorithm.**
- No requirement that the graph span the full page width. It works left to right
  over whatever crop it is given.

## REPORTED PERFORMANCE AND STATED LIMITATIONS

- Test sets: "2,688 images were generated from 32 perfect scores" plus "40 real
  music scores" (§3). Image resolutions NOT ESTABLISHED.
- Error metrics: false-detection and miss-detection rates, matched at "average
  error-distance below stafflineheight". Reported stable-path error rates on the
  synthetic set are roughly 0.0 to 1.5 percent, against a Dalitz baseline of
  roughly 0.0 to 2.5 percent. **These are a summary of a table, not a verbatim
  quote. Do not cite them as exact.**
- Runtime: only relative. "runs as fast as the Dalitz algorithm (and about five
  times faster than the shortest path version)". No absolute seconds, no image
  size. NOT ESTABLISHED.
- Robustness claim (Abstract, §4): "adaptable to a wide range of image conditions,
  thanks to its intrinsic robustness to skewed images, discontinuities, and curved
  staff lines".
- Stated limitations: the 45 degree cap; the stable-path condition is not
  guaranteed to recover every line in one pass, hence the multi-iteration cycle;
  discontinuities cause zigzagging, handled by uncrossing.

## IMPLEMENTATIONS AND LICENCES

- **Gamera MusicStaves** ships `StaffFinder_stable_path`
  (https://gamera.informatik.hsnr.de/addons/musicstaves/doc/musicstaves.html).
  Gamera core is **GPLv2 or later**, confirmed by direct fetch of
  https://github.com/hsnr-gamera/gamera-4. The MusicStaves addon's own licence text
  could not be confirmed: SourceForge's code browser was blocked by robots.txt and
  its archive.org mirror returned 403. GPL-family is likely but NOT confirmed.
- Whether `stable_path` is implemented in C++ or Python: NOT ESTABLISHED, source
  inaccessible.
- **No standalone numpy or scipy reimplementation exists.** Searched and not found,
  including across modern OMR tooling, which has moved to deep-learning
  segmentation. Treat as an established negative result of the search, not proof of
  nonexistence.

## HONEST COST TO PORT

Everything in this section is the agent's engineering estimate, not sourced.

- **Size:** 200 to 400 lines of numpy for a workmanlike port, excluding tests. The
  run-length preprocessing is another 20 to 40 and needs no scipy.
- **The structural risk.** The one-pixel-per-column constraint makes the DP
  recurrence sequential: each column's cost vector depends on the previous
  column's. **That is not vectorizable across columns.** It needs a Python-level
  loop over image width with a vectorized O(rows) operation inside. For a 3,024 to
  4,032 px wide sweep that is 3,000 to 4,000 loop iterations per sweep, two sweeps
  per round, four to six rounds: **order 25,000 to 50,000 Python-level iterations
  for a full page**, under CPython compiled to WASM. This is the single biggest
  risk in a Pyodide port.
- **Do not reach for `scipy.sparse.csgraph`.** An explicit sparse adjacency over a
  3024 x 4032 image is about 12.2 million nodes and, at 8-connectivity, about 98
  million edges. Building and holding that, then running Dijkstra, is far worse
  than the bespoke column sweep, which never materializes an edge list.
- **Runtime in Pyodide: NOT ESTABLISHED.** No benchmark was found, and the papers
  publish no absolute runtimes at any resolution. Any number would be invented.
- **The cheaper option the agent flagged unprompted:** given that a 200 px slice
  projection already finds all five lines cleanly, a whole-page Stable Paths port
  is very likely unnecessary.

## WHAT COULD NOT BE ESTABLISHED

- Absolute runtime figures for the original algorithm at any resolution.
- Image dimensions of either test set.
- Whether 8-connected edges get a geometric weight correction.
- The quantitative "blackness and shape" validation thresholds.
- Any rule for grouping staves into multi-staff systems. The paper covers only
  line-into-staff grouping via the `2 x staffspaceheight` rule.
- Any named shortest-path algorithm or complexity bound.
- The MusicStaves addon's own licence, independent of Gamera core.
- Whether `StaffFinder_stable_path` is C++ or Python.
- The full text of the SIGMAP 2008 precursor.
- Any faithful numpy reimplementation outside Gamera.
- Any Pyodide benchmark for loop-heavy numpy of this shape.
