import json,collections
from join import joined
def cls(t):
    if t is None: return None
    n,d=t
    table={(1,4):'quarter',(3,8):'quarter.',(1,8):'eighth',(3,16):'eighth.',(1,16):'sixteenth',(3,32):'sixteenth.',(1,2):'half',(3,4):'half.'}
    return table.get((n,d),'other')
def side(h):
    p=h['stem']['prof']; 
    r=sum(len(v) for k,v in p.items() if k[0]=='R'); l=sum(len(v) for k,v in p.items() if k[0]=='L')
    return 'R' if r>=l else 'L'
OFFS=['0.10','0.25','0.45','0.65','0.85','1.05']
if __name__=='__main__':
    for n in (1,4,5,6,7):
        rows=[r for r in joined(n) if r['head'] and not r['head']['hollow'] and r['head'].get('stem')]
        tab=collections.defaultdict(list)
        for r in rows:
            h=r['head'];sd=side(h);p=h['stem']['prof']
            counts=tuple(len(p[sd+o]) for o in OFFS)
            tab[(cls(r['truth']).rstrip('.'))].append(counts)
        print('song',n,'filled matched with stem',len(rows))
        for c,l in sorted(tab.items()):
            cnt=collections.Counter(l)
            print('  ',c,len(l),sorted(cnt.items(),key=lambda kv:-kv[1])[:8])
