import collections,json,sys
from join import joined
from a1 import cls
from b1 import LT
import b3
OFFK=['0.25','0.45','0.55','0.65','0.75','0.85','1.05']
STROKE_OFFK=['0.45','0.55','0.65','0.75','0.85']
def nonres_runs(h,n,sd,ok,minpx,thi=1.6):
    st=h['stem']; lt=LT[(n,h['page'])][0]; s=h['s']; tip=st['tip']; d=st['dir']; out=[]
    for tmin,th in st['prof'][sd+ok]:
        if not (-0.6<=tmin<=thi): continue
        npx=max(1,int(round(th*s)))
        if npx<minpx: continue
        rowNear=tip-d*tmin*s; rows=[rowNear+(-d)*j for j in range(npx)]
        if b3.is_residue(h,min(rows),max(rows),lt): continue
        out.append((min(rows),max(rows),th))
    return out
def measure(h,n,minpx=2,minpx_stroke=4):
    st=h['stem']
    if st is None or st['lengthb']<2.6: return None
    best=None
    for sd in 'RL':
        E=sum(1 for ok in OFFK if nonres_runs(h,n,sd,ok,minpx))
        cnts=[len(nonres_runs(h,n,sd,ok,minpx_stroke,2.2)) for ok in STROKE_OFFK]
        c2=sorted(cnts,reverse=True)[1]
        if best is None or E>best[0]: best=(E,c2,sd)
    return best
def decide(m,Elo=3,Ehi=4):
    if m is None: return 'abstain'
    E,c2,sd=m
    if E<=Elo-1: return 'quarter'      # E<=2
    if E<Ehi: return 'abstain'          # E==3
    return {1:'eighth',2:'sixteenth'}.get(c2,'abstain')
if __name__=='__main__':
    tot=collections.Counter()
    for n in (1,4,5,6,7):
        rows=[r for r in joined(n) if r['head'] and not r['head']['hollow'] and r['head'].get('stem')]
        cm=collections.defaultdict(collections.Counter)
        for r in rows:
            c=cls(r['truth']).rstrip('.'); cm[c][decide(measure(r['head'],n))]+=1
        print('song',n,{c:dict(v) for c,v in cm.items()})
