"""Evidence for the two acceptance tests I believe are defective.

AT-C: build BOTH Fable's stated negative control and a repaired one, and
report which fires the sentinel.

AT-E: Fable asks for "the 17 differing bands". The prior census survives only
as two integers and its container is destroyed, so the differing bands cannot
be identified from the record. Test instead the one checkable hypothesis about
where {1: 917, 2: 1063} came from: EXTENT-ONLY membership, without the
solidity conjunct, which the same session records having used before
correcting it.
"""
STATUS = 'CURRENT'

import sys
from collections import Counter

sys.path.insert(0, '/home/claude')

import numpy as np

import substrate as S

G = 1
SITE1_THRESHOLD = 0.5285
K_S = 0.9737


def row_stats(row_mask, g=G):
    """Substrate quantities for ONE synthetic row given as a boolean vector."""
    ink = row_mask[None, :]
    r, xs, xe, ln = S.row_runs(ink)
    ext, mass = S.principal_per_row(1, r, xs, xe, ln, g)
    td = int(ink.sum())
    raw_span = (int(xe.max()) - int(xs.min()) + 1) if len(xs) else 0
    return dict(principal_extent=int(ext[0]), mass=int(mass[0]),
                total_dark=td, raw_x_extent=raw_span,
                concentration=(mass[0] / td) if td else 0.0)


def at_c():
    W = 2480
    x_lo, x_hi = 188, 2420
    sys_extent = 2233
    print('=== AT-C negative control, both constructions ===')
    print('  system: x %d..%d, extent %d px; site-1 threshold %.4f; K_s %.4f'
          % (x_lo, x_hi, sys_extent, SITE1_THRESHOLD, K_S))

    # Fable's construction, read literally: two long runs, gap > g, masses
    # roughly equal, together spanning the system.
    a = np.zeros(W, dtype=bool)
    a[188:1304] = True          # 1116 px
    a[1306:2421] = True         # 1115 px, gap of 2 px > g = 1
    st = row_stats(a)
    ratio = st['principal_extent'] / sys_extent
    passes = ratio >= SITE1_THRESHOLD
    print('  AS STATED: two runs 1116 and 1115 px, gap 2 px')
    print('    raw x-extent ratio          = %.4f' % (st['raw_x_extent'] / sys_extent))
    print('    PRINCIPAL BRIDGED ext ratio = %.4f' % ratio)
    print('    concentration               = %.4f' % st['concentration'])
    print('    clears the site-1 extent conjunct: %s' % passes)
    print('    sentinel FIRES: %s' % (passes and st['concentration'] < K_S))

    # Repaired: the PRINCIPAL run must itself clear the site-1 threshold, so
    # the two runs cannot be of roughly equal length.
    b = np.zeros(W, dtype=bool)
    b[188:1388] = True          # 1200 px principal, ratio 0.5374
    b[1400:2401] = True         # 1001 px
    st2 = row_stats(b)
    ratio2 = st2['principal_extent'] / sys_extent
    passes2 = ratio2 >= SITE1_THRESHOLD
    print('  REPAIRED: two runs 1200 and 1001 px, gap 12 px')
    print('    PRINCIPAL BRIDGED ext ratio = %.4f' % ratio2)
    print('    concentration               = %.4f' % st2['concentration'])
    print('    clears the site-1 extent conjunct: %s' % passes2)
    print('    sentinel FIRES: %s' % (passes2 and st2['concentration'] < K_S))

    # Second repaired form: full-span principal plus margin ink.
    c = np.zeros(W, dtype=bool)
    c[188:2421] = True          # 2233 px principal, ratio 1.0000
    c[0:150] = True             # 150 px of margin ink, gap 38 px
    st3 = row_stats(c)
    ratio3 = st3['principal_extent'] / sys_extent
    print('  REPAIRED B: full-span run plus 150 px of margin ink')
    print('    PRINCIPAL BRIDGED ext ratio = %.4f' % ratio3)
    print('    concentration               = %.4f' % st3['concentration'])
    print('    sentinel FIRES: %s'
          % (ratio3 >= SITE1_THRESHOLD and st3['concentration'] < K_S))


def at_e():
    print('=== AT-E: where {1: 917, 2: 1063} could have come from ===')
    ratified = Counter()
    extent_only = Counter()
    diffs = []
    for png, svg in S.rendered_pages():
        P = S.load_page(png, svg)
        nrows = P['nrows']
        td = P['total_dark']
        for sysd in P['geom']['systems']:
            w = sysd['extent']
            for y in sysd['rule_rows']:
                anc, _ = S.anchor_for_rule(y, P['best_raw'], w, nrows)
                mem_r = S.band_members(anc, P['span_lo'], P['span_hi'], td, w,
                                       nrows)
                mem_e = []
                for r in (anc - 1, anc, anc + 1):
                    if 0 <= r < nrows and td[r] > 0:
                        span = P['span_hi'][r] - P['span_lo'][r] + 1
                        if span >= S.SPAN_FRAC * w:
                            mem_e.append(r)
                ratified[len(mem_r)] += 1
                extent_only[len(mem_e)] += 1
                if len(mem_r) != len(mem_e):
                    diffs.append((P['label'], anc, sorted(mem_r), sorted(mem_e),
                                  w, [int(td[r]) for r in sorted(set(mem_r) ^ set(mem_e))],
                                  [int(P['span_hi'][r] - P['span_lo'][r] + 1)
                                   for r in sorted(set(mem_r) ^ set(mem_e))]))
    print('  RATIFIED membership (0.9 span AND 0.9 solid): %s'
          % dict(sorted(ratified.items())))
    print('  EXTENT-ONLY membership (0.9 span, no solidity): %s'
          % dict(sorted(extent_only.items())))
    print('  bands where the two disagree: %d' % len(diffs))
    for d in diffs[:6] + diffs[-3:]:
        print('    %r' % (d,))


if __name__ == '__main__':
    at_c()
    at_e()
