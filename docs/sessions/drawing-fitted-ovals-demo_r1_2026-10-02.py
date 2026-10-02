import cv2, numpy as np
D='/mnt/user-data/uploads/ilya-rewrite/apps/web/test-results/_desk-heads/'
im=cv2.imread(D+'tchsys-1-2.png'); part=im[1045:1560]
gray=cv2.cvtColor(part,cv2.COLOR_BGR2GRAY); b,g,r=cv2.split(part); red=(r>150)&(g<100)
bw=((gray<128)&(~red)).astype(np.uint8); H,W=bw.shape
rf=bw.sum(1)/W; rows=[i for i in range(H) if rf[i]>0.6]; cl=[]
for y in rows:
    if not cl or y-cl[-1][-1]>3: cl.append([y])
    else: cl[-1].append(y)
cy=[float(np.mean(c)) for c in cl]
for i in range(len(cy)-4):
    d=np.diff(cy[i:i+5])
    if d.max()-d.min()<6 and 22<d.mean()<36: staff=cy[i:i+5]; break
s=(staff[4]-staff[0])/4
x0,x1,y0,y1=395,700,95,300
k=cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(27,21))
op=cv2.morphologyEx(bw,cv2.MORPH_OPEN,k)
# grow each opened blob back inside the original ink, limited to a head-sized neighbourhood
n,lab,st,cen=cv2.connectedComponentsWithStats(op)
F=4
crop=(255-bw[y0:y1,x0:x1]*255).astype(np.uint8)
big=cv2.cvtColor(cv2.resize(crop,None,fx=F,fy=F,interpolation=cv2.INTER_NEAREST),cv2.COLOR_GRAY2BGR)
STEPS=['C','D','E','F#','G','A','B']
def name(p):
    idx=2+p; return ['C#','D','E','F#','G','A','B'][idx%7]+str(4+idx//7)
for ly in staff:
    cv2.line(big,(0,int((ly-y0)*F)),(big.shape[1],int((ly-y0)*F)),(200,120,0),1,cv2.LINE_AA)
res=[]
for j in range(1,n):
    cx,cyy=cen[j]
    if not (x0<cx<x1 and y0<cyy<y1): continue
    m=(lab==j).astype(np.uint8)
    m=cv2.dilate(m,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(7,7)))&bw
    cs,_=cv2.findContours(m,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)
    c=max(cs,key=cv2.contourArea)
    (ex,ey),(MA,ma),ang=cv2.fitEllipse(c)
    pos=(staff[4]-ey)/(s/2)
    res.append((ex,ey,MA,ma,ang,pos))
    cv2.ellipse(big,(((ex-x0)*F,(ey-y0)*F),(MA*F,ma*F),ang),(0,0,230),2,cv2.LINE_AA)
    cv2.circle(big,(int((ex-x0)*F),int((ey-y0)*F)),5,(0,0,230),-1,cv2.LINE_AA)
    off=pos-round(pos)
    txt=f"{name(round(pos))}  ({off:+.2f} step)"
    cv2.putText(big,txt,(int((ex-x0)*F)-110,int((ey-y0)*F)+95),cv2.FONT_HERSHEY_SIMPLEX,0.8,(0,0,200),2,cv2.LINE_AA)
big=cv2.copyMakeBorder(big,60,10,10,10,cv2.BORDER_CONSTANT,value=(255,255,255))
cv2.putText(big,"Each head as a fitted oval; its centre against the five traced lines gives the pitch",(14,40),cv2.FONT_HERSHEY_SIMPLEX,0.85,(40,40,40),2,cv2.LINE_AA)
cv2.imwrite('fitted-ovals-demo.png',big)
print('staff',[round(v,1) for v in staff],'s',round(s,2))
for r_ in sorted(res): print('centre (%.1f, %.1f) axes %.1f x %.1f px (%.2f x %.2f sp) tilt %.0f pos %.2f %s'%(r_[0],r_[1],r_[2],r_[3],r_[2]/s,r_[3]/s,r_[4],r_[5],name(round(r_[5]))))
