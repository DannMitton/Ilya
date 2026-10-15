import json,sys,re,difflib
sys.path.insert(0,'..')
H=__import__('os').path.expanduser('~/Downloads/_desk-prereform/heldout_images/')
def lev(a,b):
    p=list(range(len(b)+1))
    for i,ca in enumerate(a,1):
        c=[i]
        for j,cb in enumerate(b,1): c.append(min(p[j]+1,c[j-1]+1,p[j-1]+(ca!=cb)))
        p=c
    return p[-1]
d=json.load(open(sys.argv[1])); tot=err=0
LET='ѣѳѵі'; right={c:0 for c in LET+'ъ'}; cnt=dict(right)
for k,o in d.items():
    o=re.sub(r'\s+',' ',o); g=re.sub(r'\s+',' ',open(H+k+'.gt.txt',encoding='utf8').read().strip()); tot+=len(g); err+=lev(g,o)
    ok=set()
    for a,b,n in difflib.SequenceMatcher(None,g,o,autojunk=False).get_matching_blocks(): ok.update(range(a,a+n))
    for i,ch in enumerate(g):
        key=ch.lower() if ch.lower() in LET else ('ъ' if ch=='ъ' and (i+1==len(g) or not re.match('[а-яѣѳѵі]',g[i+1])) else None)
        if key: cnt[key]+=1; right[key]+=(i in ok)
print(sys.argv[1],'cer',round(err/tot,5),{c:f'{right[c]}/{cnt[c]}' for c in cnt})
