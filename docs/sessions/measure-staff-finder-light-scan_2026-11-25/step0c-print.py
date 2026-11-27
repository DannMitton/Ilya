# Prints step 0c's figures that come from saved files: the staff check, the metre reader, and how dark the seven
# time-signature digits are. usage: python3 -I step0c-print.py <workdir>
import sys, json
import numpy as np

W = sys.argv[1] + '/'
load = lambda n: json.load(open(W + n))

h = load('step0c-p4.hasstaves.json')
print('== hasStaves (step0c-browser.mjs)')
for p in h['per']:
    print(f"  page {p['page']}: hasStaves {p['hasStaves']}, rows over gate {p['rowsOverGate']}, max row fraction {p['maxRowFrac']}")
print('  routePdf:', h['route'])
r, saved = load('step0c-p4.homrfull.json'), load('nightingale-p4.homr.json')
print(f"== homr: {len(r['staves'])} boxes, equal to step 0a's: {r['staves'] == saved['staves']}")

m = load('step0c-p4.metre.json')
print('== metre reader (step0c-metre.mjs)')
print('  shipped readPageMetres:', m['shipped'])
print(f"  candidate staves: windows {len(m['reads'])}, of which after a bar line {sum(e['kind'] == 'bar' for e in m['reads'])}, stating a signature {sum(bool(e['verdict']['lab']) for e in m['reads'])}")
for e in m['reads']:
    if 'plain' in e or e['verdict']['lab']:
        print(f"  box {e['box']} window {e['wi']} {e['kind']}: {e['verdict']} readings {e['statedLabs']} uncovered {e.get('uncovered')} void {e.get('uncoveredVoid')} cutRatio {[round(v, 3) for v in e.get('cutRatio', [])]}")

d = load('nightingale-p4.dim.json')
g = np.fromfile(W + 'nightingale-p4.gray', dtype=np.uint8).reshape(d['h'], d['w'])
st = load('step0c-p4.staves.json')
print('== signature digits, page x 834 to 871, rows more than 5 px off a staff line')
tot = np.zeros(2)
for b in (0, 4, 6, 8, 10, 12, 14):
    L = [int(round(v)) for v in st[b]['st']['ls'][0]]
    for name, a, z in (('upper', L[0], L[2]), ('lower', L[2], L[4])):
        rows = [y for y in range(a, z + 1) if min(abs(y - l) for l in L) > 5]
        c = g[np.ix_(rows, range(834, 872))]
        n128, n170 = int((c < 128).sum()), int((c < 170).sum())
        tot += [n128, n170]
        print(f'  box {b} {name}: pixels <128 {n128}, <170 {n170}, share {n128 / n170:.2f}, darkest {c.min()}, median of <170 {int(np.median(c[c < 170]))}')
print(f'  all seven: share of the <170 pixels that are also <128: {tot[0] / tot[1]:.2f}')
