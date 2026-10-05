"""Stage 2. Coverage and decision tests. Prints markdown tables and writes work/results.json and work/arrays.npz.
Needs work/sources.json, work/poetry_ws.json, work/ud_xix.json (see build_sources.py and build_poetry.py)."""
import sys, json, math, collections, random
import numpy as np
sys.path.insert(0, '/tmp/claude-0/-home-claude/cde67b8f-675a-5d24-aafe-021536ff667e/scratchpad/freq/scripts')
from common import *

random.seed(20261004)
forms, lemma_of, pos_of = load_dictionary(with_pos=True)
N = len(forms)
S = json.load(open(WORK + '/sources.json'))
src = S['src']; ls = S['lemma_src']['ls2011_lemmas']
P = json.load(open(WORK + '/poetry_ws.json'))
ptot = P['tokens']
src['poetry_ws'] = {w: c * 1e6 / ptot for w, c in P['C'].items()}
NGRAM = ('ngram_1800_1917', 'ngram_1950_2019')
MAIN = ['hermit2018', 'wordfreq', 'ngram_1800_1917', 'ngram_1950_2019', 'poetry_ws', 'leipzig_news2020']

def band(p):
    if p is None or p <= 0: return 0
    return int(min(9, max(1, math.floor(math.log10(p) + 4))))

# ---- per-source arrays aligned to the dictionary order
own = {}; folded = {}
lem_idx = collections.defaultdict(list)
for i, f in enumerate(forms): lem_idx[lemma_of[f]].append(i)
for name in MAIN:
    d = src[name]; a = np.zeros(N); fl = np.zeros(N, dtype=bool)
    for i, f in enumerate(forms):
        k = letter_map(f) if name in NGRAM else f
        v = d.get(k)
        if v is None and 'ё' in k:
            v = d.get(fold(k))
            if v is not None: fl[i] = True
        if v is not None: a[i] = v
    own[name] = a; folded[name] = fl
lsum = {}; Larr = {}; Harr = {}
for name in MAIN:
    a = own[name]; L = np.zeros(N); H = a.copy()
    for l, idx in lem_idx.items():
        s = a[idx].sum()
        L[idx] = s
        if s > 0:
            nf = len(idx)
            for i in idx:
                if a[i] == 0: H[i] = s / nf
    Larr[name] = L; Harr[name] = H
LS = np.zeros(N)
for l, idx in lem_idx.items():
    v = ls.get(fold(l.lower()))
    if v: LS[idx] = v

# ---- (a) and (b) coverage
res = {'coverage': {}, 'poem': {}, 'pairs': {}, 'bench': {}}
posgroups = {'verb': 'verb', 'noun': 'noun', 'adj': 'adj', 'name': 'name'}
def pg(f): return pos_of[f] if pos_of[f] in posgroups else 'other'
pgi = collections.defaultdict(list)
for i, f in enumerate(forms): pgi[pg(f)].append(i)
print('\n### Coverage of the 943,106 dictionary forms (a = own form found, b = lemma-lent)')
print('| source | a: own form | a: own, ё-fallback not needed | b: via lemma | b minus a | nouns a/b | verbs a/b | adj a/b | names a/b |')
for name in MAIN:
    a = own[name] > 0; ex = a & ~folded[name]; b = Larr[name] > 0
    row = {'a_fold': int(a.sum()), 'a_exact': int(ex.sum()), 'b': int(b.sum())}
    for g, idx in pgi.items():
        row[g] = (int(a[idx].sum()), int(b[idx].sum()), len(idx))
    res['coverage'][name] = row
    def pc(x, n): return f'{100*x/n:.1f}%'
    print(f"| {name} | {row['a_fold']:,} ({pc(row['a_fold'],N)}) | {row['a_exact']:,} ({pc(row['a_exact'],N)}) | {row['b']:,} ({pc(row['b'],N)}) | +{row['b']-row['a_fold']:,} | "
          + ' | '.join(f"{pc(row[g][0],row[g][2])}/{pc(row[g][1],row[g][2])}" for g in ('noun','verb','adj','name')) + ' |')
b = LS > 0
row = {'a_fold': None, 'b': int(b.sum())}
for g, idx in pgi.items(): row[g] = (None, int(b[idx].sum()), len(idx))
res['coverage']['ls2011_lemmas'] = row
print(f"| ls2011_lemmas (lemma list) | n/a | n/a | {row['b']:,} ({100*row['b']/N:.1f}%) | n/a | " + ' | '.join(f"-/{100*row[g][1]/row[g][2]:.1f}%" for g in ('noun','verb','adj','name')) + ' |')
print('lemmas in dictionary:', len(lem_idx), ' lemmas with any own-form data:',
      {n: sum(1 for l, idx in lem_idx.items() if own[n][idx].sum() > 0) for n in MAIN},
      ' L&S lemmas matched:', sum(1 for l in lem_idx if ls.get(fold(l.lower()))))

# ---- (c) poem
fidx = {f: i for i, f in enumerate(forms)}
pw = poem_words(); pt = collections.Counter(pw)
print('\n### Poem «Средь шумного бала»: tokens', len(pw), 'types', len(pt))
print('| source | tokens with own count | types with own count | tokens via lemma | types via lemma |')
for name in MAIN + ['ls2011_lemmas']:
    arr = LS if name == 'ls2011_lemmas' else own[name]; Lr = LS if name == 'ls2011_lemmas' else Larr[name]
    ta = sum(c for w, c in pt.items() if arr[fidx[w]] > 0) if name != 'ls2011_lemmas' else None
    ya = sum(1 for w in pt if arr[fidx[w]] > 0) if name != 'ls2011_lemmas' else None
    tb = sum(c for w, c in pt.items() if Lr[fidx[w]] > 0); yb = sum(1 for w in pt if Lr[fidx[w]] > 0)
    res['poem'][name] = {'tok_own': ta, 'typ_own': ya, 'tok_lem': tb, 'typ_lem': yb}
    print(f"| {name} | {ta}/{len(pw)} | {ya}/{len(pt)} | {tb}/{len(pw)} | {yb}/{len(pt)} |")
for name in MAIN:
    miss = [w for w in pt if own[name][fidx[w]] == 0]
    print(f'  not found as own form in {name}:', miss)

# ---- (d) pairs
PAIRS = [('мне', 'мни'), ('засыпаю', 'зазываю'), ('бала', 'была'), ('мирской', 'морской'), ('речь', 'печь'), ('ночи', 'ноги')]
print('\n### Test pairs (parts per million, own form; band in brackets). Right word first. Tick = right word has the higher band.')
cols = ['hermit2018', 'wordfreq', 'ngram_1800_1917', 'ngram_1950_2019', 'poetry_ws', 'leipzig_news2020']
def fmt(p): return '0' if p == 0 else (f'{p:.3g}')
for kind, arrs in (('own form', own), ('lemma-lent', Larr), ('hybrid (own, else lemma mean)', Harr)):
    print(f'\n{kind}:')
    print('| pair (right / wrong) | ' + ' | '.join(cols) + ' |')
    for r, w in PAIRS:
        cells = []
        for c in cols:
            pr, pw_ = arrs[c][fidx[r]], arrs[c][fidx[w]]
            br, bw = band(pr), band(pw_)
            mark = 'ok' if br > bw else ('tie' if br == bw else 'WRONG')
            cells.append(f'{fmt(pr)} [{br}] / {fmt(pw_)} [{bw}] {mark}')
            res['pairs'].setdefault(kind, {}).setdefault(f'{r}/{w}', {})[c] = [float(pr), br, float(pw_), bw, mark]
        print(f'| {r} / {w} | ' + ' | '.join(cells) + ' |')

# ---- benchmark: single unknown letter, pick the most frequent candidate
def build_index(words):
    need = {}
    for w in words:
        for p in range(len(w)):
            need[w[:p] + '?' + w[p + 1:]] = None
    byl = collections.defaultdict(list)
    for i, f in enumerate(forms): byl[len(f)].append(i)
    idx = collections.defaultdict(list)
    for L, lst in byl.items():
        if L < 3: continue
        for i in lst:
            f = forms[i]
            for p in range(L):
                k = f[:p] + '?' + f[p + 1:]
                if k in need: idx[k].append(i)
    return idx

GROUPS = {}
def bench(items, scorers, idx, label):
    """items: list of (word, weight, extra). scorers: dict name -> function(cand_array, item) -> scores."""
    tot = collections.Counter(); wsum = 0.0; ncand = 0.0; nwild = 0
    rnd = 0.0
    for w, wt, extra in items:
        wi = fidx[w]
        for p in range(len(w)):
            k = w[:p] + '?' + w[p + 1:]
            c = np.array(idx[k]); 
            if len(c) == 0: continue
            wgt = wt / len(w)
            wsum += wgt; ncand += wgt * len(c); rnd += wgt / len(c)
            g = int(quant(B3[wi:wi + 1], 1)[0]) if B3[wi] > math.log10(FLOOR['hermit2018']) * 0 - 9 else 0
            for name, fn in scorers.items():
                s = fn(c, extra)
                m = s.max()
                win = (s == m)
                cr = (wgt / win.sum()) if win[c == wi].any() else 0.0
                tot[name] += cr
                if name in KEEP:
                    GROUPS.setdefault(label, {}).setdefault(name, {}).setdefault(g, [0.0, 0.0])
                    GROUPS[label][name][g][0] += wgt; GROUPS[label][name][g][1] += cr
    out = {n: tot[n] / wsum for n in scorers}
    out['_random'] = rnd / wsum; out['_mean_candidates'] = ncand / wsum; out['_n_items'] = len(items)
    return out

def arrscorer(a): return lambda c, extra: a[c]
def bandscorer(a):
    bv = np.vectorize(band)
    cache = bv(a)
    return lambda c, extra: cache[c]
logfloor = 0.001
def combo(names, arrs):
    return np.mean([np.log10(np.maximum(arrs[n], logfloor)) for n in names], axis=0)

scorers = {}
for n in ['hermit2018', 'wordfreq', 'ngram_1800_1917', 'ngram_1950_2019', 'leipzig_news2020']:
    scorers[f'{n} own'] = arrscorer(own[n])
    scorers[f'{n} lemma'] = arrscorer(Larr[n])
    scorers[f'{n} hybrid'] = arrscorer(Harr[n])
    scorers[f'{n} hybrid, banded 0-9'] = bandscorer(Harr[n])
scorers['L&S lemma list (reference)'] = arrscorer(LS)
C3 = ['hermit2018', 'wordfreq', 'ngram_1800_1917']
scorers['mean of 3 (hermit, wordfreq, ngram 1800-1917), hybrid'] = arrscorer(combo(C3, Harr))
scorers['mean of ngram 1800-1917 + wordfreq, hybrid'] = arrscorer(combo(['ngram_1800_1917', 'wordfreq'], Harr))
scorers['dictionary file order (earlier line wins; no data used)'] = lambda c, extra: -c.astype(float)
FLOOR = {'hermit2018': 0.5e6 / S['info']['hermit2018_tokens'], 'wordfreq': 0.0102,
         'ngram_1800_1917': 0.5e6 / S['info']['ngram_total_tokens_eras'][0], 'poetry': 0.5e6 / ptot}
def lg(a, name): return np.log10(np.maximum(a, FLOOR[name]))
B3 = (lg(Harr['hermit2018'], 'hermit2018') + lg(Harr['wordfreq'], 'wordfreq') + lg(Harr['ngram_1800_1917'], 'ngram_1800_1917')) / 3
BN = (lg(Harr['wordfreq'], 'wordfreq') + lg(Harr['ngram_1800_1917'], 'ngram_1800_1917')) / 2
scorers['BLEND3 (hermit+wordfreq+ngram 1800-1917), half-count floors'] = arrscorer(B3)
scorers['BLEND2 (wordfreq+ngram 1800-1917), half-count floors'] = arrscorer(BN)
def quant(x, r): return np.clip(np.floor(r * (x + 4)), 1, 9 * r).astype(int)
for r in (1, 2, 3, 5):
    scorers[f'BLEND3 quantised, {r} band(s) per decade ({len(set(quant(B3, r)))} levels)'] = arrscorer(quant(B3, r))

# test sets
udtoks = json.load(open(WORK + '/ud_xix.json'))['tokens']
udw = [t[0] for t in udtoks if len(t[0]) >= 3 and t[0] in fidx and WORD_RE.fullmatch(t[0])]
print('\nUD xix tokens', len(udtoks), 'of which length>=3 and exact dictionary form:', len(udw))
pop = collections.Counter(udw)
# sample up to 12000 tokens by weight => unique types with weight = sampled count
tokens_list = list(udw); random.shuffle(tokens_list); samp = collections.Counter(tokens_list[:12000])
items_ud = [(w, c, None) for w, c in samp.items()]
items_poem = [(w, c, None) for w, c in pt.items() if len(w) >= 3 and w in fidx]

# Wikisource, author held out
by_author = P['by_author']; atot = {a: sum(c.values()) for a, c in by_author.items()}
C = P['C']
ws_tokens = []
authors_ok = [a for a, n in P['npoems'].items() if n >= 30]
rng = random.Random(7)
pool = []
for a in authors_ok:
    for w, c in by_author[a].items():
        if len(w) >= 3 and w in fidx and WORD_RE.fullmatch(w): pool.extend([(w, a)] * c)
rng.shuffle(pool); pool = pool[:15000]
cnt = collections.Counter(pool)
items_ws = [(w, c, a) for (w, a), c in cnt.items()]
print('Wikisource held-out sample:', len(pool), 'tokens;', len(items_ws), 'items;', 'authors', len(authors_ok))

def poetry_loo_scorer(c, extra):
    a = extra
    ca = by_author[a]; denom = ptot - atot[a]
    return np.array([max(C.get(forms[i], 0) - ca.get(forms[i], 0), 0) * 1e6 / denom for i in c])
def poetry_blend4(c, extra):
    return (3 * B3[c] + np.log10(np.maximum(poetry_loo_scorer(c, extra), FLOOR['poetry']))) / 4
def poetry_blend_n(c, extra):
    return (lg(Harr['ngram_1800_1917'], 'ngram_1800_1917')[c] + np.log10(np.maximum(poetry_loo_scorer(c, extra), FLOOR['poetry']))) / 2
def poetry_blend_w(c, extra):
    # poetry first, the modern blend only to break near-ties and fill gaps: weight 2 poetry : 1 BLEND3
    return (B3[c] + 2 * np.log10(np.maximum(poetry_loo_scorer(c, extra), FLOOR['poetry']))) / 3

KEEP = {'BLEND3 (hermit+wordfreq+ngram 1800-1917), half-count floors', 'dictionary file order (earlier line wins; no data used)',
        'BLEND3 + poetry count (author held out), equal weights of 4', 'poetry count, author held out, own form', 'BLEND3 1 : poetry 2 (author held out)'}
results = {}
for label, items, extra_scorers in (('Poem «Средь шумного бала» (71 types)', items_poem, {}),
                                    ('UD_Russian-Poetry, 19th-century documents (12,000-token sample)', items_ud, {}),
                                    ('Wikisource poems, author held out (15,000-token sample)', items_ws, {'poetry count, author held out, own form': poetry_loo_scorer,
                                                                'BLEND3 + poetry count (author held out), equal weights of 4': poetry_blend4,
                                                                'ngram 1800-1917 + poetry count (author held out)': poetry_blend_n,
                                                                'BLEND3 1 : poetry 2 (author held out)': poetry_blend_w})):
    idx = build_index([w for w, _, _ in items])
    sc = dict(scorers); sc.update(extra_scorers)
    if extra_scorers == {}: 
        sc = {k: v for k, v in sc.items()}
    results[label] = bench(items, sc, idx, label)
    print('\n###', label, ' mean candidates per unknown letter: %.1f' % results[label]['_mean_candidates'], ' random pick: %.3f' % results[label]['_random'])
    for k, v in sorted(((k, v) for k, v in results[label].items() if not k.startswith('_')), key=lambda kv: -kv[1]):
        print(f'  {v:.3f}  {k}')
res['bench'] = results
print('\n### Accuracy by how common the TRUE word is (its BLEND3 level, 1 band per decade: level 1 = rarest known, 8 = most common; 0 = no data)')
for label, d in GROUPS.items():
    print('\n' + label)
    names = list(d.keys())
    gs = sorted({g for n in names for g in d[n]})
    print('| true-word level | share of tokens | ' + ' | '.join(n[:44] for n in names) + ' |')
    totw = sum(v[0] for v in d[names[0]].values())
    for g in gs:
        print(f'| {g} | {100*d[names[0]][g][0]/totw:.1f}% | ' + ' | '.join(f'{d[n][g][1]/d[n][g][0]:.3f}' if g in d[n] and d[n][g][0] else '-' for n in names) + ' |')
res['groups'] = {l: {n: {str(g): v for g, v in gd.items()} for n, gd in d.items()} for l, d in GROUPS.items()}
# band distribution of BLEND3 for sizing
print('\nBLEND3 level counts over all forms (r=1):', dict(sorted(collections.Counter(quant(B3, 1).tolist()).items())))
json.dump(res, open(WORK + '/results.json', 'w'), ensure_ascii=False, indent=1, default=float)
np.savez_compressed(WORK + '/arrays.npz', **{f'own_{n}': own[n] for n in MAIN}, **{f'lem_{n}': Larr[n] for n in MAIN}, **{f'hyb_{n}': Harr[n] for n in MAIN}, ls=LS)
