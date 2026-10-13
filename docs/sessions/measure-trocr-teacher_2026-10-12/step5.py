"""Row 81, step 5: the baseline for N.184. On every Russian row (poem.txt), for each model:
- syllables read right: the row's token, hyphen and punctuation removed, equals the printed syllable letter for letter,
  pre-reform letters included, case folded; and again after step 3's normalising (right in sound);
- every printed ѣ, і, ѳ, ѵ, and word-final ъ, with what the model read in its place.
Tokens are the model's word boxes in x order, stripped to letters; a token of no letters is dropped. Each printed syllable
is aligned to the tokens by a least-cost alignment (edit distance; a token may cover two syllables, or two tokens one
syllable, but only a one-to-one pair can count as right). Within an aligned pair the letter read in place of a pre-reform
letter comes from difflib's opcodes; an extra letter inserted right after it is shown with it ("ъЪ").
Usage: python3 step5.py  -> prints the tables; writes step5-letters.json"""
import json, difflib, collections
from common import *
P = poem()

def letters(t): return ''.join(c for c in t if c.isalpha())
def ed(a, b):
    d = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        p, d[0] = d[0], i
        for j, cb in enumerate(b, 1):
            p, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, p + (ca != cb))
    return d[len(b)]
def cost(a, b): return ed(a, b) / max(len(a), len(b), 1)

def align(S, T):
    """S printed syllables (lower), T tokens (lower). Returns list of (syllable indices, token indices)."""
    n, m = len(S), len(T); INF = 1e9
    D = [[INF] * (m + 1) for _ in range(n + 1)]; B = [[None] * (m + 1) for _ in range(n + 1)]; D[0][0] = 0
    for i in range(n + 1):
        for j in range(m + 1):
            if D[i][j] >= INF: continue
            steps = [((1, 0), 1.0), ((0, 1), 0.6)]
            for (di, dj), g in steps:
                if i + di <= n and j + dj <= m and D[i][j] + g < D[i + di][j + dj]: D[i + di][j + dj] = D[i][j] + g; B[i + di][j + dj] = (i, j)
            for di, dj in ((1, 1), (2, 1), (1, 2)):
                if i + di <= n and j + dj <= m:
                    c = cost(''.join(S[i:i + di]), ''.join(T[j:j + dj])) + 0.1 * (di + dj - 2)
                    if D[i][j] + c < D[i + di][j + dj]: D[i + di][j + dj] = D[i][j] + c; B[i + di][j + dj] = (i, j)
    out = []; i, j = n, m
    while (i, j) != (0, 0):
        pi, pj = B[i][j]; out.append((list(range(pi, i)), list(range(pj, j)))); i, j = pi, pj
    return out[::-1]

def prereform(syls):
    """(syllable index, char index, letter) for each ѣ і ѳ ѵ (either case), and each ъ ending a word."""
    out = []
    for k, s in enumerate(syls):
        t = letters(s)
        for c, ch in enumerate(t):
            if ch.lower() in 'ѣіѳѵ': out.append((k, c, ch.lower()))
        if t and t[-1].lower() == 'ъ' and not s.endswith('-'): out.append((k, len(t) - 1, 'ъ#'))
    return out

def read_at(s, t, c):
    if not t: return '(none)'
    ops = difflib.SequenceMatcher(None, s, t, autojunk=False).get_opcodes()
    for x, (tag, i1, i2, j1, j2) in enumerate(ops):
        if i1 <= c < i2:
            if tag == 'equal': r = t[j1 + c - i1]; end = j1 + c - i1 + 1
            elif tag == 'delete': r = '∅'; end = j1
            else:
                k = j1 + round((c - i1) * (j2 - j1) / max(1, i2 - i1)); r = t[k:k + 1] or '∅'; end = k + 1
            if c == i2 - 1 and x + 1 < len(ops) and ops[x + 1][0] == 'insert': r += t[ops[x + 1][3]:ops[x + 1][4]]
            return r
    return '∅'

prime([letters(w['text']) for L in 'STKM' for m in MODELS for r in ocr(L, m) for w in r['words']] + [s for L in P for v in P[L].values() for s in v])
tot = {}; lt = {}
for L in 'STKM':
    for m in MODELS:
        R = {rid(r): r for r in ocr(L, m)}
        for k, syls in P[L].items():
            S = [letters(s).lower() for s in syls]
            toks = [letters(w['text']) for w in sorted(R[k]['words'], key=lambda w: w['bbox'][0])]
            toks = [t for t in toks if t]
            T = [t.lower() for t in toks]
            A = align(S, T)
            amap = {}
            for si, tj in A:
                for i in si: amap[i] = (si, tj)
            t = tot.setdefault((L, m), collections.Counter())
            for i, s in enumerate(S):
                si, tj = amap.get(i, ([i], []))
                one = len(si) == 1 and len(tj) == 1
                t['printed'] += 1
                t['right'] += one and T[tj[0]] == s
                t['sound'] += one and norm(toks[tj[0]]) == norm(syls[i])
            for (i, c, ch) in prereform(syls):
                si, tj = amap.get(i, ([i], []))
                sc = ''.join(S[x] for x in si); off = sum(len(S[x]) for x in si if x < i)
                got = read_at(sc, ''.join(toks[x] for x in tj), off + c) if tj else '(missed)'
                lt.setdefault(ch, {}).setdefault(m, collections.Counter())[got] += 1
                lt[ch].setdefault('where', []).append(f'{L} {k} {syls[i]}') if m == 'a' else None
print('Syllables read right, per song and model (letter for letter / in sound after step 3\'s normalising), of the printed syllables')
# Row 88's one edit here: the header names every model in MODELS, with each TrOCR form's segmenter.
SEG = {'t-row': 'TrOCR, whole row', 't': 'TrOCR, ink-gap chunks', 't3': 'TrOCR, (c) word boxes', 't-imap': 'TrOCR chunks, Latin i mapped to і by Code'}
print('song | printed | ' + ' | '.join(f'({m}{": " + SEG[m] if m in SEG else ""}) letter | ({m}) sound' for m in MODELS))
for L in 'STKM':
    row = [tot[(L, m)] for m in MODELS]
    print(f"{L} | {row[0]['printed']} | " + ' | '.join(f"{c['right']} | {c['sound']}" for c in row))
s = {m: sum((tot[(L, m)] for L in 'STKM'), collections.Counter()) for m in MODELS}
print(f"all | {s['a']['printed']} | " + ' | '.join(f"{s[m]['right']} | {s[m]['sound']}" for m in MODELS))
print()
print('Pre-reform letters: what each model read in place of each printed one (∅ = nothing; (missed) = the syllable had no token)')
for ch in ('ѣ', 'і', 'ѳ', 'ѵ', 'ъ#'):
    if ch not in lt: print(f'{ch}: printed 0'); continue
    n = sum(lt[ch]['a'].values())
    print(f"{ch}: printed {n}")
    for m in MODELS:
        print(f"   ({m}) " + ', '.join(f'{k} {v}' for k, v in lt[ch][m].most_common()))
json.dump({ch: {m: dict(v) for m, v in d.items() if m != 'where'} | {'where': d['where']} for ch, d in lt.items()}, open(f'{HERE}/step5-letters.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
