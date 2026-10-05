"""Stage 0b. Add the two Ngram shard outputs together into work/ngram_merged.json."""
import sys, json
sys.path.insert(0, '/tmp/claude-0/-home-claude/cde67b8f-675a-5d24-aafe-021536ff667e/scratchpad/freq/scripts')
from common import *
m = {}
for part in ('00000', '00001'):
    for k, v in json.load(open(f'{WORK}/ngram_shard_{part}.json')).items():
        x = m.setdefault(k, [0, 0, 0])
        for i in range(3): x[i] += v[i]
json.dump(m, open(WORK + '/ngram_merged.json', 'w'), ensure_ascii=False)
print(len(m))
