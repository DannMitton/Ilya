# Lane 81: every change, after against before. python3 diff.py > diff-after-vs-before.txt  (run with the venv python for the picture part)
import json,re,collections,sys
B=json.load(open('census-before.json')); B.update(json.load(open('census-before-ph.json'))); A=json.load(open('census-after.json'))
def role(t): return re.sub(r'\.s-[\w-]+','',t['p'].split(' > ')[-1])
print('## 1. Sheets per document, per condition')
for k in sorted(A):
    if k not in B: print('  MISSING in before:',k); continue
    if A[k]['pages']!=B[k]['pages']: print('  CHANGED',k,B[k]['pages'],'->',A[k]['pages'])
print('  (every other condition: same sheet count)')
print('\n## 2. Items that changed, by condition, document, sheet, role (el/er/et/eb/size/line height/colour)')
F=['el','er','et','eb','fs','fw','lh','col','ls','mt','mb']
agg=collections.OrderedDict()
for k in sorted(A):
    if k not in B: continue
    for si,(sa,sb) in enumerate(zip(A[k]['sheets'],B[k]['sheets'])):
        ta=sa['items']['text']; tb=sb['items']['text']
        la=collections.defaultdict(list); lb=collections.defaultdict(list)
        for t in ta: la[(role(t),t['t'])].append(t)
        for t in tb: lb[(role(t),t['t'])].append(t)
        for key in set(la)|set(lb):
            xa=la.get(key,[]); xb=lb.get(key,[])
            if len(xa)!=len(xb):
                agg.setdefault((k,si+1,key[0],'count'),[]).append((len(xb),len(xa)));continue
            for a,b in zip(xa,xb):
                ch=[f'{f} {b[f]}->{a[f]}' for f in F if str(a[f])!=str(b[f])]
                if ch: agg.setdefault((k,si+1,key[0],'; '.join(ch)),[]).append(key[1])
        for nm in ['rule','hair','footer']:
            if json.dumps(sa[nm])!=json.dumps(sb[nm]): agg.setdefault((k,si+1,nm,f'{sb[nm]} -> {sa[nm]}'),[]).append('')
        for part in ['rules','boxes']:
            pa=[(x['p'][-40:],x['t'],x['b'],x['l'],x['r']) for x in sa['items'][part]]; pb=[(x['p'][-40:],x['t'],x['b'],x['l'],x['r']) for x in sb['items'][part]]
            if pa!=pb: agg.setdefault((k,si+1,part,f'{len(pb)} -> {len(pa)} items, positions differ'),[]).append('')
if not agg: print('  NONE')
last=None
for (k,si,r,ch),ex in agg.items():
    print(f'  {k} sheet {si} | {r} | {ch} | x{len(ex)} e.g. {str(ex[0])[:30]!r}')
