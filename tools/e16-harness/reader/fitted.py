"""The trial of fitted shapes (QUEUE row 24, brief 2026-10-02). NOT USED BY THE READER: nothing imports this module
unless a measurement turns it on. `shape.py`, `INK_WEIGHT_GUARD`, and the events the reader emits are untouched.

THE IDEA (Dann, 2026-10-02): a pristine staff is five identical parallel lines; a note is a few forms on it. Instead of
asking what the ink's area is, fit the forms to the ink with the staff lines left in, and read the form's numbers.

  head  an ellipse: centre, two semi-axes, tilt, filled or hollow
  stem  a segment: column, the head's end, the far end, thickness
  dot   a disc: centre, diameter
  beam  a bar: thickness, slope

EVERYTHING IS FITTED TO THE GREY-LEVEL INK, not to the cut at 128: `dark = 1 - img/255`. The model is the union
(a maximum) of the staff lines, as analytic bands at their traced places and their locally measured thickness, and the
form. A pixel's model value is the share of the pixel the form covers (a straight-edge approximation to its signed
distance), so the loss is smooth in the parameters and a fit lands between pixels. The fit is Levenberg-Marquardt
with a finite-difference Jacobian; numpy only, so it runs under the pinned Pyodide (0.26.4: cv2 4.9.0, numpy 1.26.4).

PIXEL CONVENTION. A pixel's centre is at the integer coordinate. The SVG's continuous coordinates put pixel k at
[k, k+1), so a position taken from the SVG is moved by -0.5 before it is compared with a fit.

EVERY NUMBER HERE IS A DESK DEFAULT OR A FIT SETTING, NONE FITTED TO THE FIVE BUILD SONGS; each is named and says where it
comes from. Units are staff spaces (`s`) unless a name says pixels (`_px`).
"""
import math
from fractions import Fraction
import numpy as np

# --- settings (the desk's; listed in the report with their source) ---
WIN_HALF_S   = 0.85   # head window: half-width and half-height around the reader's centre, s (Gould: a head is about 1.2 s wide)
INIT_A_S     = 0.62   # head start: semi-axes and tilt. A start, not a bound; the fit moves off it.
INIT_B_S     = 0.46
INIT_TILT    = (-30.0, 0.0, 30.0)     # degrees of the long axis from +x, y down; three starts, the best loss is kept
INIT_DY_PX   = (0.0, -2.5, 2.5)      # three starts in the vertical centre, pixels
LM_ITERS     = 40
FAR_IGNORE_S = 0.30   # ink farther than this from the form's edge, and not a line, is another element: weight 0
LINE_STRIP_S = 3.5    # the strip each side of the head in which a line's own place and thickness are measured
LINE_SKIP_S  = (1.0, 1.1)   # the part of that strip left out (the head and what sits against it)
STEM_SEARCH_PX = 3    # columns each side of the reader's stem column that the stem fit reads


def _cov_line(Y, yc, t):
    """Share of each pixel row [Y-0.5, Y+0.5] covered by a band [yc-t/2, yc+t/2]."""
    return np.clip(np.minimum(Y + 0.5, yc + t / 2) - np.maximum(Y - 0.5, yc - t / 2), 0.0, 1.0)


def _ell_dist(X, Y, cx, cy, a, b, th):
    """First-order signed distance (px) to an ellipse: negative inside. Exact for a circle."""
    c, s_ = math.cos(th), math.sin(th)
    u = (X - cx) * c + (Y - cy) * s_
    v = -(X - cx) * s_ + (Y - cy) * c
    rho = np.sqrt((u / a) ** 2 + (v / b) ** 2) + 1e-9
    g = np.sqrt((u / a ** 2) ** 2 + (v / b ** 2) ** 2) / rho + 1e-12
    return (rho - 1.0) / g


def _cov_ell(X, Y, cx, cy, a, b, th):
    return np.clip(0.5 - _ell_dist(X, Y, cx, cy, a, b, th), 0.0, 1.0)


def _lm(res, p0, lo, hi, iters=LM_ITERS, h=0.02):
    """Levenberg-Marquardt on `res(p) -> vector`, bounded by clipping. Returns (p, sum of squares)."""
    p = np.clip(np.array(p0, float), lo, hi)
    r = res(p); f = float(r @ r); lam = 1e-2
    for _ in range(iters):
        J = np.empty((r.size, p.size))
        for k in range(p.size):
            q = p.copy(); dk = h * max(1.0, abs(p[k])) * (0.2 if k >= 3 else 1.0)
            q[k] += dk; J[:, k] = (res(np.clip(q, lo, hi)) - r) / dk
        A = J.T @ J; g = J.T @ r
        improved = False
        for _ in range(8):
            try: step = np.linalg.solve(A + lam * np.diag(np.maximum(np.diag(A), 1e-9)), -g)
            except np.linalg.LinAlgError: lam *= 10; continue
            q = np.clip(p + step, lo, hi); rq = res(q); fq = float(rq @ rq)
            if fq < f - 1e-9:
                if f - fq < 1e-7 * max(f, 1.0): p, r, f = q, rq, fq; improved = False; break
                p, r, f = q, rq, fq; lam = max(lam / 3, 1e-6); improved = True; break
            lam *= 4
        if not improved: break
    return p, f


# --------------------------------------------------------------------------------------------- the staff lines

def local_lines(dark, staff, line_t, s, x0, skip_cols):
    """Each of the five lines' own place and thickness near x0, from the columns of a strip either side of the head
    that are not in `skip_cols`: the darkness-weighted centre of the ink within 3 px of the traced row, and the ink's
    total, per column; the median over the columns. Falls back to the traced row and `line_t` when too few columns."""
    H, W = dark.shape
    out = []
    xa = max(0, int(x0 - LINE_STRIP_S * s)); xb = min(W, int(x0 + LINE_STRIP_S * s) + 1)
    cols = [c for c in range(xa, xb)
            if not (x0 - LINE_SKIP_S[0] * s <= c <= x0 + LINE_SKIP_S[1] * s) and c not in skip_cols]
    for yt in staff:
        ya, yb = int(yt) - 3, int(yt) + 3
        if ya < 0 or yb >= H or not cols:
            out.append((float(yt), float(line_t), 0)); continue
        sub = dark[ya:yb + 1, :][:, cols]
        tot = sub.sum(0)
        okc = (tot >= 0.5 * line_t) & (tot <= 1.8 * line_t + 1.0)
        if okc.sum() < 8:
            out.append((float(yt), float(line_t), 0)); continue
        ys = np.arange(ya, yb + 1)[:, None]
        cen = (sub * ys).sum(0) / np.maximum(tot, 1e-9)
        out.append((float(np.median(cen[okc])), float(np.median(tot[okc])), int(okc.sum())))
    return out


def ledger_rows(staff, s, cy, line_t):
    """Nominal ledger lines (row, thickness) between the staff and a head at row cy: one per step of the staff space."""
    top, bot = float(staff[0]), float(staff[-1]); sl = (bot - top) / 4.0
    rows = []
    if cy > bot + 0.5 * sl:
        k = 1
        while bot + k * sl <= cy + 0.6 * sl: rows.append(bot + k * sl); k += 1
    elif cy < top - 0.5 * sl:
        k = 1
        while top - k * sl >= cy - 0.6 * sl: rows.append(top - k * sl); k += 1
    return rows


# --------------------------------------------------------------------------------------------- the head

def fit_head(dark, x0, y0, staff, line_t, s, stem=None, hollow=False):
    """Fit an ellipse to the head near (x0, y0), staff lines left in. `stem` is the reader's stem (x, dir) if it found one;
    its corridor is left out of the loss. Returns a dict of the fit and its quality, or None if the window leaves the page."""
    H, W = dark.shape
    hw = int(math.ceil(WIN_HALF_S * s))
    xa, xb = int(round(x0)) - hw, int(round(x0)) + hw + 1
    ya, yb = int(round(y0)) - hw, int(round(y0)) + hw + 1
    if xa < 1 or ya < 1 or xb >= W - 1 or yb >= H - 1: return None
    Y, X = np.mgrid[ya:yb, xa:xb].astype(float)
    D = dark[ya:yb, xa:xb]
    skip = set()
    use = np.ones(D.shape, bool)
    if stem is not None:
        sx, sd = stem['x'], stem['dir']
        for c in range(sx - 3, sx + 4): skip.add(c)
        # the corridor: the stem's columns, from the head's row out in the stem's direction
        cmask = (np.abs(X - sx) <= 2.5)
        if sd < 0: cmask &= (Y <= y0 - 0.15 * s)
        else:      cmask &= (Y >= y0 + 0.15 * s)
        use &= ~cmask
    lines = local_lines(dark, staff, line_t, s, x0, skip)
    bands = [(yc, t) for yc, t, _n in lines] + [(r, line_t) for r in ledger_rows(staff, s, y0, line_t)]
    Lcov = np.zeros_like(D)
    for yc, t in bands: Lcov = np.maximum(Lcov, _cov_line(Y, yc, t))
    # the line's own ink everywhere in the window is modelled; the head is the form fitted over it
    a0, b0 = INIT_A_S * s, INIT_B_S * s
    best = None
    for tilt in INIT_TILT:
        for dy in INIT_DY_PX:
            th0 = math.radians(tilt)
            p0 = [x0, y0 + dy, a0, b0, th0] + ([0.55] if hollow else [])
            lo = [x0 - 0.45 * s, y0 - 0.55 * s, 0.35 * s, 0.25 * s, -math.pi * 0.75] + ([0.2] if hollow else [])
            hi = [x0 + 0.45 * s, y0 + 0.55 * s, 0.95 * s, 0.80 * s, math.pi * 0.75] + ([0.9] if hollow else [])
            # outer-loop reweighting: ink far from the form that is not a line is another element
            w = np.ones(D.shape)
            for outer in range(2):
                def res(p, w=w):
                    cov = _cov_ell(X, Y, p[0], p[1], p[2], p[3], p[4])
                    if hollow:
                        cov = cov * (1.0 - _cov_ell(X, Y, p[0], p[1], p[2] * p[5], p[3] * p[5], p[4]))
                    mod = np.maximum(Lcov, cov)
                    return ((mod - D) * w)[use]
                p, f = _lm(res, p0, lo, hi)
                dist = _ell_dist(X, Y, p[0], p[1], p[2], p[3], p[4])
                far = (dist > FAR_IGNORE_S * s) & (D > 0.3) & (Lcov < 0.3)
                w = np.where(far, 0.0, 1.0); p0 = list(p)
            if best is None or f < best[1]: best = (p, f, w.copy())
    p, f, w = best
    cx, cy, a, b, th = p[:5]
    if a < b: a, b, th = b, a, th + math.pi / 2
    th = (math.degrees(th) + 90) % 180 - 90        # long axis from +x, y down, in [-90, 90)
    inner = _cov_ell(X, Y, cx, cy, 0.4 * a, 0.4 * b, math.radians(th))
    interior = float((inner * D).sum() / max(inner.sum(), 1e-9))
    n_used = int((use & (w > 0)).sum())
    ink_in_form = float((np.clip(0.5 - _ell_dist(X, Y, cx, cy, a, b, math.radians(th)), 0, 1) * D).sum())
    return dict(cx=float(cx), cy=float(cy), a=float(a), b=float(b),
                tilt_up=float(-th),        # degrees the long axis rises to the right, in [-90, 90)
                interior=interior, hollow=bool(hollow), rms=float(math.sqrt(f / max(n_used, 1))),
                k=(float(p[5]) if hollow else None), n_used=n_used,
                lines=[[float(yc), float(t), n] for yc, t, n in lines],
                form_ink=ink_in_form)


# --------------------------------------------------------------------------------------------- the stem

def fit_stem(dark, head, stem, staff, lines, line_t, s):
    """The stem as a segment: column (centroid), thickness, and the far end, read from the grey-level ink in the columns
    sx-3..sx+3, with the rows inside a line's band skipped for the column and thickness (a line adds ink) and bridged
    for the far end. The head's end is where the column leaves the fitted head's ellipse. Returns None without a stem."""
    if stem is None: return None
    H, W = dark.shape
    sx, sd = int(stem['x']), int(stem['dir'])
    c0, c1 = max(0, sx - STEM_SEARCH_PX), min(W, sx + STEM_SEARCH_PX + 1)
    band = [(yc, t) for yc, t, _n in lines]
    def in_band(r): return any(abs(r - yc) <= t / 2 + 1.5 for yc, t in band)
    cy = head['cy'] if head else float(stem.get('hy', 0))
    # candidate rows: from 1.0 s out from the head's centre to the reader's far end (a little further)
    r_start = int(round(cy + sd * 1.0 * s)); r_stop = int(round(stem['end_y'] + sd * 1.0 * s))
    rows = list(range(r_start, r_stop + sd, sd)) if sd > 0 else list(range(r_start, r_stop + sd, sd))
    rows = [r for r in rows if 0 <= r < H]
    if len(rows) < 4: return None
    prof = np.array([dark[r, c0:c1].sum() for r in rows])
    cen = np.array([(dark[r, c0:c1] * np.arange(c0, c1)).sum() / max(dark[r, c0:c1].sum(), 1e-9) for r in rows])
    clean = np.array([not in_band(r) for r in rows])
    # the stem's own rows: the middle of the run, away from the far end's flag or beam and the head
    n = len(rows); mid = np.zeros(n, bool); mid[int(0.15 * n):int(0.7 * n) + 1] = True
    sel = clean & mid
    if sel.sum() < 4: sel = clean
    if sel.sum() < 4: return None
    thick = float(np.median(prof[sel])); col = float(np.median(cen[sel]))
    # far end: walk outward from the middle; the stem continues while a row holds at least half its thickness;
    # a row inside a line's band is bridged (its ink includes the line's)
    i = int(0.4 * n); last = i
    while i < n:
        if in_band(rows[i]) or prof[i] >= 0.5 * thick: last = i; i += 1
        else: break
    # sub-pixel end: add the fractional coverage of the first short row
    frac = 0.0
    if last + 1 < n and not in_band(rows[last + 1]): frac = float(np.clip(prof[last + 1] / max(thick, 1e-9), 0, 1))
    # the row's own coverage ends at its edge: rows are pixel centres, so the edge is half a pixel out
    end_y = rows[last] + sd * (0.5 + frac) - sd * 0.0
    # the head's end: where the column meets the fitted ellipse, on the stem's side
    head_end = None
    if head:
        ys = np.linspace(head['cy'], head['cy'] + sd * 1.2 * s, 200)
        d = _ell_dist(np.full_like(ys, col), ys, head['cx'], head['cy'], head['a'], head['b'], math.radians(-head['tilt_up']))
        out = np.where(d > 0)[0]
        head_end = float(ys[out[0]]) if out.size else None
    return dict(col=col, thick=thick, far_end=float(end_y), head_end=head_end, dir=sd, n_clean=int(sel.sum()),
                length=float(abs(end_y - (head_end if head_end is not None else cy))))


# --------------------------------------------------------------------------------------------- the dot

def fit_dot(dark, head, lines, line_t, s, rx0=0.85, rx1=2.4, ry0=-1.0, ry1=0.75):
    """A disc to the round mark right of the head, in the window [cx + rx0 s, cx + rx1 s] by [cy + ry0 s, cy + ry1 s].
    The candidate is the connected blob of ink (> 0.5, line bands cut out) whose area lies between 0.04 and 0.6 s^2
    and whose centre is nearest the head; then a disc (centre, radius) is fitted to the grey-level ink around it."""
    import cv2
    H, W = dark.shape
    xa, xb = int(head['cx'] + rx0 * s), int(head['cx'] + rx1 * s)
    ya, yb = int(head['cy'] + ry0 * s), int(head['cy'] + ry1 * s)
    xa, ya = max(1, xa), max(1, ya); xb, yb = min(W - 1, xb), min(H - 1, yb)
    if xb - xa < 6 or yb - ya < 6: return None
    sub = dark[ya:yb, xa:xb]
    binm = (sub > 0.5).astype(np.uint8)
    for yc, t, _n in [(l[0], l[1], l[2]) for l in head['lines']]:
        r0, r1 = int(round(yc - t / 2 - 1)) - ya, int(round(yc + t / 2 + 1)) - ya + 1
        binm[max(0, r0):max(0, r1), :] = 0
    n, lab, st, cen = cv2.connectedComponentsWithStats(binm, 8)
    best = None
    for i in range(1, n):
        area = st[i, 4] / (s * s)
        if not (0.04 <= area <= 0.6): continue
        dxs = (xa + cen[i][0] - head['cx']) / s
        if best is None or dxs < best[0]: best = (dxs, i)
    if best is None: return None
    i = best[1]; mx, my = xa + cen[i][0], ya + cen[i][1]
    hw = int(math.ceil(0.45 * s))
    xa2, xb2 = int(mx) - hw, int(mx) + hw + 1; ya2, yb2 = int(my) - hw, int(my) + hw + 1
    if xa2 < 1 or ya2 < 1 or xb2 >= W - 1 or yb2 >= H - 1: return None
    Y, X = np.mgrid[ya2:yb2, xa2:xb2].astype(float); D = dark[ya2:yb2, xa2:xb2]
    Lcov = np.zeros_like(D)
    for yc, t, _n in head['lines']: Lcov = np.maximum(Lcov, _cov_line(Y, yc, t))
    def res(p):
        d = np.sqrt((X - p[0]) ** 2 + (Y - p[1]) ** 2) - p[2]
        mod = np.maximum(Lcov, np.clip(0.5 - d, 0, 1))
        return (mod - D).ravel()
    p, f = _lm(res, [mx, my, math.sqrt(st[i, 4] / math.pi)], [mx - 0.3 * s, my - 0.3 * s, 0.05 * s],
               [mx + 0.3 * s, my + 0.3 * s, 0.6 * s])
    ys, xs = np.where(lab == i)
    ev = np.linalg.eigvalsh(np.cov(np.vstack([xs, ys]).astype(float))) if len(xs) > 3 else np.array([0.0, 0.0])
    aspect = float(math.sqrt(max(ev[0], 0) / max(ev[1], 1e-9)))     # 1 for a disc, small for a stroke
    return dict(cx=float(p[0]), cy=float(p[1]), d=float(2 * p[2]), area_s2=float(st[i, 4] / (s * s)), aspect=aspect,
                dx_s=float((p[0] - head['cx']) / s), dy_s=float(-(p[1] - head['cy']) / s), rms=float(math.sqrt(f / D.size)))


# --------------------------------------------------------------------------------------------- the beam

def fit_beam(dark, stem_fit, lines, s, nxt_col=None, span_s=1.4):
    """A bar to the beam at the stem's far end: for each column from the stem's column to `span_s` toward the next stem
    (or `span_s` toward either side if none is known), the vertical run of ink (> 0.5) that holds the far end's row; its
    two edges, sub-pixel from the grey level; then a line is fitted to each edge by least squares. Columns whose run
    meets a staff line's band are left out. Returns thickness (px, mean vertical gap), slope (dy/dx, y down), and the
    number of columns used; None if fewer than 6."""
    if stem_fit is None: return None
    H, W = dark.shape
    sd = stem_fit['dir']; yend = stem_fit['far_end']
    c = stem_fit['col']
    cols = range(int(c + 0.2 * s), int(c + span_s * s) + 1) if nxt_col is None or nxt_col > c else range(int(c - span_s * s), int(c - 0.2 * s))
    band = [(yc, t) for yc, t, _n in lines]
    top, bot, xs_ = [], [], []
    for x in cols:
        if not (1 <= x < W - 1): continue
        # start inside the bar: one row back from the far end toward the head
        r = int(round(yend - sd * 3))
        if r < 1 or r >= H - 1 or dark[r, x] < 0.5: continue
        a = r
        while a > 1 and dark[a - 1, x] >= 0.5: a -= 1
        b = r
        while b < H - 2 and dark[b + 1, x] >= 0.5: b += 1
        # sub-pixel edges from the grey level
        ta = a - 0.5 - dark[a - 1, x]
        bb = b + 0.5 + dark[b + 1, x]
        if any(not (bb < yc - t / 2 - 0.5 or ta > yc + t / 2 + 0.5) for yc, t in band): continue
        top.append(ta); bot.append(bb); xs_.append(x)
    if len(xs_) < 6: return None
    xs_ = np.array(xs_, float); top = np.array(top); bot = np.array(bot)
    pt = np.polyfit(xs_, top, 1); pb = np.polyfit(xs_, bot, 1)
    xm = xs_.mean()
    thick = float(np.polyval(pb, xm) - np.polyval(pt, xm))
    slope = float((pt[0] + pb[0]) / 2)
    return dict(thick=thick, slope=slope, n=int(len(xs_)), top=float(np.polyval(pt, xm)), bottom=float(np.polyval(pb, xm)))


# =============================================================================================== extraction (one pass over a page)
# Everything below works on a NOTE: the fits above, the lines, and a crop of the grey-level ink around the note (its patch).
# A patch is kept as uint8 (dark * 255), so a whole song's notes fit in memory and in a JSON file.

PATCH_PAD_ROWS_S = 1.3   # rows past the head and the stem's far end
PATCH_COLS_S     = (2.4, 3.0)   # columns left of min(stem column, head centre) and right of max(...)
BEAM_REACH_S     = 8.0   # a beam is looked for toward a neighbouring stem no farther than this


def _patch(dark, head, stem, s):
    H, W = dark.shape
    ys = [head['cy']] + ([stem['far_end'], stem['head_end'] if stem['head_end'] is not None else head['cy']] if stem else [])
    xs = [head['cx']] + ([stem['col']] if stem else [])
    r0 = max(0, int(math.floor(min(ys) - PATCH_PAD_ROWS_S * s))); r1 = min(H, int(math.ceil(max(ys) + PATCH_PAD_ROWS_S * s)) + 1)
    c0 = max(0, int(math.floor(min(xs) - PATCH_COLS_S[0] * s))); c1 = min(W, int(math.ceil(max(xs) + PATCH_COLS_S[1] * s)) + 1)
    return dict(r0=r0, c0=c0, u8=np.round(dark[r0:r1, c0:c1] * 255.0).astype(np.uint8))


def extract_note(dark, rec, staff, line_t, s, stem_reader):
    """One head's fits and patch. `rec` is the reader's head (x, y, hollow). Returns a dict, never raises."""
    n = dict(x=int(rec['x']), y=int(rec['y']), sys=int(rec['sys']), hollow=bool(rec.get('hollow')), staff=[int(v) for v in staff],
             reader_stem=stem_reader)
    try:
        hf = fit_head(dark, rec['x'], rec['y'], staff, line_t, s, stem_reader, bool(rec.get('hollow')))
    except Exception as e:
        hf = None; n['head_error'] = repr(e)
    n['head'] = hf
    n['stem'] = None; n['dot'] = None; n['patch'] = None
    if hf is None: return n
    lines = [tuple(l) for l in hf['lines']]
    try: n['stem'] = fit_stem(dark, hf, stem_reader, staff, lines, line_t, s)
    except Exception as e: n['stem_error'] = repr(e)
    try: n['dot'] = fit_dot(dark, hf, hf['lines'], line_t, s)
    except Exception as e: n['dot_error'] = repr(e)
    n['patch'] = _patch(dark, hf, n['stem'], s)
    return n


def link_beams(dark, notes, s, line_t):
    """For each note with a stem fit, trace a beam bar toward the nearest same-direction stem on each side of the same
    system (no farther than BEAM_REACH_S): see `beam_trace`. Fills note['beam_right'] and note['beam_left']."""
    by_sys = {}
    for i, n in enumerate(notes):
        if n['stem'] is not None and not n['hollow']: by_sys.setdefault(n['sys'], []).append(i)
    for sy, idx in by_sys.items():
        idx.sort(key=lambda i: notes[i]['stem']['col'])
        for a, i in enumerate(idx):
            n = notes[i]; n['beam_right'] = None; n['beam_left'] = None
            for j in idx[a + 1:]:
                m = notes[j]
                if m['stem']['col'] - n['stem']['col'] > BEAM_REACH_S * s: break
                if m['stem']['dir'] == n['stem']['dir'] and m['stem']['col'] - n['stem']['col'] > 0.8 * s:
                    n['beam_right'] = dict(other=j, **(beam_trace(dark, n, m, s) or {})); break
            for j in reversed(idx[:a]):
                m = notes[j]
                if n['stem']['col'] - m['stem']['col'] > BEAM_REACH_S * s: break
                if m['stem']['dir'] == n['stem']['dir'] and n['stem']['col'] - m['stem']['col'] > 0.8 * s:
                    n['beam_left'] = dict(other=j, **(beam_trace(dark, n, m, s) or {})); break


def beam_trace(dark, a, b, s):
    """A bar from stem `a`'s far end to stem `b`'s (same direction). For each column between them the bar's outer edge is on
    the line joining the two tips; look 2 px inside from it, toward the heads. Returns the share of columns that hold ink there
    (`covered`), the median bar thickness (px, columns whose run does not meet a staff line's band), the share of columns with a
    second bar inside the first (`second`), and the columns used. A first column and a last column of 0.4 s each are skipped."""
    sa, sb = a['stem'], b['stem']
    sd = sa['dir']; c1, y1, c2, y2 = sa['col'], sa['far_end'], sb['col'], sb['far_end']
    H, W = dark.shape
    lines = [(l[0], l[1]) for l in a['head']['lines']]
    def meets(lo, hi): return any(not (hi < yc - t / 2 - 0.5 or lo > yc + t / 2 + 0.5) for yc, t in lines)
    cov = 0; tot = 0; th = []; sec = 0; nsec = 0
    for c in range(int(c1 + 0.4 * s), int(c2 - 0.4 * s) + 1):
        if not (1 <= c < W - 1): continue
        yo = y1 + (y2 - y1) * (c - c1) / (c2 - c1)           # the bar's outer edge
        r = int(round(yo - sd * 2.0))
        if not (2 <= r < H - 3): continue
        tot += 1
        if dark[r, c] < 0.5: continue
        cov += 1
        lo = r; hi = r
        while lo > 1 and dark[lo - 1, c] >= 0.5: lo -= 1
        while hi < H - 2 and dark[hi + 1, c] >= 0.5: hi += 1
        # the run's edges, sub-pixel
        e_lo = lo - 0.5 - dark[lo - 1, c]; e_hi = hi + 0.5 + dark[hi + 1, c]
        if meets(e_lo, e_hi): continue
        th.append(e_hi - e_lo)
        # a second bar: from the run's inner edge toward the heads, a gap then another run of at least 2 px, within 1.2 s
        step = -sd                                   # toward the heads: up-stem (sd=-1) -> rows increase
        edge = hi if step > 0 else lo
        k = edge + step; gap = 0
        while 1 <= k < H - 1 and dark[k, c] < 0.5 and gap < 1.2 * s: k += step; gap += 1
        nsec += 1
        if 1 <= k < H - 1 and dark[k, c] >= 0.5:
            run = 0; q = k
            while 1 <= q < H - 1 and dark[q, c] >= 0.5 and run < 1.2 * s: q += step; run += 1
            if run >= 2: sec += 1
    if tot == 0: return None
    return dict(covered=cov / tot, thick_px=(float(np.median(th)) if th else None), n_thick=len(th), second=(sec / nsec if nsec else None), cols=tot)


# =============================================================================================== reading a note's tip and dot window
# Settings of this section. GOULD = the desk's draft (docs/sessions/draft-gould-expectations-for-the-scan-reader_r1_2026-10-02.md,
# section 1); the brief's section 3.3 names the clear-case bounds, "set wide". DESK = a desk default of this report.
LAM_MAX_S   = 1.9    # DESK: how far from the stem the strips run, s (a flag reaches at most about 1.2; a beam runs on past it)
TAU_LO_S    = -0.6   # DESK: the strips start this far past the tip, s (the shape rule's own window began at -0.6)
TAU_HI_S    = 3.6    # DESK: and end this far back toward the head, s, or 0.35 s past the head's end if the stem is shorter
HEAD_PAST_S = 0.35   # DESK: see above
HEAD_ZONE_S = 0.8    # DESK: ink that starts within this far (s) of the head's end, and does not touch the stem near the tip, is the head's fringe, not another element
OWN_INFLATE_S = 0.12  # DESK: the note's own head and dot are taken out of the strips, drawn this much larger (the blur ring), s
CORRIDOR_PX = 1.5    # DESK: the stem corridor is its fitted thickness / 2 plus this, pixels (anti-aliasing)
EDGE_REACH_S = 0.20  # DESK: ink that reaches no farther than this from the stem's corridor is the stem's own ragged edge or a line's junction with it (6 px at 30 px to a staff space; a flag reaches 0.55 and more)
COUNT_TAU_S  = (-0.4, 2.0)  # DESK, row 23's own: a run counts toward the number of strokes only if it starts between these (s from the tip)
LINE_GUARD_PX = 2.0  # DESK: a staff line's band is cut this far (px) beyond half its measured thickness (blur)
SPECK_S2    = 0.007  # DESK: ink smaller than this, s^2 (6 px at 30 px to a staff space), is a speck, not another element
STEM_CLEAR_MIN_S = 2.5   # brief 3.3.1 / GOULD r86: a stem of at least 2.5 s
FLAG_TRAVEL_S    = (2.0, 3.5)   # brief 3.3.1 (GOULD r87: 2.5 to 3.25), set wide
BEAM_THICK_S     = (0.25, 0.75) # brief 3.3.1 (GOULD r249: 0.5)
DOT_AREA_S2      = (0.09, 0.33) # brief 3.3.1 "about half a staff space" across: a disc of 0.34 to 0.65 s
DOT_DX_S         = (0.9, 2.2)   # DESK, wide round GOULD r111 and the desk's measure (1.07 to 1.85 for nine in ten)
DOT_ROUND_MIN    = 0.8   # DESK: a disc's blob has equal principal axes (1.0); a short curved stroke is well under this
DOT_LINE_CLEAR_S = 0.2   # DESK: "in a space": the centre at least this far from a line's centre
CUTS_FLAG = (0.25, 0.45, 0.65, 0.85)   # DESK, row 23's own count cuts, s from the stem's edge
CUTS_BEAM = (0.85, 1.05)
RUN_MIN_PX = 2


def unpack(n):
    p = n['patch']
    if isinstance(p['u8'], str):
        import base64
        u8 = np.frombuffer(base64.b64decode(p['u8']), np.uint8).reshape(p['shape'])
    else: u8 = p['u8']
    return u8.astype(np.float64) / 255.0, p['r0'], p['c0']


def _rect_cov(Y, X, c, t, ra, rb):
    """Exact coverage of pixel boxes by the rectangle [c - t/2, c + t/2] x [ra, rb] (rows ra <= rb, as pixel-edge coordinates)."""
    ov_x = np.clip(np.minimum(X + 0.5, c + t / 2) - np.maximum(X - 0.5, c - t / 2), 0, 1)
    ov_y = np.clip(np.minimum(Y + 0.5, rb) - np.maximum(Y - 0.5, ra), 0, 1)
    return ov_x * ov_y


def context_cov(n, others, shape, r0, c0):
    """The ink of the OTHER notes' stems and heads, drawn from their fits into this note's patch (an unexplained neighbour is
    not this note's tip). Their flags and beams are not drawn: those wait on their own lengths."""
    Y, X = np.mgrid[r0:r0 + shape[0], c0:c0 + shape[1]].astype(float)
    cov = np.zeros(shape)
    for m in others:
        if m is n or m.get('head') is None: continue
        h = m['head']
        if abs(h['cx'] - (c0 + shape[1] / 2)) > shape[1] / 2 + 40 and not m.get('stem'): continue
        st = m.get('stem')
        if st is not None:
            ra, rb = sorted((st['head_end'] if st['head_end'] is not None else h['cy'], st['far_end']))
            cov = np.maximum(cov, _rect_cov(Y, X, st['col'], st['thick'], ra - 0.5, rb + 0.5))
        if not m['hollow']:
            cov = np.maximum(cov, _cov_ell(X, Y, h['cx'], h['cy'], h['a'], h['b'], math.radians(-h['tilt_up'])))
    return cov


def _band_bridge(M, D, lines, r0, c0, line_t):
    """Mask `M` (bool) with each line's band bridged: a band pixel is ink only if the column has ink in the row above the band
    and in the row below it (within 2 columns). Same idea as the shape rule's: a stroke crossing a line is one stroke, a line's
    own residue is none."""
    H, W = M.shape; out = M.copy()
    for yc, t, _n in lines:
        ya = int(round(yc - t / 2 - LINE_GUARD_PX)) - r0; yb = int(round(yc + t / 2 + LINE_GUARD_PX)) - r0
        if ya < 1 or yb >= H - 1: continue
        above = M[ya - 1, :]; below = M[yb + 1, :]
        a2 = np.convolve(above.astype(int), np.ones(5, int), 'same') > 0; b2 = np.convolve(below.astype(int), np.ones(5, int), 'same') > 0
        out[ya:yb + 1, :] = (a2 & b2)[None, :]
    return out


def tip_scan(n, notes, s, line_t):
    """The strokes beside a note's stem, from the grey-level ink with other notes' stems and heads taken out. Returns a dict, or
    None without a stem fit. Fields: `strokes` (components touching the stem near its tip), `other` (every other component in the
    strips), per stroke: side, reach (s), travel (s), runs_on, cuts counts, bar thicknesses; plus the dot window's state."""
    import cv2
    st = n['stem']
    if st is None or n['head'] is None: return None
    D, r0, c0 = unpack(n)
    ctx = context_cov(n, notes, D.shape, r0, c0)
    # the note's own head, and its own dot, are known elements: take them out (a little larger, for the blur)
    Y, X = np.mgrid[r0:r0 + D.shape[0], c0:c0 + D.shape[1]].astype(float)
    hh = n['head']
    if not n['hollow']:
        ctx = np.maximum(ctx, _cov_ell(X, Y, hh['cx'], hh['cy'], hh['a'] + OWN_INFLATE_S * s, hh['b'] + OWN_INFLATE_S * s, math.radians(-hh['tilt_up'])))
    D2 = np.clip(D - ctx, 0, 1)      # the note's own dot is NOT taken out: a flag's tail looks like a dot, and the stroke must claim it first
    H, W = D2.shape
    sd = st['dir']; col = st['col'] - c0; tip = st['far_end'] - r0
    Lpx = abs(st['far_end'] - st['head_end']) if st['head_end'] is not None else st['length']
    tau_lo = TAU_LO_S * s; tau_hi = min(TAU_HI_S * s, Lpx + HEAD_PAST_S * s)
    if tau_hi <= tau_lo + 2: return dict(strokes=[], other=[], stem_short=True, L=Lpx / s)
    hc = st['thick'] / 2 + CORRIDOR_PX
    M = D2 > 0.5
    lines = n['head']['lines']
    M = _band_bridge(M, D2, lines, r0, c0, line_t)
    rows = np.arange(H); tau = -sd * (rows + r0 - st['far_end'])
    rsel = (tau >= tau_lo) & (tau <= tau_hi)
    out = dict(strokes=[], other=[], stem_short=False, L=Lpx / s)
    for side in (+1, -1):
        if side > 0: ca = int(math.ceil(col + hc)); cb = int(min(W, math.floor(col + hc + LAM_MAX_S * s) + 1))
        else:        cb = int(math.floor(col - hc)) + 1; ca = int(max(0, math.ceil(col - hc - LAM_MAX_S * s)))
        if cb - ca < 4: continue
        sub = (M[:, ca:cb] & rsel[:, None]).astype(np.uint8)
        nlab, lab, stats, _ = cv2.connectedComponentsWithStats(sub, 8)
        for i in range(1, nlab):
            area = stats[i, 4]
            if area < SPECK_S2 * s * s: continue
            ys, xs = np.where(lab == i)
            lam = (xs + ca - col) * side - hc            # px from the corridor edge, outward
            if lam.max() <= EDGE_REACH_S * s: continue   # the stem's own ragged edge
            tau_i = tau[ys]
            touches = (lam <= 1.5).any()                 # within 1.5 px of the corridor edge
            near_tip = touches and (tau_i[lam <= 1.5].min() <= 0.8 * s)
            comp = dict(xy=(ys + 0, xs + ca), side=side, area_s2=float(area / (s * s)), reach=float(lam.max() / s), tau_min=float(tau_i.min() / s), tau_max=float(tau_i.max() / s),
                        runs_on=bool(lam.max() >= LAM_MAX_S * s - 3), to_cap=bool(tau_i.max() >= tau_hi - 2), touches=bool(touches), near_tip=bool(near_tip))
            if near_tip:
                # the stroke's runs along the stem at each cut, from its own pixels only
                runs = {}
                for cut in sorted(set(CUTS_FLAG + CUTS_BEAM)):
                    cx = int(round(cut * s))
                    cc = np.where(np.abs(lam - cx) < 0.5)[0]
                    tv = np.sort(np.unique(ys[cc])) if cc.size else np.array([], int)     # rows (integers), not tau: tau is offset by the tip's fraction
                    rr = []
                    if tv.size:
                        a = tv[0]; p = tv[0]
                        for v in tv[1:]:
                            if v != p + 1: rr.append((a, p)); a = v
                            p = v
                        rr.append((a, p))
                    rr = [(float(min(tau[x0], tau[x1]) / s), float((x1 - x0 + 1) / s)) for x0, x1 in rr if (x1 - x0 + 1) >= RUN_MIN_PX]
                    rr.sort()
                    runs[round(cut, 2)] = rr
                comp['runs'] = runs
                out['strokes'].append(comp)
            elif tau_i.min() <= Lpx - HEAD_ZONE_S * s: out['other'].append(comp)
    # which of the strip's components is the note's own dot, and is the dot candidate part of a stroke
    dd = n.get('dot'); out['dot_in_stroke'] = False; out['dot_other_idx'] = []
    if dd:
        dcr, dcc = dd['cy'] - r0, dd['cx'] - c0; rad = dd['d'] / 2 + 0.12 * s
        for c in out['strokes']:
            if (np.hypot(c['xy'][0] - dcr, c['xy'][1] - dcc) <= rad).any(): out['dot_in_stroke'] = True
        for k, c in enumerate(out['other']):
            if (np.hypot(c['xy'][0] - dcr, c['xy'][1] - dcc) <= rad).any(): out['dot_other_idx'].append(k)
    for c in out['strokes'] + out['other']: c.pop('xy', None)
    # the dot window
    h = n['head']
    ra = int(round(h['cy'] + (-1.0) * s)) - r0; rb = int(round(h['cy'] + 0.75 * s)) - r0
    ca = int(round(h['cx'] + DOT_DX_S[0] * s)) - c0 - int(0.0); cb = int(round(h['cx'] + 2.4 * s)) - c0
    dw = dict(ink_s2=None)
    ra, rb, ca, cb = max(0, ra), min(H, rb), max(0, ca), min(W, cb)
    if rb - ra > 4 and cb - ca > 4:
        sub = (D2[ra:rb, ca:cb] > 0.5)
        for yc, t, _n in lines:
            ya = int(round(yc - t / 2 - LINE_GUARD_PX)) - r0 - ra; yb = int(round(yc + t / 2 + LINE_GUARD_PX)) - r0 - ra
            sub[max(0, ya):max(0, yb + 1), :] = False
        # components: each one's area; a speck is ignored
        nl, lb, stt, _ = cv2.connectedComponentsWithStats(sub.astype(np.uint8), 8)
        areas = [stt[i, 4] / (s * s) for i in range(1, nl) if stt[i, 4] >= SPECK_S2 * s * s]
        dw = dict(ink_s2=float(sum(areas)), comps=len(areas))
    out['dot_window'] = dw
    return out


def classify_stem(scan, n, s, dotted=False):
    """The clear class of a stem from its tip scan, by the brief's wide bounds, or None where it is not clear.
    Returns (kind, detail): kind in plain, flag1, flag2, beam1, beam2, None; detail names why not."""
    if scan is None: return None, 'no_stem_fit'
    if scan['stem_short']: return None, 'stem_too_short_for_the_window'
    if scan['L'] < STEM_CLEAR_MIN_S: return None, 'stem_under_2.5'
    S = scan['strokes']
    O = [c for k, c in enumerate(scan['other']) if not (dotted and k in scan['dot_other_idx'])]
    if not S and not O: return 'plain', None
    if O: return None, 'other_ink_in_the_strips'
    if len(S) > 1: return None, 'two_strokes_near_the_tip'
    c = S[0]
    if c['to_cap'] and c['runs_on']: return None, 'stroke_runs_past_the_window_toward_the_head'
    if not c['runs_on']:
        # a stroke that reaches the window's far end (the head's row) has a travel of at least that: it counts as one of 2.0 or more
        if not (FLAG_TRAVEL_S[0] <= c['tau_max'] <= (FLAG_TRAVEL_S[1] if not c['to_cap'] else 99)): return None, 'travel_outside_2.0_to_3.5'
        valid = [k for k in CUTS_FLAG if k <= c['reach'] - 0.04]      # a cut beyond the stroke's own reach shows nothing, and says nothing
        if len(valid) < 2: return None, 'stroke_too_short_to_count'
        cnt = [len([r for r in c['runs'][round(k, 2)] if COUNT_TAU_S[0] <= r[0] <= COUNT_TAU_S[1]]) for k in valid]
        mode = cnt[0]
        if mode not in (1, 2) or any(v != mode for v in cnt): return None, 'stroke_count_ambiguous'
        return 'flag%d' % mode, None
    # runs on: a beam if a bar of the right thickness joins another stem
    n_side = n.get('beam_right') if c['side'] > 0 else n.get('beam_left')
    if not n_side or n_side.get('covered') is None or n_side['covered'] < 0.9: return None, 'runs_on_without_a_bar_to_another_stem'
    th = []
    for k in CUTS_BEAM:
        rr = c['runs'][round(k, 2)]
        if not rr: return None, 'bar_missing_at_a_cut'
        th.append(rr[0][1])
    if not all(BEAM_THICK_S[0] <= t <= BEAM_THICK_S[1] for t in th): return None, 'bar_thickness_outside_0.25_to_0.75'
    nb = len([r for r in c['runs'][round(CUTS_BEAM[0], 2)] if COUNT_TAU_S[0] <= r[0] <= COUNT_TAU_S[1]]); nb2 = len([r for r in c['runs'][round(CUTS_BEAM[1], 2)] if COUNT_TAU_S[0] <= r[0] <= COUNT_TAU_S[1]])
    if nb != nb2 or nb not in (1, 2): return None, 'bar_count_ambiguous'
    return 'beam%d' % nb, None


def classify_dot(scan, n, s):
    """'dotted' / 'undotted' where clear, else (None, why). A clear dot: a round mark of about half a staff space across, right of the
    head, in a space, and nothing else in the window. A clear absence: nothing in the window but specks."""
    if scan is None: return None, 'no_scan'
    dw = scan['dot_window']; d = n.get('dot'); h = n['head']
    if dw['ink_s2'] is None: return None, 'window_off_the_page'
    if d is None:
        return ('undotted', None) if dw['ink_s2'] < SPECK_S2 else (None, 'ink_in_the_window_that_is_not_a_dot')
    if scan.get('dot_in_stroke'): return None, 'dot_candidate_is_part_of_a_stroke'
    if not (DOT_AREA_S2[0] <= d['area_s2'] <= DOT_AREA_S2[1]): return None, 'dot_area_outside'
    round_ratio = d['d'] / (2 * math.sqrt(d['area_s2'] * s * s / math.pi))
    if not (0.85 <= round_ratio <= 1.15) or d.get('aspect', 1.0) < DOT_ROUND_MIN: return None, 'dot_not_round'
    if not (DOT_DX_S[0] <= d['dx_s'] <= DOT_DX_S[1]): return None, 'dot_dx_outside'
    nearest = min(abs(d['cy'] - l[0]) for l in h['lines'])
    if nearest < DOT_LINE_CLEAR_S * s: return None, 'dot_on_a_line'
    if dw['comps'] > 1: return None, 'other_ink_in_the_window'
    return 'dotted', None


# =============================================================================================== pass 1: the page teaches its own values
NMIN_POOL = 5         # DESK: a page with fewer clear cases of a kind than this does not give a value for it; the song pools
S_GRID    = 32        # samples per staff space in a harvested outline (about 1 px at the scans' 30 px to a staff space)
OUTLINE_TAU_S = (-0.6, 3.6)   # DESK: the outline's window along the stem, s from the tip (same as the strips)
LINE_HEAD_S   = 0.25  # DESK: a head whose centre is within this of a line's centre (staff or ledger row) sits on a line


def _stats(v):
    v = np.array([x for x in v if x is not None and np.isfinite(x)], float)
    if not len(v): return dict(n=0)
    return dict(n=int(len(v)), median=float(np.median(v)), p5=float(np.percentile(v, 5)), p95=float(np.percentile(v, 95)),
                iqr=float(np.percentile(v, 75) - np.percentile(v, 25)), min=float(v.min()), max=float(v.max()))


def classify_notes(notes, s, line_t):
    """Set on each note: `scan` (the tip scan), `kind` / `kind_why` (clear stem class or why not), `dotk` / `dot_why`."""
    for n in notes:
        n['scan'] = None; n['kind'] = None; n['kind_why'] = None; n['dotk'] = None; n['dot_why'] = None; n['_s'] = float(s); n['_line_t'] = float(line_t)
        if n['head'] is None: n['kind_why'] = 'no_head_fit'; n['dot_why'] = 'no_head_fit'; continue
        if n['hollow']: n['kind_why'] = 'hollow_head_out_of_scope'; n['dot_why'] = 'hollow_head_out_of_scope'; continue
        if n['stem'] is None: n['kind_why'] = 'no_stem_fit'; n['dot_why'] = 'no_stem_fit'; continue
        sc = tip_scan(n, notes, s, line_t)
        n['scan'] = sc
        n['dotk'], n['dot_why'] = classify_dot(sc, n, s)
        n['kind'], n['kind_why'] = classify_stem(sc, n, s, dotted=(n['dotk'] == 'dotted'))
        # a stroke on the left of the stem is not a flag the page prints (flags are on the right): not clear
        if n['kind'] in ('flag1', 'flag2'):
            c = [c for c in sc['strokes']][0]
            if c['side'] < 0: n['kind'] = None; n['kind_why'] = 'flag_on_the_left_of_the_stem'


def head_on_line(n, s):
    h = n['head']; rows = [l[0] for l in h['lines']] + ledger_rows(n['staff'], s, h['cy'], 0)
    return min(abs(h['cy'] - r) for r in rows) < LINE_HEAD_S * s


def head_halfwidth(h):
    th = math.radians(h['tilt_up'])
    return math.sqrt((h['a'] * math.cos(th)) ** 2 + (h['b'] * math.sin(th)) ** 2)


def page_values(notes, s=None, line_t=None):
    """The page's own values, each from the clear cases alone (a song's, when `notes` are pooled from several pages: each note
    carries its own page's `_s`): the head's axes and tilt, the stem's length and thickness, the flag's reach and travel, the beam's
    thickness and pitch, the dot's diameter and offsets, the staff line's thickness. Each is {n, median, p5, p95, iqr, min, max};
    `n` is the number of clear cases."""
    V = {}
    cs = [n for n in notes if n['kind'] is not None]
    V['clear_stems'] = {k: sum(1 for n in cs if n['kind'] == k) for k in ('plain', 'flag1', 'flag2', 'beam1', 'beam2')}
    V['clear_dots'] = {k: sum(1 for n in notes if n['dotk'] == k) for k in ('dotted', 'undotted')}
    V['head_a_s'] = _stats([n['head']['a'] / n['_s'] for n in cs]); V['head_b_s'] = _stats([n['head']['b'] / n['_s'] for n in cs])
    V['head_tilt'] = _stats([n['head']['tilt_up'] for n in cs if n['head']['a'] / n['head']['b'] > 1.05])
    V['stem_len_s'] = _stats([abs(n['stem']['far_end'] - n['stem']['head_end']) / n['_s'] for n in cs if n['stem']['head_end'] is not None])
    V['stem_thick_s'] = _stats([n['stem']['thick'] / n['_s'] for n in cs]); V['stem_thick_px'] = _stats([n['stem']['thick'] for n in cs])
    for k in ('flag1', 'flag2'):
        fs = [n for n in cs if n['kind'] == k]
        V['%s_reach_s' % k] = _stats([n['scan']['strokes'][0]['reach'] for n in fs]); V['%s_travel_s' % k] = _stats([n['scan']['strokes'][0]['tau_max'] for n in fs])
    bs = [n for n in cs if n['kind'] in ('beam1', 'beam2')]
    th = []; pitch = []
    for n in bs:
        c = n['scan']['strokes'][0]
        for k in CUTS_BEAM:
            rr = c['runs'][round(k, 2)]
            if rr: th.append(rr[0][1])
        if n['kind'] == 'beam2':
            rr = c['runs'][round(CUTS_BEAM[1], 2)]
            if len(rr) >= 2: pitch.append(rr[1][0] - rr[0][0])
    V['beam_thick_s'] = _stats(th); V['beam_pitch_s'] = _stats(pitch)
    ds = [n for n in notes if n['dotk'] == 'dotted']
    V['dot_d_s'] = _stats([n['dot']['d'] / n['_s'] for n in ds])
    V['dot_dx_edge_s'] = _stats([(n['dot']['cx'] - (n['head']['cx'] + head_halfwidth(n['head']))) / n['_s'] for n in ds])
    V['dot_dx_centre_s'] = _stats([n['dot']['dx_s'] for n in ds])
    V['dot_dy_on_line_s'] = _stats([n['dot']['dy_s'] for n in ds if head_on_line(n, n['_s'])])
    V['dot_dy_in_space_s'] = _stats([n['dot']['dy_s'] for n in ds if not head_on_line(n, n['_s'])])
    lt = [(l[1], n['_s']) for n in notes if n['head'] for l in n['head']['lines'] if l[2] > 0]
    V['line_thick_px'] = _stats([a for a, _ in lt]); V['line_thick_s'] = _stats([a / b for a, b in lt])
    return V


def _remap(img, rr, cc):
    import cv2
    return cv2.remap(img.astype(np.float32), cc.astype(np.float32), rr.astype(np.float32), cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)


def inpaint_lines(D, r0, bands):
    """Each line's band (centre row, thickness) replaced, column by column, by the straight interpolation between the row just above the
    band and the row just below it (LINE_GUARD_PX beyond half its thickness). A stroke that crosses a line stays one stroke; the line's
    own ink is gone. For harvesting an outline, which must not carry the staff lines of the notes it came from."""
    out = D.copy(); H = D.shape[0]
    for yc, t in bands:
        a = int(round(yc - t / 2 - LINE_GUARD_PX)) - r0; b = int(round(yc + t / 2 + LINE_GUARD_PX)) - r0
        if a < 1 or b >= H - 1 or b <= a: continue
        top = D[a - 1, :]; bot = D[b + 1, :]
        w = (np.arange(a, b + 1) - (a - 1)) / float(b + 1 - (a - 1))
        out[a:b + 1, :] = top[None, :] * (1 - w[:, None]) + bot[None, :] * w[:, None]
    return out


def outline_sample(n, notes, s):
    """A clear flag's own ink beyond the stem's corridor, on a grid of 1/S_GRID staff space: rows are tau from OUTLINE_TAU_S[0] to
    [1] (s from the tip, toward the head), columns lam from 0 to LAM_MAX_S (s from the corridor's edge, on the right). Bilinear, so
    the tip's and the column's fractions are honoured; neighbours' stems and heads and the note's own head and dot are taken out."""
    D, r0, c0 = unpack(n)
    ctx = context_cov(n, notes, D.shape, r0, c0)
    Y, X = np.mgrid[r0:r0 + D.shape[0], c0:c0 + D.shape[1]].astype(float)
    h = n['head']
    ctx = np.maximum(ctx, _cov_ell(X, Y, h['cx'], h['cy'], h['a'] + OWN_INFLATE_S * s, h['b'] + OWN_INFLATE_S * s, math.radians(-h['tilt_up'])))
    if n.get('dot'):
        dd = n['dot']; ctx = np.maximum(ctx, np.clip(0.5 - (np.sqrt((X - dd['cx']) ** 2 + (Y - dd['cy']) ** 2) - (dd['d'] / 2 + OWN_INFLATE_S * s)), 0, 1))
    D2 = np.clip(D - ctx, 0, 1)
    bands = [(l[0], l[1]) for l in h['lines']] + [(r, n['_line_t']) for r in ledger_rows(n['staff'], s, h['cy'], n['_line_t'])]
    D2 = inpaint_lines(D2, r0, bands)
    st = n['stem']; sd = st['dir']; hc = st['thick'] / 2 + CORRIDOR_PX
    nt = int((OUTLINE_TAU_S[1] - OUTLINE_TAU_S[0]) * S_GRID); nl = int(LAM_MAX_S * S_GRID)
    tau = OUTLINE_TAU_S[0] + (np.arange(nt) + 0.5) / S_GRID                 # s
    lam = (np.arange(nl) + 0.5) / S_GRID
    TT, LL = np.meshgrid(tau, lam, indexing='ij')
    rr = st['far_end'] - sd * TT * s - r0                                    # image row of a point tau toward the head
    cc = st['col'] + hc + LL * s - c0
    out = _remap(D2, rr, cc)
    # beyond the stem's own length (toward the head): not part of the outline
    Lpx = abs(st['far_end'] - st['head_end'])
    out[TT * s > Lpx - 0.5 * s] = np.nan
    return out


def median_outline(samples):
    if not samples: return None
    A = np.stack(samples); T = np.nanmedian(A, axis=0)
    return np.where(np.isnan(T), 0.0, T), len(samples)


# =============================================================================================== pass 2: the rest are read by drawing them
# The brief's section 3.4. Every note's patch is compared, over the area where the candidates differ, with a drawing made from the
# page's own values: lines at their traced places and measured thickness; the head's ellipse and the stem at their fitted places;
# the neighbours' stems and heads; then the candidate: nothing (a quarter), the page's flag outline (an eighth: once; a sixteenth:
# the page's own two-stroke outline), a bar to the next stem (an eighth: one bar; a sixteenth: two), and for the dot a disc.
# THE COMPARISON is the mean squared difference (darkness, 0 to 1) over the pixels of the area; the area is the strips either side of
# the stem (1.9 s wide, from 0.6 s past the tip to 0.5 s short of the head's end), apart from the dot's window, and the dot window
# itself (a box right of the head). Why that: it is where a flag, a bar, or a dot would be, and nothing else of the note is in it.
# THE DECISION carries no constant fitted to these songs: a candidate is READ when its difference from the scan is no larger than the
# largest difference that this page's clear cases of the same kind show against their own drawings (pooled across the song where the
# page has fewer than NMIN_POOL of the kind), and every other candidate's is larger than its own kind's.
AREA_TAU_HI_BACK_S = 0.5    # DESK: the strips stop this far short of the head's end, s
DOT_WIN = dict(dx0=0.85, dx1=2.4, dy0=-1.0, dy1=0.75)   # the dot window, s from the head's centre (the same as fit_dot's)


def _grid(shape, r0, c0):
    return np.mgrid[r0:r0 + shape[0], c0:c0 + shape[1]].astype(float)


def own_cov(n, notes, shape, r0, c0, with_ledger=True):
    """Lines, the neighbours' stems and heads, this note's own head and stem. No flag, bar, or dot."""
    Y, X = _grid(shape, r0, c0)
    h = n['head']; st = n['stem']
    cov = np.zeros(shape)
    for yc, t, _k in h['lines']:
        cov = np.maximum(cov, _cov_line(Y, yc, t))
    if with_ledger:
        for yr in ledger_rows(n['staff'], n['_s'], h['cy'], n['_line_t']):
            band = _cov_line(Y, yr, n['_line_t']) * (np.abs(X - h['cx']) <= 0.95 * n['_s'])
            cov = np.maximum(cov, band)
    cov = np.maximum(cov, context_cov(n, notes, shape, r0, c0))
    if not n['hollow']:
        cov = np.maximum(cov, _cov_ell(X, Y, h['cx'], h['cy'], h['a'], h['b'], math.radians(-h['tilt_up'])))
    if st is not None:
        ra, rb = sorted((st['head_end'] if st['head_end'] is not None else h['cy'], st['far_end']))
        cov = np.maximum(cov, _rect_cov(Y, X, st['col'], st['thick'], ra - 0.5, rb + 0.5))
    return cov


def draw_flag(n, template, shape, r0, c0, nflag=1):
    """The page's flag outline placed at the stem's far end, on its right, bilinear. `template` is (T, n) from median_outline."""
    import cv2
    st = n['stem']; s = n['_s']; sd = st['dir']; hc = st['thick'] / 2 + CORRIDOR_PX
    T = template[0].astype(np.float32)
    Y, X = _grid(shape, r0, c0)
    tau = -sd * (Y - st['far_end']) / s; lam = (X - st['col'] - hc) / s
    ti = (tau - OUTLINE_TAU_S[0]) * S_GRID - 0.5; li = lam * S_GRID - 0.5
    out = cv2.remap(T, li.astype(np.float32), ti.astype(np.float32), cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
    return np.clip(out, 0, 1).astype(float)


def draw_beam(n, notes, shape, r0, c0, thick_px, pitch_px=None, nbar=1):
    """A bar from this stem's far end to each neighbouring same-direction stem on a side where one was traced, its outer edge on the
    line between the two tips, thickness `thick_px`; for two bars the second lies `pitch_px` nearer the heads. None if no neighbour."""
    Y, X = _grid(shape, r0, c0)
    st = n['stem']; sd = st['dir']; cov = np.zeros(shape); any_ = False
    for key in ('beam_right', 'beam_left'):
        b = n.get(key)
        if not b or b.get('other') is None: continue
        m = notes[b['other']]; sm = m['stem']
        if sm is None: continue
        any_ = True
        c1, y1, c2, y2 = st['col'], st['far_end'], sm['col'], sm['far_end']
        lo, hi = sorted((c1, c2))
        for k in range(nbar):
            off = k * (pitch_px if pitch_px else 0)
            if k and not pitch_px: return None
            yo = y1 + (y2 - y1) * (X - c1) / (c2 - c1) - sd * off          # the outer edge of this bar, toward the heads for k > 0
            # rows [yo, yo + T] for an up-stem (sd = -1), [yo - T, yo] for a down-stem
            ra = np.where(sd < 0, yo, yo - thick_px); rb = np.where(sd < 0, yo + thick_px, yo)
            cvr = np.clip(np.minimum(Y + 0.5, rb) - np.maximum(Y - 0.5, ra), 0, 1) * ((X >= lo) & (X <= hi))
            cov = np.maximum(cov, cvr)
    return cov if any_ else None


def area_masks(n, shape, r0, c0, footprint=None):
    """R_s (where a flag or a bar would be: the strips, and any part of a candidate's footprint that falls in the dot window) and R_d
    (the dot window apart from that footprint) as boolean arrays over the patch. `footprint` is the union of the non-plain stem
    candidates' ink (coverage > 0.1), or None. A flag's tail that passes through the dot window is the flag's to explain, not the dot's."""
    st = n['stem']; h = n['head']; s = n['_s']; sd = st['dir']
    Y, X = _grid(shape, r0, c0)
    hc = st['thick'] / 2 + CORRIDOR_PX
    Lpx = abs(st['far_end'] - st['head_end'])
    tau = -sd * (Y - st['far_end']); lam = np.abs(X - st['col']) - hc
    strips = (tau >= TAU_LO_S * s) & (tau <= min(TAU_HI_S * s, Lpx - AREA_TAU_HI_BACK_S * s)) & (lam > 0) & (lam <= LAM_MAX_S * s)
    win = (X >= h['cx'] + DOT_WIN['dx0'] * s) & (X <= h['cx'] + DOT_WIN['dx1'] * s) & (Y >= h['cy'] + DOT_WIN['dy0'] * s) & (Y <= h['cy'] + DOT_WIN['dy1'] * s)
    F = footprint if footprint is not None else np.zeros(shape, bool)
    Rd = win & ~F
    Rs = (strips & ~Rd) | (F & win)
    return Rs, Rd


def _mse(M, D, R):
    k = int(R.sum())
    return float(((M - D) ** 2)[R].sum() / k) if k else None


def dot_disc(n, shape, r0, c0, dvals):
    """The dot's disc at the place the page's own offsets predict: the centre `gap` right of the head's edge, and up by the space's
    centre (0.5 s for a head on a line, 0 for a head in a space, GOULD r111) plus the page's own median residual."""
    if dvals is None: return None
    h = n['head']; s = n['_s']
    on = head_on_line(n, s)
    cx = h['cx'] + head_halfwidth(h) + dvals['gap_s'] * s
    cy = h['cy'] - ((0.5 if on else 0.0) + dvals['resid_s']) * s
    Y, X = _grid(shape, r0, c0)
    d = np.sqrt((X - cx) ** 2 + (Y - cy) ** 2) - dvals['d_s'] * s / 2
    return np.clip(0.5 - d, 0, 1)


def stem_candidates(n, notes, shape, r0, c0, base, templates, bvals):
    """{name: model coverage} of the drawable stem candidates: plain, flag1, flag2, beam1, beam2. `templates[(kind, dir)]` is a
    (T, n) pair or absent; `bvals` is {'thick_s', 'pitch_s'} or None."""
    out = {'plain': base}
    d = 'up' if n['stem']['dir'] < 0 else 'down'
    for k in ('flag1', 'flag2'):
        t = templates.get((k, d))
        if t is not None: out[k] = np.maximum(base, draw_flag(n, t, shape, r0, c0))
    if bvals and bvals.get('thick_s'):
        c1 = draw_beam(n, notes, shape, r0, c0, bvals['thick_s'] * n['_s'], None, 1)
        if c1 is not None: out['beam1'] = np.maximum(base, c1)
        if bvals.get('pitch_s'):
            c2 = draw_beam(n, notes, shape, r0, c0, bvals['thick_s'] * n['_s'], bvals['pitch_s'] * n['_s'], 2)
            if c2 is not None: out['beam2'] = np.maximum(base, c2)
    return out


def note_errors(n, notes, templates, bvals, dvals):
    """The comparison of every drawable candidate with the note's patch. Returns {'stem': {name: mse}, 'dot': {'undotted': mse, 'dotted': mse}}."""
    D, r0, c0 = unpack(n); shape = D.shape
    base = own_cov(n, notes, shape, r0, c0)
    cands = stem_candidates(n, notes, shape, r0, c0, base, templates, bvals)
    F = np.zeros(shape, bool)
    for name, M in cands.items():
        if name != 'plain': F |= (M - base) > 0.1
    Rs, Rd = area_masks(n, shape, r0, c0, F)
    res = dict(stem={}, dot={}, n_s=int(Rs.sum()), n_d=int(Rd.sum()))
    for name, M in cands.items(): res['stem'][name] = _mse(M, D, Rs)
    res['dot']['undotted'] = _mse(base, D, Rd)
    disc = dot_disc(n, shape, r0, c0, dvals)
    if disc is not None: res['dot']['dotted'] = _mse(np.maximum(base, disc), D, Rd)
    return res


KIND_DUR = {'plain': 4, 'flag1': 8, 'beam1': 8, 'flag2': 16, 'beam2': 16}
STEM_KINDS = ('plain', 'flag1', 'flag2', 'beam1', 'beam2')


def _pick(page_stats, pool_stats):
    """(stats, source): the page's own if it has NMIN_POOL clear cases, else the song's pool if it has, else (None, 'none')."""
    if page_stats.get('n', 0) >= NMIN_POOL: return page_stats, 'page'
    if pool_stats.get('n', 0) >= NMIN_POOL: return pool_stats, 'song'
    return None, 'none'


def _dot_values(notes):
    ds = [n for n in notes if n['dotk'] == 'dotted']
    res = [(n['dot']['dy_s'] - (0.5 if head_on_line(n, n['_s']) else 0.0)) for n in ds]
    return dict(d=_stats([n['dot']['d'] / n['_s'] for n in ds]), gap=_stats([(n['dot']['cx'] - (n['head']['cx'] + head_halfwidth(n['head']))) / n['_s'] for n in ds]), resid=_stats(res))


def trial_song(pages):
    """The trial for one song. `pages`: [{'notes': [...classified...], 's', 'line_t'}]. Sets n['trial'] on every note and returns the
    song's account: values by page and where they were pooled, templates and bounds, and the counts. Pure numpy: runs under Pyodide."""
    allnotes = [n for pg in pages for n in pg['notes']]
    pool = page_values(allnotes); pool_dot = _dot_values(allnotes)
    pool_samples = {}
    for pg in pages:
        for n in pg['notes']:
            if n['kind'] in ('flag1', 'flag2') and n['scan']['strokes'][0]['side'] > 0:
                d = 'up' if n['stem']['dir'] < 0 else 'down'
                pool_samples.setdefault((n['kind'], d), []).append((pg, n))
    # outlines are sampled once per clear flag; the page's and the song's median come from the same samples
    for key, lst in pool_samples.items():
        for pg, n in lst: n['_outline'] = outline_sample(n, pg['notes'], pg['s'])
    song_templates = {k: median_outline([n['_outline'] for _, n in v]) for k, v in pool_samples.items() if len(v) >= NMIN_POOL}
    account = dict(pages=[], song_templates={'%s_%s' % k: v[1] for k, v in song_templates.items()}, pool_clear_stems=pool['clear_stems'], pool_clear_dots=pool['clear_dots'])
    # pass A: every page's values, templates, and the errors of every drawable candidate
    per = []
    for pg in pages:
        N = pg['notes']; V = page_values(N); Vd = _dot_values(N)
        tmpl = {}; tsrc = {}
        for key, lst in pool_samples.items():
            mine = [n['_outline'] for p2, n in lst if p2 is pg]
            if len(mine) >= NMIN_POOL: tmpl[key] = median_outline(mine); tsrc[key] = 'page'
            elif key in song_templates: tmpl[key] = song_templates[key]; tsrc[key] = 'song'
        bt, bsrc = _pick(V['beam_thick_s'], pool['beam_thick_s']); bp, psrc = _pick(V['beam_pitch_s'], pool['beam_pitch_s'])
        bvals = dict(thick_s=bt['median'] if bt else None, pitch_s=bp['median'] if bp else None)
        dd, dsrc = _pick(Vd['d'], pool_dot['d']); dg, gsrc = _pick(Vd['gap'], pool_dot['gap']); dr, rsrc = _pick(Vd['resid'], pool_dot['resid'])
        dvals = dict(d_s=dd['median'], gap_s=dg['median'], resid_s=dr['median']) if (dd and dg and dr) else None
        for n in N:
            n['_err'] = note_errors(n, N, tmpl, bvals, dvals) if (n['head'] is not None and n['stem'] is not None and not n['hollow'] and n['scan'] is not None and not n['scan'].get('stem_short')) else None
        per.append(dict(pg=pg, V=V, tmpl=tmpl, tsrc=tsrc, bvals=bvals, bsrc=(bsrc, psrc), dvals=dvals, dsrc=(dsrc, gsrc, rsrc)))
    # bounds: the largest error that this page's clear cases of the kind show against their own drawings
    def clear_errs(notes, kind, which):
        out = []
        for n in notes:
            if n['_err'] is None: continue
            if which == 'stem' and n['kind'] == kind and n['_err']['stem'].get(kind) is not None: out.append(n['_err']['stem'][kind])
            if which == 'dot' and n['dotk'] == kind and n['_err']['dot'].get(kind) is not None: out.append(n['_err']['dot'][kind])
        return out
    pool_b = {('stem', k): clear_errs(allnotes, k, 'stem') for k in STEM_KINDS}; pool_b.update({('dot', k): clear_errs(allnotes, k, 'dot') for k in ('undotted', 'dotted')})
    for P in per:
        N = P['pg']['notes']; B = {}; Bsrc = {}
        for key, pv in pool_b.items():
            mine = clear_errs(N, key[1], key[0])
            if len(mine) >= NMIN_POOL: B[key] = max(mine); Bsrc[key] = ('page', len(mine))
            elif len(pv) >= NMIN_POOL: B[key] = max(pv); Bsrc[key] = ('song', len(pv))
            else: B[key] = None; Bsrc[key] = ('none', len(pv))
        P['B'] = B; P['Bsrc'] = Bsrc
        for n in N: n['trial'] = decide_note(n, B)
        for n in N: n['rt'] = round_trip(n, N, P['tmpl'], P['bvals'], P['dvals']) if (n['trial']['dur'] is not None and not n['trial']['keep_reader']) else None
        account['pages'].append(dict(page=P['pg'].get('page'), values=P['V'], templates={'%s_%s' % k: (P['tsrc'][k], P['tmpl'][k][1]) for k in P['tmpl']}, beam=(P['bvals'], P['bsrc']), dot=(P['dvals'], P['dsrc']),
                                     bounds={'%s_%s' % k: (None if v is None else v) for k, v in B.items()}, bound_src={'%s_%s' % k: v for k, v in P['Bsrc'].items()}))
    # the round trip's bound: the largest share of each kind that this page's clear cases (stem and dot both clear) show against their own drawings
    rts = {id(P['pg']): [n['rt'] for n in P['pg']['notes'] if n['rt'] is not None and n['kind'] is not None and n['dotk'] is not None] for P in per}
    allrt = [r for v in rts.values() for r in v]
    for P, acc_page in zip(per, account['pages']):
        mine = rts[id(P['pg'])]
        use = mine if len(mine) >= NMIN_POOL else allrt
        bu = max((r['U'] for r in use), default=None); bv = max((r['V'] for r in use), default=None)
        acc_page['rt_bound'] = dict(U=bu, V=bv, n=len(use), src='page' if len(mine) >= NMIN_POOL else 'song')
        for n in P['pg']['notes']:
            if n['rt'] is not None: n['rt']['unsure'] = bool((bu is not None and n['rt']['U'] > bu) or (bv is not None and n['rt']['V'] > bv))
    account['_per'] = per      # in memory only (templates, bounds): not JSON
    return account


RT_PAD = dict(cols=(1.0, 2.4), rows=0.7)   # DESK: the note's own area for the round trip, s: left of / right of the stem-and-head columns; past the head and the tip


def round_trip(n, notes, tmpl, bvals, dvals):
    """Draw the trial's reading of this note back over its scan and count, within the note's own area, the scan's ink the drawing does
    not hold (U) and the drawing's ink the scan does not hold (V), each as a share of the drawing's ink apart from the lines."""
    t = n['trial']; D, r0, c0 = unpack(n); shape = D.shape
    base = own_cov(n, notes, shape, r0, c0)
    cands = stem_candidates(n, notes, shape, r0, c0, base, tmpl, bvals)
    M = cands.get(t['stem'])
    if M is None: return None
    if t['dot'] == 'dotted':
        disc = dot_disc(n, shape, r0, c0, dvals)
        if disc is None: return None
        M = np.maximum(M, disc)
    Y, X = _grid(shape, r0, c0); h = n['head']; st = n['stem']; s = n['_s']
    xl = min(st['col'], h['cx']) - RT_PAD['cols'][0] * s; xr = max(st['col'], h['cx']) + RT_PAD['cols'][1] * s
    ya = min(st['far_end'], h['cy']) - RT_PAD['rows'] * s; yb = max(st['far_end'], h['cy']) + RT_PAD['rows'] * s
    A = (X >= xl) & (X <= xr) & (Y >= ya) & (Y <= yb)
    L = np.zeros(shape)
    for yc, tt, _k in h['lines']: L = np.maximum(L, _cov_line(Y, yc, tt))
    for yr in ledger_rows(n['staff'], s, h['cy'], n['_line_t']): L = np.maximum(L, _cov_line(Y, yr, n['_line_t']) * (np.abs(X - h['cx']) <= 0.95 * s))
    den = float(np.maximum(M - L, 0)[A].sum())
    if den <= 0: return None
    return dict(U=float(np.maximum(D - M, 0)[A].sum() / den), V=float(np.maximum(M - D, 0)[A].sum() / den), den=den, area_px=int(A.sum()))


def decide_note(n, B):
    """The trial's reading of one note: {'dur': (num, den) or None, 'abstain': reason or None, 'pass2': bool, 'stem': kind or None, 'dot': 'dotted'/'undotted'/None, ...}."""
    t = dict(pass2=False, stem=None, dot=None, dur=None, abstain=None, keep_reader=False, stem_src=None, dot_src=None, why_stem=None, why_dot=None)
    if n['head'] is None or n['hollow'] or n['stem'] is None or n['scan'] is None or n['scan'].get('stem_short') or n['_err'] is None:
        t['keep_reader'] = True; t['abstain'] = n.get('kind_why') or 'no_fit'; return t
    E = n['_err']
    # the stem. THE BEST-FITTING candidate (the lowest difference from the scan) is read if it lies within what the page's clear cases of its
    # kind show, and no candidate of another length does; else the note abstains and says what was close.
    def pick(cand, B, which, forms_dur):
        have = {k: e for k, e in cand.items() if e is not None}
        if not have: return None, 'nothing_drawable'
        best = min(have, key=lambda k: have[k])
        bb = B[(which, best)]
        if bb is None: return None, 'best_fit_is_%s_whose_tolerance_the_song_has_not_shown(no_clear_case)' % best
        if have[best] > bb: return None, 'best_fit_%s_is_%.1fx_its_bound' % (best, have[best] / bb if bb else float('inf'))
        others = [k for k, e in have.items() if k != best and forms_dur(k) != forms_dur(best) and B[(which, k)] is not None and e <= B[(which, k)]]
        if others: return None, 'a_second_length_is_also_within_its_bound:%s+%s' % (best, '+'.join(others))
        return best, None
    if n['kind'] is not None: t['stem'] = n['kind']; t['stem_src'] = 'clear'
    else:
        t['pass2'] = True
        k, why = pick(E['stem'], B, 'stem', lambda k: KIND_DUR[k])
        if k: t['stem'] = k; t['stem_src'] = 'drawn'
        else: t['why_stem'] = why
    # the dot
    if n['dotk'] is not None: t['dot'] = n['dotk']; t['dot_src'] = 'clear'
    else:
        t['pass2'] = True
        k, why = pick(E['dot'], B, 'dot', lambda k: k)
        if k: t['dot'] = k; t['dot_src'] = 'drawn'
        else: t['why_dot'] = why
    if t['stem'] and t['dot']:
        base = Fraction(1, KIND_DUR[t['stem']]); d = base * (Fraction(3, 2) if t['dot'] == 'dotted' else 1)
        t['dur'] = (d.numerator, d.denominator)
    else: t['abstain'] = 'stem: %s | dot: %s' % (t['why_stem'] or 'read', t['why_dot'] or 'read')
    return t


# =============================================================================================== the overlay tile (for the desk's eye)
def overlay_tile(n, notes, tmpl, bvals, dvals, scale=2, label=None, frame=None):
    """One note's own area: the scan in grey, the drawing of the trial's reading in blue where it holds scan ink and in orange where
    the scan has none (the drawing's unheld ink), and the scan's unexplained ink in red. Returns a BGR image or None."""
    import cv2
    t = n['trial']
    if t is None or t['dur'] is None or t['keep_reader']: return None
    D, r0, c0 = unpack(n); shape = D.shape
    base = own_cov(n, notes, shape, r0, c0)
    cands = stem_candidates(n, notes, shape, r0, c0, base, tmpl, bvals)
    M = cands.get(t['stem'])
    if M is None: return None
    if t['dot'] == 'dotted':
        disc = dot_disc(n, shape, r0, c0, dvals)
        if disc is not None: M = np.maximum(M, disc)
    Y, X = _grid(shape, r0, c0); h = n['head']; st = n['stem']; s = n['_s']
    xl = int(min(st['col'], h['cx']) - RT_PAD['cols'][0] * s - c0); xr = int(max(st['col'], h['cx']) + RT_PAD['cols'][1] * s - c0)
    ya = int(min(st['far_end'], h['cy']) - RT_PAD['rows'] * s - r0); yb = int(max(st['far_end'], h['cy']) + RT_PAD['rows'] * s - r0)
    xl, ya = max(0, xl), max(0, ya); xr, yb = min(shape[1], xr), min(shape[0], yb)
    D2 = D[ya:yb, xl:xr]; M2 = M[ya:yb, xl:xr]
    img = np.full(D2.shape + (3,), 255, np.uint8)
    grey = (255 - np.clip(D2, 0, 1) * 150).astype(np.uint8); img[:] = grey[..., None]
    held = (M2 > 0.5) & (D2 > 0.5); unheld = (M2 > 0.5) & (D2 <= 0.5); unexpl = (D2 > 0.5) & (M2 <= 0.5)
    img[held] = (200, 120, 40); img[unheld] = (0, 150, 255); img[unexpl] = (0, 0, 220)      # BGR: blue, orange, red
    img = cv2.resize(img, None, fx=scale, fy=scale, interpolation=cv2.INTER_NEAREST)
    if frame is not None: img = cv2.copyMakeBorder(img, 4, 4, 4, 4, cv2.BORDER_CONSTANT, value=frame)
    return img
