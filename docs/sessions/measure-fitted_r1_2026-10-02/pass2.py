import json, sys, collections, time
import numpy as np
from fractions import Fraction
sys.path.insert(0, '/Users/dannmitton/Desktop/ilya-rewrite/tools/e16-harness/reader'); sys.path.insert(0, '.')
import fitted, truthjoin, pass1

def score_note(n, dur):
    """'right' / 'wrong' / 'abstained' of a duration (num, den) or None against the matched truth note, or None if unmatched."""
    t = n.get('truth')
    if t is None or t['type'] != 'note': return None
    if dur is None: return 'abstained'
    td = t['duration']
    return 'right' if (dur[0] * td['denominator'] == td['numerator'] * dur[1]) else 'wrong'

def run_song(song, verbose=True):
    d = pass1.load(song)
    pages = [dict(page=pg['page'], notes=pg['notes'], s=pg['s'], line_t=pg['line_t']) for pg in d['pages'] if not pg.get('error')]
    t0 = time.time(); acc = fitted.trial_song(pages); dt = time.time() - t0
    return d, pages, acc, dt

if __name__ == '__main__':
    songs = [int(a) for a in sys.argv[1:]] or list(pass1.SONGS)
    for song in songs:
        d, pages, acc, dt = run_song(song)
        N = [n for pg in pages for n in pg['notes']]
        tab = collections.Counter(); tabr = collections.Counter(); reasons = collections.Counter()
        for n in N:
            t = n['trial']
            if t['keep_reader']: dur = n['read_dur']
            else: dur = t['dur']
            r = score_note(n, tuple(dur) if dur else None); rr = score_note(n, tuple(n['read_dur']) if n['read_dur'] else None)
            if r is None: continue
            grp = 'pass2' if t['pass2'] else ('clear' if not t['keep_reader'] else 'kept')
            tab[(grp, r)] += 1; tabr[(grp, rr)] += 1
            if t['abstain'] and not t['keep_reader']: reasons[(t['abstain'][:90])] += 1
        print('== song', song, 'seconds', round(dt, 1))
        for grp in ('clear', 'pass2', 'kept'):
            print('  ', grp, 'trial', {k: tab[(grp, k)] for k in ('right', 'wrong', 'abstained')}, '| row 23 rule on the same notes', {k: tabr[(grp, k)] for k in ('right', 'wrong', 'abstained')})
        tot = {k: sum(tab[(g, k)] for g in ('clear', 'pass2', 'kept')) for k in ('right', 'wrong', 'abstained')}; print('   all matched:', tot)
