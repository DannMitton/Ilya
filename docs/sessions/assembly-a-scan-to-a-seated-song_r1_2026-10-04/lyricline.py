import cv2, numpy as np, sys, json
def systems(txt,W,H):
    rows=[list(map(float,l.split())) for l in open(txt) if l.strip()]
    out=[]; i=0
    while i<len(rows):
        r=rows[i]
        if int(r[0])==0:
            v=r; p=rows[i+1] if i+1<len(rows) and int(rows[i+1][0])==1 else None
            d=dict(vt=(v[2]-v[4]/2)*H, vb=(v[2]+v[4]/2)*H, x0=(v[1]-v[3]/2)*W, x1=(v[1]+v[3]/2)*W)
            d['s']=(d['vb']-d['vt'])/4.0
            d['pt']=(p[2]-p[4]/2)*H if p else d['vb']+8*d['s']
            out.append(d); i+=2 if p else 1
        else: i+=1
    return out
def find_line(gray,sysd):
    s=sysd['s']; y0=int(sysd['vb']+0.4*s); y1=int(sysd['pt']-0.3*s); x0=int(max(0,sysd['x0']-1.5*s)); x1=int(min(gray.shape[1],sysd['x1']+1.0*s))
    band=gray[y0:y1,x0:x1]; bw=(band<128).astype(np.uint8)
    n,lab,st,cen=cv2.connectedComponentsWithStats(bw,8)
    ys=[]
    for k in range(1,n):
        x,y,w,h,a=st[k]
        if 0.35*s<=h<=1.7*s and w<=2.2*s and a>=0.08*s*s: ys.append((y+h/2,h,x,w))
    if not ys: return None
    yc=np.array([t[0] for t in ys]); best=None
    for c in np.arange(yc.min(),yc.max()+1,2.0):
        k=int(((yc>c-0.55*s)&(yc<c+0.55*s)).sum())
        if best is None or k>best[0]: best=(k,c)
    c=best[1]; sel=[t for t in ys if abs(t[0]-c)<0.6*s]
    c=float(np.median([t[0] for t in sel])); hh=float(np.median([t[1] for t in sel]))
    top=int(y0+c-1.25*s); bot=int(y0+c+1.25*s)
    return dict(top=max(top,y0-int(0.2*s)),bot=min(bot,y1+int(0.2*s)),x0=x0,x1=x1,count=len(sel),medh=hh)
if __name__=='__main__':
    for p in (1,2,3):
        im=cv2.imread(f'tch-{p}.png',0); H,W=im.shape
        for i,sd in enumerate(systems(f'main/tch-{p}.txt',W,H)):
            ln=find_line(im,sd)
            print(p,i+1,{k:round(v) for k,v in sd.items()}, ln and {k:round(v) for k,v in ln.items()})
            if ln:
                crop=im[ln['top']:ln['bot'],ln['x0']:ln['x1']]; cv2.imwrite(f'line-{p}-{i+1}.png',crop)
