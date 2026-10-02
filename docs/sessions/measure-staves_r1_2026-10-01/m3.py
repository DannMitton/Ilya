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


import json, time, traceback, os
import substrate, beams, envelope

os.makedirs('/home/pyodide/out', exist_ok=True)

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

REC=[]
_orig_sentinel=substrate.sentinel
def _rec_sentinel(sub, rows, where, page=None):
    rows=list(rows); conc=sub['conc']
    vals=[(int(r),float(conc[r])) for r in rows]
    bad=[v for v in vals if v[1]<substrate.K_S]
    REC.append(dict(where=where, n=len(rows), minconc=min(v[1] for v in vals) if vals else None, bad=bad[:6], nbad=len(bad)))
substrate.sentinel=_rec_sentinel

def try_run(path, cfg_extra=None):
    """envelope.run with the sentinel recorded (not raised) AND with the real sentinel."""
    out={}
    cfg=dict(png=path,page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m')
    # real sentinel
    substrate.sentinel=_orig_sentinel
    try:
        ro,_,_,G,rests,_e=envelope.run(cfg,None)
        out['real']=dict(ok=True, notes=len(ro['verses'][0]['notes']), measures=len(ro['measures']), staves=len(G['staves']), vocal=[int(v) for v in G['vocal']], fb=int(G.get('vocalFallbacks',0)))
    except Exception as e:
        out['real']=dict(ok=False, err=repr(e)[:260])
    # recorded sentinel
    REC.clear(); substrate.sentinel=_rec_sentinel
    try:
        ro,_,_,G,rests,_e=envelope.run(cfg,None)
        out['recorded']=dict(ok=True, notes=len(ro['verses'][0]['notes']), measures=len(ro['measures']), metres=sorted(set(('%s/%s'%(m['metre']['beats'],m['metre']['beatType']) if m.get('metre') else None) for m in ro['measures']), key=str), sentinel=list(REC))
    except Exception as e:
        out['recorded']=dict(ok=False, err=repr(e)[:260], sentinel=list(REC))
    substrate.sentinel=_orig_sentinel
    return out

def main(args, paths):
    res=[]
    for i,p in enumerate(paths):
        r=dict(page=i+1)
        img=cv2.imread(p,0)
        s=reader.staff_space_from_runs(img); r['s']=float(s)
        t=time.time(); staves,w=trace(img,s); r['trace_s']=round(time.time()-t,2); r['traced']=len(staves)
        # (a) unstraightened, staves from the trace, fed to the line-removal stage
        try:
            sv=[[int(round(float(np.median([c[2][k] for c in ch])))) for k in range(5)] for ch in staves]
            substrate.sentinel=_orig_sentinel
            beams.remove_lines_safe(img,s,sv,'trace-unstraightened')
            r['trace_on_original']='remove_lines_safe passed'
        except Exception as e:
            r['trace_on_original']=repr(e)[:300]
        for interp in ('linear','nearest','int'):
            t=time.time(); st_img=straighten_v(img,staves,interp)
            fn='/home/pyodide/out/s-%s-%d.png'%(interp,i+1); cv2.imwrite(fn,st_img)
            v=dict(straighten_s=round(time.time()-t,2))
            try:
                st2,s2=reader.detect_staves(st_img,page=fn); vocal,fb=reader.select_vocal(st2,s2,st_img)
                v['detect']=dict(staves=len(st2),vocal=[int(x) for x in vocal],fb=int(fb))
            except Exception as e: v['detect']=repr(e)[:260]
            t=time.time(); v['run']=try_run(fn); v['run_s']=round(time.time()-t,1)
            r[interp]=v
        res.append(r)
        print(json.dumps(r)[:1500])
    return res
