import cv2, numpy as np
D='/mnt/user-data/uploads/ilya-rewrite/apps/web/test-results/_desk-heads/'
im=cv2.imread(D+'tchsys-1-2.png')
part=im[1045:1560]
gray=cv2.cvtColor(part,cv2.COLOR_BGR2GRAY)
b,g,r=cv2.split(part); red=(r>150)&(g<100)
bw=((gray<128)&(~red)).astype(np.uint8)
H,W=bw.shape
rf=bw.sum(1)/W
rows=[i for i in range(H) if rf[i]>0.6]
cl=[]
for y in rows:
    if not cl or y-cl[-1][-1]>3: cl.append([y])
    else: cl[-1].append(y)
cy=[np.mean(c) for c in cl]
# first five equally spaced
for i in range(len(cy)-4):
    d=np.diff(cy[i:i+5])
    if d.max()-d.min()<6 and 22<d.mean()<36: staff=cl[i:i+5]; break
s=(np.mean(staff[4])-np.mean(staff[0]))/4
t=np.mean([len(c) for c in staff])
print('staff space',s,'line thickness',t,[ (c[0],c[-1]) for c in staff])
linerows=np.zeros(H,bool)
for c in staff:
    for y in range(c[0]-1,c[-1]+2): linerows[y]=True
hk=cv2.getStructuringElement(cv2.MORPH_RECT,(int(1.7*s),1))
opened=cv2.morphologyEx(bw,cv2.MORPH_OPEN,hk)
# vertical run length through each pixel
vr=np.zeros_like(bw,dtype=np.int32)
for x in range(W):
    col=bw[:,x]; y=0
    while y<H:
        if col[y]:
            y2=y
            while y2<H and col[y2]: y2+=1
            vr[y:y2,x]=y2-y; y=y2
        else: y+=1
mask=(opened>0)&linerows[:,None]&(vr<=2.2*t)
nl=bw&(~mask)
x0,x1,y0,y1=395,700,95,300
def panel(a,title):
    c=(255-a[y0:y1,x0:x1]*255).astype(np.uint8)
    c=cv2.resize(c,None,fx=3,fy=3,interpolation=cv2.INTER_NEAREST)
    c=cv2.cvtColor(c,cv2.COLOR_GRAY2BGR)
    c=cv2.copyMakeBorder(c,70,10,10,10,cv2.BORDER_CONSTANT,value=(255,255,255))
    cv2.putText(c,title,(14,46),cv2.FONT_HERSHEY_SIMPLEX,0.95,(40,40,40),2,cv2.LINE_AA)
    return c
out=np.hstack([panel(bw,'1. The scan'),panel(mask.astype(np.uint8),'2. The stave mask'),panel(nl,'3. Scan minus mask')])
cv2.imwrite('stave-mask-demo.png',out); print(out.shape)
