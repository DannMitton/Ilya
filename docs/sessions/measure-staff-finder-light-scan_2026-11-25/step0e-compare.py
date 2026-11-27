# Step 0e: matches the metre reader's windows before and after (same box and kind; after a bar line, left edges within
# one staff space)
# and lists every verdict that flips, every window only one side has, and every signature either side states.
# usage: python3 -I step0e-compare.py <workdir>
import sys, json

W = sys.argv[1] + '/'
m = json.load(open(W + 'step0e-metre.json'))
s = json.load(open(W + 'step0e-staves.json'))
tot = dict(staves=0, before=0, after=0, matched=0, flips=0, only_before=0, only_after=0, stated_before=0, stated_after=0, why=0, courtesy=0)
for name, r in m.items():
    b, a = r['before'], r['after']
    sp = b['space'] or a['space']
    print(f"== {name}: voice boxes {r['voice']}; unfound {b['unfound']} -> {a['unfound']}; small {b['small']} -> {a['small']}; windows {len(b['reads'])} -> {len(a['reads'])}")
    for i in r['voice']:
        sb, sa = s[name]['before'][i], s[name]['after'][i]
        if sb['st'] and sa['st']:
            print(f"  box {i}: x {sb['st']['x0']}-{sb['st']['x1']} -> {sa['st']['x0']}-{sa['st']['x1']}; bar lines {[round(v) for v in sb['bars']]} -> {[round(v) for v in sa['bars']]}")
    tot['staves'] += len(r['voice']); tot['before'] += len(b['reads']); tot['after'] += len(a['reads'])
    left = list(a['reads'])
    for p in b['reads']:
        # A staff has one start window, so it matches however far its left end moved.
        c = [q for q in left if q['box'] == p['box'] and q['kind'] == p['kind'] and (p['kind'] == 'start' or abs(q['x0'] - p['x0']) <= sp)]
        if c and p['kind'] == 'start' and abs(c[0]['x0'] - p['x0']) > sp:
            print(f"  start window of box {p['box']} moved {c[0]['x0'] - p['x0']} px: x {p['x0']} -> {c[0]['x0']}")
        if not c:
            tot['only_before'] += 1
            print(f"  ONLY BEFORE box {p['box']} {p['kind']} x {p['x0']}-{p['x1']}: {p['lab'] or 'nothing (' + str(p['why']) + ')'}")
            continue
        q = min(c, key=lambda q: abs(q['x0'] - p['x0'])); left.remove(q); tot['matched'] += 1
        if p['lab'] != q['lab']:
            tot['flips'] += 1
            print(f"  FLIP box {p['box']} {p['kind']} x {p['x0']} -> {q['x0']}: {p['lab'] or 'nothing (' + str(p['why']) + ')'} -> {q['lab'] or 'nothing (' + str(q['why']) + ')'}")
        elif p['why'] != q['why']:
            tot['why'] += 1
            print(f"  same verdict, new reason, box {p['box']} {p['kind']} x {p['x0']} -> {q['x0']}: {p['why']} -> {q['why']}")
        if p['courtesy'] != q['courtesy']:
            tot['courtesy'] += 1
            print(f"  COURTESY FLAG box {p['box']} {p['kind']} x {p['x0']}: {p['courtesy']} -> {q['courtesy']}")
    for q in left:
        tot['only_after'] += 1
        print(f"  ONLY AFTER box {q['box']} {q['kind']} x {q['x0']}-{q['x1']} courtesy {q['courtesy']}: {q['lab'] or 'nothing (' + str(q['why']) + ')'}")
    for label, side in (('before', b), ('after', a)):
        st = [f"box {e['box']} {e['kind']} x {e['x0']} {e['lab']}{' (courtesy)' if e['courtesy'] else ''}" for e in side['reads'] if e['lab']]
        tot['stated_' + label] += len(st)
        print(f"  stated {label}: {st if st else 'none'}")
print('== totals:', tot)
