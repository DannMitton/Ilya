"""Row 57 r6 run 4: the unseen songs, once each, never opened.

The script globs the scan folder, letters the scans in glob order as rows 52 and 55 did, copies the ones to run into a
private folder under their letters, drops each into the intake on the dev build (drop.mjs), and scores it with row 49's
conv.py and row 55's final-line.ts into a `keep` folder that is never opened. It prints only lines that carry a letter.

  python3 run4.py rehearse            Grechaninov and Varlamov (opened), through the whole script
  python3 run4.py AF                  A, B, C, E, F (row 52's letters; D is the opened Gurilyov)
  python3 run4.py GO                  G, H, I, J, N, O (row 55's letters)
"""
import glob, json, os, shutil, subprocess, sys
HOME = os.path.expanduser('~')
REPO = f'{HOME}/Desktop/ilya-rewrite'
HERE = os.path.dirname(os.path.abspath(__file__))
CONV = f'{REPO}/docs/sessions/measure-checks_r1_2026-10-05/scripts/scorer/conv.py'
LINE = f'{REPO}/docs/sessions/measure-final-test_r1_2026-10-08/final-line.ts'
mode = sys.argv[1]


def truth_for(scan, truth_dir, truths_in_order, scans_in_order):
    stem = os.path.basename(scan)[:-4]
    t = os.path.join(truth_dir, stem + '.truth.json')
    if os.path.exists(t): return t, 'name'
    return truths_in_order[scans_in_order.index(scan)], 'order'


def run(letter, scan, truth, priv, show_line):
    pdf = os.path.join(priv, letter + '.pdf'); shutil.copyfile(scan, pdf)
    out = os.path.join(priv, 'drops'); keep = os.path.join(priv, 'keep')
    d = subprocess.run(['node', f'{HERE}/drop.mjs', letter, pdf, out], capture_output=True, text=True)
    print(d.stdout.strip() or f'{letter}: drop failed', flush=True)
    dj = json.load(open(os.path.join(out, letter + '.json')))
    node = ['node', '--experimental-strip-types', '--no-warnings', LINE]
    if dj['refused']:
        r = subprocess.run(node + ['refused', letter, truth, keep, dj['refused']], capture_output=True, text=True, cwd=REPO)
        print(r.stdout.strip() if show_line else f'{letter}: refused, scored 0', flush=True)
        print(f'{letter}: stated 0, agreeing 0 (refused); false 0', flush=True)
        return 0
    rd = os.path.join(keep, letter + '.read.json'); os.makedirs(keep, exist_ok=True)
    subprocess.run(['python3', CONV, rd, os.path.join(out, letter + '.musicxml')], check=True, capture_output=True)
    r = subprocess.run(node + ['song', letter, dj['backend'], truth, rd, keep], capture_output=True, text=True, cwd=REPO)
    if show_line: print(r.stdout.strip() or r.stderr.strip().splitlines()[0], flush=True)
    s = subprocess.run(['python3', f'{HERE}/stated.py', letter, truth, rd, os.path.join(keep, letter + '.score.json'), os.path.join(out, letter + '.json')],
                       capture_output=True, text=True)
    line = s.stdout.strip() or f'{letter}: stated line failed'
    print(line, flush=True)
    return int(line.rsplit('false ', 1)[1]) if 'false ' in line else 1


if mode == 'rehearse':
    priv = f'{HERE}/private-rehearse'; os.makedirs(priv, exist_ok=True)
    H = f'{HOME}/Downloads/_desk-2026-10-07/heldout-truth/'
    for letter, scan, truth in (('grech', f'{HOME}/Downloads/_code-metre-r6/songpdf/grech.pdf', H + 'grechaninov_op20-4_uznik.truth.json'),
                                ('varl', f'{HOME}/Downloads/_code-metre-r6/songpdf/varl.pdf', H + 'varlamov_no-op_skazhi-zachem.truth.json'),
                                ('k04', f'{HOME}/Downloads/_code-metre-r6/songpdf/k04.pdf', f'{REPO}/tools/e16-harness/output/truth/kabalevsky_shakespeare_t04-when-to-the-sessions-of-sweet-silent-thought.truth.json')):
        run(letter, scan, truth, priv, True)

elif mode == 'AF':
    priv = f'{HERE}/private-AF'; os.makedirs(priv, exist_ok=True)
    scans = sorted(glob.glob(f'{HOME}/Downloads/_desk-2026-10-07/heldout-scans/*.pdf'))
    six = [s for s in scans if not os.path.basename(s).lower().startswith(('grechaninov', 'varlamov'))]
    truths = sorted(t for t in glob.glob(f'{HOME}/Downloads/_desk-2026-10-07/heldout-truth/*.truth.json')
                    if not os.path.basename(t).lower().startswith(('grechaninov', 'varlamov')))
    letters = dict(zip('ABCDEF', six))
    print(f'scans {len(scans)}, unseen six {len(six)}, truths {len(truths)}; D is the opened Gurilyov: '
          f'{"yes" if os.path.basename(letters["D"]).lower().startswith("gurilyov") else "NO"}', flush=True)
    false = 0
    for L in 'ABCEF':
        t, how = truth_for(letters[L], f'{HOME}/Downloads/_desk-2026-10-07/heldout-truth', truths, six)
        print(f'{L}: truth paired by {how}', flush=True)
        f = run(L, letters[L], t, priv, False)
        false += f
        if f: print(f'{L}: a false signature; the round stops here', flush=True); break
    print(f'A to F: false signatures {false}', flush=True)

elif mode == 'GO':
    priv = f'{HERE}/private-GO'; os.makedirs(priv, exist_ok=True)
    base = f'{HOME}/Downloads/_desk-2026-10-08/' + 'heldout2'
    scans = sorted(glob.glob(base + '-scans/*.pdf'))
    truths = sorted(glob.glob(base + '-truth-r2/truth/*.truth.json'))
    letters = dict(zip('GHIJKLMNOP', scans))
    print(f'scans {len(scans)}, truths {len(truths)}', flush=True)
    for L in 'GHIJNO':
        t, how = truth_for(letters[L], base + '-truth-r2/truth', truths, scans)
        print(f'{L}: truth paired by {how}', flush=True)
        run(L, letters[L], t, priv, True)
