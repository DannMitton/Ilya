# OFFLINE once, r2: the chosen rule applied by arithmetic to the notes the scorer matched. Nothing here is in the reader.
import collections,json,math
from fractions import Fraction as F
from join import joined
from p1 import joinedp,best_side
from a1 import cls
import rule
CUTK=['0.25','0.45','0.65','0.85']
def eqd(a): return math.sqrt(4*a/math.pi)
# dot bounds (staff spaces / s^2) and margins (pixels, or the unit named)
D_LINE=0.15; D_AREA=0.082; D_ASP=0.60; D_DX=1.02; D_DY=0.45
M_PX=1.5; M_ASP=0.05
def dot_status(h):
    if h is None: return 'plain'
    s=h['s']; st='plain'
    for d in h.get('dots',[]):
        m=d['halfsteps']%2; dl=min(m,2-m)/2
        asp=min(d['w'],d['h'])/max(d['w'],d['h']) if max(d['w'],d['h'])>0 else 0
        tests=[(dl-D_LINE)*s,(eqd(d['area'])-eqd(D_AREA))*s,(asp-D_ASP)/M_ASP*M_PX,(abs(d['dx'])-D_DX)*s,(D_DY-abs(d['dy']))*s]
        if min(tests)<-M_PX: continue
        if min(tests)<=M_PX: st='uncertain' if st!='dot' else st; continue
        return 'dot'
    return st
def cnt(cuts,tlo=-0.4,thi=2.0): return sorted([sum(1 for a,t in cuts[k] if tlo<=a<=thi) for k in CUTK],reverse=True)
def klass(h):
    k,c,why=rule.strokes(h)
    if k=='none': return 'quarter',''
    if k=='flag':
        cs=cnt(best_side(h)[2]['cuts']); mx,s2=cs[0],cs[1]
        if mx==1: return 'eighth',''
        if mx==2 and s2==2: return 'sixteenth',''
        return None,'stroke count'
    if k=='beam': return {1:'eighth',2:'sixteenth'}.get(c),'beam'
    return None,why
BASE={'quarter':F(1,4),'eighth':F(1,8),'sixteenth':F(1,16)}
def simulate(n):
    ro=joined(n); rp={r['id']:r for r in joinedp(n)}
    out=collections.Counter(); why=collections.Counter(); per=[]
    for r in ro:
        t=F(*r['truth']); cur=None if r['read'] is None else F(*r['read']); h=r['head']; hp=rp.get(r['id'],{}).get('head')
        new=cur; touched=False
        if h and not h['hollow'] and hp and not hp.get('short') and h.get('stem') and h['stem']['lengthb']>=2.6:
            c,w=klass(hp); ds=dot_status(h)
            touched=True
            if c is None: new=None; why[w or 'class']+=1
            elif ds=='uncertain': new=None; why['dot inside margin']+=1
            else: new=BASE[c]*(F(3,2) if ds=='dot' else 1)
        cr='right' if cur==t else ('abst' if cur is None else 'wrong')
        nr='right' if new==t else ('abst' if new is None else 'wrong')
        out['cur_'+cr]+=1; out['new_'+nr]+=1
        out['lost' if cr=='right' and nr!='right' else ('gained' if nr=='right' and cr!='right' else 'same')]+=1
        if cr=='wrong' and nr!='wrong' : out['wrong_removed']+=1
        if cr!='wrong' and nr=='wrong': out['wrong_added']+=1
    return out,why
if __name__=='__main__':
    for n in (1,4,5,6,7):
        o,w=simulate(n)
        print(n,'wrong',o['cur_wrong'],'->',o['new_wrong'],'| right',o['cur_right'],'->',o['new_right'],'| abstained',o['cur_abst'],'->',o['new_abst'],'| lost right',o['lost'],'wrong added',o['wrong_added'],'| why',dict(w))
