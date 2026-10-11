import glob, os, subprocess, sys, json
R=os.path.expanduser('~/Desktop/ilya-rewrite'); H=os.path.dirname(os.path.abspath(__file__))
LINE=f'{R}/docs/sessions/measure-final-test_r1_2026-10-08/final-line.ts'
base=os.path.expanduser('~/Downloads/_desk-2026-10-08/heldout2'); scans=sorted(glob.glob(base+'-scans/*.pdf')); L=dict(zip('GHIJKLMNOP',scans))
tag=sys.argv[1]
for l in sys.argv[2:]:
    stem=os.path.basename(L[l])[:-4]; t=base+'-truth-r2/truth/'+stem
    ts=[('original',t+'.truth.json')]
    if os.path.exists(t+'.truth.corrected.json'): ts.append(('corrected',t+'.truth.corrected.json'))
    elif l=='M': ts.append(('corrected',t+'.truth.json'))
    be=json.load(open(f'{H}/{tag}/drops/{l}.json'))['backend']
    for n,p in ts:
        k=f'/tmp/_r74keep'; os.makedirs(k,exist_ok=True)
        r=subprocess.run(['node','--experimental-strip-types','--no-warnings',LINE,'song',l,be,p,f'{H}/{tag}/{l}.read.json',k],capture_output=True,text=True,cwd=R)
        print(f'{n}: '+r.stdout.strip())
