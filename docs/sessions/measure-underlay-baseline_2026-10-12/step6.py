"""Row 81, step 6: one place read twice, without OCR. In each song, every pair of notes in one bar and one page with the same
pitch, x within 30 px, chords excluded (row 80's notes.jsonl and status.json). For each pair: the scorer's status of each,
and what each candidate rule keeps:
  longer / shorter: by <duration> over the divisions in force;
  metre: the note whose removal leaves the bar's notes and rests, over both voices (no voice-1 filter, unlike barFacts in
         metre-witness.ts:171; grace, cue, and later chord notes skipped as barFacts does), summing to the truth's
         measureDurations for that bar;
  head: the larger head. On Ilya's raster, a window 2 staff spaces square centred on imgpos, with the staff lines blanked
        (their y from row 80's systems.jsonl: a line pixel is blanked where the pixels 3 px above and below are paper, so a
        head on a line is not cut), the connected ink component (8-neighbour) nearest the centre, its width across its own
        vertical middle row. Heads differ in size where the widths differ by more than 20 percent (DESK DEFAULT).
  head-at-pitch (CODE'S VARIANT, not the brief's): the same window centred on imgpos x and the y of the note's printed pitch on
        the treble staff (both songs' voice clef is G on line 2; E4 on the bottom line, half a space a step), the staff lines
        blanked with the probe 0.25 space above and below (these lines are up to 6 px thick), and the width taken as the widest
        row of the component within 0.3 space of that y, so a stem does not move the middle.
Writes crops of each pair to <crop dir> for looking. Usage: /usr/bin/python3 step6.py <raster dir> <crop dir>"""
import json, re, sys, statistics
from fractions import Fraction as F
from PIL import Image, ImageDraw
HERE = __file__.rsplit('/', 1)[0]; R80 = f'{HERE}/../measure-russian-line_2026-10-11'; RD = f'{HERE}/../measure-set3-four-below_2026-10-11/after/drops'
RAS, CROPS = sys.argv[1], sys.argv[2]
OFF = dict(S=0, T=0, K=1, M=2)
H = '/Users/dannmitton/Downloads/'
TRUTH = dict(S=H + '_desk-heldout3-private/truth/balakirev_pesnya_zolotoy_rybki.truth.json', T=H + '_desk-heldout3-private/truth/borodin_spyashchaya_knyazhna.truth.json',
             K=H + '_desk-2026-10-08/heldout2-truth-r2/truth/ippolitov-ivanov_op28_no4_nevolnik.truth.json', M=H + '_desk-2026-10-08/heldout2-truth-r2/truth/lyadov_op22_no1_kolybelnaya.truth.json')
STEP = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

def parse(L):
    """Every <note> of the voice part, as notes.py walks them, with its duration in whole notes and its bar."""
    x = open(f'{RD}/{L}.musicxml').read(); p = x[x.index('<part '):]; p = p[:p.index('</part>')]
    ms = re.findall(r'<measure[\s\S]*?</measure>', p)
    div = None; out = []; bars = []
    for i, m in enumerate(ms):
        tot = F(0)
        for part in re.split(r'(?=<note[\s>])|(?=<attributes>)', m):
            d = re.match(r'<attributes>[\s\S]*?<divisions>\s*(\d+)\s*</divisions>', part)
            if d: div = int(d[1])
            if not re.match(r'<note[\s>]', part): continue
            n = part[:part.index('</note>') + 7]
            du = re.search(r'<duration>\s*(\d+)', n)
            dur = F(int(du[1]), div * 4) if du and div else F(0)
            skip = bool(re.search(r'<grace[\s/>]|<chord[\s/>]|<cue[\s/>]', n))
            if not skip: tot += dur
            pos = re.search(r'imgpos:\s*(\d+),\s*(\d+)', n)
            rest = '<rest' in n
            midi = None; dia = None
            if not rest:
                st = re.search(r'<step>(\w)</step>', n)[1]; o = int(re.search(r'<octave>(\d)', n)[1]); a = re.search(r'<alter>(-?\d)', n)
                midi = (o + 1) * 12 + STEP[st] + (int(a[1]) if a else 0); dia = o * 7 + 'CDEFGAB'.index(st)
            out.append(dict(bar=i, dia=dia, pos=(int(pos[1]), int(pos[2])) if pos else None, rest=rest, midi=midi, dur=dur, counted=not skip,
                            chord='<chord' in n, voice=re.search(r'<voice>(\d)', n)[1], type=(re.search(r'<type>(\w+)', n) or [None, None])[1]))
        bars.append(tot)
    return out, bars

def head_width(L, note, sysm, atpitch=False):
    im, px, ink = page(L, note['page'])
    sp = sysm['space']; cx, cy = note['x'], note['y']; h = int(round(sp))
    probe = 4
    if atpitch:
        cy = int(round(sysm['staffBottom'] - (note['xml']['dia'] - 30) * (sysm['staffBottom'] - sysm['staffTop']) / 8)); probe = int(round(0.25 * sp))
    x0, y0 = cx - h, cy - h
    W = 2 * h + 1
    lines = [sysm['staffTop'] + k * (sysm['staffBottom'] - sysm['staffTop']) / 4 for k in range(5)]
    g = [[px[x0 + i, y0 + j] < ink if 0 <= x0 + i < im.size[0] and 0 <= y0 + j < im.size[1] else False for i in range(W)] for j in range(W)]
    def inkat(x, y): return 0 <= x < im.size[0] and 0 <= y < im.size[1] and px[x, y] < ink
    for ly in lines:
        for yy in range(int(ly) - 2, int(ly) + 3):
            j = yy - y0
            if not 0 <= j < W: continue
            for i in range(W):
                X = x0 + i
                if not inkat(X, int(ly) - probe) and not inkat(X, int(ly) + probe): g[j][i] = False
    seen = [[False] * W for _ in range(W)]; best = None
    for j in range(W):
        for i in range(W):
            if g[j][i] and not seen[j][i]:
                comp = []; st = [(i, j)]; seen[j][i] = True
                while st:
                    a, b = st.pop(); comp.append((a, b))
                    for da in (-1, 0, 1):
                        for db in (-1, 0, 1):
                            u, v = a + da, b + db
                            if 0 <= u < W and 0 <= v < W and g[v][u] and not seen[v][u]: seen[v][u] = True; st.append((u, v))
                d = min((a - h) ** 2 + (b - h) ** 2 for a, b in comp)
                if best is None or d < best[0]: best = (d, comp)
    if not best: return None, None
    comp = best[1]
    if atpitch:
        ws = [max(xs) - min(xs) + 1 for r in range(h - int(0.3 * sp), h + int(0.3 * sp) + 1) for xs in [[a for a, b in comp if b == r]] if xs]
        return (max(ws) if ws else None), comp, cy
    ys = [b for a, b in comp]; mid = (min(ys) + max(ys)) // 2
    xs = [a for a, b in comp if b == mid]
    return (max(xs) - min(xs) + 1) if xs else None, comp, cy

_pages = {}
def page(L, p):
    k = (L, p)
    if k not in _pages:
        im = Image.open(f'{RAS}/{L}-{p + OFF[L]}.png').convert('L'); px = im.load(); W, Hh = im.size
        paper = statistics.median(px[x, y] for x in range(0, W, 37) for y in range(0, Hh, 37))
        _pages[k] = (im, px, paper - 60)
    return _pages[k]

summary = {}
for L in 'STKM':
    ns = [json.loads(l) for l in open(f'{R80}/{L}.notes.jsonl')]
    st = json.load(open(f'{R80}/{L}.status.json'))
    nc = [n for n in ns if not n['chord']]; assert len(nc) == len(st)
    for n, s in zip(nc, st): n['status'] = s['status']; n['syl'] = s['syllable']
    xml, bars = parse(L)
    placed = [e for e in xml if e['pos'] and not e['rest']]
    assert len(placed) == len(ns) and all((e['pos'] == (n['x'], n['y']) and e['midi'] == n['midi'] and e['bar'] == n['bar']) for e, n in zip(placed, ns)), L
    for e, n in zip(placed, ns): n['dur'] = e['dur']; n['xml'] = e
    truth = json.load(open(TRUTH[L])); md = {b['index']: F(b['expectedDuration']['numerator'], b['expectedDuration']['denominator']) for b in truth['measureDurations']}
    systems = [json.loads(l) for l in open(f'{R80}/{L}.systems.jsonl')]
    pairs = []
    for i, a in enumerate(nc):
        for b in nc[i + 1:]:
            if a['bar'] == b['bar'] and a['page'] == b['page'] and a['midi'] == b['midi'] and abs(a['x'] - b['x']) <= 30: pairs.append((a, b))
    summary[L] = pairs
    print(f'== {L}: {len(pairs)} pairs')
    for k, (a, b) in enumerate(pairs, 1):
        bar = a['bar']; T = md.get(bar)
        def keeps_metre():
            ok = [n for n in (a, b) if bars[bar] - (n['dur'] if n['xml']['counted'] else 0) == T]  # removal of the other leaves T
            rem = {id(a): b, id(b): a}
            return [rem[id(n)] for n in ok]
        mk = keeps_metre()
        metre = 'both' if len(mk) == 2 else ('none' if not mk else ('first' if mk[0] is a else 'second'))
        longer = 'tie' if a['dur'] == b['dur'] else ('first' if a['dur'] > b['dur'] else 'second')
        shorter = 'tie' if longer == 'tie' else ('second' if longer == 'first' else 'first')
        sysm = next(s for s in systems if s['page'] == a['page'] and s['bars'][0] <= bar <= s['bars'][1] and 'staffTop' in s)
        def bigger(wa, wb): return ('first' if wa > wb else 'second') if wa and wb and abs(wa - wb) / max(wa, wb) > 0.2 else ('same size' if wa and wb else 'no head found')
        wa, ca, ya = head_width(L, a, sysm); wb, cb, yb = head_width(L, b, sysm); head = bigger(wa, wb)
        pa, qa, pya = head_width(L, a, sysm, True); pb, qb, pyb = head_width(L, b, sysm, True); headp = bigger(pa, pb)
        def desc(n): return f"x {n['x']} y {n['y']} {n['type']} ({n['dur']}) v{n['voice']} {n['status']}{' ' + n['syl'] if n['syl'] else ''}"
        print(f"{L} bar {bar} {NAMES[a['midi'] % 12]}{a['midi'] // 12 - 1}: first [{desc(a)}] second [{desc(b)}]")
        print(f"    bar sums over both voices {bars[bar]} (truth {T}); longer keeps {longer}; shorter keeps {shorter}; metre keeps {metre}")
        print(f"    head (brief's, at imgpos): {wa} / {wb} px, {head}; head-at-pitch (Code's, pitch y {pya}): {pa} / {pb} px, {headp}   (space {sysm['space']})")
        im = page(L, a['page'])[0]; s = int(sysm['space']); h = int(round(sysm['space']))
        ys = [a['y'], b['y'], pya]
        x0 = min(a['x'], b['x']) - 3 * s; y0 = min(ys) - 3 * s
        cr = im.crop((x0, y0, max(a['x'], b['x']) + 3 * s, max(ys) + 3 * s)).convert('RGB'); d = ImageDraw.Draw(cr)
        for n, c, cy, col in ((a, qa, pya, (255, 0, 0)), (b, qb, pyb, (0, 0, 255))):
            for (u, v) in (c or []): cr.putpixel((n['x'] - h + u - x0, cy - h + v - y0), col)
            d.line((n['x'] - x0 - 6, n['y'] - y0, n['x'] - x0 + 6, n['y'] - y0), fill=col); d.line((n['x'] - x0, n['y'] - y0 - 6, n['x'] - x0, n['y'] - y0 + 6), fill=col)
        cr = cr.resize((cr.width * 3, cr.height * 3), Image.NEAREST); cr.save(f'{CROPS}/pair-{L}-{k}.png')
