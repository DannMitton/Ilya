#!/usr/bin/env python3
"""Truth kit: a compact voice-line notation -> MusicXML (for Verovio rendering) and the harness's truth JSON.

Format (one bar per line):
  b<n> [<num>/<den>]: <event> | <event> | ...
Events:
  C#5/8 "syl"      a note: pitch (letter, accidental # b n, octave), slash, written value (1 2 4 8 16 32 64), dots as '.'
  C#5/8 -          a melisma continuation (no syllable)
  r/8              a rest
  g:E5/16          a grace note (not counted in the bar sum)
  t3[ ... ]        a tuplet, 3 in the time of 2 (t5 = 5 in 4, t7 = 7 in 4, t3:2 explicit)
  ~ after a note   tie to the next note (the next carries no syllable)
  // text          a comment
Header lines: key: 3 ; time: 4/4 ; clef: G2 ; title: ... ; page: ... ; anacrusis: yes
"""
import json, re, sys
from fractions import Fraction

STEP = {'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11}
FIFTHS_SHARPS = ['F','C','G','D','A','E','B']
FIFTHS_FLATS = ['B','E','A','D','G','C','F']
TYPE = {1:'whole',2:'half',4:'quarter',8:'eighth',16:'16th',32:'32nd',64:'64th'}

def parse(src):
    hdr = {'key':0,'time':(4,4),'clef':('G',2),'title':'','page':'','anacrusis':False}
    bars = []
    for raw in src.splitlines():
        if raw.strip().startswith('// system'):
            hdr.setdefault('systems', []).append(len(bars)); continue
        line = raw.split('//')[0].strip()
        if not line: continue
        m = re.match(r'^(key|time|clef|title|page|anacrusis):\s*(.*)$', line)
        if m:
            k, v = m.group(1), m.group(2).strip()
            if k == 'key': hdr['key'] = int(v)
            elif k == 'time': a, b = v.split('/'); hdr['time'] = (int(a), int(b))
            elif k == 'clef': hdr['clef'] = (v[0], int(v[1]))
            elif k == 'anacrusis': hdr['anacrusis'] = v.lower().startswith('y')
            else: hdr[k] = v
            continue
        m = re.match(r'^b(\d+)(?:\s+(\d+)/(\d+))?:\s*(.*)$', line)
        if not m: raise SystemExit(f'bad line: {raw}')
        n = int(m.group(1)); tsig = (int(m.group(2)), int(m.group(3))) if m.group(2) else None
        bars.append((n, tsig, parse_events(m.group(4))))
    return hdr, bars

def parse_events(s):
    out = []
    i = 0
    toks = tokenize(s)
    def take(toks):
        ev = []
        while toks:
            t = toks.pop(0)
            if t == '|': continue
            if t == ']': return ev
            tm = re.match(r'^t(\d+)(?::(\d+))?\[$', t)
            if tm:
                actual = int(tm.group(1)); normal = int(tm.group(2)) if tm.group(2) else {3:2,5:4,6:4,7:4}[actual]
                inner = take(toks)
                for e in inner: e['tuplet'] = (actual, normal)
                ev.append({'kind':'tuplet','actual':actual,'normal':normal,'events':inner})
                continue
            grace = t.startswith('g:')
            if grace: t = t[2:]
            nm = re.match(r'^(r|[A-G][#bn]?\d)/(\d+)(\.*)(~?)$', t)
            if not nm: raise SystemExit(f'bad token: {t}')
            e = {'kind':'rest' if nm.group(1)=='r' else 'note', 'pitch':nm.group(1), 'value':int(nm.group(2)),
                 'dots':len(nm.group(3)), 'tie':bool(nm.group(4)), 'grace':grace, 'syl':None}
            if toks and toks[0].startswith('"'):
                e['syl'] = toks.pop(0).strip('"')
            elif toks and toks[0] == '-':
                toks.pop(0); e['syl'] = '-'
            ev.append(e)
        return ev
    return take(toks)

def tokenize(s):
    toks = re.findall(r'"[^"]*"|t\d+(?::\d+)?\[|\]|\||g:[A-Gr][#bn]?\d*/\d+\.*~?|[A-Gr][#bn]?\d*/\d+\.*~?|-', s)
    return toks

def dur(e):
    d = Fraction(1, e['value']); add = d
    for _ in range(e['dots']): add /= 2; d += add
    if e.get('tuplet'): a, n = e['tuplet']; d = d * n / a
    return d

def flat(events):
    for e in events:
        if e['kind'] == 'tuplet': yield from flat(e['events'])
        else: yield e

def midi(p, key):
    m = re.match(r'^([A-G])([#bn]?)(\d)$', p); step, acc, octv = m.group(1), m.group(2), int(m.group(3))
    base = 12 * (octv + 1) + STEP[step]
    if acc == '#': return base + 1, 1
    if acc == 'b': return base - 1, -1
    if acc == 'n': return base, 0
    if key > 0 and step in FIFTHS_SHARPS[:key]: return base + 1, 1
    if key < 0 and step in FIFTHS_FLATS[:-key]: return base - 1, -1
    return base, 0

def to_musicxml(hdr, bars, divisions=96):
    key = hdr['key']; tn, td = hdr['time']
    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<score-partwise version="4.0"><part-list><score-part id="P1"><part-name>Голос</part-name></score-part></part-list><part id="P1">']
    for bi, (n, tsig, events) in enumerate(bars):
        out.append(f'<measure number="{n}"{" implicit=\"yes\"" if bi == 0 and hdr["anacrusis"] else ""}>')
        if bi == 0:
            out.append(f'<attributes><divisions>{divisions}</divisions><key><fifths>{key}</fifths></key><time><beats>{tn}</beats><beat-type>{td}</beat-type></time><clef><sign>{hdr["clef"][0]}</sign><line>{hdr["clef"][1]}</line></clef></attributes>')
        elif tsig:
            out.append(f'<attributes><time><beats>{tsig[0]}</beats><beat-type>{tsig[1]}</beat-type></time></attributes>')
        prev_tied = False
        evs = list(flat(events)); beams = beam_plan(evs, expect_of(hdr, bars, bi))
        tup_edges = tuplet_edges(events)
        for ei, e in enumerate(evs):
            out.append('<note>')
            if e['grace']: out.append('<grace/>')
            if e['kind'] == 'rest': out.append('<rest/>')
            else:
                m = re.match(r'^([A-G])([#bn]?)(\d)$', e['pitch']); mm, alter = midi(e['pitch'], key)
                out.append(f'<pitch><step>{m.group(1)}</step>{f"<alter>{alter}</alter>" if alter else ""}<octave>{m.group(3)}</octave></pitch>')
            if not e['grace']:
                d = dur(e); out.append(f'<duration>{int(d * 4 * divisions)}</duration>')
            if e['kind'] == 'note' and e['tie']: out.append('<tie type="start"/>')
            if e['kind'] == 'note' and prev_tied: out.append('<tie type="stop"/>')
            out.append('<voice>1</voice>')
            out.append(f'<type>{TYPE[e["value"]]}</type>' + '<dot/>' * e['dots'])
            if e['kind'] == 'note' and re.match(r'^[A-G][#bn]', e['pitch']):
                acc = {'#':'sharp','b':'flat','n':'natural'}[e['pitch'][1]]; out.append(f'<accidental>{acc}</accidental>')
            if e.get('tuplet'):
                a, nn = e['tuplet']; out.append(f'<time-modification><actual-notes>{a}</actual-notes><normal-notes>{nn}</normal-notes></time-modification>')
            nots = []
            if e['kind'] == 'note' and e['tie']: nots.append('<tied type="start"/>')
            if e['kind'] == 'note' and prev_tied: nots.append('<tied type="stop"/>')
            if beams[ei]: out.append(f'<beam number="1">{beams[ei]}</beam>')
            te = tup_edges.get(id(e))
            if te: nots.append(f'<tuplet type="{te}" bracket="yes" show-number="actual"/>')
            if nots: out.append('<notations>' + ''.join(nots) + '</notations>')
            if e['kind'] == 'note' and e['syl'] and e['syl'] != '-' and not prev_tied:
                s = e['syl']; hy = s.endswith('-'); text = s.rstrip('-')
                out.append(f'<lyric number="1"><syllabic>{"begin" if hy else "single"}</syllabic><text>{xml(text)}</text></lyric>')
            out.append('</note>')
            prev_tied = e['kind'] == 'note' and e['tie']
        out.append('</measure>')
    out.append('</part></score-partwise>')
    return '\n'.join(out)

def expect_of(hdr, bars, bi):
    expect = Fraction(*hdr['time'])
    for j in range(bi + 1):
        if bars[j][1]: expect = Fraction(*bars[j][1])
    return expect

def tsig_of(hdr, bars, bi):
    t = hdr['time']
    for j in range(bi + 1):
        if bars[j][1]: t = bars[j][1]
    return t

def beam_plan(evs, expect):
    # beam consecutive flagged notes (value >= 8) that lie inside one beat (a quarter, or a dotted quarter in compound metre); rests and grace notes break a beam
    beat = Fraction(3, 8) if expect.denominator == 8 and expect.numerator % 3 == 0 else Fraction(1, 4)
    plan = [''] * len(evs); onset = Fraction(0); groups = []; cur = []
    for i, e in enumerate(evs):
        d = Fraction(0) if e['grace'] else dur(e)
        beamable = e['kind'] == 'note' and e['value'] >= 8 and not e['grace']
        if beamable:
            if cur and (onset // beat) != (evs_onset[cur[0]] // beat): groups.append(cur); cur = []
            cur.append(i); evs_onset[i] = onset
        else:
            if cur: groups.append(cur); cur = []
        onset += d
    if cur: groups.append(cur)
    for g in groups:
        if len(g) < 2: continue
        for k, i in enumerate(g): plan[i] = 'begin' if k == 0 else ('end' if k == len(g) - 1 else 'continue')
    return plan
evs_onset = {}

def tuplet_edges(events):
    edges = {}
    for e in events:
        if e['kind'] == 'tuplet':
            inner = list(flat(e['events']))
            if inner: edges[id(inner[0])] = 'start'; edges[id(inner[-1])] = 'stop'
    return edges

def xml(s): return s.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')

def check(hdr, bars):
    tn, td = hdr['time']; expect = Fraction(tn, td); msgs = []
    for bi, (n, tsig, events) in enumerate(bars):
        if tsig: expect = Fraction(*tsig)
        total = sum(dur(e) for e in flat(events) if not e['grace'])
        if total != expect and not (bi == 0 and hdr['anacrusis']) and bi != len(bars) - 1:
            msgs.append(f'bar {n}: sums to {total}, expected {expect}')
    return msgs

def to_truth(hdr, bars, piece_id):
    key = hdr['key']; tn, td = hdr['time']; expect = Fraction(tn, td)
    notes = []; abs_onset = Fraction(0); mdur = []
    for bi, (n, tsig, events) in enumerate(bars):
        if tsig: expect = Fraction(*tsig)
        mdur.append({'index': bi, 'expectedDuration': {'numerator': expect.numerator, 'denominator': expect.denominator}})
        onset = Fraction(0)
        for e in flat(events):
            d = Fraction(0) if e['grace'] else dur(e)
            rec = {'id': f'm{bi}-{onset.numerator}-{onset.denominator}', 'type': e['kind'], 'measureIndex': bi,
                   'onset': {'numerator': onset.numerator, 'denominator': onset.denominator},
                   'duration': {'numerator': d.numerator, 'denominator': d.denominator},
                   'onsetAbsolute': float(abs_onset + onset)}
            if e['grace']: rec['grace'] = True
            if e['kind'] == 'note':
                rec['midi'] = midi(e['pitch'], key)[0]
                if e['syl'] and e['syl'] != '-':
                    rec['syllableText'] = e['syl'].rstrip('-'); rec['syllableType'] = 'start' if e['syl'].endswith('-') else 'single'
                elif e['syl'] == '-': rec['syllableType'] = 'melisma'
                if e['tie']: rec['tieStart'] = True
            notes.append(rec); onset += d
        abs_onset += expect
    return {'pieceId': piece_id, 'source': 'desk truth kit, by eye with Audiveris heads; proofed by Dann: NO',
            'vocalPart': {'partName': 'Голос'}, 'clef': {'sign': hdr['clef'][0], 'line': hdr['clef'][1]},
            'keySignature': {'fifths': key}, 'sungVerseNumbers': [1], 'measureDurations': mdur,
            'verses': [{'verseNumber': 1, 'verseLabel': 'Verse 1', 'notes': notes}]}

if __name__ == '__main__':
    src = open(sys.argv[1], encoding='utf-8').read(); stem = sys.argv[1].rsplit('.', 1)[0]
    hdr, bars = parse(src)
    for m in check(hdr, bars): print('CHECK', m)
    open(stem + '.musicxml', 'w', encoding='utf-8').write(to_musicxml(hdr, bars))
    starts = hdr.get('systems', [0]) + [len(bars)]
    for si in range(len(starts) - 1):
        sub = bars[starts[si]:starts[si + 1]]
        h2 = dict(hdr); h2['anacrusis'] = hdr['anacrusis'] and si == 0
        # carry the metre in force at the system's first bar
        h2['time'] = tsig_of(hdr, bars, starts[si])
        open(f'{stem}-s{si + 1}.musicxml', 'w', encoding='utf-8').write(to_musicxml(h2, sub))
    json.dump(to_truth(hdr, bars, stem.split('/')[-1]), open(stem + '.truth.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    n = sum(1 for _, _, ev in bars for e in flat(ev) if e['kind'] == 'note')
    s = sum(1 for _, _, ev in bars for e in flat(ev) if e['kind'] == 'note' and e['syl'] and e['syl'] != '-')
    print(f'{len(bars)} bars, {n} notes, {s} syllables')
