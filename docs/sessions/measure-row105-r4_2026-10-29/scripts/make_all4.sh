#!/bin/bash
# Row 105 r4: render kinds 1 and 2 and the held-out rows, frame them. Copy of r3's make_all.sh with these edits: W is r4's work folder; DAMAGE names the kind 2 damage json (round 0 of the calibration stood);
# kind 3 is NOT redone: row 82's lines framed by r3 (~/Downloads/_desk-row105/framed/kind3, same inputs, same drops, same clean.py steps) are reused with their .lstmf (an .lstmf holds the image and the text, not the character set).
W=~/Downloads/_desk-row105/r4/work; PY=~/Downloads/_desk-row105/venv/bin/python; B=$(cd "$(dirname "$0")" && pwd); T=$W/stage-times.txt; : > $T
export CLEAN_ROOT=$W DAMAGE=$W/damage-final.json
STEPS=deskew,close:3,height:32,padpaper:16:16
st() { echo "$(date +%H:%M:%S) $*" | tee -a $T; }
rm -rf $W/raw $W/framed; mkdir -p $W/raw $W/framed
st render-start
for k in kind1 kind2; do for i in 0 1 2 3 4 5; do $PY $B/render105.py $k $W/raw/$k 23591 $i 6; done; st "render $k done"; done
$PY $B/render105.py held1 $W/raw/held1 500 0 1; $PY $B/render105.py held2 $W/raw/held2 500 0 1; st "render held done"
for g in kind1 kind2; do
  for i in a b c d e f; do ( CLEAN_CROPS=$W/raw/$g CLEAN_ANG=$W/ang-$g$i.json $PY $B/clean105.py $W/framed/$g $STEPS $g$i > $W/framed-$g$i.log 2>&1 ) & done; wait; st "frame $g done"
  cp $W/raw/$g/*.gt.txt $W/framed/$g/
done
for g in held1 held2; do CLEAN_CROPS=$W/raw/$g CLEAN_ANG=$W/ang-$g.json $PY $B/clean105.py $W/framed/$g $STEPS ${g}a > $W/framed-$g.log 2>&1; cp $W/raw/$g/*.gt.txt $W/framed/$g/; done; st "frame held done"
