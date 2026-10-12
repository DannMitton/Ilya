"""Row 80, step 3: for every note homr read, the words of its system's underlay band (Tesseract, rus+eng+fra, band run)
whose box overlaps the head (imgpos x +-30 px, about one head), and which is nearest below.
Three readings of the measure:
  A (the brief's): the note is the Russian line when the nearest word below it is Cyrillic by its letters.
  B: the note is not the Russian line only when a Latin word is in its column and no Cyrillic word is.
  C: as B, with each underlay row given one script by the letters of the whole row (Tesseract reads pre-reform Cyrillic
     as Latin look-alikes word by word; a row of the poem is in one language).
  D: as B, with each row read twice, by Russian alone and by English and French alone; the row is Cyrillic where the
     Russian reading's mean confidence is the higher, and its words' boxes come from that reading.
  E: as B, with a row Cyrillic where at least half of the words its Russian-only reading gives (two letters or more)
     are found in the song's own Russian text (the truth file's syllables, standing in for the singer's poem), both
     spelled without pre-reform letters (ѣ е, і и, ѳ ф, a final ъ dropped).
Usage: python3 step3.py <words dir> <letter> <truth.json> [bars a-b,...]   prints a table for those bars, then totals for the whole song."""
import json,sys
WD,L,TRUTH=sys.argv[1],sys.argv[2],sys.argv[3]
import re
def norm(t): t=t.lower().replace('ѣ','е').replace('і','и').replace('ѳ','ф'); t=re.sub(r'ъ\b','',t); return re.sub(r'[^а-яё]','',t)
POEM=norm(''.join(n.get('syllable') or '' for n in sorted(json.load(open(TRUTH))['verses'][0]['notes'],key=lambda n:n['onsetAbsolute']) if (n.get('syllable') or '_')!='_'))
want=[tuple(map(int,s.split('-'))) for s in sys.argv[4].split(',')] if len(sys.argv)>4 else []
ns=[json.loads(l) for l in open(f'{L}.notes.jsonl')]; ns=[n for n in ns if not n['chord']]
st=json.load(open(f'{L}.status.json')); assert len(st)==len(ns)
systems=[json.loads(l) for l in open(f'{L}.systems.jsonl')]
N=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
def letters(t): return sum(1 for c in t if 'Ѐ'<=c<='ӿ'), sum(1 for c in t if c.isalpha() and c.isascii() or 'À'<=c<='ɏ')
cache={}
def bandwords(b):
    k=(b['page'],b['system'])
    if k not in cache:
        ws=[w for w in json.load(open(f"{WD}/band-{L}-{b['page']}-s{b['system']}.json")) if any(c.isalpha() for c in w['text']) and w['conf']>=30]
        rows=[]
        for w in sorted(ws,key=lambda w:(w['bbox'][1]+w['bbox'][3])/2):
            y=(w['bbox'][1]+w['bbox'][3])/2
            r=next((r for r in rows if abs(r['y']-y)<35),None)
            if r: r['w'].append(w)
            else: rows.append(dict(y=y,w=[w]))
        for r in rows:
            c=sum(letters(w['text'])[0] for w in r['w']); l=sum(letters(w['text'])[1] for w in r['w'])
            r['script']='cyr' if c>l else 'lat' if l>c else 'none'
            for w in r['w']: w['row']=r['script']
        cache[k]=ws
    return cache[k]
dcache={}
def drows(b):
    k=(b['page'],b['system'])
    if k not in dcache:
        ws=[]
        for kind in ('rus','lat'):
            for w in json.load(open(f"{WD}/{kind}-{L}-{b['page']}-s{b['system']}.json")):
                if any(c.isalpha() for c in w['text']): w['kind']=kind; ws.append(w)
        rows=[]
        for w in sorted(ws,key=lambda w:(w['bbox'][1]+w['bbox'][3])/2):
            y=(w['bbox'][1]+w['bbox'][3])/2
            r=next((r for r in rows if abs(r['y']-y)<35),None)
            if r: r['w'].append(w)
            else: rows.append(dict(y=y,w=[w]))
        out=[]
        for r in rows:
            def mean(kind):
                xs=[(w['conf'],sum(c.isalpha() for c in w['text'])) for w in r['w'] if w['kind']==kind]
                return sum(c*n for c,n in xs)/max(1,sum(n for c,n in xs)) if xs else -1
            script='cyr' if mean('rus')>mean('lat') else 'lat'
            for w in r['w']:
                if w['kind']==('rus' if script=='cyr' else 'lat') and w['conf']>=30: out.append(dict(w,row=script))
        dcache[k]=out
    return dcache[k]
ecache={}
def erows(b):
    k=(b['page'],b['system'])
    if k not in ecache:
        ws=[]
        for kind in ('rus','lat'):
            for w in json.load(open(f"{WD}/{kind}-{L}-{b['page']}-s{b['system']}.json")):
                if any(c.isalpha() for c in w['text']): w=dict(w,kind=kind); ws.append(w)
        rows=[]
        for w in sorted(ws,key=lambda w:(w['bbox'][1]+w['bbox'][3])/2):
            y=(w['bbox'][1]+w['bbox'][3])/2
            r=next((r for r in rows if abs(r['y']-y)<35),None)
            if r: r['w'].append(w)
            else: rows.append(dict(y=y,w=[w]))
        out=[]
        for r in rows:
            ru=[norm(w['text']) for w in r['w'] if w['kind']=='rus']; ru=[t for t in ru if len(t)>=2]
            script='cyr' if ru and sum(t in POEM for t in ru)>=len(ru)/2 else 'lat'
            for w in r['w']:
                if w['kind']==('rus' if script=='cyr' else 'lat') and w['conf']>=30: out.append(dict(w,row=script))
        ecache[k]=out
    return ecache[k]
rows=[]
for n,s in zip(ns,st):
    b=next((b for b in systems if b['page']==n['page'] and b['bars'][0]<=n['bar']<=b['bars'][1] and 'y0' in b),None)
    col=[w for w in bandwords(b) if w['bbox'][0]<=n['x']+30 and w['bbox'][2]>=n['x']-30] if b else []
    near=min(col,key=lambda w:w['bbox'][1]) if col else None
    A=bool(near) and near['script']=='cyr'
    Bk=any(w['script']=='cyr' for w in col) or not any(w['script']=='lat' for w in col)
    Ck=any(w['row']=='cyr' for w in col) or not any(w['row']=='lat' for w in col)
    dcol=[w for w in drows(b) if w['bbox'][0]<=n['x']+30 and w['bbox'][2]>=n['x']-30] if b else []
    Dk=any(w['row']=='cyr' for w in dcol) or not any(w['row']=='lat' for w in dcol)
    ecol=[w for w in erows(b) if w['bbox'][0]<=n['x']+30 and w['bbox'][2]>=n['x']-30] if b else []
    Ek=any(w['row']=='cyr' for w in ecol) or not any(w['row']=='lat' for w in ecol)
    rows.append(dict(bar=n['bar'],note=N[n['midi']%12]+str(n['midi']//12-1),x=n['x'],status=s['status'],syl=s['syllable'],unsure=s['unsure'],near=near['text'] if near else '-',nearScript=near['script'] if near else '-',col=' '.join(f"{w['text']}[{w['script'][0]}/{w['row'][0]}]" for w in sorted(col,key=lambda w:w['bbox'][1])),A=A,B=Bk,C=Ck,D=Dk,E=Ek,ecol=' '.join(f"{w['text']}[{w['row'][0]}]" for w in sorted(ecol,key=lambda w:w['bbox'][1])),dcol=' '.join(f"{w['text']}[{w['row'][0]}]" for w in sorted(dcol,key=lambda w:w['bbox'][1]))))
for r in rows:
    if any(a<=r['bar']<=b for a,b in want):
        print(f"{r['bar']:3} {r['note']:4} x{r['x']:5} {r['status']:5} {str(r['syl'] or ''):6}{'?' if r['unsure'] else ' '} near {r['near']!s:12} {r['nearScript']:4} A:{'keep' if r['A'] else 'drop':4} B:{'keep' if r['B'] else 'drop':4} C:{'keep' if r['C'] else 'drop':4} D:{'keep' if r['D'] else 'drop':4} E:{'keep' if r['E'] else 'drop':4} | {r['col']} || E: {r['ecol']}")
for m in 'ABCDE':
    sk=sum(1 for r in rows if r['status']=='song' and r[m]); sd=sum(1 for r in rows if r['status']=='song' and not r[m])
    ek=sum(1 for r in rows if r['status']=='extra' and r[m]); ed=sum(1 for r in rows if r['status']=='extra' and not r[m])
    print(f"{L} measure {m}: song notes kept {sk}, song notes dropped {sd}; extra notes kept {ek}, extra notes dropped {ed}")
