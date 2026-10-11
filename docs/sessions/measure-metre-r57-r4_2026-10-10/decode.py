"""From per-column seat probabilities to a stated signature, or nothing.

A mark is present where the model's chance that it is not 'none' passes PRES. Every present mark must
then read as one class above the cut, or the signature it belongs to is no answer. So a figure only
half seen (one digit of 13) never lets the other digit stand as a signature of its own.
"""
import numpy as np
LOWER_OK = {1, 2, 4, 8, 16, 32}
PRES = 0.3
CENTRE = 0.4   # spaces

GAP = 0.8      # spaces: marks nearer than this are one mark ...
NEAR = 0.45    # ... unless they are at least this far apart with a dip between them (a thin 1 beside a figure)

def peaks(p, step, cls):
    """Present marks at one seat: (index, class, class prob)."""
    pres = p[:, cls].sum(1)
    sub = p[:, cls]; arg = np.array(cls)[sub.argmax(1)]
    out = []
    for i in np.argsort(-pres):
        if pres[i] < PRES: break
        clash = False
        for j, _, _ in out:
            d = abs(i - j) * step
            if d < NEAR: clash = True; break
            if d < GAP:
                a, b = sorted((i, j)); dip = pres[a:b + 1].min()
                if dip >= 0.6 * min(pres[i], pres[j]): clash = True; break
        if clash: continue
        out.append((i, int(arg[i]), float(sub[i].max())))
    # each mark's centre to a fraction of a step: the presence-weighted mean over two steps either side
    ref = []
    for i, c, q in out:
        a, b = max(0, i - 2), min(len(pres), i + 3)
        w = pres[a:b]; ref.append((i, c, q, float((np.arange(a, b) * w).sum() / w.sum())))
    return sorted(ref)

def signatures(P, step, cut):
    digits = list(range(10))
    up = peaks(P[:, 0], step, digits); lo = peaks(P[:, 2], step, digits); mid = peaks(P[:, 1], step, [10, 11])
    def group(pk):
        gs = []
        for q in pk:
            if gs and (q[0] - gs[-1][-1][0]) * step <= 1.6: gs[-1].append(q)
            else: gs.append([q])
        return gs
    sigs = []; used_u = set(); used_l = set()
    for gl in group(lo):
        xl0, xl1 = gl[0][0], gl[-1][0]
        gu = group([q for q in up if xl0 - 1.3 / step <= q[0] <= xl1 + 1.3 / step])
        used_l.update(q[0] for q in gl)
        if len(gu) != 1:
            sigs.append(('?', xl0, 0.0)); continue
        gu = gu[0]; used_u.update(q[0] for q in gu)
        conf = min(q[2] for q in gu + gl)
        top = int(''.join(str(q[1]) for q in gu)); bot = int(''.join(str(q[1]) for q in gl))
        # the two numbers stand centred one over the other: a number with a figure lost stands off centre
        centred = abs(np.mean([q[3] for q in gu]) - np.mean([q[3] for q in gl])) * step <= CENTRE
        ok = conf >= cut and centred and top >= 1 and bot in LOWER_OK and len(gu) <= 2 and len(gl) <= 2
        sigs.append(('%d/%d' % (top, bot) if ok else '?', xl0, conf))
    for q in up:
        if q[0] not in used_u: sigs.append(('?', q[0], 0.0))
    for q in mid:
        if any(abs(u[0] - q[0]) * step < 1.0 for u in up + lo): continue
        sigs.append((('C' if q[1] == 10 else 'cut') if q[2] >= cut else '?', q[0], q[2]))
    return sigs

def state(sigs, step=0.2):
    """One stated signature for a window, or None: exactly one answer, and nothing unsure within 3 spaces of it."""
    good = [s for s in sigs if s[0] != '?']
    if len(good) != 1: return None
    g = good[0]
    if any(s[0] == '?' and abs(s[1] - g[1]) * step < 3 for s in sigs): return None
    return g
