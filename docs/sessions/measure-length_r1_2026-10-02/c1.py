import collections,json,sys
from join import joined
from a1 import cls
FO=['0.65','0.75','0.85','1.05']
THR=0.08
def side_counts(h,thr=THR,lo=-0.6,hi=2.0):
    p=h['stem']['prof']; best=None
    for sd in 'RL':
        cs=[sum(1 for a,b in p[sd+o] if b>=thr and lo<=a<=hi) for o in FO]
        t=sum(cs)
        if best is None or t>best[0]: best=(t,sd,cs)
    return best[1],best[2]
def F(h,lmin=2.6):
    st=h['stem']
    if st is None or st['lengthb']<lmin: return None
    sd,cs=side_counts(h); s2=sorted(cs,reverse=True)[1]
    return s2
def dec(f): return {0:'quarter',1:'eighth',2:'sixteenth'}.get(f,'abstain') if f is not None else 'abstain'
if __name__=='__main__':
    for n in (1,4,5,6,7):
        rows=[r for r in joined(n) if r['head'] and not r['head']['hollow'] and r['head'].get('stem')]
        cm=collections.defaultdict(collections.Counter)
        for r in rows:
            c=cls(r['truth']).rstrip('.'); cm[c][dec(F(r['head']))]+=1
        print('song',n,{c:dict(v) for c,v in cm.items()})
