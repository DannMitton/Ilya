"""Row 105 r4: the label check (brief r5 amendment 3) and the four calibration figures (amendment 7). New in r4.
Label check: for a raw kind 2 row (grey, before the frame) and its framed row, the ink mass in the first and in the last 3 percent of the label's text span (the
columns between the first and last ink column of the raw row), mapped into the framed row by the frame's scale f (the framed width less the 2*16 px of padding, over the raw width;
the frame's rotation is about the centre and moves ink vertically only). Mass = sum of (255-grey)/255, the framed mass divided by f**2. The end's loss is
1 - (framed end mass / raw end mass) / (framed whole mass / f**2 / raw whole mass), the whole-row ratio taking out what the closing and the resampling add to every part of the row.
A row is dropped when either end loses more than 10 percent (DESK DEFAULT)."""
import numpy as np, cv2, re
from PIL import Image
PAD = 16
def grey(p): return np.asarray(Image.open(p).convert('L'))
def mass(g): return float((255.0 - g.astype(np.float64)).sum() / 255.0)
def end_loss(raw, fr):
    ink = np.where((raw < 128).any(axis=0))[0]
    if len(ink) < 10: return None
    x0, x1 = int(ink.min()), int(ink.max()); span = x1 - x0 + 1; E = max(1, int(round(0.03 * span)))
    f = (fr.shape[1] - 2 * PAD) / raw.shape[1]
    whole = (mass(fr) / f ** 2) / max(mass(raw), 1e-9); out = []
    for a, b in ((x0, x0 + E), (x1 + 1 - E, x1 + 1)):
        m_raw = mass(raw[:, a:b]); fa, fb = int(round(PAD + f * a)), int(round(PAD + f * b)); m_fr = mass(fr[:, fa:max(fb, fa + 1)]) / f ** 2
        out.append(1 - (m_fr / max(m_raw, 1e-9)) / whole if m_raw > 0 else 0.0)
    return out
def runs_h(g):
    b = (g < 128).astype(np.int8); d = np.diff(np.pad(b, ((0, 0), (1, 1))), axis=1); out = []
    for r in range(b.shape[0]):
        s = np.where(d[r] == 1)[0]; e = np.where(d[r] == -1)[0]; out.extend((e - s).tolist())
    return out
def figures(framed, letters):
    """framed: list of grey arrays after the frame; letters: total letters of their labels. Pooled over rows."""
    ink = tot = 0; runs = []; cc = 0
    for g in framed:
        b = g < 128; ink += int(b.sum()); tot += b.size; runs.extend(runs_h(g))
        cc += cv2.connectedComponents(b.astype(np.uint8), connectivity=8)[0] - 1
    return dict(rows=len(framed), ink_share=ink / tot, median_run=float(np.median(runs)), cc_per_letter=cc / max(letters, 1), cc=cc, letters=letters)
def edge_share(raws): return sum(1 for g in raws if (g[0] < 128).any() or (g[-1] < 128).any()) / len(raws)
def nletters(t): return sum(1 for c in t if c.isalpha())
