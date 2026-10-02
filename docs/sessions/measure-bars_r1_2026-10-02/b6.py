import json, os, cv2, numpy as np
import reader
os.makedirs('/home/pyodide/out',exist_ok=True)
NAMES=['lamm1','lamm2','Blamm','Bbessel01','Bbessel04','Bbessel05','Bs06']
def coll(xs,gap):
    out=[]
    for x in sorted(xs):
        if out and x-out[-1]<=gap: continue
        out.append(x)
    return out
def solid_cols(dark, top, bot, fill):
    f=dark[top:bot+1,:].mean(axis=0); cols=np.flatnonzero(f>=fill); runs=[]
    for c in cols:
        if runs and c-runs[-1][1]<=1: runs[-1][1]=c
        else: runs.append([int(c),int(c)])
    return [(a+b)//2 for a,b in runs]
def main(args,paths):
    res=[]
    for name,p in zip(NAMES,paths):
        G=reader.read_page_geometry(dict(png=p,page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m'))
        img,nl,staves,s,vocal=G['img'],G['nl'],G['staves'],G['s'],G['vocal']
        dark=img<128
        det=reader.detect_barlines(nl,staves,vocal,s)
        edges=[reader._staff_left_edge(dark,st) for st in staves]
        gs=[[0]]
        for i in range(1,len(staves)):
            x0=edges[i-1] if edges[i-1] is not None else edges[i]
            if reader._joined_at_left(dark,staves[i-1],staves[i],x0,s): gs[-1].append(i)
            else: gs.append([i])
        for si,g in enumerate(gs):
            v=[j for j in g if j in vocal][0]; piano=[j for j in g if j!=v]
            dt=det[vocal.index(v)]
            ps=[x for x in solid_cols(dark,staves[piano[0]][0],staves[piano[-1]][-1],0.93) if x>edges[g[0]]+2*s]
            un=coll(list(dt)+ps,1.0*s)
            a=int(staves[g[0]][0]-2.0*s); b=int(staves[g[-1]][-1]+1.0*s)
            col=cv2.cvtColor(img[a:b,:],cv2.COLOR_GRAY2BGR)
            for k,x in enumerate(un):
                cv2.line(col,(int(x),0),(int(x),int(2*s)),(255,0,0),5)
                cv2.putText(col,str(k+1),(int(x)+4,int(2*s)+int(s)),cv2.FONT_HERSHEY_SIMPLEX,s/20.0,(255,0,0),3)
            sc=1800.0/col.shape[1]
            cv2.imwrite('/home/pyodide/out/%s-s%d.png'%(name,si),cv2.resize(col,None,fx=sc,fy=sc,interpolation=cv2.INTER_AREA))
            res.append(dict(page=name,sys=si,voice=v,detect=[int(x) for x in dt],pianoSpan=[int(x) for x in ps],union=[int(x) for x in un],edge=edges[g[0]],s=float(s)))
    return res
