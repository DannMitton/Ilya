import json,collections,sys
from join import joined
from a1 import cls
from b1 import LT
OFFS=['0.25','0.45','0.65','0.85']
def S(h,n,k=1.0,lmin=2.8):
    st=h['stem']
    if st is None or st['length']<lmin: return None
    lt,s=LT[(n,h['page'])]; th=k*lt/s
    p=st['prof']; best=None
    for sd in 'RL':
        tot=sum(b for o in OFFS for a,b in p[sd+o] if b>=th and -0.6<=a<=2.0)
        if best is None or tot>best[0]: best=(tot,sd)
    sd=best[1]
    c=[sum(1 for a,b in p[sd+o] if b>=th and -0.6<=a<=2.0) for o in OFFS]
    return max(c)
def dec(s):
    return {0:'quarter',1:'eighth',2:'sixteenth'}.get(s,'abstain') if s is not None else 'abstain'
if __name__=='__main__':
    k=float(sys.argv[1]) if len(sys.argv)>1 else 1.0
    for n in (1,4,5,6,7):
        rows=[r for r in joined(n) if r['head'] and not r['head']['hollow'] and r['head'].get('stem')]
        cm=collections.defaultdict(collections.Counter)
        for r in rows:
            c=cls(r['truth']).rstrip('.')
            cm[c][dec(S(r['head'],n,k))]+=1
        print('song',n,{c:dict(v) for c,v in cm.items()})
