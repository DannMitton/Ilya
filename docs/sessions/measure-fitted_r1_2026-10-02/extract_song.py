# Pyodide user script for pyrun2.mjs: main(args, paths). One song of the scan (or of the render), read the way the app's Worker reads it
# (envelope.run, chained across the pages, no `vocal` list), and at each head the reader finds: the fits, the lines, the beam traces, a patch.
import json, base64, time
import numpy as np
import envelope, reader, run_page2, fitted
from beams import find_stem

def main(args, paths):
    t0 = time.time(); out_pages = []; ctx_in = None; offset = 0
    for pi, p in enumerate(paths):
        pno = pi + 1
        cfg = dict(png=p, clef=('G', 2), key=int(args['key']), octaveChange=0, pieceId='m', page=pno)
        t1 = time.time()
        try:
            ro, ctx_next, msum, G, rests, events = envelope.run(cfg, ctx_in)
        except Exception as e:
            print('PY:page', args['pages'][pi], 'RAISES', repr(e)[:120]); out_pages.append(dict(page=args['pages'][pi], error=repr(e)[:300], notes=[])); continue
        ctx_in = ctx_next
        img, staves, s, vocal, nl = G['img'], G['staves'], G['s'], G['vocal'], G['nl_safe']
        line_t = run_page2._staff_line_thickness(img, staves, s)
        dark = 1.0 - img.astype(np.float64) / 255.0
        heads = G['heads']
        ev_notes = [k for k, e in enumerate(events) if e['kind'] == 'note']
        assert len(ev_notes) == len(heads), (len(ev_notes), len(heads))
        # event -> note of the page's ro, by the order the envelope emits them: systems in `order`, x ascending
        order = G['voices']['order']; seq_ev = []
        for syi in order:
            if syi is None: continue
            seq_ev += sorted([k for k in ev_notes if events[k]['sys'] == syi], key=lambda k: events[k]['x'])
        ro_notes = ro['verses'][0]['notes']
        seq_ro = [i for i, n in enumerate(ro_notes) if n['type'] == 'note']
        # An event that falls past the page's last barline is not emitted (the envelope's segments end at the last barline):
        # walk the two sequences together and skip an event whose x is not the next note's.
        ro_of_event = {}; q = 0; dropped = []
        for i in seq_ro:
            xid = int(ro_notes[i]['id'].split('-')[1])
            while q < len(seq_ev) and events[seq_ev[q]]['x'] != xid: dropped.append(seq_ev[q]); q += 1
            assert q < len(seq_ev), ('unmatched ro note', ro_notes[i]['id'])
            ro_of_event[seq_ev[q]] = i; q += 1
        dropped += seq_ev[q:]
        notes = []
        for h, k in zip(heads, ev_notes):
            staff = [int(y) for y in staves[vocal[h['sys']]]]
            st = find_stem(nl, h['x'], h['y'], s)
            stem = dict(x=int(st['x']), dir=int(st['dir']), end_y=int(st['end_y']), length=float(st['length'])) if st else None
            n = fitted.extract_note(dark, h, staff, line_t, s, stem)
            n['event'] = k; n['ro_local'] = ro_of_event.get(k); n['ro_global'] = (offset + ro_of_event[k]) if k in ro_of_event else None
            n['L'] = h['L']; n['O'] = int(h['O']); n['midi'] = events[k]['midi']; n['read_dur'] = (None if events[k]['dur'] is None else [events[k]['dur'].numerator, events[k]['dur'].denominator]); n['read_abstain'] = events[k]['dur_abstain']
            notes.append(n)
        fitted.link_beams(dark, notes, s, line_t)
        for n in notes:
            if n['patch'] is not None:
                pt = n['patch']; pt['shape'] = list(pt['u8'].shape); pt['u8'] = base64.b64encode(pt['u8'].tobytes()).decode()
        offset += len(ro_notes)
        out_pages.append(dict(page=args['pages'][pi], s=float(s), line_t=float(line_t), shape=list(img.shape), notes=notes, n_ro=len(ro_notes), seconds=time.time() - t1))
        print('PY:page', args['pages'][pi], len(heads), 'heads', round(time.time() - t1, 1), 's')
    return dict(pages=out_pages, seconds=time.time() - t0)
