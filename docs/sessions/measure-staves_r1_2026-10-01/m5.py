import json, os, cv2, numpy as np
import reader, envelope, timesig
def main(args, paths):
    cfg=dict(png=paths[0],page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m')
    ro,_,_,G,rests,_e=envelope.run(cfg,None)
    staves,s,vocal,nl=G['staves'],G['s'],G['vocal'],G['nl']
    st=staves[0]; top,bot=st[0],st[-1]; mid=(top+bot)/2.0
    band_top=int(top-0.5*s); band_bot=int(bot+0.6*s); split=int(mid)
    out=dict(s=float(s))
    for nm,(a,b) in dict(top=(band_top,split),bot=(split,band_bot)).items():
        band=(nl[a:b,0:1187]>0).astype(np.uint8)
        res=[]
        for d in range(10):
            t=timesig.render_digit(d,s); th,tw=t.shape
            if th>band.shape[0] or tw>band.shape[1]: res.append((d,None)); continue
            r=cv2.matchTemplate((band*255).astype(np.uint8),(t*255).astype(np.uint8),cv2.TM_CCOEFF_NORMED)
            yy,xx=np.unravel_index(np.argmax(r),r.shape)
            res.append((d,round(float(r[yy,xx]),3),int(xx+tw/2)))
        out[nm]=dict(best_by_digit=res, found=[(round(x),d,round(sc,3)) for x,d,sc in timesig._digits_in_band(band,s)])
    return out
