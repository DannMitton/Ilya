"""Step 3.2: the fitted forms against the same forms in the page's SVG, in staff spaces (the SVG's own: 180 units)."""
import json, math, sys, numpy as np
sys.path.insert(0, '.')
import svgtruth
OUT = '/Users/dannmitton/Desktop/ilya-rewrite/tools/e16-harness/output/'
SONGS = {1: ('mussorgsky---sunless-01---within-four-walls', 2), 4: ('mussorgsky---sunless-04---be-bored', 3),
         5: ('mussorgsky---sunless-05---elegy', 6), 6: ('mussorgsky---sunless-06---on-the-river', 6)}
rows = []     # one record per paired head
unpaired_reader = []; unpaired_svg = []
pairs_by_song = {}
for n, (d, npg) in SONGS.items():
    fits = json.load(open(f'fits/song{n}.json'))
    for pg in fits:
        if pg.get('error') or not pg['heads']: continue
        T = svgtruth.read_page(f'{OUT}{d}/repaired/page{pg["page"]}.svg', 2480)
        sp = T['staves'][0]['s']
        voice_rows = [r for r in T['staves'] if r['voice']]
        svg_notes = []
        for r in voice_rows:
            for nt in r['notes']: svg_notes.append((r, nt))
        used = set()
        for h in pg['heads']:
            if h['head'] is None: continue
            # nearest SVG head in the page, within 1.0 s of the reader's position
            best = None
            for k, (r, nt) in enumerate(svg_notes):
                dd = math.hypot(nt['cx'] - 0.5 - h['x'], nt['cy'] - 0.5 - h['y']) / sp
                if dd < 1.0 and (best is None or dd < best[0]): best = (dd, k)
            if best is None: unpaired_reader.append((n, pg['page'], h['x'], h['y'])); continue
            if best[1] in used: unpaired_reader.append((n, pg['page'], h['x'], h['y'], 'dup')); continue
            used.add(best[1]); r, nt = svg_notes[best[1]]
            H = h['head']
            rec = dict(song=n, page=pg['page'], x=h['x'], y=h['y'], s=sp, glyph=nt['glyph'], hollow_svg=nt['glyph'] == 'E0A3', hollow_fit=H['hollow'],
                       dx=(H['cx'] - (nt['cx'] - 0.5)) / sp, dy=-(H['cy'] - (nt['cy'] - 0.5)) / sp,
                       da=(H['a'] - nt['a']) / sp, db=(H['b'] - nt['b']) / sp,
                       a_fit=H['a'] / sp, b_fit=H['b'] / sp, a_svg=nt['a'] / sp, b_svg=nt['b'] / sp,
                       tilt_fit=H['tilt_up'], tilt_svg=180 - nt['tilt'] if nt['tilt'] > 90 else -nt['tilt'], rms=H['rms'], interior=H['interior'],
                       has_stem_svg=nt['stem'] is not None, has_stem_reader=h['reader_stem'] is not None, flag=nt['flag'], dots_svg=len(nt['dots']))
            d_t = (rec['tilt_fit'] - rec['tilt_svg'] + 90) % 180 - 90
            rec['dtilt'] = d_t
            S, sf = nt['stem'], h.get('stem')
            if S and sf:
                sd = sf['dir']
                rec.update(stem_dcol=(sf['col'] - (S['x'] - 0.5)) / sp, stem_dthick=(sf['thick'] - S['thick']) / sp,
                           stem_dfar=sd * ((sf['far_end'] - (S['y2'] - 0.5)) * 1.0) / sp,   # + = the fit runs longer than the SVG's stem
                           stem_dir_ok=(sd == (-1 if S['y2'] < S['y1'] else 1)))
            if nt['dots'] and h.get('dot'):
                # the SVG dot nearest the fitted dot
                dsv = min(nt['dots'], key=lambda q: abs(q['cx'] - 0.5 - h['dot']['cx']) + abs(q['cy'] - 0.5 - h['dot']['cy']))
                rec.update(dot_dx=(h['dot']['cx'] - (dsv['cx'] - 0.5)) / sp, dot_dy=-(h['dot']['cy'] - (dsv['cy'] - 0.5)) / sp, dot_dd=(h['dot']['d'] - dsv['d']) / sp, dot_d_svg=dsv['d'] / sp)
            elif nt['dots']: rec['dot_missed'] = True
            if not nt['dots'] and h.get('dot'): rec['dot_extra'] = True
            rows.append(rec)
        for k, (r, nt) in enumerate(svg_notes):
            if k not in used: unpaired_svg.append((n, pg['page'], round(nt['cx']), round(nt['cy']), nt['glyph']))
json.dump(dict(rows=rows, unpaired_reader=unpaired_reader, unpaired_svg=unpaired_svg), open('compare32.json', 'w'))

def q(v, absq=True):
    v = np.array(v, float)
    if not len(v): return 'n=0'
    return f'n={len(v)}, median {np.median(v):+.3f}, |p50| {np.median(abs(v)):.3f}, |p95| {np.percentile(abs(v), 95):.3f}, max|.| {abs(v).max():.3f}'
print('paired', len(rows), 'reader heads with no SVG head', len(unpaired_reader), 'SVG heads with no reader head', len(unpaired_svg))
for label, sel in (('all paired', rows), ('filled (SVG E0A4)', [r for r in rows if not r['hollow_svg']]), ('hollow (SVG E0A3)', [r for r in rows if r['hollow_svg']])):
    print('==', label, len(sel))
    for key in ('dx', 'dy', 'da', 'db', 'dtilt'):
        print(f'  {key:6s}', q([r[key] for r in sel]))
print('== stems'); 
for key in ('stem_dcol', 'stem_dthick', 'stem_dfar'): print(f'  {key:12s}', q([r[key] for r in rows if key in r]))
print('== dots'); 
for key in ('dot_dx', 'dot_dy', 'dot_dd'): print(f'  {key:7s}', q([r[key] for r in rows if key in r]))
print('  dots in SVG', sum(r['dots_svg'] > 0 for r in rows), 'fitted', sum('dot_dx' in r for r in rows), 'missed', sum(bool(r.get('dot_missed')) for r in rows), 'extra (no SVG dot, fit found one)', sum(bool(r.get('dot_extra')) for r in rows))
