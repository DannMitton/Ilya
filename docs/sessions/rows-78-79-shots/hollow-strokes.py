"""Row 78b, item 1: the hollow placeholder circle at three strokes (the half-note head's rim, thinnest 0.098 sp, thickest
0.297 sp, and their mean 0.198 sp, measured from FinaleMaestro.otf's noteheadHalf), beside the font's half and black heads,
on a stave at stave size (12 px a space, the renderer's lineGap) and at 3x. Lavender #9585A2 at opacity 0.85.
The circle's outer edge is the half head's height, 1.064 sp (FinaleMaestro.json bBox), so it covers a line or a space as a
head does. Usage: /usr/bin/python3 hollow-strokes.py <out.png>"""
import sys
from PIL import Image, ImageDraw, ImageFont
FONT = 'apps/web/static/fonts/finale-maestro/FinaleMaestro.otf'
LAV = (0x95, 0x85, 0xA2); PAPER = (240, 235, 226); INK = (30, 30, 30)
D, STROKES = 1.064, [('thinnest 0.098', 0.098), ('mean 0.198', 0.198), ('thickest 0.297', 0.297)]
def panel(sp, ss=4):
    S = sp * ss; W, H = int(19 * S), int(7 * S)
    im = Image.new('RGB', (W, H), PAPER); d = ImageDraw.Draw(im, 'RGBA')
    top = 1.5 * S
    for k in range(5): d.line((0.3 * S, top + k * S, W - 0.3 * S, top + k * S), fill=INK, width=max(1, int(0.12 * S)))
    f = ImageFont.truetype(FONT, int(4 * S))
    y_space = top + 2.5 * S  # the third space
    x = 1.5 * S
    for ch, col in ((0xE0A3, INK), (0xE0A4, LAV + (217,))):
        d.text((x, y_space), chr(ch), font=f, fill=col, anchor='lm'); x += 2.2 * S
    for label, w in STROKES:
        for cy in (y_space, top + 2 * S):  # in a space, and on a line
            r = (D - w) / 2 * S; ww = max(1, round(w * S))
            d.ellipse((x + D / 2 * S - r - ww / 2, cy - r - ww / 2, x + D / 2 * S + r + ww / 2, cy + r + ww / 2), outline=LAV + (217,), width=ww)
            x += 1.6 * S
        x += 0.8 * S
    im = im.resize((W // ss, H // ss), Image.LANCZOS); d = ImageDraw.Draw(im)
    if sp >= 24:
        lf = ImageFont.load_default()
        for k, (label, _) in enumerate(STROKES):
            d.text(((5.9 + 4.0 * k) * sp, 5.8 * sp), label + ' sp', fill=INK, font=lf)
        d.text((1.5 * sp, 5.8 * sp), 'half, black (font)', fill=INK, font=lf)
    return im
a, b = panel(12), panel(36)
out = Image.new('RGB', (b.width, a.height + b.height + 10), PAPER); out.paste(a, (0, 0)); out.paste(b, (0, a.height + 10)); out.save(sys.argv[1])
print(out.size)
