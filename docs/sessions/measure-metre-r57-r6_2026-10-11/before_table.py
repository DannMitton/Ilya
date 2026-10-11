"""The 17's "before" signature table: at each window (the 32 printed places and every other bar start), the metre
Ilya's reading writes there today, which is homr's <time> carried through the join. A window maps to the joined
bar its notes begin (w5map.first_bar). "Writes" means the joined bar carries a <time> element."""
import json, pickle
from collections import Counter, defaultdict
from w5 import Song
W = json.load(open('windows.json')); ALL = pickle.load(open('staves.pkl', 'rb')); LAB = json.load(open('labels.json'))
SONGS = ['tch', 'sun1', 'sun4', 'sun5', 'sun6', 'k01', 'k02', 'k03', 'k04', 'k06', 'k07', 'k08', 'k09', 'k10', 'gur', 'varl']


def lab(t):
    return None if t is None else '%d/%d' % t


rows = []; per = defaultdict(Counter)
for song in SONGS:
    S = Song(song, W, ALL, LAB)
    for w in S.wins:
        t = LAB.get(str(w['id']))
        b = S.fb.get(w['id'])
        wrote = lab(S.bars[b]['time']) if b is not None and S.bars[b]['wrote_time'] else None
        force = lab(S.bars[b]['time']) if b is not None else None
        courtesy = bool(t) and t.startswith('c') and t != 'cut'
        if courtesy: v = 'courtesy'
        elif t:
            v = 'unmapped' if b is None else ('written, same figure' if wrote == t else ('written, other figure' if wrote else 'not written'))
        else:
            v = 'unmapped' if b is None else ('nothing printed, nothing written' if not wrote else 'nothing printed, written')
        per[song][v] += 1
        rows.append(dict(song=song, id=w['id'], page=w['page'], kind=w['kind'], printed=t, bar=b, written=wrote, in_force=force, verdict=v))
json.dump(rows, open('../before/signatures.json', 'w'), indent=1)
tot = Counter()
for s in SONGS:
    tot.update(per[s]); print(s, dict(per[s]))
print('total', dict(tot))
for r in rows:
    if r['printed'] or r['verdict'] == 'nothing printed, written': print(r)

# by the metre in force at the mapped bar (homr writes 4/4 for a printed C: no symbol attribute in any reading)
from fractions import Fraction
def L(x): return Fraction(4) if x in ('C', 'cut') else Fraction(4 * int(x.split('/')[0]), int(x.split('/')[1]))
pl = [r for r in rows if r['printed'] and not r['verdict'] == 'courtesy']
fig = sum(1 for r in pl if r['in_force'] == r['printed']); ln = sum(1 for r in pl if r['in_force'] and L(r['in_force']) == L(r['printed']))
print('printed places', len(pl), 'in force by figure', fig, 'by length', ln, 'unmapped', sum(r['bar'] is None for r in pl))
json.dump(rows, open('../before/signatures.json', 'w'), indent=1)
