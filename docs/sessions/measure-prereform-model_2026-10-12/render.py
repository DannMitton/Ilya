# Step 4: render each line with text2image, then roughen it. Usage: render.py <lines.json> <outdir> <font|mix> <seed> [first N]
# lines.json: [[id, text], ...]. Writes <outdir>/<id>.png and <id>.gt.txt (the ground truth, spacing normalised).
import sys, os, re, json, random, subprocess, tempfile, hashlib
import numpy as np, cv2
from PIL import Image
from multiprocessing import Pool
HOME=os.path.expanduser('~'); ROOT=HOME+'/Downloads/_desk-prereform'
ENV=dict(os.environ, FONTCONFIG_FILE=ROOT+'/fonts.conf', PANGOCAIRO_BACKEND='fc', TESSDATA_PREFIX='/opt/homebrew/share/tessdata')
TRAIN_FONTS=['Old Standard TT','PT Serif','Gentium Book Plus','Spectral','Tinos']
V=set('аеёиіоуыэюяѣАЕЁИІОУЫЭЮЯѢ'); SIGN=set('йьъЙЬЪ')
def syl(word):
    m=re.match(r'^(\W*)(.*?)(\W*)$',word); pre,core,post=m.groups()
    idx=[i for i,c in enumerate(core) if c in V]
    if len(idx)<2: return [word]
    cuts=[]
    for a,b in zip(idx,idx[1:]):
        j=a+1
        while j<b and core[j] in SIGN: j+=1
        k=b-j
        c=j if k<=1 else j+1
        if c<b and core[c] in 'ьъ': c+=1
        cuts.append(c)
    parts=[];s=0
    for c in cuts: parts.append(core[s:c]); s=c
    parts.append(core[s:])
    parts[0]=pre+parts[0]; parts[-1]+=post
    return parts
def make(text,rng):
    """returns (gt, render_text)"""
    words=text.split()
    if rng.random()<0.5:
        toks=[]
        for w in words:
            p=syl(w)
            for i,s in enumerate(p):
                toks.append(s)
                if i<len(p)-1: toks.append('-')
        gt=' '.join(toks)
        if rng.random()<0.2: gt='- '+gt
        if rng.random()<0.25: gt=gt+' -'
        # render: wide gaps, as the underlay is set under its notes
        parts=gt.split(' ')
        rt=''.join(p+' '*rng.randint(2,9) for p in parts).rstrip()
        return gt, rt
    gt=' '.join(words)
    rt=''.join(w+' '*rng.randint(1,4) for w in gt.split(' ')).rstrip()
    return gt, rt
def rough(img,rng):
    a=np.array(img.convert('L')).astype(np.float32)
    ys,xs=np.where(a<128)
    if len(ys)==0: return None
    a=a[ys.min():ys.max()+1, xs.min():xs.max()+1]
    h,w=a.shape
    if h>175: return None   # the line wrapped inside the page
    sc=rng.uniform(0.5,0.7); a=cv2.resize(a,(max(8,int(w*sc)),max(8,int(h*sc))),interpolation=cv2.INTER_AREA)
    h,w=a.shape
    ink=255-a  # 0..255 ink
    if rng.random()<0.5:
        k=np.ones((2,2),np.uint8); ink=cv2.dilate(ink,k) if rng.random()<0.7 else cv2.erode(ink,k)
    ink=cv2.GaussianBlur(ink,(0,0),rng.uniform(0.4,1.1))
    padv=int(h*rng.uniform(0.15,0.4)); padh=rng.randint(15,90)
    ink=cv2.copyMakeBorder(ink,padv,padv,padh,padh,cv2.BORDER_CONSTANT,value=0)
    H,W=ink.shape
    M=cv2.getRotationMatrix2D((W/2,H/2),rng.uniform(-0.5,0.5),1.0)
    ink=cv2.warpAffine(ink,M,(W,H),flags=cv2.INTER_LINEAR,borderValue=0)
    # artefacts of a cut row: a barline stub, a slur remnant, a stray blob
    if rng.random()<0.3:
        x=max(0,rng.choice([rng.randint(0,padh),W-rng.randint(1,padh)])); x2=x+rng.randint(1,3); ink[:, x:x2]=np.maximum(ink[:, x:x2],rng.randint(120,230))
    if rng.random()<0.2:
        x=rng.randint(0,W-20); y=rng.choice([0,H-4]); ink[y:y+rng.randint(2,4),x:x+rng.randint(8,18)]=rng.randint(100,220)
    paper=rng.uniform(190,252); inkc=rng.uniform(5,70)
    out=paper-(ink/255.0)*(paper-inkc)
    lf=cv2.resize(np.random.RandomState(rng.randint(0,2**31)).randn(max(2,H//20),max(2,W//40)).astype(np.float32),(W,H))
    out=out*(1+0.025*lf)+np.random.RandomState(rng.randint(0,2**31)).randn(H,W)*rng.uniform(2,9)
    out=np.clip(out,0,255).astype(np.uint8)
    im=Image.fromarray(out)
    if rng.random()<0.4:
        import io; b=io.BytesIO(); im.save(b,'JPEG',quality=rng.randint(40,85)); b.seek(0); im=Image.open(b).convert('L')
    return im
def job(a):
    id_,text,font,seed,outdir=a
    rng=random.Random(seed)
    f=font if font!='mix' else rng.choice(TRAIN_FONTS)
    gt,rt=make(text,rng)
    with tempfile.TemporaryDirectory() as td:
        open(td+'/t.txt','w',encoding='utf8').write(rt+'\n')
        r=subprocess.run(['text2image','--text='+td+'/t.txt','--outputbase='+td+'/o','--font='+f,'--fonts_dir='+ROOT+'/fonts','--ptsize=24','--xsize=9000','--ysize=300','--margin=20','--degrade_image=false','--distort_image=false','--ligatures=false','--exposure=0','--resolution=300'],capture_output=True,text=True,env=ENV)
        if not os.path.exists(td+'/o.tif'): return (id_,'fail',r.stderr[-200:])
        im=Image.open(td+'/o.tif')
        w,h=im.size
        # a line wider than the page spills onto page 2; keep only lines that fit
        if os.path.exists(td+'/o.tif') and getattr(im,'n_frames',1)>1: return (id_,'toolong','')
        out=rough(im,rng)
    if out is None: return (id_,'blank','')
    out.save(f'{outdir}/{id_}.png'); open(f'{outdir}/{id_}.gt.txt','w',encoding='utf8').write(gt+'\n')
    return (id_,'ok',f)
if __name__=='__main__':
    lines=json.load(open(sys.argv[1])); outdir=sys.argv[2]; font=sys.argv[3]; seed=int(sys.argv[4])
    n=int(sys.argv[5]) if len(sys.argv)>5 else len(lines)
    os.makedirs(outdir,exist_ok=True)
    jobs=[(i,t,font,seed*1000003+k,outdir) for k,(i,t) in enumerate(lines[:n])]
    res=[]
    with Pool(8) as p:
        for k,r in enumerate(p.imap_unordered(job,jobs,chunksize=8)):
            res.append(r)
            if k%1000==0: print(k,flush=True)
    import collections; print(collections.Counter(r[1] for r in res)); json.dump(res,open(outdir+'/_render_log.json','w'))
