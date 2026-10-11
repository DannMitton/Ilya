import glob, os, sys, json
import numpy as np
from PIL import Image
import cv2
os.makedirs('pages_d', exist_ok=True)
info = {}
for f in sorted(glob.glob('pages/*.png')):
    name = os.path.basename(f)[:-4]
    g = np.asarray(Image.open(f).convert('L'))
    sc = 1600 / g.shape[1]
    small = cv2.resize(g, None, fx=sc, fy=sc, interpolation=cv2.INTER_AREA)
    b = (small < 160).astype(np.float32)
    h, w = b.shape
    best = (0, -1)
    for a in np.arange(-3, 3.001, 0.05):
        M = cv2.getRotationMatrix2D((w / 2, h / 2), a, 1)
        r = cv2.warpAffine(b, M, (w, h), flags=cv2.INTER_NEAREST)
        p = r.sum(axis=1)
        v = float((p ** 2).sum())
        if v > best[1]:
            best = (a, v)
    a = best[0]
    H, W = g.shape
    M = cv2.getRotationMatrix2D((W / 2, H / 2), a, 1)
    out = cv2.warpAffine(g, M, (W, H), flags=cv2.INTER_LINEAR, borderValue=255)
    Image.fromarray(out).save('pages_d/%s.png' % name)
    info[name] = round(float(a), 2)
    print(name, info[name], flush=True)
json.dump(info, open('deskew.json', 'w'))
