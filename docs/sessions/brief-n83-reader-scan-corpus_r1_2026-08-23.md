# Brief: the reader meets its first real scan. N.83, ruled by Dann 2026-08-23

Paste this whole file into a fresh Claude Code session pointed at
`~/Desktop/ilya-rewrite`, branch `Shane`.

## Goal

A real IMSLP scan reads end to end. The fixture is Musorgsky, Without Sun,
song 1, the 1931 Lamm engraving, 600 dpi monochrome, split to its own
two-page PDF. Tonight it halts on page 1 and dies earlier on page 2. Both
pages must read to a rendered report, and the 23 existing render fixtures
must come through byte-identical.

## Inputs

- `tools/e16-harness/scans/sunless-01-v-chetyryokh-stenakh_lamm-scan.pdf`,
  the two-page original. New file; ask Dann to `git add` before any ship.
- `tools/e16-harness/scans/raster400-1.png` and `raster400-2.png`, 400 dpi
  greyscale rasters of its two pages (pdftoppm; the browser rasterizes with
  pdf.js at the same 400 dpi per Ruling E in
  `apps/web/src/lib/shane/engine/page-pdf.ts`, so small drift is possible
  and the margins below are wide). 3699 x 4920 each.
- The reader: `tools/e16-harness/reader/`, mirrored to the app by
  `scripts/copy-reader.mjs`. That script runs only from `pnpm dev` and
  `pnpm build`; `npx vite dev` serves a stale reader.

## Ground truth, measured by the coordinating desk 2026-08-23

Both pages: nine staves, three systems of three, voice on top of each
system, so the correct vocal selection is `[0, 3, 6]` on each page.
Page 1: s = 30.0, skew of the top staff 0.066 degrees. Page 2: per-line
slopes vary from -0.117 to +0.232 degrees, so there is no rigid rotation to
undo; a rotate-and-retry was measured and refuted tonight.

## The three walls, each measured to its mechanism

### Wall 1. The sentinel envelope halts page 1

`reader.detect_staves` finds all nine staves cleanly, then
`substrate.sentinel` raises: accepted staff rows concentrate at 0.37 to
0.84 against `K_S = 0.9737`. Cause: `K_S` and `G_BRIDGE = 1` were measured
on the Verovio render corpus. On a real print, speckle breaks every staff
line into many runs with gaps wider than 1 px, so bridging at g = 1 never
reassembles the line and concentration collapses. The sentinel is doing its
ratified job on an unmeasured corpus.

`substrate.py`'s own docstring rules the fix: THE DERIVATION IS RATIFIED,
THE NUMBER IS NOT, and g is re-derived whenever the corpus changes. The
scan is a new corpus.

**Change 1, `substrate.py`.** Re-derive both constants with the two scan
pages added to the corpus, and record the derivation beside the numbers:

- `g`: the render derivation is SVG-anchored and cannot run on a scan. The
  scan analogue, ruled by the desk tonight: g covers the speckle-gap
  distribution measured inside five-line-validated staff rows. Measured on
  page 1: gaps cluster at 1 to 8 px (about 87 percent at or below 8), tail
  to 26. Derive g as the 90th percentile of that distribution over both
  scan pages (measured tonight, that lands near 9 to 10 px). Bridged
  concentration is monotone non-decreasing in g (merging chains only grows
  the principal mass), so a larger g cannot make any render fixture newly
  raise; prove it by running the fixture suite.
- `K_S`: the ratified derivation is the measured minimum bridged
  concentration over the keep population, corpus-wide and unmodified. With
  the scan pages' validated staff rows added at the new g, that minimum was
  measured tonight near 0.50 (g = 6 gave 0.5013, g = 8 gave 0.5044).
  Measure it exactly at your derived g and take the measured extreme, no
  offset. Name in the memo that the envelope is wider than before; that is
  what the ratified derivation yields on the enlarged corpus.

The sentinel's semantics do not change: raise-only, bound to ruled
acceptances only, downstream of every decision, upstream of none.

### Wall 2. A speckled system barline splits a system

`reader._joined_at_left` demands a column filled to 0.85 between adjacent
staves. Measured on page 1: the six true joins fill 0.819, 0.850, 0.866,
and 1.000 three times; the two true system boundaries fill 0.000 and 0.015.
The 0.819 join fails the test, staff 5 is promoted to its own system, and
`select_vocal` returns `[0, 3, 5, 6]` with a piano staff as a voice.

**Change 2, `reader.py`.** Lower the join threshold from 0.85 to 0.5. The
measured separation is 0.015 against 0.819 on the scan and, per
`ENVIRONMENT.md`, 4 to 5 percent against 100 percent on renders, so 0.5
sits in the middle of a wide gap on both corpora. Fixture suite proves no
render page changes.

### Wall 3. The rowfrac gate collapses on page 2

`_derive_rowfrac_gate` splits the sorted per-row coverage distribution at
gaps above 0.015 and walks down from the top segment. Page 1 forms two
segments (background 0 to 0.4996, staff population 0.5177 to 0.8932) and
the gate lands in the gap: clean read. Page 2's top staff is skewed 0.232
degrees; its diluted line rows (coverage down to 0.347) bridge the two
populations into ONE segment (0 to 0.894, all 4,920 rows). The gate falls
to 0.0026, admits 3,823 rows, within-staff rows fuse staves into fat
lines, and grouping raises `contaminated staff group [2, 1, 6, 1, 1]`.
This is the mild form of the E.59 finding that the gate's premise fails
off the render corpus.

**Change 3, `reader.py`.** A raise-triggered fallback inside
`detect_staves`, on the exact Cardoso-Rebelo precedent (a fallback, never
primary, so the 23 fixture pages stay byte-identical):

- Trigger: the existing five-line-validation or no-staff-lines raise, or
  the self-detectable degenerate gate (derived gate below the derivation's
  own floor constant, 0.015).
- Method: narrow-slice line candidates. Five slices of 200 px at 15, 30,
  50, 70, and 85 percent of page width; per-slice row projection; rows
  above half fill are line hits; consensus across slices gives line
  centres. Measured tonight: this finds all 45 lines on both scan pages.
  Group lines into staves with the existing staff-break threshold, then
  run the SAME five-line validation and the SAME sentinel on the result.
  Downstream code is untouched.
- E.60 demoted slice combs to a desk instrument and said do not promote:
  that ruling is five days old and stands for the PRIMARY path. Its three
  kill grounds were re-checked against this corpus tonight: line overlap
  in row space needs shear that collapses lines into one another, and at
  s = 30 with at most 0.232 degrees the lines never overlap; the 0-of-23
  fixture failure cannot occur where the fallback never fires on renders;
  the 16 to 59 times cost is paid only on a page that would otherwise not
  read at all. Quote this paragraph in the memo so the distinction is on
  the record.

## Order of work

0. Positive control first, per the control rule. Run the reader on
   `raster400-1.png` as-is and confirm the exact `SentinelRaise`; on
   `raster400-2.png` and confirm the exact contaminated-group raise. These
   two reproductions are the baseline every change is measured against.
1. Change 1, then page 1 reads to `envelope.run` completion.
2. Change 2, then `select_vocal` returns `[0, 3, 6]` on page 1.
3. Change 3, then page 2 reads to the same standard, vocal `[0, 3, 6]`.
4. Fixture suite: all 23 render pages byte-identical, zero fallback
   firings, zero sentinel raises.
5. `pnpm build`, five gates at baseline. Then a local browser check on the
   production build: upload the two-page PDF, expect the read report to
   render with no error. Pyodide is 32-bit: `np.intp` is int32 and int64
   arrays break `np.bincount` there, so keep any new index arrays at the
   default dtype and test in the browser, not only on the desktop.

## Constraints

- The sentinel stays a sentinel. No decider, no dispersion statistic, no
  per-source branching.
- No dewarp. E.60 ruled a dewarp is a project and it is not authorized.
  If page 2 still fails after change 3, report the honest raise and stop.
- Do not touch `VocalLineEvent`, `apps/web/src/lib/shane/reconciliation/`,
  or anything outside `substrate.py`, `reader.py`, tests, and the fixture
  files.
- New files need Dann's `git add` before `ilya-ship.sh`; running the
  reader writes `__pycache__` beside the modules and it is already
  gitignored.
- Editing a reader module during a dev session needs a server restart;
  `pnpm dev`, never `npx vite dev`.

## Definition of done

Every item observable, none of them a claim:

1. The two step-0 raises reproduce before any change.
2. Both scan pages read to `envelope.run` completion, chained
   page 1 then page 2, vocal `[0, 3, 6]` on each, no raise.
3. All 23 render fixture pages produce byte-identical output with zero
   fallback firings and zero sentinel raises.
4. Five gates at baseline on the shipped commit; name any moved test
   count.
5. On a local production build, the two-page PDF uploads and the read
   report renders. Dann's walk on the deploy is after the ship and is his,
   not yours; note accuracy is judged by his eye against the paper, never
   by a script's count.

## Return memo

`docs/sessions/memo-n83-scan-read_r1_2026-08-23.md`: what changed and
where; the derived g and K_S with their derivations and the populations
they were measured over; gate counts before and after; how fixture
byte-identity was proven; the E.60 fallback paragraph quoted; and a
section listing everything you could not establish.

NOT ESTABLISHED beats a complete invented answer.

Known not-established going in, to carry forward unless you establish it:
whether the browser's pdf.js rasters differ from these pdftoppm rasters
enough to move any margin; whether pitch reads correctly near the ends of
the 0.232-degree staff (about 5 px of line drift against a 15 px half
space); and the browser-side identity of the page 1 halt until step 0's
browser check confirms it.
