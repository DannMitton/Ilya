# dev loop only (native numpy 2.x, NOT the pinned stack): fit heads on a render page from jittered SVG positions, to debug fitted.py's logic
import sys, math, numpy as np, cv2, json, time
sys.path.insert(0,'/Users/dannmitton/Desktop/ilya-rewrite/tools/e16-harness/reader'); sys.path.insert(0,'.')
import fitted, svgtruth
O='/Users/dannmitton/Desktop/ilya-rewrite/tools/e16-harness/output/mussorgsky---sunless-01---within-four-walls/repaired/'
img=cv2.imread(O+'page1_300dpi.png',cv2.IMREAD_GRAYSCALE); dark=1-img.astype(float)/255
T=svgtruth.read_page(O+'page1.svg',2480)
rng=np.random.default_rng(1); err=[]; t0=time.time()
for st in T['staves']:
    if not st['voice']: continue
    staff=[round(y-0.5) for y in st['lines']]
    for n in st['notes'][:14]:
        x0=round(n['cx']-0.5+rng.uniform(-1.5,1.5)); y0=round(n['cy']-0.5+rng.uniform(-1.5,1.5))
        stem=None
        if n['stem']:
            stem=dict(x=round(n['stem']['x']-0.5), dir=(-1 if n['stem']['y2']<n['stem']['y1'] else 1), end_y=round(n['stem']['y2']-0.5))
        hollow=n['glyph']=='E0A3'
        f=fitted.fit_head(dark,x0,y0,staff,2,21,stem,hollow)
        if f is None: print('none'); continue
        dx=(f['cx']-(n['cx']-0.5))/21.26; dy=-(f['cy']-(n['cy']-0.5))/21.26
        err.append((dx,dy)); print(n['glyph'],f"dx {dx:+.3f} dy {dy:+.3f} a {f['a']/21.26:.3f}/{n['a']/21.26:.3f} b {f['b']/21.26:.3f}/{n['b']/21.26:.3f} tilt {f['tilt_up']:.0f}/{-(n['tilt']-180):.0f} rms {f['rms']:.3f} int {f['interior']:.2f}")
e=np.array(err); print('n',len(e),'time',time.time()-t0,'|dy| p50 p95',np.percentile(abs(e[:,1]),[50,95]),'|dx|',np.percentile(abs(e[:,0]),[50,95]))
