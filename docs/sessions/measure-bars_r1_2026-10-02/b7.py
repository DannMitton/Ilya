import json, os, cv2, numpy as np
import reader
CF={'sunless-01':(('F',4),2,0),'sunless-02':(('G',2),2,-1),'sunless-03':(('G',2),0,-1),'sunless-04':(('G',2),2,0),'sunless-05':(('G',2),0,-1),'sunless-06':(('G',2),7,-1)}
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
    for n in sorted(os.listdir('/home/pyodide/fx')):
        p='/home/pyodide/fx/'+n
        clef,key,oc=(('G',2),0,0)
        for k,v in CF.items():
            if n.startswith('R_'+k): clef,key,oc=v
        G=reader.read_page_geometry(dict(png=p,page=1,clef=clef,key=key,octaveChange=oc,pieceId='m'))
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
            v=[j for j in g if j in vocal]
            if not v: continue
            piano=[j for j in g if j!=v[0]]
            dt=[int(x) for x in det[vocal.index(v[0])]]
            row=dict(page=n,sys=si,nstaves=len(g),voice=v[0],detect=dt)
            if piano:
                top=staves[piano[0]][0]; bot=staves[piano[-1]][-1]
                ps=[int(x) for x in solid_cols(dark,top,bot,0.93) if x>edges[g[0]]+2*s]
                ps=coll(ps,1.0*s)
                row['piano']=ps
                tol=0.6*s
                row['voice_without_piano']=[x for x in dt if not any(abs(x-y)<=tol for y in ps)]
                row['piano_without_voice']=[y for y in ps if not any(abs(x-y)<=tol for x in dt)]
            res.append(row)
        print(n,'ok')
    return res
