"""N.135 stage 2a step 3: attributes the differences between frameRow and the OpenCV oracle of xcheck_frame.py. (1) the rotation centre convention, (2) cv2.resize INTER_CUBIC against frameRow's cubic, (3) the three rows whose chosen angle differs, by their projection variances. Reads the oracle from xcheck_frame.py. `rot_float` is a copy of frameRow's turn as first written, about the exact centre ((w-1)/2, (h-1)/2); as committed, frameRow turns about (w/2, h/2), the OpenCV idiom, and lines 1 to 3 of the output are what that change was made for."""
import sys, json, subprocess, tempfile, os
sys.argv=['x']; HERE=os.path.dirname(os.path.abspath(__file__))
src=open(f'{HERE}/xcheck_frame.py').read().split('crops = [make(i)')[0]
exec(src)
crops=[make(i) for i in range(200)]
def rot(g,a,c,fill):
    h,w=g.shape
    return cv2.warpAffine(g,cv2.getRotationMatrix2D(c,a,1.0),(w,h),flags=cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT,borderValue=int(fill))
def frac(a,b): return float((np.abs(a.astype(int)-b.astype(int))>1).mean())
# a float64 numpy bilinear turn about the exact centre, as frameRow does
def rot_float(g,a,fill):
    h,w=g.shape; r=np.radians(a); c,s=np.cos(r),np.sin(r); cx,cy=(w-1)/2,(h-1)/2
    Y,X=np.mgrid[0:h,0:w]; dx,dy=X-cx,Y-cy; sx=cx+dx*c-dy*s; sy=cy+dx*s+dy*c
    x0=np.floor(sx).astype(int); y0=np.floor(sy).astype(int); fx=sx-x0; fy=sy-y0
    def at(xx,yy):
        ok=(xx>=0)&(xx<w)&(yy>=0)&(yy<h); v=np.full(xx.shape,float(fill)); v[ok]=g[yy[ok],xx[ok]]; return v
    v=(at(x0,y0)*(1-fx)+at(x0+1,y0)*fx)*(1-fy)+(at(x0,y0+1)*(1-fx)+at(x0+1,y0+1)*fx)*fy
    return np.clip(np.round(v),0,255).astype(np.uint8)
A=[];B=[];C=[]
for i,g in enumerate(crops):
    if not (g<128).any(): continue
    h,w=g.shape; paper=int(np.argmax(np.bincount(g.ravel(),minlength=256))); a=1.3
    c1=rot(g,a,(w/2,h/2),paper); c2=rot(g,a,((w-1)/2,(h-1)/2),paper); f=rot_float(g,a,paper)
    A.append(frac(c1,c2)); B.append(frac(c2,f)); C.append(frac(c1,f))
print('rotation, 1.3 degrees, 192 rows with ink: share of pixels differing by more than 1 grey level (median / mean / max)')
for n,v in (('cv2 centre (w/2,h/2) against cv2 centre ((w-1)/2,(h-1)/2)',A),('cv2 exact centre against the float turn used by frameRow',B),('cv2 (w/2,h/2) against frameRow float',C)):
    print(f'  {n}: {np.median(v):.4f} / {np.mean(v):.4f} / {np.max(v):.4f}')
# resize
def cubic(g,f):
    h,w=g.shape; nw,nh=int(round(w*f)),int(round(h*f)); A_=-0.75
    def wts(u):
        c0=((A_*(u+1)-5*A_)*(u+1)+8*A_)*(u+1)-4*A_; c1=((A_+2)*u-(A_+3))*u*u+1; c2=((A_+2)*(1-u)-(A_+3))*(1-u)*(1-u)+1; return c0,c1,c2,1-c0-c1-c2
    def axis(n,size):
        i=np.arange(n); fx=(i+0.5)/f-0.5; s=np.floor(fx).astype(int); u=fx-s; W=np.stack(wts(u),1); idx=np.clip(np.stack([s-1,s,s+1,s+2],1),0,size-1); return idx,W
    ix,wx=axis(nw,w); iy,wy=axis(nh,h); g=g.astype(float)
    wide=sum(g[:,ix[:,k]]*wx[:,k] for k in range(4))
    out=sum(wide[iy[:,k],:]*wy[:,k][:,None] for k in range(4))
    return np.clip(np.round(out),0,255).astype(np.uint8)
R=[]
for g in crops[:60]:
    f=1.0+np.random.RandomState(1).uniform(0,0.8)
    R.append(frac(cv2.resize(g,None,fx=f,fy=f,interpolation=cv2.INTER_CUBIC),cubic(g,f)))
print(f'cubic resize, factor 1.0 to 1.8: cv2 INTER_CUBIC against frameRow float cubic: median {np.median(R):.4f}, mean {np.mean(R):.4f}, max {np.max(R):.4f}')

print()
def var_cv(mask,a):
    mh,w=mask.shape
    r=mask if a==0 else cv2.warpAffine(mask,cv2.getRotationMatrix2D((w/2,mh/2),a,1.0),(w,mh),flags=cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT,borderValue=0)
    return float(r.astype(float).sum(axis=1).var())/255**2
def var_float(mask,a):
    mh,w=mask.shape; m=(mask>0).astype(float)
    if a==0: return float(m.sum(axis=1).var())
    r=np.radians(a); c,s=np.cos(r),np.sin(r); cx,cy=w/2,mh/2; Y,X=np.mgrid[0:mh,0:w]; dx,dy=X-cx,Y-cy; sx=cx+dx*c-dy*s; sy=cy+dx*s+dy*c
    x0=np.floor(sx).astype(int); y0=np.floor(sy).astype(int); fx=sx-x0; fy=sy-y0
    def at(xx,yy):
        ok=(xx>=0)&(xx<w)&(yy>=0)&(yy<mh); v=np.zeros(xx.shape); v[ok]=m[yy[ok],xx[ok]]; return v
    v=(at(x0,y0)*(1-fx)+at(x0+1,y0)*fx)*(1-fy)+(at(x0,y0+1)*(1-fx)+at(x0+1,y0+1)*fx)*fy
    return float(v.sum(axis=1).var())
for i,(ao,at_) in ((139,(1.7,1.6)),(181,(0.5,0.0)),(188,(1.0,1.1))):
    g=crops[i]; mask=np.pad((g<128).astype(np.uint8)*255,((120,120),(0,0)))
    vc={a:var_cv(mask,a) for a in (ao,at_)}; vf={a:var_float(mask,a) for a in (ao,at_)}
    print(f'row {i}: variance at oracle angle {ao} and at frameRow angle {at_}: cv2 {vc[ao]:.1f} vs {vc[at_]:.1f} (oracle ahead by {vc[ao]/vc[at_]-1:.2e} relative); float {vf[ao]:.1f} vs {vf[at_]:.1f} (frameRow ahead by {vf[at_]/vf[ao]-1:.2e} relative)')
