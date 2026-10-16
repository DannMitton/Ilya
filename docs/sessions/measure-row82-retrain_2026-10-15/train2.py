# Row 82 retrain: continue rus_prereform from its 10,000-iteration checkpoint to 30,000, 1,000 per chunk, same lists, lr 0.0005.
# Copy of measure-prereform-model_2026-10-12/train.py with: new name (rus_prereform_r2) so no old file is overwritten; start at 11,000
# from a copy of the 10,000 checkpoint; held-out list is list_abs.txt (the original's relative list failed); stop if the held-out
# (lstmtraining restarts its own counter at 0 when it loads the copied 10,000 checkpoint, so its --max_iterations is n-10000 and n is the total) BCER has not improved for 5,000 iterations. Usage: train2.py <max iterations>
import subprocess, sys, os, re, json, time
H=os.path.expanduser('~/Downloads/_desk-prereform'); T=H+'/tesstrain'
name='rus_prereform_r2'; lr='0.0005'; maxit=int(sys.argv[1])
env=dict(os.environ, TESSDATA_PREFIX='/opt/homebrew/share/tessdata')
O=f'{T}/data/{name}'; proto=f'{O}/rus_prereform.traineddata'
start=f'{O}/checkpoints/{name}_start_10000.checkpoint'
log=open(f'{H}/work/train-{name}.log','a'); res=[]
def run(cmd): return subprocess.run(cmd,capture_output=True,text=True,env=env,cwd=T)
t0=time.time(); best=(1e9,10000)
for n in range(11000,maxit+1,1000):
    cont = start if n==11000 else f'{O}/checkpoints/{name}_checkpoint'
    cmd=['lstmtraining','--debug_interval','0','--traineddata',proto,'--learning_rate',lr,
         '--model_output',f'{O}/checkpoints/{name}','--train_listfile',f'{O}/list.train','--eval_listfile',f'{O}/list.eval',
         '--max_iterations',str(n-10000),'--target_error_rate','0.01','--continue_from',cont]
    r=run(cmd); log.write(r.stdout+r.stderr); log.flush()
    out=f'{H}/models/{name}/{name}_{n}.traineddata'
    r2=run(['lstmtraining','--stop_training','--continue_from',f'{O}/checkpoints/{name}_checkpoint','--traineddata',proto,'--model_output',out]); log.write(r2.stderr)
    e=run(['lstmeval','--verbosity=0','--model',out,'--eval_listfile',H+'/heldout_images/list_abs.txt']); log.write(e.stdout+e.stderr)
    m=re.search(r'BCER eval=([\d.]+), BWER eval=([\d.]+)',e.stdout+e.stderr)
    res.append(dict(iterations=n,heldout_bcer=float(m.group(1)) if m else None,heldout_bwer=float(m.group(2)) if m else None,seconds=round(time.time()-t0)))
    print(res[-1],flush=True); json.dump(res,open(f'{H}/work/train-{name}.json','w'))
    if m and float(m.group(1))<best[0]: best=(float(m.group(1)),n)
    if n-best[1]>=5000: print('STOP: no held-out improvement for 5000 iterations; best',best,flush=True); break
