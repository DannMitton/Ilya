#!/bin/bash
# (a): rus 4.0.0_best_int, tesseract.js 7.0.0 from apps/web, Node's default core. (c): Cyrillic best, the scratch copy's SIMD LSTM core.
# RULE=R2 reads rows2/ and crops2/ and writes ocr2/ (R1, the default: rows/, crops/, ocr/).
H=$(cd "$(dirname "$0")" && pwd); N=$HOME/Downloads/_desk-n135
S=""; C=crops; [ "$RULE" = R2 ] && { S=2; C=crops2; }
for L in "$@"; do
  node $H/ocr-rows.mjs $L $H/rows$S/$L.jsonl $N/$C $N/models/a rus $H/ocr$S/$L-a.json
  TJS=$N/tjs/node_modules/tesseract.js TCORE=tesseract-core-simd-lstm node $H/ocr-rows.mjs $L $H/rows$S/$L.jsonl $N/$C $N/models/c Cyrillic $H/ocr$S/$L-c.json
done
