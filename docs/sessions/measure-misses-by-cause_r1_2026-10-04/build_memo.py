# usage: python3 build_memo.py memo_template.md out.md   -- inlines the tables from tables_ilya.md, tables_homr.md and the results files
import json, re, sys
tpl = open(sys.argv[1]).read()
def sections(path):
    txt = open(path).read()
    parts = re.split(r'^### ', txt, flags=re.M)
    d = {}
    for p in parts[1:]:
        head, _, body = p.partition('\n')
        key = head.split('.')[0].split(' ')[0] if head[0] in 'AB' else head
        d[key] = body.strip('\n')
    return d
ilya = sections('tables_ilya.md')
homr = sections('tables_homr.md')
def a2_split(body):
    i = body.index('Sensitivity of')
    a2 = body[:i].strip('\n')
    rest = body[i:].split('\n', 1)[1].strip('\n')
    return a2, rest
ilya['A2'], ilya['A2c'] = a2_split(ilya['A2'])
def compact(path, label):
    r = json.load(open(path)); T = r['total']['totals']
    names = {'1': 'Sunless 1', '4': 'Sunless 4', '5': 'Sunless 5', '6': 'Sunless 6', '7': 'Tchaikovsky'}
    g = lambda d, k: d.get(k, 0)
    rows = ['| Song | Printed | Right | Not found | Pitch only | Length only | Both | Extra notes | Pitch only: sign | staff position | octave | Length only: abstained | dot | flags or beams | other |', '|' + ' --- |' * 15]
    for k in ['1', '4', '5', '6', '7']:
        c = r[k]['classes']; p = r[k]['pitchCauseClass3']; l = r[k]['lengthCauseClass4']
        rows.append(f"| {names[k]} | {r[k]['counts']['truthNotes']} | {c['right']} | {c['notFound']} | {c['pitchOnly']} | {c['lengthOnly']} | {c['both']} | {r[k]['counts']['extra']} | {g(p,'a')+g(p,'a-abstained')} | {g(p,'b')} | {g(p,'c')} | {g(l,'a-abstained')} | {g(l,'dot')} | {g(l,'flags')} | {g(l,'other')} |")
    rows.append(f"| All five | {T['truthNotes']} | {T['class.right']} | {T['class.notFound']} | {T['class.pitchOnly']} | {T['class.lengthOnly']} | {T['class.both']} | {T['extras']} | {T.get('pitchC3.a',0)+T.get('pitchC3.a-abstained',0)} | {T.get('pitchC3.b',0)} | {T.get('pitchC3.c',0)} | {T.get('lenC4.a-abstained',0)} | {T.get('lenC4.dot',0)} | {T.get('lenC4.flags',0)} | {T.get('lenC4.other',0)} |")
    return f'**{label}**\n\n' + '\n'.join(rows)
homr['C'] = compact('results_homr.json', 'homr main, per song and in total (pitch only and length only are class 3 and class 4, split as in section 2; sign is read-wrong plus abstained)') + '\n\n' + compact('results.json', "Ilya's reader, the same columns, for comparison")
def sub(m):
    src, key = m.group(1), m.group(2)
    return {'ilya': ilya, 'homr': homr}[src][key]
out = re.sub(r'\{\{(ilya|homr):([A-Za-z0-9]+)\}\}', sub, tpl)
open(sys.argv[2], 'w').write(out)
print(len(out.split('\n')), 'lines;', len(re.findall(r'\{\{', out)), 'placeholders left;', 'em dashes:', out.count('—'))
