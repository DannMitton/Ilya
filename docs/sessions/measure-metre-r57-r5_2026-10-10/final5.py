"""Fresh-seed totals by variant and by font, and the bar of brief r5 section 3 for the written choice."""
import json, re
from collections import Counter, defaultdict
from run_eval import VARIANTS, vname
DOC = '/Users/dannmitton/Desktop/ilya-rewrite/docs/sessions/measure-metre-r57-r5_2026-10-10'
choice = re.search(r'\*\*Chosen: (.+?)\.\*\*', open(f'{DOC}/choice.md').read()).group(1)
tot = defaultdict(Counter); font = defaultdict(lambda: defaultdict(Counter)); falses = defaultdict(list)
for f in range(17):
    m = json.load(open(f'../folds5/f{f:02d}/meta.json')); fr = json.load(open(f'../folds5/f{f:02d}/fresh.json'))
    for k, v in fr.items():
        if not v: continue
        tot[k].update(v['res']); font[k][m['font']].update(v['res']); falses[k] += [(m['font'], t, s) for t, s in v['falses']]
out = dict(choice=choice, tot={k: dict(v) for k, v in tot.items()}, font={k: {a: dict(b) for a, b in v.items()} for k, v in font.items()}, falses=falses)
c1 = choice.replace('+w5', '')
bar = dict(config2_false=tot[choice]['false'], config1=c1, config1_false=tot[c1]['false'],
           config1_max_font=max((v['false'] for v in font[c1].values()), default=0))
out['bar'] = bar
json.dump(out, open('../fresh_summary.json', 'w'), indent=1, default=str)
for v in VARIANTS:
    k = vname(v); t = tot[k]
    print('%-16s found %4d missed %4d false %3d none %4d' % (k, t['found'], t['missed'], t['false'], t['none']), '| by font false:', {a: b['false'] for a, b in font[k].items() if b['false']})
print('choice', choice, bar)
