#!/usr/bin/env python3
"""Redo the voice-staff crops of one page with the voice staves named by hand, reusing prep.py's own functions.

usage: python3 -I f2agent/regroup.py <stem> <staff id | top-bot> ...
  each argument is a voice staff, in page order: a staff id from cp-out/<stem>/staves.txt, or 'top-bot' y pixels
  when Audiveris found no staff there.
prep.py groups staves by the gap between them; on these pages the gap rule fails, so the voice crops it made
can be piano staves. This writes cp-pages/<stem>-v<k>.png, cp-out/<stem>/v<k>-heads.txt, v<k>.mxl and the zoom
pieces exactly as prep.py does, for the named staves. prep.py's originals are moved to prep-orig/ first.
"""
import glob, os, shutil, sys
from PIL import Image, ImageOps
ROOT = '/tmp/claude-0/-home-claude/71d82959-ea9c-5f01-b569-c0b1b985316b/scratchpad'
sys.path.insert(0, os.path.join(ROOT, 'truthkit'))
import prep

stem = sys.argv[1]
out = os.path.join(ROOT, 'cp-out', stem)
x, st = prep.staves_from_omr(os.path.join(out, 'page.omr'))
byid = {s['id']: s for s in st}
voices = []
for a in sys.argv[2:]:
    if '-' in a:
        t, b = map(float, a.split('-')); voices.append({'id': a, 'top': t, 'bot': b, 'interline': (b - t) / 4})
    else:
        voices.append(byid[int(a)])

bk_out = os.path.join(out, 'prep-orig'); bk_pages = os.path.join(ROOT, 'cp-pages', 'prep-orig')
if not os.path.exists(bk_out):
    os.makedirs(bk_out); os.makedirs(bk_pages, exist_ok=True)
    for f in glob.glob(os.path.join(ROOT, 'cp-pages', f'{stem}-v*.png')) + glob.glob(os.path.join(ROOT, 'cp-pages/zoom', f'{stem}-v*-*.png')):
        shutil.move(f, os.path.join(bk_pages, os.path.basename(f)))
    for f in glob.glob(os.path.join(out, 'v*')):
        shutil.move(f, os.path.join(bk_out, os.path.basename(f)))
else:
    for f in glob.glob(os.path.join(ROOT, 'cp-pages', f'{stem}-v*.png')) + glob.glob(os.path.join(ROOT, 'cp-pages/zoom', f'{stem}-v*-*.png')):
        os.remove(f)
    for f in glob.glob(os.path.join(out, 'v*')):
        shutil.rmtree(f) if os.path.isdir(f) else os.remove(f)

src = os.path.join(ROOT, 'cp-pages/src', stem + '.png')
im = Image.open(src).convert('L'); w, h = im.size
with open(os.path.join(out, 'voice-staves.txt'), 'w') as f:
    for k, v in enumerate(voices, 1):
        f.write(f"v{k}: staff {v['id']} y {v['top']:.0f}-{v['bot']:.0f} il {v['interline']:.1f}\n")
for k, v in enumerate(voices, 1):
    il = v['interline']
    y0 = int(v['top'] - 6 * il); y1 = int(v['bot'] + 9 * il)
    crop = im.crop((0, max(0, y0), w, min(h, y1)))
    pad = ImageOps.expand(crop, border=(60, 160, 60, 160), fill=255)
    cpath = os.path.join(ROOT, 'cp-pages', f'{stem}-v{k}.png'); pad.save(cpath)
    vout = os.path.join(out, f'v{k}'); prep.run_audiveris(cpath, vout)
    vomr = os.path.join(vout, f'{stem}-v{k}.omr')
    heads_txt = os.path.join(out, f'v{k}-heads.txt')
    if os.path.exists(vomr):
        vx, vst = prep.staves_from_omr(vomr)
        heads, rests, bars, flags, dots, tups, clef, words = prep.inters(vx)
        with open(heads_txt, 'w', encoding='utf-8') as f:
            f.write(f'# voice staff {k} of {stem}; x is in the crop {stem}-v{k}.png; pitch by staff position, accidentals and key NOT applied\n')
            f.write(f'clef {clef}\nbarlines x: {bars}\n')
            f.write('heads: ' + ' '.join(f'{hx}:{prep.pname(hp, clef)}{"s" if "SMALL" in hs else ""}{"o" if "VOID" in hs else ""}' for hx, hp, hs in heads) + '\n')
            f.write(f'rests: {rests}\nflags: {flags}\ndots x: {dots}\ntuplets: {tups}\nwords: {words}\n')
        for mx in os.listdir(vout):
            if mx.endswith('.mxl'): os.replace(os.path.join(vout, mx), os.path.join(out, f'v{k}.mxl'))
    else:
        open(heads_txt, 'w').write('# Audiveris wrote no .omr for this crop\n')
    z = pad.crop((60, 120, pad.width - 60, pad.height - 120)); zw, zh = z.size; n = 3; ov = 60
    for i in range(n):
        x0 = max(0, i * zw // n - ov); x1 = min(zw, (i + 1) * zw // n + ov)
        c = z.crop((x0, 0, x1, zh)); c = c.resize((int(c.width * 1.8), int(c.height * 1.8)), Image.LANCZOS)
        c.save(os.path.join(ROOT, 'cp-pages/zoom', f'{stem}-v{k}-{i + 1}.png'))
print(f'{stem}: {len(voices)} voice staves regrouped')
