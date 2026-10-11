"""From per-column seat probabilities to a stated signature, or nothing."""
import numpy as np
LOWER_OK = {1, 2, 4, 8, 16, 32}

def peaks(p, step, cls, cut):
    """p: (N,13) probs at one seat. Peaks of max prob over classes cls, >= cut, at least 0.8 space apart."""
    sc = p[:, cls].max(1); arg = np.array(cls)[p[:, cls].argmax(1)]
    out = []
    order = np.argsort(-sc)
    taken = np.zeros(len(sc), bool)
    gap = int(round(0.8 / step))
    for i in order:
        if sc[i] < cut: break
        if taken[max(0, i - gap):i + gap + 1].any(): continue
        taken[i] = True
        out.append((i, int(arg[i]), float(sc[i])))
    return sorted(out)

def signatures(P, step, cut):
    """P: (N,3,13) at seats upper, middle, lower; step in spaces. Returns list of (label, x index, conf)."""
    digits = list(range(10))
    up = peaks(P[:, 0], step, digits, cut); lo = peaks(P[:, 2], step, digits, cut)
    mid = peaks(P[:, 1], step, [10, 11], cut)
    sigs = []
    used_u = set()
    # group lower figures into numbers (adjacent within 1.6 spaces)
    def group(pk):
        gs = []
        for q in pk:
            if gs and (q[0] - gs[-1][-1][0]) * step <= 1.6: gs[-1].append(q)
            else: gs.append([q])
        return gs
    for gl in group(lo):
        xl0, xl1 = gl[0][0], gl[-1][0]
        cand = [q for q in up if xl0 - 1.3 / step <= q[0] <= xl1 + 1.3 / step]
        gu = group(cand)
        if len(gu) != 1: 
            if gu: sigs.append(('?', xl0, 0.0))
            continue
        gu = gu[0]
        top = int(''.join(str(q[1]) for q in gu)); bot = int(''.join(str(q[1]) for q in gl))
        conf = min(q[2] for q in gu + gl)
        lab = '%d/%d' % (top, bot) if (top >= 1 and bot in LOWER_OK and len(gu) <= 2 and len(gl) <= 2) else '?'
        sigs.append((lab, xl0, conf))
        used_u.update(q[0] for q in gu)
    for q in up:
        if q[0] not in used_u: sigs.append(('?', q[0], 0.0))   # an upper figure with no lower: no answer
    for q in mid:
        near = [s for s in sigs if abs(s[1] - q[0]) * step < 1.2]
        if near: continue
        if any(abs(u[0] - q[0]) * step < 1.0 for u in up + lo): continue
        sigs.append(('C' if q[1] == 10 else 'cut', q[0], q[2]))
    return sigs

def state(sigs):
    """One stated signature for a window, or None. Anything unsure, or two answers, states nothing."""
    good = [s for s in sigs if s[0] != '?']
    if len(sigs) != 1 or len(good) != 1: return None
    return good[0]
