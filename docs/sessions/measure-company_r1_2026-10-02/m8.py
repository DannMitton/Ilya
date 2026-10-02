import json, os, cv2, numpy as np
import reader
os.makedirs('/home/pyodide/out',exist_ok=True)
def main(args,paths):
    tiles=[];recs=[]
    for n,p in zip(args['names'],paths):
        G=reader.read_page_geometry(dict(png=p,page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m'))
        img=G['img'];s=float(G['s'])
        for b in G['byCompany']:
            x,y=b['x'],b['y']
            rx=int(2.4*s);ry=int(4.2*s)
            t=np.full((2*ry,2*rx),255,np.uint8)
            a=img[max(0,y-ry):y+ry,max(0,x-rx):x+rx]; oy=max(0,ry-y);ox=max(0,rx-x)
            t[oy:oy+a.shape[0],ox:ox+a.shape[1]]=a
            t=cv2.resize(cv2.cvtColor(t,cv2.COLOR_GRAY2BGR),(240,380))
            for (a1,b1) in ((120,0),(120,370)): cv2.line(t,(a1,b1),(a1,b1+9),(0,0,255),2)
            for (a1,b1) in ((0,190),(231,190)): cv2.line(t,(a1,b1),(a1+8,b1),(0,0,255),2)
            cv2.putText(t,'%d'%len(tiles),(2,14),cv2.FONT_HERSHEY_SIMPLEX,0.5,(255,0,0),1)
            tiles.append(t); recs.append(dict(i=len(tiles)-1,page=n,**b))
    for k in range(0,len(tiles),12):
        part=tiles[k:k+12];rows=[]
        for r in range(0,len(part),6):
            row=[cv2.copyMakeBorder(t,0,2,0,2,cv2.BORDER_CONSTANT,value=(150,150,150)) for t in part[r:r+6]]
            while len(row)<6: row.append(np.full((382,242,3),255,np.uint8))
            rows.append(np.hstack(row))
        cv2.imwrite('/home/pyodide/out/f%02d.png'%(k//12),np.vstack(rows))
    return recs
