# Pyodide user script for pyrun2.mjs: main(args, paths). Runs the app's own geometry (read_page_pitch, no `vocal` list) on each
# page and fits the forms (fitted.py) at every head the reader finds on a voice staff. Used for step 3.2 (render pages) and later steps.
import json, math, time
import numpy as np
import reader, run_page2, fitted
from beams import find_stem

def main(args, paths):
    out = []
    for i, p in enumerate(paths):
        t0 = time.time()
        cfg = dict(png=p, clef=('G', 2), key=int(args['key']), octaveChange=0, pieceId='m')
        try: recs, G = reader.read_page_pitch(cfg)
        except Exception as e:
            print('PY:page', args['pages'][i], 'RAISES', repr(e)[:160]); out.append(dict(page=args['pages'][i], error=repr(e)[:300], heads=[])); continue
        img, staves, s, vocal, nl = G['img'], G['staves'], G['s'], G['vocal'], G['nl_safe']
        line_t = run_page2._staff_line_thickness(img, staves, s)
        dark = 1.0 - img.astype(np.float64) / 255.0
        page = dict(page=args['pages'][i], s=float(s), line_t=float(line_t), shape=list(img.shape),
                    staves=[[int(y) for y in staves[v]] for v in vocal], heads=[])
        for r in recs:
            staff = [int(y) for y in staves[vocal[r['sys']]]]
            st = find_stem(nl, r['x'], r['y'], s)
            stem = dict(x=int(st['x']), dir=int(st['dir']), end_y=int(st['end_y']), length=float(st['length'])) if st else None
            rec = dict(x=int(r['x']), y=int(r['y']), sys=int(r['sys']), hollow=bool(r.get('hollow')), midi=int(r['midi']), L=r['L'], O=int(r['O']),
                       reader_stem=stem)
            try:
                hf = fitted.fit_head(dark, r['x'], r['y'], staff, line_t, s, stem, bool(r.get('hollow')))
            except Exception as e:
                hf = None; rec['head_error'] = repr(e)
            rec['head'] = hf
            if hf is not None:
                try: rec['stem'] = fitted.fit_stem(dark, hf, stem, staff, [tuple(l) for l in hf['lines']], line_t, s)
                except Exception as e: rec['stem'] = None; rec['stem_error'] = repr(e)
                try: rec['dot'] = fitted.fit_dot(dark, hf, hf['lines'], line_t, s)
                except Exception as e: rec['dot'] = None; rec['dot_error'] = repr(e)
            page['heads'].append(rec)
        page['seconds'] = time.time() - t0
        print('PY:page', args['pages'][i], len(recs), 'heads', round(page['seconds'], 1), 's')
        out.append(page)
    return out
