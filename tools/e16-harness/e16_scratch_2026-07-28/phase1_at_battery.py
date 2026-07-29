"""Phase 1 step D: Fable's AT-A to AT-F from the sentinel ruling, plus the
satisfiability evidence for the two I believe are defective.

AT-A annihilation invariant      zero survivors at each site
AT-B sentinel constant           keep min bridged concentration == 0.9737
AT-C sentinel gate               zero fires on the corpus, plus its control
AT-D structure-relative T_rel    derived with its RAISE branch
AT-E census reconciliation       1,980 bands and 3,060 keep rows
AT-F extent denotation           row 1522, row 1566, and a raster ink count
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
K_S_EXPECTED = 0.9737


def main():
    pages = S.rendered_pages()
    cache = []

    keep_C = []
    keep_n = 0
    thickness = Counter()
    n_bands = 0
    member_ratio = []
    nonmember_ratio = []
    nm_ratio_dist = Counter()
    nm_ratio_detail = []
    s1_surv = 0
    s1_tested = 0
    solidity_margin = Counter()
    at_f = {}

    for png, svg in pages:
        P = S.load_page(png, svg)
        nrows = P['nrows']
        td = P['total_dark']
        ext, mass = S.principal_per_row(nrows, P['row'], P['xs'], P['xe'],
                                        P['ln'], G)
        C = np.where(td > 0, mass / np.maximum(td, 1), 0.0)

        bands, keep_rows, anchors = [], {}, []
        for sysd in P['geom']['systems']:
            w = sysd['extent']
            ancs = []
            for y in sysd['rule_rows']:
                anc, _ = S.anchor_for_rule(y, P['best_raw'], w, nrows)
                ancs.append(anc)
                mem = sorted(S.band_members(anc, P['span_lo'], P['span_hi'],
                                            td, w, nrows))
                bands.append((w, mem))
                n_bands += 1
                thickness[len(mem)] += 1
                for r in mem:
                    keep_rows[r] = w
                # AT-E sensitivity: how close is each tested row to the 0.9
                # solidity boundary? A thickness census differing by 17 bands
                # would show up as rows sitting near it.
                for r in (anc - 1, anc, anc + 1):
                    if 0 <= r < nrows and td[r] > 0:
                        span = P['span_hi'][r] - P['span_lo'][r] + 1
                        if span >= S.SPAN_FRAC * w:
                            sol = td[r] / span
                            if 0.80 <= sol < 0.99:
                                solidity_margin[round(sol, 2)] += 1
            anchors.append((w, min(ancs), max(ancs)))

        for r, w in keep_rows.items():
            keep_C.append(float(C[r]))
            keep_n += 1

        # ---- AT-A / AT-D populations
        n = len(anchors)
        for i, (w, tp, bt) in enumerate(anchors):
            lo = 0 if i == 0 else (anchors[i - 1][2] + tp) // 2 + 1
            hi = nrows - 1 if i == n - 1 else (bt + anchors[i + 1][1]) // 2
            for r in range(lo, hi + 1):
                if td[r] == 0 or r in keep_rows:
                    continue
                s1_tested += 1
                if ext[r] / w >= SITE1_THRESHOLD:
                    s1_surv += 1

        for w, mem in bands:
            nm = [r for r in (mem[0] - 1, mem[-1] + 1) if 0 <= r < nrows]
            for seed in mem:
                ref = int(ext[seed])
                for m in mem:
                    member_ratio.append(abs(int(ext[m]) - ref) / w)
                for r in nm:
                    # Provision 5: a blank row has no runs, hence extent 0,
                    # hence ratio 1 relative to the claimed system. No branch.
                    q = abs(int(ext[r]) - ref) / w
                    nonmember_ratio.append(q)
                    nm_ratio_dist[round(q, 1)] += 1
                    nm_ratio_detail.append((q, P['label'], r, int(ext[r]),
                                            ref, w))

        if P['label'] == 'REP:sunless-04:2':
            wsys = P['geom']['systems'][0]['extent']
            at_f['row1522_extent'] = int(ext[1522])
            at_f['row1522_ratio'] = float(ext[1522] / wsys)
            at_f['sys_extent_geometry'] = int(wsys)
            at_f['row1523_raster_ink_columns'] = int(td[1523])
        if P['label'] == 'LEG:sunless-06:3':
            for w, tp, bt in anchors:
                if tp <= 1566 <= bt or (tp - 200) <= 1566 <= (bt + 200):
                    at_f['row1566_ratio'] = float(ext[1566] / w)
                    at_f['row1566_extent'] = int(ext[1566])
                    at_f['row1566_sys_extent'] = int(w)
                    break
        cache.append((P['label'], nrows))

    keep_C = np.array(keep_C)
    member_ratio = np.array(member_ratio)
    nonmember_ratio = np.array(nonmember_ratio)

    print('=== AT-E census reconciliation ===')
    print('  bands=%d (AT-1 rule count 1980)  thickness=%s'
          % (n_bands, dict(sorted(thickness.items()))))
    wsum = sum(k * v for k, v in thickness.items())
    print('  thickness-weighted row sum=%d  keep count=%d  equal=%s'
          % (wsum, keep_n, wsum == keep_n))
    print('  solidity values of TESTED rows in [0.80, 0.99): %s'
          % dict(sorted(solidity_margin.items())))

    print('=== AT-B sentinel constant ===')
    print('  keep min bridged concentration = %.4f  (expected %.4f)  match=%s'
          % (keep_C.min(), K_S_EXPECTED,
             round(float(keep_C.min()), 4) == K_S_EXPECTED))
    K_S = float(keep_C.min())

    print('=== AT-D structure-relative T_rel ===')
    print('  member ratio: n=%d max=%.6f' % (len(member_ratio),
                                             member_ratio.max()))
    print('  non-member ratio: n=%d min=%.6f max=%.6f sample sd=%.6f'
          % (len(nonmember_ratio), nonmember_ratio.min(),
             nonmember_ratio.max(), nonmember_ratio.std(ddof=1)))
    print('  D3 non-member ratio distribution, 0.1 bins: %s'
          % dict(sorted(nm_ratio_dist.items())))
    print('  ten smallest non-member ratios (ratio, page, row, ext, ref, sysext):')
    for t in sorted(nm_ratio_detail)[:10]:
        print('    (%.6f, %r, %d, %d, %d, %d)' % t)
    T_rel = nonmember_ratio.min() - nonmember_ratio.std(ddof=1)
    print('  T_rel = %.6f - %.6f = %.6f' % (nonmember_ratio.min(),
                                            nonmember_ratio.std(ddof=1), T_rel))
    ok_d = (T_rel > member_ratio.max()) and (T_rel < nonmember_ratio.min())
    print('  strictly exceeds member max (%.6f): %s' % (member_ratio.max(),
                                                        T_rel > member_ratio.max()))
    print('  strictly inside the separation interval: %s' % ok_d)
    print('  VERDICT: %s' % ('NO RAISE' if ok_d else 'RAISE, returns to Fable'))

    print('=== AT-A annihilation invariant ===')
    s2_surv = int((nonmember_ratio <= T_rel).sum())
    print('  site 1: %d tested, %d survive the extent conjunct'
          % (s1_tested, s1_surv))
    print('  site 2: %d tested, %d survive C2(b) at T_rel'
          % (len(nonmember_ratio), s2_surv))
    print('  VERDICT: %s' % ('NO RAISE' if (s1_surv == 0 and s2_surv == 0)
                             else 'RAISE'))

    print('=== AT-C sentinel gate ===')
    fires = int((keep_C < K_S).sum()) + s1_surv + s2_surv
    print('  rows accepted by their site\'s operative test with C < K_s: %d'
          % fires)
    print('  VERDICT: %s' % ('NO RAISE' if fires == 0 else 'RAISE'))

    print('=== AT-F extent denotation ===')
    for k in sorted(at_f):
        print('  %s = %s' % (k, at_f[k]))

    json.dump(dict(K_S=K_S, T_rel=float(T_rel),
                   nm_min=float(nonmember_ratio.min()),
                   nm_sd=float(nonmember_ratio.std(ddof=1)),
                   member_max=float(member_ratio.max()),
                   s1_surv=s1_surv, s2_surv=s2_surv, bands=n_bands,
                   thickness=dict(thickness), keep_n=keep_n, at_f=at_f),
              open('/home/claude/at_battery.json', 'w'), indent=1)


if __name__ == '__main__':
    main()
