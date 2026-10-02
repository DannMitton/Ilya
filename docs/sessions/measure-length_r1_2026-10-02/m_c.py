# Part C: every hollow detection (admitted and set aside as a hook) on each page, with the core measures of row 20.
import json, os, cv2, numpy as np
import envelope, reader
def main(args,paths):
    out=[]; ctx=None
    for pn,(page_no,p) in enumerate(zip(args['pages'],paths),start=1):
        cfg=dict(png=p,page=pn,clef=('G',2),key=int(args['key']),octaveChange=0,pieceId='m')
        try: ro,ctx_next,msum,G,rests,events=envelope.run(cfg,ctx)
        except Exception as e:
            out.append(dict(scanPage=page_no,error=str(e)[:150])); continue
        off=0 if ctx is None else ctx.get('measureIndexOffset',0); ctx=ctx_next
        img,nl,s=G['img'],G['nl_safe'],float(G['s'])
        ink_nl=nl>0; ink_img=img<128
        def core(x,y):
            a=reader.white_core(ink_nl,int(x),int(y),s); b=reader.white_core(ink_img,int(x),int(y),s)
            return dict(nolines=a,withlines=b)
        adm=[dict(x=int(h['x']),y=int(h['y']),sys=int(h['sys']),score=round(float(h['score']),3),**core(h['x'],h['y'])) for h in G['heads'] if h.get('hollow')]
        hooks=[dict(x=int(k['x']),y=int(k['y']),sys=int(k['sys']),score=round(float(k['score']),3),**core(k['x'],k['y'])) for k in G.get('hooks',[])]
        out.append(dict(scanPage=page_no,s=s,offset=off,admitted=adm,hooks=hooks))
    return out
