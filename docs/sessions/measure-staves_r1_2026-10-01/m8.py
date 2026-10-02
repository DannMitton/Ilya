import json, os, time, hashlib
import cv2, numpy as np
import reader, envelope, beams, substrate
def canon(o): return json.dumps(o, sort_keys=True, separators=(',',':'), default=str)
CF={'sunless-01':(('F',4),2,0),'sunless-02':(('G',2),2,-1),'sunless-03':(('G',2),0,-1),'sunless-04':(('G',2),2,0),'sunless-05':(('G',2),0,-1),'sunless-06':(('G',2),7,-1)}
def main(args, paths):
    names=sorted(os.listdir('/home/pyodide/fx'))
    if args.get('only'): names=[n for n in names if any(k in n for k in args['only'])]
    res=[]
    for n in names:
        p='/home/pyodide/fx/'+n
        piece=None
        for k,v in CF.items():
            if n.startswith('R_'+k): piece=v
        clef,key,oc=piece if piece else (('G',2),0,0)
        cfg=dict(png=p,page=1,clef=clef,key=key,octaveChange=oc,pieceId='m')
        beams.reset_walk_stats(); t=time.time(); r=dict(page=n)
        try:
            ro,_,_,G,rests,events=envelope.run(cfg,None)
            notes=ro['verses'][0]['notes']
            r.update(ok=True,digest=hashlib.sha256(canon(ro).encode()).hexdigest(),ids=[x['id'] for x in notes],nnotes=len([x for x in notes if x['type']=='note']),nrests=len([x for x in notes if x['type']=='rest']),
                     staves=len(G['staves']),vocal=[int(v) for v in G['vocal']],fb=int(G.get('vocalFallbacks',0)),nmeasures=len(ro['measures']),
                     tacet=len(G['voices']['tacetRef']),signs=G['voices']['signs'],trace=dict(G['trace']),walk=dict(beams.WALK_STATS),
                     heads_per_sys={str(k):v for k,v in __import__('collections').Counter(h['sys'] for h in G['heads']).items()})
        except Exception as e:
            r.update(ok=False,err=repr(e)[:300],trace=dict(reader.TRACE_REPORT),walk=dict(beams.WALK_STATS))
        r['s']=round(time.time()-t,1)
        res.append(r)
        print(json.dumps({k:v for k,v in r.items() if k not in('ids','digest')}))
    return res
