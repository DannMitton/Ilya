import reader, numpy as np, cv2
def run_col(col, y0, ud, gap, lim):
    H=len(col); y=y0; last=0; white=0; n=0
    while 0<=y<H and n<lim:
        if col[y]>0: last=n+1; white=0
        else:
            white+=1
            if white>gap: break
        y+=ud; n+=1
    return last
def main(args,paths):
    out={}
    G=reader.read_page_geometry(dict(png=paths[0],page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m'))
    nl=G['nl_safe']; s=float(G['s']); img=G['img']
    hx,hy=3167,2350
    for g in (0.0,0.1,0.2,0.3,0.4,0.5,0.6,0.8,1.0):
        best=0;bc=None
        for dx in range(-int(1.05*s),int(1.05*s)+1):
            if abs(dx)<int(0.35*s): continue
            for ud in (-1,1):
                r=run_col(nl[:,hx+dx],hy,ud,int(round(g*s)),int(6*s))
                if r>best: best=r;bc=(dx,ud)
        out['g%.1f'%g]=(round(best/s,2),bc)
    # column ink profile along the stem column, rows hy-4s..hy
    dx,ud=out['g1.0'][1] if out['g1.0'][1] else (13,-1)
    col=nl[hy-int(4.2*s):hy+int(0.5*s),hx+dx]>0
    out['profile']=''.join('#' if c else '.' for c in col)
    cv2.imwrite('/home/pyodide/out/c39.png',cv2.resize(img[hy-int(4.5*s):hy+int(1.5*s),hx-int(2*s):hx+int(2*s)],None,fx=4,fy=4,interpolation=cv2.INTER_NEAREST))
    return out
