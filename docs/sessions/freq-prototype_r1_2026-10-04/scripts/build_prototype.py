"""Stage 3. Build the prototype files from work/arrays.npz and measure their sizes. Nothing under /home/claude/ilya is written.
Recipe (the one measured best in measure.py, see memo):
  score = ( mean over [hermit2018, wordfreq, ngram 1800-1917] of log10(max(ppm, half-count floor))  +  2 * log10(max(poetry ppm, floor)) ) / 3
  ppm for the three big sources is the 'hybrid' value: the form's own count, else the lemma's mean count per form.
  poetry ppm is the form's own count in the Wikisource poem count (1.2 M tokens of 19th-century poetry).
  band (0-9): 0 = no data in any source; else clip(floor(1.5 * (score + 1.2)) + 1, 1, 9)   (each step up is about 4.6 times as common)
  level (fine): 0 = no data; else clip(floor(4 * (score + 1.2)) + 1, 1, 25)                  (each step up is about 1.8 times as common)
Source column: letters of the sources that had the form itself (h hermit, w wordfreq, n ngram 1800-1917, p poetry count);
  if none had the form itself, 'l' followed by the letters of the sources whose lemma had data."""
import sys, json, math, gzip, os, subprocess, collections
import numpy as np
sys.path.insert(0, '/tmp/claude-0/-home-claude/cde67b8f-675a-5d24-aafe-021536ff667e/scratchpad/freq/scripts')
from common import *
OUT = BASE + '/outputs/freq-prototype_r1_2026-10-04'
os.makedirs(OUT, exist_ok=True)
forms, lemma_of = load_dictionary()
N = len(forms)
S = json.load(open(WORK + '/sources.json'))['info']
_z = np.load(WORK + '/arrays.npz'); z = {k: _z[k] for k in _z.files}
ptot = json.load(open(WORK + '/poetry_ws.json'))['tokens']
FL = {'h': 0.5e6 / S['hermit2018_tokens'], 'w': 0.0102, 'n': 0.5e6 / S['ngram_total_tokens_eras'][0], 'p': 0.5e6 / ptot}
H = {'h': z['hyb_hermit2018'], 'w': z['hyb_wordfreq'], 'n': z['hyb_ngram_1800_1917']}
OWN = {'h': z['own_hermit2018'], 'w': z['own_wordfreq'], 'n': z['own_ngram_1800_1917'], 'p': z['own_poetry_ws']}
LEM = {'h': z['lem_hermit2018'], 'w': z['lem_wordfreq'], 'n': z['lem_ngram_1800_1917'], 'p': z['lem_poetry_ws']}
lg = lambda a, k: np.log10(np.maximum(a, FL[k]))
b3 = (lg(H['h'], 'h') + lg(H['w'], 'w') + lg(H['n'], 'n')) / 3
score = (b3 + 2 * lg(OWN['p'], 'p')) / 3
known = (H['h'] > 0) | (H['w'] > 0) | (H['n'] > 0) | (OWN['p'] > 0)
band = np.where(known, np.clip(np.floor(1.5 * (score + 1.2)) + 1, 1, 9), 0).astype(int)
level = np.where(known, np.clip(np.floor(4 * (score + 1.2)) + 1, 1, 25), 0).astype(int)
src = []
for i in range(N):
    own = ''.join(k for k in 'hwnp' if OWN[k][i] > 0)
    if own: src.append(own)
    else:
        lem = ''.join(k for k in 'hwnp' if LEM[k][i] > 0)
        src.append('l' + lem if lem else '-')
print('forms with a band:', int(known.sum()), 'of', N, ' band counts:', dict(sorted(collections.Counter(band.tolist()).items())))
print('level counts (fine):', dict(sorted(collections.Counter(level.tolist()).items())))
print('source codes (top):', collections.Counter(src).most_common(12))
with open(OUT + '/prototype.tsv', 'w', encoding='utf-8') as f:
    f.write('form\tband\tsource\n')
    for i in range(N):
        if band[i] > 0: f.write(f'{forms[i]}\t{band[i]}\t{src[i]}\n')
with open(OUT + '/prototype_fine.tsv', 'w', encoding='utf-8') as f:
    f.write('form\tlevel\tsource\n')
    for i in range(N):
        if level[i] > 0: f.write(f'{forms[i]}\t{level[i]}\t{src[i]}\n')
np.save(WORK + '/band.npy', band); np.save(WORK + '/level.npy', level)

def gz(path):
    return subprocess.run(f'gzip -9 -c "{path}" | wc -c', shell=True, capture_output=True, text=True).stdout.strip()
def brot(path):
    r = subprocess.run(f'brotli -q 11 -c "{path}" | wc -c', shell=True, capture_output=True, text=True)
    return r.stdout.strip() if r.returncode == 0 else None
sizes = {}
# dictionary copies with a "q" field appended (written to scratch only)
tmp = WORK + '/dict_copies'; os.makedirs(tmp, exist_ok=True)
def write_copy(tag, values):
    i = 0; paths = []
    for part in ('a', 'b'):
        outp = f'{tmp}/{tag}-{part}.json'; paths.append(outp)
        with open(f'/home/claude/ilya/data/dictionary.86d83340-{part}.json', encoding='utf-8') as fin, open(outp, 'w', encoding='utf-8') as fout:
            for line in fin:
                s = line.rstrip('\n')
                # the "q" field is omitted when there is no data (value 0), as the proposal says
                if s.startswith('[') and s.endswith('}]'):
                    if values[i]: s = s[:-2] + f',"q":{values[i]}' + '}]'
                    i += 1
                elif s.startswith('[') and s.endswith('}],'):
                    if values[i]: s = s[:-3] + f',"q":{values[i]}' + '}],'
                    i += 1
                fout.write(s + '\n')
    assert i == N, (i, N)
    return paths
orig = [f'/home/claude/ilya/data/dictionary.86d83340-{p}.json' for p in ('a', 'b')]
sizes['original'] = {'raw': sum(os.path.getsize(p) for p in orig), 'gzip9': sum(int(gz(p)) for p in orig)}
for tag, vals in (('q-band09', band), ('q-fine', level)):
    paths = write_copy(tag, vals.tolist())
    sizes[tag] = {'raw': sum(os.path.getsize(p) for p in paths), 'gzip9': sum(int(gz(p)) for p in paths)}
# sidecar: one byte per form in dictionary order
for tag, vals in (('sidecar-band09-bytes', band), ('sidecar-fine-bytes', level)):
    p = f'{tmp}/{tag}.bin'; open(p, 'wb').write(bytes(vals.astype(np.uint8).tolist()))
    sizes[tag] = {'raw': os.path.getsize(p), 'gzip9': int(gz(p))}
# sidecar: two bands per byte (nibbles), band 0-9 fits in 4 bits
nib = bytearray((N + 1) // 2)
for i in range(N):
    nib[i // 2] |= int(band[i]) << (4 * (i % 2))
p = f'{tmp}/sidecar-band09-nibbles.bin'; open(p, 'wb').write(bytes(nib))
sizes['sidecar-band09-nibbles'] = {'raw': os.path.getsize(p), 'gzip9': int(gz(p))}
for tag, path in (('prototype.tsv', OUT + '/prototype.tsv'), ('prototype_fine.tsv', OUT + '/prototype_fine.tsv')):
    sizes[tag] = {'raw': os.path.getsize(path), 'gzip9': int(gz(path))}
# brotli, if the tool exists
if subprocess.run('which brotli', shell=True, capture_output=True).returncode == 0:
    for tag in ('q-band09', 'q-fine'):
        sizes[tag]['brotli11'] = sum(int(brot(f'{tmp}/{tag}-{p}.json')) for p in ('a', 'b'))
    sizes['original']['brotli11'] = sum(int(brot(p)) for p in orig)
json.dump(sizes, open(OUT + '/sizes.json', 'w'), indent=1)
for k, v in sizes.items(): print(k, v)
