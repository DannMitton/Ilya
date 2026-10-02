import json, os, cv2, numpy as np
import reader, beams
def main(args,paths):
    out=[]
    for name,p in zip(args['names'],paths):
        G=reader.read_page_geometry(dict(png=p,page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m'))
        img,nl,staves,s,vocal=G['img'],G['nl'],G['staves'],G['s'],G['vocal']
        raw=reader.detect_heads(img,staves,vocal,s)
        # lower threshold too
        low=reader.detect_heads(img,staves,vocal,s,thr=0.70)
        kept={(h['x'],h['y']) for h in G['heads']}
        for h in low:
            st=reader.has_stem(G['nl_safe'],h['x'],h['y'],s)
            out.append(dict(page=name,sys=h['sys'],x=h['x'],y=h['y'],score=round(h['score'],3),stem=bool(st),kept=any(abs(h['x']-x)<5 and abs(h['y']-y)<5 for x,y in kept),raw84=h['score']>=0.84))
    return out
