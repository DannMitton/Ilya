import json, cv2, numpy as np
import reader
def main(args,paths):
    rows=[]
    for name,p in zip(args['names'],paths):
        img=cv2.imread(p,0)
        img,staves,s,info=reader.find_staves(img,page=name); dark=img<128
        edges=[reader._staff_left_edge(dark,st) for st in staves]
        gs=[[0]]
        for i in range(1,len(staves)):
            x0=edges[i-1] if edges[i-1] is not None else edges[i]
            if reader._joined_at_left(dark,staves[i-1],staves[i],x0,s): gs[-1].append(i)
            else: gs.append([i])
        for si,g in enumerate(gs):
            if len(g)<3: continue
            x0=next((edges[j] for j in g if edges[j] is not None),None)
            span=reader._brace_span(dark,x0,staves[g[0]][0],staves[g[-1]][-1],s)
            if span is None: rows.append(dict(page=name,sys=si,span=None)); continue
            ov=[]
            for j in g:
                st=staves[j]; ov.append(round((min(span[1],st[-1])-max(span[0],st[0]))/(st[-1]-st[0]),3))
            rows.append(dict(page=name,sys=si,ov=ov))
    return rows
