"""SUPERSEDED phase1_derive_K.py

Superseded by phase1_at_battery.py. K as a clearance-derived discriminator is struck under the ratified annihilation lemma; K is re-denoted the sentinel K_s = 0.9737, derived and tested in the successor.
"""
"""Phase 1 step C: M2, then the one shared K on BRIDGED CONCENTRATION.

R-6: K is derived once, shared, over the discard populations surviving each
call site's SECOND conjunct, with the clearance raise checked at each site
separately.

Site 1 second conjunct: structure-relative bridged extent >= SITE1_THRESHOLD
                        (derived this session by the clearance rule).
Site 2 second conjunct: C2(b), |extent - seed extent| <= T (derived this
                        session).

Concentration C = principal bridged run's MASS / the row's total dark mass.
M2 is the sample standard deviation of the settled discard population on that
axis; K = max(discard C) + 1 sd, and RAISES unless K is strictly below the
keep minimum at each site.
"""
STATUS = ('SUPERSEDED', 'phase1_at_battery.py', 'K as a clearance-derived discriminator is struck under the ratified annihilation lemma; K is re-denoted the sentinel K_s = 0.9737, derived and tested in the successor.')

if __name__ == '__main__':
    raise SystemExit('SUPERSEDED: see phase1_at_battery.py')

import sys
import json
from collections import Counter

sys.path.insert(0, '/home/claude')

import numpy as np

import substrate as S

G = 1
SITE1_THRESHOLD = 0.5285      # from phase1_substrate_check.py, attribution A
T = 541.1885                  # from phase1_derive_T.py


def main():
    pages = S.rendered_pages()

    keep_C = []
    s1_surv_C = []
    s2_surv_C = []
    s1_surv_detail = []
    s2_surv_detail = []
    s1_tested = 0
    s2_tested = 0

    for png, svg in pages:
        P = S.load_page(png, svg)
        nrows = P['nrows']
        td = P['total_dark']
        ext, mass = S.principal_per_row(nrows, P['row'], P['xs'], P['xe'],
                                        P['ln'], G)
        with np.errstate(divide='ignore', invalid='ignore'):
            C = np.where(td > 0, mass / np.maximum(td, 1), 0.0)

        bands = []
        keep_rows = {}
        for sysd in P['geom']['systems']:
            w = sysd['extent']
            for y in sysd['rule_rows']:
                anc, off = S.anchor_for_rule(y, P['best_raw'], w, nrows)
                mem = sorted(S.band_members(anc, P['span_lo'], P['span_hi'],
                                            P['total_dark'], w, nrows))
                bands.append((w, mem))
                for r in mem:
                    keep_rows[r] = w
        for r, w in keep_rows.items():
            keep_C.append(float(C[r]))

        # ---- site 1: every inked row attributable to a system, whole-page
        #      partition (attribution A), that clears the extent conjunct.
        tops = [], []
        anchors_per_sys = []
        for sysd in P['geom']['systems']:
            w = sysd['extent']
            ancs = [S.anchor_for_rule(y, P['best_raw'], w, nrows)[0]
                    for y in sysd['rule_rows']]
            anchors_per_sys.append((w, min(ancs), max(ancs)))
        n = len(anchors_per_sys)
        for i, (w, tp, bt) in enumerate(anchors_per_sys):
            lo = 0 if i == 0 else (anchors_per_sys[i - 1][2] + tp) // 2 + 1
            hi = nrows - 1 if i == n - 1 else (bt + anchors_per_sys[i + 1][1]) // 2
            for r in range(lo, hi + 1):
                if td[r] == 0 or r in keep_rows:
                    continue
                s1_tested += 1
                if ext[r] / w >= SITE1_THRESHOLD:
                    s1_surv_C.append(float(C[r]))
                    s1_surv_detail.append((P['label'], r, int(ext[r]), w,
                                           float(ext[r] / w), float(C[r])))

        # ---- site 2: the walk's terminating rows, per seed, that survive C2(b)
        for w, mem in bands:
            lo, hi = mem[0], mem[-1]
            nm = [r for r in (lo - 1, hi + 1) if 0 <= r < nrows]
            for seed in mem:
                ref = int(ext[seed])
                for r in nm:
                    if td[r] == 0:
                        continue
                    s2_tested += 1
                    if abs(int(ext[r]) - ref) <= T:
                        s2_surv_C.append(float(C[r]))
                        s2_surv_detail.append((P['label'], r, int(ext[r]), ref,
                                               float(C[r])))

    keep_C = np.array(keep_C)
    s1 = np.array(s1_surv_C)
    s2 = np.array(s2_surv_C)
    pooled = np.concatenate([s1, s2]) if len(s2) else s1

    print('KEEP population on bridged concentration: n=%d min=%.4f'
          % (len(keep_C), keep_C.min()))
    print('SITE 1: %d non-band rows tested, %d survive the extent conjunct'
          % (s1_tested, len(s1)))
    if len(s1):
        print('  survivors C: max=%.4f mean=%.4f sample sd=%.4f'
              % (s1.max(), s1.mean(), s1.std(ddof=1)))
        for t in sorted(s1_surv_detail, key=lambda t: -t[5])[:6]:
            print('    top-C survivor %r' % (t,))
    print('SITE 2: %d walk-terminating rows tested, %d survive C2(b) at T=%.4f'
          % (s2_tested, len(s2), T))
    if len(s2):
        print('  survivors C: max=%.4f mean=%.4f sample sd=%.4f'
              % (s2.max(), s2.mean(), s2.std(ddof=1)))
        for t in sorted(s2_surv_detail, key=lambda t: -t[4])[:6]:
            print('    top-C survivor %r' % (t,))

    print('M2 pooled settled discard population: n=%d max=%.4f sample sd=%.6f'
          % (len(pooled), pooled.max(), pooled.std(ddof=1)))
    K = pooled.max() + pooled.std(ddof=1)
    print('K DERIVED = max + 1 sd = %.4f + %.6f = %.6f'
          % (pooled.max(), pooled.std(ddof=1), K))
    ok = True
    for nm_, mn in (('site 1', keep_C.min()), ('site 2', keep_C.min())):
        if not (K < mn):
            print('RAISE at %s: K (%.6f) is not strictly below the keep '
                  'minimum (%.4f). Returns to Fable.' % (nm_, K, mn))
            ok = False
        else:
            print('NO RAISE at %s: K %.6f < keep min %.4f, margin %.4f'
                  % (nm_, K, mn, mn - K))
    json.dump(dict(K=float(K), pooled_max=float(pooled.max()),
                   pooled_sd=float(pooled.std(ddof=1)),
                   keep_min=float(keep_C.min()), n_pooled=int(len(pooled)),
                   raise_free=bool(ok)),
              open('/home/claude/K_result.json', 'w'), indent=1)


if __name__ == '__main__':
    main()
