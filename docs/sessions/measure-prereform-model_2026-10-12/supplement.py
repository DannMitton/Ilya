# Step 3: extra lines for the rare letters ѳ and ѵ. Searches Russian Wikisource for words that carry them, keeps pages
# that pass the same author and spelling tests as build-text.py, and keeps only lines that hold ѳ or ѵ.
import importlib.util, json, os, re, sys, time, requests, hashlib, collections
here=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,here)
spec=importlib.util.spec_from_file_location('bt',here+'/build-text.py'); bt=importlib.util.module_from_spec(spec); spec.loader.exec_module(bt)
import authors as A
D=bt.D
S=requests.Session(); S.headers['User-Agent']='ilya-row82/1.0 (dannmitton@gmail.com; research, polite)'
WS='https://ru.wikisource.org/w/api.php'
TERMS=sys.argv[1:] or ['мѵро','мѵроносица','Ѳедоръ','Ѳома','Агаѳья','ариѳметика','миѳъ','Ѳеодосій','Аѳины','ѳеатръ','Ѵпсиланти','Марѳа','Ѳеклa','ѳиміамъ','Ѳеофанъ','Кириллъ ѵ','Сѵрія','Ѳиваида','Эѳіопія','каѳедра','Іосифъ Ѳ','ѳита','ижица','Мефодій Ѳ']
titles=set()
for t in TERMS:
    c={}
    for _ in range(4):
        r=S.get(WS,params=dict(action='query',list='search',srsearch=t,srnamespace=0,srlimit=50,format='json',**c)).json()
        for h in r.get('query',{}).get('search',[]): titles.add(h['title'])
        if 'continue' in r: c=r['continue']
        else: break
        time.sleep(0.5)
    time.sleep(0.5)
titles=sorted(titles); print('search hits',len(titles),flush=True)
pages=[]
for i in range(0,len(titles),40):
    r=S.post(WS,data=dict(action='query',titles='|'.join(titles[i:i+40]),prop='revisions',rvprop='content|ids',rvslots='main',format='json')).json()
    for p in r['query']['pages'].values():
        if p.get('revisions'):
            rv=p['revisions'][0]; pages.append(dict(title=p['title'],pageid=p['pageid'],revid=rv['revid'],text=rv['slots']['main']['*']))
    time.sleep(0.8)
out=[]; st=collections.Counter()
keys={}
for d in pages:
    k=A.author_key(A.field(d['text'],'АВТОР'))
    if A.field(d['text'],'ПЕРЕВОДЧИК').strip() or not k: st['no author / has translator']+=1; continue
    d['author']=k; keys[k]=1
auth=A.resolve(set(keys))
for d in pages:
    if 'author' not in d: continue
    y=auth[d['author']]['death']
    if y is None or y>=1946: st['author death unknown or 1946+']+=1; continue
    body=bt.clean_body(re.sub(r'^\s*\{\{.*?\n\}\}','',d['text'],count=1,flags=re.S))
    r,n=bt.hard_ratio(body)
    if n<5 or r<0.7: st['not old spelling']+=1; continue
    for l in bt.page_lines(body):
        l=bt.norm_line(l)
        if l and 10<=len(l)<=78 and re.search('[ѳѵѲѴ]',l): out.append((l,d['title'],d['author'],y,d['pageid'],d['revid']))
    st['pages used']+=1
json.dump(out,open(D+'/lines_supplement.json','w'),ensure_ascii=False)
print(dict(st),len(out),'lines with ѳ or ѵ')
