"""Row 57 r6, run 1: one split, one network A, its readings.

The 17 songs are split 13 and 4 by seed 57 (brief r6 section 1.2). Grechaninov has no window (no staff is found
on its grey scan), so the 4 are drawn from the 16 songs that have windows and Grechaninov counts among the 13
(DESK DEFAULT). Sunless 2 and 3 are trained on, as in rounds 4 and 5. Network A trains once on the 13 songs'
crops plus render crops of all ten music fonts and all 16 text faces, at the scale range of the training songs'
printed signatures, 250,000 figure and 350,000 other render crops, 3 epochs, as fold5.py does a fold.

Then it reads, in nine readings: every window of the 16 songs; 300 tuning renders of the ten fonts (seed 5057);
3,000 more tuning renders for the same-length margin (seed 6057); and round 5's 5,100 fresh renders (seeds
29000 + f, from each r5 fold's fresh_scenes.pkl), which step 0 judges. Nothing is judged here.
"""
import json, pickle, os, time
import numpy as np, torch
from voices import SONGS, EXTRA
from render import FONTS, NONE
from model5 import NetA, prep
from fold5 import train, rendered, read_scenes, read_windows
from reading5 import run_net

DEV = 'mps'
R5 = os.path.expanduser('~/Downloads/_code-metre-r5')
OUT = '../run1'
FH = json.load(open('figheights.json'))
W = json.load(open('windows.json'))


def refs_of(net, X, Y, per, seed):
    """Penultimate features of up to `per` training figure crops a class (12 classes: digits, C, cut C)."""
    rng = np.random.default_rng(seed); F, C = [], []
    for c in range(12):
        idx = np.where(Y == c)[0]
        if len(idx) == 0: continue
        idx = np.sort(rng.choice(idx, min(per, len(idx)), replace=False))
        _, f = run_net(net, prep(X[idx]).to(DEV))
        F.append(f); C.append(np.full(len(idx), c, np.int8))
    return np.concatenate(F), np.concatenate(C)


def main():
    t0 = time.time(); os.makedirs(OUT, exist_ok=True)
    readable = [s for s in SONGS if s != 'grech']
    rng = np.random.default_rng(57)
    tune = sorted(rng.choice(readable, 4, replace=False).tolist())
    train_songs = [s for s in SONGS if s not in tune]          # 13, Grechaninov among them
    fit = [s for s in train_songs if s != 'grech'] + EXTRA
    hs = [v for s in train_songs + EXTRA if s in FH for v in FH[s]]
    lo = max(0.6, min(hs) - 0.1); hi = min(1.15, max(h for h in hs if h <= 1.1) + 0.08)
    POOL = {k: np.load(f'{R5}/pool/{k}.npy', mmap_mode='r' if k == 'XA' else None) for k in ('XA', 'Y', 'S')}
    Y, S = POOL['Y'], POOL['S']
    ok = (S >= lo) & (S <= hi)
    pos = np.where(ok & (Y != NONE))[0]; neg = np.where(ok & (Y == NONE))[0]
    pick = np.sort(np.concatenate([rng.choice(pos, min(len(pos), 250000), replace=False), rng.choice(neg, 350000, replace=False)]))
    XA = [np.asarray(POOL['XA'][pick])]; Ys = [Y[pick]]
    for s in fit:
        r = np.load(f'{R5}/real5/{s}.npz'); XA.append(r['A']); Ys.append(r['Y'])
    XA = np.concatenate(XA); Ya = np.concatenate(Ys)
    t1 = time.time()
    net = train(NetA, XA, Ya, seed=57); torch.save(net.state_dict(), f'{OUT}/A.pt'); tA = time.time() - t1
    nets = {'A': net}
    pickle.dump({'A': refs_of(net, XA, Ya, 3000, 1)}, open(f'{OUT}/refs_full.pkl', 'wb'))
    pickle.dump({'A': refs_of(net, XA, Ya, 80, 57)}, open(f'{OUT}/refs_80.pkl', 'wb'))
    del XA
    t1 = time.time()
    tsc = rendered(FONTS, 300, 5057, lo, hi)
    msc = rendered(FONTS, 3000, 6057, lo, hi)
    pickle.dump(dict(tune=tsc, margin=msc), open(f'{OUT}/scenes.pkl', 'wb'))
    pickle.dump(read_windows(nets, readable), open(f'{OUT}/W.pkl', 'wb'))
    pickle.dump(read_scenes(nets, tsc), open(f'{OUT}/tuneR.pkl', 'wb'))
    pickle.dump(read_scenes(nets, msc), open(f'{OUT}/marginR.pkl', 'wb'))
    fresh, freshR = [], []
    for f in range(17):
        sc = pickle.load(open(f'{R5}/folds5/f{f:02d}/fresh_scenes.pkl', 'rb'))
        for d in sc: d['fold'] = f
        fresh += sc; freshR += read_scenes(nets, sc)
    pickle.dump(fresh, open(f'{OUT}/fresh_scenes.pkl', 'wb'))
    pickle.dump(freshR, open(f'{OUT}/freshR.pkl', 'wb'))
    tR = time.time() - t1
    meta = dict(seed=57, tune=tune, train=train_songs, extra=EXTRA, scale=[round(lo, 2), round(hi, 2)],
                crops=int(len(Ya)), secs=dict(trainA=round(tA), readings=round(tR), total=round(time.time() - t0)))
    json.dump(meta, open(f'{OUT}/meta.json', 'w'), indent=1)
    print(json.dumps(meta), flush=True)


if __name__ == '__main__':
    main()
