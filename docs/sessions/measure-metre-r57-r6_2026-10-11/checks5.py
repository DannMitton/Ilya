"""Row 57 r5: the three cheaper checks of brief section 2.2, measured on network A's image (10 px a space).

- Unfamiliar shape: a mark's penultimate features, the mean distance to the 5 nearest training crops of its
  class. A statement is void where any of its marks lies farther than the fold's threshold.
- Uncovered ink: in the upper and lower seat rows, staff-line rows left out, the ink that runs on from the
  stated marks' own ink, without a gap of a quarter space, within 1.6 spaces either side. Where that run is
  heavy in one seat and nearly empty in the other, a figure has been lost or added on that side.
- C against cut C: ink in a narrow column through the sign's middle, just above the top line and just below
  the bottom line, where only cut C's stroke reaches.
"""
import numpy as np, torch

def nn_dist(F, C, f, c, k=5):
    R = F[C == c].astype(np.float32)
    if len(R) == 0: return np.inf
    d = np.sqrt(((R - f.astype(np.float32)[None]) ** 2).sum(1))
    return float(np.sort(d)[:k].mean())

def mark_x(xs, ref):
    return float(np.interp(ref, np.arange(len(xs)), xs))

def profiles(img, L, x0, x1):
    """Column ink of the upper and lower seat rows over [x0, x1) pixels, line rows left out, in parts of a seat."""
    ink = img < 128
    H, W = img.shape
    a, b = max(0, int(x0)), min(W, int(x1))
    if b <= a: return np.zeros(0), np.zeros(0), a
    def rows(t, u):
        r = [y for y in range(int(np.ceil(t)), int(np.floor(u)) + 1) if 0 <= y < H and min(abs(y - l) for l in L) > 1.2]
        return r
    ru, rl = rows(L[0], L[2]), rows(L[2], L[4])
    pu = ink[ru, a:b].mean(0) if ru else np.zeros(b - a)
    pl = ink[rl, a:b].mean(0) if rl else np.zeros(b - a)
    return pu, pl, a

def uncovered(img, Lfun, xs, marks, sp=10):
    """(left, right) runs of uncovered ink, each (upper, lower) in spaces of full-seat ink."""
    xm = [mark_x(xs, m[4]) * sp for m in marks if m[0] in (0, 2)]
    if not xm: return None
    c = float(np.mean(xm)); L = Lfun(c / sp)
    lo, hi = min(xm) - 2.6 * sp, max(xm) + 2.6 * sp
    pu, pl, a = profiles(img, L, lo, hi)
    both = np.maximum(pu, pl)
    # the stated marks' own ink: from each centre outward while there is ink (gaps of 1 px allowed)
    cov = np.zeros(len(both), bool)
    for x in xm:
        i0 = int(round(x - a))
        for step in (-1, 1):
            i, miss = i0, 0
            while 0 <= i < len(both) and abs(i - i0) <= 1.2 * sp:
                if both[i] > 0.02: cov[i] = True; miss = 0
                else:
                    miss += 1
                    if miss > 1: break
                i += step
    if not cov.any(): return None
    s0, s1 = np.where(cov)[0][[0, -1]]
    res = []
    for side, start, step in (('L', s0 - 1, -1), ('R', s1 + 1, 1)):
        m = []
        for p in (pu, pl):
            tot, gap, i = 0.0, 0, start
            while 0 <= i < len(p) and abs(i - start) <= 1.6 * sp:
                if p[i] > 0.02: tot += p[i]; gap = 0
                else:
                    gap += 1
                    if gap >= 0.25 * sp: break
                i += step
            m.append(tot / sp)
        res.append(tuple(m))
    return res

def uncovered_void(unc, tau):
    if unc is None or tau is None: return False
    for mu, ml in unc:
        if max(mu, ml) >= tau and min(mu, ml) < tau / 3: return True
    return False

def cut_ratio(img, Lfun, xs, mark, sp=10):
    x = mark_x(xs, mark[4]) * sp; L = Lfun(x / sp)
    ink = img < 128; H, W = img.shape
    a, b = max(0, int(x - 1.5)), min(W, int(x + 2.5))
    up = ink[max(0, int(L[0] - 7)):max(0, int(L[0] - 2)), a:b]; dn = ink[min(H, int(L[4] + 3)):min(H, int(L[4] + 8)), a:b]
    vals = [v.mean() for v in (up, dn) if v.size]
    return float(np.mean(vals)) if vals else 0.0
