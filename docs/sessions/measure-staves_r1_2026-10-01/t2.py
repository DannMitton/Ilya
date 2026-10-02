import json, os, time, cv2, numpy as np
import reader, envelope, beams
os.makedirs('/home/pyodide/out',exist_ok=True)
def main(args, paths):
    res=[]
    reader.STRAIGHTEN_MODE=args['mode']
    p=paths[0]
    cfg=dict(png=p,page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m')
    ro,_,_,G,rests,events=envelope.run(cfg,None)
    heads=G['heads']; per={}
    for h in heads: per[h['sys']]=per.get(h['sys'],0)+1
    ev={}
    for e in events:
        if e['kind']=='note': ev[e['sys']]=ev.get(e['sys'],0)+1
    img=G['img']; s=G['s']; st=G['staves']
    for si,v in enumerate(G['vocal']):
        a=int(st[v][0]-3*s); b=int(st[v][4]+4*s)
        crop=cv2.cvtColor(img[a:b,:],cv2.COLOR_GRAY2BGR)
        for e in [h for h in heads if h['sys']==si]:
            cv2.circle(crop,(int(e['x']),int(e['y'])-a),int(s*0.7),(0,0,255),3)
        cv2.imwrite('/home/pyodide/out/sys%d.png'%si, cv2.resize(crop,None,fx=0.45,fy=0.45,interpolation=cv2.INTER_AREA))
    return dict(heads_per_sys=per, notes_per_sys=ev, bars=[len(v) for v in reader.detect_barlines(G['nl'],G['staves'],G['vocal'],G['s']).values()])
