import json, os, cv2, numpy as np, collections
import reader
os.makedirs('/home/pyodide/out',exist_ok=True)
CF={'sunless-01':(('F',4),2,0),'sunless-02':(('G',2),2,-1),'sunless-03':(('G',2),0,-1),'sunless-04':(('G',2),2,0),'sunless-05':(('G',2),0,-1),'sunless-06':(('G',2),7,-1)}
def white_core(ink, cx, cy, s):
    """The white component containing (or nearest to) the centre, within a window of 1.4 s each way."""
    r=int(round(1.4*s)); H,W=ink.shape
    y0=max(0,cy-r); y1=min(H,cy+r+1); x0=max(0,cx-r); x1=min(W,cx+r+1)
    win=ink[y0:y1,x0:x1]
    white=(~win).astype(np.uint8)
    sy,sx=cy-y0,cx-x0
    if not (0<=sy<white.shape[0] and 0<=sx<white.shape[1]): return None
    if not white[sy,sx]:
        # nearest white pixel within 0.35 s
        best=None
        rr=int(round(0.35*s))
        for dy in range(-rr,rr+1):
            for dx in range(-rr,rr+1):
                yy,xx=sy+dy,sx+dx
                if 0<=yy<white.shape[0] and 0<=xx<white.shape[1] and white[yy,xx]:
                    d=dy*dy+dx*dx
                    if best is None or d<best[0]: best=(d,yy,xx)
        if best is None: return None
        sy,sx=best[1],best[2]
    num,lab,stats,cent=cv2.connectedComponentsWithStats(white,4)
    li=lab[sy,sx]
    m=(lab==li)
    ys,xs=np.where(m)
    touches=bool(ys.min()==0 or xs.min()==0 or ys.max()==m.shape[0]-1 or xs.max()==m.shape[1]-1)
    h=ys.max()-ys.min()+1; w=xs.max()-xs.min()+1; area=int(m.sum())
    # wall straightness over the middle 70% rows
    rows=range(int(ys.min()+0.15*h), int(ys.max()-0.15*h)+1)
    lx=[];rx=[]
    for yy in rows:
        xr=np.where(m[yy])[0]
        if xr.size: lx.append(xr.min()); rx.append(xr.max())
    if len(lx)>=3:
        lspread=(max(lx)-min(lx))/s; rspread=(max(rx)-min(rx))/s
        lfrac=float(np.mean(np.abs(np.array(lx)-np.median(lx))<=1.0)); rfrac=float(np.mean(np.abs(np.array(rx)-np.median(rx))<=1.0))
    else: lspread=rspread=lfrac=rfrac=None
    return dict(closed=not touches,w=round(w/s,2),h=round(h/s,2),area=round(area/(s*s),3),lspread=None if lspread is None else round(lspread,2),rspread=None if rspread is None else round(rspread,2),lstraight=None if lfrac is None else round(lfrac,2),rstraight=None if rfrac is None else round(rfrac,2),
                bx=int(x0+xs.min()),by=int(y0+ys.min()),bw=int(w),bh=int(h))
def stem_runs(nl, cx, cy, s):
    H,W=nl.shape; best=None
    for c in range(max(0,cx-int(1.1*s)),min(W,cx+int(1.1*s)+1)):
        if not nl[cy,c]: continue
        u=0
        while cy-u-1>=0 and nl[cy-u-1,c] and u<8*s: u+=1
        d=0
        while cy+d+1<H and nl[cy+d+1,c] and d<8*s: d+=1
        if best is None or max(u,d)>max(best[1],best[2]): best=(c,u,d)
    if best is None: return dict(col=None,up=0,down=0)
    return dict(col=int(best[0]-cx),up=round(best[1]/s,2),down=round(best[2]/s,2))
def analyse(name,p,clef,key,oc,tiles):
    G=reader.read_page_geometry(dict(png=p,page=1,clef=clef,key=key,octaveChange=oc,pieceId='m'))
    img,nl,s=G['img'],G['nl'],G['s']; ink_img=img<128; ink_nl=nl>0
    out=[]
    for h in G['heads']:
        if not h.get('hollow'): continue
        cx,cy=int(h['x']),int(h['y'])
        r=dict(page=name,x=cx,y=cy,sys=int(h['sys']),score=round(float(h['score']),3),s=float(s))
        r['stem']=stem_runs(ink_nl,cx,cy,s)
        r['core_nl']=white_core(ink_nl,cx,cy,s); r['core_img']=white_core(ink_img,cx,cy,s)
        out.append(r)
        rr=int(2.2*s); a=img[max(0,cy-rr):cy+rr,max(0,cx-rr):cx+rr]
        t=cv2.cvtColor(cv2.resize(a,(150,150)),cv2.COLOR_GRAY2BGR)
        cv2.putText(t,str(len(tiles)),(2,13),cv2.FONT_HERSHEY_SIMPLEX,0.45,(0,0,255),1)
        cv2.drawMarker(t,(75,75),(255,0,0),cv2.MARKER_CROSS,8,1)
        tiles.append(t); r['id']=len(tiles)-1
    return out
def montage(tiles,tag):
    cols=8; res=[]
    for k in range(0,len(tiles),40):
        part=tiles[k:k+40]; rows=[]
        for i in range(0,len(part),cols):
            row=part[i:i+cols]
            row=[cv2.copyMakeBorder(t,0,1,0,1,cv2.BORDER_CONSTANT,value=(150,150,150)) for t in row]
            while len(row)<cols: row.append(np.full((151,151,3),255,np.uint8))
            rows.append(np.hstack(row))
        cv2.imwrite('/home/pyodide/out/%s-%d.png'%(tag,k//40),np.vstack(rows))
def main(args,paths):
    scan=[];tiles=[]
    for name,p in zip(args['names'],paths): scan+=analyse(name,p,('G',2),0,0,tiles)
    montage(tiles,'scan')
    ren=[];tiles2=[]
    if args.get('renders'):
        for n in sorted(os.listdir('/home/pyodide/fx')):
            clef,key,oc=(('G',2),0,0)
            for k,v in CF.items():
                if n.startswith('R_'+k): clef,key,oc=v
            ren+=analyse(n,'/home/pyodide/fx/'+n,clef,key,oc,tiles2)
        montage(tiles2,'ren')
    return dict(scan=scan,renders=ren)
