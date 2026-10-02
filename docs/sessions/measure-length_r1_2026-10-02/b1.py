import json,collections,statistics
from join import joined
from a1 import cls
OFFS=['0.25','0.45','0.65','0.85']
def per_page_lt():
    lt={}
    for n in (1,4,5,6,7):
        d=json.load(open('ma/song%d.json'%n))
        for p in d['pages']:
            if 'lt' in p: lt[(n,p['scanPage'])]=(p['lt'],p['s'])
    return lt
LT=per_page_lt()
def maxthick(h):
    """thickest run, either side, at offsets 0.25..0.85, window start within [-0.6,2.0]"""
    p=h['stem']['prof']; m=0
    for sd in 'RL':
        for o in OFFS:
            for a,b in p[sd+o]:
                if -0.6<=a<=2.0: m=max(m,b)
    return m
if __name__=='__main__':
    for n in (1,4,5,6,7):
        rows=[r for r in joined(n) if r['head'] and not r['head']['hollow'] and r['head'].get('stem')]
        by=collections.defaultdict(list)
        for r in rows: by[cls(r['truth']).rstrip('.')].append(maxthick(r['head'])/ (LT[(n,r['head']['page'])][0]/LT[(n,r['head']['page'])][1]) )
        print('song',n,'max run thickness over the line thickness')
        for k,v in sorted(by.items()):
            v=sorted(v); q=lambda f:round(v[int(f*(len(v)-1))],2)
            print('  ',k,len(v),'min',q(0),'p10',q(.1),'median',q(.5),'p90',q(.9),'max',q(1))
