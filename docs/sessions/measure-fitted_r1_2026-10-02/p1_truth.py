import json, sys, numpy as np, collections
from fractions import Fraction
sys.path.insert(0,'/Users/dannmitton/Desktop/ilya-rewrite/tools/e16-harness/reader'); sys.path.insert(0,'.')
import fitted, truthjoin
CLS={Fraction(1,4):'plain',Fraction(1,8):'flag1',Fraction(1,16):'flag2'}
for song in (1,4,5,6,7):
    d=json.load(open(f'ext/song{song}.json')); m,sc=truthjoin.join(song,d['pages'],'scores-scans-400')
    tab=collections.Counter(); wrong=[]
    for pg in d['pages']:
        if pg.get('error'): continue
        N=pg['notes']; s=pg['s']; fitted.classify_notes(N,s,pg['line_t'])
        for n in N:
            t=m.get(n['ro_global'])
            if t is None or t['type']!='note': continue
            b,dot=truthjoin.base_of(t['duration']); tb=CLS.get(b,'other') if b else 'other'
            tab[(n['kind'] or 'unclear', tb)]+=1
            dk=n['dotk']
            if dk: tab[('dot:'+dk,'truth dotted' if dot else 'truth plain')]+=1
    print('== song',song)
    for k in sorted(tab,key=str): print('  ',k,tab[k])
