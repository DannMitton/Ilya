# Family 10: Playwright, two runs, one build

Build: clone A, `b2869772`, `TZ=UTC`. Command: `bash harness/run-playwright.sh <clone A> <out> <label>`, which runs `playwright test --reporter=list,json --trace off`. No update flags. Both projects (`chromium`, `phone`), 380 tests per run.

| | run 1 | run 2 |
|---|---:|---:|
| passed | 371 | 370 |
| failed | 7 | 7 |
| timedOut | 1 | 2 |
| skipped | 1 | 1 |

Start and end (UTC): run 1 05:04:49Z to 06:13Z; run 2 06:13:36Z to 07:25:10Z. Wall time 1.1 h and 1.2 h.

## Failed in both runs (8, stable)

- [chromium] heic-offline.test.ts > a singer offline who never opened a HEIC can open one (run 1: failed, run 2: failed)
- [chromium] insights-page.test.ts > the passaggio names clear the bracket whatever the secondo is, and the bracket lies inside the rows, in both languages (run 1: timedOut, run 2: timedOut)
- [chromium] repertoire-recedes.test.ts > REPERTOIRE opens on arrival at two songs, folds on each of its three events (run 1: failed, run 2: failed)
- [chromium] the Loupe header > a drag on the desk moves the card, holds while open, and resets on close (run 1: failed, run 2: failed)
- [phone] ../e2e-phone/phrase-ends.test.ts > Tchaikovsky onto an empty song: 172 seats, and «так» reads [ˈtɑk] in Text (run 1: failed, run 2: failed)
- [phone] ../e2e-phone/relining.test.ts > bb. a poem typed key by key lays Lyrics out after the pause, and Text is not rebuilt before it (run 1: failed, run 2: failed)
- [phone] ../e2e-phone/relining.test.ts > y. a poem pasted into Poem lays Lyrics out in its lines and moves no seat (run 1: failed, run 2: failed)
- [phone] Input, two views (N.135 stage 3) > a poem typed into Poem moves no seat of «Within Four Walls» (run 1: failed, run 2: failed)

## Unstable (result differs between runs)

- [chromium] the time signature card > 4/8 to 3/4 to the end, keeping the barlines: every bar adds up, Undo restores, Redo applies again (run 1: passed, run 2: timedOut)

The failures are recorded as measured. This lane changes no source and does not diagnose them. Cause of each is NOT ESTABLISHED; the run 1 error text is in `pw-run1.log`.
