"""metre.py -- E.16 Front 3a, decision 4: the beat model and the irregular-
grouping detector.

Authority: claude/fable-spec-e16-front3a_2026-07-27.md (revision 3), Item A
decision 4. Gould citations SOURCED only to the two verified memos named in
the spec (claude/opus-memo-e16-gould-metre-tuplets-verified_2026-07-27.md
and its addenda); nothing else is attributed to Gould here.

GOULD_TABLE1 encodes Table 1 (p. 155), "Beaming according to the metre",
programmatically rather than transcribed cell-by-cell: the spec's own
classification rule (numerators 2,3,4 simple; 6,9,12,15 compound; everything
else 1..15 irregular) is SOURCED to the spec text, cited there as the
precedent of `inject_beams.beat_divisions`. Applying that rule uniformly
across beat_type in {2,4,8,16} and numerators 1..15 (V5's legality bounds)
produces the lookup table the spec asks for. This is INFERENCE in the sense
that no single Gould page is cited per cell; the RULE itself is SOURCED.

TENSION RESOLVED, 2026-07-27, FROM THE SOURCE. This docstring previously
flagged a contradiction: the spec places numerator 15 in the COMPOUND set,
while the verified Gould memo listed 15/8's permitted groupings as (3+2) and
(2+3), whose numerals sum to 5 rather than 15. Gould p. 155, Table 1 was
re-photographed by Dann and read directly (see
claude/opus-memo-e16-gould-table1-p155-verified_2026-07-27.md). There was
never a contradiction in Gould. The 15/8 row beams as FIVE GROUPS OF THREE
quavers, 3|3|3|3|3, which is compound: five dotted-crotchet beats. Its
whole-bar box prints dotted minim + dotted crotchet + dotted minim labelled
(3+2), and dotted minim + dotted minim + dotted crotchet labelled (2+3);
both total 15/8. So (3+2) partitions FIVE DOTTED-CROTCHET BEATS, not five
quavers: 3 + 2 = 5 BEATS, and 5 x 3/8 = 15/8. The earlier memo recorded the
labels without their unit, and that was the whole of the apparent oddity.
The spec's classification of 15 as compound is CONFIRMED CORRECT by Gould's
own beaming. 15/8 is best described as a compound metre carrying an
irregular BEAT grouping: regular at the quaver level, irregular at the beat
level, which is p. 178's variable-stress case operating one level up.

THE UNIT OF A GROUPING THEREFORE DEPENDS ON CLASSIFICATION, and this is
load-bearing (see grouping_unit below). An irregular metre's grouping counts
the beat-type unit (5/8's (3,2) counts quavers). A compound metre's grouping
counts the dotted beat, 3/beat_type (15/8's (3,2) counts dotted crotchets).
"""
from fractions import Fraction

SIMPLE_NUMERATORS = {2, 3, 4}
COMPOUND_NUMERATORS = {6, 9, 12, 15}
BEAT_TYPES = (2, 4, 8, 16)


def classify_metre(beats, beat_type):
    """Return (classification, boundaries). boundaries is a list of interior
    Fraction offsets (whole notes) from the start of the measure, or None if
    classification == 'irregular' and no grouping has been supplied.
    Measure start/end are implicit, per the spec's wire-format rule."""
    if beats in SIMPLE_NUMERATORS:
        boundaries = [Fraction(k, beat_type) for k in range(1, beats)]
        return 'simple', boundaries
    if beats in COMPOUND_NUMERATORS:
        n_beats = beats // 3
        boundaries = [Fraction(3 * k, beat_type) for k in range(1, n_beats)]
        return 'compound', boundaries
    return 'irregular', None


# Static table (spec decision 4: "encode Table 1 (p. 155) as a static
# table"), built once at import time by applying the SOURCED classification
# rule across beat_type in {2,4,8,16} (V5's legality set) and numerators
# 1..15 (V5's legality bound). See module docstring for the sourcing note.
GOULD_TABLE1 = {
    (b, bt): classify_metre(b, bt)
    for bt in BEAT_TYPES
    for b in range(1, 16)
}

# Table 1's permitted alternative groupings. FILLED FROM SOURCE 2026-07-27:
# Gould p. 155, Table 1, photographed by Dann and read directly at up to 6x
# magnification (claude/opus-memo-e16-gould-table1-p155-verified_2026-07-27.md).
# Until then these were structurally present with groupings=None, because the
# two earlier verified memos gave the COUNT of Table 1's alternatives for 5/8
# and 7/8 and never spelled them out, and inventing tuples would have been
# uncitable INFERENCE dressed as sourced fact. The rev7 implementer was right
# to leave them empty. They are now SOURCED, counted off the page:
#
#   5/16  three semiquavers | two, or two | three          -> (3,2) and (2,3)
#   5/8   three quavers | two, or two | three              -> (3,2) and (2,3)
#   7/8   four quavers | three, or three | four            -> (4,3) and (3,4)
#   7/4   four crotchets | three, or three | four          -> (4,3) and (3,4)
#   15/8  five groups of three quavers, boxed (3+2)/(2+3)  -> (3,2) and (2,3)
#         COUNTING DOTTED CROTCHETS, not quavers: see the module docstring.
#   8/8, 10/8, 8/4  print "or any other combination": no fixed set, confirmed
#         on the page. The detector must resolve these dynamically via search
#         steps 1 to 3, never a static lookup.
#
# Keyed by numerator alone, which is safe here because 5 and 7 take the same
# grouping shape at every beat type Table 1 prints them at (5/16 and 5/8; 7/8
# and 7/4). That is SOURCED for those four rows and is INFERENCE for any beat
# type Table 1 does not print.
#
# NOTE ON 7/8 AND FIXTURE (b), so nobody reads a correct silence as a defect:
# Table 1's 7/8 alternatives are 4+3 and 3+4. The A7 irregular fixture (b)
# prints 2+2+3 and 3+2+2 via mid-bar dotted barlines. Both are legitimate:
# Table 1 gives the standard BEAMINGS, and p. 178 separately provides for a
# composer's own division to be printed precisely when it differs from the
# default. But it means narrow_by_duration_division can NEVER recover fixture
# (b)'s grouping, and should not try. Fixture (b) is a step 2 test.
IRREGULAR_ALTERNATIVES = {
    5: {'count_sourced': 2, 'groupings': [(3, 2), (2, 3)]},
    7: {'count_sourced': 2, 'groupings': [(4, 3), (3, 4)]},
    15: {'count_sourced': 2, 'groupings': [(3, 2), (2, 3)]},
}


def grouping_unit(beats, beat_type):
    """The duration one integer in a grouping tuple counts, in whole notes.

    SOURCED, Gould p. 155, Table 1, read 2026-07-27. An IRREGULAR metre's
    grouping counts the beat-type unit itself: 5/8's (3,2) is three quavers
    then two. A COMPOUND metre's grouping counts the dotted beat, 3/beat_type:
    15/8's (3,2) is three dotted crotchets then two, that is 9/8 then 6/8,
    totalling 15/8.

    THIS FIXED A LIVE BUG. Both callers below previously used Fraction(1,
    beat_type) unconditionally, which is correct for 5/16, 5/8, 7/8, and 7/4
    and WRONG for 15/8: grouping_to_boundaries((3,2), 8) returned [3/8] where
    the sourced value is [9/8]. The bug was dormant, because 15 classifies
    compound and detect_irregular_grouping runs only on irregular measures, so
    neither function was reachable for it. It would have fired the moment the
    detector was wired. Found by re-reading the source page, not by a test:
    the arithmetic test suite passed the case, because a test written against
    the code's own convention cannot catch the convention being wrong.
    """
    classification, _ = classify_metre(beats, beat_type)
    if classification == 'compound':
        return Fraction(3, beat_type)
    return Fraction(1, beat_type)


def measure_duration(beats, beat_type):
    """X/Y signature measure duration in whole notes, matching msum's units
    (the existing verified conversion in run_page2.py)."""
    return Fraction(beats, beat_type)


# ---------------------------------------------------------------------------
# The irregular-grouping detector (decision 4). Search order, ruled by the
# spec, SOURCED to p. 178 (Gould's own preference order for printed bar
# division): (1) start-of-bar numerals, (2) dotted barlines, (3) Table 1's
# alternatives narrowed by division of longer notes/rests (confidently read
# durations only), (4) beam grouping -- EXCLUDED in 3a by name (Item B's
# containment fix has not landed), (5) abstain on beat boundaries only,
# while still emitting metre and classification.
#
# The corpus contains zero irregular metres (SOURCED, spec "Measured this
# session"), so this detector is DORMANT until the parallel worker's
# synthetic 5/8 and 7/8 fixture trio lands (A7). It is implemented here, not
# stubbed, per the spec's instruction that the detector "lands dormant
# behind the classification, which is fully testable without it." Steps 1
# and 2's vertical search band and stroke parameters are tagged INFERENCE,
# calibrated only once the fixture exists; step 3 is exercisable today via
# pure arithmetic (see test_metre_step3_narrowing in the acceptance-test
# runner).
# ---------------------------------------------------------------------------

def _find_plus_sign(nl, x0, x1, y0, y1, s):
    """Locate a compact '+' glyph (a component with both a horizontal and a
    vertical stroke crossing near its centre) in the given pixel band.
    INFERENCE: no fixture exists to calibrate this against; parameters are
    a first-principles compact-glyph guess (roughly 0.4s-0.9s square,
    ink fraction consistent with a thin cross) named here so a future
    calibration pass has a concrete starting point rather than nothing."""
    import cv2
    import numpy as np
    band = nl[int(y0):int(y1), int(x0):int(x1)]
    if band.size == 0:
        return None
    num, lab, stats, cent = cv2.connectedComponentsWithStats(band.astype('uint8'), 8)
    for i in range(1, num):
        x, y, w, h, area = stats[i]
        if not (0.4 * s <= w <= 0.9 * s and 0.4 * s <= h <= 0.9 * s):
            continue
        comp = (lab[y:y + h, x:x + w] == i).astype('uint8')
        colsum = comp.sum(axis=0)
        rowsum = comp.sum(axis=1)
        has_vert = (colsum > 0.5 * h).any()
        has_horiz = (rowsum > 0.5 * w).any()
        if has_vert and has_horiz:
            return dict(x=int(x0 + x + w / 2), y=int(y0 + y + h / 2))
    return None


def detect_start_of_bar_numerals(nl, staves, s, vocal_staff_idx, bar_x, s_search_width=3.0):
    """Step 1 of the search order (SOURCED position: "Place the numerals at
    the beginning of the bar", persistence SOURCED: "numerical division
    holds good until contradicted"). Vertical band [top - 3s, top) above the
    staff (INFERENCE, module docstring), searched for digit-plus-digit(-plus-
    digit) patterns using the same digit templates timesig.py already
    builds. Returns a grouping tuple e.g. (3, 2) or None."""
    from timesig import _digits_in_band
    st = staves[vocal_staff_idx]
    top = st[0]
    band_top = int(top - 3.0 * s)
    band_bot = int(top)
    if band_top >= band_bot:
        return None
    x_lo = int(bar_x)
    x_hi = int(bar_x + s_search_width * s)
    band = (nl[band_top:band_bot, x_lo:x_hi] > 0).astype('uint8')
    digits = _digits_in_band(band, s)
    if not digits:
        return None
    plus = _find_plus_sign(nl, x_lo, x_hi, band_top, band_bot, s)
    if plus is None or len(digits) < 2:
        return None
    return tuple(d for _, d, _ in digits)


def detect_dotted_barlines(nl, staves, s, vocal_staff_idx, x_lo, x_hi):
    """Step 2 (SOURCED as a printed form, p. 178). A dotted barline is a
    short-dash vertical stroke spanning the staff, detected as a run of
    several short vertical components at nearly the same x (INFERENCE
    parameters, no fixture to calibrate against), distinct from
    detect_barlines' continuous-stroke barlines (reader.py). Returns a list
    of x positions of detected dotted barlines within [x_lo, x_hi)."""
    import cv2
    import numpy as np
    st = staves[vocal_staff_idx]
    sh = st[-1] - st[0]
    num, lab, stats, cent = cv2.connectedComponentsWithStats(nl, 8)
    by_x = {}
    for i in range(1, num):
        x, y, w, h, area = stats[i]
        cx, cy = cent[i]
        if not (x_lo <= cx < x_hi):
            continue
        if st[0] - 1.2 * s <= cy <= st[-1] + 1.2 * s and w <= 4 and 0.08 * sh <= h <= 0.35 * sh:
            by_x.setdefault(round(cx / (0.3 * s)), []).append((cy, h))
    hits = []
    for bucket, pieces in by_x.items():
        if len(pieces) >= 3:
            hits.append(bucket * 0.3 * s)
    return sorted(hits)


def narrow_by_duration_division(beats, beat_type, durations):
    """Step 3 (SOURCED, p. 178: "or by the particular division of longer
    notes and rests"). `durations` is the list of CONFIDENTLY read note/rest
    durations (whole notes) in the measure, in onset order, excluding any
    abstained facet. Adopt an alternative from IRREGULAR_ALTERNATIVES only
    when it is the UNIQUE grouping whose cumulative-duration boundary
    positions match the durations' own cumulative onsets. Returns a
    grouping tuple or None (no unique narrowing)."""
    alt = IRREGULAR_ALTERNATIVES.get(beats)
    if alt is None or alt.get('groupings') is None:
        return None
    unit = grouping_unit(beats, beat_type)   # classification-dependent; see its docstring
    onsets = []
    acc = Fraction(0)
    for d in durations:
        onsets.append(acc)
        acc += d
    matches = []
    for grouping in alt['groupings']:
        boundary_onsets = []
        acc2 = Fraction(0)
        for g in grouping[:-1]:
            acc2 += g * unit
            boundary_onsets.append(acc2)
        if all(b in onsets for b in boundary_onsets):
            matches.append(grouping)
    if len(matches) == 1:
        return matches[0]
    return None


def grouping_to_boundaries(grouping, beat_type, beats=None):
    """Convert a printed grouping tuple, e.g. (3, 2), into interior
    beatBoundaries (Fraction whole-note offsets), consistent with the
    simple/compound boundary convention used elsewhere in this module.

    `beats` is required whenever the metre may be compound, because the unit a
    grouping integer counts is classification-dependent (grouping_unit). It
    defaults to sum(grouping), which is correct for every IRREGULAR metre,
    where the grouping integers sum to the numerator, and which therefore
    preserves every existing call site's behaviour exactly."""
    if beats is None:
        beats = sum(grouping)
    unit = grouping_unit(beats, beat_type)   # classification-dependent; see its docstring
    boundaries = []
    acc = Fraction(0)
    for g in grouping[:-1]:
        acc += g * unit
        boundaries.append(acc)
    return boundaries


def detect_irregular_grouping(nl, staves, s, vocal_staff_idx, bar_x, next_bar_x,
                                beats, beat_type, confident_durations, inherited_grouping=None):
    """Top-level entry point for decision 4's detector, run per measure whose
    classification is 'irregular'. Search order 1, 2, 3, then persistence
    (grouping inherits until contradicted, SOURCED), then abstain (5). Beam
    grouping (would-be step 4) is EXCLUDED in 3a by name (Item B ledger item
    2a has not landed); this function never calls into beams.py.

    Returns (grouping_tuple_or_None, source) where source is one of
    'printed_numerals', 'printed_dotted_barline', 'printed_duration_division',
    'inherited', or None (abstain)."""
    numerals = detect_start_of_bar_numerals(nl, staves, s, vocal_staff_idx, bar_x)
    if numerals is not None:
        return numerals, 'printed_numerals'
    dotted = detect_dotted_barlines(nl, staves, s, vocal_staff_idx, bar_x, next_bar_x)
    if dotted:
        return tuple(dotted), 'printed_dotted_barline'
    narrowed = narrow_by_duration_division(beats, beat_type, confident_durations)
    if narrowed is not None:
        return narrowed, 'printed_duration_division'
    if inherited_grouping is not None:
        return inherited_grouping, 'inherited'
    return None, None
