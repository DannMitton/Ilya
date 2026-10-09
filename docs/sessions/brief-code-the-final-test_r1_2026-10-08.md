# Brief for Code: the final test, the ten sealed songs through the drop box (r1, 2026-10-08)

Written by the desk (Opus) 2026-10-08 about 22:00. For Code on the Mac, after QUEUE rows 37 and 56 are shipped and deployed. QUEUE row 55. Measures only: no app code changes.

## Why

THE ONE THING (`docs/memory/STATE.md`): the reader reads at least 95 of every 100 printed notes, pitch and length as printed, on songs it has never seen, on the singer's path. The first unseen set now passes, but the reader was tuned while looking at three of its songs. This set of ten was chosen for the final test on 2026-10-08 (`docs/sessions/memo-heldout2-chosen_r1_2026-10-08.md`, `memo-heldout2-truth_r1_` and `_r2_`); Dann knows none of them (18:50, 19:52); nobody has run a reader on them.

## The run

1. Confirm the deployed site (`https://ilya-git-shane-dannmittons-projects.vercel.app`) serves the commit named in the prompt, as row 52 did.
2. The ten scans: `~/Downloads/_desk-2026-10-08/heldout2-scans/*.pdf`. Their truth: `~/Downloads/_desk-2026-10-08/heldout2-truth-r2/truth/*.truth.json`. **A script handles both; you do not open, view, or print any scan, truth, reading, or bar.** It copies the scans under neutral names (G to P) into a private folder, drops each into the score box exactly as row 52 did (fresh browser context, Chrome on WebGPU), takes the reading from the app's library, scores it with row 49's `conv.py` and `score.ts` (and row 37's metre field, if it shipped), and writes everything into a private folder that is never opened.
3. If the truth files do not load in the scorer (they use `short` bars, empty bars for postludes, and extra fields; see the truth memos), make the scorer accept them without reading their notes, and say what you changed.

## What it prints, unedited, and nothing else

One line per song, G to P, in row 52's format (path; right of printed; missing; extra; pitch misreads; length misreads; bars read of printed; metre right of bars, if available; score; PASS or BELOW), then the total.

**Then stop.** Do not diagnose a BELOW song: opening one is Dann's decision, because it cannot be undone.

## Report

`docs/sessions/report-code-the-final-test_r1_2026-10-08.md`: the commit checked, the adapter, the lines verbatim, any refusal, any scorer change, and **Could not establish** (including that the truth files are unproofed drafts with 11 UNSURE readings). NOT ESTABLISHED beats a complete invented answer. No git command that writes. Set QUEUE row 55, say so in one line, and stop.
