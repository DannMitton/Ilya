"""Row 105: the three-word runs of the build songs' truth text (harness/align/<L>.json syl, poem-r81.txt for S, T, K, M) and of row 114's four truth files
(read by this script only, derived data kept outside the tree in ~/Downloads/_desk-row105/private/). Also the punctuation the build songs' truth shows, per word end.
Words: syllables joined by the type rule (start/middle continue the word; end/single close it), then folded after modernisePreReform."""
import json, re, glob, os, collections
from common105 import *
HARN = f'{MEAS}/n135-row117/harness'
SONGS = ['U1','U4','U5','U6','P','B01','B02','B03','B04','B06','B07','B08','B09','B10','S','T','K','M']
PUNCT = set('.,!?;:—–-«»"\'…()')
def words_from_notes(notes):
    """notes: [(syl text, type)] in order -> list of raw words (two variants: split at inner spaces of one note, or kept joined)."""
    A, B = [], []; ca = cb = ''
    for txt, typ in notes:
        if not txt: continue
        parts = [p for p in re.split(r'[\s ]+', txt.strip()) if re.search(r'[А-Яа-яЁёѢѣІіѲѳѴѵ]', p)]
        if not parts: continue
        cb += ''.join(parts)
        for p in parts[:-1]: ca += p; A.append(ca); ca = ''
        ca += parts[-1]
        if typ in ('end', 'single', None, ''):
            A.append(ca); ca = ''; B.append(cb); cb = ''
    if ca: A.append(ca)
    if cb: B.append(cb)
    return A, B
def build_songs():
    out = {}
    for L in SONGS:
        f = f'{HARN}/align/{L}.json'
        if not os.path.exists(f): continue
        t = json.load(open(f, encoding='utf8'))['truth']
        out[L] = words_from_notes([(e['syl'], e['sylType']) for e in t if e['type'] == 'note' and e['syl']])
    return out
def poem_lines():
    return [l.strip() for l in open(f'{HARN}/poem-r81.txt', encoding='utf8') if l.strip()]
def row114():
    out = {}
    for f in sorted(glob.glob(os.path.expanduser('~/Downloads/_colleague-pages/run-2026-10-19/truth-song/song*.truth.json'))):
        b = os.path.basename(f)
        if 'with-unsure' in b: continue
        d = json.load(open(f, encoding='utf8')); notes = []
        for v in d['verses']:
            notes += [(e.get('syllableText'), e.get('syllableType')) for e in v['notes'] if e.get('syllableText')]
        out[b.split('.')[0]] = words_from_notes(notes)
    return out
def folded(words):
    prime(mod=[letters(w) for w in words])
    return [fold(modern(letters(w))) for w in words if fold(modern(letters(w)))]
if __name__ == '__main__':
    bs = build_songs(); r114 = row114(); poem = poem_lines()
    grams = {}  # gram -> [origin ...]
    def add(origin, fw):
        for i in range(len(fw) - 2): grams.setdefault(' '.join(fw[i:i + 3]), set()).add(origin)
    counts = {}
    for L, (A, B) in bs.items():
        for v, W in (('a', A), ('b', B)): add(L, folded(W))
        counts[L] = len(B)
    for l in poem:
        add('poem-r81', folded(l.split()))
    for s, (A, B) in r114.items():
        for W in (A, B): add('r114:' + s, folded(W))
        counts['r114:' + s] = len(B)
    json.dump({k: sorted(v) for k, v in grams.items()}, open(f'{PRIV}/ngrams.json', 'w', encoding='utf8'), ensure_ascii=False)
    json.dump(counts, open(f'{PRIV}/truth-word-counts.json', 'w'))
    print('grams', len(grams)); print({k: v for k, v in counts.items()})
    # punctuation per word end, build songs only (the proportions the brief asks for)
    ends = collections.Counter(); pre = collections.Counter(); nw = 0
    for L, (A, B) in bs.items():
        for w in B:
            nw += 1; m = re.match(r'^(\W*)(.*?)(\W*)$', w); pre[m.group(1)] += 1; ends[m.group(3)] += 1
    json.dump({'words': nw, 'end': ends.most_common(), 'start': pre.most_common()}, open(f'{MEAS}/build/punct-stats.json', 'w', encoding='utf8'), ensure_ascii=False)
    print(nw, ends.most_common(12), pre.most_common(6))
