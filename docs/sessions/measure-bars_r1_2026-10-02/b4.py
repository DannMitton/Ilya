import json, os, cv2, numpy as np
import reader
exec(open('/home/pyodide/b3helpers.py').read()) if os.path.exists('/home/pyodide/b3helpers.py') else None
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
    out=[]
    for name,p in zip(['tch-1','tch-2','tch-3'],paths):
        cfg=dict(png=p,page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m')
        G=reader.read_page_geometry(cfg)
        img,nl,staves,s,vocal=G['img'],G['nl'],G['staves'],G['s'],G['vocal']
        dark=img<128; nd=nl>0
        det=reader.detect_barlines(nl,staves,vocal,s)
        edges=[reader._staff_left_edge(dark,st) for st in staves]
        gs=[[0]]
        for i in range(1,len(staves)):
            x0=edges[i-1] if edges[i-1] is not None else edges[i]
            if reader._joined_at_left(dark,staves[i-1],staves[i],x0,s): gs[-1].append(i)
            else: gs.append([i])
        H=nl.shape[0]
        bound=reader.BARLINE_WIDTH_BOUND*s; maxb=reader.MAX_ROW_WIDTH_BOUND*s; tol=reader.BARLINE_SPAN_TOLERANCE*s
        for si,g in enumerate(gs):
            v=g[0]; st=staves[v]; top,bot=st[0],st[-1]; piano=g[1:]
            ps=[x for x in solid_cols(dark,staves[piano[0]][0],staves[piano[-1]][-1],0.93) if x>edges[g[0]]+2*s]
            dt=det[vocal.index(v)]
            for x in coll(list(dt)+ps,1.0*s):
                if any(abs(x-y)<=0.6*s for y in dt): continue
                best=None
                pad=int(round(2.0*s)); lo=max(0,top-pad); hi=min(H,bot+pad+1)
                for xc in range(int(x-0.6*s),int(x+0.6*s)+1):
                    # row widths of the dark run through (y,xc), as reader does but unclipped
                    ws=[]
                    for y in range(top,bot+1,max(1,int(s//6))):
                        if not nd[y,xc]: continue
                        a=xc
                        while a>0 and nd[y,a-1]: a-=1
                        b=xc
                        while b<nl.shape[1]-1 and nd[y,b+1]: b+=1
                        ws.append(b-a+1)
                    col=nd[lo:hi,xc]; idx=np.where(col)[0]
                    r=dict(xc=xc,nw=len(ws),medw=float(np.median(ws)) if ws else None,maxw=max(ws) if ws else None)
                    if len(idx)==0: r['solid']=None; r['top_over']=None
                    else:
                        y0=lo+idx[0]; y1=lo+idx[-1]
                        r['solid']=bool((y1-y0+1)==len(idx)); r['top_over']=round((top-y0)/s,2); r['bot_over']=round((y1-bot)/s,2)
                    # reasons
                    why=[]
                    if len(ws)<3: why.append('few rows')
                    else:
                        if np.median(ws)>bound: why.append('median row width %.2f s > 0.5'%(np.median(ws)/s))
                        if max(ws)>maxb: why.append('max row width %.2f s > 1.07'%(max(ws)/s))
                    if r['solid'] is False: why.append('not solid in the +-2 s window')
                    elif r['solid'] and not (abs(r['top_over']*s)<=tol and abs(r['bot_over']*s)<=tol): why.append('overshoot top %.2f bot %.2f s'%(r['top_over'],r['bot_over']))
                    r['why']=why
                    if best is None or len(why)<len(best['why']): best=r
                out.append(dict(page=name,sys=si,x=int(x),best=best))
        print(name,'ok')
    return out
