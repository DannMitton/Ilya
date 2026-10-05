"""4e, check 1: on each page, the parts must hold the same number of bars. Reading alone (each page's MusicXML,
all parts, before the join). A page is flagged when its parts hold different numbers of <measure>. A flag is
right when the page holds at least one scorer difference of kind 'extra' or 'missing' in the joined voice part
(a bar or note the reading adds or drops); false otherwise.
Also counts, from the joined voice part, bars holding a <chord/> or a <backup>/<forward> (two notes at once on
the sung line), and whether each holds a scorer difference.
Writes out/tables/4e-partbars.csv."""
import csv
from lib import SONGS, CHK, parse, load_song, diff_places

T = f'{CHK}/out/tables'
rows = []
for song, (pages, _) in SONGS.items():
    S = load_song(song)
    diffs, _ = diff_places(S)
    for p in pages:
        root = parse(f'{CHK}/in/{p}.musicxml')
        counts = [len(part.findall('measure')) for part in root.findall('part')]
        bars = [r['index'] for r in S['joined'] if r['page'] == p]
        on_page = [d for d in diffs if d['readerBarPlaced'] in bars]
        addrop = [d for d in on_page if d['kind'] in ('extra', 'missing')]
        flag = len(set(counts)) > 1
        rows.append(dict(song=song, page=p, measuresPerPart=' '.join(map(str, counts)), flagged=flag,
                         differencesOnPage=len(on_page), extraOrMissingOnPage=len(addrop),
                         status=('right' if flag and addrop else 'false' if flag else
                                 'missed' if addrop else 'pass')))
        print(rows[-1])
    two = [r for r in S['joined'] if any(n['chord'] for n in r['notes']) or r['backup'] or r['forward']]
    for r in two:
        ds = [d for d in diffs if d['readerBarPlaced'] == r['index']]
        print('   two at once:', song, 'bar', r['index'] + 1, r['page'], 'chord' if any(n['chord'] for n in r['notes']) else 'backup',
              'differences', [d['kind'] for d in ds])
with open(f'{T}/4e-partbars.csv', 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)
from collections import Counter
print(Counter(r['status'] for r in rows))
