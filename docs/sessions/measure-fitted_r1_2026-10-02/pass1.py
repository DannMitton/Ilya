"""Step 3.3: pass 1, the page teaches its own values. Native analysis of the extraction (ext/songN.json)."""
import json, sys, collections, math
import numpy as np
from fractions import Fraction
sys.path.insert(0, '/Users/dannmitton/Desktop/ilya-rewrite/tools/e16-harness/reader'); sys.path.insert(0, '.')
import fitted, truthjoin
SONGS = (1, 4, 5, 6, 7)
NAME = {1: 'Sunless 1', 4: 'Sunless 4', 5: 'Sunless 5', 6: 'Sunless 6', 7: 'Tchaikovsky'}
KIND_BASE = {'plain': Fraction(1, 4), 'flag1': Fraction(1, 8), 'beam1': Fraction(1, 8), 'flag2': Fraction(1, 16), 'beam2': Fraction(1, 16)}

def load(song, scoredir='scores-scans-400'):
    d = json.load(open(f'ext/song{song}.json'))
    m, sc = truthjoin.join(song, d['pages'], scoredir)
    for pg in d['pages']:
        if pg.get('error'): continue
        fitted.classify_notes(pg['notes'], pg['s'], pg['line_t'])
        for n in pg['notes']: n['truth'] = m.get(n['ro_global']) if n['ro_global'] is not None else None
    return d

def truth_check(notes):
    """Of the clear cases the scorer matched: how many does the truth give a different length? (stem class and dot separately)"""
    r = dict(stem_matched=0, stem_contradicted=0, stem_other_class=0, dot_matched=0, dot_contradicted=0, both_clear_matched=0, both_clear_contradicted=0)
    for n in notes:
        t = n.get('truth')
        if t is None or t['type'] != 'note': continue
        b, dot = truthjoin.base_of(t['duration'])
        sc_ok = None; dt_ok = None
        if n['kind']:
            r['stem_matched'] += 1
            if b is None: r['stem_other_class'] += 1; sc_ok = False
            elif KIND_BASE[n['kind']] != b: r['stem_contradicted'] += 1; sc_ok = False
            else: sc_ok = True
        if n['dotk']:
            r['dot_matched'] += 1
            if b is None: dt_ok = None
            elif (n['dotk'] == 'dotted') != dot: r['dot_contradicted'] += 1; dt_ok = False
            else: dt_ok = True
        if n['kind'] and n['dotk']:
            r['both_clear_matched'] += 1
            if not (sc_ok and dt_ok is not False): r['both_clear_contradicted'] += 1
    return r

if __name__ == '__main__':
    out = {}
    for song in SONGS:
        d = load(song); out[song] = dict(pages=[])
        allnotes = [n for pg in d['pages'] if not pg.get('error') for n in pg['notes']]
        pooled = fitted.page_values(allnotes)
        out[song]['pooled'] = pooled
        for pg in d['pages']:
            if pg.get('error'): out[song]['pages'].append(dict(page=pg['page'], error=True)); continue
            V = fitted.page_values(pg['notes']); T = truth_check(pg['notes'])
            out[song]['pages'].append(dict(page=pg['page'], s=pg['s'], line_t=pg['line_t'], heads=len(pg['notes']), values=V, truth=T))
    json.dump(out, open('pass1.json', 'w'), default=float)
    print('ok')
