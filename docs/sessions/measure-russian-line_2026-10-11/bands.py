"""Row 80: the underlay band under the voice staff of one system, found from the staff lines across the bars' own width
(a scan's slight rotation hides full-width lines). Staff lines: rows where more than 50% of the window is dark, grouped into
staffs of five. The voice staff is the staff nearest the median imgpos y of the bars' notes. Its band runs from 1.5 staff
spaces below its bottom line to 1.5 above the next staff's top line, across the window widened by 300 px each side.
Usage: /usr/bin/python3 bands.py <letter> <page png> <page> <bars a-b> <out png>  -> prints the band as JSON"""
import sys,json,statistics
from PIL import Image
L,png,page,bars,outp=sys.argv[1:6]; page=int(page); a,b=map(int,bars.split('-'))
im=Image.open(png).convert('L'); W,H=im.size; px=im.load()
ns=[json.loads(l) for l in open(f'{L}.notes.jsonl')]
sel=[n for n in ns if n['page']==page and a<=n['bar']<=b]
x0=max(0,min(n['x'] for n in sel)-60); x1=min(W,max(n['x'] for n in sel)+60); ww=x1-x0
dark=[sum(1 for x in range(x0,x1) if px[x,y]<140) for y in range(H)]
lines=[]
for y in range(H):
    if dark[y]>0.5*ww:
        if lines and y-lines[-1][-1]<=2: lines[-1].append(y)
        else: lines.append([y])
lines=[sum(l)/len(l) for l in lines]
staffs=[]; i=0
while i+4<len(lines):
    g=lines[i:i+5]; gaps=[g[k+1]-g[k] for k in range(4)]
    if max(gaps)-min(gaps)<=max(5,0.3*min(gaps)) and min(gaps)>12: staffs.append(g); i+=5
    else: i+=1
my=statistics.median(n['y'] for n in sel)
k=min(range(len(staffs)),key=lambda k:abs((staffs[k][0]+staffs[k][4])/2-my))
s=staffs[k]; sp=(s[4]-s[0])/4; nxt=staffs[k+1][0] if k+1<len(staffs) else H
band=dict(page=page,bars=bars,staffTop=round(s[0]),staffBottom=round(s[4]),space=round(sp,1),y0=int(s[4]+1.5*sp),y1=int(nxt-1.5*sp),x0=max(0,x0-300),x1=min(W,x1+300))
im.crop((band['x0'],band['y0'],band['x1'],band['y1'])).save(outp)
print(json.dumps(band))
