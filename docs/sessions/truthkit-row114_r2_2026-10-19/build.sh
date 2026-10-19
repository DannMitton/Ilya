#!/bin/sh
# usage: sh build.sh <stem>   (PAGES: the drafts' folder, default truthkit/pages; CROPS: the print crops, default cp-pages)
# Changes of 2026-10-19: the number of systems is read from the draft; the folders are settable; the print crops are
# used as stored (see proof.py); render.js post-processes the SVG (see its header).
set -e
KIT="$(cd "$(dirname "$0")" && pwd)"
PAGES="${PAGES:-truthkit/pages}"; CROPS="${CROPS:-cp-pages}"
python3 -I "$KIT/truth.py" "$PAGES/$1.txt"
n=$(grep -c '^// system' "$PAGES/$1.txt" || true); [ "$n" -gt 0 ] || n=1
i=1; while [ $i -le $n ]; do
  node "$KIT/render.js" "$PAGES/$1-s$i.musicxml" "$PAGES/$1-s$i.svg" 2000 >/dev/null
  python3 -c "import cairosvg; cairosvg.svg2png(url='$PAGES/$1-s$i.svg', write_to='$PAGES/$1-s$i.png', output_width=2000)"
  i=$((i+1)); done
python3 -I "$KIT/proof.py" "$PAGES/$1.txt" "$PAGES" "$CROPS" "$PAGES/$1-proof.png"
