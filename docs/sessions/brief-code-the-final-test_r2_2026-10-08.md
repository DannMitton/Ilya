# Brief for Code: the final test, the ten sealed songs through the drop box (r2, 2026-10-08)

Written by the desk (Fable) 2026-10-08 about 22:10. **Replaces r1** (`brief-code-the-final-test_r1_2026-10-08.md`, written about 22:00 and never sent). For Code on the Mac, after QUEUE rows 56 and 57 are shipped and deployed (amended 22:21: row 37 built no app change, and row 57 takes up its Part B). QUEUE row 55. **Measures only: no app code changes and no scorer changes.**

## Why

THE ONE THING (`docs/memory/STATE.md`): the reader reads at least 95 of every 100 printed notes, pitch and length as printed, on songs it has never seen, on the singer's path. The first unseen set passes, but the reader was tuned while three of its songs were open. This set of ten was chosen for the final test on 2026-10-08 (`docs/sessions/memo-heldout2-chosen_r1_2026-10-08.md`, `memo-heldout2-truth_r1_` and `_r2_`). Dann knows none of them (18:50, 19:52). No reader has been run on them. The set gets one run, so everything that can be checked without it is checked first.

## What changed from r1

1. **r1's step 3 is struck: the scorer is not touched during this run.** The desk checked on 2026-10-08 at about 22:06, with no reader involved: each of the ten truth files, scored against its own `conv.py` round trip (`truth/selfcheck/*.conv-roundtrip.json`), reads 100, on the scorer of rows 49 and 52 (`docs/sessions/measure-checks_r1_2026-10-05/scripts/scorer/scan-scorer.ts`) and on the tree's `tools/e16-harness/src/scan-scorer.ts` as it stood at 21:54 with row 37's metre field in it. The `short` bars, the empty bars, and the extra fields cause no fault. A copy of one round trip with one pitch, one length, and one note changed scored 113 of 116.
2. **The lines come from one script the desk wrote and tested:** `docs/sessions/measure-final-test_r1_2026-10-08/final-line.ts`. It replaces `score.ts` for this run. It loads the truth exactly as `score.ts` does, calls `scoreScan` from `tools/e16-harness/src/scan-scorer.ts`, and prints one line of counts. Its header says what each field is.
3. **A rehearsal on two opened songs comes before the ten.**
4. **Each line carries two scores.** The truth-maker marked 9 notes UNSURE before any reader ran (in four songs). One score counts them. One sets them aside, from the right notes and from the printed notes alike. The verdict is the second (a DESK DEFAULT): in at least four of the nine, the truth file records something other than the literal print, so a faithful reading would be marked as a misread.
5. **Each line says the octave shift the scorer used** (it forgives one whole-song octave when it compares pitch), **and the metre as printed, by figure**: these ten truth files carry the printed figures, so 6/8 against 3/4, and 2/2 against 4/4, count as different. Row 37's own metre field compares lengths, because the build songs' truth files carry no figures.

## What the desk tested in `final-line.ts`, and what it did not

Run through the bridge on the Mac's files (a Linux shell, node 22.23, tsx):

- Ten of ten truth files against their own round trips: every count full, every score 100.0, octave shift 0, every judged bar's metre as printed.
- The three UNSURE notes of one song read a semitone away: 113 of 116, 97.4; with them set aside, 100.0.
- One pitch, one length, and one missing note: 113 of 116.
- One bar restated as 4/4 where 12/8 is printed, and one bar with no figure: metre 32 of 34.
- One extra note: extra 1, 99.1.
- The whole song an octave up: octave shift 12, every note right.
- A refusal, and the total line.

**NOT ESTABLISHED: that the script prints the same lines under node on the Mac.** The rehearsal settles it.

## The run

1. Confirm that the deployed site (`https://ilya-git-shane-dannmittons-projects.vercel.app`) serves the commit named in the prompt, as row 52 did.
2. **Rehearsal.** Take Grechaninov op. 20 no. 4 and Varlamov «Скажи, зачем?» through the whole script exactly as the ten will go: a fresh browser context, Chrome on WebGPU, the intake's file input, the reading from the app's library, `conv.py`, then `final-line.ts song`. Their counts (right, missing, extra, pitch misreads, length misreads, bars read) must equal the counts of the last "after" lines measured for those two songs before the ship (row 57's, or row 56's if row 57 is not built). If one differs, stop and report; do not go on. **After the rehearsal the script does not change.** If it must, rehearse again.
3. **The ten.** The scans: `~/Downloads/_desk-2026-10-08/heldout2-scans/*.pdf`. Their truth: `~/Downloads/_desk-2026-10-08/heldout2-truth-r2/truth/*.truth.json`. **The script handles both; you do not open, view, list, or print any scan, truth, reading, or bar.** It copies the scans under the names G to P, in the order the glob returns them, into a private folder; drops each one as in the rehearsal; and for each runs

   `tsx docs/sessions/measure-final-test_r1_2026-10-08/final-line.ts song <letter> <webgpu or wasm> <truth.json> <read.json> <private folder>/keep`

   The `keep` folder receives each song's counts and the scorer's whole output. It is never opened.
4. **A refusal.** If the drop box refuses a song (the poem route, an error, or no score after ten minutes), that song scores 0: run `final-line.ts refused <letter> <truth.json> <private folder>/keep <the reason in a few words>`. One second drop is allowed only when the page or a model file failed to load before the reader started; the reason then says "second drop after a load fault". Do not work around a refusal.
5. Then `final-line.ts total <private folder>/keep`.

## What it prints, unedited, and nothing else

The two rehearsal lines. Then one line for each song, G to P, and the total line, as `final-line.ts` prints them.

**Then stop.** Do not diagnose a BELOW song, and do not open the `keep` folder: opening a song is Dann's decision, because it cannot be undone.

## Report

`docs/sessions/report-code-the-final-test_r1_2026-10-08.md`: the commit checked and how, the adapter, the rehearsal lines beside the last "after" lines for the same two songs, the ten lines and the total verbatim, any refusal, and **Could not establish** (including that the truth files are unproofed drafts). NOT ESTABLISHED beats a complete invented answer. No git command that writes. Set QUEUE row 55, say so in one line, and stop.
