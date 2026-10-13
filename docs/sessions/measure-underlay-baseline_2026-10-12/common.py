"""Row 81: shared loading and step 3's normalising for steps 4, 5, and 7.
norm(t): modernisePreReform (norm.ts under tsx, unchanged) or the token itself where it returns null; lower case; ё to е
(DESK DEFAULT); every character outside а to я stripped. Results are cached in norm-cache.json."""
import json, os, re, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); REPO = os.path.abspath(f'{HERE}/../../..')
R80 = f'{HERE}/../measure-russian-line_2026-10-11'
MODELS = 'abc'
HY = '-–—‐'

def rows(L): return [json.loads(l) for l in open(f'{HERE}/{L}.rows.jsonl')]
def ocr(L, m): return json.load(open(f'{HERE}/ocr/{L}-{m}.json'))
def rid(r): return f"p{r['page']}s{r['system']}r{r['row']}"

def poem():
    """{letter: {row id: [printed syllables, '-' kept]}} from poem.txt (Code's transcription)."""
    out = {}
    for l in open(f'{HERE}/poem.txt', encoding='utf8'):
        if l.startswith('#') or not l.strip(): continue
        k, v = l.rstrip('\n').split(': ', 1); L, r = k.split()
        out.setdefault(L, {})[r] = v.split()
    return out

_cache = None
def _load():
    global _cache
    if _cache is None:
        p = f'{HERE}/norm-cache.json'
        _cache = json.load(open(p, encoding='utf8')) if os.path.exists(p) else {}
    return _cache
def prime(tokens):
    c = _load(); need = sorted({t for t in tokens if t not in c})
    if not need: return
    tmp = f'{HERE}/.norm-in.json'; json.dump(need, open(tmp, 'w', encoding='utf8'), ensure_ascii=False)
    r = subprocess.run(['npx', '--no-install', 'tsx', f'{HERE}/norm.ts', tmp], capture_output=True, text=True, cwd=REPO, check=True)
    os.remove(tmp)
    for t, m in json.loads(r.stdout): c[t] = m
    json.dump(c, open(f'{HERE}/norm-cache.json', 'w', encoding='utf8'), ensure_ascii=False)
def modern(t):
    m = _load()[t]
    return t if m is None else m
def fold(t): return re.sub(r'[^а-я]', '', t.lower().replace('ё', 'е'))
def norm(t): return fold(modern(t))

def poem_words(P, L):
    """The poem's whole words: syllables joined where a printed hyphen joins them, across rows, in reading order."""
    words, cur = [], ''
    for r, syls in P[L].items():
        for s in syls:
            cur += s.rstrip('-')
            if not s.endswith('-'): words.append(cur); cur = ''
    if cur: words.append(cur)
    return words

def sew(words, variant='brief'):
    """A row's words in x order. 'brief': a token ending in a hyphen is sewn to the next token in the row.
    'joint': also a token that starts with a hyphen, or a hyphen standing alone, joins its neighbours."""
    ws = sorted([w for w in words if w['text'].strip()], key=lambda w: w['bbox'][0])
    out = []
    glue = False
    for w in ws:
        t = w['text']
        alone = variant == 'joint' and t.strip(HY + '_') == ''
        if alone:
            if out: glue = True
            continue
        starts = variant == 'joint' and t[0] in HY
        if out and (glue or starts):
            o = out[-1]; o['text'] += t; o['bbox'] = [min(o['bbox'][0], w['bbox'][0]), min(o['bbox'][1], w['bbox'][1]), max(o['bbox'][2], w['bbox'][2]), max(o['bbox'][3], w['bbox'][3])]
            o['parts'].append(w)
        else:
            out.append(dict(text=t, bbox=list(w['bbox']), conf=w['conf'], parts=[w]))
        glue = out[-1]['text'][-1] in HY
    return out
