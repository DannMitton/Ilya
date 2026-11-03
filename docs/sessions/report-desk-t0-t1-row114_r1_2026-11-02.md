# Report: T0 noise floor and T1 row 176 landing, row 114 first file (Sonnet helper, brief A, r1, 2026-11-02)

Measure only. Nothing committed or pushed. Second file not opened. Stopped by completion, well under the 220,000 token cap.

## Answer

**T1 (b) = 363 of 590** (merge of `cloud-lane-28` 5ee60a6 with `origin/Shane` 83e8610, local merge 727ec11, built and run once through the app). **The floor is 0**: T0 on `origin/Shane` 83e8610 gave 328 of 590 on both passes, and the two passes' MusicXML and lyrics files are byte-identical for all five songs, so no system differs between passes. Against 363 (the fix2 scratch number): met exactly, and the T1 ledger is byte-identical to `ledger-row114-f1.fix2.tsv` (no syllable gained or lost, no stage changed). Against 531: short by 168. T1 gains 35 over the T0 floor (363 minus 328) and meets the brief's "at least 363 minus the floor" expectation exactly.

Gates: all eight at the step 5 report's counts.

Caveat on the floor: two passes on one machine, same Chromium and wasm homr, give 0 spread. That is the floor of this machine and this instrument, not of homr across machines (the 2026-10-29 report named that as a risk). A different machine could differ; NOT ESTABLISHED.

## Control

- Scorer: `score114.py` (copy at `/root/desk/A/score114.py`, only the three hard-coded paths repointed) run on M0's captures (`m0-captures_2026-11-02.tgz`) reproduces 328 / 390 / 372 / 114 and a ledger byte-identical to `ledger-row114-f1.tsv`. Matched.
- Instrument: T0 pass 1 on 83e8610 reproduced M0's 328 of 590 from tree 9fa20430, per song 37, 126, 26, 78, 61. Matched.
- Expectation stated before: T0 = 328, T1 about 363. Likeliest lie named: homr non-determinism or a different layout between trees. It did not occur here.

## Did the words path change between 9fa20430 and 83e8610

`git diff --stat 9fa20430 83e8610 -- apps/web/src/lib/omr` is empty. Across `apps packages` the diff is 7 files, 549 insertions and 206 deletions: `i18n.ts`, `i18n-index.test.ts`, `names.ts`, `names-table.test.ts`, `retired-names.test.ts`, `no-fit-name.test.ts` (removed), `insights/ratified-lines.test.ts`. No words-path file. The identical 328 agrees.

## T0, two passes (tree 83e8610, captures `/root/desk/A/cap/t0p1`, `cap/t0p2`)

| song | printed | pass 1 (b) | pass 2 (b) | rr | a | c |
|---|---|---|---|---|---|---|
| 1 | 81 | 37 | 37 | 56 | 44 | 9 |
| 2 | 189 | 126 | 126 | 140 | 135 | 38 |
| 3 | 68 | 26 | 26 | 29 | 31 | 14 |
| 4 | 121 | 78 | 78 | 90 | 88 | 35 |
| 5 | 131 | 61 | 61 | 75 | 74 | 18 |
| total | 590 | 328 | 328 | 390 | 372 | 114 |

Spread 0. Ledgers `ledger-t0p1.tsv` and `ledger-t0p2.tsv` are byte-identical.

## T1 merge

`git merge --no-edit origin/Shane` in a worktree at `origin/cloud-lane-28` (5ee60a6): **clean**, no conflicts. What Shane brought is docs only (13 files: memory README and STATE, session briefs and reviews); the lane's own 24 files (omr, ingestion, score) are untouched by it. Merge commit 727ec11, local only.

## Gates on the merge (commands from `ilya-ship.sh` r3 and root `package.json`; logs in `/root/desk/A/gates/`)

| gate | command | step 5 report | measured |
|---|---|---|---|
| 1 phonology | `pnpm test:phonology` | 407 | 407 passed |
| 2 dictionary | `pnpm test:dictionary` | 248 | 248 passed |
| 3 check | `pnpm --filter @ilya/web check` | 0 errors, 12 warnings | 0 errors, 12 warnings in 5 files |
| 4 web | `pnpm --filter @ilya/web test` | 3898 passed, 1 skipped | 3898 passed, 1 skipped (3899), 222 files |
| 5 score-parser | `pnpm --filter @ilya/score-parser test` | 785, 5 skipped | 785 passed, 5 skipped (790) |
| 6 blurb | `pnpm test:blurb` | 148 | 148 passed |
| 7 integration | `pnpm test:integration` | 98 | 98 passed |
| 8 ratchets | `pnpm ratchets` | OK | `ratchets: OK.` (632 source files; message that ceilings can be lowered) |

Verdict: all eight at baseline. Note `ilya-ship.sh` r3 on disk still expects gate 4 at 3843 and says nothing of 3898; it would flag a deviation on gate 4 until updated. Gates ran with an untracked `apps/web/omr-underlay/` and `build/` present in the tree (not tracked, not staged).

## T1 per song (tree 727ec11; captures `cap/t1`, ledger `ledger-row114-f1.t1.tsv`)

| song | printed | T0 (b) | fix2 (b) | T1 (b) | T1 rr | T1 a | T1 c |
|---|---|---|---|---|---|---|---|
| 1 | 81 | 37 | 48 | 48 | 55 | 54 | 11 |
| 2 | 189 | 126 | 136 | 136 | 141 | 143 | 42 |
| 3 | 68 | 26 | 29 | 29 | 32 | 34 | 13 |
| 4 | 121 | 78 | 78 | 78 | 93 | 87 | 30 |
| 5 | 131 | 61 | 72 | 72 | 75 | 84 | 22 |
| total | 590 | 328 | 363 | 363 | 396 | 402 | 118 |

## Console counts (T1; step 5 line, summed from `cap/t1/s*/*.console.txt`, one line per page)

The line prints the total of notes breaking one vowel per note with a parenthesis "(N with no syllable)". It does not print the other kinds separately; "other" below is total minus no-syllable (many-vowels or any other kind): breaches by kind beyond that split are NOT ESTABLISHED. "Free against units" is the sum of the per-system pairs.

| song | breaches | of which no-syllable | other | free notes against syllable units | many-vowels merges refused |
|---|---|---|---|---|---|
| 1 | 44 | 43 | 1 | 110 against 71 | 0 |
| 2 | 47 | 46 | 1 | 198 against 154 | 0 |
| 3 | 145 | 143 | 2 | 189 against 49 | 0 |
| 4 | 14 | 13 | 1 | 124 against 123 | 0 |
| 5 | 31 | 30 | 1 | 123 against 96 | 0 |
| total | 281 | 275 | 6 | 744 against 493 | 0 |

Per system pairs are in the console files. Largest gaps: song 3, fifth page-line (a page with 13 rows in 5 systems, 1 syllable seated, 1 unseated; systems 3 and 5 read 68 and 67 free notes against 1 unit each, 134 of the 135 breaches on that page; the other three systems have no Russian row) and song 2, third page-line, system 1 (18 against 2) and fifth page-line, system 1 (31 against 13). Pages are counted as the order of page-read lines in each console, not printed page numbers. Other counters: 0 folded clitics on every page; "units of two vowels or more uncut" is 1 on 5 page-lines and 0 elsewhere. Page-lines with the dictionary-sewing fallback: song 3 second and fourth, song 4 first and third (one system each). These counts are as printed, not interpreted; whether free-vs-units gaps explain lost syllables is NOT ESTABLISHED.

## Moved against fix2

Gained 0, lost 0, no row changed stage (`cmp` of `ledger-row114-f1.t1.tsv` against `/root/desk/in/stage/ledger-row114-f1.fix2.tsv`: identical). Loss by stage is therefore the fix2 column:

| stage | T0 | fix2 | T1 | change T0 to T1 |
|---|---|---|---|---|
| seating | 69 | 38 | 38 | -31 |
| letters | 47 | 32 | 32 | -15 |
| letters, no token carries it | 51 | 64 | 64 | +13 |
| token splitting | 30 | 28 | 28 | -2 |
| row not cut or read | 57 | 57 | 57 | 0 |
| note not read by homr | 8 | 8 | 8 | 0 |
| lost total | 262 | 227 | 227 | -35 |

Net 35 gained over T0, by song: 1 +11, 2 +10, 3 +3, 4 0, 5 +11. The "no token carries it" rise of 13 is syllables that moved there from seating or letters, not new losses.

## What I could not establish

- Spread across machines or Chromium builds; only same-machine repeat (0).
- Breaches by kind other than no-syllable (the line does not split them).
- Whether the 6 non-no-syllable breaches are many-vowels; which page-5 song-3 cause (68 free against 1 unit) is the cut or the rows; the dictionary-sewing fallback's effect.
- That the many-vowel lyrics on the old captures came from `oneToANote` (the step 5 report's own open point): T1 shows 0 merges refused, and the file lyrics were not inspected for many-vowel syllables here.
- Reader tokens (not exposed by the app).
- Whether `build/` and an untracked model folder in the worktrees affect gates: gates passed with them present, not retested without.

## Files (all under /root/desk/A)

Report this file; `ledger-row114-f1.t1.tsv`; `ledger-t0p1.tsv`, `ledger-t0p2.tsv`; `score114.py`; captures `cap/t0p1/`, `cap/t0p2/`, `cap/t1/` (musicxml, lyrics, console, requests, times per song); gates `gates/`; `run.log`; worktrees `t0` (83e8610, detached) and `t1` (merge 727ec11, local); `ctl/` the control.
