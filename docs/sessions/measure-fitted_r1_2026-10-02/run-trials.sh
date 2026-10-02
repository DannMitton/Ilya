#!/bin/bash
# usage: run-trials.sh <outdir> <songs...>   (build songs only: 1 4 5 6 7). Test-only songs are run by run-test-songs.sh, once.
cd /Users/dannmitton/Desktop/ilya-rewrite
D=docs/sessions/measure-fitted_r1_2026-10-02
R=/private/tmp/claude-502/-Users-dannmitton-Desktop-ilya-rewrite/3b197851-5df5-4720-a77a-3390e82524b5/scratchpad/rasters400
OUT=$1; shift
mkdir -p $D/$OUT
run() { n=$1; key=$2; pre=$3; shift 3; files=""; pg=""; for p in "$@"; do files="$files $R/$pre-p$p.png"; pg="$pg$p,"; done
  node $D/pyrun2.mjs $D/trial_run.py $D/$OUT/song$n.json "{\"key\":$key,\"pages\":[${pg%,}],\"tiles\":true}" $files 2>&1 | grep -E "rror|Traceback" ; echo "song $n done"; }
for s in "$@"; do
  case $s in
    1) run 1 2 sunless 1 2;;
    4) run 4 2 sunless 9 10;;
    5) run 5 0 sunless 11 12 13 14 15 16 17;;
    6) run 6 7 sunless 18 19 20 21 22 23;;
    7) run 7 2 tch 1 2 3;;
  esac
done
echo ALLDONE
