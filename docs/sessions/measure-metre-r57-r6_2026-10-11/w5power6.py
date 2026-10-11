"""Row 57 r6 section 1.7: witness 5's power with the bounded span, on round 5's data.

As round 5's w5power.py: at each of the 814 bar starts on the 17 songs, each wrong metre from round 4's rendered
false list is proposed in place of the metre in force, and the bars it governs are summed. Here the bars are
read from the "before" drop-box reads (byte-compared with round 5's in the report), and two rules are counted:
round 5's (every countable bar to the next printed signature, at least one) and r6's bounded span (the first four
countable bars, at least two). Cut C is four quarters here (round 5's w5.py had two).

Then the 30 printed places: each is proposed with its own printed label over the span to the next printed
place, under both rules; round 5 named 7 right signatures its witness 5 rejected.
"""
import json, pickle, glob, os
from collections import Counter
from w5 import Song, accept, accept_b, mlen
W = json.load(open('windows.json')); ALL = pickle.load(open('staves.pkl', 'rb')); LAB = json.load(open('labels.json'))
wrong = set()
for p in glob.glob(os.path.expanduser('~/Desktop/ilya-rewrite/docs/sessions/measure-metre-r57-r4_2026-10-10/folds/final*.json')):
    for t, s in [(x[3], x[4]) for x in json.load(open(p))['rendered']['falses']]:
        wrong.add(s)
wrong = sorted(wrong)
SONGS = sorted({w['song'] for w in W if w['song'] not in ('sun2', 'sun3', 'grech')})
res = Counter(); wins = 0; unmapped = 0; places = []
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
            key = 'same length' if mlen(lab) == mlen(m0) else 'other length'
            for rule, f in (('r5 rule', accept), ('bounded', accept_b)):
                ok, n = f(S.bars, sp, mlen(lab))
                res[(rule, key, 'accepted' if ok else ('too few countable bars' if n < (1 if rule == 'r5 rule' else 2) else 'rejected'))] += 1
    for wid, b0, lab in S.printed:
        sp = S.span(wid, [i for i in printed_ids if i != wid])
        a5, n5 = accept(S.bars, sp, mlen(lab)); ab, nb = accept_b(S.bars, sp, mlen(lab))
        w = next(x for x in S.wins if x['id'] == wid)
        places.append(dict(song=song, window=wid, page=w['page'], label=lab, bar=b0, r5=a5, r5_countable=n5, bounded=ab, bounded_countable=nb))
print('wrong metres proposed:', wrong)
print('bar starts', wins, 'without a mapped bar or metre', unmapped)
for k, v in sorted(res.items()): print(k, v)
print('printed places accepted: r5 rule', sum(p['r5'] for p in places), 'bounded', sum(p['bounded'] for p in places), 'of', len(places))
for p in places:
    if p['r5'] != p['bounded'] or not p['bounded']: print(p)
json.dump(dict(wrong=wrong, windows=wins, unmapped=unmapped, res={' / '.join(k): v for k, v in res.items()}, places=places),
          open('../run1/w5power6.json', 'w'), indent=1)
