"""Drop each build/unseen song through the intake; keep only its reading. Prints a line per song with its name only.
Usage: python3 many.py <tag>"""
import glob, os, subprocess, sys, shutil
HOME = os.path.expanduser('~'); HERE = os.path.dirname(os.path.abspath(__file__))
tag = sys.argv[1]; out = f'{HERE}/{tag}'; os.makedirs(out, exist_ok=True)
songs = {os.path.basename(p)[:-4]: p for p in sorted(glob.glob(f'{HOME}/Downloads/_code-metre-r6/songpdf/*.pdf'))}
sc = [s for s in sorted(glob.glob(f'{HOME}/Downloads/_desk-2026-10-07/heldout-scans/*.pdf')) if not os.path.basename(s).lower().startswith(('grechaninov', 'varlamov'))]
for L, p in zip('ABCDEF', sc):
    if L != 'D': songs[L] = p
for name, p in songs.items():
    if os.path.exists(f'{out}/drops/{name}.musicxml'): continue
    pdf = f'{out}/{name}.pdf'; shutil.copyfile(p, pdf)
    d = subprocess.run(['node', f'{HERE}/drop.mjs', name, pdf, out + '/drops'], capture_output=True, text=True)
    os.remove(pdf)
    print(d.stdout.strip() or f'{name}: drop failed', flush=True)
