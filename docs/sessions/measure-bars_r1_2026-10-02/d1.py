import json, os, time, cv2, numpy as np
import reader, envelope, beams
NAMES=['tch-1','tch-2','tch-3','lamm-1','lamm-2','Blamm','B01','B04','B05','B06']
TRUTH={'tch-1':[9,9,9],'tch-2':[9,8,9,9],'tch-3':[8,9,9,11],'lamm-1':[3,3,3],'lamm-2':[3,3,3],'Blamm':[3,3,3],'B01':[3,3,3],'B04':[3,3,3],'B05':[3,4,2],'B06':[3,3,2,2]}
def main(args,paths):
    res=[]
    for name,p in zip(NAMES,paths):
        t=time.time()
        cfg=dict(png=p,page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m')
        ro,_,_,G,rests,events=envelope.run(cfg,None)
        bl=G['barlines']
        per=[]
        order=G['voices']['order']; ti=0
        for pos,o in enumerate(order):
            if o is None: per.append(len(bl['tacet'][ti])); ti+=1
            else: per.append(len(bl['byVocal'][o]))
        r=dict(page=name,bars=per,truth=TRUTH[name],ok=(per==TRUTH[name]),witness=bl['witness'],staves=len(G['staves']),vocal=[int(v) for v in G['vocal']],fb=int(G['vocalFallbacks']),nmeasures=len(ro['measures']),notes=len([n for n in ro['verses'][0]['notes'] if n['type']=='note']),s=round(time.time()-t,1))
        res.append(r); print(json.dumps(r))
    return res
