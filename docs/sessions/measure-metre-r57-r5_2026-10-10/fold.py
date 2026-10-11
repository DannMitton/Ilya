"""Row 57 r4: held out song by song. One fold per song of the 17.

Fold f holds out song SONGS[f] and font FONTS[f % 10]. Inside the fold:
- the training songs are split once at random (seed f) into 12 for training and 4 for tuning;
- the render scale range is set from the training songs' printed figure heights;
- the model trains on renders (held-out font left out, scale in range) and the 12 songs' crops (plus Sunless 2 and 3);
- the confidence cut is the lowest on a grid that states no false signature on the 4 tuning songs and on
  150 rendered tuning scenes (training fonts);
- then the held-out song's windows and 300 rendered scenes of the held-out font are read.
"""
import json, sys, pickle, time
import numpy as np, torch
from voices import SONGS, EXTRA
from render import FONTS, scene, NONE
from crops import crop_norm
from train import train, predict
from runwin import window_probs, STEP
from decode import signatures, state

CUTS = [0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.93, 0.95, 0.97, 0.98, 0.99, 0.995, 0.999]
W = json.load(open('windows.json')); LABELS = json.load(open('labels.json'))
FH = json.load(open('figheights.json'))
RT = None


def courtesy_place(w):
    return w['kind'] == 'bar' and w.get('lastbar') and w['tail'] < 6


def truth(w):
    l = LABELS.get(str(w['id']))
    if l is None: return None
    if l.startswith('c') and l != 'cut': return 'courtesy:' + l[1:]
    return l


def read_windows(net, songs):
    out = {}
    for w in W:
        if w['song'] in songs and w['staff'] is not None:
            out[w['id']] = window_probs(net, w)
    return out


def judge_windows(PR, cut):
    res = []
    for i, (xs, P) in PR.items():
        w = W[i]; s = state(signatures(P, STEP, cut)); t = truth(w)
        if s is not None and courtesy_place(w):
            res.append((i, t, s[0], 'set aside')); continue
        if t and t.startswith('courtesy:'):
            res.append((i, t, s[0] if s else None, 'courtesy')); continue
        if s is None:
            res.append((i, t, None, 'missed' if t else 'none')); continue
        res.append((i, t, s[0], 'right' if s[0] == t else 'FALSE'))
    return res


def rendered_scenes(fonts, n, seed, lo=0.6, hi=1.15):
    rng = np.random.default_rng(seed); out = []
    for k in range(n):
        fs = float(rng.uniform(lo, hi))
        g, L, objs, kind, hs = scene(rng, fonts[k % len(fonts)], fig_scale=fs)
        t = None
        if hs:
            f = [o for o in objs if o[2] >= 0 and o[0] != 'tup']
            if f and f[0][0] in ('C', 'cut'): t = f[0][0]
            elif f:
                top = ''.join(c for c, x, s in f if s == 1); bot = ''.join(c for c, x, s in f if s == 3)
                t = '%d/%d' % (int(top), int(bot))
        out.append((g, L, t, fonts[k % len(fonts)], fs, kind))
    return out


def scene_probs(net, sc):
    out = []
    for g, L, t, fn, fs, kind in sc:
        xs = np.arange(0, g.shape[1], STEP * 10)
        C = np.stack([[crop_norm(g, x, L[s]) for s in (1, 2, 3)] for x in xs])
        out.append(predict(net, C.reshape(-1, 32, 32)).reshape(len(xs), 3, 13))
    return out


def judge_scenes(sc, SP, cut):
    found = missed = false = 0; fl = []
    for (g, L, t, fn, fs, kind), P in zip(sc, SP):
        s = state(signatures(P, STEP, cut)); s = s[0] if s else None
        if s is None:
            missed += t is not None
        elif s == t:
            found += 1
        else:
            false += 1; fl.append((fn, round(fs, 2), kind, t, s))
    return found, missed, false, fl


def run(f):
    global RT
    t0 = time.time()
    held = SONGS[f]; hfont = FONTS[f % 10]
    train_songs = [s for s in SONGS if s not in (held, 'grech')]
    rng = np.random.default_rng(f)
    tune = list(rng.choice(train_songs, 4, replace=False))
    fit = [s for s in train_songs if s not in tune] + EXTRA
    # scale range from the training songs' printed figure heights (pair height over the staff)
    hs = [v for s in train_songs + EXTRA if s in FH for v in FH[s]]
    lo = max(0.6, min(h for h in hs) - 0.1); hi = min(1.15, max(h for h in hs if h <= 1.1) + 0.08)
    if RT is None:
        d = np.load('rtrain.npz'); RT = (d['X'], d['Y'], d['S'], d['F'])
    X, Y, S, F = RT
    ok = (F != FONTS.index(hfont)) & (S >= lo) & (S <= hi)
    pos = np.where(ok & (Y != NONE))[0]; neg = np.where(ok & (Y == NONE))[0]
    pick = np.concatenate([rng.choice(pos, min(len(pos), 250000), replace=False), rng.choice(neg, 350000, replace=False)])
    Xs, Ys = [X[pick]], [Y[pick]]
    for s in fit:
        d = np.load('real/%s.npz' % s); Xs.append(d['X']); Ys.append(d['Y'])
    Xa = np.concatenate(Xs); Ya = np.concatenate(Ys)
    net = train(Xa, Ya, epochs=3, seed=f, log=False)
    torch.save(net.state_dict(), 'folds/f%02d.pt' % f)
    # tune the cut
    PRt = read_windows(net, tune)
    tsc = rendered_scenes([fn for fn in FONTS if fn != hfont], 300, 5000 + f, lo, hi)
    tSP = scene_probs(net, tsc)
    cut = None; tune_log = []
    for c in CUTS:
        jw = judge_windows(PRt, c); fw = sum(r[3] == 'FALSE' for r in jw)
        fr = judge_scenes(tsc, tSP, c)[2]
        tune_log.append((c, fw, fr))
        if fw == 0 and fr == 0 and cut is None: cut = c
    if cut is None: cut = CUTS[-1]
    # the held-out song and the held-out font
    PRh = read_windows(net, [held])
    hsc = rendered_scenes([hfont], 300, 9000 + f)
    hSP = scene_probs(net, hsc)
    pickle.dump(dict(PR=PRh, SP=hSP, truth_scenes=[(t, fn, fs, kind) for g, L, t, fn, fs, kind in hsc]), open('folds/f%02d-probs.pkl' % f, 'wb'))
    jw = judge_windows(PRh, cut); js = judge_scenes(hsc, hSP, cut)
    out = dict(fold=f, held=held, font=hfont, tune=tune, scale=[round(lo, 2), round(hi, 2)], cut=cut, tune_log=tune_log,
               windows=jw, rendered=dict(found=js[0], missed=js[1], false=js[2], falses=js[3]), secs=round(time.time() - t0))
    json.dump(out, open('folds/f%02d.json' % f, 'w'), default=str)
    print(f, held, hfont, 'cut', cut, 'scale', out['scale'], 'right', sum(r[3] == 'right' for r in jw),
          'FALSE', sum(r[3] == 'FALSE' for r in jw), 'rendered', js[:3], out['secs'], 's', flush=True)


if __name__ == '__main__':
    import os
    os.makedirs('folds', exist_ok=True)
    for f in [int(a) for a in sys.argv[1:]] or range(17):
        run(f)
