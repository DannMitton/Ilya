import json, os, cv2, numpy as np
import envelope, beams, run_page2
from reader import _head_cc_area

def main(args,paths):
    ctx=None; out=[]
    for pn,(page_no,p) in enumerate(zip(args['pages'],paths),start=1):
        cfg=dict(png=p,page=pn,clef=('G',2),key=int(args['key']),octaveChange=0,pieceId='m')
        ro,ctx_next,msum,G,rests,events=envelope.run(cfg,ctx); off=0 if ctx is None else ctx.get('measureIndexOffset',0); ctx=ctx_next
        if str(page_no) not in args['want']: continue
        img,nl,staves,s,vocal=G['img'],G['nl_safe'],G['staves'],float(G['s']),G['vocal']
        num,lab,stats,cent=cv2.connectedComponentsWithStats(G['nl'],8)
        lt=float(run_page2._staff_line_thickness(img,staves,s))
        for h in G['heads']:
            if h.get('hollow'): continue
            if not any(abs(h['x']-x)<=1 for x in args['want'][str(page_no)]): continue
            st=beams.find_stem(nl,h['x'],h['y'],s); d=st['dir']; xs=st['x']
            area,lid=_head_cc_area(dict(x=h['x'],y=h['y']),G['nl'],lab,stats)
            tip=st['end_y']-d
            mask0=((lab==lid)&(nl>0)).astype(np.uint8)
            y0=int(min(tip-d*(-1.2*s),tip-d*(4.0*s)));y1=int(max(tip-d*(-1.2*s),tip-d*(4.0*s)))
            x0=int(xs-1.8*s);x1=int(xs+2.8*s)
            a=(nl[y0:y1,x0:x1]>0)*120; b=mask0[y0:y1,x0:x1]*255
            vis=np.zeros((y1-y0,x1-x0,3),np.uint8); vis[...,1]=a; vis[...,2]=b
            cv2.line(vis,(xs-x0,0),(xs-x0,vis.shape[0]),(255,0,0),1)
            cv2.imwrite('/home/pyodide/out/dbg-%d-%d.png'%(page_no,h['x']),cv2.resize(vis,None,fx=3,fy=3,interpolation=cv2.INTER_NEAREST))
            out.append(dict(page=page_no,x=int(h['x']),tip=int(tip),stemx=int(xs),lid=int(lid),comp_area=int(area)))
    return out
