import cv2, numpy as np, potrace, os, sys, math
from skimage.filters import apply_hysteresis_threshold
from skimage.morphology import skeletonize
S = 8.0
LET = 'А Б В Г Д Е Ё Ж З И Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ъ Ы Ь Э Ю Я'.split()
PAGES = {'p1': 0, 'p2': 8, 'p3': 16, 'p4': 24, 'p5': 32}
COLS = {'upper': 73.7, 'lower': 294.8}
BW, BH, INSET, TOP = 198.4, 69.5, 2.5, 10.0
ONLY = set(sys.argv[1].split(',')) if len(sys.argv) > 1 and sys.argv[1] else None
OUT = sys.argv[2] if len(sys.argv) > 2 else 'v3'
SLANT = math.radians(70)
HAIR = float(os.environ.get('HAIR', '0.7')); SHADE = float(os.environ.get('SHADE', '1.8'))
DROP = {}
LOOPS = {'05-Д-lower', '09-З-lower', '21-У-lower'}  # descender loops to the left: the down side is shaded, the up side is a hairline (Dann 2026-11-10 22:05)
THIN = {'05-Д-lower': [1, 3]}  # д: the lead-in from the baseline and the ascending exit are upstrokes, so hairlines (Dann 2026-11-10 22:05)
SPLS = float(os.environ.get('SPLS', '1.2')) * 8.0  # copybook slant, from horizontal, leaning right
AX = np.array([math.cos(SLANT), -math.sin(SLANT)])
for d in ('weighted', 'even', 'mask'): os.makedirs(f'{OUT}/{d}', exist_ok=True)

def fmt(v): return f'{v:.2f}'.rstrip('0').rstrip('.')

def mask_of(c):
    bg = cv2.medianBlur(c.astype(np.uint8), 101).astype(np.float32) + 1
    dark = 1 - np.clip(c / bg, 0, 1)
    m = apply_hysteresis_threshold(dark, 0.35, 0.55).astype(np.uint8)
    m[: int((TOP + 11) * S), : int(28 * S)] = 0
    m0 = m.copy()
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))
    k0, lab0, st0, _ = cv2.connectedComponentsWithStats(m, 8)
    for i in range(1, k0):  # small marks (the dots of ё): keep them apart, unclosed
        x, y, w, h, a = st0[i]
        if w < 7 * S and h < 4 * S:
            sl = (slice(y, y + h), slice(x, x + w))
            m[sl] = np.where(lab0[sl] == i, m0[sl], m[sl])
    k, lab, st, _ = cv2.connectedComponentsWithStats(m, 8)
    keep = np.zeros_like(m)
    for i in range(1, k):
        x, y, w, h, a = st[i]
        if a >= 60 and h >= 1.2 * S and not (w > 40 * S and h < 3 * S) and not (h > 40 * S and w < 3 * S):
            keep[lab == i] = 1
    return keep

NB = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]
def polylines(sk):
    pts = set(zip(*np.nonzero(sk)))
    deg = {p: sum((p[0] + a, p[1] + b) in pts for a, b in NB) for p in pts}
    nodes = {p for p, d in deg.items() if d != 2}
    used = set(); lines = []
    def walk(a, b):
        line = [a, b]; prev, cur = a, b
        while cur not in nodes:
            nxt = [(cur[0] + x, cur[1] + y) for x, y in NB if (cur[0] + x, cur[1] + y) in pts and (cur[0] + x, cur[1] + y) != prev and (cur[0] + x, cur[1] + y) not in line[-3:]]
            if not nxt: break
            prev, cur = cur, nxt[0]; line.append(cur)
            if cur == line[0]: break
        return line
    for n in nodes:
        for x, y in NB:
            q = (n[0] + x, n[1] + y)
            if q in pts and (n, q) not in used:
                l = walk(n, q); used.add((n, q)); used.add((l[-1], l[-2]) if len(l) > 1 else (n, q))
                lines.append(l)
    rest = pts - {p for l in lines for p in l}
    while rest:  # closed loops with no node (о)
        s = rest.pop(); nodes.add(s)
        for x, y in NB:
            q = (s[0] + x, s[1] + y)
            if q in rest:
                l = walk(s, q); lines.append(l); rest -= set(l); break
        nodes.discard(s)
    return lines, deg

def smooth(a, sigma):
    from scipy.interpolate import splprep, splev
    if len(a) < 8: return a
    try:
        closed = np.hypot(*(a[0] - a[-1])) < 2
        tck, u = splprep([a[:, 0], a[:, 1]], s=len(a) * SPLS ** 2, per=1 if closed else 0, k=3)
        uu = np.linspace(0, 1, max(20, len(a)))
        x, y = splev(uu, tck); out = np.stack([x, y], 1)
        if not closed: out[0], out[-1] = a[0], a[-1]
        return out
    except Exception:
        return smooth_g(a, sigma)
def smooth_g(a, sigma):
    if len(a) < 5: return a
    closed = np.hypot(*(a[0] - a[-1])) < 2
    k = int(3 * sigma); xs = np.arange(-k, k + 1); w = np.exp(-xs ** 2 / (2 * sigma ** 2)); w /= w.sum()
    pad = np.concatenate([a[-k - 1:-1], a, a[1:k + 1]]) if closed else np.concatenate([np.repeat(a[:1], k, 0), a, np.repeat(a[-1:], k, 0)])
    out = np.stack([np.convolve(pad[:, i], w, 'valid') for i in range(2)], 1)
    if not closed: out[0], out[-1] = a[0], a[-1]
    return out

def trace(bitmap, name, sub, x_off, y_off, xl, xr, label):
    plist = potrace.Bitmap(~bitmap.astype(bool)).trace(turdsize=40, alphamax=1.2, opticurve=True, opttolerance=0.3)
    def P(p): return f'{fmt(p[0] / S + x_off)} {fmt(p[1] / S + y_off)}'
    d = []
    for c in plist:
        d.append('M' + P((c.start_point.x, c.start_point.y)))
        for s in c.segments:
            d.append(('L' + P((s.c.x, s.c.y)) + 'L' + P((s.end_point.x, s.end_point.y))) if s.is_corner else
                     ('C' + P((s.c1.x, s.c1.y)) + ' ' + P((s.c2.x, s.c2.y)) + ' ' + P((s.end_point.x, s.end_point.y))))
        d.append('Z')
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{fmt(xl)} -3 {fmt(xr - xl)} 72" role="img" aria-label="{label}">'
           f'<path fill="currentColor" fill-rule="nonzero" d="{"".join(d)}"/></svg>\n')
    open(f'{OUT}/{sub}/{name}.svg', 'w').write(svg)
    return len(svg)

for pg, first in PAGES.items():
    g = cv2.imread(f'flat/{pg}.png', 0).astype(np.float32)
    for row in range(8):
        idx = first + row
        if idx >= 33: break
        y0 = 82.2 + row * 82.2
        for col, x0 in COLS.items():
            name = f'{idx + 1:02d}-{LET[idx]}-{col}'
            if ONLY and name[:2] + col[0] not in ONLY: continue
            X0, Y0 = int((x0 + INSET) * S), int((y0 - TOP) * S)
            X1, Y1 = int((x0 + BW - INSET) * S), int((y0 + BH - INSET) * S)
            m = mask_of(g[Y0:Y1, X0:X1])
            if m.sum() < 2000: continue
            cv2.imwrite(f'{OUT}/mask/{name}.png', (1 - m) * 255)
            kd, labd, std, cend = cv2.connectedComponentsWithStats(m, 8)
            dots = []
            for i in range(1, kd):
                x, y, w, h, a = std[i]
                if w < 5 * S and h < 5 * S:
                    dots.append(cend[i]); m[labd == i] = 0
            dt = cv2.distanceTransform(m, cv2.DIST_L2, 5)
            sk = skeletonize(m.astype(bool))
            half = float(np.median(dt[sk]))  # median half-width of the pen
            lines, deg = polylines(sk)
            # drop short spurs that end in a free end
            from strokes import build
            keep = build(lines, deg)
            for ti in THIN.get(name, []): keep[ti]['thin'] = True
            for di in sorted(DROP.get(name, []), reverse=True): keep.pop(di)
            right_edge = {}
            for yy, xx in zip(*np.nonzero(sk)):
                k_ = int(yy) // 4
                right_edge[k_] = max(right_edge.get(k_, -1), int(xx))
            for sub in ('weighted', 'even'):
                pad = 60
                canvas = np.zeros((m.shape[0] + 2 * pad, m.shape[1] + 2 * pad), np.uint8)
                for st_ in keep:
                    a = smooth(st_['pts'], 1.4 * S)
                    seg = np.diff(a, axis=0); ln = np.hypot(seg[:, 0], seg[:, 1]) + 1e-9
                    cum = np.concatenate([[0], np.cumsum(ln)]); total = cum[-1]
                    # resample every 0.5 px
                    t = np.arange(0, total, 0.5) if total > 0 else np.array([0.0])
                    xs = np.interp(t, cum, a[:, 0]); ys = np.interp(t, cum, a[:, 1])
                    dx = np.gradient(xs); dy = np.gradient(ys); nn = np.hypot(dx, dy) + 1e-9
                    dirn = np.stack([dx / nn, dy / nn], 1)
                    if sub == 'even':
                        r = np.full_like(t, half * 1.05)
                    else:
                        along = np.abs(dirn @ AX)  # 1 on the slant (downstroke), 0 across it
                        r = S * (HAIR + (SHADE - HAIR) * along ** 3)
                        if st_.get('thin'): r = np.full_like(t, HAIR * S)
                        if name in LOOPS:
                            by = (48.2 + TOP) * S  # baseline in crop pixels
                            for ii in range(len(xs)):
                                if ys[ii] > by + 1.0 * S:
                                    row = right_edge.get(int(ys[ii]) // 4)
                                    if row is not None and xs[ii] < row - 1.2 * S:
                                        r[ii] = HAIR * S
                        ddx = np.gradient(dx); ddy = np.gradient(dy)
                        kap = np.abs(dx * ddy - dy * ddx) / (nn ** 3)
                        kap = cv2.GaussianBlur(kap.reshape(1, -1), (0, 0), 8).ravel() if len(kap) > 3 else kap
                        r = np.minimum(r, np.maximum(HAIR * S, 0.55 / (kap + 1e-6)))
                        r = cv2.GaussianBlur(r.reshape(1, -1), (0, 0), 6).ravel() if len(r) > 3 else r
                    # taper free ends over 2.5 pt
                    tl = 2.5 * S
                    for isfree, dist in ((st_['free'][0], t), (st_['free'][1], total - t)):
                        if isfree:
                            r = r * np.clip(0.08 + 0.92 * (dist / tl) ** 0.7, 0.08, 1)
                    if total < 2.5 * S and all(st_['free']):  # a dot (ё, й) or a short mark
                        cv2.circle(canvas, (int(round((xs.mean() + pad) * 4)), int(round((ys.mean() + pad) * 4))), int(round(SHADE * S * 0.9 * 4)), 1, -1, lineType=cv2.LINE_AA, shift=2)
                        continue
                    for x, y, rr in zip(xs, ys, r):
                        cv2.circle(canvas, (int(round((x + pad) * 4)), int(round((y + pad) * 4))), max(1, int(round(rr * 4))), 1, -1, lineType=cv2.LINE_AA, shift=2)
                for cx, cy in dots:
                    cv2.circle(canvas, (int(round((cx + pad) * 4)), int(round((cy + pad) * 4))), int(round(SHADE * S * 0.85 * 4)), 1, -1, lineType=cv2.LINE_AA, shift=2)
                canvas = canvas[pad:-pad, pad:-pad]
                ys_, xs_ = np.nonzero(canvas)
                xl, xr = xs_.min() / S + INSET - 4, xs_.max() / S + INSET + 4
                label = LET[idx] if col == 'upper' else LET[idx].lower()
                n = trace(canvas, name, sub, INSET, -TOP, xl, xr, label)
            print(name, f'pen {2 * half / S:.2f} pt', len(keep), 'strokes', n, 'bytes')
