"""Staves, systems, and barlines on a page image (row 57 r4 harness)."""
import numpy as np
from PIL import Image

INK = 140


def load(path):
    g = np.asarray(Image.open(path).convert('L'), dtype=np.uint8)
    return g


def _line_rows(ink_strip, frac):
    prof = ink_strip.mean(axis=1)
    on = prof >= frac
    rows = []
    y = 0
    n = len(on)
    while y < n:
        if on[y]:
            e = y
            while e < n and on[e]:
                e += 1
            rows.append(((y + e - 1) / 2, e - y))
            y = e
        else:
            y += 1
    return rows


def _fives(rows):
    out = []
    used = set()
    for i in range(len(rows) - 4):
        if i in used:
            continue
        c = [rows[i + k][0] for k in range(5)]
        g = np.diff(c)
        s = g.mean()
        if s < 8 or s > 60:
            continue
        if np.all(np.abs(g - s) <= 0.18 * s):
            th = max(rows[i + k][1] for k in range(5))
            if th > 0.45 * s:
                continue
            out.append((c, s, th))
            used.update(range(i, i + 5))
    return out


def find_staves(g, strip=None, frac=0.5):
    """Staves as lists of samples (x centre, five line heights), linked across strips."""
    ink = g < INK
    H, W = g.shape
    if strip is None:
        sp = []
        for x0 in range(W // 4, 3 * W // 4, W // 10):
            sp += [s for _, s, _ in _fives(_line_rows(ink[:, x0:x0 + W // 12], 0.5))]
        strip = int(14 * float(np.median(sp))) if sp else 240
    per = []
    for x0 in range(0, W - strip // 2, strip // 2):
        x1 = min(W, x0 + strip)
        for c, s, th in _fives(_line_rows(ink[:, x0:x1], frac)):
            per.append(((x0 + x1) / 2, c, s, th))
    staves = []
    for xc, c, s, th in sorted(per, key=lambda p: p[0]):
        best = None
        for st in staves:
            lx, lc, ls, _ = st['samples'][-1]
            if abs(lc[0] - c[0]) < 1.2 * s and abs(ls - s) < 0.2 * s and xc - lx <= 3 * strip:
                best = st
                break
        if best is None:
            staves.append({'samples': [(xc, c, s, th)]})
        else:
            best['samples'].append((xc, c, s, th))
    staves = [st for st in staves if len(st['samples']) >= 4]
    for st in staves:
        sm = st['samples']
        st['space'] = float(np.median([p[2] for p in sm]))
        st['thick'] = float(np.median([p[3] for p in sm]))
        st['xs'] = np.array([p[0] for p in sm])
        st['ls'] = np.array([p[1] for p in sm])
        _extent(st, ink)
    staves.sort(key=lambda st: st['ls'][:, 0].mean())
    return staves


def lines_at(st, x):
    """The five line heights at column x, interpolated."""
    xs, ls = st['xs'], st['ls']
    return np.array([np.interp(x, xs, ls[:, k]) for k in range(5)])


def _extent(st, ink):
    """Left and right ends of the staff lines: where all five lines stop being ink."""
    H, W = ink.shape
    sp = st['space']

    def lines_ok(x):
        L = lines_at(st, x)
        hit = 0
        for y in L:
            yi = int(round(y))
            if 0 <= yi < H and ink[max(0, yi - 1):yi + 2, x].any():
                hit += 1
        return hit >= 5

    x = int(st['xs'][0])
    miss = 0
    left = x
    while x > 0:
        x -= 1
        if lines_ok(x):
            left = x
            miss = 0
        else:
            miss += 1
            if miss > 0.6 * sp:
                break
    x = int(st['xs'][-1])
    miss = 0
    right = x
    while x < W - 1:
        x += 1
        if lines_ok(x):
            right = x
            miss = 0
        else:
            miss += 1
            if miss > 0.6 * sp:
                break
    st['x0'], st['x1'] = left, right


def barlines(g, st, min_frac=0.97):
    """Thin vertical strokes from the top line to the bottom line, with no notehead at either end."""
    ink = g < INK
    H, W = g.shape
    sp = st['space']
    cols = []
    for x in range(st['x0'], st['x1'] + 1):
        L = lines_at(st, x)
        t, b = int(round(L[0])), int(round(L[4]))
        col = ink[t:b + 1, x]
        if col.mean() >= min_frac:
            cols.append(x)
    runs = []
    for x in cols:
        if runs and x - runs[-1][1] <= 1:
            runs[-1][1] = x
        else:
            runs.append([x, x])
    out = []
    for a, b in runs:
        w = b - a + 1
        if w > 1.2 * sp:
            continue  # a block, not a barline (a heavy barline is up to about a space)
        xc = (a + b) // 2
        L = lines_at(st, xc)
        t, bo = L[0], L[4]
        # A stem goes past a line or carries a notehead at an end; a barline stops at the staff.
        above = ink[int(t - 0.9 * sp):int(t - 0.25 * sp), a:b + 1].mean() if t - sp > 0 else 0
        below = ink[int(bo + 0.25 * sp):int(bo + 0.9 * sp), a:b + 1].mean() if bo + sp < H else 0
        # notehead beside an end of the stroke
        def head(y):
            y0, y1 = int(y - 0.5 * sp), int(y + 0.5 * sp)
            l = ink[y0:y1, max(0, a - int(1.2 * sp)):a - 1].mean()
            r = ink[y0:y1, b + 2:b + int(1.2 * sp)].mean()
            return max(l, r)
        out.append({'x0': a, 'x1': b, 'w': w, 'sp': sp, 'above': float(above), 'below': float(below),
                    'headTop': float(head(t)), 'headBot': float(head(bo))})
    return out


def clean_staves(sts):
    """Merge fragments at one height, drop ossia staves (much smaller space)."""
    if not sts:
        return sts
    med = float(np.median([s['space'] for s in sts]))
    sts = [s for s in sts if s['space'] > 0.8 * med]
    out = []
    for s in sorted(sts, key=lambda s: s['ls'][:, 0].mean()):
        if out and abs(out[-1]['ls'][:, 0].mean() - s['ls'][:, 0].mean()) < 1.5 * med:
            o = out[-1]
            xs = np.concatenate([o['xs'], s['xs']]); ls = np.concatenate([o['ls'], s['ls']])
            k = np.argsort(xs); o['xs'], o['ls'] = xs[k], ls[k]
            o['x0'], o['x1'] = min(o['x0'], s['x0']), max(o['x1'], s['x1'])
        else:
            out.append(s)
    return out


def isbar(b):
    heavy = b['w'] >= 0.35 * b['sp']   # a stem is never this thick
    return b['above'] < 0.25 and b['below'] < 0.25 and (heavy or (b['headTop'] < 0.3 and b['headBot'] < 0.3))
