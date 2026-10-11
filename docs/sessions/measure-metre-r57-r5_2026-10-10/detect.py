import glob, json, os, sys
import numpy as np
from PIL import Image, ImageDraw
from staff import load, find_staves, lines_at, barlines
os.makedirs('ov', exist_ok=True)
res = {}
for f in sorted(glob.glob('pages_d/*.png')):
    name = os.path.basename(f)[:-4]
    g = load(f)
    sts = find_staves(g)
    im = Image.fromarray(g).convert('RGB'); d = ImageDraw.Draw(im)
    out = []
    for i, st in enumerate(sts):
        bl = barlines(g, st)
        L0 = lines_at(st, st['x0']); 
        d.rectangle([st['x0'], L0[0], st['x1'], L0[4]], outline=(255,0,0), width=4)
        d.text((st['x0']-60, L0[0]), str(i), fill=(255,0,0))
        for b in bl:
            L = lines_at(st, b['x0'])
            d.line([b['x0'], L[0]-15, b['x0'], L[4]+15], fill=(0,0,255), width=5)
        out.append({'i': i, 'x0': int(st['x0']), 'x1': int(st['x1']), 'space': st['space'], 'thick': st['thick'],
                    'top': float(L0[0]), 'bars': [[b['x0'], b['x1']] for b in bl]})
    res[name] = out
    im.resize((im.width//4, im.height//4)).save('ov/%s.png' % name)
    print(name, len(sts), [ (o['i'], round(o['space'],1), o['x0'], o['x1'], len(o['bars'])) for o in out])
json.dump(res, open('staves.json','w'))
