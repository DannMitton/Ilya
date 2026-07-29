"""Why does pass one miss the short final system on legacy sunless-05 p5?

Measures the actual rowfrac values of every SVG rule row on that page against
the gate `_derive_rowfrac_gate` derives, so the brief to Fable carries the
mechanism of the miss rather than the fact of it.
"""
STATUS = 'CURRENT'

import sys

sys.path.insert(0, '/home/claude')

import numpy as np
import cv2

import e16_measure_substrate as S  # renamed: reader/substrate.py now owns the name `substrate`
import reader

PNG = ('/home/claude/e16/output/mussorgsky---sunless-05---elegy/'
       'page5_300dpi.png')
SVG = PNG.replace('_300dpi.png', '.svg')


def main():
    img = cv2.imread(PNG, cv2.IMREAD_GRAYSCALE)
    P = S.load_page(PNG, SVG)
    nrows, W = P['nrows'], P['W']
    td = P['total_dark']

    rowfrac = (img < 128).mean(axis=1)
    gate = reader._derive_rowfrac_gate(rowfrac)
    print('page %d x %d, derived rowfrac gate = %.6f' % (nrows, W, gate))
    print()

    for si, sysd in enumerate(P['geom']['systems']):
        w = sysd['extent']
        vals = []
        for y in sysd['rule_rows']:
            anc, _ = S.anchor_for_rule(y, P['best_raw'], w, nrows)
            vals.append((anc, float(rowfrac[anc]), int(td[anc])))
        lo = min(v[1] for v in vals)
        hi = max(v[1] for v in vals)
        print('system %d: extent %d px, %d rules' % (si, w, len(vals)))
        print('   rowfrac range %.4f to %.4f   ACCEPTED BY GATE: %s'
              % (lo, hi, 'ALL' if lo > gate else
                 ('NONE' if hi <= gate else 'PARTIAL')))
        print('   extent as a fraction of PAGE width: %.4f' % (w / W))
        print('   rows: %s' % [(a, round(f, 4)) for a, f, _ in vals[:5]])
    print()

    # what the gate's own segmentation sees
    nz = np.sort(rowfrac[rowfrac > 0.005])
    gaps = np.diff(nz)
    big = np.nonzero(gaps > 0.015)[0]
    print('rowfrac segments above the 0.005 pre-filter, split at gaps > 0.015:')
    start = 0
    for b in list(big) + [len(nz) - 1]:
        seg = nz[start:b + 1]
        if len(seg):
            print('   n=%-5d span %.4f  range %.4f .. %.4f'
                  % (len(seg), seg[-1] - seg[0], seg[0], seg[-1]))
        start = b + 1


if __name__ == '__main__':
    main()
