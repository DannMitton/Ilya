"""N.95 ship 1: what the reader makes of the Lamm scan, page 1.

Reports the barline count per system, the duration confidence split with its
abstain reasons, a per-system alignment against ground truth, and the
per-measure duration-sum diagnostic the brief of 2026-08-24 asked for.

    python3 gate07_scan_page1.py <dir-holding-the-reader-modules>

DIAGNOSTIC ONLY. Nothing here feeds a detection, and ground truth is read only
after the reader has finished, never before.

NEVER COMPARE THESE COUNTS ACROSS TOOLCHAINS. The same page reads 55 notes at
cv2 4.13.0, 57 at 4.11.0, and 57 at Pyodide's 4.9.0. Run the before and after
on ONE machine and compare those, which is what this script is for.

STATUS = 'CURRENT'
"""
import sys
import os
import json
from fractions import Fraction
from collections import Counter

if len(sys.argv) != 2:
    sys.exit('usage: gate07_scan_page1.py <dir-holding-the-reader-modules>')
sys.path.insert(0, sys.argv[1])

import numpy as np
import reader
import run_page2

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, '..'))
SCAN = os.path.join(ROOT, 'scans', 'raster400-1.png')
GT = os.path.join(ROOT, 'output',
                  'mussorgsky---sunless-01---within-four-walls', 'ground-truth.json')

# Memo N.95 established this correspondence by matching every printed Cyrillic
# syllable on the page against the ground truth's own `syllableText`: scan page
# 1 is ground-truth measureIndex 0 through 8, three measures to a system.
SYS_MEASURES = {0: [0, 1, 2], 1: [3, 4, 5], 2: [6, 7, 8]}

# The 1931 Lamm print engraves this bass line in treble clef an octave above
# sounding pitch, while the Finale-sourced ground truth is in bass clef at
# sounding pitch. The gap is a property of the corpus, not of the reader.
OCTAVE = -12

# Memo N.95's own matching rule, kept so the numbers stay comparable to it.
GAP_PENALTY = 5.0


def frac(d):
    return None if d is None else Fraction(d['numerator'], d['denominator'])


def align(rs, gs):
    """Needleman-Wunsch over octave-corrected MIDI, substitution cost in
    semitones, gap penalty GAP_PENALTY."""
    n, m = len(rs), len(gs)
    D = [[0.0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        D[i][0] = D[i - 1][0] + GAP_PENALTY
    for j in range(1, m + 1):
        D[0][j] = D[0][j - 1] + GAP_PENALTY

    def sub(i, j):
        rm = rs[i - 1].get('midi')
        return GAP_PENALTY if rm is None else abs((rm + OCTAVE) - gs[j - 1]['midi'])

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            D[i][j] = min(D[i - 1][j - 1] + sub(i, j),
                          D[i - 1][j] + GAP_PENALTY,
                          D[i][j - 1] + GAP_PENALTY)
    i, j, pairs = n, m, []
    while i > 0 and j > 0:
        if D[i][j] == D[i - 1][j - 1] + sub(i, j):
            pairs.append((rs[i - 1], gs[j - 1]))
            i -= 1
            j -= 1
        elif D[i][j] == D[i - 1][j] + GAP_PENALTY:
            i -= 1
        else:
            j -= 1
    return list(reversed(pairs))


def main():
    cfg = dict(png=SCAN, clef=('G', 2), key=2, octaveChange=0,
               pieceId='mussorgsky---sunless-01---within-four-walls')

    G = reader.read_page_geometry(cfg)
    s = G['s']
    bl = reader.detect_barlines(G['nl'], G['staves'], G['vocal'], s)
    print('s=%.2f  staves=%d  systems=%d  vocal=%s'
          % (s, len(G['staves']), len(G['vocal']), list(G['vocal'])))
    print('barlines per system: %s  (total %d)'
          % ({k: v for k, v in sorted(bl.items())}, sum(len(v) for v in bl.values())))

    ro, msum, _G2, rests, _events, _metre = run_page2.run(cfg)
    notes = [n for n in ro['verses'][0]['notes'] if n['type'] == 'note']
    conf = [n for n in notes if n['duration'] is not None]
    print('reader: %d notes, %d confident duration, %d abstained (%.1f%%), %d rests'
          % (len(notes), len(conf), len(notes) - len(conf),
             100.0 * (len(notes) - len(conf)) / max(1, len(notes)), len(rests)))
    print('abstain reasons: %s' % dict(Counter(
        n.get('abstain', {}).get('duration') for n in notes if n['duration'] is None)))

    gt = json.load(open(GT))
    gtn = [n for n in gt['verses'][0]['notes'] if n.get('midi') is not None]

    mps = [max(1, len(bl.get(i, []))) for i in range(len(G['vocal']))]
    base = list(np.cumsum([0] + mps)[:-1])
    by_sys = {i: [] for i in range(len(G['vocal']))}
    for n in notes:
        for i in range(len(mps)):
            if base[i] <= n['measureIndex'] < base[i] + mps[i]:
                by_sys[i].append(n)
                break

    tot = dict(pairs=0, conf=0, right=0, pitch=0, pitch_ok=0)
    for i in sorted(SYS_MEASURES):
        gs = [n for n in gtn if n['measureIndex'] in SYS_MEASURES[i]]
        rs = by_sys.get(i, [])
        pairs = align(rs, gs)
        c = [(r, g) for r, g in pairs if r['duration'] is not None]
        right = [1 for r, g in c if frac(r['duration']) == frac(g['duration'])]
        pr = [(r, g) for r, g in pairs if r.get('midi') is not None]
        pok = [1 for r, g in pr if r['midi'] + OCTAVE == g['midi']]
        print('sys %d: reader %2d, GT %2d, matched %2d | confident dur %2d exact %2d '
              '| pitch compared %2d exact %2d'
              % (i, len(rs), len(gs), len(pairs), len(c), len(right), len(pr), len(pok)))
        tot['pairs'] += len(pairs); tot['conf'] += len(c); tot['right'] += len(right)
        tot['pitch'] += len(pr); tot['pitch_ok'] += len(pok)
    print('TOTAL matched %d | confident durations %d, exact %d | pitch %d of %d'
          % (tot['pairs'], tot['conf'], tot['right'], tot['pitch_ok'], tot['pitch']))

    print('--- per-measure duration sum against the time signature ---')
    exp = {d['index']: Fraction(d['expectedDuration']['numerator'],
                                d['expectedDuration']['denominator'])
           for d in gt['measureDurations']}
    for i in sorted(SYS_MEASURES):
        for seg in range(mps[i]):
            mi = int(base[i]) + seg
            got = msum.get(mi)
            gt_mi = SYS_MEASURES[i][seg] if seg < len(SYS_MEASURES[i]) else None
            want = exp.get(gt_mi)
            verdict = 'abstained' if got is None else ('match' if got == want else 'MISMATCH')
            print('  sys %d measure %d (GT %s): read %s, expected %s -> %s'
                  % (i, mi, gt_mi, got, want, verdict))


if __name__ == '__main__':
    main()
