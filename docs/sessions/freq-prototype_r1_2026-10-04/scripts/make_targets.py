"""Stage 0. Write work/targets.json: every dictionary form and every poem word, folded (yo -> ye), plus the letter-mapped forms.
ngram_stream.py keeps only Ngram tokens that land on one of these."""
import sys, json
sys.path.insert(0, '/tmp/claude-0/-home-claude/cde67b8f-675a-5d24-aafe-021536ff667e/scratchpad/freq/scripts')
from common import *
forms, lem = load_dictionary()
t = set(fold(f) for f in forms) | set(fold(w) for w in poem_words())
t |= set(fold(letter_map(f)) for f in forms)
json.dump(sorted(t), open(WORK + '/targets.json', 'w'), ensure_ascii=False)
open(WORK + '/poem_words.txt', 'w').write('\n'.join(poem_words()) + '\n')
print(len(t))
