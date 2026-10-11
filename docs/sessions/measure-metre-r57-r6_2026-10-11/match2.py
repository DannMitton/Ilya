"""Run 2 parity, part 2: the app's windows (from homr's boxes, on homr's page images) against the Python reader's
windows (round 4's staff finder, deskewed 300 dpi pages). Each Python window's left edge and top line are mapped to
homr's page image (w5map.to_app), and paired with the nearest app window on that image within 1.5 spaces across
and 2 spaces down. Usage: python match2.py <ts2.json>"""
import json, sys, pickle
from collections import Counter
from PIL import Image
from staff import lines_at
from w5map import to_app, page_index
W = json.load(open('windows.json')); ALL = pickle.load(open('staves.pkl', 'rb'))
PY = {r['id']: r for r in json.load(open('../run1/songs.json'))}
TS = json.load(open(sys.argv[1]))
used = set(); rows = []; c = Counter()
for w in W:
    if w['id'] not in PY or w['song'] not in TS: continue
    r = json.load(open('../before/%s.json' % w['song'])); img = page_index(w['page'])
    st = ALL[w['page']][w['staff']]; mine = Image.open('pages_d/%s.png' % w['page']).size; app = r['sizes'][img]
    x0, top = to_app(w['page'], w['x0'], lines_at(st, w['x0'])[0], mine, app)
    sp = st['space'] * app[0] / mine[0]
    best = None
    for pi, p in enumerate(TS[w['song']]):
        if p['image'] != img: continue
        for wi, t in enumerate(p['windows']):
            dx = abs(t['x0'] - x0); dy = abs(t['lines'][0] - top)
            # a system start is the staff's first window: matched by the staff alone (the staff's left end is found
            # without deskew, so it can stand a few spaces from the Python one)
            near = (t['kind'] == 'start' and dy < 2 * sp) if w['kind'] == 'start' else (t['kind'] == 'bar' and dx < 1.5 * sp and dy < 2 * sp)
            if near and (best is None or dx < best[0]): best = (dx, (w['song'], pi, wi), t)
    py = PY[w['id']]
    if best is None:
        rows.append(dict(id=w['id'], song=w['song'], kind=w['kind'], truth=py['truth'], py=py['said'], ts=None, matched=False)); c['python window unmatched'] += 1
        continue
    used.add(best[1]); t = best[2]
    rows.append(dict(id=w['id'], song=w['song'], kind=w['kind'], truth=py['truth'], py=py['said'], ts=t['lab'], why=t['why'], matched=True, dx=round(best[0] / sp, 2)))
    c['matched, agree' if py['said'] == t['lab'] else 'matched, DISAGREE'] += 1
extra = []
for song, pages in TS.items():
    for pi, p in enumerate(pages):
        for wi, t in enumerate(p['windows']):
            if (song, pi, wi) not in used:
                extra.append(dict(song=song, image=p['image'], kind=t['kind'], x0=t['x0'], lab=t['lab'], courtesy=t['courtesy']))
c['app window with no Python window'] = len(extra)
print(dict(c))
print('app windows unmatched that state something:', [e for e in extra if e['lab']])
for r in rows:
    if (r['matched'] and r['py'] != r['ts']) or r['truth'] or (not r['matched'] and r['py']):
        print(r)
json.dump(dict(counts=dict(c), rows=rows, extra=extra), open('../parity/match2.json', 'w'), indent=1)
