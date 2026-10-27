"""N.135 stage 2a: cross-check seatTokens (steps 1 to 4) against the stage 1 harness's score44.py rule1, rule3, and seat (copied here), on 1500 seeded random rows. Rule 3 with more tokens than notes is checked against a brute-force least total distance instead, because the desk amendment of 2026-10-27 replaced the harness's fallback to nearest.
Usage: python3 xcheck_seat_gen.py <out.json>; then node xcheck_seat.mjs <out.json>. `xcheck.sh` runs both."""
import json, random, collections
random.seed(44)
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
def free_of(tie): return [j for j in range(len(tie)) if not tie[j]]
def seat_free(rule, T, X, bars, tie):
    """The harness's three rules on the notes that sing a syllable only (step1c.py, cands='free'), with rule 2's bar grouping taken from the nearest of ALL notes, as seatTokens does. None where no note sings."""
    F = free_of(tie)
    if not F: return None
    XF = [X[j] for j in F]; r1f = {i: F[min(range(len(F)), key=lambda q: abs(T[i]['cx'] - XF[q]))] for i in range(len(T))}
    if rule == 1: return r1f
    if rule == 3:
        a = rule3(T, F, XF)
        return {i: F[q] for i, q in a.items()} if a is not None else None
    a_all = rule1(T, list(range(len(X))), X); a = dict(r1f); byb = collections.defaultdict(list)
    for i, j in a_all.items(): byb[bars[j]].append(i)
    for b, ti in byb.items():
        ti.sort(key=lambda i: T[i]['cx']); sung = sorted([j for j in F if bars[j] == b], key=lambda j: X[j])
        if len(ti) == len(sung):
            for i, j in zip(ti, sung): a[i] = j
    return a
import itertools
def best_cost(cxs, XS):
    return min(sum(abs(cxs[i] - XS[j]) for j, i in enumerate(c)) for c in itertools.combinations(range(len(cxs)), len(XS))) if len(cxs) <= 12 else None
cases = []
for _ in range(1500):
    m = random.randint(1, 14); X = sorted(random.sample(range(0, 1400, 1), m)) if random.random() < .8 else sorted(random.choices(range(0, 400, 10), k=m))
    bars = []; b = 1
    for _ in X:
        if random.random() < .25: b += 1
        bars.append(b)
    tie = [random.random() < .15 for _ in X]
    n = random.randint(0, m + 2); cxs = sorted(random.randint(-30, X[-1] + 60) for _ in range(n))
    T = [dict(cx=c) for c in cxs]; N = list(range(m)); plain = {}; free = {}; none = [False] * m
    for r in (1, 2, 3):
        if n == 0: plain[r] = free[r] = []; continue
        # plain: no flag is passed, so every note sings: the harness unchanged (rule 3 with more tokens than notes: the brute force, as in step 3)
        if r == 3 and n > m: plain[r] = dict(surplus=True, cost=best_cost(cxs, X), seated=m)
        else:
            a, _ = seat(r, T, N, X, bars, none); plain[r] = [a[i] for i in range(n)]
        F = free_of(tie)
        if r == 3 and F and n > len(F): free[r] = dict(surplus=True, cost=best_cost(cxs, [X[j] for j in F]), seated=len(F))
        else:
            a = seat_free(r, T, X, bars, tie); free[r] = [None] * n if a is None else [a.get(i) for i in range(n)]
    cases.append(dict(X=X, bars=bars, tie=tie, cx=cxs, plain=plain, free=free))
import sys; json.dump(cases, open(sys.argv[1], 'w')); print(len(cases), 'rows')
