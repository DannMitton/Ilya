"""Row 80, step 2: the words Tesseract found under given bars, from the whole-page run and the band run.
The bars' span: from 80 px left of their first read note to 80 px right of their last; the band: the system's underlay band.
Usage: python3 step2.py <words dir> <letter> <page> <bar a-b>"""
import json,sys
WD,L,page,bars=sys.argv[1],sys.argv[2],int(sys.argv[3]),sys.argv[4]; a,b=map(int,bars.split('-'))
ns=[json.loads(l) for l in open(f'{L}.notes.jsonl')]
sel=[n for n in ns if n['page']==page and a<=n['bar']<=b]
band=next(json.loads(l) for l in open(f'{L}.systems.jsonl') if json.loads(l)['page']==page and json.loads(l)['bars'][0]<=a<=json.loads(l)['bars'][1])
x0=min(n['x'] for n in sel)-80; x1=max(n['x'] for n in sel)+80
def inside(w): bx=w['bbox']; return bx[1]>=band['y0']-10 and bx[3]<=band['y1']+10 and bx[2]>=x0 and bx[0]<=x1 and any(c.isalpha() for c in w['text'])
for kind,f in [('page',f"{WD}/page-{L}-{page}.json"),('band',f"{WD}/band-{L}-{page}-s{band['system']}.json")]:
    try: ws=[w for w in json.load(open(f)) if inside(w)]
    except FileNotFoundError: print(f'  {kind}: no run'); continue
    rows={}
    for w in sorted(ws,key=lambda w:(w['bbox'][1]+w['bbox'][3])/2):
        y=(w['bbox'][1]+w['bbox'][3])/2; k=next((r for r in rows if abs(r-y)<35),y); rows.setdefault(k,[]).append(w)
    print(f'  {kind}:')
    for k in sorted(rows): print('    '+'  '.join(f"{w['text']}[{w['script'][0]}{w['conf']}]" for w in sorted(rows[k],key=lambda w:w['bbox'][0])))
