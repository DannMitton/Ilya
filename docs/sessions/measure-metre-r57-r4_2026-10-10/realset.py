import json, numpy as np, os
from collections import defaultdict
from pages import crops_at, ALLST, band
from staff import lines_at
from crops import crop_norm
from voices import voices, song_of
from render import CLASSES
LAB = {c: i for i, c in enumerate(CLASSES)}
W = json.load(open('windows.json')); POS = json.load(open('positives.json'))
rng = np.random.default_rng(7)
LABELS = json.load(open('labels.json'))
os.makedirs('real', exist_ok=True)
by = defaultdict(lambda: {'X': [], 'Y': []})
figs = defaultdict(list)   # (page, staff) -> [(x, seat)]
for song, page, staff, x, seat, c, src, wid in POS:
    figs[(page, staff)].append((x, seat))
    b, y0, k = band(page, staff); st = ALLST[page][staff]
    for _ in range(30):
        xx = x + rng.uniform(-0.15, 0.15) * st['space']
        L = lines_at(st, xx); yy = (L[seat] - y0) * k + rng.uniform(-1.5, 1.5)
        by[song]['X'].append(crop_norm(b, xx * k, yy)); by[song]['Y'].append(LAB[c])
    for q in (1, 2, 3):   # the wrong seats, right on the figure
        if q == seat or any(abs(x - fx) < 0.6 * st['space'] and fs == q for fx, fs in figs[(page, staff)]): continue
        L = lines_at(st, x); by[song]['X'].append(crop_norm(b, x * k, (L[q] - y0) * k)); by[song]['Y'].append(LAB['none'])
def far(page, staff, x, seat, sp):
    return not any(abs(x - fx) < 0.6 * sp and fs == seat for fx, fs in figs[(page, staff)])
# every window position on the voice staves, and the same windows on the piano staves of the system
for w in W:
    page = w['page']; vs = voices(page, len(ALLST[page])); j = vs.index(w['staff'])
    nxt = vs[j + 1] if j + 1 < len(vs) else len(ALLST[page])
    for staff in range(w['staff'], nxt):
        st = ALLST[page][staff]; sp = st['space']
        xs = np.arange(w['x0'], w['x1'], 0.2 * sp)
        C = crops_at(page, staff, xs)
        if str(w['id']) in LABELS and not figs[(page, staff)]: continue   # a printed signature not located here: leave the window out
        for i, x in enumerate(xs):
            for si, seat in enumerate((1, 2, 3)):
                if far(page, staff, x, seat, sp) and not any(abs(x - fx) < 1.0 * sp for fx, fs in figs[(page, staff)]):
                    by[w['song']]['X'].append(C[i, si]); by[w['song']]['Y'].append(LAB['none'])
for song, d in by.items():
    X = np.array(d['X'], np.uint8); Y = np.array(d['Y'], np.int8)
    np.savez_compressed('real/%s.npz' % song, X=X, Y=Y)
    print(song, X.shape[0], int((Y != 12).sum()))
