import json,collections,sys
from join import joined
from a1 import cls
from b1 import LT
OFFS=['0.25','0.45','0.65','0.85']
def runs_abs(h,sd,o):
    st=h['stem']; tip=st['tip']; d=st['dir']; s=h['s']
    out=[]
    for tmin,th in st['prof'][sd+o]:
        rowNear=tip-d*tmin*s; n=max(1,int(round(th*s)))
        rows=[rowNear+(-d)*j for j in range(n)]
        out.append((min(rows),max(rows),tmin,th))
    return out
def is_residue(h,ra,rb,ltpx,pad=1.5):
    for y in h['lines']:
        if ra>=y-(ltpx/2+pad) and rb<=y+(ltpx/2+pad): return True
    return False
def counts(h,n,thmin=0.6,lmin=2.8,winlo=-0.6,winhi=2.0):
    st=h['stem']
    if st is None or st['length']<lmin: return None
    lt,s=LT[(n,h['page'])]; best=None; res={}
    for sd in 'RL':
        cs=[];tot=0
        for o in OFFS:
            c=0
            for ra,rb,tmin,th in runs_abs(h,sd,o):
                if not (winlo<=tmin<=winhi): continue
                if is_residue(h,ra,rb,lt): continue
                if th>=thmin*lt/s: c+=1; tot+=th
            cs.append(c)
        res[sd]=(tot,cs)
    sd='R' if res['R'][0]>=res['L'][0] else 'L'
    return res[sd][1]
def S2(c):
    if c is None: return None
    s=sorted(c,reverse=True); return s[1]
def dec(s): return {0:'quarter',1:'eighth',2:'sixteenth'}.get(s,'abstain') if s is not None else 'abstain'
if __name__=='__main__':
    th=float(sys.argv[1]) if len(sys.argv)>1 else 0.6
    for n in (1,4,5,6,7):
        rows=[r for r in joined(n) if r['head'] and not r['head']['hollow'] and r['head'].get('stem')]
        cm=collections.defaultdict(collections.Counter)
        for r in rows:
            c=cls(r['truth']).rstrip('.'); cm[c][dec(S2(counts(r['head'],n,th)))]+=1
        print('song',n,{c:dict(v) for c,v in cm.items()})
