import reader, numpy as np, cv2
def main(args,paths):
    out={}
    for pg,p,(px,py) in zip(args['names'],paths,args['pts']):
        G=reader.read_page_geometry(dict(png=p,page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m'))
        img,nl,staves,s,vocal=G['img'],G['nl_safe'],G['staves'],float(G['s']),G['vocal']
        pool=reader.detect_heads(img,staves,vocal,s,thr=0.80)
        near=[h for h in pool if abs(h['x']-px)<2*s and abs(h['y']-py)<2*s]
        bw=(img<128).astype(np.float32)
        kw,kh=int(round(1.35*s)),int(round(0.92*s))
        ker=cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(kw|1,kh|1)).astype(np.float32); ker/=ker.sum()
        resp=cv2.filter2D(bw,-1,ker)
        o=[]
        for h in near:
            hx,hy=int(h['x']),int(h['y']); v=resp[hy,hx]; r=int(s)
            ys,xs=np.where(np.abs(resp[hy-r:hy+r+1,hx-r:hx+r+1]-v)<1e-5)
            pts=[(int(x+hx-r),int(y+hy-r)) for y,x in zip(ys,xs)]
            ems=[(g['x'],g['y'],bool(g.get('hollow'))) for g in G['heads'] if g['sys']==h['sys'] and (g['x']-hx)**2+(g['y']-hy)**2<(1.6*s)**2]
            o.append(dict(point=(hx,hy),resp=float(v),n=len(pts),heads_near=ems,
                 at_point=reader.company_measures(nl,hx,hy,s),
                 plateau=[(x,y,reader.company_measures(nl,x,y,s)) for x,y in pts[::max(1,len(pts)//12)][:13]]))
        out[pg]=dict(s=s,pool=o)
    return out
