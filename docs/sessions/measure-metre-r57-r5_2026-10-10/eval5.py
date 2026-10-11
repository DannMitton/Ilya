"""Row 57 r5: decode-time variants, tuned inside each fold, judged by window.

Variants: nets A1 (A, one reading), A9 (A, nine readings), AB18 (A and B, nine each); checks off or on; witness 5
off or on (12 in all). Agreement: a signature is stated only when every reading of every net in the variant
states it; a reading of nothing is disagreement.

Inside each fold, for each variant: for each centring tolerance and check setting, the lowest cut with 0 false
signatures on the 4 tuning songs and the 300 tuning renders; then the setting that reads most right there.
The check thresholds and the simulated damage come from the tuning songs and tuning renders only.
"""
import json, pickle, sys, os
from collections import Counter
import numpy as np
from fractions import Fraction
from decode5 import candidates, state
from checks5 import nn_dist, uncovered, uncovered_void, cut_ratio, mark_x
from w5 import Song, accept, mlen, countable
from pages5 import band, ALLST
from staff import lines_at

CUTS = [0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.93, 0.95, 0.97, 0.98, 0.99, 0.995, 0.999]
CENTRES = [0.4, 0.3, 0.2]
QS = [0.99, 0.999, 1.0]
TAUS = [0.15, 0.3, 0.6]
NETS = {'A1': [('A', [4])], 'A9': [('A', range(9))], 'AB18': [('A', range(9)), ('B', range(9))]}
BASE = 4   # reading index of offset 0, scale 1 (READINGS order: offsets outer, scales inner)
W = json.load(open('windows.json')); LABELS = json.load(open('labels.json'))
WIN = {w['id']: w for w in W}
SIM_RUNS = 1


def truth_of(i):
    l = LABELS.get(str(i))
    if l is None: return None
    if l.startswith('c') and l != 'cut': return 'courtesy:' + l[1:]
    return l


def courtesy_place(w):
    return w['kind'] == 'bar' and w.get('lastbar') and w['tail'] < 6


class Unit:
    """One window or one rendered staff: candidates per net per reading, and the base candidates' check values."""
    def __init__(s, reads, img, Lfun, truth, refs, kind):
        s.truth = truth; s.kind = kind
        s.c = {n: [candidates(r['P'], r['xs']) for r in rs] for n, rs in reads.items()}
        s.xs = {n: rs[BASE]['xs'] for n, rs in reads.items()}
        s.chk = {}
        for n, rs in reads.items():
            for cand in s.c[n][BASE]:
                if cand['lab'] == '?': continue
                d = [nn_dist(*refs[n], rs[BASE]['feat'].get((m[1], m[0]), None), m[2]) if (m[1], m[0]) in rs[BASE]['feat'] else np.inf for m in cand['marks']]
                cand['dist'] = max(d) if d else np.inf
                if n == 'A':
                    if cand['lab'] in ('C', 'cut'): cand['cr'] = cut_ratio(img, Lfun, s.xs['A'], cand['marks'][0])
                    else: cand['unc'] = uncovered(img, Lfun, s.xs['A'], cand['marks'])
        # each reading's statement at every cut and centring tolerance, worked out once
        s.st = {n: [{(ce, cu): state(cs, cu, ce) for ce in CENTRES for cu in CUTS} for cs in s.c[n]] for n in s.c}


def statement(u, nets, cut, centre, chk):
    """chk: None, or dict(dA, dB thresholds, tau, clo, chi)."""
    labs = []
    base = None
    for n, idx in NETS[nets]:
        for k in idx:
            g = u.st[n][k][(centre, cut)]
            if g is None: return None
            labs.append(g['lab'])
            if k == BASE: base = base or {}; base[n] = g
    if len(set(labs)) != 1: return None
    lab = labs[0]
    if chk:
        for n in base:
            if base[n].get('dist', np.inf) > chk['d' + n]: return None
        a = base.get('A')
        if a is not None:
            if lab in ('C', 'cut'):
                r = a.get('cr', 0.0)
                if lab == 'C' and r > chk['clo']: return None
                if lab == 'cut' and r < chk['chi']: return None
            elif uncovered_void(a.get('unc'), chk['tau']): return None
    return lab


def song_units(fold_dir, which, songs, refs):
    R = pickle.load(open(f'{fold_dir}/{which}W.pkl', 'rb'))
    units = {}
    for i, reads in R.items():
        w = WIN[i]; st = ALLST[w['page']][w['staff']]; b, y0, k = band(w['page'], w['staff'], 10)
        Lfun = lambda x, st=st, y0=y0, k=k: (lines_at(st, x * 10 / k) - y0) * k
        units[i] = Unit(reads, b, Lfun, truth_of(i), refs, 'win')
    return units


def scene_units(scenes, reads, refs):
    return [Unit(r, sc['A'], (lambda x, L=sc['LA']: L), sc['truth'], refs, sc['kind']) for sc, r in zip(scenes, reads)]


# ---- witness 5 ----
def w5_songs(units, songs, stmts):
    """Witness 5 on real songs: stmts {window id: label}; returns {window id: (kept, countable bars)}."""
    out = {}
    for name, S in songs.items():
        ids = [w['id'] for w in S.wins if w['id'] in stmts]
        for i in ids:
            sp = S.span(i, [j for j in ids if j != i])
            ok, n = accept(S.bars, sp, mlen(stmts[i])) if stmts[i] else (False, 0)
            out[i] = (ok, n)
    return out


def sim_stats(songs):
    ratios, out, n, gov, metres = [], 0, 0, [], Counter()
    for S in songs.values():
        r, o, m, g = S.stats(); ratios += r; out += o; n += m; gov += g
        metres.update(l for l in S.metre_at_bar if l)
    return dict(ratios=ratios, p_out=out / max(1, n), gov=gov, metres=metres)


def w5_sim(truth, lab, stats, seed):
    """SIMULATED: the bars after a rendered staff, damaged as the tuning songs' bars were."""
    rng = np.random.default_rng(seed)
    if truth in (None, ) or truth.startswith('courtesy'):
        ms = list(stats['metres']); p = np.array([stats['metres'][m] for m in ms], float); in_force = ms[rng.choice(len(ms), p=p / p.sum())]
    else:
        in_force = truth
    n = int(rng.choice(stats['gov'])); L = mlen(in_force); target = mlen(lab)
    cnt = 0; ok = True
    for _ in range(n):
        if rng.random() < stats['p_out']: continue
        cnt += 1
        r = Fraction(float(rng.choice(stats['ratios']))).limit_denominator(64)
        if L * r != target: ok = False
    return cnt > 0 and ok


def judge_wins(units, nets, cut, centre, chk, w5, songs=None):
    st = {i: statement(u, nets, cut, centre, chk) for i, u in units.items()}
    keep = w5_songs(units, songs, {i: l for i, l in st.items() if l}) if w5 else None
    res = Counter(); rows = []
    for i, u in units.items():
        s = st[i]; w = WIN[i]
        rej = False
        if s and w5:
            ok, n = keep.get(i, (False, 0)); rej = not ok
        t = u.truth
        if s and courtesy_place(w): v = 'set aside'
        elif t and t.startswith('courtesy'): v = 'courtesy'
        elif s is None or rej: v = 'missed' if t else 'none'
        else: v = 'right' if s == t else 'FALSE'
        res[v] += 1; rows.append((i, t, s, v, rej))
    return res, rows


def judge_scenes(units, nets, cut, centre, chk, w5, stats=None, seed0=0):
    res = Counter(); fl = []
    for k, u in enumerate(units):
        s = statement(u, nets, cut, centre, chk)
        if s and w5 and not w5_sim(u.truth, s, stats, seed0 + k): s = None
        if s is None: res['missed' if u.truth else 'none'] += 1
        elif s == u.truth: res['found'] += 1
        else: res['false'] += 1; fl.append((u.truth, s))
    return res, fl


def dist_thresholds(units_list, q):
    """The tuning set's distance quantile: over base marks of candidates that read their truth."""
    out = {}
    for n in ('A', 'B'):
        d = [c['dist'] for us in units_list for u in us for c in u.c.get(n, [[]] * 5)[BASE] if 'dist' in c and c['lab'] == u.truth and np.isfinite(c['dist'])]
        out['d' + n] = float(np.quantile(d, q)) if d and q is not None else np.inf
    return out


def cut_thresholds(units_list):
    cr_C = [c['cr'] for us in units_list for u in us for c in u.c['A'][BASE] if 'cr' in c and u.truth == 'C' and c['lab'] in ('C', 'cut')]
    cr_cut = [c['cr'] for us in units_list for u in us for c in u.c['A'][BASE] if 'cr' in c and u.truth == 'cut' and c['lab'] in ('C', 'cut')]
    clo = max(cr_C) if cr_C else 0.0; chi = min(cr_cut) if cr_cut else 1.0
    return clo, chi


def tune(fold_dir, tuneW, tuneR, songs, stats, nets, checks, w5):
    best = None; log = []
    us_all = [list(tuneW.values()), tuneR]
    clo, chi = cut_thresholds(us_all)
    for centre in CENTRES:
        for q in (QS if checks else [None]):
            for tau in (TAUS if checks else [None]):
                chk = None
                if checks:
                    chk = dict(dist_thresholds(us_all, q), tau=tau, clo=clo, chi=chi)
                for cut in CUTS:
                    rw, _ = judge_wins(tuneW, nets, cut, centre, chk, w5, songs)
                    if rw['FALSE']: continue
                    rr, _ = judge_scenes(tuneR, nets, cut, centre, chk, w5, stats, 7000)
                    if rr['false']: continue
                    score = (rw['right'], rr['found'])
                    log.append((centre, q, tau, cut, score))
                    if best is None or score > best[0]: best = (score, dict(centre=centre, q=q, tau=tau, cut=cut, chk=chk))
                    break
    return best, log
