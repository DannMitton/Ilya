import json, cv2, numpy as np
import reader, envelope, beams
def main(args,paths):
    cfg=dict(png=paths[0],page=1,clef=('G',2),key=3,octaveChange=0,pieceId='m')
    ro,_,_,G,rests,events=envelope.run(cfg,None)
    notes=ro['verses'][0]['notes']
    return dict(staves=len(G['staves']),vocal=[int(v) for v in G['vocal']],fb=int(G['vocalFallbacks']),order=G['voices']['order'],tacetRef=G['voices']['tacetRef'],
      measures=[(m['measureIndex'],m['metre'],m.get('integrity'),m.get('abstain')) for m in ro['measures']],
      tacet_events=[n for n in notes if n.get('tacet')], per_measure=[(m, len([n for n in notes if n['measureIndex']==m and n['type']=='note'])) for m in range(len(ro['measures']))])
