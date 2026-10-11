"""Row 57 r5, witness 5: the bars that follow a proposed signature.

Brief r5 section 2.3's rule (a DESK DEFAULT): a proposal is stated only when at least one bar it governs is
countable under r2's bar rule and every countable bar sums to it. A proposal with no countable bar is not
stated. Bars are homr's joined reading through the app's own pipeline (`dropread.mjs`), after the tuplet checks
the join ran under the metre homr states (see the report: the checks were not run again under each proposal).

Bar rule (r2 section 4, report r1 lines 168 to 173, r4's row 61 note): a bar holding no note and no rest is
left out (a page of the piano alone); a short first bar, a short last bar, and a short bar that ends at or
precedes a repeat or a double barline are left out (an anacrusis and the bar that completes it).
"""
import json, pickle
from fractions import Fraction
from PIL import Image
from w5map import song_bars, first_bar

def mlen(lab):
    if lab == 'C': return Fraction(4)
    if lab == 'cut': return Fraction(4)   # r6: cut C is 2/2, four quarters (r5 had 2)
    a, b = lab.split('/'); return Fraction(4 * int(a), int(b))

def compound(lab):
    if lab in ('C', 'cut'): return False
    a, b = map(int, lab.split('/')); return a in (6, 9, 12) and b >= 8

BREAK = ('light-light', 'light-heavy', 'heavy-light', 'heavy-heavy', 'repeat')

def countable(bars, i, L):
    b = bars[i]
    if b['notes'] == 0: return False
    if b['len'] < L:
        if i == 0 or i == len(bars) - 1: return False
        if any(s in BREAK for s in b['styles']): return False
        if i + 1 < len(bars) and 'repeat' in bars[i + 1]['styles']: return False
    return True

def accept(bars, span, L):
    c = [i for i in span if countable(bars, i, L)]
    return len(c) > 0 and all(bars[i]['len'] == L for i in c), len(c)

def accept_b(bars, span, L, first=4, least=2):
    """r6 section 1.7, the bounded span: the first `first` countable bars the proposal governs; at least `least`
    of them, and every one sums to it."""
    c = [i for i in span if countable(bars, i, L)][:first]
    return len(c) >= least and all(bars[i]['len'] == L for i in c), len(c)

def beaming(bars, span):
    """'compound', 'simple', or None from the eighth-note beam groups in these bars."""
    sizes = []
    for i in span:
        n = 0
        for st, ty in bars[i]['beams']:
            if ty not in ('eighth',): n = 0; continue
            if st == 'begin': n = 1
            elif st == 'continue' and n: n += 1
            elif st == 'end' and n: sizes.append(n + 1); n = 0
    three = sum(s in (3, 6) for s in sizes); two = sum(s in (2, 4) for s in sizes)
    if three > two: return 'compound'
    if two > three: return 'simple'
    return None

class Song:
    """One song's bars and its windows' first bars, with the printed metre in force."""
    def __init__(s, song, W, ALL, LABELS, reads_dir='../before'):
        r = json.load(open(f'{reads_dir}/{song}.json'))
        s.bars, _ = song_bars(r)
        s.wins = [w for w in W if w['song'] == song]
        s.fb = {}
        for w in s.wins:
            size = Image.open('pages_d/%s.png' % w['page']).size
            from w5map import page_index
            s.fb[w['id']] = first_bar(w, ALL[w['page']][w['staff']], s.bars, size, r['sizes'][page_index(w['page'])])
        # printed metre in force: by window order, then by bar
        s.printed = []   # (window id, bar, label)
        for w in s.wins:
            l = LABELS.get(str(w['id']))
            if l and not (l.startswith('c') and l != 'cut') and s.fb[w['id']] is not None:
                s.printed.append((w['id'], s.fb[w['id']], l))
        s.metre_at_bar = [None] * len(s.bars)
        for k, (wid, b0, l) in enumerate(s.printed):
            b1 = s.printed[k + 1][1] if k + 1 < len(s.printed) else len(s.bars)
            for i in range(b0, b1): s.metre_at_bar[i] = l
        s.metre_at_win = {}; cur = None
        for w in s.wins:
            l = LABELS.get(str(w['id']))
            if l and not (l.startswith('c') and l != 'cut'): cur = l
            s.metre_at_win[w['id']] = cur

    def span(s, wid, next_ids):
        """Bars from this window's first bar to the next listed window's first bar (or the end)."""
        b0 = s.fb.get(wid)
        if b0 is None: return []
        later = sorted(s.fb[n] for n in next_ids if s.fb.get(n) is not None and s.fb[n] > b0)
        return list(range(b0, later[0] if later else len(s.bars)))

    def stats(s):
        """For the simulation: each countable bar's sum over its printed length, the share left out, and the
        number of bars each printed signature governs."""
        ratios, out, n = [], 0, 0
        for i, b in enumerate(s.bars):
            l = s.metre_at_bar[i]
            if l is None: continue
            n += 1
            if countable(s.bars, i, mlen(l)): ratios.append(float(b['len'] / mlen(l)))
            else: out += 1
        gov = []
        for k, (wid, b0, l) in enumerate(s.printed):
            b1 = s.printed[k + 1][1] if k + 1 < len(s.printed) else len(s.bars)
            gov.append(b1 - b0)
        return ratios, out, n, gov
