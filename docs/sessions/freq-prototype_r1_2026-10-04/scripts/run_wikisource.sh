#!/bin/bash
# Stream the whole ruwikisource pages-articles dump (2.08 GB bz2, dated 2026-10-01) and keep poems of 19th-century authors. Nothing large is saved.
cd /tmp/claude-0/-home-claude/cde67b8f-675a-5d24-aafe-021536ff667e/scratchpad/freq/work
curl -sS -L --fail https://dumps.wikimedia.org/ruwikisource/latest/ruwikisource-latest-pages-articles.xml.bz2 | bzcat | python3 ../scripts/wikisource_extract.py wikisource_poems.jsonl
