"""N.135 stage 2a: cross-check seatTokens against the stage 1 harness's score44.py rule1, rule3, and seat (copied here), on 1500 seeded random rows. Rule 3 with more tokens than notes is checked against a brute-force least total distance instead, because the desk amendment of 2026-10-27 replaced the harness's fallback to nearest.
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
cases = []
for _ in range(1500):
    m = random.randint(1, 14); X = sorted(random.sample(range(0, 1400, 1), m)) if random.random() < .8 else sorted(random.choices(range(0, 400, 10), k=m))
    bars = []; b = 1
    for _ in X:
        if random.random() < .25: b += 1
        bars.append(b)
    tie = [random.random() < .15 for _ in X]
    n = random.randint(0, m + 2); cxs = sorted(random.randint(-30, X[-1] + 60) for _ in range(n))
    T = [dict(cx=c) for c in cxs]; N = list(range(m)); want = {}
    for r in (1, 2, 3):
        if n == 0: want[r] = []; continue
        if r == 3 and n > m:
            # Superseded by the desk amendment of 2026-10-27: every note takes one token, in order, at least total distance; the rest are unseated. Brute force.
            import itertools
            best = min(sum(abs(cxs[i] - X[j]) for j, i in enumerate(c)) for c in itertools.combinations(range(n), m)) if n <= 12 else None
            want[r] = dict(surplus=True, cost=best); continue
        a, _ = seat(r, T, N, X, bars, tie); want[r] = [a[i] for i in range(n)]
    cases.append(dict(X=X, bars=bars, tie=tie, cx=cxs, want=want))
import sys; json.dump(cases, open(sys.argv[1], 'w')); print(len(cases), 'rows')
