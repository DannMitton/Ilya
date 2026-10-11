# Brief for Code on the Mac: M and P after the metre, and M's covers, r1

Written by the desk (Opus) 2026-10-11 16:55. For Code on Dann's Mac. Model: Sonnet (DESK DEFAULT; the method exists, and step 3 restores code already written once). QUEUE row 74.

## What the singer sees

A singer drops a printed song in and gets the melody back. Two of the ten songs in the last full test still came back below 95 of 100 notes: Lyadov's «Колыбельная» op. 22 no. 1 (M, 88.7: two decorative cover pages read as music) and Zhitomirsky's «Бѣлая луна» op. 6 no. 2 (P, 77.6: no time signature read on page 2, so 26 note lengths came out wrong). Row 57, shipped today in `4f7421e`, now reads printed time signatures. This brief finds out what that did for P, and puts back the cover fix for M.

## Before you start

- Tree at `4f7421e` on `Shane`. The desk's uncommitted files in `docs/` are not yours; do not touch them.
- Read whole: `docs/sessions/report-code-the-four-below_r1_2026-10-09.md` (row 61). Its method is the method here: the dev server on 5173, the drop box through Playwright and Chrome on WebGPU, a fresh browser context per song, `conv.py`, then `docs/sessions/measure-final-test_r1_2026-10-08/final-line.ts`.
- K, L, M, and P are open songs (Dann opened them 2026-10-09). G, H, I, J, N, and O are SPENT: Dann agreed 2026-10-11 04:17 to spend them once, and row 57 run 4 did. You may run them and print their `final-line.ts` lines. **Do not open, view, or render any of their pages, and do not change code because of what their lines show.**
- Scans: `~/Downloads/_desk-2026-10-08/heldout2-scans/`. Truth: `~/Downloads/_desk-2026-10-08/heldout2-truth-r2/truth/`, with the corrected copies for K, L, and P beside the originals. Letters map through row 55's `labels.txt`, as row 61 used it.

## The work

1. **Measure now.** K, L, M, and P through the drop box at `4f7421e`, scored against both truths. One `final-line.ts` line per song and truth.
2. **The six spent songs, lines only.** G, H, I, J, N, and O through the same path. Lines only.
3. **Restore M's cover rule**, as row 61 wrote it and took it out: a cover is a page with fewer than two staves at least half the page wide (`withoutCovers`, `apps/web/src/lib/omr/homr-reader.ts`, counting by width). It was taken out only because it moved sealed I; I is now spent. Keep it if it raises M and lowers no song in steps 1 and 2 and none of the 17 build songs. Otherwise take it out and say which song fell and by how much.
4. **P only if it is still below 95 after step 1:** read its page 2 metre the way row 57 reads one, and report what the reader stated there and why. Do not build a fix for P in this run.
5. If step 3 keeps a change: all eight gates, at baseline or better, with the counts.

## Done when

- The report holds every `final-line.ts` line from steps 1 to 3, unedited, before and after.
- Step 3 is kept or taken out, with the reason in one sentence.
- No page of G, H, I, J, N, or O was opened.

## Then stop

Do not commit, stage, or push. Dann ships.

## Report

`docs/sessions/report-code-m-and-p-after-the-metre_r1_2026-10-11.md`. Lead with one line per song: before (row 61's line), after. Then step 3's decision, the gates, and a section "Could not establish". NOT ESTABLISHED beats a complete invented answer. Do not edit `docs/memory/`.
