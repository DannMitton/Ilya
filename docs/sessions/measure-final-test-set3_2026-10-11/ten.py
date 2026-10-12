"""Row 76: the ten songs of held-out set 3, Q to Z, through the deployed site. Prints only final-line.ts lines and drop timings by letter.
No scan, truth, reading, or keep file is opened by a person; scans are copied under their letters and removed after the drop."""
import glob, json, os, shutil, subprocess
HOME = os.path.expanduser('~'); REPO = f'{HOME}/Desktop/ilya-rewrite'; HERE = os.path.dirname(os.path.abspath(__file__))
CONV = f'{REPO}/docs/sessions/measure-checks_r1_2026-10-05/scripts/scorer/conv.py'
LINE = ['npx', '--no-install', 'tsx', f'{REPO}/docs/sessions/measure-final-test_r1_2026-10-08/final-line.ts']
base = f'{HOME}/Downloads/_desk-heldout3-private/truth'
scans = sorted(glob.glob(base + '/*.pdf')); assert len(scans) == 10
out = f'{HERE}/ten'; keep = f'{out}/keep'; os.makedirs(keep, exist_ok=True)
env = dict(os.environ, SITE='https://ilya-git-shane-dannmittons-projects.vercel.app/')
def run(a): return subprocess.run(LINE + a, capture_output=True, text=True, cwd=REPO)
for L, scan in zip('QRSTUVWXYZ', scans):
    truth = scan[:-4] + '.truth.json'; pdf = f'{out}/{L}.pdf'; shutil.copyfile(scan, pdf)
    d = subprocess.run(['node', f'{HERE}/drop.mjs', L, pdf, out + '/drops'], capture_output=True, text=True, env=env); os.remove(pdf)
    print(d.stdout.strip() or f'{L}: drop failed', flush=True)
    dj = json.load(open(f'{out}/drops/{L}.json'))
    if dj['refused']:
        r = run(['refused', L, truth, keep, dj['refused']]); print(r.stdout.strip() or r.stderr.strip()[:200], flush=True); continue
    rd = f'{out}/{L}.read.json'
    subprocess.run(['python3', CONV, rd, f'{out}/drops/{L}.musicxml'], check=True, capture_output=True)
    r = run(['song', L, dj['backend'], truth, rd, keep]); print(r.stdout.strip() or r.stderr.strip()[:200], flush=True)
r = run(['total', keep]); print(r.stdout.strip() or r.stderr.strip()[:200])
