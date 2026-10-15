# Step 5: fine-tune Cyrillic -> rus_prereform in 1,000-iteration chunks; after each chunk, convert the checkpoint to a float
# traineddata and score it on the synthetic held-out lstmf list (lstmeval). Usage: train.py <model name> <learning rate> <max iterations>
import subprocess, sys, os, re, json, time, shutil
H=os.path.expanduser('~/Downloads/_desk-prereform'); T=H+'/tesstrain'
name, lr, maxit = sys.argv[1], sys.argv[2], int(sys.argv[3])
env=dict(os.environ, TESSDATA_PREFIX='/opt/homebrew/share/tessdata')
O=f'{T}/data/{name}'; os.makedirs(O+'/checkpoints',exist_ok=True); os.makedirs(H+f'/models/{name}',exist_ok=True)
proto=f'{O}/{name}.traineddata'
log=open(f'{H}/work/train-{name}.log','a'); res=[]
def run(cmd,**k): return subprocess.run(cmd,capture_output=True,text=True,env=env,cwd=T,**k)
t0=time.time()
for n in range(1000,maxit+1,1000):
    first = n==1000
    cmd=['lstmtraining','--debug_interval','0','--traineddata',proto,'--learning_rate',lr,
         '--model_output',f'{O}/checkpoints/{name}','--train_listfile',f'{O}/list.train','--eval_listfile',f'{O}/list.eval',
         '--max_iterations',str(n),'--target_error_rate','0.01']
    if first: cmd+=['--old_traineddata',H+'/models/Cyrillic.traineddata','--continue_from',f'{T}/data/Cyrillic/{name}.lstm']
    else: cmd+=['--continue_from',f'{O}/checkpoints/{name}_checkpoint']
    r=run(cmd); log.write(r.stdout+r.stderr); log.flush()
    ck=f'{O}/checkpoints/{name}_checkpoint'
    out=f'{H}/models/{name}/{name}_{n}.traineddata'
    r2=run(['lstmtraining','--stop_training','--continue_from',ck,'--traineddata',proto,'--model_output',out]); log.write(r2.stderr)
    e=run(['lstmeval','--verbosity=0','--model',out,'--eval_listfile',H+'/heldout_images/list.txt']); log.write(e.stdout+e.stderr)
    m=re.search(r'BCER eval=([\d.]+), BWER eval=([\d.]+)',e.stdout+e.stderr)
    lt=re.findall(r'BCER train=([\d.]+)',open(f'{O}/checkpoints/../training.log').read()) if os.path.exists(f'{O}/training.log') else []
    res.append(dict(iterations=n,heldout_bcer=float(m.group(1)) if m else None,heldout_bwer=float(m.group(2)) if m else None,seconds=round(time.time()-t0)))
    print(res[-1],flush=True); json.dump(res,open(f'{H}/work/train-{name}.json','w'))
