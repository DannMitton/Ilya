# r4 edits (2026-10-29): paths (HERE for scripts/, WORKD is r4's own); punct() writes "..." where the truth has U+2026 (brief r5 amendment 2). Same seed 105, so the words are r3's.
"""Row 105: the text of kinds 1 and 2 and of the held-out rows, and the filter of kind 3 (row 82's lines). Writes ~/Downloads/_desk-row105/text/*.json and build/textgen-report.json.
Line spec: {id, gt: [token, ...]} where tokens are syllables and '-' tokens as set under notes; the renderer spaces them."""
import json, random, re, collections, hashlib, os, sys
from common105 import *
DP = os.path.expanduser('~/Downloads/_desk-prereform/data'); GT = os.path.expanduser('~/Downloads/_desk-prereform/tesstrain/data/rus_prereform-ground-truth')
OUTD = f'{WORKD}/text'; os.makedirs(OUTD, exist_ok=True)
OLD = set('ѣіѳѵ'); NSYL = 23591
def core(tok):
    m = re.match(r'^[^\w]*(.*?)[^\w]*$', tok); c = m.group(1)
    return c if c and re.fullmatch(r'[А-Яа-яЁёѢѣІіѲѳѴѵъЪ]+', c) else None
def marked(w): lw = w.lower(); return any(c in OLD for c in lw) or lw.endswith('ъ')
def h20(w): return int(hashlib.md5(w.encode()).hexdigest(), 16) % 20
def tri(words): 
    f = [fold(modern(letters(w))) for w in words]; f = [x for x in f if x]
    return [' '.join(f[i:i + 3]) for i in range(len(f) - 2)]
GR = json.load(open(f'{PRIV}/ngrams.json', encoding='utf8'))
def hits(words): 
    o = set()
    for g in tri(words): 
        if g in GR: o.update(GR[g])
    return o
def main():
    rng = random.Random(105)
    pool = json.load(open(f'{DP}/lines_pool.json', encoding='utf8')); tl = json.load(open(f'{DP}/train_lines.json', encoding='utf8'))
    rep = {}
    # ---- kind 3 filter (row 82's rendered training lines)
    rendered = {f[:-4] for f in os.listdir(GT) if f.endswith('.png')}
    txt = {i: t for i, t, *_ in tl}; assert set(rendered) <= set(txt), 'rendered id without text'
    drop_orig = collections.Counter(); drop_ids = []; origins = collections.Counter()
    prime(mod=[letters(w) for i in rendered for w in txt[i].split()])
    for i in sorted(rendered):
        h = hits(txt[i].split())
        if h: drop_ids.append(i); drop_orig['lines'] += 1; origins.update(h)
    rep['kind3'] = dict(rendered=len(rendered), dropped=len(drop_ids), origins=dict(origins), kept=len(rendered) - len(drop_ids))
    json.dump(drop_ids, open(f'{OUTD}/kind3-dropped-ids.json', 'w'))
    # ---- pools
    train_tok = collections.Counter(); hold_tok = collections.Counter()
    for t, *_ in pool['train']:
        for x in t.split():
            c = core(x)
            if c: train_tok[c.lower()] += 1
    for t, *_ in pool['hold']:
        for x in t.split():
            c = core(x)
            if c: hold_tok[c.lower()] += 1
    tot = sum(train_tok.values()); mk = sum(v for w, v in train_tok.items() if marked(w)); share = mk / tot
    rep['pool'] = dict(train_tokens=tot, train_types=len(train_tok), marked_tokens=mk, preform_share=round(share, 4), hold_types=len(hold_tok))
    train_marked = [w for w, v in train_tok.items() if marked(w) for _ in range(v)] # token-weighted, held as list
    train_plain = [w for w, v in train_tok.items() if not marked(w) for _ in range(v)]
    tm_types = sorted(w for w in train_tok if marked(w)); 
    # dictionary forms
    dic = set()
    for f in ('a', 'b'):
        for line in open(f'{REPO}/data/dictionary.86d83340-{f}.json', encoding='utf8'):
            try: k = json.loads(line)[0]
            except Exception: continue
            k = k.lower().replace('ё', 'ё')
            if re.fullmatch(r'[а-яё]{2,14}', k) and not k.endswith('ъ'): dic.add(k)   # a final ъ is a pre-reform form: those come only from the real corpus
    known = {fold(modern(w)) for w in train_tok} if False else set(train_tok)
    dic_only = sorted(w for w in dic if w not in known)
    reserved_dic = [w for w in dic_only if h20(w) == 0]; train_dic = [w for w in dic_only if h20(w) != 0]
    hold_marked = sorted(w for w in hold_tok if marked(w) and w not in train_tok)
    rep['pool'].update(dict(dictionary_forms=len(dic), dic_not_in_corpus=len(dic_only), dic_train=len(train_dic), dic_reserved=len(reserved_dic), hold_marked_not_in_train=len(hold_marked)))
    # ---- punctuation
    ps = json.load(open(f'{HERE}/punct-stats.json', encoding='utf8')); ends = ps['end']; ntot = ps['words']
    def punct(): 
        r = rng.random() * ntot; a = 0
        for s, c in ends:
            a += c
            if r < a: return '...' if s == '\u2026' else s   # r4 item 7: U+2026 is written as "..." in the same proportion (r2's unicharset has no U+2026)
        return ''
    def draw(kind):
        if kind == 'held':
            return rng.choice(hold_marked) if rng.random() < share else rng.choice(reserved_dic)
        if rng.random() < share: return rng.choice(train_marked)
        return rng.choice(train_plain) if rng.random() < 0.5 else rng.choice(train_dic)
    stat = collections.Counter(); cutfail = collections.Counter(); samples = []
    def cutword(w):
        lw = w.lower(); m = modern(lw)
        if len(m) != len(lw):
            if not (lw.endswith('ъ') and len(m) == len(lw) - 1): return None
        if any(m[i] != lw[i] and lw[i] not in OLD for i in range(len(m))): return None   # only the abolished letters may change, letter for letter
        sy = cut_modern(m)
        if not sy or ''.join(sy) != m: return None
        out, pos = [], 0
        for x in sy: out.append(lw[pos:pos + len(x)]); pos += len(x)
        if pos < len(lw): out[-1] += lw[pos:]   # a dropped final ъ joins the last syllable
        assert ''.join(out) == lw, (lw, m, sy)
        sy = out
        return sy
    def make(kind, n, offset, seed):
        out = []; drops = collections.Counter(); k = 0
        while len(out) < n:
            k += 1; nw = rng.randint(2, 12); toks = []; words = []; ok = True
            cap = rng.random() < 0.25
            for wi in range(nw):
                w = draw(kind); sy = cutword(w)
                if sy is None: cutfail[kind] += 1; ok = False; break
                words.append(w)
                if len(sy) > 1 and wi == 0 and False: pass
                p = punct()
                sy = list(sy); sy[-1] += p
                for i, s in enumerate(sy):
                    toks.append(s)
                    if i < len(sy) - 1: toks.append('-')
            if not ok: continue
            nsyl = sum(1 for t in toks if t != '-')
            if nsyl > 28: drops['too long'] += 1; continue
            if cap: toks[0] = toks[0][0].upper() + toks[0][1:]
            if rng.random() < 0.2: toks = ['-'] + toks
            if rng.random() < 0.25: toks = toks + ['-']
            h = hits(words); 
            if h: drops['ngram'] += 1; continue
            out.append(dict(id=f'{kind[0]}{offset + len(out):05d}', gt=toks, words=words))
        rep.setdefault('drops', {})[kind + str(offset)] = dict(drops, attempts=k)
        return out
    # prime the engine/modernise over everything first, by drawing a probe in a fresh rng state
    allw = sorted(set(train_tok) | set(hold_tok) | set(train_dic) | set(reserved_dic))
    prime(mod=allw); prime(syl=sorted({modern(w) for w in allw}))
    k1 = make('train', NSYL, 0, 1); k2 = make('train', NSYL, NSYL, 2); ho = make('held', 1000, 0, 3)
    for name, L in (('kind1', k1), ('kind2', k2), ('held', ho)): json.dump(L, open(f'{OUTD}/{name}.json', 'w', encoding='utf8'), ensure_ascii=False)
    # no line may repeat across sets; reserved words never in training
    trainwords = {w for l in k1 + k2 for w in l['words']}; hw = {w for l in ho for w in l['words']}
    rep['disjoint_held_words_vs_train_words'] = len(trainwords & hw)
    rep['lines'] = dict(kind1=len(k1), kind2=len(k2), held=len(ho)); rep['cutfail'] = dict(cutfail)
    rep['preform_share_in_built'] = {n: round(sum(1 for l in L for w in l['words'] if marked(w)) / sum(len(l['words']) for l in L), 4) for n, L in (('kind1', k1), ('kind2', k2), ('held', ho))}
    # 30-word check
    chk = rng.sample(sorted({w for w in train_tok if marked(w) and len(w) > 4}), 30)
    with open(f'{HERE}/cut-check-30.txt', 'w', encoding='utf8') as f:
        for w in chk: f.write(f'{w}\t{modern(w)}\t{" - ".join(cutword(w) or ["CUT FAILED"])}\n')
    json.dump(rep, open(f'{HERE}/textgen-report.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    print(json.dumps(rep, ensure_ascii=False, indent=1))
main()
