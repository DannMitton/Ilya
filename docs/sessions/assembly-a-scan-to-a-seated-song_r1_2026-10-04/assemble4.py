# assemble4.py: the desk's assembly of the whole job on one scan, third pass (2026-10-04). A prototype, not app code.
# PARTS, all existing before today:
#   1 staves, systems, each staff straightened ....... homr (liebharc/homr, AGPL-3.0), main at 560ca5c
#   2 the voice staff ................................. the staff outside the brace (Dann, 2026-08-12), with a line of words under it
#   3 notes: pitch, length, rests, bars ............... homr's transformer, with each note's rough place on the page
#   4 the words, letter by letter ..................... Tesseract 5.3.4, three models: orus (old spelling, Apache-2.0), Cyrillic, rus
#   5 words from letters .............................. printed hyphens sew syllables; Ilya's dictionary, after Ilya's own modernising
#                                                       rule, divides a run printed with no spaces and repairs a letter two models dispute
#   6 each syllable under its note .................... one vowel to one note, by place across the page, in order
#   7 read / deduced / unsure ......................... a word the dictionary knows as read; one it repaired; one it cannot settle
#   8 the count of notes over a word .................. a witness: a reading whose vowels do not match the notes above it costs more
import sys, json, re, itertools, functools, collections
import cv2
from assemble import parse_homr, modernise, endings, VOW, CYR, seat, SIM
from lyricline import systems, find_line
from ocrline import ocr_chars
WORDS=set(open('words.txt',encoding='utf-8').read().split('\n'))
ONE={'а','и','я','о','у','в','к','с'}
SHORT={'не','ни','но','на','да','до','за','из','по','от','об','он','мы','ты','вы','же','ли','ль','бы','то','та','те','ту','во','ко','со','их','им','ей','ее','её','ах','ох','ой','ай','ну','ум','уж'}
ALT=0.7; LOOK=1.0; SPLIT=0.6; HYSPLIT=2.0; VPEN=0.8; OTHER=0.3
@functools.lru_cache(maxsize=None)
def known(w):
    m=modernise(w)
    if len(m)==0: return False
    if len(m)==1: return m in ONE
    if not any(c in VOW for c in m): return False
    if len(m)==2 and m not in SHORT: return False
    for c in endings(m):
        if c in WORDS: return True
        for i,ch in enumerate(c):
            if ch=='е' and (c[:i]+'ё'+c[i+1:]) in WORDS: return True
    return False
def nvow(w): return sum(1 for c in w if c in VOW)
@functools.lru_cache(maxsize=None)
def repairs(w,alts=None):
    """(cost, word): w itself if the dictionary knows it; else known words one or two letters away, where a letter is
    replaced by one another model read at that place (ALT) or by a look-alike (LOOK)."""
    if known(w): return ((0.0,w),)
    opts=[]
    for i,ch in enumerate(w):
        o={}
        for r in (alts[i] if alts else ''):
            if r!=ch: o[r]=ALT
        for r in SIM.get(ch,''): o.setdefault(r,LOOK)
        opts.append(o)
    out={}; pos=[i for i,o in enumerate(opts) if o]
    for i in pos:
        for r,cst in opts[i].items():
            c=w[:i]+r+w[i+1:]
            if known(c): out[c]=min(out.get(c,9),cst)
    if not out and 3<=len(w)<=14:
        for i,j in itertools.combinations(pos,2):
            for r1,c1 in opts[i].items():
                for r2,c2 in opts[j].items():
                    c=w[:i]+r1+w[i+1:j]+r2+w[j+1:]
                    if known(c): out[c]=min(out.get(c,9),c1+c2)
    return tuple(sorted((v,k) for k,v in out.items()))
def divide(L,hyph,alts,V):
    """the cheapest ways to read the letter run L as known words; V is the count of notes above it (None if not known)."""
    n=len(L); best=[dict() for _ in range(n+1)]; best[0][0]=(0.0,[[]])
    for i in range(1,n+1):
        for j in range(max(0,i-22),i):
            if not best[j]: continue
            bc=0.0
            if j>0:
                bc=0.0 if (L[j-1]=='ъ' and L[j] not in VOW) else SPLIT
                if j in hyph: bc+=HYSPLIT
            for cost,w in repairs(L[j:i],(tuple(alts[j:i]) if alts else None)):
                dv=nvow(w)
                for v0,(c0,ways0) in best[j].items():
                    v=v0+dv; c=c0+bc+cost; cur=best[i].get(v)
                    new=[wy+[(j,i,w)] for wy in ways0[:4]]
                    if cur is None or c<cur[0]-1e-9: best[i][v]=(c,new)
                    elif abs(c-cur[0])<1e-9 and len(cur[1])<4: best[i][v]=(cur[0],cur[1]+new)
    res=[]
    for v,(c,ways) in best[n].items():
        pen=VPEN*abs(v-V) if V is not None else 0.0
        seen=set()
        for wy in ways:
            key=tuple(w for _,_,w in wy)
            if key in seen: continue
            seen.add(key); res.append((c+pen,c,wy))
    res.sort(key=lambda t:t[0])
    return res
def tokens(chars):
    runs=[]; cur=None; prevw=None; pending_h=False
    def close():
        nonlocal cur
        if cur and cur['ch']: runs.append(cur)
        cur=None
    for c in chars:
        ch=c['ch']; l=ch.lower()
        if prevw is not None and c['word']!=prevw and not pending_h and cur is not None: cur['space_after']=True
        prevw=c['word']
        if l in CYR:
            if cur is not None and cur.get('space_after') and not pending_h: close()
            if cur is None: cur=dict(ch=[],hyph=set(),punct='')
            if pending_h and cur['ch']: cur['hyph'].add(len(cur['ch']))
            cur.pop('space_after',None); pending_h=False; cur['ch'].append(c)
        elif ch in '-‐‑–—':
            if cur is not None: pending_h=True; cur.pop('space_after',None)
        elif ch in ',.;:!?…':
            if cur is not None: cur['punct']+=ch; pending_h=False; close()
    open_end=pending_h and cur is not None
    close()
    return runs,open_end
def syllabify(letters,hyph):
    vidx=[i for i,(l,c) in enumerate(letters) if l in VOW]
    if not vidx: return []
    cuts=[0]
    for a,b in zip(vidx,vidx[1:]):
        h=[x for x in hyph if a<x<=b]
        if h: cuts.append(h[0]); continue
        cons=list(range(a+1,b))
        if not cons: cuts.append(b)
        elif len(cons)==1: cuts.append(cons[0])
        else:
            sg=[i for i in cons if letters[i][0] in 'ъьй']; cuts.append((sg[-1]+1) if sg else cons[1])
    cuts.append(len(letters)); out=[]
    for (a,b),vi in zip(zip(cuts,cuts[1:]),vidx):
        seg=letters[a:b]; v=letters[vi][1]
        out.append(dict(text=''.join(l for l,_ in seg),vowel=letters[vi][0],vx=(v['x0']+v['x1'])/2,sysid=v['sysid'],conf=min(c['conf'] for _,c in seg)))
    return out
def run(pages,primary='orus',others=('Cyrillic','rus'),stem='tch'):
    models=(primary,)+tuple(others)
    allev=[]; allbars=[]; sysinfo=[]; perm={m:[] for m in models}; permchars={m:[] for m in models}
    for p in pages:
        gray=cv2.imread(f'{stem}-{p}.png',0); H,W=gray.shape
        ev,bars=parse_homr(f'main/{stem}-{p}.musicxml',p); base=len(allbars)
        for e in ev: e['bar']+=base
        allbars+=bars; allev+=ev
        for si,sd in enumerate(systems(f'main/{stem}-{p}.txt',W,H)):
            s=sd['s']; ln=find_line(gray,sd); sid=len(sysinfo)
            sysnotes=[e for e in ev if e['y'] is not None and sd['vt']-3*s<=e['y']<=sd['vb']+3*s]
            for e in sysnotes: e['sysid']=sid
            info=dict(page=p,system=si+1,s=s,line=ln,sd=sd,notes=[e for e in sysnotes if e['type']=='note']); sysinfo.append(info)
            if ln is None or ln['count']<4: continue
            cv2.imwrite(f'line-{stem}-{p}-{si+1}.png',gray[ln['top']:ln['bot'],ln['x0']:ln['x1']])
            firstx=min([e['x'] for e in sysnotes],default=sd['x0'])
            for m in models:
                ch=ocr_chars(f'line-{stem}-{p}-{si+1}.png',m)
                for c in ch: c['x0']+=ln['x0']; c['x1']+=ln['x0']; c['sysid']=sid
                ch=[c for c in ch if c['x1']>firstx-3.0*s]
                permchars[m]+=ch
                runs,open_end=tokens(ch)
                for r in runs: r['sysid']=sid
                if runs: runs[-1]['open']=open_end
                perm[m]+=runs
    for m in perm:   # sew a word that a system break divides
        out=[]
        for r in perm[m]:
            if out and out[-1].get('open') and out[-1]['sysid']!=r['sysid'] and not out[-1]['punct']:
                a=out[-1]; a['hyph'].add(len(a['ch'])); a['hyph']|={h+len(a['ch']) for h in r['hyph']}; a['ch']+=r['ch']; a['punct']=r['punct']; a['open']=r.get('open',False)
            else: out.append(r)
        perm[m]=out
    def notes_above(r):
        k=0
        for sid in sorted({c['sysid'] for c in r['ch']}):
            cs=[c for c in r['ch'] if c['sysid']==sid]; s=sysinfo[sid]['s']; a=cs[0]['x0']-0.8*s; b=cs[-1]['x1']+0.8*s
            k+=sum(1 for e in sysinfo[sid]['notes'] if not e.get('tieStop') and a<=e['x']<=b)
        return k
    def letters(r): return ''.join(c['ch'].lower() for c in r['ch'])
    def alts_for(r,m0):
        out=[]
        for c in r['ch']:
            mid=(c['x0']+c['x1'])/2; a=''
            for m in models:
                if m==m0: continue
                for q in permchars[m]:
                    if q['sysid']==c['sysid'] and q['x0']-2<=mid<=q['x1']+2 and q['ch'].lower() in CYR and q['ch'].lower()!=c['ch'].lower() and q['ch'].lower() not in a: a+=q['ch'].lower()
            out.append(a)
        return out
    words=[]
    for r in perm[primary]:
        L=letters(r); V=notes_above(r); cands=[]
        for tot,c,wy in divide(L,r['hyph'],alts_for(r,primary),V)[:8]: cands.append((tot,primary,r,wy))
        a0=r['ch'][0]; a1=r['ch'][-1]
        if a0['sysid']==a1['sysid']:
            for m in others:
                for q in perm[m]:
                    q0=q['ch'][0]; q1=q['ch'][-1]
                    if q0['sysid']!=a0['sysid'] or q1['sysid']!=a0['sysid']: continue
                    ov=min(q1['x1'],a1['x1'])-max(q0['x0'],a0['x0']); wa=a1['x1']-a0['x0']; wq=q1['x1']-q0['x0']
                    if ov>0.8*wa and ov>0.8*wq:
                        for tot,c,wy in divide(letters(q),q['hyph'],None,V)[:4]: cands.append((tot+OTHER,m,q,wy))
        if not cands:
            words.append(dict(state='unsure',src=primary,run=r,parts=[(0,len(L),L)],choices=[],notes=V)); continue
        cands.sort(key=lambda t:t[0]); c0=cands[0]
        tie={tuple(w for _,_,w in c[3]) for c in cands if c[0]<c0[0]+0.25}
        if len(tie)==1 and c0[0]<=3.0:
            raw=letters(c0[2]); same=(c0[1]==primary and all(w==raw[a:b] for a,b,w in c0[3]))
            freesplit=all(a==0 or (raw[a-1]=='ъ' and raw[a] not in VOW) for a,b,w in c0[3])
            state='read' if (same and freesplit and nvow(raw)==V) else 'deduced'
            words.append(dict(state=state,src=c0[1],run=c0[2],parts=c0[3],cost=c0[0],notes=V))
        else:
            best=[c for c in cands if c[1]==primary]
            words.append(dict(state='unsure',src=primary,run=r,parts=(best[0][3] if best else [(0,len(L),L)]),choices=sorted(' '.join(x) for x in tie)[:6],notes=V))
    syl=[]
    for wi,w in enumerate(words):
        r=w['run']; pend=[]
        for (a,b,txt) in w['parts']:
            lt=list(zip(txt,r['ch'][a:b])); hy={h-a for h in r['hyph'] if a<h<b}
            ss=syllabify(lt,hy)
            if not ss: pend.append(txt); continue
            for k,sy in enumerate(ss):
                sy.update(word=txt,state=w['state'],lean=(pend if k==0 else []),choices=w.get('choices'),wid=wi)
                syl.append(sy)
            pend=[]
        w['text']=' '.join(t for _,_,t in w['parts']); w['raw']=letters(r)
    for sid,info in enumerate(sysinfo):
        ss=[x for x in syl if x['sysid']==sid]; cand=[e for e in info['notes'] if not e.get('tieStop')]
        if not ss: continue
        idx=seat([x['vx'] for x in ss],[e['x'] for e in cand],info['s'])
        for k,sy in enumerate(ss):
            if idx[k] is not None: cand[idx[k]]['sylrec']=sy
            else: sy['unseated']=True
        info['unseated']=sum(1 for x in idx if x is None); info['syl']=len(ss)
    # a word with a syllable that found no note is unsure, whatever the dictionary said
    bad={x['wid'] for x in syl if x.get('unseated')}
    for x in syl:
        if x['wid'] in bad and x['state']!='unsure': x['state']='unsure'
    for wi in bad: words[wi]['state']='unsure'
    return allev,allbars,sysinfo,words
def dump(ev,bars,tag):
    json.dump(dict(events=[dict(type=e['type'],measureIndex=e['bar'],midi=e.get('midi'),duration=(dict(numerator=e['dur'].numerator,denominator=e['dur'].denominator) if e['dur'] is not None else None)) for e in ev],
        bars=[dict(measureIndex=i,metre=b['metre'],measureDuration=None) for i,b in enumerate(bars)]),open(f'asm-{tag}.read.json','w'))
    json.dump([dict(type=e['type'],bar=e['bar'],page=e['page'],x=e['x'],y=e['y'],name=e.get('name'),midi=e.get('midi'),dur=str(e['dur']),tieStop=e.get('tieStop',False),
        syl=(e['sylrec']['text'] if 'sylrec' in e else None),vowel=(e['sylrec']['vowel'] if 'sylrec' in e else None),conf=(e['sylrec']['conf'] if 'sylrec' in e else None),
        word=(e['sylrec']['word'] if 'sylrec' in e else None),final=(e['sylrec']['word'] if 'sylrec' in e else None),state=(e['sylrec']['state'] if 'sylrec' in e else None),
        choices=(e['sylrec'].get('choices') if 'sylrec' in e else None),lean=(e['sylrec']['lean'] if 'sylrec' in e else [])) for e in ev],open(f'asm-{tag}.seated.json','w'),ensure_ascii=False,indent=0)
if __name__=='__main__':
    tag=sys.argv[1] if len(sys.argv)>1 else 'v3'
    ev,bars,sysinfo,words=run((1,2,3))
    print(collections.Counter(w['state'] for w in words))
    print(' / '.join((w['text']+('?' if w['state']=='unsure' else '*' if w['state']=='deduced' else '')) for w in words))
    dump(ev,bars,tag)
