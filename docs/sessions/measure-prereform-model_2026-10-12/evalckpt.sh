#!/bin/bash
cd ~/Downloads/_desk-prereform
for n in 1000 2000 3000 4000 5000 6000 7000 8000 9000 10000; do
  f=models/$1/$1_$n.traineddata; [ -f $f ] || continue
  printf "%s " $n; TESSDATA_PREFIX=/opt/homebrew/share/tessdata lstmeval --verbosity=0 --model $f --eval_listfile heldout_images/list_abs.txt 2>&1 | grep BCER
done
