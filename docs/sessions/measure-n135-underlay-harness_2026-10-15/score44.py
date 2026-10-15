"""N.135 stage 1, 4.4: each syllable under its note. For each Russian row (label.py) and reader, each token (a token with a letter; hyphen tokens and marks dropped) is seated on a note of the
row's system by three rules, and the seats are scored against the truth:
 1 nearest: the token's box centre to the nearest imgpos x among the system's notes;
 2 order: the tokens of a bar (a token goes to the bar of its nearest note), where their number equals the bar's notes that are not tied into (tie stop; the printed extender is not observable here),
   are paired with those notes in x order; otherwise rule 1 for that bar's tokens;
 3 monotone: one least-cost alignment per system, each token to one note, order kept, cost the x distance, a note may take no token; where tokens outnumber notes, rule 1 for that system.
A truth syllable-bearing note that the scorer matched to a read note counts right where the tokens seated on that note, joined, equal the truth syllable (letters, case folded: 'letter';
after modernisePreReform: 'sound'). Truth syllables whose note homr did not read are counted apart. Tokens seated on a note that has no truth syllable are counted (the 'a syllable one note early' error).
Usage: RULE=R1|R2 python3 score44.py -> score44-<RULE>.txt"""
import json, collections, statistics, bisect
from common2 import *
from score42 import align_syl
SEAT = [L for L in SONGS if L not in 'KM']  # K and M have no syllable truth
Ps = {}
readers = [m for m in READERS if all(os.path.exists(f'{HERE}/ocr{D}/{L}-{m}.json') for L in SONGS)]
def nz(t):
    t = letters(t)
    try: return norm(t)
    except KeyError: prime([t]); return norm(t)
def has_letter(t): return any(c.isalpha() for c in t)
def tokens_of(row):
    """The seating tokens of a row: its word boxes in x order; a word holding a non-letter between letters (a hyphen, or the period or dash read where the print has a short underscore) is split there (MINE: (a) and (c) join «су-е» in one word; (t-imap)'s tokens are already split),
    its box shared among the parts by their letters; a part with no letter is dropped."""
    out = []
    for w in sorted(row['words'], key=lambda w: w['bbox'][0]):
        parts = [p for p in split_internal(w['text']) if has_letter(p)]
        if not parts: continue
        x0, x1 = w['bbox'][0], w['bbox'][2]; tot = sum(len(letters(p)) for p in parts); x = x0
        for p in parts:
            wd = (x1 - x0) * len(letters(p)) / tot; out.append(dict(text=p, cx=x + wd / 2)); x += wd
    return out
def rule1(T, N, X): return {i: min(range(len(N)), key=lambda j: abs(T[i]['cx'] - X[j])) for i in range(len(T))}
def rule3(T, N, X):
    n, m = len(T), len(N)
    if n > m or n == 0: return None
    INF = 1e18; dp = [[INF] * (m + 1) for _ in range(n + 1)]; dp[0] = [0] * (m + 1); bk = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            take = dp[i - 1][j - 1] + abs(T[i - 1]['cx'] - X[j - 1]); skip = dp[i][j - 1]
            if take <= skip: dp[i][j] = take; bk[i][j] = 1
            else: dp[i][j] = skip
    out = {}; i, j = n, m
    while i > 0:
        if bk[i][j]: out[i - 1] = j - 1; i -= 1; j -= 1
        else: j -= 1
    return out
def seat(rule, T, N, X, bars, tiestop):
    a1 = rule1(T, N, X)
    if rule == 1: return a1, 0
    if rule == 3:
        a = rule3(T, N, X); return (a, 0) if a is not None else (a1, 1)
    a = dict(a1); byb = collections.defaultdict(list)
    for i, j in a1.items(): byb[bars[j]].append(i)
    fb = 0
    for b, ti in byb.items():
        ti.sort(key=lambda i: T[i]['cx']); sung = sorted([j for j in range(len(N)) if bars[j] == b and not tiestop[j]], key=lambda j: X[j])
        if sung and len(ti) == len(sung):
            for i, j in zip(ti, sung): a[i] = j
        else: fb += 1
    return a, fb
def systems_of(L):
    ev = events(L); ns = note_systems(L); by = collections.defaultdict(list)
    for i, k in ns.items(): by[k].append(i)
    return ev, by
def run(L, m):
    ev, by = systems_of(L); al = align(L); t2r = {t: r for r, t in al['match']}; r2t = {r: t for t, r in t2r.items()}
    lab = labels(L)['rows']; R = rows(L); O = {rid(r): r for r in ocr(L, m)}
    rusrow = {(r['page'], r['system']): rid(r) for r in R if lab[rid(r)] == 'russian'}
    res = {}; TB = truth_by_system(L)
    for rule in (1, 2, 3):
        seats = collections.defaultdict(list); fbs = 0; ntok = 0; cond = [0, 0]
        for key, idx in by.items():
            idx = sorted(idx, key=lambda i: ev[i]['x'])
            if key not in rusrow: continue
            T = tokens_of(O[rusrow[key]])
            if not T: continue
            X = [ev[i]['x'] for i in idx]; a, fb = seat(rule, T, idx, X, [ev[i]['bar'] for i in idx], [ev[i]['tieStop'] for i in idx]); fbs += fb; ntok += len(T)
            # seating given the token is right: tokens that align one to one with a printed syllable of the system and read it right (sound) are checked for the note of that syllable
            sy = TB.get(key, []); S = [letters(p).lower() for _, p in sy]; Tt = [letters(t['text']).lower() for t in T]
            if S and Tt:
                for si, tj in align_syl(S, Tt):
                    if len(si) == 1 and len(tj) == 1 and nz(T[tj[0]]['text']) == nz(sy[si[0]][1]):
                        want = t2r.get(sy[si[0]][0])
                        if want is not None: cond[1] += 1; cond[0] += idx[a[tj[0]]] == want
            for ti, j in a.items(): seats[idx[j]].append((T[ti]['text'], T[ti]['cx'] - X[j]))
        res[rule] = dict(seats=seats, fallbacks=fbs, ntok=ntok, cond=cond)
    return res, ev, al, t2r, r2t
if __name__ == '__main__':
    allres = {}; strings = set()
    for L in SEAT:
        for m in readers:
            res, ev, al, t2r, r2t = run(L, m); allres[(L, m)] = (res, al, t2r, r2t)
            for rule in res.values():
                for toks in rule['seats'].values(): strings.add(''.join(letters(t) for t, _ in toks))
            for t in al['truth']:
                if t['syl']: strings.add(letters(t['syl']))
    prime(sorted(strings))
    lines = [f'RULE {RULE}. Seating: syllables right under the right note (sound after modernisePreReform / letter for letter), of the truth notes that carry a syllable and that homr read; the truth syllables whose note homr did not read, apart.',
             'song | truth syllables | notes homr did not read | reader | rule | right sound | right letter | of read | % of all truth syllables (sound) | tokens | tokens on a note with no truth syllable | system fallbacks']
    tot = collections.defaultdict(collections.Counter); offs = collections.defaultdict(list); jj = {}
    for L in SEAT:
        for m in readers:
            res, al, t2r, r2t = allres[(L, m)]; sylnotes = [t for t in al['truth'] if t['type'] == 'note' and t['syl']]
            unread = sum(1 for t in sylnotes if t['i'] not in t2r)
            for rule in (1, 2, 3):
                seats = res[rule]['seats']; rs = rl = nread = 0; nos = 0
                for t in sylnotes:
                    r = t2r.get(t['i'])
                    if r is None: continue
                    nread += 1; toks = seats.get(r, []); s = ''.join(letters(x) for x, _ in toks)
                    rl += s.lower() == letters(t['syl']).lower(); ok = bool(toks) and norm(s) == norm(letters(t['syl'])); rs += ok
                    if ok and rule == 3: offs[(L, m)] += [d for _, d in toks]
                for r, toks in seats.items():
                    t = r2t.get(r)
                    if t is None or not al['truth'][t]['syl']: nos += len(toks)
                jj[f'{L}|{m}|{rule}'] = dict(sound=rs, letter=rl, syl=len(sylnotes), unread=unread, nread=nread, tokens=res[rule]['ntok'], nos=nos, fb=res[rule]['fallbacks'], cond_right=res[rule]['cond'][0], cond_n=res[rule]['cond'][1])
                lines.append(f"{L} | {len(sylnotes)} | {unread} | ({m}) | {rule} | {rs} | {rl} | {nread} | {100 * rs / len(sylnotes):.0f} | {res[rule]['ntok']} | {nos} | {res[rule]['fallbacks']}")
                c = tot[(m, rule)]; c['syl'] += len(sylnotes); c['unread'] += unread; c['rs'] += rs; c['rl'] += rl; c['nread'] += nread; c['tok'] += res[rule]['ntok']; c['nos'] += nos
                g = tot[(m, rule, L[0] if L[0] in 'UB' else ('P' if L == 'P' else 'ST'))]; g['syl'] += len(sylnotes); g['rs'] += rs; g['nread'] += nread
    lines += ['', 'By group (right sound / truth syllables of the group; the 9 of 10 line is 90%)']
    for m in readers:
        for rule in (1, 2, 3):
            lines.append(f'({m}) rule {rule}: ' + ' | '.join(f"{gn} {tot[(m, rule, gk)]['rs']}/{tot[(m, rule, gk)]['syl']} = {100 * tot[(m, rule, gk)]['rs'] / max(1, tot[(m, rule, gk)]['syl']):.0f}%" for gn, gk in (('U1-6', 'U'), ('P', 'P'), ('B', 'B'), ('S,T', 'ST'))) +
                         f" | all {tot[(m, rule)]['rs']}/{tot[(m, rule)]['syl']} = {100 * tot[(m, rule)]['rs'] / tot[(m, rule)]['syl']:.0f}% | tokens {tot[(m, rule)]['tok']}, on a note with no truth syllable {tot[(m, rule)]['nos']}")
    lines += ['', 'Seating given the token is right: of the tokens that read a printed syllable right (one to one, in sound) on a note homr read, the share seated on that syllable\'s own note']
    for m in readers:
        for rule in (1, 2, 3):
            c = sum(jj[f'{L}|{m}|{rule}']['cond_right'] for L in SEAT); n = sum(jj[f'{L}|{m}|{rule}']['cond_n'] for L in SEAT)
            g = {gn: (sum(jj[f'{L}|{m}|{rule}']['cond_right'] for L in SEAT if L[0] == gk), sum(jj[f'{L}|{m}|{rule}']['cond_n'] for L in SEAT if L[0] == gk)) for gn, gk in (('U', 'U'), ('B', 'B'), ('P', 'P'))}
            lines.append(f"({m}) rule {rule}: {c}/{n} = {100 * c / max(1, n):.0f}% | " + ' | '.join(f"{gn} {a}/{b} = {100 * a / max(1, b):.0f}%" for gn, (a, b) in g.items()))
    lines += ['', 'Offset of a right token\'s box centre from its note\'s imgpos x (rule 3, right seats), px: median [first, third quartile], n']
    for (L, m), v in sorted(offs.items()):
        if len(v) >= 4: q = statistics.quantiles(v, n=4); lines.append(f'{L} ({m}): {statistics.median(v):.0f} [{q[0]:.0f}, {q[2]:.0f}] n={len(v)}')
    open(f'{HERE}/score44-{RULE}.txt', 'w', encoding='utf8').write('\n'.join(lines) + '\n'); print('\n'.join(lines[-40:]))
    json.dump(jj, open(f'{HERE}/score44-{RULE}.json', 'w'))
    import pickle; pickle.dump({k: (v[0], v[1], v[2]) for k, v in allres.items()}, open(f'{WORK}/seat44-{RULE}.pkl', 'wb'))
