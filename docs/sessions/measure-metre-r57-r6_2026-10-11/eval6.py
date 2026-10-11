"""Row 57 r6, run 1: tune the shipped reader on the 4, set the same-length margin, then step 0.

The reader is round 5's written choice, A9 with the checks and witness 5 (r6 section 1.1), with r6's changes:
- witness 5 with the bounded span (section 1.7): the first four countable bars a proposal governs, at least two
  of them, every one summing to it; on renders SIMULATED as in round 5, bounded the same way;
- unfamiliar shape with a reference of 80 crops a class (184,320 bytes as float16), the largest round number
  that fits section 1.3's 200 KB with the penultimate output (DESK DEFAULT; round 5's 3,000 a class does not fit);
- the same-length guard (section 1.5), set after the cut, the centring tolerance and the checks.

Usage: python eval6.py tune | margin | step0 | songs
"""
import json, pickle, sys, os
from collections import Counter, defaultdict
from fractions import Fraction
import numpy as np
import eval5
from eval5 import Unit, statement, judge_scenes, judge_wins, sim_stats, tune, courtesy_place, truth_of, WIN, CUTS
from decode5 import LOWER_OK
from w5 import Song, accept_b, mlen, countable
from pages5 import band, ALLST
from staff import lines_at

D = '../run1'
NETS = 'A9'
W = json.load(open('windows.json')); LABELS = json.load(open('labels.json'))

# ---- witness 5, bounded (section 1.7) ----
eval5.accept = accept_b


def w5_sim_b(truth, lab, stats, seed):
    """SIMULATED, bounded: bars after a rendered staff, damaged as the tuning songs' bars were; the first four
    countable ones are summed and at least two are needed."""
    rng = np.random.default_rng(seed)
    if truth is None or truth.startswith('courtesy'):
        ms = list(stats['metres']); p = np.array([stats['metres'][m] for m in ms], float); in_force = ms[rng.choice(len(ms), p=p / p.sum())]
    else:
        in_force = truth
    n = int(rng.choice(stats['gov'])); L = mlen(in_force); target = mlen(lab)
    cnt = 0; ok = True
    for _ in range(n):
        if cnt == 4: break
        if rng.random() < stats['p_out']: continue
        cnt += 1
        r = Fraction(float(rng.choice(stats['ratios']))).limit_denominator(64)
        if L * r != target: ok = False
    return cnt >= 2 and ok


eval5.w5_sim = w5_sim_b


# ---- the same-length guard (section 1.5) ----
def rivals(lab):
    """Labels of the same length and the same marks: C against cut C, and figures with as many digits a seat."""
    if lab == 'C': return ['cut']
    if lab == 'cut': return ['C']
    t, b = lab.split('/'); L = Fraction(4 * int(t), int(b)); out = []
    for b2 in sorted(LOWER_OK):
        t2 = L * b2 / 4
        if t2.denominator != 1 or t2 < 1: continue
        t2 = int(t2)
        if len(str(t2)) == len(t) and len(str(b2)) == len(b) and (str(t2), str(b2)) != (t, b): out.append('%d/%d' % (t2, b2))
    return out


def classes(lab):
    """Per mark, in the order candidates() lists marks (upper digits, then lower; or the one sign): (seat, class)."""
    if lab == 'C': return [(1, 10)]
    if lab == 'cut': return [(1, 11)]
    t, b = lab.split('/')
    return [(0, int(c)) for c in t] + [(2, int(c)) for c in b]


def margin_of(u, lab, cut, centre):
    """The least, over the nine readings and every same-length rival, of the stated class's probability less the
    rival's, at each mark where the two differ. None when the label has no rival."""
    rv = rivals(lab)
    if not rv: return None
    m = np.inf
    for k in range(9):
        g = u.st['A'][k][(centre, cut)]
        P = u.P[k]
        mine = classes(lab)
        for r in rv:
            theirs = classes(r)
            for (seat, a), (_, b), mk in zip(mine, theirs, g['marks']):
                if a == b: continue
                p = P[mk[1], seat].astype(np.float32)
                m = min(m, float(p[a] - p[b]))
    return m


def with_P(units, reads):
    for key, u in (units.items() if isinstance(units, dict) else enumerate(units)):
        u.P = [r['P'] for r in reads[key]['A']]
    return units


def load_units(refs):
    meta = json.load(open(f'{D}/meta.json'))
    WR = pickle.load(open(f'{D}/W.pkl', 'rb'))
    allW = {}
    for i, reads in WR.items():
        w = WIN[i]; st = ALLST[w['page']][w['staff']]; b, y0, k = band(w['page'], w['staff'], 10)
        Lfun = lambda x, st=st, y0=y0, k=k: (lines_at(st, x * 10 / k) - y0) * k
        allW[i] = Unit(reads, b, Lfun, truth_of(i), refs, 'win')
    with_P(allW, WR)
    return meta, allW


def scenes(name, refs):
    sc = pickle.load(open(f'{D}/scenes.pkl', 'rb'))[name] if name in ('tune', 'margin') else pickle.load(open(f'{D}/fresh_scenes.pkl', 'rb'))
    R = pickle.load(open(f'{D}/{name}R.pkl', 'rb'))
    us = eval5.scene_units(sc, R, refs)
    for u, r in zip(us, R): u.P = [x['P'] for x in r['A']]
    return sc, us


def ser(chk):
    return None if chk is None else {k: (None if v is None else float(v)) for k, v in chk.items()}


def guarded(u, cut, centre, chk, M):
    s = statement(u, NETS, cut, centre, chk)
    if s is None or M is None: return s
    m = margin_of(u, s, cut, centre)
    return s if (m is None or m >= M) else None


def run_tune():
    refs = pickle.load(open(f'{D}/refs_80.pkl', 'rb'))
    meta, allW = load_units(refs)
    tuneW = {i: u for i, u in allW.items() if WIN[i]['song'] in meta['tune']}
    _, tuneR = scenes('tune', refs)
    tsongs = {s: Song(s, W, ALLST, LABELS) for s in meta['tune']}
    stats = sim_stats(tsongs)
    best, log = tune(D, tuneW, tuneR, tsongs, stats, NETS, True, True)
    # configuration 1 of the same reader (no witness 5), tuned the same way, for comparison only
    best1, _ = tune(D, tuneW, tuneR, tsongs, stats, NETS, True, False)
    p = best[1]
    out = dict(chosen={k: p[k] for k in ('centre', 'q', 'tau', 'cut')}, chk=ser(p['chk']), tune_score=best[0],
               config1=dict(chosen={k: best1[1][k] for k in ('centre', 'q', 'tau', 'cut')}, chk=ser(best1[1]['chk']), tune_score=best1[0]),
               log=[list(map(lambda x: x if not isinstance(x, tuple) else list(x), l)) for l in log])
    pickle.dump(dict(stats=stats), open(f'{D}/simstats.pkl', 'wb'))
    json.dump(out, open(f'{D}/tune.json', 'w'), indent=1, default=str)
    print(json.dumps({k: v for k, v in out.items() if k != 'log'}, default=str))


def settings():
    t = json.load(open(f'{D}/tune.json')); p = t['chosen']; chk = dict(t['chk'])
    for k, v in chk.items():
        if v is None: chk[k] = np.inf
    return p['cut'], p['centre'], chk


def run_margin():
    refs = pickle.load(open(f'{D}/refs_80.pkl', 'rb'))
    meta, allW = load_units(refs)
    cut, centre, chk = settings()
    rows = []
    for i, u in allW.items():
        if WIN[i]['song'] not in meta['tune']: continue
        s = statement(u, NETS, cut, centre, chk)
        if s and not courtesy_place(WIN[i]):
            rows.append(dict(src='tuning song', id=i, truth=u.truth, said=s, margin=margin_of(u, s, cut, centre)))
    for name in ('tune', 'margin'):
        _, us = scenes(name, refs)
        for k, u in enumerate(us):
            s = statement(u, NETS, cut, centre, chk)
            if s: rows.append(dict(src=name + ' renders', id=k, truth=u.truth, said=s, margin=margin_of(u, s, cut, centre)))
    for r in rows:
        r['kind'] = 'right' if r['said'] == r['truth'] else ('same-length false' if r['truth'] and r['truth'] in rivals(r['said']) else 'false')
    json.dump(rows, open(f'{D}/margin_rows.json', 'w'), indent=1, default=str)
    c = Counter((r['src'], r['kind'], r['margin'] is not None) for r in rows)
    for k, v in sorted(c.items()): print(k, v)
    sl = [r for r in rows if r['kind'] == 'same-length false']
    print('same-length false', [(r['src'], r['truth'], r['said'], round(r['margin'], 4)) for r in sl])
    right = sorted(r['margin'] for r in rows if r['kind'] == 'right' and r['margin'] is not None)
    print('right with a rival:', len(right), 'quantiles 0, 1, 5, 10 %:', [round(float(np.quantile(right, q)), 4) for q in (0, 0.01, 0.05, 0.1)] if right else None)


def run_step0(M):
    refs = pickle.load(open(f'{D}/refs_80.pkl', 'rb'))
    cut, centre, chk = settings()
    sc, us = scenes('fresh', refs)
    from render import FONTS
    res = Counter(); kinds = Counter(); falses = []; byfont = defaultdict(Counter); unguarded_sl = 0
    for d, u in zip(sc, us):
        s0 = statement(u, NETS, cut, centre, chk)
        s = guarded(u, cut, centre, chk, M)
        t = u.truth
        if s0 and t and s0 != t and s0 in rivals(t): unguarded_sl += 1
        if s is None: v = 'missed' if t else 'none'
        elif s == t: v = 'found'
        else:
            v = 'false'
            k = 'same-length' if (t and s in rivals(t)) else ('where nothing is printed' if not t else ('same length, other marks' if mlen(s) == mlen(t) else 'another length'))
            kinds[k] += 1; falses.append(dict(font=d['font'], fold=d['fold'], truth=t, said=s, kind=k))
        res[v] += 1; byfont[d['font']][v] += 1
    out = dict(M=M, cut=cut, centre=centre, res=dict(res), kinds=dict(kinds), same_length_false_without_guard=unguarded_sl,
               byfont={f: dict(c) for f, c in byfont.items()}, falses=falses)
    json.dump(out, open(f'{D}/step0.json', 'w'), indent=1, default=str)
    print(json.dumps({k: v for k, v in out.items() if k != 'falses'}))
    for f in falses: print(f)


def run_songs(M):
    """The Python reader on every window of the 16 songs, with the shipped settings; config 2 with the bounded span."""
    refs = pickle.load(open(f'{D}/refs_80.pkl', 'rb'))
    meta, allW = load_units(refs)
    cut, centre, chk = settings()
    songs = sorted({WIN[i]['song'] for i in allW})
    S = {s: Song(s, W, ALLST, LABELS) for s in songs}
    st = {i: guarded(u, cut, centre, chk, M) for i, u in allW.items()}
    keep = eval5.w5_songs(allW, S, {i: l for i, l in st.items() if l})
    rows = []
    for i, u in allW.items():
        s = st[i]; w = WIN[i]; t = u.truth
        rej = bool(s) and not keep.get(i, (False, 0))[0]
        rows.append(dict(id=i, song=w['song'], page=w['page'], staff=w['staff'], kind=w['kind'], truth=t, said=s, w5_rejected=rej,
                         tuning=w['song'] in meta['tune']))
    json.dump(rows, open(f'{D}/songs.json', 'w'), indent=1)
    c = Counter()
    for r in rows:
        s = None if r['w5_rejected'] else r['said']; t = r['truth']
        if s and courtesy_place(WIN[r['id']]): v = 'set aside'
        elif t and t.startswith('courtesy'): v = 'courtesy'
        elif s is None: v = 'missed' if t else 'none'
        else: v = 'right' if s == t else 'FALSE'
        c[(r['tuning'], v)] += 1
    print(dict(c))


if __name__ == '__main__':
    cmd = sys.argv[1]
    M = float(sys.argv[2]) if len(sys.argv) > 2 else None
    {'tune': run_tune, 'margin': run_margin}.get(cmd, lambda: None)()
    if cmd == 'step0': run_step0(M)
    if cmd == 'songs': run_songs(M)
