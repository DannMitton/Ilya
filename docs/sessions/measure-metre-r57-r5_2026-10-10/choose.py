"""Apply choice-rule.md: sums over the 17 folds of tuning-song right and earlier-seed found and false, by variant.
Reads only each fold's tune_score and early counts. Writes choice.md."""
import json, time
from run_eval import VARIANTS, vname
DOC = '/Users/dannmitton/Desktop/ilya-rewrite/docs/sessions/measure-metre-r57-r5_2026-10-10'
READS = {'A1': 1, 'A9': 9, 'AB18': 18}
tot = {}
for f in range(17):
    e = json.load(open(f'../folds5/f{f:02d}/eval.json'))
    for k, v in e['variants'].items():
        t = tot.setdefault(k, dict(tune_right=0, tune_found=0, early_found=0, early_false=0, early_n=0, untuned=0))
        if not v.get('chosen'): t['untuned'] += 1; continue
        t['tune_right'] += v['tune_score'][0]; t['tune_found'] += v['tune_score'][1]
        t['early_found'] += v['early'].get('found', 0); t['early_false'] += v['early'].get('false', 0); t['early_n'] += sum(v['early'].values())
elig = [k for k, t in tot.items() if t['early_false'] == 0]
pool = elig or list(tot)
key = (lambda k: (tot[k]['tune_right'], tot[k]['early_found'], -READS[k.split('+')[0]])) if elig else (lambda k: (-tot[k]['early_false'], tot[k]['tune_right'], tot[k]['early_found'], -READS[k.split('+')[0]]))
choice = max(pool, key=key)
lines = ['# Row 57 r5: the written choice (%s), before the fresh draw' % time.strftime('%Y-%m-%d %H:%M %Z'), '',
         'Rule: `choice-rule.md`. Sums over the 17 folds; tuning songs are each fold\'s own 4; earlier seeds are 300 renders of each fold\'s held-out music font.', '',
         '| Variant | Tuning songs right | Tuning renders found | Earlier seeds found | Earlier seeds false | Folds with no setting at 0 false |', '|---|---|---|---|---|---|']
for v in VARIANTS:
    k = vname(v); t = tot[k]
    lines.append('| %s | %d | %d | %d of %d | %d | %d |' % (k, t['tune_right'], t['tune_found'], t['early_found'], t['early_n'], t['early_false'], t['untuned']))
lines += ['', '**Chosen: %s.** Eligible (0 false on the earlier seeds): %s.' % (choice, ', '.join(elig) if elig else 'none')]
open(f'{DOC}/choice.md', 'w').write('\n'.join(lines) + '\n')
print('\n'.join(lines))
