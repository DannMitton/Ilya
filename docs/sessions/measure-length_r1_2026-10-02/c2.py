import collections,json,sys
from join import joined
from a1 import cls
from b1 import LT
import b3
OFFV=[0.10,0.25,0.45,0.55,0.65,0.75,0.85,1.05]
OFFK=['0.10','0.25','0.45','0.55','0.65','0.75','0.85','1.05']
def runs_at(h,sd,ok,lt,minth_px=2.0):
    st=h['stem']; tip=st['tip']; d=st['dir']; s=h['s']; out=[]
    for tmin,th in st['prof'][sd+ok]:
        if not (-0.6<=tmin<=2.2): continue
        rowNear=tip-d*tmin*s; n=max(1,int(round(th*s)))
        rows=[rowNear+(-d)*j for j in range(n)]
        ra,rb=min(rows),max(rows)
        if n<minth_px: continue
        if b3.is_residue(h,ra,rb,lt): continue
        out.append((ra,rb))
    return out
def chains(h,n,sd,tol=4,minth=2.0):
    lt=LT[(n,h['page'])][0]
    allruns=[runs_at(h,sd,ok,lt,minth) for ok in OFFK]
    ch=[]  # each: dict(last=index, rows=(ra,rb), start=index)
    live=[]
    # start chains at the first two offsets only (attached to the stem)
    for i,runs in enumerate(allruns):
        newlive=[]
        used=set()
        for c in live:
            # extend to a run overlapping within tol
            best=None
            for j,(ra,rb) in enumerate(runs):
                if j in used: continue
                if ra<=c['rows'][1]+tol and rb>=c['rows'][0]-tol:
                    best=j;break
            if best is not None:
                used.add(best); c['rows']=runs[best]; c['last']=i; newlive.append(c)
        if i<=1:
            for j,r in enumerate(runs):
                if j not in used: newlive.append(dict(start=i,last=i,rows=r))
        # chains not extended are finished
        for c in live:
            if c not in newlive: ch.append(c)
        live=newlive
    ch+=live
    return ch
def strokes(h,n,minth=2.0):
    st=h['stem']
    if st is None or st['lengthb']<2.6: return None
    best=None
    for sd in 'RL':
        cs=chains(h,n,sd,minth=minth)
        # number reaching offset index of 0.65 (index 4)
        k=sum(1 for c in cs if c['last']>=4)
        reach=max([OFFV[c['last']] for c in cs],default=0)
        if best is None or (k,reach)>(best[0],best[1]): best=(k,reach,sd)
    return best
def dec(k): return {0:'quarter',1:'eighth',2:'sixteenth'}.get(k,'abstain') if k is not None else 'abstain'
if __name__=='__main__':
    for n in (1,4,5,6,7):
        rows=[r for r in joined(n) if r['head'] and not r['head']['hollow'] and r['head'].get('stem')]
        cm=collections.defaultdict(collections.Counter)
        for r in rows:
            c=cls(r['truth']).rstrip('.'); b=strokes(r['head'],n); cm[c][dec(None if b is None else b[0])]+=1
        print('song',n,{c:dict(v) for c,v in cm.items()})
