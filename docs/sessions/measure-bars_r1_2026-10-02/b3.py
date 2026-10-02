import json, os, cv2, numpy as np
import reader
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
        dark=img<128; ndark=nl>0
        num,lab,stats,cent=cv2.connectedComponentsWithStats(nl,8)
        det=reader.detect_barlines(nl,staves,vocal,s)
        edges=[reader._staff_left_edge(dark,st) for st in staves]
        gs=[[0]]
        for i in range(1,len(staves)):
            x0=edges[i-1] if edges[i-1] is not None else edges[i]
            if reader._joined_at_left(dark,staves[i-1],staves[i],x0,s): gs[-1].append(i)
            else: gs.append([i])
        for si,g in enumerate(gs):
            v=g[0]; st=staves[v]; sh=st[-1]-st[0]; piano=g[1:]
            top=staves[piano[0]][0]; bot=staves[piano[-1]][-1]
            ps=[x for x in solid_cols(dark,top,bot,0.93) if x>edges[g[0]]+2*s]
            dt=det[vocal.index(v)]
            un=coll(list(dt)+ps,1.0*s)
            for x in un:
                if any(abs(x-y)<=0.6*s for y in dt): continue
                # what is there on the voice staff in the line-free image
                rec=dict(page=name,sys=si,x=int(x),sh=int(sh),s=float(s))
                ymid=(st[0]+st[-1])//2
                hit=None
                for dx in range(0,int(0.6*s)+1):
                    for xx in (x-dx,x+dx):
                        if 0<=xx<nl.shape[1] and ndark[ymid,xx]: hit=xx; break
                    if hit is not None: break
                if hit is None:
                    rec['kind']='no ink at the staff middle row within 0.6 s'
                else:
                    li=lab[ymid,hit]; bx,by,bw,bh,ar=[int(t) for t in stats[li]]
                    rec.update(comp=dict(x=bx,y=by,w=bw,h=bh),w_s=round(bw/s,2),h_over_sh=round(bh/sh,2),top_over=round((st[0]-by)/s,2),bot_over=round((by+bh-st[-1])/s,2))
                    # column solidity in nl through the staff
                    col=ndark[st[0]:st[-1]+1,hit]
                    rec['staffColFill_nl']=round(float(col.mean()),2)
                    rec['staffColFill_img']=round(float(dark[st[0]:st[-1]+1,hit].mean()),2)
                    # why the component fails the tests
                    why=[]
                    if not (0.85*sh<=bh<=1.35*sh): why.append('height %.2f of staff'%(bh/sh))
                    if bw>reader.BARLINE_WIDTH_BOUND*s: why.append('width %.2f s'%(bw/s))
                    rec['fails']=why
                    # what else the component touches: dark pixels of the component outside the staff rows
                    sub=(lab[by:by+bh,bx:bx+bw]==li)
                    rows_in=sub[max(0,st[0]-by):max(0,st[-1]-by)+1,:].sum()
                    rec['inkInStaffRows']=int(rows_in); rec['inkTotal']=int(sub.sum())
                out.append(rec)
        print(name,'ok')
    return out
