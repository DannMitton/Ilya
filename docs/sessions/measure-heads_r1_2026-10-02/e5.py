import json, os, cv2, numpy as np
import reader, envelope
def main(args,paths):
    out=[]
    for p in paths:
        img=cv2.imread(p,0)
        # the OLD reader (8fdfcde) on the page as printed fails at the staff stage; feed it the prototype images saved by the caller
        try:
            ro,_,_,G,rests,events=envelope.run(dict(png=p,page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m'),None)
            notes=[n for n in ro['verses'][0]['notes'] if n['type']=='note']
            out.append(dict(p=p,notes=len(notes),heads=len(G['heads']),hollow=sum(1 for h in G['heads'] if h.get('hollow')),staves=len(G['staves']),vocal=[int(v) for v in G['vocal']]))
        except Exception as e: out.append(dict(p=p,err=repr(e)[:200]))
    return out
