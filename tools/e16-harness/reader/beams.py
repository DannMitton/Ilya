#!/usr/bin/env python3
"""E.16 -- beam stage.

TWO changes, both with precedent (T4):

1. SAFE STAFF-LINE REMOVAL. The old stage opened the page with a horizontal
   kernel 1.7*s wide and subtracted everything that survived. A beam is far
   wider than that (measured: 82 px at s=21, versus a 35 px kernel), so beams
   were subtracted AS IF THEY WERE STAFF LINES and vanished. Fix: subtract the
   opened mask ONLY at rows belonging to a DETECTED staff line. This is oemer's
   approach (staff removal driven by detected staff positions) rather than a
   blanket morphological guess.

2. BEAM COUNTING. Gould, Behind Bars p. 17: "Beam thickness is 1/2 stave-space.
   The distance between beams is 1/4 stave-space." So a beam is a horizontal bar
   ~0.5*s thick, and stacked beams are separated by ~0.25*s. A beam also spans
   the gap to the next stem in its group, so it is far wider than a flag.
   Detection: open the line-free page with a horizontal kernel 1.1*s wide. Flags
   and noteheads do not survive; beams do. Each surviving component is a beam
   bar. A note's beam count = the number of beam bars crossing its stem.
   Duration = 1/(4 * 2**nbeams).
"""
import cv2, numpy as np
import substrate

# ---------------------------------------------------------------------------
# T_REL -- C2(b)'s tolerance, ratified 2026-07-28.
#
# THE FORM is Fable's, the clearance rule instantiated on the deviation axis:
# a row is extent-consistent with the reference iff its deviation, divided by
# the CLAIMED STRUCTURE'S EXTENT, is at most T_REL, where T_REL equals the
# measured minimum deviation ratio among non-member rows MINUS one sample
# standard deviation of the non-member deviation ratios. Direction check, from
# the ruling: too-small T rejects true member rows, which is under-extension
# and the silent lie; too-large T admits non-members, which is over-extension
# and the loud abstention. So T sits against the non-member floor with the
# minimal measured margin and spends its discretion on the silent side.
#
# STRUCTURE-RELATIVE, not pixels. The pixel form of this constant, T =
# 541.1885 px, is SUPERSEDED. Its sample standard deviation was computed over
# a non-member population pooled across systems ranging from 812 to 2,233 px
# wide, so it measured between-system width variation rather than dispersion
# around the floor, and its D3 distribution was visibly bimodal for that
# reason. Dividing the width out collapses the sd from 0.11 to 0.007894 and
# the bimodality with it. The margin is fourteen times thinner and it is
# honest: the pixel form's fat margin was borrowed capital.
#
# THE VALUE is a MEASUREMENT, recomputed over the current corpus, not a
# ratified number. Measured 2026-07-28 with every band row serving as seed in
# turn (anchor-independence, AT3), non-member rows taken as the walk's
# terminating rows:
#     member ratios      n = 5,220,  maximum 0.001799
#     non-member ratios  n = 6,120,  minimum 0.801164, sample sd 0.007894
#     D3, 0.1 bins:      {0.8: 5, 0.9: 19, 1.0: 6096}
#     T_REL = 0.801164 - 0.007894 = 0.793270
# The derivation RAISES unless T_REL strictly exceeds the maximum member
# ratio; it does, by better than two orders of magnitude. Re-derive whenever
# the corpus changes.
T_REL = 0.793270


class WalkRaise(RuntimeError):
    """The band walk could not answer, and abstain beats guess."""


BEAM_KERNEL_W   = 1.8   # in staff spaces: wider than a flag (measured 1.29 s)
BEAM_MIN_W      = 2.2   # a beam joins two stems, which sit >= 2 staff spaces apart
BEAM_MIN_THICK  = 0.30  # Gould: 0.5*s nominal; accept down to 0.30 for binarization loss
BEAM_MAX_THICK  = 0.95  # a single bar; anything fatter is two merged, handled by splitting
BEAM_MAX_W      = 12.0  # a vocal beam group does not span more than this many staff spaces
STEM_SEARCH     = (0.35, 1.05)   # staff spaces either side of the head centre
STEM_MIN_LEN    = 1.8            # a real stem runs at least this far


def _extent_consistent(ext, r, ref_extent, staff_extent, nrows):
    """C2(b), the ONE membership condition. Structure-relative.

    A row is extent-consistent with the reference iff its principal bridged
    extent deviates from the reference by at most T_REL of the claimed
    staff's extent. A blank row has no raw runs, hence no principal run,
    hence extent 0 by the substrate's own definitions, hence a deviation
    ratio of 1 relative to the claimed structure. That needs no special case
    and gets none.
    """
    if r < 0 or r >= nrows:
        return False
    return abs(int(ext[r]) - ref_extent) <= T_REL * staff_extent


def _snap_seed(ext, y, staff_extent, s, nrows, page):
    """S2. Snap to the nearest row satisfying membership, searching outward.

    The bound is HALF THE RULE SPACING, and it is derived rather than tuned:
    beyond half the spacing the nearest satisfying row lies in an adjacent
    rule's basin, and returning it would answer a different rule's question.
    Exhaustion RAISES.

    At snap time no validated seed exists, so extent-consistency is measured
    against the claimed staff's own extent rather than a seed's. That is the
    ordering that closes the circularity between S1 and S2.

    Ties RAISE. Two satisfying rows equidistant on opposite sides is
    ambiguity, and abstain beats guess. On this corpus the measured
    corrections are one-sided, so this clause is predicted never to fire,
    which is the correct price for honesty.
    """
    bound = max(1, int(round(s / 2.0)))
    if _extent_consistent(ext, y, staff_extent, staff_extent, nrows):
        return y
    for off in range(1, bound + 1):
        lo_ok = _extent_consistent(ext, y - off, staff_extent, staff_extent,
                                   nrows)
        hi_ok = _extent_consistent(ext, y + off, staff_extent, staff_extent,
                                   nrows)
        if lo_ok and hi_ok:
            raise WalkRaise("walk S2: snap tie at row %d, offset %d, on page "
                            "%r. Two satisfying rows equidistant on opposite "
                            "sides is ambiguity." % (y, off, page))
        if lo_ok:
            return y - off
        if hi_ok:
            return y + off
    raise WalkRaise("walk S2: snap exhausted at row %d on page %r within half "
                    "the rule spacing (%d px); no row satisfies membership "
                    "against staff extent %d" % (y, page, bound, staff_extent))


def _walk_band(ext, seed, staff_extent, nrows):
    """S3, S4, S5. Symmetric membership walk from a validated seed.

    S4: termination by membership failure ONLY. There is no thickness cap; a
    "max 2 rows" cap would be corpus-fitted and resolution-fragile.
    S5: one rule, both directions, no directional term.
    """
    ref = int(ext[seed])
    members = [seed]
    r = seed - 1
    while _extent_consistent(ext, r, ref, staff_extent, nrows):
        members.append(r)
        r -= 1
    r = seed + 1
    while _extent_consistent(ext, r, ref, staff_extent, nrows):
        members.append(r)
        r += 1
    return sorted(members)


def remove_lines_safe(img, s, staves, page=None):
    """Staff-line removal with SYMBOL PRESERVATION (classical OMR; oemer's stage
    without the learned mask).

    Three conditions must ALL hold before a pixel is deleted as staff line:
      (a) it survives a horizontal opening (it lies in a long horizontal run);
      (b) its ROW is one of the rows of a DETECTED staff line;
      (c) the VERTICAL ink run through it is no thicker than about twice the
          measured staff-line thickness.
    Condition (c) is the one that saves beams and noteheads: a beam is 0.5 of a
    staff space thick (Gould, Behind Bars p. 17), roughly 3 to 4 times a staff
    line, so it is preserved even where it crosses or sits on a line. The old
    stage had only (a), which is why an 82 px beam was deleted by a 35 px kernel.
    """
    bw = (img < 128).astype(np.uint8)
    # N.59, E.58. The invariant asserted where it is CONSUMED, not only where it
    # is produced. `int()` on a non-finite float raises ValueError four frames
    # away from the cause, which is how a NaN staff space presented itself as
    # "cannot convert float NaN to integer" and told nobody what had happened.
    # detect_staves guards this upstream; a reader that arrives here anyway is a
    # bug either way, and it says so in its own words.
    if not np.isfinite(s) or s <= 0:
        raise ValueError(
            "remove_lines_safe: staff space must be finite and positive, got %r" % (s,))
    hk = cv2.getStructuringElement(cv2.MORPH_RECT, (int(1.7 * s), 1))
    opened = cv2.morphologyEx(bw, cv2.MORPH_OPEN, hk)

    # THE BAND WALK, S1 to S6, ratified 2026-07-28. Replaces the literal
    # `rowfrac > 0.35`, which was a page-relative coverage test: it compared a
    # row's dark fraction to a fixed constant with no reference to the
    # structure the row was claimed to belong to, so it read a narrow system's
    # genuine rule rows and a full-width system's contamination on the same
    # scale. Membership is now C2(b) alone, on the bridged substrate,
    # referenced to the claimed staff's own extent.
    #
    # Concentration is NOT a membership condition. C2's clause (a) was struck
    # 2026-07-28: bridged concentration's keep and discard extremes coincide
    # at 1.0000, so it separates nothing. It survives as the sentinel below,
    # which halts rather than classifies.
    sub = substrate.page_substrate(img)
    ext = sub['extent']
    nrows = sub['nrows']
    allowed = np.zeros(nrows, bool)
    thicknesses = []
    accepted = []
    for st in staves:
        # D4: this value is consumed as a reference frame for every
        # measurement below, so it is itself a measurement and is named.
        # It denotes the extent of the drawn rules of the staff these seed
        # rows are claimed to belong to, taken from detect_staves' VALIDATED
        # output, never from the page and never from the row under test.
        staff_extent = int(max(int(ext[y]) for y in st))
        if staff_extent <= 0:
            raise WalkRaise("walk: staff on page %r has no inked rule rows; "
                            "its extent is undefined" % (page,))
        for y in st:
            seed = _snap_seed(ext, y, staff_extent, s, nrows, page)   # S2
            # S1, seed assertion: a failing seed RAISES. True by construction
            # of the snap; asserted anyway, because a silent change to the
            # snap must not silently invalidate the walk (V2-B).
            if not _extent_consistent(ext, seed, staff_extent, staff_extent,
                                      nrows):
                raise WalkRaise("walk: snapped seed %d on page %r fails "
                                "membership against staff extent %d"
                                % (seed, page, staff_extent))
            members = _walk_band(ext, seed, staff_extent, nrows)  # S3, S4, S5
            allowed[max(0, members[0] - 1):members[-1] + 2] = True
            thicknesses.append(len(members))                      # S6
            accepted.extend(members)
    # The sentinel binds HERE, downstream of the walk's decision and upstream
    # of nothing. Ruled acceptances only.
    substrate.sentinel(sub, accepted, 'beams.remove_lines_safe band walk',
                       page)
    line_t = float(np.median(thicknesses)) if thicknesses else 3.0

    # vertical run length through every ink pixel
    runlen = np.zeros_like(bw, dtype=np.int32)
    up = np.zeros_like(runlen); dn = np.zeros_like(runlen)
    up[0] = bw[0]
    for y in range(1, bw.shape[0]):
        up[y] = (up[y - 1] + 1) * bw[y]
    dn[-1] = bw[-1]
    for y in range(bw.shape[0] - 2, -1, -1):
        dn[y] = (dn[y + 1] + 1) * bw[y]
    runlen = (up + dn - 1) * bw

    thin = runlen <= max(2, int(round(2.2 * line_t)))
    mask = np.zeros_like(opened)
    rows = np.where(allowed)[0]
    mask[rows] = (opened[rows] & thin[rows])

    nl = cv2.subtract(bw, mask)
    nl = cv2.morphologyEx(nl, cv2.MORPH_CLOSE,
                          cv2.getStructuringElement(cv2.MORPH_RECT, (1, 3)))
    return bw, nl


def detect_beam_bars(nl, s):
    """Horizontal bars that are beams. Returns list of dicts with bbox."""
    hk = cv2.getStructuringElement(cv2.MORPH_RECT, (int(BEAM_KERNEL_W * s) | 1, 1))
    bars = cv2.morphologyEx(nl, cv2.MORPH_OPEN, hk)
    n, lab, stats, cent = cv2.connectedComponentsWithStats(bars, 8)
    out = []
    for i in range(1, n):
        x, y, w, h, a = stats[i]
        if w < BEAM_MIN_W * s:            continue
        if h < BEAM_MIN_THICK * s:        continue
        if w > BEAM_MAX_W * s:            continue   # too wide to be a beam group
        if w / max(1, h) < 2.0:           continue   # a beam is much wider than thick
        nstacked = max(1, int(round(h / (0.75 * s))))  # 0.5 thick + 0.25 gap per extra bar
        out.append(dict(x0=int(x), x1=int(x + w), y0=int(y), y1=int(y + h),
                        w=int(w), h=int(h), stacked=nstacked))
    return out


def find_stem(nl, hx, hy, s):
    """Locate the stem attached to a notehead. Returns (stem_x, direction, end_y) or None.
    direction = -1 for an up-stem (stem rises), +1 for a down-stem."""
    H, W = nl.shape
    best = None
    for sign, (a, b) in ((+1, STEM_SEARCH), (-1, STEM_SEARCH)):
        for dx in range(int(a * s), int(b * s) + 1):
            x = hx + sign * dx
            if not (0 <= x < W): continue
            col = nl[:, x]
            # up-stem: run upward from the head; down-stem: run downward
            for updown in (-1, +1):
                y = hy; run = 0
                while 0 <= y < H and col[y] > 0:
                    y += updown; run += 1
                    if run > 6 * s: break
                if run >= STEM_MIN_LEN * s:
                    cand = (run, int(x), updown, int(y))
                    if best is None or cand[0] > best[0]: best = cand
    if best is None: return None
    run, x, updown, endy = best
    return dict(x=x, dir=updown, end_y=endy, length=run)


def beams_on_stem(stem, bars, s):
    """How many beam bars cross this stem, counting stacked bars inside one component."""
    if stem is None: return 0
    x = stem['x']; ey = stem['end_y']
    n = 0
    for b in bars:
        if not (b['x0'] - 2 <= x <= b['x1'] + 2): continue
        # the beam sits at the far end of the stem
        if abs((b['y0'] + b['y1']) / 2 - ey) > 2.2 * s: continue
        n += b['stacked']
    return n


def read_beams(img, s, staves, heads, page=None):
    """Full beam read for a page. Returns per-head beam counts plus the bars found."""
    bw, nl = remove_lines_safe(img, s, staves, page)
    bars = detect_beam_bars(nl, s)
    out = []
    for h in heads:
        st = find_stem(nl, h['x'], h['y'], s)
        nb = beams_on_stem(st, bars, s)
        out.append(dict(x=h['x'], y=h['y'], sys=h.get('sys'), nbeams=nb,
                        stem_x=(st['x'] if st else None),
                        stem_dir=(st['dir'] if st else None)))
    return out, bars, nl
