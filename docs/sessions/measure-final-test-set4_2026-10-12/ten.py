"""Row 86 (from row 76's ten.py): the ten songs of held-out set 4, 4A to 4J in glob order, through the deployed alias.
Prints only drop lines by label, final-line.ts lines, and the total. Every scan copy, reading, conv.py output, keep, and
all stderr goes under ~/Downloads/_desk-heldout4-private/run/ten, so no path or stem reaches the terminal. A load fault
(no [omr] line) is dropped once more in a fresh context, as the brief's step 4 says; a second failure scores 0."""
import glob, json, os, shutil, subprocess
HOME = os.path.expanduser('~'); REPO = f'{HOME}/Desktop/ilya-rewrite'; HERE = os.path.dirname(os.path.abspath(__file__))
CONV = f'{REPO}/docs/sessions/measure-checks_r1_2026-10-05/scripts/scorer/conv.py'
LINE = ['npx', '--no-install', 'tsx', f'{REPO}/docs/sessions/measure-final-test_r1_2026-10-08/final-line.ts']
base = f'{HOME}/Downloads/_desk-heldout4-private/truth'
scans = sorted(glob.glob(base + '/*.pdf')); assert len(scans) == 10, 'expected ten scans'
out = f'{HOME}/Downloads/_desk-heldout4-private/run/ten'; keep = f'{out}/keep'; os.makedirs(keep, exist_ok=True)
err = open(f'{out}/stderr.log', 'a')
env = dict(os.environ, SITE='https://ilya-git-shane-dannmittons-projects.vercel.app/')
def run(a):
    r = subprocess.run(LINE + a, capture_output=True, text=True, cwd=REPO); err.write(r.stderr); err.flush()
    return r.stdout.strip() or 'final-line.ts printed nothing (stderr kept privately)'
def drop(L, scan):
    pdf = f'{out}/{L}.pdf'; shutil.copyfile(scan, pdf)
    d = subprocess.run(['node', f'{HERE}/drop.mjs', L, pdf, out + '/drops'], capture_output=True, text=True, env=env)
    err.write(d.stderr); err.flush(); os.remove(pdf)
    print(d.stdout.strip() or f'{L}: drop failed', flush=True)
    return json.load(open(f'{out}/drops/{L}.json'))
for L, scan in zip([f'4{c}' for c in 'ABCDEFGHIJ'], scans):
    truth = scan[:-4] + '.truth.json'
    dj = drop(L, scan)
    if dj['refused'] and not dj['logs']:
        print(f'{L}: second drop after a load fault', flush=True)
        dj = drop(L, scan)
    if dj['refused']:
        print(run(['refused', L, truth, keep, dj['refused']]), flush=True); continue
    rd = f'{out}/{L}.read.json'
    r = subprocess.run(['python3', CONV, rd, f'{out}/drops/{L}.musicxml'], capture_output=True, text=True); err.write(r.stderr)
    print(f'{L}: stamp {dj["stamp"]}', flush=True)
    print(run(['song', L, dj['backend'], truth, rd, keep]), flush=True)
print(run(['total', keep]), flush=True)
