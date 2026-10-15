"""N.135 stage 1, 4.1: rows per system for every song, by rule R1 (row 81's) and R2 (R1's rows split at the valleys of their ink), the Russian rows each leaves taller than 2.2 staff spaces,
and the systems label.py could not settle. Usage: python3 rowstats.py -> rowstats.txt"""
import json, collections
from common2 import *
out = ['song | pages | systems | R1 rows per system, in order | R1 Russian rows / merged | R2 rows | R2 Russian rows / merged | systems with no Russian row found (R2) ']
for L in SONGS:
    S = [json.loads(l) for l in open(f'{HERE}/systems/{L}.jsonl')]; r1 = [json.loads(l) for l in open(f'{HERE}/rows/{L}.jsonl')]; r2 = [json.loads(l) for l in open(f'{HERE}/rows2/{L}.jsonl')]
    l1 = json.load(open(f'{HERE}/labels/{L}.json'))['rows']; l2 = json.load(open(f'{HERE}/labels2/{L}.json'))['rows']
    k = lambda r: f"p{r['page']}s{r['system']}r{r['row']}"; tall = lambda r: (r['core'][1] - r['core'][0] + 1) > 2.2 * r['space']
    per = [sum(1 for r in r1 if (r['page'], r['system']) == (s['page'], s['system'])) for s in S]
    ru1 = [r for r in r1 if l1[k(r)] == 'russian']; ru2 = [r for r in r2 if l2[k(r)] == 'russian']
    miss = [f"p{s['page']}s{s['system']}" for s in S if not any((r['page'], r['system']) == (s['page'], s['system']) for r in ru2)]
    out.append(f"{L} | {max(s['page'] for s in S)} | {len(S)} | {' '.join(map(str, per))} | {len(ru1)}/{sum(tall(r) for r in ru1)} | {len(r2)} | {len(ru2)}/{sum(tall(r) for r in ru2)} | {', '.join(miss) or 'none'}")
open(f'{HERE}/rowstats.txt', 'w', encoding='utf8').write('\n'.join(out) + '\n'); print('\n'.join(out))
