"""Desk prototype, 2026-10-01: trace staves strip by strip, then straighten the page.
A measurement instrument. Not application code."""
import sys
import cv2, numpy as np
import reader

def trace(img, s, strip_w=None, fill=0.55):
    dark=(img<128)
    H,W=dark.shape
    w=int(round(3*s)) if strip_w is None else strip_w
    cands=[]   # (strip index, x centre, [5 line ys])
    nstrips=W//w
    for k in range(nstrips):
        x0=k*w
        prof=dark[:,x0:x0+w].mean(axis=1)
        rows=np.flatnonzero(prof>fill)
        if rows.size==0: continue
        # group rows into line centres
        lines=[]; cur=[rows[0]]
        for r in rows[1:]:
            if r-cur[-1]<=2: cur.append(r)
            else: lines.append(float(np.mean(cur))); cur=[r]
        lines.append(float(np.mean(cur)))
        lines=np.array(lines)
        # five lines one staff space apart
        i=0
        while i+4<len(lines):
            d=np.diff(lines[i:i+5])
            if np.all(np.abs(d-s)<=0.18*s):
                cands.append((k,x0+w/2.0,lines[i:i+5].copy())); i+=5
            else: i+=1
    # link candidates across strips by the middle line
    chains=[]
    for k,xc,ys in sorted(cands,key=lambda c:c[0]):
        best=None
        for ch in chains:
            lk,lx,lys=ch[-1]
            if 0<k-lk<=4 and abs(lys[2]-ys[2])<=0.5*s:
                if best is None or abs(lys[2]-ys[2])<abs(best[-1][2][2]-ys[2]): best=ch
        if best is None: chains.append([(k,xc,ys)])
        else: best.append((k,xc,ys))
    staves=[ch for ch in chains if (ch[-1][0]-ch[0][0]+1)*w>=0.25*W and len(ch)>=5]
    staves.sort(key=lambda ch: np.median([c[2][2] for c in ch]))
    return staves,w

def straighten(img, staves):
    H,W=img.shape
    xs=np.arange(W,dtype=np.float32)
    anchors=[]  # (y0, d(x) array)
    for ch in staves:
        cx=np.array([c[1] for c in ch]); cy=np.array([c[2][2] for c in ch])
        # robust smooth: fit a quadratic to the middle-line track
        co=np.polyfit(cx,cy,2 if len(cx)>=8 else 1)
        yfit=np.polyval(co,xs)
        y0=float(np.median(cy))
        anchors.append((y0,(yfit-y0).astype(np.float32)))
    anchors.sort(key=lambda a:a[0])
    y0s=np.array([a[0] for a in anchors],dtype=np.float32)
    D=np.stack([a[1] for a in anchors])           # staves x W
    ys=np.arange(H,dtype=np.float32)
    # for each output row y, interpolate displacement between neighbouring staves
    idx=np.searchsorted(y0s,ys)
    lo=np.clip(idx-1,0,len(y0s)-1); hi=np.clip(idx,0,len(y0s)-1)
    den=(y0s[hi]-y0s[lo]); den[den==0]=1
    t=np.clip((ys-y0s[lo])/den,0,1)
    disp=(1-t)[:,None]*D[lo]+t[:,None]*D[hi]      # H x W
    map_y=(ys[:,None]+disp).astype(np.float32)
    map_x=np.tile(xs,(H,1))
    return cv2.remap(img,map_x,map_y,cv2.INTER_LINEAR,borderValue=255), float(np.abs(D).max())

import json, os, cv2, numpy as np
import reader, envelope, timesig
os.makedirs('/home/pyodide/out', exist_ok=True)
def digits(path):
    cfg=dict(png=path,page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m')
    ro,_,_,G,rests,_e=envelope.run(cfg,None)
    staves,s,vocal,nl=G['staves'],G['s'],G['vocal'],G['nl']
    st=staves[vocal[0]]; top,bot=st[0],st[-1]; mid=(top+bot)/2.0
    a0=int(top-0.5*s); b0=int(bot+0.6*s); sp=int(mid)
    out=dict(staves=len(staves),vocal=[int(v) for v in vocal],metres=sorted(set(('%s/%s'%(m['metre']['beats'],m['metre']['beatType']) if m.get('metre') else 'none') for m in ro['measures'])))
    for nm,(a,b) in dict(top=(a0,sp),bot=(sp,b0)).items():
        band=(nl[a:b,0:1187]>0).astype(np.uint8); res={}
        for d in range(10):
            t=timesig.render_digit(d,s); r=cv2.matchTemplate((band*255).astype(np.uint8),(t*255).astype(np.uint8),cv2.TM_CCOEFF_NORMED)
            res[d]=round(float(r.max()),3)
        out[nm]=res
    return out
def main(args,paths):
    img=cv2.imread(paths[0],0); s=reader.staff_space_from_runs(img)
    res=dict(s=float(s))
    res['unstraightened']=digits(paths[0])
    staves,w=trace(img,s); out,maxd=straighten(img,staves); cv2.imwrite('/home/pyodide/out/pop-s.png',out)
    res['maxd']=maxd; res['straightened']=digits('/home/pyodide/out/pop-s.png')
    return res
