import collections,json
from join import joined
from a1 import cls
from b1 import LT
import b3
TH=0.2
def info(h,n):
    lt,s=LT[(n,h['page'])]; best=None
    for sd in 'RL':
        per=[];tot=0
        for o in b3.OFFS:
            rr=[(ra,rb,th) for ra,rb,tmin,th in b3.runs_abs(h,sd,o) if -0.6<=tmin<=2.0 and not b3.is_residue(h,ra,rb,lt)]
            per.append(rr); tot+=sum(th for _,_,th in rr if th>=TH)
        if best is None or tot>best[0]: best=(tot,sd,per)
    return best[2],s
def M2(per,s):
    mx=sorted([max([th for _,_,th in rr],default=0) for rr in per],reverse=True); return mx[1]*s
if __name__=='__main__':
    L=[]
    for n in (1,4,5,6,7):
        rows=[r for r in joined(n) if r['head'] and not r['head']['hollow'] and r['head'].get('stem')]
        for r in rows:
            h=r['head']; c=cls(r['truth']).rstrip('.')
            if h['stem']['length']<2.8: L.append((n,r['id'],c,'short stem %.2f'%h['stem']['length'],None,r['truth'],r['read'])); continue
            per,s=info(h,n); m=M2(per,s)
            if (c=='quarter' and m>=3) or (c in('eighth','sixteenth') and m<=10): L.append((n,r['id'],c,round(m,1),None,r['truth'],r['read']))
    print(len(L)); json.dump(L,open('b4_list.json','w'))
    import collections
    print(collections.Counter((e[0],e[2],isinstance(e[3],str)) for e in L))
