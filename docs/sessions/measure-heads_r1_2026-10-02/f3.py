import json, os, cv2, numpy as np
import reader, clefkey
CF={'sunless-01':(('F',4),2,0),'sunless-02':(('G',2),2,-1),'sunless-03':(('G',2),0,-1),'sunless-04':(('G',2),2,0),'sunless-05':(('G',2),0,-1),'sunless-06':(('G',2),7,-1)}
def has_stem_v(nl,hx,hy,s,probes=(1.5,),min_len=2.0,lo=0.35,hi=1.05,max_w=0.42):
    H,W=nl.shape
    for sign in (+1,-1):
        for dx in range(int(lo*s),int(hi*s)+1):
            x=hx+sign*dx
            if not(0<=x<W): continue
            col=nl[:,x]
            for ud in (-1,+1):
                y=hy; run=0
                while 0<=y<H and col[y]>0:
                    y+=ud; run+=1
                    if run>6*s: break
                if run<min_len*s: continue
                for pr in probes:
                    py=hy+ud*int(pr*s)
                    if not(0<=py<H) or nl[py,x]==0: continue
                    if pr*s>run: continue
                    a=x
                    while a>0 and nl[py,a-1]>0: a-=1
                    b=x
                    while b<W-1 and nl[py,b+1]>0: b+=1
                    if (b-a+1)<=max_w*s: return True
    return False
def analyse(name,p,clef,key,oc):
    G=reader.read_page_geometry(dict(png=p,page=1,clef=clef,key=key,octaveChange=oc,pieceId='m'))
    img,nl,staves,s,vocal=G['img'],G['nl_safe'],G['staves'],G['s'],G['vocal']
    bl=reader.page_barlines(G)['byVocal']; W=img.shape[1]
    kept={(h['x'],h['y']) for h in G['heads'] if not h.get('hollow')}
    raw=reader.detect_heads(img,staves,vocal,s,thr=0.70)
    spans=clefkey.spans_from(G['clefKeySystems']); margin=clefkey.CLEF_KEY_MASK_MARGIN*s
    out=[]
    for h in raw:
        if any(abs(h['x']-x)<5 and abs(h['y']-y)<5 for x,y in kept): continue
        inmask=h['sys'] in spans and (spans[h['sys']][0]-margin<=h['x']<=spans[h['sys']][1]+margin)
        if inmask: continue
        b=[0]+list(bl.get(h['sys'],[]))+[W]; bar=max(0,sum(1 for x in b[1:-1] if x<=h['x']))
        r=dict(page=name,sys=int(h['sys']),bar=bar,x=int(h['x']),y=int(h['y']),resp=round(float(h['score']),3))
        for lab,kw in (('base',dict()),('multiprobe',dict(probes=(1.0,1.25,1.5,1.75,2.0))),('run1.5',dict(min_len=1.5)),('both',dict(probes=(1.0,1.25,1.5,1.75,2.0),min_len=1.5))):
            r[lab]=bool(has_stem_v(nl,h['x'],h['y'],s,**kw))
        out.append(r)
    return out
def main(args,paths):
    out=[]
    for name,p in zip(args['names'],paths): out+=analyse(name,p,('G',2),0,0)
    if args.get('renders'):
        for n in sorted(os.listdir('/home/pyodide/fx')):
            clef,key,oc=(('G',2),0,0)
            for k,v in CF.items():
                if n.startswith('R_'+k): clef,key,oc=v
            out+=analyse(n,'/home/pyodide/fx/'+n,clef,key,oc)
    return out
