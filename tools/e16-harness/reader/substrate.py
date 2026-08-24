"""E.16 -- the bridged-run substrate. RUNTIME module, no oracle, no SVG.

Ratified by Fable's ruling of 2026-07-28, "the bridged-run substrate, and call
site 1's extent conjunct", R-1, as amended by R-1' (join-gap scoping) and by
the annihilation-lemma ruling of the same day.

WHY THIS EXISTS
---------------
`longest_run` does not denote extent, and the divergence is a factor of two on
a genuine staff-rule row. A staff line is drawn once per MEASURE, not once per
system; where two measures' strokes abut, the join can fall below the
binarisation threshold in the partially covered row of a two-row ink band,
splitting that row's longest run while leaving the fully covered row intact.
28 of 1,980 rule instances in this corpus carry that, all on full-width
systems, with the join gap measured at exactly 1 px in every case. Any
quantity computed on raw runs inherits the error.

Raw x-extent is not the answer either: it denotes the bounding span of
possibly disjoint ink, and it admits page-spanning lyric text (repaired
sunless-05 p6 row 519, x-extent 1245 px against a widest true system of
1112 px, `longest_run` 17 px).

THE SUBSTRATE
-------------
    raw run          maximal contiguous horizontal dark sequence
    bridged run      maximal chain of raw runs whose every internal gap is <= g
    extent E         last x - first x + 1, bridged gaps INCLUDED
    mass             sum of the chain's raw-run dark pixels, gaps EXCLUDED
    principal        greatest mass; ties by greater extent, then leftmost
    concentration    principal mass / row total dark mass
    row extent       principal E

Bridging adds no phantom ink: mass excludes the bridged gaps.

THE BRIDGING TOLERANCE g
------------------------
g is NOT a gate constant. It is a derived measurement anchor of the raster
substrate, the same constitutional class as the stroke-width and
band-thickness raster facts (ruling R-4). Its denotation: "the maximum width
at which this renderer's measure joins fall below the binarisation threshold."

Derived per corpus under R-1' from SVG-anchored measure-join widths, scoped to
the claimed system's own x-range with join positions taken PER SYSTEM. Measured
2026-07-28 over all 47 rendered pages: retained join-gap widths {1 px: 66},
non-join gaps inside the scoped population 0, excluded join-coincident gaps 0,
so g = 1 px with no raise. THE DERIVATION IS RATIFIED; THE NUMBER IS NOT.
Anything downstream that quotes 1 px rather than the derivation is a defect,
and g is to be re-derived whenever the corpus changes.

RE-DERIVED 2026-08-24, N.83. THE CORPUS CHANGED: the Musorgsky "Without Sun"
song 1 Lamm scan (two pages, 400 dpi, `tools/e16-harness/scans/raster400-1.png`
and `raster400-2.png`) joined it. The SVG-anchored derivation above cannot run
on a scan -- there is no SVG -- so the desk ruled the scan analogue: g covers
the SPECKLE-GAP distribution measured inside five-line-validated staff rows,
and g is its 90th percentile.

POPULATION, stated exactly because the number is worthless without it: the gaps
between consecutive raw runs inside each of the 90 five-line-validated staff
rows of the two scan pages (45 rows each, nine staves of five lines on each
page), scoped two ways. Scope 1, the R-1' analogue: only gaps lying inside that
staff's own x-range, where the x-range is measured with reader.py's own
majority instrument -- the columns where at least three of the staff's five
lines carry ink -- so a margin speck, which never lines up across five rows,
cannot widen the scope. Scope 2, denotational: only gaps narrower than the
staff space s (30.0 px on both pages, measured). g denotes the width at which a
mark falls below the binarisation threshold; a break wider than a whole staff
space is not a broken stroke, it is the absence of the stroke, and admitting it
would let g bridge across ink that belongs to a different object.

MEASURED: 784 gaps (235 on page 1, 549 on page 2), 70.0 percent at or below
8 px, maximum 29. The 90th percentile is 18, so g = 18 px.

DIVERGENCE FROM THE DESK'S OWN MEASUREMENT, recorded rather than reconciled.
The N.83 brief reports the page 1 distribution as "about 87 percent at or below
8, tail to 26" and predicts g near 9 to 10. This module's measurement of page 1
under the population above is 77.0 percent at or below 8, tail to 28, 90th
percentile 15. The tail agrees closely; the low-gap mass does not, and no
scoping this session could construct reproduces 87 percent. The desk's exact
gap-scoping is therefore NOT ESTABLISHED here, and if it is restated the
percentile must be recomputed under it. What the two agree on: g is an order of
magnitude larger on a print than on a render, and the render corpus is
untouched by the change -- see K_S below, whose render-side minimum measures
0.9736526946 at every g from 1 to 20.

MONOTONICITY, verified rather than assumed. Bridged concentration is monotone
non-decreasing in g, so no render page can newly raise. But bridged EXTENT is
also monotone in g, and beams.py's band walk consumes extent, so a larger g
could in principle move a fixture read without raising anything. Measured
2026-08-24: all 23 render fixture pages produce byte-identical reads at g = 18
against g = 1 (sha256 over the full envelope.run output of each page), with
zero sentinel raises.

At runtime the reader bridges blindly, every gap <= g, because the SVG is
oracle-only. The SVG anchors the derivation and the acceptance tests, never
the runtime path.
"""
import numpy as np

# Derived per corpus under R-1'. See the module docstring: this is a
# measurement of this renderer's raster, not a tunable.
# 1 px on the 47-page Verovio render corpus (2026-07-28); 18 px once the two
# Lamm scan pages joined the corpus (2026-08-24, N.83). Re-derive it again the
# next time the corpus changes; the derivation is ratified, the number is not.
G_BRIDGE = 18


def row_runs(ink):
    """One pass over the whole page. Returns (row, x_start, x_end, length).

    ink: boolean H x W mask, True where dark.

    Vectorised deliberately: a per-row Python loop over 47 pages of ~3,000
    rows is minutes; this is seconds.
    """
    H, W = ink.shape
    p = np.pad(ink, ((0, 0), (1, 1)), constant_values=False)
    d = np.diff(p.ravel().astype(np.int8))
    s = np.nonzero(d == 1)[0] + 1
    e = np.nonzero(d == -1)[0] + 1
    length = (e - s).astype(np.int64)
    row = (s // (W + 2)).astype(np.int64)
    x_start = (s % (W + 2) - 1).astype(np.int64)
    return row, x_start, x_start + length - 1, length


def principal_per_row(nrows, row, x_start, x_end, length, g=G_BRIDGE):
    """Principal bridged run per row. Returns (extent, mass, lo, hi).

    Rows with no ink get extent 0, mass 0, lo -1, hi -1. A row with no raw
    runs has no principal run, hence extent 0, by the substrate's own
    definitions; no special case is needed and none is written.
    """
    extent = np.zeros(nrows, dtype=np.int64)
    mass = np.zeros(nrows, dtype=np.int64)
    lo = np.full(nrows, -1, dtype=np.int64)
    hi = np.full(nrows, -1, dtype=np.int64)
    if len(row) == 0:
        return extent, mass, lo, hi

    gap = np.empty(len(row), dtype=np.int64)
    gap[0] = 1 << 40
    gap[1:] = x_start[1:] - x_end[:-1] - 1
    new_chain = (gap > g)
    new_chain[1:] |= (row[1:] != row[:-1])
    new_chain[0] = True
    chain = np.cumsum(new_chain) - 1
    nch = int(chain[-1]) + 1

    ch_mass = np.zeros(nch, dtype=np.int64)
    np.add.at(ch_mass, chain, length)
    first_idx = np.zeros(nch, dtype=np.int64)
    first_idx[chain[new_chain]] = np.nonzero(new_chain)[0]
    last_idx = np.zeros(nch, dtype=np.int64)
    np.maximum.at(last_idx, chain, np.arange(len(row)))
    ch_lo = x_start[first_idx]
    ch_hi = x_end[last_idx]
    ch_extent = ch_hi - ch_lo + 1
    ch_row = row[first_idx]

    # principal: greatest mass, ties by greater extent, then leftmost.
    # Deterministic, per R-1.
    order = np.lexsort((ch_lo, -ch_extent, -ch_mass, ch_row))
    cr = ch_row[order]
    keep = np.ones(len(cr), dtype=bool)
    keep[1:] = cr[1:] != cr[:-1]
    sel = order[keep]
    r = ch_row[sel]
    extent[r] = ch_extent[sel]
    mass[r] = ch_mass[sel]
    lo[r] = ch_lo[sel]
    hi[r] = ch_hi[sel]
    return extent, mass, lo, hi


def page_substrate(img, g=G_BRIDGE):
    """Everything the two call sites need, computed once per page.

    Returns a dict with:
        ink          boolean mask
        total_dark   per-row dark pixel count
        extent       per-row principal bridged extent
        mass         per-row principal bridged mass
        lo, hi       per-row principal bridged run bounds
        conc         per-row bridged concentration, 0 where the row is blank
    """
    ink = img < 128
    nrows, W = ink.shape
    row, xs, xe, ln = row_runs(ink)
    extent, mass, lo, hi = principal_per_row(nrows, row, xs, xe, ln, g)
    total_dark = ink.sum(axis=1).astype(np.int64)
    conc = np.where(total_dark > 0, mass / np.maximum(total_dark, 1), 0.0)
    return dict(ink=ink, nrows=nrows, width=W, total_dark=total_dark,
                extent=extent, mass=mass, lo=lo, hi=hi, conc=conc, g=g)


# ---------------------------------------------------------------------------
# THE SENTINEL. Ratified by Fable, 2026-07-28, "the annihilation lemma, the
# sentinel re-denotation of K, and consequential corrections", provisions 1
# to 3.
#
# WHAT THIS IS NOT. It is not a discriminator. The constant formerly called K
# was to be derived by the clearance rule over the discard population
# surviving each call site's second conjunct. That population is EMPTY, and
# empty by construction rather than by accident: the clearance rule places a
# threshold at the discard population's measured extreme plus a strictly
# positive margin, so no row of that measured population can clear it. Fable
# ratified this as THE ANNIHILATION LEMMA -- a clearance-derived constant
# annihilates its own measured discard population on the derivation corpus,
# so no second constant may be derived by the clearance rule over the
# survivors of a first, on the same corpus.
#
# Nor can K be derived over the population REACHING the second conjunct.
# Bridged concentration is principal mass over total mass, so ANY row whose
# ink is a single run sits at exactly 1.0000 regardless of mass: one stem
# crossing, one barline, one speck. Measured 2026-07-28: 5,584 non-band rows
# at exactly 1.0000 against a keep minimum of 0.9737. The two extremes
# COINCIDE, the separation interval is empty, and no threshold exists.
#
# WHAT IT IS. A corpus-envelope tripwire with RAISE semantics only. K_S is the
# measured minimum bridged concentration over the keep population, corpus-wide
# and unmodified: no offset, no standard deviation, the measured extreme
# itself. A row that its site's operative test ACCEPTS, whose concentration
# falls strictly below K_S, is a row neither measured population contains. The
# mechanism has no evidence with which to classify it in either direction, and
# abstain-beats-guess ranks a loud halt above either silent choice.
#
# Because its breach is a raise, the direction law -- which governs where
# SILENT misclassification cost falls -- does not bear on it, and because it
# uses no dispersion statistic, no scale is taken from anywhere.
#
# BINDING RULE, ratified: the sentinel binds to RULED ACCEPTANCES ONLY --
# walk-accepted rows and five-line-validated staff rows. It must NEVER bind to
# candidate generation, whose over-acceptance is lawful by design; a sentinel
# on the candidate stream would fire on rows no decider ever accepted and
# convert a completeness law into a standing false alarm. Downstream of every
# decision, upstream of none.
#
# Measured 2026-07-28 over 3,060 keep rows on all 47 rendered pages,
# reproducing to four figures the on-band minimum the band-edge ruling
# ratified on 56 rows.
#
# RE-DERIVED 2026-08-24, N.83, ON THE ENLARGED CORPUS. Same derivation, no
# offset, no dispersion statistic, no per-source branching: the measured
# minimum bridged concentration over the keep population, at the re-derived
# g = 18.
#
# POPULATION: 3,060 SVG-anchored rule-band rows over the 47 rendered pages (the
# ratified 2026-07-28 population, reproduced exactly this session as a positive
# control -- 3,060 rows, minimum 0.9736526946 at g = 1, which is the ratified
# 0.9737) PLUS the 90 five-line-validated staff rows of the two Lamm scan pages.
# Measured at g = 18: the render side is 0.9736526946 and the scan side is
# 0.6428571429, so the corpus minimum is 0.6428571429. Truncated, not rounded,
# to four figures, so that the measured extreme itself passes rather than
# raising on its own derivation corpus:
K_S = 0.6428
#
# THE ENVELOPE IS NOW MUCH WIDER THAN IT WAS, from 0.9737 to 0.6428. That is
# not a loosening anyone chose; it is what the ratified derivation yields once
# a real print joins a corpus of clean renders. On a print, speckle breaks
# every staff line into many runs, and a row that is one unbroken stroke on a
# Verovio render is a chain of dozens of fragments here.
#
# CONTROL, on the desk's own numbers: the scan-side instrument reproduces the
# two figures the N.83 brief quotes, exactly. Page 1's validated-row minimum
# measures 0.501340 at g = 6 and 0.504354 at g = 8, against the brief's 0.5013
# and 0.5044.
#
# WHAT THIS DERIVATION DOES NOT COVER, and it is the open question of N.83.
# The binding rule names TWO ruled acceptance points, and only one of them is
# in the population above. The other is beams.remove_lines_safe's band walk
# (beams.py, "the sentinel binds HERE"). On both scan pages that walk does not
# terminate where it does on a render: measured 2026-08-24 on raster400-1.png
# at every g from 1 to 120, it accepts ALL 4,920 rows of the page, including
# 1,357 rows with no ink at all, whose concentration is exactly 0. The cause is
# measured and is not the sentinel's: _extent_consistent admits a row when its
# principal extent is within T_REL = 0.79327 of the CLAIMED STAFF's extent, and
# on a speckled print two of the 45 seed rows carry a bridged extent below that
# fraction of their own staff's extent (0.633 of it at g = 18), from which the
# walk swallows the page. On all 47 render pages that ratio is exactly 1.000 on
# every seed row, which is why the walk has never done this before.
#
# So the derivation "corpus-wide over the keep population" taken across BOTH
# binding points yields K_S = 0.0000 on this corpus -- a sentinel that can
# never fire, annihilated by its own derivation. That is a real result and it
# is recorded rather than papered over. It is NOT adopted here, because a
# vacuous sentinel is not a sentinel and this session has no authority to
# re-denote one. K_S above is therefore derived over the five-line-validation
# keep population only, and the consequence is stated plainly: at any K_S
# strictly above 0, the band walk's sentinel raises on both scan pages. The
# walk's membership premise, not the sentinel, is what fails off the render
# corpus. That is Dann's to rule on, alongside the standing finding that
# K_S was calibrated to Verovio renders and to nothing else.


class SentinelRaise(RuntimeError):
    """A ruled acceptance fell below the corpus concentration envelope."""


def sentinel(sub, rows, where, page=None):
    """Raise if any ACCEPTED row's bridged concentration is below K_S.

    sub:   the dict returned by page_substrate
    rows:  an iterable of accepted row indices
    where: the binding point's name, so a raise says which decider accepted it
    """
    conc = sub['conc']
    bad = [(int(r), float(conc[r])) for r in rows if conc[r] < K_S]
    if bad:
        raise SentinelRaise(
            "sentinel at %s on page %r: %d accepted row(s) below the corpus "
            "concentration envelope K_S=%.4f: %r. Neither measured population "
            "contains these rows; this is a halt, not a classification."
            % (where, page, len(bad), K_S, bad[:8]))
