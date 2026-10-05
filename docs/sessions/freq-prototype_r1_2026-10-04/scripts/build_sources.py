"""Stage 1. Load each frequency source into a plain dict {form: ppm} (parts per million tokens), lower-cased,
and write work/sources.json. Lemma-level sources go into a separate dict keyed by lemma.
Run after ngram_merged.json exists. The Wikisource and UD poetry counts are built by build_poetry.py."""
import sys, json, gzip, tarfile, math, csv, collections
sys.path.insert(0, '/tmp/claude-0/-home-claude/cde67b8f-675a-5d24-aafe-021536ff667e/scratchpad/freq/scripts')
from common import *

def load_hermit(path):
    d = {}; tot = 0
    for line in open(path, encoding='utf-8'):
        w, _, c = line.rstrip('\n').rpartition(' ')
        c = int(c); tot += c
        d[w] = d.get(w, 0) + c
    return {w: c * 1e6 / tot for w, c in d.items()}, tot

src = {}; info = {}
src['hermit2018'], info['hermit2018_tokens'] = load_hermit(RAW + '/hermit_content_2018_ru_ru_full.txt')
src['hermit2016'], info['hermit2016_tokens'] = load_hermit(RAW + '/hermit_content_2016_ru_ru_full.txt')

# wordfreq (installed in ./venv); read the bundled msgpack directly so no tokenizer is involved
import msgpack
wp = BASE + '/venv/lib/python3.13/site-packages/wordfreq/data/large_ru.msgpack.gz'
raw = msgpack.unpackb(gzip.open(wp).read(), raw=False)
d = {}
for i, bucket in enumerate(raw[1:]):
    for w in bucket:
        d[w] = 10 ** (-i / 100.0) * 1e6          # bucket i is centibels below 1.0 (proportion), as wordfreq's cB_to_freq
src['wordfreq'] = d
info['wordfreq_buckets'] = len(raw) - 1

# Google Books Ngram v3 Russian, from ngram_merged.json
tc = open(RAW + '/ngram_rus_totalcounts-1.txt', encoding='utf-8').read().split('\t')
tot = [0, 0, 0]
for f in tc:
    p = f.strip().split(',')
    if len(p) < 4: continue
    y, n = int(p[0]), int(p[1])
    if y < 1800: continue
    tot[0 if y <= 1917 else (1 if y <= 1949 else 2)] += n
info['ngram_total_tokens_eras'] = tot
m = json.load(open(WORK + '/ngram_merged.json'))
old_letters, old_end, mid, modern = {}, {}, {}, {}
for k, v in m.items():
    if k.startswith('\x00'):
        continue
    ending_part = m.get('\x00' + k, [0, 0, 0])[0]
    if v[0] - ending_part > 0: old_letters[k] = (v[0] - ending_part) * 1e6 / tot[0]
    if v[0] > 0: old_end[k] = v[0] * 1e6 / tot[0]
    if v[2] > 0: modern[k] = v[2] * 1e6 / tot[2]
src['ngram_1800_1917_letters'] = old_letters
src['ngram_1800_1917'] = old_end
src['ngram_1950_2019'] = modern

# Leipzig news 2020 1M sentences (reference only; licence not established)
tf = tarfile.open(RAW + '/rus_news_2020_1M.tar.gz')
f = tf.extractfile('rus_news_2020_1M/rus_news_2020_1M-words.txt')
d = {}; tot = 0
for line in f:
    p = line.decode('utf-8').rstrip('\n').split('\t')
    if len(p) < 3: continue
    c = int(p[2]); w = p[1].lower(); tot += c
    d[w] = d.get(w, 0) + c
src['leipzig_news2020'] = {w: c * 1e6 / tot for w, c in d.items()}
info['leipzig_news2020_tokens'] = tot

# Lyashevskaya & Sharov lemma list (reference only; not usable)
ls = {}
for i, row in enumerate(csv.reader(open(RAW + '/freq2011/freqrnc2011.csv', encoding='utf-8'), delimiter='\t')):
    if i == 0: continue
    lem, pos, ipm = row[0].lower(), row[1], float(row[2])
    lem = fold(lem)
    ls[lem] = max(ls.get(lem, 0), ipm)
lemma_src = {'ls2011_lemmas': ls}

json.dump({'src': src, 'lemma_src': lemma_src, 'info': info}, open(WORK + '/sources.json', 'w'), ensure_ascii=False)
for k, v in src.items(): print(k, len(v))
print(info)
