import json,collections,sys
from join import joined
from a1 import cls
from a2 import strokes
def S(h,theta=0.2):
    sd,c=strokes(h,theta); return max(c[:4]),sd,c
if __name__=='__main__':
    tot=collections.Counter()
    exc=[]
    for n in (1,4,5,6,7):
        rows=[r for r in joined(n) if r['head'] and not r['head']['hollow'] and r['head'].get('stem')]
        tab=collections.defaultdict(collections.Counter)
        for r in rows:
            c=cls(r['truth']).rstrip('.'); s,sd,cc=S(r['head'])
            tab[c][s]+=1
            want={'quarter':0,'eighth':1,'sixteenth':2}.get(c)
            if want is not None and s!=want: exc.append((n,r['id'],c,s,cc,r['truth'],r['read']))
        print(n,{k:dict(v) for k,v in tab.items()})
    print(len(exc))
    json.dump(exc,open('a3_exceptions.json','w'))
