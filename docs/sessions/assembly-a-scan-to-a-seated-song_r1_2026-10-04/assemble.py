# assemble.py: the whole job on one scan, from parts that exist. A desk prototype (2026-10-04), not app code.
#   notes: homr (liebharc/homr, AGPL-3.0), main at 560ca5c, with each note's rough place on the page
#   voice staff: the staff homr leaves outside a brace, confirmed by a line of words under it
#   words: Tesseract 5.3.4 with a chosen model (orus is Apache-2.0), one line at a time
#   seat: each vowel to a note, by place across the page, in order
#   check: Ilya's dictionary after Ilya's own modernising rule; recover by one-letter swaps and the other models
import sys, json, re, unicodedata, xml.etree.ElementTree as ET
from fractions import Fraction as F
import cv2, numpy as np
from lyricline import systems, find_line
from ocrline import ocr_chars
TYPE={'whole':F(1),'half':F(1,2),'quarter':F(1,4),'eighth':F(1,8),'16th':F(1,16),'32nd':F(1,32),'64th':F(1,64),'breve':F(2)}
ST={'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11}
VOW=set('аеёиоуыэюяѣіѵ'); CYR=set('абвгдеёжзийклмнопрстуфхцчшщъыьэюяѣіѳѵ')
def parse_homr(xmlfile,page):
    p=ET.XMLParser(target=ET.TreeBuilder(insert_comments=True))
    root=ET.parse(xmlfile,parser=p).getroot(); part=root.findall('part')[0]; ev=[]; metre=None; bars=[]
    for mi,m in enumerate(part.findall('measure')):
        for a in m.findall('attributes'):
            t=a.find('time')
            if t is not None:
                try: metre=dict(beats=int(t.findtext('beats')),beatType=int(t.findtext('beat-type')))
                except Exception: metre=None
        evs=[]
        for n in m.findall('note'):
            if (n.findtext('staff') or '1')!='1': continue
            if n.find('chord') is not None or n.find('grace') is not None: continue
            ty=n.findtext('type'); d=TYPE.get(ty)
            if d is not None:
                k=d
                for _ in n.findall('dot'): k/=2; d+=k
                tm=n.find('time-modification')
                if tm is not None: d=d*int(tm.findtext('normal-notes'))/int(tm.findtext('actual-notes'))
            pos=None
            for c in n:
                if not isinstance(c.tag,str):
                    mm=re.search(r'imgpos:\s*(\d+),\s*(\d+)',c.text or '')
                    if mm: pos=(int(mm.group(1)),int(mm.group(2)))
            e=dict(page=page,bar=mi,dur=d,x=pos[0] if pos else None,y=pos[1] if pos else None)
            if n.find('rest') is not None:
                e['type']='rest'; e['whole']=(ty=='whole' or n.find('rest').get('measure')=='yes')
            else:
                pt=n.find('pitch'); alter=int(float(pt.findtext('alter') or 0))
                e['type']='note'; e['midi']=(int(pt.findtext('octave'))+1)*12+ST[pt.findtext('step')]+alter
                e['name']=pt.findtext('step')+{1:'♯',-1:'♭',0:''}.get(alter,'')+pt.findtext('octave')
                e['tieStop']=any(t.get('type')=='stop' for t in n.iter('tied')) or any(t.get('type')=='stop' for t in n.findall('tie'))
            evs.append(e)
        if len(evs)==1 and evs[0]['type']=='rest': evs=[]
        ev+=evs; bars.append(dict(metre=metre))
    return ev,bars
def modernise(w):
    w=unicodedata.normalize('NFC',w.lower())
    w=w.replace('ѣ','е').replace('ѳ','ф').replace('і','и').replace('ѵ','и')
    w=re.sub(r'ъ(?=[бвгджзйклмнпрстфхцчшщ]|$)','',w)
    return w
def endings(w):  # the 1918 decree's endings, for the lookup only (N.12, increment 2, not yet in the app)
    out=[w]
    if w.endswith('аго'): out.append(w[:-3]+('его' if w[-4:-3] in 'жцчшщ' else 'ого'))
    if w.endswith('яго'): out.append(w[:-3]+'его')
    if w.endswith('ыя'): out.append(w[:-2]+'ые')
    if w.endswith('ия'): out.append(w[:-2]+'ие')
    if w=='оне': out.append('они')
    if w=='ея': out.append('её')
    return out
def known(w,WORDS):
    m=modernise(w)
    for c in endings(m):
        if c in WORDS: return True
        for i,ch in enumerate(c):
            if ch=='е' and (c[:i]+'ё'+c[i+1:]) in WORDS: return True
    return False
SIM={'и':'нпй','н':'ипя','п':'ни','й':'и','я':'нл','л':'я','е':'сѣо','с':'е','о':'е','ѣ':'ъьве','ъ':'ѣь','ь':'ъѣ','в':'ѣб','б':'в','у':'ѣ','т':'г','г':'т','ч':'ц','ц':'ч','ш':'щ','щ':'ш','і':'и','з':'в'}
def nvow(w): return sum(1 for c in w.lower() if c in VOW)
def recover(w,alts,WORDS):
    """one-letter swaps along look-alike letters, plus the other models' readings; keep dictionary words with the same count of vowels"""
    lw=w.lower(); cands=set()
    for a in alts:
        if a and a.lower()!=lw and nvow(a)==nvow(w) and known(a,WORDS): cands.add(a.lower())
    for i,ch in enumerate(lw):
        for r in SIM.get(ch,''):
            c=lw[:i]+r+lw[i+1:]
            if nvow(c)==nvow(lw) and known(c,WORDS): cands.add(c)
    return sorted(cands)
def build_syllables(chars):
    """chars: dicts with ch,x0,x1,conf,word. Returns syllables (one vowel each) and words."""
    toks=[]; prevw=None
    for c in chars:
        ch=c['ch']
        if prevw is not None and c['word']!=prevw: toks.append(('space',None))
        prevw=c['word']
        if ch.lower() in CYR: toks.append(('let',c))
        elif ch in '-‐‑–—': toks.append(('hyph',None))
        elif ch in ',.;:!?…': toks.append(('punct',c))
        else: toks.append(('junk',c))
    # pieces: runs of letters; join to the next piece is 'hyph' or 'space'
    pieces=[]; cur=[]; join=None
    def flush(j):
        nonlocal cur
        if cur: pieces.append(dict(chars=cur,join=j)); cur=[]
        elif pieces and j=='space' and pieces[-1]['join'] is None: pieces[-1]['join']='space'
        elif pieces and j=='hyph': pieces[-1]['join']='hyph'
    for i,(k,c) in enumerate(toks):
        if k=='let':
            if cur and cur[-1]['ch'].lower()=='ъ' and c['ch'].lower() not in VOW and c['ch'].lower() not in 'ъь':
                flush('space')   # a hard sign before a consonant ends a word in the old spelling
            cur.append(c)
        elif k=='hyph': flush('hyph')
        elif k=='space': flush('space')
        elif k=='punct':
            flush(None)
            if pieces: pieces[-1]['punct']=pieces[-1].get('punct','')+c['ch']; pieces[-1]['join']='space'
        else: flush('space')
    flush('space')
    # words: pieces joined by hyphens
    words=[]; w=[]
    for p in pieces:
        w.append(p)
        if p['join']!='hyph': words.append(w); w=[]
    if w: words.append(w)
    syl=[]; wordrecs=[]
    for w in words:
        allch=[c for p in w for c in p['chars']]; text=''.join(c['ch'] for c in allch)
        rec=dict(text=text,conf=min(c['conf'] for c in allch),x0=allch[0]['x0'],x1=allch[-1]['x1'],punct=w[-1].get('punct',''),syl=[])
        wordrecs.append(rec)
        vidx=[i for i,c in enumerate(allch) if c['ch'].lower() in VOW]
        if not vidx: continue
        # hyphen boundaries (index in allch after which a printed hyphen stands)
        hb=set(); k=0
        for p in w[:-1]: k+=len(p['chars']); hb.add(k)
        cuts=[0]
        for a,b in zip(vidx,vidx[1:]):
            h=[x for x in hb if a<x<=b]
            if h: cuts.append(h[0]); continue
            cons=list(range(a+1,b))
            if not cons: cuts.append(b)
            elif len(cons)==1: cuts.append(cons[0])
            else:
                sgn=[i for i in cons if allch[i]['ch'].lower() in 'ъьй']
                cuts.append((sgn[-1]+1) if sgn else cons[1])
        cuts.append(len(allch))
        for (a,b),vi in zip(zip(cuts,cuts[1:]),vidx):
            seg=allch[a:b]; v=allch[vi]
            s=dict(text=''.join(c['ch'] for c in seg),vowel=v['ch'].lower(),vx=(v['x0']+v['x1'])/2,x0=seg[0]['x0'],x1=seg[-1]['x1'],conf=min(c['conf'] for c in seg),word=len(wordrecs)-1)
            syl.append(s); rec['syl'].append(len(syl)-1)
    # a word with no vowel (въ, съ, къ) leans on the next word's first syllable
    for i,rec in enumerate(wordrecs):
        if not rec['syl']:
            nxt=next((r for r in wordrecs[i+1:] if r['syl']),None)
            rec['lean']=nxt['syl'][0] if nxt else None
    return syl,wordrecs
def seat(vxs,nxs,s,drop=4.0):
    """vowels to notes, in order, by distance across the page; a vowel may be dropped at a cost, a note may go bare"""
    m,n=len(vxs),len(nxs); INF=1e18
    dp=[[INF]*(n+1) for _ in range(m+1)]; bk=[[None]*(n+1) for _ in range(m+1)]
    for j in range(n+1): dp[0][j]=0.0
    for i in range(1,m+1):
        for j in range(0,n+1):
            best=dp[i-1][j]+drop; b=('drop',i-1,j)
            if j>0:
                if dp[i][j-1]<best: best=dp[i][j-1]; b=('skip',i,j-1)
                c=dp[i-1][j-1]+abs(vxs[i-1]-nxs[j-1])/s
                if c<best: best=c; b=('pair',i-1,j-1)
            dp[i][j]=best; bk[i][j]=b
    out=[None]*m; i,j=m,n
    while i>0:
        b=bk[i][j]
        if b[0]=='pair': out[i-1]=j-1
        i,j=b[1],b[2]
    return out
def run(pages,model,WORDS,altmodels=()):
    allev=[]; allbars=[]; seated=[]; lines=[]
    for p in pages:
        gray=cv2.imread(f'tch-{p}.png',0); H,W=gray.shape
        ev,bars=parse_homr(f'main/tch-{p}.musicxml',p); base=len(allbars)
        for e in ev: e['bar']+=base
        allbars+=bars
        for si,sd in enumerate(systems(f'main/tch-{p}.txt',W,H)):
            s=sd['s']; ln=find_line(gray,sd)
            sysnotes=[e for e in ev if e['y'] is not None and sd['vt']-3*s<=e['y']<=sd['vb']+3*s]
            notes=[e for e in sysnotes if e['type']=='note']
            rec=dict(page=p,system=si+1,s=s,voice=dict(top=sd['vt'],bottom=sd['vb']),line=ln,notes=len(notes))
            if ln is None or ln['count']<4: rec['words']='none'; lines.append(rec); continue
            png=f'line-{p}-{si+1}.png'
            chars=ocr_chars(png,model)
            for c in chars: c['x0']+=ln['x0']; c['x1']+=ln['x0']
            firstx=min([e['x'] for e in sysnotes],default=sd['x0'])
            chars=[c for c in chars if c['x1']>firstx-3.0*s]
            syl,words=build_syllables(chars)
            alts=[]
            for am in altmodels:
                ac=ocr_chars(png,am)
                for c in ac: c['x0']+=ln['x0']; c['x1']+=ln['x0']
                ac=[c for c in ac if c['x1']>firstx-3.0*s]
                alts.append(build_syllables(ac)[1])
            for w in words:
                w['alts']=[]
                for aw in alts:
                    best=max(aw,key=lambda r:min(r['x1'],w['x1'])-max(r['x0'],w['x0']),default=None)
                    if best and min(best['x1'],w['x1'])-max(best['x0'],w['x0'])>0.6*(w['x1']-w['x0']) and abs((best['x1']-best['x0'])-(w['x1']-w['x0']))<0.35*(w['x1']-w['x0'])+s:
                        w['alts'].append(best['text'])
                if known(w['text'],WORDS): w['state']='read'; w['final']=w['text']
                else:
                    c=recover(w['text'],w['alts'],WORDS)
                    if len(c)==1: w['state']='deduced'; w['final']=c[0]
                    else: w['state']='unsure'; w['final']=w['text']; w['choices']=c
            cand=[e for e in notes if not e.get('tieStop')]
            idx=seat([x['vx'] for x in syl],[e['x'] for e in cand],s)
            for k,sy in enumerate(syl):
                if idx[k] is None: sy['note']=None; continue
                e=cand[idx[k]]; e['syl']=sy; e['word']=words[sy['word']]; sy['note']=e
                lean=[w for w in words if w.get('lean')==k]
                if lean: e['lean']=lean
            rec.update(words=len(words),syllables=len(syl),unseated=sum(1 for x in idx if x is None),text=' '.join(w['text']+w['punct'] for w in words))
            rec['states']={k:sum(1 for w in words if w['state']==k) for k in ('read','deduced','unsure')}
            lines.append(rec); seated.append((p,si+1,sd,ln,syl,words,notes))
        allev+=ev
    return allev,allbars,lines,seated
if __name__=='__main__':
    model=sys.argv[1] if len(sys.argv)>1 else 'orus'
    alt=[m for m in ('orus','rus','Cyrillic') if m!=model] if (len(sys.argv)>2 and sys.argv[2]=='alts') else []
    WORDS=set(open('words.txt',encoding='utf-8').read().split('\n'))
    ev,bars,lines,seated=run((1,2,3),model,WORDS,alt)
    for r in lines: print(r['page'],r['system'],'notes',r['notes'],'syll',r.get('syllables'),'unseated',r.get('unseated'),r.get('states'),'|',r.get('text'))
    out=dict(events=[dict(type=e['type'],measureIndex=e['bar'],midi=e.get('midi'),duration=(dict(numerator=e['dur'].numerator,denominator=e['dur'].denominator) if e['dur'] is not None else None)) for e in ev],
             bars=[dict(measureIndex=i,metre=b['metre'],measureDuration=None) for i,b in enumerate(bars)])
    tag=model+('+alts' if alt else '')
    json.dump(out,open(f'asm-{tag}.read.json','w'))
    json.dump([dict(type=e['type'],bar=e['bar'],page=e['page'],x=e['x'],y=e['y'],name=e.get('name'),midi=e.get('midi'),dur=str(e['dur']),tieStop=e.get('tieStop',False),
        syl=(e['syl']['text'] if 'syl' in e else None),vowel=(e['syl']['vowel'] if 'syl' in e else None),conf=(e['syl']['conf'] if 'syl' in e else None),
        word=(e['word']['text'] if 'word' in e else None),final=(e['word']['final'] if 'word' in e else None),state=(e['word']['state'] if 'word' in e else None),choices=(e['word'].get('choices') if 'word' in e else None),
        lean=[w['text'] for w in e.get('lean',[])]) for e in ev],open(f'asm-{tag}.seated.json','w'),ensure_ascii=False,indent=0)
