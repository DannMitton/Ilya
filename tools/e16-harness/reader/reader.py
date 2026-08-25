"""E.16 generalized deterministic vocal-line reader (fidelity build, rev 3).
Restored verbatim from claude/e16-reader-code-generalized_2026-07-24.py.
One parameterized module; no hardcoded staff lines. All stages read PIXELS.
Thresholds staff-space-normalized (Gould proportion). Accidental branches:
flat, natural, sharp, double-sharp (E263), double-flat (E264), abstain.
"""
import cv2, numpy as np, json
from fractions import Fraction

LET_BY_DEG = "CDEFGAB"
LETIDX = {'C':0,'D':1,'E':2,'F':3,'G':4,'A':5,'B':6}
SEMI = {'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11}

# ---------- staff detection ----------
# The gate derivation's FLOOR, named once so that the derivation and the test
# for its own collapse (detect_staves, below) quote the same number rather than
# two literals that can drift apart. Its grounds are in the docstring below.
_ROWFRAC_FLOOR = 0.015

def _derive_rowfrac_gate(rowfrac, floor=_ROWFRAC_FLOOR, span_bound=0.0137, min_members=5):
    """PER-PAGE ROWFRAC GATE, derived (detect-staves-gate fix, 2026-07-27,
    Fable's ruling on the detect_staves gate, same-day amendment, ratified by
    Dann; span_bound re-derived same day by the oracle amendment, also
    ratified by Dann -- see fable-ruling-e16-oracle-amendment.md). Replaces
    the fixed literal rowfrac>0.35. Same 1-D gap-statistic primitive as
    STAFF-BREAK THRESHOLD below, applied to the page's own distribution of
    per-row ink coverage instead of to line-position gaps.

    A single fixed cutoff cannot separate real staff lines from contamination
    across pages: on repaired sunless-03 p4, contamination rows peak at
    0.358-0.463; on legacy sunless-03 p4 they peak at 0.5391 -- HIGHER than
    the real (short-final-system) staff lines on repaired sunless-03 p5,
    which sit at 0.5226-0.5286, and higher still than legacy sunless-03 p5's
    real short-system lines at ~0.5157. No single constant separates real
    lines from contamination across every page.

    Nor can "take the largest gap in the sorted coverage distribution"
    substitute for a per-page derivation: measured directly on repaired
    sunless-03 p5, the single largest gap (0.5286->0.9004) sits BETWEEN two
    real populations -- a short final system (six lines, ~0.52-0.53) and the
    page's full-width systems (~0.90) -- and choosing it silently deletes the
    short system's lines. The derivation below must instead find the boundary
    of the noise population: the lowest qualifying cut above the near-zero
    background, not the largest gap wherever it falls.

    Method: sort the page's per-row coverage values and split them into
    segments wherever a consecutive gap exceeds FLOOR (0.015 rowfrac,
    comfortably above the ~0.0002-0.001 spacing measured within one genuine
    coverage population, comfortably below the smallest confirmed population
    boundary measured anywhere in this corpus, 0.0472 on repaired sunless-03
    p5). The page's highest segment is always real (nothing else on a page
    reaches that much continuous ink). Walk downward from it, accepting each
    further segment as ALSO real staff-line evidence only if it is BOTH tight
    (span < SPAN_BOUND, strict) AND carries at least MIN_MEMBERS samples.
    The gate is set at the midpoint of the boundary gap immediately below
    the lowest ACCEPTED segment. Named, unit-bearing (rowfrac, a coverage
    fraction), fitted per page and discarded: same primitive, same "fitting
    is not training" fence as the staff-break threshold.

    SPAN_BOUND = 0.0137, STRICT COMPARISON (span < span_bound).

    *** DERIVATION STRUCK, VALUE RETAINED. CORRECTION EIGHT, 2026-07-27. ***
    (claude/fable-ruling-e16-correction-eight-exemplar-contamination_2026-07-27.md)

    The midpoint derivation recorded below until 2026-07-27 is STRUCK. Both
    exemplars it was drawn from contain ZERO staff lines: they are the same
    kind of object as each other, and a constant derived as the midpoint
    between two objects of the same kind is not a boundary between kinds.
    The VALUE 0.0137 is RETAINED, demoted to an empirically pinned constant
    whose sole remaining authority is the thrice-verified corpus outcome
    (45 correct, 1 loud, 1 silent, zero silent repaired). It is scheduled for
    replacement by the unified 5.1 + 5.2 track. NO NEW WORK MAY CITE THE
    MIDPOINT DERIVATION.

    The vocabulary the record was missing, and everything below depends on
    it: "accept" was carrying two distinct verdicts. IDENTITY asks whether a
    segment is staff-line ink. PASSAGE asks whether the gate must lie below
    it. Under a prefix walk these coincide often enough that the difference
    went unnoticed. A ratified verdict can be correct while its ratified
    reason is false, and the two rot at different rates.

    Exemplars, corrected. Truth from Verovio SVG staff-path row geometry
    (standing law V1), independently confirmed on two separately written
    scripts. "Members" means DISTINCT COVERAGE VALUES, which is the quantity
    min_members gates via len(seg); the p6 segment also spans 11 member rows,
    and the two figures count different things:
      - must-ACCEPT exemplar: span 0.012903225806451535, repaired
        sunless-06 p6, second-highest-coverage segment, 6 members. THIS
        SEGMENT CONTAINS ZERO STAFF LINES. It is contamination, consistent
        with lyric text between staves: its rows (526 to 549) sit between a
        staff ending at row 506 and a staff beginning at row 634. It must
        nonetheless be accepted, because acceptance is a prefix walk from the
        top: the page's genuine third system (oracle total 9, per-system
        [3, 3, 3]) lies in a LOWER segment at coverage 0.4540 to 0.4573, and
        rejecting this segment stops the walk before reaching it, returning a
        silent 6 against a true 9. Acceptance here is a PASSAGE verdict, not
        an IDENTITY verdict: it is the price of reaching real staff lines
        below, not a judgement that this segment is staff ink. The former
        description of this segment as "a GENUINE system of three staves" was
        false and is retracted.
      - must-REJECT exemplar: span 0.014516129032258074, repaired
        sunless-06 p5, 5 members. LIKEWISE CONTAMINATION WITH ZERO STAFF
        LINES. On that page every genuine staff line lies in the top segment,
        so nothing below the top segment warrants passage. Accepting it (as
        the old floor=0.015 did) converts a correct page into an abstention
        and drops the corpus from 45 correct to 43 against the oracle.
      - What actually separates the two exemplars is therefore a LOOKAHEAD
        property, whether continuing the walk reaches real staff lines, and
        span is a LOCAL property of the segment under test. On every
        run-structure measure the two segments agree to three decimal places.
        The 0.0016 span difference between two pieces of lyric text is noise
        that fell on the right side of a line.
      - midpoint = 0.013709677419354804, recorded as 0.0137. STRUCK as a
        derivation, per the ruling above. Retained here only so that the
        provenance of the retained value is legible, never as justification.
      - guard interval (0.0129032..., 0.0145161...], admissible only under
        strict comparison: at a bound of 0.0129032... the must-accept
        segment must still be accepted (span == bound must pass), and at
        0.0145161... the must-reject segment must still be rejected (span
        == bound must fail). Only "span < span_bound" satisfies both.
      - re-derivation trigger, ratified: any conditionally tested genuine
        segment measuring wider than 0.0129032..., or any contamination
        segment measuring narrower than 0.0145161..., moves this interval.
        The constant returns to Fable before any new value is chosen.
      - THE POOLING TRAP, recorded with the procedure because it has
        already corrupted a derivation once: the topmost coverage segment
        on each page is accepted UNCONDITIONALLY (it is always real -- see
        "the page's highest segment is always real" above) and must be
        EXCLUDED from exemplar extraction. Pooling it into the must-accept /
        must-reject candidate pool silently corrupts the derivation.
    Superseded: the prior value 0.012 (no explicit operator, read as "<="
    in practice) and the prior claimed genuine-population range
    0.0060-0.0089 and prior contamination span 0.0141 on repaired
    sunless-03 p4. Both prior span claims were measured against the
    detector's OWN frozen counts, which were themselves wrong on two pages
    the oracle later caught; they are struck, not merely superseded, per
    Fable's process rule that no acceptance test (and, by the same
    reasoning, no constant derivation) may take its expected value from the
    mechanism under test.

    MIN_MEMBERS = 5 (one staff's worth of lines). Measured admissible range
    at span_bound=0.0137, against the oracle: [4, 5] give identical corpus
    outcomes (45 correct, 1 loud, 1 silent); 3 degrades. 5 is RETAINED on
    the structural argument alone (five lines to a staff), not because the
    margin is zero: the prior ruling's claim of a zero lower margin is
    struck, it was an artifact of a wrong (detector-circular) check.
    Re-derivation trigger: if any genuine conditionally tested segment ever
    measures fewer than 5 members, coverage quantization has merged genuine
    lines and the constant returns to Fable.

    FLOOR = 0.015. Accepted, no longer provisional. Evidential guards
    against the oracle: 0.0095 and 0.010 give 4 silent failures; 0.015
    through 0.030 give 2. The exact boundary in (0.010, 0.015) and which
    segments flip there remain unmeasured and unprocured; that does not
    block this value, which sits inside a band whose failure modes are
    measured on both sides.

    The 0.005 pre-filter (`rowfrac[rowfrac > 0.005]` below) is declared and
    left in place. Measured inert range [0.0, 0.1]: removal was never among
    the measured conditions and is not proposed here.

    Verified 2026-07-27 against the SVG oracle (oracle.py) covering the
    full 47-page rendered corpus (24 repaired + 23 legacy) plus the
    synthetic close fixture (certified by construction, count 1): AT-8 at
    span_bound=0.0137 measures 45 correct, 1 loud (repaired sunless-06 p6,
    the must-accept exemplar, now correctly abstaining instead of lying),
    1 known-silent (legacy sunless-05 p5, a named mechanism-gap ledger item
    per the ruling's 1.5, out of AT-1's repaired scope). Every REPAIRED page
    either matches the oracle or raises: zero silent repaired pages
    (AT-1, restated hard invariant).
    """
    nz = rowfrac[rowfrac > 0.005]
    if len(nz) == 0:
        return 1.0   # nothing on the page clears the noise floor; let "no staff lines" fire below
    vals = np.unique(nz)
    if len(vals) == 1:
        return float(vals[0]) / 2.0
    diffs = np.diff(vals)
    n = len(vals)
    splits = [i for i in range(len(diffs)) if diffs[i] > floor]
    bounds = [0] + [i + 1 for i in splits] + [n]
    segments = [vals[bounds[k]:bounds[k + 1]] for k in range(len(bounds) - 1)]
    idx = len(segments) - 1
    accepted_lo_val = segments[idx][0]
    idx -= 1
    while idx >= 0:
        seg = segments[idx]
        span = seg[-1] - seg[0]
        if span < span_bound and len(seg) >= min_members:
            accepted_lo_val = seg[0]
            idx -= 1
        else:
            break
    below = vals[vals < accepted_lo_val]
    if len(below):
        gate = (below.max() + accepted_lo_val) / 2.0
    else:
        gate = accepted_lo_val / 2.0
    return gate

# ---------- STAFF SPACE FROM VERTICAL RUN LENGTHS ----------
#
# N.59, E.58. A FALLBACK, never the primary estimator, and the restriction is
# the point: the 23 fixture pages all read today and their `ro` is the baseline
# every downstream number rests on. A new primary estimator could shift `s` by a
# fraction of a pixel on every one of them and move measurements nobody asked to
# move. A fallback that never fires on a working page cannot do that.
#
# WHY THIS METHOD. `detect_staves` projects dark-pixel fractions across the WHOLE
# page width, which only means "this row is a staff line" when the page is square
# to the frame. On Dann's photograph of Kabalevsky op. 52 no. 9 page 32, rotated
# a measured 1.04 degrees, the top staff line drifts 29 px across 1,600 px, which
# is 1.7 staff spaces: the projection smears every line into its neighbours,
# `intra` comes out empty, and `np.median` of an empty array returns NaN twice in
# a row without raising. The information was never lost; the instrument averaged
# it away.
#
# SOURCE. Cardoso and Rebelo, "Robust Staffline Thickness and Distance Estimation
# in Binary and Gray-Level Music Scores", ICPR 2010, DOI 10.1109/ICPR.2010.458:
# the most common black run is the staff-line thickness and the most common white
# run is the staff space, and "these estimates are also immune to severe rotation
# of the image". They are per-column and never sum ink across the page width,
# which is exactly the operation that returned NaN.
#
# THE PAIRED-SUM VARIANT, NOT THE NAIVE ONE. The same paper reports the naive
# method failing measurably on a degraded score, returning line height 1 and
# space height 1 against true values of 5 and 19, defeated by isolated black
# pixels and by fluctuation in line thickness. Their fix is to histogram the SUM
# of a black run and its adjacent white run, because a local thickness
# fluctuation is usually compensated by an opposite fluctuation in spacing. That
# sum is the line-to-line PERIOD, which is the same quantity `detect_staves`
# derives from the differences between line centres, so the two estimators
# measure the same thing and their outputs are comparable.

def _column_runs(col):
    """Run-length encode one boolean column into (lengths, values)."""
    n = col.size
    if n == 0:
        return np.empty(0, np.intp), np.empty(0, bool)
    change = np.flatnonzero(col[1:] != col[:-1]) + 1
    starts = np.concatenate(([0], change))
    ends = np.concatenate((change, [n]))
    # np.intp, NOT np.int64. Pyodide's WASM build is 32-bit, so intp is int32
    # and `np.bincount` REFUSES an int64 array with "cannot cast ... according to
    # the rule 'safe'". A 64-bit desktop numpy accepts it happily, so this fault
    # is invisible to every local run and appears only in a browser. Measured
    # 2026-08-16, on the very page this fallback exists to rescue.
    return (ends - starts).astype(np.intp), col[starts]

def staff_space_from_runs(img, sample_every=8, lo=4, hi=200, min_pairs=50):
    """Modal black-plus-following-white run length, in pixels, or NaN.

    `lo` and `hi` bound what a staff-line period can be on any page: below 4 px a
    five-line staff spans under 16 px and no notehead is resolvable, and above
    200 px a single staff would be taller than most whole pages. They exclude
    nonsense, they do not select an answer."""
    dark = (img < 128)
    H, W = dark.shape
    pairs = []
    for x in range(0, W, sample_every):
        lengths, vals = _column_runs(dark[:, x])
        # The first and last run are cut off by the page edge and carry no
        # period, so they are dropped rather than counted short.
        if lengths.size < 3:
            continue
        lengths, vals = lengths[1:-1], vals[1:-1]
        black = np.flatnonzero(vals)
        black = black[black + 1 < lengths.size]
        if black.size:
            pairs.append(lengths[black] + lengths[black + 1])
    if not pairs:
        return float('nan')
    allp = np.concatenate(pairs)
    allp = allp[(allp >= lo) & (allp <= hi)]
    # Too little evidence is an abstention, not a guess. A page of music crossed
    # by a few hundred sampled columns yields thousands of periods; fifty is a
    # floor against a nearly blank frame, not a tuned constant.
    if allp.size < min_pairs:
        return float('nan')
    return float(np.argmax(np.bincount(allp.astype(np.intp))))

def _plausible_s(s, img):
    """Is this staff space usable at all? A staff is four spaces tall, so one
    taller than the page cannot be right."""
    if s is None or not np.isfinite(s) or s < 4.0:
        return False
    return 4.0 * s <= img.shape[0]

# ---------- NARROW-SLICE LINE CANDIDATES: A FALLBACK, NEVER THE PRIMARY ------
#
# N.83, 2026-08-24. E.60 demoted the slice comb to a desk instrument and said do
# not promote it. That ruling is five days old and it STANDS, for the PRIMARY
# path. Its three kill grounds were re-checked against this corpus, and the
# distinction is on the record here because a later reader will otherwise see
# only the contradiction:
#
#   "E.60 demoted slice combs to a desk instrument and said do not promote:
#   that ruling is five days old and stands for the PRIMARY path. Its three
#   kill grounds were re-checked against this corpus tonight: line overlap in
#   row space needs shear that collapses lines into one another, and at s = 30
#   with at most 0.232 degrees the lines never overlap; the 0-of-23 fixture
#   failure cannot occur where the fallback never fires on renders; the 16 to
#   59 times cost is paid only on a page that would otherwise not read at all."
#
# The cost argument is the whole shape of this thing. A comb that runs on every
# page buys nothing and pays 16 to 59 times; a comb that runs only where the
# full-width projection has already failed pays that multiple on a page whose
# alternative is not reading.
#
# METHOD, fixed by the N.83 brief: five slices of 200 px at 15, 30, 50, 70 and
# 85 percent of page width; per-slice row projection; a row is a line hit in a
# slice when more than half that slice's width is dark; consensus across the
# five slices gives the line centres. Because the slices are narrow, a line
# that drifts across the page still fills each slice it crosses, which is
# exactly what the full-width projection cannot do.
SLICE_WIDTH = 200          # px, absolute; the brief's figure, at 400 dpi
SLICE_FRACS = (0.15, 0.30, 0.50, 0.70, 0.85)
SLICE_FILL = 0.5           # a line hit fills more than half the slice
SLICE_CONSENSUS = 3        # majority of the five slices

# Counted, not printed: the fixture proof asserts this stays at zero across the
# 23 render pages, and the drawer's read report can declare a firing.
FALLBACK_FIRINGS = 0

def _slice_line_rows(img):
    """Rows that a majority of five narrow slices call staff line.

    Index arrays are left at numpy's default dtype throughout. Pyodide's WASM
    build is 32-bit, np.intp is int32 there, and an int64 index array is a
    fault that no desktop run can see.
    """
    dark = img < 128
    H, W = dark.shape
    votes = np.zeros(H, dtype=int)
    w = min(SLICE_WIDTH, W)
    for f in SLICE_FRACS:
        x0 = max(0, min(W - w, int(round(f * W)) - w // 2))
        votes += (dark[:, x0:x0 + w].mean(axis=1) > SLICE_FILL).astype(int)
    return np.flatnonzero(votes >= SLICE_CONSENSUS)

def _lines_from_rows(rows):
    """The existing proximity grouping of candidate rows into line centres,
    lifted verbatim out of detect_staves so the fallback consumes the SAME
    grouping the primary path does."""
    lines=[]; cur=[rows[0]]
    for r in rows[1:]:
        if r-cur[-1]<=3: cur.append(r)
        else: lines.append(int(np.mean(cur))); cur=[r]
    lines.append(int(np.mean(cur)))
    return np.array(lines)

def detect_staves(img, page=None):
    """Staff detection, with ONE fallback path on the Cardoso-Rebelo precedent.

    The primary path is unchanged and runs first on every page. The fallback
    runs only where the primary has already failed loudly, or where the rowfrac
    gate can be seen to have collapsed BEFORE it is trusted. Everything
    downstream of candidate generation -- line grouping, the staff-break
    threshold, five-line validation, the sentinel -- is shared, so the fallback
    cannot reach a conclusion by a route the primary path does not also take.

    A SentinelRaise is NOT a trigger. It is a halt, it is downstream of every
    decision, and retrying it through another candidate generator would convert
    the one mechanism that abstains into one that shops for a second opinion.
    It is re-raised explicitly, because SentinelRaise subclasses RuntimeError
    and would otherwise be swallowed by the trigger below.
    """
    global FALLBACK_FIRINGS
    import substrate as _sub
    rowfrac=(img<128).mean(axis=1)
    gate=_derive_rowfrac_gate(rowfrac)
    # THE SELF-DETECTABLE DEGENERATE GATE. _derive_rowfrac_gate splits the
    # sorted coverage distribution at gaps above its FLOOR of 0.015 and walks
    # down from the top segment. Where a skewed staff's diluted line rows
    # bridge the background population into the staff population, the page
    # forms ONE segment, the walk has nowhere to stop, and the gate lands below
    # the very floor that defines a meaningful gap -- 0.0026 on Lamm scan page
    # 2, admitting 3,823 of 4,920 rows. A gate beneath the derivation's own
    # floor constant is the derivation reporting that its premise did not hold
    # on this page, and that is readable here without consulting the answer.
    if gate >= _ROWFRAC_FLOOR:
        try:
            line_rows=np.where(rowfrac>gate)[0]
            if len(line_rows)==0: raise RuntimeError("no staff lines")
            return _staves_from_lines(img, _lines_from_rows(line_rows), page)
        except _sub.SentinelRaise:
            raise
        except RuntimeError:
            pass
    rows=_slice_line_rows(img)
    if len(rows)==0: raise RuntimeError("no staff lines")
    FALLBACK_FIRINGS += 1
    return _staves_from_lines(img, _lines_from_rows(rows), page)

# ONE PHYSICAL LINE, ONE CENTRE (N.96 Part 2, 2026-08-24, Dann's ruling). On a
# SKEWED page a single staff rule descends across the width, so the five slices
# of `_slice_line_rows` peak at different rows, the consensus of three holds
# only intermittently down that band, and `_lines_from_rows`' fixed 3 px
# proximity chain can break one physical line into TWO centres. The staff then
# groups as six lines and `_staves_from_lines` raises "contaminated staff
# group" on a page whose staves are perfectly ordinary.
#
# MEASURED, on the Lamm scan page 2, top staff, where this was found. That rule
# descends about 9 rows from the leftmost slice to the rightmost. The app's own
# pdf.js raster produces candidate rows {409, 410, 414}; the 4-row hole exceeds
# the 3 px chain and yields centres 409 and 414. Poppler's raster of the SAME
# page produces {408, 409, 411, 413, 414}, chains all five, and yields one
# centre at 411. The two rasters differ by two marginal rows: at row 411 the
# fourth slice fills 0.48 against poppler's 0.78, and at row 413 the fifth
# fills 0.16 against 0.51, on either side of SLICE_FILL. Poppler passes this
# page by 0.01 of slice fill. That is luck, not margin, and it is the reason
# this is repaired at the grouping rather than at the raster.
#
# TWO CANDIDATE MECHANISMS WERE REFUTED FIRST, both by measurement, because
# Dann ranked them above this one.
#   (a) The binarisation threshold. Re-run at every threshold from 100 to 220,
#       the split SURVIVES: group sizes stay [6, 1, 5, ...] throughout and go
#       to [7, 1, 5, ...] below 128. The grey information does not carry the
#       discriminator, so deriving the threshold would not have helped.
#   (b) Resampling. `imageSmoothingEnabled = false` changes NOTHING (identical
#       levels and identical ink at both scales; pdf.js scales the image itself
#       before the canvas sees it). At the embedded image's native 600 dpi the
#       raster is BITONAL, 2 grey levels, no antialiasing whatever, and
#       `detect_staves` STILL raises. Resampling does not manufacture the bad
#       rows.
#
# BOUND, measured over 2,245 consecutive line-centre gaps across all 51 corpus
# pages (47 render fixtures, both Lamm rasters, both pdf.js rasters):
#   split of one line   0.1724 s   (5 px at s = 29, the case above)
#   every other gap     >= 0.5667 s, and the next after that 0.9655 s
#   render corpus       minimum exactly 1.0000 s, on all 2,057 of its gaps
# The interval between 0.1724 s and 0.5667 s is empty. `LINE_MERGE = 1/3` sits
# inside it, anchored structurally rather than bisected: two centres closer
# together than one staff line is THICK cannot be two different lines, and the
# corpus's own worst measured line thickness is 0.2333 s (7 px at s = 30 on
# raster400-2; every render page measures 0.0952 s). A third of a staff space
# admits a split of about one and a half of the thickest measured line, clears
# the measured defect by 0.161 s, and stays 0.233 s below the smallest genuine
# gap anywhere in the corpus.
#
# IT IS A MEASURED NO-OP ON THE RENDER CORPUS. The smallest gap on any of the
# 47 fixture pages is exactly 1.0000 s, three times the bound, so nothing
# merges there and `s` is re-derived only when something actually did merge.
# This is byte-identity by measurement over the whole corpus, not by argument.
LINE_MERGE = 1.0 / 3.0   # * s

def _merge_split_lines(lines, s, diffs_rule):
    """Collapse consecutive line centres closer than LINE_MERGE * s into their
    mean, and re-derive s from the result. Returns (lines, s), unchanged and
    untouched where nothing merged."""
    if len(lines) < 2:
        return lines, s
    bound = LINE_MERGE * s
    groups = [[int(lines[0])]]
    for c in lines[1:]:
        if c - groups[-1][-1] <= bound:
            groups[-1].append(int(c))
        else:
            groups.append([int(c)])
    if len(groups) == len(lines):
        return lines, s                     # nothing merged; byte-identical
    merged = np.array([int(round(float(np.mean(g)))) for g in groups])
    return merged, diffs_rule(np.diff(merged))

def _staves_from_lines(img, lines, page=None):
    diffs=np.diff(lines)
    # N.59, E.58: EVERY ONE OF THESE CAN DEGENERATE SILENTLY. `lines` of length 1
    # gives an empty `diffs`; np.median of an empty array is NaN; `diffs < NaN`
    # is all False, so `intra` is empty; np.median of that is NaN again. Two
    # silent NaNs and no exception. That NaN travelled four frames on Dann's own
    # photograph before `int(1.7 * s)` in beams.py raised on it, and the uploader
    # then invented a reason for a failure it had not diagnosed.
    with np.errstate(invalid='ignore'):
        med = np.median(diffs) if diffs.size else float('nan')
        intra = diffs[diffs < med * 1.6] if np.isfinite(med) else diffs[:0]
        s = float(np.median(intra)) if intra.size else float('nan')
    if not _plausible_s(s, img):
        # The projection could not measure this page. Try the rotation-immune
        # estimator before giving up, and re-derive the line grouping from it.
        s = staff_space_from_runs(img)
    if not _plausible_s(s, img):
        # The SAME honest failure the top of this function already raises, so
        # the uploader's existing mapping needs no new case.
        raise RuntimeError("no staff lines")
    # A split rule is repaired HERE, after s is measured, because the bound is
    # scale-relative and `_lines_from_rows` runs before any s exists. See the
    # LINE_MERGE derivation.
    def _s_from(d):
        with np.errstate(invalid='ignore'):
            m = np.median(d) if d.size else float('nan')
            i = d[d < m * 1.6] if np.isfinite(m) else d[:0]
            return float(np.median(i)) if i.size else float('nan')
    lines, s2 = _merge_split_lines(lines, s, _s_from)
    if _plausible_s(s2, img):
        s = s2
    diffs = np.diff(lines)
    # STAFF-BREAK THRESHOLD, adaptive (close-prep fix, 2026-07-24). A fixed
    # 1.7*s cutoff mis-split a beamed re-render of piece 01 p1: system 4's
    # vocal-to-piano gap measured 35 px against a 1.7*21=35.7 px threshold, a
    # sub-pixel miss that merged two staves into one invalid 7-line group and
    # dropped an entire vocal system (18 notes, pitch F1 0.69). The two
    # populations (intra-staff line gaps ~s, inter-staff gaps several times s)
    # are always well separated on a real page; a fixed multiple of s is not
    # robust to natural per-page layout compression. Classical 1-D gap-statistic
    # clustering (find the largest ratio jump in the sorted gap list) is the
    # per-page-calibrated, image-checkable replacement: named, unit-bearing in
    # px, fitted per page and discarded, admissible under the "fitting is not
    # training" fence and T4's classical-CV precedent class.
    big=sorted(d for d in diffs if d>1.3*s)
    if big:
        min_big=big[0]
        break_thr=(1.3*s+min_big)/2.0
    else:
        break_thr=1.7*s   # fallback: no candidate inter-staff gap found at all
    staves=[]; cur=[lines[0]]
    for i in range(1,len(lines)):
        if lines[i]-cur[-1] > break_thr: staves.append(cur); cur=[lines[i]]
        else: cur.append(lines[i])
    staves.append(cur)
    # ABSTENTION ON CONTAMINATED STAVES (detect-staves-gate fix, 2026-07-27,
    # Fable's ruling, ratified by Dann). The old `[st for st in staves if
    # len(st)==5]` silently discarded any group that was not exactly 5 lines.
    # A contaminated staff (5 real lines plus 1-2 absorbed false rows) was
    # thrown away WHOLE, not repaired, shifting every later staff index and
    # losing a real staff outright. Measured across 24 repaired pages: every
    # undersize group (1 or 2 lines) is spurious ink -- discard it as before,
    # nothing real is lost that way. But a group of 3 or more lines carries a
    # MAJORITY of a five-line staff and is evidence of a staff plus
    # contamination, not evidence of no staff: silently dropping it is the
    # exact defect this fix exists to close. Loud abstention replaces silent
    # discard for that case, matching the "no staff lines" precedent already
    # above in this function.
    checked=[]
    for st in staves:
        if len(st) <= 2:
            continue
        elif len(st) == 5:
            checked.append(st)
        else:
            raise RuntimeError(
                "detect_staves: contaminated staff group on page %r: group of "
                "%d lines is not a valid 5-line staff (all group sizes: %r)"
                % (page, len(st), [len(s) for s in staves]))
    # THE SENTINEL, ratified 2026-07-28. This is a RULED ACCEPTANCE point: the
    # rows below have been validated as staff lines and every downstream stage
    # trusts them. It binds HERE and not at the gate above, because the gate is
    # CANDIDATE GENERATION whose over-acceptance is lawful by design, and a
    # sentinel on the candidate stream would fire on rows no decider ever
    # accepted. Downstream of every decision, upstream of none.
    # N.59, E.58, MY DECISION beyond the brief, with grounds. An EMPTY result was
    # previously returned silently: every candidate group of two lines or fewer
    # is discarded as spurious, and where that discarded all of them the function
    # returned `[]` with no error. `b3-ledger-lines-scale-page.png` at s = 10.0
    # does exactly that. A caller then reads a page with no staves and produces
    # an empty score rather than a failure, which is the same defect as the NaN
    # one layer down: a fault that does not announce itself. It raises the
    # function's own existing failure instead.
    if not checked:
        raise RuntimeError("no staff lines")
    import substrate as _sub
    _s = _sub.page_substrate(img)
    _sub.sentinel(_s, [y for st in checked for y in st],
                  'reader.detect_staves five-line validation', page)
    return checked, s

# ---------- staff selection: THE BRACE RULE ----------
#
# N.59, 2026-08-16. THE LARGEST-GAP HEURISTIC IS STRUCK, not retuned. This
# file's own README already ruled it "unsound, not merely mistuned: within-
# system and between-system gap populations overlap on real pages, so no
# threshold separates them", with three recorded failures, and ruled its
# replacement to be connectivity-based ownership. On E.43's test page the old
# code returned [0, 1, 4, 7, 10] where the correct answer is [0, 3, 6, 9]: it
# invented a system break between the first two staves.
#
# DANN'S RULE, house authority, quoted in Fable's E.57 brief (Ruling E):
# in a three-stave system joined at the left by the system barline, the bottom
# two are braced as the Grand Staff, and THE STAFF NOT IN THE BRACE IS THE
# VOICE. That is a statement about engraving, not about spacing, which is why
# it survives pages the gap heuristic cannot read.
#
# Two things it needs from the raster, and neither is a tuned constant:
#   - a PER-SYSTEM left edge. E.43 established that one page-wide edge misses
#     the indented first system, so the edge is measured per staff.
#   - the system barline, which is what joins a system's staves. Grouping on
#     connectivity rather than on gaps is the README's own ruled replacement.
#
# The brace is found as a connected component sitting left of that edge and
# taller than five staff spaces. A single staff is 4*s tall and an instrument
# name is one or two, so a component spanning two staves plus their gap (about
# 10*s) is separated from both by a wide margin; this is a separator between
# two well-parted populations, not a fitted threshold.
#
# DEGENERATE CASES, ruled simply (Ruling E): a one-staff system's staff is the
# voice; if exactly one staff in a system is unbraced, it is the voice; if no
# brace is found or all staves are braced, take staff 0 of the system and COUNT
# the fallback, which the drawer's read report then declares. More than one
# unbraced staff is not ruled, and is treated as the unruled case it is: the
# same staff-0 fallback, counted the same way, rather than a guess dressed up
# as a rule.

def _staff_left_edge(dark, st):
    """Leftmost column where a majority of this staff's five lines carry ink.
    A majority rather than all five, so one broken line cannot move the edge."""
    hits=dark[st,:].sum(axis=0)
    cols=np.where(hits>=3)[0]
    return int(cols[0]) if len(cols) else None

# JOIN THRESHOLD = 0.5 (N.83, 2026-08-24). Was 0.85, measured on renders alone.
#
# A system barline is drawn as one continuous stroke, so on a clean render the
# column it occupies is filled to 100 percent and the gap between consecutive
# systems fills 4 to 5 percent (ENVIRONMENT.md). On a real print the same
# stroke is speckled: measured on the Lamm scan page 1, the six true joins fill
# 0.819, 0.850, 0.866, and 1.000 three times, while the two true system
# boundaries fill 0.000 and 0.015. At 0.85 the 0.819 join FAILED, staff 5 was
# promoted to a system of its own, and select_vocal returned [0, 3, 5, 6] --
# a piano staff offered to a singer as her line.
#
# 0.5 sits in the middle of a wide, empty gap on BOTH corpora: 0.05 against
# 1.00 on renders, 0.015 against 0.819 on the scan. It is a separator between
# two well-parted populations, not a threshold fitted to either one. The 23
# render fixture pages are byte-identical across the change.
def _joined_at_left(dark, st_a, st_b, x0, s):
    """Does a system barline run down the left edge from staff a to staff b?
    A system's staves are joined there; consecutive systems are not."""
    lo,hi=st_a[-1],st_b[0]
    if hi<=lo or x0 is None: return False
    W=dark.shape[1]
    x_lo=max(0,x0-int(round(0.6*s))); x_hi=min(W-1,x0+int(round(0.6*s)))
    band=dark[lo:hi+1, x_lo:x_hi+1]
    if band.size==0: return False
    return bool(band.mean(axis=0).max()>=0.5)

def _brace_span(dark, x0, sys_top, sys_bot, s):
    """Row range of the brace sitting left of the system's left edge, or None."""
    if x0 is None: return None
    H,W=dark.shape
    x_lo=max(0,x0-int(round(3.5*s))); x_hi=max(0,x0-int(round(0.3*s)))
    if x_hi-x_lo<2: return None
    pad=int(round(0.5*s))
    y_lo=max(0,sys_top-pad); y_hi=min(H-1,sys_bot+pad)
    band=dark[y_lo:y_hi+1, x_lo:x_hi].astype(np.uint8)
    if band.size==0: return None
    num,lab,stats,cent=cv2.connectedComponentsWithStats(band,8)
    best=None
    for i in range(1,num):
        x,y,w,h,area=stats[i]
        if h<5.0*s: continue                     # shorter than two staves plus their gap
        if best is None or h>best[1]: best=(y_lo+int(y),int(h))
    return None if best is None else (best[0], best[0]+best[1]-1)

def _in_span(span, st):
    """Is this staff inside the brace? Most of it must be, so a brace that
    overshoots by a few pixels does not claim the staff above it."""
    lo,hi=span; top,bot=st[0],st[-1]
    return (min(hi,bot)-max(lo,top))>=0.6*(bot-top)

def select_vocal(staves, s, img):
    """Return (vocal, fallbacks): one voice-staff index per system, in order,
    and the number of systems where the brace rule could not decide."""
    if not staves: return [], 0
    dark=(img<128)
    edges=[_staff_left_edge(dark,st) for st in staves]

    # Group into systems on the system barline, not on gaps.
    systems=[[0]]
    for i in range(1,len(staves)):
        x0=edges[i-1] if edges[i-1] is not None else edges[i]
        if _joined_at_left(dark,staves[i-1],staves[i],x0,s): systems[-1].append(i)
        else: systems.append([i])

    vocal=[]; fallbacks=0
    for group in systems:
        if len(group)==1:
            vocal.append(group[0]); continue
        x0=next((edges[j] for j in group if edges[j] is not None), None)
        span=_brace_span(dark,x0,staves[group[0]][0],staves[group[-1]][-1],s)
        unbraced=[j for j in group if span is None or not _in_span(span,staves[j])]
        if span is not None and len(unbraced)==1:
            vocal.append(unbraced[0])
        else:
            vocal.append(group[0]); fallbacks+=1
    return vocal, fallbacks

def clef_topD(sign, line, octaveChange=0):
    if sign=='F':   ref_deg=LETIDX['F']+7*3
    elif sign=='G': ref_deg=LETIDX['G']+7*4
    elif sign=='C': ref_deg=LETIDX['C']+7*4
    else: raise ValueError(sign)
    topD = ref_deg + 2*(5-line)
    return topD + 7*octaveChange

# TIER-1 UNIFICATION (close-prep, 2026-07-24). The old `remove_lines()` opened
# the page with a 1.7*s horizontal kernel and subtracted anything that survived,
# with NO check for whether that ink actually sat on a detected staff line. That
# deleted an 82 px beam bar (a 35 px kernel is blind to what it is cutting) and,
# separately, severed every stem at each staff-line crossing -- two silent
# corruptions in one session (harness rhythm F1 1.000 -> 0.909; three heads lost
# on a proven page). The destructive function consumed a damaged copy and passed
# it downstream with no way for any later stage to detect the loss.
#
# Fable's ruling (fable-ruling-e16-layered-synthesis, tier 1): "Non-destructive,
# non-exclusive masks over an immutable raster... Downstream stages query the
# raster with a mask as context instead of consuming a damaged copy." The
# concrete fix: retire the destructive path entirely. `beams.remove_lines_safe`
# already computes the correct thing -- an immutable raster `bw` plus a single
# derived view `nl = bw & ~staff_line_mask`, where the mask only ever claims a
# pixel that (a) survives the horizontal opening AND (b) sits on a row belonging
# to a DETECTED staff line AND (c) has a vertical ink run no thicker than ~2.2x
# the measured line thickness. Every stage that used to consume the destructive
# `nl` (accidentals, rests, barlines, flag CC-area) and every stage that already
# used the safe `nl_safe` (stems, beams, hollow heads) now read from this SAME
# array. There is one removal path, computed once per page, in
# `read_page_geometry` below; nothing downstream can silently receive the
# destructive one because it no longer exists.
def remove_lines(img, s, staves, page=None):
    """Kept as a thin, explicitly-named alias so call sites read as what they
    are: the single non-destructive removal, not a second implementation."""
    from beams import remove_lines_safe
    return remove_lines_safe(img, s, staves, page)

def band_of(y, staves, vocal, s, pad=3.5):
    for bi,b in enumerate(vocal):
        st=staves[b]
        if st[0]-pad*s<=y<=st[-1]+pad*s: return bi
    return -1

def nms(pts, scores, rad):
    order=np.argsort(scores)[::-1]; taken=np.zeros(len(pts),bool); keep=[]
    for i in order:
        if taken[i]: continue
        keep.append(i)
        for j in order:
            if not taken[j] and (pts[i][0]-pts[j][0])**2+(pts[i][1]-pts[j][1])**2<rad*rad: taken[j]=True
    return keep

def detect_heads(img, staves, vocal, s, thr=0.84):
    """Matched-filter notehead detection (filled heads). Classical CV primitive
    (oemer's notehead stage without the learned mask)."""
    tops=[st[0] for st in staves]; bots=[st[-1] for st in staves]
    def window(bi):
        b=vocal[bi]; top,bot=staves[b][0],staves[b][-1]
        up=top-3.5*s
        if b-1>=0: up=max(up,(bots[b-1]+top)/2)
        dn=bot+3.5*s
        if b+1<len(staves): dn=min(dn,(bot+tops[b+1])/2)
        return b,up,dn
    wins=[window(bi) for bi in range(len(vocal))]
    def sysband(y):
        for bi,(b,up,dn) in enumerate(wins):
            if up<=y<=dn: return bi
        return -1
    bw=(img<128).astype(np.float32)
    kw,kh=int(round(1.35*s)),int(round(0.92*s))
    ker=cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(kw|1,kh|1)).astype(np.float32); ker/=ker.sum()
    resp=cv2.filter2D(bw,-1,ker)
    ys,xs=np.where(resp>=thr)
    pts=[(int(x),int(y)) for x,y in zip(xs,ys) if sysband(y)>=0]
    fs=[float(resp[y,x]) for x,y in pts]
    keep=nms(pts,fs,0.8*s)
    heads=[dict(x=pts[i][0],y=pts[i][1],sys=sysband(pts[i][1]),score=fs[i]) for i in keep]
    heads.sort(key=lambda h:(h['sys'],h['x']))
    return heads

def position(h, staves, vocal, topD, s):
    lines=staves[vocal[h['sys']]]; top=lines[0]; half=np.median(np.diff(lines))/2
    off=round((top-h['y'])/half); d=topD+off
    return LET_BY_DEG[d%7], d//7

def has_stem(nl, hx, hy, s, min_len=2.0, lo=0.35, hi=1.05, max_w=0.42):
    """A FILLED notehead always carries a stem: only the semibreve and breve are
    stemless, and both are HOLLOW (Gould, Behind Bars, ground rules on stems).
    oemer counterpart: notehead-stem pairing.

    A stem is TALL **and THIN**. Gould gives stem thickness as comparable to a
    staff line, far under half a staff space. The thinness test is what rejects
    bold text bowls and Verovio's solid missing-glyph box, both of which are tall
    but wide. Probe the ink width partway along the run, clear of the notehead.
    """
    H,W=nl.shape
    for sign in (+1,-1):
        for dx in range(int(lo*s), int(hi*s)+1):
            x=hx+sign*dx
            if not (0<=x<W): continue
            col=nl[:,x]
            for updown in (-1,+1):
                y=hy; run=0
                while 0<=y<H and col[y]>0:
                    y+=updown; run+=1
                    if run>6*s: break
                if run < min_len*s: continue
                py=hy+updown*int(1.5*s)                 # clear of the head, on bare stem
                if not (0<=py<H) or nl[py,x]==0: continue
                a=x
                while a>0 and nl[py,a-1]>0: a-=1
                b=x
                while b<W-1 and nl[py,b+1]>0: b+=1
                if (b-a+1) <= max_w*s: return True
    return False


def read_page_geometry(cfg):
    img=cv2.imread(cfg['png'],cv2.IMREAD_GRAYSCALE)
    staves,s=detect_staves(img,page=cfg.get('png'))
    # The cfg['vocal'] bypass is untouched: a fixture that names its staves is
    # byte-identical to before, and its fallback count is zero because the
    # brace rule was never consulted.
    if 'vocal' in cfg:
        vocal,vocal_fallbacks=cfg['vocal'],0
    else:
        vocal,vocal_fallbacks=select_vocal(staves,s,img)
    # ONE non-destructive removal, computed once, consumed by every downstream
    # stage (tier-1 unification -- see the note above remove_lines()). nl and
    # nl_safe are deliberately the SAME array: the "safe" removal is no longer
    # a special second path used only by stems/beams/hollow, it is simply THE
    # removal. Keeping both names avoids touching every call site that already
    # reads G['nl'] vs G['nl_safe'].
    bw,nl=remove_lines(img,s,staves,cfg.get("png"))
    nl_safe=nl
    heads=detect_heads(img,staves,vocal,s,thr=cfg.get('head_thr',0.84))
    if cfg.get('require_stem', True):
        heads=[h for h in heads if has_stem(nl_safe,h['x'],h['y'],s)]
    for h in heads: h['hollow']=False
    if cfg.get('hollow', True):
        from hollow import detect_hollow_heads, merge_heads
        sb=lambda y: band_of(y,staves,vocal,s)
        hh=detect_hollow_heads(nl_safe,staves,vocal,s,sb,thr=cfg.get('hollow_thr',0.38))
        hh=[h for h in hh if h['stemmed']]        # minims; the stemless semibreve path is UNEXERCISED
        heads=merge_heads(heads,hh,s)
    # N.97: CLEF AND KEY-SIGNATURE INK IS NOT NOTEHEAD CANDIDACY.
    #
    # `detect_heads` is a matched filter for a filled ellipse, and a G clef's
    # bowl and a sharp's lozenges are filled ellipses. Memo N.95 measured the
    # cost on the Lamm scan: 11 of the reader's 13 false positives sit on that
    # ink, at the very start of a system, before any real note. Nothing
    # downstream could tell them from notes, so every one of them took a
    # syllable and shifted the line.
    #
    # `clefkey` reads the two glyph groups with the same Leipzig template
    # machinery the rests and the time signature already use, and reports the x
    # range their ink occupies. A detection whose centre falls in that range is
    # dropped here, AFTER the stem test and the hollow merge, so a hollow false
    # positive on clef ink goes with it, and before anything reads a pitch.
    #
    # A SYSTEM WHOSE CLEF ABSTAINED IS NOT MASKED AT ALL. `clef_key_spans`
    # returns no entry for it, so an unread clef costs a singer nothing. The
    # imports are local for the reason `remove_lines`' and the hollow branch's
    # already are: `clefkey` imports this module.
    clef_key_systems, clef_key_read = [], None
    if cfg.get('clef_key_mask', True):
        import clefkey
        clef_key_systems, clef_key_read = clefkey.read_page_clef_key(img, nl, staves, s, vocal)
        spans = clefkey.spans_from(clef_key_systems)
        margin = clefkey.CLEF_KEY_MASK_MARGIN * s
        heads = [h for h in heads
                 if h['sys'] not in spans
                 or not (spans[h['sys']][0] - margin <= h['x'] <= spans[h['sys']][1] + margin)]
    topD=clef_topD(cfg['clef'][0],cfg['clef'][1],cfg.get('octaveChange',0))
    for h in heads:
        L,O=position(h,staves,vocal,topD,s); h['L']=L; h['O']=O
    return dict(img=img,staves=staves,s=s,vocal=vocal,bw=bw,nl=nl,nl_safe=nl_safe,heads=heads,topD=topD,
                vocalFallbacks=vocal_fallbacks,
                # N.97, ADDITIVE. What the page PRINTS, alongside what the
                # caller answered. Nothing in this module consumes it: `topD`
                # above is still built from cfg, so a read with the same
                # answers is unchanged whatever the glyphs say. The caller
                # confirms or overrides; the reader reports.
                clefKeySystems=clef_key_systems, clefKeyRead=clef_key_read)

def probe_clef_key(cfg):
    """N.97: WHAT THE PAGE PRINTS AT THE START OF EACH SYSTEM, and nothing else.

    The intake prompt needs the clef and the key signature BEFORE the read, so
    it can ask the singer to confirm rather than to answer blind. That needs
    staff geometry and the staff-line removal, and nothing downstream of them:
    no notehead detection, no stems, no hollow heads, no accidentals, no
    rhythm. This runs that prefix and stops.

    It is a SEPARATE CALL and changes nothing about the read that follows. The
    read still takes its clef and key from `cfg`, still computes every pitch
    from them, and is byte-identical to what the same answers produced before
    this function existed. Confirming what was read and typing it by hand
    reach the reader as the same two numbers.

    Returns a dict: {read, systems, s, staves, systemsCount}. `read` is the
    page's majority summary or None where every system abstained."""
    img = cv2.imread(cfg['png'], cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise RuntimeError('OpenCV could not read %r' % (cfg.get('png'),))
    staves, s = detect_staves(img, page=cfg.get('png'))
    if 'vocal' in cfg:
        vocal = cfg['vocal']
    else:
        vocal, _fallbacks = select_vocal(staves, s, img)
    _bw, nl = remove_lines(img, s, staves, cfg.get('png'))
    import clefkey
    systems, summary = clefkey.read_page_clef_key(img, nl, staves, s, vocal)
    return dict(read=summary, systems=systems, s=float(s),
                staves=len(staves), systemsCount=len(vocal))


# ---------- accidental engine ----------
SHARP_ORDER=['F','C','G','D','A','E','B']
FLAT_ORDER=['B','E','A','D','G','C','F']
def key_alter(fifths):
    d={}
    if fifths>0:
        for L in SHARP_ORDER[:fifths]: d[L]=1
    elif fifths<0:
        for L in FLAT_ORDER[:-fifths]: d[L]=-1
    return d
ALTER={'flat':-1,'natural':0,'sharp':1,'dsharp':2,'dflat':-2}
ACC_FROM_XML={'flat':'flat','natural':'natural','sharp':'sharp',
              'double-sharp':'dsharp','sharp-sharp':'dsharp','flat-flat':'dflat','double-flat':'dflat'}

def _verticals(comp):
    hh,w=comp.shape; colsum=comp.sum(axis=0)
    tall=[j for j in range(w) if colsum[j]>0.55*hh]
    v=0;prev=-2
    for j in tall:
        if j!=prev+1: v+=1
        prev=j
    return tall,v

def classify_single(comp, s):
    hh,w=comp.shape
    tall,v=_verticals(comp)
    if not tall: return 'abstain'
    br=comp[hh//2:, w//2:].sum()/max(1,comp.sum())
    if v>=2:
        lv,rv=tall[0],tall[-1]; mid=comp[int(hh*0.28):int(hh*0.72),:]; ci=(mid.sum(axis=0)>0)
        ohl=ci[:max(0,lv-1)].sum(); ohr=ci[rv+2:].sum()
        return 'sharp' if (ohl>=2 and ohr>=2) else 'natural'
    return 'flat' if br>=0.37 else 'abstain'

def _looks_flat(comp, s):
    hh,w=comp.shape
    if comp.sum()<0.08*s*s: return False
    tall,v=_verticals(comp)
    if not tall: return False
    left_vert = tall[0] < 0.5*w
    br=comp[hh//2:, w//2:].sum()/max(1,comp.sum())
    return left_vert and br>=0.30

def _vertical_runs(comp):
    hh,w=comp.shape; colsum=comp.sum(axis=0)
    cols=[j for j in range(w) if colsum[j]>0.55*hh]
    runs=[]
    if not cols: return runs
    start=prev=cols[0]
    for j in cols[1:]:
        if j!=prev+1: runs.append((start,prev)); start=j
        prev=j
    runs.append((start,prev))
    return runs

def count_holes(comp):
    h,w=comp.shape
    pad=np.zeros((h+2,w+2),np.uint8); pad[1:-1,1:-1]=comp
    ff=(pad==0).astype(np.uint8); mask=np.zeros((h+4,w+4),np.uint8)
    cv2.floodFill(ff,mask,(0,0),0)
    n,_=cv2.connectedComponents(ff); return n-1

def classify_dflat(comp, s):
    hh,w=comp.shape
    if w < 1.3*s: return None
    runs=_vertical_runs(comp)
    if len(runs)<2: return None
    split=runs[1][0]
    if split<3 or split>w-3: return None
    L=comp[:, :split]; R=comp[:, split:]
    if _looks_flat(L,s) and _looks_flat(R,s): return 'dflat'
    return None

def classify_compact(comp, s):
    hh,w=comp.shape
    fill=comp.mean()
    if not(0.55*s<=hh<=1.7*s and 0.55*s<=w<=1.7*s): return 'abstain'
    ar=w/max(1,hh)
    if not(0.6<=ar<=1.7): return 'abstain'
    cy,cx=hh//2,w//2
    centre=comp[max(0,cy-2):cy+3, max(0,cx-2):cx+3].mean()
    if 0.28<=fill<=0.62 and centre>=0.3:
        return 'dsharp'
    return 'abstain'

def read_accidental(h, stats, cent, lab, num, head_centers, s):
    hx,hy=h['x'],h['y']
    def attaches_head(x0,y0,w,hh2):
        return any(x0-4<=cx<=x0+w+4 and y0-4<=cy<=y0+hh2+4 for cx,cy in head_centers)
    talls=[]; compacts=[]
    for i in range(1,num):
        x0,y0,w,hh2,area=stats[i]; cx,cy=cent[i]
        if not(hx-2.3*s < cx < hx-0.28*s): continue
        if abs(cy-hy) > 1.7*s: continue
        if attaches_head(x0,y0,w,hh2): continue
        comp=(lab[y0:y0+hh2, x0:x0+w]==i).astype(np.uint8)
        if 2.0*s<=hh2<=3.7*s and w<=2.9*s:
            talls.append((cx,comp,area))
        elif (0.55*s<=hh2<=1.7*s and 0.55*s<=w<=1.7*s
              and 0.24*s*s<=area<=0.86*s*s):
            compacts.append((cx,comp,area))
    if talls:
        talls.sort(key=lambda t:t[0])
        for cx,comp,area in talls:
            if classify_dflat(comp,s) or (count_holes(comp)==2 and len(_vertical_runs(comp))>=2):
                return 'dflat', False
        cls=[classify_single(comp,s) for _,comp,_ in talls]
        if len(talls)>=2 and cls.count('flat')>=2:
            return 'dflat', False
        c=cls[-1]
        return (c, c=='abstain')
    if compacts:
        compacts.sort(key=lambda t:t[0])
        c=classify_compact(compacts[-1][1],s)
        return (c if c!='abstain' else None), (c=='abstain')
    return None, False

# BARLINE WIDTH AND SPAN, scale-relative (N.95/N.96 ship 1, 2026-08-24,
# amending Dann's ruling of the same day to admit small OVERSHOOT as well as
# undershoot). The old `w<=6` was absolute and untested off s~21 (README's
# own limitation note); at the Lamm scan's s=30 it excluded every true
# barline (0 found, whole page).
#
# WIDTH is admitted generously and is no longer the primary discriminator.
# Measured true-barline widths: RENDER (4 pages, s=21, isolated strokes)
# 3-4px = 0.143-0.190s. SCAN (raster400-1, s=30) unmerged strokes measure
# 7-10px = 0.233-0.333s by direct column darkness, BUT the reader works on
# CONNECTED COMPONENTS, and on this scan a true barline is routinely
# 8-connected to touching note ink (visually confirmed by pixel crop: a
# barline abutting an eighth-note stem), so its own bounding-box width can
# read 29-55px. `BARLINE_WIDTH_BOUND = 0.5*s` sits in the wide, clean, empty
# gap between the scan's unmerged/render widths (<=0.333s) and the smallest
# measured FALSE full-span render candidate (a stem or tie, 27px = 1.286s at
# s=21) -- comfortably below every false positive, comfortably above every
# true barline that survives as its own component. It does not need to
# admit the merged 29-55px case, because that case is recovered below.
#
# SPAN is the real discriminator, per Dann's ruling: a barline runs from the
# top exterior staff line to the bottom, within a tolerance that admits
# SMALL overshoot as well as undershoot -- stem/contamination overshoot is
# LARGE (a stem runs on to a beam, flag, or touching text), barline
# overshoot is small. Measured on the scan: true barlines' worst-column
# overshoot is 0.20s; the smallest measured stem/contamination overshoot
# anywhere in the same candidate pool is 0.30s. `SPAN_TOLERANCE = 0.25*s`
# sits at the midpoint, 0.05s of clearance on each side. Measured on 4
# render pages: true barlines overshoot 0 to 0.048s; every false full-span
# candidate overshoots by at least 0.48s. Both corpora clear this bound with
# margin.
#
# TWO-TIER SEARCH, additive, same shape as `detect_staves`'s primary/
# fallback split above. PRIMARY: a component narrower than the width bound
# already measures a barline-width stroke directly, and admits its centroid
# unchanged.
#
# CORRECTED 2026-08-24 by the 23-page fixture gate, which refuted this
# paragraph's earlier claim that "nothing render-side exists in the gap
# between 6px and 27px". One thing does: the THICK stroke of a final barline,
# 11px at s=21 on sunless-06 p7. Widening the bound admits it, and the thin
# and thick strokes of one engraved symbol then segment an empty extra
# measure between them. That is what `_collapse_barline_cluster` exists for,
# and with it the whole two-tier search is measured INERT on the render
# corpus: all 23 fixture pages return barline sets identical to the old
# `w<=6` output, checked page by page rather than sampled.
# FALLBACK: a wider full-height component. On a render this is always OTHER
# ink and is rejected (see SPAN above). On the scan it also covers a TRUE
# barline merged with touching ink: refine by searching, column by column
# INSIDE that component's own bounding box, for the sub-run whose OWN
# row-width profile (median width of the dark run at 6 samples across the
# staff height) clears the width bound and whose centre column's own
# vertical extent clears the span test. A notehead-widened blob is only
# wide AT the notehead's own rows, a minority of the staff height, so the
# median across the band finds the barline's true width even where a single
# column's local width does not.
#
# THE SCAN COLUMN, NOT THE BBOX MIDPOINT (found chasing the scan's own
# missing trailing barline, sys0 x~3505-3514). An earlier version of this
# function tested only the ONE column at the component's bounding-box
# midpoint. That assumes the merge is roughly centred -- true for a barline
# merged with a notehead sitting astride it, false when the merge is
# lopsided: on the scan, the true barline (x=3505-3514, its own row-width
# median 11px, span overshoot 1-6px, comfortably inside both bounds) had
# merged 8-connected with an unrelated contamination blob spanning back to
# x=3371, pulling the bbox midpoint to x=3443 -- 60+px of span overshoot
# there, nowhere near either bound. Fix: test every column across the
# component's width, keep the ones that pass both checks, and return the
# centre of the LARGEST contiguous run of passing columns (the stroke's own
# width) -- robust to a handful of isolated columns elsewhere in the merged
# blob that happen to pass by chance, since a real barline stroke passes
# over a contiguous run of columns, not scattered singletons.
#
# SOLIDITY, a second column-level test, added after the widened search above
# produced ONE false positive on the 4-render-page corpus: a "6/8" time
# signature's "6" glyph (render, sunless-01 p1, sys0), whose own vertical
# stroke happens to span very close to the full staff height at close to
# barline width -- a time signature is typeset to span the staff, so SPAN
# alone cannot separate it from a barline the way it separates a stem or a
# slur. The two are NOT ambiguous in one further respect: a barline is one
# unbroken stroke, and a numeral's stroke, even where it runs the height of
# the staff, is interrupted by the glyph's own curves and terminals.
# Measured directly on both false and true candidates, same padded column
# window used by the span test: the "6" glyph's best columns still show 4 to
# 17 missing (unset) pixels between their first and last dark pixel; the
# scan's own true trailing barline (the sys0 x~3505-3514 stroke this search
# was built to recover) shows ZERO missing pixels on 4 of its 5 sampled
# centre columns. Requiring the padded column to be gap-free end to end --
# not merely first-dark-to-last-dark, but every pixel in between also dark
# -- passes every true barline column measured on both corpora and rejects
# every column of the one false candidate found.
#
# ROW-WIDTH CEILING, a third column-level test, added after the scan itself
# produced false positives the first two tests both admit: a note's STEM,
# where the notehead sits close enough to one exterior staff line that the
# stem's own fixed ~3.5-space length carries it to (or past) the other,
# giving the same near-full-span, same-order-of-magnitude median width, AND
# (because a stem is itself one straight solid stroke) the same SOLIDITY as
# a real barline. Measured directly, same 6-samples-per-staff-height row-
# width profile used for the median above, 4 confirmed false candidates
# (scan, pixel-crop verified: sys1 x=2766 a stem+fermata, sys2 x=1894/3188/
# 3315 a stem+notehead or stem+flag) against 6 confirmed true barlines
# (scan, same page, same verification): every FALSE candidate's row-width
# profile contains a cluster of samples struck through the attached
# notehead or flag, 36-46px; every TRUE barline's profile peaks at 26px
# (a single row where another symbol happens to touch the barline itself).
# `MAX_ROW_WIDTH_BOUND = 1.07*s` (32px at s=30) sits at the midpoint, 6px of
# clearance on each side. A stem's own width is barline-width by design
# (Gould), so median alone cannot see this; the notehead or flag it carries
# is not, and the ceiling on the single widest sampled row is where that
# shows up.
BARLINE_WIDTH_BOUND = 0.5   # * s
BARLINE_SPAN_TOLERANCE = 0.25   # * s
MAX_ROW_WIDTH_BOUND = 1.07   # * s

def _barline_row_width(dark, y, x0, x1, xc):
    """Width of the dark run through (y, xc), clipped to [x0, x1]."""
    n = x1 - x0 + 1
    xi = xc - x0
    if xi < 0 or xi >= n or not dark[y, xc]:
        return None
    a = xi
    while a > 0 and dark[y, x0 + a - 1]: a -= 1
    b = xi
    while b < n - 1 and dark[y, x0 + b + 1]: b += 1
    return b - a + 1

def _refine_merged_barline(nl, x, w, top, bot, s):
    """Search inside a too-wide component for a barline merged with touching
    ink (see derivation above). Returns an x position, or None."""
    dark = nl > 0
    step = max(1, int(s // 6))
    tol = BARLINE_SPAN_TOLERANCE * s
    bound = BARLINE_WIDTH_BOUND * s
    max_bound = MAX_ROW_WIDTH_BOUND * s
    H = nl.shape[0]
    pad = int(round(2.0 * s))
    lo = max(0, top - pad); hi = min(H, bot + pad + 1)
    x0, x1 = x, x + w - 1

    good = []
    for xc in range(x0, x1 + 1):
        widths = [wv for wv in (
            _barline_row_width(dark, y, x0, x1, xc) for y in range(top, bot + 1, step)
        ) if wv is not None]
        if len(widths) < 3 or float(np.median(widths)) > bound or max(widths) > max_bound:
            continue
        col = dark[lo:hi, xc]
        idx = np.where(col)[0]
        if len(idx) == 0:
            continue
        y0 = lo + idx[0]; y1 = lo + idx[-1]
        if (y1 - y0 + 1) != len(idx):
            continue  # SOLIDITY: gap between first and last dark pixel -- not a stroke
        top_over = top - y0; bot_over = y1 - bot
        if -tol <= top_over <= tol and -tol <= bot_over <= tol:
            good.append(xc)
    if not good:
        return None
    runs = []
    run_start = prev = good[0]
    for xc in good[1:]:
        if xc - prev > 1:
            runs.append((run_start, prev))
            run_start = xc
        prev = xc
    runs.append((run_start, prev))
    best = max(runs, key=lambda r: r[1] - r[0])
    return (best[0] + best[1]) // 2

# ONE BARLINE PER CLUSTER (N.95/N.96 ship 1, 2026-08-24, found by the 23-page
# fixture gate, not by design). A FINAL or REPEAT barline is drawn as a thin
# stroke and a thick one, half a staff space apart, and it is ONE barline. The
# old `w<=6` admitted only the thin stroke and so never met the case. The
# widened width bound admits both, and the two then segment an EMPTY extra
# measure between them: on the render corpus this moved exactly one page
# (sunless-06 p7, sys1, the thin stroke at x=2400 and the thick one at x=2415,
# 0.714s apart, adding a seventh measure whose sum is 0).
#
# BOUND, measured over every accepted candidate on all 23 render fixture pages
# and on the Lamm scan, as consecutive gaps in units of s: RENDER 131 gaps, of
# which the smallest genuine one is 13.333s and the ONLY sub-13s gap anywhere
# is that single 0.714s thin-thick pair. SCAN 5 gaps, smallest 33.400s.
# `BARLINE_CLUSTER_GAP = 1.0*s` is the structural bound rather than the
# midpoint of the empty interval: a thin-thick pair is one engraved symbol and
# Gould sets its own gap at about half a space, so within one staff space is
# the same barline and beyond it is a different one. It clears the measured
# spurious gap by 0.286s and sits 12.333s below the smallest genuine gap in
# either corpus.
#
# THE LEFTMOST STROKE WINS, not the mean. Segmentation only needs one x
# between two measures, and the leftmost is the conservative one: it can never
# put the boundary after a note that belongs to the next measure. It also
# reproduces the old output exactly wherever the old code saw the thin stroke
# alone, which is every render page.
BARLINE_CLUSTER_GAP = 1.0   # * s

def _collapse_barline_cluster(xs, s):
    """Collapse strokes within BARLINE_CLUSTER_GAP of each other to the
    leftmost. `xs` must be sorted."""
    gap = BARLINE_CLUSTER_GAP * s
    out = []
    for x in xs:
        if out and x - out[-1] <= gap:
            continue
        out.append(x)
    return out

def detect_barlines(nl,staves,vocal,s):
    num,lab,stats,cent=cv2.connectedComponentsWithStats(nl,8)
    out={}
    for bi,b in enumerate(vocal):
        st=staves[b]; sh=st[-1]-st[0]; xs=[]
        for i in range(1,num):
            x,y,w,h,area=stats[i]; cx,cy=cent[i]
            if not (0.85*sh<=h<=1.35*sh and st[0]-1.2*s<=cy<=st[-1]+1.2*s):
                continue
            if w <= BARLINE_WIDTH_BOUND * s:
                xs.append(int(cx))
                continue
            sub = _refine_merged_barline(nl, int(x), int(w), st[0], st[-1], s)
            if sub is not None:
                xs.append(sub)
        out[bi]=_collapse_barline_cluster(sorted(xs),s)
    return out

def read_page_pitch(cfg):
    G=read_page_geometry(cfg)
    img,staves,s,vocal,nl,heads,topD=G['img'],G['staves'],G['s'],G['vocal'],G['nl'],G['heads'],G['topD']
    num,lab,stats,cent=cv2.connectedComponentsWithStats(nl,8)
    head_centers=[(h['x'],h['y']) for h in heads]
    KA=key_alter(cfg['key'])
    bl=detect_barlines(nl,staves,vocal,s)
    def localmeasure(h):
        b=bl.get(h['sys'],[]); base=sum(len(bl.get(k,[])) for k in range(h['sys']))
        return base+sum(1 for x in b if x<h['x'])
    recs=[]; carry={}; curm=None
    for h in heads:
        L,O=h['L'],h['O']; lm=localmeasure(h)
        if lm!=curm: carry={}; curm=lm
        cls,abst=read_accidental(h,stats,cent,lab,num,head_centers,s)
        if cls in ALTER:
            alt=ALTER[cls]; carry[(L,O)]=alt; pred=cls
        elif (L,O) in carry:
            alt=carry[(L,O)]; pred='carry'
        else:
            alt=KA.get(L,0); pred=None
        midi=12*(O+1)+SEMI[L]+alt
        recs.append(dict(x=h['x'],y=h['y'],sys=h['sys'],L=L,O=O,alt=alt,midi=midi,pred=pred,abstain=abst,hollow=h.get('hollow',False)))
    return recs, G

# ---------- rhythm ----------
# RECALIBRATED, close-prep tier-1 unification (2026-07-24). This threshold is
# EMPIRICAL and page-calibrated (documented debt, ledger item), fitted from
# piece 02 p1 -- same calibration source as the original value. Tier-1's
# removal-path merge changed what "ink survives" means (the safe removal
# preserves slightly more than the destructive one did, since it only strips
# ink that is BOTH wide AND on a detected staff-line row, rather than any
# sufficiently-wide horizontal run anywhere), which shifts CC areas upward by
# a few percent across the board. Re-measured on piece 02 p1 under the unified
# pipeline: quarter notes 1.327-1.490 (n=9), eighth-class (1/8, 1/12 tuplet
# eighth, 3/16 dotted eighth) 1.887-2.190 (n=35), sixteenth 2.354-2.646 (n=7).
# Clean gaps at [1.49,1.887] and [2.19,2.354]; thresholds set at their
# midpoints with margin toward the lower (more frequently hit) side.
# Named, unit-bearing (s^2), fitted per page, image-checkable: satisfies the
# "fitting is not training" fence.
FLAG_AREA_RATIO=1.65

# FLAG_ABSTAIN = 0.10 STRUCK (fable-spec-e16-abstain-path, 2026-07-27, item 1,
# ratified by Dann). It was declared years of sessions ago as a dead-zone
# margin and never wired to anything; the close's beam-stage silent failure
# proved a dead zone is the wrong shape of fix (measured margins of CORRECT
# answers are 0.097-0.111 s^2, narrower than any dead zone that would have
# caught the 4.118 s^2 failure). The real fix is an upper validity bound,
# FLAG_AREA_MAX, on the flag branch itself: see run_page2.py, beside
# FLAG2_AREA_RATIO.

def _head_cc_area(h, nl, lab, stats):
    x,y=h['x'],h['y']; lid=lab[y,x]
    if lid==0:
        for dy in range(-6,7):
            for dx in range(-6,7):
                yy,xx=y+dy,x+dx
                if 0<=yy<nl.shape[0] and 0<=xx<nl.shape[1] and nl[yy,xx]>0: lid=lab[yy,xx];break
            if lid>0:break
    return (stats[lid][4] if lid>0 else 0), lid

def _has_dot(hx,hy,stats,cent,num,s):
    # X-DISTANCE UPPER BOUND, widened (close-prep dot fix, 2026-07-24). A
    # ledger-lined notehead's ledger line extends past the notehead's own
    # ink on the side the dot sits, so the augmentation dot must clear the
    # ledger line, not just the notehead -- it sits further out in absolute
    # pixels than a dot next to an in-staff notehead. Measured directly on
    # piece 02 p1 (the two dotted eighths that were losing their dots,
    # m3-3-4 and m4-1-4, both ledger-lined C3/B2-ish pitches): dx=42.5px at
    # s=21 (2.02 staff-spaces). An in-staff dotted eighth on the same page
    # (m1-1-4, F#3, no ledger line) measured dx=24.0px (1.14 staff-spaces).
    # 1.7*s (the old bound) sat between these two clusters, catching the
    # in-staff case but excluding both ledger-line cases; 2.2*s clears the
    # ledger-line cluster with margin (2.02s measured vs 2.2s bound) while
    # staying well short of the next notehead over on both fixtures.
    for i in range(1,num):
        x0,y0,w,h,area=stats[i]; cx,cy=cent[i]
        if 0.3*s<area<0.25*s*s and w<=0.7*s and h<=0.7*s and abs(w-h)<=0.35*s and 0.35*s<(cx-hx)<2.2*s and abs(cy-hy)<0.8*s:
            return True
    return False

def _rest_template(nl,lab,stats,cent,num,seeds,s):
    for (px,py) in seeds:
        best=None;bd=1e9
        for i in range(1,num):
            x,y,w,h,a=stats[i]; cx,cy=cent[i]
            if abs(cx-px)<=1.6*s and abs(cy-py)<=1.6*s and 0.5*s<=w<=1.8*s and 0.7*s<=h<=2.0*s and a>0.15*s*s:
                d=(cx-px)**2+(cy-py)**2
                if d<bd: bd=d;best=i
        if best is not None:
            x,y,w,h,a=stats[best]; return (lab[y:y+h,x:x+w]==best).astype(np.uint8)
    return None

def detect_rests(nl,staves,vocal,s,seeds):
    num,lab,stats,cent=cv2.connectedComponentsWithStats(nl,8)
    rt=_rest_template(nl,lab,stats,cent,num,seeds,s)
    if rt is None: return []
    res=cv2.matchTemplate((nl*255).astype(np.uint8),(rt*255).astype(np.uint8),cv2.TM_CCOEFF_NORMED)
    hh,ww=rt.shape
    ys,xs=np.where(res>=0.6)
    pts=[(int(a+ww/2),int(b+hh/2)) for a,b in zip(xs,ys)]
    idx=[i for i,p in enumerate(pts) if band_of(p[1],staves,vocal,s)>=0]
    fp=[pts[i] for i in idx]
    keep=nms(fp,[1.0]*len(fp),0.8*s)
    return [dict(x=fp[i][0],y=fp[i][1],sys=band_of(fp[i][1],staves,vocal,s)) for i in keep]
