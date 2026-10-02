"""A note's length is read from its shape (QUEUE row 23, brief r2, 2026-10-02).

WHAT THIS REPLACES. For a filled head with a stem, `run_page2.run` read the
length from the AREA of the head's connected component against two thresholds
(and from `beams_on_stem`), and a dot from `_has_dot`. Measured on the five
build songs (the Tchaikovsky and *Sunless* 1, 4, 5, 6), 697 matched notes: the
area of a quarter and the area of an eighth overlap on every song, so the
reader gave 21, 52, 118, 70, and 128 wrong lengths, and read 173 plain notes
as dotted against 69 printed dots. The desk ruled (a DESK DEFAULT) that a
note's length is read from its shape: its stem, the stroke that leaves the
stem at its far end (a flag, or a beam), and a dot in the space to its right.
The area of the ink is not a measure of length.

THE RULE (every number is in staff spaces, `s`, unless it says pixels):

  1. THE STEM. The stem is followed from the head to its far end with white
     breaks of up to 0.3 s bridged (row 21's rule). A stem shorter than
     STEM_MIN is not read here: the note keeps the older reading.
  2. THE STROKE AS A PATH. The ink of the stem's own components, beside the
     stem on each side, from 0.12 s clear of the stem's edge to RW_S further
     out, from 0.6 s past the tip to the head's end less 0.8 s. Each staff
     line's band is set aside (it carries the line's own residue across the
     page) and put back in a column only where the stroke has ink on both
     sides of it, so a flag cut where it crosses a line is still one stroke.
     The stroke is the connected component that touches the clear column near
     the tip. Its REACH is how far it runs from the stem; its TRAVEL (`tmax`)
     is how far it runs back toward the head; it RUNS ON when it reaches the
     outer limit. The side that carries more ink is the stroke's side.
  3. THE CLASS.
       reach <= Q_MAX                         no stroke: a quarter.
       Q_MAX < reach < F_MIN                  inside the margin: abstains.
       F_MIN <= reach < OUT, travel >= TRAVEL_MIN
                                              a flag. Its strokes are counted at
                                              the cuts 0.25, 0.45, 0.65, 0.85 s
                                              from the stem, runs that start
                                              between -0.4 and 2.0 s of the
                                              tip. All cuts show one: an eighth.
                                              Two at two cuts: a sixteenth.
                                              Anything else abstains.
       a flag with travel < TRAVEL_MIN        abstains.
       reach >= OUT (the stroke runs on)      a beam if the bar is at least
                                              BEAM_THICK thick at the cuts 0.85
                                              and 1.05 s; a bump on a line (no
                                              thicker than BUMP_MAX) or any other
                                              ink (a slur, a tie, a dynamic's
                                              letter) abstains.
  4. THE DOT. Each component `_has_dot` accepts is tested against five bounds:
     the centre is at least D_LINE s from a staff line; the area is at least
     D_AREA s^2 (as the width of a disc, in pixels); the shorter side over the
     longer is at least D_ASPECT; the distance from the head's centre is at
     least D_DX s; the vertical offset from the head's row is at most D_DY s.
     A component that fails any bound by more than the margin (M_PX pixels, or
     M_ASPECT for the aspect) is not a dot. One that passes every bound by more
     than the margin is a dot. One that is within the margin of a bound and
     fails none beyond it makes the note's length abstain.

THE MEASURES, and the gaps they sit in, are in
`docs/sessions/report-code-length-is-read-from-shape_r1_2026-10-02.md`, "Build
against brief r2". They were taken on the five build songs and no others.
Every bound below sits in the gap between the printed classes on those songs,
on each page's own staff space.
"""
import math
import cv2, numpy as np
from fractions import Fraction
from beams import find_stem

STEM_MIN   = 2.6    # bridged stem length, s: shorter, the note is not read here
RW_S       = 1.7    # how far from the stem the stroke is followed
CLEAR_S    = 0.12   # the column beside the stem that is left out (the stem's own edge)
Q_MAX      = 0.07   # reach at most this: no stroke (quarter)
F_MIN      = 0.55   # reach at least this: a stroke
TRAVEL_MIN = 1.0    # a flag runs back toward the head at least this far
OUT        = 1.5    # reach at least this: the stroke runs on
BEAM_THICK = 0.38   # a beam bar is at least this thick (s) at the cuts 0.85 and 1.05
BUMP_MAX   = 0.25   # ink that runs on and is no thicker than this is a bump on a line
CUTS       = (0.25, 0.45, 0.65, 0.85, 1.05)
COUNT_CUTS = (0.25, 0.45, 0.65, 0.85)
COUNT_TLO, COUNT_THI = -0.4, 2.0

D_LINE   = 0.15     # dot: centre at least this far from a staff line, s
D_AREA   = 0.082    # dot: area at least this, s^2
D_ASPECT = 0.60     # dot: short side over long side at least this
D_DX     = 1.02     # dot: distance from the head's centre at least this, s
D_DY     = 0.45     # dot: vertical offset from the head's row at most this, s
M_PX     = 1.5      # margin of every dot bound, pixels
M_ASPECT = 0.05     # margin of the aspect bound

def _bridge(mask, lines, lt, c0, c1, a, b):
    out = mask.copy(); hb = lt / 2.0 + 1.5
    H = mask.shape[0]
    cols = list(range(max(2, c0), a)) + list(range(b + 1, min(mask.shape[1] - 2, c1)))
    for y in lines:
        ya = int(round(y - hb)); yb = int(round(y + hb))
        if ya < 2 or yb >= H - 2: continue
        out[ya:yb + 1, c0:a] = 0; out[ya:yb + 1, b + 1:c1] = 0
        for c in cols:
            above = mask[ya - 1, c - 2:c + 3].any(); below = mask[yb + 1, c - 2:c + 3].any()
            if above and below: out[ya:yb + 1, c] = mask[ya:yb + 1, c] | 1
    return out

def _side(mb, tip, d, a, b, s, side, length_b):
    H, W = mb.shape
    tlo = -0.6; thi = min(3.6, length_b - 0.8)
    rows = [tip - d * int(t * s) for t in (tlo, thi)]
    r0, r1 = max(0, min(rows)), min(H - 1, max(rows))
    RW = int(RW_S * s); g0 = max(2, int(round(CLEAR_S * s)))
    if side > 0: c0 = b + 1 + g0; c1 = min(W, b + 1 + g0 + RW)
    else: c1 = a - g0; c0 = max(0, a - g0 - RW)
    if c1 <= c0 or r1 <= r0: return None
    sub = mb[r0:r1 + 1, c0:c1].astype(np.uint8)
    n, lab, st, cent = cv2.connectedComponentsWithStats(sub, 8)
    comps = []; keep = []
    for i in range(1, n):
        ys, xs = np.where(lab == i)
        off = xs if side > 0 else ((c1 - c0 - 1) - xs)
        adj = (off == 0)
        if not adj.any(): continue
        rr = r0 + ys
        t = (tip - rr) * d / s
        if not ((t[adj] >= -0.6) & (t[adj] <= 1.2)).any(): continue
        comps.append(dict(area=len(xs) / (s * s), reach=(off.max() + 1) / s, tmin=float(t.min()), tmax=float(t.max()),
                          runs_out=bool(off.max() >= RW - 2)))
        keep.append(i)
    um = np.isin(lab, keep) if keep else np.zeros_like(sub, bool)
    cuts = {}
    for o in CUTS:
        col = int(round(o * s)); cc = col if side > 0 else (c1 - c0 - 1 - col)
        runs = []
        if 0 <= cc < um.shape[1]:
            c = um[:, cc]; st_ = None
            for k, v in enumerate(c):
                if v and st_ is None: st_ = k
                if not v and st_ is not None: runs.append((st_, k - 1)); st_ = None
            if st_ is not None: runs.append((st_, len(c) - 1))
        cuts[o] = [((tip - (r0 + ra)) * d / s, (rb - ra + 1) / s) for ra, rb in runs]
    return dict(comps=comps, cuts=cuts)

def read_stroke(nl, lab, stats, x, y, lines, s, lt):
    """The stroke at the far end of the stem of the head at (x, y): ('none'|'flag'|'beam'|'abstain', count, reason),
    or None where the stem is too short to be read here."""
    H, W = nl.shape
    st = find_stem(nl, x, y, s)
    if st is None: return None
    d = st['dir']; xs = st['x']
    last = y; white = 0; g_ = int(round(0.3 * s))
    for k in range(int(6 * s)):
        y_ = y + d * k
        if not (0 <= y_ < H): break
        if nl[y_, xs] > 0: last = y_; white = 0
        else:
            white += 1
            if white > g_: break
    tip = last; length_b = abs(last - y) / s
    if length_b < STEM_MIN: return None
    best = None
    for k in range(int(1.0 * s), max(int(1.0 * s) + 1, int(length_b * s - 0.3 * s))):
        yy = y + d * k
        if not (0 <= yy < H) or nl[yy, xs] == 0: continue
        a = xs
        while a > 0 and nl[yy, a - 1] > 0: a -= 1
        b = xs
        while b < W - 1 and nl[yy, b + 1] > 0: b += 1
        if best is None or (b - a + 1) < (best[1] - best[0] + 1): best = (a, b)
    if best is None: return None
    a, b = best
    labs = {int(lab[min(max(y + d * k, 0), H - 1), xs]) for k in range(int(length_b * s) + 1)}
    labs.discard(0)
    # Work in a window around the stem: the same arithmetic, in window coordinates (faster than the whole page).
    wr0 = max(0, min(y, tip) - int(1.2 * s)); wr1 = min(H, max(y, tip) + int(1.2 * s) + 1)
    wc0 = max(0, a - int(2.6 * s)); wc1 = min(W, b + int(2.6 * s) + 1)
    lab_w = lab[wr0:wr1, wc0:wc1]; nl_w = nl[wr0:wr1, wc0:wc1]
    mask0 = (np.isin(lab_w, list(labs)) & (nl_w > 0)).astype(np.uint8)
    lines_w = [int(v) - wr0 for v in lines]
    mb = _bridge(mask0, lines_w, lt, max(0, a - wc0 - int(2.3 * s)), min(wc1 - wc0, b - wc0 + int(2.3 * s)), a - wc0, b - wc0)
    tip_w = tip - wr0; a_w = a - wc0; b_w = b - wc0
    sides = []
    for sd in (+1, -1):
        r = _side(mb, tip_w, d, a_w, b_w, s, sd, length_b)
        if r is not None: sides.append((sum(c['area'] for c in r['comps']), r))
    if not sides: return ('none', 0, '')
    sides.sort(key=lambda z: -z[0])
    r = sides[0][1]
    if not r['comps']: return ('none', 0, '')
    top = max(r['comps'], key=lambda c: c['area'])
    reach = top['reach']
    if reach <= Q_MAX: return ('none', 0, '')
    cuts = r['cuts']
    if reach >= OUT or top['runs_out']:
        th = [max([t for _, t in cuts[k]], default=0.0) for k in (0.85, 1.05)]
        nr = sorted([len(cuts[k]) for k in (0.85, 1.05)], reverse=True)
        if min(th) >= BEAM_THICK: return ('beam', max(1, nr[-1]) if nr[-1] > 0 else 1, '')
        if max(th) <= BUMP_MAX: return ('abstain', None, 'bump_on_a_line_at_the_stem_tip')
        return ('abstain', None, 'ink_at_the_stem_tip_runs_on')
    if reach < F_MIN: return ('abstain', None, 'stroke_inside_the_margin')
    if top['tmax'] < TRAVEL_MIN: return ('abstain', None, 'stroke_travel_too_short')
    cs = sorted([sum(1 for t0, th in cuts[k] if COUNT_TLO <= t0 <= COUNT_THI) for k in COUNT_CUTS], reverse=True)
    mx, s2 = cs[0], cs[1]
    if mx == 1: return ('flag', 1, '')
    if mx == 2 and s2 == 2: return ('flag', 2, '')
    return ('abstain', None, 'stroke_count_ambiguous')

def dot_status(stats, cent, num, x, y, lines, s):
    """'dot', 'plain', or 'uncertain' for the head at (x, y): each component `_has_dot` accepts against the five bounds."""
    d_ln = float(np.median(np.diff(lines)))
    status = 'plain'
    cxs = cent[:, 0]; cys = cent[:, 1]
    ok = ((stats[:, 4] > 0.3 * s) & (stats[:, 4] < 0.25 * s * s) & (stats[:, 2] <= 0.7 * s) & (stats[:, 3] <= 0.7 * s)
          & (np.abs(stats[:, 2] - stats[:, 3]) <= 0.35 * s) & ((cxs - x) > 0.35 * s) & ((cxs - x) < 2.2 * s) & (np.abs(cys - y) < 0.8 * s))
    ok[0] = False
    for i in np.nonzero(ok)[0]:
        x0, y0, w, hh, area = stats[i]; cx, cy = cent[i]
        pp = (cy - lines[0]) / (d_ln / 2.0); m = pp % 2; dl = min(m, 2 - m) / 2.0
        ws, hs = w / s, hh / s; asp = min(ws, hs) / max(ws, hs)
        eqd = lambda a_: math.sqrt(4 * a_ / math.pi)
        tests = [(dl - D_LINE) * s, (eqd(area / (s * s)) - eqd(D_AREA)) * s, (asp - D_ASPECT) / M_ASPECT * M_PX,
                 (abs((cx - x) / s) - D_DX) * s, (D_DY - abs((cy - y) / s)) * s]
        lo = min(tests)
        if lo < -M_PX: continue
        if lo <= M_PX:
            if status != 'dot': status = 'uncertain'
            continue
        return 'dot'
    return status

def read_length(nl, lab, stats, cent, num, x, y, lines, s, lt):
    """The length of a filled head with a stem, read from its shape: (Fraction or None, abstain reason or None),
    or None where this module does not read the note (no stem, or one shorter than STEM_MIN)."""
    sk = read_stroke(nl, lab, stats, x, y, lines, s, lt)
    if sk is None: return None
    kind, count, why = sk
    if kind == 'abstain': return (None, why)
    if kind == 'none': base = Fraction(1, 4)
    elif count == 1: base = Fraction(1, 8)
    elif count == 2: base = Fraction(1, 16)
    else: return (None, 'stroke_count_ambiguous')
    ds = dot_status(stats, cent, num, x, y, lines, s)
    if ds == 'uncertain': return (None, 'dot_inside_the_margin')
    if ds == 'dot': base = base * Fraction(3, 2)
    return (base, None)
