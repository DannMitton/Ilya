"""Row 57 r6 run 4: one line, "stated S, agreeing M", for one song, against its truth, at the bars where Ilya states a
signature (the app's console lines "[omr] metre: bar N ... stated"). Each stated reader bar is paired with the truth bar
whose matched events it holds most of (the scorer's own matches). Agreement is by figure where the truth carries
figures (C as 4/4 and cut C as 2/2, DESK DEFAULT), else by the truth bar's length; the line says which. Prints nothing
else of the song. Usage: python3 stated.py <letter> <truth.json> <read.json> <score.json> <drop.json>"""
import json, re, sys
from fractions import Fraction
letter, tp, rp, sp, dp = sys.argv[1:]
tj = json.load(open(tp)); rd = json.load(open(rp)); sc = json.load(open(sp)); dr = json.load(open(dp))
stated = []
for l in dr['logs']:
    m = re.search(r'metre: bar (\d+) \(page \d+\): (\S+) stated', l)
    if m: stated.append((int(m.group(1)) - 1, m.group(2)))
notes = sorted(tj['verses'][0]['notes'], key=lambda n: n['onsetAbsolute'])
t_of_r = {}
for mt in sc['matches']:
    tb = notes[mt['truthIndex']]['measureIndex']; rb = rd['events'][mt['readerIndex']]['measureIndex']
    t_of_r.setdefault(rb, {}).setdefault(tb, 0); t_of_r[rb][tb] += 1
def mlen(lab):
    if lab in ('C', 'cut'): return Fraction(4)
    a, b = lab.split('/'); return Fraction(4 * int(a), int(b))
fig = tj.get('timeSignature')
by = 'figure' if fig and isinstance(fig.get('beats'), int) else 'length'
def printed(tb):
    cur = fig
    for c in sorted(tj.get('metreChanges') or [], key=lambda c: c['measureIndex']):
        if c['measureIndex'] <= tb: cur = c
    return '%d/%d' % (cur['beats'], cur['beatType'])
durs = {d['index']: Fraction(d['expectedDuration']['numerator'], d['expectedDuration']['denominator']) * 4 for d in tj['measureDurations']}
agree = unpaired = 0
def truth_bar(rb):
    """The truth bar a reader bar pairs with: by its matched events, or where it has none (a bar where the voice rests,
    emptied by the join), through the next reader bar that has, counting back bar for bar (DESK DEFAULT)."""
    votes = t_of_r.get(rb)
    if votes: return max(votes, key=lambda k: (votes[k], -k))
    later = sorted(r for r in t_of_r if r > rb)
    if not later: return None
    v = t_of_r[later[0]]; tb = max(v, key=lambda k: (v[k], -k)) - (later[0] - rb)
    return tb if tb >= 0 else None
for rb, lab in stated:
    tb = truth_bar(rb)
    if tb is None: unpaired += 1; continue
    if by == 'figure':
        p = printed(tb); ok = p == {'C': '4/4', 'cut': '2/2'}.get(lab, lab)
    else:
        ok = durs.get(tb) == mlen(lab)
    agree += ok
print(f"{letter}: stated {len(stated)}, agreeing {agree} (by {by}){f'; {unpaired} stated on a bar with no matched note, counted as not agreeing' if unpaired else ''}; false {len(stated) - agree}")
