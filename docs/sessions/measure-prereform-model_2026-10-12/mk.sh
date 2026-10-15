#!/bin/bash
cd ~/Downloads/_desk-prereform/tesstrain
export PATH=/opt/homebrew/opt/make/libexec/gnubin:$PATH TESSDATA_PREFIX=/opt/homebrew/share/tessdata
exec gmake "$@" MODEL_NAME=rus_prereform START_MODEL=Cyrillic TESSDATA=$HOME/Downloads/_desk-prereform/models TESSERACT_SCRIPTS=Cyrillic PY_CMD=$HOME/Downloads/_desk-prereform/venv/bin/python RATIO_TRAIN=0.99
