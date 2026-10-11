"""Page bands at each network's pixels a space, and crops cut from them (r5)."""
import pickle, numpy as np, cv2
from staff import load, lines_at
from crops import crop_norm
ALLST = pickle.load(open('staves.pkl', 'rb'))
_band, _page = {}, {}

def page(name):
    if name not in _page:
        if len(_page) > 6: _page.clear()
        _page[name] = load('pages_d/%s.png' % name)
    return _page[name]

def band(name, si, sp=10):
    key = (name, si, sp)
    if key not in _band:
        if len(_band) > 400: _band.clear()
        st = ALLST[name][si]; g = page(name)
        Lm = lines_at(st, (st['x0'] + st['x1']) / 2)
        y0 = max(0, int(Lm[0] - 5 * st['space'])); y1 = min(g.shape[0], int(Lm[4] + 5 * st['space']))
        k = sp / st['space']
        b = cv2.resize(g[y0:y1], (int(g.shape[1] * k), int((y1 - y0) * k)), interpolation=cv2.INTER_AREA)
        _band[key] = (b, y0, k)
    return _band[key]

def seat_y(name, si, x, seat, sp=10):
    """A seat line's height in the band at page column x."""
    st = ALLST[name][si]; b, y0, k = band(name, si, sp)
    return (lines_at(st, x)[seat] - y0) * k
