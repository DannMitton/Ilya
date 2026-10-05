#!/bin/bash
# The order the desk ran things in, 2026-10-04. Read it, then run the steps one at a time; it is not meant to be fired blind.
# Every script keeps its paths in scripts/common.py (BASE). Change BASE there to your own scratch folder first.
set -e
BASE=/tmp/claude-0/-home-claude/cde67b8f-675a-5d24-aafe-021536ff667e/scratchpad/freq
mkdir -p $BASE/raw $BASE/work $BASE/scripts $BASE/raw/freq2011 $BASE/raw/udpoetry
cp "$(dirname "$0")"/*.py "$(dirname "$0")"/*.sh $BASE/scripts/
cd $BASE

# 1. Downloads (md5 sums are in ../raw-md5.txt)
G=https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content
curl -sSL -o raw/hermit_content_2018_ru_ru_full.txt $G/2018/ru/ru_full.txt
curl -sSL -o raw/hermit_content_2016_ru_ru_full.txt $G/2016/ru/ru_full.txt
curl -sSL -o raw/Freq2011.zip http://dict.ruslang.ru/Freq2011.zip && unzip -o -q raw/Freq2011.zip -d raw/freq2011   # reference only, not licensed
curl -sSL -o raw/rus_news_2020_1M.tar.gz https://downloads.wortschatz-leipzig.de/corpora/rus_news_2020_1M.tar.gz     # reference only, licence not established
U=https://raw.githubusercontent.com/UniversalDependencies/UD_Russian-Poetry/master
for f in ru_poetry-ud-train.conllu ru_poetry-ud-dev.conllu ru_poetry-ud-test.conllu; do curl -sSL -o raw/udpoetry/$f $U/$f; done
curl -sSL http://storage.googleapis.com/books/ngrams/books/20200217/rus/totalcounts-1 -o raw/ngram_rus_totalcounts-1.txt
curl -sSG "https://ru.wikisource.org/w/api.php" --data-urlencode "action=query" --data-urlencode "prop=revisions|info" \
  --data-urlencode "rvprop=content|timestamp|ids" --data-urlencode "rvslots=main" \
  --data-urlencode "titles=Средь шумного бала, случайно (А. К. Толстой)" --data-urlencode "format=json" -o raw/poem_raw.json
python3 - <<'PY'
import json
d = json.load(open('raw/poem_raw.json')); p = list(d['query']['pages'].values())[0]
open('raw/poem_wikitext.txt', 'w').write(p['revisions'][0]['slots']['main']['*'])
PY
python3 -m venv venv && ./venv/bin/pip install -q wordfreq==3.1.1 msgpack

# 2. Streams (about 2.3 GB and 2.1 GB over the network; nothing large is kept)
python3 scripts/make_targets.py
bash scripts/run_ngrams.sh            # Google Books Ngram v3, Russian 1-grams, two shards
python3 scripts/merge_ngrams.py
bash scripts/run_wikisource.sh        # ruwikisource dump, 10 to 15 minutes

# 3. Build and measure
./venv/bin/python scripts/build_sources.py
python3 scripts/build_poetry.py
python3 scripts/measure.py > work/measure_out.txt        # about 5 minutes
python3 scripts/coverage_tokens.py
python3 scripts/measure_quant.py
python3 scripts/measure_margin.py
python3 scripts/build_prototype.py                        # writes outputs/freq-prototype_r1_2026-10-04/
