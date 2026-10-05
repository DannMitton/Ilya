#!/bin/bash
cd /tmp/claude-0/-home-claude/cde67b8f-675a-5d24-aafe-021536ff667e/scratchpad/part22/work/homr
export OMP_NUM_THREADS=1
for f in sun-*.png; do
  if [ ! -f "${f%.png}.musicxml" ]; then
    nice -n 10 /tmp/claude-0/-home-claude/cde67b8f-675a-5d24-aafe-021536ff667e/scratchpad/homrmain-venv/bin/homr "$f" > "${f%.png}.log" 2>&1
  fi
  date +%T >> progress.txt; echo "$f" >> progress.txt
done
echo DONE >> progress.txt
