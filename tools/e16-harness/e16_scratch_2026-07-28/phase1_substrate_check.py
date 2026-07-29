"""Phase 1 step A: rebuild the substrate and confirm opener v23 section 4.7.

Derives g under R-1' (per-SYSTEM join scoping), then reports:
  - anchor offset distribution (D3) and the D4 anchor denotation census
  - band thickness census
  - within-band principal-extent spread at the derived g
  - keep population and its minimum structure-relative bridged extent
  - discard population, its maximum, and its sample standard deviation
  - the decisive pair
"""
STATUS = 'CURRENT'

import sys
import json
from collections import Counter, defaultdict

sys.path.insert(0, '/home/claude')

import numpy as np

import substrate as S


def system_index(bounds, r):
    for i, (lo, hi) in enumerate(bounds):
        if lo <= r <= hi:
            return i
    raise S.SubstrateError('row %d attributable to no system' % r)


def main():
    pages = S.rendered_pages()
    offsets = Counter()
    d4_census = Counter()
    thickness = Counter()
    n_rules = 0

    # ---- pass 1: anchors, bands, and the scoped join-gap population --------
    per_page = []
    join_gap_widths = Counter()
    nonjoin_gaps = 0
    nonjoin_examples = []
    excluded_joincoincident = []

    for png, svg in pages:
        P = S.load_page(png, svg)
        nrows = P['nrows']
        geom = P['geom']
        sysinfo = []
        for si, sysd in enumerate(geom['systems']):
            width = sysd['extent']
            rows_for_sys = []
            for y in sysd['rule_rows']:
                n_rules += 1
                anc, off = S.anchor_for_rule(y, P['best_raw'], width, nrows)
                offsets[off] += 1
                mem = S.band_members(anc, P['span_lo'], P['span_hi'],
                                     P['total_dark'], width, nrows)
                if anc not in mem:
                    raise S.SubstrateError(
                        'anchor %d is not itself a band member on %s'
                        % (anc, P['label']))
                k = mem.index(anc)
                # D4: what the anchor denotes relative to the band it anchors.
                d4_census['anchor is row %d of a %d-row band' % (k, len(mem))] += 1
                thickness[len(mem)] += 1
                rows_for_sys.append(dict(y=y, anchor=anc, off=off, members=mem))
            sysinfo.append(dict(idx=si, x_lo=sysd['x_lo'], x_hi=sysd['x_hi'],
                                width=width, joins=sysd['joins'],
                                rules=rows_for_sys))
        per_page.append((P, sysinfo))

        # scoped gap population, per SYSTEM
        row = P['row']; xs = P['xs']; xe = P['xe']
        # index runs by row for quick lookup
        starts = {}
        if len(row):
            bnd = np.nonzero(np.r_[True, row[1:] != row[:-1], True])[0]
            for a, b in zip(bnd[:-1], bnd[1:]):
                starts[int(row[a])] = (a, b)
        for sd in sysinfo:
            x_lo, x_hi = sd['x_lo'], sd['x_hi']
            joins = np.array(sd['joins'], dtype=float)
            member_rows = set()
            for rr in sd['rules']:
                member_rows.update(rr['members'])
            for r in sorted(member_rows):
                if r not in starts:
                    continue
                a, b = starts[r]
                sx, ex = xs[a:b], xe[a:b]
                for i in range(len(sx) - 1):
                    gs = int(ex[i]) + 1
                    ge = int(sx[i + 1]) - 1
                    if ge < gs:
                        continue
                    w = ge - gs + 1
                    coincides = bool(len(joins)) and bool(
                        np.any((joins >= gs - 1) & (joins <= ge + 1)))
                    inside = (gs >= x_lo - 1) and (ge <= x_hi + 1)
                    if inside:
                        if coincides:
                            join_gap_widths[w] += 1
                        else:
                            nonjoin_gaps += 1
                            if len(nonjoin_examples) < 8:
                                nonjoin_examples.append(
                                    (P['label'], r, gs, ge, w))
                    elif coincides:
                        excluded_joincoincident.append((P['label'], r, gs, ge, w))

    print('RULES measured: %d' % n_rules)
    print('D3 anchor offset distribution: %s' % dict(sorted(offsets.items())))
    print('D4 anchor denotation census: %s' % dict(sorted(d4_census.items())))
    print('BAND THICKNESS census: %s' % dict(sorted(thickness.items())))
    print('JOIN-GAP widths (scoped, per-system joins): %s'
          % dict(sorted(join_gap_widths.items())))
    print('NON-JOIN gaps inside the scoped population: %d' % nonjoin_gaps)
    for ex in nonjoin_examples:
        print('   nonjoin example %r' % (ex,))
    print('EXCLUDED join-coincident gaps: %d' % len(excluded_joincoincident))
    for ex in excluded_joincoincident[:8]:
        print('   excluded %r' % (ex,))

    if nonjoin_gaps:
        raise S.SubstrateError('R-1 raise: a scoped gap does not coincide with '
                               'a join. Returns to Fable.')
    g = max(join_gap_widths) if join_gap_widths else 0
    print('g DERIVED (max measured join-gap width, R-1\'): %d px' % g)
    if excluded_joincoincident:
        mx = max(e[4] for e in excluded_joincoincident)
        if mx > g:
            raise S.SubstrateError('standing condition: excluded join-coincident '
                                   'gap of %d px exceeds retained max %d' % (mx, g))

    # ---- pass 2: bridged substrate at g ------------------------------------
    spread = Counter()
    keep_ratios = []
    keep_n = 0
    discard_ratios = []
    discard_ratios_B = []
    decisive = {}
    for P, sysinfo in per_page:
        nrows = P['nrows']
        ext, mass = S.principal_per_row(nrows, P['row'], P['xs'], P['xe'],
                                        P['ln'], g)
        keep_rows = {}
        for sd in sysinfo:
            for rr in sd['rules']:
                es = [int(ext[r]) for r in rr['members']]
                spread[max(es) - min(es)] += 1
                for r in rr['members']:
                    keep_rows[r] = sd['width']
        for r, w in keep_rows.items():
            keep_ratios.append(ext[r] / w)
            keep_n += 1

        # Discard: inked rows attributable to a system, not band members.
        # Two attributions are measured because the rulings do not fix one.
        #   A, WHOLE-PAGE: partition every row at midpoints between systems.
        #   B, BOUNDED:    each system's rule span extended by half the gap to
        #                  its neighbour, symmetric at the outer edges, so page
        #                  headers and footers are not attributable.
        rules_px = [sd['rules'] for sd in sysinfo]
        tops = [min(rr['anchor'] for rr in rs) for rs in rules_px]
        bots = [max(rr['anchor'] for rr in rs) for rs in rules_px]
        n = len(sysinfo)
        bounds_A, bounds_B = [], []
        for i in range(n):
            loA = 0 if i == 0 else (bots[i - 1] + tops[i]) // 2 + 1
            hiA = nrows - 1 if i == n - 1 else (bots[i] + tops[i + 1]) // 2
            bounds_A.append((loA, hiA))
            up = (tops[i] - bots[i - 1]) // 2 if i > 0 else None
            dn = (tops[i + 1] - bots[i]) // 2 if i < n - 1 else None
            if up is None:
                up = dn if dn is not None else 0
            if dn is None:
                dn = up
            bounds_B.append((max(0, tops[i] - up), min(nrows - 1, bots[i] + dn)))

        for bounds, sink in ((bounds_A, discard_ratios),
                             (bounds_B, discard_ratios_B)):
            for i, (lo, hi) in enumerate(bounds):
                w = sysinfo[i]['width']
                rr = np.arange(lo, hi + 1)
                inked = rr[P['total_dark'][lo:hi + 1] > 0]
                for r in inked:
                    if r in keep_rows:
                        continue
                    sink.append(ext[r] / w)

        for lbl, rowno in (('REP:sunless-04:2', 1522), ('LEG:sunless-06:3', 1566)):
            if P['label'] == lbl:
                i = system_index(bounds_A, rowno)
                w = sysinfo[i]['width']
                decisive['%s row %d' % (lbl, rowno)] = (
                    int(ext[rowno]), w, float(ext[rowno] / w))

    keep_ratios = np.array(keep_ratios)
    discard_ratios = np.array(discard_ratios)
    discard_ratios_B = np.array(discard_ratios_B)
    print('WITHIN-BAND principal-extent spread at g=%d: %s' % (g, dict(sorted(spread.items()))))
    print('  rules at or below 2 px: %d of %d'
          % (sum(v for k, v in spread.items() if k <= 2), n_rules))
    print('KEEP population: %d band rows, min structure-relative bridged extent %.4f'
          % (keep_n, keep_ratios.min()))
    print('DISCARD population: %d rows, max %.4f, sample sd %.4f'
          % (len(discard_ratios), discard_ratios.max(),
             discard_ratios.std(ddof=1)))
    print('DECISIVE PAIR: %s' % decisive)
    print('DISCARD population B (bounded): %d rows, max %.4f, sample sd %.4f'
          % (len(discard_ratios_B), discard_ratios_B.max(),
             discard_ratios_B.std(ddof=1)))
    for nm, pop in (('A whole-page', discard_ratios), ('B bounded', discard_ratios_B)):
        thr = pop.max() + pop.std(ddof=1)
        print('SITE-1 clearance threshold under %s: %.4f, interval (%.4f, %.4f), margin %.2f'
              % (nm, thr, pop.max(), keep_ratios.min(), keep_ratios.min() - thr))
    json.dump(dict(g=int(g), keep_n=int(keep_n),
                   keep_min=float(keep_ratios.min()),
                   discard_n=int(len(discard_ratios)),
                   discard_max=float(discard_ratios.max()),
                   discard_sd=float(discard_ratios.std(ddof=1))),
              open('/home/claude/substrate_result.json', 'w'), indent=1)


if __name__ == '__main__':
    main()
