"""Row 105 r4 (new): the desk's confusion pairs (brief r5, "Desk addition"), counted per model on the 18 songs from the same alignment score117.py uses (align_syl, SPLIT=1 tokens).
Only syllables aligned one to one and not read right are counted; each is compared letter by letter (difflib) with the truth syllable's letters (lowercase, letters() of common2).
Usage (cwd the harness folder n135-row117/harness, RULE=R2): confusion4.py <ocr dir> <out.json> ; prints the pairs."""
import sys, os, json, collections, difflib
sys.path.insert(0, os.path.join(os.environ["MROOT"], "n135-row117/harness"))
from common2 import *
from score42 import align_syl
SONGS = ['B01','B02','B03','B04','B06','B07','B08','B09','B10','S','T','K','M','U1','U4','U5','U6','P']
PAIRS = [('ь→ъ', 'ь', {'ъ'}), ('ы→ъ, ь, ът, ьт', 'ы', {'ъ', 'ь', 'ът', 'ьт'}), ('й→и, н, ш', 'й', {'и', 'н', 'ш'}), ('с→е', 'с', {'е'}), ('о→с', 'о', {'с'}), ('с→о', 'с', {'о'}),
         ('и→н', 'и', {'н'}), ('п→н', 'п', {'н'}), ('г→т', 'г', {'т'}), ('г dropped', 'г', {''})]
ocrdir, out = sys.argv[1], sys.argv[2]; Ps = {L: transcription(L) for L in SONGS}
prime([s for L in SONGS for v in Ps[L].values() for s in v] + [letters(s) for L in SONGS for v in Ps[L].values() for s in v])
cnt = collections.Counter(); one_to_one_wrong = 0; allsub = collections.Counter()
for L in SONGS:
    R = {rid(r): r for r in json.load(open(f'{ocrdir}/{L}-dfloat.json'))}
    for k, syls in Ps[L].items():
        S = [letters(s).lower() for s in syls]; ws = sorted(R[k]['words'], key=lambda w: w['bbox'][0])
        ws = [dict(text=p) for w in ws for p in split_internal(w['text'])]; toks = [letters(w['text']) for w in ws]; toks = [t for t in toks if t]; T = [t.lower() for t in toks]
        for si, tj in align_syl(S, T):
            if len(si) == 1 and len(tj) == 1 and not norm(toks[tj[0]]) == norm(syls[si[0]]):
                one_to_one_wrong += 1; a, b = S[si[0]], T[tj[0]]
                for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
                    if op == 'equal': continue
                    x, y = a[i1:i2], b[j1:j2]; allsub[(x, y)] += 1
                    for name, t, ys in PAIRS:
                        if x == t and y in ys: cnt[name] += 1
res = dict(one_to_one_misread=one_to_one_wrong, pairs={n: cnt[n] for n, _, _ in PAIRS}, top_substitutions=[[x, y, c] for (x, y), c in allsub.most_common(25)])
json.dump(res, open(out, 'w'), ensure_ascii=False, indent=1); print(json.dumps(res, ensure_ascii=False))
