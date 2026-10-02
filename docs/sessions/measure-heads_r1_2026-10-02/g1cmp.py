import json, sys
d=json.load(open(sys.argv[1]))
desk={('tch-1',0):[0,0,0,0,0,0,0,1,3],('tch-1',1):[2,1,2,1,3,3,2,3,2],('tch-1',2):[1,2,1,3,3,1,1,3,2],
('tch-2',0):[1,2,1,3,3,2,3,2,1],('tch-2',1):[2,1,3,3,1,1,3,3],('tch-2',2):[2,1,3,3,1,1,3,3,2],('tch-2',3):[1,3,3,1,1,1,3,3,0],
('tch-3',0):[2,1,3,3,2,3,3,0],('tch-3',1):[2,1,3,3,1,1,3,3,2],('tch-3',2):[3,3,3,1,0,1,3,3,2],('tch-3',3):[1,3,3,1,1,0,0,0,0,0,0]}
tot=eq=off2=heads=0
for (p,s),dl in desk.items():
    read=[0]*len(dl)
    for h in d:
        if h.get('meta'): continue
        if h['page']==p and h['sys']==s: read[min(h['bar'],len(dl)-1)]+=1
    for i,(a,b) in enumerate(zip(read,dl)):
        tot+=1; eq+=(a==b); off2+=(abs(a-b)>1)
        if a!=b: print('  unequal',p,s+1,'bar',i+1,'desk',b,'read',a)
    heads+=sum(read)
print('bars equal',eq,'of',tot,'off by >1',off2,'heads',heads)
for h in d:
    if h.get('meta'): print(h['page'],'hooks',h['hooks'],'alts',len(h['alts']),'hollow kept',h['hollow_kept'],'heads',h['nheads'],'measures',h['nmeasures'])
