"""N.135 stage 1, step A: for one song, every read event with its page and imgpos (the notes), and the scorer's alignment to the truth.
Usage: python3 prep.py <label> <musicxml> <truth.json>   -> writes notes/<label>.json and align/<label>.json
The events are conv.py's (the scorer's own converter, unchanged); each is paired, in order, with the note's text in the file to read its imgpos."""
import re, sys, json, os, subprocess, xml.etree.ElementTree as ET
HERE = os.path.dirname(os.path.abspath(__file__)); REPO = os.path.abspath(f'{HERE}/../../../..')  # row 82 retrain copy: one folder deeper
sys.path.insert(0, f'{REPO}/docs/sessions/measure-checks_r1_2026-10-05/scripts/scorer')
import conv
L, xmlp, truthp = sys.argv[1:4]; THR = int(sys.argv[4]) if len(sys.argv) > 4 else 500  # a page starts where a note stands more than THR px above the last placed note (row 80's notes.py: 1500)
os.makedirs(f'{HERE}/notes', exist_ok=True); os.makedirs(f'{HERE}/align', exist_ok=True); os.makedirs(f'{HERE}/read', exist_ok=True)
rd = conv.convert([xmlp]); json.dump(rd, open(f'{HERE}/read/{L}.json', 'w'))
txt = open(xmlp).read(); part = txt[txt.index('<part '):]; part = part[:part.index('</part>')]
raw_ms = re.findall(r'<measure[\s\S]*?</measure>', part)
root = ET.parse(xmlp).getroot(); p0 = root.findall('part')[0]; ms = p0.findall('measure')
assert len(raw_ms) == len(ms), (len(raw_ms), len(ms))
page = 1; last = None; evs = []; mi = 0
for m, rm in zip(ms, raw_ms):
    raws = re.findall(r'<note[\s>][\s\S]*?</note>', rm); ns = m.findall('note'); assert len(raws) == len(ns)
    bar = []
    for n, rn in zip(ns, raws):
        pos = re.search(r'imgpos:\s*(\d+),\s*(\d+)', rn); X = Y = None
        if pos:
            X, Y = int(pos[1]), int(pos[2])
            if last is not None and Y < last - THR: page += 1
            last = Y
        if (n.findtext('staff') or '1') != '1' or n.find('chord') is not None or n.find('grace') is not None: continue
        d = dict(bar=mi, rest=n.find('rest') is not None, x=X, y=Y, page=page, ntype=n.findtext('type'),
                 tieStop=any(t.get('type') == 'stop' for t in n.findall('tie')), tieStart=any(t.get('type') == 'start' for t in n.findall('tie')))
        if not d['rest']:
            pt = n.find('pitch'); d['midi'] = (int(pt.findtext('octave')) + 1) * 12 + conv.ST[pt.findtext('step')] + int(float(pt.findtext('alter') or 0))
        bar.append(d)
    if all(e['rest'] for e in bar) and len(bar) == 1: bar = []
    evs += bar; mi += 1
assert len(evs) == len(rd['events']), (len(evs), len(rd['events']))
for e, r in zip(evs, rd['events']): assert e['rest'] == (r['type'] == 'rest') and e['bar'] == r['measureIndex'] and e.get('midi') == r.get('midi'), (e, r)
json.dump(evs, open(f'{HERE}/notes/{L}.json', 'w'))
o = subprocess.run(['npx', '--no-install', 'tsx', f'{HERE}/status2.ts', truthp, f'{HERE}/read/{L}.json'], capture_output=True, text=True, cwd=REPO)
if o.returncode: print(o.stderr[-500:]); sys.exit(1)
a = json.loads(o.stdout); json.dump(a, open(f'{HERE}/align/{L}.json', 'w'))
nn = sum(1 for e in evs if not e['rest']); tn = sum(1 for t in a['truth'] if t['type'] == 'note'); ts = sum(1 for t in a['truth'] if t['syl'])
mt = [m for m in a['match'] if not evs[m[0]]['rest']]
print(f"{L}: read notes {nn}, truth notes {tn} ({ts} with a syllable), matched notes {len(mt)}, pages {page}")
