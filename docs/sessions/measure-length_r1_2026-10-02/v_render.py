import json, os
import envelope
def main(args,paths):
    out=[]
    CF={'sunless-01':(('F',4),2,0),'sunless-02':(('G',2),2,-1),'sunless-03':(('G',2),0,-1),'sunless-04':(('G',2),2,0),'sunless-05':(('G',2),0,-1),'sunless-06':(('G',2),7,-1)}
    for name,p in zip(args['names'],paths):
        clef,key,oc=(('G',2),0,0)
        for k,v in CF.items():
            if k in name: clef,key,oc=v
        r={}
        for tag,flag in (('on',True),('off',False)):
            cfg=dict(png=p,page=1,clef=clef,key=key,octaveChange=oc,pieceId='m')
            if not flag: cfg['shape']=False
            try:
                ro,_,_,G,rests,events=envelope.run(cfg,None)
                r[tag]=json.dumps(ro['verses'][0]['notes'],sort_keys=True,default=str)
            except Exception as e: r[tag]='ERR '+str(e)[:60]
        out.append(dict(name=name,same=r['on']==r['off'],n=len(r['on']),err=r['on'][:4]=='ERR'))
    return out
