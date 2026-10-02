# Pyodide user script for pyrun2.mjs: main(args, paths). The whole trial for one song, end to end, on the app's own path:
#  stage A  read the song as the Worker does (envelope.run chained across the pages, no `vocal` list) and extract the fits and patches;
#  stage B  classify, pass 1, pass 2, the round trip (fitted.trial_song);
#  stage C  read the song again with the trial's lengths put in place of the reader's (cfg['fitted_lengths']), every other field as the
#           reader derives it, and merge the pages as the Worker does.
# args: key, pages (numbers), totals_only (a test-only song: nothing note by note leaves this function), tiles (write overlay tiles).
import json, base64, time
from fractions import Fraction
import numpy as np
import cv2
import envelope, reader, run_page2, fitted
from beams import find_stem

def _frac(v):
    if hasattr(v, 'numerator'): return dict(numerator=int(v.numerator), denominator=int(v.denominator))
    raise TypeError(repr(type(v)))

def chain_read(paths, key, lengths_by_page=None):
    """The Worker's read_pages, reduced: returns the merged ro and per-page (ro, G, events) for stage A."""
    ctx_in = None; notes = []; measures = []; ro_last = None; failed = []; pages = []
    for pi, p in enumerate(paths):
        cfg = dict(png=p, clef=('G', 2), key=int(key), octaveChange=0, pieceId='m', page=pi + 1)
        if lengths_by_page is not None and lengths_by_page.get(pi) is not None: cfg['fitted_lengths'] = lengths_by_page[pi]
        try: ro, ctx_next, msum, G, rests, events = envelope.run(cfg, ctx_in)
        except Exception as e:
            failed.append(pi + 1); pages.append(None); continue
        ctx_in = ctx_next; ro_last = ro
        notes.extend(ro['verses'][0]['notes']); measures.extend(ro.get('measures', []))
        pages.append((ro, G, events, len(ro['verses'][0]['notes'])))
    merged = dict(ro_last); merged['verses'] = [dict(verseNumber=1, notes=notes)]; merged['measures'] = measures
    return merged, pages, failed

def main(args, paths):
    T0 = time.time(); totals_only = bool(args.get('totals_only'))
    # stage A
    cfg_key = args['key']
    ctx_in = None; offset = 0; pg_list = []; fails = []
    ta = time.time()
    for pi, p in enumerate(paths):
        cfg = dict(png=p, clef=('G', 2), key=int(cfg_key), octaveChange=0, pieceId='m', page=pi + 1)
        try: ro, ctx_next, msum, G, rests, events = envelope.run(cfg, ctx_in)
        except Exception as e:
            fails.append(args['pages'][pi]); pg_list.append(dict(page=args['pages'][pi], error=repr(e)[:200], notes=[], idx=pi)); continue
        ctx_in = ctx_next
        img, staves, s, vocal, nl = G['img'], G['staves'], G['s'], G['vocal'], G['nl_safe']
        line_t = run_page2._staff_line_thickness(img, staves, s)
        dark = 1.0 - img.astype(np.float64) / 255.0
        heads = G['heads']; ev_notes = [k for k, e in enumerate(events) if e['kind'] == 'note']
        order = G['voices']['order']; seq_ev = []
        for syi in order:
            if syi is None: continue
            seq_ev += sorted([k for k in ev_notes if events[k]['sys'] == syi], key=lambda k: events[k]['x'])
        ro_notes = ro['verses'][0]['notes']; seq_ro = [i for i, n in enumerate(ro_notes) if n['type'] == 'note']
        ro_of_event = {}; q = 0
        for i in seq_ro:
            xid = int(ro_notes[i]['id'].split('-')[1])
            while q < len(seq_ev) and events[seq_ev[q]]['x'] != xid: q += 1
            ro_of_event[seq_ev[q]] = i; q += 1
        notes = []
        for h, k in zip(heads, ev_notes):
            staff = [int(y) for y in staves[vocal[h['sys']]]]
            st = find_stem(nl, h['x'], h['y'], s)
            stem = dict(x=int(st['x']), dir=int(st['dir']), end_y=int(st['end_y']), length=float(st['length'])) if st else None
            n = fitted.extract_note(dark, h, staff, line_t, s, stem)
            n['event'] = k; n['sys_event'] = events[k]['sys']; n['x_event'] = events[k]['x']
            n['ro_global'] = (offset + ro_of_event[k]) if k in ro_of_event else None
            n['L'] = h['L']; n['O'] = int(h['O']); n['midi'] = events[k]['midi']
            n['read_dur'] = None if events[k]['dur'] is None else [events[k]['dur'].numerator, events[k]['dur'].denominator]; n['read_abstain'] = events[k]['dur_abstain']
            notes.append(n)
        fitted.link_beams(dark, notes, s, line_t)
        offset += len(ro_notes)
        pg_list.append(dict(page=args['pages'][pi], idx=pi, s=float(s), line_t=float(line_t), shape=list(img.shape), notes=notes))
        del dark, G, nl, img
    stage_a = time.time() - ta
    # stage B
    tb = time.time(); good = [pg for pg in pg_list if not pg.get('error')]
    for pg in good: fitted.classify_notes(pg['notes'], pg['s'], pg['line_t'])
    account = fitted.trial_song(good); stage_b = time.time() - tb
    # stage C
    tc = time.time(); lengths = {}
    for pg in good:
        d = {}
        for n in pg['notes']:
            t = n['trial']
            if t['keep_reader']: continue
            d[(n['sys_event'], n['x_event'])] = (None if t['dur'] is None else Fraction(t['dur'][0], t['dur'][1]), t['abstain'] if t['dur'] is None else None)
        lengths[pg['idx']] = d
    merged, _pages, failed = chain_read(paths, cfg_key, lengths)
    stage_c = time.time() - tc
    out = dict(ro=json.loads(json.dumps(merged, default=_frac)), failed=failed, seconds=dict(total=time.time() - T0, read=stage_a, trial=stage_b, reread=stage_c))
    if totals_only: return out
    # per-note records (build songs only)
    recs = []; tiles = {}
    for pg, P in zip(good, account['_per']):
        N = pg['notes']
        for n in N:
            t = n['trial']; h = n['head']; st = n['stem']
            r = dict(page=pg['page'], s=pg['s'], line_t=pg['line_t'], x=n['x'], y=n['y'], sys=n['sys'], hollow=n['hollow'], ro_global=n['ro_global'], midi=n['midi'], L=n['L'], O=n['O'],
                     read_dur=n['read_dur'], read_abstain=n['read_abstain'], staff=n['staff'], kind=n['kind'], kind_why=n['kind_why'], dotk=n['dotk'], dot_why=n['dot_why'], trial=t, rt=n['rt'], err=n['_err'],
                     head=None if h is None else {k: h[k] for k in ('cx', 'cy', 'a', 'b', 'tilt_up', 'rms', 'interior')},
                     stem=st, dot=n['dot'], beam_right=n.get('beam_right'), beam_left=n.get('beam_left'),
                     stroke=None if not n['scan'] or not n['scan']['strokes'] else {k: n['scan']['strokes'][0][k] for k in ('side', 'reach', 'tau_max', 'runs_on', 'to_cap')})
            recs.append(r)
            if args.get('tiles') and n['rt'] is not None:
                fr = (60, 180, 60) if (n['kind'] and n['dotk']) else (200, 80, 160)
                im = fitted.overlay_tile(n, N, P['tmpl'], P['bvals'], P['dvals'], scale=2, frame=fr)
                if im is not None: tiles[len(recs) - 1] = base64.b64encode(cv2.imencode('.png', im)[1].tobytes()).decode()
    acc = {k: v for k, v in account.items() if k != '_per'}
    out.update(notes=recs, account=acc, tiles=tiles, pages=[dict(page=pg['page'], s=pg['s'], line_t=pg['line_t']) for pg in good])
    return out
