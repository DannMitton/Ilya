"""N.135 stage 1, amendment 5: what a misread word becomes. On every Russian row (label.py), each reader's sewn words of two or more letters (row 81's 'joint' sewing, hyphen-split tokens
for the sewn word as read) are sorted into: a word of the song's transcription (right, after modernisePreReform and folding); not a word of the song and not an entry of the dictionary
(a non-word: the pipeline gives it no stress and no gloss, pipeline.ts:670, :734); not a word of the song but an entry of the dictionary (a misread that is itself a word: nothing in the tree
catches it, OPEN.md:2367-2368). The dictionary is wordlists/ru.txt (data/dictionary*.json keys). Usage: RULE=R2 python3 scorewords.py -> scorewords-<RULE>.txt"""
import collections
from common2 import *
ru = {w.replace('-', '') for w in wordlist('ru')}; Ps = {L: transcription(L) for L in SONGS}
readers = [m for m in READERS43 if all(os.path.exists(f'{HERE}/ocr{D}/{L}-{m}.json') for L in SONGS)]
prime([w['text'] for L in SONGS for m in readers for r in ocr(L, m) for w in sew(r['words'])] + [w for L in SONGS for w in poem_words(Ps[L])] + [x for L in SONGS for v in Ps[L].values() for x in v])
tot = collections.defaultdict(collections.Counter)
for L in SONGS:
    PW = {norm(w) for w in poem_words(Ps[L])} | {norm(x) for v in Ps[L].values() for x in v}  # a whole word or a whole printed syllable of the song (row 81's 'syll')
    for m in readers:
        O = {rid(r): r for r in ocr(L, m)}
        for k in Ps[L]:
            for w in sew(O[k]['words']):
                n = norm(w['text'])
                if len(n) < 2: continue
                c = tot[(m, L[0] if L[0] in 'UB' else ('P' if L == 'P' else 'STKM'))]
                c['words'] += 1
                if n in PW: c['song'] += 1
                elif n in ru: c['dictword'] += 1
                else: c['nonword'] += 1
lines = [f'RULE {RULE}. Words of two or more letters read on the Russian rows, by group and reader: a whole word or whole printed syllable of the song / not of the song but a dictionary entry (a misread that is itself a word) / not a dictionary entry (a non-word)']
for g in ('U', 'P', 'B', 'STKM'):
    for m in readers:
        c = tot[(m, g)]; lines.append(f"{g} ({m}): {c['words']} words; of the song {c['song']} ({100 * c['song'] / max(1, c['words']):.0f}%); dictionary-word misreads {c['dictword']} ({100 * c['dictword'] / max(1, c['words']):.0f}%); non-words {c['nonword']} ({100 * c['nonword'] / max(1, c['words']):.0f}%)")
for m in readers:
    c = sum((tot[(m, g)] for g in ('U', 'P', 'B', 'STKM')), collections.Counter()); lines.append(f"all ({m}): {c['words']} words; of the song {c['song']}; dictionary-word misreads {c['dictword']}; non-words {c['nonword']}")
open(f'{HERE}/scorewords-{RULE}.txt', 'w', encoding='utf8').write('\n'.join(lines) + '\n'); print('\n'.join(lines))
