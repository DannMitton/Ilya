import json, cv2, numpy as np, os
TR='/Users/dannmitton/Desktop/ilya-rewrite/tools/e16-harness/output/truth/'
T={1:'mussorgsky_sunless-01_within-four-walls',4:'mussorgsky_sunless-04_be-bored',5:'mussorgsky_sunless-05_elegy',6:'mussorgsky_sunless-06_on-the-river'}
NAMES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
def name(m): return None if m is None else '%s%d'%(NAMES[m%12],m//12-1)
def frac(f): return None if f is None else '%d/%d'%(f['numerator'],f['denominator'])
rows={}
for n in (1,4,5,6):
    tj=json.load(open(TR+T[n]+'.truth.json'))
    tev=sorted(tj['verses'][0]['notes'],key=lambda x:x['onsetAbsolute'])
    sc=json.load(open('scores/song%d.score.json'%n)); shift=sc['shift']
    rd=json.load(open('reads/song%d.read.json'%n)); rev=rd['ro']['verses'][0]['notes']
    geom=json.load(open('geomout/song%d.json'%n))
    loc={}
    for p in geom['pages']:
        for m in p.get('measures',[]): loc[m['measureIndex']]=dict(page=p['scanPage'],s=p['s'],**m)
    diffs=sc['differences']
    out=[]
    for d in diffs[:20]:
        t=tev[d['truthIndex']] if d['truthIndex'] is not None else None
        r=rev[d['readerIndex']] if d['readerIndex'] is not None else None
        rb=d['readerBar']
        if rb is None:
            prev=[x for x in diffs if x['readerIndex'] is not None and x['truthIndex'] is not None and x['truthIndex']<d['truthIndex']]
            if prev: rb=rev[prev[-1]['readerIndex']]['measureIndex']
            else:
                nxt=[x for x in diffs if x['readerIndex'] is not None and x['truthIndex'] is not None and x['truthIndex']>d['truthIndex']]
                rb=rev[nxt[0]['readerIndex']]['measureIndex'] if nxt else (rev[0]['measureIndex'] if rev else None)
        out.append(dict(kind=d['kind'],truthIndex=d['truthIndex'],readerIndex=d['readerIndex'],truthBar=d['truthBar'],readerBar=rb,
            truth=None if t is None else dict(type=t['type'],midi=t.get('midi'),name=name(t.get('midi')),len=frac(t['duration'])),
            reader=None if r is None else dict(type=r['type'],id=r['id'],midi=r.get('midi'),name=name(None if r.get('midi') is None else r['midi']-shift),assumed=name(None if r.get('midiAssumedNatural') is None else r['midiAssumedNatural']-shift),len=frac(r.get('duration')),abstain=r.get('abstain')),
            loc=loc.get(rb)))
    rows[n]=dict(shift=shift,diffs=out)
    bars={}
    for i,o in enumerate(out): bars.setdefault(o['readerBar'],[]).append(i)
    for rbk,idxs in bars.items():
        L=loc.get(rbk)
        if not L: continue
        im=cv2.imread('images.files/s%d-p%d.png'%(n,L['page']),0); s=L['s']
        y0=max(0,int(L['ytop']-3.5*s)); y1=min(im.shape[0],int(L['ybot']+6.5*s))
        x0=max(0,L['x0']-int(0.3*s)); x1=min(im.shape[1],L['x1']+int(0.3*s))
        c=cv2.cvtColor(im[y0:y1,x0:x1],cv2.COLOR_GRAY2BGR)
        f=min(1.0,1100/c.shape[1])
        for e in rev:
            if e['measureIndex']==rbk and e['type']=='note':
                try: ex=int(e['id'].split('-')[1])
                except: continue
                cv2.line(c,(ex-x0,0),(ex-x0,14),(255,0,0),2)
                for i in idxs:
                    if out[i]['reader'] and out[i]['reader']['id']==e['id']:
                        cv2.putText(c,str(i+1),(ex-x0-6,40),cv2.FONT_HERSHEY_SIMPLEX,1.0,(0,0,255),2)
        c=cv2.resize(c,None,fx=f,fy=f,interpolation=cv2.INTER_AREA)
        def tdesc(e): return ('r' if e['type']=='rest' else name(e.get('midi')))+' '+frac(e['duration'])
        def rdesc(e): return ('r' if e['type']=='rest' else (name(e['midi']-shift) if e.get('midi') is not None else '?'+str(name(e['midiAssumedNatural']-shift) if e.get('midiAssumedNatural') is not None else '')))+' '+(frac(e.get('duration')) or 'abst')
        tbs=sorted(set(out[i]['truthBar'] for i in idxs if out[i]['truthBar'] is not None))
        tb=' || '.join('t%d: '%b+' | '.join(tdesc(e) for e in tev if e['measureIndex']==b) for b in tbs)
        rb2=' | '.join(rdesc(e) for e in rev if e['measureIndex']==rbk)
        c=cv2.copyMakeBorder(c,34,44,0,0,cv2.BORDER_CONSTANT,value=(255,255,255))
        cv2.putText(c,'song %d  diffs %s  reader bar %s  scan p%d system %d  (red number = reader note of that difference)'%(n,','.join(str(i+1) for i in idxs),rbk,L['page'],L['system']),(2,20),cv2.FONT_HERSHEY_SIMPLEX,0.55,(0,128,0),1)
        cv2.putText(c,'TRUTH '+tb,(2,c.shape[0]-26),cv2.FONT_HERSHEY_SIMPLEX,0.5,(0,0,0),1)
        cv2.putText(c,'READER (shifted) bar %s: '%rbk+rb2,(2,c.shape[0]-6),cv2.FONT_HERSHEY_SIMPLEX,0.5,(0,0,200),1)
        cv2.imwrite('crops.files/song%d-bar%s.png'%(n,rbk),c)
    rows[n]['bars']=sorted(k for k in bars if k is not None)
json.dump(rows,open('mismatches.json','w'),indent=1,ensure_ascii=False)
for n,r in rows.items(): print(n,r['bars'])
