import json, os, cv2, numpy as np, collections
import reader, beams
CF={'sunless-01':(('F',4),2,0),'sunless-02':(('G',2),2,-1),'sunless-03':(('G',2),0,-1),'sunless-04':(('G',2),2,0),'sunless-05':(('G',2),0,-1),'sunless-06':(('G',2),7,-1)}
def analyse(p,clef,key,oc):
    G=reader.read_page_geometry(dict(png=p,page=1,clef=clef,key=key,octaveChange=oc,pieceId='m'))
    s=G['s']; nl=G['nl_safe']; heads=G['heads']
    by=collections.defaultdict(list)
    for h in heads:
        st=beams.find_stem(nl,h['x'],h['y'],s)
        by[h['sys']].append(dict(x=h['x'],y=h['y'],hollow=bool(h.get('hollow')),score=h['score'],stem=st))
    res=dict(filled=sum(1 for h in heads if not h.get('hollow')),hollow=sum(1 for h in heads if h.get('hollow')),
             pairs_opposite=0,pairs_same_end=0,stems_one=0,stems_more=0,pairs_opposite_hollow=0,hollow_within_3p5_of_filled=0,hollow_alone=0,nostem=0)
    for si,hs in by.items():
        hs.sort(key=lambda h:h['x']); used=set()
        for i,h in enumerate(hs):
            if h['stem'] is None: res['nostem']+=1
        for i,h in enumerate(hs):
            if i in used: continue
            grp=[i]
            for j,g in enumerate(hs):
                if j==i or j in used or h['stem'] is None or g['stem'] is None: continue
                if abs(g['stem']['x']-h['stem']['x'])<=0.4*s:
                    lo=min(h['y'],h['stem']['end_y']); hi=max(h['y'],h['stem']['end_y'])
                    if lo-0.5*s<=g['y']<=hi+0.5*s: grp.append(j)
            for j in grp: used.add(j)
            if len(grp)==1: res['stems_one']+=1
            else:
                res['stems_more']+=1
                ys=[hs[j]['y'] for j in grp]
                d=(max(ys)-min(ys))/s
                if len(grp)==2 and d>=2.5:
                    res['pairs_opposite']+=1
                    if any(hs[j]['hollow'] for j in grp): res['pairs_opposite_hollow']+=1
                elif d<=1.5: res['pairs_same_end']+=1
        filled=[h for h in hs if not h['hollow']]
        for h in hs:
            if h['hollow']:
                if any(((f['x']-h['x'])**2+(f['y']-h['y'])**2)**.5<=3.5*s for f in filled): res['hollow_within_3p5_of_filled']+=1
                else: res['hollow_alone']+=1
    return res
def main(args,paths):
    out=[]
    for name,p in args.get('scan',{}).items():
        pass
    for name,p in zip(args['names'],paths):
        out.append(dict(page=name,**analyse(p,('G',2),0,0)))
    if args.get('renders'):
        for n in sorted(os.listdir('/home/pyodide/fx')):
            clef,key,oc=(('G',2),0,0)
            for k,v in CF.items():
                if n.startswith('R_'+k): clef,key,oc=v
            out.append(dict(page=n,**analyse('/home/pyodide/fx/'+n,clef,key,oc)))
    return out
