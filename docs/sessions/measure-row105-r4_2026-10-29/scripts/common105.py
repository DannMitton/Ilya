# r4 edits (2026-10-29): WORKD and the comment on MEAS; nothing else.
"""Row 105 shared helpers. modern() and cut() call the repo's own modernisePreReform and GraysonEngine.syllabify through vite-node (bin/tsx wrapper), cached in a json file."""
import json, os, re, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); MEAS = os.path.dirname(HERE)  # r4: scripts/ replaces build/
REPO = os.path.abspath(os.path.join(MEAS, '../../..'))
PRIV = os.path.expanduser('~/Downloads/_desk-row105/private'); WORKD = os.path.expanduser('~/Downloads/_desk-row105/r4/work')   # r4 edit: WORKD is r4's own (r3's ~/Downloads/_desk-row105 stays as it is); PRIV (the derived n-grams of the truth texts) is r3's, read only
os.makedirs(PRIV, exist_ok=True); os.makedirs(WORKD, exist_ok=True)
CACHE = f'{WORKD}/nodecache.json'
_c = json.load(open(CACHE, encoding='utf8')) if os.path.exists(CACHE) else {'modernise': {}, 'syllabify': {}}
def prime(mod=(), syl=()):
    need_m = sorted({w for w in mod if w not in _c['modernise']}); need_s = sorted({w for w in syl if w not in _c['syllabify']})
    for i in range(0, max(len(need_m), len(need_s), 1), 60000):
        m, s = need_m[i:i + 60000], need_s[i:i + 60000]
        if not m and not s: break
        tin, tout = f'{WORKD}/.nt-in.json', f'{WORKD}/.nt-out.json'
        json.dump({'modernise': m, 'syllabify': s}, open(tin, 'w', encoding='utf8'), ensure_ascii=False)
        subprocess.run([f'{MEAS}/bin/tsx', f'{HERE}/nodetool.ts', tin, tout], check=True, cwd=REPO, capture_output=True)
        o = json.load(open(tout, encoding='utf8'))
        for w, v in o['modernise']: _c['modernise'][w] = v
        for w, v in o['syllabify']: _c['syllabify'][w] = v
    json.dump(_c, open(CACHE, 'w', encoding='utf8'), ensure_ascii=False)
def modern(w):
    if w not in _c['modernise']: prime([w])
    m = _c['modernise'][w]; return w if m is None else m
def cut_modern(w):
    if w not in _c['syllabify']: prime(syl=[w])
    return _c['syllabify'][w]
def fold(t): return re.sub(r'[^а-я]', '', t.lower().replace('ё', 'е'))
def letters(t): return ''.join(c for c in t if c.isalpha())
