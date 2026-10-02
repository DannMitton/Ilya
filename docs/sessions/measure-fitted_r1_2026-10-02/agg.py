"""Aggregate the trial's end-to-end outputs (trial/songN.json) with the truth. Native analysis of numbers computed in Pyodide."""
import json, sys, collections, math
import numpy as np
from fractions import Fraction
sys.path.insert(0, '.')
import truthjoin
SONGS = (1, 4, 5, 6, 7)
NAME = {1: 'Sunless 1', 4: 'Sunless 4', 5: 'Sunless 5', 6: 'Sunless 6', 7: 'Tchaikovsky', 2: 'Sunless 2', 3: 'Sunless 3'}

def load(song, trialdir='trial', scoredir='scores-trial'):
    r = json.load(open(f'{trialdir}/song{song}.json'))
    ev = truthjoin.truth_events(song); sc = json.load(open(f'{scoredir}/song{song}.score.json'))
    m = {mm['readerIndex']: ev[mm['truthIndex']] for mm in sc['matches']}
    for n in r['notes']: n['truth'] = m.get(n['ro_global']) if n['ro_global'] is not None else None
    return r, sc

def judge(dur, t):
    if t is None or t['type'] != 'note': return None
    if dur is None: return 'abstained'
    td = t['duration']; return 'right' if dur[0] * td['denominator'] == td['numerator'] * dur[1] else 'wrong'

def stats(v):
    v = np.array(v, float)
    if not len(v): return None
    return dict(n=len(v), median=float(np.median(v)), p5=float(np.percentile(v, 5)), p95=float(np.percentile(v, 95)), max=float(v.max()))


def round_trip_table():
    """3.5: the spread of U and V (shares) for notes the trial read, split by the truth: read as printed vs misread."""
    out = {}; pooled = collections.defaultdict(list)
    for song in SONGS:
        r, sc = load(song); cl = collections.defaultdict(lambda: collections.defaultdict(list)); marked = collections.Counter()
        pg_bound = {p['page']: p['rt_bound'] for p in r['account']['pages']}
        for n in r['notes']:
            if n['rt'] is None: continue
            j = judge(n['trial']['dur'], n['truth'])
            if j not in ('right', 'wrong'): continue
            cl[j]['U'].append(n['rt']['U']); cl[j]['V'].append(n['rt']['V'])
            b = pg_bound[n['page']]; u = n['rt']['unsure']
            marked[(j, bool(u))] += 1
            pooled[j + 'U'].append(n['rt']['U']); pooled[j + 'V'].append(n['rt']['V'])
            # a stricter question: would the page's clear-case bound on U alone, or on V alone, mark it?
            marked[(j, 'U')] += int(n['rt']['U'] > b['U']); marked[(j, 'V')] += int(n['rt']['V'] > b['V'])
        out[song] = dict(right=dict(U=stats(cl['right']['U']), V=stats(cl['right']['V'])), wrong=dict(U=stats(cl['wrong']['U']), V=stats(cl['wrong']['V'])),
                         marked={str(k): v for k, v in marked.items()})
    out['pooled'] = {k: stats(v) for k, v in pooled.items()}
    return out


LET = 'CDEFGAB'
SEMI = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
SHARP_ORDER = 'FCGDAEB'; FLAT_ORDER = 'BEADGCF'
KEYS = {1: 2, 4: 2, 5: 0, 6: 7, 7: 2}
def key_alter(f):
    d = {}
    if f > 0:
        for L in SHARP_ORDER[:f]: d[L] = 1
    elif f < 0:
        for L in FLAT_ORDER[:-f]: d[L] = -1
    return d
TOPD = 4 * 7 + LET.index('G') + 2 * (5 - 2)   # the reader's clef_topD('G', 2): G clef on line 2, LETIDX in the reader is C=0..B=6
def pitch_table():
    """3.6: the pitch step the fitted centre gives against the traced lines, beside the reader's and the truth's. Nothing is emitted from it."""
    out = {}
    for song in SONGS:
        r, sc = load(song); shift = sc['shift']; KA = key_alter(KEYS[song]); c = collections.Counter(); rows = []
        for n in r['notes']:
            t = n['truth']
            if t is None or t['type'] != 'note' or n['head'] is None or n['midi'] is None: continue
            lines = n['staff']; top = lines[0]; half = float(np.median(np.diff(lines))) / 2
            off_r = round((top - n['y']) / half); off_f = round((top - n['head']['cy']) / half)
            reader_right = (n['midi'] - shift == t['midi'])
            if off_f == off_r:
                c['same_step'] += 1; c['same_step_reader_right'] += int(reader_right); continue
            # the fitted step's pitch: the reader's own alteration for the letter it names where the reader named it; else the key's
            d = TOPD + off_f; L = LET[d % 7]; O = d // 7
            alt_r = n['midi'] - (12 * (n['O'] + 1) + SEMI[n['L']])
            midi_f = 12 * (O + 1) + SEMI[L] + KA.get(L, 0)
            fit_right = (midi_f - shift == t['midi'])
            # the pitch the reader would have given at the fitted step with the same accidental it read
            midi_f2 = 12 * (O + 1) + SEMI[L] + alt_r
            c['differ'] += 1
            if fit_right and not reader_right: c['fit_agrees_reader_does_not'] += 1
            if reader_right and not fit_right: c['reader_agrees_fit_does_not'] += 1
            if fit_right and reader_right: c['both_agree'] += 1
            if not fit_right and not reader_right: c['neither'] += 1
            rows.append((n['page'], n['x'], n['y'], off_r, off_f, round(n['head']['cy'] - n['y'], 1), reader_right, fit_right))
        out[song] = dict(counts=dict(c), rows=rows)
    return out
