"""Row 57 r5: the fonts, their licence sources, and text-font digits drawn by glyph name (lining figures)."""
import glob, os, re, json
import numpy as np
from fontTools.ttLib import TTFont, TTCollection

MUSIC = ['Bravura', 'Leland', 'FinaleMaestro', 'FinaleEngraver', 'FinaleBroadway', 'FinaleAsh',
         'FinaleJazz', 'FinaleLegacy', 'Petaluma', 'Sebastian']
DIRS = ['/Library/Fonts', os.path.expanduser('~/Library/Fonts'), '/opt/homebrew/Caskroom',
        os.path.expanduser('~/Desktop/ilya-rewrite/apps/web/static/fonts')]
FILES = {  # licence files read in full this round
    'Bravura': 'apps/web/static/fonts/bravura/OFL.txt',
    'Leland': 'apps/web/static/fonts/leland/LICENSE.txt',
    'Finale': 'apps/web/static/fonts/finale-maestro/OFL.txt (Reserved Font Names Finale, Maestro, Broadway, Engraver, Jazz, Ash, Legacy)',
    'Lato': 'apps/web/static/fonts/lato-OFL.txt',
}
WEIGHT = ['Black', 'Heavy', 'ExtraBold', 'Extrabold', 'Bold', 'Semibold', 'SemiBold', 'Medium', 'Regular', 'Roman', '']

def all_files():
    out = []
    for d in DIRS:
        for ext in ('otf', 'ttf', 'OTF', 'TTF'):
            out += glob.glob(d + '/**/*.' + ext, recursive=True)
    return sorted(set(out))

def info(p):
    f = TTFont(p, lazy=True); n = f['name']
    lic = ' '.join(filter(None, [n.getDebugName(13), n.getDebugName(14)]))
    return dict(path=p, family=n.getDebugName(16) or n.getDebugName(1), sub=n.getDebugName(17) or n.getDebugName(2),
                full=n.getDebugName(4), field_ofl=bool(re.search(r'open font licen[cs]e|scripts\.sil\.org/ofl|openfontlicense', lic, re.I)),
                italic=bool(f['OS/2'].fsSelection & 1) or 'italic' in (n.getDebugName(2) or '').lower(),
                weight=f['OS/2'].usWeightClass)

def survey():
    rows = []
    for p in all_files():
        try: rows.append(info(p))
        except Exception as e: rows.append(dict(path=p, error=str(e)))
    return rows

def licence_source(r):
    base = os.path.basename(r['path'])
    for k, v in FILES.items():
        if base.startswith(k) and (k != 'Finale' or re.match(r'Finale(Maestro|Engraver|Broadway|Ash|Jazz|Legacy)\.otf$', base)):
            return 'file: ' + v
    if r.get('field_ofl'): return 'licence field of the font file'
    if base == 'Sebastian.otf': return "smufl.org's statement that it is SIL OFL (Dann, 2026-10-11)"
    return None

def text_fonts(rows):
    """One upright face a family, the heaviest, for every licensed family that is not a music font."""
    fam = {}
    for r in rows:
        if 'error' in r or r['italic']: continue
        src = licence_source(r)
        if not src: continue
        base = os.path.splitext(os.path.basename(r['path']))[0]
        if base in MUSIC: continue
        k = r['family']
        if k not in fam or r['weight'] > fam[k][0]['weight']: fam[k] = (r, src)
    return fam

# --- lining digits drawn by glyph name ---
def lining_names(f):
    cmap = f.getBestCmap(); names = {d: cmap.get(ord(str(d))) for d in range(10)}
    if 'GSUB' in f and f['GSUB'].table.FeatureList:
        gs = f['GSUB'].table
        for fr in gs.FeatureList.FeatureRecord:
            if fr.FeatureTag != 'lnum': continue
            for li in fr.Feature.LookupListIndex:
                lk = gs.LookupList.Lookup[li]
                for st in lk.SubTable:
                    if lk.LookupType == 7: st = st.ExtSubTable
                    m = getattr(st, 'mapping', None)
                    if m:
                        for d in range(10):
                            if names[d] in m: names[d] = m[names[d]]
    return names

def digit_bitmaps(path, height=160):
    """Each digit 0 to 9, lining, as an ink array (0..255) whose lining height (the digit 1's) is `height` pixels."""
    from fontTools.pens.freetypePen import FreeTypePen
    from fontTools.pens.boundsPen import BoundsPen
    f = TTFont(path); gs = f.getGlyphSet(); names = lining_names(f)
    b1 = BoundsPen(gs); gs[names[1]].draw(b1); y0, y1 = b1.bounds[1], b1.bounds[3]
    sc = height / (y1 - y0)
    out = {}
    for d in range(10):
        bp = BoundsPen(gs); gs[names[d]].draw(bp); xmin, ymin, xmax, ymax = bp.bounds
        w = int((xmax - xmin) * sc) + 4; h = int((ymax - ymin) * sc) + 4
        pen = FreeTypePen(gs); gs[names[d]].draw(pen)
        a = pen.array(width=w, height=h, transform=(sc, 0, 0, sc, -xmin * sc + 2, -ymin * sc + 2))
        out[d] = (np.clip(a * 255, 0, 255).astype(np.uint8), (ymin - y0) * sc - 2, (ymax - y0) * sc + 2)
    return out

if __name__ == '__main__':
    rows = survey()
    fam = text_fonts(rows)
    music = []
    for m in MUSIC:
        r = [x for x in rows if 'error' not in x and os.path.basename(x['path']) == m + '.otf'][0]
        music.append(dict(font=m, path=r['path'], licence=licence_source(r)))
    text = [dict(font=r['full'], family=k, path=r['path'], weight=r['weight'], licence=src) for k, (r, src) in sorted(fam.items())]
    unlicensed = sorted({os.path.basename(r['path']) for r in rows if 'error' not in r and not licence_source(r)})
    json.dump(dict(music=music, text=text, unlicensed=unlicensed, files=len(rows)), open('fontlist.json', 'w'), indent=1)
    for m in music: print('MUSIC', m['font'], '|', m['licence'])
    for t in text: print('TEXT', t['font'], t['weight'], '|', t['licence'], '|', t['path'])
    print(len(rows), 'files;', len(unlicensed), 'unlicensed files')
