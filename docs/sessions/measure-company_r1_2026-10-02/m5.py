import json, os, cv2, numpy as np
import reader, clefkey
os.makedirs('/home/pyodide/out',exist_ok=True)

def run_col(col, y0, ud, gap, lim):
    H=len(col); y=y0; last=0; white=0; n=0
    while 0<=y<H and n<lim:
        if col[y]>0: last=n+1; white=0
        else:
            white+=1
            if white>gap: break
        y+=ud; n+=1
    return last

def hwidth(nl,y,x):
    W=nl.shape[1]
    if nl[y,x]==0: return 0
    a=x
    while a>0 and nl[y,a-1]>0: a-=1
    b=x
    while b<W-1 and nl[y,b+1]>0: b+=1
    return b-a+1

def ev(nl, hx, hy, s, lo=0.35, hi=1.05):
    H,W=nl.shape; lim=int(6*s); g3=int(round(0.3*s))
    top=(0,None,None); top0=(0,None,None)
    for sign in (+1,-1):
        for dx in range(int(lo*s),int(hi*s)+1):
            x=hx+sign*dx
            if not (0<=x<W): continue
            col=nl[:,x]
            for ud in (-1,+1):
                r=run_col(col,hy,ud,g3,lim)
                if r>top[0]: top=(r,x,ud)
                r0=run_col(col,hy,ud,0,lim)
                if r0>top0[0]: top0=(r0,x,ud)
    r,x,ud=top
    o=dict(run0=round(top0[0]/s,3),run3=round(r/s,3),col=None,ud=ud,thin=None,probe15=None,far0=None,far3=None,
           L=0,R=0,hs=bool(reader.has_stem(nl,hx,hy,s)))
    if x is None: return o
    o['col']=round((x-hx)/s,3)
    # thinnest width beyond 1.0 s
    ws=[]
    for k in range(int(1.0*s)+1,r+1):
        y=hy+ud*k
        if not (0<=y<H): break
        w=hwidth(nl,y,x)
        if w>0: ws.append(w)
    if ws: o['thin']=round(min(ws)/s,3)
    py=hy+ud*int(1.5*s)
    if 0<=py<H and nl[py,x]>0: o['probe15']=round(hwidth(nl,py,x)/s,3)
    # far side: the stem's own columns (x-1..x+1), opposite direction
    f0=f3=0
    for c in (x-1,x,x+1):
        if 0<=c<W:
            f0=max(f0,run_col(nl[:,c],hy,-ud,0,lim)); f3=max(f3,run_col(nl[:,c],hy,-ud,g3,lim))
    o['far0']=round(f0/s,3); o['far3']=round(f3/s,3)
    # ink through the candidate's own row, left and right
    lim2=int(1.3*s)
    if nl[hy,hx]>0:
        a=hx
        while a>0 and nl[hy,a-1]>0 and hx-a<lim2: a-=1
        b=hx
        while b<W-1 and nl[hy,b+1]>0 and b-hx<lim2: b+=1
        o['L']=round((hx-a)/s,3); o['R']=round((b-hx)/s,3)
    return o

def respmap(img,s):
    bw=(img<128).astype(np.float32)
    kw,kh=int(round(1.35*s)),int(round(0.92*s))
    ker=cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(kw|1,kh|1)).astype(np.float32); ker/=ker.sum()
    return cv2.filter2D(bw,-1,ker)

def main(args,paths):
    out=[]
    for name,p in zip(args['names'],paths):
        G=reader.read_page_geometry(dict(png=p,page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m'))
        img,nl,staves,s,vocal=G['img'],G['nl_safe'],G['staves'],G['s'],G['vocal']
        s=float(s); bl=reader.page_barlines(G)['byVocal']; W=img.shape[1]
        kept={(h['x'],h['y']) for h in G['heads']}
        pool=reader.detect_heads(img,staves,vocal,s,thr=0.70)
        ret=reader.detect_heads(img,staves,vocal,s,thr=0.84)
        resp=respmap(img,s)
        spans=clefkey.spans_from(G['clefKeySystems']); margin=clefkey.CLEF_KEY_MASK_MARGIN*s
        out.append(dict(page=name,meta=True,s=s,n=len(pool),
            ck=[None if r is None else dict(x_lo=r['x_lo'],x_hi=r['x_hi'],fifths=r.get('fifths'),glyph=r.get('glyph')) for r in G['clefKeySystems']],
            heads=[(int(h['x']),int(h['y']),int(h['sys']),bool(h.get('hollow'))) for h in G['heads']]))
        for h in pool:
            hx,hy,si=int(h['x']),int(h['y']),int(h['sys'])
            isk=any(abs(hx-x)<5 and abs(hy-y)<5 for x,y in kept)
            b=[0]+list(bl.get(si,[]))+[W]
            bar=max(0,sum(1 for x in b[1:-1] if x<=hx))
            inmask=si in spans and (spans[si][0]-margin<=hx<=spans[si][1]+margin)
            rec=dict(page=name,sys=si,bar=bar,x=hx,y=hy,resp=round(float(h['score']),4),kept=isk,inspan=bool(inmask))
            if not isk:
                rec['pool']=ev(nl,hx,hy,s)
                # the point detect_heads returns at the reader's threshold, same head
                r84=[q for q in ret if q['sys']==si and (q['x']-hx)**2+(q['y']-hy)**2<(0.8*s)**2]
                if r84:
                    q=r84[0]; rec['ret']=dict(x=int(q['x']),y=int(q['y']),**ev(nl,int(q['x']),int(q['y']),s)) if (int(q['x']),int(q['y']))!=(hx,hy) else dict(same=True)
                # plateau
                v=resp[hy,hx]; r=int(1.0*s)
                ys,xs=np.where(np.abs(resp[max(0,hy-r):hy+r+1,max(0,hx-r):hx+r+1]-v)<1e-5)
                pts=[(int(x+max(0,hx-r)),int(y+max(0,hy-r))) for y,x in zip(ys,xs)]
                rec['plateau_n']=len(pts)
                if len(pts)>1:
                    step=max(1,len(pts)//8)
                    rec['plateau']=[dict(x=px,y=py,**ev(nl,px,py,s)) for px,py in pts[::step][:9] if (px,py)!=(hx,hy)]
            out.append(rec)
        print(name,'ok',len(pool))
        # strip of each system start for the mask report
        for si,v in enumerate(vocal):
            st=staves[v]; x1=int((spans[si][1] if si in spans else 400)+8*s)
            a=int(st[0]-2.5*s); bb=int(st[-1]+2.5*s)
            cv2.imwrite('/home/pyodide/out/%s-s%d.png'%(name,si),cv2.resize(img[a:bb,0:x1],None,fx=0.5,fy=0.5,interpolation=cv2.INTER_AREA))
    return out
