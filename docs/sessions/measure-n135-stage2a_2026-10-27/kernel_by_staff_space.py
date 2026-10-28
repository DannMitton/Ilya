"""N.135 stage 2a step 4: the closing kernel closingKernel(staffSpace) would take on the stage 1 harness's own systems.
Reads the `space` of every system in ../measure-n135-underlay-harness_2026-10-15/systems/*.jsonl (the staff space in the harness's 400 dpi raster, from row 80's staff finder).
Kernel rule as built: the largest odd number not above 0.1 * space, at least 1 (frameRow, step 4). For comparison: 0.1 * space rounded to the nearest odd number, at least 1 (not built)."""
import glob, json, os, collections, statistics
HERE = os.path.dirname(os.path.abspath(__file__)); D = f'{HERE}/../measure-n135-underlay-harness_2026-10-15/systems'
sp = []
for f in sorted(glob.glob(f'{D}/*.jsonl')):
    for l in open(f):
        d = json.loads(l)
        if 'space' in d: sp.append((d['space'], os.path.basename(f)[:-6]))
def built(s):
    k = int(0.1 * s + 1e-9); k = k - 1 if k % 2 == 0 else k; return max(1, k)
def nearest_odd(s):
    k = round(0.1 * s); k = k if k % 2 == 1 else (k + 1 if 0.1 * s >= k else k - 1); return max(1, k)
v = [s for s, _ in sp]
print(f'{len(v)} systems; staff space min {min(v)}, median {statistics.median(v)}, max {max(v)}')
print('kernel as built (largest odd not above 0.1 * space):', dict(sorted(collections.Counter(built(s) for s in v).items())))
print('kernel if rounded to the nearest odd (not built):   ', dict(sorted(collections.Counter(nearest_odd(s) for s in v).items())))
none = collections.Counter(m for s, m in sp if built(s) == 1)
print('systems with no closing (kernel 1) as built, by song:', dict(sorted(none.items())))
print('staff space range by song:', {n: (min(s for s, m in sp if m == n), max(s for s, m in sp if m == n)) for n in sorted({m for _, m in sp})})
