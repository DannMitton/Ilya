"""Row 74: drop a song through the intake, score it against each truth, print final-line.ts lines unedited.
Usage: python3 run.py <tag> <letter>...      (tag names the output folder: step1, step3on, ...)
Letters: K L M P (open) and G H I J N O (spent: lines only; no page is opened)."""
import glob, json, os, shutil, subprocess, sys
HOME = os.path.expanduser('~'); REPO = f'{HOME}/Desktop/ilya-rewrite'; HERE = os.path.dirname(os.path.abspath(__file__))
CONV = f'{REPO}/docs/sessions/measure-checks_r1_2026-10-05/scripts/scorer/conv.py'
LINE = f'{REPO}/docs/sessions/measure-final-test_r1_2026-10-08/final-line.ts'
base = f'{HOME}/Downloads/_desk-2026-10-08/heldout2'
scans = sorted(glob.glob(base + '-scans/*.pdf')); letters = dict(zip('GHIJKLMNOP', scans))
tag = sys.argv[1]; out = f'{HERE}/{tag}'; os.makedirs(out, exist_ok=True)
node = ['node', '--experimental-strip-types', '--no-warnings', LINE]
for L in sys.argv[2:]:
    scan = letters[L]; stem = os.path.basename(scan)[:-4]; pdf = f'{out}/{L}.pdf'; shutil.copyfile(scan, pdf)
    d = subprocess.run(['node', f'{HERE}/drop.mjs', L, pdf, out + '/drops'], capture_output=True, text=True)
    print(d.stdout.strip() or f'{L}: drop failed {d.stderr[-200:]}', flush=True)
    dj = json.load(open(f'{out}/drops/{L}.json'))
    tdir = base + '-truth-r2/truth/'
    truths = [('original', tdir + stem + '.truth.json')]
    c = tdir + stem + '.truth.corrected.json'
    if os.path.exists(c): truths.append(('corrected', c))
    elif L == 'M': truths.append(('corrected', tdir + stem + '.truth.json'))
    if dj['refused']: print(f'{L}: refused {dj["refused"]}'); continue
    rd = f'{out}/{L}.read.json'
    subprocess.run(['python3', CONV, rd, f'{out}/drops/{L}.musicxml'], check=True, capture_output=True)
    for name, t in truths:
        keep = f'{out}/keep-{name}'; os.makedirs(keep, exist_ok=True)
        r = subprocess.run(node + ['song', L, dj['backend'], t, rd, keep], capture_output=True, text=True, cwd=REPO)
        print(f'{name}: ' + (r.stdout.strip() or r.stderr.strip()), flush=True)
