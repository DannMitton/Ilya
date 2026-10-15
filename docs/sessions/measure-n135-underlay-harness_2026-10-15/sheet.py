"""N.135 stage 1: a sheet to check by eye: one system of one song drawn from Ilya's raster, from 2 spaces above the voice staff to the end of its band,
the notes' imgpos as red ticks on the staff, and each row as a box coloured by its label (green Russian, blue other, grey not text).
Usage: python3 sheet.py <L> <raster prefix> <cover offset> <page> <system> [out.png]"""
import sys
from PIL import Image, ImageDraw
from common2 import *
L, pref, off, page, sysn = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5])
b = [s for s in systems(L) if (s['page'], s['system']) == (page, sysn)][0]
im = Image.open(f'{pref}-{page + off}.png').convert('RGB'); d = ImageDraw.Draw(im)
lab = labels(L)['rows']; col = dict(russian=(0, 160, 0), other=(0, 0, 255), notext=(150, 150, 150))
for r in rows(L):
    if (r['page'], r['system']) == (page, sysn): d.rectangle([r['x0'] + 2, r['y0'], r['x1'] - 3, r['y1']], outline=col[lab[rid(r)]], width=3); d.text((r['x0'] + 8, r['y0']), rid(r) + ' ' + lab[rid(r)], fill=col[lab[rid(r)]])
ns = note_systems(L); ev = events(L)
for i, k in ns.items():
    if k == (page, sysn): d.line([ev[i]['x'], b['staffBottom'] + 5, ev[i]['x'], b['staffBottom'] + 40], fill=(255, 0, 0), width=4)
y0 = max(0, int(b['staffTop'] - 3 * b['space'])); y1 = min(im.height, b['y1'] + 10)
c = im.crop((0, y0, im.width, y1)); w = 1800; c = c.resize((w, int(c.height * w / c.width)))
out = sys.argv[6] if len(sys.argv) > 6 else f'{HERE}/sheets/{L}{D}-p{page}s{sysn}.png'; c.save(out); print(out, c.size)
