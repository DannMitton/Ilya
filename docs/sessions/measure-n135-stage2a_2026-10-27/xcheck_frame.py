"""N.135 stage 2a step 3: cross-check frameRow against an independent oracle of the desk's four steps, written from the task text with OpenCV (cv2.getRotationMatrix2D and warpAffine, cv2.dilate and cv2.erode, cv2.resize INTER_CUBIC, cv2.copyMakeBorder), on 200 seeded synthetic rows.
Reports the rows whose framed crop differs from the oracle's by more than 1 grey level in more than 0.5 percent of its pixels, and whose size or angle differs.
Usage: python3 xcheck_frame.py   (needs numpy, opencv-python-headless, node 22.18 or later)"""
import json, os, subprocess, sys, tempfile, random
import numpy as np, cv2
HERE = os.path.dirname(os.path.abspath(__file__))
rng = random.Random(135); nrng = np.random.RandomState(135)
def make(i):
    w = rng.randint(200, 520); h = rng.randint(50, 110); paper = rng.choice([255, 255, 240, 200, 176])
    g = np.full((h, w), paper, dtype=np.float64)
    if i % 25 == 24: pass  # a row with no ink
    else:
        gh = rng.randint(14, 34); gw = rng.randint(6, 16); step = gw + rng.randint(6, 20); slope = np.tan(np.radians(rng.uniform(-2.5, 2.5))); ink = rng.choice([0, 30, 70])
        x = 8
        while x + gw < w - 4:
            y = int(round(h / 2 - gh / 2 + (x - w / 2) * slope))
            y0, y1 = max(0, y), min(h, y + gh)
            if y1 > y0:
                g[y0:y1, x:x + gw] = ink
                if rng.random() < 0.3 and gw > 8: g[y0:y1, x + gw // 2:x + gw // 2 + rng.choice([1, 2, 3])] = paper  # a gap in the stroke
            x += step
    g += nrng.normal(0, rng.choice([0, 0, 3, 8]), g.shape)
    return np.clip(np.round(g), 0, 255).astype(np.uint8)
def oracle(g, ink_height=32, pad=16):
    h, w = g.shape; paper = int(np.argmax(np.bincount(g.ravel(), minlength=256)))
    mask = np.pad((g < 128).astype(np.uint8) * 255, ((120, 120), (0, 0)))  # 0 and 255, so the bilinear turn keeps its gradation (a 0/1 uint8 mask is rounded back to 0/1 by warpAffine)
    mh = mask.shape[0]; best, bestv = 0.0, None
    order = [0.0]
    for k in range(1, 31): order += [k / 10, -k / 10]
    for a in order:
        if a == 0: r = mask
        else: r = cv2.warpAffine(mask, cv2.getRotationMatrix2D((w / 2, mh / 2), a, 1.0), (w, mh), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
        v = float(r.astype(np.float64).sum(axis=1).var())
        if bestv is None or v > bestv: bestv, best = v, a
    angle = best
    lev = g.copy() if angle == 0 else cv2.warpAffine(g, cv2.getRotationMatrix2D((w / 2, h / 2), angle, 1.0), (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=int(paper))
    k3 = np.ones((3, 3), np.uint8); inv = 255 - lev; closed = 255 - cv2.erode(cv2.dilate(inv, k3), k3)
    per = (closed < 128).sum(axis=1); tot = per.sum(); scale = 1.0; out = closed
    if tot > 0:
        cum = np.cumsum(per); r02 = int(np.argmax(cum >= 0.02 * tot)); r98 = int(np.argmax(cum >= 0.98 * tot)); scale = ink_height / (r98 - r02 + 1)
        out = cv2.resize(closed, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)
    return cv2.copyMakeBorder(out, pad, pad, pad, pad, cv2.BORDER_CONSTANT, value=int(paper)), angle, scale
crops = [make(i) for i in range(200)]
tmp = tempfile.mkdtemp(); fin, fout = f'{tmp}/in.json', f'{tmp}/out.json'
json.dump([dict(w=c.shape[1], h=c.shape[0], data=c.ravel().tolist()) for c in crops], open(fin, 'w'))
subprocess.run(['node', f'{HERE}/xcheck_frame.mjs', fin, fout], check=True)
got = json.load(open(fout)); bad = []; sizebad = 0; anglebad = 0; worst = []
for i, (c, r) in enumerate(zip(crops, got)):
    o, a, s = oracle(c)
    if o.shape != (r['h'], r['w']): sizebad += 1; bad.append((i, 'size', o.shape, (r['h'], r['w']))); continue
    if abs(a - r['angle']) > 1e-9: anglebad += 1
    d = np.abs(o.astype(int) - np.array(r['data'], dtype=int).reshape(o.shape)); frac = float((d > 1).mean()); worst.append((frac, i, a, r['angle'], int(d.max())))
    if frac > 0.005: bad.append((i, 'pixels', round(frac, 4), 'oracle angle', a, 'ts angle', r['angle'], 'max diff', int(d.max())))
worst.sort(reverse=True)
noink = sum(1 for c in crops if not (c < 128).any())
print(f'{len(crops)} rows ({noink} with no ink); angle differs on {anglebad}; size differs on {sizebad}; more than 1 grey level in more than 0.5% of pixels on {len([b for b in bad if b[1] == "pixels"])}')
print('largest shares of pixels differing by more than 1 grey level:', [(round(f, 4), i, f'oracle {a}', f'ts {b}', f'max {m}') for f, i, a, b, m in worst[:5]])
for b in bad[:20]: print('  differs:', b)
