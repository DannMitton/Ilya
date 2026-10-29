"""Row 105 r4 (new): the training lists of the three arms, after the label check.
A  : framed kind 1 + framed kind 2 (less the label-check drops) + r3's framed kind 3 (23,589 lines of row 82's, reused from r3 with their .lstmf), shuffled with seed 105.
A1 : r3's own list.train (~/Downloads/_desk-row105/lists/list.train, 70,771) less every line whose .gt.txt holds U+2026.
A0 : r2's original list (tesstrain/data/rus_prereform_r2/list.train, relative to tesstrain/, unframed), not rewritten.
Eval list for A and A1: 1,000 framed held-out synthetic rows (this run's, list.heldout) ; the lstmtraining eval list is r3's list.eval for A1."""
import os, sys, glob, json, random
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kind2lib import *
W = os.path.expanduser('~/Downloads/_desk-row105/r4/work'); L = f'{W}/lists'; os.makedirs(L, exist_ok=True)
# label check on every kind 2 row
drop = []; n2 = 0
for f in sorted(glob.glob(f'{W}/raw/kind2/kind2?-*.png')):
    k = os.path.basename(f); fr = f'{W}/framed/kind2/{k}'; n2 += 1
    v = end_loss(grey(f), grey(fr)) if os.path.exists(fr) else None
    if v is None or max(v) > 0.10: drop.append(k[:-4])
json.dump(drop, open(f'{W}/kind2-label-drops.json', 'w')); print('kind2 rows', n2, 'dropped by the label check', len(drop))
def lst(dirn, skip=()):
    return [f for f in sorted(glob.glob(f'{dirn}/*.lstmf')) if os.path.basename(f)[:-6] not in skip]
k1 = lst(f'{W}/framed/kind1'); k2 = lst(f'{W}/framed/kind2', set(drop)); k3 = [l.strip() for l in open(os.path.expanduser('~/Downloads/_desk-row105/lists/list.train')) if '/kind3' in l]
tr = k1 + k2 + k3; random.Random(105).shuffle(tr); open(f'{L}/list.train', 'w').write('\n'.join(tr) + '\n')
ho = lst(f'{W}/framed/held1') + lst(f'{W}/framed/held2'); open(f'{L}/list.heldout', 'w').write('\n'.join(ho) + '\n'); open(f'{L}/list.eval', 'w').write('\n'.join(ho) + '\n')
old = [l.strip() for l in open(os.path.expanduser('~/Downloads/_desk-row105/lists/list.train'))]; keep = []; rm = 0
for l in old:
    g = l[:-6] + '.gt.txt'; t = open(g, encoding='utf8').read() if os.path.exists(g) else ''
    if '…' in t: rm += 1
    else: keep.append(l)
open(f'{L}/list.train.a1', 'w').write('\n'.join(keep) + '\n')
print(json.dumps(dict(kind1=len(k1), kind2=len(k2), kind3=len(k3), A_total=len(tr), heldout=len(ho), A1_total=len(keep), A1_removed_with_U2026=rm)))
json.dump(dict(kind1=len(k1), kind2=len(k2), kind2_label_dropped=len(drop), kind3=len(k3), A_total=len(tr), heldout=len(ho), A1_total=len(keep), A1_removed_with_U2026=rm), open(f'{os.path.dirname(os.path.dirname(os.path.abspath(__file__)))}/calibration/lists-summary.json', 'w'))
