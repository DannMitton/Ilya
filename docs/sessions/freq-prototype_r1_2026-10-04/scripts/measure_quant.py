"""How coarse can the stored number be? Wikisource held-out test (same 15,000-token sample and seed as measure.py),
final recipe (3 big sources + poetry count, 1:2), quantised at k levels per unit of the combined score."""
import sys, json, math, collections, random
import numpy as np
sys.path.insert(0, '/tmp/claude-0/-home-claude/cde67b8f-675a-5d24-aafe-021536ff667e/scratchpad/freq/scripts')
from common import *
random.seed(20261004)
forms, lemma_of = load_dictionary(); N = len(forms); fidx = {f: i for i, f in enumerate(forms)}
S = json.load(open(WORK + '/sources.json'))['info']
_z = np.load(WORK + '/arrays.npz'); z = {k: _z[k] for k in _z.files}
P = json.load(open(WORK + '/poetry_ws.json')); ptot = P['tokens']; C = P['C']; by_author = P['by_author']
atot = {a: sum(c.values()) for a, c in by_author.items()}
FL = {'h': 0.5e6 / S['hermit2018_tokens'], 'w': 0.0102, 'n': 0.5e6 / S['ngram_total_tokens_eras'][0], 'p': 0.5e6 / ptot}
lg = lambda a, k: np.log10(np.maximum(a, FL[k]))
b3 = (lg(z['hyb_hermit2018'], 'h') + lg(z['hyb_wordfreq'], 'w') + lg(z['hyb_ngram_1800_1917'], 'n')) / 3
# identical sample to measure.py: it consumed random for the UD shuffle first
udtoks = json.load(open(WORK + '/ud_xix.json'))['tokens']
udw = [t[0] for t in udtoks if len(t[0]) >= 3 and t[0] in fidx and WORD_RE.fullmatch(t[0])]
tl = list(udw); random.shuffle(tl)
rng = random.Random(7)
authors_ok = [a for a, n in P['npoems'].items() if n >= 30]
pool = []
for a in authors_ok:
    for w, c in by_author[a].items():
        if len(w) >= 3 and w in fidx and WORD_RE.fullmatch(w): pool.extend([(w, a)] * c)
rng.shuffle(pool); pool = pool[:15000]
cnt = collections.Counter(pool); items = [(w, c, a) for (w, a), c in cnt.items()]
need = {w[:p] + '?' + w[p + 1:]: None for w, _, _ in items for p in range(len(w))}
idx = collections.defaultdict(list)
for i, f in enumerate(forms):
    if len(f) < 3: continue
    for p in range(len(f)):
        k = f[:p] + '?' + f[p + 1:]
        if k in need: idx[k].append(i)
def poet(c, a):
    ca = by_author[a]; d = ptot - atot[a]
    return np.array([max(C.get(forms[i], 0) - ca.get(forms[i], 0), 0) * 1e6 / d for i in c])
ks = [None, 1, 1.5, 2, 3, 4, 6, 9, 12]
tot = collections.Counter(); wsum = 0.0
for w, wt, a in items:
    wi = fidx[w]
    for p in range(len(w)):
        c = np.array(idx[w[:p] + '?' + w[p + 1:]])
        if len(c) == 0: continue
        g = wt / len(w); wsum += g
        sc = (b3[c] + 2 * np.log10(np.maximum(poet(c, a), FL['p']))) / 3
        for k in ks:
            s = sc if k is None else np.floor(k * (sc + 1.2))
            m = s.max(); win = s == m
            if win[c == wi].any(): tot[k] += g / win.sum()
print('levels = floor(k*(score+1.2))+1; score range about -1.2 .. 4.5')
for k in ks:
    print('raw (no quantising)' if k is None else f'k={k:4}  levels up to about {int(k*5.7)+1}', f'accuracy {tot[k]/wsum:.3f}')
