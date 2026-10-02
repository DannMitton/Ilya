# Build songs only. Reads a song's pages as the Worker's read_pages does (envelope.run, ctx chained),
# and records, for every global measure, its page, system, x range and the voice staff's y range.
import json, os, cv2, numpy as np
import envelope
os.makedirs('/home/pyodide/out',exist_ok=True)
def main(args,paths):
    out=[]; ctx=None; ids=[]
    song=args['song']
    for pn,(page_no,p) in enumerate(zip(args['pages'],paths),start=1):
        cfg=dict(png=p,page=pn,clef=('G',2),key=int(args['key']),octaveChange=0,pieceId='m')
        try:
            ro,ctx_next,msum,G,rests,events=envelope.run(cfg,ctx)
        except Exception as e:
            out.append(dict(scanPage=page_no,readPage=pn,error=str(e)[:200])); continue
        off=0 if ctx is None else ctx.get('measureIndexOffset',0)
        ctx=ctx_next
        ids+= [n['id'] for n in ro['verses'][0]['notes']]
        voices=G['voices']; order=voices['order']; bl=G['barlines']['byVocal']; tbl=G['barlines']['tacet']
        staves,s,vocal=G['staves'],float(G['s']),G['vocal']
        sysbars=[];ti=0
        for o in order:
            if o is None: sysbars.append(tbl.get(ti,[])); ti+=1
            else: sysbars.append(bl.get(o,[]))
        W=G['img'].shape[1]
        base=0; ms=[]
        for pos,(o,bars) in enumerate(zip(order,sysbars)):
            if o is None: base+=max(1,len(bars)); continue
            st=staves[vocal[o]]
            n=max(1,len(bars)); xs=[0]+[int(x) for x in bars]
            if len(bars)==0: xs=[0,W]
            for k in range(n):
                ms.append(dict(measureIndex=off+base+k,system=pos+1,x0=int(xs[k]),x1=int(xs[k+1]) if k+1<len(xs) else W,ytop=int(st[0]),ybot=int(st[-1])))
            base+=n
        cv2.imwrite('/home/pyodide/out/s%d-p%d.png'%(song,page_no),G['img'])
        out.append(dict(scanPage=page_no,readPage=pn,s=s,offset=off,measures=ms,notes=len(ro['verses'][0]['notes']),W=int(W)))
    return dict(pages=out,ids=ids)
