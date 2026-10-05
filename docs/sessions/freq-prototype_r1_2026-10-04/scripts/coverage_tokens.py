"""Token-level coverage on real 19th-century poetry: UD_Russian-Poetry (19th-century documents) and the Wikisource poem count.
Reads work/arrays.npz (made by measure.py). Prints a markdown table."""
import sys, json, collections
import numpy as np
sys.path.insert(0, '/tmp/claude-0/-home-claude/cde67b8f-675a-5d24-aafe-021536ff667e/scratchpad/freq/scripts')
from common import *
forms, lemma_of = load_dictionary()
fidx = {f: i for i, f in enumerate(forms)}
_z = np.load(WORK + '/arrays.npz'); z = {k: _z[k] for k in _z.files}
names = ['hermit2018', 'wordfreq', 'ngram_1800_1917', 'ngram_1950_2019', 'poetry_ws']
ud = [t[0] for t in json.load(open(WORK + '/ud_xix.json'))['tokens']]
P = json.load(open(WORK + '/poetry_ws.json'))
def report(label, toks):
    n = len(toks); inn = [t for t in toks if t in fidx]
    print(f'\n{label}: {n:,} tokens; exact dictionary form: {len(inn):,} ({100*len(inn)/n:.1f}%)')
    print('| source | own form found | via lemma | (share of tokens that ARE dictionary forms) |')
    for nm in names:
        o = sum(1 for t in inn if z['own_' + nm][fidx[t]] > 0); l = sum(1 for t in inn if z['lem_' + nm][fidx[t]] > 0)
        print(f'| {nm} | {100*o/len(inn):.1f}% | {100*l/len(inn):.1f}% | |')
report('UD_Russian-Poetry, 19th-century documents', ud)
tot = sum(P['C'].values()); inn = sum(c for w, c in P['C'].items() if w in fidx)
print(f'\nWikisource poem count: {tot:,} tokens, {len(P["C"]):,} types; tokens that are exact dictionary forms: {100*inn/tot:.1f}%; types: {100*sum(1 for w in P["C"] if w in fidx)/len(P["C"]):.1f}%')
miss = sorted(((c, w) for w, c in P['C'].items() if w not in fidx and c >= 30), reverse=True)[:30]
print('most frequent poetry forms missing from the dictionary (count>=30):', [(w, c) for c, w in miss])
