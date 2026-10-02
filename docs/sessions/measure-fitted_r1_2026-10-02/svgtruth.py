"""The page's own geometry, read from the Verovio SVG that sits beside each render page (QUEUE row 24, step 3.2).

For one render page it returns, for every note of every voice staff (a staff that holds lyrics), in PNG pixels:
the head (centre, equivalent-ellipse axes and tilt from the glyph's own outline), the stem (column, ends, thickness),
the flag glyph, the dots (centre, diameter), and the staff's five lines. PNG pixels = SVG units * (png width / viewBox width).
"""
import re, math, json, sys
import xml.etree.ElementTree as ET
import numpy as np

NS = {'s': 'http://www.w3.org/2000/svg', 'x': 'http://www.w3.org/1999/xlink'}
CLS = lambda e: (e.get('class') or '').split()

def _num(t): return [float(v) for v in re.findall(r'-?\d*\.?\d+(?:e-?\d+)?', t)]

def parse_path(d, nseg=24):
    """-> list of closed sub-paths (Nx2 arrays) of the outline, curves sampled."""
    toks = re.findall(r'[MmLlHhVvCcSsQqTtZz]|-?\d*\.?\d+(?:e-?\d+)?', d)
    i = 0; subs = []; cur = []; pos = np.zeros(2); start = np.zeros(2); cmd = None; lastc = None
    def num():
        nonlocal i; v = float(toks[i]); i += 1; return v
    while i < len(toks):
        if re.match(r'[A-Za-z]', toks[i]): cmd = toks[i]; i += 1
        if cmd in 'Zz':
            if cur: subs.append(np.array(cur)); cur = []
            pos = start.copy(); lastc = None; continue
        rel = cmd.islower(); c = cmd.upper()
        if c == 'M':
            p = np.array([num(), num()]); pos = pos + p if rel else p; start = pos.copy()
            if cur: subs.append(np.array(cur))
            cur = [pos.copy()]; cmd = 'l' if rel else 'L'; lastc = None
        elif c == 'L':
            p = np.array([num(), num()]); pos = pos + p if rel else p; cur.append(pos.copy()); lastc = None
        elif c == 'H':
            v = num(); pos = np.array([pos[0] + v if rel else v, pos[1]]); cur.append(pos.copy()); lastc = None
        elif c == 'V':
            v = num(); pos = np.array([pos[0], pos[1] + v if rel else v]); cur.append(pos.copy()); lastc = None
        elif c in 'CS':
            if c == 'C':
                p1 = np.array([num(), num()]); p2 = np.array([num(), num()]); p3 = np.array([num(), num()])
                if rel: p1 = pos + p1; p2 = pos + p2; p3 = pos + p3
            else:
                p2 = np.array([num(), num()]); p3 = np.array([num(), num()])
                if rel: p2 = pos + p2; p3 = pos + p3
                p1 = 2 * pos - lastc if lastc is not None else pos.copy()
            for t in np.linspace(0, 1, nseg + 1)[1:]:
                cur.append((1-t)**3*pos + 3*(1-t)**2*t*p1 + 3*(1-t)*t**2*p2 + t**3*p3)
            pos = p3; lastc = p2
        elif c == 'Q':
            p1 = np.array([num(), num()]); p2 = np.array([num(), num()])
            if rel: p1 = pos + p1; p2 = pos + p2
            for t in np.linspace(0, 1, nseg + 1)[1:]:
                cur.append((1-t)**2*pos + 2*(1-t)*t*p1 + t**2*p2)
            pos = p2; lastc = None
        else:
            raise ValueError('path command %s' % cmd)
    if cur: subs.append(np.array(cur))
    return subs

def moments(subs):
    """Area, centroid and covariance of the filled region (nonzero winding by orientation), exact for the sampled polygon."""
    A = 0.0; cx = 0.0; cy = 0.0; Ixx = 0.0; Iyy = 0.0; Ixy = 0.0
    for P in subs:
        x = P[:, 0]; y = P[:, 1]; x1 = np.roll(x, -1); y1 = np.roll(y, -1)
        cr = x * y1 - x1 * y
        A += cr.sum() / 2
        cx += ((x + x1) * cr).sum() / 6; cy += ((y + y1) * cr).sum() / 6
        Ixx += ((x*x + x*x1 + x1*x1) * cr).sum() / 12
        Iyy += ((y*y + y*y1 + y1*y1) * cr).sum() / 12
        Ixy += ((x*y1 + 2*x*y + 2*x1*y1 + x1*y) * cr).sum() / 24
    if A < 0: A, cx, cy, Ixx, Iyy, Ixy = -A, -cx, -cy, -Ixx, -Iyy, -Ixy
    mx, my = cx / A, cy / A
    cov = np.array([[Ixx / A - mx*mx, Ixy / A - mx*my], [Ixy / A - mx*my, Iyy / A - my*my]])
    return A, np.array([mx, my]), cov

def bbox(subs):
    P = np.vstack(subs); return P.min(0), P.max(0)

def ellipse_of(cov):
    w, v = np.linalg.eigh(cov); w = np.maximum(w, 0)
    a = 2 * math.sqrt(w[1]); b = 2 * math.sqrt(w[0])
    ang = math.degrees(math.atan2(v[1, 1], v[0, 1])) % 180       # of the long axis, from +x, y down
    return a, b, ang

def read_page(svg_path, png_w):
    root = ET.parse(svg_path).getroot()
    vb = [float(v) for v in re.search(r'class="definition-scale"[^>]*viewBox="([^"]+)"', open(svg_path).read()).group(1).split()]
    f = png_w / vb[2]
    pm = [e for e in root.iter('{%s}g' % NS['s']) if 'page-margin' in CLS(e)][0]
    ox, oy = [float(v) for v in re.match(r'translate\(\s*([-\d.]+)[ ,]+([-\d.]+)\)', pm.get('transform')).groups()]
    defs = {}
    for g in root.iter('{%s}g' % NS['s']):
        gid = g.get('id')
        if gid and re.match(r'^E[0-9A-F]{3}-', gid):
            p = g.find('s:path', NS)
            if p is not None: defs[gid] = p.get('d')
    cache = {}
    def glyph(href, tx, ty, sc):
        key = href
        if key not in cache:
            subs = parse_path(defs[href[1:]])
            subs = [np.column_stack([P[:, 0], -P[:, 1]]) for P in subs]   # the path's own scale(1,-1)
            cache[key] = subs
        subs = [np.column_stack([tx + sc * P[:, 0], ty + sc * P[:, 1]]) for P in cache[key]]
        return subs
    rows = {}
    for staff in root.iter('{%s}g' % NS['s']):
        if 'staff' not in CLS(staff): continue
        has_verse = any('verse' in CLS(e) for e in staff.iter('{%s}g' % NS['s']))
        lines = []
        for p in staff.findall('s:path', NS):
            m = re.match(r'M\s*([\d.]+)\s+([\d.]+)\s+L\s*([\d.]+)\s+([\d.]+)', p.get('d'))
            if m and abs(float(m.group(2)) - float(m.group(4))) < 1e-6: lines.append((float(m.group(2)), float(p.get('stroke-width', 0)), float(m.group(1)), float(m.group(3))))
        lines.sort()
        if len(lines) != 5: continue
        ly = [(l[0] + oy) * f for l in lines]
        s_px = (ly[-1] - ly[0]) / 4
        notes = []
        parents = {c: p for p in staff.iter() for c in p}
        for note in staff.iter('{%s}g' % NS['s']):
            if 'note' not in CLS(note): continue
            nh = [e for e in note.iter('{%s}g' % NS['s']) if 'notehead' in CLS(e)]
            if not nh: continue
            use = nh[0].find('s:use', NS)
            m = re.match(r'translate\(\s*([-\d.]+),\s*([-\d.]+)\)\s*scale\(\s*([-\d.]+)', use.get('transform'))
            tx, ty, sc = float(m.group(1)), float(m.group(2)), float(m.group(3))
            href = use.get('{%s}href' % NS['x'])
            subs = glyph(href, tx + ox, ty + oy, sc)
            # a hollow head is a ring: its axes and centre are the OUTER outline's, the largest sub-path
            outer = max(subs, key=lambda P: abs(moments([P])[0]))
            A, mu, cov = moments([outer]); lo, hi = bbox(subs)
            a, b, ang = ellipse_of(cov)
            par = parents.get(note)
            scope = [note] + ([par] if par is not None and 'chord' in CLS(par) else [])
            stem = None; flag = None; dots = []
            for sc_el in scope:
                for ch in sc_el:
                    if 'stem' in CLS(ch) and stem is None:
                        p = ch.find('s:path', NS); mm = re.match(r'M\s*([-\d.]+)\s+([-\d.]+)\s+L\s*([-\d.]+)\s+([-\d.]+)', p.get('d'))
                        x1, y1, x2, y2 = [float(v) for v in mm.groups()]
                        stem = dict(x=(x1 + ox) * f, y1=(y1 + oy) * f, y2=(y2 + oy) * f, thick=float(p.get('stroke-width')) * f)
                        for fl in ch.iter('{%s}g' % NS['s']):
                            if 'flag' in CLS(fl):
                                u = fl.find('s:use', NS); flag = u.get('{%s}href' % NS['x']).split('-')[0][1:]
                    if 'dots' in CLS(ch):
                        for e in ch.findall('s:ellipse', NS):
                            dots.append(dict(cx=(float(e.get('cx')) + ox) * f, cy=(float(e.get('cy')) + oy) * f, d=2 * float(e.get('rx')) * f))
            # in a chord the dots are shared: keep those on this head's row or the space above it
            hy = mu[1] * f
            dots = [d for d in dots if abs(d['cy'] - hy) < 0.8 * s_px]
            notes.append(dict(glyph=href.split('-')[0][1:], cx=mu[0] * f, cy=mu[1] * f, bb_cx=(lo[0] + hi[0]) / 2 * f, bb_cy=(lo[1] + hi[1]) / 2 * f,
                              a=a * f, b=b * f, tilt=ang, w=(hi[0] - lo[0]) * f, h=(hi[1] - lo[1]) * f, stem=stem, flag=flag, dots=dots, id=note.get('id')))
        key = round(ly[0])
        row = rows.setdefault(key, dict(voice=False, lines=ly, line_thick=[l[1] * f for l in lines], s=s_px, notes=[], x0=(lines[0][2] + ox) * f, x1=(lines[0][3] + ox) * f))
        row['voice'] = row['voice'] or has_verse
        row['notes'].extend(notes); row['x0'] = min(row['x0'], (lines[0][2] + ox) * f); row['x1'] = max(row['x1'], (lines[0][3] + ox) * f)
    return dict(scale=f, staves=[rows[k] for k in sorted(rows)])

if __name__ == '__main__':
    r = read_page(sys.argv[1], int(sys.argv[2]))
    for st in r['staves']:
        if st['voice']: print('voice staff', [round(y, 1) for y in st['lines']], 's', round(st['s'], 2), len(st['notes']))
    n = [n for st in r['staves'] if st['voice'] for n in st['notes']][0]
    print(json.dumps(n, indent=1))
