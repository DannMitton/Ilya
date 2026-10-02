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


def straighten_v(img, staves, interp):
    H,W=img.shape
    xs=np.arange(W,dtype=np.float32)
    anchors=[]
    for ch in staves:
        cx=np.array([c[1] for c in ch]); cy=np.array([c[2][2] for c in ch])
        co=np.polyfit(cx,cy,2 if len(cx)>=8 else 1)
        yfit=np.polyval(co,xs); y0=float(np.median(cy))
        d=(yfit-y0)
        if interp=='int': d=np.round(d)
        anchors.append((y0,d.astype(np.float32)))
    anchors.sort(key=lambda a:a[0])
    y0s=np.array([a[0] for a in anchors],dtype=np.float32)
    D=np.stack([a[1] for a in anchors]); ys=np.arange(H,dtype=np.float32)
    idx=np.searchsorted(y0s,ys); lo=np.clip(idx-1,0,len(y0s)-1); hi=np.clip(idx,0,len(y0s)-1)
    den=(y0s[hi]-y0s[lo]); den[den==0]=1
    t=np.clip((ys-y0s[lo])/den,0,1)
    disp=(1-t)[:,None]*D[lo]+t[:,None]*D[hi]
    if interp=='int': disp=np.round(disp)
    map_y=(ys[:,None]+disp).astype(np.float32); map_x=np.tile(xs,(H,1))
    flag={'linear':cv2.INTER_LINEAR,'nearest':cv2.INTER_NEAREST,'int':cv2.INTER_NEAREST}[interp]
    return cv2.remap(img,map_x,map_y,flag,borderValue=255)



import json, os, time
import reader, beams
from hollow import detect_hollow_heads, merge_heads
def count(img, staves, s, label):
    voices=reader.select_voices(staves,s,img); vocal=voices['vocal']
    bw,nl=reader.remove_lines(img,s,staves,'x')
    heads=reader.detect_heads(img,staves,vocal,s)
    raw=len(heads)
    heads=[h for h in heads if reader.has_stem(nl,h['x'],h['y'],s)]
    filled=len(heads)
    sb=lambda y: reader.band_of(y,staves,vocal,s)
    hh=detect_hollow_heads(nl,staves,vocal,s,sb,thr=0.38)
    hh=[h for h in hh if h['stemmed']]
    m=merge_heads(heads,hh,s)
    return dict(label=label,s=float(s),staves=len(staves),vocal=[int(v) for v in vocal],raw_filter=raw,filled_with_stem=filled,hollow_stemmed=len(hh),after_merge=len(m))
def main(args,paths):
    out=[]
    img=cv2.imread(paths[0],0)
    s0=reader.staff_space_from_runs(img)
    chains,w=reader.trace_staves(img,s0)
    # (A) current: band straightening, traced staves
    reader.STRAIGHTEN_MODE='band'
    imgA,stA,sA,info=reader.find_staves(img,page='x')
    out.append(count(imgA,stA,sA,'band image, traced staves (the build)'))
    # (B) same image, detect_staves
    try:
        stB,sB=reader.detect_staves(imgA,page='x'); out.append(count(imgA,stB,sB,'band image, detect_staves'))
    except Exception as e: out.append(dict(label='band image, detect_staves',err=repr(e)[:150]))
    # (C) the earlier measurement: prototype nearest warp + detect_staves
    for mode in ('nearest','int','linear'):
        imgC=straighten_v(img,chains,mode)
        try:
            stC,sC=reader.detect_staves(imgC,page='x'); out.append(count(imgC,stC,sC,'prototype %s warp, detect_staves'%mode))
        except Exception as e: out.append(dict(label=mode,err=repr(e)[:150]))
    return out
