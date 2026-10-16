"""Row 81, step 1: cut each underlay band (row 80's <L>.systems.jsonl) into its text rows.
Ink is darker than the page's paper tone less 60 (systems.py:11). A row is a run of raster lines whose ink count exceeds
2 percent of the band's width; runs separated by less than 0.3 staff space are one row; a row under 0.4 staff space tall
is dropped; each row is padded by 0.3 space above and below (DESK DEFAULT, brief r2 section 3 item 1).
Writes <crop dir>/<L>-<page>-s<k>-r<j>.png and prints JSON lines: page, system, row, y0, y1 (padded, page pixels), core y0/y1.
Usage: /usr/bin/python3 rows.py <letter> <raster prefix> <crop dir> <cover offset>"""
import sys, json, statistics
from PIL import Image
L, pref, od, off = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4])
R80 = __file__.rsplit('/', 2)[0] + '/measure-russian-line_2026-10-11'
systems = [json.loads(l) for l in open(f'{R80}/{L}.systems.jsonl')]
ims = {}
for b in systems:
    if 'y0' not in b: continue
    p = b['page']
    if p not in ims:
        im = Image.open(f'{pref}-{p + off}.png').convert('L'); W, H = im.size; px = im.load()
        paper = statistics.median(px[x, y] for x in range(0, W, 37) for y in range(0, H, 37))
        ims[p] = (im, px, paper - 60)
    im, px, ink = ims[p]
    sp, x0, x1 = b['space'], b['x0'], b['x1']; ww = x1 - x0
    on = [sum(1 for x in range(x0, x1) if px[x, y] < ink) > 0.02 * ww for y in range(b['y0'], b['y1'])]
    runs = []
    for i, v in enumerate(on):
        y = b['y0'] + i
        if not v: continue
        if runs and y - runs[-1][1] - 1 < 0.3 * sp: runs[-1][1] = y
        elif runs and runs[-1][1] == y - 1: runs[-1][1] = y
        else: runs.append([y, y])
    rows = [r for r in runs if r[1] - r[0] + 1 >= 0.4 * sp]
    for j, (a, z) in enumerate(rows, 1):
        y0 = max(0, int(a - 0.3 * sp)); y1 = min(im.size[1], int(z + 1 + 0.3 * sp))
        im.crop((x0, y0, x1, y1)).save(f'{od}/{L}-{p}-s{b["system"]}-r{j}.png')
        print(json.dumps(dict(page=p, system=b['system'], row=j, bars=b['bars'], space=sp, core=[a, z], y0=y0, y1=y1, x0=x0, x1=x1)))
