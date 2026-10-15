# Step 3: enumerate Russian Wikisource's "Дореформенная орфография" category and fetch a seeded random sample of pages.
# Output (outside the tree): ~/Downloads/_desk-prereform/data/ws_titles.json, ws_pages.jsonl
import requests, json, random, time, os, sys
D=os.path.expanduser('~/Downloads/_desk-prereform/data')
S=requests.Session(); S.headers['User-Agent']='ilya-row82/1.0 (dannmitton@gmail.com; research, polite)'
API='https://ru.wikisource.org/w/api.php'
tp=D+'/ws_titles.json'
if not os.path.exists(tp):
    out=[];c={}
    while True:
        r=S.get(API,params=dict(action='query',list='categorymembers',cmtitle='Категория:Дореформенная орфография',cmtype='page',cmlimit=500,format='json',**c)).json()
        out+=[m['title'] for m in r['query']['categorymembers']]
        if 'continue' in r: c=r['continue']
        else: break
        time.sleep(0.5)
    json.dump(out,open(tp,'w'),ensure_ascii=False)
T=json.load(open(tp)); print('titles',len(T))
random.Random(82).shuffle(T)
N=int(sys.argv[1]) if len(sys.argv)>1 else 3500
pp=D+'/ws_pages.jsonl'
done=set()
if os.path.exists(pp):
    for l in open(pp): done.add(json.loads(l)['title'])
with open(pp,'a') as f:
    for i in range(0,N,40):
        b=[t for t in T[i:i+40] if t not in done]
        if not b: continue
        for attempt in range(4):
            try:
                r=S.post(API,data=dict(action='query',titles='|'.join(b),prop='revisions|info',rvprop='content|ids',rvslots='main',format='json')).json(); break
            except Exception as e:
                time.sleep(5)
        for p in r['query']['pages'].values():
            if 'revisions' not in p: continue
            rv=p['revisions'][0]
            f.write(json.dumps(dict(title=p['title'],pageid=p['pageid'],revid=rv['revid'],text=rv['slots']['main']['*']),ensure_ascii=False)+'\n')
        f.flush(); time.sleep(1.0)
        if i%400==0: print(i,flush=True)
