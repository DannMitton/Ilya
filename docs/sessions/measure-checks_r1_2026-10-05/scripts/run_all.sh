#!/bin/bash
# Reruns every measurement from the copied inputs in /home/claude/checks/in/. Reads the kit and the Ilya clone; writes only under /home/claude/checks/out/.
set -e
cd /home/claude/wire-465/ilya
npx --yes tsx /home/claude/checks/join.mts
cd /home/claude/checks
declare -A T=([tch]=tchaikovsky-op38-3.truth-draft.json [sun1]=mussorgsky_sunless-01_within-four-walls.truth.json [sun4]=mussorgsky_sunless-04_be-bored.truth.json [sun5]=mussorgsky_sunless-05_elegy.truth.json [sun6]=mussorgsky_sunless-06_on-the-river.truth.json)
mkdir -p out/score out/tables
for s in tch sun1 sun4 sun5 sun6; do python3 scorer/conv.py out/score/$s.read.json out/joined/$s.musicxml; done
cd /home/claude/wire-465/ilya
for s in tch sun1 sun4 sun5 sun6; do echo "== $s"; npx --yes tsx /home/claude/checks/scorer/score.ts /home/claude/wire-465/kit/kit/truth/${T[$s]} /home/claude/checks/out/score/$s.read.json full; done
cd /home/claude/checks
python3 baseline.py
python3 barcheck.py
python3 keycheck.py
python3 acccheck.py
python3 partbars.py
python3 dsharp.py
