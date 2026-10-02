import json, os, cv2, numpy as np
import reader, clefkey, beams
os.makedirs('/home/pyodide/out',exist_ok=True)
GAPS=[0.0,0.1,0.2,0.3]

def run_col(col, y0, ud, gap, lim):
    """Longest reach from row y0 in direction ud along one column, bridging white gaps of <= gap px. Returns last ink row distance."""
    H=len(col); y=y0; last=0; white=0; n=0
    while 0<=y<H and n<lim:
        if col[y]>0: last=n+1; white=0
        else:
            white+=1
            if white>gap: break
        y+=ud; n+=1
    return last

def run_lean(nl, x0, y0, ud, lim):
    """Follow a leaning stem: each step may move one column left or right."""
    H,W=nl.shape; x=x0; y=y0; n=0
    if not nl[y,x]: return 0
    while 0<=y<H and n<lim:
        ny=y+ud
        if not (0<=ny<H): break
        cands=[xx for xx in (x,x-1,x+1) if 0<=xx<W and nl[ny,xx]>0]
        if not cands: break
        x=cands[0]; y=ny; n+=1
    return n

def hwidth(nl,y,x):
    W=nl.shape[1]
    if nl[y,x]==0: return 0
    a=x
    while a>0 and nl[y,a-1]>0: a-=1
    b=x
    while b<W-1 and nl[y,b+1]>0: b+=1
    return b-a+1

def stem_measures(nl, hx, hy, s, skiprows=None, lo=0.35, hi=1.05):
    H,W=nl.shape; lim=int(6*s)
    res={}
    best=None  # best at gap 0 (longest) for width/company
    for g in GAPS:
        gp=int(round(g*s)); bg=(0,0,0,0)  # (run,x,ud)
        top=(0,None,None)
        for sign in (+1,-1):
            for dx in range(int(lo*s),int(hi*s)+1):
                x=hx+sign*dx
                if not (0<=x<W): continue
                for ud in (-1,+1):
                    r=run_col(nl[:,x],hy,ud,gp,lim)
                    if r>top[0]: top=(r,x,ud)
        res['run_g%.1f'%g]=round(top[0]/s,2)
        if g==0.0: best=top
        if g==0.3: res['_best03']=top
    # lean following (gap 0)
    lean=0
    for sign in (+1,-1):
        for dx in range(int(lo*s),int(hi*s)+1):
            x=hx+sign*dx
            if not (0<=x<W): continue
            for ud in (-1,+1):
                lean=max(lean,run_lean(nl,x,hy,ud,lim))
    res['run_lean']=round(lean/s,2)
    # use the bridged-0.3 best for width and company
    r,x,ud=res.pop('_best03')
    res['col']=None if x is None else int(x-hx)
    res['ud']=ud
    thin=None; probe=None
    if x is not None and r>0:
        ws=[]
        for k in range(int(1.0*s)+1,r+1):
            y=hy+ud*k
            if not (0<=y<H): break
            if skiprows is not None and skiprows(y): continue
            w=hwidth(nl,y,x)
            if w>0: ws.append(w)
        if ws: thin=round(min(ws)/s,2)
        py=hy+ud*int(1.5*s)
        if 0<=py<H and nl[py,x]>0: probe=round(hwidth(nl,py,x)/s,2)
    res['thin']=thin; res['probe15']=probe
    res['_end']=None if x is None else (int(x),int(hy+ud*r),ud,r)
    return res

def company(nl, bars, hooks, sys, end, s):
    """What stands at the far end of the stem."""
    out=dict(flag=None,beam=None,hook=None)
    if end is None: return out
    x,ey,ud,r=end
    H,W=nl.shape
    # flag: widest ink run through the stem column in the last 1.6 s of the run (toward the head side)
    ws=[]
    for k in range(0,int(1.6*s)):
        y=ey-ud*k
        if 0<=y<H and nl[y,x]>0: ws.append(hwidth(nl,y,x))
    out['flag']=round(max(ws)/s,2) if ws else None
    # beam: a beam bar crossing the stem column within 0.6 s of the end
    for b in bars:
        if b['x0']-2<=x<=b['x1']+2 and abs((b['y0']+b['y1'])/2-ey)<=0.9*s:
            out['beam']=round(abs((b['y0']+b['y1'])/2-ey)/s,2); break
    # hook: a hook from G['hooks'] near the end
    dm=None
    for k in hooks:
        if k['sys']!=sys: continue
        d=((k['x']-x)**2+(k['y']-ey)**2)**0.5/s
        if dm is None or d<dm: dm=d
    out['hook']=None if dm is None else round(dm,2)
    return out

def place(img, staves_v, hx, hy, s):
    top=staves_v[0]; d=float(np.median(np.diff(staves_v))); half=d/2
    p=int(round((top-hy)/half))      # 0 top line, -8 bottom line
    if -8<=p<=0: return dict(kind='line' if p%2==0 else 'space',p=p,needed=0,present=0)
    if p>0: q=p; lines=[top-k*d for k in range(1,q//2+1)]
    else: q=-p-8; lines=[staves_v[-1]+k*d for k in range(1,q//2+1)]
    pres=0; r=int(0.7*s)
    for ly in lines:
        ly=int(round(ly)); seg=img[max(0,ly-2):ly+3, max(0,hx-r):hx+r+1]<128
        if seg.size and (seg.any(axis=0)).mean()>=0.9: pres+=1
    kind='space' if q<2 else ('ledger' if pres==len(lines) else 'noledger')
    return dict(kind=kind,p=p,needed=len(lines),present=pres)

def main(args,paths):
    out=[]; tiles=[]
    # capture the straightening displacement as a row-index map
    cap={}
    orig=reader.straighten_whole_pixel
    def wrap(img,staves,s,mode=None):
        o,l,i=orig(img,staves,s,mode)
        H,W=img.shape
        idx=np.repeat(np.arange(H,dtype=np.int32)[:,None],W,axis=1)
        o2,_,_=orig(idx,staves,s,mode)
        cap['idx']=o2 if o is not img else None; cap['raw']=img
        return o,l,i
    reader.straighten_whole_pixel=wrap
    for name,p in zip(args['names'],paths):
        cap.clear()
        G=reader.read_page_geometry(dict(png=p,page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m'))
        img,nl,staves,s,vocal=G['img'],G['nl_safe'],G['staves'],G['s'],G['vocal']
        s=float(s); bl=reader.page_barlines(G)['byVocal']; W=img.shape[1]
        braced=set()
        for sy in G['voices'].get('systems',[]):
            if sy['voice'] is not None and len(sy['braced'])>=2: braced.add(vocal.index(sy['voice']))
        kept={(h['x'],h['y']) for h in G['heads']}
        raw=detect=reader.detect_heads(img,staves,vocal,s,thr=0.70)
        spans=clefkey.spans_from(G['clefKeySystems']); margin=clefkey.CLEF_KEY_MASK_MARGIN*s
        bars=beams.detect_beam_bars(nl,s)
        idx=cap.get('idx'); rawimg=cap.get('raw')
        nlraw=None
        if idx is not None:
            nlraw=(rawimg<128).astype(np.uint8)
        out.append(dict(page=name,meta=True,s=s,braced=sorted(braced),spans={int(k):v for k,v in spans.items()},ncand=len(raw),straightened=idx is not None,hooks=len(G['hooks'])))
        for h in raw:
            hx,hy,si=int(h['x']),int(h['y']),int(h['sys'])
            b=[0]+list(bl.get(si,[]))+[W]
            bar=max(0,sum(1 for x in b[1:-1] if x<=hx))
            sm=stem_measures(nl,hx,hy,s)
            end=sm.pop('_end')
            co=company(nl,bars,G['hooks'],si,end,s)
            pl=place(img,staves[vocal[si]],hx,hy,s)
            inmask=si in spans and (spans[si][0]-margin<=hx<=spans[si][1]+margin)
            rec=dict(page=name,id=len(tiles),sys=si,bar=bar,x=hx,y=hy,resp=round(float(h['score']),3),braced=si in braced,
                     kept=any(abs(hx-x)<5 and abs(hy-y)<5 for x,y in kept),hasstem=bool(reader.has_stem(nl,hx,hy,s)),
                     stem=sm,company=co,place=pl,inspan=bool(inmask),abstained=si not in spans)
            if nlraw is not None:
                ry=int(idx[hy,hx]); rec['raw_y']=ry
                lrows=[]
                lines=staves[vocal[si]]
                for ly in lines:
                    ry2=int(idx[min(max(ly,0),idx.shape[0]-1),hx]); lrows.append(ry2)
                sk=lambda y,lr=lrows: any(abs(y-v)<=2 for v in lr)
                sm2=stem_measures(nlraw,hx,ry,s,skiprows=sk); sm2.pop('_end')
                rec['raw']=sm2
            out.append(rec)
            # tile
            rx=int(2.6*s); ryy=int(4.2*s)
            a=img[max(0,hy-ryy):hy+ryy,max(0,hx-rx):hx+rx]
            t=np.full((2*ryy,2*rx),255,np.uint8); t[:a.shape[0],:a.shape[1]]=a
            t=cv2.cvtColor(cv2.resize(t,(200,320),interpolation=cv2.INTER_AREA),cv2.COLOR_GRAY2BGR)
            cv2.putText(t,str(len(tiles)),(2,13),cv2.FONT_HERSHEY_SIMPLEX,0.45,(0,0,255),1)
            cv2.line(t,(0,160),(8,160),(255,0,0),1); cv2.line(t,(192,160),(200,160),(255,0,0),1)
            tiles.append(t)
        print(name,'ok',len(raw))
    cols=6; per=24
    for k in range(0,len(tiles),per):
        part=tiles[k:k+per]; rows=[]
        for i in range(0,len(part),cols):
            row=[cv2.copyMakeBorder(t,0,1,0,1,cv2.BORDER_CONSTANT,value=(150,150,150)) for t in part[i:i+cols]]
            while len(row)<cols: row.append(np.full((321,201,3),255,np.uint8))
            rows.append(np.hstack(row))
        cv2.imwrite('/home/pyodide/out/t%03d.png'%(k//per),np.vstack(rows))
    return out
