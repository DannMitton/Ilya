"""Tile the sheets of one song listed on the command line into one image. Usage: python3 tile.py <out.png> <sheet.png>..."""
import sys
from PIL import Image
ims = [Image.open(p) for p in sys.argv[2:]]; W = max(i.width for i in ims); H = sum(i.height + 6 for i in ims)
o = Image.new('RGB', (W, H), (255, 255, 255)); y = 0
for i in ims: o.paste(i, (0, y)); y += i.height + 6
o.save(sys.argv[1]); print(sys.argv[1], o.size)
