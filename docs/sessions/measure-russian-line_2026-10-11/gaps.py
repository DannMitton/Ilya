"""Row 80: for each extra note, the horizontal distance (imgpos x) to the nearest note of the same bar that the scorer counts
as the song, in staff spaces (the system's staff space from systems.jsonl). Usage: python3 gaps.py <letter>"""
import json,sys
L=sys.argv[1]
ns=[json.loads(l) for l in open(f'{L}.notes.jsonl')]; ns=[n for n in ns if not n['chord']]
st=json.load(open(f'{L}.status.json'))
sy=[json.loads(l) for l in open(f'{L}.systems.jsonl')]
for n,s in zip(ns,st):
    if s['status']!='extra': continue
    sp=next(b['space'] for b in sy if b['page']==n['page'] and b['bars'][0]<=n['bar']<=b['bars'][1])
    song=[m for m,t in zip(ns,st) if t['status']=='song' and m['bar']==n['bar'] and m['page']==n['page']]
    d=min((abs(m['x']-n['x']) for m in song),default=None)
    print(f"{L} bar {n['bar']:3} x {n['x']:5}  nearest song note {d if d is not None else '-':>5} px = {round(d/sp,1) if d is not None else '-'} spaces")
