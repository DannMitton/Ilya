s = open('render.py').read()
s = s.replace("def scene(rng, fname, fig_scale=1.0, kind=None):",
'''_tb = {}
def text_digits(path):
    if path not in _tb:
        from fonts import digit_bitmaps
        _tb[path] = digit_bitmaps(path, 160)
    return _tb[path]


def scene(rng, fname, fig_scale=1.0, kind=None, text_font=None, out_sp=(SP,)):''')
old_digits = '''            top_n = int(rng.choice(TOPS)); bot_n = int(rng.choice(BOTS))
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
            x += wmax + rng.uniform(0.5, 1.5) * s'''
new_digits = '''            top_n = int(rng.choice(TOPS)); bot_n = int(rng.choice(BOTS))
            if text_font:   # a text face's lining digits, each filling half the staff
                tb = text_digits(text_font); hgt = 2 * s * fig_scale; k = hgt / 160.0
                gap = rng.uniform(0.0, 0.12) * s
                def num_w(n):
                    return sum(tb[int(c)][0].shape[1] * k + gap for c in str(n)) - gap
                wt, wb = num_w(top_n), num_w(bot_n); wmax = max(wt, wb)
                for n, seat, w in [(top_n, 1, wt), (bot_n, 3, wb)]:
                    xx = x + (wmax - w) / 2
                    for c in str(n):
                        a, lo, hi = tb[int(c)]
                        aw, ah = max(1, int(a.shape[1] * k)), max(1, int(a.shape[0] * k))
                        g_ = Image.fromarray(a).resize((aw, ah), Image.BILINEAR)
                        top = L[seat] + hgt / 2 - hi * k   # the lining height centred on the seat line
                        im.paste(0, (int(xx), int(top)), g_)
                        objs.append((c, (xx + aw / 2) / s, seat))
                        xx += aw + gap
                x += wmax + rng.uniform(0.5, 1.5) * s
            else:
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
                x += wmax + rng.uniform(0.5, 1.5) * s'''
assert s.count(old_digits) == 1; s = s.replace(old_digits, new_digits)
assert s.count("        if r < 0.15:\n            cp = 0xE08A") == 1
s = s.replace("        if r < 0.15:\n            cp = 0xE08A", "        if r < 0.15 and not text_font:\n            cp = 0xE08A")
old_out = '''    sc = SP / s
    g = cv2.resize(g, (int(W * sc), int(H * sc)), interpolation=cv2.INTER_AREA)
    lines = [y * sc for y in L]
    return g.astype(np.uint8), lines, [(c, xc * SP, seat) for c, xc, seat in objs], kind, has_sig'''
new_out = '''    outs = []
    for sp_ in out_sp:   # the same staff at each network's pixels a space
        sc = sp_ / s
        gg = cv2.resize(g, (int(W * sc), int(H * sc)), interpolation=cv2.INTER_AREA)
        outs.append((gg.astype(np.uint8), [y * sc for y in L], [(c, xc * sp_, seat) for c, xc, seat in objs]))
    if len(out_sp) == 1:
        gg, lines, ob = outs[0]
        return gg, lines, ob, kind, has_sig
    return outs, kind, has_sig'''
assert s.count(old_out) == 1; s = s.replace(old_out, new_out)
open('render.py', 'w').write(s)
c = open('crops.py').read()
a = 'def crop_norm(g, x, y):\n    """From a normalized image (10 px a space)."""\n    M = np.float32([[1, 0, CW / 2 - x], [0, 1, CW / 2 - y]])\n    return cv2.warpAffine(g, M, (CW, CW), flags=cv2.INTER_LINEAR, borderValue=255)'
assert c.count(a) == 1
c = c.replace(a, 'def crop_norm(g, x, y, cw=CW):\n    """From a normalized image (10 px a space for A, 12 for B)."""\n    M = np.float32([[1, 0, cw / 2 - x], [0, 1, cw / 2 - y]])\n    return cv2.warpAffine(g, M, (cw, cw), flags=cv2.INTER_LINEAR, borderValue=255)')
open('crops.py', 'w').write(c)
print('edited')
