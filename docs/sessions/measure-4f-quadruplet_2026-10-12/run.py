"""Row 89 harness (from row 77's run.py). Never prints anything of a sealed song but its label and same/changed.
  python3 run.py drop <tag> <name>...          drop each song through the intake on the dev server; readings of the 38 in <tag>/drops,
                                               set 4 (4A..4J) privately in ~/Downloads/_desk-heldout4-private/run/r89-<tag>/drops
  python3 run.py cmp <tagA> <tagB> <name>...   'same' or 'changed' per song (tag 'r77' = row 77's after readings, 'r86' = row 86's set 4)
  python3 run.py line <tag> 4F                 final-line.ts for 4F against the original and the corrected truth
  python3 run.py sealed-line <tag> <label>     final-line.ts for a sealed set 4 song: its score line only, for a song that changed
Names: Q..Z (set 3), G..P (set 2), A B C E F (set 1), the 17 build songs by stem, and 4A..4J (set 4, glob order)."""
import glob, json, os, shutil, subprocess, sys, filecmp
HOME = os.path.expanduser('~'); REPO = f'{HOME}/Desktop/ilya-rewrite'; HERE = os.path.dirname(os.path.abspath(__file__))
R77 = f'{REPO}/docs/sessions/measure-set3-four-below_2026-10-11'
CONV = f'{REPO}/docs/sessions/measure-checks_r1_2026-10-05/scripts/scorer/conv.py'
LINE = ['npx', '--no-install', 'tsx', f'{REPO}/docs/sessions/measure-final-test_r1_2026-10-08/final-line.ts']
P4 = f'{HOME}/Downloads/_desk-heldout4-private'
src = {}
for L, p in zip('QRSTUVWXYZ', sorted(glob.glob(f'{HOME}/Downloads/_desk-heldout3-private/truth/*.pdf'))): src[L] = p
h2 = f'{HOME}/Downloads/_desk-2026-10-08/heldout2'
for L, p in zip('GHIJKLMNOP', sorted(glob.glob(h2 + '-scans/*.pdf'))): src[L] = p
sc = [s for s in sorted(glob.glob(f'{HOME}/Downloads/_desk-2026-10-07/heldout-scans/*.pdf')) if not os.path.basename(s).lower().startswith(('grechaninov', 'varlamov'))]
for L, p in zip('ABCDEF', sc):
    if L != 'D': src[L] = p
for p in sorted(glob.glob(f'{HOME}/Downloads/_code-metre-r6/songpdf/*.pdf')): src[os.path.basename(p)[:-4]] = p
BUILD = [os.path.basename(p)[:-4] for p in sorted(glob.glob(f'{HOME}/Downloads/_code-metre-r6/songpdf/*.pdf'))]
S4 = sorted(glob.glob(f'{P4}/truth/*.pdf')); assert len(S4) == 10
for L, p in zip([f'4{c}' for c in 'ABCDEFGHIJ'], S4): src[L] = p
assert os.path.basename(src['4F']) == 'gliere_op12_no6_chego_khochu.pdf'
SET4 = [f'4{c}' for c in 'ABCDEFGHIJ']
PROTECTED = list('ABCEF') + BUILD + list('KLMPGHIJNOQRUWYZ')
SEALED4 = [L for L in SET4 if L != '4F']
def outdir(tag, n): return f'{P4}/run/r89-{tag}' if n in SET4 else f'{HERE}/{tag}'
def reading(tag, n):
    if tag == 'r77': d = f'{R77}/after/drops'
    elif tag == 'r86': d = f'{P4}/run/ten/drops'
    else: d = outdir(tag, n) + '/drops'
    x = f'{d}/{n}.musicxml'
    return x if os.path.exists(x) else None
def names(args):
    out = []
    for a in args: out += BUILD if a == 'BUILD' else PROTECTED if a == 'PROTECTED' else SEALED4 if a == 'SEALED4' else [a]
    return out
def score(tag, n, truth, keep):
    x = reading(tag, n); rd = outdir(tag, n) + f'/{n}.read.json'
    subprocess.run(['python3', CONV, rd, x], check=True, capture_output=True)
    be = json.load(open(x[:-9] + '.json'))['backend']
    r = subprocess.run(LINE + ['song', n, be, truth, rd, keep], capture_output=True, text=True, cwd=REPO)
    return r.stdout.strip() or 'final-line.ts printed nothing'
cmd, tag = sys.argv[1], sys.argv[2]
if cmd == 'drop':
    for n in names(sys.argv[3:]):
        out = outdir(tag, n); os.makedirs(out + '/drops', exist_ok=True)
        pdf = f'{out}/{n}.pdf'; shutil.copyfile(src[n], pdf)
        env = {k: v for k, v in os.environ.items() if k != 'SITE'}
        d = subprocess.run(['node', f'{R77}/drop.mjs', n, pdf, out + '/drops'], capture_output=True, text=True, env=env)
        j = json.load(open(f'{out}/drops/{n}.json'))
        if j['refused'] and not j['logs']:
            os.makedirs(f'{out}/stalled', exist_ok=True); shutil.move(f'{out}/drops/{n}.json', f'{out}/stalled/{n}.json')
            print(f'{n}: second drop after a load fault', flush=True)
            d = subprocess.run(['node', f'{R77}/drop.mjs', n, pdf, out + '/drops'], capture_output=True, text=True, env=env)
        os.remove(pdf)
        print(d.stdout.strip() or f'{n}: drop failed', flush=True)
elif cmd == 'cmp':
    other = sys.argv[3]
    for n in names(sys.argv[4:]):
        a, b = reading(tag, n), reading(other, n)
        print(n, 'missing' if not (a and b) else ('same' if filecmp.cmp(a, b, shallow=False) else 'changed'), flush=True)
elif cmd == 'line':
    base = src['4F'][:-4]
    for name, t in [('original', base + '.truth.json'), ('corrected', base + '.truth.corrected.json')]:
        keep = outdir(tag, '4F') + f'/keep-{name}'
        print(f'{name}: ' + score(tag, '4F', t, keep), flush=True)
elif cmd == 'sealed-line':
    n = sys.argv[3]; assert n in SEALED4
    print(score(tag, n, src[n][:-4] + '.truth.json', outdir(tag, n) + '/keep'), flush=True)
