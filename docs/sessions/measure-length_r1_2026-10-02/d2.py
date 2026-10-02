import collections,json,sys
from join import joined
from a1 import cls
FAR=['0.55','0.65','0.75','0.85','1.05']
CNT=['0.55','0.65','0.75','0.85']
def runs(h,sd,ok,minpx,thi=2.2,tlo=-0.6):
    s=h['s']; out=[]
    for tmin,th in h['stem']['prof'][sd+ok]:
        if tlo<=tmin<=thi and th*s>=minpx-1e-9: out.append((tmin,th))
    return out
def measure(h,minpx=2,cmin=0.12):
    st=h['stem']
    if st is None or st['lengthb']<2.6: return None
    best=None
    for sd in 'RL':
        E=sum(1 for ok in FAR if runs(h,sd,ok,minpx,1.6))
        cs=[len(runs(h,sd,ok,max(2,cmin*h['s']),2.2)) for ok in CNT]
        c2=sorted(cs,reverse=True)[1]
        if best is None or E>best[0]: best=(E,c2,sd)
    return best
def decide(m,qmax=1,fmin=3):
    if m is None: return 'abstain'
    E,c2,sd=m
    if E<=qmax: return 'quarter'
    if E<fmin: return 'abstain'
    return {1:'eighth',2:'sixteenth'}.get(c2,'abstain')
if __name__=='__main__':
    for qmax,fmin in ((0,3),(1,3),(1,4),(2,4)):
        print('qmax',qmax,'fmin',fmin)
        for n in (1,4,5,6,7):
            rows=[r for r in joined(n) if r['head'] and not r['head']['hollow'] and r['head'].get('stem')]
            cm=collections.defaultdict(collections.Counter)
            for r in rows:
                c=cls(r['truth']).rstrip('.')
                if c in('quarter','eighth','sixteenth'): cm[c][decide(measure(r['head']),qmax,fmin)]+=1
            wrong=sum(v for c,d in cm.items() for k,v in d.items() if k not in(c,'abstain'))
            print('  song',n,'wrong',wrong,{c:dict(v) for c,v in cm.items()})
