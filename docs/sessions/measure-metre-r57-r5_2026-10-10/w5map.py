"""Witness 5's ground: homr's joined reading of a song, bar by bar, and where each window's bars begin.

A bar's length is the sum of the voice's note and rest durations (not chords, not grace notes), in quarters.
Each joined bar is assigned to its page by counting the voice part's bars page by page, in the join's order.
A window (page, staff, x on my deskewed 300 dpi page) maps to homr's page image (pdf.js, 400 dpi) by undoing
the deskew and scaling; its first bar is the earliest bar on that page whose voice notes stand on that staff
and begin at or right of the window's left edge.
"""
import json, re
from fractions import Fraction
import numpy as np, cv2
from staff import lines_at

DESKEW = json.load(open('deskew.json'))
MEASURE = re.compile(r'<measure\b[^>]*>.*?</measure>', re.S)
NOTE = re.compile(r'<note\b[^>]*>.*?</note>', re.S)


def page_index(page):
    """'tch-p-1' -> 0; 'sun4-x-10' -> 1 (the song's own page order)."""
    song, kind, n = page.split('-')
    n = int(n)
    first = {'sun1': 1, 'sun4': 9, 'sun5': 11, 'sun6': 18}.get(song, 1)
    return n - first


def first_part(xml):
    m = re.search(r'<part\b[^>]*>(.*?)</part>', xml, re.S)
    return m.group(1) if m else ''


def bars(xml):
    """Each bar: its length in quarters, notes' places, metre written in it, barline styles, rests only."""
    out = []; div = None; time = None
    for m in MEASURE.findall(first_part(xml)):
        d = re.search(r'<divisions>(\d+)</divisions>', m)
        if d: div = int(d.group(1))
        t = re.search(r'<time\b[^>]*>\s*<beats>(\d+)</beats>\s*<beat-type>(\d+)</beat-type>', m)
        if t: time = (int(t.group(1)), int(t.group(2)))
        tot = Fraction(0); places = []; notes = 0; beams = []
        for n in NOTE.findall(m):
            p = re.search(r'imgpos:\s*([\d.]+),\s*([\d.]+)', n)
            if p: places.append((float(p.group(1)), float(p.group(2))))
            if '<grace' in n or '<chord' in n or '<cue' in n: continue
            v = re.search(r'<voice>(\d+)</voice>', n)
            if v and v.group(1) != '1': continue
            du = re.search(r'<duration>(\d+)</duration>', n)
            if du and div: tot += Fraction(int(du.group(1)), div); notes += 1
            b = re.search(r'<beam number="1">(\w+)</beam>', n); ty = re.search(r'<type>(\w+)</type>', n)
            beams.append((b.group(1) if b else None, ty.group(1) if ty else None))
        styles = re.findall(r'<bar-style>([\w-]+)</bar-style>', m) + (['repeat'] if '<repeat' in m else [])
        out.append(dict(len=tot, notes=notes, places=places, time=time, wrote_time=bool(t), styles=styles, beams=beams))
    return out


def song_bars(read):
    """Joined bars with their page (image index)."""
    joined = bars(read['result']['musicXml'])
    ok = [a for a in read['answers'] if a['ok']]
    # the join's pages: covers left out as withoutCovers does
    staves = [a['staves'] for a in ok]
    first = next((i for i, n in enumerate(staves) if n is not None and n >= 2), -1)
    song_pages = [a for i, a in enumerate(ok) if first <= 0 or i >= first or staves[i] != 1]
    counts = [len(MEASURE.findall(first_part(a['musicXml']))) for a in song_pages]
    k = 0
    for a, c in zip(song_pages, counts):
        for _ in range(c):
            if k < len(joined): joined[k]['image'] = a['image']; k += 1
    return joined, sum(counts)


def to_app(page, x, y, mine_size, app_size):
    """A point on my deskewed page to homr's page image."""
    W, H = mine_size
    M = cv2.getRotationMatrix2D((W / 2, H / 2), DESKEW[page], 1)
    Mi = cv2.invertAffineTransform(M)
    ox, oy = Mi @ np.array([x, y, 1.0])
    return ox * app_size[0] / W, oy * app_size[1] / H


def first_bar(w, st, jb, mine_size, app_size):
    """Index of the joined bar this window's bars begin with, or None."""
    img = page_index(w['page'])
    L = lines_at(st, w['x0'])
    sp_app = st['space'] * app_size[0] / mine_size[0]
    x0, ytop = to_app(w['page'], w['x0'], L[0], mine_size, app_size)
    _, ybot = to_app(w['page'], w['x0'], L[4], mine_size, app_size)
    best = None
    for i, b in enumerate(jb):
        if b.get('image') != img: continue
        on = [p for p in b['places'] if ytop - 4 * sp_app <= p[1] <= ybot + 4 * sp_app]
        if not on: continue
        mx = min(p[0] for p in on)
        if mx >= x0 - 0.5 * sp_app and (best is None or mx < best[0]): best = (mx, i)
    return None if best is None else best[1]
