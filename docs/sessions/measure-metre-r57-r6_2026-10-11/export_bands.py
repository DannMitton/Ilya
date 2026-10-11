"""For run 2's parity: every window of the 16 songs as the Python reader saw it. Per staff, its band (uint8, at
10 px a space) as raw bytes, and its line samples; per window, its x range and space. The TypeScript reader reads
these same inputs, so a disagreement is the port's, not the page's."""
import json, os, pickle
import numpy as np
from pages5 import band, ALLST
D = '../parity/bands'; os.makedirs(D, exist_ok=True)
W = json.load(open('windows.json'))
songs = json.load(open('../run1/songs.json')); said = {r['id']: r for r in songs}
staves = {}; wins = []
for w in W:
    if w['id'] not in said: continue
    key = '%s__%d' % (w['page'], w['staff'])
    if key not in staves:
        b, y0, k = band(w['page'], w['staff'], 10); st = ALLST[w['page']][w['staff']]
        b = np.ascontiguousarray(b, dtype=np.uint8); b.tofile(f'{D}/{key}.bin')
        staves[key] = dict(width=int(b.shape[1]), height=int(b.shape[0]), y0=float(y0), k=float(k),
                           xs=[float(x) for x in st['xs']], ls=[[float(v) for v in l] for l in st['ls']], space=float(st['space']))
    wins.append(dict(id=w['id'], staff=key, x0=w['x0'], x1=w['x1'], space=w['space'], said=said[w['id']]['said'], truth=said[w['id']]['truth']))
json.dump(dict(staves=staves, windows=wins), open('../parity/windows.json', 'w'))
# the Python reader's base reading for each window, for a closer look where they disagree
WR = pickle.load(open('../run1/W.pkl', 'rb'))
np.savez_compressed('../parity/py_base.npz', **{str(i): WR[i]['A'][4]['P'] for i in said})
print(len(staves), 'staves', len(wins), 'windows')
