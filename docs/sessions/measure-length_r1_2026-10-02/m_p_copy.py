# Step 3.1 (r2): the flag as a path. For every filled head with a stem, follow the stroke that leaves the stem at its far end.
import json, os, cv2, numpy as np
import envelope, reader, beams, run_page2
from reader import _head_cc_area
os.makedirs('/home/pyodide/out',exist_ok=True)
CUT=[0.25,0.45,0.65,0.85,1.05,1.25]

def bridge(mask, lines, s, lt, c0, c1, a, b):
    """set aside each staff line's band (its residue runs along the page), then put back, in the stroke's own columns,
    the rows of a band where the stroke has ink on both sides of it (a flag cut where it crosses a line is one stroke)"""
    out=mask.copy(); hb=lt/2.0+1.5
    H=mask.shape[0]
    for y in lines:
        ya=int(round(y-hb)); yb=int(round(y+hb))
        if ya<2 or yb>=H-2: continue
        out[ya:yb+1,c0:a]=0; out[ya:yb+1,b+1:c1]=0
        for c in list(range(max(2,c0),a))+list(range(b+1,min(mask.shape[1]-2,c1))):
            above=mask[ya-1,c-2:c+3].any(); below=mask[yb+1,c-2:c+3].any()
            if above and below: out[ya:yb+1,c]=mask[ya:yb+1,c]|1
    return out

def path_side(mb, nl_all, tip, d, a, b, s, side, length_b):
    """components of the bridged mask beside the stem on one side, attached to the stem edge near the tip"""
    H,W=mb.shape
    tlo=-0.6; thi=min(3.6, length_b-0.8)
    rows=[tip-d*int(t*s) for t in (tlo,thi)]; r0,r1=min(rows),max(rows)
    r0=max(0,r0); r1=min(H-1,r1)
    RW=int(2.2*s)
    g0=max(2,int(round(0.12*s)))
    if side>0: c0=b+1+g0; c1=min(W,b+1+g0+RW)
    else: c1=a-g0; c0=max(0,a-g0-RW)
    if c1<=c0 or r1<=r0: return None
    sub=mb[r0:r1+1,c0:c1].astype(np.uint8)
    n,lab,st,cent=cv2.connectedComponentsWithStats(sub,8)
    res=[]
    for i in range(1,n):
        ys,xs=np.where(lab==i)
        # offset from the stem edge, in columns (0 = adjacent)
        off=(xs-0) if side>0 else ((c1-c0-1)-xs)
        # attached: touches the column adjacent to the stem, within t in [-0.6,1.2]
        adj=(off==0)
        if not adj.any(): continue
        rr=r0+ys
        t=(tip-rr)*d/s
        if not ((t[adj]>=-0.6)&(t[adj]<=1.2)).any(): continue
        reach=(off.max()+1)/s
        tmax=float(t.max()); tmin=float(t.min())
        touches_out=bool((off.max()>=RW-2))
        touches_bot=bool((rr.max()>=r1-1) if d<0 else (rr.min()<=r0+1))
        res.append(dict(area=round(len(xs)/(s*s),3),reach=round(float(reach),3),tmin=round(tmin,3),tmax=round(tmax,3),runs_out=touches_out,runs_bottom=touches_bot,
                        id=int(i),colspan=(int(c0),int(c1)),rowspan=(int(r0),int(r1)),lab=None))
    # strokes at the cuts: runs in the union of the attached components
    keep=set(); 
    for r in res: keep.add(r['id'])
    um=np.isin(lab,list(keep)) if keep else np.zeros_like(sub,bool)
    cuts={}
    for o in CUT:
        col=int(round(o*s)); cc=col if side>0 else (c1-c0-1-col)
        if 0<=cc<um.shape[1]:
            c=um[:,cc]; runs=[]; st_=None
            for k,v in enumerate(c):
                if v and st_ is None: st_=k
                if not v and st_ is not None: runs.append((st_,k-1)); st_=None
            if st_ is not None: runs.append((st_,len(c)-1))
            cuts[str(o)]=[[round(float((tip-(r0+ra))*d/s),3),round((rb-ra+1)/s,3)] for ra,rb in runs]
        else: cuts[str(o)]=[]
    for r in res: r.pop('id'); r.pop('lab'); r.pop('colspan'); r.pop('rowspan')
    return dict(comps=res,cuts=cuts)

def main(args,paths):
    out=dict(pages=[]); ctx=None; song=args['song']
    for pn,(page_no,p) in enumerate(zip(args['pages'],paths),start=1):
        cfg=dict(png=p,page=pn,clef=('G',2),key=int(args['key']),octaveChange=0,pieceId='m')
        try: ro,ctx_next,msum,G,rests,events=envelope.run(cfg,ctx)
        except Exception as e:
            out['pages'].append(dict(scanPage=page_no,error=str(e)[:200])); continue
        off=0 if ctx is None else ctx.get('measureIndexOffset',0); ctx=ctx_next
        img,nl,staves,s,vocal=G['img'],G['nl_safe'],G['staves'],float(G['s']),G['vocal']
        W=img.shape[1]
        num,lab,stats,cent=cv2.connectedComponentsWithStats(G['nl'],8)
        lt=float(run_page2._staff_line_thickness(img,staves,s))
        voices=G['voices']; order=voices['order']; bl=G['barlines']['byVocal']; tbl=G['barlines']['tacet']
        sysbars=[];ti=0
        for o in order:
            if o is None: sysbars.append(tbl.get(ti,[])); ti+=1
            else: sysbars.append(bl.get(o,[]))
        mps=[max(1,len(b)) for b in sysbars]; base=list(np.cumsum([0]+mps)[:-1])
        heads=[]
        for h in G['heads']:
            if h.get('hollow'): continue
            syi=h['sys']; pos=order.index(syi); bnds=[0]+sysbars[pos]+[W]; seg=0
            for k in range(mps[pos]):
                if bnds[k]<=h['x']<bnds[k+1]: seg=k;break
            mi=off+int(base[pos])+seg; hid='r%d-%d'%(mi,h['x'])
            st=beams.find_stem(nl,h['x'],h['y'],s)
            if st is None: continue
            area,lid=_head_cc_area(dict(x=h['x'],y=h['y']),G['nl'],lab,stats)
            d=st['dir']; xs=st['x']
            # bridged tip (row 21's rule: breaks up to 0.3 staff spaces)
            H_=nl.shape[0]; last=h['y']; white=0; g_=int(round(0.3*s))
            for k in range(int(6*s)):
                y_=h['y']+d*k
                if not (0<=y_<H_): break
                if nl[y_,xs]>0: last=y_; white=0
                else:
                    white+=1
                    if white>g_: break
            tip=last; length_b=abs(last-h['y'])/s
            if length_b<2.6: heads.append(dict(id=hid,page=page_no,sys=int(syi),lengthb=round(length_b,2),short=True)); continue
            # stem edges: the thinnest run through the stem column
            best=None
            for k in range(int(1.0*s),max(int(1.0*s)+1,int(length_b*s-0.3*s))):
                y=h['y']+d*k
                if not (0<=y<H_) or nl[y,xs]==0: continue
                a=xs
                while a>0 and nl[y,a-1]>0: a-=1
                b=xs
                while b<nl.shape[1]-1 and nl[y,b+1]>0: b+=1
                if best is None or (b-a+1)<(best[1]-best[0]+1): best=(a,b)
            if best is None: continue
            a,b=best
            mask0=((lab==lid)&(nl>0)).astype(np.uint8)
            lines=[int(v) for v in staves[vocal[syi]]]
            mb=bridge(mask0,lines,s,lt,max(0,a-int(2.3*s)),min(W,b+int(2.3*s)),a,b)
            rec=dict(id=hid,page=page_no,sys=int(syi),x=int(h['x']),y=int(h['y']),s=s,lt=lt,lengthb=round(length_b,2),tip=int(tip),dir=int(d),sw=round((b-a+1)/s,3))
            for side,nm in ((+1,'R'),(-1,'L')):
                rec[nm]=path_side(mb,nl,tip,d,a,b,s,side,length_b)
                rec[nm+'_nobridge']=path_side(mask0,nl,tip,d,a,b,s,side,length_b)
            heads.append(rec)
        out['pages'].append(dict(scanPage=page_no,s=s,lt=lt,heads=heads))
    return out
