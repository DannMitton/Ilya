"""N.135 stage 1, 4.4: the four findings of Dann's walk on P (QUEUE-archive.md:188), by name: for each reader and each seating rule, the tokens seated on the truth notes that carry
the draft's syllables (the draft is the desk's, not proofed by Dann): the comma after «суеты» (bar 16); «те-бя» lower-case; «грустно» twice in bars 77 to 78; «звучитъ!».
Usage: RULE=R2 python3 walk.py -> walk-<RULE>.txt"""
from common2 import *
from score44 import run, readers
al = align('P'); syl = [(t['i'], t['syl'], t['bar']) for t in al['truth'] if t['type'] == 'note' and t['syl']]
def find(seq):
    for k in range(len(syl) - len(seq) + 1):
        if [s for _, s, _ in syl[k:k + len(seq)]] == seq: return syl[k:k + len(seq)]
    return None
checks = [('the comma after «суеты» (bar 16)', ['су', 'е', 'ты,']), ('«те-бя» lower-case', ['те', 'бя']), ('«грустно» twice (bars 77 to 78)', ['груст', 'но', 'я,', 'груст', 'но']), ('«звучитъ!» with its mark', ['зву', 'читъ!'])]
out = [f'RULE {RULE}. P: the truth is the desk\'s draft (truth-draft-tchaikovsky-op38-3-voice_r2_2026-10-02.json), not proofed by Dann. Per check: the draft syllables, then per reader and rule the token(s) seated on each of their notes, and whether the letters are right (case folded, marks out) and whether the text is exact (case and marks kept, a hyphen out) (raw reader text; ∅ = nothing seated; ✗ = the note was not read by homr).']
for m in readers:
    res, ev, al_, t2r, r2t = run('P', m)
    for name, seq in checks:
        f = find(seq)
        if not f: out.append(f'({m}) {name}: sequence {seq} NOT FOUND in the draft'); continue
        out.append(f"({m}) {name}: draft {' | '.join(s for _, s, _ in f)} (bars {sorted({b for _, _, b in f})})")
        for rule in (1, 3):
            seats = res[rule]['seats']; cells = []
            for i, s, b in f:
                r = t2r.get(i)
                cells.append('✗' if r is None else (' + '.join(t for t, _ in seats.get(r, [])) or '∅'))
            ok = all(r is not None and ''.join(letters(t) for t, _ in res[rule]['seats'].get(r, [])).lower() == letters(s).lower() for (i, s, b), r in ((x, t2r.get(x[0])) for x in f))
            ex = all(r is not None and ''.join(t for t, _ in res[rule]['seats'].get(r, [])).replace('-', '') == s for (i, s, b), r in ((x, t2r.get(x[0])) for x in f))
            out.append(f"    rule {rule}: {' | '.join(cells)}   {'letters right' if ok else 'letters NOT all right'}; {'EXACT: case and marks as the draft has them' if ex else 'not exact (case or a mark differs)'}")
open(f'{HERE}/walk-{RULE}.txt', 'w', encoding='utf8').write('\n'.join(out) + '\n'); print('\n'.join(out))
