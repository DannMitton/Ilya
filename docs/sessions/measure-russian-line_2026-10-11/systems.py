"""Row 80: for every page of a song, the systems that hold read notes (note heights clustered, a gap over 600 px splits),
and under each system's voice staff its underlay band, from the staff lines across 500 px at the middle of that system's notes.
Writes <out>/<L>-<page>-s<k>.png crops and prints JSON lines: page, system, bars, staff, band.
Usage: /usr/bin/python3 systems.py <letter> <raster prefix> <out dir> [cover pages before the first page read]"""
import sys,json,statistics,os
from PIL import Image
L,pref,od=sys.argv[1:4]; off=int(sys.argv[4]) if len(sys.argv)>4 else 0  # covers the reader leaves out
ns=[json.loads(l) for l in open(f'{L}.notes.jsonl')]
for page in sorted({n['page'] for n in ns}):
    im=Image.open(f'{pref}-{page+off}.png').convert('L'); W,H=im.size; px=im.load()
    paper=statistics.median(px[x,y] for x in range(0,W,37) for y in range(0,H,37)); ink=paper-60  # grey paper (M) or white
    pn=sorted([n for n in ns if n['page']==page],key=lambda n:n['y'])
    groups=[]
    for n in pn:
        if groups and n['y']-groups[-1][-1]['y']<600: groups[-1].append(n)
        else: groups.append([n])
    for k,g in enumerate(groups,1):
        mx=int(statistics.median(n['x'] for n in g)); x0=max(0,mx-250); x1=min(W,mx+250); ww=x1-x0  # narrow: a rotated scan smears a long line over rows
        lines=[]
        for y in range(H):
            d=sum(1 for x in range(x0,x1,2) if px[x,y]<ink)*2
            if d>0.4*ww:
                if lines and y-lines[-1][-1]<=2: lines[-1].append(y)
                else: lines.append([y])
        lines=[sum(l)/len(l) for l in lines]
        staffs=[]; i=0
        while i+4<len(lines):
            s=lines[i:i+5]; gaps=[s[j+1]-s[j] for j in range(4)]
            if max(gaps)-min(gaps)<=max(5,0.3*min(gaps)) and min(gaps)>12: staffs.append(s); i+=5
            else: i+=1
        my=statistics.median(n['y'] for n in g)
        if not staffs: print(json.dumps(dict(page=page,system=k,error='no staff found'))); continue
        j=min(range(len(staffs)),key=lambda j:abs((staffs[j][0]+staffs[j][4])/2-my)); s=staffs[j]; sp=(s[4]-s[0])/4
        nxt=staffs[j+1][0] if j+1<len(staffs) else min(H,s[4]+20*sp)
        b=dict(page=page,system=k,bars=[min(n['bar'] for n in g),max(n['bar'] for n in g)],staffTop=round(s[0]),staffBottom=round(s[4]),space=round(sp,1),y0=int(s[4]+1.5*sp),y1=int(nxt-1.5*sp),x0=0,x1=W)
        if b['y1']-b['y0']<40: b['error']='band too thin'
        else: im.crop((b['x0'],b['y0'],b['x1'],b['y1'])).save(f"{od}/{L}-{page}-s{k}.png")
        print(json.dumps(b))
