import json, os, time
import cv2, numpy as np
import reader
def main(args, paths):
    names=sorted(os.listdir('/home/pyodide/fx'))
    res=[]
    for n in names:
        if n.startswith('S_lamm') or n.startswith('pdfjs') or n.startswith('raster') and False: pass
        img=cv2.imread('/home/pyodide/fx/'+n,0)
        try:
            img,staves,s,info=reader.find_staves(img,page=n)
        except Exception as e:
            res.append(dict(page=n,err=repr(e)[:120])); continue
        dark=(img<128)
        edges=[reader._staff_left_edge(dark,st) for st in staves]
        systems=[[0]]
        for i in range(1,len(staves)):
            x0=edges[i-1] if edges[i-1] is not None else edges[i]
            if reader._joined_at_left(dark,staves[i-1],staves[i],x0,s): systems[-1].append(i)
            else: systems.append([i])
        for si,g in enumerate(systems):
            if len(g)<2: continue
            x0=next((edges[j] for j in g if edges[j] is not None),None)
            span=reader._brace_span(dark,x0,staves[g[0]][0],staves[g[-1]][-1],s)
            unb=[j for j in g if span is None or not reader._in_span(span,staves[j])]
            verdict='tacet' if (span is not None and not unb) else ('voice=%d'%unb[0] if span is not None and len(unb)==1 else 'undecided')
            tv,cv_,sc=reader._sign_vote(img,staves,s,g)
            row=dict(page=n,system=si,group=g,brace=verdict,text=tv,chord=cv_,scores={str(j):[sc[j][0],None if sc[j][1] is None else round(sc[j][1],3),sc[j][2]] for j in g})
            res.append(row)
            print(json.dumps(row))
    return res
