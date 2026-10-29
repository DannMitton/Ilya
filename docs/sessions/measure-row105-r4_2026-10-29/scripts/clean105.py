# Row 105 copy of row 117's clean.py. ONLY EDIT: CROPS, ROOT and ANG (the crop folder, the root, the angles cache) come from CLEAN_CROPS, CLEAN_ROOT, CLEAN_ANG. Every function and the step list are unchanged.
"""Row 117 (mine): writes cleaned variants of the row crops, same file names, same pixel size, in <outdir> (a folder under /home/claude/n135-row117/ only).
Usage: python3 clean.py <outdir> <steps> <song> [song ...]
  steps: comma-separated, applied in order: deskew | sauvola:<window>:<k> | close:<k> | deskewflip and deskewgt05 (controls, see the report)
  e.g.   deskew,sauvola:25:0.2,close:2
Crops are read from /root/n135work/crops2/<song>-*.png (RGBA, alpha 255 everywhere where checked; converted to greyscale 'L').
- sauvola: skimage.filters.threshold_sauvola(grey, window_size=<window>, k=<k>) (r left at skimage's default, 128 for uint8); pixel > threshold is white 255, else ink 0.
- deskew: the crop's angle is the rotation (OpenCV convention: positive is counter-clockwise) that maximises the variance of the horizontal projection of the ink
  (ink = grey < 128), swept from -3.0 to +3.0 degrees in 0.1 steps on a mask padded 120 px above and below (so the sweep does not lose ink off the frame); ties go to the
  smaller |angle|. The grey crop is rotated by that angle about its centre, bilinear, white (255) border, SAME size (so the harness's x0, y0 offsets still apply). The text-line
  angle is the negative of the rotation applied. An angle of 0.0 copies the crop unrotated.
- close: morphological closing of the INK, run on the inverted greyscale (255 - grey) with a k by k kernel of ones: dilate then erode, as grey morphology; for k=2 the dilation
  anchor is (0,0) and the erosion anchor (1,1), because OpenCV's default anchor makes a 2 by 2 closing non-extensive (tested: the closing lost ink pixels of the original); for k=3 the
  centred anchor. The result is inverted back (black ink on white).
Angles are cached in /home/claude/n135-row117/results/angles.json and written to angles.csv by `python3 clean.py --angles-csv`."""
import sys, os, glob, json, csv
import numpy as np, cv2
from PIL import Image
from skimage.filters import threshold_sauvola

CROPS = os.environ['CLEAN_CROPS']; ROOT = os.environ['CLEAN_ROOT']; ANG = os.environ['CLEAN_ANG']   # row 105: the three paths, from the environment (the only edit; the desk's copy of clean.py is n135-row117/scripts/clean.py)
SWEEP = [round(x / 10, 1) for x in range(-30, 31)]

def load_grey(f): return np.asarray(Image.open(f).convert('L'))

def estimate_angle(grey):
    ink = (grey < 128).astype(np.float32); pad = 120
    m = np.pad(ink, ((pad, pad), (0, 0))); h, w = m.shape; c = (w / 2, h / 2); best = None; table = {}
    for th in SWEEP:
        M = cv2.getRotationMatrix2D(c, th, 1.0)
        r = cv2.warpAffine(m, M, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
        v = float(np.var(r.sum(axis=1))); table[th] = v
    mx = max(table.values())
    cands = sorted([th for th, v in table.items() if v >= mx * (1 - 1e-12)], key=abs)
    return cands[0], table

def deskew(grey, th):
    if th == 0.0: return grey.copy()
    h, w = grey.shape; M = cv2.getRotationMatrix2D((w / 2, h / 2), th, 1.0)
    return cv2.warpAffine(grey, M, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=255)

def sauvola(grey, window, k):
    t = threshold_sauvola(grey, window_size=window, k=k)
    return np.where(grey > t, 255, 0).astype(np.uint8)

def close_ink(grey, k):
    inv = 255 - grey; K = np.ones((k, k), np.uint8)
    if k % 2 == 0: d = cv2.dilate(inv, K, anchor=(0, 0)); c = cv2.erode(d, K, anchor=(k - 1, k - 1))
    else: d = cv2.dilate(inv, K); c = cv2.erode(d, K)
    return 255 - c


# ---- Step 5, the row's frame (added 2026-10-27 after the coordinator's second message) ----
def ink_rows_extent(grey):
    """Ink = grey < 128. Returns (p2, p98, centroid) of the ink pixels' row coordinates (mass-weighted percentiles: the first row where the cumulative ink count reaches 2 and 98 percent), or None without ink."""
    rs = (grey < 128).sum(axis=1).astype(np.int64); tot = rs.sum()
    if tot == 0: return None
    cum = np.cumsum(rs); p2 = int(np.searchsorted(cum, 0.02 * tot)); p98 = int(np.searchsorted(cum, 0.98 * tot))
    cen = float((rs * np.arange(len(rs))).sum() / tot); return p2, p98, cen

def pad_white(g, tb, lr):
    return np.pad(g, ((tb, tb), (lr, lr)), mode='constant', constant_values=255)

def scale_to_ink_height(g, H):
    e = ink_rows_extent(g)
    if e is None: return g
    ext = e[1] - e[0] + 1; f = H / ext
    w, h = g.shape[1], g.shape[0]; nw, nh = max(1, round(w * f)), max(1, round(h * f))
    return cv2.resize(g, (nw, nh), interpolation=cv2.INTER_CUBIC)

def centre_ink(g):
    e = ink_rows_extent(g)
    if e is None: return g
    dy = int(round((g.shape[0] - 1) / 2 - e[2])); out = np.full_like(g, 255)
    if dy >= 0: out[dy:, :] = g[:g.shape[0] - dy, :] if dy else g
    else: out[:dy, :] = g[-dy:, :]
    return out

def angles():
    return json.load(open(ANG)) if os.path.exists(ANG) else {}

def get_angle(name, grey, cache):
    if name not in cache:
        th, tab = estimate_angle(grey); cache[name] = {'correction_deg': th, 'text_line_deg': -th if th != 0 else 0.0, 'var_at_0': tab[0.0], 'var_best': tab[th]}
    return cache[name]['correction_deg']

def run(outdir, steps, songs):
    os.makedirs(outdir, exist_ok=True); cache = angles(); n = 0; ink_in = ink_out = 0
    for L in songs:
        for f in sorted(glob.glob(f'{CROPS}/{L}-*.png')):
            name = os.path.basename(f); g0 = load_grey(f); g = g0; resized = False
            for s in steps.split(','):
                if s == 'deskew': g = deskew(g, get_angle(name, g0, cache))
                elif s == 'shift11': g2 = np.full_like(g, 255); g2[1:, 1:] = g[:-1, :-1]; g = g2  # CONTROL: a one-pixel shift right and down, white border; changes nothing about the print
                elif s == 'shift20': g2 = np.full_like(g, 255); g2[:, 2:] = g[:, :-2]; g = g2  # CONTROL (second sample): a two-pixel shift right
                elif s == 'down1': g2 = np.full_like(g, 255); g2[1:, :] = g[:-1, :]; g = g2  # CONTROL: one pixel down, white border
                elif s == 'up1': g2 = np.full_like(g, 255); g2[:-1, :] = g[1:, :]; g = g2  # CONTROL: one pixel up, white border
                elif s == 'deskewflip': g = deskew(g, -get_angle(name, g0, cache))  # CONTROL: rotates by the negative of the angle found
                elif s == 'deskewgt05': t = get_angle(name, g0, cache); g = deskew(g, t if abs(t) > 0.5 else 0.0)  # CONTROL: only crops above 0.5 degrees
                elif s.startswith('sauvola'): _, w, k = s.split(':'); g = sauvola(g, int(w), float(k))
                elif s.startswith('close'): _, k = s.split(':'); g = close_ink(g, int(k))
                elif s.startswith('pad:'): _, tb, lr = s.split(':'); g = pad_white(g, int(tb), int(lr)); resized = True
                elif s.startswith('padpaper:'): _, tb, lr = s.split(':'); paper = int(np.bincount(g.ravel(), minlength=256).argmax()); g = np.pad(g, ((int(tb), int(tb)), (int(lr), int(lr))), mode='constant', constant_values=paper); resized = True  # EXTRA: pad with the crop's own commonest grey
                elif s.startswith('height:'): g = scale_to_ink_height(g, int(s.split(':')[1])); resized = True
                elif s == 'centre': g = centre_ink(g)
                else: raise SystemExit('unknown step ' + s)
            if not resized: assert g.shape == g0.shape, (name, g.shape, g0.shape)
            Image.fromarray(g, mode='L').save(f'{outdir}/{name}'); n += 1
            ink_in += int((255 - g0.astype(np.int32)).sum() // 255); ink_out += int((255 - g.astype(np.int32)).sum() // 255)
    os.makedirs(os.path.dirname(ANG), exist_ok=True); json.dump(cache, open(ANG, 'w'))
    print(f'{outdir}: {n} crops, steps {steps}, ink mass (sum of 255-grey over 255) in {ink_in} out {ink_out} ({100 * (ink_out - ink_in) / max(ink_in, 1):+.2f} percent)')

if __name__ == '__main__':
    if sys.argv[1] == '--angles-csv':
        c = angles(); w = csv.writer(open(f'{ROOT}/results/angles.csv', 'w', newline='')); w.writerow(['crop', 'correction_deg_applied_ccw_positive', 'text_line_deg', 'var_at_0', 'var_best'])
        for k in sorted(c): w.writerow([k, c[k]['correction_deg'], c[k]['text_line_deg'], f"{c[k]['var_at_0']:.1f}", f"{c[k]['var_best']:.1f}"])
        print(len(c), 'crops in angles.csv')
    else:
        run(sys.argv[1], sys.argv[2], sys.argv[3:])
