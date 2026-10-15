"""Row 81's step6.py reduced to the function step7.py reads from it (parse, copied unchanged). The rest of row 81's file, which
names the songs' truth files, is left out so that no sealed song is named in this folder. step7.py slices this file between
its parse function and the head-width function and runs that part."""
import json, re, sys, statistics
from fractions import Fraction as F
HERE = __file__.rsplit('/', 1)[0]; R80 = f'{HERE}/../measure-russian-line_2026-10-11'; RD = f'{HERE}/../measure-set3-four-below_2026-10-11/after/drops'
STEP = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}

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


def head_width(*a, **k):
    raise NotImplementedError('not copied from row 81')
