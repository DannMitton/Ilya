# Assemble one song's truth from its page truths (row 114). Desk, 2026-10-19.
# Whole-bar rests (measureRest) are dropped, as conv.py drops a bar of one rest.
# Notes on pages listed as unproofed are marked unsure, so final-line's second score sets them aside.
import json, sys
from fractions import Fraction as F
TR = sys.argv[1]; out = sys.argv[2]; stems = sys.argv[3].split(','); unproofed = set(sys.argv[4].split(',')) if len(sys.argv) > 4 and sys.argv[4] else set()
graces = []; notes = []; durs = []; ossia = []; mi = 0; t0 = F(0); first = None; dropped = 0
for s in stems:
    d = json.load(open(f'{TR}/{s}.truth.json'))
    if first is None: first = d
    for e in d['verses'][0]['notes']:
        if e.get('measureRest'): dropped += 1; continue
        if e['type'] == 'note' and e['duration']['numerator'] == 0: graces.append(dict(e, page=s)); continue
        e = dict(e); e['measureIndex'] += mi; e['onsetAbsolute'] = float(F(e['onsetAbsolute']).limit_denominator(10**6) + t0); e['page'] = s
        if s in unproofed and e['type'] == 'note': e['unsure'] = True
        notes.append(e)
    # a bar holding one rest and nothing else carries no event, as conv.py reads a reading
    for b in set(e['measureIndex'] for e in notes):
        bar = [e for e in notes if e['measureIndex'] == b]
        if len(bar) == 1 and bar[0]['type'] == 'rest': notes.remove(bar[0]); dropped += 1
    for o in d.get('ossia', []):
        o = dict(o); o['measureIndex'] += mi; o['page'] = s; ossia.append(o)
    for b in d['measureDurations']:
        durs.append(dict(index=b['index'] + mi, expectedDuration=b['expectedDuration']))
        t0 += F(b['expectedDuration']['numerator'], b['expectedDuration']['denominator'])
    mi += len(d['measureDurations'])
song = dict(pieceId=out.split('/')[-1].split('.')[0], source='row 114 song truth assembled by the desk from ' + ','.join(stems),
            vocalPart=first['vocalPart'], clef=first['clef'], keySignature=first['keySignature'], sungVerseNumbers=[1], graceNotes=graces,
            measureDurations=durs, ossia=ossia, verses=[dict(verseNumber=1, verseLabel='1', notes=notes)])
json.dump(song, open(out, 'w'), ensure_ascii=False)
n = sum(1 for e in notes if e['type'] == 'note'); u = sum(1 for e in notes if e.get('unsure'))
print(out.split('/')[-1], 'bars', mi, 'notes', n, 'rests', len(notes) - n, 'whole-bar rests dropped', dropped, 'unproofed notes', u, 'graces set apart', len(graces), 'ossia bars', len(ossia))
