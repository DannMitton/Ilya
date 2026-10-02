import json, os, cv2, numpy as np
import reader
def coll(xs,gap):
    out=[]
    for x in sorted(xs):
        if out and x-out[-1]<=gap: continue
        out.append(x)
    return out
def solid(dark,top,bot,fill):
    f=dark[top:bot+1,:].mean(axis=0); cols=np.flatnonzero(f>=fill); runs=[]
    for c in cols:
        if runs and c-runs[-1][1]<=1: runs[-1][1]=c
        else: runs.append([int(c),int(c)])
    return [(a+b)//2 for a,b in runs]
def main(args,paths):
    out=[]
    for name,p in zip(args['names'],paths):
        G=reader.read_page_geometry(dict(png=p,page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m'))
        img,nl,staves,s,vocal=G['img'],G['nl'],G['staves'],G['s'],G['vocal']; dark=img<128
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
            v=v[0]; piano=[j for j in g if j!=v]
            if len(piano)<2: continue
            e=edges[g[0]]
            pt=staves[piano[0]][0]; pb=staves[piano[-1]][-1]; vt=staves[v][0]; vb=staves[v][-1]
            dt=[int(x) for x in det[vocal.index(v)]]
            ps=[x for x in solid(dark,pt,pb,0.93) if x>e+2*s]
            truth=coll(dt+ps,1.0*s)
            fp=dark[pt:pb+1,:].mean(axis=0); fv=dark[vt:vb+1,:].mean(axis=0)
            W=len(fp); tol=int(0.5*s)
            row=dict(page=name,sys=si,s=float(s),truth=truth)
            row['piano_best']=[float(fp[max(0,t-tol):t+tol+1].max()) for t in truth]
            row['voice_best']=[float(fv[max(0,t-tol):t+tol+1].max()) for t in truth]
            mask=np.ones(W,bool)
            for t in truth: mask[max(0,t-int(1.0*s)):t+int(1.6*s)+1]=False
            mask[:e+int(2*s)]=False
            mask[int(W*0.985):]=False
            row['piano_non_max']=float(fp[mask].max()); row['piano_non_at']=int(np.argmax(np.where(mask,fp,-1)))
            row['voice_non_max']=float(fv[mask].max()); row['voice_non_at']=int(np.argmax(np.where(mask,fv,-1)))
            # all non-barline columns with fill above 0.7, as runs
            cols=np.flatnonzero(mask&(fp>0.7)); runs=[]
            for c in cols:
                if runs and c-runs[-1][1]<=1: runs[-1][1]=int(c)
                else: runs.append([int(c),int(c)])
            row['non_runs']=[(a,b,round(float(fp[a:b+1].max()),3)) for a,b in runs]
            out.append(row)
    return out
