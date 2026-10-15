# Step 3: who wrote each sampled Wikisource page, and when they died (Wikidata P570). Cached outside the tree.
import json, re, os, time, requests, sys
D=os.path.expanduser('~/Downloads/_desk-prereform/data')
S=requests.Session(); S.headers['User-Agent']='ilya-row82/1.0 (dannmitton@gmail.com; research, polite)'
WS='https://ru.wikisource.org/w/api.php'; WD='https://www.wikidata.org/w/api.php'
def field(t,name):
    m=re.search(r'\|[ \t]*'+name+r'[ \t]*=[ \t]*(.*?)\n[ \t]*(?:\||\}\})',t+'\n}}',re.S)
    return m.group(1).strip() if m else ''
def author_key(v):
    if not v: return None
    m=re.search(r'\[\[([^\]|]+)(?:\|[^\]]*)?\]\]',v)
    if m: k=m.group(1)
    else:
        k=re.sub(r'\{\{.*?\}\}|<[^>]+>|\(.*?\)','',v).strip()
    k=k.replace('Автор:','').strip()
    if not k or len(k)>80 or ',' in k: return None
    return k
def resolve(keys):
    cp=D+'/authors.json'; cache=json.load(open(cp)) if os.path.exists(cp) else {}
    need=sorted(k for k in keys if k not in cache)
    for i in range(0,len(need),40):
        b=need[i:i+40]
        r=S.post(WS,data=dict(action='query',titles='|'.join('Автор:'+k for k in b),prop='pageprops',ppprop='wikibase_item',redirects=1,format='json')).json()
        q=r.get('query',{})
        redir={x['to']:x['from'] for x in q.get('redirects',[])}
        norm={x['to']:x['from'] for x in q.get('normalized',[])}
        item={}
        for p in q.get('pages',{}).values():
            t=p['title']; orig=redir.get(t,t); orig=norm.get(orig,orig)
            item[orig[len('Автор:'):]]=p.get('pageprops',{}).get('wikibase_item')
        qids=sorted({v for v in item.values() if v})
        death={}
        for j in range(0,len(qids),40):
            rr=S.get(WD,params=dict(action='wbgetentities',ids='|'.join(qids[j:j+40]),props='claims',format='json')).json()
            for q_,e in rr.get('entities',{}).items():
                cl=e.get('claims',{}).get('P570',[])
                ys=[]
                for c in cl:
                    try: ys.append(int(c['mainsnak']['datavalue']['value']['time'][1:5]))
                    except Exception: pass
                death[q_]=min(ys) if ys else None
            time.sleep(0.5)
        for k in b:
            q_=item.get(k); cache[k]=dict(qid=q_,death=death.get(q_) if q_ else None)
        time.sleep(0.5)
        json.dump(cache,open(cp,'w'),ensure_ascii=False)
    return cache
if __name__=='__main__':
    keys=set(); 
    for l in open(D+'/ws_pages.jsonl'):
        d=json.loads(l); k=author_key(field(d['text'],'АВТОР'))
        if k: keys.add(k)
    print('authors',len(keys),flush=True)
    c=resolve(keys)
    import collections
    print(collections.Counter('nodeath' if v['death'] is None else ('<1946' if v['death']<1946 else '>=1946') for k,v in c.items() if k in keys))
