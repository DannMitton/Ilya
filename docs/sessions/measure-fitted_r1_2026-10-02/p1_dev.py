import json, sys, numpy as np, collections
sys.path.insert(0,'/Users/dannmitton/Desktop/ilya-rewrite/tools/e16-harness/reader'); sys.path.insert(0,'.')
import fitted
for song in (1,4,5,6,7):
    d=json.load(open(f'ext/song{song}.json'))
    print('== song',song)
    for pg in d['pages']:
        if pg.get('error'): print('page',pg['page'],'raises'); continue
        N=pg['notes']; s=pg['s']
        fitted.classify_notes(N,s,pg['line_t'])
        V=fitted.page_values(N,s,pg['line_t'])
        dl=collections.Counter(n['dotk'] for n in N)
        print('page',pg['page'],'heads',len(N),'clear stems',V['clear_stems'],'dots',dict(dl))
