"""N.135 stage 2b, cross-site line "where a syllable divides": every word in the build songs' truth (the harness's align/<song>.json: the print's syllables, with sylType start/middle/end/whole), the print's division against the engine's cut (GraysonEngine.syllabify, packages/phonology/src/engine.ts), for the words of two syllables or more.
The truth is modern spelling for U1 to U6 and B01 to B10, pre-reform for P (the harness's report, section 1). Words with a syllable that holds no letter are left out.
Usage: python3 engine_cut.py   (needs node 22.18 or later)"""
import glob, json, os, re, subprocess, tempfile, collections
HERE = os.path.dirname(os.path.abspath(__file__)); A = f'{HERE}/../measure-n135-underlay-harness_2026-10-15/align'
def letters(t): return ''.join(c for c in t if c.isalpha()).lower()
words = []
for f in sorted(glob.glob(f'{A}/*.json')):
    song = os.path.basename(f)[:-5]; cur = []
    for t in json.load(open(f))['truth']:
        if t['type'] != 'note' or not t.get('syl'): continue
        # a truth note's syllableText can hold two printed syllables separated by a space
        for part in [p for p in re.split(r'[\\s\\u00a0]+', t['syl'].strip()) if letters(p)]:
            ty = t['sylType']
            if ty in ('whole', None): words.append((song, [letters(part)])); cur = []
            elif ty == 'start': cur = [letters(part)]
            elif ty == 'middle': cur.append(letters(part))
            elif ty == 'end':
                cur.append(letters(part)); words.append((song, cur)); cur = []
tmp = tempfile.mkdtemp(); fin, fout = f'{tmp}/in.json', f'{tmp}/out.json'
json.dump([''.join(w) for _, w in words], open(fin, 'w'))
subprocess.run(['node', '--import', f'{HERE}/ts-register.mjs', f'{HERE}/engine_cut.mjs', fin, fout], check=True)
cuts = json.load(open(fout)); multi = [(s, w, c) for (s, w), c in zip(words, cuts) if len(w) >= 2]
bad = [(s, w, c) for s, w, c in multi if w != c]; singles = [(s, w, c) for (s, w), c in zip(words, cuts) if len(w) == 1 and len(c) >= 2]
print(f'{len(words)} words in {len(set(s for s, _ in words))} songs; {len(multi)} printed in two syllables or more; the engine cuts {len(bad)} of them differently from the print ({100 * len(bad) / max(1, len(multi)):.1f}%); {len(singles)} words printed whole (one note) that the engine would cut in two or more.')
by = collections.Counter(s for s, _, _ in bad); print('by song:', dict(sorted(by.items())))
uniq = collections.Counter(('-'.join(w), '-'.join(c)) for _, w, c in bad)
print(f'{len(uniq)} different words; the most frequent:')
for (p, e), n in uniq.most_common(25): print(f'  {n:3d}  print {p}  engine {e}')
open(f'{HERE}/engine-cut-all.txt', 'w', encoding='utf8').write('\n'.join(f'{n}\t{p}\t{e}' for (p, e), n in uniq.most_common()) + '\n')
