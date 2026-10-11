# Brief for Code on the Mac: M and P after the metre, and M's covers, r2

Written by the desk (Opus) 2026-10-11 16:55; r2 at 17:05 takes all seven findings of an independent Opus review (three blocking: no `labels.txt` exists; step 3 compared against readings taken without the rule; no way to score the 17 build songs). For Code on Dann's Mac. Model: Sonnet (DESK DEFAULT; the method exists, and step 3 restores code already written once). QUEUE row 74.

## What the singer sees

A singer drops a printed song in and gets the melody back. Two of the ten songs in the last full test still came back below 95 of 100 notes: Lyadov's «Колыбельная» op. 22 no. 1 (M, 88.7: two decorative cover pages read as music) and Zhitomirsky's «Бѣлая луна» op. 6 no. 2 (P, 77.6: no time signature read on page 2, so 26 note lengths came out wrong). Row 57, shipped today in `4f7421e`, now reads printed time signatures. This brief finds out what that did for P, and puts back the cover fix for M.

## Before you start

- Tree at `4f7421e` on `Shane`. The desk's uncommitted files in `docs/` are not yours; do not touch them.
- Read whole: `docs/sessions/report-code-the-four-below_r1_2026-10-09.md` (row 61). Its method is the method here: the dev server on 5173, the drop box through Playwright and Chrome on WebGPU, a fresh browser context per song, `conv.py`, then `docs/sessions/measure-final-test_r1_2026-10-08/final-line.ts`.
- K, L, M, and P are open songs (Dann opened them 2026-10-09). G, H, I, J, N, and O are SPENT: Dann agreed 2026-10-11 04:17 to spend them once, and row 57 run 4 did. You may run them and print their `final-line.ts` lines. **Do not open, view, or render any of their pages, and do not change code because of what their lines show.**
- Scans: `~/Downloads/_desk-2026-10-08/heldout2-scans/`. Truth: `~/Downloads/_desk-2026-10-08/heldout2-truth-r2/truth/`, with the corrected copies for K, L, and P beside the originals. No `labels.txt` survives. Pair each scan with the truth file of the same stem. Letters are glob order: G arensky, H artsybushev, I blumenfeld, J catoire, K ippolitov-ivanov, L khvoshchinsky, M lyadov, N lyapunov, O sokolov, P zhitomirsky.
- `conv.py`: use `docs/sessions/measure-checks_r1_2026-10-05/scripts/scorer/conv.py`, the copy row 55 used (two other copies are identical).

## The work

1. **Measure now.** K, L, M, and P through the drop box at `4f7421e`, scored against both truths. One `final-line.ts` line per song and truth.
2. **The six spent songs, lines only.** G, H, I, J, N, and O through the same path. Lines only.
3. **Restore M's cover rule**, as row 61 wrote it and took it out (it was never committed; `withoutCovers` today counts staves, `apps/web/src/lib/omr/homr-reader.ts:118-121`, filled at `:298`). The rule: a cover is a page with fewer than two staves at least half the page wide, where width is the staff box's width over the width of the page image homr read; it applies only to pages before the first page with two or more such staves. If homr's result gives no staff boxes the app can use, stop step 3 and report that. Add one test for M's case.
   - **With the rule on, read all ten again.** Keep the rule only if M rises and, on every other song, the score with UNSURE set aside is no lower than its step 1 or 2 line, against both truths where two exist.
   - **The 17 build songs and A, B, C, E, and F:** drop each at `4f7421e` and again with the rule on, and compare the two readings with `cmp`. Print only "same" or "changed". Any "changed" song takes the rule out.
   - If it is taken out, say which song moved and by how much.
4. **P only if it is still below 95 after step 1:** report what row 57's metre witness stated on P's page 2 and why, using the logs run 3 used (`docs/sessions/report-code-the-metre-seen-and-summed_r6-run3_2026-10-11.md`). Do not build a fix for P in this run.
5. If step 3 keeps a change: all eight gates, run from a copy of `~/Downloads/ilya-ship.sh` that cannot stage (the script stages tracked changes). Baselines are as in that file (gate 4 2180); gate 4 rises by the one new test.

## Done when

- The report holds every `final-line.ts` line from steps 1 to 3, unedited, before and after.
- Step 3 is kept or taken out, with the reason in one sentence.
- No page of G, H, I, J, N, or O was opened.

## Then stop

Do not commit, stage, or push. Dann ships.

## Report

`docs/sessions/report-code-m-and-p-after-the-metre_r1_2026-10-11.md`. Lead with one line per song: before (step 1's line at `4f7421e`, with row 61's line beside it), after. Then step 3's decision, the gates, and a section "Could not establish". NOT ESTABLISHED beats a complete invented answer. Do not edit `docs/memory/`.
