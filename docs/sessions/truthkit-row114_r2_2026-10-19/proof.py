#!/usr/bin/env python3
"""Proof sheet: for each printed system, the print's voice-staff crop above the draft's rendering.
Changes of 2026-10-19: the print crops are read as stored (already cropped and at width 2000: recovered from the
earlier sheets); a piano-only system takes the crop <stem>-p<N>.png (N = its system number) cut from the PDF page,
or a label when there is none; the number of systems is read from the draft's `// system` lines.
usage: proof.py <draft.txt> <pages dir> <crops dir> <out.png>"""
import sys, os
from PIL import Image, ImageDraw, ImageFont
import numpy as np
draft, pages, crops, out = sys.argv[1:5]
stem = os.path.basename(draft)[:-4]
systems = [('piano only' in l) for l in open(draft, encoding='utf-8') if l.strip().startswith('// system')] or [False]
W = 2000; rows = []
def white(im):
    if im.mode in ('RGBA', 'LA'):
        bg = Image.new('RGBA', im.size, (255, 255, 255, 255)); bg.alpha_composite(im.convert('RGBA')); return bg.convert('L')
    return im.convert('L')
try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 34)
except Exception: font = ImageFont.load_default()
def label(text, h=60):
    im = Image.new('L', (W, h), 255); ImageDraw.Draw(im).text((10, 10), text, fill=0, font=font); return im
v = 0
for k, piano in enumerate(systems, 1):
    if piano:
        p = f'{crops}/{stem}-p{k}.png'
        head = label(f'system {k} (piano only): no voice staff; the print\'s grand staff below')
        pr = white(Image.open(p)) if os.path.exists(p) else None
        if pr is not None:
            pr = pr.resize((W, int(pr.height * W / pr.width)))
            both = Image.new('L', (W, head.height + pr.height), 255); both.paste(head, (0, 0)); both.paste(pr, (0, head.height)); pr = both
        else:
            pr = label(f'system {k} (piano only): no voice staff; no crop of the print')
    else:
        v += 1; pr = white(Image.open(f'{crops}/{stem}-v{v}.png'))
        if pr.width != W: pr = pr.resize((W, int(pr.height * W / pr.width)))
    rd = white(Image.open(f'{pages}/{stem}-s{k}.png'))
    a = np.array(rd); ys = np.where((a < 250).any(axis=1))[0]; xs = np.where((a < 250).any(axis=0))[0]
    rd = rd.crop((max(0, xs[0] - 20), max(0, ys[0] - 20), min(rd.width, xs[-1] + 20), min(rd.height, ys[-1] + 20)))
    rd = rd.resize((W, int(rd.height * W / rd.width)))
    rows += [pr, rd]
H = sum(r.height for r in rows) + 40 * len(rows)
sheet = Image.new('L', (W, H), 255); y = 0
for i, r in enumerate(rows):
    sheet.paste(r, (0, y)); y += r.height + (12 if i % 2 == 0 else 70)
sheet.save(out); print(sheet.size)
