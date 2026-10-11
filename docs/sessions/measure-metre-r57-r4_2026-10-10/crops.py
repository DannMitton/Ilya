"""Crops at a seat, staff-normalized: 32 x 32 at 10 px a space, centred on (x, seat line)."""
import numpy as np, cv2
CW = 32
SEATS = [1, 2, 3]   # upper figure on line 2 from top, C on middle, lower on line 4

def crop_norm(g, x, y):
    """From a normalized image (10 px a space)."""
    M = np.float32([[1, 0, CW / 2 - x], [0, 1, CW / 2 - y]])
    return cv2.warpAffine(g, M, (CW, CW), flags=cv2.INTER_LINEAR, borderValue=255)

def crop_page(g, x, y, space):
    """From a page image at its own staff space."""
    k = 10.0 / space
    M = np.float32([[k, 0, CW / 2 - k * x], [0, k, CW / 2 - k * y]])
    return cv2.warpAffine(g, M, (CW, CW), flags=cv2.INTER_AREA if k < 1 else cv2.INTER_LINEAR, borderValue=255)
