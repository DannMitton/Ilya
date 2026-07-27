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

BEAM_KERNEL_W   = 1.8   # in staff spaces: wider than a flag (measured 1.29 s)
BEAM_MIN_W      = 2.2   # a beam joins two stems, which sit >= 2 staff spaces apart
BEAM_MIN_THICK  = 0.30  # Gould: 0.5*s nominal; accept down to 0.30 for binarization loss
BEAM_MAX_THICK  = 0.95  # a single bar; anything fatter is two merged, handled by splitting
BEAM_MAX_W      = 12.0  # a vocal beam group does not span more than this many staff spaces
STEM_SEARCH     = (0.35, 1.05)   # staff spaces either side of the head centre
STEM_MIN_LEN    = 1.8            # a real stem runs at least this far


def remove_lines_safe(img, s, staves):
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
    hk = cv2.getStructuringElement(cv2.MORPH_RECT, (int(1.7 * s), 1))
    opened = cv2.morphologyEx(bw, cv2.MORPH_OPEN, hk)

    rowfrac = bw.mean(axis=1)
    allowed = np.zeros(img.shape[0], bool)
    thicknesses = []
    for st in staves:
        for y in st:
            lo = y
            while lo > 0 and rowfrac[lo - 1] > 0.35: lo -= 1
            hi = y
            while hi < len(rowfrac) - 1 and rowfrac[hi + 1] > 0.35: hi += 1
            allowed[max(0, lo - 1):hi + 2] = True
            thicknesses.append(hi - lo + 1)
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


def read_beams(img, s, staves, heads):
    """Full beam read for a page. Returns per-head beam counts plus the bars found."""
    bw, nl = remove_lines_safe(img, s, staves)
    bars = detect_beam_bars(nl, s)
    out = []
    for h in heads:
        st = find_stem(nl, h['x'], h['y'], s)
        nb = beams_on_stem(st, bars, s)
        out.append(dict(x=h['x'], y=h['y'], sys=h.get('sys'), nbeams=nb,
                        stem_x=(st['x'] if st else None),
                        stem_dir=(st['dir'] if st else None)))
    return out, bars, nl
