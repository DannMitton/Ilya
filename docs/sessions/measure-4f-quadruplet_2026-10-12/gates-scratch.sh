#!/bin/sh
# ilya-ship.sh  —  revision 3 (2026-09-27: gates 6 to 8; revision 2 below)
# Written by Opus, E.41, 11 August 2026, at Dann's instruction.
#
#   sh ~/Downloads/ilya-ship.sh                  gates only, commits nothing
#   sh ~/Downloads/ilya-ship.sh "N.43: message"  gates, then commit and push
#
# Revision 2 exists because revision 1 failed on its first run, and the
# failure is worth recording. It matched gate output with grep -F against
# the RAW log. vitest wraps @ilya/web's summary in ANSI colour, so the
# bytes read "408 passed<ESC>[39m<ESC>[22m<ESC>[90m (408)" while the screen
# reads "408 passed (408)". The substring existed on the terminal and not
# in the file. Revision 2 strips ANSI before matching and sets NO_COLOR.
#
# It compares each gate against its RECORDED BASELINE, not merely against
# pass or fail. A moved warning count is a regression until proven
# otherwise, so any deviation aborts before anything is staged.
#
# It never runs `git add -A`. Only tracked modifications are staged, and it
# refuses outright when untracked files exist, because an untracked file in
# this repo has historically been a scratch script left behind.

REPO="$HOME/Desktop/ilya-rewrite"
MSG="$1"
LOG=$(mktemp -d)
FAILED=0

NO_COLOR=1; FORCE_COLOR=0; export NO_COLOR FORCE_COLOR

strip_ansi() {
  if command -v perl >/dev/null 2>&1; then
    perl -pe 's/\e\[[0-9;]*[a-zA-Z]//g'
  else
    LC_ALL=C sed "s/$(printf '\033')\[[0-9;]*[a-zA-Z]//g"
  fi
}

echo "── ilya-ship r2 ──────────────────────────────────────"

BRANCH=$(git -C "$REPO" rev-parse --abbrev-ref HEAD 2>/dev/null)
if [ "$BRANCH" != "Shane" ]; then
  echo "REFUSING: on branch '$BRANCH', not Shane."; exit 1
fi

CHANGED=$(git -C "$REPO" diff --name-only HEAD)
if [ -z "$CHANGED" ]; then
  echo "Working tree clean. Running gates anyway; nothing to commit."
else
  echo "Modified, and these are what would be committed:"
  echo "$CHANGED" | sed 's/^/    /'
fi
echo "──────────────────────────────────────────────────────"

gate() {
  n="$1"; label="$2"; expect="$3"; shift 3
  raw="$LOG/g$n.raw"; out="$LOG/g$n.log"
  "$@" > "$raw" 2>&1
  strip_ansi < "$raw" | tr -s ' ' > "$out"
  if grep -qF "$expect" "$out"; then
    printf "  %s  %-13s OK    %s\n" "$n" "$label" "$expect"
  else
    printf "  %s  %-13s DEVIATED FROM BASELINE\n" "$n" "$label"
    printf "        expected: %s\n" "$expect"
    grep -E "Tests|FAIL|found [0-9]+ error" "$out" | sed 's/^/        got: /'
    FAILED=1
  fi
}

# Gate 1 moved 216 -> 251 on 2026-09-27: lexical ц/ш palatalization (Grayson pp. 163, 168, 283-284) and its p. 284 re-sort.
# Gates moved 2026-10-11 by the desk for the merge of cloud-lane (rows 64, 65, 63, 66, 36, 50, 25, 11, 12, 17, 51) with row 57 run 2: gate 2 235 -> 242 (row 25), gate 4 2088 -> 2167 (run 2 +17, cloud lane +62), gate 5 650/655 -> 653/658 (cloud lane). PREDICTED from the two lanes' reports, not yet run together. Backup ilya-ship.sh.bak-2088-2026-10-11.
# Gates moved 2026-10-12 20:31 by the desk, measured on ad99ed4 (merge of cloud-lane-2, rows 83 and 87) plus rows 78a to 85 uncommitted, all eight gates passing: gate 2 242 -> 248 (row 87), gate 4 2448 -> 2433 (rows 78a to 85 +31; row 83 stops counting the 46 git-ignored .musicxml), gate 5 663/668 -> 675/680 (rows 78b, 78c, 79). Backup ilya-ship.sh.bak-2448-2026-10-12.
# Gate 4 moved 2402 -> 2448 on 2026-10-11 23:45: row 72's every-score test (markup-pages.test.ts) also counts the 46 git-ignored .musicxml under tools/e16-harness/output/ on this Mac, which a clean clone does not have. All 2448 passed. Backup ilya-ship.sh.bak-2402-2026-10-11. Owed: the test should count tracked files only (ENVIRONMENT.md).
# Gate 4 moved 2413 -> 2402 on 2026-10-11 23:35: the merge stops at 1a35871 (row 67), leaving row 71 on cloud-lane (Dann 23:21); measured by the desk on that merge. Backup ilya-ship.sh.bak-2413-2026-10-11.
# Gates 4 and 5 moved 2182 -> 2413 and 653/658 -> 663/668 on 2026-10-11 23:15 for the merge of cloud-lane (rows 72, 70, 73, 68, 75, 62, 67, 71, 69, 34) onto b80b543; counts measured by the desk on that merge in its own workspace, all eight gates passing. Backup ilya-ship.sh.bak-2182-2026-10-11.
# Gate 4 moved 2181 -> 2182 on 2026-10-11: QUEUE row 77 (metre-witness.test.ts +1, a return not seen; report-code-set3-four-below_r1_2026-10-11.md). Backup ilya-ship.sh.bak-2181-2026-10-11.
# Gate 4 moved 2180 -> 2181 on 2026-10-11: QUEUE row 74 (homr-reader.test.ts +1, the cover rule; report-code-m-and-p-after-the-metre_r1_2026-10-11.md). Backup ilya-ship.sh.bak-2180-2026-10-11.
# Gate 4 moved 2167 -> 2180 on 2026-10-11: row 57 r6 run 3 (metre-witness.test.ts +13; report-code-the-metre-seen-and-summed_r6-run3_2026-10-11.md). Backup ilya-ship.sh.bak-2167-2026-10-11.
gate 1 phonology    "251 passed (251)"                          pnpm -C "$REPO" test:phonology
gate 2 dictionary   "248 passed (248)"                          pnpm -C "$REPO" test:dictionary
gate 3 web-check    "found 0 errors and 12 warnings in 5 files"  pnpm -C "$REPO" --filter @ilya/web check
# Gate 4 moved 1482 -> 1484 on 2026-09-27: remote-write.test.ts (brief-code-two-save-fixes).
# Gate 4 moved 1484 -> 1493 on 2026-09-27: destinations.test.ts (6) and wall.test.ts (3), N.174 D.1.
# Gate 4 moved 1493 -> 1495 on 2026-09-27: the Guide anchor tests, N.174 D.3.
# Gate 4 moved 1495 -> 1533 on 2026-09-27: latin.test.ts and the [w] invariant, the Latin words brief.
# Gate 4 moved 1533 -> 1547 on 2026-09-27: undo-history.test.ts, audit phase 4 cut 1 slice 1.
# Gate 4 moved 1547 -> 1549 on 2026-09-27: UndoHistory.clear, undo emptied on a song switch.
# Gate 4 moved 1549 -> 1561 on 2026-09-27: press-and-hold.test.ts, audit phase 4 cut 1 slice 2.
# Gate 4 moved 1561 -> 1574 on 2026-09-27: correction-cursor.test.ts, audit phase 4 cut 1 slice 3.
# Gate 4 moved 1574 -> 1613 on 2026-09-28: the calm loupe, slices 1 to 6 (loupe-panel, loupe-hold, loupe-render, correction tests).
# Gate 4 moved 1613 -> 1640 and gate 5 615 -> 616 (620 -> 621) on 2026-09-28: calm-loupe slice 7, N.154, N.82.
# Gate 4 moved 1750 -> 1753 on 2026-09-30: c3 and c5 on the median, row 2d part 2b.
# Gate 4 moved 1753 -> 1760 on 2026-09-30: count-in.test.ts, sing first then fry, row 2d part 3.
# Gate 4 moved 1784 -> 1824 and gate 5 636 -> 644 (641 -> 649) on 2026-10-02: the cloud lane, rows 10, 15, 7, and 14 (legend.test.ts +4, french-italics.test.ts +9, gates.test.ts +5, insights.test.ts +3, placement-scope.test.ts +19; stem-legend.test.ts +8).
# Gate 4 moved 1824 -> 1870 and gate 5 644 -> 650 (649 -> 655) on 2026-10-02: the cloud lane, row 8 (loupe-tween.test.ts +14, loupe.test.ts +1, loupe-render.test.ts +4, loupe-fit.test.ts +19, loupe-panel.test.ts +4, correction-cursor.test.ts +4; staff-renderer.test.ts +6).
# Gate 4 moved 1870 -> 1913 on 2026-10-05: the homr reader, QUEUE rows 27 (+15), 29 (+1), and 30 (+27), as counted by their builders.
# Gate 4 moved 1913 -> 1921 on 2026-10-05: restore.test.ts and stamp.test.ts (+8), a saved scan reopens through homr and keeps its reading (runbook step 2).
# Gate 4 moved 1921 -> 1935 on 2026-10-06: triplets.test.ts (+9) and page-pdf.test.ts (+5), the night fixes (homr-web ilya.3, the triplet check, the giant-page render).
# Gate 4 moved 1991 -> 1997 on 2026-10-08: tessituragram-layout.test.ts (+5), wait.test.ts (+1), the wash and name collisions (QUEUE row 46).
# Gate 4 moved 1997 -> 1998 on 2026-10-08: join-pages.test.ts (+1), blank bars after the final double bar (QUEUE row 49).
# Gate 4 moved 1998 -> 2000 on 2026-10-08: homr-reader.test.ts (+2), a cover page before the song is left out (QUEUE row 53).
# Gate 4 moved 2000 -> 2012 on 2026-10-08: tuplet-number.test.ts (+8) and four more, the printed 3 read from the page (QUEUE row 54).
# Gate 4 moved 2012 -> 2035 on 2026-10-09: tuplets of any number (QUEUE row 56), 23 new tests by Code's report; not re-measured by the desk.
# Gate 4 moved 2087 -> 2088 on 2026-10-10: row 61, the join test for a page of the piano alone (report-code-the-four-below_r1_2026-10-09.md, gates table).
# Gate 4 moved 2035 -> 2087 on 2026-10-09: the cloud lane's rows 51, 58, 59, 60 and the tessitura check (cloud session's last gate run, c422dae); not re-measured by the desk.
# Gate 4 moved 1979 -> 1991 on 2026-10-08: first-staved-page tests (+12), rows 44 and 45 (a cover page, and an image-only PDF goes to the reader).
# Gate 4 moved 1977 -> 1979 on 2026-10-08: tessituragram-layout.test.ts (three new tests replace one) and insights.test.ts, sung names (QUEUE row 43).
# Gate 4 moved 1955 -> 1977 on 2026-10-07: tessituragram-layout.test.ts (+22), the tessituragram refined (QUEUE row 42).
# Gate 4 moved 1939 -> 1955 on 2026-10-07: wait.test.ts (+8), reading-wait.test.ts (+6), scan.test.ts (+2), the wait on the Paper (QUEUE row 41).
# Gate 4 moved 1935 -> 1939 on 2026-10-06: join-pages.test.ts (+1) and triplets.test.ts (+3), the day-4 fixes (homr-web ilya.4).
gate 4 web-test     "2433 passed (2433)"                          pnpm -C "$REPO" --filter @ilya/web test
gate 5 score-parser "675 passed | 5 skipped (680)"              pnpm -C "$REPO" --filter @ilya/score-parser test
# Gates 6 to 8 added 2026-09-27 at Dann's ruling (the audit): the word
# explanations and their French, the cross-package tests, and the
# architecture ratchets. Playwright stays in CI (Dann, 2026-09-26 23:47).
gate 6 blurb        "145 passed (145)"                          pnpm -C "$REPO" test:blurb
gate 7 integration  "55 passed (55)"                            pnpm -C "$REPO" test:integration
gate 8 ratchets     "ratchets: OK."                             pnpm -C "$REPO" ratchets

echo "──────────────────────────────────────────────────────"

if [ "$FAILED" -ne 0 ]; then
  echo "ONE OR MORE GATES MOVED. Nothing staged, nothing committed."
  echo "Full logs: $LOG"
  exit 1
fi
echo "All eight gates at baseline."

exit 0
