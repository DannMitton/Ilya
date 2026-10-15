# Step 3: training and held-out lines from the sampled Wikisource pages. Run from ~/Downloads/_desk-prereform with its venv.
# Exclusions: row 81's poem.txt (S, T, K, M) and the desk's private exclusions file, read at run time and never copied here.
import json, re, os, random, html, sys, unicodedata, collections, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import authors as A, common as C
D=os.path.expanduser('~/Downloads/_desk-prereform/data')
EXCL=os.path.expanduser('~/Downloads/_desk-heldout-exclusions_2026-10-12.md')
rng=random.Random(82)
LET='а-яёѣѳѵіА-ЯЁѢѲѴІ'
def clean_body(t):
    t=re.sub(r'<!--.*?-->','',t,flags=re.S)
    t=re.sub(r'<ref[^>]*/>|<ref[^>]*>.*?</ref>','',t,flags=re.S)
    t=re.sub(r'\{\{\s*(?:Разрядка|разрядка)\s*\|([^{}|]*)[^{}]*\}\}',r'\1',t)
    for _ in range(8): t=re.sub(r'\{\{[^{}]*\}\}','',t)
    t=re.sub(r'\{\|.*?\|\}','',t,flags=re.S)
    t=re.sub(r'\[\[(?:Файл|File|Изображение|Категория|Category):[^\]]*\]\]','',t)
    t=re.sub(r'\[\[(?:[^\]|]*\|)?([^\]]*)\]\]',r'\1',t)
    t=re.sub(r'\[https?://[^\s\]]*\s*([^\]]*)\]',r'\1',t)
    t=re.sub(r"'{2,}",'',t)
    t=re.sub(r'</?(?:poem|center|div|span|small|big|sup|sub|br|p|i|b|u|nowiki|references|ref)[^>]*>','\n',t)
    t=re.sub(r'<[^>]+>','',t)
    return html.unescape(t)
ALLOWED=set(',.;:!?—-«»()"\' ')
def norm_line(s):
    s=s.replace('́','').replace('­','')
    s=unicodedata.normalize('NFC',s)
    s=re.sub(r'[  -  \t]',' ',s)
    s=s.replace('…','...').replace('–','—').replace('„','"').replace('“','"').replace('”','"').replace('’',"'")
    s=re.sub(r'\.{2,}','.',s)
    if re.search(r'[A-Za-z0-9]',s): return None
    s=''.join(ch for ch in s if ch in ALLOWED or re.match('['+LET+']',ch))
    s=re.sub(r'\s+',' ',s).strip(' -—')
    s=re.sub(r'^[\s,.;:!?]+','',s)
    return s or None
def page_lines(body):
    out=[]
    for blk in re.split(r'\n\s*\n',body):
        ls=[l.strip() for l in blk.split('\n')]
        ls=[l for l in ls if l and not l.startswith(('=','*','#',':',';','|','!','{','}','['))]
        if not ls: continue
        short=sum(1 for l in ls if len(l)<=60)/len(ls)
        if len(ls)>=2 and short>=0.8:
            out+=ls                       # verse
        else:
            words=' '.join(ls).split()
            i=0
            while i<len(words):
                n=rng.randint(3,8); out.append(' '.join(words[i:i+n])); i+=n
    return out
def hard_ratio(text):
    ws=re.findall('['+LET+']+',text)
    a=sum(1 for w in ws if w[-1]=='ъ' and len(w)>1); b=sum(1 for w in ws if re.match(r'[бвгдзклмнпрстфхцчшщ]',w[-1]) and len(w)>2)
    return a/(a+b) if a+b else 0, a+b
def nwords(s): return re.findall('['+LET+']+',s)
def foldw(ws):
    C.prime(ws); return [C.norm(w) for w in ws]
if __name__=='__main__':
    stats=collections.OrderedDict(); pages=[]
    raw=[json.loads(l) for l in open(D+'/ws_pages.jsonl')]
    stats['pages fetched']=len(raw)
    keep=[]
    for d in raw:
        t=d['text']
        if A.field(t,'ПЕРЕВОДЧИК').strip(): stats['dropped: has a translator']=stats.get('dropped: has a translator',0)+1; continue
        k=A.author_key(A.field(t,'АВТОР'))
        if not k: stats['dropped: author not resolvable']=stats.get('dropped: author not resolvable',0)+1; continue
        d['author']=k; keep.append(d)
    auth=A.resolve({d['author'] for d in keep})
    k2=[]
    for d in keep:
        y=auth[d['author']]['death']
        if y is None: stats['dropped: author death year not on Wikidata']=stats.get('dropped: author death year not on Wikidata',0)+1; continue
        if y>=1946: stats['dropped: author died 1946 or later']=stats.get('dropped: author died 1946 or later',0)+1; continue
        d['death']=y; k2.append(d)
    stats['pages kept after authors']=len(k2)
    k3=[]
    for d in k2:
        body=clean_body(re.sub(r'^\s*\{\{.*?\n\}\}','',d['text'],count=1,flags=re.S))
        r,n=hard_ratio(body)
        if n<10 or r<0.7: stats['dropped: not in old spelling (final ъ ratio)']=stats.get('dropped: not in old spelling (final ъ ratio)',0)+1; continue
        d['body']=body; k3.append(d)
    stats['pages kept after spelling check']=len(k3)
    json.dump([{k:v for k,v in d.items() if k!='text'} for d in k3],open(D+'/pages_ok.json','w'),ensure_ascii=False)
    json.dump(stats,open(D+'/build_stats.json','w'),ensure_ascii=False,indent=1)
    print(json.dumps(stats,ensure_ascii=False,indent=1))
