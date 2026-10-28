"""N.135 stage 2a step 4: attributes the differences between frameRow and the harness reading of xcheck_frame.py to its three settings, one at a time and all together.
The three settings: the rotation border white (255) against the paper tone; the sweep mask padded 120 px against the crop's height; the paper tone for the padding taken after the scale against before.
Run from this folder: python3 attrib_frame_harness.py"""
import json, os, subprocess, sys, tempfile
import numpy as np, cv2
HERE = os.path.dirname(os.path.abspath(__file__))
src = open(f'{HERE}/xcheck_frame.py', encoding='utf8').read().split('crops = [make(i)')[0]
exec(src)
crops = [make(i) for i in range(200)]
tmp = tempfile.mkdtemp(); fin, fout = f'{tmp}/in.json', f'{tmp}/out.json'
json.dump([dict(w=c.shape[1], h=c.shape[0], data=c.ravel().tolist()) for c in crops], open(fin, 'w'))
subprocess.run(['node', '--import', f'{HERE}/ts-register.mjs', f'{HERE}/xcheck_frame.mjs', fin, fout], check=True)
got = json.load(open(fout))
def oracle2(g, white, pad120, paper_after, ink_height=32, pad_ratio=0.5):
    h, w = g.shape; paper = int(np.argmax(np.bincount(g.ravel(), minlength=256)))
    mask = np.pad((g < 128).astype(np.uint8) * 255, (((120, 120) if pad120 else (h, h)), (0, 0))); mh = mask.shape[0]; best, bestv = 0.0, None
    order = [0.0]
    for k in range(1, 31): order += [k / 10, -k / 10]
    for a in order:
        r = mask if a == 0 else cv2.warpAffine(mask, cv2.getRotationMatrix2D((w / 2, mh / 2), a, 1.0), (w, mh), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
        v = float(r.astype(np.float64).sum(axis=1).var())
        if bestv is None or v > bestv: bestv, best = v, a
    lev = g.copy() if best == 0 else cv2.warpAffine(g, cv2.getRotationMatrix2D((w / 2, h / 2), best, 1.0), (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=255 if white else paper)
    k3 = np.ones((3, 3), np.uint8); closed = 255 - cv2.erode(cv2.dilate(255 - lev, k3), k3)
    per = (closed < 128).sum(axis=1); tot = per.sum(); out = closed
    if tot > 0:
        cum = np.cumsum(per); r02 = int(np.argmax(cum >= 0.02 * tot)); r98 = int(np.argmax(cum >= 0.98 * tot)); out = cv2.resize(closed, None, fx=ink_height / (r98 - r02 + 1), fy=ink_height / (r98 - r02 + 1), interpolation=cv2.INTER_CUBIC)
    fill = int(np.argmax(np.bincount(out.ravel(), minlength=256))) if paper_after else paper
    pad = int(round(pad_ratio * ink_height)); return cv2.copyMakeBorder(out, pad, pad, pad, pad, cv2.BORDER_CONSTANT, value=fill), best, paper
def count(white, pad120, paper_after):
    rows = set(); size = 0; angle = 0
    for i, (c, r) in enumerate(zip(crops, got)):
        o, a, _ = oracle2(c, white, pad120, paper_after)
        if o.shape != (r['h'], r['w']): size += 1; rows.add(i); continue
        if abs(a - r['angle']) > 1e-9: angle += 1
        d = np.abs(o.astype(int) - np.array(r['data'], dtype=int).reshape(o.shape))
        if float((d > 1).mean()) > 0.005: rows.add(i)
    return len(rows), size, angle
print('rows differing from frameRow (any of: size, or more than 1 grey level in more than 0.5% of pixels), of 200; size differs; angle differs')
for name, args in (('none of the three (the text reading)', (0, 0, 0)), ('rotation border white only', (1, 0, 0)), ('sweep pad 120 only', (0, 1, 0)), ('paper tone after the scale only', (0, 0, 1)), ('all three (the harness reading)', (1, 1, 1))):
    print(f'  {name}: {count(*args)}')
# the size mismatches
for i in range(200):
    o, a, p = oracle2(crops[i], 1, 1, 1)
    if o.shape != (got[i]['h'], got[i]['w']):
        g = crops[i]; print(f'  row {i}: crop {g.shape}, paper {p}, oracle (harness) {o.shape} angle {a}, frameRow {(got[i]["h"], got[i]["w"])} angle {got[i]["angle"]}, ink pixels <128: {(g < 128).sum()}, row 0 of the crop: {np.unique(g[0])[:5]}')
