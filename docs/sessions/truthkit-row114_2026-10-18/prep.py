#!/usr/bin/env python3
"""Prepare one scanned page for truth drafting.

usage: python3 -I truthkit/prep.py <stem>     (stem such as f1-001; the page image is cp-pages/src/<stem>.png)

Writes, under the scratchpad root:
  cp-out/<stem>/page.omr, staves.txt          Audiveris on the whole page (geometry only; its export may fail, that is fine)
  cp-pages/<stem>-v<k>.png                    one crop per voice staff (the first staff of each system), lyrics included
  cp-out/<stem>/v<k>.mxl, v<k>-heads.txt      Audiveris on each crop: its MusicXML reading, and every notehead with x and pitch
  cp-pages/zoom/<stem>-v<k>-<i>.png           three overlapping zoomed pieces of each crop, for reading by eye
  truthkit/pages/<stem>.txt                   a skeleton to fill (header, one '// system' line per voice staff)
"""
import os, re, subprocess, sys, zipfile
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = os.path.join(ROOT, 'audiveris-dl/root/opt/audiveris')
JAVA = os.path.join(A, 'lib/runtime/bin/java')
TESS = os.path.join(ROOT, 'tessdata')
NAMES = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

def run_audiveris(image, outdir):
    os.makedirs(outdir, exist_ok=True)
    cmd = [JAVA, '-Djava.awt.headless=true', f'-Dtessdata.prefix={TESS}', '-cp', os.path.join(A, 'lib/app/*'), 'Audiveris',
           '-batch', '-export', '-output', outdir, image]
    p = subprocess.run(cmd, capture_output=True, text=True, timeout=900)
    return p.stdout + p.stderr

def staves_from_omr(omr):
    z = zipfile.ZipFile(omr); name = [n for n in z.namelist() if n.endswith('.xml') and 'sheet' in n][0]
    x = z.read(name).decode('utf-8')
    st = []
    for m in re.finditer(r'<staff id="(\d+)" left="(\d+)" right="(\d+)"([^>]*)>(.*?)</staff>', x, re.S):
        ys = [float(v) for v in re.findall(r'<point x="\d+" y="([\d.]+)"', m.group(5))]
        if not ys: continue
        st.append({'id': int(m.group(1)), 'left': int(m.group(2)), 'right': int(m.group(3)), 'short': 'short' in m.group(4),
                   'top': min(ys), 'bot': max(ys), 'interline': (max(ys) - min(ys)) / 4})
    return x, st

def pname(pp, clef='G'):
    idx = (6 if clef == 'G' else 1) - pp  # treble: pitch 0 is B4; bass: pitch 0 is D3
    base_oct = 4 if clef == 'G' else 3
    return f'{NAMES[idx % 7]}{base_oct + idx // 7}'

def inters(x):
    heads = sorted((int(m.group(3)), int(m.group(1)), m.group(2)) for m in re.finditer(r'<head pitch="(-?\d+)" shape="(\w+)"[^>]*>\s*<bounds x="(\d+)"', x))
    rests = sorted((int(m.group(2)), m.group(1)) for m in re.finditer(r'<rest shape="(\w+)"[^>]*>\s*<bounds x="(\d+)"', x))
    bars = sorted(int(m.group(1)) for m in re.finditer(r'<barline[^>]*>\s*<bounds x="(\d+)"', x))
    flags = sorted((int(m.group(2)), m.group(1)) for m in re.finditer(r'<flag shape="(\w+)"[^>]*>\s*<bounds x="(\d+)"', x))
    dots = sorted(int(m.group(1)) for m in re.finditer(r'<augmentation-dot[^>]*>\s*<bounds x="(\d+)"', x))
    tups = sorted((int(m.group(2)), m.group(1)) for m in re.finditer(r'<tuplet shape="(\w+)"[^>]*>\s*<bounds x="(\d+)"', x))
    clef = 'F' if re.search(r'<clef shape="F_CLEF"', x) else 'G'
    words = sorted((int(m.group(2)), m.group(1)) for m in re.finditer(r'<word[^>]*value="([^"]*)"[^>]*>\s*<bounds x="(\d+)"', x))
    return heads, rests, bars, flags, dots, tups, clef, words

def main(stem):
    src = os.path.join(ROOT, 'cp-pages/src', stem + '.png')
    out = os.path.join(ROOT, 'cp-out', stem); os.makedirs(out, exist_ok=True)
    os.makedirs(os.path.join(ROOT, 'cp-pages/zoom'), exist_ok=True)
    page = os.path.join(out, 'page.png')
    Image.open(src).convert('L').save(page)
    log = run_audiveris(page, out)
    omr = os.path.join(out, 'page.omr')
    if not os.path.exists(omr):
        open(os.path.join(out, 'page.log'), 'w').write(log); raise SystemExit('Audiveris wrote no page.omr; see page.log')
    x, st = staves_from_omr(omr)
    st = [s for s in st if not s['short']]
    st.sort(key=lambda s: s['top'])
    # group staves into systems by the gap between them; the first staff of a group is the voice
    groups = []; cur = [st[0]]
    for s in st[1:]:
        gap = s['top'] - cur[-1]['bot']
        if gap > 7 * cur[-1]['interline']: groups.append(cur); cur = [s]
        else: cur.append(s)
    groups.append(cur)
    with open(os.path.join(out, 'staves.txt'), 'w') as f:
        for gi, g in enumerate(groups, 1):
            f.write(f'system {gi}: ' + ' | '.join(f"staff {s['id']} y {s['top']:.0f}-{s['bot']:.0f} x {s['left']}-{s['right']} il {s['interline']:.1f}" for s in g) + '\n')
    im = Image.open(src).convert('L'); w, h = im.size
    skeleton = [f'title: NOT YET READ (song title, poet, printed page number)', f'page: {stem}', 'key: 0', 'time: 4/4', 'clef: G2', 'anacrusis: no', '']
    for k, g in enumerate(groups, 1):
        v = g[0]; il = v['interline']
        y0 = int(v['top'] - 6 * il); y1 = int(v['bot'] + 9 * il)
        crop = im.crop((0, max(0, y0), w, min(h, y1)))
        pad = ImageOps.expand(crop, border=(60, 160, 60, 160), fill=255)
        cpath = os.path.join(ROOT, 'cp-pages', f'{stem}-v{k}.png'); pad.save(cpath)
        vout = os.path.join(out, f'v{k}'); run_audiveris(cpath, vout)
        vomr = os.path.join(vout, f'{stem}-v{k}.omr')
        heads_txt = os.path.join(out, f'v{k}-heads.txt')
        if os.path.exists(vomr):
            vx, vst = staves_from_omr(vomr)
            heads, rests, bars, flags, dots, tups, clef, words = inters(vx)
            with open(heads_txt, 'w', encoding='utf-8') as f:
                f.write(f'# voice staff {k} of {stem}; x is in the crop {stem}-v{k}.png; pitch by staff position, accidentals and key NOT applied\n')
                f.write(f'clef {clef}\nbarlines x: {bars}\n')
                f.write('heads: ' + ' '.join(f'{hx}:{pname(hp, clef)}{"s" if "SMALL" in hs else ""}{"o" if "VOID" in hs else ""}' for hx, hp, hs in heads) + '\n')
                f.write(f'rests: {rests}\nflags: {flags}\ndots x: {dots}\ntuplets: {tups}\nwords: {words}\n')
            for mx in os.listdir(vout):
                if mx.endswith('.mxl'): os.replace(os.path.join(vout, mx), os.path.join(out, f'v{k}.mxl'))
        else:
            open(heads_txt, 'w').write('# Audiveris wrote no .omr for this crop\n')
        # zoom pieces
        z = pad.crop((60, 120, pad.width - 60, pad.height - 120)); zw, zh = z.size; n = 3; ov = 60
        for i in range(n):
            x0 = max(0, i * zw // n - ov); x1 = min(zw, (i + 1) * zw // n + ov)
            c = z.crop((x0, 0, x1, zh)); c = c.resize((int(c.width * 1.8), int(c.height * 1.8)), Image.LANCZOS)
            c.save(os.path.join(ROOT, 'cp-pages/zoom', f'{stem}-v{k}-{i + 1}.png'))
        skeleton.append(f'// system {k}'); skeleton.append('')
    sk = os.path.join(ROOT, 'truthkit/pages', stem + '.txt')
    if not os.path.exists(sk): open(sk, 'w', encoding='utf-8').write('\n'.join(skeleton))
    print(f'{stem}: {len(groups)} systems; crops, heads, zooms, and skeleton written')

if __name__ == '__main__':
    main(sys.argv[1])
