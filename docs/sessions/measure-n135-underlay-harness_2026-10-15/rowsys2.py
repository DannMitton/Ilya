"""N.135 stage 1, the second row rule (R2, MINE, a departure said in the report): row 81's rows (rule R1), each row whose core is taller than 1.6 staff spaces split
at the valleys of its ink profile. R1 merges the Russian row with the row under it (German, a few pixels away) or with the piano's upper reach on most pre-reform songs here.
A valley: the y of the least ink count (dark pixels across the row) between 0.7 space from the top of the core and 0.7 space from its bottom, taken where that count is under 0.45
of the smaller of the two peaks on either side of it; a piece is split again while it is taller than 1.6 spaces, to four pieces at most. Each piece is padded by 0.3 space as R1's rows are.
Usage: python3 rowsys2.py <L> <raster prefix> <cover offset>  -> rows2/<L>.jsonl (page, system, row, core, y0, y1, x0, x1, from = the R1 row id), crops in ~/Downloads/_desk-n135/crops2"""
import sys, json, statistics, os
from PIL import Image
import numpy as np
from common2 import *
L, pref, off = sys.argv[1], sys.argv[2], int(sys.argv[3]); CR = f'{WORK}/crops2'; os.makedirs(CR, exist_ok=True)
ims = {}
def page(p):
    if p not in ims:
        a = np.array(Image.open(f'{pref}-{p + off}.png').convert('L')); paper = np.median(a[::37, ::37]); ims[p] = (a, paper - 60)
    return ims[p]
def split(prof, y0, y1, sp, depth=0):
    """prof: ink count per y over [y0, y1]. Returns the list of (a, z) pieces."""
    h = y1 - y0 + 1
    if h <= 1.6 * sp or depth >= 3: return [(y0, y1)]
    k = np.ones(max(3, int(0.08 * sp)) | 1) / max(3, int(0.08 * sp) | 1); sm = np.convolve(prof[y0:y1 + 1], k, mode='same')
    lo = int(0.7 * sp); hi = h - int(0.7 * sp)
    if hi <= lo: return [(y0, y1)]
    v = lo + int(np.argmin(sm[lo:hi])); left = sm[:v].max() if v else 0; right = sm[v:].max()
    if sm[v] < 0.45 * min(left, right):
        return split(prof, y0, y0 + v, sp, depth + 1) + split(prof, y0 + v + 1, y1, sp, depth + 1)
    return [(y0, y1)]
out = []; n_split = 0
for r in rows(L):
    a, ink = page(r['page']); H, W = a.shape
    prof = np.zeros(H, dtype=int); prof[r['core'][0]:r['core'][1] + 1] = (a[r['core'][0]:r['core'][1] + 1, r['x0']:r['x1']] < ink).sum(axis=1)
    pieces = split(prof, r['core'][0], r['core'][1], r['space'])
    # trim each piece to the ink it holds
    pieces = [(p, q) for p, q in pieces if (prof[p:q + 1] > 0.02 * (r['x1'] - r['x0'])).any()]
    cuts = []
    for p, q in pieces:
        on = np.where(prof[p:q + 1] > 0.02 * (r['x1'] - r['x0']))[0]; cuts.append((p + int(on[0]), p + int(on[-1])))
    if len(cuts) > 1: n_split += 1
    for j, (p, q) in enumerate(cuts):
        out.append(dict(page=r['page'], system=r['system'], core=[p, q], space=r['space'], bars=r['bars'], x0=r['x0'], x1=r['x1'], **{'from': rid(r), 'y0': max(0, int(p - 0.3 * r['space'])), 'y1': min(H, int(q + 1 + 0.3 * r['space']))}))
cnt = {}
for o in out:
    k = (o['page'], o['system']); cnt[k] = cnt.get(k, 0) + 1; o['row'] = cnt[k]
    Image.open(f'{pref}-{o["page"] + off}.png').crop((o['x0'], o['y0'], o['x1'], o['y1'])).save(f'{CR}/{L}-{o["page"]}-s{o["system"]}-r{o["row"]}.png')
with open(f'{HERE}/rows2/{L}.jsonl', 'w') as f:
    for o in out: f.write(json.dumps(o) + '\n')
print(L, 'R1 rows', len(rows(L)), 'R2 rows', len(out), 'R1 rows split', n_split)
