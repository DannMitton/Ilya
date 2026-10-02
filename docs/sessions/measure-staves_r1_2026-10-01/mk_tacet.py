import json, os, cv2, numpy as np
import reader
os.makedirs('/home/pyodide/out',exist_ok=True)
def main(args, paths):
    img=cv2.imread(paths[0],0); s=reader.staff_space_from_runs(img)
    chains,w=reader.trace_staves(img,s)
    H,W=img.shape
    fits=[reader._staff_fit(ch,W) for ch in chains]
    k=args['voice']                      # index of the voice staff to remove (traced order)
    x0=max(0,int(chains[args['voice']][0][1]-2*s))
    out=img.copy()
    mv=fits[k]; mp=fits[k+1]             # the piano treble staff below it
    for x in range(x0,W):
        a=int(mv[x]-3.4*s); b=int(mp[x]-2.0*s-0.9*s)
        out[max(0,a):max(0,b),x]=255
    cv2.imwrite('/home/pyodide/out/tacet.png',out)
    return dict(removed=k,s=float(s),nchains=len(chains),x0=x0)
