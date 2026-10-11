"""Row 57 r5: the one fresh draw. 300 renders a fold of its held-out music font, seeds 29000 + f (never used
before), read by the fold's two networks in nine readings each, then every variant judged with the setting
its fold tuned. Run once, after choice.md is written."""
import json, pickle, sys, os
import torch
from fold5 import rendered, read_scenes
from model5 import NetA, NetB
from eval5 import scene_units, judge_scenes
from run_eval import VARIANTS, vname

def run(f):
    d = f'../folds5/f{f:02d}'; meta = json.load(open(f'{d}/meta.json')); ev = json.load(open(f'{d}/eval.json'))
    lo, hi = meta['scale']
    A = NetA().to('mps'); A.load_state_dict(torch.load(f'{d}/A.pt')); A.eval()
    B = NetB().to('mps'); B.load_state_dict(torch.load(f'{d}/B.pt')); B.eval()
    if not os.path.exists(f'{d}/freshR.pkl'):
        sc = rendered([meta['font']], 300, 29000 + f, lo, hi)
        pickle.dump(sc, open(f'{d}/fresh_scenes.pkl', 'wb'))
        pickle.dump(read_scenes({'A': A, 'B': B}, sc), open(f'{d}/freshR.pkl', 'wb'))
    sc = pickle.load(open(f'{d}/fresh_scenes.pkl', 'rb'))
    refs = pickle.load(open(f'{d}/refs.pkl', 'rb')); stats = pickle.load(open(f'{d}/simstats.pkl', 'rb'))['stats']
    units = scene_units(sc, pickle.load(open(f'{d}/freshR.pkl', 'rb')), refs)
    out = {}
    for v in VARIANTS:
        e = ev['variants'][vname(v)]
        if not e.get('chosen'): out[vname(v)] = None; continue
        p = e['chosen']; chk = e['chk']
        if chk: chk = {k: (float(x) if isinstance(x, str) and x not in ('inf',) else (float('inf') if x == 'inf' else x)) for k, x in chk.items()}
        r, fl = judge_scenes(units, v[0], p['cut'], p['centre'], chk, v[2], stats, 9500)
        out[vname(v)] = dict(res=dict(r), falses=fl)
    json.dump(out, open(f'{d}/fresh.json', 'w'), default=str)
    print(f, meta['font'], ' | '.join('%s %s' % (k, v['res'] if v else '-') for k, v in out.items()), flush=True)

if __name__ == '__main__':
    for f in [int(a) for a in sys.argv[1:]] or range(17): run(f)
