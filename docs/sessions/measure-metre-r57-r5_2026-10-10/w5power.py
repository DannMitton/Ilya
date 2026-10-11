"""Witness 5's measured power on real pages (brief r5 section 2.3).

At each of the 814 bar starts on the 17 songs, each wrong metre from round 4's rendered false list is proposed
in place of the metre in force there, and the bars from that bar start to the next printed signature (or the
song's end) are summed under the bar rule. Proposals of the same length as the metre in force are counted apart:
bar sums cannot reject them.
"""
import json, pickle, glob, os
from collections import Counter, defaultdict
from w5 import Song, accept, mlen
W = json.load(open('windows.json')); ALL = pickle.load(open('staves.pkl', 'rb')); LAB = json.load(open('labels.json'))
wrong = set()
for p in glob.glob('../r4/folds/final*.json') or glob.glob(os.path.expanduser('~/Desktop/ilya-rewrite/docs/sessions/measure-metre-r57-r4_2026-10-10/folds/final*.json')):
    for t, s in [(x[3], x[4]) for x in json.load(open(p))['rendered']['falses']]:
        wrong.add(s)
wrong = sorted(wrong)
SONGS = sorted({w['song'] for w in W if w['song'] not in ('sun2', 'sun3', 'grech')})
res = Counter(); per = defaultdict(Counter); nocount = 0; wins = 0; unmapped = 0
for song in SONGS:
    S = Song(song, W, ALL, LAB)
    printed_ids = [p[0] for p in S.printed]
    for w in S.wins:
        wins += 1
        m0 = S.metre_at_win.get(w['id'])
        if m0 is None or S.fb.get(w['id']) is None: unmapped += 1; continue
        sp = S.span(w['id'], [i for i in printed_ids if i != w['id']])
        for lab in wrong:
            if lab == m0: continue
            same = mlen(lab) == mlen(m0)
            ok, n = accept(S.bars, sp, mlen(lab))
            key = 'same length' if same else 'other length'
            res[(key, 'accepted' if ok else ('no countable bar' if n == 0 else 'rejected'))] += 1
            per[song][(key, 'accepted' if ok else 'rejected')] += 1
print('wrong metres proposed:', wrong)
print('bar starts', wins, 'without a mapped bar or metre', unmapped)
for k, v in sorted(res.items()): print(k, v)
json.dump(dict(wrong=wrong, windows=wins, unmapped=unmapped, res={' / '.join(k): v for k, v in res.items()},
               per={s: {' / '.join(k): v for k, v in c.items()} for s, c in per.items()}), open('../w5power.json', 'w'), indent=1)
