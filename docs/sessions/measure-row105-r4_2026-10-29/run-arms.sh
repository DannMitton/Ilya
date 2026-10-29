#!/bin/bash
cd /Users/dannmitton/Desktop/ilya-rewrite/docs/sessions/measure-row105-r4_2026-10-29/scripts
/Users/dannmitton/Downloads/_desk-row105/venv/bin/python train4.py rus_prereform_r4 /Users/dannmitton/Downloads/_desk-row105/r4/work/lists/list.train /Users/dannmitton/Downloads/_desk-row105/r4/work/lists/list.eval 40000 2.290 > /Users/dannmitton/Downloads/_desk-row105/r4/train-r4.out 2>&1
/Users/dannmitton/Downloads/_desk-row105/venv/bin/python train4.py rus_prereform_r4a1 /Users/dannmitton/Downloads/_desk-row105/r4/work/lists/list.train.a1 /Users/dannmitton/Downloads/_desk-row105/lists/list.eval 40000 2.290 > /Users/dannmitton/Downloads/_desk-row105/r4/train-r4a1.out 2>&1
/Users/dannmitton/Downloads/_desk-row105/venv/bin/python train4.py rus_prereform_r4a0 data/rus_prereform_r2/list.train data/rus_prereform_r2/list.eval 34000 2.290 > /Users/dannmitton/Downloads/_desk-row105/r4/train-r4a0.out 2>&1
echo ARMSDONE > /Users/dannmitton/Downloads/_desk-row105/r4/arms-done.txt
