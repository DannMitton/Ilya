"""Shared reading of homr's MusicXML for the checks. Reads only; writes nothing.

A reading is parsed with comments kept, so each note's imgpos comment is at hand.
"""
import xml.etree.ElementTree as ET, json, re
from fractions import Fraction as F

KIT = '/home/claude/wire-465/kit/kit'
CHK = '/home/claude/checks'
SONGS = {
    'tch':  (['tch-1', 'tch-2', 'tch-3'], 'tchaikovsky-op38-3.truth-draft.json'),
    'sun1': (['sun-01', 'sun-02'], 'mussorgsky_sunless-01_within-four-walls.truth.json'),
    'sun4': (['sun-03', 'sun-04'], 'mussorgsky_sunless-04_be-bored.truth.json'),
    'sun5': (['sun-05', 'sun-06', 'sun-07', 'sun-08', 'sun-09', 'sun-10', 'sun-11'], 'mussorgsky_sunless-05_elegy.truth.json'),
    'sun6': (['sun-12', 'sun-13', 'sun-14', 'sun-15', 'sun-16', 'sun-17'], 'mussorgsky_sunless-06_on-the-river.truth.json'),
}
# which program's reading each page is: the port's where the kit has it, desktop homr main's where it does not
SOURCE = {p: ('desktop main' if p == 'tch-1' else 'port') for s in SONGS.values() for p in s[0]}

TYPE = {'whole': F(1), 'half': F(1, 2), 'quarter': F(1, 4), 'eighth': F(1, 8), '16th': F(1, 16),
        '32nd': F(1, 32), '64th': F(1, 64), 'breve': F(2)}
ST = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
SHARPS = 'FCGDAEB'


def key_alter(fifths, step):
    """The alteration a key signature gives a step."""
    if fifths > 0:
        return 1 if step in SHARPS[:fifths] else 0
    if fifths < 0:
        return -1 if step in SHARPS[::-1][:-fifths] else 0
    return 0


def parse(path):
    return ET.parse(path, ET.XMLParser(target=ET.TreeBuilder(insert_comments=True))).getroot()


def written(n):
    """Written length of a note as conv.py computes it: type, dots, time-modification. None without a type."""
    d = TYPE.get(n.findtext('type'))
    if d is None:
        return None
    k = d
    for _ in n.findall('dot'):
        k /= 2
        d += k
    tm = n.find('time-modification')
    if tm is not None:
        d = d * int(tm.findtext('normal-notes')) / int(tm.findtext('actual-notes'))
    return d


def imgpos(n):
    for c in n:
        if c.tag is ET.Comment and 'imgpos' in (c.text or ''):
            m = re.search(r'imgpos:\s*(-?\d+),\s*(-?\d+)', c.text)
            return (int(m.group(1)), int(m.group(2)))
    return None


def note_info(n):
    p = n.find('pitch')
    d = dict(rest=n.find('rest') is not None, chord=n.find('chord') is not None, grace=n.find('grace') is not None,
             staff=n.findtext('staff') or '1', voice=n.findtext('voice') or '1', type=n.findtext('type'),
             dots=len(n.findall('dot')), tuplet=n.find('time-modification') is not None,
             written=written(n), dur=int(n.findtext('duration') or 0), imgpos=imgpos(n),
             accidental=n.findtext('accidental'))
    if p is not None:
        d['step'] = p.findtext('step')
        d['octave'] = int(p.findtext('octave'))
        d['alter'] = int(float(p.findtext('alter') or 0))
        d['midi'] = (d['octave'] + 1) * 12 + ST[d['step']] + d['alter']
    return d


def read_measures(root, part_index=0, staff='1'):
    """Each measure of one part, in order, with what is in force and what it holds on the given staff.

    For a part with one staff, staff '1' is everything. Keys and metres are tracked as homr writes them.
    """
    part = root.findall('part')[part_index]
    out = []
    state = dict(divisions=None, fifths=None, beats=None, beat_type=None)
    for mi, m in enumerate(part.findall('measure')):
        rec = dict(index=mi, number=m.get('number'), stated_key=[], stated_time=[], barlines=[], notes=[],
                   backup=0, forward=0, new_system=False, cursor_max=F(0))
        cursor = F(0)
        for c in m:
            if c.tag is ET.Comment:
                continue
            if c.tag == 'print' and c.get('new-system') == 'yes':
                rec['new_system'] = True
            if c.tag == 'attributes':
                for a in c:
                    if a.tag == 'divisions':
                        state['divisions'] = int(a.text)
                    elif a.tag == 'key':
                        state['fifths'] = int(a.findtext('fifths'))
                        rec['stated_key'].append(state['fifths'])
                    elif a.tag == 'time':
                        state['beats'], state['beat_type'] = int(a.findtext('beats')), int(a.findtext('beat-type'))
                        rec['stated_time'].append((state['beats'], state['beat_type']))
            elif c.tag == 'barline':
                rec['barlines'].append(dict(location=c.get('location'), style=c.findtext('bar-style'),
                                            ending=(c.find('ending').attrib if c.find('ending') is not None else None),
                                            repeat=(c.find('repeat').attrib if c.find('repeat') is not None else None)))
            elif c.tag == 'backup':
                rec['backup'] += 1
                cursor -= F(int(c.findtext('duration')), state['divisions'] * 4)
            elif c.tag == 'forward':
                rec['forward'] += 1
                cursor += F(int(c.findtext('duration')), state['divisions'] * 4)
            elif c.tag == 'note':
                ni = note_info(c)
                if ni['staff'] != staff:
                    # still moves the cursor in a multi-staff part, but this function is used per staff
                    if not ni['chord'] and not ni['grace']:
                        cursor += F(ni['dur'], state['divisions'] * 4)
                    continue
                ni['fifths'] = state['fifths']
                rec['notes'].append(ni)
                if not ni['chord'] and not ni['grace']:
                    cursor += F(ni['dur'], state['divisions'] * 4)
                    rec['cursor_max'] = max(rec['cursor_max'], cursor)
        rec.update(fifths=state['fifths'], beats=state['beats'], beat_type=state['beat_type'],
                   divisions=state['divisions'])
        out.append(rec)
    return out


def conv_events(measures):
    """The events conv.py makes from these measures, each with its note record: staff 1, no chord, no grace,
    and a bar holding a single rest and nothing else carries no event."""
    events = []
    for rec in measures:
        evs = []
        for ni in rec['notes']:
            if ni['staff'] != '1' or ni['chord'] or ni['grace']:
                continue
            evs.append(dict(type='rest' if ni['rest'] else 'note', measureIndex=rec['index'], note=ni))
        if len(evs) == 1 and evs[0]['type'] == 'rest':
            evs = []
        events += evs
    return events


def load_song(song):
    pages, truthf = SONGS[song]
    joined = read_measures(parse(f'{CHK}/out/joined/{song}.musicxml'))
    truth = json.load(open(f'{KIT}/truth/{truthf}'))
    score = json.load(open(f'{CHK}/out/score/{song}.score.json'))
    read = json.load(open(f'{CHK}/out/score/{song}.read.json'))
    # the same measures before the join, page by page, first part, staff 1 (the join keeps them all, in order)
    pre = []
    for p in pages:
        for rec in read_measures(parse(f'{CHK}/in/{p}.musicxml'), 0, '1'):
            rec['page'] = p
            pre.append(rec)
    assert len(pre) == len(joined), (song, len(pre), len(joined))
    for j, p in zip(joined, pre):
        j['page'] = p['page']
        j['page_measure'] = p['number']
        j['prejoin_notes'] = p['notes']
    events = conv_events(joined)
    # the events must be conv.py's own, one for one
    assert len(events) == len(read['events']), (song, len(events), len(read['events']))
    for e, r in zip(events, read['events']):
        assert e['type'] == r['type'] and e['measureIndex'] == r['measureIndex'], (song, e, r)
        if r['type'] == 'note':
            assert e['note']['midi'] == r['midi'], (song, e, r)
        wd = e['note']['written']
        assert (r['duration'] is None) == (wd is None)
        if wd is not None:
            assert F(r['duration']['numerator'], r['duration']['denominator']) == wd
    tevents = sorted(truth['verses'][0]['notes'], key=lambda n: n['onsetAbsolute'])
    return dict(song=song, pages=pages, joined=joined, truth=truth, tevents=tevents, score=score, events=events)


def diff_places(S):
    """Each scorer difference with the reader bar it falls in. A missing note has no reader event; it is put in
    the reader bar that holds most of the matched events of its truth bar (None when that bar has none)."""
    score = S['score']
    tb2rb = {}
    votes = {}
    for mt in score['matches']:
        tb = S['tevents'][mt['truthIndex']]['measureIndex']
        rb = S['events'][mt['readerIndex']]['measureIndex']
        votes.setdefault(tb, {}).setdefault(rb, 0)
        votes[tb][rb] += 1
    for tb, v in votes.items():
        tb2rb[tb] = max(v.items(), key=lambda kv: kv[1])[0]
    out = []
    for d in score['differences']:
        rb = d['readerBar']
        placed = 'reader event'
        if rb is None:
            rb = tb2rb.get(d['truthBar'])
            placed = 'by truth bar'
        out.append(dict(d, readerBarPlaced=rb, placed=placed))
    return out, tb2rb
