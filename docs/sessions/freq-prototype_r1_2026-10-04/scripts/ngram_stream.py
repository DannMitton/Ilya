"""Read one Google Books Ngram v3 Russian 1-gram shard (gunzipped text) on stdin.
For every token that maps (after lower-casing, Ilya's pre-reform letter map, and e-for-yo folding)
onto a form in the target set, add its counts into three eras:
   0 = years 1800-1917, 1 = 1918-1949, 2 = 1950-2019.
Pre-1918 ending rules (-аго, -яго, -ыя, -ія) add the same count under the modern ending as well, for era 0 only.
Output: JSON {key: [e0, e1, e2]} where key is the letter-mapped lower-case token (not folded), written to argv[2]."""
import sys, json, re
sys.path.insert(0, '/tmp/claude-0/-home-claude/cde67b8f-675a-5d24-aafe-021536ff667e/scratchpad/freq/scripts')
from common import *

targets = set(json.load(open(sys.argv[1])))        # folded target forms
out = {}
CYR = re.compile(r'^[а-яёѣѳіѵ-]+$')
nlines = nkeep = 0
for raw in sys.stdin.buffer:
    nlines += 1
    tok, _, rest = raw.partition(b'\t')
    if b'_' in tok:
        continue
    try:
        t = tok.decode('utf-8').lower()
    except UnicodeDecodeError:
        continue
    if not CYR.match(t):
        continue
    k = letter_map(t)
    keys = [k]
    cand = [fold(k)] + [fold(x) for x in ending_variants(k)]
    if not any(c in targets for c in cand):
        continue
    nkeep += 1
    c = [0, 0, 0]
    for f in rest.split(b'\t'):
        p = f.split(b',')
        if len(p) < 3:
            continue
        y = int(p[0]); n = int(p[1])
        if y < 1800:
            continue
        if y <= 1917: c[0] += n
        elif y <= 1949: c[1] += n
        else: c[2] += n
    # exact key (own spelling)
    if fold(k) in targets:
        a = out.setdefault(k, [0, 0, 0])
        for i in range(3): a[i] += c[i]
    # ending variants, era 0 only
    if c[0]:
        for x in ending_variants(k):
            if fold(x) in targets:
                a = out.setdefault(x, [0, 0, 0])
                a[0] += c[0]
                # mark: counts that came through an ending rule are tracked separately
                a2 = out.setdefault('\x00' + x, [0, 0, 0])
                a2[0] += c[0]
json.dump(out, open(sys.argv[2], 'w'), ensure_ascii=False)
print('lines', nlines, 'kept', nkeep, 'keys', len(out), file=sys.stderr)
