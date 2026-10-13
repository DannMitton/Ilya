"""Row 89: 4F's differences against the corrected truth, each as file index, syllable, truth, and reading.
  python3 misreads.py <tag>     (tag: before or after; reads ~/Downloads/_desk-heldout4-private/run/r89-<tag>/)"""
import json, os, sys
from fractions import Fraction as F
P4 = os.path.expanduser('~/Downloads/_desk-heldout4-private'); tag = sys.argv[1]
t = json.load(open(f'{P4}/truth/gliere_op12_no6_chego_khochu.truth.corrected.json'))['verses'][0]['notes']
truth = [e for e in t if e['type'] == 'note' or e['type'] == 'rest']
s = json.load(open(f'{P4}/run/r89-{tag}/keep-corrected/4F.score.json'))
rd = [e for e in json.load(open(f'{P4}/run/r89-{tag}/4F.read.json'))['events']]
NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
def dur(d): return None if d is None else str(F(d['numerator'], d['denominator']))
def say(e): return f"{e.get('pitch') or e.get('midi')} (midi {e.get('midi')}), {dur(e.get('duration'))}" if e['type'] == 'note' else f"rest, {dur(e.get('duration'))}"
for d in s['differences']:
    te = truth[d['truthIndex']] if d.get('truthIndex') is not None else None
    re = rd[d['readerIndex']] if d.get('readerIndex') is not None else None
    print(f"{d['kind']}: file index {d.get('truthBar')}, «{te.get('syllable') if te else ''}»; truth {say(te) if te else '-'}; reading {say(re) if re else '-'}")
print(len(s['differences']), 'differences')
