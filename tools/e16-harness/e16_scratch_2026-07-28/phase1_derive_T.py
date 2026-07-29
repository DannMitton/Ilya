"""SUPERSEDED phase1_derive_T.py

Superseded by phase1_at_battery.py. the pixel-form T = 541.1885 was superseded by the structure-relative T_rel = 0.793270 under Fable Provision 4, 2026-07-28.
"""
"""Phase 1 step B: M3, then T at call site 2, on the bridged substrate.

M3, per the clearance ruling R5: the corpus-wide MEMBER and NON-MEMBER
deviation populations for C2(b), deviation = |row extent - seed extent| in px,
extent bound by R-5 to PRINCIPAL BRIDGED-RUN EXTENT at the derived g.

Anchor-independence (AT3): every row of a band serves as seed in turn.
Non-member rows are the walk's terminating rows, the first row beyond each end
of the band, which is where S4's "termination by membership failure only" puts
them.

T = min(non-member deviations) - 1 sample sd(non-member deviations).
RAISES unless T strictly exceeds max(member deviations).

AT-5's named risk is MEASURED here, not assumed: the full D3 distribution of
non-member deviations is reported before any minimum is quoted.
"""
STATUS = ('SUPERSEDED', 'phase1_at_battery.py', 'the pixel-form T = 541.1885 was superseded by the structure-relative T_rel = 0.793270 under Fable Provision 4, 2026-07-28.')

if __name__ == '__main__':
    raise SystemExit('SUPERSEDED: see phase1_at_battery.py')

import sys
import json
from collections import Counter

sys.path.insert(0, '/home/claude')

import numpy as np

import substrate as S


def bands_for_page(P):
    """Return list of (system_extent, sorted member rows) for every rule."""
    out = []
    nrows = P['nrows']
    for sysd in P['geom']['systems']:
        w = sysd['extent']
        for y in sysd['rule_rows']:
            anc, off = S.anchor_for_rule(y, P['best_raw'], w, nrows)
            mem = S.band_members(anc, P['span_lo'], P['span_hi'],
                                 P['total_dark'], w, nrows)
            out.append((w, sorted(mem)))
    return out


def main():
    pages = S.rendered_pages()
    g = 1  # re-derived this session under R-1'; see phase1_substrate_check.py

    member_dev = []
    nonmember_dev = []
    nonmember_detail = []
    nm_inked = Counter()
    nm_dist = Counter()
    band_count = 0

    for png, svg in pages:
        P = S.load_page(png, svg)
        nrows = P['nrows']
        ext, mass = S.principal_per_row(nrows, P['row'], P['xs'], P['xe'],
                                        P['ln'], g)
        for w, mem in bands_for_page(P):
            band_count += 1
            lo, hi = mem[0], mem[-1]
            nm = [r for r in (lo - 1, hi + 1) if 0 <= r < nrows]
            for seed in mem:
                ref = int(ext[seed])
                for m in mem:
                    member_dev.append(abs(int(ext[m]) - ref))
                for r in nm:
                    d = abs(int(ext[r]) - ref)
                    nonmember_dev.append(d)
                    nm_dist[d // 100 * 100] += 1
                    nm_inked['inked' if P['total_dark'][r] > 0 else 'blank'] += 1
                    nonmember_detail.append((P['label'], r, int(ext[r]), ref, d))

    member_dev = np.array(member_dev)
    nonmember_dev = np.array(nonmember_dev)

    print('BANDS: %d' % band_count)
    print('MEMBER deviation population: n=%d, max=%d, distribution=%s'
          % (len(member_dev), member_dev.max(),
             dict(sorted(Counter(member_dev.tolist()).items()))))
    print('NON-MEMBER deviation population: n=%d' % len(nonmember_dev))
    print('  D3 non-member deviation distribution, 100 px bins: %s'
          % dict(sorted(nm_dist.items())))
    print('  non-member rows by ink: %s' % dict(nm_inked))
    print('  min=%d  max=%d  mean=%.2f  sample sd=%.4f'
          % (nonmember_dev.min(), nonmember_dev.max(), nonmember_dev.mean(),
             nonmember_dev.std(ddof=1)))
    smallest = sorted(nonmember_detail, key=lambda t: t[4])[:10]
    print('  ten smallest non-member deviations (page, row, extent, ref, dev):')
    for t in smallest:
        print('    %r' % (t,))

    nm_min = int(nonmember_dev.min())
    nm_sd = float(nonmember_dev.std(ddof=1))
    T = nm_min - nm_sd
    mm = int(member_dev.max())
    print('T DERIVED = min(non-member dev) - 1 sd = %d - %.4f = %.4f'
          % (nm_min, nm_sd, T))
    print('MAX member deviation = %d px' % mm)
    if not (T > mm):
        print('RAISE: T (%.4f) does not strictly exceed the maximum member '
              'deviation (%d). Returns to Fable.' % (T, mm))
    else:
        print('NO RAISE: T strictly exceeds the maximum member deviation. '
              'margin = %.4f px' % (T - mm))

    json.dump(dict(g=g, T=T, nm_min=nm_min, nm_sd=nm_sd, member_max=mm,
                   n_member=int(len(member_dev)),
                   n_nonmember=int(len(nonmember_dev))),
              open('/home/claude/T_result.json', 'w'), indent=1)


if __name__ == '__main__':
    main()
