"""Row 77 harness. Never prints anything of a sealed song but its name and same/changed.
  python3 run.py drop <tag> <name>...      drop each song through the intake (dev server, or SITE), keep its reading in <tag>/drops
  python3 run.py cmp <tagA> <tagB> <name>...   print 'same' or 'changed' per song (tag 'r74' = row 74's rule-on readings, 'r76' = row 76's)
  python3 run.py lines <tag> <name>...     final-line.ts under tsx, for opened songs only (S T V X K L M P; G H I J N O lines only)
Names: Q..Z (set 3), G..P (set 2), A B C E F (set 1), and the 17 build songs by stem."""
import glob, json, os, shutil, subprocess, sys, filecmp
HOME = os.path.expanduser('~'); REPO = f'{HOME}/Desktop/ilya-rewrite'; HERE = os.path.dirname(os.path.abspath(__file__))
CONV = f'{REPO}/docs/sessions/measure-checks_r1_2026-10-05/scripts/scorer/conv.py'
LINE = ['npx', '--no-install', 'tsx', f'{REPO}/docs/sessions/measure-final-test_r1_2026-10-08/final-line.ts']
SEALED = set('QRUWYZ')
src = {}
for L, p in zip('QRSTUVWXYZ', sorted(glob.glob(f'{HOME}/Downloads/_desk-heldout3-private/truth/*.pdf'))): src[L] = p
h2 = f'{HOME}/Downloads/_desk-2026-10-08/heldout2'
for L, p in zip('GHIJKLMNOP', sorted(glob.glob(h2 + '-scans/*.pdf'))): src[L] = p
sc = [s for s in sorted(glob.glob(f'{HOME}/Downloads/_desk-2026-10-07/heldout-scans/*.pdf')) if not os.path.basename(s).lower().startswith(('grechaninov', 'varlamov'))]
for L, p in zip('ABCDEF', sc):
    if L != 'D': src[L] = p
for p in sorted(glob.glob(f'{HOME}/Downloads/_code-metre-r6/songpdf/*.pdf')): src[os.path.basename(p)[:-4]] = p
BUILD = [os.path.basename(p)[:-4] for p in sorted(glob.glob(f'{HOME}/Downloads/_code-metre-r6/songpdf/*.pdf'))]
def drops(tag):
    if tag == 'r74': return [f'{REPO}/docs/sessions/measure-m-p-r74_2026-10-11/rule-on/drops', f'{REPO}/docs/sessions/measure-m-p-r74_2026-10-11/step3on/drops']
    if tag == 'r76': return [f'{REPO}/docs/sessions/measure-final-test-set3_2026-10-11/ten/drops']
    return [f'{HERE}/{tag}/drops']
def reading(tag, n):
    for d in drops(tag):
        if os.path.exists(f'{d}/{n}.musicxml'): return f'{d}/{n}.musicxml'
    return None
def names(args): return [x for a in args for x in (BUILD if a == 'BUILD' else [a])]
cmd, tag = sys.argv[1], sys.argv[2]
if cmd == 'drop':
    out = f'{HERE}/{tag}'; os.makedirs(out + '/drops', exist_ok=True)
    for n in names(sys.argv[3:]):
        pdf = f'{out}/{n}.pdf'; shutil.copyfile(src[n], pdf)
        d = subprocess.run(['node', f'{HERE}/drop.mjs', n, pdf, out + '/drops'], capture_output=True, text=True)
        j = json.load(open(f'{out}/drops/{n}.json'))
        if j['refused'] and not j['logs']:
            # the page reloaded before the reader started (a dev-server reload): one second drop, said so
            os.makedirs(f'{HERE}/stalled', exist_ok=True); shutil.move(f'{out}/drops/{n}.json', f'{HERE}/stalled/{tag}-{n}.json')
            print(f'{n}: second drop after a load fault', flush=True)
            d = subprocess.run(['node', f'{HERE}/drop.mjs', n, pdf, out + '/drops'], capture_output=True, text=True)
        os.remove(pdf)
        print(d.stdout.strip() or f'{n}: drop failed', flush=True)
elif cmd == 'cmp':
    other = sys.argv[3]
    for n in names(sys.argv[4:]):
        a, b = reading(tag, n), reading(other, n)
        print(n, 'missing' if not (a and b) else ('same' if filecmp.cmp(a, b, shallow=False) else 'changed'), flush=True)
elif cmd == 'lines':
    for n in names(sys.argv[3:]):
        assert n not in SEALED, 'sealed'
        x = reading(tag, n); rd = f'{HERE}/{tag}/{n}.read.json'; os.makedirs(os.path.dirname(rd), exist_ok=True)
        subprocess.run(['python3', CONV, rd, x], check=True, capture_output=True)
        be = json.load(open(x[:-9] + '.json'))['backend']
        stem = src[n][:-4]
        tdir = os.path.dirname(stem).replace('-scans', '-truth-r2/truth') if n in 'GHIJKLMNOP' else os.path.dirname(stem)
        base = f'{tdir}/{os.path.basename(stem)}'
        ts = [('original', base + '.truth.json')]
        if n in 'KLMPSTVX':
            c = base + '.truth.corrected.json'
            ts.append(('corrected', c if os.path.exists(c) else base + '.truth.json'))
        for name, t in ts:
            keep = f'{HERE}/{tag}/keep-{name}'
            r = subprocess.run(LINE + ['song', n, be, t, rd, keep], capture_output=True, text=True, cwd=REPO)
            print(f'{name}: ' + (r.stdout.strip() or r.stderr.strip()[-300:]), flush=True)
