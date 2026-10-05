import subprocess, re, html, os, cv2, numpy as np
TESS=os.path.join(os.path.dirname(os.path.abspath(__file__)),'tessdata')
def ocr_chars(png, lang, psm=7, pad=20, scale=1.0):
    im=cv2.imread(png,0)
    if scale!=1.0: im=cv2.resize(im,None,fx=scale,fy=scale,interpolation=cv2.INTER_CUBIC)
    im=cv2.copyMakeBorder(im,pad,pad,pad,pad,cv2.BORDER_CONSTANT,value=255)
    tmp=png.replace('.png',f'.{lang}.in.png'); cv2.imwrite(tmp,im)
    base=png.replace('.png',f'.{lang}')
    subprocess.run(['tesseract',tmp,base,'--tessdata-dir',TESS,'-l',lang,'--psm',str(psm),'-c','hocr_char_boxes=1','-c','tessedit_create_hocr=1'],check=True,capture_output=True)
    h=open(base+'.hocr',encoding='utf-8').read()
    chars=[]; wi=-1
    for m in re.finditer(r"<span class='ocrx_word'[^>]*title='bbox (\d+) (\d+) (\d+) (\d+); x_wconf (\d+)[^']*'[^>]*>(.*?)</span>\s*(?=<span class='ocrx_word'|</span>\s*</p>|</span>\s*<span class='ocr_line'|$)", h, flags=re.S):
        wi+=1; wconf=int(m.group(5)); body=m.group(6)
        for c in re.finditer(r"<span class='ocrx_cinfo' title='x_bboxes (\d+) (\d+) (\d+) (\d+); x_conf ([\d.]+)'>(.*?)</span>", body, flags=re.S):
            x0,y0,x1,y1=[ (int(c.group(i))-pad)/scale for i in (1,2,3,4)]
            ch=html.unescape(re.sub(r'<[^>]+>','',c.group(6)))
            chars.append(dict(ch=ch,x0=x0,x1=x1,y0=y0,y1=y1,conf=float(c.group(5)),word=wi,wconf=wconf))
    return chars
def text_of(chars):
    out=[]; w=None
    for c in chars:
        if w is not None and c['word']!=w: out.append(' ')
        out.append(c['ch']); w=c['word']
    return ''.join(out)
if __name__=='__main__':
    import sys
    for p,i in ((1,1),(1,2),(1,3),(2,1)):
        for lang in ('orus','rus','Cyrillic'):
            ch=ocr_chars(f'line-{p}-{i}.png',lang)
            print(p,i,lang.ljust(8),text_of(ch))
