#!/bin/bash
# Stream both Russian v3 1-gram shards from Google (about 2.3 GB gzipped in all) and filter on the fly. Nothing large is saved.
cd /tmp/claude-0/-home-claude/cde67b8f-675a-5d24-aafe-021536ff667e/scratchpad/freq/work
for n in 00000 00001; do
  ( curl -sS -L --fail "https://storage.googleapis.com/books/ngrams/books/20200217/rus/1-$n-of-00002.gz" | gunzip -c | python3 ../scripts/ngram_stream.py targets.json ngram_shard_$n.json ) > ngram_$n.log 2>&1 &
done
wait
