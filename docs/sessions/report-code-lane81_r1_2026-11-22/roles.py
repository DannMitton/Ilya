import json,sys,re,collections
f=sys.argv[1]; cond=sys.argv[2]
d=json.load(open(f))
for doc in ['text','markup','insights']:
    v=d[f'{cond}/{doc}']
    print('=====',doc,v['pages'],'sheets')
    for si,s in enumerate(v['sheets']):
        agg=collections.OrderedDict()
        for t in s['items']['text']:
            seg=re.sub(r'\.s-[\w-]+','',t['p'].split(' > ')[-1])
            k=(seg,t['fs'],t['fw'],t['lh'],t['col'],t['ff'],t['st'],t['ls'],t['tt2'],t['ti'])
            a=agg.setdefault(k,{'n':0,'l':set(),'r':set(),'ex':t['t'],'mt':set(),'mb':set()})
            a['n']+=1;a['l'].add(t['el']);a['r'].add(t['er']);a['mt'].add(t['mt']);a['mb'].add(t['mb'])
        print('-- sheet',si+1)
        for k,a in agg.items():
            print(f"  {k[0][:38]:38} {k[1]:>8} {k[2]} {k[3]:>8} {k[4]:18} {k[5][:12]:12} {k[6][:3]} ls={k[7]} {k[8][:3]} ti={k[9]} n={a['n']} L={sorted(a['l'])[:3]} R={sorted(a['r'])[-2:]} mt={sorted(a['mt'])[:2]} mb={sorted(a['mb'])[:2]} '{a['ex'][:20]}'")
