import json, os, cv2, numpy as np, copy
import reader, beams
def main(args,paths):
    G=reader.read_page_geometry(dict(png=paths[0],page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m'))
    s=G['s']; nl=G['nl_safe'].copy(); heads=G['heads']
    braced={vi for vi in range(len(G['vocal']))}
    h=[x for x in heads if not x.get('hollow') and x['sys']==1][2]
    st=beams.find_stem(nl,h['x'],h['y'],s); sgn=-1 if st['dir']<0 else 1
    out=dict(head=dict(x=int(h['x']),y=int(h['y']),L=h['L'],O=int(h['O'])),before=len(heads),results=[])
    for tag,scale in (('smaller (0.75 of the first)',0.75),('same size',1.0),('larger (1.25 of the first)',1.25)):
        n2=nl.copy(); y2=int(h['y'])+int(round(1.2*s))*sgn
        ax=(int(round(13*scale)),int(round(9*scale)))
        cv2.ellipse(n2,(int(h['x']),y2),ax,-20,0,360,255,-1)
        alt=dict(x=int(h['x']),y=y2,sys=h['sys'],score=h['score'],hollow=False)
        L,O=reader.position(alt,G['staves'],G['vocal'],G['topD'],s); alt['L']=L; alt['O']=O
        dbg=(reader._row_span(n2,int(h['x']),int(h['y']),s),reader._row_span(n2,alt['x'],alt['y'],s),float(s))
        res,alts=reader.merge_ossia(heads+[alt],n2,s,braced)
        out['results'].append(dict(kind=tag,events_before=len(heads),events_after=len(res),alternatives=alts,dbg=dbg,
            note_is=('the original head' if any(r['x']==h['x'] and r['y']==h['y'] for r in res) and not any(r['y']==y2 and r['x']==h['x'] for r in res) else 'the added head')))
    return out
