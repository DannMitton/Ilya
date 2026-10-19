#!/usr/bin/env python3
"""Proof sheet: for each printed system, the print's voice-staff crop above the draft's rendering."""
import sys
from PIL import Image
import numpy as np
page, nsys, out = sys.argv[1], int(sys.argv[2]), sys.argv[3]
W = 2000; rows = []
def white(im):
    if im.mode in ('RGBA', 'LA'):
        bg = Image.new('RGBA', im.size, (255, 255, 255, 255)); bg.alpha_composite(im.convert('RGBA')); return bg.convert('L')
    return im.convert('L')
for k in range(1, nsys + 1):
    pr = white(Image.open(f'cp-pages/{page}-v{k}.png')); pr = pr.crop((60, 100, pr.width - 60, pr.height - 120))
    pr = pr.resize((W, int(pr.height * W / pr.width)))
    rd = white(Image.open(f'truthkit/pages/{page}-s{k}.png'))
    a = np.array(rd); ys = np.where((a < 250).any(axis=1))[0]; xs = np.where((a < 250).any(axis=0))[0]
    rd = rd.crop((max(0, xs[0] - 20), max(0, ys[0] - 20), min(rd.width, xs[-1] + 20), min(rd.height, ys[-1] + 20)))
    rd = rd.resize((W, int(rd.height * W / rd.width)))
    rows += [pr, rd]
H = sum(r.height for r in rows) + 40 * len(rows)
sheet = Image.new('L', (W, H), 255); y = 0
for i, r in enumerate(rows):
    sheet.paste(r, (0, y)); y += r.height + (12 if i % 2 == 0 else 70)
sheet.save(out); print(sheet.size)
