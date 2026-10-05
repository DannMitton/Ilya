import json, sys, cv2, numpy as np
from PIL import Image, ImageDraw, ImageFont
from lyricline import systems, find_line
from fractions import Fraction as F
FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; FR='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
LEN={F(1,8):'♪',F(1,4):'♩',F(3,8):'♩.',F(1,16):'♬',F(3,16):'♪.'}
COL={'read':(20,20,20),'deduced':(0,90,170),'unsure':(190,90,0)}
def panel(ev,page,sysno):
    im=cv2.imread(f'tch-{page}.png',0); H,W=im.shape
    sd=systems(f'main/tch-{page}.txt',W,H)[sysno-1]; ln=find_line(im,sd); s=sd['s']
    y0=int(sd['vt']-3.0*s); y1=int((ln['bot'] if ln else sd['vb']+3*s)+0.2*s); x0=int(max(0,sd['x0']-2*s)); x1=int(min(W,sd['x1']+1.5*s))
    crop=im[y0:y1,x0:x1]; ch,cw=crop.shape
    f1=ImageFont.truetype(FB,int(1.05*s)); f2=ImageFont.truetype(FR,int(0.95*s)); f3=ImageFont.truetype(FB,int(1.2*s))
    rows=int(8.2*s); canvas=Image.new('RGB',(cw,ch+rows),(255,255,255)); canvas.paste(Image.fromarray(crop).convert('RGB'),(0,0))
    d=ImageDraw.Draw(canvas); top=ch; d.line([(0,top+2),(cw,top+2)],fill=(170,170,170),width=2)
    ya=top+int(0.7*s); yb=ya+int(1.5*s); yc=yb+int(1.7*s); lastx=[-1e9,-1e9]
    for e in ev:
        if e['page']!=page or e['y'] is None or not (sd['vt']-3*s<=e['y']<=sd['vb']+3*s): continue
        x=e['x']-x0
        if e['type']=='rest': d.text((x,yb),'–',font=f2,fill=(150,150,150),anchor='ma'); continue
        d.line([(x,ch-int(0.3*s)),(x,ya-int(0.2*s))],fill=(205,205,205),width=1)
        d.text((x,ya),e['name'],font=f1,fill=(20,20,20),anchor='ma')
        d.text((x,yb),LEN.get(F(e['dur']),e['dur']),font=f2,fill=(70,70,70),anchor='ma')
        if e.get('syl'):
            st=e['state']; txt=''.join(l+' ' for l in e.get('lean',[]))+e['syl']+(' ?' if st=='unsure' else '')
        elif e.get('tieStop'): st='read'; txt='(tie)'
        else: st='unsure'; txt='?'
        bb=d.textbbox((x,yc),txt,font=f3,anchor='ma'); row=0
        if bb[0]<lastx[0]+int(0.3*s): row=1
        y=yc+row*int(1.9*s); bb=d.textbbox((x,y),txt,font=f3,anchor='ma'); lastx[row]=bb[2]
        if row==1: d.line([(x,yc-int(0.2*s)),(x,y-int(0.1*s))],fill=(205,205,205),width=1)
        d.text((x,y),txt,font=f3,fill=COL[st],anchor='ma')
        if st=='unsure': d.rectangle([bb[0]-5,bb[1]-5,bb[2]+5,bb[3]+5],outline=COL[st],width=3)
        elif st=='deduced': d.line([(bb[0],bb[3]+5),(bb[2],bb[3]+5)],fill=COL[st],width=3)
    return canvas
def sheet(tag,page,out,scale=0.55):
    ev=json.load(open(f'asm-{tag}.seated.json')); im=cv2.imread(f'tch-{page}.png',0); H,W=im.shape
    n=len(systems(f'main/tch-{page}.txt',W,H)); ps=[panel(ev,page,i+1) for i in range(n)]
    w=max(p.width for p in ps); head=110
    canvas=Image.new('RGB',(w,head+sum(p.height for p in ps)+30*(n-1)),(255,255,255)); d=ImageDraw.Draw(canvas)
    fh=ImageFont.truetype(FB,40); fs=ImageFont.truetype(FR,32)
    d.text((20,10),f"Tchaikovsky, Op. 38 No. 3, Jurgenson 1878, page {page}: the scan, and under each system what the assembly read",font=fh,fill=(20,20,20))
    d.text((20,62),"black = read as printed      blue, underlined = a word the dictionary repaired or divided      orange box, ? = unsure, for the singer to confirm",font=fs,fill=(70,70,70))
    y=head
    for p in ps: canvas.paste(p,(0,y)); y+=p.height+30
    canvas=canvas.resize((int(canvas.width*scale),int(canvas.height*scale)),Image.LANCZOS); canvas.save(out); print(out,canvas.size)
if __name__=='__main__': sheet(sys.argv[1],int(sys.argv[2]),sys.argv[3])
