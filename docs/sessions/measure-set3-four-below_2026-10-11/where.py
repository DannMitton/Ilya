"""Row 77: page, system, and bar-in-system of each joined bar of an opened song's reading, from new-system marks and note heights."""
import re,sys
x=open(sys.argv[1]).read(); p=x[x.index('<part '):]; p=p[:p.index('</part>')]
ms=re.findall(r'<measure[\s\S]*?</measure>',p)
page=1; sysn=0; k=0; lasty=None; out=[]
for i,m in enumerate(ms):
    ys=[int(b) for a,b in re.findall(r'imgpos:\s*(\d+),\s*(\d+)',m)]
    if 'new-system' in m or i==0:
        y=min(ys) if ys else None
        if y is not None and lasty is not None and y < lasty: page+=1; sysn=0
        sysn+=1; k=0
        if y is not None: lasty=y
    k+=1; out.append((i,page,sysn,k))
want=set(map(int,sys.argv[2:]))
for i,pg,s,k in out:
    if not want or i in want: print(f'bar {i}: page {pg}, system {s}, bar {k}')
