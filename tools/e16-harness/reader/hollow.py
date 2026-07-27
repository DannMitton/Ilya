#!/usr/bin/env python3
"""E.16 -- HOLLOW notehead detection (minim and semibreve).

Named prediction, made by Fable before any ink was touched and confirmed on
Elegy page 5: a matched filter tuned to a FILLED ellipse under-responds on a
hollow notehead, because a fill-fraction response is designed for fills and a
hollow head is a ring. Measured: 36 of 36 filled found, 0 of 6 hollow.

Fix, pre-authorized as "the same classical primitive": an ANNULUS matched
filter. Instead of one fill response, take the difference of two responses,
the ring and the core:

    ring_response = mean(ink over the ring) - mean(ink over the core)

which is high exactly when the rim is inked and the centre is empty. This is a
difference-of-ellipses kernel, the same family as the filled matched filter
already in the pipeline (oemer's notehead stage without the learned mask), so
T4 is satisfied by the same citation.

Duration follows from stem presence, per Gould: the semibreve is the only
stemless notehead in common use, so hollow-with-stem is a minim and
hollow-without-stem is a semibreve.
"""
import cv2, numpy as np
from reader import nms, has_stem

RING_OUTER_W, RING_OUTER_H = 1.35, 0.92     # same nominal head box as the filled filter
CORE_SCALE = 0.52                            # inner ellipse as a fraction of the outer
RING_THR = 0.34                              # ring-minus-core response floor


def _ellipse(w, h):
    return cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (max(1, w) | 1, max(1, h) | 1)).astype(np.float32)


def detect_hollow_heads(nl_safe, staves, vocal, s, sysband, thr=RING_THR):
    """Annulus matched filter. nl_safe must be the SYMBOL-PRESERVING line removal,
    so a staff line crossing the empty core has already gone and does not fill it."""
    ink = nl_safe.astype(np.float32)
    ow, oh = int(round(RING_OUTER_W * s)), int(round(RING_OUTER_H * s))
    outer = _ellipse(ow, oh)
    iw, ih = int(round(ow * CORE_SCALE)), int(round(oh * CORE_SCALE))
    core = np.zeros_like(outer)
    ce = _ellipse(iw, ih)
    y0 = (outer.shape[0] - ce.shape[0]) // 2
    x0 = (outer.shape[1] - ce.shape[1]) // 2
    core[y0:y0 + ce.shape[0], x0:x0 + ce.shape[1]] = ce
    ring = np.clip(outer - core, 0, 1)
    if ring.sum() == 0 or core.sum() == 0:
        return []
    kr = ring / ring.sum()
    kc = core / core.sum()
    resp = cv2.filter2D(ink, -1, kr) - cv2.filter2D(ink, -1, kc)

    def width_ok(x, y):
        """A hollow notehead spans ~1.35 staff spaces at its vertical centre.
        A Cyrillic lyric counter (o, a, e, v) is a ring too, but roughly half that
        wide. Size is the discriminator that topology alone cannot supply."""
        H, W = nl_safe.shape
        lo = max(0, int(x - 1.0 * s)); hi = min(W - 1, int(x + 1.0 * s))
        if not (0 <= y < H): return False
        row = nl_safe[y, lo:hi + 1]
        idx = np.where(row > 0)[0]
        if len(idx) < 2: return False
        span = idx[-1] - idx[0] + 1
        if not (1.10 * s <= span <= 1.70 * s): return False
        # HEIGHT: a notehead rim spans about 0.92 staff spaces vertically. A clef
        # loop is a ring of the right width but sits inside ink many spaces tall.
        lo2 = max(0, int(y - 1.2 * s)); hi2 = min(H - 1, int(y + 1.2 * s))
        col = nl_safe[lo2:hi2 + 1, x]
        jdx = np.where(col > 0)[0]
        if len(jdx) < 2: return False
        vspan = jdx[-1] - jdx[0] + 1
        return 0.62 * s <= vspan <= 1.35 * s

    ys, xs = np.where(resp >= thr)
    pts = [(int(x), int(y)) for x, y in zip(xs, ys)
           if sysband(y) >= 0 and width_ok(int(x), int(y))]
    if not pts:
        return []
    sc = [float(resp[y, x]) for x, y in pts]
    keep = nms(pts, sc, 0.9 * s)
    out = []
    for i in keep:
        x, y = pts[i]
        stem = has_stem(nl_safe, x, y, s)
        if not stem:
            # A stemless hollow head is a semibreve, legal but rare; keep it only
            # if the response is strong, since unstemmed ring FPs dominate.
            if sc[i] < thr + 0.12: continue
        out.append(dict(x=x, y=y, sys=sysband(y), score=sc[i], hollow=True,
                        stemmed=bool(stem)))
    out.sort(key=lambda h: (h['sys'], h['x']))
    return out


def merge_heads(filled, hollow, s):
    """Filled detections win where the two overlap (a filled head never reads as a ring
    at the same centre, but binarization noise can produce a weak duplicate)."""
    out = list(filled)
    for h in hollow:
        if any((h['x'] - f['x']) ** 2 + (h['y'] - f['y']) ** 2 < (0.9 * s) ** 2 for f in filled):
            continue
        out.append(h)
    out.sort(key=lambda h: (h['sys'], h['x']))
    return out
