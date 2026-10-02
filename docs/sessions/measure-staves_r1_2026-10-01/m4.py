import json, os, cv2, numpy as np
import reader, envelope, timesig
os.makedirs('/home/pyodide/out', exist_ok=True)
def main(args, paths):
    p=paths[0]
    cfg=dict(png=p,page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m')
    ro,_,_,G,rests,_e=envelope.run(cfg,None)
    staves,s,vocal,nl=G['staves'],G['s'],G['vocal'],G['nl']
    img=G['img']; W=img.shape[1]
    bl=reader.detect_barlines(nl,staves,vocal,s)
    out=dict(s=float(s),vocal=[int(v) for v in vocal],barlines={int(k):[int(x) for x in v] for k,v in bl.items()},hits=[])
    for syi,vsi in enumerate(vocal):
        bars=bl.get(syi,[])
        hits=timesig.search_system_signatures(nl,staves,s,vsi,0,bars,W)
        for h in hits:
            h=dict(h); h['system']=syi; h['vsi']=int(vsi); out['hits'].append({k:(int(v) if isinstance(v,(np.integer,)) else v) for k,v in h.items()})
            st=staves[vsi]
            y0=int(st[0]-1.5*s); y1=int(st[-1]+1.5*s); x0=int(max(0,h['x_lo']-s)); x1=int(min(W,h['x_hi']+s))
            cv2.imwrite('/home/pyodide/out/hit-s%d-%s.png'%(syi,h['window']), img[y0:y1,x0:x1])
    # start window of every system for the picture
    for syi,vsi in enumerate(vocal):
        st=staves[vsi]; y0=int(st[0]-1.5*s); y1=int(st[-1]+1.5*s)
        bars=bl.get(syi,[]); xe=int(bars[0]) if bars else int(8*s)
        cv2.imwrite('/home/pyodide/out/start-s%d.png'%syi, img[y0:y1,0:min(W,xe+int(2*s))])
    out['metres']=[ (m['metre'] or {}) for m in ro['measures']][:20]
    out['printedAt']=[m.get('printedAt') for m in ro['measures']][:20]
    out['source']=[m.get('source') for m in ro['measures']][:20]
    return out
