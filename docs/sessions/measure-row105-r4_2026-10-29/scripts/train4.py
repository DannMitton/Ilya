# Row 105 r4: one arm of the night. Derived from r3's train3.py (itself row 82's train2.py) with these edits:
#  1. the arm is a name (rus_prereform_r4, _r4a1, _r4a0), each with its own tesstrain/data/<name>/ and models/<name>/ (r2's and r3's files untouched);
#  2. start: the .lstm extracted from r2's 29,000 float form (--continue_from, counter restarts at 0, so --max_iterations is n-29000); the proto is r2's own (tesstrain/data/rus_prereform_r2/rus_prereform.traineddata, 209 classes), NO --old_traineddata, in every arm;
#  3. lists and eval list come from the command line; the learning rate is 0.0005, as r2 and r3; lstmtraining has no seed flag here (it seeds itself fixed, so the arms share it);
#  4. each chunk is scored by lstmeval on row 82's 722 lines UNFRAMED and FRAMED (list in r4/plain722framed), on the 1,000 framed synthetic held-out rows (reported, never chosen by), and read through measure105.py on the 18 songs (read right per song);
#  5. stop rules (brief r5 amendments 4 and 5): the framed plain BCER above G on three chunks in a row; the choosing half's (B01 B03 B06 B08) read right not beating its best for four chunks in a row; 40,000 total iterations; for A0, five chunks. A checkpoint with framed BCER above G is never chosen.
# Usage: train4.py <name> <train list> <eval list> <max total iterations> <G> [uses unicharset-proto: r2's always]
import subprocess, sys, os, re, json, time, shutil, glob
H = os.path.expanduser('~/Downloads/_desk-prereform'); T = H + '/tesstrain'; R = os.path.expanduser('~/Downloads/_desk-row105/r4'); S = os.path.dirname(os.path.abspath(__file__))
name, trainlist, evallist, maxit, G = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]), float(sys.argv[5]); S0 = 29000; lr = '0.0005'
env = dict(os.environ, TESSDATA_PREFIX='/opt/homebrew/share/tessdata', MROOT=R + '/mroot')
O = f'{T}/data/{name}'; M = f'{H}/models/{name}'; os.makedirs(f'{O}/checkpoints', exist_ok=True); os.makedirs(f'{M}/start', exist_ok=True)
proto = f'{O}/rus_prereform.traineddata'; shutil.copy(f'{T}/data/rus_prereform_r2/rus_prereform.traineddata', proto)
shutil.copy(f'{H}/models/rus_prereform_r2/rus_prereform_r2_29000.traineddata', f'{M}/start/rus_prereform_r2_29000.traineddata')
startlstm = f'{M}/start/r2_29000.lstm'
if not os.path.exists(startlstm): subprocess.run(['combine_tessdata', '-e', f'{M}/start/rus_prereform_r2_29000.traineddata', startlstm], check=True, env=env, capture_output=True)
log = open(f'{H}/work/train-{name}.log', 'a'); resf = f'{R}/curve-{name}.json'; res = json.load(open(resf)) if os.path.exists(resf) else []
def run(cmd, cwd=T): return subprocess.run(cmd, capture_output=True, text=True, env=env, cwd=cwd)
CH = ['B01', 'B03', 'B06', 'B08']; ME = ['B02', 'B04', 'B07', 'B09', 'B10']
t0 = time.time(); done = {r['iterations'] for r in res}; best = (-1, S0); bad_guard = 0; nobeat = 0
for r in res:
    if r['plain_framed_bcer'] is not None and r['plain_framed_bcer'] <= G and r['choose_half'] > best[0]: best = (r['choose_half'], r['iterations'])
n = S0
for n in range(S0 + 1000, maxit + 1, 1000):
    if n in done: continue
    cmd = ['lstmtraining', '--debug_interval', '0', '--traineddata', proto, '--learning_rate', lr, '--model_output', f'{O}/checkpoints/{name}', '--train_listfile', trainlist, '--eval_listfile', evallist, '--max_iterations', str(n - S0), '--target_error_rate', '0.01']
    cmd += ['--continue_from', startlstm] if n == S0 + 1000 else ['--continue_from', f'{O}/checkpoints/{name}_checkpoint']
    t1 = time.time(); r = run(cmd); log.write(r.stdout + r.stderr); log.flush(); tt = round(time.time() - t1)
    out = f'{M}/{name}_{n}.traineddata'
    r2 = run(['lstmtraining', '--stop_training', '--continue_from', f'{O}/checkpoints/{name}_checkpoint', '--traineddata', proto, '--model_output', out]); log.write(r2.stderr)
    def ev(lst):
        e = run(['lstmeval', '--verbosity=0', '--model', out, '--eval_listfile', lst]); log.write(e.stdout + e.stderr)
        m = re.search(r'BCER eval=([\d.]+), BWER eval=([\d.]+)', e.stdout + e.stderr); return float(m.group(1)) if m else None
    pu = ev(H + '/heldout_images/list_abs.txt'); pf = ev(R + '/plain722framed/list.txt'); ph = ev(R + '/work/lists/list.heldout')
    mr = run([sys.executable, f'{S}/measure105.py', f'{name}-{n}', out], cwd=S); log.write(mr.stdout + mr.stderr)
    try: m = json.load(open(f'{R}/mroot/ctl/m-{name}-{n}.json')); ps = m['per_song']
    except Exception as e: m = None; ps = {}
    sm = lambda L: sum(ps[x][0] for x in L if x in ps)
    rec = dict(iterations=n, plain_unframed_bcer=pu, plain_framed_bcer=pf, heldout_synthetic_bcer=ph, read_right_all=m and m['read_right_all'], choose_half=sm(CH), measure_half=sm(ME), other9=sm(['S', 'T', 'K', 'M', 'U1', 'U4', 'U5', 'U6', 'P']),
               unseen14=sm(ME) + sm(['S', 'T', 'K', 'M', 'U1', 'U4', 'U5', 'U6', 'P']), C2=m and m['C2_b_a_c'], bytes=m and m['bytes'], md5=m and m['md5'], train_seconds=tt, elapsed=round(time.time() - t0))
    res.append(rec); print(rec, flush=True); json.dump(res, open(resf, 'w'), indent=1)
    ok = pf is not None and pf <= G
    if ok and rec['choose_half'] > best[0]: best = (rec['choose_half'], n); nobeat = 0
    else: nobeat += 1
    bad_guard = 0 if ok else bad_guard + 1
    if name.endswith('a0') and n >= S0 + 5000: print('STOP: five chunks (A0)', flush=True); break
    if not name.endswith('a0'):
        if bad_guard >= 3: print('STOP: framed plain BCER above G on three chunks in a row', flush=True); break
        if nobeat >= 4: print('STOP: choosing half read right not beaten for four chunks; best', best, flush=True); break
print('BEST', best, flush=True); json.dump(dict(best=best, G=G), open(f'{R}/best-{name}.json', 'w'))
