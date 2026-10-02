import json, os, cv2, numpy as np
import reader
os.makedirs('/home/pyodide/out',exist_ok=True)
NAMES=['tch-1','tch-2','tch-3','lamm-1','lamm-2','B-lamm-p2','B-bessel01-p2','B-bessel04-p3','B-bessel05-p3','B-s06-p21']
def solid_cols(dark, top, bot, fill):
    seg=dark[top:bot+1,:]
    f=seg.mean(axis=0)
    cols=np.flatnonzero(f>=fill)
    runs=[]
    for c in cols:
        if runs and c-runs[-1][1]<=1: runs[-1][1]=c
        else: runs.append([int(c),int(c)])
    return [(a,b) for a,b in runs]
def main(args,paths):
    res=[]
    for name,p in zip(NAMES,paths):
        cfg=dict(png=p,page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m')
        G=reader.read_page_geometry(cfg)
        img,nl,staves,s,vocal,voices=G['img'],G['nl'],G['staves'],G['s'],G['vocal'],G['voices']
        dark=img<128
        det=reader.detect_barlines(nl,staves,vocal,s)
        # systems in page order
        sysl=[]; groups=[]
        edges=[reader._staff_left_edge(dark,st) for st in staves]
        gs=[[0]]
        for i in range(1,len(staves)):
            x0=edges[i-1] if edges[i-1] is not None else edges[i]
            if reader._joined_at_left(dark,staves[i-1],staves[i],x0,s): gs[-1].append(i)
            else: gs.append([i])
        for si,g in enumerate(gs):
            v=[j for j in g if j in vocal]
            vi=vocal.index(v[0]) if v else None
            row=dict(sys=si,group=g,voice=(v[0] if v else None),edge=edges[g[0]])
            if vi is not None:
                row['detect']=det.get(vi,[])
                st=staves[v[0]]
                row['voiceSolid']=[ (a+b)//2 for a,b in solid_cols(dark,st[0],st[-1],0.93)]
            piano=[j for j in g if j not in v]
            if len(piano)>=2:
                top=staves[piano[0]][0]; bot=staves[piano[-1]][-1]
                row['pianoSpan']=[ (a+b)//2 for a,b in solid_cols(dark,top,bot,0.93)]
                row['pianoSpanW']=[ b-a+1 for a,b in solid_cols(dark,top,bot,0.93)]
            gl=[top for top in []]
            groups.append(row)
        res.append(dict(page=name,s=float(s),shape=list(img.shape),systems=groups))
        cv2.imwrite('/home/pyodide/out/%s-straight.png'%name, img)
        print(name,'done')
    return res
