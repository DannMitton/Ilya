"""Per fold: tune every variant, then judge it on the earlier render seeds (printed) and on the held-out song
(written to file, not printed, so the choice is made on tuning data and the earlier seeds only)."""
import json, pickle, sys, os, time
from eval5 import *

VARIANTS = [(n, c, w) for n in ('A1', 'A9', 'AB18') for c in (False, True) for w in (False, True)]

def vname(v): return '%s%s%s' % (v[0], '+checks' if v[1] else '', '+w5' if v[2] else '')

def run(f):
    t0 = time.time(); d = f'../folds5/f{f:02d}'
    meta = json.load(open(f'{d}/meta.json')); refs = pickle.load(open(f'{d}/refs.pkl', 'rb'))
    sc = pickle.load(open(f'{d}/scenes.pkl', 'rb'))
    tuneW = song_units(d, 'tune', meta['tune'], refs); heldW = song_units(d, 'held', [meta['held']], refs)
    tuneR = scene_units(sc['tune'], pickle.load(open(f'{d}/tuneR.pkl', 'rb')), refs)
    earlyR = scene_units(sc['early'], pickle.load(open(f'{d}/earlyR.pkl', 'rb')), refs)
    ALL = ALLST
    tsongs = {s: Song(s, W, ALL, LABELS) for s in meta['tune']}
    hsongs = {s: Song(s, W, ALL, LABELS) for s in [meta['held']] if os.path.exists(f'../reads/{s}.json')}
    stats = sim_stats(tsongs)
    out = dict(fold=f, held=meta['held'], font=meta['font'], variants={})
    for v in VARIANTS:
        best, log = tune(d, tuneW, tuneR, tsongs, stats, *v)
        if best is None:
            out['variants'][vname(v)] = dict(chosen=None); continue
        p = best[1]
        re_, _ = judge_scenes(earlyR, v[0], p['cut'], p['centre'], p['chk'], v[2], stats, 8000)
        rh, rows = judge_wins(heldW, v[0], p['cut'], p['centre'], p['chk'], v[2], hsongs)
        out['variants'][vname(v)] = dict(chosen={k: p[k] for k in ('centre', 'q', 'tau', 'cut')}, chk=p['chk'], tune_score=best[0],
                                         early=dict(re_), held=dict(rh), held_rows=rows)
    pickle.dump(dict(stats=stats), open(f'{d}/simstats.pkl', 'wb'))
    json.dump(out, open(f'{d}/eval.json', 'w'), default=str)
    print(f, meta['held'], meta['font'], round(time.time() - t0), 's |', ' | '.join('%s tune%s early %s/%s false %s' % (k, v['tune_score'] if v.get('chosen') else '-',
          v.get('early', {}).get('found', 0), sum(v.get('early', {}).values()) if v.get('early') else 0, v.get('early', {}).get('false', 0)) for k, v in out['variants'].items()), flush=True)

if __name__ == '__main__':
    for f in [int(a) for a in sys.argv[1:]]: run(f)
