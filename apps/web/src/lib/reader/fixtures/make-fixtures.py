"""Writes the HEIC fixtures for heic-decode.test.ts and the Playwright spec.

    pip install pillow pillow-heif numpy
    python3 make-fixtures.py <output directory>

Every HEIC is encoded lossless (quality=-1). The pages are synthetic: no photograph is stored here.
"""
import random
import sys

import numpy as np
import pillow_heif
from PIL import Image, ImageDraw, ImageFont

pillow_heif.register_heif_opener()
out = sys.argv[1]
W, H = 1600, 2200


def staff_page():
    im = Image.new("L", (W, H), 255)
    d = ImageDraw.Draw(im)
    random.seed(7)
    for s in range(8):
        y0 = 160 + s * 240
        for k in range(5):
            d.line([(120, y0 + k * 16), (W - 120, y0 + k * 16)], fill=0, width=3)
        d.line([(120, y0), (120, y0 + 64)], fill=0, width=4)
        d.line([(W - 120, y0), (W - 120, y0 + 64)], fill=0, width=4)
        x = 220
        while x < W - 200:
            yy = y0 + random.randint(-1, 5) * 8
            d.ellipse([x, yy - 8, x + 26, yy + 8], fill=0)
            d.line([(x + 25, yy), (x + 25, yy - 52)], fill=0, width=3)
            x += random.choice([90, 120, 150])
    return im


page = staff_page()
page.convert("RGB").save(f"{out}/staff-page.png")

# (a) upright, lossless
page.convert("RGB").save(f"{out}/staff-page.heic", quality=-1)

# (b) stored 2200 x 1600 with orientation 6; pillow_heif writes it as an irot box
rotated = page.rotate(-90, expand=True).convert("RGB")
exif = Image.Exif()
exif[0x0112] = 6
pillow_heif.from_pillow(rotated).save(f"{out}/staff-page-irot.heic", quality=-1, exif=exif.tobytes())

# (c) grey photo-like: paper about 200, ink about 40, a gradient and noise
rng = np.random.default_rng(3)
arr = 200 - (255 - np.array(page, dtype=np.float32)) / 255 * 160
yy, xx = np.mgrid[0:H, 0:W]
arr += (xx / W - 0.5) * 18 + rng.normal(0, 4, arr.shape)
Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).convert("RGB").save(f"{out}/photo-page.heic", quality=-1)

# (e) the same page as a grid of 512 px tiles, as an iPhone writes it
pillow_heif.options.GRID_TILE_SIZE = 512
page.convert("RGB").save(f"{out}/staff-page-grid.heic", quality=-1)
pillow_heif.options.GRID_TILE_SIZE = 4096

# a printed poem with no staves
poem = Image.new("L", (1600, 900), 255)
d = ImageDraw.Draw(poem)
font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf", 64)
lines = ["Я помню чудное мгновенье:", "Передо мной явилась ты,", "Как мимолётное виденье,", "Как гений чистой красоты."]
for i, t in enumerate(lines):
    d.text((100, 100 + i * 180), t, fill=20, font=font)
poem.convert("RGB").save(f"{out}/poem-page.heic", quality=-1)
