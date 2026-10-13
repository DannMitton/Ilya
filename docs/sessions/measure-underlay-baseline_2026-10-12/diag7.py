"""Row 81, step 7 diagnostic: for the Russian (song) notes the column test drops under the syll calls, how many carry no
syllable of their own in the truth (a melisma's later notes, a tie's second note), so no Russian word stands in their column.
Usage: python3 diag7.py"""
import json
from common import *
calls = json.load(open(f'{HERE}/calls-syll.json'))
for L in 'ST':
    ns = [n for n in (json.loads(l) for l in open(f'{R80}/{L}.notes.jsonl')) if not n['chord']]
    st = json.load(open(f'{R80}/{L}.status.json'))
    systems = [json.loads(l) for l in open(f'{R80}/{L}.systems.jsonl')]; rws = rows(L)
    for m in MODELS:
        O = {rid(r): r for r in ocr(L, m)}; nos = sy = 0
        for n, s in zip(ns, st):
            if s['status'] != 'song': continue
            b = next((b for b in systems if b['page'] == n['page'] and b['bars'][0] <= n['bar'] <= b['bars'][1] and 'y0' in b), None)
            rus = oth = False
            for r in rws:
                if not b or (r['page'], r['system']) != (b['page'], b['system']): continue
                for w in O[rid(r)]['words']:
                    if any(c.isalpha() for c in w['text']) and w['conf'] >= 30 and w['bbox'][0] <= n['x'] + 30 and w['bbox'][2] >= n['x'] - 30:
                        if calls[L][m][rid(r)]: rus = True
                        else: oth = True
            if oth and not rus:
                if (s['syllable'] or '_') == '_': nos += 1
                else: sy += 1
        print(f'{L} ({m}): Russian notes dropped by the column, no syllable of their own {nos}, with a syllable {sy}')
