# usage: python3 mkread.py <readsDir>   -- turns songN.raw.json (the reader's output) into songN.read.json = {events, bars} for the scorer
import json, sys, glob, os
d = sys.argv[1]
for f in sorted(glob.glob(os.path.join(d, 'song*.raw.json'))):
    r = json.load(open(f))
    ro = r['ro']
    out = dict(events=ro['verses'][0]['notes'], bars=ro['measures'])
    json.dump(out, open(f.replace('.raw.json', '.read.json'), 'w'))
    print(os.path.basename(f), len(out['events']), len(out['bars']), r.get('error'))
