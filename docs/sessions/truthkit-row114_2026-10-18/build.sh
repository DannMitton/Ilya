#!/bin/sh
# usage: sh build.sh p02 4   (page stem, number of printed systems)
set -e
cd "$(dirname "$0")/.."
python3 -I truthkit/truth.py truthkit/pages/$1.txt
i=1; while [ $i -le $2 ]; do
  node truthkit/render.js truthkit/pages/$1-s$i.musicxml truthkit/pages/$1-s$i.svg 2000 >/dev/null
  python3 -c "import cairosvg; cairosvg.svg2png(url='truthkit/pages/$1-s$i.svg', write_to='truthkit/pages/$1-s$i.png', output_width=2000)"
  i=$((i+1)); done
python3 -I truthkit/proof.py $1 $2 truthkit/pages/$1-proof.png
