#!/bin/bash
D=$1; export TESSDATA_PREFIX=/opt/homebrew/share/tessdata PYTHONIOENCODING=utf-8
find $D -name '*.png' -print0 | xargs -0 -P 9 -I{} sh -c 'b=${1%.png}; [ -s $b.lstmf ] || { ~/Downloads/_desk-prereform/venv/bin/python ~/Downloads/_desk-prereform/tesstrain/generate_line_box.py -i $b.png -t $b.gt.txt > $b.box && tesseract $b.png $b --psm 13 lstm.train >/dev/null 2>&1; }' _ {}
find $D -name '*.lstmf' | sort > $D/list.txt; wc -l $D/list.txt
