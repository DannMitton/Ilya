"""N.135 stage 2a step 4: the closing kernel closingKernel(staffSpace) would take on the stage 1 harness's own systems.
Reads the `space` of every system in ../measure-n135-underlay-harness_2026-10-15/systems/*.jsonl (the staff space in the harness's 400 dpi raster, from row 80's staff finder).
Kernel rule as built: the odd number nearest 0.1 * space, the lower on a tie, at least 1 (frameRow, stage 2b). For comparison: the first version of step 4, the largest odd number not above 0.1 * space."""
import glob, json, os, collections, statistics
HERE = os.path.dirname(os.path.abspath(__file__)); D = f'{HERE}/../measure-n135-underlay-harness_2026-10-15/systems'
sp = []
for f in sorted(glob.glob(f'{D}/*.jsonl')):
    for l in open(f):
        d = json.loads(l)
        if 'space' in d: sp.append((d['space'], os.path.basename(f)[:-6]))
def floor_odd(s):   # step 4's first version: the largest odd number not above 0.1 * space
    k = int(0.1 * s + 1e-9); k = k - 1 if k % 2 == 0 else k; return max(1, k)
def nearest_odd(s):   # as built now: the odd number nearest 0.1 * space, the lower on a tie
    import math
    return max(1, 2 * math.ceil((0.1 * s - 1) / 2 - 0.5 - 1e-9) + 1)
built = nearest_odd
v = [s for s, _ in sp]
print(f'{len(v)} systems; staff space min {min(v)}, median {statistics.median(v)}, max {max(v)}')
print('kernel as built (the odd number nearest 0.1 * space, the lower on a tie):', dict(sorted(collections.Counter(built(s) for s in v).items())))
print('kernel by the first version (the largest odd number not above 0.1 * space):', dict(sorted(collections.Counter(floor_odd(s) for s in v).items())))
none = collections.Counter(m for s, m in sp if built(s) == 1)
print('systems with no closing (kernel 1) as built, by song:', dict(sorted(none.items())))
print('staff space range by song:', {n: (min(s for s, m in sp if m == n), max(s for s, m in sp if m == n)) for n in sorted({m for _, m in sp})})
