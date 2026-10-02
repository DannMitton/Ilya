import json, os, cv2, numpy as np
import reader, clefkey
def stem_diag(nl,hx,hy,s,lo=0.35,hi=1.05,min_len=2.0,max_w=0.42):
    H,W=nl.shape; best=dict(run=0.0,dx=None,ud=None,probe=None)
    anyreach=False
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
                if run>0: anyreach=True
                if run/s>best['run']:
                    py=hy+ud*int(1.5*s); pw=None
                    if 0<=py<H and nl[py,x]>0:
                        a=x
                        while a>0 and nl[py,a-1]>0: a-=1
                        b=x
                        while b<W-1 and nl[py,b+1]>0: b+=1
                        pw=(b-a+1)/s
                    best=dict(run=run/s,dx=sign*dx/s,ud=ud,probe=pw)
    return best
def main(args,paths):
    out=[]
    for name,p in zip(args['names'],paths):
        G=reader.read_page_geometry(dict(png=p,page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m'))
        img,nl,staves,s,vocal=G['img'],G['nl'],G['staves'],G['s'],G['vocal']
        bl=reader.page_barlines(G)['byVocal']; W=img.shape[1]
        kept={(h['x'],h['y']) for h in G['heads']}
        low=reader.detect_heads(img,staves,vocal,s,thr=0.70)
        spans=clefkey.spans_from(G['clefKeySystems']); margin=clefkey.CLEF_KEY_MASK_MARGIN*s
        for h in low:
            if any(abs(h['x']-x)<5 and abs(h['y']-y)<5 for x,y in kept): continue
            b=[0]+list(bl.get(h['sys'],[]))+[W]
            bar=max(0,sum(1 for x in b[1:-1] if x<=h['x']))
            d=stem_diag(G['nl_safe'],h['x'],h['y'],s)
            inmask=h['sys'] in spans and (spans[h['sys']][0]-margin<=h['x']<=spans[h['sys']][1]+margin)
            out.append(dict(page=name,sys=int(h['sys']),bar=bar,x=int(h['x']),y=int(h['y']),resp=round(float(h['score']),3),stem=d,mask=bool(inmask),hasstem=bool(reader.has_stem(G['nl_safe'],h['x'],h['y'],s))))
    return out
