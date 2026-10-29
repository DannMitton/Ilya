# r4 edits (2026-10-29), all in kind 2 (kind 1 and held1/held2 are r3's, unchanged): (1) the rotation is drawn from the negatives of the cached deskew corrections of the 208 crops of the nine photocopy songs (row 117 results/angles.json) instead of uniform within 3.0 degrees;
# (2) the five calibration owners (erode_mult, dil_mult, bold_p, pepper_mult, cut_p) come from the JSON file named by DAMAGE (r3's values are the defaults, all 1.0 and 0.6 and 0.9); (3) WORK is r4's. Nothing else changed.
"""Row 105: render kinds 1 and 2 and the held-out rows from ~/Downloads/_desk-row105/text/*.json with Pillow (100 px em = 24 pt at 300 dpi, as row 82's text2image),
then damage. Kind 1: row 82's own rough() (render.py, copied unchanged, below). Kind 2: the photocopy damage of the brief, every size a share of the row's ink height H
(clean.py's ink_rows_extent, 2 to 98 percent) or of the stroke width sw. Writes <outdir>/<prefix>-<id>.png and .gt.txt, and a params json per row.
Usage: render105.py <kind1|kind2|held1|held2> <outdir> <first N> <shard i> <shards>"""
import sys, os, re, json, random, glob
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont
from multiprocessing import Pool
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common105 import *
WORK = WORKD; import json as _json
DMG = dict(erode_mult=1.0, dil_mult=1.0, bold_p=0.6, pepper_mult=1.0, cut_p=0.9)
if os.environ.get('DAMAGE'): DMG.update(_json.load(open(os.environ['DAMAGE'])))
ANGLES = None
def angles():
    global ANGLES
    if ANGLES is None:
        a = _json.load(open(os.path.expanduser('~/Downloads/_desk-row105/r4/mroot/n135-row117/results/angles.json')))
        ANGLES = [-v['correction_deg'] + 0.0 for k, v in sorted(a.items()) if k.split('-')[0] in ('B01','B02','B03','B04','B06','B07','B08','B09','B10')]
    return ANGLES
S = '/System/Library/Fonts/'; F = os.path.expanduser('~/Downloads/_desk-prereform/fonts/')
FONTS = {'Old Standard TT': (F + 'OldStandard-Regular.ttf', 0), 'PT Serif': (F + 'PT_Serif-Web-Regular.ttf', 0), 'Gentium Book Plus': (F + 'GentiumBookPlus-Regular.ttf', 0),
         'Spectral': (F + 'Spectral-Regular.ttf', 0), 'Tinos': (F + 'Tinos-Regular.ttf', 0),
         'Times New Roman': (S + 'Supplemental/Times New Roman.ttf', 0), 'Georgia': (S + 'Supplemental/Georgia.ttf', 0), 'Palatino': (S + 'Palatino.ttc', 0),
         'Baskerville': (S + 'Supplemental/Baskerville.ttc', 0), 'Didot Bold': (S + 'Supplemental/Didot.ttc', 2)}
_fc = {}
def font(n):
    if n not in _fc: p, i = FONTS[n]; _fc[n] = ImageFont.truetype(p, 100, index=i)
    return _fc[n]
def ink_rows_extent(grey):
    rs = (grey < 128).sum(axis=1).astype(np.int64); tot = rs.sum()
    if tot == 0: return None
    cum = np.cumsum(rs); return int(np.searchsorted(cum, 0.02 * tot)), int(np.searchsorted(cum, 0.98 * tot))
def render_line(tokens, fname, rng):
    f = font(fname); sp = f.getlength(' ')
    xs = []; x = 20.0
    for t in tokens:
        xs.append(x); x += f.getlength(t) + sp * (rng.randint(2, 9) if rng.random() < 0.85 else rng.randint(10, 22))
    W = int(x) + 20; im = Image.new('L', (W, 220), 255); d = ImageDraw.Draw(im)
    for t, x0 in zip(tokens, xs): d.text((x0, 40), t, font=f, fill=0)
    a = np.asarray(im); ys, xs_ = np.where(a < 128)
    if len(ys) == 0: return None
    return a[ys.min():ys.max() + 1, xs_.min():xs_.max() + 1]
# ---- row 82's rough(), unchanged (render.py), taking a grey array
def rough82(a, rng):
    a = a.astype(np.float32); h, w = a.shape
    if h > 175: return None
    sc = rng.uniform(0.5, 0.7); a = cv2.resize(a, (max(8, int(w * sc)), max(8, int(h * sc))), interpolation=cv2.INTER_AREA); h, w = a.shape
    ink = 255 - a
    if rng.random() < 0.5:
        k = np.ones((2, 2), np.uint8); ink = cv2.dilate(ink, k) if rng.random() < 0.7 else cv2.erode(ink, k)
    ink = cv2.GaussianBlur(ink, (0, 0), rng.uniform(0.4, 1.1))
    padv = int(h * rng.uniform(0.15, 0.4)); padh = rng.randint(15, 90)
    ink = cv2.copyMakeBorder(ink, padv, padv, padh, padh, cv2.BORDER_CONSTANT, value=0); H, W = ink.shape
    M = cv2.getRotationMatrix2D((W / 2, H / 2), rng.uniform(-0.5, 0.5), 1.0); ink = cv2.warpAffine(ink, M, (W, H), flags=cv2.INTER_LINEAR, borderValue=0)
    if rng.random() < 0.3:
        x = max(0, rng.choice([rng.randint(0, padh), W - rng.randint(1, padh)])); x2 = x + rng.randint(1, 3); ink[:, x:x2] = np.maximum(ink[:, x:x2], rng.randint(120, 230))
    if rng.random() < 0.2:
        x = rng.randint(0, W - 20); y = rng.choice([0, H - 4]); ink[y:y + rng.randint(2, 4), x:x + rng.randint(8, 18)] = rng.randint(100, 220)
    paper = rng.uniform(190, 252); inkc = rng.uniform(5, 70); out = paper - (ink / 255.0) * (paper - inkc)
    lf = cv2.resize(np.random.RandomState(rng.randint(0, 2 ** 31)).randn(max(2, H // 20), max(2, W // 40)).astype(np.float32), (W, H))
    out = out * (1 + 0.025 * lf) + np.random.RandomState(rng.randint(0, 2 ** 31)).randn(H, W) * rng.uniform(2, 9)
    out = np.clip(out, 0, 255).astype(np.uint8); im = Image.fromarray(out)
    if rng.random() < 0.4:
        import io; b = io.BytesIO(); im.save(b, 'JPEG', quality=rng.randint(40, 85)); b.seek(0); im = Image.open(b).convert('L')
    return np.asarray(im)
# ---- kind 2: the photocopy damage
HEIGHTS = None
def heights():
    global HEIGHTS
    if HEIGHTS is None:
        HEIGHTS = []
        for L in ['B01', 'B02', 'B03', 'B04', 'B06', 'B07', 'B08', 'B09', 'B10']:
            for f in glob.glob(os.path.expanduser(f'~/Downloads/_desk-n135/crops2/{L}-*.png')):
                e = ink_rows_extent(np.asarray(Image.open(f).convert('L')))
                if e and 20 <= e[1] - e[0] + 1 <= 60: HEIGHTS.append(e[1] - e[0] + 1)   # single rows, as results/inkheights.txt's 23 to 51 range
    return HEIGHTS
def blobs(shape, share, rng, nrs, scale):
    """a random mask covering about `share` of the area, blobs of low-frequency noise (scale px)."""
    h, w = shape; f = nrs.randn(max(2, h // scale + 1), max(2, w // scale + 1)).astype(np.float32); f = cv2.resize(f, (w, h), interpolation=cv2.INTER_CUBIC)
    thr = np.quantile(f, 1 - share); return f > thr
def damage2(a, rng, P):
    nrs = np.random.RandomState(rng.randint(0, 2 ** 31))
    e = ink_rows_extent(a); Hk = rng.choice(heights()); f = Hk / max(1, e[1] - e[0] + 1)
    a = cv2.resize(a, (max(8, round(a.shape[1] * f)), max(8, round(a.shape[0] * f))), interpolation=cv2.INTER_AREA); P['H'] = int(Hk)
    ink = (255 - a).astype(np.float32); h, w = ink.shape
    area = float((ink > 127).sum()); per = float(((ink > 127) & ~(cv2.erode((ink > 127).astype(np.uint8), np.ones((3, 3), np.uint8)) > 0)).sum()); sw = max(1.5, 2 * area / max(per, 1)); P['sw'] = round(sw, 2)
    # cut the row through its own ascenders and descenders (in the text's own frame, so no text is lost to the tilt), then rotate (grey, bilinear) on a canvas tall enough to keep all of it
    ys = np.where((ink > 127).any(axis=1))[0]; top, bot = int(ys.min()), int(ys.max()); cut = rng.random() < DMG['cut_p']; P['cut_through_ascenders'] = bool(cut)
    if cut:
        rs = (ink > 127).sum(axis=1); body = np.where(rs > 0.35 * rs.max())[0]; b0, b1 = int(body.min()), int(body.max())   # the x-height band: rows holding over a third of the densest row's ink
        u1, u2 = rng.uniform(0.0, 0.9), rng.uniform(0.0, 0.9); y0 = top + int(u1 * max(0, b0 - top)); y1 = bot - int(u2 * max(0, bot - b1))
        P.update(cut_asc_frac=round(u1, 2), cut_desc_frac=round(u2, 2), asc_over_H=round((b0 - top) / Hk, 2), desc_over_H=round((bot - b1) / Hk, 2))
    else:
        m = int(rng.uniform(0.15, 0.4) * Hk); y0, y1 = max(0, top - m), min(h - 1, bot + m)
    ink = ink[y0:y1 + 1]; h, w = ink.shape
    th = float(rng.choice(angles())); P['rot_deg'] = round(th, 2)   # r4: the negative of a real photocopy crop's cached deskew correction
    pv = int(0.5 * Hk + 0.55 * w * abs(np.tan(np.radians(th)))) + 4; ph = int(1.0 * Hk); ink = cv2.copyMakeBorder(ink, pv, pv, ph, ph, cv2.BORDER_CONSTANT, value=0); H, W = ink.shape
    ink = cv2.warpAffine(ink, cv2.getRotationMatrix2D((W / 2, H / 2), th, 1.0), (W, H), flags=cv2.INTER_LINEAR, borderValue=0)
    # toner fade along the row
    fade = rng.uniform(0, 0.4) if rng.random() < 0.7 else 0.0; P['fade'] = round(fade, 2)
    if fade > 0:
        ramp = np.linspace(0, 1, W, dtype=np.float32); ramp = ramp if rng.random() < 0.5 else ramp[::-1]; ink = ink * (1 - fade * ramp)[None, :]
    ink = cv2.GaussianBlur(ink, (0, 0), rng.uniform(0.1, 0.3) * sw); b = (ink > rng.uniform(60, 110)).astype(np.uint8)
    # broken strokes (random erosion), filled counters (random dilation): blobs of the row, kernel a share of the stroke width
    se = min(0.9, DMG['erode_mult'] * rng.uniform(0.05, 0.3)); ke = max(2, int(round(rng.uniform(0.25, 0.6) * sw))); sd = min(0.9, DMG['dil_mult'] * rng.uniform(0.03, 0.25)); kd = max(2, int(round(rng.uniform(0.2, 0.5) * sw)))
    P.update(erode_share=round(se, 2), erode_k_over_sw=round(ke / sw, 2), dil_share=round(sd, 2), dil_k_over_sw=round(kd / sw, 2))
    bold = rng.random() < DMG['bold_p']; P['bold_1px_over_sw'] = round(1 / sw, 2) if bold else 0
    if bold: b = cv2.dilate(b, np.ones((2, 2), np.uint8), anchor=(0, 0))   # heavier toner, one pixel
    be = cv2.erode(b, np.ones((ke, ke), np.uint8)); bd = cv2.dilate(b, np.ones((kd, kd), np.uint8))
    me = blobs(b.shape, se, rng, nrs, max(6, int(0.4 * Hk))); md = blobs(b.shape, sd, rng, nrs, max(6, int(0.4 * Hk)))
    b = np.where(me, be, b); b = np.where(md & ~me, bd, b).astype(np.uint8)
    # speckle: salt on the paper, pepper in the ink
    ds = rng.uniform(0, 0.0004); dp = DMG['pepper_mult'] * rng.uniform(0, 0.012); P.update(salt=round(ds, 5), pepper=round(dp, 4))
    salt = nrs.rand(*b.shape) < ds; pepper = (nrs.rand(*b.shape) < dp) & (b > 0)
    b = np.where(salt, 1, b); b = np.where(pepper, 0, b).astype(np.uint8)
    out = np.where(b > 0, 0, 255).astype(np.uint8); H, W = out.shape
    ys = np.where((out < 128).any(axis=1))[0]
    if len(ys) == 0: return None
    out = out[max(0, int(ys.min()) - 1):int(ys.max()) + 2]; H = out.shape[0]   # tight band: the rotated strip's own edges are the cut
    # horizontal margins
    x_ = np.where((out < 128).any(axis=0))[0]; lm, rm = int(rng.uniform(0.3, 2.0) * Hk), int(rng.uniform(0.3, 2.0) * Hk)
    out = out[:, max(0, x_.min() - lm): x_.max() + rm + 1]; H, W = out.shape
    # intruding staff and stem ink (a share of the lines), and a barline stub
    if rng.random() < 0.25:
        P['staff'] = True
        for edge in rng.sample(['top', 'bot'], rng.randint(1, 2)):
            t = max(1, int(round(rng.uniform(0.3, 0.8) * sw))); y = rng.randint(0, max(0, int(0.12 * Hk))) if edge == 'top' else H - t - rng.randint(0, max(0, int(0.12 * Hk)))
            x0 = 0 if rng.random() < 0.3 else rng.randint(0, W // 2); x1 = W if x0 == 0 else min(W, x0 + rng.randint(int(2 * Hk), int(0.4 * W) + int(2 * Hk)))
            out[max(0, y):max(0, y) + t, x0:x1] = 0
    if rng.random() < 0.25:
        P['stems'] = True
        for _ in range(rng.randint(1, 3)):
            wd = max(1, int(round(rng.uniform(0.8, 1.5) * sw))); L_ = int(rng.uniform(0.3, 0.8) * Hk); x = rng.randint(0, W - wd - 1)
            if rng.random() < 0.5: out[:L_, x:x + wd] = 0
            else: out[H - L_:, x:x + wd] = 0
    if rng.random() < 0.3:
        P['barline'] = True; wd = max(1, int(round(rng.uniform(0.8, 1.5) * sw))); x = rng.choice([rng.randint(0, max(1, lm)), W - wd - rng.randint(1, max(2, rm))]); out[:, max(0, x):max(0, x) + wd] = 0
    return out
def job(a):
    kind, spec, seed, outdir, prefix = a
    rng = random.Random(seed); fname = rng.choice(list(FONTS)); tokens = spec['gt']; P = dict(font=fname, kind=kind)
    g = render_line(tokens, fname, rng)
    if g is None: return (spec['id'], 'blank', {})
    if kind in ('kind1', 'held1'): out = rough82(g, rng)
    else: out = damage2(g, rng, P)
    if out is None: return (spec['id'], 'rejected', P)
    name = f'{prefix}-{spec["id"]}'
    Image.fromarray(out.astype(np.uint8)).save(f'{outdir}/{name}.png'); open(f'{outdir}/{name}.gt.txt', 'w', encoding='utf8').write(' '.join(tokens) + '\n')
    return (spec['id'], 'ok', P)
if __name__ == '__main__':
    kind, outdir, n, si, ns = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5])
    src = {'kind1': 'kind1', 'kind2': 'kind2', 'held1': 'held', 'held2': 'held'}[kind]; L = json.load(open(f'{WORK}/text/{src}.json', encoding='utf8'))
    if kind == 'held1': L = L[:500]
    if kind == 'held2': L = L[500:]
    L = L[:n]; os.makedirs(outdir, exist_ok=True); heights()
    base = {'kind1': 101, 'kind2': 202, 'held1': 303, 'held2': 404}[kind]; pre = f'{kind}{chr(97 + si)}'
    jobs = [(kind, s, base * 1000003 + k, outdir, pre) for k, s in enumerate(L) if k % ns == si]
    with Pool(8) as p: res = p.map(job, jobs, chunksize=16)
    json.dump(res, open(f'{outdir}/_render_{pre}.json', 'w'), ensure_ascii=False)
    import collections; print(pre, collections.Counter(r[1] for r in res))
