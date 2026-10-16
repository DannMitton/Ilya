"""N.135 stage 1: pick two systems per song to check by eye (the first with four or more printed syllables, and the middle one), draw each as a sheet (sheet.py, rule R2), print what the
transcription says the Russian row holds. Usage: RULE=R2 python3 eyecheck.py <L> <stem> <offset> -> sheets/E-<L>.png"""
import subprocess, sys
from common2 import *
L, stem, off = sys.argv[1], sys.argv[2], sys.argv[3]
T = truth_by_system(L) if L not in FOUR else {}; S = systems(L); P = transcription(L); lab = labels(L)['rows']; R = rows(L)
cand = []
for b in S:
    rr = [rid(r) for r in R if (r['page'], r['system']) == (b['page'], b['system']) and lab[rid(r)] == 'russian']
    if rr and len(P[rr[0]]) >= 4: cand.append((b['page'], b['system'], rr[0]))
pick = [cand[0], cand[len(cand) // 2]] if len(cand) > 1 else cand
files = []
for p, s, k in pick:
    print(L, f'p{p}s{s}', k, ' '.join(P[k]))
    subprocess.run([f'{os.path.expanduser("~")}/Downloads/_desk-trocr/venv/bin/python', f'{HERE}/sheet.py', L, f'{WORK}/rasters/{stem}', off, str(p), str(s)], capture_output=True, env=dict(os.environ, RULE='R2'))
    files.append(f'{HERE}/sheets/{L}2-p{p}s{s}.png')
subprocess.run([f'{os.path.expanduser("~")}/Downloads/_desk-trocr/venv/bin/python', f'{HERE}/tile.py', f'{HERE}/sheets/E-{L}.png'] + files, capture_output=True)
