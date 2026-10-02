import json, os, cv2, numpy as np
import reader
os.makedirs('/home/pyodide/out',exist_ok=True)
def main(args,paths):
    tiles=[]; meta=[]
    byname={n:p for n,p in zip(args['names'],paths)}
    for name in args['names']:
        G=reader.read_page_geometry(dict(png=byname[name],page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m'))
        img=G['img']; s=G['s']
        for c in args['cands']:
            if c['page']!=name: continue
            cx,cy=c['x'],c['y']; rr=int(2.4*s)
            a=img[max(0,cy-rr):cy+rr,max(0,cx-rr):cx+rr]
            t=cv2.cvtColor(cv2.resize(a,(160,160)),cv2.COLOR_GRAY2BGR)
            cv2.putText(t,'%d %s'%(len(tiles),name[:5]),(2,13),cv2.FONT_HERSHEY_SIMPLEX,0.4,(0,0,255),1)
            cv2.drawMarker(t,(80,80),(255,0,0),cv2.MARKER_CROSS,8,1)
            tiles.append(t); meta.append(c)
    cols=8
    rows=[]
    for i in range(0,len(tiles),cols):
        row=tiles[i:i+cols]
        row=[cv2.copyMakeBorder(t,0,1,0,1,cv2.BORDER_CONSTANT,value=(150,150,150)) for t in row]
        while len(row)<cols: row.append(np.full((161,161,3),255,np.uint8))
        rows.append(np.hstack(row))
    cv2.imwrite('/home/pyodide/out/adm.png',np.vstack(rows))
    return meta
