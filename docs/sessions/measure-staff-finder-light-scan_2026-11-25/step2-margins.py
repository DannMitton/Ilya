# Step 2: the passing regions and the margins, from step2-sweep.json. A page passes at (u, ceiling) when every voice box
# it needs is found: needed = found by the shipped code today, or found at any pair in the grid. Prints each page's
# margins along each axis from the chosen pair, then the same over all pages together, and the largest rectangle
# centred on the pair that passes everywhere (every point inside it, not only the two axes).
# usage: python3 -I step2-margins.py <workdir> [u ceiling]
import json, sys

d = json.load(open(sys.argv[1] + '/step2-sweep.json'))
u0, c0 = (float(sys.argv[2]), float(sys.argv[3])) if len(sys.argv) > 3 else (0.85, 0.65)
U, C = d['U'], d['C']
ui, ci = U.index(u0), C.index(c0)
SPARSE = ['nightingale-p4-one-staff', 'song1-p1-first-system']


def need(p):
    n = len(p['voice'])
    ever = [any(g[k] == '1' for row in p['grid'] for g in row) for k in range(n)]
    return [k for k in range(n) if p['today'][k] or ever[k]]


def passes(p, k, i, j):
    return all(p['grid'][i][j][x] == '1' for x in k)


def run(ok, at, axis):
    """The unbroken passing run of values on an axis that holds index `at`, as (low, high) values; None if it fails there."""
    if not ok(at):
        return None
    lo = hi = at
    while lo > 0 and ok(lo - 1):
        lo -= 1
    while hi < len(axis) - 1 and ok(hi + 1):
        hi += 1
    edge = lambda x: f'{axis[x]:.2f}' + ('*' if x in (0, len(axis) - 1) else '')
    return lo, hi, edge(lo), edge(hi)


def describe(name, ok):
    ru = run(lambda i: ok(i, ci), ui, U)
    rc = run(lambda j: ok(ui, j), ci, C)
    if ru is None:
        return f'{name:27} FAILS at the pair'
    nd, nu = u0 - U[ru[0]], U[ru[1]] - u0
    md, mu = c0 - C[rc[0]], C[rc[1]] - c0
    return f'{name:27} u {ru[2]} to {ru[3]} at ceiling {c0} (down {nd:.2f}, up {nu:.2f}) | ceiling {rc[2]} to {rc[3]} at u {u0} (down {md:.2f}, up {mu:.2f})'


print(f'pair u {u0}, ceiling {c0}. * marks the end of the grid (u {U[0]} to {U[-1]}, ceiling {C[0]} to {C[-1]}).')
for name, p in d['pages'].items():
    k = need(p)
    never = [p['voice'][x] for x in range(len(p['voice'])) if x not in k]
    if not k:
        print(f'{name:27} no voice box to need' + (f'; boxes {never} found by no pair' if never else ''))
        continue
    lost = [p['voice'][x] for x in k if p['grid'][ui][ci][x] != '1']
    extra = (f'  needs {len(k)} of {len(p["voice"])}' + (f', never found {never}' if never else '') + (f', not found at the pair {lost}' if lost else ''))
    print(describe(name, lambda i, j: passes(p, k, i, j)) + extra)


def voice_only(name):
    # Song3 page 6 came from homr as one part, so `voiceBoxes` names all six boxes. Read from the page (2026-11-26), box 0
    # is the one voice staff and boxes 1 to 5 are piano grand staves.
    k = need(d['pages'][name])
    return [x for x in k if d['pages'][name]['voice'][x] == 0] if name == 'song3-p6' else k


def together(label, names, pick=need):
    pages = [(d['pages'][n], pick(d['pages'][n]) if pick is need else pick(n)) for n in names]
    ok = lambda i, j: all(passes(p, k, i, j) for p, k in pages)
    print()
    print(describe(label, ok))
    if not ok(ui, ci):
        return
    # rectangles centred on the pair, in grid steps
    best = []
    for a in range(0, min(ui, len(U) - 1 - ui) + 1):
        b = -1
        while b + 1 <= min(ci, len(C) - 1 - ci) and all(ok(i, j) for i in range(ui - a, ui + a + 1) for j in range(ci - b - 1, ci + b + 2)):
            b += 1
        if b < 0:
            break
        best.append((a, b))
    front = [(a, b) for a, b in best if not any(A >= a and B >= b and (A, B) != (a, b) for A, B in best)]
    print('  rectangles centred on the pair that pass everywhere, as (N in u, M in ceiling): ' + ', '.join(f'({a / 100:.2f}, {b / 100:.2f})' for a, b in front))
    n_ok = sum(ok(i, j) for i in range(len(U)) for j in range(len(C)))
    print(f'  grid points passing everywhere: {n_ok}')


allpages = list(d['pages'])
together('ALL PAGES', allpages)
together('ALL BUT THE TWO CUTS', [n for n in allpages if n not in SPARSE])
together('VOICE STAVES, NO CUTS', [n for n in allpages if n not in SPARSE], voice_only)
together('VOICE STAVES, ONE-SYSTEM CUT', [n for n in allpages if n != 'nightingale-p4-one-staff'], voice_only)
together('THE DESK\'S FIRST ELEVEN', ['nightingale-p4', 'nightingale-p2', 'nightingale-p3', 'nightingale-p5', 'song1-p1', 'song2-p1', 'song3-p1', 'song4-p1', 'withoutsun-p4', 'withoutsun-p5', 'withoutsun-p6'])
