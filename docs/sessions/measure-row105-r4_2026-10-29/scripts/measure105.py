# r4 edit: M (the harness root holding ctl/, n135-*) comes from MROOT when set (here ~/Downloads/_desk-row105/r4/mroot, outside the tree). Nothing else changed.
"""Row 105: the measure for one model file. Usage: measure105.py <tag> <traineddata path>
Serves the model as rus_prereform.traineddata from ~/Downloads/_desk-row105/serve/<tag>/ (md5 recorded), reads the 18 framed songs (ctl/framed, clean.py's frame) through
read-dfloat-chrome.mjs, scores with score117.py (RULE=R2), maps the boxes (map_boxes105.py) and seats with step1c.py in n135-combined/work_framed. Writes ctl/m-<tag>.json."""
import sys, os, subprocess, json, re, shutil, hashlib
M = os.environ.get('MROOT') or os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')); W = os.path.expanduser('~/Downloads/_desk-row105'); PY = f'{W}/venv/bin/python'
tag, model = sys.argv[1], sys.argv[2]
SONGS = ['B01','B02','B03','B04','B06','B07','B08','B09','B10','S','T','K','M','U1','U4','U5','U6','P']; B9 = SONGS[:9]; C9 = SONGS[9:]
sd = f'{W}/serve/{tag}'; os.makedirs(sd, exist_ok=True); shutil.copy(model, f'{sd}/rus_prereform.traineddata')
md5 = hashlib.md5(open(f'{sd}/rus_prereform.traineddata', 'rb').read()).hexdigest(); size = os.path.getsize(f'{sd}/rus_prereform.traineddata')
ocr = f'{M}/ctl/ocr-{tag}'; shutil.rmtree(ocr, ignore_errors=True)
subprocess.run(['node', f'{M}/n135-row117/scripts/read-dfloat-chrome.mjs', f'{M}/n135-row117/harness', f'{M}/ctl/framed', sd], env=dict(os.environ, OUT=ocr), check=True, capture_output=True)
sc = f'{M}/ctl/score-{tag}.json'
r = subprocess.run([PY, 'score117.py', ocr, sc] + SONGS, cwd=f'{M}/n135-row117/harness', env=dict(os.environ, RULE='R2'), capture_output=True, text=True, check=True)
S = json.load(open(sc)); tot = lambda L, k: sum(S[x][k] for x in L)
out = dict(tag=tag, model=model, folder=sd, md5=md5, bytes=size, read_right_all=tot(SONGS, 'sound'), printed=tot(SONGS, 'printed'), letter_right=tot(SONGS, 'letter'),
           read_right_photocopies_B9=tot(B9, 'sound'), printed_B9=tot(B9, 'printed'), read_right_other9=tot(C9, 'sound'), printed_other9=tot(C9, 'printed'),
           per_song={L: [S[L]['sound'], S[L]['printed']] for L in SONGS})
st = {}
for L in SONGS:
    for k, v in S[L]['stages'].items(): st[k] = st.get(k, 0) + v
out['stages'] = st
ha = f'{M}/n135-combined/work_framed/harness/ocr2'; shutil.rmtree(ha, ignore_errors=True); os.makedirs(ha)
subprocess.run([PY, 'map_boxes105.py', ocr, f'{M}/ctl/geom-{tag}.json'], cwd=f'{M}/n135-combined', check=True, capture_output=True)
r = subprocess.run([PY, 'step1c.py'], cwd=f'{M}/n135-combined/work_framed', capture_output=True, text=True, check=True)
open(f'{M}/ctl/log-step1c-{tag}.txt', 'w', encoding='utf8').write(r.stdout)
m = re.search(r'C2 hybrid .*?\(b\) (\d+) \(\+\d+ vs rule 2\), \(a\) (\d+) \(\+\d+\), \(c\) (\d+)', r.stdout) or re.search(r'C2 hybrid .*?\(b\) (\d+) \(([+-]\d+) vs rule 2\), \(a\) (\d+) \(([+-]\d+)\), \(c\) (\d+)', r.stdout)
c2 = re.search(r'C2 hybrid[^\n]*', r.stdout).group(0); nums = re.findall(r'\(([abc])\) (\d+)', c2); out['C2_b_a_c'] = {k: int(v) for k, v in nums}
rows = [l for l in r.stdout.split('\n') if re.match(r'\s+(U1|U4|U5|U6|P|B\d\d|S|T|ALL) \|', l)]
c2part = r.stdout[r.stdout.index('C2 hybrid'):]; per = {}
for l in c2part.split('\n'):
    mm = re.match(r'\s+(\w+) \| (\d+) \| (\d+) -> (\d+) \([+-]\d+\) \| (\d+) -> (\d+) \([+-]\d+\) \| (\d+) -> (\d+)', l)
    if mm: per[mm.group(1)] = dict(notes=int(mm.group(2)), b=int(mm.group(4)), a=int(mm.group(6)), c=int(mm.group(8)))
out['C2_per_song'] = per
json.dump(out, open(f'{M}/ctl/m-{tag}.json', 'w'), indent=1); print(json.dumps({k: out[k] for k in ['tag', 'md5', 'bytes', 'read_right_all', 'read_right_photocopies_B9', 'read_right_other9', 'C2_b_a_c', 'stages']}))
