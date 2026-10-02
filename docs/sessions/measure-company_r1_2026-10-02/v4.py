import time, envelope, reader
def main(args,paths):
    out=[]
    for rep in range(2):
        for name,p in zip(args['names'],paths):
            r={}
            for tag,co in (('without',False),('with',True)):
                cfg=dict(png=p,page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m',company=co)
                t=time.time(); envelope.run(cfg,None); r[tag]=round(time.time()-t,1)
            r['page']=name; r['rep']=rep; out.append(r)
    return out
