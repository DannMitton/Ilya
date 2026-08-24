# Memo: the reader meets its first real scan. N.83, verification record, 2026-08-24

Companion to `docs/sessions/brief-n83-reader-scan-corpus_r1_2026-08-23.md`.
Written by the coordinating desk after verifying the tree, not by the session
that made the changes.

## Provenance, stated plainly

The desk found changes 1, 2, and 3 already present in the tree at the moment
it snapshotted `~/Desktop/ilya-rewrite` (about 00:54, 2026-08-24): a
re-derived `substrate.py`, the join threshold at 0.5, and the slice fallback
in `detect_staves`, each carrying dated derivation notes and the brief's E.60
paragraph quoted verbatim. Which session made them is NOT ESTABLISHED from
here; Dann can name it. No memo and no new tests accompanied them, so the
desk ran the brief's proofs itself in its container (python 3 with numpy
2.4.4 and cv2 4.13.0; the standing caveat that this is not Pyodide applies
to every number below).

## What changed and where

- `tools/e16-harness/reader/substrate.py`: `G_BRIDGE` 1 to 18, derived as
  the 90th percentile of speckle-gap widths inside the 90 five-line-validated
  staff rows of the two scan pages (784 gaps, maximum 29, population scoped
  to each staff's own x-range and to gaps narrower than s). `K_S` 0.9737 to
  0.6428, the measured minimum bridged concentration over the enlarged keep
  population at g = 18. The module documents both derivations, a divergence
  from the brief's predicted g of 9 to 10 (recorded, not smoothed), and a
  render-side check that the render keep minimum measures 0.97365 at every g
  from 1 to 20. Raise-only semantics and the binding rule are unchanged.
- `tools/e16-harness/reader/reader.py`: `_joined_at_left` threshold 0.85 to
  0.5, with the measured separations recorded (renders: splits 4 to 5
  percent, joins 100; scan page 1: splits at most 0.015, weakest true join
  0.819). And the raise-triggered narrow-slice fallback in `detect_staves`:
  five 200 px slices, majority consensus, same line grouping, same five-line
  validation, same sentinel; a `FALLBACK_FIRINGS` counter for the proofs.
- Fixtures: `tools/e16-harness/scans/` holds the two-page Lamm PDF and both
  400 dpi rasters (desk, earlier tonight).

## The proofs, all run 2026-08-24 in the desk's container

- Step 0 controls: the pre-change modules raise on both pages exactly as
  the brief records (SentinelRaise on page 1; contaminated staff group
  [2, 1, 4, 1, 1] on page 2). Run against the pristine pre-change copies.
- Page 1: 9 staves, s = 30.0, vocal [0, 3, 6], zero brace fallbacks, slice
  fallback not fired.
- Page 2: 9 staves, s = 30.0, vocal [0, 3, 6], zero brace fallbacks, slice
  fallback fired exactly once. The page that could not read at all now
  reads through the fallback.
- Fixture proof: all 23 render fixture pages
  (`tools/e16-harness/output/*/page*_300dpi.png`), old modules against new,
  staff-line positions, s, vocal selection, and brace-fallback counts
  compared structure-for-structure: 23 of 23 identical, zero slice-fallback
  firings, zero sentinel raises. Method: both module sets run in one
  process, outputs serialized and compared for equality.
- Gates, run in the container after `pnpm install`: full test gate green,
  blurb 140, dictionary 235, score-parser 444 passed 5 skipped, phonology
  216, integration 55, and apps/web exactly 725 passed, the ship script's
  expected count, unmoved because no TypeScript changed and no test was
  added. `pnpm check`: 0 errors, 7 warnings. `pnpm build`: green,
  `copy-reader` ran, service worker stamped. The two changed modules grow
  by 12,557 bytes and ship into the build's `reader/`, so that byte count
  rides to `static/`-class delivery and is named here on purpose.

## The browser check: not completable in the container, and why

The production build served locally, the PDF uploaded through the score
input, clef Treble and 2 sharps answered, Read this page pressed: the
honest failure message appeared after about 5 seconds. Cause established by
direct probe: Chromium inside the desk's container cannot reach
`cdn.jsdelivr.net` (page fetch fails, worker fetch times out; the
container's egress proxy admits node but not the browser), so Pyodide never
loads and the 5-second failure is the loader, not the reader. The brief
anticipated this outcome and rules it recordable. The browser observation
therefore moves to Dann's walk on the deploy, which was always the only
observation that counts.

Along the way the check did establish, on the real production build: the
PDF route engages (the third file input takes the PDF), the two questions
render in the drawer with Treble and the key list, and Read this page
appears; the flow up to the reader is intact.

## NOT ESTABLISHED, carried forward

- The browser-side read of either scan page, until Dann's deploy walk.
- Pitch accuracy near the ends of page 2's 0.232-degree staff (about 5 px
  of drift against a 15 px half space).
- Whether pdf.js rasters differ from these pdftoppm rasters enough to move
  any margin (the sentinel margin at K_S 0.6428 is wide).
- Which session made the tree changes, and whether it ran proofs of its own.
- The desk's brief predicted g near 9 to 10; the tree derivation, under a
  stricter gap scoping it documents, lands at 18. The divergence is
  recorded in `substrate.py`; the two agree that g is an order of magnitude
  larger on a print and that the render corpus is untouched.

## What remains

Dann: `git add` the new files (`docs/sessions/` brief and this memo,
`tools/e16-harness/scans/` three files), ship with
`sh ~/Downloads/ilya-ship.sh "N.83: the reader reads its first real scan"`,
then walk the deploy: upload the two-page PDF, answer Treble and 2 sharps,
and judge the read against the paper with your own eye. That walk is the
first honest end-to-end accuracy datum, which is what N.83's demonstration
was for.
