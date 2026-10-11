import pickle, os, json
import numpy as np
from PIL import Image, ImageDraw
from staff import load, lines_at, barlines, isbar
from voices import voices, song_of
allst = pickle.load(open('staves.pkl','rb'))
W = []
for name in sorted(allst):
    sts = allst[name]
    if not sts: continue
    g = load('pages_d/%s.png' % name)
    for vi in voices(name, len(sts)):
        st = sts[vi]; sp = st['space']
        bars = [b for b in barlines(g, st) if isbar(b)]
        bars = [b for b in bars if b['x0'] > st['x0'] + 1.5*sp]   # not the system's left line
        merged = []
        for b in bars:   # a double barline's strokes are one place: keep the rightmost
            if merged and b['x0'] - merged[-1]['x1'] <= 1.2*sp: merged[-1] = dict(b, x0=merged[-1]['x0'])
            else: merged.append(b)
        bars = merged
        W.append(dict(id=len(W), page=name, song=song_of(name), staff=vi, kind='start', x0=int(st['x0']), x1=int(st['x0']+15*sp), space=sp))
        for j, b in enumerate(bars):
            last = j == len(bars)-1
            W.append(dict(id=len(W), page=name, song=song_of(name), staff=vi, kind='bar', x0=int(b['x1']+1), x1=int(min(st['x1']+0.5*sp, b['x1']+4.5*sp)), space=sp, lastbar=last, tail=(st['x1']-b['x1'])/sp))
json.dump(W, open('windows.json','w'))
print(len(W), sum(w['kind']=='start' for w in W))
# sheets
os.makedirs('wsheets', exist_ok=True)
cache = {}
def crop(w):
    st = allst[w['page']][w['staff']]; sp = st['space']
    if w['page'] not in cache: cache.clear(); cache[w['page']] = load('pages_d/%s.png' % w['page'])
    g = cache[w['page']]
    L = lines_at(st, (w['x0']+w['x1'])/2)
    y0, y1 = int(L[0]-1.5*sp), int(L[4]+1.5*sp)
    x0 = max(0, w['x0'] - int(0.5*sp)) if w['kind']=='bar' else max(0, w['x0']-int(0.5*sp))
    im = Image.fromarray(g[y0:y1, x0:w['x1']])
    sc = 12/sp
    return im.resize((max(1,int(im.width*sc)), max(1,int(im.height*sc))))
for kind, per_row, cw in [('start', 6, 190), ('bar', 16, 70)]:
    ws = [w for w in W if w['kind']==kind]
    rows_per = 12 if kind=='start' else 14
    n = per_row*rows_per
    for k in range(0, len(ws), n):
        sh = Image.new('L', (per_row*cw, rows_per*104), 255); d = ImageDraw.Draw(sh)
        for i, w in enumerate(ws[k:k+n]):
            c = crop(w); x, y = (i % per_row)*cw, (i//per_row)*104
            sh.paste(c, (x, y+14)); d.text((x+1, y), str(w['id']), fill=0)
        sh.save('wsheets/%s-%02d.png' % (kind, k//n))
print(sorted(os.listdir('wsheets')))
