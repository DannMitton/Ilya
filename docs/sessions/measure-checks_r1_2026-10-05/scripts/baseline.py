"""4a. The baseline: each song's joined voice part scored against its truth, every difference with its truth bar
and its reader bar, and how truth bars map onto reader bars.
Writes out/tables/4a-baseline.csv, 4a-differences.csv, 4a-barmap.json."""
import json, csv, os
from lib import SONGS, SOURCE, load_song, diff_places

os.makedirs('/home/claude/checks/out/tables', exist_ok=True)
T = '/home/claude/checks/out/tables'
rows, drows, barmap = [], [], {}
for song in SONGS:
    S = load_song(song)
    sc = S['score']
    n = sc['notes']
    rows.append(dict(song=song, pages=' '.join(f"{p}({SOURCE[p]})" for p in S['pages']), shift=sc['shift'],
                     truthBars=sc['bars']['truth'], readBars=sc['bars']['read'], barsAllRight=sc['bars']['allRight'],
                     truthNotes=n['truth'], readNotes=n['read'], matched=n['matched'], missing=n['missing'], extra=n['extra'],
                     pitchRight=n['pitchRight'], pitchWrong=n['pitchWrong'], lengthRight=n['lengthRight'], lengthWrong=n['lengthWrong'],
                     bothRight=n['bothRight'], truthRests=sc['rests']['truth'], readRests=sc['rests']['read'],
                     restsMatched=sc['rests']['matched'], restLengthRight=sc['rests']['lengthRight'],
                     score=round(sc['headline'], 2), differences=len(sc['differences'])))
    diffs, tb2rb = diff_places(S)
    for d in diffs:
        te = S['tevents'][d['truthIndex']] if d['truthIndex'] is not None else None
        re_ = S['events'][d['readerIndex']]['note'] if d['readerIndex'] is not None else None
        drows.append(dict(song=song, kind=d['kind'], truthBar=d['truthBar'], readerBar=d['readerBarPlaced'], placed=d['placed'],
                          truthMidi=(te or {}).get('midi'), truthDur=(f"{te['duration']['numerator']}/{te['duration']['denominator']}" if te else None),
                          readMidi=(re_ or {}).get('midi'), readStep=(re_ or {}).get('step'), readOctave=(re_ or {}).get('octave'),
                          readAlter=(re_ or {}).get('alter'), readType=(re_ or {}).get('type'), readDots=(re_ or {}).get('dots'),
                          readWritten=(str(re_['written']) if re_ else None), readRest=(re_ or {}).get('rest'),
                          page=(S['joined'][d['readerBarPlaced']]['page'] if d['readerBarPlaced'] is not None else None),
                          pageMeasure=(S['joined'][d['readerBarPlaced']]['page_measure'] if d['readerBarPlaced'] is not None else None),
                          imgpos=(re_ or {}).get('imgpos')))
    # runs of constant offset (reader bar minus truth bar), from the matched events
    pairs = sorted(set((S['tevents'][m['truthIndex']]['measureIndex'], S['events'][m['readerIndex']]['measureIndex']) for m in sc['matches']))
    runs = []
    for tb, rb in pairs:
        off = rb - tb
        if runs and runs[-1]['offset'] == off:
            runs[-1]['truthTo'] = tb; runs[-1]['readerTo'] = rb
        else:
            runs.append(dict(offset=off, truthFrom=tb, truthTo=tb, readerFrom=rb, readerTo=rb))
    # reader bars holding no matched event
    matched_rb = {rb for _, rb in pairs}
    unmatched_rb = [i for i in range(len(S['joined'])) if i not in matched_rb]
    # truth bars holding no event (voice silent in the truth)
    tbars_with = {e['measureIndex'] for e in S['tevents']}
    barmap[song] = dict(offsetRuns=runs, readerBarsWithNoMatchedEvent=unmatched_rb,
                        readerBarsEmptyAfterJoin=[r['index'] for r in S['joined'] if not r['notes']],
                        truthBarsWithNoEvent=[b['index'] for b in S['truth']['measureDurations'] if b['index'] not in tbars_with])
    print(song, rows[-1])
    print('   offset runs', [(r['offset'], f"t{r['truthFrom']}-{r['truthTo']}", f"r{r['readerFrom']}-{r['readerTo']}") for r in runs])
    print('   reader bars with no matched event', unmatched_rb)
    print('   truth bars with no event', barmap[song]['truthBarsWithNoEvent'])

with open(f'{T}/4a-baseline.csv', 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)
with open(f'{T}/4a-differences.csv', 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=list(drows[0].keys())); w.writeheader(); w.writerows(drows)
json.dump(barmap, open(f'{T}/4a-barmap.json', 'w'), indent=1)
print('differences written', len(drows))
