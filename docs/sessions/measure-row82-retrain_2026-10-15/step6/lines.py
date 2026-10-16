# Step 3, second half: lines from the kept pages, exclusions, counts, the train / held-out split.
import importlib.util, json, os, re, random, collections, sys, hashlib, requests, time
here=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,here)
spec=importlib.util.spec_from_file_location('bt',here+'/build-text.py'); bt=importlib.util.module_from_spec(spec); spec.loader.exec_module(bt)
import common as C
D=bt.D; rng=random.Random(82)
S=requests.Session(); S.headers['User-Agent']='ilya-row82/1.0 (dannmitton@gmail.com; research, polite)'
WS='https://ru.wikisource.org/w/api.php'
def wkey(ws): return C.prime(ws) or [C.norm(w) for w in ws]
def words_of(s): return [w for w in bt.nwords(s)]
def grams(s,n=3):
    ws=wkey(words_of(s)); ws=[w for w in ws if w]
    return {' '.join(ws[i:i+n]) for i in range(len(ws)-n+1)}
# ---- exclusion material
ex4=set(); ex5=set(); ex_titles=set(); report=collections.OrderedDict()
P=C.poem()
for L in 'STKM':
    ws=C.poem_words(P,L); ws=[C.norm(w) for w in (C.prime(ws) or ws)]; ws=[w for w in ws if w]
    ex4|={' '.join(ws[i:i+4]) for i in range(len(ws)-3)}; ex5|={' '.join(ws[i:i+5]) for i in range(len(ws)-4)}; report[f'words in {L} poem.txt']=len(ws)
# the private exclusions file: titles only, never written into the tree
priv=[]
for l in open(bt.EXCL,encoding='utf8'):
    m=re.search(r'«([^»]+)»',l)
    if m and l.startswith('|'): priv.append(m.group(1))
def tnorm(t): 
    ws=words_of(t); return ' '.join(wkey(ws))
GENERIC=set()
for l_ in open(bt.EXCL,encoding='utf8'):
    if not l_.startswith('|'):
        GENERIC|={tnorm(m_) for m_ in re.findall(r'«([^»]+)»',l_)}
titles={tnorm(re.sub(r'\(.*?\)','',t)) for t in priv}; titles.discard('')
report['private titles (count only)']=len(priv)
# fetch each listed poem by title from Wikisource, add its trigrams
fetched=0
for t in sorted(titles):
    r=S.get(WS,params=dict(action='query',list='search',srsearch=t,srnamespace=0,srlimit=5,format='json')).json()
    for h in r.get('query',{}).get('search',[]):
        ht=tnorm(re.sub(r'\(.*?\)|/ДО','',h['title']))
        if ht==t or (len(t.split())>=3 and ht.startswith(t)):
            rr=S.get(WS,params=dict(action='query',titles=h['title'],prop='revisions',rvprop='content',format='json')).json()
            for p in rr['query']['pages'].values():
                if 'revisions' in p:
                    b_=bt.clean_body(p['revisions'][0]['*']); ex4|=grams(b_,4); ex5|=grams(b_,5); fetched+=1
    time.sleep(0.5)
report['pages fetched to take trigrams of listed poems (count only)']=fetched
report['exclusion 4-grams']=len(ex4); report['exclusion 5-grams']=len(ex5)
# ---- lines
pages=json.load(open(D+'/pages_ok.json'))
C.prime(sorted({w for d in pages for w in bt.nwords(d['body'])}))
def heldout_author(a): return int(hashlib.md5(a.encode()).hexdigest(),16)%10==0
cand=[]; drop=collections.Counter()
for d in pages:
    pt=re.sub(r'\(.*?\)|/ДО','',d['title']); ptn=tnorm(pt)
    if ptn in titles: drop['page title equals a listed title']+=1; continue
    pg=grams(d['body'],5)
    if len(pg&ex5)>=2: drop['page shares 2+ five-word runs with an excluded poem']+=1; continue
    generic = ptn in GENERIC
    ls=[bt.norm_line(x) for x in bt.page_lines(d['body'])]
    ls=[l for l in ls if l and 10<=len(l)<=78 and len(re.findall('['+bt.LET+']',l))>=8]
    # at most 80 lines per page, a random run of them
    if len(ls)>80:
        i=rng.randint(0,len(ls)-80); ls=ls[i:i+80]
    for l in ls:
        if generic: drop['line from a page titled with a generic listed title']+=1; continue
        if grams(l,4)&ex4: drop['line holds an excluded four-word run']+=1; continue
        cand.append((l,d['title'],d['author'],d['death'],d['pageid'],d['revid']))
seen=set(); uniq=[]
for x in cand:
    k=x[0].lower()
    if k in seen: drop['duplicate line']+=1; continue
    seen.add(k); uniq.append(x)
hold=[x for x in uniq if heldout_author(x[2])]; train=[x for x in uniq if not heldout_author(x[2])]
report['drops']=dict(drop); report['candidate lines']=len(uniq); report['train pool']=len(train); report['held-out pool (authors whose md5 mod 10 is 0)']=len(hold)
def counts(ls):
    c=collections.Counter()
    for l in ls:
        for ch in 'ѣѳѵіІъ': c[ch]+=l.count(ch)
        c['final ъ']+=len(re.findall(r'ъ(?![а-яѣѳѵі])',l))
    return dict(c)
report['letters in train pool']=counts([x[0] for x in train]); report['letters in held-out pool']=counts([x[0] for x in hold])
json.dump(dict(train=train,hold=hold),open(D+'/lines_pool.json','w'),ensure_ascii=False)
json.dump(report,open(D+'/lines_report.json','w'),ensure_ascii=False,indent=1)
print(json.dumps(report,ensure_ascii=False,indent=1))
json.dump(dict(ex4=sorted(ex4),ex5=sorted(ex5),titles=sorted(titles)),open(D+'/exclusion_sets.json','w'),ensure_ascii=False)
