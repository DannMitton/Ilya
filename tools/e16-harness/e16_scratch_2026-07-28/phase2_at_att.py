"""AT-ATT: attribution re-verification under HORIZONTAL containment.

Fable's recovery ruling, provision 3: a row's reference is the extent of the
SMALLEST validated system x-interval that WHOLLY CONTAINS the row's principal
bridged run. A row contained in none is not a candidate.

Test: corpus-wide, attribute every inked row that way against the oracle system
x-intervals and evaluate the site-1 conjunct at 0.5285.
  every oracle band row must PASS
  every non-band row must FAIL
Any violation RAISES: the 0.5285 constant is then not licensed for recovery
attribution and the ruling returns to Fable.

The threshold was derived under VERTICAL attribution. Horizontal containment
can only shrink a row's reference, so ratios can only rise, so this is a real
test and not a formality.
"""
STATUS = 'CURRENT'

import sys
import json
from collections import Counter

sys.path.insert(0, '/home/claude')

import numpy as np

import substrate as S

G = 1
SITE1_THRESHOLD = 0.5285


def main():
    band_fail = []
    nonband_pass = []
    n_band = n_nonband = n_uncontained = 0
    ratio_hist = Counter()

    for png, svg in S.rendered_pages():
        P = S.load_page(png, svg)
        nrows = P['nrows']
        td = P['total_dark']
        ext, mass = S.principal_per_row(nrows, P['row'], P['xs'], P['xe'],
                                        P['ln'], G)

        # first x and last x of each row's PRINCIPAL bridged run
        pr_lo = np.full(nrows, -1, dtype=np.int64)
        pr_hi = np.full(nrows, -1, dtype=np.int64)
        row, xs, xe, ln = P['row'], P['xs'], P['xe'], P['ln']
        if len(row):
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
            keepm = np.ones(len(cr), dtype=bool)
            keepm[1:] = cr[1:] != cr[:-1]
            sel = order[keepm]
            pr_lo[c_row[sel]] = c_lo[sel]
            pr_hi[c_row[sel]] = c_hi[sel]

        intervals = [(sd['x_lo'], sd['x_hi'], sd['extent'])
                     for sd in P['geom']['systems']]

        band_rows = set()
        for sysd in P['geom']['systems']:
            w = sysd['extent']
            for y in sysd['rule_rows']:
                anc, _ = S.anchor_for_rule(y, P['best_raw'], w, nrows)
                band_rows.update(S.band_members(anc, P['span_lo'], P['span_hi'],
                                                td, w, nrows))

        for r in range(nrows):
            if td[r] == 0:
                continue
            lo, hi = int(pr_lo[r]), int(pr_hi[r])
            cont = [iv for iv in intervals if iv[0] <= lo and hi <= iv[1]]
            if not cont:
                n_uncontained += 1
                if r in band_rows:
                    band_fail.append((P['label'], r, 'UNCONTAINED', lo, hi))
                continue
            ref = min(cont, key=lambda iv: iv[2])[2]
            ratio = int(ext[r]) / ref
            passes = ratio >= SITE1_THRESHOLD
            if r in band_rows:
                n_band += 1
                if not passes:
                    band_fail.append((P['label'], r, ratio, int(ext[r]), ref))
            else:
                n_nonband += 1
                ratio_hist[round(ratio, 1)] += 1
                if passes:
                    nonband_pass.append((ratio, P['label'], r, int(ext[r]),
                                         ref, lo, hi))

    print('AT-ATT under HORIZONTAL containment, threshold %.4f' % SITE1_THRESHOLD)
    print('  band rows attributed:     %d, failures: %d' % (n_band, len(band_fail)))
    print('  non-band rows attributed: %d, false passes: %d'
          % (n_nonband, len(nonband_pass)))
    print('  rows contained in NO validated system interval: %d' % n_uncontained)
    print('  non-band ratio distribution, 0.1 bins: %s'
          % dict(sorted(ratio_hist.items())))
    if nonband_pass:
        print('  worst false passes (ratio, page, row, extent, ref, run lo, hi):')
        for t in sorted(nonband_pass, reverse=True)[:10]:
            print('    (%.4f, %r, %d, %d, %d, %d, %d)' % t)
    if band_fail:
        print('  band-row failures:')
        for t in band_fail[:10]:
            print('    %r' % (t,))
    verdict = (not band_fail) and (not nonband_pass)
    print('  VERDICT: %s' % ('NO RAISE, constant licensed for recovery '
                             'attribution' if verdict
                             else 'RAISE, returns to Fable'))
    json.dump(dict(n_band=n_band, n_nonband=n_nonband,
                   band_fail=len(band_fail), nonband_pass=len(nonband_pass),
                   uncontained=n_uncontained, verdict=verdict),
              open('/home/claude/at_att.json', 'w'), indent=1)


if __name__ == '__main__':
    main()
