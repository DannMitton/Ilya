#!/usr/bin/env python3
"""E.16 generalized page reader + MEASURE-SUM TUPLET CATCH.

The tuplet catch is a FLAG-ONLY validator (T6: validators flag, humans and D8 fix).
Fable's purpose case: an unread triplet over-fills its measure, so phonation time
inflates 50 percent silently. Detection is deterministic arithmetic:

  1. sum the emitted durations in each measure;
  2. infer the metre as the MODE of those sums across the page (self-contained,
     no ground truth, no time-signature reader yet);
  3. any measure whose sum differs from the mode is FLAGGED low-confidence.

An unread triplet of eighths reads 3 x 1/8 = 3/8 where the truth is 3 x 1/12 = 1/4,
so the measure over-fills by 1/8 and the flag fires. The catch does not identify
the tuplet and does not correct it. It says: this measure does not add up.

NOTE (close-prep, 2026-07-24): tuplet_catch()'s mode-based metre inference was
STRUCK by Fable (fable-ruling-e16-beam-session-close). It is kept here verbatim
as the struck function; close-prep item 2 (the time-signature read) supplies a
replacement metre SOURCE, not a replacement for this function's arithmetic.
"""
import sys, json, collections
import cv2, numpy as np
from fractions import Fraction
sys.path.insert(0, '/home/claude')
from reader import read_page_pitch, detect_barlines, nms, band_of, FLAG_AREA_RATIO, _has_dot, _head_cc_area
from rest_templates import render_rest
from beams import detect_beam_bars, find_stem, beams_on_stem
from timesig import read_time_signature

# Each additional flag adds roughly a notehead of ink. RECALIBRATED, close-prep
# tier-1 unification (2026-07-24), same reasoning as FLAG_AREA_RATIO in
# reader.py: re-measured on piece 02 p1 under the unified (safe) removal,
# eighth-class max 2.190, sixteenth min 2.354; midpoint with margin below.
# EMPIRICAL, page-calibrated in s^2 units; the principled replacement is
# geometric flag-lobe counting, same as the beam stage.
FLAG2_AREA_RATIO = 2.27

# FLAG_AREA_MAX -- the abstain trigger (fable-spec-e16-abstain-path,
# 2026-07-27, item 1, ratified by Dann). An upper validity bound on the flag
# branch: a non-hollow head with nb == 0 (no beam found) and CC area at or
# above FLAG_AREA_MAX * s * s is outside the flag model's calibrated domain
# -- beam-scale ink with no beam is a cross-stage contradiction, not a big
# flag count, and extrapolating it is exactly what produced the close
# fixture's two 1/16 errors when the beam stage silently failed. Derivation:
# midpoint of (max legitimate flag-branch area, min beamed-head area) across
# the three calibration pages (piece 01 p1 control, piece 02 p1, close
# fixture), each with a 0.20 s^2 guard clearance.
#   legitimate flag-branch maxima: 2.034 (control), 2.159 (close),
#     2.646 (piece 02 p1, sixteenth-class, n=7, range 2.354-2.646 --
#     re-measured this session, matches the FLAG2_AREA_RATIO comment in
#     reader.py) -> overall max 2.646.
#   beamed-head minimum: 3.871 (close fixture, n=7, range 3.871-6.524).
#     Piece 02 p1 contributes NO legitimate beamed sample: the reader's own
#     census found exactly one nb>0 vocal head on that page (x=812, area
#     1.982), and it is a FALSE beam detection -- visually confirmed (crop)
#     to be duplicated tempo-marking text ("...n moto...=120") above the
#     first system, whose ink happens to sit at this note's stem tip. Piece
#     01 p1 has no beams either (SOURCED, e16-rhythm-spike-result). The
#     close fixture is therefore the only source for this side of the
#     derivation; 3.871 stands as the overall minimum.
#   midpoint = (2.646 + 3.871) / 2 = 3.2586 -> 3.26.
#   guards: 3.26 - 2.646 = 0.61 s^2 clear above every legitimate value;
#     3.871 - 3.26 = 0.61 s^2 clear below the beamed value. Both clear the
#     0.20 s^2 minimum with about 3x margin. GUARDS HELD; not tuned.
# Named, unit-bearing (s^2), page-calibrated, image-checkable: same fence as
# FLAG_AREA_RATIO and FLAG2_AREA_RATIO above.
FLAG_AREA_MAX = 3.26

# INK-WEIGHT GUARD (N.95/N.96 ship 1, 2026-08-24). FLAG_AREA_RATIO and
# FLAG2_AREA_RATIO are s^2-normalized but NOT ink-weight-portable -- the
# README's own limitation note, now measured. On the Lamm scan
# (raster400-1, s=30) the 23 GT-matched, confidently-classifiable QUARTER
# notes on page 1 measure area/s^2 in [1.781, 2.634] (n=23; 3 further
# outliers, [3.682, 9.54], are touching-ink contamination -- see below).
# That range sits ENTIRELY ABOVE the render corpus's own calibration
# ceiling for the SAME class (piece 02 p1: quarters 1.327-1.490, comment
# above) and overlaps its SIXTEENTH-class floor (2.354). Applying the
# render-calibrated constants here over-counts flags on every one of the
# 26 quarters on the page (0/28 confident durations correct, memo N.95).
# No single global constant can serve both corpora: the render corpus's
# own eighth/sixteenth class boundary (2.19-2.354) sits entirely BELOW the
# floor the scan's quarters need (2.634), so any constant that fixes the
# scan would break every render fixture that depends on the old value, and
# any constant that keeps the renders exact cannot also fix the scan.
#
# The fix is therefore PAGE-LOCAL, not a new global constant: a guard,
# self-referential and ground-truth-free, decides per page whether to
# derive a page-specific boundary from the page's OWN note population, or
# to take the fixed default unchanged. Guard signal: median staff-LINE
# thickness (not spacing) as a fraction of s -- measured identically, ZERO
# variance, across 4 independently sampled render-corpus pages from 3
# different pieces (piece 02 p1, Elegy p5, sunless-01 p1 and p2):
# thickness/s = 2px/21 = 0.0952 every time.
#
# WIDENED 2026-08-24 from that 4-page sample to the whole corpus, and the
# separation held: ALL 23 render fixture pages measure 0.0952 exactly, with
# zero variance, and both Lamm scan pages sit far above at 0.2000 (page 1)
# and 0.2333 (page 2). INK_WEIGHT_GUARD = 1.5 * 0.0952 = 0.1428 sits 50%
# above every render value and 29% below the lower of the two scan values.
# A page at or under the guard takes the FIXED constants below, UNCHANGED --
# the exact code path every one of the 23 render fixtures already runs, so
# their output cannot move by construction, not merely by coincidence. That
# is the same gate the hollow-notehead abstention uses.
INK_WEIGHT_GUARD = 0.1428
_REFERENCE_THICKNESS_RATIO = 0.0952   # recorded for the derivation above; not read anywhere

REST_KINDS = [('quarter', Fraction(1, 4)), ('8th', Fraction(1, 8)), ('16th', Fraction(1, 16))]


def _staff_line_thickness(img, staves, s):
    """Median vertical ink-run length AT a detected staff-line row, sampled
    every 20 columns -- the ink-weight guard's own signal (see derivation
    above), computed the same way on every page and consulted by nothing
    upstream of it."""
    dark = img < 128
    thick = []
    for st in staves:
        for ly in st:
            for c in range(0, dark.shape[1], 20):
                if not dark[ly, c]:
                    continue
                a = ly
                while a > 0 and dark[a - 1, c]: a -= 1
                b = ly
                while b < dark.shape[0] - 1 and dark[b + 1, c]: b += 1
                thick.append(b - a + 1)
    return float(np.median(thick)) if thick else float('nan')


def _derive_flag_boundary(areas_over_s2, floor=0.15, min_members=3):
    """Population-shape derivation for the primary flag-count boundary
    (nflags 0 vs >=1), consulted ONLY on an ink-weight-guarded page. Same
    primitive as reader._derive_rowfrac_gate: segment the page's own sorted
    area/s^2 values wherever a consecutive gap exceeds `floor`; discard
    segments under `min_members` (an isolated singleton or pair is more
    likely a touching-ink outlier than a real duration class -- the scan's
    3 known outliers, area/s^2 = 3.682/3.99/9.54, are exactly this shape,
    each its own singleton segment); take the LARGEST gap between two
    surviving segments and return its midpoint.

    Run programmatically against the scan's own 43-note area population
    (every non-hollow, unbeamed vocal head on the page -- see the guard
    above; NOT pre-filtered by FLAG_AREA_MAX, which would cut into the
    scan's own eighth-note class, see the call site), this returns 2.898,
    splitting the page into three populous segments: a 24-member segment
    [1.781, 2.634] (quarters and dotted quarters), a 10-member segment
    [3.162, 3.708] and a 4-member segment [3.861, 4.014] (both eighths --
    the smaller internal gap between them, 0.153, is real but is not the
    LARGEST gap, so it plays no part in the boundary), and 5 further
    singleton outliers (5.131 to 26.874, touching-ink contamination, each
    its own under-populated segment, correctly discarded). The largest gap,
    0.528 between the first two populous segments, gives the boundary --
    independently reproducing, from the page's own raster with no ground
    truth consulted, the same boundary a hand analysis against ground
    truth also found.

    floor=0.15: measured inert on that same 24-member segment (does not
    fragment it) and sits well below the render corpus's own documented
    clean gaps (0.397, 0.164 -- FLAG_AREA_RATIO comment above); it would
    not fragment a real render class either, though this function is never
    reached on a render page (see the guard above).

    min_members=3: WEAKER than the rowfrac gate's structurally-justified 5
    ("five lines to a staff") -- no equivalent structural minimum exists
    for a note population. This is the one constant in this derivation
    without independent structural grounding; flagged NOT ESTABLISHED
    beyond the single page it was measured on.

    Returns None (use the fixed default) if fewer than two populous
    segments survive -- an honest abstention from a data-poor page rather
    than a guess from noise.
    """
    vals = np.array(sorted(areas_over_s2))
    if len(vals) < 2 * min_members:
        return None
    diffs = np.diff(vals)
    splits = [i for i in range(len(diffs)) if diffs[i] > floor]
    bounds = [0] + [i + 1 for i in splits] + [len(vals)]
    segs = [vals[bounds[k]:bounds[k + 1]] for k in range(len(bounds) - 1)]
    pop = [seg for seg in segs if len(seg) >= min_members]
    if len(pop) < 2:
        return None
    best_gap = -1.0
    best_mid = None
    for i in range(len(pop) - 1):
        gap = pop[i + 1][0] - pop[i][-1]
        if gap > best_gap:
            best_gap = gap
            best_mid = (pop[i][-1] + pop[i + 1][0]) / 2.0
    return best_mid


def detect_rests_multi(nl, staves, vocal, s, thr=0.62):
    """Font-sourced rest templates, all durations at once; best-scoring kind wins
    at each location. Replaces the single-template eighth-rest-only detector."""
    cands = []
    for name, dur in REST_KINDS:
        tpl = render_rest(name, s)
        res = cv2.matchTemplate((nl * 255).astype(np.uint8),
                                (tpl * 255).astype(np.uint8), cv2.TM_CCOEFF_NORMED)
        hh, ww = tpl.shape
        ys, xs = np.where(res >= thr)
        for a, b in zip(xs, ys):
            cx, cy = int(a + ww / 2), int(b + hh / 2)
            if band_of(cy, staves, vocal, s) < 0:
                continue
            cands.append(dict(x=cx, y=cy, score=float(res[b, a]), name=name, dur=dur))
    if not cands:
        return []
    pts = [(c['x'], c['y']) for c in cands]; sc = [c['score'] for c in cands]
    keep = nms(pts, sc, 0.9 * s)
    return [dict(x=cands[i]['x'], y=cands[i]['y'], dur=cands[i]['dur'], name=cands[i]['name'],
                 sys=band_of(cands[i]['y'], staves, vocal, s)) for i in keep]


def read_page_metre(nl, staves, s, vocal, bl, page_width):
    """Close-prep item 2: read the BODY metre directly off the page, as a
    metre SOURCE for measure_integrity_flag, replacing tuplet_catch()'s
    STRUCK mode-based inference. Searches the gap right after the first
    barline on the vocal staff's first system (where an initial pickup's own
    time signature, if any, is superseded by the body metre -- see
    timesig.py's module docstring on scope: this reads one system-start
    signature, not mid-piece changes). A width of 6 staff-spaces past the
    barline was measured to comfortably contain a two-digit-over-one-digit
    signature ("12/8" spanned ~5.8 staff-spaces on piece 01 p1) without
    reaching into the following measure's note content on either verified
    fixture (piece 01 p1's "12/8", piece 02 p1's "4/4").

    Returns (beats, beat_type) or (None, None) -- ABSTAIN (T6) if there is
    no barline to anchor the search on, or nothing legible is found."""
    vocal_staff_idx = vocal[0]
    sys0_bars = bl.get(0, [])
    if not sys0_bars:
        return None, None
    x_lo = sys0_bars[0]
    x_hi = min(page_width, x_lo + 6 * s)
    return read_time_signature(nl, staves, s, vocal_staff_idx, x_lo, x_hi)


def run(cfg):
    recs, G = read_page_pitch(cfg)
    img, staves, s, vocal, nl = G['img'], G['staves'], G['s'], G['vocal'], G['nl']
    nl2 = G['nl_safe']
    num, lab, stats, cent = cv2.connectedComponentsWithStats(nl, 8)
    W = img.shape[1]
    bars = detect_beam_bars(nl2, s)

    # area/nb computed once per note, ahead of classification: both the
    # ink-weight guard's per-page derivation and the classification loop
    # below consume the SAME values (byte-identical to the old inline
    # per-note computation; only the order of operations changed).
    note_areas = []
    note_nbs = []
    for r in recs:
        area, lid = _head_cc_area(dict(x=r['x'], y=r['y']), nl, lab, stats)
        nb = beams_on_stem(find_stem(nl2, r['x'], r['y'], s), bars, s)
        note_areas.append(area)
        note_nbs.append(nb)

    # INK-WEIGHT GUARD (see derivation above). thr/flag2 default to the
    # fixed, render-calibrated constants, UNCHANGED, unless this page's own
    # measured staff-line thickness is heavier than every sampled render
    # page's.
    thr = FLAG_AREA_RATIO * s * s
    flag2 = FLAG2_AREA_RATIO * s * s
    line_t = _staff_line_thickness(img, staves, s)
    ink_heavy = bool(np.isfinite(line_t) and s > 0 and (line_t / s) > INK_WEIGHT_GUARD)
    if ink_heavy:
        # NOT capped by FLAG_AREA_MAX here (found live on this ship's own
        # corrected note population, 2026-08-24): that constant is itself
        # one of the render-calibrated, ink-weight-non-portable values this
        # guard exists to route around. On the scan the real eighth-note
        # class sits at 3.16-5.13, mostly ABOVE FLAG_AREA_MAX=3.26 -- a pool
        # capped there kept only 2 of 17 eighth-class members, below
        # min_members, so the gap-statistic saw one populous segment and
        # correctly refused to guess (returned None), silently falling back
        # to the fixed render threshold this whole guard exists to avoid.
        # The uncapped pool lets `_derive_flag_boundary`'s own populous-
        # segment filter do that job instead, the same way it already
        # discards this page's other large-area outliers (contamination,
        # not a duration class) as under-populated singletons -- no
        # separate cap needed, and none is applied.
        pool = [note_areas[i] / (s * s) for i, r in enumerate(recs)
                if not r.get('hollow') and note_nbs[i] == 0]
        derived = _derive_flag_boundary(pool)
        if derived is not None:
            thr = derived * s * s
            # FLAG2 is scaled from the render corpus's OWN ratio between its
            # two constants (2.27/1.65): no independent sixteenth-class
            # evidence exists on the calibration page (its GT span has zero
            # sixteenths), so this is an extrapolation, not a second
            # measurement -- and it is inert in practice below
            # FLAG_AREA_MAX regardless (that fixed abstain trigger is
            # checked first and is not itself re-derived here).
            flag2 = derived * (FLAG2_AREA_RATIO / FLAG_AREA_RATIO) * s * s

    events = []
    for idx, r in enumerate(recs):
        area = note_areas[idx]
        nb = note_nbs[idx]
        dur_abstain = None
        if r.get('hollow'):
            if ink_heavy:
                # THE HOLLOW BYPASS, CLOSED (N.95 part C item 2, 2026-08-24).
                # `dur = Fraction(1, 2)` is the one duration branch with no
                # abstain path at all, so a hollow-detector false positive is
                # a CONFIDENT wrong answer that nothing downstream can catch.
                # Memo N.95 measured two of them on the Lamm scan (x=2089 and
                # x=2669, reader/true duration ratio 4/1 and 4/3): the ring
                # filter fired on the white space a stem and its flag enclose,
                # several staff spaces above a filled notehead that was already
                # detected in its own right.
                #
                # WHY THE WHOLE BRANCH ABSTAINS ON AN INK-HEAVY PAGE RATHER
                # THAN THE FALSE POSITIVES ALONE. The first attempt at this
                # rejected a stemmed hollow candidate sitting close to a filled
                # head on both axes, on the reasoning that the two are the same
                # note's ink. The 23-page fixture gate refuted it: sunless-06
                # engraves a filled head and a hollow CHORD on one shared stem,
                # pixel-confirmed on p4 sys1 (crop of x 400-1900, y 1040-1220,
                # four such chords), so genuine minims sit at dx 0.00-1.43s and
                # dy 0.48-3.10s from a filled head. That is the same geometry as
                # the scan's false positives, and it moved 5 of the 23 fixtures.
                # No dx/dy box separates the two populations, so the graphic
                # discriminator does not exist at this stage.
                #
                # What remains is honesty over coverage, which is the ruled
                # order for this ship: on a page whose ink the hollow detector
                # was never calibrated against, do not assert a minim. The gate
                # is the SAME measured ink-weight guard the flag threshold uses
                # (see INK_WEIGHT_GUARD), so a render page keeps the fixed
                # `Fraction(1, 2)` on the identical code path and cannot move,
                # by construction rather than by luck. The cost is named: a
                # GENUINE minim on an ink-heavy page now abstains too.
                dur = None
                dur_abstain = 'hollow_head_on_ink_heavy_page'
            else:
                dur = Fraction(1, 2)                  # minim; stemless semibreve unexercised
        elif nb > 0:
            dur = Fraction(1, 4 * (2 ** nb))          # beams win
        elif area >= FLAG_AREA_MAX * s * s:
            # ABSTAIN TRIGGER (fable-spec-e16-abstain-path item 1): beam-scale
            # ink with no beam found is a cross-stage contradiction, outside
            # the flag model's calibrated domain. Never extrapolate a flag
            # count from it -- that guess is exactly what produced the close
            # fixture's two 1/16 errors.
            dur = None
            dur_abstain = 'beam_scale_ink_no_beam'
        else:
            nflags = 2 if area >= flag2 else (1 if area >= thr else 0)
            dur = Fraction(1, 4 * (2 ** nflags))
        if dur is not None and _has_dot(r['x'], r['y'], stats, cent, num, s):
            dur *= Fraction(3, 2)                     # a dot is never applied to a null duration
        midi = r['midi']
        pitch_abstain = None
        midi_assumed_natural = None
        if r.get('abstain'):
            # Spec item 7: the accidental engine's own abstention, computed
            # in read_page_pitch and previously dropped here. Never emit a
            # midi computed with an assumed natural.
            midi = None
            pitch_abstain = 'accidental_unresolved'
            # N.59, Ruling D, ADDITIVE ONLY. The rule above governs `midi` and
            # is untouched: nothing downstream that reads `midi` can now see an
            # assumed natural. What is carried alongside it is the geometric
            # value the nulling discarded, under a name that says exactly what
            # it is, so the browser's engraver has something to draw.
            #
            # Why draw it at all: a dropped event silently shifts every later
            # syllable one note left, and corrupts the pairing invisibly. A
            # natural shown plainly is a visible, checkable error a singer can
            # see and hear against their own paper. That is the same logic
            # that struck the uncertainty mark in E.47, applied one layer down.
            # The count is declared in the drawer's read report.
            midi_assumed_natural = r['midi']
        events.append(dict(sys=r['sys'], x=r['x'], kind='note', dur=dur, midi=midi,
                            dur_abstain=dur_abstain, pitch_abstain=pitch_abstain,
                            midi_assumed_natural=midi_assumed_natural))

    rests = detect_rests_multi(nl, staves, vocal, s)
    for rr in rests:
        events.append(dict(sys=rr['sys'], x=rr['x'], kind='rest', dur=rr['dur'], midi=None,
                            dur_abstain=None, pitch_abstain=None))

    bl = detect_barlines(nl, staves, vocal, s)
    # N.59, Ruling A. `measures_per_system` is a harness configuration list and
    # a browser has no configuration to read it from. Where cfg omits it, it is
    # DERIVED from the reader's own detected barlines. The harness keeps
    # supplying it explicitly, so every fixture run is unchanged.
    #
    # IT IS len(barlines), NOT len(barlines) + 1. The brief's formula carried
    # the off-by-one and it was measured, not argued: summed across each
    # piece's pages and checked against that piece's ground-truth measure
    # count, the +1 form is wrong on all six Musorgsky pieces and wrong by
    # exactly the number of systems (24 against 18, 17 against 12, 57 against
    # 41, 37 against 29, 81 against 61, 80 against 55). The plain form is exact
    # on four of the six and short by one or two on the two longest, where the
    # reader missed a barline of its own. The domain says the same thing: a
    # system ENDS with a barline, so n barlines close n measures rather than
    # opening an n+1th.
    mps = cfg.get('measures_per_system')
    if mps is None:
        mps = [max(1, len(bl.get(i, []))) for i in range(len(vocal))]
    base = np.cumsum([0] + list(mps))[:-1]
    out_notes = []; msum = {}
    for syi in range(len(vocal)):
        bnds = [0] + bl.get(syi, []) + [W]
        ev = sorted([e for e in events if e['sys'] == syi], key=lambda e: e['x'])
        for seg in range(mps[syi]):
            lo, hi = bnds[seg], bnds[seg + 1]
            segev = sorted([e for e in ev if lo <= e['x'] < hi], key=lambda e: e['x'])
            mi = int(base[syi]) + seg
            onset = Fraction(0)
            onset_abstained = False   # once a duration abstains, every later
                                       # record this measure loses its onset
                                       # too (spec item 3); barline resync.
            measure_has_dur_abstain = False
            # N.97, RULED BY DANN 2026-08-24: THE ID IS MEASURE AND X, and the
            # onset is out of it.
            #
            # The id was r{measureIndex}-{onsetNum}-{onsetDen}-{x}, and the
            # onset in it is a RUNNING SUM over the measure's preceding events.
            # That made every id after a change in the event population a
            # different string: removing one false positive early in a measure
            # renamed every event after it, and a hand correction keyed by id
            # stopped landing. N.97 changes the event population on purpose --
            # the clef and key mask above drops 10 detections on the Lamm scan
            # alone -- so the onset had to leave the id or the corrections
            # would have been the ship's own casualty.
            #
            # Measure and x are both properties of WHERE THE INK IS, so they do
            # not move when a neighbour is removed. x is the notehead centre
            # the matched filter found, in page pixels, and it is already what
            # the id's last segment carried.
            #
            # THE COLLISION SUFFIX. Two events in one measure can share an x
            # (nothing forbids it, and a chord would be the ordinary case if
            # this reader read chords). The second and later get a stable
            # ordinal, r{mi}-{x}-2, counting in the same x-sorted order this
            # loop already walks, so the suffix does not depend on anything but
            # the page. Measured on this corpus: it never fires -- see the
            # return memo.
            x_ordinal = {}
            for e in segev:
                abstain = {}
                if onset_abstained:
                    onset_field = None
                    abstain['onset'] = 'follows_duration_abstention'
                else:
                    onset_field = dict(numerator=onset.numerator, denominator=onset.denominator)
                ord_n = x_ordinal.get(e['x'], 0) + 1
                x_ordinal[e['x']] = ord_n
                nd = dict(id=(f"r{mi}-{e['x']}" if ord_n == 1 else f"r{mi}-{e['x']}-{ord_n}"),
                          type=('note' if e['kind'] == 'note' else 'rest'),
                          measureIndex=mi,
                          onset=onset_field)
                if e['dur'] is None:
                    nd['duration'] = None
                    abstain['duration'] = e['dur_abstain']
                    onset_abstained = True
                    measure_has_dur_abstain = True
                else:
                    nd['duration'] = dict(numerator=e['dur'].numerator, denominator=e['dur'].denominator)
                if e['kind'] == 'note':
                    nd['midi'] = e['midi']
                    if e.get('pitch_abstain'):
                        abstain['pitch'] = e['pitch_abstain']
                        # Additive, and present ONLY on an abstained note, so a
                        # confident record is byte-identical to before (N.59
                        # step 4's proof).
                        nd['midiAssumedNatural'] = e.get('midi_assumed_natural')
                if abstain:
                    nd['abstain'] = abstain            # absent key means confidence
                out_notes.append(nd)
                if e['dur'] is not None:
                    onset += e['dur']
            msum[mi] = None if measure_has_dur_abstain else onset

    # N.59, Ruling A. The ground-truth file is a harness artifact and does not
    # exist in a browser; `pieceId` was the only thing read out of it. cfg's own
    # id is preferred where present (the app derives it from the file name stem
    # plus a short content hash, which the retention ruling already records),
    # and the gt file is not opened at all in that case.
    piece_id = cfg['pieceId'] if 'pieceId' in cfg else json.load(open(cfg['gt']))['pieceId']
    ro = dict(pieceId=piece_id, clef=dict(sign=cfg['clef'][0], line=cfg['clef'][1]),
              keySignature=dict(fifths=cfg['key']),
              verses=[dict(verseNumber=1, notes=out_notes)])
    # N.97, ADDITIVE AND NEVER CONSUMED HERE. `clef` and `keySignature` above
    # are still the CALLER'S answers, byte-identical to before, because every
    # pitch on this page was computed from them. `readClefKey` is what the page
    # itself prints, for the intake prompt to pre-fill from. The two are
    # deliberately separate: the reader reports what it saw, the singer says
    # what is true, and a disagreement is a question for the singer rather than
    # something this module resolves.
    if G.get('clefKeyRead') is not None:
        ro['readClefKey'] = G['clefKeyRead']

    metre_beats, metre_beat_type = read_page_metre(nl, staves, s, vocal, bl, W)
    # whole-note-fraction units, matching msum: an X/Y signature's measure
    # duration is X beats * (1/Y) whole notes per beat = X/Y, NOT X/(Y*4) --
    # beat_type Y already IS "quarter=4, eighth=8, ..." (1/Y of a whole note
    # per beat), so multiplying by 4 double-counts. Caught by self-check:
    # 4/4 was coming out as Fraction(1,4) instead of Fraction(1,1) (verified
    # against measureDurations: piece 01 body 12/8 -> 3/2, piece 02 pickup
    # 2/4 -> 1/2, both X/Y directly, no extra factor).
    read_metre = (Fraction(metre_beats, metre_beat_type)
                  if metre_beats is not None else None)

    return ro, msum, G, rests, events, read_metre


def tuplet_catch(msum, skip_first=True):
    """FLAG-ONLY (T6). Infer the metre as the mode of measure sums; flag deviants.
    STRUCK as a metre SOURCE by Fable's beam-session-close ruling (mode-based
    metre inference inverts on exactly the pages where the validator is most
    needed). Kept verbatim; close-prep replaces the metre argument, not this
    function, when calling the validator with a READ time signature instead."""
    items = sorted(msum.items())
    body = items[1:] if skip_first else items      # measure 0 may be a pickup
    counts = collections.Counter(v for _, v in body)
    metre, _ = counts.most_common(1)[0]
    flags = {}
    for mi, v in items:
        if mi == 0 and skip_first:
            flags[mi] = None                        # pickup: not judged
        else:
            flags[mi] = (v != metre)
    return metre, flags


def measure_integrity_flag_legacy(msum, metre, skip_first=True):
    """PRESERVED VERBATIM as the pre-Front-3a function, renamed with a
    _legacy suffix so old call sites (run_close_rev6.py etc.) that still
    invoke the two-argument form keep working unchanged; SUPERSEDED as the
    canonical measure-integrity check by measure_integrity_flag below (Front
    3a decision 5, spec revision 3, ratified 2026-07-27), which retires
    skip_first entirely. Do not extend this function; extend the new one."""
    items = sorted(msum.items())
    flags = {}
    for mi, v in items:
        if mi == 0 and skip_first:
            flags[mi] = None
        elif v is None:
            flags[mi] = 'abstain'
        else:
            flags[mi] = (v != metre)
    return flags


def measure_integrity_flag(msum, metre_map, event_counts, piece_measure0_index=0):
    """Front 3a decision 5 (spec revision 3, ratified 2026-07-27; see also
    ratification item 10 and decision 7). `skip_first` is REMOVED from this
    function's call path entirely -- superseded by decision 3's piece-scoped,
    event-gated pickup rule below.

    msum: {measureIndex (GLOBAL, via the envelope's measureIndexOffset):
      Fraction | None}. metre_map: {measureIndex (GLOBAL): Fraction | None},
      the per-measure effective measure duration from the envelope (an X/Y
      signature's measure duration is X/Y whole notes, the existing verified
      conversion). event_counts: {measureIndex (GLOBAL): int}, the emitted
      note/rest count per measure -- decision 7's empty-bar gate is tested on
      this COUNT, not on msum reading 0, because msum ALSO reads 0 for an
      empty bar (there is no other way to distinguish "nothing was printed"
      from "nothing was printed here either" using the sum alone).
      piece_measure0_index: the GLOBAL index of the piece's own measure 0
      (almost always 0; only present in metre_map when this call covers the
      piece's first page).

    Branch order (decisions 3, 5, 7, all ratified):
      1. metre_map[mi] is None            -> 'abstain' (metre unknown or no
         inheritance reaches this measure).
      2. event_counts[mi] == 0             -> 'abstain' (decision 7: a
         printed but empty bar; the reader never invents an unprinted rest,
         so this is reported as abstention, not a pass and not a defect).
      3. msum[mi] is None                  -> 'abstain' (the measure
         contains a duration abstention; the sum is genuinely unknown).
      4. mi == piece_measure0_index (reached only with >=1 event, by branch
         2's gate -- revision 3's correction, the reason this function
         exists in this shape): sum == metre -> False (ordinary full
         measure); sum < metre -> None (legal pickup); sum > metre -> True.
      5. every other judged measure: True iff sum != metre.
    The ratified fourth state ('abstain') is reused for all three abstention
    causes; which cause applies is visible in the caller's per-measure
    `abstain` dict (decision 6/8), not in this function's return value. The
    0.95 recall bar (ratified, unchanged) is computed over judged measures
    only ({True, False})."""
    flags = {}
    for mi in sorted(metre_map.keys()):
        metre = metre_map[mi]
        if metre is None:
            flags[mi] = 'abstain'
            continue
        if event_counts.get(mi, 0) == 0:
            flags[mi] = 'abstain'
            continue
        v = msum.get(mi)
        if v is None:
            flags[mi] = 'abstain'
            continue
        if mi == piece_measure0_index:
            if v == metre:
                flags[mi] = False
            elif v < metre:
                flags[mi] = None       # legal pickup
            else:
                flags[mi] = True
        else:
            flags[mi] = (v != metre)
    return flags
