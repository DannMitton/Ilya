"""4e, check 2: a double sharp printed beside a note. Needs the page image and each note's imgpos.

For every pitched note of the joined voice part, the window left of homr's imgpos point is searched for a
compact component shaped like a double sharp, by the rule Ilya's reader uses (reader.py:1606-1616,
classify_compact; window from reader.py:1625-1626): centroid between hx-2.3s and hx-0.28s, within 1.7s of the
head row, not holding any note's imgpos point, height and width 0.55s to 1.7s, area 0.24s^2 to 0.86s^2, aspect
0.6 to 1.7, fill 0.28 to 0.62, and an inked centre (mean of the 5x5 centre >= 0.3).
s is the page's staff-line spacing: the modal gap between staff-line rows of the whole page (rows more than 35%
dark), taken from 25 to 40 px. Staff lines are removed in the window only where nothing continues above and
below them (within 4 px), so a sign that a line crosses keeps its ink.
The check: where a double sharp is found, the note's alteration (relative to its written step) must be +2, and so
must every later note on the same step and octave in its bar; any that is not is flagged.
A flag is right where the scorer reports that note's pitch wrong, false where the pitch is right.
Writes out/tables/4e-dsharp-flags.csv and prints the counts."""
import csv, cv2, numpy as np
from collections import Counter
from lib import SONGS, CHK, KIT, load_song, parse

T = f'{CHK}/out/tables'
_pages = {}


def page(p):
    if p not in _pages:
        img = cv2.imread(f'{KIT}/pages/{p}.png', cv2.IMREAD_GRAYSCALE)
        dark = img < 128
        prof = dark.mean(axis=1)
        rows = np.flatnonzero(prof > 0.35)
        lines = []
        for r in rows:
            if lines and r - lines[-1][-1] <= 2:
                lines[-1].append(r)
            else:
                lines.append([r])
        cs = [np.mean(l) for l in lines]
        d = np.round(np.diff(cs)).astype(int)
        d = d[(d >= 25) & (d <= 40)]
        s = float(Counter(d).most_common(1)[0][0])
        # every note's imgpos point on the page, all parts, as head centres
        heads = []
        root = parse(f'{CHK}/in/{p}.musicxml')
        from lib import imgpos
        for n in root.iter('note'):
            ip = imgpos(n)
            if ip:
                heads.append(ip)
        _pages[p] = (dark, s, heads)
    return _pages[p]


def find_dsharp(p, hx, hy):
    dark, s, heads = page(p)
    H, W = dark.shape
    x0, x1 = int(hx - 3.0 * s), int(hx)
    y0, y1 = int(hy - 2.5 * s), int(hy + 2.5 * s)
    x0, y0 = max(0, x0), max(0, y0)
    x1, y1 = min(W, x1), min(H, y1)
    # line rows, judged on a wider strip
    sx0, sx1 = max(0, int(hx - 6 * s)), min(W, int(hx + 2 * s))
    strip = dark[y0:y1, sx0:sx1]
    linerow = strip.mean(axis=1) > 0.5
    win = dark[y0:y1, x0:x1].copy()
    r = 0
    n = win.shape[0]
    while r < n:
        if not linerow[r]:
            r += 1
            continue
        a = r
        while r < n and linerow[r]:
            r += 1
        b = r  # band is rows a..b-1
        above = win[a - 1] if a > 0 else np.zeros(win.shape[1], bool)
        below = win[b] if b < n else np.zeros(win.shape[1], bool)
        k = np.ones(9, bool)
        ab = np.convolve(above, k, 'same') > 0
        bb = np.convolve(below, k, 'same') > 0
        keep = ab & bb
        win[a:b, :] &= keep[None, :]
    num, lab, stats, cent = cv2.connectedComponentsWithStats(win.astype(np.uint8), 8)
    found = []
    for i in range(1, num):
        bx, by, w, h, area = stats[i]
        cx, cy = cent[i][0] + x0, cent[i][1] + y0
        if not (hx - 2.3 * s < cx < hx - 0.28 * s) or abs(cy - hy) > 1.7 * s:
            continue
        gx0, gy0 = bx + x0, by + y0
        if any(gx0 - 4 <= px <= gx0 + w + 4 and gy0 - 4 <= py <= gy0 + h + 4 for px, py in heads):
            continue
        if not (0.55 * s <= h <= 1.7 * s and 0.55 * s <= w <= 1.7 * s and 0.24 * s * s <= area <= 0.86 * s * s):
            continue
        ar = w / max(1, h)
        if not (0.6 <= ar <= 1.7):
            continue
        comp = (lab[by:by + h, bx:bx + w] == i)
        fill = comp.mean()
        ccy, ccx = h // 2, w // 2
        centre = comp[max(0, ccy - 2):ccy + 3, max(0, ccx - 2):ccx + 3].mean()
        if 0.28 <= fill <= 0.62 and centre >= 0.3:
            found.append(dict(cx=round(cx), cy=round(cy), w=int(w), h=int(h), fill=round(float(fill), 2)))
    return found, s


XMAX, ASPECT = 0.2, False


def find_dsharp_v2(p, hx, hy):
    """The helper's own variant, after v1 found none of the double sharps: in this edition the double sharp is a
    solid four-lobed glyph (fill about 0.75, outside v1's 0.28 to 0.62), and homr's imgpos point sits near the
    head's upper left, not its centre. A candidate is a component whose centroid lies between hx-2.5s and hx+0.2s
    and between hy-1.2s and hy+1.5s, whose right edge is left of hx+0.5s, 0.7s to 1.6s in height and width, area at
    least 0.35s^2, and whose four corner boxes (a quarter of each side) hold more ink than the four edge-middle
    boxes by at least 0.25 (a four-lobed sign; a tilted notehead is the reverse)."""
    dark, s, heads = page(p)
    H, W = dark.shape
    x0, x1 = max(0, int(hx - 3.5 * s)), min(W, int(hx + 1.0 * s))
    y0, y1 = max(0, int(hy - 2.5 * s)), min(H, int(hy + 2.5 * s))
    sx0, sx1 = max(0, int(hx - 6 * s)), min(W, int(hx + 2 * s))
    linerow = dark[y0:y1, sx0:sx1].mean(axis=1) > 0.5
    win = dark[y0:y1, x0:x1].copy()
    r, n = 0, win.shape[0]
    while r < n:
        if not linerow[r]:
            r += 1
            continue
        a = r
        while r < n and linerow[r]:
            r += 1
        b = r
        above = win[a - 1] if a > 0 else np.zeros(win.shape[1], bool)
        below = win[b] if b < n else np.zeros(win.shape[1], bool)
        k = np.ones(9, bool)
        keep = (np.convolve(above, k, 'same') > 0) & (np.convolve(below, k, 'same') > 0)
        win[a:b, :] &= keep[None, :]
    num, lab, stats, cent = cv2.connectedComponentsWithStats(win.astype(np.uint8), 8)
    found = []
    for i in range(1, num):
        bx, by, w, h, area = stats[i]
        cx, cy = cent[i][0] + x0, cent[i][1] + y0
        if not (hx - 2.5 * s < cx < hx + XMAX * s and hy - 1.2 * s < cy < hy + 1.5 * s):
            continue
        if XMAX < 0.5 and bx + x0 + w > hx + 0.5 * s:
            continue
        if not (0.7 * s <= h <= 1.6 * s and 0.7 * s <= w <= 1.6 * s and area >= 0.35 * s * s):
            continue
        if ASPECT and not (0.7 <= w / h <= 1.4):
            continue
        comp = (lab[by:by + h, bx:bx + w] == i)
        qh, qw = max(1, h // 4), max(1, w // 4)
        corners = np.mean([comp[:qh, :qw].mean(), comp[:qh, -qw:].mean(), comp[-qh:, :qw].mean(), comp[-qh:, -qw:].mean()])
        mh0, mw0 = (h - qh) // 2, (w - qw) // 2
        middles = np.mean([comp[:qh, mw0:mw0 + qw].mean(), comp[-qh:, mw0:mw0 + qw].mean(),
                           comp[mh0:mh0 + qh, :qw].mean(), comp[mh0:mh0 + qh, -qw:].mean()])
        if corners - middles >= 0.25:
            found.append(dict(cx=round(cx), cy=round(cy), w=int(w), h=int(h), corners=round(float(corners), 2), middles=round(float(middles), 2)))
    return found, s


def main(finder=None, tag='v1'):
    finder = finder or find_dsharp
    rows, summ = [], []
    for song in SONGS:
        S = load_song(song)
        idx = {id(e['note']): k for k, e in enumerate(S['events'])}
        wrong = {d['readerIndex'] for d in S['score']['differences'] if 'pitch' in d['kind']}
        matched = {m['readerIndex'] for m in S['score']['matches']}
        c = Counter()
        detected = 0
        for r in S['joined']:
            carry = {}
            for n in r['notes']:
                if n['rest'] or not n['imgpos']:
                    continue
                hx, hy = n['imgpos']
                f, s = finder(r['page'], hx, hy)
                key = (n['step'], n['octave'])
                why = None
                if f:
                    detected += 1
                    carry[key] = True
                    if n['alter'] != 2:
                        why = 'double sharp found, alter %d' % n['alter']
                elif carry.get(key) and n['alter'] != 2:
                    why = 'double sharp carried in bar, alter %d' % n['alter']
                if why:
                    k = idx.get(id(n))
                    status = ('right' if k in wrong else 'false' if k in matched else
                              'chord note' if n['chord'] else 'extra note')
                    c[status] += 1
                    rows.append(dict(version=tag, song=song, bar=r['index'] + 1, page=r['page'], note=f"{n['step']}{n['octave']}",
                                     alter=n['alter'], imgpos=n['imgpos'], s=s, why=why, status=status,
                                     found=(f[0] if f else '')))
        pd = len(wrong)
        caught = sum(1 for x in rows if x['song'] == song and x['status'] == 'right')
        summ.append(dict(version=tag, song=song, notesSearched=sum(1 for r in S['joined'] for n in r['notes'] if not n['rest']),
                         doubleSharpsFound=detected, flags=sum(c.values()), right=c['right'], false=c['false'],
                         onExtraNotes=c['extra note'], onChordNotes=c['chord note'], pitchDifferences=pd))
        print(summ[-1])
    for x in rows:
        print('  ', x)
    return rows, summ


if __name__ == '__main__':
    r1, s1 = main(find_dsharp, 'v1 Ilya bounds')
    r2, s2 = main(find_dsharp_v2, 'v2 four-lobe shape')
    # v3: the second and last tuning, made after seeing v2's misses on these same songs (imgpos can fall on the
    # sign itself, and a sharp passed the lobe test): centroid up to hx+0.8s, and aspect 0.7 to 1.4
    XMAX, ASPECT = 0.8, True
    r3, s3 = main(find_dsharp_v2, 'v3 four-lobe shape, wider, aspect')
    r2, s2 = r2 + r3, s2 + s3
    with open(f'{T}/4e-dsharp-flags.csv', 'w', newline='') as f:
        w = csv.DictWriter(f, fieldnames=list((r1 + r2)[0].keys())); w.writeheader(); w.writerows(r1 + r2)
    with open(f'{T}/4e-dsharp-summary.csv', 'w', newline='') as f:
        w = csv.DictWriter(f, fieldnames=list(s1[0].keys())); w.writeheader(); w.writerows(s1 + s2)
