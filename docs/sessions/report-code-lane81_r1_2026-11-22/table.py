# Lane 81: ONE table, one row per property, one column per document, from census-<which>.json. python3 table.py before|after [markdown-out]
import json,sys,re,collections
which=sys.argv[1]
d=json.load(open(f'census-{which}.json'))
DOCS=['text','markup','insights']; NAMES={'text':'TEXT','markup':'MELODY','insights':'INSIGHTS'}
CONDS=[f'{l}-{w}-{s}' for s in ['score','blank'] for l in ['en','fr'] for w in [1024,390]]
def seg(t): return re.sub(r'\.s-[\w-]+','',t['p'].split(' > ')[-1])
def find(sheet,name,idx=0,sub=None):
    xs=[t for t in sheet['items']['text'] if seg(t)==name and (sub is None or sub in t['p'])]
    return xs[idx] if len(xs)>idx else None
def rulebox(sheet,cls):
    xs=[r for r in sheet['items']['rules'] if re.sub(r'\.s-[\w-]+','',r['p'].split(' > ')[-1])==cls]
    return xs
ACC={'rgb(54, 94, 45)':'ACCENT','rgb(98, 63, 132)':'ACCENT','rgb(115, 65, 78)':'ACCENT'}
def norm(v):
    if isinstance(v,str):
        for k in ACC:
            v=v.replace(k,'ACCENT')
        v=re.sub(r'rgb\((?:159, 133, 18[89]|125, 157, 11[48]|175, 133, 14[02])[^)]*\)','ACCENT-LIGHT',v)
    return v
rows=collections.OrderedDict()  # (group,prop) -> {doc: {cond: value}}
def put(group,prop,doc,cond,val):
    rows.setdefault((group,prop),{}).setdefault(doc,{})[cond]=norm(val)
def textprops(g,doc,cond,t,edges=True,tight=False):
    if t is None:
        return
    for p in ['fs','fw','lh','ls','st','tt2','ff']: put(g,p,doc,cond,t[p])
    put(g,'colour',doc,cond,t['col'])
    if tight:
        put(g,'left (text)',doc,cond,t['tl']); put(g,'right (text)',doc,cond,t['tr']); put(g,'top (text)',doc,cond,t['tt']); put(g,'bottom (text)',doc,cond,t['tbm'])
    if edges:
        put(g,'left (block)',doc,cond,t['el']); put(g,'right (block)',doc,cond,t['er']); put(g,'top (block)',doc,cond,t['et']); put(g,'bottom (block)',doc,cond,t['eb'])
        put(g,'margin top/bottom',doc,cond,t['mt']+'/'+t['mb']); put(g,'text-indent',doc,cond,t['ti'])
for cond in CONDS:
    for doc in DOCS:
        v=d.get(f'{cond}/{doc}')
        if not v: continue
        S=v['sheets']; s1=S[0]; s2=S[1] if len(S)>1 else None
        sc=cond.endswith('score')
        # page-1 header
        for name,g in [('p.tab-mark','P1 header: tab mark'),('span.logo-name','P1 header: logo'),('div.song-title','P1 header: song title')]:
            textprops(g,doc,cond,find(s1,name),edges=(name!='span.logo-name'),tight=True)
        for i,name in enumerate(['first','last']):
            xs=[t for t in s1['items']['text'] if seg(t)=='div.metadata-line']
            if xs: textprops(f'P1 header: metadata line ({name})',doc,cond,xs[0 if i==0 else -1],tight=True)
        rr=s1['rule']; 
        for k,lab in [('t','top'),('b','bottom'),('l','left'),('r','right')]: put('P1 header: rule',lab,doc,cond,rr[k])
        hr=rulebox(s1,'div.header-rule')
        if hr: put('P1 header: rule','border/colour',doc,cond,hr[0]['bt'])
        fh=rulebox(s1,'div.footer-hairline')
        if fh: put('Footer: hairline','colour',doc,cond,fh[0]['bt'])
        # footer
        hh=s1['hair']
        for k,lab in [('l','left'),('r','right')]: put('Footer: hairline',lab,doc,cond,hh[k])
        put('Footer: hairline','height',doc,cond,round(hh['b']-hh['t'],2)); put('Footer: hairline','distance above sheet bottom',doc,cond,round(s1['h']-hh['t'],2))
        textprops('Footer: credit text',doc,cond,find(s1,'span.attribution-text'),tight=True)
        textprops('Footer: page number',doc,cond,find(s1,'span.page-number'),tight=True)
        put('Sheet','size',doc,cond,f"{s1['w']}x{s1['h']}"); put('Sheet','background',doc,cond,s1['bg'])
        # later page
        if s2 and sc:
            textprops('Running header: left text',doc,cond,find(s2,'span.header-text',0),tight=True)
            ht=[t for t in s2['items']['text'] if seg(t)=='span.header-text.header-tab']
            if ht: textprops('Running header: tab',doc,cond,ht[0],tight=True)
            hr=rulebox(s2,'div.header-underline')
            if hr:
                for k,lab in [('t','top'),('b','bottom'),('l','left'),('r','right')]: put('Running header: rule',lab,doc,cond,hr[0][k])
                put('Running header: rule','border/colour',doc,cond,hr[0]['bb'])
            hh=s2['hair']; put('Footer p2: hairline','distance above sheet bottom',doc,cond,round(s2['h']-hh['t'],2))
            put('Footer p2: hairline','left',doc,cond,hh['l']); put('Footer p2: hairline','right',doc,cond,hh['r'])
        # blank state
        if not sc:
            sq=[b for b in s1['items']['boxes'] if 'blank-state' in b['p']]
            if sq:
                b=sq[0]
                for k,lab in [('t','top'),('b','bottom'),('l','left'),('r','right')]: put('Blank: squircle',lab,doc,cond,b[k])
                put('Blank: squircle','height',doc,cond,round(b['b']-b['t'],2))
                put('Blank: squircle','radius',doc,cond,b['rad']); put('Blank: squircle','border',doc,cond,b['border']); put('Blank: squircle','fill',doc,cond,b['bg'])
            ps=[t for t in s1['items']['text'] if seg(t)=='p' and 'blank-state' in t['p']]
            if ps: textprops('Blank: sentence 1',doc,cond,ps[0],tight=True)
            if len(ps)>1: textprops('Blank: sentence 2',doc,cond,ps[1],tight=True)
            for name,g in [('p.notes-head','Blank: notes heading'),('p.section-head','Blank: notes heading'),('p.notes-line','Blank: notes line'),('p.source-line','Blank: notes line'),('button.offer-link','Blank: notes link')]:
                t=find(s1,name)
                if t: textprops(g,doc,cond,t,tight=True)
            for name in ['p.notes-head','p.section-head']:
                t=find(s1,name)
                if t:
                    ln=[x for x in s1['items']['text'] if seg(x) in ('p.notes-line','p.source-line')]
                    if ln: put('Blank: notes heading','gap to first line (px)',doc,cond,round(ln[0]['tt']-t['tbm'],2))
                    sq=[b for b in s1['items']['boxes'] if 'blank-state' in b['p']]
                    if sq: put('Blank: notes heading','gap below squircle (px)',doc,cond,round(t['tt']-sq[0]['b'],2))
out=[]
def show(vals):
    return vals
def cell(docvals,cond_filter=None):
    # a column = the value set over conditions
    return docvals
lines=[]
bad=0; total=0
hdr='| Group | Property | TEXT | MELODY | INSIGHTS | Agree? |\n|---|---|---|---|---|---|'
lines.append(hdr)
for (g,p),dv in rows.items():
    cols=[]; sets={}
    for doc in DOCS:
        c=dv.get(doc)
        if not c: cols.append('n/a'); sets[doc]=None; continue
        vals=collections.OrderedDict()
        for cond in CONDS:
            if cond in c: vals.setdefault(str(c[cond]),[]).append(cond)
        sets[doc]=frozenset(vals.keys())
        if len(vals)==1: cols.append(next(iter(vals)))
        else: cols.append(' ; '.join(f"{k} ({len(v)})" for k,v in vals.items()))
    have=[s for s in sets.values() if s is not None]
    # agreement per condition, not per set: compare doc values condition by condition
    mism=[]
    for cond in CONDS:
        vs={doc:dv[doc][cond] for doc in DOCS if doc in dv and cond in dv[doc]}
        if len(set(map(str,vs.values())))>1: mism.append(cond)
    agree='yes' if not mism and len(have)>=1 else ('NO' if mism else 'yes')
    if len(have)<3 and not mism: agree='only '+'/'.join(NAMES[x] for x in DOCS if dv.get(x))
    total+=1
    if mism: bad+=1
    lines.append(f"| {g} | {p} | {cols[0]} | {cols[1]} | {cols[2]} | {agree}{' ('+str(len(mism))+'/'+str(len([c for c in CONDS if any(c in dv.get(x,{}) for x in DOCS)]))+' conds)' if mism else ''} |")
open(f'table-{which}.md','w').write('\n'.join(lines)+'\n')
print(total,'rows,',bad,'disagree')
