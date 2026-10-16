"""N.135 stage 1, step B: systems, voice-staff bands, and text rows of one song. Row 80's systems.py and row 81's rows.py, logic unchanged,
reading notes/<L>.json (the events' imgpos, page, bar) instead of row 80's notes.jsonl.
Usage: python3 rowsys.py <L> <raster prefix> <cover offset>  -> systems/<L>.jsonl, rows/<L>.jsonl, crops in ~/Downloads/_desk-n135/crops"""
import sys, json, statistics, os
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); CROPS = os.path.expanduser('~/Downloads/_desk-n135/crops'); os.makedirs(CROPS, exist_ok=True)
os.makedirs(f'{HERE}/systems', exist_ok=True); os.makedirs(f'{HERE}/rows', exist_ok=True)
L, pref, off = sys.argv[1], sys.argv[2], int(sys.argv[3])
ns = [dict(bar=e['bar'], page=e['page'], x=e['x'], y=e['y']) for e in json.load(open(f'{HERE}/notes/{L}.json')) if not e['rest'] and e['x'] is not None]
systems = []; ims = {}
for page in sorted({n['page'] for n in ns}):
    im = Image.open(f'{pref}-{page + off}.png').convert('L'); W, H = im.size; px = im.load()
    paper = statistics.median(px[x, y] for x in range(0, W, 37) for y in range(0, H, 37)); ink = paper - 60
    ims[page] = (im, px, ink)
    pn = sorted([n for n in ns if n['page'] == page], key=lambda n: n['y']); groups = []
    for n in pn:
        if groups and n['y'] - groups[-1][-1]['y'] < 600: groups[-1].append(n)
        else: groups.append([n])
    for k, g in enumerate(groups, 1):
        mx = int(statistics.median(n['x'] for n in g)); x0 = max(0, mx - 250); x1 = min(W, mx + 250); ww = x1 - x0
        staffs = []
        for half in (250, 60):  # DEPARTURE (mine): row 80's 500 px window first; where it finds no staff (a rotated scan smears the lines), a 120 px window
            x0 = max(0, mx - half); x1 = min(W, mx + half); ww = x1 - x0; lines = []
            for y in range(H):
                d = sum(1 for x in range(x0, x1, 2) if px[x, y] < ink) * 2
                if d > 0.4 * ww:
                    if lines and y - lines[-1][-1] <= 2: lines[-1].append(y)
                    else: lines.append([y])
            lines = [sum(l) / len(l) for l in lines]; staffs = []; i = 0
            while i + 4 < len(lines):
                s = lines[i:i + 5]; gaps = [s[j + 1] - s[j] for j in range(4)]
                if max(gaps) - min(gaps) <= max(5, 0.3 * min(gaps)) and min(gaps) > 12: staffs.append(s); i += 5
                else: i += 1
            if staffs: break
        my = statistics.median(n['y'] for n in g)
        if not staffs: systems.append(dict(page=page, system=k, error='no staff found')); continue
        j = min(range(len(staffs)), key=lambda j: abs((staffs[j][0] + staffs[j][4]) / 2 - my)); s = staffs[j]; sp = (s[4] - s[0]) / 4
        nxt = staffs[j + 1][0] if j + 1 < len(staffs) else min(H, s[4] + 20 * sp)
        b = dict(page=page, system=k, bars=[min(n['bar'] for n in g), max(n['bar'] for n in g)], staffTop=round(s[0]), staffBottom=round(s[4]), space=round(sp, 1), y0=int(s[4] + 1.5 * sp), y1=int(nxt - 1.5 * sp), x0=0, x1=W)
        if b['y1'] - b['y0'] < 40: b['error'] = 'band too thin'
        systems.append(b)
with open(f'{HERE}/systems/{L}.jsonl', 'w') as f:
    for b in systems: f.write(json.dumps(b) + '\n')
rows = []
for b in systems:
    if 'y0' not in b or 'error' in b: continue
    im, px, ink = ims[b['page']]; sp, x0, x1 = b['space'], b['x0'], b['x1']; ww = x1 - x0
    on = [sum(1 for x in range(x0, x1) if px[x, y] < ink) > 0.02 * ww for y in range(b['y0'], b['y1'])]
    runs = []
    for i, v in enumerate(on):
        y = b['y0'] + i
        if not v: continue
        if runs and y - runs[-1][1] - 1 < 0.3 * sp: runs[-1][1] = y
        elif runs and runs[-1][1] == y - 1: runs[-1][1] = y
        else: runs.append([y, y])
    for j, (a, z) in enumerate([r for r in runs if r[1] - r[0] + 1 >= 0.4 * sp], 1):
        y0 = max(0, int(a - 0.3 * sp)); y1 = min(im.size[1], int(z + 1 + 0.3 * sp))
        im.crop((x0, y0, x1, y1)).save(f'{CROPS}/{L}-{b["page"]}-s{b["system"]}-r{j}.png')
        rows.append(dict(page=b['page'], system=b['system'], row=j, bars=b['bars'], space=sp, core=[a, z], y0=y0, y1=y1, x0=x0, x1=x1))
with open(f'{HERE}/rows/{L}.jsonl', 'w') as f:
    for r in rows: f.write(json.dumps(r) + '\n')
bad = [b for b in systems if 'error' in b]
print(L, 'systems', len(systems), 'errors', len(bad), 'rows', len(rows), 'per system', [sum(1 for r in rows if (r['page'], r['system']) == (b['page'], b['system'])) for b in systems])
