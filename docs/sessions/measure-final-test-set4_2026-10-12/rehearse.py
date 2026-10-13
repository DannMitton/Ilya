"""Row 86 rehearsal (from row 76's rehearse.py): K and M (held-out set 2) through the deployed alias. Every reading,
conv.py output, keep, and stderr goes under ~/Downloads/_desk-heldout4-private/run/rehearsal; this prints only the drop
lines, the final-line.ts lines, each reading's stamp, and whether the lines equal row 76's rehearsal-lines.txt."""
import glob, json, os, shutil, subprocess, sys
HOME = os.path.expanduser('~'); REPO = f'{HOME}/Desktop/ilya-rewrite'; HERE = os.path.dirname(os.path.abspath(__file__))
CONV = f'{REPO}/docs/sessions/measure-checks_r1_2026-10-05/scripts/scorer/conv.py'
LINE = f'{REPO}/docs/sessions/measure-final-test_r1_2026-10-08/final-line.ts'
ROW76 = f'{REPO}/docs/sessions/measure-final-test-set3_2026-10-11/rehearsal-lines.txt'
STAMP = 'homr-web@0.2.0-ilya.7/465'
base = f'{HOME}/Downloads/_desk-2026-10-08/heldout2'
scans = sorted(glob.glob(base + '-scans/*.pdf')); letters = dict(zip('GHIJKLMNOP', scans))
out = f'{HOME}/Downloads/_desk-heldout4-private/run/rehearsal'; os.makedirs(out, exist_ok=True)
err = open(f'{out}/stderr.log', 'a')
env = dict(os.environ, SITE='https://ilya-git-shane-dannmittons-projects.vercel.app/')
lines = []
for L in 'KM':
    scan = letters[L]; stem = os.path.basename(scan)[:-4]; pdf = f'{out}/{L}.pdf'; shutil.copyfile(scan, pdf)
    d = subprocess.run(['node', f'{HERE}/drop.mjs', L, pdf, out + '/drops'], capture_output=True, text=True, env=env)
    err.write(d.stderr); os.remove(pdf)
    print(d.stdout.strip() or f'{L}: drop failed', flush=True)
    dj = json.load(open(f'{out}/drops/{L}.json'))
    print(f'{L}: stamp {dj["stamp"]} ({"as required" if dj["stamp"] == STAMP else "DIFFERS from " + STAMP})', flush=True)
    if dj['refused']: print(f'{L}: refused'); continue
    tdir = base + '-truth-r2/truth/'
    truths = [('original', tdir + stem + '.truth.json')]
    c = tdir + stem + '.truth.corrected.json'
    if os.path.exists(c): truths.append(('corrected', c))
    elif L == 'M': truths.append(('corrected', tdir + stem + '.truth.json'))
    rd = f'{out}/{L}.read.json'
    r = subprocess.run(['python3', CONV, rd, f'{out}/drops/{L}.musicxml'], capture_output=True, text=True); err.write(r.stderr)
    for name, t in truths:
        keep = f'{out}/keep-{name}'; os.makedirs(keep, exist_ok=True)
        r = subprocess.run(['npx', '--no-install', 'tsx', LINE, 'song', L, dj['backend'], t, rd, keep], capture_output=True, text=True, cwd=REPO)
        err.write(r.stderr); line = f'{name}: ' + (r.stdout.strip() or 'final-line.ts printed nothing (stderr kept privately)')
        lines.append(line); print(line, flush=True)
want = [l for l in open(ROW76).read().splitlines() if l.startswith(('original:', 'corrected:'))]
print('rehearsal lines equal row 76: ' + ('yes' if lines == want else 'NO'), flush=True)
