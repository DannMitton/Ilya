import pickle, os, sys
import numpy as np
from PIL import Image, ImageDraw
from staff import load, lines_at, barlines, isbar
from voices import voices
allst = pickle.load(open('staves.pkl','rb'))
os.makedirs('strips', exist_ok=True)
sel = sys.argv[1:]
rows = []
for name in sorted(allst):
    if sel and not any(name.startswith(s) for s in sel): continue
    sts = allst[name]
    if not sts: continue
    g = load('pages_d/%s.png' % name)
    for vi in voices(name, len(sts)):
        st = sts[vi]; sp = st['space']
        bl = barlines(g, st)
        L = lines_at(st, (st['x0']+st['x1'])/2)
        y0, y1 = int(L[0]-3*sp), int(L[4]+3*sp)
        x0, x1 = max(0, st['x0']-int(2*sp)), min(g.shape[1], st['x1']+int(2*sp))
        im = Image.fromarray(g[y0:y1, x0:x1]).convert('RGB'); d = ImageDraw.Draw(im)
        for b in bl:
            ok = isbar(b)
            c = (0,160,0) if ok else (255,0,0)
            d.rectangle([b["x0"]-x0-2, int(2.2*sp), b["x1"]-x0+2, int(2.9*sp)], fill=c)
        sc = 1800 / im.width
        im = im.resize((1800, max(1,int(im.height*sc))))
        ImageDraw.Draw(im).text((2,2), '%s s%d' % (name, vi), fill=(0,0,255))
        rows.append(im)
k = 0
for i in range(0, len(rows), 14):
    ch = rows[i:i+14]; H = sum(r.height for r in ch)
    sh = Image.new('RGB', (1800, H), 'white'); y = 0
    for r in ch: sh.paste(r, (0, y)); y += r.height
    sh.save('strips/%s-%02d.png' % ('_'.join(sel) or 'all', k)); k += 1
print(len(rows), k)
