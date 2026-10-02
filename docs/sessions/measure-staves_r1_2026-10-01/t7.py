import json, cv2, numpy as np
import reader
def main(args,paths):
    cfg=dict(png=paths[0],page=1,clef=('G',2),key=3,octaveChange=0,pieceId='m')
    G=reader.read_page_geometry(cfg)
    nl=G['nl']; staves=G['staves']; s=G['s']
    f,l=3,4; top=staves[f][0]; bot=staves[l][-1]
    num,lab,stats,cent=cv2.connectedComponentsWithStats(nl,8)
    out=dict(top=top,bot=bot,s=s,span=bot-top,sh=staves[f][-1]-staves[f][0],comps=[])
    for i in range(1,num):
        x,y,w,h,a=stats[i]
        if y<=bot and y+h>=top and h>2.5*s and w<2*s: out['comps'].append((int(x),int(y),int(w),int(h)))
    out['single']=reader.detect_barlines(nl,staves,[3],s); out['tacet']=reader.detect_tacet_barlines(nl,staves,[3],[4],s)
    return out
