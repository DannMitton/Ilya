"""Row 81, step 4: each row's language, decided by the poem. A row is Russian where at least half of its countable words,
read by the model, equal a whole word of the poem after step 3's normalising. Countable: two or more letters after
normalising. A row with no countable word is other. The truth of each row is poem.txt (listed = Russian).
Writes calls-<variant>.json ({letter: {model: {row id: true/false}}}) for step 7, and prints the table.
Variants: brief (the brief's sewing and whole words), joint (a hyphen standing alone or leading also joins), and syll (CODE'S
VARIANT, not the brief's: the brief's sewing, matched against whole words OR whole printed syllables of the poem, never a part).
Usage: python3 step4.py [brief|joint|syll]"""
import json, sys
from common import *
V = sys.argv[1] if len(sys.argv) > 1 else 'brief'
P = poem()
allt = [w['text'] for L in 'STKM' for m in MODELS for r in ocr(L, m) for w in sew(r['words'], 'brief' if V == 'syll' else V)]
allt += [s for L in P for v in P[L].values() for s in v] + poem_words(P, 'S') + poem_words(P, 'T') + poem_words(P, 'K') + poem_words(P, 'M')
prime(allt)
calls = {}
print(f'variant {V}')
print('song model | Russian rows | called Russian | other rows | other called Russian | Russian missed')
for L in 'STKM':
    PW = {norm(w) for w in poem_words(P, L)}
    if V == 'syll': PW |= {norm(x) for v in P[L].values() for x in v}
    for m in MODELS:
        c = calls.setdefault(L, {}).setdefault(m, {})
        tp = fp = fn = 0; nr = no = 0; detail = []
        for r in ocr(L, m):
            k = rid(r); truth = k in P[L]
            toks = [norm(w['text']) for w in sew(r['words'], 'brief' if V == 'syll' else V)]
            cnt = [t for t in toks if len(t) >= 2]
            hit = [t for t in cnt if t in PW]
            rus = bool(cnt) and len(hit) >= len(cnt) / 2
            c[k] = rus
            nr += truth; no += not truth
            tp += truth and rus; fp += (not truth) and rus; fn += truth and not rus
            if truth != rus: detail.append(f"    {'MISSED' if truth else 'FALSE '} {k}: {len(hit)}/{len(cnt)} {' '.join(cnt)[:90]}")
        print(f'{L} {m} | {nr} | {tp} | {no} | {fp} | {fn}')
        for d in detail: print(d)
json.dump(calls, open(f'{HERE}/calls-{V}.json', 'w'), indent=0)
