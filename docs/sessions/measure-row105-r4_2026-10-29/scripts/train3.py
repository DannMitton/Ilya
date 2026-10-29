# Row 105: continue rus_prereform_r2 from its 29,000 float form to rus_prereform_r3, 1,000-iteration chunks.
# Copy of docs/sessions/measure-row82-retrain_2026-10-15/train2.py with these edits:
#  1. name rus_prereform_r3, its own tesstrain/data/rus_prereform_r3 and models/rus_prereform_r3 (r2's files untouched);
#  2. start from the .lstm extracted from the 29,000 float traineddata (models/rus_prereform_r3/start/r2_29000.lstm), not a checkpoint: lstmtraining restarts its counter at 0 on that load, so --max_iterations is n-29000;
#  3. the proto is a NEW one (one new character, the ellipsis U+2026, so 210 classes against r2's 209); the first chunk adds --old_traineddata <copy of r2 29000> ("--old_traineddata: When changing the character set, this specifies the old character set that is to be replaced", lstmtraining --help, Tesseract 5.5.3);
#  4. the train list is kinds 1, 2, 3 (framed), the eval list is the 1,000 framed held-out underlay rows;
#  5. each chunk is scored by lstmeval on (a) row 82's 722 plain lines (evalckpt2.sh's command) and (b) the 1,000 held-out underlay rows; stop rules: (b) not improved for 5,000 iterations; (a) above 0.42 on three chunks in a row; wall-clock ceiling given as argv[2] seconds.
# Usage: train3.py <max total iterations> <wall seconds>
import subprocess, sys, os, re, json, time
H=os.path.expanduser('~/Downloads/_desk-prereform'); T=H+'/tesstrain'; R=os.path.expanduser('~/Downloads/_desk-row105')
name='rus_prereform_r3'; lr='0.0005'; maxit=int(sys.argv[1]); wall=int(sys.argv[2]); S=29000
env=dict(os.environ, TESSDATA_PREFIX='/opt/homebrew/share/tessdata')
O=f'{T}/data/{name}'; proto=f'{O}/rus_prereform.traineddata'; startlstm=f'{H}/models/{name}/start/r2_29000.lstm'; oldtd=f'{H}/models/{name}/start/rus_prereform_r2_29000.traineddata'
log=open(f'{H}/work/train-{name}.log','a'); res=json.load(open(f'{H}/work/train-{name}.json')) if os.path.exists(f'{H}/work/train-{name}.json') else []
def run(cmd): return subprocess.run(cmd,capture_output=True,text=True,env=env,cwd=T)
t0=time.time(); done={r['iterations'] for r in res}
best=(1e9,S); bad_plain=0
for r in res:
    if r['heldout_underlay_bcer'] is not None and r['heldout_underlay_bcer']<best[0]: best=(r['heldout_underlay_bcer'],r['iterations'])
for n in range(S+1000,maxit+1,1000):
    if n in done: continue
    first = n==S+1000
    cmd=['lstmtraining','--debug_interval','0','--traineddata',proto,'--learning_rate',lr,'--model_output',f'{O}/checkpoints/{name}','--train_listfile',f'{R}/lists/list.train','--eval_listfile',f'{R}/lists/list.eval','--max_iterations',str(n-S),'--target_error_rate','0.01']
    cmd += ['--old_traineddata',oldtd,'--continue_from',startlstm] if first else ['--continue_from',f'{O}/checkpoints/{name}_checkpoint']
    r=run(cmd); log.write(r.stdout+r.stderr); log.flush()
    out=f'{H}/models/{name}/{name}_{n}.traineddata'
    r2=run(['lstmtraining','--stop_training','--continue_from',f'{O}/checkpoints/{name}_checkpoint','--traineddata',proto,'--model_output',out]); log.write(r2.stderr)
    def ev(lst):
        e=run(['lstmeval','--verbosity=0','--model',out,'--eval_listfile',lst]); log.write(e.stdout+e.stderr)
        m=re.search(r'BCER eval=([\d.]+), BWER eval=([\d.]+)',e.stdout+e.stderr); return (float(m.group(1)),float(m.group(2))) if m else (None,None)
    pa=ev(H+'/heldout_images/list_abs.txt'); pb=ev(f'{R}/lists/list.heldout')
    res.append(dict(iterations=n,plain_bcer=pa[0],plain_bwer=pa[1],heldout_underlay_bcer=pb[0],heldout_underlay_bwer=pb[1],seconds=round(time.time()-t0)))
    print(res[-1],flush=True); json.dump(res,open(f'{H}/work/train-{name}.json','w'))
    if pb[0] is not None and pb[0]<best[0]: best=(pb[0],n)
    bad_plain = bad_plain+1 if (pa[0] is not None and pa[0]>0.42) else 0
    if n-best[1]>=5000: print('STOP: no held-out underlay improvement for 5000 iterations; best',best,flush=True); break
    if bad_plain>=3: print('STOP: plain-type BCER above 0.42 on three chunks in a row',flush=True); break
    if time.time()-t0>wall: print('STOP: wall-clock ceiling',flush=True); break
