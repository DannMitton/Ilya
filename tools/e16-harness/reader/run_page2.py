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

REST_KINDS = [('quarter', Fraction(1, 4)), ('8th', Fraction(1, 8)), ('16th', Fraction(1, 16))]


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
    thr = FLAG_AREA_RATIO * s * s
    bars = detect_beam_bars(nl2, s)

    events = []
    for r in recs:
        area, lid = _head_cc_area(dict(x=r['x'], y=r['y']), nl, lab, stats)
        nb = beams_on_stem(find_stem(nl2, r['x'], r['y'], s), bars, s)
        dur_abstain = None
        if r.get('hollow'):
            dur = Fraction(1, 2)                      # minim; stemless semibreve unexercised
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
            nflags = 2 if area >= FLAG2_AREA_RATIO * s * s else (1 if area >= thr else 0)
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
            for e in segev:
                abstain = {}
                if onset_abstained:
                    onset_field = None
                    id_onset = 'na-na'
                    abstain['onset'] = 'follows_duration_abstention'
                else:
                    onset_field = dict(numerator=onset.numerator, denominator=onset.denominator)
                    id_onset = f"{onset.numerator}-{onset.denominator}"
                nd = dict(id=f"r{mi}-{id_onset}-{e['x']}",
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
