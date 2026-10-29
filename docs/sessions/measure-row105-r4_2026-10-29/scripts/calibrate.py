"""Row 105 r4, brief r5 amendment 7: build 200 kind 2 rows with the damage parameters in <damage.json>, frame them, label-check them, and compute the four pairs against the choosing half's
(B01, B03, B06, B08) real crops. Usage: calibrate.py <round> <damage.json>. Writes <WORKD>/cal/round<n>/ (bulk) and <scripts>/../calibration/round<n>.json (figures, small)."""
import sys, os, json, time, subprocess, glob, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common105 import *
from kind2lib import *
rd, dj = sys.argv[1], sys.argv[2]; PY = os.path.expanduser('~/Downloads/_desk-row105/venv/bin/python'); H = os.path.dirname(os.path.abspath(__file__))
C = f'{WORKD}/cal/round{rd}'; subprocess.run(['rm', '-rf', C]); os.makedirs(C); T = {}
t = time.time(); subprocess.run([PY, f'{H}/render105.py', 'kind2', f'{C}/raw', '200', '0', '1'], env=dict(os.environ, DAMAGE=dj), check=True, capture_output=True); T['render_200_s'] = round(time.time() - t, 1)
t = time.time(); subprocess.run([PY, f'{H}/clean105.py', f'{C}/framed', 'deskew,close:3,height:32,padpaper:16:16', 'kind2a'], env=dict(os.environ, CLEAN_CROPS=f'{C}/raw', CLEAN_ROOT=C, CLEAN_ANG=f'{C}/ang.json'), check=True, capture_output=True); T['frame_200_s'] = round(time.time() - t, 1)
raws = {os.path.basename(f): grey(f) for f in sorted(glob.glob(f'{C}/raw/kind2a-*.png'))}; frs = {k: grey(f'{C}/framed/{k}') for k in raws}
gt = {k: open(f'{C}/raw/{k[:-4]}.gt.txt', encoding='utf8').read() for k in raws}
loss = {k: end_loss(raws[k], frs[k]) for k in raws}; drop = [k for k, v in loss.items() if v is None or max(v) > 0.10]
keep = [k for k in raws if k not in drop]
MR = os.path.expanduser('~/Downloads/_desk-row105/r4/mroot'); HALF = ['B01', 'B03', 'B06', 'B08']
rf = [grey(f) for L in HALF for f in sorted(glob.glob(f'{MR}/ctl/framed/{L}-*.png'))]; rr = [grey(f) for L in HALF for f in sorted(glob.glob(os.path.expanduser(f'~/Downloads/_desk-n135/crops2/{L}-*.png')))]
let = 0
for L in HALF:
    for t_ in json.load(open(f'{MR}/n135-row117/harness/align/{L}.json'))['truth']:
        if t_['type'] == 'note' and t_['syl']: let += nletters(t_['syl'])
real = figures(rf, let); real['edge_share_before_frame'] = edge_share(rr)
syn = figures([frs[k] for k in keep], sum(nletters(gt[k]) for k in keep)); syn['edge_share_before_frame'] = edge_share([raws[k] for k in keep])
out = dict(round=rd, damage=json.load(open(dj)), timing=T, kind2_rows=len(raws), label_check_dropped=len(drop), real=real, kind2=syn,
           ratio={k: syn[k] / real[k] for k in ('ink_share', 'median_run', 'cc_per_letter', 'edge_share_before_frame')})
os.makedirs(f'{os.path.dirname(H)}/calibration', exist_ok=True); json.dump(out, open(f'{os.path.dirname(H)}/calibration/round{rd}.json', 'w'), indent=1)
print(json.dumps(out, indent=1))
