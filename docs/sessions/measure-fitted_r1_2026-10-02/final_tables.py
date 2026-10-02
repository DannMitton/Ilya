import json, sys, collections, re
sys.path.insert(0, '.'); import agg
out = []
rows34 = []; reasons = {}; tmpl_rows = []; bound_rows = []
for song in agg.SONGS:
    r, sc = agg.load(song)
    tab = collections.Counter(); tr = collections.Counter(); rs = collections.Counter()
    for n in r['notes']:
        t = n['trial']
        dur = n['read_dur'] if t['keep_reader'] else t['dur']
        j = agg.judge(tuple(dur) if dur else None, n['truth']); jr = agg.judge(tuple(n['read_dur']) if n['read_dur'] else None, n['truth'])
        if j is None: continue
        grp = 'kept' if t['keep_reader'] else ('pass 2' if t['pass2'] else 'clear')
        tab[(grp, j)] += 1; tr[(grp, jr)] += 1
        if grp == 'pass 2' and t['dur'] is None:
            for w in (t['why_stem'], t['why_dot']):
                if w: rs[re.sub(r'[0-9.]+x', 'Nx', re.sub(r'_(plain|flag1|flag2|beam1|beam2|dotted|undotted)_', '_K_', w))[:75]] += 1
    for grp in ('clear', 'pass 2', 'kept'):
        rows34.append((agg.NAME[song], grp, *[tab[(grp, k)] for k in ('right', 'wrong', 'abstained')], *[tr[(grp, k)] for k in ('right', 'wrong', 'abstained')]))
    reasons[song] = rs.most_common(6)
    for p in r['account']['pages']:
        tmpl_rows.append((agg.NAME[song], p['page'], ', '.join('%s %s (n %d)' % (k, v[0], v[1]) for k, v in sorted(p['templates'].items())) or 'none',
                          str(p['beam'][0]), str(p['dot'][0]) if p['dot'][0] else 'none'))
        bs = p['bound_src']; b = p['bounds']
        bound_rows.append((agg.NAME[song], p['page'], *[('%.3f' % b[k] if b[k] is not None else 'none') + ' (%s %d)' % (bs[k][0], bs[k][1]) for k in ('stem_plain', 'stem_flag1', 'dot_undotted', 'dot_dotted')], '%.2f / %.2f (%s %d)' % (p['rt_bound']['U'], p['rt_bound']['V'], p['rt_bound']['src'], p['rt_bound']['n'])))
def md(rows, head):
    o = ['| ' + ' | '.join(head) + ' |', '|' + '---|' * len(head)]
    for r in rows: o.append('| ' + ' | '.join(str(x) for x in r) + ' |')
    return '\n'.join(o)
open('final_tables.md', 'w').write('### T34\n' + md(rows34, ['Song', 'notes', 'trial right', 'trial wrong', 'trial abstained', 'row 23 right', 'row 23 wrong', 'row 23 abstained']) +
    '\n\n### TMPL\n' + md(tmpl_rows, ['Song', 'page', 'flag outlines used (source, count)', 'beam values', 'dot values']) +
    '\n\n### BOUNDS\n' + md(bound_rows, ['Song', 'page', 'quarter bound', 'eighth (flag) bound', 'undotted bound', 'dotted bound', 'round trip U / V bound']) +
    '\n\n### REASONS\n' + '\n'.join('%s: %s' % (agg.NAME[s], v) for s, v in reasons.items()))
print(open('final_tables.md').read())
