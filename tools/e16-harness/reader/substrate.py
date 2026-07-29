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

At runtime the reader bridges blindly, every gap <= g, because the SVG is
oracle-only. The SVG anchors the derivation and the acceptance tests, never
the runtime path.
"""
import numpy as np

# Derived per corpus under R-1'. See the module docstring: this is a
# measurement of this renderer's raster, not a tunable.
G_BRIDGE = 1


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
K_S = 0.9737


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
