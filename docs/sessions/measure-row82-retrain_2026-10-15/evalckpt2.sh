#!/bin/bash
# evalckpt.sh (row 82's), with the checkpoint list changed to 11,000 through 30,000 in model folder rus_prereform_r2
cd ~/Downloads/_desk-prereform
for n in 11000 12000 13000 14000 15000 16000 17000 18000 19000 20000 21000 22000 23000 24000 25000 26000 27000 28000 29000 30000; do
  f=models/$1/$1_$n.traineddata; [ -f $f ] || continue
  printf "%s " $n; TESSDATA_PREFIX=/opt/homebrew/share/tessdata lstmeval --verbosity=0 --model $f --eval_listfile heldout_images/list_abs.txt 2>&1 | grep BCER
done
