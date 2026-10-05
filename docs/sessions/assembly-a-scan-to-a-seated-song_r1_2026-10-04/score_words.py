import json, sys, subprocess, re, unicodedata
from assemble import modernise, VOW
TR='/mnt/user-data/uploads/ilya-rewrite/docs/sessions/truth-draft-tchaikovsky-op38-3-voice_r2_2026-10-02.json'
def strip(s): return re.sub(r'[^а-яёѣіѳѵ ]','',unicodedata.normalize('NFC',s.lower()))
def score(tag,verbose=False):
    out=subprocess.run(['node','score.ts',TR,f'asm-{tag}.read.json','full'],capture_output=True,text=True)
    tot=json.loads(out.stdout.strip().split('\n')[-1])
    sc=json.load(open(f'asm-{tag}.score.json')); seated=json.load(open(f'asm-{tag}.seated.json'))
    tj=json.load(open(TR)); tev=sorted(tj['verses'][0]['notes'],key=lambda n:n['onsetAbsolute'])
    t2r={m['truthIndex']:m['readerIndex'] for m in sc['matches']}
    # truth words
    cur=''; curidx=[]; tword={}
    for i,n in enumerate(tev):
        if n['type']!='note' or 'syllableText' not in n: continue
        parts=strip(n['syllableText']).split()
        if not parts: continue
        last=parts[-1]; cur+=last; curidx.append(i)
        if n.get('syllableType') in ('end','single','whole','word'):
            for k in curidx: tword[k]=cur
            cur=''; curidx=[]
    res=dict(truthSyl=0,noteMatched=0,seated=0,vowelRight=0,sylRight=0,wordRightRaw=0,wordRightFinal=0)
    by={'read':[0,0],'deduced':[0,0],'unsure':[0,0]}; rows=[]
    for i,n in enumerate(tev):
        if n['type']!='note' or 'syllableText' not in n: continue
        res['truthSyl']+=1; ts=strip(n['syllableText']); tparts=ts.split(); tcore=tparts[-1]; tv=[c for c in tcore if c in VOW]
        r=t2r.get(i)
        if r is None: rows.append((i,ts,None)); continue
        res['noteMatched']+=1; e=seated[r]
        if not e.get('syl'): rows.append((i,ts,'bare')); continue
        res['seated']+=1
        rs=strip(e['syl']).replace(' ','')
        if tv and e['vowel']==tv[0]: res['vowelRight']+=1
        lean=''.join(strip(x) for x in e.get('lean',[]))
        if (lean+rs)==ts.replace(' ','') or rs==tcore: res['sylRight']+=1
        tw=tword.get(i,''); rw=strip(e['word'] or '').replace(' ',''); rf=strip(e['final'] or '').replace(' ','')
        okraw=(rw==tw); okfin=(modernise(rf)==modernise(tw))
        res['wordRightRaw']+=okraw; res['wordRightFinal']+=okfin
        by[e['state']][1]+=1; by[e['state']][0]+=okfin
        rows.append((i,ts,rs,tw,rw,rf,e['state'],okfin))
    return tot,res,by,rows
if __name__=='__main__':
    for tag in sys.argv[1:]:
        tot,res,by,rows=score(tag)
        print(tag,'| notes headline',round(tot['headline'],1),'pitch',tot['notes']['pitchRight'],'len',tot['notes']['lengthRight'],'of',tot['notes']['truth'],'matched',tot['notes']['matched'],'extra',tot['notes']['extra'],'| bars',tot['bars'])
        print('   ',res)
        print('    by state (word right after check / syllables in that state):',by)
