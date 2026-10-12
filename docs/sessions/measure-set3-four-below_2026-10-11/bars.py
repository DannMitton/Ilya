"""Row 77: truth and reading side by side for chosen bars of an opened song. Usage: python3 bars.py <letter> <bar>..."""
import json,sys,os
H=os.path.dirname(os.path.abspath(__file__))
m=json.load(open(f'{H}/four.json')); L=sys.argv[1]
tp=m[L][:-4]+('.truth.corrected.json' if os.environ.get('CORR') else '.truth.json')
t=json.load(open(tp)); r=json.load(open(os.environ.get('READ',f'{H}/../measure-final-test-set3_2026-10-11/ten/{L}.read.json')))
N=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
nm=lambda e: 'rest' if e['type']=='rest' else N[e['midi']%12]+str(e['midi']//12-1)
du=lambda d: f"{d['numerator']}/{d['denominator']}" if d else '?'
for b in map(int,sys.argv[2:]):
    tn=sorted([n for n in t['verses'][0]['notes'] if n['measureIndex']==b],key=lambda n:n['onsetAbsolute'])
    print(f'bar {b} truth:',' '.join(f"{nm(n)}:{du(n['duration'])}{'?' if n.get('unsure') else ''}{('«'+n['syllable']+'»') if n.get('syllable') else ''}" for n in tn))
    print(f'bar {b} read :',' '.join(f"{nm(e)}:{du(e['duration'])}" for e in r['events'] if e['measureIndex']==b))
