import json, os, cv2, numpy as np
import reader, envelope, beams
os.makedirs('/home/pyodide/out',exist_ok=True)
def run(path):
    ro,_,_,G,rests,events=envelope.run(dict(png=path,page=1,clef=('G',2),key=0,octaveChange=0,pieceId='m'),None)
    per={}
    for n in ro['verses'][0]['notes']:
        if n['type']=='note': per[n['measureIndex']]=per.get(n['measureIndex'],0)+1
    return ro,G,per
def main(args,paths):
    out={}
    ro0,G0,per0=run(paths[0])
    img=G0['img'].copy(); s=G0['s']
    # a filled head on a braced system with a stem, alone in its bar region
    cands=[h for h in G0['heads'] if not h.get('hollow') and h['sys']==1]
    h=cands[2]
    st=beams.find_stem(G0['nl_safe'],h['x'],h['y'],s)
    out['head']=dict(x=int(h['x']),y=int(h['y']),stem=None if st is None else dict(dir=int(st['dir']),x=int(st['x'])),L=h['L'],O=int(h['O']))
    # the second head sits one staff space towards the stem's free end, on the same stem
    fn='/home/pyodide/out/ctrl.png'; cv2.imwrite(fn,img); ro,G,per=run(fn)
    out['control']=dict(per_equal=(per==per0),events=sum(per.values()))
    sgn=(-1 if st['dir']<0 else 1)
    out['trials']=[]
    for dyf in (1.0,1.25,1.5,2.0):
        for tag,scale in (('smaller',0.75),('same',1.0)):
            im=img.copy(); dy=int(round(dyf*s))*sgn
            ax=(int(round(0.675*s*scale)),int(round(0.46*s*scale)))
            cv2.ellipse(im,(int(h['x']),int(h['y'])+dy),ax,-20,0,360,0,-1)
            fn='/home/pyodide/out/ossia-%s-%s.png'%(tag,dyf); cv2.imwrite(fn,im)
            ro,G,per=run(fn)
            out['trials'].append(dict(dy=dyf,kind=tag,per_equal_to_control=(per==out['control'] and False) or None,events=sum(per.values()),alternatives=G['alternatives'],heads=len(G['heads'])))
    out['baseline_alternatives']=G0['alternatives']
    return out
