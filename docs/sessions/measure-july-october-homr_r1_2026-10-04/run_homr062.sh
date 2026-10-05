#!/bin/bash
S=/tmp/claude-0/-home-claude/cde67b8f-675a-5d24-aafe-021536ff667e/scratchpad
cd $S/yard
for i in 1 4 5 2 3; do
  for f in old$i/page*_300dpi.png; do
    t0=$(date +%s)
    $S/homr062-venv/bin/homr "$f" > "${f%.png}.log" 2>&1
    echo "$f rc=$? $(( $(date +%s) - t0 ))s" >> progress062.txt
  done
done
echo ALLDONE >> progress062.txt
