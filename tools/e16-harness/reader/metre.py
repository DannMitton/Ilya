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


class IncompleteBarDurations(ValueError):
    """Raised by narrow_by_duration_division's completeness guard (Fable's
    ruling, 2026-07-28, Q1 restated) when sum(durations) does not equal the
    bar's notated length exactly. An early return is also a report, and
    V2-B assertions run before any report is issued, so an incomplete bar
    RAISES rather than returning a phantom None."""


class InvalidGrouping(ValueError):
    """Raised when a grouping tuple fails Fable's restated domain invariant
    (2026-07-28, Phase 2): every element must be a positive integer, and
    sum(g_i) * grouping_unit(beats, beat_type) must equal Fraction(beats,
    beat_type) exactly. NOT "sum equals the numerator" -- that wording was
    struck because it raises on 15/8's own lawful alternatives (see
    grouping_to_boundaries)."""


class DottedBarlineQuarantine(RuntimeError):
    """Raised by detect_irregular_grouping's step 2 when detect_dotted_barlines
    reports a nonempty hit list. Fable's ruling, 2026-07-28 (A7 three
    falsifications): converting a printed dotted-barline pixel x position
    into a grouping tuple needs a time-to-position reference, and the
    survivorship corollary forbids assembling one exclusively from detected
    structure (a reference built only from detected structure is a page
    reference with respect to undetected structure). Step 2 is HELD, not
    fixed, pending Fable's Q3 re-specification; there is no fall-through to
    step 3 on this path, and no silent return either."""


class OversizedBarNumeralComponent(RuntimeError):
    """Raised by step 1's replacement mechanism (Fable's ruling, Phase 6,
    2026-07-28) when a connected component in the start-of-bar numeral band
    is wider than the widest admissible digit template at the page's
    measured s, and the matcher cannot resolve the band into the lawful
    digit, plus, digit sequence. Oversized ink at the start of a bar in the
    numeral band is structure the mechanism was told exists and cannot
    silently miss, so this raises rather than abstaining."""


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

def detect_start_of_bar_numerals(nl, staves, s, vocal_staff_idx, bar_x, next_bar_x):
    """Step 1 of the search order (SOURCED position: "Place the numerals at
    the beginning of the bar", persistence SOURCED: "numerical division
    holds good until contradicted"). Vertical band [top - 3s, top) above the
    staff (INFERENCE, module docstring).

    RESTATED MECHANISM (Fable's ruling, Phase 6, 2026-07-28, COMPLETED by
    Fable's ruling, 2026-07-29). STRUCK: the former fixed `s_search_width=
    3.0` pixel window. Measured, SOURCED: at the corpus's s=21.0, the
    narrowest lawful digit-plus-digit sequence needs 3.686s to 3.733s held
    at ZERO inter-glyph gap, and the requirement never falls below roughly
    3.44-3.50s at the asymptote as s grows; the old 3.000s window could not
    hold any Table 1 alternative on any page, at any page size, so step 1
    never fired. `s_search_width` is gone; `next_bar_x` (already available
    at the call site, already passed to detect_dotted_barlines) replaces it
    as the search boundary. No distance figure appears anywhere in this
    mechanism: adjacency, not distance, is the criterion.

    STRUCK, 2026-07-29: `_find_plus_sign`, a connected-component-then-
    classify detector for the plus glyph alone, gated on component size
    (0.4s-0.9s). Fable's own restatement of this mechanism ("glyphs are
    identified by the matchTemplate plus NMS matcher run within component
    extents") named the defect: "the sentence said glyphs and the mechanism
    delivered digits." The plus had stayed on the one CC-classification
    gate the earlier strike (of the whole-mechanism CC-then-classify
    approach) did not cover. MEASURED, SOURCED, this session: a genuine
    ink merge between the plus and a neighbouring digit (verified via
    tight-cropped glyphs at the minimal overlap that produces an actual
    connectedComponentsWithStats merge) produced a merged component (43px
    at s=21, versus the 0.4s-0.9s = 8.4-18.9px gate) that _find_plus_sign
    could never pass, while timesig._digits_in_band still read both
    digits correctly at 0.977 confidence -- proving the plus, not the
    digits, was the fragile half of the prior hybrid.

    Three parts, and the split between them is the whole point:

      1. EXTENT. The walk supplies geometry only. Connected components in
         x order within the numeral band, over the bar's measured extent
         [bar_x, next_bar_x). Robust to touching ink, because merging
         changes component count, not the union of ink.
      2. IDENTITY. The SAME matchTemplate + NMS matcher for every glyph,
         digits and the plus alike (timesig._digits_and_plus_in_band),
         within the numeral band. The plus glyph (SMuFL timeSigPlus,
         U+E08D) is rendered through the exact same font/calibration
         pipeline as every digit (timesig.render_plus_glyph), and
         competes in the SAME candidate pool and the SAME NMS pass as the
         digits -- not a separate CC-size gate. The sequence criterion
         applies to MATCHED GLYPHS in x order, not to raw components: the
         leftmost matches must read digit, plus, digit, with no foreign
         component (from part 1) lying wholly between consecutive members
         of the triple.
      3. RAISE. A component wider than the widest admissible digit
         template at this page's measured s, which the matcher cannot
         resolve into the lawful sequence, RAISES (OversizedBarNumeralComponent)
         rather than abstaining. "Widest admissible digit template" is
         measured from timesig.render_digit at page s (digits only; the
         plus's own template width plays no part in this gate, unchanged
         from Fable's Phase 6 ruling), so no constant enters.

    Returns a grouping tuple, e.g. (3, 2), or None (abstain). Raises
    OversizedBarNumeralComponent per part 3."""
    from timesig import _digits_and_plus_in_band, render_digit
    import cv2

    st = staves[vocal_staff_idx]
    top = st[0]
    band_top = int(top - 3.0 * s)
    band_bot = int(top)
    if band_top >= band_bot:
        return None
    x_lo = int(bar_x)
    x_hi = int(next_bar_x)
    if x_hi <= x_lo:
        return None
    band = (nl[band_top:band_bot, x_lo:x_hi] > 0).astype('uint8')

    # PART 1: EXTENT. Geometry only; this walk classifies nothing.
    num, lab, stats, cent = cv2.connectedComponentsWithStats(band, 8)
    components = sorted((int(stats[i][0]), int(stats[i][0] + stats[i][2])) for i in range(1, num))
    if not components:
        return None

    def _component_at(x):
        for c in components:
            if c[0] <= x < c[1]:
                return c
        return None

    # PART 2: IDENTITY. One unified matcher call; `glyphs` is already
    # sorted left to right and mixes digits (int label) with the plus
    # (label '+') in the SAME NMS pool. All x are band-relative, matching
    # `components`' own frame, so no coordinate conversion is needed here
    # (STRUCK, 2026-07-28's version needed one for _find_plus_sign's
    # page-absolute x; this version does not).
    glyphs = _digits_and_plus_in_band(band, s)

    grouping = None
    if len(glyphs) >= 3 and [isinstance(g[1], int) for g in glyphs[:3]] == [True, False, True] \
            and glyphs[1][1] == '+':
        members = [_component_at(g[0]) for g in glyphs[:3]]
        foreign = False
        for lo_member, hi_member in zip(members[:-1], members[1:]):
            if lo_member is None or hi_member is None:
                continue
            lo_edge, hi_edge = lo_member[1], hi_member[0]
            for c in components:
                if c != lo_member and c != hi_member and lo_edge <= c[0] and c[1] <= hi_edge:
                    foreign = True
        if not foreign:
            grouping = (glyphs[0][1], glyphs[2][1])

    if grouping is not None:
        return grouping

    # PART 3: RAISE branch.
    widest_digit = max(render_digit(d, s).shape[1] for d in range(10))
    if any((c1 - c0) > widest_digit for c0, c1 in components):
        raise OversizedBarNumeralComponent(
            "component wider (%d px) than the widest admissible digit template (%d px "
            "at s=%s) in the numeral band [%s, %s), and the matcher could not resolve "
            "the lawful digit, plus, digit sequence"
            % (max(c1 - c0 for c0, c1 in components), widest_digit, s, bar_x, next_bar_x))

    return None


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
    notes and rests"). `durations` is the bar's notated event durations,
    notes and rests alike, in onset order, as exact Fraction semibreve
    values. Tied notes are separate events and are not merged. No
    tolerance anywhere.

    THE RULED CRITERION (Fable, 2026-07-27 Q2, restated 2026-07-28 Q1),
    which REPLACES the prior onset-coincidence rule Fable rejected:

      1. The completeness guard runs FIRST, before anything else,
         including the fixed-set check. If sum(durations) !=
         Fraction(beats, beat_type), RAISE IncompleteBarDurations. An
         early return is also a report, and V2-B assertions run before
         any report is issued.
      2. If the metre is not one of Table 1's fixed-set rows (5/16, 5/8,
         7/8, 7/4, 15/8), return None. 8/8, 10/8, and 8/4 permit "any
         other combination", so there is no fixed set to narrow.
      3. For each Table 1 alternative for the metre, compute each group's
         start position and length in semibreve fractions, using
         grouping_unit(beats, beat_type) as the counting unit.
      4. An alternative qualifies if and only if, for every group, there
         exists an event whose onset equals the group start exactly AND
         whose duration equals the group length exactly. Notes and rests
         both count. Beams, onsets alone, and longest-note comparisons
         play no part. Every group must be spanned, not one. No
         partial-span relaxation.
      5. Exactly one alternative qualifies -> return it. Zero -> None.
         More than one -> None (defensive; unreachable with a monophonic
         event list).

    Onsets are recovered from `durations` by cumulative sum. This is
    sound, and it is what the completeness guard protects: a gapless,
    complete duration list in onset order determines every onset by
    prefix sum.

    THE GUARD'S STATED LIMIT, so it is not mistaken for coverage: it
    checks completeness, not order or correctness. A misread duration
    compensating a dropped one restores the sum and defeats it; that is
    an upstream falsification, out of scope. Onset order is uncheckable
    from durations alone and remains a contract on the producer.

    CONTRACT, AMENDED (STRUCK: "excluding any abstained facet"): step 3
    is not consulted for a bar containing an abstained duration facet,
    and an upstream abstention surfaces as a named halt rather than a
    phantom None here.

    Returns a grouping tuple or None (no unique narrowing). Raises
    IncompleteBarDurations if `durations` does not sum to the bar's
    notated length exactly."""
    bar_length = Fraction(beats, beat_type)
    total = sum(durations, Fraction(0))
    if total != bar_length:
        raise IncompleteBarDurations(
            "%s/%s bar: sum(durations) = %s, expected %s (durations=%r)"
            % (beats, beat_type, total, bar_length, durations))
    alt = IRREGULAR_ALTERNATIVES.get(beats)
    if alt is None or alt.get('groupings') is None:
        return None
    unit = grouping_unit(beats, beat_type)   # classification-dependent; see its docstring
    events = []
    acc = Fraction(0)
    for d in durations:
        events.append((acc, d))
        acc += d
    matches = []
    for grouping in alt['groupings']:
        start = Fraction(0)
        spans_every_group = True
        for g in grouping:
            length = g * unit
            if not any(onset == start and dur == length for onset, dur in events):
                spans_every_group = False
                break
            start += length
        if spans_every_group:
            matches.append(grouping)
    if len(matches) == 1:
        return matches[0]
    return None


def _assert_valid_grouping(grouping, beats, beat_type):
    """The restated domain invariant (Fable, 2026-07-28, Phase 2), applied
    at grouping_to_boundaries: every element of `grouping` is a positive
    integer, and sum(g_i) * grouping_unit(beats, beat_type) ==
    Fraction(beats, beat_type) exactly.

    NOT "sum equals the numerator": Fable struck that wording himself. 15/8
    classifies compound, IRREGULAR_ALTERNATIVES[15] = [(3, 2), (2, 3)], and
    sum(g) = 5 against a numerator of 15, so the struck form would raise on
    both of 15/8's own lawful alternatives. This unit-aware form is verified
    to hold on all ten alternatives in the ruled sets (5, 7, 15 at their
    Table 1 rows)."""
    for g in grouping:
        if isinstance(g, bool) or not isinstance(g, int) or g <= 0:
            raise InvalidGrouping(
                "grouping element %r is not a positive integer (grouping=%r)" % (g, grouping))
    unit = grouping_unit(beats, beat_type)   # classification-dependent; see its docstring
    total = sum(grouping) * unit
    want = Fraction(beats, beat_type)
    if total != want:
        raise InvalidGrouping(
            "grouping %r at beats=%s, beat_type=%s sums to %s under unit %s (%s/%s); "
            "expected %s" % (grouping, beats, beat_type, total, unit, beats, beat_type, want))


def grouping_to_boundaries(grouping, beat_type, beats):
    """Convert a printed grouping tuple, e.g. (3, 2), into interior
    beatBoundaries (Fraction whole-note offsets), consistent with the
    simple/compound boundary convention used elsewhere in this module.

    `beats` is REQUIRED (Fable's ruling, 2026-07-28; the signature change is
    licensed explicitly). STRUCK: the former default `beats = sum(grouping)`.
    The unit a grouping integer counts is classification-dependent
    (grouping_unit), and the pair (3, 2) is ambiguous between an irregular 5
    reading (unit 1/8) and a compound 15 reading (unit 3/8); nothing in the
    grouping alone can disambiguate it. Measured, SOURCED:
    grouping_to_boundaries((3, 2), 8, beats=15) returns [9/8], the sourced
    value, while the old grouping_to_boundaries((3, 2), 8) returned [3/8],
    because the default's beats = 5 classifies irregular and collapses the
    unit to 1/8. The default silently reintroduced the exact bug
    grouping_unit's own docstring records as fixed.

    Raises InvalidGrouping if `grouping` fails the domain invariant (see
    _assert_valid_grouping)."""
    _assert_valid_grouping(grouping, beats, beat_type)
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
    'printed_numerals', 'printed_duration_division', 'inherited', or None
    (abstain). 'printed_dotted_barline' is no longer a possible source
    (Fable's ruling, 2026-07-28): step 2 is QUARANTINED, not wired to a
    source label -- see DottedBarlineQuarantine.

    STEP 2 IS HELD, NOT FIXED (Fable's ruling). Three violations named
    separately in the prior body: the label 'printed_dotted_barline'
    asserted a printed division was read while emitting pixel x positions
    that yield no boundaries (a false provenance claim, the inverse of
    V2-B); the early return silently suppressed step 3; the type error
    survived because the consumer never asserted its domain (Phase 2 fixes
    that last point). Converting a barline x position into a grouping needs
    a time-to-position reference, every candidate reference in the tree is
    assembled from detected structure, and the survivorship corollary
    forbids it. No conversion is attempted here and none is invented."""
    numerals = detect_start_of_bar_numerals(nl, staves, s, vocal_staff_idx, bar_x, next_bar_x)
    if numerals is not None:
        return numerals, 'printed_numerals'
    dotted = detect_dotted_barlines(nl, staves, s, vocal_staff_idx, bar_x, next_bar_x)
    if dotted:
        raise DottedBarlineQuarantine(
            "dotted-barline structure detected at %r in [%s, %s); step 2's conversion to "
            "a grouping tuple is HELD pending Fable's Q3 re-specification. No fall-through "
            "to step 3, no silent return." % (dotted, bar_x, next_bar_x))
    narrowed = narrow_by_duration_division(beats, beat_type, confident_durations)
    if narrowed is not None:
        return narrowed, 'printed_duration_division'
    if inherited_grouping is not None:
        return inherited_grouping, 'inherited'
    return None, None
