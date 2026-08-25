"""N.95/N.96 ship 1 gate: the 23 render fixture pages must not move.

Runs one copy of the reader over every legacy rendered page and prints a
canonical digest per page: the `nl` array after `remove_lines_safe`, the
detected barline set, the derived per-measure sums, and a hash of the whole
`run_page2.run` return. Point it at two copies of the reader and diff the
output; any line that differs is a fixture that moved.

    python3 gate06_fixture_identity.py /path/to/reader/at/HEAD > old.txt
    python3 gate06_fixture_identity.py /path/to/reader/working   > new.txt
    diff old.txt new.txt

WHY THIS EXISTS. The barline and duration work of 2026-08-24 was checked
against 4 sampled render pages and looked inert. Run over all 23 it moved 5 of
them: `hollow.merge_heads` was dropping the genuine hollow chords sunless-06
engraves on a shared stem with a filled head, and the widened barline width
bound was counting the thick stroke of a final barline as a second barline. A
sample is not the gate.

`measures_per_system` is deliberately OMITTED from every cfg, so the pages run
the browser's own path where the count is derived from detected barlines. That
is what puts `detect_barlines` under this gate at all.

STATUS = 'CURRENT'
"""
import sys
import os
import re
import json
import glob
import hashlib

if len(sys.argv) != 2:
    sys.exit('usage: gate06_fixture_identity.py <dir-holding-the-reader-modules>')
sys.path.insert(0, sys.argv[1])

import numpy as np
import reader
import run_page2

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', 'output'))

# Clef and key are the caller's to supply (the reader reads neither from the
# page), and they come from each piece's own ground truth.
CFG = {
    'mussorgsky---sunless-01---within-four-walls': (('F', 4), 2, 0),
    'mussorgsky---sunless-02---you-did-not-recognize-me': (('G', 2), 2, -1),
    'mussorgsky---sunless-03---finished-is-the-noisy-idle-day': (('G', 2), 0, -1),
    'mussorgsky---sunless-04---be-bored': (('G', 2), 2, 0),
    'mussorgsky---sunless-05---elegy': (('G', 2), 0, -1),
    'mussorgsky---sunless-06---on-the-river': (('G', 2), 7, -1),
}


def pages():
    """The 23 legacy rendered pages: top level only, no repaired or
    preinjection variant, in piece then page order."""
    out = []
    for piece in sorted(CFG):
        found = glob.glob(os.path.join(OUT, piece, 'page*_300dpi.png'))
        for p in sorted(found, key=lambda q: int(re.search(r'page(\d+)_', q).group(1))):
            if re.search(r'page\d+_300dpi\.png$', os.path.basename(p)):
                out.append((piece, p))
    return out


def canon(o):
    return json.dumps(o, sort_keys=True, separators=(',', ':'), default=str)


def musical(ro):
    """`ro` with the two things N.97 changed BY DESIGN removed: the event id
    scheme (measure and onset and x became measure and x, Dann's ruling of
    2026-08-24) and the additive `readClefKey` block.

    `run` below still hashes the whole thing, so a re-key still shows up in
    this gate rather than hiding. What `runMusical` adds is the ability to say
    which kind of move it was: a fixture whose `run` differs and whose
    `runMusical` matches was renamed, and one whose `runMusical` differs read
    the page differently. Only the second is a fixture that MOVED."""
    stripped = dict(ro)
    stripped.pop('readClefKey', None)
    stripped['verses'] = [dict(v, notes=[{k: n[k] for k in n if k != 'id'} for n in v['notes']])
                          for v in ro['verses']]
    return stripped


def main():
    found = pages()
    if len(found) != 23:
        print('WARNING: expected 23 legacy pages, found %d' % len(found), file=sys.stderr)
    for piece, png in found:
        clef, key, oc = CFG[piece]
        cfg = dict(png=png, clef=clef, key=key, octaveChange=oc, pieceId=piece)
        rel = os.path.relpath(png, OUT)
        try:
            G = reader.read_page_geometry(cfg)
            nl_hash = hashlib.sha256(np.ascontiguousarray(G['nl']).tobytes()).hexdigest()
            bl = reader.detect_barlines(G['nl'], G['staves'], G['vocal'], G['s'])
            ro, msum, _G2, rests, _events, read_metre = run_page2.run(cfg)
            notes = ro['verses'][0]['notes']
            row = dict(page=rel, s=round(float(G['s']), 4), staves=len(G['staves']),
                       vocal=list(G['vocal']), nl=nl_hash, barlines=canon(bl),
                       notes=len(notes), rests=len(rests), metre=str(read_metre),
                       msum=canon({str(k): str(v) for k, v in sorted(msum.items())}),
                       run=hashlib.sha256(canon(ro).encode()).hexdigest(),
                       runMusical=hashlib.sha256(canon(musical(ro)).encode()).hexdigest())
        except Exception as e:                        # a page that raises is a moved page
            row = dict(page=rel, error='%s: %s' % (type(e).__name__, e))
        print(canon(row))


if __name__ == '__main__':
    main()
