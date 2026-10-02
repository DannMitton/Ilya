import json,collections,sys
from join import joined
from a1 import cls
OFFS=['0.10','0.25','0.45','0.65','0.85','1.05']
def strokes(h,theta=0.2,tmax=2.0):
    p=h['stem']['prof']; best=None
    for sd in ('R','L'):
        tot=sum(b for o in OFFS for a,b in p[sd+o] if b>=theta and a<tmax)
        if best is None or tot>best[0]: best=(tot,sd)
    sd=best[1]
    counts=[]
    for o in OFFS:
        counts.append(sum(1 for a,b in p[sd+o] if b>=theta and -0.6<=a<=tmax))
    return sd,counts
if __name__=='__main__':
    theta=float(sys.argv[1]) if len(sys.argv)>1 else 0.2
    for n in (1,4,5,6,7):
        rows=[r for r in joined(n) if r['head'] and not r['head']['hollow'] and r['head'].get('stem')]
        tab=collections.defaultdict(collections.Counter)
        for r in rows:
            sd,c=strokes(r['head'],theta)
            tab[cls(r['truth']).rstrip('.')][tuple(c)]+=1
        print('song',n)
        for k,cn in sorted(tab.items()):
            print('  ',k,sum(cn.values()),cn.most_common(7))
