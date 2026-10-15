# Step 6 (synthetic held-out): per-letter right counts and character error rate of a model over the held-out images.
# Usage: eval_heldout.py <label> <traineddata dir> <lang> <image dir> [gt dir]  -> prints JSON
import sys, os, glob, subprocess, json, re, difflib
from concurrent.futures import ThreadPoolExecutor
label, tdir, lang, imgdir = sys.argv[1:5]; gtdir = sys.argv[5] if len(sys.argv) > 5 else imgdir
LET='ѣѳѵі'
def lev(a,b):
    p=list(range(len(b)+1))
    for i,ca in enumerate(a,1):
        c=[i]
        for j,cb in enumerate(b,1): c.append(min(p[j]+1,c[j-1]+1,p[j-1]+(ca!=cb)))
        p=c
    return p[-1]
def ocr(png):
    r=subprocess.run(['tesseract',png,'stdout','--tessdata-dir',tdir,'-l',lang,'--psm','7','-c','preserve_interword_spaces=1'],capture_output=True,text=True,env=dict(os.environ,TESSDATA_PREFIX=tdir))
    return re.sub(r'\s+',' ',r.stdout.strip())
ids=sorted(os.path.basename(f)[:-7] for f in glob.glob(gtdir+'/*.gt.txt'))
with ThreadPoolExecutor(8) as ex: outs=list(ex.map(lambda i: ocr(f'{imgdir}/{i}.png'),ids))
tot=0; err=0; right={c:0 for c in LET+'ъ'}; count={c:0 for c in LET+'ъ'}; rows=[]
for i,o in zip(ids,outs):
    g=re.sub(r'\s+',' ',open(f'{gtdir}/{i}.gt.txt',encoding='utf8').read().strip())
    tot+=len(g); err+=lev(g,o); rows.append([i,g,o])
    sm=difflib.SequenceMatcher(None,g,o,autojunk=False)
    ok=set()
    for a,b,n in sm.get_matching_blocks():
        for k in range(a,a+n): ok.add(k)
    for k,ch in enumerate(g):
        key=ch.lower() if ch.lower() in LET else ('ъ' if ch=='ъ' and (k+1==len(g) or not re.match('[а-яѣѳѵі]',g[k+1])) else None)
        if key: count[key]+=1; right[key]+=(k in ok)
res=dict(label=label,lines=len(ids),chars=tot,cer=round(err/tot,5),letters={c:f'{right[c]}/{count[c]}' for c in count})
json.dump(rows,open(f'eval-heldout-{label}-lines.json','w'),ensure_ascii=False)
print(json.dumps(res,ensure_ascii=False))
