"""Rendered staves with time signatures in context, for row 57 r4.

Each scene is a five-line staff drawn with one SMuFL font: clef, key signature,
then either a time signature or none, then notes; or a barline, a time
signature or none, and notes. Returned in staff-normalized form: 10 px a space.
Objects record (class, x centre, seat) in normalized pixels.
"""
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import cv2

FONTS = ['Bravura', 'Leland', 'FinaleMaestro', 'FinaleEngraver', 'FinaleBroadway', 'FinaleAsh',
         'FinaleJazz', 'FinaleLegacy', 'Petaluma', 'Sebastian']
CLASSES = [str(i) for i in range(10)] + ['C', 'cut', 'none']
NONE = 12
SP = 10  # normalized pixels a space

SHARP_T = [8, 5, 9, 6, 3, 7, 4]
FLAT_T = [4, 7, 3, 6, 2, 5, 1]
TOPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 2, 3, 4, 6, 3, 4, 2, 3, 6, 9, 12, 5, 7, 9, 10, 5, 7]
BOTS = [1, 2, 4, 8, 16, 2, 4, 8, 4, 8, 4, 2]

_fc = {}


def font(name, size):
    k = (name, size)
    if k not in _fc:
        _fc[k] = ImageFont.truetype('/Library/Fonts/%s.otf' % name, size)
    return _fc[k]


def scene(rng, fname, fig_scale=1.0, kind=None):
    s = float(rng.uniform(7, 16))           # render space in px
    W = int(44 * s); H = int(12 * s)
    im = Image.new('L', (W, H), 255)
    d = ImageDraw.Draw(im)
    top = 4 * s
    L = [top + k * s for k in range(5)]
    th = max(1, int(round(rng.uniform(0.07, 0.18) * s)))
    for y in L:
        d.line([(0, y), (W, y)], fill=0, width=th)
    f = font(fname, int(round(4 * s)))
    objs = []
    def ystep(p):  # staff position p (0 bottom line, half spaces)
        return L[4] - p * s / 2
    def glyph(cp, x, y, fnt=f):
        d.text((x, y), chr(cp), font=fnt, fill=0, anchor='ls')
        b = fnt.getbbox(chr(cp), anchor='ls')
        return x + b[2]
    kind = kind or rng.choice(['start', 'start', 'bar', 'bar', 'mid'])
    x = 0.3 * s
    treble = rng.random() < 0.55
    if kind == 'start':
        d.line([(x, L[0]), (x, L[4])], fill=0, width=th)
        x += rng.uniform(0.3, 1.0) * s
        x = glyph(0xE050 if treble else 0xE062, x, L[3] if treble else L[1]) + rng.uniform(0.3, 0.9) * s
        nk = int(rng.integers(0, 8))
        sharp = rng.random() < 0.5
        pos = (SHARP_T if sharp else FLAT_T)[:nk]
        for p in pos:
            if not treble:
                p -= 2
            x = glyph(0xE262 if sharp else 0xE260, x, ystep(p)) + rng.uniform(0.05, 0.25) * s
        x += rng.uniform(0.3, 1.0) * s
    else:
        # notes before, then a barline
        x = notes(d, f, rng, x, L, s, th, int(rng.integers(1, 4)), objs)
        x += rng.uniform(0.4, 1.2) * s
        heavy = rng.random() < 0.3
        if heavy:
            d.line([(x, L[0]), (x, L[4])], fill=0, width=th + 1)
            x += 0.5 * s
            d.rectangle([x, L[0], x + 0.45 * s, L[4]], fill=0)
            x += 0.45 * s
        else:
            d.line([(x, L[0]), (x, L[4])], fill=0, width=max(1, int(0.15 * s)))
        x += rng.uniform(0.4, 1.0) * s
    has_sig = kind != 'mid' and rng.random() < 0.75
    if has_sig:
        fs = font(fname, max(4, int(round(4 * s * fig_scale))))
        r = rng.random()
        if r < 0.15:
            cp = 0xE08A if rng.random() < 0.65 else 0xE08B
            b = fs.getbbox(chr(cp), anchor='ls')
            glyph(cp, x, L[2], fs)
            objs.append(('C' if cp == 0xE08A else 'cut', (x + (b[0] + b[2]) / 2) / s, 2))
            x += b[2] + rng.uniform(0.5, 1.5) * s
        else:
            top_n = int(rng.choice(TOPS)); bot_n = int(rng.choice(BOTS))
            def num_w(n):
                return sum(fs.getbbox(chr(0xE080 + int(c)), anchor='ls')[2] for c in str(n))
            wt, wb = num_w(top_n), num_w(bot_n)
            wmax = max(wt, wb)
            for n, seat, w in [(top_n, 1, wt), (bot_n, 3, wb)]:
                xx = x + (wmax - w) / 2
                for c in str(n):
                    cp = 0xE080 + int(c)
                    b = fs.getbbox(chr(cp), anchor='ls')
                    glyph(cp, xx, L[seat], fs)
                    objs.append((c, (xx + (b[0] + b[2]) / 2) / s, seat))
                    xx += b[2]
            x += wmax + rng.uniform(0.5, 1.5) * s
    elif kind != 'mid':
        x += rng.uniform(0, 1.0) * s
    x = notes(d, f, rng, x, L, s, th, int(rng.integers(3, 8)), objs)
    # clutter: dynamics, tuplet numerals, slurs
    for _ in range(int(rng.integers(0, 4))):
        xx = rng.uniform(0, W - 2 * s)
        r = rng.random()
        if r < 0.4:
            # tuplet numeral, italic, often near or on the staff edge
            n = int(rng.integers(2, 10)); cp = 0xE880 + n
            yy = rng.choice([L[0] - rng.uniform(0.2, 1.5) * s, L[4] + rng.uniform(0.8, 2.0) * s, rng.uniform(L[0], L[4])])
            ft = font(fname, int(round(4 * s * rng.uniform(0.7, 1.1))))
            glyph(cp, xx, yy, ft)
            objs.append(('tup', xx / s, -1))
        elif r < 0.7:
            cp = int(rng.choice([0xE520, 0xE522, 0xE52C, 0xE52D, 0xE52B]))
            glyph(cp, xx, L[0] - rng.uniform(0.5, 1.5) * s if rng.random() < 0.5 else L[4] + rng.uniform(1.5, 2.5) * s)
        else:
            x2 = xx + rng.uniform(2, 8) * s; yy = rng.uniform(L[0] - 2 * s, L[4] + 2 * s)
            d.arc([xx, yy, x2, yy + rng.uniform(0.6, 2.0) * s], 180, 360, fill=0, width=max(1, th))
    g = np.asarray(im, dtype=np.float32)
    g = degrade(g, rng, s, th)
    sc = SP / s
    g = cv2.resize(g, (int(W * sc), int(H * sc)), interpolation=cv2.INTER_AREA)
    lines = [y * sc for y in L]
    return g.astype(np.uint8), lines, [(c, xc * SP, seat) for c, xc, seat in objs], kind, has_sig


def notes(d, f, rng, x, L, s, th, n, objs):
    for _ in range(n):
        r = rng.random()
        p = int(rng.integers(-3, 12))
        y = L[4] - p * s / 2
        if r < 0.15:
            cp = int(rng.choice([0xE4E3, 0xE4E4, 0xE4E5, 0xE4E6, 0xE4E7]))
            d.text((x, L[1] if cp == 0xE4E3 else L[2]), chr(cp), font=f, fill=0, anchor='ls')
            x += f.getbbox(chr(cp), anchor='ls')[2] + rng.uniform(0.6, 2.0) * s
            continue
        if rng.random() < 0.2:
            cp = int(rng.choice([0xE262, 0xE260, 0xE261]))
            d.text((x, y), chr(cp), font=f, fill=0, anchor='ls')
            x += f.getbbox(chr(cp), anchor='ls')[2] + 0.15 * s
        head = int(rng.choice([0xE0A4, 0xE0A4, 0xE0A4, 0xE0A3, 0xE0A2]))
        d.text((x, y), chr(head), font=f, fill=0, anchor='ls')
        hw = f.getbbox(chr(head), anchor='ls')[2]
        # ledger lines
        for q in range(-2, p - 1, -2) if p < -1 else range(12, p + 1, 2) if p > 9 else []:
            yy = L[4] - q * s / 2
            d.line([(x - 0.3 * s, yy), (x + hw + 0.3 * s, yy)], fill=0, width=th)
        if head != 0xE0A2:
            up = p < 4
            sw = max(1, int(0.12 * s))
            if up:
                d.line([(x + hw - sw, y), (x + hw - sw, y - 3.5 * s)], fill=0, width=sw)
                if rng.random() < 0.35:
                    d.text((x + hw - sw, y - 3.5 * s), chr(0xE240 if rng.random() < 0.6 else 0xE242), font=f, fill=0, anchor='ls')
            else:
                d.line([(x, y), (x, y + 3.5 * s)], fill=0, width=sw)
                if rng.random() < 0.35:
                    d.text((x, y + 3.5 * s), chr(0xE241 if rng.random() < 0.6 else 0xE243), font=f, fill=0, anchor='ls')
        if rng.random() < 0.15:
            d.text((x + hw + 0.2 * s, y), chr(0xE1E7), font=f, fill=0, anchor='ls')
        x += hw + rng.uniform(0.8, 3.0) * s
        if rng.random() < 0.08:
            d.line([(x, L[0]), (x, L[4])], fill=0, width=max(1, int(0.15 * s)))
            x += rng.uniform(0.6, 1.5) * s
    return x


def degrade(g, rng, s, th=2):
    ink = 255 - g
    # stroke weight
    r = rng.random()
    k = max(1, int(round(rng.uniform(0.03, 0.10) * s)))
    if r < 0.3:
        ink = cv2.dilate(ink, np.ones((k, k), np.uint8))
    elif r < 0.5 and th >= 2 * k:
        ink = cv2.erode(ink, np.ones((k, k), np.uint8))
    # elastic shape jitter
    if rng.random() < 0.6:
        H, W = ink.shape
        a = rng.uniform(0.5, 2.0) * s * 0.06
        dx = cv2.GaussianBlur((rng.random((H, W)) * 2 - 1).astype(np.float32), (0, 0), s * 0.6) * a * 20
        dy = cv2.GaussianBlur((rng.random((H, W)) * 2 - 1).astype(np.float32), (0, 0), s * 0.6) * a * 20
        X, Y = np.meshgrid(np.arange(W, dtype=np.float32), np.arange(H, dtype=np.float32))
        ink = cv2.remap(ink, X + dx, Y + dy, cv2.INTER_LINEAR)
    if rng.random() < 0.7:
        ink = cv2.GaussianBlur(ink, (0, 0), rng.uniform(0.2, 0.9) * s * 0.1 + 0.3)
    g = 255 - ink
    bg = rng.uniform(170, 255); fg = rng.uniform(0, 90)
    g = fg + (g / 255.0) * (bg - fg)
    g = g + rng.normal(0, rng.uniform(0, 22), g.shape)
    if rng.random() < 0.4:
        t = rng.uniform(110, 170)
        g = np.where(g < t, 0, 255).astype(np.float32)
    return np.clip(g, 0, 255)
