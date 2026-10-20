"""Row 114: the four songs of the sealed set (Dann's scans of the 1967 Mussorgsky collection, songs 1 to 4) through
the deployed alias, as a singer drops them. Desk, 2026-10-19. Everything it writes goes under
~/Downloads/_colleague-pages/run-2026-10-19/run/. It prints the drop line, the stamp, the note line, the markings line,
song 2's ossia line, and the totals. Usage: python3 songs.py"""
import json, os, subprocess, sys
HOME = os.path.expanduser('~'); REPO = f'{HOME}/Desktop/ilya-rewrite'; HERE = os.path.dirname(os.path.abspath(__file__))
CONV = f'{REPO}/docs/sessions/measure-checks_r1_2026-10-05/scripts/scorer/conv.py'
LINE = f'{REPO}/docs/sessions/measure-final-test_r1_2026-10-08/final-line.ts'
RUN = f'{HOME}/Downloads/_colleague-pages/run-2026-10-19'; OUT = f'{RUN}/run'
STAMP = 'homr-web@0.2.0-ilya.7/465'
env = dict(os.environ, SITE=os.environ.get('SITE', 'https://ilya-git-shane-dannmittons-projects.vercel.app/'))
os.makedirs(f'{OUT}/drops', exist_ok=True); os.makedirs(f'{OUT}/keep', exist_ok=True)
err = open(f'{OUT}/stderr.log', 'a')
def run(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, **kw); err.write(r.stderr); return r.stdout.strip()
tot = {}
for L in ['song1', 'song2', 'song3', 'song4']:
    truth = f'{RUN}/truth-song/{L}.truth.json'
    if not os.path.exists(f'{OUT}/drops/{L}.json') or os.environ.get('REDROP'):
        print(run(['node', f'{HERE}/drop.mjs', L, f'{RUN}/songs/{L}.pdf', f'{OUT}/drops'], env=env) or f'{L}: drop failed', flush=True)
    dj = json.load(open(f'{OUT}/drops/{L}.json'))
    print(f'{L}: stamp {dj["stamp"]} ({"as required" if dj["stamp"] == STAMP else "DIFFERS from " + STAMP})', flush=True)
    if dj['refused']:
        print(run(['npx', '--no-install', 'tsx', LINE, 'refused', L, truth, f'{OUT}/keep', dj['refused']], cwd=REPO), flush=True); continue
    rd = f'{OUT}/{L}.read.json'; mk = f'{OUT}/{L}.marks.json'
    run(['python3', CONV, rd, f'{OUT}/drops/{L}.musicxml'])
    run(['python3', f'{HERE}/conv-marks.py', mk, f'{OUT}/drops/{L}.musicxml'])
    print(run(['npx', '--no-install', 'tsx', LINE, 'song', L, dj['backend'], truth, rd, f'{OUT}/keep'], cwd=REPO) or f'{L}: final-line printed nothing (stderr kept privately)', flush=True)
    print(run(['npx', '--no-install', 'tsx', f'{HERE}/marks-line.ts', L, truth, rd, mk, f'{OUT}/keep/{L}.score.json', f'{OUT}/keep/{L}.markings.json'], cwd=REPO) or f'{L}: marks-line printed nothing', flush=True)
    if L == 'song2':
        print(run(['python3', f'{HERE}/ossia-line.py', L, truth, f'{OUT}/keep/{L}.score.json', f'{OUT}/keep/{L}.line.json', rd]), flush=True)
    for k, c in json.load(open(f'{OUT}/keep/{L}.markings.json')).items():
        t = tot.setdefault(k, dict(printed=0, kept=0, extra=0))
        for f in t: t[f] += c[f]
print(run(['npx', '--no-install', 'tsx', LINE, 'total', f'{OUT}/keep'], cwd=REPO), flush=True)
print('all four, markings: ' + '; '.join(f'{k} {c["kept"]} of {c["printed"]} kept, {c["extra"]} extra' for k, c in tot.items()), flush=True)
