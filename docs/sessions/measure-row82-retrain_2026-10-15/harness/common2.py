"""N.135 stage 1: shared loading. Row 81's common.py (normalising, sewing) with this folder's files; the song list; the system of every read note;
the printed syllables of a system from the truth (or, for S, T, K, M, row 81's poem.txt)."""
import json, os, re, subprocess, difflib, statistics
HERE = os.path.dirname(os.path.abspath(__file__)); REPO = os.path.abspath(f'{HERE}/../../../..')  # row 82 retrain copy: one folder deeper
HOME = os.path.expanduser('~'); WORK = f'{HOME}/Downloads/_desk-n135'
SONGS = ['U1', 'U4', 'U5', 'U6', 'P', 'B01', 'B02', 'B03', 'B04', 'B06', 'B07', 'B08', 'B09', 'B10', 'S', 'T', 'K', 'M']
BUILD_NEW = SONGS[:14]; FOUR = 'STKM'
READERS = ['a', 'c', 'd', 't-imap', 't-syl']  # t-syl exists for R2 only and for the Russian rows only (read_tsyl.py)
READERS43 = ['a', 'c', 'd', 't-imap']  # the readers that read every row, for the language decisions
HY = '-–—‐'
RULE = os.environ.get('RULE', 'R1'); D = '' if RULE == 'R1' else '2'  # R1: row 81's rows; R2: R1's rows split at the valleys of their ink (rowsys2.py)

def events(L): return json.load(open(f'{HERE}/notes/{L}.json'))
def align(L): return json.load(open(f'{HERE}/align/{L}.json'))
def rows(L): return [json.loads(l) for l in open(f'{HERE}/rows{D}/{L}.jsonl')]
def systems(L): return [json.loads(l) for l in open(f'{HERE}/systems/{L}.jsonl')]
def ocr(L, m): return json.load(open(f'{HERE}/ocr{D}/{L}-{m}.json'))
def labels(L): return json.load(open(f'{HERE}/labels{D}/{L}.json'))
def rid(r): return f"p{r['page']}s{r['system']}r{r['row']}"
def sid(page, system): return f'p{page}s{system}'

def note_systems(L):
    """{event index: (page, system)} for every note event with an imgpos, by systems.py's grouping (notes of a page by y, a gap of 600 px or more starts a system)."""
    ev = events(L); out = {}
    for page in sorted({e['page'] for e in ev if e['x'] is not None}):
        idx = sorted([i for i, e in enumerate(ev) if e['page'] == page and not e['rest'] and e['x'] is not None], key=lambda i: ev[i]['y'])
        groups = []
        for i in idx:
            if groups and ev[i]['y'] - ev[groups[-1][-1]]['y'] < 600: groups[-1].append(i)
            else: groups.append([i])
        for k, g in enumerate(groups, 1):
            for i in g: out[i] = (page, k)
    return out

def split_syl(text, typ):
    """One truth note's syllableText into printed syllables: split at spaces; a start or middle syllable ends with a hyphen. Punctuation stays (the scorer strips it)."""
    parts = [p for p in re.split(r'[\s ]+', text.strip()) if re.search(r'[А-Яа-яЁёѢѣІіѲѳѴѵ]', p)]
    out = []
    for i, p in enumerate(parts):
        last = i == len(parts) - 1
        out.append(p + ('-' if last and typ in ('start', 'middle') else ''))
    return out

def truth_by_system(L):
    """{(page, system): [(truth index, printed syllable)]} from the truth's syllables in truth order. A truth note the reader missed goes to the
    system of its bar (by the matched notes of that bar), else of the last matched note before it."""
    a = align(L); ev = events(L); ns = note_systems(L)
    t2r = {t: r for r, t in a['match']}
    bar_sys = {}
    for t in a['truth']:
        r = t2r.get(t['i'])
        if r is not None and r in ns: bar_sys.setdefault(t['bar'], {}).setdefault(ns[r], 0); bar_sys[t['bar']][ns[r]] += 1
    out = {}; last = None
    for t in a['truth']:
        r = t2r.get(t['i']); s = ns.get(r) if r is not None else None
        if s is None and t['bar'] in bar_sys: s = max(bar_sys[t['bar']], key=bar_sys[t['bar']].get)
        if s is None: s = last
        if s is not None: last = s
        if t['type'] != 'note' or not t['syl'] or s is None: continue
        for p in split_syl(t['syl'], t['sylType']): out.setdefault(s, []).append((t['i'], p))
    return out

# ---- normalising (row 81's common.py) ----
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
def letters(t): return ''.join(c for c in t if c.isalpha())
# the row-label similarity (labels only): every pre-reform letter to its modern one, hard signs dropped
def crude(t): return re.sub(r'[^а-я]', '', t.lower().replace('ё', 'е').replace('ѣ', 'е').replace('і', 'и').replace('ѳ', 'ф').replace('ѵ', 'и').replace('ъ', ''))

def sew(words, variant='joint'):
    """Row 81's sew (unchanged)."""
    ws = sorted([w for w in words if w['text'].strip()], key=lambda w: w['bbox'][0]); out = []; glue = False
    for w in ws:
        t = w['text']; alone = variant == 'joint' and t.strip(HY + '_') == ''
        if alone:
            if out: glue = True
            continue
        starts = variant == 'joint' and t[0] in HY
        if out and (glue or starts):
            o = out[-1]; o['text'] += t; o['bbox'] = [min(o['bbox'][0], w['bbox'][0]), min(o['bbox'][1], w['bbox'][1]), max(o['bbox'][2], w['bbox'][2]), max(o['bbox'][3], w['bbox'][3])]; o['parts'].append(w)
        else: out.append(dict(text=t, bbox=list(w['bbox']), conf=w['conf'], parts=[w]))
        glue = out[-1]['text'][-1] in HY
    return out

def wordlist(name): return {l.strip() for l in open(f'{WORK}/wordlists/{name}.txt', encoding='utf8') if l.strip()}

# ---- transcription, per row (4.2) ----
def poem_r81():
    out = {}
    for l in open(f'{HERE}/poem-r81.txt', encoding='utf8'):
        if l.startswith('#') or not l.strip(): continue
        k, v = l.rstrip('\n').split(': ', 1); a, r = k.split(); out.setdefault(a, {})[r] = v.split()
    return out
def transcription(L):
    """{row id: [printed syllables, '-' kept]} for the Russian rows of the current RULE. S, T, K, M: row 81's poem.txt (its rows are R1 rows; an R2 row stands for one only where unsplit).
    The others: the truth's syllables of the system, typed in note order (split_syl), on the system's row labelled Russian. NOT corrected to the print beyond the by-eye checks."""
    lab = labels(L)['rows']; R = rows(L)
    if L in FOUR:
        P = poem_r81()[L]; out = {}
        for r in R:
            if lab[rid(r)] == 'russian': out[rid(r)] = P[r.get('from', rid(r))]
        return out
    T = truth_by_system(L); out = {}
    for r in R:
        if lab[rid(r)] == 'russian': out[rid(r)] = [p for _, p in T.get((r['page'], r['system']), [])]
    return out
def poem_words(P):
    words, cur = [], ''
    for k, syls in P.items():
        for s in syls:
            cur += s.rstrip('-')
            if not s.endswith('-'): words.append(cur); cur = ''
    if cur: words.append(cur)
    return words

LET = 'A-Za-zА-Яа-яЁёѢѣІіѲѳѴѵ'
def split_internal(t):
    """A token split at every run of non-letters that lies between two letters (a hyphen, a period or a dash read where the print has a short underscore); marks at its ends stay on it. MINE."""
    return [p for p in re.split(f'(?<=[{LET}])[^{LET}]+(?=[{LET}])', t) if p]
