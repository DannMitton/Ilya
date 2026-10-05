"""4b. The bar check under the corrected rule, over the joined voice part of each song.

The rule, as the desk built it from Dann's correction of 2026-10-05 00:52:
  the first bar may be short; the last bar passes if it is full, or if it and the first bar make one full bar;
  the same holds at a repeat sign or a double bar inside a song; a change of metre changes what "full" means;
  a bar marked free is exempt; any other bar that does not add up is marked, never changed.

How each case is treated here (the report says the same):
  sum        the written lengths (type, dots, time-modification) of the bar's notes and rests on staff 1, chord
             notes and grace notes left out, as conv.py counts them. Where the bar holds a <backup> or <forward>,
             the sum is taken per <voice> and the longest voice is the bar's length.
  full       beats/beat-type of the metre in force in the reading at that bar.
  empty bar  a bar the join left with no note (homr wrote rests only; the join drops them): passes, because the
             voice is silent. homr's rests before the join are summed apart and counted (rest bar short / long),
             where a single whole rest counts as a full bar of rest whatever the metre.
  first bar  passes when 0 < sum < full (an anacrusis).
  last bar   passes when sum == full, or when sum + the first bar's sum == full.
  inner boundary  a bar whose right barline homr writes as a double bar (light-light, light-heavy, heavy-heavy) or
             a repeat, or whose next bar's left barline is a repeat: it is treated as a last bar against the
             bar after it, and the bar after it as a first bar. homr's <ending> is counted, not treated as one.
  free bar   cannot be known from the reading; none is counted.
Writes out/tables/4b-bars-<song>.csv, 4b-summary.csv, 4b-falseflags.csv."""
import csv, json, sys
from fractions import Fraction as F
from collections import Counter
from lib import SONGS, load_song, diff_places

T = '/home/claude/checks/out/tables'
DOUBLE = {'light-light', 'light-heavy', 'heavy-heavy', 'heavy-light'}


def bar_sum(rec):
    ns = [n for n in rec['notes'] if not n['chord'] and not n['grace']]
    if rec['backup'] or rec['forward']:
        per = {}
        for n in ns:
            per[n['voice']] = per.get(n['voice'], F(0)) + (n['written'] or F(0))
        return max(per.values()) if per else F(0), per
    return sum((n['written'] or F(0) for n in ns), F(0)), None


def prejoin_rest(rec):
    ns = [n for n in rec['prejoin_notes'] if not n['chord'] and not n['grace']]
    if not ns:
        return None, 'no rest written'
    if len(ns) == 1 and ns[0]['rest'] and ns[0]['type'] == 'whole':
        return F(rec['beats'], rec['beat_type']), 'single whole rest'
    return sum((n['written'] or F(0) for n in ns), F(0)), 'rests'


def check(S):
    J = S['joined']
    last = len(J) - 1
    # inner boundaries: right barline double or repeat on bar i (not the last), or left repeat on bar i+1
    boundary_after = set()
    for i, r in enumerate(J):
        for b in r['barlines']:
            if i < last and b['location'] == 'right' and (b['style'] in DOUBLE or b['repeat']):
                boundary_after.add(i)
            if i > 0 and b['location'] == 'left' and b['repeat']:
                boundary_after.add(i - 1)
    starts = {0} | {i + 1 for i in boundary_after}
    ends = {last} | boundary_after
    rows = []
    sums = [bar_sum(r)[0] for r in J]
    for i, r in enumerate(J):
        full = F(r['beats'], r['beat_type'])
        s, per = bar_sum(r)
        ns = [n for n in r['notes'] if not n['chord'] and not n['grace']]
        cursor = r['cursor_max']
        cases = []
        if i == 0: cases.append('first bar')
        if i == last: cases.append('last bar')
        if i in boundary_after: cases.append('before inner boundary')
        if i - 1 in boundary_after: cases.append('after inner boundary')
        if r['stated_time'] and i > 0: cases.append('metre stated')
        if any(n['tuplet'] for n in r['notes']): cases.append('tuplet')
        if any(n['grace'] for n in r['notes']): cases.append('grace')
        if any(n['chord'] for n in r['notes']): cases.append('chord')
        if r['backup'] or r['forward']: cases.append('backup/forward')
        if any(b['ending'] for b in r['barlines']): cases.append('ending')
        status, why = None, ''
        rest_sum, rest_kind = None, None
        if not ns:
            cases.append('empty bar')
            rest_sum, rest_kind = prejoin_rest(r)
            if rest_sum is not None and rest_sum != full:
                cases.append('rest bar short' if rest_sum < full else 'rest bar long')
            status, why = 'pass', 'empty: voice silent'
        elif s == full:
            status, why = 'pass', 'full'
        elif i in starts and F(0) < s < full:
            status, why = 'pass', 'short first bar (anacrusis)' if i == 0 else 'short bar after inner boundary'
        elif i in ends:
            nxt = 0 if i == last else i + 1
            if s + sums[nxt] == full:
                status, why = 'pass', 'complements bar %d' % (nxt + 1)
            else:
                status, why = 'flag', 'end bar neither full nor complement'
        else:
            status, why = 'flag', 'short' if s < full else 'long'
        rows.append(dict(bar=i + 1, readerBar=i, page=r['page'], pageMeasure=r['page_measure'],
                         metre=f"{r['beats']}/{r['beat_type']}", full=str(full), sum=str(s),
                         durSum=str(cursor), sumsDiffer=(bool(ns) and cursor != s),
                         events=len(ns), status=status, why=why, cases=';'.join(cases),
                         perVoice=(json.dumps({k: str(v) for k, v in per.items()}) if per else ''),
                         restSum=(str(rest_sum) if rest_sum is not None else ''), restKind=rest_kind or '',
                         content=' '.join(('r' if n['rest'] else f"{n['step']}{n['octave']}{'#' * max(n['alter'], 0)}{'b' * max(-n['alter'], 0)}")
                                          + f":{n['type']}{'.' * n['dots']}{'(3)' if n['tuplet'] else ''}{'+ch' if n['chord'] else ''}" for n in r['notes'])))
    return rows


def main():
    summary, falses = [], []
    for song in SONGS:
        S = load_song(song)
        rows = check(S)
        diffs, _ = diff_places(S)
        bydiff = {}
        for d in diffs:
            bydiff.setdefault(d['readerBarPlaced'], []).append(d)
        for r in rows:
            ds = bydiff.get(r['readerBar'], [])
            r['differences'] = len(ds)
            r['differenceKinds'] = ';'.join(d['kind'] for d in ds)
        with open(f'{T}/4b-bars-{song}.csv', 'w', newline='') as f:
            w = csv.DictWriter(f, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)
        flagged = [r for r in rows if r['status'] == 'flag']
        right = [r for r in flagged if r['differences'] > 0]
        false = [r for r in flagged if r['differences'] == 0]
        flagged_bars = {r['readerBar'] for r in flagged}
        unflagged_diffs = Counter()
        for d in diffs:
            if d['readerBarPlaced'] not in flagged_bars:
                k = d['kind']
                k = 'pitch' if 'pitch' in k else 'length' if 'length' in k else k
                unflagged_diffs[k] += 1
        cases = Counter(c for r in rows for c in r['cases'].split(';') if c)
        whys = Counter(r['why'] for r in rows)
        summary.append(dict(song=song, bars=len(rows), flagged=len(flagged), flaggedWithDifference=len(right),
                            falseFlags=len(false), differences=len(diffs),
                            differencesInFlaggedBars=sum(1 for d in diffs if d['readerBarPlaced'] in flagged_bars),
                            unflaggedDifferences=json.dumps(dict(unflagged_diffs)),
                            cases=json.dumps(dict(cases)), outcomes=json.dumps(dict(whys)),
                            sumsDiffer=sum(1 for r in rows if r['sumsDiffer'])))
        for r in false:
            falses.append(dict(song=song, **{k: r[k] for k in ('bar', 'page', 'pageMeasure', 'metre', 'sum', 'why', 'cases', 'content')}))
        print(f"{song}: bars {len(rows)} flagged {len(flagged)} right {len(right)} false {len(false)}; diffs {len(diffs)}; unflagged diffs {dict(unflagged_diffs)}")
        print('   flagged:', [(r['bar'], r['sum'], r['metre'], r['why'], r['differences']) for r in flagged])
        print('   cases:', dict(cases))
        print('   outcomes:', dict(whys))
    with open(f'{T}/4b-summary.csv', 'w', newline='') as f:
        w = csv.DictWriter(f, fieldnames=list(summary[0].keys())); w.writeheader(); w.writerows(summary)
    with open(f'{T}/4b-falseflags.csv', 'w', newline='') as f:
        if falses:
            w = csv.DictWriter(f, fieldnames=list(falses[0].keys())); w.writeheader(); w.writerows(falses)


if __name__ == '__main__':
    main()
