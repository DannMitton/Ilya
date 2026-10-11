import json, torch, numpy as np, pickle
from model import Net
from runwin import window_probs, STEP
from decode import signatures, peaks
from pages import ALLST
from voices import voices
net = Net().to('mps'); net.load_state_dict(torch.load('boot.pt')); net.eval()
W = json.load(open('windows.json')); lab = json.load(open('labels.json'))
def figs_in(w, label):
    xs, P = window_probs(net, w)
    s = signatures(P, STEP, 0.5)
    lt = label[1:] if label.startswith('c') and label != 'cut' else label
    good = [q for q in s if q[0] == lt]
    if len(good) != 1: return None
    x_i = good[0][1]
    out = []
    if lt in ('C', 'cut'):
        out.append((float(xs[x_i]), 2, lt))
    else:
        for seat, si in [(1, 0), (3, 2)]:
            for q in peaks(P[:, si], STEP, list(range(10)), 0.5):
                if abs(q[0] - x_i) * STEP <= 2.0: out.append((float(xs[q[0]]), seat, str(q[1])))
    return out
POS = []   # (song, page, staff, x, seat, class, source)
for k, l in lab.items():
    w = W[int(k)]
    f = figs_in(w, l)
    if f is None: print('voice miss', k); continue
    for x, seat, c in f: POS.append((w['song'], w['page'], w['staff'], x, seat, c, 'voice', int(k)))
    # the piano staves of the same system, at the same place
    vs = voices(w['page'], len(ALLST[w['page']]))
    j = vs.index(w['staff']); nxt = vs[j + 1] if j + 1 < len(vs) else len(ALLST[w['page']])
    for ps in range(w['staff'] + 1, nxt):
        st = ALLST[w['page']][ps]
        w2 = dict(w, staff=ps, space=st['space'])
        f2 = figs_in(w2, l)
        if f2 is None: print('piano miss', k, ps); continue
        for x, seat, c in f2: POS.append((w['song'], w['page'], ps, x, seat, c, 'piano', int(k)))
json.dump(POS, open('positives.json', 'w'))
from collections import Counter
print(len(POS), Counter(p[5] for p in POS), Counter(p[6] for p in POS))
