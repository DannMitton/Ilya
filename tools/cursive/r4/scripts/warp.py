import cv2, numpy as np, sys, json
from PIL import Image, ImageOps
S = 8.0  # px per PDF point
DOTS = np.float32([[28.3, 51.0], [583.7, 51.0], [28.3, 763.7], [583.7, 763.7]]) * S
def load(f, rot):
    im = ImageOps.exif_transpose(Image.open(f)).convert('RGB')
    if rot: im = im.rotate(rot, expand=True)
    return cv2.cvtColor(np.array(im), cv2.COLOR_RGB2GRAY)
def dots(g):
    h, w = g.shape
    # paper mask: bright region
    _, paper = cv2.threshold(cv2.GaussianBlur(g, (51, 51), 0), 150, 255, cv2.THRESH_BINARY)
    paper = cv2.erode(paper, np.ones((15, 15), np.uint8))
    _, dark = cv2.threshold(g, 90, 255, cv2.THRESH_BINARY_INV)
    n, lab, st, cen = cv2.connectedComponentsWithStats(dark)
    c = []
    for i in range(1, n):
        x, y, bw, bh, a = st[i]
        if 300 < a < 6000 and 0.7 < bw / bh < 1.4 and a / (bw * bh) > 0.65:
            cx, cy = cen[i]
            # surrounded by paper
            r = int(max(bw, bh) * 1.5)
            ring = paper[max(0, int(cy) - r):int(cy) + r, max(0, int(cx) - r):int(cx) + r]
            if ring.size and ring.mean() > 200 * 0.6:
                c.append((cx, cy, a))
    return c
def order(pts):
    pts = np.float32(pts)
    s = pts.sum(1); d = pts[:, 0] - pts[:, 1]
    return np.float32([pts[s.argmin()], pts[d.argmax()], pts[d.argmin()], pts[s.argmax()]])
f, rot, out = sys.argv[1], int(sys.argv[2]), sys.argv[3]
g = load(f, rot)
c = dots(g)
print(f, 'candidates', len(c), [(int(x), int(y), int(a)) for x, y, a in c])
if len(c) != 4:
    # keep the four nearest the image's corners
    h, w = g.shape
    corners = [(0, 0), (w, 0), (0, h), (w, h)]
    c = [min(c, key=lambda p: (p[0] - X) ** 2 + (p[1] - Y) ** 2) for X, Y in corners]
src = order([(x, y) for x, y, a in c])
H = cv2.getPerspectiveTransform(src, DOTS)
page = cv2.warpPerspective(g, H, (int(612 * S), int(792 * S)), flags=cv2.INTER_CUBIC, borderValue=255)
cv2.imwrite(out, page)
