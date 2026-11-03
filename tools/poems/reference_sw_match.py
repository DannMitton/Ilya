"""Reference matcher for the poem library (desk, 2026-11-03). Letters only, Smith-Waterman +2/-1/-2,
score = best local score / (2 x query letters). Threshold 0.15, margin 0.10 (report-desk-poem-threshold_r1).
Usage: python3 reference_sw_match.py library.json lyrics.txt ..."""
import json,glob,os,sys,re
import numpy as np
FOLD=str.maketrans({'ѣ':'е','і':'и','ѳ':'ф','ѵ':'и','ё':'е','й':'и','ъ':''})
def letters(t):
    t=t.lower().translate(FOLD); return re.sub(r'[^а-я]','',t)
def sw(q,p,M=2,X=-1,G=2):
    qa=np.frombuffer(q.encode('utf-32-le'),dtype=np.uint32); pa=np.frombuffer(p.encode('utf-32-le'),dtype=np.uint32)
    n=len(pa); H=np.zeros(n+1); best=0; ar=np.arange(n+1)*G
    for c in qa:
        s=np.where(pa==c,M,X)
        Xv=np.zeros(n+1); Xv[1:]=np.maximum(H[:-1]+s, H[1:]-G); Xv=np.maximum(Xv,0)
        Hn=np.maximum.accumulate(Xv+ar)-ar
        H=np.maximum(Hn,0); best=max(best,H.max())
    return best/(M*len(qa))
def poem_letters(e): return letters(e['textModern'])
def work_key(e): return e['work']
if __name__=='__main__':
    lib=json.load(open(sys.argv[1]))['entries']; P={}
    for e in lib:
        k=work_key(e); P.setdefault(k,[]).append(poem_letters(e))
    for f in sys.argv[2:]:
        s=os.path.basename(f).split('.')[0]; q=letters(open(f).read())
        r=sorted(((max(sw(q,p) for p in ps),k) for k,ps in P.items()),reverse=True)
        print("%-4s %4dl | %-36s %.3f | %-26s %.3f | m %.3f"%(s,len(q),r[0][1][:36],r[0][0],r[1][1][:26],r[1][0],r[0][0]-r[1][0]),flush=True)
