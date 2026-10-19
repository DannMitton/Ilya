#!/bin/sh
cd "$(dirname "$0")/.."
for s in $(ls cp-pages/src | sed 's/.png$//'); do
  [ -f cp-out/$s/staves.txt ] && continue
  python3 -I truthkit/prep.py $s >> cp-out/prep-all.log 2>&1 || echo "FAILED $s" >> cp-out/prep-all.log
done
echo DONE >> cp-out/prep-all.log
