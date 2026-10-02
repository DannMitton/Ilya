import json,collections
TR='/Users/dannmitton/Desktop/ilya-rewrite/tools/e16-harness/output/truth/'
T={1:TR+'mussorgsky_sunless-01_within-four-walls.truth.json',4:TR+'mussorgsky_sunless-04_be-bored.truth.json',5:TR+'mussorgsky_sunless-05_elegy.truth.json',6:TR+'mussorgsky_sunless-06_on-the-river.truth.json',7:'/Users/dannmitton/Desktop/ilya-rewrite/docs/sessions/truth-draft-tchaikovsky-op38-3-voice_r2_2026-10-02.json'}
def load(n,scores='scores-before',reads='reads-before'):
    tj=json.load(open(T[n])); tev=sorted(tj['verses'][0]['notes'],key=lambda x:x['onsetAbsolute'])
    sc=json.load(open('%s/song%d.score.json'%(scores,n)))
    rd=json.load(open('%s/song%d.read.json'%(reads,n))); rev=rd['ro']['verses'][0]['notes']
    return tev,sc,rev
def frac(f): return None if f is None else (f['numerator'],f['denominator'])
def joined(n):
    tev,sc,rev=load(n)
    ma=json.load(open('ma/song%d.json'%n))
    heads={}
    for p in ma['pages']:
        for h in p.get('heads',[]): heads[h['id']]=h
    rows=[]
    for m in sc['matches']:
        t=tev[m['truthIndex']]; r=rev[m['readerIndex']]
        if t['type']!='note' or r['type']!='note': continue
        h=heads.get(r['id'])
        rows.append(dict(song=n,id=r['id'],truth=frac(t['duration']),read=frac(r['duration']),abst=(r.get('abstain') or {}).get('duration'),head=h,tmidi=t.get('midi'),rmidi=r.get('midi'),tbar=t['measureIndex'],rbar=r['measureIndex']))
    return rows
if __name__=='__main__':
    for n in (1,4,5,6,7):
        rows=joined(n)
        print(n,len(rows),'with head',sum(1 for r in rows if r['head']),'filled',sum(1 for r in rows if r['head'] and not r['head']['hollow']),'hollow',sum(1 for r in rows if r['head'] and r['head']['hollow']))
        c=collections.Counter()
        for r in rows: c[(r['truth'],r['read'])]+=1
        print('  ',sorted(c.items(),key=lambda kv:-kv[1])[:10])
