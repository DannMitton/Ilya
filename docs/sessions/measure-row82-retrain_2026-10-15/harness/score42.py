"""N.135 stage 1, 4.2: syllables read right, per song and reader. Row 81's step5.py, logic unchanged (align, cost, prereform, read_at), over this folder's songs.
A printed syllable is right where it aligns one-to-one with a token and the token's letters (hyphen and punctuation out, case folded) equal it (letter), or equal it after
modernisePreReform (sound). The printed syllables are the transcription of common2.transcription (truth syllables on the labelled Russian row; S, T, K, M: row 81's poem.txt).
Usage: RULE=R1|R2 python3 score42.py -> score42-<RULE>.txt, score42-<RULE>.json"""
import json, collections, difflib, sys
from common2 import *

def ed(a, b):
    d = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        p, d[0] = d[0], i
        for j, cb in enumerate(b, 1):
            p, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, p + (ca != cb))
    return d[len(b)]
def cost(a, b): return ed(a, b) / max(len(a), len(b), 1)
def align_syl(S, T):
    n, m = len(S), len(T); INF = 1e9
    Dm = [[INF] * (m + 1) for _ in range(n + 1)]; B = [[None] * (m + 1) for _ in range(n + 1)]; Dm[0][0] = 0
    for i in range(n + 1):
        for j in range(m + 1):
            if Dm[i][j] >= INF: continue
            for (di, dj), g in (((1, 0), 1.0), ((0, 1), 0.6)):
                if i + di <= n and j + dj <= m and Dm[i][j] + g < Dm[i + di][j + dj]: Dm[i + di][j + dj] = Dm[i][j] + g; B[i + di][j + dj] = (i, j)
            for di, dj in ((1, 1), (2, 1), (1, 2)):
                if i + di <= n and j + dj <= m:
                    c = cost(''.join(S[i:i + di]), ''.join(T[j:j + dj])) + 0.1 * (di + dj - 2)
                    if Dm[i][j] + c < Dm[i + di][j + dj]: Dm[i + di][j + dj] = Dm[i][j] + c; B[i + di][j + dj] = (i, j)
    out = []; i, j = n, m
    while (i, j) != (0, 0):
        pi, pj = B[i][j]; out.append((list(range(pi, i)), list(range(pj, j)))); i, j = pi, pj
    return out[::-1]
def prereform(syls):
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
            if tag == 'equal': r = t[j1 + c - i1]
            elif tag == 'delete': r = '∅'
            else:
                k = j1 + round((c - i1) * (j2 - j1) / max(1, i2 - i1)); r = t[k:k + 1] or '∅'
            if c == i2 - 1 and x + 1 < len(ops) and ops[x + 1][0] == 'insert': r += t[ops[x + 1][3]:ops[x + 1][4]]
            return r
    return '∅'

if __name__ == '__main__':
    Ps = {L: transcription(L) for L in SONGS}; readers = [m for m in READERS if all(os.path.exists(f'{HERE}/ocr{D}/{L}-{m}.json') for L in SONGS)]
    prime([letters(p) for L in SONGS for m in readers for r in ocr(L, m) for w in r['words'] for p in [w['text']] + split_internal(w['text'])] + [s for L in SONGS for v in Ps[L].values() for s in v])
    SPLIT = os.environ.get('SPLIT', '0') == '1'; TAG = RULE + ('-split' if SPLIT else '')
    tot = {}; lt = {}; pre = {}
    for L in SONGS:
        for m in readers:
            R = {rid(r): r for r in ocr(L, m)}
            for k, syls in Ps[L].items():
                S = [letters(s).lower() for s in syls]; ws = sorted(R[k]['words'], key=lambda w: w['bbox'][0])
                if SPLIT: ws = [dict(text=p) for w in ws for p in split_internal(w['text'])]
                toks = [letters(w['text']) for w in ws]
                toks = [t for t in toks if t]; T = [t.lower() for t in toks]; A = align_syl(S, T); amap = {}
                for si, tj in A:
                    for i in si: amap[i] = (si, tj)
                t = tot.setdefault((L, m), collections.Counter())
                for i, s in enumerate(S):
                    si, tj = amap.get(i, ([i], [])); one = len(si) == 1 and len(tj) == 1
                    t['printed'] += 1; t['right'] += one and T[tj[0]] == s; t['sound'] += one and norm(toks[tj[0]]) == norm(syls[i]); t['yo'] += 'ё' in syls[i].lower(); t['covered'] += len(si) >= 2 and len(tj) == 1 and i == si[0]
                for (i, c, ch) in prereform(syls):
                    si, tj = amap.get(i, ([i], [])); sc = ''.join(S[x] for x in si); off = sum(len(S[x]) for x in si if x < i)
                    got = read_at(sc, ''.join(toks[x] for x in tj), off + c) if tj else '(missed)'
                    lt.setdefault(ch, {}).setdefault(m, collections.Counter())[got] += 1
                    pre.setdefault((L, ch), 0); pre[(L, ch)] += (m == readers[0])
    lines = [f'RULE {RULE}, tokens {"split at an internal non-letter" if SPLIT else "as the reader gave them (row 81\'s)"}. Syllables read right, per song and reader (letter for letter / in sound after modernisePreReform), of the printed syllables of the transcription (truth syllables; S, T, K, M row 81 poem.txt)',
             'song | printed | ' + ' | '.join(f'({m}) letter | ({m}) sound' for m in readers)]
    for L in SONGS:
        row = [tot[(L, m)] for m in readers]; lines.append(f"{L} | {row[0]['printed']} | " + ' | '.join(f"{c['right']} | {c['sound']}" for c in row))
    groups = [('U1-6 (pre-reform, with German)', [s for s in SONGS if s[0] == 'U']), ('P (pre-reform)', ['P']), ('B (modern)', [s for s in SONGS if s[0] == 'B']), ('S,T,K,M', list(FOUR)), ('all', SONGS)]
    for g, ls in groups:
        s = {m: sum((tot[(L, m)] for L in ls), collections.Counter()) for m in readers}; lines.append(f"{g} | {s[readers[0]]['printed']} | " + ' | '.join(f"{s[m]['right']} | {s[m]['sound']}" for m in readers))
    lines += ['', 'Pre-reform letters, all songs: what each reader read in place of each printed one (the printed letter counted in the transcription as typed; the truth of U, P, B is Dann\'s engraving, which may be modern where the print is not)']
    for ch in ('ѣ', 'і', 'ѳ', 'ѵ', 'ъ#'):
        if ch not in lt: lines.append(f'{ch}: printed 0'); continue
        lines.append(f"{ch}: in the transcription {sum(lt[ch][readers[0]].values())}")
        for m in readers: lines.append(f"   ({m}) " + ', '.join(f'{k} {v}' for k, v in lt[ch][m].most_common(12)))
    lines += ['', 'Printed syllables with ё in the transcription (the print has none where checked; counts right in sound, not in letter), and tokens covering two or more printed syllables, per song and reader']
    for L in SONGS: lines.append(f"{L}: ё {tot[(L, readers[0])]['yo']}; covered " + ' '.join(f"({m}) {tot[(L, m)]['covered']}" for m in readers))
    lines += ['', 'Pre-reform letters in each song\'s transcription (ѣ і ѳ ѵ, and word-final ъ): the spelling of the truth, per song']
    for L in SONGS: lines.append(f"{L}: " + ' '.join(f"{ch}={pre.get((L, ch), 0)}" for ch in ('ѣ', 'і', 'ѳ', 'ѵ', 'ъ#')))
    open(f'{HERE}/score42-{TAG}.txt', 'w', encoding='utf8').write('\n'.join(lines) + '\n')
    json.dump({f'{L}|{m}': dict(c) for (L, m), c in tot.items()}, open(f'{HERE}/score42-{TAG}.json', 'w'))
    print('\n'.join(lines))
