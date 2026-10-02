import json,collections
from join import T,load
from join import frac
from a1 import cls
def joinedp(n):
    tev,sc,rev=load(n)
    mp=json.load(open('mp/song%d.json'%n)); heads={}
    for p in mp['pages']:
        for h in p.get('heads',[]): heads[h['id']]=dict(h,page=p['scanPage'])
    rows=[]
    for m in sc['matches']:
        t=tev[m['truthIndex']]; r=rev[m['readerIndex']]
        if t['type']!='note' or r['type']!='note': continue
        h=heads.get(r['id'])
        rows.append(dict(song=n,id=r['id'],truth=frac(t['duration']),read=frac(r['duration']),abst=(r.get('abstain') or {}).get('duration'),head=h))
    return rows
def best_side(h,key=''):
    sides=[]
    for nm in ('R','L'):
        sd=h.get(nm+key)
        if not sd: continue
        comps=sd['comps']
        sides.append((sum(c['area'] for c in comps),nm,sd))
    if not sides: return None
    sides.sort(key=lambda x:-x[0]); return sides[0]
if __name__=='__main__':
    import sys
    key=sys.argv[1] if len(sys.argv)>1 else ''
    for n in (7,):
        rows=[r for r in joinedp(n) if r['head'] and not r['head'].get('short')]
        by=collections.defaultdict(list)
        for r in rows:
            c=cls(r['truth']).rstrip('.'); b=best_side(r['head'],key)
            if b is None or not b[2]['comps']: by[c].append((0,0,0,0))
            else:
                top=max(b[2]['comps'],key=lambda c:c['area']); by[c].append((len(b[2]['comps']),top['reach'],top['tmax'],top['runs_out'] or top['runs_bottom']))
        for c in ('quarter','eighth','sixteenth'):
            L=by[c]
            if not L: continue
            reach=sorted(x[1] for x in L); tm=sorted(x[2] for x in L)
            print(c,len(L),'no comp',sum(1 for x in L if x[0]==0),'reach min %.2f p10 %.2f med %.2f p90 %.2f max %.2f'%(reach[0],reach[int(.1*(len(L)-1))],reach[len(L)//2],reach[int(.9*(len(L)-1))],reach[-1]),'| travel min %.2f med %.2f max %.2f'%(tm[0],tm[len(L)//2],tm[-1]),'| runs on',sum(1 for x in L if x[3]))
