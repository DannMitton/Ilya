# to_musicxml.py: the assembly's reading written as a score file, so it can be walked into Ilya (part 14). A desk prototype.
#   python3 to_musicxml.py v4 printed|modern out.musicxml
# One voice part. Words: the syllable under each note; a word with no vowel (въ, къ, съ) shares the cell of the syllable it leans on,
# as a correctly engraved score does (apps/web/src/lib/score/clitic-seat.ts:172-176). The metre read on page 1 is carried to the end.
import sys, json, re
from fractions import Fraction as F
from xml.sax.saxutils import escape
from assemble import modernise, endings
WORDS=set(open('words.txt',encoding='utf-8').read().split('\n'))
TYPES={F(1,16):('16th',0),F(1,8):('eighth',0),F(3,16):('eighth',1),F(1,4):('quarter',0),F(3,8):('quarter',1),F(1,2):('half',0),F(3,4):('half',1),F(1,1):('whole',0),F(1,32):('32nd',0),F(3,32):('16th',1)}
DIV=8   # divisions to a quarter
def mod_word(syls):
    """Ilya's modernising rule and the 1918 endings on a whole word, cut back into the same syllables"""
    low=[s.lower() for s in syls]; w=''.join(low); m=modernise(w)
    alt=[c for c in endings(m)[1:] if c in WORDS]
    if alt: m=alt[0]
    out=[]; k=0
    one=lambda s: s.replace('ѣ','е').replace('ѳ','ф').replace('і','и').replace('ѵ','и')
    for i,s in enumerate(low):
        t=one(s)
        if i==len(low)-1: t=re.sub(r'ъ$','',t)
        out.append(t)
    if ''.join(out)!=m and len(''.join(out))==len(m):   # an ending changed a vowel: take the letters from the whole word
        o2=[]; k=0
        for t in out: o2.append(m[k:k+len(t)]); k+=len(t)
        out=o2
    return [(o[0].upper()+o[1:]) if (s and s[0].isupper() and o) else o for s,o in zip(syls,out)]
def main(tag,spelling,outp):
    ev=json.load(open(f'asm-{tag}.seated.json')); rd=json.load(open(f'asm-{tag}.read.json')); nb=len(rd['bars'])
    m0=next((b['metre'] for b in rd['bars'] if b['metre']),None) or dict(beats=3,beatType=8)
    barlen=F(m0['beats'],m0['beatType'])
    # words: group syllables by pid, in order
    groups={}
    for i,e in enumerate(ev):
        if e['type']=='note' and e.get('printed') is not None: groups.setdefault((e['wid'],e['pid']),[]).append(i)
    text={}; syllabic={}
    for key,idx in groups.items():
        syls=[ev[i]['printed'] for i in idx]
        if spelling=='modern': syls=mod_word(syls)
        for k,i in enumerate(idx):
            lean=ev[i]['lean']
            if spelling=='modern': lean=[modernise(x) if x.islower() else (modernise(x)[:1].upper()+modernise(x)[1:]) for x in lean]
            text[i]=' '.join(lean+[syls[k]])+(ev[i].get('punct') or '')
            syllabic[i]='single' if len(idx)==1 else 'begin' if k==0 else 'end' if k==len(idx)-1 else 'middle'
    notes=[i for i,e in enumerate(ev) if e['type']=='note']
    tiestart=set()
    for a,b in zip(notes,notes[1:]):
        if ev[b].get('tieStop'): tiestart.add(a)
    bars={}
    for i,e in enumerate(ev): bars.setdefault(e['bar'],[]).append(i)
    L=[]; A=L.append
    A('<?xml version="1.0" encoding="UTF-8"?>')
    A('<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">')
    A('<score-partwise version="4.0">')
    A('  <work><work-title>Tchaikovsky, Op. 38 No. 3, read from the Jurgenson 1878 scan (desk assembly, 2026-10-04)</work-title></work>')
    A('  <part-list><score-part id="P1"><part-name>Voice</part-name></score-part></part-list>')
    A('  <part id="P1">')
    short=0
    for b in range(nb):
        A(f'    <measure number="{b+1}">')
        if b==0:
            A(f'      <attributes><divisions>{DIV}</divisions><key><fifths>2</fifths></key><time><beats>{m0["beats"]}</beats><beat-type>{m0["beatType"]}</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>')
        idx=bars.get(b,[])
        if not idx:
            A(f'      <note><rest measure="yes"/><duration>{int(barlen*4*DIV)}</duration><voice>1</voice></note>')
        tot=F(0)
        for i in idx:
            e=ev[i]; d=F(e['dur']); tot+=d; ty,dots=TYPES.get(d,(None,0)); dur=int(d*4*DIV)
            A('      <note>')
            if e['type']=='rest': A('        <rest/>')
            else:
                nm=e['name']; step=nm[0]; alter={'♯':1,'♭':-1}.get(nm[1],0) if len(nm)>2 else 0; octv=nm[-1]
                A(f'        <pitch><step>{step}</step>'+(f'<alter>{alter}</alter>' if alter else '')+f'<octave>{octv}</octave></pitch>')
            A(f'        <duration>{dur}</duration>')
            if e['type']=='note' and e.get('tieStop'): A('        <tie type="stop"/>')
            if i in tiestart: A('        <tie type="start"/>')
            A('        <voice>1</voice>')
            if ty: A(f'        <type>{ty}</type>'+'<dot/>'*dots)
            if e['type']=='note' and (e.get('tieStop') or i in tiestart):
                A('        <notations>'+('<tied type="stop"/>' if e.get('tieStop') else '')+('<tied type="start"/>' if i in tiestart else '')+'</notations>')
            if i in text:
                A(f'        <lyric number="1"><syllabic>{syllabic[i]}</syllabic><text>{escape(text[i])}</text></lyric>')
            A('      </note>')
        if idx and tot!=barlen: short+=1
        A('    </measure>')
    A('  </part>'); A('</score-partwise>')
    open(outp,'w',encoding='utf-8').write('\n'.join(L)+'\n')
    print(outp,'bars',nb,'notes',len(notes),'cells with words',len(text),'bars that do not add up to the metre',short)
    print(' '.join(text[i] for i in sorted(text))[:1200])
if __name__=='__main__': main(*sys.argv[1:4])
