"""Row 80: draw each read note's imgpos (red cross, bar number) on a 400 dpi page, and crop. Usage: python3 mark.py <letter> <page png> <page> <bars a-b> <out png> [words.json]"""
import sys,json
from PIL import Image, ImageDraw
L,png,page,bars,out=sys.argv[1:6]; a,b=map(int,bars.split('-'))
im=Image.open(png).convert('RGB'); d=ImageDraw.Draw(im)
ns=[json.loads(l) for l in open(f'{L}.notes.jsonl')]
sel=[n for n in ns if n['page']==int(page) and a<=n['bar']<=b]
for n in sel:
    x,y=n['x'],n['y']; d.line((x-25,y,x+25,y),fill=(255,0,0),width=4); d.line((x,y-25,x,y+25),fill=(255,0,0),width=4); d.text((x+8,y-60),str(n['bar']),fill=(255,0,0))
if len(sys.argv)>6:
    for w in json.load(open(sys.argv[6])):
        x0,y0,x1,y1=w['bbox']; d.rectangle((x0,y0,x1,y1),outline=(0,0,255) if w['script']=='cyr' else (0,160,0),width=3)
xs=[n['x'] for n in sel]; ys=[n['y'] for n in sel]
im.crop((max(0,min(xs)-150),max(0,min(ys)-300),min(im.width,max(xs)+150),min(im.height,max(ys)+650))).save(out)
print(len(sel))
