import numpy as np, sys, os, time
from multiprocessing import Pool
from render import scene, FONTS, CLASSES, NONE
from crops import crop_norm
LAB = {c: i for i, c in enumerate(CLASSES)}

def one(args):
    fi, seed, n = args
    rng = np.random.default_rng(seed)
    X, Y, S = [], [], []
    for _ in range(n):
        fs = float(rng.uniform(0.6, 1.15))
        g, L, objs, kind, hs = scene(rng, FONTS[fi], fig_scale=fs)
        figs = [(c, x, seat) for c, x, seat in objs if seat >= 0]
        for c, x, seat in figs:
            for _ in range(2):
                X.append(crop_norm(g, x + rng.uniform(-1.5, 1.5), L[seat] + rng.uniform(-1.5, 1.5))); Y.append(LAB[c]); S.append(fs)
        W = g.shape[1]
        for _ in range(10):
            seat = int(rng.choice([1, 2, 3])); x = rng.uniform(0, W)
            if any(abs(x - fx) < 6 and fs_ == seat for _, fx, fs_ in figs): continue
            X.append(crop_norm(g, x, L[seat] + rng.uniform(-1.5, 1.5))); Y.append(NONE); S.append(fs)
        # wrong seat right on a figure
        for c, x, seat in figs[:2]:
            q = int(rng.choice([s for s in [1, 2, 3] if s != seat]))
            if any(abs(x - fx) < 6 and s2 == q for _, fx, s2 in figs): continue
            X.append(crop_norm(g, x, L[q])); Y.append(NONE); S.append(fs)
    return fi, np.array(X, np.uint8), np.array(Y, np.int8), np.array(S, np.float32)

if __name__ == '__main__':
    n_per = int(sys.argv[1]); out = sys.argv[2]
    t = time.time()
    jobs = [(fi, 1000 * fi + k, n_per // 10) for fi in range(10) for k in range(10)]
    with Pool(8) as p: res = p.map(one, jobs)
    X = np.concatenate([r[1] for r in res]); Y = np.concatenate([r[2] for r in res]); S = np.concatenate([r[3] for r in res])
    F = np.concatenate([np.full(len(r[1]), r[0], np.int8) for r in res])
    np.savez_compressed(out, X=X, Y=Y, S=S, F=F)
    print(X.shape, np.bincount(Y, minlength=13), round(time.time() - t, 1), 's')
