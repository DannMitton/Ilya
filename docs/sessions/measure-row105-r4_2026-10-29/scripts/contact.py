"""Row 105 r4: contact sheet of 20 kind 2 framed rows (left) beside 20 real framed rows of the choosing half (right), the first 1100 px of each at native scale. Written outside the tree. Usage: contact.py <round> <out.png>"""
import sys, os, glob, random
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
rd, out = sys.argv[1], sys.argv[2]; W = os.path.expanduser('~/Downloads/_desk-row105/r4'); rng = random.Random(7)
syn = sorted(glob.glob(f'{W}/work/cal/round{rd}/framed/kind2a-*.png')); real = sorted(f for L in ['B01','B03','B06','B08'] for f in glob.glob(f'{W}/mroot/ctl/framed/{L}-*.png'))
a = rng.sample(syn, 20); b = rng.sample(real, 20); CW = 1100
def crop(f): im = Image.open(f).convert('L'); return im.crop((0, 0, min(CW, im.width), im.height))
rows = [(crop(x), crop(y)) for x, y in zip(a, b)]; H = sum(max(p.height, q.height) + 6 for p, q in rows)
sheet = Image.new('L', (2 * CW + 20, H), 200); y = 0
for p, q in rows: sheet.paste(p, (0, y)); sheet.paste(q, (CW + 20, y)); y += max(p.height, q.height) + 6
sheet.save(out); print(out, sheet.size)
