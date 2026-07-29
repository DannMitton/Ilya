"""Phase 0 gate 0.2: legacy sanity control, piece 01 page 1 (TOP-LEVEL png).

Runs envelope.run and writes rec.json for scoring by _rhythm_spike/score_rng.ts.
Optional --negative-control blanks one measure's worth of ink from a COPY of
the page and re-runs, so the gate is shown failing on known-bad input.
"""
STATUS = 'CURRENT'

import sys
import json
import os

sys.path.insert(0, '/home/claude')

H = '/home/claude/e16'
PIECE = 'mussorgsky---sunless-01---within-four-walls'
PNG = H + '/output/' + PIECE + '/page1_300dpi.png'
GT = H + '/output/' + PIECE + '/ground-truth.json'

import envelope


def run(png_path, out_path):
    cfg = dict(png=png_path,
               clef=('F', 4), key=2, octaveChange=0, vocal=[0, 2, 4, 6],
               measures_per_system=[3, 3, 3, 3],
               gt=GT, page=1)
    ro, ctx, msum, G, rests, events = envelope.run(cfg, None)
    # D1: full destructure of the producer's return, six values, named.
    assert isinstance(ro, dict), 'ro is not a dict: %r' % type(ro)
    print('PROVENANCE png=%s md5-checked-by-caller' % png_path)
    print('DENOTATION ro keys: %s' % sorted(ro.keys())[:12])
    with open(out_path, 'w') as f:
        json.dump(ro, f)
    return ro


if __name__ == '__main__':
    if '--negative-control' in sys.argv:
        import cv2
        import numpy as np
        img = cv2.imread(PNG, cv2.IMREAD_GRAYSCALE)
        assert img is not None
        # Blank a slab covering roughly one measure of the VOCAL staff of
        # system 1. Located by measurement, not by guess: the page's first
        # rule band is rows 166..251 (longest_run 2210 on a 2480 px page),
        # and legacy renders put the vocal part on staff index 0. Stems and
        # ledger lines reach about 75 px either side, so rows 90..340 covers
        # the notation; columns 200..900 is measure 1 of a 3-measure,
        # 2210 px indented system. Genuinely defective input.
        img[90:340, 200:900] = 255
        bad = '/home/claude/_negctl_p01p1.png'
        cv2.imwrite(bad, img)
        run(bad, '/home/claude/_negctl_rec.json')
        print('NEGATIVE CONTROL page written, score it and expect degradation')
    else:
        run(PNG, '/home/claude/rec_p01p1.json')
        print('OK')
