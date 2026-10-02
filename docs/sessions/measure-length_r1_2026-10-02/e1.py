import collections,json
from join import joined
DOT={(3,8),(3,16),(3,32),(3,4),(3,2)}
def line_dist(d,s):
    m=d['halfsteps']%2; return min(m,2-m)/2   # staff spaces from the nearest line
def isdot(d,s,dmin=0.22,amin=0.07,cmin=0.65):
    return line_dist(d,s)>=dmin and d['area']>=amin and d['circ']>=cmin
def has_dot(h,**kw): return any(isdot(d,h['s'],**kw) for d in h.get('dots',[]))
if __name__=='__main__':
    T=collections.Counter()
    for n in (1,4,5,6,7):
        c=collections.Counter(); cur=collections.Counter()
        for r in joined(n):
            h=r['head']
            if not h: continue
            td=r['truth'] in DOT
            c[(td,has_dot(h))]+=1
            cur[(td,r['read'] is not None and r['read'][0]==3)]+=1
        print(n,'rule: dotted found %d of %d, plain given a dot %d of %d'%(c[(True,True)],c[(True,True)]+c[(True,False)],c[(False,True)],c[(False,True)]+c[(False,False)]),
              '| today: dotted read dotted %d of %d, plain read dotted %d of %d'%(cur[(True,True)],cur[(True,True)]+cur[(True,False)],cur[(False,True)],cur[(False,True)]+cur[(False,False)]))
