"""Row 57 r5 render pool: each staff cut at the same places for network A (32 px at 10 a space) and B (40 px at 12)."""
import numpy as np, sys, os, time, json
from multiprocessing import Pool
from render import scene, FONTS, CLASSES, NONE
from crops import crop_norm
LAB = {c: i for i, c in enumerate(CLASSES)}
FL = json.load(open('fontlist.json')); TEXT = [t['path'] for t in FL['text'] if t['font'] in FL['text_digits']]
P_TEXT = 0.35

def one(args):
    fi, seed, n = args
    rng = np.random.default_rng(seed)
    XA, XB, Y, S, T = [], [], [], [], []
    for _ in range(n):
        fs = float(rng.uniform(0.6, 1.15))
        ti = int(rng.integers(len(TEXT))) if rng.random() < P_TEXT else -1
        (A, B), kind, hs = scene(rng, FONTS[fi], fig_scale=fs, text_font=TEXT[ti] if ti >= 0 else None, out_sp=(10, 12))
        gA, LA, oA = A; gB, LB, oB = B
        figs = [(c, x / 10.0, seat) for c, x, seat in oA if seat >= 0]   # x in spaces
        W = gA.shape[1] / 10.0
        pts = []
        for c, x, seat in figs:
            for _ in range(2):
                pts.append((x + rng.uniform(-0.15, 0.15), seat, rng.uniform(-0.15, 0.15), LAB[c]))
        for _ in range(6):
            seat = int(rng.choice([1, 2, 3])); x = rng.uniform(0, W)
            if any(abs(x - fx) < 0.6 and s2 == seat for _, fx, s2 in figs): continue
            pts.append((x, seat, rng.uniform(-0.15, 0.15), NONE))
        for c, x, seat in figs[:2]:
            q = int(rng.choice([s for s in [1, 2, 3] if s != seat]))
            if any(abs(x - fx) < 0.6 and s2 == q for _, fx, s2 in figs): continue
            pts.append((x, q, 0.0, NONE))
        for x, seat, dy, lab in pts:
            XA.append(crop_norm(gA, x * 10, LA[seat] + dy * 10, 32)); XB.append(crop_norm(gB, x * 12, LB[seat] + dy * 12, 40))
            Y.append(lab); S.append(fs); T.append(ti)
    return fi, np.array(XA, np.uint8), np.array(XB, np.uint8), np.array(Y, np.int8), np.array(S, np.float32), np.array(T, np.int8)

if __name__ == '__main__':
    n_scenes = int(sys.argv[1]); out = sys.argv[2]
    t = time.time()
    jobs = [(fi, 50000 + 1000 * fi + k, n_scenes // 200) for fi in range(10) for k in range(20)]
    with Pool(8) as p: res = p.map(one, jobs, chunksize=1)
    os.makedirs(out, exist_ok=True)
    for i, key in enumerate(['XA', 'XB', 'Y', 'S', 'T'], start=1):
        np.save(f'{out}/{key}.npy', np.concatenate([r[i] for r in res]))
    np.save(f'{out}/F.npy', np.concatenate([np.full(len(r[1]), r[0], np.int8) for r in res]))
    Y = np.load(f'{out}/Y.npy'); T = np.load(f'{out}/T.npy')
    print(len(Y), np.bincount(Y, minlength=13).tolist(), 'text-face crops', int((T >= 0).sum()), round(time.time() - t), 's')
