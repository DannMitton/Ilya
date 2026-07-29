"""AT-REC feasibility probe on the motivating page, before any implementation.

Simulates Fable's provision 3 on legacy sunless-05 p5:
  pass one   the EXISTING detect_staves, unchanged
  reference  each validated staff's system x-interval, read at RUNTIME from
             its own rule rows' principal bridged runs -- no SVG, no oracle
  recovery   every unaccepted inked row attributed by horizontal containment
             to the SMALLEST containing validated interval, then tested by the
             site-1 conjunct at 0.5285
  validation recovered rows grouped at the ruled spacing; only 5-line groups
             become staves

Reports whether the two missed staves are recoverable. This is a measurement,
not a promise, exactly as the ruling says.
"""
STATUS = 'CURRENT'

import sys

sys.path.insert(0, '/home/claude')

import numpy as np
import cv2

import substrate as S
import reader

G = 1
SITE1_THRESHOLD = 0.5285

PNG = ('/home/claude/e16/output/mussorgsky---sunless-05---elegy/'
       'page5_300dpi.png')
SVG = PNG.replace('_300dpi.png', '.svg')


def principal_bounds(P, nrows):
    lo = np.full(nrows, -1, dtype=np.int64)
    hi = np.full(nrows, -1, dtype=np.int64)
    row, xs, xe, ln = P['row'], P['xs'], P['xe'], P['ln']
    if not len(row):
        return lo, hi
    gap = np.empty(len(row), dtype=np.int64)
    gap[0] = 1 << 40
    gap[1:] = xs[1:] - xe[:-1] - 1
    newc = (gap > G)
    newc[1:] |= (row[1:] != row[:-1])
    newc[0] = True
    chain = np.cumsum(newc) - 1
    nch = int(chain[-1]) + 1
    cm = np.zeros(nch, dtype=np.int64)
    np.add.at(cm, chain, ln)
    fi = np.zeros(nch, dtype=np.int64)
    fi[chain[newc]] = np.nonzero(newc)[0]
    li = np.zeros(nch, dtype=np.int64)
    np.maximum.at(li, chain, np.arange(len(row)))
    c_lo, c_hi = xs[fi], xe[li]
    c_ext = c_hi - c_lo + 1
    c_row = row[fi]
    order = np.lexsort((c_lo, -c_ext, -cm, c_row))
    cr = c_row[order]
    km = np.ones(len(cr), dtype=bool)
    km[1:] = cr[1:] != cr[:-1]
    sel = order[km]
    lo[c_row[sel]] = c_lo[sel]
    hi[c_row[sel]] = c_hi[sel]
    return lo, hi


def main():
    img = cv2.imread(PNG, cv2.IMREAD_GRAYSCALE)
    P = S.load_page(PNG, SVG)
    nrows = P['nrows']
    td = P['total_dark']
    ext, mass = S.principal_per_row(nrows, P['row'], P['xs'], P['xe'],
                                    P['ln'], G)
    pr_lo, pr_hi = principal_bounds(P, nrows)

    # ---- pass one, existing mechanism, unchanged
    checked, s = reader.detect_staves(img, page='LEG:sunless-05:5')
    print('PASS ONE: %d validated staves, derived spacing s = %.2f'
          % (len(checked), s))
    accepted = set()
    for st in checked:
        accepted.update(st)
    # widen acceptance to the whole ink band around each validated line
    band_accepted = set()
    for st in checked:
        for y in st:
            for d in (-2, -1, 0, 1, 2):
                if 0 <= y + d < nrows and td[y + d] > 0:
                    band_accepted.add(y + d)

    # ---- reference from the VALIDATED output itself, no SVG
    intervals = []
    for st in checked:
        los = [int(pr_lo[y]) for y in st if pr_lo[y] >= 0]
        his = [int(pr_hi[y]) for y in st if pr_hi[y] >= 0]
        if los and his:
            intervals.append((min(los), max(his), max(his) - min(los) + 1))
    print('RUNTIME system intervals from validated rule rows: %s' % intervals)

    # what the SVG says, for the record only, never used above
    svg_iv = [(sd['x_lo'], sd['x_hi'], sd['extent'])
              for sd in P['geom']['systems']]
    print('SVG intervals (record only, not used): %s' % svg_iv)
    print('SVG systems on this page: %d, rules: %d'
          % (len(P['geom']['systems']),
             sum(len(sd['rule_rows']) for sd in P['geom']['systems'])))

    # ---- recovery
    recovered = []
    for r in range(nrows):
        if td[r] == 0 or r in band_accepted:
            continue
        lo, hi = int(pr_lo[r]), int(pr_hi[r])
        cont = [iv for iv in intervals if iv[0] <= lo and hi <= iv[1]]
        if not cont:
            continue
        ref = min(cont, key=lambda iv: iv[2])[2]
        if int(ext[r]) / ref >= SITE1_THRESHOLD:
            recovered.append((r, int(ext[r]), ref, int(ext[r]) / ref))
    print('RECOVERED candidate rows: %d' % len(recovered))
    for t in recovered:
        print('   row %d  extent %d  ref %d  ratio %.4f' % t)

    # ---- group recovered rows into lines, then into 5-line staves
    if recovered:
        rows = sorted(t[0] for t in recovered)
        lines = []
        cur = [rows[0]]
        for r in rows[1:]:
            if r - cur[-1] <= 3:
                cur.append(r)
            else:
                lines.append(int(np.mean(cur)))
                cur = [r]
        lines.append(int(np.mean(cur)))
        print('RECOVERED distinct line positions: %d -> %s' % (len(lines), lines))
        groups = []
        cur = [lines[0]]
        for i in range(1, len(lines)):
            if lines[i] - cur[-1] > 1.7 * s:
                groups.append(cur)
                cur = [lines[i]]
            else:
                cur.append(lines[i])
        groups.append(cur)
        print('RECOVERED groups and sizes: %s' % [len(gp) for gp in groups])
        newstaves = [gp for gp in groups if len(gp) == 5]
        print('RECOVERED VALID 5-LINE STAVES: %d' % len(newstaves))
        print('TOTAL after recovery: %d (oracle expects 8)'
              % (len(checked) + len(newstaves)))
    else:
        print('TOTAL after recovery: %d (oracle expects 8)' % len(checked))


if __name__ == '__main__':
    main()
