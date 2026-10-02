import json, os, time
import envelope
def main(args,paths):
    out=[]
    for name,p in zip(args['names'],paths):
        cfg=dict(png=p,page=1,clef=('G',2),key=int(args['keys'][name]),octaveChange=0,pieceId='m')
        if args.get('shape') is False: cfg['shape']=False
        ro,_,_,G,rests,events=envelope.run(cfg,None)
        out.append(dict(name=name,notes=[(n['id'],n['type'],n['duration'],(n.get('abstain') or {}).get('duration')) for n in ro['verses'][0]['notes']]))
    return out
