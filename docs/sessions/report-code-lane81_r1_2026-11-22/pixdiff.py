# Pixel diff between documents, region by region (sheet px; pictures are 2x). Grey difference > 40 counts. python3 pixdiff.py before|after
import sys,itertools
from PIL import Image, ImageChops
import numpy as np
which=sys.argv[1]; D=['text','markup','insights']; N={'text':'TEXT','markup':'MELODY','insights':'INSIGHTS'}
REG={'running header band (y 0-80)':(0,80),'footer band (y 925-1056)':(925,1056),'whole sheet':(0,1056)}
def load(doc,sc,lang,p,w):
    return np.asarray(Image.open(f'pics/{which}-{doc}-{sc}-{lang}-p{p}-{w}.png').convert('L'),dtype=int)
def bbox(m):
    ys,xs=np.nonzero(m)
    if len(ys)==0: return None
    return (xs.min()//2,ys.min()//2,xs.max()//2,ys.max()//2)
for sc,p,regs in [('score',2,['running header band (y 0-80)','footer band (y 925-1056)']),('blank',1,['footer band (y 925-1056)']),('score',1,['footer band (y 925-1056)'])]:
  for lang in ['en','fr']:
    for w in [1024,390]:
      for a,b in itertools.combinations(D,2):
        try: A=load(a,sc,lang,p,w);B=load(b,sc,lang,p,w)
        except FileNotFoundError: continue
        for r in regs:
            y0,y1=REG[r]; h=min(A.shape[0],B.shape[0])
            m=np.abs(A[y0*2:min(y1*2,h)]-B[y0*2:min(y1*2,h)])>40
            bb=bbox(m)
            if bb: bb=(bb[0],bb[1]+y0,bb[2],bb[3]+y0)
            print(f'{sc} p{p} {lang} {w} {N[a]} vs {N[b]} | {r} | {int(m.sum())} px | bbox {bb} | size {A.shape}/{B.shape}')
