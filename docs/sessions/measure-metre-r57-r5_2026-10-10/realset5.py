"""The editions' crops for both networks, as round 4's realset.py, from the same positions and labels."""
import json, numpy as np, os
from collections import defaultdict
from pages5 import band, seat_y, ALLST
from crops import crop_norm
from voices import voices
from render import CLASSES
LAB = {c: i for i, c in enumerate(CLASSES)}
W = json.load(open('windows.json')); POS = json.load(open('positives.json')); LABELS = json.load(open('labels.json'))
rng = np.random.default_rng(7)
os.makedirs('../real5', exist_ok=True)
by = defaultdict(lambda: {'A': [], 'B': [], 'Y': []})
figs = defaultdict(list)
for song, page, staff, x, seat, c, src, wid in POS: figs[(page, staff)].append((x, seat))
def add(song, page, staff, x, seat, dy, lab):
    for net, sp, cw in (('A', 10, 32), ('B', 12, 40)):
        b, y0, k = band(page, staff, sp)
        by[song][net].append(crop_norm(b, x * k, seat_y(page, staff, x, seat, sp) + dy * sp, cw))
    by[song]['Y'].append(lab)
for song, page, staff, x, seat, c, src, wid in POS:
    sp = ALLST[page][staff]['space']
    for _ in range(30):
        add(song, page, staff, x + rng.uniform(-0.15, 0.15) * sp, seat, rng.uniform(-0.15, 0.15), LAB[c])
    for q in (1, 2, 3):
        if q == seat or any(abs(x - fx) < 0.6 * sp and fs == q for fx, fs in figs[(page, staff)]): continue
        add(song, page, staff, x, q, 0, LAB['none'])
for w in W:
    page = w['page']; vs = voices(page, len(ALLST[page])); j = vs.index(w['staff'])
    nxt = vs[j + 1] if j + 1 < len(vs) else len(ALLST[page])
    for staff in range(w['staff'], nxt):
        if str(w['id']) in LABELS and not figs[(page, staff)]: continue
        sp = ALLST[page][staff]['space']
        for x in np.arange(w['x0'], w['x1'], 0.2 * sp):
            if any(abs(x - fx) < 1.0 * sp for fx, fs in figs[(page, staff)]): continue
            for seat in (1, 2, 3): add(w['song'], page, staff, x, seat, 0, LAB['none'])
for song, d in by.items():
    np.savez('../real5/%s.npz' % song, A=np.array(d['A'], np.uint8), B=np.array(d['B'], np.uint8), Y=np.array(d['Y'], np.int8))
    print(song, len(d['Y']), int((np.array(d['Y']) != 12).sum()), end='; ')
