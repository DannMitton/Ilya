# conv-marks: the markings on each event conv.py keeps, in conv.py's order (row 114). Desk, 2026-10-19.
# Same walk as conv.py (staff 1, no chord notes, no graces, a bar of one rest carries no event).
import xml.etree.ElementTree as ET, json, sys
ARTS = ('accent','strong-accent','staccato','staccatissimo','tenuto','breath-mark','caesura')
def marks(n):
    m = []
    for nt in n.findall('notations'):
        for a in nt.findall('articulations'):
            for c in a:
                if c.tag in ARTS: m.append(c.tag)
        if nt.find('fermata') is not None: m.append('fermata')
        for s in nt.findall('slur'):
            if s.get('type') == 'start': m.append('slurStart')
            if s.get('type') == 'stop': m.append('slurStop')
    return sorted(set(m))
def convert(files):
    out = []
    for f in files:
        p = ET.parse(f).getroot().findall('part')[0]
        for m in p.findall('measure'):
            evs = []
            for n in m.findall('note'):
                if (n.findtext('staff') or '1') != '1': continue
                if n.find('chord') is not None: continue
                if n.find('grace') is not None: continue
                evs.append(dict(rest=n.find('rest') is not None, marks=marks(n)))
            if all(e['rest'] for e in evs) and len(evs) == 1: evs = []
            out += [e['marks'] for e in evs]
    return out
if __name__ == '__main__':
    json.dump(convert(sys.argv[2:]), open(sys.argv[1], 'w'))
