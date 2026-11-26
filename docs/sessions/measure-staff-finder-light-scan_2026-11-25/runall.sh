#!/bin/bash
# rasterize + homr every page of the sweep; output in ~/Downloads/_desk-staffin-2026-11-25/work/code-lane/
O=~/Downloads/_desk-staffin-2026-11-25/work/code-lane
D=~/Downloads
S=$D/_colleague-pages/run-2026-10-19/songs
N=$D/IMSLP952372-PMLP60466-Nightingale.pdf
M=$D/IMSLP113877-PMLP232488-Mussorgsky_-_Without_Sun.pdf
run() { [ -f "$O/$3.homr.json" ] || node raster.mjs "$1" "$2" "$O/$3" --homr 2>&1 | grep -v vite; }
run $S/song1.pdf 1 song1-p1
run $M 5 withoutsun-p5
run $S/song2.pdf 1 song2-p1
run $S/song3.pdf 1 song3-p1
run $S/song4.pdf 1 song4-p1
run $M 4 withoutsun-p4
run $M 6 withoutsun-p6
for p in 2 3 5 6; do run $N $p nightingale-p$p; done
echo ALLDONE
