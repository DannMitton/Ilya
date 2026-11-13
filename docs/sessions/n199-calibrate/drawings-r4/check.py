#!/usr/bin/env python3
"""Checks for the sagittal vowel SVGs. Run: python3 check.py  (from any directory)
1. the <g id="fixed"> group is byte-identical in every file (frame.svg included)
2. every vowel file has the required ids, the same root tag, and the same element order
3. every path of the same id has the same number of path commands (morph-compatible)
4. pixel test: render at 520 px, report the share of ink pixels that differ, write preview-diff.png
"""
import re,sys,subprocess,pathlib,itertools
HERE=pathlib.Path(__file__).resolve().parent
VOWELS=sorted(p.name for p in HERE.glob('sag-*.svg'))
REQ=['fixed','moving','tongue','jaw','lips','velum','pharynx']
def fixed(t):
    m=re.search(r'<g id="fixed">.*?</g>',t,re.S);assert m,'no fixed group';return m.group(0)
def root(t): return re.search(r'<svg[^>]*>',t).group(0)
def paths(t): return [(i,len(re.findall(r'[MCLQZ]',d))) for i,d in re.findall(r'<path id="([^"]+)"[^>]*? d="([^"]+)"',t)]
txt={n:(HERE/n).read_text() for n in VOWELS+['frame.svg']}
assert len(VOWELS)>=2,'need at least two vowel files'
f0=fixed(txt['frame.svg'])
for n,t in txt.items():
    assert fixed(t)==f0,f'fixed group differs in {n}'
    assert root(t)==root(txt['frame.svg']),f'root <svg> tag differs in {n}'
    assert 'viewBox="-24 -12 544 544"' in root(t) and ' width=' not in root(t) and ' height=' not in root(t),n
    assert 'fill="none"' in root(t) and 'stroke="currentColor"' in root(t),n
    assert not re.search(r'fill="(?!none)',t),f'a fill in {n}'
print(f'fixed group byte-identical across {len(txt)} files ({len(f0)} bytes)')
p0=paths(txt[VOWELS[0]])
for n in VOWELS:
    t=txt[n]
    for i in REQ: assert f'<g id="{i}">' in t,f'{n} lacks id {i}'
    ids=re.findall(r'id="([^"]+)"',t);assert len(ids)==len(set(ids)),f'duplicate ids in {n}'
    assert paths(t)==p0,f'path ids or command counts differ: {n} vs {VOWELS[0]}'
print('required ids present; element order and path command counts match:',', '.join(f'{i}:{c}' for i,c in p0))
# identical moving parts
def part(t,i): return re.search(r'<path id="%s"[^>]*>'%re.escape(i),t).group(0)
for a,b in [('sag-i.svg',n) for n in VOWELS if n!='sag-i.svg']:
    same=[i for i,_ in p0 if part(txt[a],i)==part(txt[b],i)];diff=[i for i,_ in p0 if i not in same]
    print(f'{a} vs {b}: byte-identical paths: {", ".join(same)} | differing: {", ".join(diff)}')
# pixel test, every vowel against [i]
try:
    import numpy as np,cv2
except ImportError:
    print('pixel test skipped (needs numpy and cv2)');sys.exit(0)
def ink(n,w=520):
    png=subprocess.run(['rsvg-convert','-w',str(w),'-b','white',str(HERE/n)],check=True,capture_output=True).stdout
    return cv2.imdecode(np.frombuffer(png,np.uint8),0)<128
fr=ink('frame.svg');a=ink('sag-i.svg')
print('pixel test at 520 px, each vowel against sag-i.svg:')
for n in VOWELS:
    if n=='sag-i.svg':continue
    b=ink(n);union=(a|b).sum();differ=(a^b).sum()
    assert not ((a^b)&fr).any(),f'a differing pixel lies on the fixed frame: {n}'
    print(f'  {n:20s} differing {differ:6d} of {union:6d} ink px = {100*differ/union:5.1f}%')
print('no differing pixel lies on the fixed frame in any pair')
if 'sag-dark-a.svg' in VOWELS:
    A,B=ink('sag-i.svg',1040),ink('sag-dark-a.svg',1040)
    for name,shared in(('preview-diff.png',(150,150,150)),('preview-frame-overlay.png',(40,40,40))):
        o=np.full((1040,1040,3),255,np.uint8);o[A&B]=shared;o[A&~B]=(200,120,0);o[B&~A]=(0,90,230)
        cv2.putText(o,'shared: grey/dark   blue: [i] only   orange: [a-back] only',(16,34),cv2.FONT_HERSHEY_SIMPLEX,0.8,(90,90,90),2,cv2.LINE_AA)
        cv2.imwrite(str(HERE/name),o)
# contact sheet, 160 px, Grayson's order then the three others
ORDER=[('i','i'),('e','e'),('open-e','open e'),('a','a'),('dark-a','back a'),('o','o'),('u','u'),('velar-i','velar i'),('smallcap-i','small-cap i'),('turned-v','turned v')]
if all(f'sag-{k}.svg' in VOWELS for k,_ in ORDER):
    def tile(k,lab,w=160):
        png=subprocess.run(['rsvg-convert','-w',str(w),'-b','white',str(HERE/f'sag-{k}.svg')],check=True,capture_output=True).stdout
        im=cv2.imdecode(np.frombuffer(png,np.uint8),1);t=np.full((w+30,w+16,3),236,np.uint8);t[22:22+w,8:8+w]=im
        cv2.putText(t,lab,(9,15),cv2.FONT_HERSHEY_SIMPLEX,0.42,(70,70,70),1,cv2.LINE_AA);return t
    ts=[tile(k,l) for k,l in ORDER];blank=np.full_like(ts[0],236)
    cv2.imwrite(str(HERE/'preview-all.png'),np.vstack([np.hstack(ts[:7]),np.hstack(ts[7:]+[blank]*4)]))
print('OK')
