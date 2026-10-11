import pickle, numpy as np, cv2
from staff import load, lines_at
from crops import crop_norm
ALLST = pickle.load(open('staves.pkl', 'rb'))
_band = {}
_page = {}

def page(name):
    if name not in _page:
        if len(_page) > 6: _page.clear()
        _page[name] = load('pages_d/%s.png' % name)
    return _page[name]

def band(name, si):
    key = (name, si)
    if key not in _band:
        st = ALLST[name][si]; sp = st['space']; g = page(name)
        Lm = lines_at(st, (st['x0'] + st['x1']) / 2)
        y0 = max(0, int(Lm[0] - 5 * sp)); y1 = min(g.shape[0], int(Lm[4] + 5 * sp))
        k = 10.0 / sp
        b = cv2.resize(g[y0:y1], (int(g.shape[1] * k), int((y1 - y0) * k)), interpolation=cv2.INTER_AREA)
        _band[key] = (b, y0, k)
    return _band[key]

def crops_at(name, si, xs, seats=(1, 2, 3)):
    """Crops at page columns xs for each seat: array (len(xs), len(seats), 32, 32)."""
    st = ALLST[name][si]; b, y0, k = band(name, si)
    out = np.empty((len(xs), len(seats), 32, 32), np.uint8)
    for i, x in enumerate(xs):
        L = lines_at(st, x)
        for j, s in enumerate(seats):
            out[i, j] = crop_norm(b, x * k, (L[s] - y0) * k)
    return out
