"""N.135 stage 1, the labels: which row of every system is the Russian underlay, from the truth's syllables (no reader's name in the choice but (a) and (c)).
A row is 'notext' where its core is taller than 2.2 staff spaces (staff bodies, noteheads, slurs). For S, T, K, M the Russian rows are row 81's poem.txt rows.
For the others: each text row of a system is compared with that system's printed syllables (the truth, typed in note order), by difflib ratio of letters with every
pre-reform letter folded to its modern one (common2.crude), summed over readers (a) and (c); the best row is the Russian one if its sum is at least 0.5 and clears the next row by 0.1;
otherwise the system is 'ambiguous' and listed. These labels are the desk's check on the readers, to be spot-checked by eye on two systems per song (sheets/).
Usage: python3 label.py"""
import json, difflib, os
os.makedirs(f'{os.path.dirname(os.path.abspath(__file__))}/labels' + ('' if os.environ.get('RULE', 'R1') == 'R1' else '2'), exist_ok=True)
from common2 import *
out_all = {}
for L in SONGS:
    R = rows(L); S = systems(L); lab = {}; info = []
    if L in FOUR:
        poem = {}
        for l in open(f'{HERE}/poem-r81.txt', encoding='utf8'):
            if l.startswith('#') or not l.strip(): continue
            k, v = l.rstrip('\n').split(': ', 1); a, r = k.split(); poem.setdefault(a, {})[r] = v.split()
        for r in R: lab[rid(r)] = 'russian' if (r.get('from', rid(r)) in poem[L] and (D == '' or sum(1 for q in R if q.get('from') == r.get('from')) == 1)) else ('notext' if (r['core'][1] - r['core'][0] + 1) > 2.2 * r['space'] else 'other')
        out_all[L] = dict(rows=lab, systems=[]); json.dump(out_all[L], open(f'{HERE}/labels{D}/{L}.json', 'w'), ensure_ascii=False, indent=0); continue
    T = truth_by_system(L); A = {m: {rid(r): r for r in ocr(L, m)} for m in ('a', 'c')}
    for b in S:
        key = (b['page'], b['system']); rs = [r for r in R if (r['page'], r['system']) == key]
        want = crude(''.join(p for _, p in T.get(key, [])))
        sc = {}
        for r in rs:
            lab[rid(r)] = 'notext' if (r['core'][1] - r['core'][0] + 1) > 2.2 * r['space'] else 'other'
            tot = 0
            for m in A:
                got = crude(''.join(w['text'] for w in sorted(A[m][rid(r)]['words'], key=lambda w: w['bbox'][0])))
                tot += difflib.SequenceMatcher(None, got, want, autojunk=False).ratio() if want and got else 0
            sc[rid(r)] = round(tot, 3)
        ranked = sorted(sc.items(), key=lambda kv: -kv[1]); verdict = 'none'
        if ranked and want:
            if ranked[0][1] >= 0.5 and (len(ranked) < 2 or ranked[0][1] - ranked[1][1] >= 0.1): lab[ranked[0][0]] = 'russian'; verdict = 'ok'
            elif L.startswith('U') and rs: lab[rs[0] and rid(rs[0])] = 'russian'; verdict = 'first-row'  # Sunless prints the Russian row first (memo-desk-truth-from-finale_r1_2026-10-02.md:36); checked by eye on two systems per song
            else: verdict = 'ambiguous'
        info.append(dict(page=b['page'], system=b['system'], truthSyllables=len(T.get(key, [])), verdict=verdict, scores=sc))
    out_all[L] = dict(rows=lab, systems=info); json.dump(out_all[L], open(f'{HERE}/labels{D}/{L}.json', 'w'), ensure_ascii=False)
    c = {v: sum(1 for x in lab.values() if x == v) for v in ('russian', 'other', 'notext')}; vd = {v: sum(1 for i in info if i['verdict'] == v) for v in ('ok', 'first-row', 'ambiguous', 'none')}; tall = sum(1 for r in R if lab[rid(r)] == 'russian' and (r['core'][1] - r['core'][0] + 1) > 2.2 * r['space'])
    print(L, 'systems', len(S), 'rows', len(R), c, vd, 'russian rows taller than 2.2 spaces:', tall)
for L in FOUR: print(L, {v: sum(1 for x in out_all[L]['rows'].values() if x == v) for v in ('russian', 'other', 'notext')})
