import json, os, time, cv2, numpy as np
import reader, envelope
os.makedirs('/home/pyodide/out',exist_ok=True)
def main(args,paths):
    out=[]
    for name,p in zip(args['names'],paths):
        cfg=dict(png=p,page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m')
        t=time.time()
        ro,_,_,G,rests,events=envelope.run(cfg,None)
        dt=time.time()-t
        bl=G['barlines']['byVocal']; W=G['img'].shape[1]
        heads=[]
        for h in G['heads']:
            b=[0]+list(bl.get(h['sys'],[]))+[W]
            bar=max(0,sum(1 for x in b[1:-1] if x<=h['x']))
            heads.append(dict(x=int(h['x']),y=int(h['y']),sys=int(h['sys']),bar=bar,hollow=bool(h.get('hollow')),bc=bool(h.get('byCompany'))))
        out.append(dict(page=name,secs=round(dt,1),heads=heads,byCompany=G['byCompany'],hooks=len(G['hooks']),nmeasures=len(ro['measures'])))
        print(name,'ok',round(dt,1),len(heads),len(G['byCompany']))
    return out
