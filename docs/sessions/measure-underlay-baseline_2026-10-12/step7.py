"""Row 81, step 7: the whole test. For each model and each set of row calls from step 4:
1. a note is dropped where its column (imgpos x +-30 px, row 80's form B) holds a word from a row called other and no word
   from a row called Russian. Words: the model's word boxes in the rows of the note's system's band, with a letter and
   confidence 30 or more, as row 80's step3.py took them;
2. then, among the notes left, each pair of step 6 (one bar, one page, one pitch, x within 30 px, chords excluded) loses its
   shorter note (the longer rule, step 6's best); a pair of one length keeps both.
Statuses are the unchanged scorer's (row 80's status.json). Usage: python3 step7.py <brief|joint|syll>"""
import json, sys
from fractions import Fraction as F
from common import *
V = sys.argv[1]
calls = json.load(open(f'{HERE}/calls-{V}.json'))
# durations from step 6's parse of the MusicXML (its source run here, so step 6's crops and pages are not made), matched to row 80's notes in order
src = open(f'{HERE}/step6.py').read(); parse_src = src[src.index('def parse(L):'):src.index('def head_width')]
g = {'re': __import__('re'), 'F': F, 'RD': f'{HERE}/../measure-set3-four-below_2026-10-11/after/drops', 'STEP': {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}}
exec(parse_src, g); parse = g['parse']
print(f'row calls: step 4 variant {V}')
print('song model | Russian notes kept | Russian notes dropped | extra notes kept | extra notes dropped || after the column only: Russian dropped, extras dropped')
for L in 'STKM':
    ns = [json.loads(l) for l in open(f'{R80}/{L}.notes.jsonl')]
    xml, _ = parse(L); placed = [e for e in xml if e['pos'] and not e['rest']]
    for e, n in zip(placed, ns): n['dur'] = e['dur']
    nc = [n for n in ns if not n['chord']]; st = json.load(open(f'{R80}/{L}.status.json'))
    for n, s in zip(nc, st): n['status'] = s['status']
    systems = [json.loads(l) for l in open(f'{R80}/{L}.systems.jsonl')]
    rws = rows(L)
    for m in MODELS:
        O = {rid(r): r for r in ocr(L, m)}
        keep = {}
        for i, n in enumerate(nc):
            b = next((b for b in systems if b['page'] == n['page'] and b['bars'][0] <= n['bar'] <= b['bars'][1] and 'y0' in b), None)
            rus = oth = False
            if b:
                for r in rws:
                    if (r['page'], r['system']) != (b['page'], b['system']): continue
                    k = rid(r); called = calls[L][m][k]
                    for w in O[k]['words']:
                        if not any(c.isalpha() for c in w['text']) or w['conf'] < 30: continue
                        if w['bbox'][0] <= n['x'] + 30 and w['bbox'][2] >= n['x'] - 30:
                            if called: rus = True
                            else: oth = True
            keep[i] = not (oth and not rus)
        col = dict(keep)
        left = [i for i in range(len(nc)) if keep[i]]
        for x, i in enumerate(left):
            for j in left[x + 1:]:
                a, c = nc[i], nc[j]
                if a['bar'] == c['bar'] and a['page'] == c['page'] and a['midi'] == c['midi'] and abs(a['x'] - c['x']) <= 30 and a['dur'] != c['dur'] and keep[i] and keep[j]:
                    keep[i if a['dur'] < c['dur'] else j] = False
        def cnt(d, s, k): return sum(1 for i, n in enumerate(nc) if n['status'] == s and d[i] == k)
        print(f"{L} {m} | {cnt(keep, 'song', True)} | {cnt(keep, 'song', False)} | {cnt(keep, 'extra', True)} | {cnt(keep, 'extra', False)} || {cnt(col, 'song', False)}, {cnt(col, 'extra', False)}")
