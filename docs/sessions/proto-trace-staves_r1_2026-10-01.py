"""Desk prototype, 2026-10-01: trace staves strip by strip, then straighten the page.
A measurement instrument. Not application code."""
import sys
sys.path.insert(0,'.')
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

if __name__=='__main__':
    for p in (1,2,3):
        png=f'../tchaik/p400-{p}.png'
        img=cv2.imread(png,0)
        s=reader.staff_space_from_runs(img)
        staves,w=trace(img,s)
        print('page',p,'s=%.0f strip=%d traced staves=%d'%(s,w,len(staves)))
        for i,ch in enumerate(staves):
            cy=[c[2][2] for c in ch]
            print('   staff %2d: strips %d..%d (%d hits) mid-line y %.0f -> %.0f  drift %.1f px'%(i,ch[0][0],ch[-1][0],len(ch),cy[0],cy[-1],cy[-1]-cy[0]))
        if staves:
            out,maxd=straighten(img,staves)
            fn=f'../tchaik/s400-{p}.png'; cv2.imwrite(fn,out)
            try:
                st2,s2=reader.detect_staves(out,page=fn)
                vocal,fb=reader.select_vocal(st2,s2,out)
                print('   straightened (max shift %.1f px): detect_staves finds %d, vocal %s, fallbacks %d'%(maxd,len(st2),vocal,fb))
            except Exception as e:
                print('   straightened: detect_staves RAISED',repr(e)[:200])
