THE CHECKS MEASURED: homr model 465 readings of the five build songs, 2026-10-05, by the Opus helper.
Nothing here changes Ilya. Every script reads the kit (/home/claude/wire-465/kit/kit/) and the Ilya clone
(/home/claude/wire-465/ilya, commit 94e5246, working tree dirty with the step-1 changes) and writes only under
/home/claude/checks/out/.

INPUTS
  in/<page>.musicxml   copies of the kit's readings: port-465-out/ for tch-2, tch-3, sun-01..sun-17 (the port's);
                       reference-desktop-main/ for tch-1 (the kit has no port output for it; the port's Node run of
                       tch-1, proof/node-run/tch-1.musicxml, is canonically EQUAL to it by the kit's cmp.py).
  truth: /home/claude/wire-465/kit/kit/truth/*.json (one key per song in keySignature.fifths).
  Songs: tch = tch-1..3; sun1 = sun-01..02; sun4 = sun-03..04; sun5 = sun-05..11; sun6 = sun-12..17.

COMMANDS (in order; run_all.sh runs them all and reproduced every output byte for byte)
  cd /home/claude/wire-465/ilya && npx --yes tsx /home/claude/checks/join.mts
      joins each song's pages with Ilya's joinPages, unchanged -> out/joined/<song>.musicxml
  cd /home/claude/checks && python3 scorer/conv.py out/score/<song>.read.json out/joined/<song>.musicxml
      the kit's converter, unchanged -> the reading's events
  cd /home/claude/wire-465/ilya && npx --yes tsx /home/claude/checks/scorer/score.ts <truth.json> /home/claude/checks/out/score/<song>.read.json full
      the kit's scorer, unchanged -> out/score/<song>.score.json
  cd /home/claude/checks && python3 baseline.py    4a: tables/4a-baseline.csv, 4a-differences.csv, 4a-barmap.json
  cd /home/claude/checks && python3 barcheck.py    4b: tables/4b-summary.csv, 4b-bars-<song>.csv, 4b-falseflags.csv
  cd /home/claude/checks && python3 keycheck.py    4c: tables/4c-keys.csv, 4c-rules.csv, 4c-metres.csv, 4c-notes-under-misread-key.csv
  cd /home/claude/checks && python3 acccheck.py    4d: tables/4d-pitch-differences.csv, 4d-flags.csv, 4d-summary.csv
  cd /home/claude/checks && python3 partbars.py    4e check 1: tables/4e-partbars.csv
  cd /home/claude/checks && python3 dsharp.py      4e check 2: tables/4e-dsharp-summary.csv, 4e-dsharp-flags.csv (needs OpenCV)
  lib.py holds the shared reading code; it asserts that its events equal conv.py's, one for one.

FILES HERE
  scripts/   join.mts lib.py baseline.py barcheck.py keycheck.py acccheck.py partbars.py dsharp.py run_all.sh
             scorer/ (conv.py, score.ts, scan-scorer.ts: unchanged copies of the kit's)
  joined/    the joined voice part of each song, as Ilya's joinPages wrote it
  score/     <song>.read.json (conv.py) and <song>.score.json (the scorer, full)
  tables/    every table, CSV or JSON
  evidence/  crops of the kit's page scans, used to say what the page prints:
             sun-05-small.png (the footnote with the autograph's opening), sun-04-b21-23.png (2/4 then C),
             keys-montage.png (four key signatures), pitchdiffs.png (the 15 pitch differences, numbered in the
             order of 4d-pitch-differences.csv), zoom-naturals.png, zoom-1-10-14.png, zoom2.png, sun11-b65.png
             (the ossia note), dbg3.png (three double sharps after line removal)
  carry-over-table.md   the table of section 5

WORKING DIRECTORY ON THE HELPER'S MACHINE: /home/claude/checks/ (the scripts' paths are absolute to it).
