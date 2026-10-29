# Row 105 copy of map_boxes.py: only SRC changed (argv[1]), and crop-geometry.json is written to argv[2] instead of overwriting the desk's.
"""Maps the f6-h32-B readings' boxes back to page pixels. Regenerates each crop's geometry with row 117's own functions (clean.py), no re-reading."""
import sys, json, os, glob
sys.path.insert(0, '/Users/dannmitton/Downloads/_desk-row105/r4/mroot/n135-row117/scripts')
import numpy as np, cv2
import clean as C
SRC = sys.argv[1]; ROWS = '/Users/dannmitton/Downloads/_desk-row105/r4/mroot/n135-combined/work_framed/harness/rows2'; OUT = '/Users/dannmitton/Downloads/_desk-row105/r4/mroot/n135-combined/work_framed/harness/ocr2'
ang = json.load(open('/Users/dannmitton/Downloads/_desk-row105/r4/mroot/n135-row117/results/angles.json'))
SONGS = ['B01','B02','B03','B04','B06','B07','B08','B09','B10','S','T','K','M','U1','U4','U5','U6','P']
stats = []; bad = []
for L in SONGS:
    rows = [json.loads(l) for l in open(f'{ROWS}/{L}.jsonl')]; rd = json.load(open(f'{SRC}/{L}-dfloat.json')); out = []
    assert len(rows) == len(rd)
    for r, q in zip(rows, rd):
        assert (r['page'], r['system'], r['row']) == (q['page'], q['system'], q['row'])
        name = f"{L}-{r['page']}-s{r['system']}-r{r['row']}.png"
        g0 = C.load_grey(f'{C.CROPS}/{name}'); h, w = g0.shape; th = ang[name]['correction_deg']
        g = C.deskew(g0, th); g = C.close_ink(g, 3)
        e = C.ink_rows_extent(g)
        if e is None: nw, nh = w, h
        else:
            f = 32 / (e[1] - e[0] + 1); nw, nh = max(1, round(w * f)), max(1, round(h * f))
        FW, FH = nw + 32, nh + 32; sx, sy = nw / w, nh / h
        Minv = cv2.invertAffineTransform(cv2.getRotationMatrix2D((w / 2, h / 2), th, 1.0)) if th != 0 else None
        def back(x, y):
            x = (x - r['x0'] - 16) / sx; y = (y - r['y0'] - 16) / sy
            if Minv is not None: x, y = Minv[0, 0] * x + Minv[0, 1] * y + Minv[0, 2], Minv[1, 0] * x + Minv[1, 1] * y + Minv[1, 2]
            return x + r['x0'], y + r['y0']
        ws = []
        for wd in q['words']:
            x0, y0, x1, y1 = wd['bbox']
            if x1 - r['x0'] > FW + 1 or y1 - r['y0'] > FH + 1: bad.append((name, wd['text'], wd['bbox'], FW, FH))
            P = [back(x0, y0), back(x1, y0), back(x0, y1), back(x1, y1)]
            ws.append(dict(wd, bbox=[round(min(p[0] for p in P)), round(min(p[1] for p in P)), round(max(p[0] for p in P)), round(max(p[1] for p in P))], framed_bbox=wd['bbox']))
        out.append(dict(q, words=ws)); stats.append((name, w, h, th, FW, FH, round(sx, 4)))
    json.dump(out, open(f'{OUT}/{L}-dfloat.json', 'w'))
json.dump(stats, open(sys.argv[2], 'w'))
print('rows mapped', len(stats), 'boxes outside the regenerated frame', len(bad)); print(bad[:10])
sxs = [s[6] for s in stats]; print('scale min/median/max', min(sxs), sorted(sxs)[len(sxs)//2], max(sxs))
