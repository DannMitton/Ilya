"""N.135 stage 2b, cross-site line "the token split": splitTokens (apps/web/src/lib/omr/underlay-tokens.ts) against the stage 1 harness's tokens_of (score44.py lines 21 to 30, with common2.py's split_internal, copied here), on every word of every row of the harness's readings (ocr2/<song>-<reader>.json, readers a, c, t-imap, t-syl).
For each word, the harness's parts (the letter-bearing parts of the word split at a non-letter run between letters, the box shared by letters) against splitTokens' letter-bearing parts (their added hyphens removed): the number of parts, their text, and their centres.
Usage: python3 check_split.py   (needs node 22.18 or later)"""
import glob, json, os, re, subprocess, tempfile, collections
HERE = os.path.dirname(os.path.abspath(__file__)); D = f'{HERE}/../measure-n135-underlay-harness_2026-10-15/ocr2'
LET = 'A-Za-zА-Яа-яЁёѢѣІіѲѳѴѵ'
def split_internal(t): return [p for p in re.split(f'(?<=[{LET}])[^{LET}]+(?=[{LET}])', t) if p]   # common2.py
def letters(t): return ''.join(c for c in t if c.isalpha())
def has_letter(t): return any(c.isalpha() for c in t)
def harness_parts(w):   # score44.py tokens_of, for one word
    parts = [p for p in split_internal(w['text']) if has_letter(p)]
    if not parts: return []
    x0, x1 = w['bbox'][0], w['bbox'][2]; tot = sum(len(letters(p)) for p in parts); x = x0; out = []
    for p in parts:
        wd = (x1 - x0) * len(letters(p)) / tot; out.append((p, x + wd / 2)); x += wd
    return out
words = []; where = []
for f in sorted(glob.glob(f'{D}/*.json')):
    name = os.path.basename(f)[:-5]
    if name.endswith('.time') or name.endswith('-e'): continue
    for r in json.load(open(f)):
        for w in r['words']: words.append(w); where.append(name)
tmp = tempfile.mkdtemp(); fin, fout = f'{tmp}/in.json', f'{tmp}/out.json'
json.dump([dict(text=w['text'], x0=w['bbox'][0], x1=w['bbox'][2]) for w in words], open(fin, 'w'))
subprocess.run(['node', '--import', f'{HERE}/ts-register.mjs', f'{HERE}/check_split.mjs', fin, fout], check=True)
mine = json.load(open(fout)); cause = collections.Counter(); examples = []; parts = 0; split_words = 0
LETSET = set('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz') | {chr(c) for c in range(0x410, 0x450)} | set('ЁёѢѣІіѲѳѴѵ')
def same(h, m, strip): return len(h) == len(m) and all((a[0].strip() if strip else a[0]) == b[0] and abs(a[1] - b[1]) < 1e-6 for a, b in zip(h, m))
for w, m, name in zip(words, mine, where):
    h = harness_parts(w); parts += len(h); split_words += len(h) > 1
    if same(h, m, False): continue
    if same(h, m, True): cause['a space around the harness text, which splitTokens trims'] += 1; continue
    if any(c.isalpha() and c not in LETSET for c in w['text']): cause["a letter outside the harness's letter set (isalpha, but not in split_internal's), which splitTokens counts as a letter"] += 1; continue
    cause['UNEXPLAINED'] += 1
    if len(examples) < 8: examples.append((name, w['text'], h, m))
print(f'{len(words)} words in {len(set(where))} readings; {parts} letter-bearing parts by the harness, {split_words} words split into two parts or more; {sum(cause.values())} words differ between splitTokens and tokens_of')
for c, n in cause.most_common(): print(f'  {n}: {c}')
for e in examples: print('  UNEXPLAINED:', e)
