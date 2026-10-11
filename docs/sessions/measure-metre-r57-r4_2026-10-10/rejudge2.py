"""Final judging. Each fold tunes its centring tolerance and its cut together on its own tuning songs and
tuning renders (0 false signatures there, most right), then reads its held-out song and 300 fresh renders
of its held-out font (seeds never used before)."""
import json, pickle, sys
import numpy as np, torch
import decode
from model import Net
from render import FONTS
from fold import judge_windows, rendered_scenes, scene_probs, judge_scenes, CUTS
CENTRES = [0.4, 0.3, 0.25, 0.2, 0.15]
def run(f, fresh=True):
    d = json.load(open('folds/f%02d.json' % f)); held, hfont = d['held'], d['font']; lo, hi = d['scale']
    PRt, tSP = pickle.load(open('folds/f%02d-tune.pkl' % f, 'rb'))
    tsc = rendered_scenes([fn for fn in FONTS if fn != hfont], 300, 5000 + f, lo, hi)
    best = None
    for ce in CENTRES:
        decode.CENTRE = ce
        for c in CUTS:
            jw = judge_windows(PRt, c); fw = sum(r[3] == 'FALSE' for r in jw); rw = sum(r[3] == 'right' for r in jw)
            fr = judge_scenes(tsc, tSP, c)
            if fw == 0 and fr[2] == 0:
                score = (rw, fr[0])
                if best is None or score > best[0]: best = (score, ce, c)
                break
    if best is None: best = ((0, 0), CENTRES[0], CUTS[-1])
    _, ce, cut = best; decode.CENTRE = ce
    P = pickle.load(open('folds/f%02d-probs.pkl' % f, 'rb'))
    jw = judge_windows(P['PR'], cut)
    cache = 'folds/f%02d-fresh.pkl' % f
    hsc = rendered_scenes([hfont], 300, 19000 + f, lo, hi)
    try: hSP = pickle.load(open(cache, 'rb'))
    except FileNotFoundError:
        net = Net().to('mps'); net.load_state_dict(torch.load('folds/f%02d.pt' % f)); net.eval()
        hSP = scene_probs(net, hsc); pickle.dump(hSP, open(cache, 'wb'))
    js = judge_scenes(hsc, hSP, cut)
    out = dict(fold=f, held=held, font=hfont, tune=d['tune'], scale=[lo, hi], centre=ce, cut=cut, windows=jw,
               rendered=dict(n=len(hsc), found=js[0], missed=js[1], false=js[2], falses=js[3]))
    json.dump(out, open('folds/final%02d.json' % f, 'w'), default=str)
    print(f, held, hfont, 'centre', ce, 'cut', cut, 'right', sum(r[3] == 'right' for r in jw), 'FALSE', sum(r[3] == 'FALSE' for r in jw),
          'rendered', js[:3], js[3][:3], flush=True)
if __name__ == '__main__':
    for f in [int(a) for a in sys.argv[1:]] or range(17): run(f)
