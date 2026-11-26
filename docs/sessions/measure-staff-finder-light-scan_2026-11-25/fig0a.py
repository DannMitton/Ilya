# fig0a.py <prefix>: step 0a figures from <prefix>.gray, <prefix>.dim.json, <prefix>.homr.json
import sys, json, numpy as np
p = sys.argv[1]
d = json.load(open(p + '.dim.json')); W, H = d['w'], d['h']
g = np.fromfile(p + '.gray', dtype=np.uint8).reshape(H, W)
boxes = json.load(open(p + '.homr.json'))['staves']
bins = np.bincount(g.ravel(), minlength=256)
paper = int(np.argmax(bins))  # first-of-max, as paperTone
print('page', W, 'x', H, 'paperTone(whole page)=', paper, ' 1st percentile=', int(np.percentile(g, 1)), ' median=', int(np.median(g)))
print('homr boxes:', len(boxes))
for i in (0, 7, 15):
    b = boxes[i]
    x0 = int((b['cx'] - b['w']/2) * W); x1 = int((b['cx'] + b['w']/2) * W)
    pad = b['h'] * H / 4
    y0 = int(max(0, (b['cy'] - b['h']/2) * H - pad)); y1 = int(min(H, (b['cy'] + b['h']/2) * H + pad))
    crop = g[y0:y1, x0 + (x1 - x0)//4: x0 + 3*(x1 - x0)//4]
    local_paper = int(np.argmax(np.bincount(crop.ravel(), minlength=256)))
    prof = np.median(crop, axis=1)  # per-row median across the strip
    # five darkest well-separated minima
    order = np.argsort(prof); picks = []
    for r in order:
        if all(abs(r - q) > 8 for q in picks): picks.append(int(r))
        if len(picks) == 5: break
    picks.sort()
    print(f'staff {i}: crop y {y0}-{y1}, local paper(mode)={local_paper}, rule rows {picks}, rule row-median greys {[int(prof[r]) for r in picks]}, mean {np.mean([prof[r] for r in picks]):.0f}')
