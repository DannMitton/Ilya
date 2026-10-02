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

import json, os, time, hashlib, traceback
import cv2, numpy as np
import substrate, envelope
def canon(o): return json.dumps(o, sort_keys=True, separators=(',',':'), default=str)
CF={'sunless-01':(('F',4),2,0),'sunless-02':(('G',2),2,-1),'sunless-03':(('G',2),0,-1),'sunless-04':(('G',2),2,0),'sunless-05':(('G',2),0,-1),'sunless-06':(('G',2),7,-1)}
def run_one(path, clef, key, oc):
    cfg=dict(png=path,page=1,clef=clef,key=key,octaveChange=oc,pieceId='m')
    t=time.time()
    try:
        ro,_,_,G,rests,_e=envelope.run(cfg,None)
        notes=ro['verses'][0]['notes']
        return dict(ok=True, digest=hashlib.sha256(canon(ro).encode()).hexdigest(), ids=[n['id'] for n in notes], nnotes=len(notes), staves=len(G['staves']), vocal=[int(v) for v in G['vocal']], fb=int(G.get('vocalFallbacks',0)), nmeasures=len(ro['measures']), s=round(time.time()-t,1))
    except Exception as e:
        return dict(ok=False, err=repr(e)[:200], s=round(time.time()-t,1))
def main(args, paths):
    names=sorted(os.listdir('/home/pyodide/fx'))
    if args.get('only'): names=[n for n in names if any(k in n for k in args['only'])]
    res=[]
    for n in names:
        p='/home/pyodide/fx/'+n
        piece=None
        for k,v in CF.items():
            if n.startswith('R_'+k): piece=v
        clef,key,oc=piece if piece else (('G',2),0,0)
        img=cv2.imread(p,0)
        r=dict(page=n, shape=list(img.shape))
        s=reader.staff_space_from_runs(img) if False else None
        import reader
        s=reader.staff_space_from_runs(img); r['s']=float(s) if np.isfinite(s) else None
        r['A']=run_one(p,clef,key,oc)
        try:
            staves,w=trace(img,s); r['traced']=len(staves)
            if staves:
                out,maxd=straighten(img,staves); r['maxdrift']=round(maxd,2)
                r['straightened_identical']=bool(np.array_equal(out,img))
                if r['straightened_identical']:
                    r['B']='identical image, same read by construction'
                else:
                    fn='/home/pyodide/out/b.png'; cv2.imwrite(fn,out)
                    r['B']=run_one(fn,clef,key,oc)
                    if r['A'].get('ok') and r['B'].get('ok'):
                        r['B']['same_digest']=r['A']['digest']==r['B']['digest']
                        r['B']['ids_changed']=sum(1 for a,b in zip(r['A']['ids'],r['B']['ids']) if a!=b)+abs(len(r['A']['ids'])-len(r['B']['ids']))
                        r['B']['ids_removed_from_A']=len(set(r['A']['ids'])-set(r['B']['ids']))
            else: r['B']='no staves traced'
        except Exception as e:
            r['B']='trace/straighten error '+repr(e)[:200]
        res.append(r)
        print(json.dumps({k:(v if k not in ('A','B') else {kk:vv for kk,vv in v.items() if kk not in ('ids','digest')} if isinstance(v,dict) else v) for k,v in r.items()}))
    return res
