# Memo: the reader meets its first real scan, r2. The full night, 2026-08-24

Supersedes `memo-n83-scan-read_r1_2026-08-24.md`, which records the state
before the deploy walk found two further walls. Ships: `fe74ece` and
`7f6a283`, five gates at baseline on both.

## The result, in Dann's words

**The pipeline runs end to end on a real scan, and the notation it renders
is totally incorrect.** That sentence is the first honest end-to-end
accuracy datum for the reader on real material, and both halves are the
finding. Mechanism: a 1931 IMSLP scan (Musorgsky, Without Sun, song 1,
Lamm) uploaded to the deploy `ilya-9256h493b` reads in 6.1 s: 3 systems, 9
staves, 57 notes, s = 30.0, pitch assumed on 1, length assumed on 50, 0
rests, and the engraved result renders. Accuracy, judged by Dann's eye
against the paper: wrong throughout. Decomposing the wrongness (pitch
against rhythm against count; the duration channel abstained on 50 of 57)
is open work, connected to N.90/N.91's benchmark ideas.

## What r1 already proved, unchanged

The three brief walls (sentinel envelope, join threshold, gate collapse)
and their fixes; both scan pages reading in the container; 23 of 23 render
fixtures byte-identical; gates at baseline; g = 18. See r1 for those
proofs and their populations.

## The two walls the deploy walk found after r1

### Wall 4. pdf.js cannot decode this PDF at all

The deploy's honest failure on the PDF reproduced in a desk-driven tab.
Worker-message capture showed the reader receiving a raster of the right
size (3699 x 4920) with **ink fraction 0.0000**: a blank page.
`pdfimages -list`: both pages are **JBIG2**, 5548 x 7380 at 600 dpi.
pdf.js 6.2.108 renders them as nothing, warning `Dependent image isn't
ready yet` once per page; re-render does not recover it; neither
`isOffscreenCanvasSupported: false` nor `useWorkerFetch: false` changes it;
and `pdfjs-dist@latest` IS 6.2.108, so no pin bump exists. IMSLP's
processing makes JBIG2 common, so this blocks most raw IMSLP PDFs.
UNNUMBERED FINDING for Dann: the PDF route needs either a JBIG2 decode
path or an honest error naming the compression; today it reports the
generic no-cause failure. The demonstration ran on the 400 dpi PNG raster
instead, which the picker accepts as a photograph.

### Wall 5. The band walk swallowed the page, and the sentinel caught it

On the PNG the deploy raised at the SECOND sentinel site,
`beams.remove_lines_safe` band walk: 8,471 accepted rows below K_S. The
r1 verification never saw it because every full-path container run had the
sentinel patched out; that instrument gap is the desk's own and is why r1's
browser claim was NOT ESTABLISHED. The tree's own substrate.py (the
unattributed session's work) had already measured the cause and left it
"Dann's to rule on": `_walk_band` anchored membership to the SEED ROW'S
extent; on a speckled print two seeds carry bridged extent 0.633 of their
staff's, the acceptance floor goes below zero, blank rows become members,
and the walk accepts all 4,920 rows of the page.

**Ruled by the desk under Dann's "solve this tonight": the anchor moves to
the claimed staff's extent** (`beams.py`, `_walk_band`, amendment note in
place), which is C2(b)'s ratified wording and a measured no-op on renders,
where seed extent equals staff extent on every page (ratio 1.000 across
all 47). Repaired, the walk accepts 319 and 441 rows on the two scan
pages, none blank, minimum concentration 0.280964. K_S is re-derived
corpus-wide over BOTH binding sites per the ratified derivation:
**0.2809** (truncated extreme). The vacuous 0.0000 outcome died with the
walk defect that produced it. Proofs after the fix: armed full reads
complete on both pages (55 and 70 notes in the container); 23 of 23 render
fixtures byte-identical through `remove_lines_safe`; five gates at
baseline on the ship.

## Toolchain divergence, measured

The same PNG reads 55 notes in the container (cv2 4.13.0) and 57 on the
deploy (Pyodide cv2 4.9.0). E.43's 37-against-36 precedent, new instance.
Do not compare counts across toolchains.

## NOT ESTABLISHED, carried forward

- Which session wrote the 2026-08-24 tree changes r1 found, and which
  reverted them from the working tree before ship 1 restored them.
- Why the read is wrong: the pitch, rhythm, and count error decomposition
  on this scan.
- Page 2 in the browser (the walk ran page 1; the container reads both).
- Whether the join threshold, gate fallback, or gate itself behave
  differently in Pyodide beyond the note-count drift.

## What remains for N.83

The colleague walkthrough itself: its demonstration asset is the PNG
through the deploy, shown honestly as mechanism-works-accuracy-poor, with
the engraved `.musx`/MusicXML path as the accurate contrast. The JBIG2
finding and the accuracy decomposition await Dann's numbering ruling.
