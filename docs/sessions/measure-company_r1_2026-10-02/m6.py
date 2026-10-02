import json, os, cv2, numpy as np
import reader
os.makedirs('/home/pyodide/out',exist_ok=True)
def main(args,paths):
    P=dict(zip(args['names'],paths)); by={}
    for i,pg,x,y in args['sel']: by.setdefault(pg,[]).append((i,x,y))
    tiles=[]
    for pg,lst in by.items():
        G=reader.read_page_geometry(dict(png=P[pg],page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m'))
        img=G['img']; s=float(G['s'])
        for i,x,y in lst:
            rx=int(2.4*s); ry=int(4.2*s)
            t=np.full((2*ry,2*rx),255,np.uint8)
            a=img[max(0,y-ry):y+ry,max(0,x-rx):x+rx]
            oy=max(0,ry-y); ox=max(0,rx-x)
            t[oy:oy+a.shape[0],ox:ox+a.shape[1]]=a
            t=cv2.cvtColor(cv2.resize(t,(2*rx*3//2*2//2*1,2*ry*3//2),interpolation=cv2.INTER_LINEAR),cv2.COLOR_GRAY2BGR)
            t=cv2.resize(t,(240,380))
            cx,cy=120,190
            for (a1,b1) in ((cx,0),(cx,370),):
                cv2.line(t,(a1,b1),(a1,b1+9),(0,0,255),2)
            for (a1,b1) in ((0,cy),(231,cy)):
                cv2.line(t,(a1,b1),(a1+8,b1),(0,0,255),2)
            cv2.putText(t,'%d'%i,(2,14),cv2.FONT_HERSHEY_SIMPLEX,0.5,(255,0,0),1)
            tiles.append((i,t))
    tiles.sort(key=lambda z:args['order'].index(z[0]))
    for k in range(0,len(tiles),12):
        part=[t for _,t in tiles[k:k+12]]; rows=[]
        for r in range(0,len(part),6):
            row=[cv2.copyMakeBorder(t,0,2,0,2,cv2.BORDER_CONSTANT,value=(150,150,150)) for t in part[r:r+6]]
            while len(row)<6: row.append(np.full((382,242,3),255,np.uint8))
            rows.append(np.hstack(row))
        cv2.imwrite('/home/pyodide/out/c%02d.png'%(k//12),np.vstack(rows))
    return len(tiles)
