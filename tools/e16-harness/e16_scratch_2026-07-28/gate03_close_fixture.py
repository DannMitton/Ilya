"""Phase 0 gate 0.3: the close reference fixture, live read.

Never writes close_recognized_FROZEN_2026-07-27.json. That artifact is an
unrepeatable blind read and is chmod 444 in this container.
"""
STATUS = 'CURRENT'

import sys
import json
import os

sys.path.insert(0, '/home/claude')

H = '/home/claude/e16'
PNG = H + '/close-fixture/close-fixture-page.png'
GT = H + '/close-fixture/close-fixture-ground-truth.json'
FROZEN = H + '/close-fixture/close_recognized_FROZEN_2026-07-27.json'

import envelope


def run(png_path, out_path):
    cfg = dict(png=png_path,
               clef=('G', 2), key=0, octaveChange=0, vocal=[0],
               measures_per_system=[6],
               gt=GT, page=1)
    ro, ctx, msum, G, rests, events = envelope.run(cfg, None)
    assert isinstance(ro, dict), 'ro is not a dict: %r' % type(ro)
    ms = ro['measures']
    assert isinstance(ms, list), 'measures is not a list'
    print('DENOTATION measures: n=%d, integrity values=%s'
          % (len(ms), [m.get('integrity') for m in ms]))
    with open(out_path, 'w') as f:
        json.dump(ro, f)
    return ro


if __name__ == '__main__':
    import hashlib
    assert hashlib.md5(open(FROZEN, 'rb').read()).hexdigest() == \
        'b3be77990e8b28a774f1616eb6aa9365', 'FROZEN artifact md5 drifted'
    print('PROVENANCE frozen artifact md5 confirmed, untouched')

    if '--negative-control' in sys.argv:
        import cv2
        img = cv2.imread(PNG, cv2.IMREAD_GRAYSCALE)
        assert img is not None
        # One measure's worth of ink erased from a COPY. Region located by
        # measurement in the caller, printed below for the record.
        y0, y1, x0, x1 = [int(v) for v in sys.argv[sys.argv.index(
            '--negative-control') + 1].split(',')]
        img[y0:y1, x0:x1] = 255
        bad = '/home/claude/_negctl_close.png'
        cv2.imwrite(bad, img)
        print('NEGATIVE CONTROL blanked rows %d:%d cols %d:%d' % (y0, y1, x0, x1))
        run(bad, '/home/claude/_negctl_close_rec.json')
    else:
        ro = run(PNG, '/home/claude/rec_close.json')
        ms = ro['measures']
        print('CHECK measures[2].integrity =', repr(ms[2].get('integrity')))
        print('CHECK measures[3].integrity =', repr(ms[3].get('integrity')))
