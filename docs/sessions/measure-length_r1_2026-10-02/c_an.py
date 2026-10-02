import json,collections
from join import load
HALF={(1,2):'half',(3,4):'dotted half'}
STEP={0:0,1:0,2:1,3:1,4:2,5:3,6:3,7:4,8:4,9:5,10:5,11:6}
def row_y(lines,midi):
    """expected y of a G-clef (treble) note: E4=64 on the bottom line; midi given after the song's +12 shift"""
    m=midi
    deg=(m//12-1)*7+STEP[m%12]      # C0.. diatonic index with C=0
    e4=(4-1)*7+2                     # diatonic index of E4... octave 4 -> (4)*? compute below
    return None
def diatonic(m):
    return (m//12)*7+STEP[m%12]
def y_of(lines,midi):
    top=lines[0]; d=(lines[4]-lines[0])/8.0       # half-space in px
    # E4 (64) sits on the bottom line (lines[4]); each diatonic step up = d px upward
    return lines[4]-(diatonic(midi)-diatonic(64))*d
out={}
for n in (5,6):
    tev,sc,rev=load(n,'scores-before','reads-before')
    geom=json.load(open('../measure-baseline_r1_2026-10-02/geomout/song%d.json'%n))
    loc={}
    for p in geom['pages']:
        for m in p.get('measures',[]): loc[m['measureIndex']]=dict(page=p['scanPage'],s=p['s'],**m)
    cc=json.load(open('ma/c%d.json'%n)); hollow={p['scanPage']:p for p in cc if 'admitted' in p}
    ma=json.load(open('ma/song%d.json'%n)); heads={}
    for p in ma['pages']:
        for h in p.get('heads',[]): heads[h['id']]=h
    match={m['truthIndex']:m['readerIndex'] for m in sc['matches']}
    # last matched reader bar before each truth index (for unmatched)
    rows=[]
    lastbar=None
    for ti,t in enumerate(tev):
        if ti in match: lastbar=rev[match[ti]]['measureIndex']
        if t['type']!='note' or (t['duration']['numerator'],t['duration']['denominator']) not in HALF: continue
        k=HALF[(t['duration']['numerator'],t['duration']['denominator'])]
        if ti in match:
            r=rev[match[ti]]; h=heads.get(r['id'])
            rows.append(dict(kind=k,truthBar=t['measureIndex'],fate='matched',read=r['duration'],abst=(r.get('abstain') or {}).get('duration'),hollow=bool(h and h['hollow']),id=r['id'],page=h['page'] if h else None))
        else:
            # find the reader bar by neighbours: the next matched event's bar if lastbar is None
            nxt=[match[j] for j in range(ti,len(tev)) if j in match]
            rb=lastbar if lastbar is not None else (rev[nxt[0]]['measureIndex'] if nxt else None)
            L=loc.get(rb); fate='no detection'; near=None
            if L:
                ph=hollow.get(L['page']); s=L['s']
                lines=None
                # staff lines of this bar's system: from any head in the page with the same sys
                for h in heads.values():
                    if h['page']==L['page'] and h['sys']==L['system']-1: lines=h['lines']; break
                if lines and ph:
                    ey=y_of(lines,t['midi']+12)
                    cand=[('hook',k2) for k2 in ph['hooks'] if k2['sys']==L['system']-1 and L['x0']<=k2['x']<L['x1'] and abs(k2['y']-ey)<=1.6*s]
                    cand+=[('admitted',k2) for k2 in ph['admitted'] if k2['sys']==L['system']-1 and L['x0']<=k2['x']<L['x1'] and abs(k2['y']-ey)<=1.6*s]
                    if cand: near=cand
            rows.append(dict(kind=k,truthBar=t['measureIndex'],fate='unmatched',readerBar=rb,loc=L and (L['page'],L['system']),near=near and [(a,dict(x=b['x'],y=b['y'],closed_nolines=b['nolines'] and b['nolines']['closed'],closed_withlines=b['withlines'] and b['withlines']['closed'],area=b['nolines'] and b['nolines']['area'])) for a,b in near]))
    out[n]=rows
    print('song',n,'printed half/dotted half',len(rows))
    c=collections.Counter()
    for r in rows:
        if r['fate']=='matched': c[('matched',r['kind'],'hollow' if r['hollow'] else 'filled',r['abst'] or 'length '+('%d/%d'%tuple(r['read'].values()) if r['read'] else 'None'))]+=1
        else: c[('unmatched',r['kind'],'hook' if r['near'] and r['near'][0][0]=='hook' else ('admitted hollow' if r['near'] else 'no detection'))]+=1
    for k,v in sorted(c.items(),key=lambda kv:-kv[1]): print('  ',k,v)
json.dump(out,open('c_rows.json','w'),indent=1,default=str)
