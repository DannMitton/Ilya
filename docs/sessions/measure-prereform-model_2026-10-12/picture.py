# Step 4: six rendered, roughened lines beside six real crops from S, T, K, and M, as one PNG (the only image kept in the tree).
import os, glob, json
from PIL import Image, ImageDraw
H=os.path.expanduser('~/Downloads/_desk-prereform')
real=[('S','S-1-s2-r2'),('T','T-1-s2-r1'),('K','K-1-s1-r2'),('M','M-1-s1-r1'),('S','S-2-s1-r2'),('T','T-1-s2-r1')]
real=[f'{H}/songs/crops/{n}.png' for _,n in real[:5]]+[f'{H}/songs/crops/T-3-s1-r1.png']
ren=[f'{H}/tesstrain/data/rus_prereform-ground-truth/tr{i:05d}.png' for i in (1,2,3,4,5,6)]
W=1500; rows=[]
def fit(p,left):
    im=Image.open(p).convert('L'); w,h=im.size
    if left: im=im.crop((0,0,min(w,1200),h))
    else: im=im.crop((0,0,min(w,1200),h))
    s=min(1.0,W/ im.size[0]); return im.resize((int(im.size[0]*s),int(im.size[1]*s)))
sheet=[]
d=Image.new('L',(W,1600),255); dr=ImageDraw.Draw(d); y=10
dr.text((10,y),'Rendered and roughened training lines (left column of rows) beside crops of S, T, K, and M (rows below each)',fill=0); y+=24
for a,b in zip(ren,real):
    for lab,p in (('rendered',a),('crop',b)):
        im=fit(p,True); d.paste(im,(10,y+14)); dr.text((10,y),lab,fill=90); y+=im.size[1]+20
d=d.crop((0,0,W,y+6)); d.save('samples-beside-crops.png',optimize=True); print(d.size, os.path.getsize('samples-beside-crops.png'))
