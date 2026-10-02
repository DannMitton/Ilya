import json, os, time, cv2, numpy as np
import reader, envelope, beams
def main(args, paths):
    res=[]
    for mode in args.get('modes',['band','interp']):
        reader.STRAIGHTEN_MODE=mode
        for i,p in enumerate(paths):
            beams.reset_walk_stats()
            cfg=dict(png=p,page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m')
            r=dict(mode=mode,page=i+1)
            t=time.time()
            try:
                ro,_,_,G,rests,_e=envelope.run(cfg,None)
                notes=ro['verses'][0]['notes']
                r.update(ok=True,staves=len(G['staves']),vocal=[int(v) for v in G['vocal']],fb=int(G.get('vocalFallbacks',0)),notes=len([n for n in notes if n['type']=='note']),rests=len([n for n in notes if n['type']=='rest']),measures=len(ro['measures']),trace={k:v for k,v in G['trace'].items()},walk=dict(beams.WALK_STATS),persys=[sum(1 for n in notes if n['type']=='note' and n['measureIndex']==m) for m in range(0)])
            except Exception as e:
                import traceback
                r.update(ok=False,err=repr(e)[:300], trace=dict(reader.TRACE_REPORT), walk=dict(beams.WALK_STATS))
            r['s']=round(time.time()-t,1)
            print(json.dumps(r)); res.append(r)
    return res
