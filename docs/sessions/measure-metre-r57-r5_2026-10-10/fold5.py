"""Row 57 r5: one fold per song, two networks, nine readings each.

Fold f holds out song SONGS[f], music font FONTS[f % 10], and text face f % 16 (training only; the rendered
test is music fonts). Inside the fold, as round 4: 12 training songs and 4 tuning songs (seed f), the render
scale range from the training songs' printed signature heights, 250,000 figure and 350,000 other render crops,
3 epochs. Both networks train on the same crops, each cut at its own size. Then every reading the decoder
variants need is computed and saved; nothing is judged here. Fresh render seeds are not drawn here.
"""
import json, sys, os, pickle, time
import numpy as np, torch, torch.nn as nn
from voices import SONGS, EXTRA
from render import FONTS, scene, NONE
from model5 import NetA, NetB, prep
from reading5 import read_strip, STEP, cut, run_net
from pages5 import band, seat_y, ALLST

DEV = 'mps'
W = json.load(open('windows.json')); LABELS = json.load(open('labels.json')); FH = json.load(open('figheights.json'))
FL = json.load(open('fontlist.json')); TEXT = [t['path'] for t in FL['text'] if t['font'] in FL['text_digits']]
OUT = '../folds5'
POOL = None


def train(Net, X, Y, epochs=3, seed=0, bs=512, lr=2e-3):
    torch.manual_seed(seed)
    net = Net().to(DEV)
    opt = torch.optim.AdamW(net.parameters(), lr=lr, weight_decay=1e-4)
    n = len(X); steps = epochs * (n // bs)
    sch = torch.optim.lr_scheduler.OneCycleLR(opt, max_lr=lr, total_steps=steps)
    lossf = nn.CrossEntropyLoss(label_smoothing=0.02)
    Yt = torch.as_tensor(Y.astype(np.int64))
    for ep in range(epochs):
        perm = np.random.default_rng(seed * 100 + ep).permutation(n); net.train()
        for i in range(0, n - bs + 1, bs):
            idx = np.sort(perm[i:i + bs])
            xb = prep(X[idx]).to(DEV); yb = Yt[idx].to(DEV)
            a = torch.empty(xb.shape[0], 1, 1, 1, device=DEV).uniform_(0.7, 1.2)
            loss = lossf(net((xb * a).clamp(0, 1)), yb)
            opt.zero_grad(); loss.backward(); opt.step(); sch.step()
    return net.eval()


def rendered(fonts, n, seed, lo, hi):
    """Rendered staves at both sizes, as round 4's rendered_scenes (same seeds give the same staves)."""
    rng = np.random.default_rng(seed); out = []
    for k in range(n):
        fs = float(rng.uniform(lo, hi))
        (A, B), kind, hs = scene(rng, fonts[k % len(fonts)], fig_scale=fs, out_sp=(10, 12))
        objs = A[2]; t = None
        if hs:
            f_ = [o for o in objs if o[2] >= 0 and o[0] != 'tup']
            if f_ and f_[0][0] in ('C', 'cut'): t = f_[0][0]
            elif f_:
                top = ''.join(c for c, x, s in f_ if s == 1); bot = ''.join(c for c, x, s in f_ if s == 3)
                t = '%d/%d' % (int(top), int(bot))
        out.append(dict(A=A[0], LA=A[1], B=B[0], LB=B[1], truth=t, font=fonts[k % len(fonts)], scale=fs, kind=kind,
                        figs=[(c, x / 10.0, s) for c, x, s in objs if s >= 0 and c != 'tup']))
    return out


def read_scenes(nets, sc):
    res = []
    for d in sc:
        r = {}
        for name, net in nets.items():
            img = d[name]; L = d['L' + name]; sp = net.SP
            xs = np.arange(0, img.shape[1] / sp, STEP)
            r[name] = read_strip(net, img, xs, lambda x, L=L: [L[1], L[2], L[3]], sp)
        res.append(r)
    return res


def read_windows(nets, songs):
    res = {}
    for w in W:
        if w['song'] not in songs: continue
        r = {}
        for name, net in nets.items():
            sp = net.SP; b, y0, k = band(w['page'], w['staff'], sp); space = w['space']
            xs = np.arange(w['x0'], w['x1'], STEP * space) / space
            r[name] = read_strip(net, b, xs * space * k / sp,
                                 lambda x, w=w, sp=sp, k=k, space=space: [seat_y(w['page'], w['staff'], x * sp / k, q, sp) for q in (1, 2, 3)], sp)
        res[w['id']] = r
    return res


def refs(nets, X_by, Y):
    """Penultimate features of training figure crops: up to 3,000 a class, renders and editions."""
    rng = np.random.default_rng(1); out = {}
    for name, net in nets.items():
        F, C = [], []
        for c in range(12):
            idx = np.where(Y == c)[0]
            if len(idx) == 0: continue
            idx = np.sort(rng.choice(idx, min(3000, len(idx)), replace=False))
            _, f = run_net(net, prep(X_by[name][idx]).to(DEV))
            F.append(f); C.append(np.full(len(idx), c, np.int8))
        out[name] = (np.concatenate(F), np.concatenate(C))
    return out


def run(f):
    global POOL
    t0 = time.time(); d = f'{OUT}/f{f:02d}'; os.makedirs(d, exist_ok=True)
    held = SONGS[f]; hfont = FONTS[f % 10]; htext = f % len(TEXT)
    train_songs = [s for s in SONGS if s not in (held, 'grech')]
    rng = np.random.default_rng(f)
    tune = list(rng.choice(train_songs, 4, replace=False))
    fit = [s for s in train_songs if s not in tune] + EXTRA
    hs = [v for s in train_songs + EXTRA if s in FH for v in FH[s]]
    lo = max(0.6, min(hs) - 0.1); hi = min(1.15, max(h for h in hs if h <= 1.1) + 0.08)
    if POOL is None:
        POOL = {k: np.load(f'../pool/{k}.npy', mmap_mode='r' if k in ('XA', 'XB') else None) for k in ('XA', 'XB', 'Y', 'S', 'F', 'T')}
    Y, S, F, T = POOL['Y'], POOL['S'], POOL['F'], POOL['T']
    ok = (F != FONTS.index(hfont)) & (T != htext) & (S >= lo) & (S <= hi)
    pos = np.where(ok & (Y != NONE))[0]; neg = np.where(ok & (Y == NONE))[0]
    pick = np.sort(np.concatenate([rng.choice(pos, min(len(pos), 250000), replace=False), rng.choice(neg, 350000, replace=False)]))
    XA = [np.asarray(POOL['XA'][pick])]; XB = [np.asarray(POOL['XB'][pick])]; Ys = [Y[pick]]
    for s in fit:
        r = np.load(f'../real5/{s}.npz'); XA.append(r['A']); XB.append(r['B']); Ys.append(r['Y'])
    XA = np.concatenate(XA); XB = np.concatenate(XB); Ya = np.concatenate(Ys)
    t1 = time.time()
    netA = train(NetA, XA, Ya, seed=f); torch.save(netA.state_dict(), f'{d}/A.pt'); tA = time.time() - t1
    t1 = time.time()
    netB = train(NetB, XB, Ya, seed=f); torch.save(netB.state_dict(), f'{d}/B.pt'); tB = time.time() - t1
    nets = {'A': netA, 'B': netB}
    t1 = time.time()
    pickle.dump(refs(nets, {'A': XA, 'B': XB}, Ya), open(f'{d}/refs.pkl', 'wb'))
    del XA, XB
    tsc = rendered([fn for fn in FONTS if fn != hfont], 300, 5000 + f, lo, hi)
    esc = rendered([hfont], 300, 9000 + f, lo, hi)
    pickle.dump(dict(tune=tsc, early=esc), open(f'{d}/scenes.pkl', 'wb'))
    pickle.dump(read_windows(nets, tune), open(f'{d}/tuneW.pkl', 'wb'))
    pickle.dump(read_windows(nets, [held]), open(f'{d}/heldW.pkl', 'wb'))
    pickle.dump(read_scenes(nets, tsc), open(f'{d}/tuneR.pkl', 'wb'))
    pickle.dump(read_scenes(nets, esc), open(f'{d}/earlyR.pkl', 'wb'))
    tR = time.time() - t1
    meta = dict(fold=f, held=held, font=hfont, text_out=FL['text_digits'][htext], tune=tune, scale=[round(lo, 2), round(hi, 2)],
                secs=dict(trainA=round(tA), trainB=round(tB), readings=round(tR), total=round(time.time() - t0)))
    json.dump(meta, open(f'{d}/meta.json', 'w'))
    print(json.dumps(meta), flush=True)


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for f in [int(a) for a in sys.argv[1:]] or range(17):
        run(f)
