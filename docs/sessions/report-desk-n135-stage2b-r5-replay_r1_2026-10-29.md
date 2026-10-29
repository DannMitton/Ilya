# Report: the page half of N.135 stage 2b r5, replayed on A2's 18 captures (helper, 2026-10-29, r1)

Measure only. Nothing was committed or pushed. Branch `cloud-lane-21`, cloned to `replay/ilya`; one scratch worktree per commit (`wt-596930d` = step 0, `wt-4bbaef0` = step 1, `wt-b2ca711` = step 2, `wt-1eb05e7` = step 4; step 3 `46d70f1` changes the worker half and is not replayed). One scratch edit was made in `wt-1eb05e7` for the probe in section 3 and reverted (`git checkout`; `git status` clean).

## The answer first

1. The control reproduced. Steps 1 and 2 match their targets exactly: 900 / 851 and 1,836 / 1,671.
2. Step 4 misses. The build gives read right 1,870 and (b) 1,707 against 1,880 and 1,710 (difference -10 and -3). Read right misses by more than 5.
3. The cause is measured, not inferred. `cliticCalls` (`apps/web/src/lib/underlay-seams.ts`, `lettersOf`) matches a printed word to the transcription's word by letters, and the transcription's `cleanWord` for a pre-reform «въ» or «съ» is «в» or «с» (the hard sign gone). The match fails, the call is null, and the clitic is not folded. Six rows are affected (K p1, K p4, S p1, T p2, T p3, T p5). With the hard sign stripped from the printed word before the comparison (scratch edit, reverted) the build gives 1,880 / 1,710 / vowelless 79, the targets exactly.
4. Vowelless lyrics alone on a note at step 4: build 82, target about 79 (was 105). The same six rows account for the 3.

## 1. The control

The positive control is A2's as-built cell, reproduced with A2's own scripts before any build was measured.

| control | A2's figure | reproduced |
|---|---|---|
| `cells.mjs` self-check at step 0 (`596930d`, share 0.5, as built): the replay's `seatPage` and language calls against the clone's real ones | 1,032 checks, 0 mismatches | 1,032 checks, 0 mismatches |
| `score_app.py` on the as-built cell `d0.5_s0.5`: read right / (b) / (a) / (c) | 1,514 / 1,451 / 1,591 / 559 | 1,514 / 1,451 / 1,591 / 559 |
| vowelless alone on a note, as built | 86 (review of r4) | 86 |
| `step4.mjs` variant V0 (steps 1 and 2 as a prototype): read right / (b) / (a) / (c) / vowelless | 1,836 / 1,671 / 1,848 / 638 / 105 | 1,836 / 1,671 / 1,848 / 638 / 105 |
| `step4.mjs` variant V4 (the review's step 4 prototype) | 1,880 / 1,710 / 1,870 / 640 / 79 | 1,880 / 1,710 / 1,870 / 640 / 79 |

All five reproduced, so the instrument is sound, and the build figures below are reported.

## 2. The builds

Method. Brief section 8 names `cells.mjs` and `step4.mjs`. Those re-implement the page half with their own loop. To check the build itself, I wrote `scripts/real.mjs`, which calls the build's own functions on each captured page: `seatPage` with the build's seams (`makeSeams`, and `cliticCalls` where the build has it), then `applyUnderlay` (the song gate at step 1, the per-system threshold from step 2), then `joinPages`. The MusicXML goes to A2's `score_app.py`. So the table is the build's code, not a prototype. The prototype (`step4.mjs`) is run beside it at step 4.

| build | read right | (b) | target (read right / (b)) | difference | (a) | (c) | vowelless alone |
|---|---|---|---|---|---|---|---|
| step 1 alone, `4bbaef0` (9 songs written by the gate) | 900 | 851 | 900 / 851 | 0 / 0 | 912 | 342 | 30 |
| steps 1 and 2, `b2ca711` | 1,836 | 1,671 | 1,836 / 1,671 | 0 / 0 | 1,848 | 638 | 105 |
| **step 4, `1eb05e7`** | **1,870** | **1,707** | 1,880 / 1,710 | **-10 / -3** | 1,870 vs 1,868 build | 639 (target 640) | **82** (target about 79) |

(For reference, step 0 `596930d` with the song gate and share 0.5, the unchanged base: 446 / 401, 4 songs written. The A2 gate-off figure 1,514 / 1,451 applies to the gate-off cell, the control above.)

Step 1: the songs written are B01, B02, B03, B08, M, S, T, U1, U4 (9 of 18), as the review said.

The review's (a) for V4 is 1,870; the build's (a) is 1,868.

### B01 and B04, before (`b2ca711`) and after (`1eb05e7`), read right / (b)

| song | before | after | prototype V4 |
|---|---|---|---|
| B01 | 132 / 132 | 134 / 133 | 134 / 133 |
| B04 | 98 / 102 | 100 / 107 | 100 / 106 |

B04 vowelless alone: 12 before, 11 after (prototype 10).

### Per song at step 4 (the build misses its read-right target by more than 5)

| song | printed | steps 1+2 (rr / b) | step 4 build (rr / b) | prototype V4 (rr / b) | build minus prototype | vowelless build / proto |
|---|---|---|---|---|---|---|
| B01 | 147 | 132 / 132 | 134 / 133 | 134 / 133 | 0 / 0 | 3 / 3 |
| B02 | 86 | 68 / 74 | 77 / 80 | 77 / 80 | 0 / 0 | 2 / 2 |
| B03 | 147 | 118 / 124 | 121 / 128 | 121 / 128 | 0 / 0 | 3 / 3 |
| B04 | 148 | 98 / 102 | 100 / 107 | 100 / 106 | 0 / +1 | 11 / 10 |
| B06 | 142 | 77 / 84 | 77 / 86 | 77 / 86 | 0 / 0 | 4 / 4 |
| B07 | 151 | 90 / 87 | 93 / 86 | 93 / 86 | 0 / 0 | 7 / 7 |
| B08 | 141 | 100 / 104 | 101 / 108 | 101 / 108 | 0 / 0 | 5 / 5 |
| B09 | 139 | 101 / 96 | 102 / 98 | 102 / 98 | 0 / 0 | 7 / 7 |
| B10 | 148 | 84 / 85 | 84 / 87 | 84 / 87 | 0 / 0 | 3 / 3 |
| K | 131 | 97 / 0 | 97 / 0 | 101 / 0 | **-4** / 0 | 2 / 2 |
| M | 53 | 50 / 0 | 50 / 0 | 50 / 0 | 0 / 0 | 0 / 0 |
| P | 177 | 91 / 104 | 91 / 104 | 91 / 104 | 0 / 0 | 19 / 19 |
| S | 109 | 92 / 87 | 92 / 87 | 94 / 88 | **-2** / -1 | 1 / 0 |
| T | 200 | 165 / 156 | 165 / 156 | 169 / 159 | **-4** / -3 | 3 / 2 |
| U1 | 97 | 89 / 90 | 90 / 90 | 90 / 90 | 0 / 0 | 1 / 1 |
| U4 | 112 | 86 / 84 | 88 / 86 | 88 / 86 | 0 / 0 | 3 / 3 |
| U5 | 258 | 185 / 169 | 189 / 171 | 189 / 171 | 0 / 0 | 6 / 6 |
| U6 | 152 | 113 / 93 | 119 / 100 | 119 / 100 | 0 / 0 | 2 / 2 |
| total | 2,538 | 1,836 / 1,671 | 1,870 / 1,707 | 1,880 / 1,710 | -10 / -3 | 82 / 79 |

(The B04 (b) of 107 in the build against 106 in the prototype is the one place the build is ahead.)

## 3. Why step 4 falls short (measured)

`diag.mjs` compares, for every vowelless word in a seated row, the build's `cliticCalls` with the review prototype's call (`processText` on the sewn words, one to one). On K, S, and T the only differences are six rows, each one pre-reform particle:

| song, page | word | prototype | build |
|---|---|---|---|
| K p1 | въ | proclitic | null |
| K p4 | съ | proclitic | null |
| S p1 | Въ | proclitic | null |
| T p2 | съ | proclitic | null |
| T p3 | въ | proclitic | null |
| T p5 | въ | proclitic | null |

`processText('день въ саду съ любовью', { language: 'en' })` returns `cleanWord` «в» and «с», both `isProclitic: true`. `cliticCalls` compares `lettersOf(printed word)` («въ») with `lettersOf(cleanWord)` («в»), finds nothing, and returns null (`underlay-seams.ts`, the `heard.findIndex(...)` line). The print keeps the hard sign; the transcription drops it.

Probe: in `wt-1eb05e7` I changed `lettersOf` to also strip a final «ъ» (`.replace(/ъ$/u, '')`), re-ran `real.mjs` on all 18 songs, and scored: 1,880 / 1,710 / (a) 1,870 / (c) 640 / vowelless 79, equal to the target on every figure. The edit was reverted. This is a measured fix for the desk to rule on; I did not change the tree.

## 4. Commands run

All paths under `/tmp/claude-0/-home-claude/89f71d22-12cc-5a77-97a6-d4d4821e7d40/scratchpad/replay/` (call it `$RP`).

```
git clone --branch cloud-lane-21 https://github.com/DannMitton/Ilya.git ilya
git worktree add -f wt-<sha> <sha>          # 596930d 4bbaef0 b2ca711 46d70f1 1eb05e7
tar xzf desk-n135-a2_2026-10-28.tgz -C a2   # also rev1 (review-opus-scripts), rev2 (review-opus2-scripts), each in its own directory
# repointed /home/claude/a2/lane19, /home/claude/ilya, /home/claude/a2 in the scorer and tools copies (sed) to $RP/wt-596930d and $RP/a2/a2
# scripts/cells.mjs and scripts/step4.mjs: R = process.env.WT, dictionary from <WT>/data/ (the build/data copy is the same files)
WT=$RP/wt-596930d node --import ./ts-register.mjs cells.mjs ../a2/a2/app ../out-ctl/cells B01 B02 ... U6     # control: 1032 checks 0 mismatches
OUTD=$RP/out-ctl/cells/d0.5_s0.5 SCD=$RP/sc/ctl python3 -I ../score_app.py          # from a2/a2/scorer/lever2-f6; 1,514 / 1,451
WT=$RP/wt-<sha> node --import ./reg-ilya.mjs real.mjs ../a2/a2/app ../out-real/<sha> B01 ... U6   # sha in 596930d 4bbaef0 b2ca711 1eb05e7
OUTD=$RP/out-real/<sha> SCD=$RP/sc/<sha> python3 -I ../score_app.py
WT=$RP/wt-1eb05e7 node --import ./reg-ilya.mjs step4.mjs ../a2/a2/app ../out-step4   # V0 and V4 scored the same way
python3 -I scripts/total.py sc/<dir>                                                  # sums per song
WT=$RP/wt-1eb05e7 node --import ./reg-ilya.mjs diag.mjs ../a2/a2/app K S T          # the six rows
```

Departures from the brief's named scripts: `reg.mjs` and `ts-register.mjs` could not resolve `@ilya/phonology` in the clone (no `node_modules`; `pnpm install --offline` failed on a missing tarball), so I added `scripts/res-ilya.mjs` and `reg-ilya.mjs`, which map `@ilya/<pkg>` to `packages/<pkg>/src/index.ts`. `real.mjs`, `diag.mjs`, `d2.mjs`, `total.py` are mine. The BlurbComposer "Missing identity" lines printed by `processText` on single letters are console noise and do not enter the figures.

## 5. NOT ESTABLISHED

- Step 3 (`46d70f1`, the piano's upper staff found in the ink) is a worker-half change and is not replayed here. The captures hold reads and layouts, not page pixels, except for B01 and B04 in A1's capture, which I did not use. NOT ESTABLISHED.
- Whether the browser run (`measure.mjs`) will give the same figures as this replay: the replay takes the captured rows and reads as given and runs only the page half. The A2 control shows the page half agrees with the real page for the as-built code; I did not run a browser.
- Whether the A2 captures' `data.json` layouts would be identical if the worker half (steps 3 and 0) were re-run. They are the layouts of the as-built worker.
- The fix in section 3 stripping a final «ъ» is the only variant I probed. Other spellings whose `cleanWord` differs from the print (ё, і, ѣ, a trailing «ь» in other words) were not probed; in the six rows affected in K, S, and T, all are «ъ». The diagnostic covered only K, S, and T, the three songs where the build and the prototype differ; the other 15 songs show identical per-song figures, so no further rows differ in outcome.
- The scorer's own two read-right routes (MusicXML and stream) differ, as A2 noted; I used the MusicXML route throughout, as A2's tables and the review did.
- Time per page and the 19 unread systems of A2 against the build's `unread` lists: not measured here (browser run).

## 6. Files

- `$RP/report-desk-n135-stage2b-r5-replay_r1_2026-10-29.md` (this)
- `$RP/scripts/` (real.mjs, diag.mjs, d2.mjs, total.py, cells.mjs, step4.mjs, the resolvers)
- `$RP/sc/<sha>/`, `$RP/sc/ctl`, `$RP/sc/step4-V0`, `$RP/sc/step4-V4`, `$RP/sc/probe` (scorer outputs and logs)
- `$RP/out-real/<sha>/<L>/<L>.musicxml` and `summary.json`, `$RP/out-ctl`, `$RP/out-step4`, `$RP/out-probe`
