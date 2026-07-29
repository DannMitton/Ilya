"""Phase 0 gate 0.5: the oracle gate over all 47 rendered pages.

Compares reader.detect_staves' staff count against oracle-counts.json, and
independently reproduces the expectation side LIVE from all 47 SVGs via
oracle.page_staff_count, reporting the drift.

Negative controls (each on a COPY, never on the corpus):
  --negctl-white   white out one staff's five rule bands in a PNG copy
  --negctl-declass declass one <g class="staff"> in an SVG copy
"""
STATUS = 'CURRENT'

import sys
import os
import re
import json
import glob
from collections import Counter

sys.path.insert(0, '/home/claude')

import cv2
import numpy as np

import reader
import oracle

H = '/home/claude/e16'
COUNTS = H + '/reader/oracle-counts.json'


def page_key(png_path):
    """Build the oracle-counts.json key for a rendered page PNG."""
    rel = os.path.relpath(png_path, H + '/output')
    parts = rel.split(os.sep)
    piece = parts[0]
    tag = 'REP' if 'repaired' in parts else 'LEG'
    n = int(re.match(r'page(\d+)_300dpi\.png$', parts[-1]).group(1))
    return '%s:%s:%d' % (tag, piece, n), png_path.replace(
        '_300dpi.png', '.svg')


def collect():
    pngs = sorted(p for p in glob.glob(
        H + '/output/**/page*_300dpi.png', recursive=True)
        if 'preinjection' not in p)
    assert len(pngs) == 47, 'expected 47 rendered pages, found %d' % len(pngs)
    return pngs


def run(pngs, counts, svg_override=None):
    correct = loud = silent = 0
    silent_repaired = 0
    detected_dist = Counter()
    svg_drift = []
    rows = []
    for png in pngs:
        key, svg = page_key(png)
        if svg_override and key in svg_override:
            svg = svg_override[key]
        assert key in counts, 'no oracle entry for %s' % key
        expected = counts[key]['count']

        # Expectation side, reproduced live from the SVG.
        try:
            live_total, per_system = oracle.page_staff_count(svg)
            if live_total != expected:
                svg_drift.append((key, expected, live_total))
        except oracle.OracleError as e:
            svg_drift.append((key, expected, 'ORACLE-RAISE: %s' % e))
            live_total = None

        img = cv2.imread(png, cv2.IMREAD_GRAYSCALE)
        assert img is not None, 'unreadable png %s' % png
        try:
            # D1: detect_staves returns a TUPLE (checked, s). Destructure it.
            checked, s = reader.detect_staves(img, page=key)
            assert isinstance(checked, list), 'checked is not a list'
            assert all(len(st) == 5 for st in checked), \
                'a returned group is not a 5-line staff'
            n = len(checked)
        except RuntimeError as e:
            n = None
            del e
        detected_dist[n] += 1
        if n is None:
            loud += 1
            rows.append((key, expected, 'LOUD'))
        elif n == expected:
            correct += 1
        else:
            silent += 1
            if key.startswith('REP:'):
                silent_repaired += 1
            rows.append((key, expected, n))
    return dict(correct=correct, loud=loud, silent=silent,
                silent_repaired=silent_repaired,
                dist=detected_dist, drift=svg_drift, rows=rows)


if __name__ == '__main__':
    counts = json.load(open(COUNTS))
    pngs = collect()

    if '--negctl-white' in sys.argv:
        # White out one staff's five rule bands on a COPY of LEG sunless-01 p1.
        src = [p for p in pngs if 'sunless-01' in p and 'repaired' not in p
               and 'page1_' in p][0]
        img = cv2.imread(src, cv2.IMREAD_GRAYSCALE)
        for r in range(160, 258):
            img[r, :] = 255
        dst = '/home/claude/_negctl_oracle_page.png'
        cv2.imwrite(dst, img)
        key, svg = page_key(src)
        checked, s = reader.detect_staves(cv2.imread(dst, cv2.IMREAD_GRAYSCALE),
                                          page=key)
        print('NEGCTL-WHITE %s expected=%d detected=%d'
              % (key, counts[key]['count'], len(checked)))
        sys.exit(0)

    if '--negctl-declass' in sys.argv:
        src = [p for p in pngs if 'sunless-01' in p and 'repaired' not in p
               and 'page1_' in p][0]
        key, svg = page_key(src)
        text = open(svg, encoding='utf-8').read()
        i = text.find('class="staff"')
        assert i > 0
        bad = text[:i] + 'class="stff"' + text[i + len('class="staff"'):]
        dst = '/home/claude/_negctl_oracle.svg'
        open(dst, 'w', encoding='utf-8').write(bad)
        try:
            oracle.page_staff_count(dst)
            print('NEGCTL-DECLASS DID NOT RAISE -- control failed')
        except oracle.OracleError as e:
            print('NEGCTL-DECLASS raised as required: %s' % e)
        sys.exit(0)

    r = run(pngs, counts)
    print('ORACLE GATE over %d rendered pages' % len(pngs))
    print('  correct=%d loud=%d silent=%d silent_repaired=%d'
          % (r['correct'], r['loud'], r['silent'], r['silent_repaired']))
    print('  D3 detected-count distribution: %s'
          % dict(sorted(r['dist'].items(), key=lambda kv: (kv[0] is None,
                                                           kv[0]))))
    print('  SVG expectation drift against oracle-counts.json: %d'
          % len(r['drift']))
    for d in r['drift']:
        print('    DRIFT %r' % (d,))
    for row in r['rows']:
        print('  NONCONFORMING %s expected=%s got=%s' % row)
