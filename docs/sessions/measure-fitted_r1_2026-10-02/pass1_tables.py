import json, sys, numpy as np, collections
sys.path.insert(0, '.')
P = json.load(open('pass1.json'))
NAME = {'1': 'Sunless 1', '4': 'Sunless 4', '5': 'Sunless 5', '6': 'Sunless 6', '7': 'Tchaikovsky'}
NMIN = 5
def fmt(v, key, pooled, nmin=NMIN, d=2, spread=True):
    """page value if n >= nmin, else the song's pooled value marked with *"""
    use = v; star = ''
    if v.get('n', 0) < nmin: use = pooled; star = '*'
    if use.get('n', 0) == 0: return 'none'
    s = f"{use['median']:.{d}f}"
    if spread: s += f" [{use['p5']:.{d}f}, {use['p95']:.{d}f}]"
    return f"{s} ({v.get('n',0)}){star}" if star else f"{s} ({use['n']})"
def md(rows, head):
    out = ['| ' + ' | '.join(head) + ' |', '|' + '---|' * len(head)]
    for r in rows: out.append('| ' + ' | '.join(str(x) for x in r) + ' |')
    return '\n'.join(out)
A = []; B1 = []; B2 = []; B3 = []; pooled_marks = collections.defaultdict(list)
for song in ('1', '4', '5', '6', '7'):
    pl = P[song]['pooled']
    for pg in P[song]['pages']:
        if pg.get('error'): A.append([NAME[song], pg['page'], 'raises in the reader'] + [''] * 7); continue
        V = pg['values']; T = pg['truth']; cs = V['clear_stems']; cd = V['clear_dots']
        A.append([NAME[song], pg['page'], pg['heads'], cs['plain'], cs['flag1'], cs['flag2'], cs['beam1'], cs['beam2'], f"{cd['dotted']} / {cd['undotted']}",
                  f"{T['stem_contradicted']} of {T['stem_matched']}", f"{T['dot_contradicted']} of {T['dot_matched']}"])
        B1.append([NAME[song], pg['page'], fmt(V['head_a_s'], 'a', pl['head_a_s'], 5, 3, False), fmt(V['head_b_s'], 'b', pl['head_b_s'], 5, 3, False), fmt(V['head_tilt'], 't', pl['head_tilt'], 5, 0),
                   fmt(V['stem_len_s'], 'l', pl['stem_len_s'], 5, 2, False), fmt(V['stem_thick_s'], 't', pl['stem_thick_s'], 5, 3, False), fmt(V['line_thick_s'], 'lt', pl['line_thick_s'], 5, 3, False)])
        B2.append([NAME[song], pg['page'], fmt(V['flag1_reach_s'], 'r', pl['flag1_reach_s'], 5, 2), fmt(V['flag1_travel_s'], 'tr', pl['flag1_travel_s'], 5, 2), fmt(V['beam_thick_s'], 'bt', pl['beam_thick_s'], 5, 2)])
        B3.append([NAME[song], pg['page'], fmt(V['dot_d_s'], 'd', pl['dot_d_s'], 5, 2, False), fmt(V['dot_dx_centre_s'], 'dx', pl['dot_dx_centre_s'], 5, 2, False), fmt(V['dot_dx_edge_s'], 'dxe', pl['dot_dx_edge_s'], 5, 2, False),
                   fmt(V['dot_dy_on_line_s'], 'dyl', pl['dot_dy_on_line_s'], 5, 2, False), fmt(V['dot_dy_in_space_s'], 'dys', pl['dot_dy_in_space_s'], 5, 2, False)])
open('pass1_tables.md', 'w').write('### A\n' + md(A, ['Song', 'page', 'heads', 'plain', 'flag1', 'flag2', 'beam1', 'beam2', 'dotted / undotted', 'stem class contradicted by the truth', 'dot contradicted by the truth']) +
    '\n\n### B1\n' + md(B1, ['Song', 'page', 'head a (s)', 'head b (s)', 'head tilt (deg) [p5, p95]', 'stem length (s)', 'stem thickness (s)', 'line thickness (s)']) +
    '\n\n### B2\n' + md(B2, ['Song', 'page', 'flag reach (s)', 'flag travel (s)', 'beam thickness (s)']) +
    '\n\n### B3\n' + md(B3, ['Song', 'page', 'dot diameter (s)', 'dot centre dx (s)', 'dot gap from head edge (s)', 'dot up, head on a line (s)', 'dot up, head in a space (s)']))
# the song level
rows = []
for song in ('1', '4', '5', '6', '7'):
    pl = P[song]['pooled']
    def m(k, d=3): return (f"{pl[k]['median']:.{d}f}" if pl[k].get('n') else 'none') + f" ({pl[k].get('n',0)})"
    rows.append([NAME[song], m('head_a_s'), m('head_b_s'), m('head_tilt', 0), m('stem_len_s', 2), m('stem_thick_s'), m('flag1_reach_s', 2), m('flag1_travel_s', 2), m('beam_thick_s', 2), m('dot_d_s', 2), m('dot_dx_centre_s', 2), m('line_thick_s')])
open('pass1_tables.md', 'a').write('\n\n### C\n' + md(rows, ['Song', 'head a', 'head b', 'tilt', 'stem length', 'stem thickness', 'flag reach', 'flag travel', 'beam thickness', 'dot diameter', 'dot dx', 'line thickness']))
print(open('pass1_tables.md').read())
