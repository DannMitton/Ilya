"""Re-judge every fold with the final decoder: re-tune its cut on its own tuning songs and renders, then read
the held-out song and the held-out font. Models are the ones fold.py trained; nothing is retrained."""
import json, pickle, sys
import numpy as np, torch
from model import Net
from voices import SONGS, EXTRA
from render import FONTS
from fold import read_windows, judge_windows, rendered_scenes, scene_probs, judge_scenes, CUTS

def run(f):
    d = json.load(open('folds/f%02d.json' % f))
    held, hfont, tune = d['held'], d['font'], d['tune']; lo, hi = d['scale']
    net = Net().to('mps'); net.load_state_dict(torch.load('folds/f%02d.pt' % f)); net.eval()
    cache = 'folds/f%02d-tune.pkl' % f
    try:
        PRt, tSP = pickle.load(open(cache, 'rb'))
    except FileNotFoundError:
        PRt = read_windows(net, tune)
        tSP = scene_probs(net, rendered_scenes([fn for fn in FONTS if fn != hfont], 300, 5000 + f, lo, hi))
        pickle.dump((PRt, tSP), open(cache, 'wb'))
    tsc = rendered_scenes([fn for fn in FONTS if fn != hfont], 300, 5000 + f, lo, hi)
    cut = None; log = []
    for c in CUTS:
        fw = sum(r[3] == 'FALSE' for r in judge_windows(PRt, c)); fr = judge_scenes(tsc, tSP, c)[2]
        log.append((c, fw, fr))
        if fw == 0 and fr == 0 and cut is None: cut = c
    if cut is None: cut = CUTS[-1]
    P = pickle.load(open('folds/f%02d-probs.pkl' % f, 'rb'))
    hsc = rendered_scenes([hfont], 300, 9000 + f)
    keep = [i for i, s in enumerate(hsc) if lo <= s[4] <= hi]
    js = judge_scenes([hsc[i] for i in keep], [P['SP'][i] for i in keep], cut)
    jw = judge_windows(P['PR'], cut)
    out = dict(fold=f, held=held, font=hfont, tune=tune, scale=[lo, hi], cut=cut, tune_log=log, windows=jw,
               rendered=dict(n=len(keep), found=js[0], missed=js[1], false=js[2], falses=js[3]))
    json.dump(out, open('folds/r%02d.json' % f, 'w'), default=str)
    print(f, held, hfont, 'cut', cut, 'right', sum(r[3] == 'right' for r in jw), 'FALSE', sum(r[3] == 'FALSE' for r in jw),
          'set aside', sum(r[3] == 'set aside' for r in jw), 'rendered', js[:3], 'of', len(keep), flush=True)

if __name__ == '__main__':
    for f in [int(a) for a in sys.argv[1:]] or range(17):
        run(f)
