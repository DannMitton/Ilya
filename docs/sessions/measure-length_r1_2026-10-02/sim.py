# OFFLINE arithmetic only: what the measures would say if applied, scored against the truth pairs. Nothing here is in the reader.
import collections,json
from fractions import Fraction as F
from join import joined
from a1 import cls
import b3, e1
BASE={'quarter':F(1,4),'eighth':F(1,8),'sixteenth':F(1,16)}
def simulate(n):
    rows=joined(n); out=collections.Counter(); per=[]
    for r in rows:
        t=F(*r['truth']); cur=None if r['read'] is None else F(*r['read']); h=r['head']
        curok=(cur==t)
        new=cur; kind='unchanged'
        if h and not h['hollow'] and h.get('stem') and h['stem']['lengthb']>=2.6:
            d=b3.dec(b3.S2(b3.counts(h,n,1.0)))
            if d in BASE:
                new=BASE[d]*(F(3,2) if e1.has_dot(h) else 1); kind='shape'
            else: new=None; kind='abstain'
        newok=(new==t)
        out[('cur_right' if curok else ('cur_abst' if cur is None else 'cur_wrong'))]+=1
        out[('new_right' if newok else ('new_abst' if new is None else 'new_wrong'))]+=1
        out[('lost' if curok and not newok else ('gained' if newok and not curok else 'same'))]+=1
    return out
if __name__=='__main__':
    for n in (1,4,5,6,7):
        o=simulate(n); print(n,dict(o))
