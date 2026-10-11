"""Row 57 r5 decoder. Round 4's rules (decode.py), split in two so tuning is fast:

1. `candidates(P, xs)`: from one reading's probabilities, every candidate signature with what the thresholds
   need: its label (or '?' where logic says no answer at any cut), the least confident of its marks, how far its
   numbers stand off centre, and its marks (seat, index, class, confidence, refined place).
2. `state(cands, cut, centre)`: the window's one statement for that reading, or None. A candidate below the cut
   or off centre becomes unsure; any unsure candidate within 3 spaces of the answer, or a second answer, states
   nothing (round 4's rule).
"""
import numpy as np
LOWER_OK = {1, 2, 4, 8, 16, 32}
PRES, GAP, NEAR = 0.3, 0.8, 0.45
STEP = 0.2


def peaks(p, cls):
    pres = p[:, cls].astype(np.float32).sum(1); sub = p[:, cls].astype(np.float32); arg = np.array(cls)[sub.argmax(1)]
    out = []
    for i in np.argsort(-pres):
        if pres[i] < PRES: break
        clash = False
        for j, *_ in out:
            dd = abs(i - j) * STEP
            if dd < NEAR: clash = True; break
            if dd < GAP:
                a, b = sorted((i, j))
                if pres[a:b + 1].min() >= 0.6 * min(pres[i], pres[j]): clash = True; break
        if clash: continue
        out.append((int(i), int(arg[i]), float(sub[i].max())))
    ref = []
    for i, c, q in out:
        a, b = max(0, i - 2), min(len(pres), i + 3); w = pres[a:b]
        ref.append((i, c, q, float((np.arange(a, b) * w).sum() / w.sum())))
    return sorted(ref)


def group(pk):
    gs = []
    for q in pk:
        if gs and (q[0] - gs[-1][-1][0]) * STEP <= 1.6: gs[-1].append(q)
        else: gs.append([q])
    return gs


def candidates(P, xs):
    """P (N,3,13) float16; xs (N,) places in spaces. Candidates: dict(lab, x, conf, off, marks)."""
    up = peaks(P[:, 0], list(range(10))); lo = peaks(P[:, 2], list(range(10))); mid = peaks(P[:, 1], [10, 11])
    out = []; used_u = set()
    for gl in group(lo):
        xl0, xl1 = gl[0][0], gl[-1][0]
        gu = group([q for q in up if xl0 - 1.3 / STEP <= q[0] <= xl1 + 1.3 / STEP])
        if len(gu) != 1:
            out.append(dict(lab='?', x=float(xs[xl0]), conf=0.0, off=0.0, marks=[])); continue
        gu = gu[0]; used_u.update(q[0] for q in gu)
        top = int(''.join(str(q[1]) for q in gu)); bot = int(''.join(str(q[1]) for q in gl))
        logic = top >= 1 and bot in LOWER_OK and len(gu) <= 2 and len(gl) <= 2
        off = abs(np.mean([q[3] for q in gu]) - np.mean([q[3] for q in gl])) * STEP
        marks = [(0, q[0], q[1], q[2], q[3]) for q in gu] + [(2, q[0], q[1], q[2], q[3]) for q in gl]
        out.append(dict(lab='%d/%d' % (top, bot) if logic else '?', x=float(xs[xl0]), conf=min(q[2] for q in gu + gl), off=float(off), marks=marks))
    for q in up:
        if q[0] not in used_u: out.append(dict(lab='?', x=float(xs[q[0]]), conf=0.0, off=0.0, marks=[]))
    for q in mid:
        if any(abs(u[0] - q[0]) * STEP < 1.0 for u in up + lo): continue
        out.append(dict(lab='C' if q[1] == 10 else 'cut', x=float(xs[q[0]]), conf=q[2], off=0.0, marks=[(1, q[0], q[1], q[2], q[3])]))
    return out


def state(cands, cut, centre):
    good = []; unsure = []
    for c in cands:
        if c['lab'] != '?' and c['conf'] >= cut and c['off'] <= centre: good.append(c)
        else: unsure.append(c)
    if len(good) != 1: return None
    g = good[0]
    if any(abs(u['x'] - g['x']) < 3 for u in unsure): return None
    return g
