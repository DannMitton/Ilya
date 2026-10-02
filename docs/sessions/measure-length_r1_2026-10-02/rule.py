# The chosen rule (offline form), r2. Every bound is a number in staff spaces.
import collections
from p1 import joinedp,best_side
from a1 import cls
Q_MAX=0.07      # at most this reach: no stroke (a quarter)
F_MIN=0.55      # at least this reach: a stroke
TRAVEL_MIN=1.0  # a flag travels back toward the head at least this far (tmax)
OUT=1.5         # a stroke that reaches this far runs on: a beam, or ink that is no flag
BEAM_THICK=0.38 # a beam bar is at least this thick at the far cuts
BUMP_MAX=0.25   # ink that runs on and is no thicker than this is a bump on a line, not a beam
CUTS=['0.45','0.65','0.85','1.05']
def strokes(h):
    """-> (kind, count) kind in 'none','flag','beam','abstain'"""
    if h is None or h.get('short'): return ('abstain',None,'no stem')
    b=best_side(h)
    if b is None or not b[2]['comps']: return ('none',0,'')
    comps=b[2]['comps']; top=max(comps,key=lambda c:c['area'])
    reach=top['reach']
    if len(comps)>=1 and reach<=Q_MAX: return ('none',0,'')
    cuts=b[2]['cuts']
    if reach>=OUT or top['runs_out']:
        th=[max([x[1] for x in cuts[k]],default=0) for k in ('0.85','1.05')]
        nr=sorted([len(cuts[k]) for k in ('0.85','1.05')],reverse=True)
        if min(th)>=BEAM_THICK: return ('beam',max(1,nr[-1]) if nr[-1]>0 else 1,'')
        if max(th)<=BUMP_MAX: return ('abstain',None,'bump')
        return ('abstain',None,'run-on')
    if reach<F_MIN: return ('abstain',None,'inside the margin')
    if top['tmax']<TRAVEL_MIN: return ('abstain',None,'short travel')
    cnt=sorted([len(cuts[k]) for k in CUTS],reverse=True)[1]
    if cnt in(1,2): return ('flag',cnt,'')
    return ('abstain',None,'stroke count %d'%cnt)
def decide(h):
    k,c,why=strokes(h)
    if k=='none': return 'quarter'
    if k in('flag','beam'): return {1:'eighth',2:'sixteenth'}.get(c,'abstain')
    return 'abstain'
if __name__=='__main__':
    for n in (1,4,5,6,7):
        cm=collections.defaultdict(collections.Counter)
        for r in joinedp(n):
            h=r['head']
            if not h: continue
            c=cls(r['truth']).rstrip('.')
            if c in('quarter','eighth','sixteenth'): cm[c][decide(h)]+=1
        print(n,{c:dict(v) for c,v in cm.items()})
