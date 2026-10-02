# Part A and B measurements. Build songs only. Reads a song's pages as the Worker's read_pages does and, for every head the reader
# reads, records the shape at the far end of its stem, and every component _has_dot would accept.
import json, os, cv2, numpy as np
import envelope, reader, beams, run_page2
from reader import _head_cc_area
os.makedirs('/home/pyodide/out',exist_ok=True)
OFFS=[0.10,0.25,0.45,0.55,0.65,0.75,0.85,1.05]

def runs_in_col(a, x, y0, y1):
    """ink runs in column x over rows y0..y1 inclusive (y0<=y1)"""
    H,W=a.shape
    if not (0<=x<W): return []
    y0=max(0,y0); y1=min(H-1,y1)
    col=a[y0:y1+1,x]>0
    out=[]; start=None
    for i,v in enumerate(col):
        if v and start is None: start=i
        if not v and start is not None: out.append((y0+start,y0+i-1)); start=None
    if start is not None: out.append((y0+start,y1))
    return out

def far_end(nl, h, s, bars_, lab=None, lid=0):
    st=beams.find_stem(nl,h['x'],h['y'],s)
    if st is None: return None
    d=st['dir']; xs=st['x']; tip0=st['end_y']-d
    # bridged tip: follow the stem column from the head with white gaps of up to 0.3 staff spaces bridged, up to 6 staff spaces
    H_=nl.shape[0]; yy=h['y']; last=yy; white=0; g_=int(round(0.3*s))
    for k in range(int(6*s)):
        y_=h['y']+d*k
        if not (0<=y_<H_): break
        if nl[y_,xs]>0: last=y_; white=0
        else:
            white+=1
            if white>g_: break
    tip=last; length_b=abs(last-h['y'])/s
    # stem edges: the thinnest horizontal run through the stem column between 1.0 and (length-0.3) staff spaces from the head
    best=None
    for k in range(int(1.0*s),max(int(1.0*s)+1,int(st['length']-0.3*s))):
        y=h['y']+d*k
        if not (0<=y<nl.shape[0]) or nl[y,xs]==0: continue
        a=xs
        while a>0 and nl[y,a-1]>0: a-=1
        b=xs
        while b<nl.shape[1]-1 and nl[y,b+1]>0: b+=1
        if best is None or (b-a+1)<(best[1]-best[0]+1): best=(a,b)
    if best is None: return None
    a,b=best
    sw=(b-a+1)
    full=nl
    if lab is not None and lid>0: nl=((lab==lid)&(nl>0)).astype(np.uint8)
    # window rows, in terms of t = distance from the tip toward the head, in rows
    t0=int(-0.4*s); t1=int(2.6*s)
    ys=[tip-d*t for t in (t0,t1)]
    ya,yb=min(ys),max(ys)
    prof={}
    for side,name in ((+1,'R'),(-1,'L')):
        for o in OFFS:
            x=(b+int(round(o*s))) if side>0 else (a-int(round(o*s)))
            rs=runs_in_col(nl,x,ya,yb)
            lst=[]
            for (r0,r1) in rs:
                # t of the run's start (nearest the tip) and end, in ss
                ta=(tip-r0)*d/s; tb=(tip-r1)*d/s
                tmin,tmax=min(ta,tb),max(ta,tb)
                lst.append([round(tmin,3),round((r1-r0+1)/s,3)])
            lst.sort()
            prof['%s%.2f'%(name,o)]=lst
    # ink mass beside the stem in the window t in [-0.4, 1.8] ss, offsets 0.10 to 0.70 ss, each side, in staff spaces squared
    mass={}
    ta,tb=int(-0.4*s),int(1.8*s)
    rows=[tip-d*t for t in (ta,tb)]; r0,r1=min(rows),max(rows)
    for side,name in ((+1,'R'),(-1,'L')):
        if side>0: c0=b+int(round(0.10*s)); c1=b+int(round(0.70*s))
        else: c1=a-int(round(0.10*s)); c0=a-int(round(0.70*s))
        reg=nl[max(0,r0):r1+1,max(0,c0):c1+1]>0
        mass[name]=round(float(reg.sum())/(s*s),3)
    # reach: the farthest distance from the stem edge, in staff spaces, of ink of the stem's own component in the window
    reach={}
    for side,name in ((+1,'R'),(-1,'L')):
        if side>0:
            reg=nl[max(0,r0):r1+1,b+1:min(nl.shape[1],b+1+int(2.5*s))]>0
            cols=np.where(reg.any(axis=0))[0]
            reach[name]=round(float((cols.max()+1)/s),3) if cols.size else 0.0
        else:
            c0=max(0,a-int(2.5*s)); reg=nl[max(0,r0):r1+1,c0:a]>0
            cols=np.where(reg.any(axis=0))[0]
            reach[name]=round(float((a-(c0+cols.min()))/s),3) if cols.size else 0.0
    return dict(x=int(xs),dir=int(d),tip=int(tip),tip0=int(tip0),length=round(st['length']/s,2),lengthb=round(length_b,2),sw=round(sw/s,3),prof=prof,mass=mass,reach=reach)

def main(args,paths):
    out=dict(pages=[],ids=[])
    ctx=None; song=args['song']
    for pn,(page_no,p) in enumerate(zip(args['pages'],paths),start=1):
        cfg=dict(png=p,page=pn,clef=('G',2),key=int(args['key']),octaveChange=0,pieceId='m')
        try:
            ro,ctx_next,msum,G,rests,events=envelope.run(cfg,ctx)
        except Exception as e:
            out['pages'].append(dict(scanPage=page_no,error=str(e)[:200])); continue
        off=0 if ctx is None else ctx.get('measureIndexOffset',0)
        ctx=ctx_next
        img,nl,staves,s,vocal=G['img'],G['nl_safe'],G['staves'],float(G['s']),G['vocal']
        W=img.shape[1]
        num,lab,stats,cent=cv2.connectedComponentsWithStats(G['nl'],8)
        bars_=beams.detect_beam_bars(nl,s)
        voices=G['voices']; order=voices['order']; bl=G['barlines']['byVocal']; tbl=G['barlines']['tacet']
        sysbars=[];ti=0
        for o in order:
            if o is None: sysbars.append(tbl.get(ti,[])); ti+=1
            else: sysbars.append(bl.get(o,[]))
        mps=[max(1,len(b)) for b in sysbars]; base=list(np.cumsum([0]+mps)[:-1])
        hooks=G.get('hooks',[])
        lt=float(run_page2._staff_line_thickness(G['img'],staves,s))
        noteids={n['id'] for n in ro['verses'][0]['notes']}
        heads=[]
        for h in G['heads']:
            syi=h['sys']; pos=order.index(syi); bnds=[0]+sysbars[pos]+[W]
            seg=0
            for k in range(mps[pos]):
                if bnds[k]<=h['x']<bnds[k+1]: seg=k;break
            mi=off+int(base[pos])+seg
            hid='r%d-%d'%(mi,h['x'])
            area,lid=_head_cc_area(dict(x=h['x'],y=h['y']),G['nl'],lab,stats)
            st=beams.find_stem(nl,h['x'],h['y'],s)
            nb=beams.beams_on_stem(st,bars_,s)
            rec=dict(id=hid,page=page_no,sys=int(syi),lines=[int(v) for v in staves[vocal[syi]]],x=int(h['x']),y=int(h['y']),s=s,hollow=bool(h.get('hollow')),area=round(float(area)/(s*s),3),nb=int(nb),inids=hid in noteids)
            if not h.get('hollow'):
                fe=far_end(nl,h,s,bars_,lab,lid)
                rec['stem']=fe
                if fe:
                    tipx=fe['x']; tipy=fe['tip']
                    ds=[((k['x']-tipx)**2+(k['y']-tipy)**2)**0.5/s for k in hooks if k['sys']==syi]
                    rec['hookdist']=round(min(ds),2) if ds else None
            # every component _has_dot accepts, in place of the first
            dots=[]
            for i in range(1,num):
                x0,y0,w,hh,ar=stats[i]; cx,cy=cent[i]
                if 0.3*s<ar<0.25*s*s and w<=0.7*s and hh<=0.7*s and abs(w-hh)<=0.35*s and 0.35*s<(cx-h['x'])<2.2*s and abs(cy-h['y'])<0.8*s:
                    # roundness: fill ratio of the bbox and the aspect, plus circularity from the contour
                    mask=(lab[y0:y0+hh,x0:x0+w]==i).astype(np.uint8)
                    cnts,_=cv2.findContours(mask,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)
                    per=cv2.arcLength(cnts[0],True) if cnts else 0
                    circ=float(4*np.pi*ar/(per*per)) if per>0 else 0
                    # place against the staff lines of this voice staff
                    lines=staves[vocal[syi]]; d=float(np.median(np.diff(lines)))
                    pp=(cy-lines[0])/(d/2)   # half-space units from the top line (0 = top line)
                    dots.append(dict(cx=round(float(cx),1),cy=round(float(cy),1),area=round(float(ar)/(s*s),3),w=round(w/s,3),h=round(hh/s,3),
                        fill=round(float(ar)/(w*hh),3),circ=round(circ,3),dx=round((cx-h['x'])/s,3),dy=round((cy-h['y'])/s,3),halfsteps=round(float(pp),2)))
            if dots: rec['dots']=dots
            heads.append(rec)
        # page printed-dot population: component sizes of every accepted dot on the page is recorded above
        cv2.imwrite('/home/pyodide/out/s%d-p%d.png'%(song,page_no),G['img'])
        out['pages'].append(dict(scanPage=page_no,s=s,offset=off,lt=lt,heads=heads))
        out['ids']+= [n['id'] for n in ro['verses'][0]['notes']]
    return out
