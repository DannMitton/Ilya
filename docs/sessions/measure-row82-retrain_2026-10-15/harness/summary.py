"""N.135 stage 1: the answer in one place. For R1 (row 81's rows) and R2 (R1's rows split at the valleys of their ink): per song and reader, 4.2 syllables right (percent of the printed syllables, sound),
and 4.4 seating (percent of the truth's syllable-bearing notes seated right in sound, rules 1, 2, 3), with a mark where a cell reaches 90 percent; plus the rows that R1 leaves merged.
Usage: python3 summary.py -> summary.txt"""
import json, os, collections
from common2 import *
out = []
for rule in ('R1', 'R2'):
    f44 = f'{HERE}/score44-{rule}.json'; f42 = f'{HERE}/score42-{rule}-split.json'; f42b = f'{HERE}/score42-{rule}.json'
    if not (os.path.exists(f44) and os.path.exists(f42)): out.append(f'{rule}: not computed'); continue
    s44 = json.load(open(f44)); s42 = json.load(open(f42)); s42b = json.load(open(f42b)); readers = sorted({k.split('|')[1] for k in s44}, key=lambda m: READERS.index(m))
    out.append(f'== {rule}: per song, % of printed syllables read right in sound, tokens split at a hyphen (4.2, from score42-{rule}-split.txt) / seating, % of the truth syllable-bearing notes right in sound, rules 1 2 3 (4.4); * = 90 or more')
    out.append('song | ' + ' | '.join(f'({m}) read | seat 1 2 3' for m in readers))
    cnt = collections.Counter(); grp = collections.defaultdict(lambda: collections.Counter())
    for L in [s for s in SONGS if s not in 'KM']:
        cells = []
        for m in readers:
            r = s42[f'{L}|{m}']; rd = 100 * r['sound'] / r['printed']
            st = [100 * s44[f'{L}|{m}|{k}']['sound'] / s44[f'{L}|{m}|{k}']['syl'] for k in (1, 2, 3)]
            cells.append(f"{rd:.0f}{'*' if rd >= 90 else ''} | " + ' '.join(f"{x:.0f}{'*' if x >= 90 else ''}" for x in st))
            for k, x in zip((1, 2, 3), st):
                if x >= 90: cnt[(m, k)] += 1; grp[(m, k)][L[0] if L[0] in 'UB' else L] += 1
        out.append(f'{L} | ' + ' | '.join(cells))
    out.append('songs at 90 percent or more (of 16 with syllable truth), per reader and rule: ' + '; '.join(f'({m}) rule {k}: {cnt[(m, k)]}' + (' [' + ', '.join(f'{g} {n}' for g, n in grp[(m, k)].items()) + ']' if cnt[(m, k)] else '') for m in readers for k in (1, 2, 3)))
    for m in readers:
        best = collections.Counter()
        for L in [s for s in SONGS if s not in 'KM']:
            sc = {k: s44[f'{L}|{m}|{k}']['sound'] for k in (1, 2, 3)}; mx = max(sc.values()); best.update([k for k, v in sc.items() if v == mx])
        out.append(f'({m}) rule is the best (ties counted for each) on: ' + ', '.join(f'rule {k} {best[k]} of 16 songs' for k in (1, 2, 3)))
    best = []
    for L in [s_ for s_ in SONGS if s_ not in 'KM']:
        c = max(((100 * s44[f'{L}|{m}|{k}']['sound'] / s44[f'{L}|{m}|{k}']['syl'], m, k) for m in readers for k in (1, 2, 3)))
        best.append(f'{L} {c[0]:.0f}% ({c[1]}, rule {c[2]})')
    out.append(f'{rule}: the best cell per song (percent of the truth syllables seated right in sound; reader, rule): ' + '; '.join(best))
    out.append('')
for rule in ('R1', 'R2'):
    lab = {L: labels_ for L, labels_ in ((L, json.load(open(f'{HERE}/labels{"" if rule == "R1" else "2"}/{L}.json'))['rows']) for L in SONGS)}
    rr = {}
    for L in SONGS:
        R = [json.loads(l) for l in open(f'{HERE}/rows{"" if rule == "R1" else "2"}/{L}.jsonl')]
        k = lambda r: f"p{r['page']}s{r['system']}r{r['row']}"
        rus = [r for r in R if lab[L][k(r)] == 'russian']; tall = [r for r in rus if (r['core'][1] - r['core'][0] + 1) > 2.2 * r['space']]
        rr[L] = (len(rus), len(tall), len(R))
    out.append(f'{rule}: Russian rows / of them taller than 2.2 staff spaces (merged with the row under or the piano above) / all rows, per song: ' + '; '.join(f'{L} {a}/{b}/{c}' for L, (a, b, c) in rr.items()))
import re
for rule in ('R1', 'R2'):
    f = f'{HERE}/score43-{rule}.txt'
    if not os.path.exists(f): continue
    txt = open(f, encoding='utf8').read(); sec = txt[txt.index('Pages that pass'):]; tot = collections.defaultdict(lambda: [0, 0]); grp = collections.defaultdict(lambda: collections.defaultdict(lambda: [0, 0]))
    for line in sec.splitlines()[1:]:
        L = line.split(':')[0]
        for m, a, b in re.findall(r'\(([^)]+)\) (\d+)/(\d+)', line):
            tot[m][0] += int(a); tot[m][1] += int(b); g = L[0] if L[0] in 'UB' else ('P' if L == 'P' else 'STKM'); grp[m][g][0] += int(a); grp[m][g][1] += int(b)
    out.append(f"{rule}: pages that pass section 5's DESK DEFAULT (decision 1, dictionary witness), of all pages: " + '; '.join(f"({m}) {t[0]}/{t[1]} [" + ', '.join(f'{g} {v[0]}/{v[1]}' for g, v in grp[m].items()) + ']' for m, t in tot.items()))
open(f'{HERE}/summary.txt', 'w', encoding='utf8').write('\n'.join(out) + '\n'); print('\n'.join(out))
