"""Row 80: every voice note of a joined reading with its imgpos, its joined bar, and the page it is on.
A page starts where a bar's notes stand more than 1500 px above the last placed note (homr's imgpos restart at each page's top).
Usage: python3 notes.py <musicxml>  -> JSON lines on stdout"""
import re,sys,json
x=open(sys.argv[1]).read(); p=x[x.index('<part '):]; p=p[:p.index('</part>')]
ms=re.findall(r'<measure[\s\S]*?</measure>',p)
page=1; last=None; out=[]
STEP={'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11}
for i,m in enumerate(ms):
    for n in re.findall(r'<note[\s>][\s\S]*?</note>',m):
        pos=re.search(r'imgpos:\s*(\d+),\s*(\d+)',n)
        if not pos: continue
        X,Y=int(pos[1]),int(pos[2])
        if last is not None and Y < last-1500: page+=1
        last=Y
        if '<rest' in n: continue
        st=re.search(r'<step>(\w)</step>',n)[1]; o=int(re.search(r'<octave>(\d)',n)[1]); a=re.search(r'<alter>(-?\d)',n)
        midi=(o+1)*12+STEP[st]+(int(a[1]) if a else 0)
        out.append(dict(bar=i,page=page,x=X,y=Y,midi=midi,type=re.search(r'<type>(\w+)',n)[1],voice=re.search(r'<voice>(\d)',n)[1],chord='<chord' in n))
for o in out: print(json.dumps(o))
