"""Counterfactual: if the pre-structure gate ADMITTED the short system's
segment, would the rest of detect_staves recover it?

This isolates the blocker. It changes nothing in the reader: it reimplements
detect_staves' post-gate logic verbatim from the pinned source and feeds it a
different accepted-row set. Its only purpose is to tell Fable whether the
defect is the gate's admission rule alone or whether it is deeper.

Also reports, for all 47 pages, what a candidate generator whose law is
COMPLETENESS would have to admit, and what it would cost elsewhere.
"""
STATUS = 'CURRENT'

import sys
from collections import Counter

sys.path.insert(0, '/home/claude')

import numpy as np
import cv2

import e16_measure_substrate as S  # renamed: reader/substrate.py now owns the name `substrate`
import reader


def post_gate(rowfrac, gate):
    """detect_staves' logic AFTER the gate, transcribed from the pinned source.

    Returns (checked, s, all_group_sizes) or raises RuntimeError exactly as the
    reader does on a contaminated group.
    """
    line_rows = np.where(rowfrac > gate)[0]
    if len(line_rows) == 0:
        raise RuntimeError('no staff lines')
    lines = []
    cur = [line_rows[0]]
    for r in line_rows[1:]:
        if r - cur[-1] <= 3:
            cur.append(r)
        else:
            lines.append(int(np.mean(cur)))
            cur = [r]
    lines.append(int(np.mean(cur)))
    lines = np.array(lines)
    diffs = np.diff(lines)
    intra = diffs[diffs < np.median(diffs) * 1.6]
    s = float(np.median(intra))
    big = sorted(d for d in diffs if d > 1.3 * s)
    break_thr = (1.3 * s + big[0]) / 2.0 if big else 1.7 * s
    staves = []
    cur = [lines[0]]
    for i in range(1, len(lines)):
        if lines[i] - cur[-1] > break_thr:
            staves.append(cur)
            cur = [lines[i]]
        else:
            cur.append(lines[i])
    staves.append(cur)
    sizes = [len(st) for st in staves]
    checked = []
    for st in staves:
        if len(st) <= 2:
            continue
        elif len(st) == 5:
            checked.append(st)
        else:
            raise RuntimeError('contaminated group of %d lines (all: %r)'
                               % (len(st), sizes))
    return checked, s, sizes


def main():
    PNG = ('/home/claude/e16/output/mussorgsky---sunless-05---elegy/'
           'page5_300dpi.png')
    img = cv2.imread(PNG, cv2.IMREAD_GRAYSCALE)
    rowfrac = (img < 128).mean(axis=1)
    derived = reader._derive_rowfrac_gate(rowfrac)
    print('LEG:sunless-05:5, derived gate %.6f' % derived)
    for g in (derived, 0.30, 0.28, 0.26, 0.20, 0.15):
        try:
            checked, s, sizes = post_gate(rowfrac, g)
            print('  gate %.4f -> %d staves, s=%.2f, group sizes %s'
                  % (g, len(checked), s, sizes))
        except RuntimeError as e:
            print('  gate %.4f -> RAISES: %s' % (g, e))

    print()
    print('Corpus-wide: the lowest gate each page tolerates before its result '
          'changes, and what the SVG says its narrowest system is.')
    import json
    counts = json.load(open('/home/claude/e16/reader/oracle-counts.json'))
    for png, svg in S.rendered_pages():
        lbl = S.page_label(png)
        key = None
        for k in counts:
            if k.split(':')[0] == lbl.split(':')[0] and \
               k.endswith(':' + lbl.split(':')[2]) and \
               lbl.split(':')[1] in k:
                key = k
                break
        img = cv2.imread(png, cv2.IMREAD_GRAYSCALE)
        rf = (img < 128).mean(axis=1)
        d = reader._derive_rowfrac_gate(rf)
        P = S.load_page(png, svg)
        widths = sorted(set(sd['extent'] for sd in P['geom']['systems']))
        narrow_frac = min(widths) / P['W']
        try:
            base = len(post_gate(rf, d)[0])
        except RuntimeError:
            base = None
        # does the page carry systems of MORE THAN ONE width?
        mixed = len(widths) > 1
        exp = counts[key]['count'] if key else '?'
        flag = ''
        if mixed:
            flag = '  <-- MIXED WIDTHS %s' % widths
        if base != exp:
            flag += '  <-- gate result %s vs oracle %s' % (base, exp)
        if mixed or base != exp:
            print('  %-28s gate %.4f  narrowest %.4f of page  %s'
                  % (lbl, d, narrow_frac, flag))


if __name__ == '__main__':
    main()
