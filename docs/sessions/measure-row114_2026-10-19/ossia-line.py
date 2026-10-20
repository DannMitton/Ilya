# ossia-line (row 114): the reader notes that fall in the truth's ossia bars, which final-line counts as extra.
# Reader bars are paired to truth bars by the scorer's own barMetres. Desk, 2026-10-19.
import json, sys
label, truth, score, line = sys.argv[1:5]
t = json.load(open(truth)); s = json.load(open(score)); c = json.load(open(line))
oss = {o['measureIndex'] for o in t.get('ossia', [])}
pair = {b['readerBar']: b['truthBar'] for b in s['barMetres']}
read = json.load(open(sys.argv[5]))
n = sum(1 for d in s['differences'] if d['kind'] == 'extra' and pair.get(d['readerBar']) in oss and read['events'][d['readerIndex']]['type'] == 'note')
r = round(1000 * (c['right'] - (c['extra'] - n)) / c['printed']) / 10
print(f"{label}: {n} extra notes fall in the {len(oss)} ossia bars; without them the score is {r:.1f}")
