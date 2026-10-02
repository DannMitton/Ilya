import json,cv2,numpy as np,sys
from join import joined
exc=json.load(open(sys.argv[1])); tag=sys.argv[2]
J={n:{r['id']:r for r in joined(n)} for n in (1,4,5,6,7)}
tiles=[]
for k,e in enumerate(exc):
    n,i,c,s_,cc,t,rd=e[:7]
    h=J[n][i]['head']; im=cv2.imread('images.files/s%d-p%d.png'%(n,h['page']),0); s=h['s']; st=h['stem']
    x=st['x']; tip=st['tip']; d=st['dir']
    ya=tip-d*(-1.0*s); yb=tip-d*(3.4*s); y0=int(min(ya,yb)); y1=int(max(ya,yb))
    x0=int(x-1.7*s); x1=int(x+1.7*s)
    cr=im[max(0,y0):y1,max(0,x0):x1]
    cr=cv2.cvtColor(cv2.resize(cr,(220,260)),cv2.COLOR_GRAY2BGR)
    cv2.putText(cr,'%d s%d %s'%(k,n,i),(2,12),cv2.FONT_HERSHEY_SIMPLEX,0.4,(0,0,255),1)
    cv2.putText(cr,'print %s m=%s'%(c,s_),(2,254),cv2.FONT_HERSHEY_SIMPLEX,0.4,(200,0,0),1)
    tiles.append(cr)
for k in range(0,len(tiles),18):
    part=tiles[k:k+18]
    while len(part)%6: part.append(np.full((260,220,3),255,np.uint8))
    cv2.imwrite('crops.files/%s-%d.png'%(tag,k//18+1),np.vstack([np.hstack(part[i:i+6]) for i in range(0,len(part),6)]))
print(len(tiles))
