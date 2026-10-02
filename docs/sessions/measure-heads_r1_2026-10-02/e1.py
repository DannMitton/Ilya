import json, os, cv2, numpy as np
import reader, envelope, beams
os.makedirs('/home/pyodide/out',exist_ok=True)
def main(args,paths):
    out=[]
    for name,p in zip(args['names'],paths):
        cfg=dict(png=p,page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m')
        ro,_,_,G,rests,events=envelope.run(cfg,None)
        img,nl,staves,s,vocal=G['img'],G['nl'],G['staves'],G['s'],G['vocal']
        bl=G['barlines']['byVocal']; W=img.shape[1]
        num,lab,stats,cent=cv2.connectedComponentsWithStats(nl,8)
        bars=beams.detect_beam_bars(G['nl_safe'],s)
        for si,v in enumerate(vocal):
            b=[0]+list(bl.get(si,[]))+[W]
            hs=[h for h in G['heads'] if h['sys']==si]
            for h in hs:
                st=beams.find_stem(G['nl_safe'],h['x'],h['y'],s)
                li=lab[h['y'],h['x']]; ar=int(stats[li][4]) if li>0 else 0
                bar=max(0,sum(1 for x in b[1:-1] if x<=h['x']))
                out.append(dict(page=name,sys=si,bar=bar,x=int(h['x']),y=int(h['y']),score=round(h['score'],3),area=ar,hollow=bool(h.get('hollow')),
                    stem=None if st is None else dict(x=int(st['x']),dir=int(st['dir']),endy=int(st['end_y']),len=int(st['length']))))
        # overlay per system
        for si,v in enumerate(vocal):
            st=staves[v]; a=int(st[0]-3.6*s); bb=int(st[-1]+3.6*s)
            col=cv2.cvtColor(img[a:bb,:],cv2.COLOR_GRAY2BGR)
            for h in [h for h in G['heads'] if h['sys']==si]:
                cv2.circle(col,(h['x'],h['y']-a),int(0.75*s),(0,0,255),3)
            for x in bl.get(si,[]): cv2.line(col,(int(x),0),(int(x),bb-a),(255,0,0),2)
            sc=1800.0/col.shape[1]
            cv2.imwrite('/home/pyodide/out/%s-s%d.png'%(name,si),cv2.resize(col,None,fx=sc,fy=sc,interpolation=cv2.INTER_AREA))
        print(name,'ok')
    return out
