#!/bin/bash
# Row 105: render, frame, and make lstmf for kinds 1, 2, 3 and the held-out rows. Logs stage times to ~/Downloads/_desk-row105/stage-times.txt
W=~/Downloads/_desk-row105; PY=$W/venv/bin/python; B=$(cd "$(dirname "$0")" && pwd); T=$W/stage-times.txt; : > $T
export CLEAN_ROOT=$W
STEPS=deskew,close:3,height:32,padpaper:16:16
st() { echo "$(date +%H:%M:%S) $*" | tee -a $T; }
rm -rf $W/raw $W/framed; mkdir -p $W/raw $W/framed
st render-start
for k in kind1 kind2; do for i in 0 1 2 3 4 5; do $PY $B/render105.py $k $W/raw/$k 23591 $i 6; done; st "render $k done"; done
$PY $B/render105.py held1 $W/raw/held1 500 0 1; $PY $B/render105.py held2 $W/raw/held2 500 0 1; st "render held done"
# kind 3: row 82's rendered lines, minus the dropped ids, as links (framed below)
$PY - <<PYE
import os, json
GT=os.path.expanduser('~/Downloads/_desk-prereform/tesstrain/data/rus_prereform-ground-truth'); W=os.path.expanduser('~/Downloads/_desk-row105')
drop=set(json.load(open(W+'/text/kind3-dropped-ids.json'))); ids=sorted(f[:-4] for f in os.listdir(GT) if f.endswith('.png') and f[:-4] not in drop)
os.makedirs(W+'/raw/kind3',exist_ok=True)
for n,i in enumerate(ids):
    p='kind3'+chr(97+n%6); os.symlink(f'{GT}/{i}.png', f'{W}/raw/kind3/{p}-{i}.png'); open(f'{W}/raw/kind3/{p}-{i}.gt.txt','w',encoding='utf8').write(open(f'{GT}/{i}.gt.txt',encoding='utf8').read())
print(len(ids))
PYE
st "kind3 linked"
for g in kind1 kind2 kind3; do
  for i in a b c d e f; do ( CLEAN_CROPS=$W/raw/$g CLEAN_ANG=$W/ang-$g$i.json $PY $B/clean105.py $W/framed/$g $STEPS $g$i > $W/framed-$g$i.log 2>&1 ) & done; wait; st "frame $g done"
  cp $W/raw/$g/*.gt.txt $W/framed/$g/
done
for g in held1 held2; do CLEAN_CROPS=$W/raw/$g CLEAN_ANG=$W/ang-$g.json $PY $B/clean105.py $W/framed/$g $STEPS ${g}a > $W/framed-$g.log 2>&1; cp $W/raw/$g/*.gt.txt $W/framed/$g/; done; st "frame held done"
