"""N.135 stage 2a: cross-check cutRows against the stage 1 harness's own R1 (rowsys.py) and R2 (rowsys2.py `split`) code, copied here, on 400 seeded random bands.
Usage: python3 xcheck_rows_gen.py <out.json>; then node xcheck_rows.mjs <out.json>. `xcheck.sh` runs both."""
import json, random, numpy as np
random.seed(135)
def split(prof, y0, y1, sp, depth=0):  # verbatim from rowsys2.py
    h = y1 - y0 + 1
    if h <= 1.6 * sp or depth >= 3: return [(y0, y1)]
    k = np.ones(max(3, int(0.08 * sp)) | 1) / max(3, int(0.08 * sp) | 1); sm = np.convolve(prof[y0:y1 + 1], k, mode='same')
    lo = int(0.7 * sp); hi = h - int(0.7 * sp)
    if hi <= lo: return [(y0, y1)]
    v = lo + int(np.argmin(sm[lo:hi])); left = sm[:v].max() if v else 0; right = sm[v:].max()
    if sm[v] < 0.45 * min(left, right):
        return split(prof, y0, y0 + v, sp, depth + 1) + split(prof, y0 + v + 1, y1, sp, depth + 1)
    return [(y0, y1)]
SPLIT_RUNS = [0]
def harness(a, sp, paper):
    H, W = a.shape; ink = paper - 60
    prof = (a < ink).sum(axis=1); on = [bool(prof[y] > 0.02 * W) for y in range(H)]
    runs = []
    for y, v in enumerate(on):
        if not v: continue
        if runs and y - runs[-1][1] - 1 < 0.3 * sp: runs[-1][1] = y
        elif runs and runs[-1][1] == y - 1: runs[-1][1] = y
        else: runs.append([y, y])
    out = []
    for r0, r1 in [r for r in runs if r[1] - r[0] + 1 >= 0.4 * sp]:
        pr = np.zeros(H, dtype=int); pr[r0:r1 + 1] = prof[r0:r1 + 1]
        pieces = split(pr, r0, r1, sp); SPLIT_RUNS[0] += len(pieces) > 1
        pieces = [(p, q) for p, q in pieces if (pr[p:q + 1] > 0.02 * W).any()]
        for p, q in pieces:
            onx = np.where(pr[p:q + 1] > 0.02 * W)[0]; c0, c1 = p + int(onx[0]), p + int(onx[-1])
            out.append(dict(y0=max(0, int(c0 - 0.3 * sp)), y1=min(H, int(c1 + 1 + 0.3 * sp)), core=[c0, c1]))
    return out
bands = []
for n in range(400):
    W = random.choice([400, 700, 1000, 1500]); H = random.randint(80, 320); sp = random.choice([18, 24, 28.5, 30, 33.3, 40]); paper = random.choice([200, 235, 250])
    a = np.full((H, W), paper, dtype=np.uint8)
    for _ in range(random.randint(0, 7)):
        y0 = random.randint(0, H - 2); y1 = min(H - 1, y0 + random.randint(0, int(2.2 * sp))); x0 = random.randint(0, W - 2); x1 = min(W, x0 + random.randint(1, W))
        a[y0:y1 + 1, x0:x1] = random.choice([10, 60, 100, paper - 61, paper - 60, paper - 59, paper - 30])
    bands.append(dict(W=W, H=H, sp=sp, paper=paper, data=a.flatten().tolist(), want=harness(a, sp, paper)))
import sys; json.dump(bands, open(sys.argv[1], 'w'))
print(len(bands), 'bands;', sum(len(b['want']) for b in bands), 'rows in the harness output;', sum(1 for b in bands if len(b['want']) > 1), 'bands with 2+ rows;', SPLIT_RUNS[0], 'R1 runs split by R2')
