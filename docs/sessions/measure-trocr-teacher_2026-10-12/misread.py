"""Row 88: misread syllables of the chunked form (t) that hold no pre-reform letter (no ѣ, і, ѳ, ѵ, and no word-final ъ),
with what was read, using step5.py's own alignment. Prints the count and the first ten in poem order.
Usage: python3 misread.py"""
import io, contextlib, json
with contextlib.redirect_stdout(io.StringIO()):
    import step5 as s
from common import ocr, rid
out = []; total = 0
import collections; kind = collections.Counter()
for L in 'STKM':
    R = {rid(r): r for r in ocr(L, 't')}
    for k, syls in s.P[L].items():
        S = [s.letters(x).lower() for x in syls]
        toks = [t for t in (s.letters(w['text']) for w in sorted(R[k]['words'], key=lambda w: w['bbox'][0])) if t]
        T = [t.lower() for t in toks]
        amap = {}
        for si, tj in s.align(S, T):
            for i in si: amap[i] = (si, tj)
        for i, syl in enumerate(S):
            old = any(c in syl for c in 'ѣіѳѵ') or (syl.endswith('ъ') and not syls[i].endswith('-'))
            si, tj = amap.get(i, ([i], []))
            right = len(si) == 1 and len(tj) == 1 and T[tj[0]] == syl
            if right or old: continue
            total += 1
            kind['one-to-one, wrong letters' if len(si) == 1 and len(tj) == 1 else ('no token' if not tj else 'shares a token with a neighbour')] += 1
            out.append(f"{L} {k}: printed «{syls[i]}», read «{''.join(toks[j] for j in tj) or '(nothing)'}»")
print('misread syllables with no pre-reform letter:', total, dict(kind))
for o in out[:10]: print('  ' + o)
