"""Evidence for the K finding: the concentration axis on every population that
could plausibly be meant by R-6's "discard populations surviving each site's
second conjunct".

Reports, on bridged concentration at g = 1:
  keep      band rows
  S1-all    every non-band inked row attributable to a system (REACHES the
            site-1 extent conjunct)
  S1-surv   those of S1-all that SURVIVE it at the derived threshold
  S2-all    every walk-terminating row, per seed (REACHES C2(b))
  S2-surv   those of S2-all that SURVIVE C2(b) at the derived T
"""
STATUS = 'CURRENT'

import sys
import json

sys.path.insert(0, '/home/claude')

import numpy as np

import substrate as S

G = 1
SITE1_THRESHOLD = 0.5285
T = 541.1885


def describe(name, arr):
    if len(arr) == 0:
        print('  %-8s n=0  EMPTY, no measured extreme exists' % name)
        return
    a = np.asarray(arr)
    print('  %-8s n=%-7d min=%.4f max=%.4f mean=%.4f sd=%.6f'
          % (name, len(a), a.min(), a.max(), a.mean(),
             a.std(ddof=1) if len(a) > 1 else float('nan')))


def main():
    keep, s1_all, s1_surv, s2_all, s2_surv = [], [], [], [], []
    s1_top, s2_top = [], []

    for png, svg in S.rendered_pages():
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
                for r in mem:
                    keep_rows[r] = w
            anchors.append((w, min(ancs), max(ancs)))
        for r in keep_rows:
            keep.append(float(C[r]))

        n = len(anchors)
        for i, (w, tp, bt) in enumerate(anchors):
            lo = 0 if i == 0 else (anchors[i - 1][2] + tp) // 2 + 1
            hi = nrows - 1 if i == n - 1 else (bt + anchors[i + 1][1]) // 2
            for r in range(lo, hi + 1):
                if td[r] == 0 or r in keep_rows:
                    continue
                c = float(C[r])
                s1_all.append(c)
                s1_top.append((c, P['label'], r, int(ext[r]), w,
                               int(td[r])))
                if ext[r] / w >= SITE1_THRESHOLD:
                    s1_surv.append(c)

        for w, mem in bands:
            nm = [r for r in (mem[0] - 1, mem[-1] + 1) if 0 <= r < nrows]
            for seed in mem:
                ref = int(ext[seed])
                for r in nm:
                    if td[r] == 0:
                        continue
                    c = float(C[r])
                    s2_all.append(c)
                    s2_top.append((c, P['label'], r, int(ext[r]), ref,
                                   int(td[r])))
                    if abs(int(ext[r]) - ref) <= T:
                        s2_surv.append(c)

    print('BRIDGED CONCENTRATION populations at g=%d' % G)
    describe('keep', keep)
    describe('S1-all', s1_all)
    describe('S1-surv', s1_surv)
    describe('S2-all', s2_all)
    describe('S2-surv', s2_surv)
    print('  S1-all rows at C == 1.0000: %d'
          % sum(1 for c in s1_all if c >= 0.99995))
    print('  S2-all rows at C == 1.0000: %d'
          % sum(1 for c in s2_all if c >= 0.99995))
    print('  highest-C S1-all rows (C, page, row, extent, sys extent, dark):')
    for t in sorted(s1_top, reverse=True)[:5]:
        print('    %r' % (t,))
    print('  highest-C S2-all rows (C, page, row, extent, seed ref, dark):')
    for t in sorted(s2_top, reverse=True)[:5]:
        print('    %r' % (t,))
    json.dump(dict(keep_min=min(keep), s1_all_max=max(s1_all),
                   s2_all_max=max(s2_all), n_s1_surv=len(s1_surv),
                   n_s2_surv=len(s2_surv)),
              open('/home/claude/K_evidence.json', 'w'), indent=1)


if __name__ == '__main__':
    main()
